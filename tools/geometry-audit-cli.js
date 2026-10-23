#!/usr/bin/env node
'use strict';

/* Headless geometry audit runner. Requires: npm install; npx playwright install chromium.
   Run from the project root:
   node tools/geometry-audit-cli.js --input ./very_long_test_text.txt
*/
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');

function parseArgs(argv) {
    const o = { input: null, settings: null, report: './artifacts/geometry-audit.json',
        summary: './artifacts/geometry-audit-summary.md', fullModel: false, failOn: 'high',
        timeoutMs: 180000, viewportWidth: 1440, viewportHeight: 1000, repeatCheck: false, help: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        const take = () => { if (i + 1 >= argv.length) throw new Error('Missing value for ' + arg); return argv[++i]; };
        switch (arg) {
            case '--input': case '-i': o.input = take(); break;
            case '--settings': o.settings = take(); break;
            case '--report': o.report = take(); break;
            case '--summary': o.summary = take(); break;
            case '--full-model': o.fullModel = true; break;
            case '--repeat-check': o.repeatCheck = true; break;
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
      'Options: --settings <json-file>, --report <json-file>, --summary <md-file>, --full-model, --repeat-check,\n' +
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
      '- Settings: ' + (r.run.settingsSource || 'unknown'),
      '- Generated: ' + r.run.generatedAt, '- Render duration: ' + r.run.renderMs + ' ms',
      '- Repeat-render determinism: ' + (r.run.determinismCheck ? (r.run.determinismCheck.identical ? 'PASS' : 'FAIL') : 'not run'),
      '- Geometry extraction: ' + (r.geometry.stats.extractMs ?? 'n/a') + ' ms',
      '- Pages: ' + r.pageCount, '- Issues: ' + (s.total ?? r.audit.issues.length),
      '- High: ' + (s.high || 0) + ' | Medium: ' + (s.medium || 0) + ' | Low: ' + (s.low || 0),
      '', '## Issue counts by kind', '', '| Kind | Count |', '|---|---:|'];
    const kinds = Object.entries(s.byKind || {}).sort((a,b) => b[1]-a[1]);
    if (!kinds.length) lines.push('| None | 0 |');
    for (const [k,v] of kinds) lines.push('| ' + String(k).replaceAll('|', '¦') + ' | ' + v + ' |');
    const fnRows = Array.isArray(r.footnoteMeasurementAudit) ? r.footnoteMeasurementAudit : [];
    const fnMatched = fnRows.filter(x => x.matchFound && Number.isFinite(x.diff));
    const fnUnmatched = fnRows.filter(x => !x.matchFound);
    const fnLargeDiffs = fnMatched.filter(x => Math.abs(x.diff) > 5);
    const fnMaxAbsDiff = fnMatched.length ? Math.max(...fnMatched.map(x => Math.abs(x.diff))) : null;
    lines.push('', '## Footnote measurement consistency', '',
      '- Pages with footnote areas: ' + fnRows.length,
      '- Exact queue matches: ' + fnRows.filter(x => x.matchFound).length + '/' + fnRows.length,
      '- Matched samples with |actual − measured| > 5px: ' + fnLargeDiffs.length,
      '- Maximum absolute difference: ' + (fnMaxAbsDiff === null ? 'n/a' : fnMaxAbsDiff + 'px'));
    if (fnUnmatched.length) lines.push('- **Unmatched measurements: ' + fnUnmatched.length + '**');
    if (fnLargeDiffs.length) {
      lines.push('', '| Page | Measured (px) | Actual (px) | Δ (px) | Probe width (px) | Measured area width (px) |',
        '|---:|---:|---:|---:|---:|---:|');
      for (const x of [...fnLargeDiffs].sort((a,b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0,10)) {
        lines.push('| ' + (x.pageLabel || x.pageIdx) + ' | ' + x.measured + ' | ' + x.realH + ' | ' + x.diff +
          ' | ' + (x.measuredProbeWidth ?? 'n/a') + ' | ' + (x.measuredAreaWidth ?? 'n/a') + ' |');
      }
    }
    lines.push('', '## Issues', '');
    if (!r.audit.issues.length) lines.push('No issues reported by the current geometry audit.');
    else for (const i of r.audit.issues) lines.push('- **' + String(i.severity || 'unknown').toUpperCase() +
      '** — ' + (i.kind || 'unknown kind') + ' — page ' + (i.pageIdx ?? 'unknown') + ' — ' + (i.message || i.description || JSON.stringify(i)));
    lines.push('');
    return lines.join('\n');
}

async function triggerTypeset(page, text, settings, timeoutMs) {
    return page.evaluate(({ text, settings, timeoutMs }) => new Promise((resolve, reject) => {
        let settled = false;
        const cleanup = () => { window.removeEventListener('message', onMessage); clearTimeout(timer); };
        const finish = (fn, val) => { if (settled) return; settled = true; cleanup(); fn(val); };
        const onMessage = event => {
            const msg = event.data;
            if (!msg || typeof msg !== 'object') return;
            if (msg.type === 'render-error') finish(reject, new Error(msg.error || 'Renderer error'));
            if (msg.type === 'render-done') finish(resolve, { pageCountAtDone: msg.pageCount });
        };
        const timer = setTimeout(() => finish(reject, new Error('Renderer timeout after ' + timeoutMs + ' ms')), timeoutMs);
        window.addEventListener('message', onMessage);
        window.postMessage({ type: 'typeset', text, settings }, '*');
    }), { text, settings, timeoutMs });
}

async function captureLayoutSignature(page) {
    return page.evaluate(() => {
        const round = n => Math.round(n * 1000) / 1000;
        const rect = el => {
            const r = el.getBoundingClientRect();
            return [round(r.x), round(r.y), round(r.width), round(r.height)];
        };
        const paragraph = p => ({
            cls: String(p.className || ''),
            tokenId: p.getAttribute('data-token-id') || '',
            continuation: p.getAttribute('data-is-cont') || '',
            rawText: p.getAttribute('data-raw-text') || p.textContent || '',
            rect: rect(p)
        });
        const column = el => ({
            cls: String(el.className || ''),
            rect: rect(el),
            paragraphs: Array.from(el.children).filter(x => x.tagName === 'P').map(paragraph)
        });
        return Array.from(document.querySelectorAll('#book-container .a4-page')).map((pg, idx) => {
            const flow = pg.querySelector('.page-body-flow');
            const blocks = flow ? Array.from(flow.children).map(el => ({
                cls: String(el.className || ''),
                rect: rect(el),
                text: /title-level|sec-divider|h2-|h3-/.test(String(el.className || '')) ? (el.textContent || '') : '',
                columns: Array.from(el.querySelectorAll('.right-col, .left-col, .single-wide-col')).map(column),
                sideNotes: Array.from(el.querySelectorAll('.side-note-anchor')).map(n => ({
                    tokenId: n.getAttribute('data-for-token') || '',
                    text: n.textContent || '',
                    rect: rect(n)
                }))
            })) : [];
            const fn = pg.querySelector('.footnote-area');
            return {
                index: idx,
                label: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(idx + 1),
                rect: rect(pg),
                flowRect: flow ? rect(flow) : null,
                blocks,
                footnotes: fn ? {
                    rect: rect(fn),
                    notes: Array.from(fn.querySelectorAll('.note-line')).map(n => ({
                        id: n.id || '', text: n.textContent || '', rect: rect(n)
                    }))
                } : null
            };
        });
    });
}

function sha256(value) {
    return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
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
    let settingsSource = 'empty';
    if (args.settings) {
        settings = JSON.parse(fs.readFileSync(abs(args.settings), 'utf8'));
        if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Settings JSON must be an object.');
        settingsSource = path.relative(root, abs(args.settings)).split(path.sep).join('/');
    } else {
        // The real app applies default_settings.json before typesetting. Use the same defaults
        // in headless audits; otherwise renderer-bridge's hidden inputs leave checkbox .checked
        // false (even when the stored default value is true), silently disabling quality rules.
        const defaultSettingsPath = abs('./default_settings.json');
        if (fs.existsSync(defaultSettingsPath) && fs.statSync(defaultSettingsPath).isFile()) {
            settings = JSON.parse(fs.readFileSync(defaultSettingsPath, 'utf8'));
            if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Default settings JSON must be an object.');
            settingsSource = 'default_settings.json (automatic default)';
        } else {
            settingsSource = 'empty (default_settings.json not found)';
        }
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

        // renderer.html sets __isRenderer=true, so app.js intentionally skips its normal
        // window.onload initialization. That also skips loadDefaultSettings(); call it
        // explicitly here instead of waiting for a promise that can never be fulfilled.
        await page.evaluate(async () => {
            if (typeof window.loadDefaultSettings !== 'function' || typeof window.getDefaultSettings !== 'function') {
                throw new Error('Settings manager API unavailable in renderer');
            }
            await window.loadDefaultSettings();
            if (window.getDefaultSettings() === null) {
                throw new Error('default_settings.json did not load; refusing to typeset with implicit fallback settings');
            }
        });

        // Wait for initial CSS/web fonts before pagination decisions are made.
        // Waiting only after typesetting can leave page breaks measured with fallback fonts.
        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
        });

        const renderResult = await triggerTypeset(page, inputText, settings, args.timeoutMs);
        let determinismCheck = null;
        if (args.repeatCheck) {
            const firstSignature = await captureLayoutSignature(page);
            const firstPageHashes = firstSignature.map(sha256);
            const secondRenderResult = await triggerTypeset(page, inputText, settings, args.timeoutMs);
            const secondSignature = await captureLayoutSignature(page);
            const secondPageHashes = secondSignature.map(sha256);
            const common = Math.min(firstPageHashes.length, secondPageHashes.length);
            let firstDifferingPage = null;
            for (let i = 0; i < common; i++) {
                if (firstPageHashes[i] !== secondPageHashes[i]) { firstDifferingPage = i; break; }
            }
            if (firstDifferingPage === null && firstPageHashes.length !== secondPageHashes.length) firstDifferingPage = common;
            determinismCheck = {
                identical: firstPageHashes.length === secondPageHashes.length && firstPageHashes.every((h, i) => h === secondPageHashes[i]),
                firstPageCount: firstPageHashes.length,
                secondPageCount: secondPageHashes.length,
                firstHash: sha256(firstPageHashes),
                secondHash: sha256(secondPageHashes),
                firstDifferingPage,
                secondRenderResult
            };
        }

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        const data = await page.evaluate(({ includeFullModel }) => {
            if (!window.__geomAudit) throw new Error('Geometry audit API unavailable');
            const model = window.__geomAudit.extract();
            const audit = window.__geomAudit.audit(model);
            // The full per-page export can be large. Build it only when explicitly requested;
            // the default report needs summary/issues/stats, not a duplicate serialized DOM model.
            const clean = includeFullModel
                ? { pages:model.pages.map(p => window.__geomAudit.cleanForExport(p)), stats:model.stats }
                : null;
            const fnAudit = typeof window.auditFnMeasurement === 'function' ? window.auditFnMeasurement() : null;
            return {
                pageCount: document.querySelectorAll('#book-container .a4-page').length,
                summary:audit.summary, issues:audit.issues, stats:model.stats, model:clean,
                footnoteMeasurementAudit:fnAudit, fontsStatus:document.fonts ? document.fonts.status : 'unknown',
                fontPreflight:window.__fontPreflight || null,
                // Read these directly from the live DOM. The default report intentionally
                // omits the full extracted page tree, so synthetic-node fields alone would
                // otherwise be lost from geometry-audit.json.
                footnoteReflowDiagnostics: Array.from(document.querySelectorAll('#book-container .a4-page')).map((pg, pageIdx) => {
                    const flow = pg.querySelector('.page-body-flow');
                    const flowRect = flow?.getBoundingClientRect();
                    const last = flow?.lastElementChild;
                    const lastRect = last?.getBoundingClientRect();
                    const note = pg.querySelector('.footnote-area');
                    const noteRect = note?.getBoundingClientRect();
                    const attr = name => pg.getAttribute(name);
                    const num = name => {
                        const v = attr(name);
                        return v == null || v === '' ? null : Number(v);
                    };
                    return {
                        pageIdx,
                        pageLabel: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1),
                        queueCount: num('data-fn-reflow-queue-count'),
                        redoCheckReason: pg.getAttribute('data-layout-redo-reason'),
                        redoCheckAttempts: num('data-layout-redo-attempts'),
                        redoCheckReserve: num('data-layout-redo-reserve'),
                        redoCheckRemainingHeight: num('data-layout-redo-rem-height'),
                        redoCheckFreeAfterReserve: num('data-layout-redo-free-after-reserve'),
                        redoCheckFlowHeight: num('data-layout-redo-flow-height'),
                        redoCheckLastChildHeight: num('data-layout-redo-last-child-height'),
                        redoCheckLastChildOverflow: num('data-layout-redo-last-child-overflow'),
                        predictedHeight: num('data-fn-reflow-predicted-height'),
                        beforeFlowHeight: num('data-fn-reflow-before-flow-height'),
                        afterFlowHeight: num('data-fn-reflow-after-flow-height'),
                        flowHeightDelta: num('data-fn-reflow-flow-height-delta'),
                        beforeLastBlockHeight: num('data-fn-reflow-before-last-block-height'),
                        afterLastBlockHeight: num('data-fn-reflow-after-last-block-height'),
                        afterLastBlockOverflow: num('data-fn-reflow-after-last-block-overflow'),
                        lastBlockTopOffset: num('data-fn-reflow-last-block-top-offset'),
                        finalFlowHeight: flowRect ? Math.round(flowRect.height * 100) / 100 : null,
                        finalLastBlockHeight: lastRect ? Math.round(lastRect.height * 100) / 100 : null,
                        finalLastBlockOverflow: lastRect && flowRect ? Math.round((lastRect.bottom - flowRect.bottom) * 100) / 100 : null,
                        finalLastBlockTopOffset: lastRect && flowRect ? Math.round((lastRect.top - flowRect.top) * 100) / 100 : null,
                        finalFootnoteAreaHeight: noteRect ? Math.round(noteRect.height * 100) / 100 : null
                    };
                }),
                layoutDiagnostics: Array.from(document.querySelectorAll('#book-container .a4-page')).flatMap((pg, pageIdx) => {
                    const flow = pg.querySelector('.page-body-flow');
                    if (!flow) return [];
                    const fr = flow.getBoundingClientRect();
                    return Array.from(flow.children).filter(el => el.classList.contains('block-2col')).flatMap(el => {
                        const r = el.getBoundingClientRect();
                        const overflow = r.bottom - fr.bottom;
                        const rightCol = el.querySelector('.right-col');
                        const leftCol = el.querySelector('.left-col');
                        const rightRect = rightCol?.getBoundingClientRect();
                        const leftRect = leftCol?.getBoundingClientRect();
                        const rightHeight = rightRect?.height ?? null;
                        const leftHeight = leftRect?.height ?? null;
                        const columnDiff = (rightHeight !== null && leftHeight !== null)
                            ? Math.abs(rightHeight - leftHeight) : null;
                        // Capture measurable column imbalance even when the block fits inside body-flow.
                        // A >5px residual gap can reveal a global-justify rollback that the issue
                        // summary alone cannot explain; keep overflow-only diagnostics as before.
                        if (overflow <= 15 && !(columnDiff > 5)) return [];
                        const cs = getComputedStyle(el);
                        return [{
                            pageIdx,
                            pageLabel: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1),
                            flow: { top: fr.top, bottom: fr.bottom, rectHeight: fr.height, clientHeight: flow.clientHeight },
                            block: { top: r.top, bottom: r.bottom, height: r.height, topOffset: r.top - fr.top, overflow },
                            columnBalance: { rightHeight, leftHeight, absoluteDiff: columnDiff },
                            attrs: Object.fromEntries([
                                'data-layout-fill-remaining','data-layout-fill-flow-height','data-layout-fill-top-offset',
                                'data-layout-balance-called','data-layout-balance-status','data-layout-balance-skip-reason',
                                'data-layout-balance-input-height','data-layout-balance-available','data-layout-balance-candidates','data-layout-balance-items',
                                'data-layout-balance-fits','data-layout-balance-valid','data-layout-balance-over',
                                'data-layout-balance-right','data-layout-balance-left','data-layout-balance-diff',
                                'data-layout-balance-right-part-lines','data-layout-balance-left-part-lines',
                                'data-layout-postfit-triggered','data-layout-postfit-outer-overflow','data-layout-postfit-inner-overflow',
                                'data-layout-balance-final-justify-rolled-back','data-layout-global-justify-rolled-back',
                                'data-layout-global-justify-rollback-reason',
                                'data-layout-global-justify-before-right','data-layout-global-justify-before-left',
                                'data-layout-global-justify-before-outer','data-layout-global-justify-after-right',
                                'data-layout-global-justify-after-left','data-layout-global-justify-after-outer',
                                'data-layout-global-justify-after-inner','data-layout-page-final-justify-rolled-back'
                            ].map(k => [k, el.getAttribute(k)])),
                            style: { display: cs.display, height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom },
                            columns: ['.right-col','.left-col'].map(sel => {
                                const col = el.querySelector(sel);
                                if (!col) return null;
                                const cc = getComputedStyle(col), cr = col.getBoundingClientRect();
                                return {
                                    side: sel, scrollHeight: col.scrollHeight, offsetHeight: col.offsetHeight,
                                    rectHeight: cr.height, top: cr.top, bottom: cr.bottom,
                                    lineHeight: cc.lineHeight, fontSize: cc.fontSize,
                                    paragraphs: Array.from(col.children).filter(p => p.tagName === 'P').map(p => {
                                        const pc = getComputedStyle(p), pr = p.getBoundingClientRect();
                                        return { cls: p.className, tokenId: p.getAttribute('data-token-id'), continuation: p.getAttribute('data-is-cont'),
                                            text: (p.getAttribute('data-raw-text') || p.textContent || '').slice(0,100),
                                            rectHeight: pr.height, offsetHeight: p.offsetHeight, scrollHeight: p.scrollHeight,
                                            lineHeight: pc.lineHeight, fontSize: pc.fontSize, marginTop: pc.marginTop, marginBottom: pc.marginBottom,
                                            paddingBottom: pc.paddingBottom, baseLineHeight: p.getAttribute('data-base-lh') };
                                    })
                                };
                            })
                        }];
                    });
                }),
                bodyScrollHeight:document.body.scrollHeight,
                bookContainerScrollHeight:document.getElementById('book-container')?.scrollHeight ?? null
            };
        }, { includeFullModel: args.fullModel });

        const reportPath = abs(args.report), summaryPath = abs(args.summary);
        const report = {
            schemaVersion:1,
            run:{ input:path.relative(root,inputPath).split(path.sep).join('/'), inputBytes:Buffer.byteLength(inputText,'utf8'),
              generatedAt:new Date().toISOString(), branch:process.env.GITHUB_REF_NAME || null,
              gitCommit:process.env.GITHUB_SHA || null, viewport:{width:args.viewportWidth,height:args.viewportHeight,deviceScaleFactor:1},
              renderMs:Date.now()-started, renderResult, determinismCheck, settings, settingsSource, failOn:args.failOn, browser:'Chromium headless' },
            pageCount:data.pageCount,
            geometry:{stats:data.stats,fontsStatus:data.fontsStatus,fontPreflight:data.fontPreflight,footnoteReflowDiagnostics:data.footnoteReflowDiagnostics,layoutDiagnostics:data.layoutDiagnostics,bodyScrollHeight:data.bodyScrollHeight,bookContainerScrollHeight:data.bookContainerScrollHeight},
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
        const byKind = report.audit.summary?.byKind || {};
        process.stdout.write('Issue kinds: ' + Object.entries(byKind)
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([kind, count]) => kind + '=' + count).join(', ') + '\n');
        const highIssues = report.audit.issues.filter(i => i.severity === 'high');
        if (highIssues.length) {
            process.stdout.write('High-severity issue samples (up to 20):\n');
            for (const issue of highIssues.slice(0, 20)) {
                const page = issue.pageIdx == null ? 'unknown' : String(issue.pageIdx + 1);
                const detail = issue.message || issue.description || '';
                process.stdout.write('- page ' + page + ' | ' + (issue.kind || 'unknown') +
                    ' | ' + (issue.location || 'unknown location') +
                    (detail ? ' | ' + String(detail).replace(/[\r\n]+/g, ' ').slice(0, 240) : '') + '\n');
            }
        }
        if (determinismCheck) {
            process.stdout.write('Determinism: ' + (determinismCheck.identical ? 'PASS' : 'FAIL') +
                ' | first differing page: ' + (determinismCheck.firstDifferingPage == null ? 'none' : determinismCheck.firstDifferingPage + 1) + '\n');
        }
        const threshold = rank(args.failOn);
        const fail = threshold > 0 && report.audit.issues.some(i => rank(i.severity) >= threshold);
        const nondeterministic = report.run.determinismCheck && !report.run.determinismCheck.identical;
        if (pageErrors.length) { process.stderr.write('Browser JavaScript errors: ' + pageErrors.length + '\n'); process.exitCode = 2; }
        else if (nondeterministic) { process.stderr.write('Determinism check failed at page ' + report.run.determinismCheck.firstDifferingPage + '\n'); process.exitCode = 3; }
        else if (fail) process.exitCode = 1;
    } finally {
        if (browser) await browser.close().catch(() => {});
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(err => { process.stderr.write('geometry-audit-cli: ' + (err.stack || err) + '\n'); process.exitCode = 2; });
