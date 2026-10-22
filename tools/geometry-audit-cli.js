#!/usr/bin/env node
'use strict';

/* Headless geometry audit runner. Requires: npm install; npx playwright install chromium.
   Run from the project root:
   node tools/geometry-audit-cli.js --input ./very_long_test_text.txt
*/
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

function parseArgs(argv) {
    const o = { input: null, settings: null, report: './artifacts/geometry-audit.json',
        summary: './artifacts/geometry-audit-summary.md', fullModel: false, failOn: 'high',
        timeoutMs: 180000, viewportWidth: 1440, viewportHeight: 1000, help: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        const take = () => { if (i + 1 >= argv.length) throw new Error('Missing value for ' + arg); return argv[++i]; };
        switch (arg) {
            case '--input': case '-i': o.input = take(); break;
            case '--settings': o.settings = take(); break;
            case '--report': o.report = take(); break;
            case '--summary': o.summary = take(); break;
            case '--full-model': o.fullModel = true; break;
            case '--fail-on': o.failOn = take(); break;
            case '--timeout-ms': o.timeoutMs = Number(take()); break;
            case '--viewport-width': o.viewportWidth = Number(take()); break;
            case '--viewport-height': o.viewportHeight = Number(take()); break;
            case '--help': case '-h': o.help = true; break;
            default: throw new Error('Unknown argument: ' + arg);
        }
    }
    if (!['high', 'medium', 'low', 'none'].includes(o.failOn)) throw new Error('--fail-on must be high, medium, low, or none');
    return o;
}
function help() {
    process.stdout.write('Geometry audit CLI\nRequired: --input <text-file>\n' +
      'Options: --settings <json-file>, --report <json-file>, --summary <md-file>, --full-model,\n' +
      '--fail-on <high|medium|low|none>, --timeout-ms <number>, --viewport-width <number>, --viewport-height <number>\n');
}
function abs(p) { return path.resolve(process.cwd(), p); }
function ensureParent(p) { fs.mkdirSync(path.dirname(p), { recursive: true }); }
function mime(p) {
    const ext = path.extname(p).toLowerCase();
    return ({ '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
      '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
      '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
      '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf', '.otf':'font/otf' })[ext] || 'application/octet-stream';
}
function staticServer(rootDir) {
    const root = path.resolve(rootDir);
    return http.createServer((req, res) => {
        let pathname;
        try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
        catch { res.writeHead(400).end('Bad request'); return; }
        if (pathname === '/') pathname = '/renderer.html';
        const target = path.resolve(root, '.' + pathname);
        if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
        fs.stat(target, (err, st) => {
            if (err || !st.isFile()) { res.writeHead(404).end('Not found'); return; }
            res.writeHead(200, { 'Content-Type': mime(target), 'Content-Length': st.size, 'Cache-Control':'no-store' });
            fs.createReadStream(target).pipe(res);
        });
    });
}
function rank(s) { return ({ high:3, medium:2, low:1 })[s] || 0; }
function markdown(r) {
    const s = r.audit.summary || {};
    const lines = ['# Geometry audit report', '', '- Input: ' + r.run.input,
      '- Generated: ' + r.run.generatedAt, '- Render duration: ' + r.run.renderMs + ' ms',
      '- Geometry extraction: ' + (r.geometry.stats.extractMs ?? 'n/a') + ' ms',
      '- Pages: ' + r.pageCount, '- Issues: ' + (s.total ?? r.audit.issues.length),
      '- High: ' + (s.high || 0) + ' | Medium: ' + (s.medium || 0) + ' | Low: ' + (s.low || 0),
      '', '## Issue counts by kind', '', '| Kind | Count |', '|---|---:|'];
    const kinds = Object.entries(s.byKind || {}).sort((a,b) => b[1]-a[1]);
    if (!kinds.length) lines.push('| None | 0 |');
    for (const [k,v] of kinds) lines.push('| ' + String(k).replace(/\\|/g,'\\\\|') + ' | ' + v + ' |');
    lines.push('', '## Issues', '');
    if (!r.audit.issues.length) lines.push('No issues reported by the current geometry audit.');
    else for (const i of r.audit.issues) lines.push('- **' + String(i.severity || 'unknown').toUpperCase() +
      '** — ' + (i.kind || 'unknown kind') + ' — page ' + (i.pageIdx ?? 'unknown') + ' — ' + (i.message || i.description || JSON.stringify(i)));
    lines.push('');
    return lines.join('\n');
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) return help();
    if (!args.input) throw new Error('Missing required --input. Use --help for usage.');
    if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1000) throw new Error('--timeout-ms must be at least 1000');
    const root = process.cwd(), inputPath = abs(args.input);
    if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) throw new Error('Input file not found: ' + inputPath);
    const inputText = fs.readFileSync(inputPath, 'utf8');
    if (!inputText.trim()) throw new Error('Input file is empty: ' + inputPath);
    let settings = {};
    if (args.settings) {
        settings = JSON.parse(fs.readFileSync(abs(args.settings), 'utf8'));
        if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Settings JSON must be an object.');
    }
    let chromium;
    try { chromium = require('playwright').chromium; }
    catch { throw new Error('Playwright is not installed. Run npm install, then npx playwright install chromium.'); }

    const server = staticServer(root);
    await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
    const baseUrl = 'http://127.0.0.1:' + server.address().port;
    let browser;
    const pageErrors = [], consoleErrors = [], started = Date.now();
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ viewport: { width: args.viewportWidth, height: args.viewportHeight }, deviceScaleFactor: 1 });
        page.on('pageerror', e => pageErrors.push(String(e && (e.stack || e))));
        page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
        page.on('requestfailed', req => consoleErrors.push('Request failed: ' + req.url() + ' (' + (req.failure()?.errorText || 'unknown') + ')'));
        await page.goto(baseUrl + '/renderer.html', { waitUntil: 'load', timeout: args.timeoutMs });
        await page.waitForFunction(() => typeof window.typesetDocument === 'function' && window.__geomAudit && typeof window.__geomAudit.audit === 'function', null, { timeout: 30000 });

        // Wait for initial CSS/web fonts before pagination decisions are made.
        // Waiting only after typesetting can leave page breaks measured with fallback fonts.
        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
        });

        const renderResult = await page.evaluate(({ text, settings, timeoutMs }) => new Promise((resolve,reject) => {
            let settled = false;
            const cleanup = () => { window.removeEventListener('message', onMessage); clearTimeout(timer); };
            const finish = (fn,val) => { if (settled) return; settled = true; cleanup(); fn(val); };
            const onMessage = event => {
                const msg = event.data;
                if (!msg || typeof msg !== 'object') return;
                if (msg.type === 'render-error') finish(reject,new Error(msg.error || 'Renderer error'));
                if (msg.type === 'render-done') finish(resolve,{ pageCountAtDone: msg.pageCount });
            };
            const timer = setTimeout(() => finish(reject,new Error('Renderer timeout after ' + timeoutMs + ' ms')),timeoutMs);
            window.addEventListener('message',onMessage);
            window.postMessage({ type:'typeset', text, settings },'*');
        }), { text: inputText, settings, timeoutMs: args.timeoutMs });

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        const data = await page.evaluate(() => {
            if (!window.__geomAudit) throw new Error('Geometry audit API unavailable');
            const model = window.__geomAudit.extract();
            const audit = window.__geomAudit.audit(model);
            const clean = { pages:model.pages.map(p => window.__geomAudit.cleanForExport(p)), stats:model.stats };
            const fnAudit = typeof window.auditFnMeasurement === 'function' ? window.auditFnMeasurement() : null;
            return {
                pageCount: document.querySelectorAll('#book-container .a4-page').length,
                summary:audit.summary, issues:audit.issues, stats:model.stats, model:clean,
                footnoteMeasurementAudit:fnAudit, fontsStatus:document.fonts ? document.fonts.status : 'unknown',
                bodyScrollHeight:document.body.scrollHeight,
                bookContainerScrollHeight:document.getElementById('book-container')?.scrollHeight ?? null
            };
        });

        const reportPath = abs(args.report), summaryPath = abs(args.summary);
        const report = {
            schemaVersion:1,
            run:{ input:path.relative(root,inputPath).split(path.sep).join('/'), inputBytes:Buffer.byteLength(inputText,'utf8'),
              generatedAt:new Date().toISOString(), branch:process.env.GITHUB_REF_NAME || null,
              gitCommit:process.env.GITHUB_SHA || null, viewport:{width:args.viewportWidth,height:args.viewportHeight,deviceScaleFactor:1},
              renderMs:Date.now()-started, renderResult, settings, failOn:args.failOn, browser:'Chromium headless' },
            pageCount:data.pageCount,
            geometry:{stats:data.stats,fontsStatus:data.fontsStatus,bodyScrollHeight:data.bodyScrollHeight,bookContainerScrollHeight:data.bookContainerScrollHeight},
            audit:{summary:data.summary,issues:data.issues},
            footnoteMeasurementAudit:data.footnoteMeasurementAudit,
            runtime:{pageErrors,consoleErrors}
        };
        if (args.fullModel) report.geometry.model = data.model;
        ensureParent(reportPath); fs.writeFileSync(reportPath,JSON.stringify(report,null,2),'utf8');
        ensureParent(summaryPath); fs.writeFileSync(summaryPath,markdown(report),'utf8');
        process.stdout.write('Geometry audit complete\nPages: ' + report.pageCount + '\nIssues: ' +
          (report.audit.summary?.total ?? report.audit.issues.length) + ' (high ' + (report.audit.summary?.high || 0) +
          ', medium ' + (report.audit.summary?.medium || 0) + ', low ' + (report.audit.summary?.low || 0) + ')\nJSON: ' +
          path.relative(root,reportPath) + '\nSummary: ' + path.relative(root,summaryPath) + '\n');
        const threshold = rank(args.failOn);
        const fail = threshold > 0 && report.audit.issues.some(i => rank(i.severity) >= threshold);
        if (pageErrors.length) { process.stderr.write('Browser JavaScript errors: ' + pageErrors.length + '\n'); process.exitCode = 2; }
        else if (fail) process.exitCode = 1;
    } finally {
        if (browser) await browser.close().catch(() => {});
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(err => { process.stderr.write('geometry-audit-cli: ' + (err.stack || err) + '\n'); process.exitCode = 2; });
