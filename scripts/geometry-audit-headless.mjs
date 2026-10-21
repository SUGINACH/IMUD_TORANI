#!/usr/bin/env node
/* מריץ את מנוע העימוד ב-Chrome headless, מחלץ מודל גיאומטרי ל-JSON, ואפשר להריץ עליו את הבודק —
   בלי ממשק, בלי צילומי מסך ובלי שאדם יסתכל על העמודים.

   דרישות:  npm i puppeteer-core   (Chrome מותקן; אפשר --chrome <path> או משתנה הסביבה CHROME_PATH)
   שימוש:
     node scripts/geometry-audit-headless.mjs --text mid_long_test_text.txt
         [--settings default_settings.json]   קובץ הגדרות (ברירת מחדל: default_settings.json)
         [--out geometry.json]                קובץ הפלט (ברירת מחדל: geometry-headless.json)
         [--words]                            לכלול מילים/רווחים (קובץ גדול בהרבה; הבודק לא צריך אותם)
         [--check]                            להריץ אחר כך את scripts/geometry-audit-cli.js על הפלט */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = { text: null, settings: path.join(ROOT, 'default_settings.json'), out: 'geometry-headless.json', words: false, check: false, chrome: null };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--text') args.text = argv[++i];
    else if (v === '--settings') args.settings = argv[++i];
    else if (v === '--out') args.out = argv[++i];
    else if (v === '--chrome') args.chrome = argv[++i];
    else if (v === '--words') args.words = true;
    else if (v === '--check') args.check = true;
}
if (!args.text) { console.error('חסר --text <קובץ טקסט>'); process.exit(2); }

let puppeteer;
try { puppeteer = (await import('puppeteer-core')).default; }
catch { console.error('חסרה התלות puppeteer-core — הרץ: npm i puppeteer-core'); process.exit(2); }

let exe = [args.chrome, process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
    .filter(Boolean).find(p => fs.existsSync(p));
let launchArgs = ['--no-sandbox'];
if (!exe) {
    try { const c = (await import('@sparticuz/chromium')).default; exe = await c.executablePath(); launchArgs = [...c.args, '--no-sandbox']; }
    catch { /* אין Chrome */ }
}
if (!exe) { console.error('לא נמצא Chrome. התקן אותו או ציין --chrome <path> / CHROME_PATH'); process.exit(2); }

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('content-type', MIME[path.extname(f)] || 'application/octet-stream');
    fs.createReadStream(f).pipe(res);
}).listen(0);
const port = server.address().port;

const settings = JSON.parse(fs.readFileSync(args.settings, 'utf8'));
const text = fs.readFileSync(args.text, 'utf8');
const families = new Set();
for (const [k, v] of Object.entries(settings)) {
    if (typeof v === 'string' && /^(font-|f-)/.test(k)) for (const m of v.matchAll(/'([^']+)'/g)) families.add(m[1]);
}

const browser = await puppeteer.launch({ args: launchArgs, executablePath: exe, headless: 'shell', protocolTimeout: 900000, defaultViewport: { width: 1280, height: 900 } });
try {
    const page = await browser.newPage();
    page.on('pageerror', e => console.error('[pageerror]', String(e).slice(0, 200)));
    await page.goto(`http://127.0.0.1:${port}/renderer.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof window.typesetDocument === 'function' && !!window.__geomAudit, { timeout: 60000 });
    await page.evaluate(async fams => { await Promise.all(fams.map(f => document.fonts.load(`16px "${f}"`).catch(() => []))); await document.fonts.ready; }, [...families]);

    const t0 = Date.now();
    const rd = await page.evaluate((text, settings) => new Promise(resolve => {
        const h = e => { if (e.data && (e.data.type === 'render-done' || e.data.type === 'render-error')) { window.removeEventListener('message', h); resolve(e.data); } };
        window.addEventListener('message', h);
        window.postMessage({ type: 'typeset', text, settings }, '*');
    }), text, settings);
    if (rd.type !== 'render-done') throw new Error('העימוד נכשל: ' + JSON.stringify(rd).slice(0, 200));
    console.log(`עימוד: ${rd.pageCount} עמודים ב-${Date.now() - t0}ms`);

    const model = await page.evaluate(keepWords => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        const m = window.__geomAudit.extract();
        const strip = n => { if (!keepWords) delete n.words; (n.children || []).forEach(strip); return n; };
        return { pages: m.pages.map(p => strip(window.__geomAudit.cleanForExport(p))), stats: m.stats };
    }, args.words);
    fs.writeFileSync(args.out, JSON.stringify(model));
    console.log(`נכתב ${args.out} (${(fs.statSync(args.out).size / 1048576).toFixed(1)}MB, ${model.pages.length} עמודים)`);
} finally {
    await browser.close();
    server.close();
}

if (args.check) {
    const cli = path.join(ROOT, 'scripts', 'geometry-audit-cli.js');
    const r = spawnSync(process.execPath, [cli, args.out], { stdio: 'inherit' });
    process.exitCode = r.status || 0;
}
