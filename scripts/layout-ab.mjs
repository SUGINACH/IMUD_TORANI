#!/usr/bin/env node
/* A/B לשינוי בקוד המנוע — בלי צילומי מסך ובלי הסתכלות על עמודים.

   מריץ את אותו טקסט על שתי גרסאות (תיקיות) של המערכת, תחת סדרת וריאנטים קטנים של הגדרות
   (גובה שורה, גודל גופן), ומשווה: מספר עמודים, ממצאי בדיקת הגיאומטריה, וכמה עמודים השתנו.

   למה סדרה ולא הרצה אחת: בניסוי על 141 עמודים שינוי של 0.75% בגובה השורה שינה 139 מתוך 143 עמודים
   והעלה את הממצאים מ-39 ל-65. ספירה בהרצה אחת היא בעיקר "מזל של נקודות חיתוך". ההשוואה המשמעותית
   היא סכום/ממוצע על אותה סדרה, אותו טקסט ואותה בדיקת גיאומטריה בשתי הגרסאות.

   שימוש:
     node scripts/layout-ab.mjs --a <תיקיית גרסה A> --b <תיקיית גרסה B> --text very_long_test_text.txt
         [--lines 1500]          כמה שורות מהטקסט (ברירת מחדל 1500; 0 = הכול)
         [--variants 5]          כמה וריאנטים (1 = רק בסיס)
         [--audit geometry-audit.js]   אותה בדיקת גיאומטריה לשתי הגרסאות (מומלץ; אחרת כל תיקייה משתמשת בשלה)
         [--json out.json]       כתיבת התוצאות
   בלי --b: מריץ רק את A (קו בסיס).
   דרישות: npm i puppeteer-core, ו-Chrome (--chrome <path> או CHROME_PATH). */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const o = { a: null, b: null, text: null, lines: 1500, variants: 5, audit: null, chrome: null, json: null, selftest: false };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--a') o.a = path.resolve(argv[++i]);
    else if (v === '--b') o.b = path.resolve(argv[++i]);
    else if (v === '--text') o.text = argv[++i];
    else if (v === '--lines') o.lines = parseInt(argv[++i], 10);
    else if (v === '--variants') o.variants = parseInt(argv[++i], 10);
    else if (v === '--audit') o.audit = path.resolve(argv[++i]);
    else if (v === '--chrome') o.chrome = argv[++i];
    else if (v === '--json') o.json = argv[++i];
    else if (v === '--selftest') o.selftest = true;
}
if (!o.a || !o.text) { console.error('שימוש: node scripts/layout-ab.mjs --a <תיקייה> [--b <תיקייה>] --text <קובץ> [--lines N] [--variants N] [--audit file] [--json out]'); process.exit(2); }

let puppeteer;
try { puppeteer = (await import('puppeteer-core')).default; }
catch { console.error('חסרה התלות puppeteer-core — הרץ: npm i puppeteer-core'); process.exit(2); }
let exe = [o.chrome, process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
    .filter(Boolean).find(p => fs.existsSync(p));
let launchArgs = ['--no-sandbox'];
if (!exe) { try { const c = (await import('@sparticuz/chromium')).default; exe = await c.executablePath(); launchArgs = [...c.args, '--no-sandbox']; } catch { /* אין */ } }
if (!exe) { console.error('לא נמצא Chrome (--chrome <path> / CHROME_PATH)'); process.exit(2); }

const VARIANTS = [
    { name: 'baseline', set: {} },
    { name: 'line-height 1.35', set: { 'line-height-body': 1.35 } },
    { name: 'line-height 1.33', set: { 'line-height-body': 1.33 } },
    { name: 'font 12.1', set: { 'size-body': 12.1 } },
    { name: 'font 11.9', set: { 'size-body': 11.9 } },
    { name: 'font 12.2 + lh 1.36', set: { 'size-body': 12.2, 'line-height-body': 1.36 } },
].slice(0, Math.max(1, o.variants));

const allLines = fs.readFileSync(o.text, 'utf8').split('\n');
let text = o.lines > 0 ? allLines.slice(0, o.lines).join('\n') : allLines.join('\n');
const other = (allLines.length > 3400 ? allLines.slice(3000, 3400) : allLines.slice(-400)).join('\n');
/* --selftest: האם המנוע פונקציה טהורה של (טקסט, הגדרות)? אותה הרצה פעמיים, ואז אחרי טקסט אחר באמצע */
const PLAN = o.selftest
    ? [{ name: 'A1 baseline', text, set: {} }, { name: 'A2 same input again', text, set: {} }, { name: 'B different text', text: other, set: {} }, { name: 'A3 same input after B', text, set: {} }]
    : VARIANTS.map(v => ({ ...v, text }));

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon' };
function serve(root) {
    const server = http.createServer((req, res) => {
        let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
        const f = path.join(root, p);
        if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('nf'); }
        res.setHeader('content-type', MIME[path.extname(f)] || 'application/octet-stream');
        fs.createReadStream(f).pipe(res);
    }).listen(0);
    return { server, port: server.address().port };
}

/* טביעת אצבע של פריסה (רצה בדף): לכל עמוד — hash של הטקסט, ומבנה בלוקים/טורים בדיוק של 1/64 פיקסל */
const fpFn = () => {
    const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, '0'); };
    const q = v => Math.round(v * 64) / 64;
    return Array.from(document.querySelectorAll('#book-container .a4-page')).map((pg, i) => {
        const pr = pg.getBoundingClientRect(); const rel = el => { const r = el.getBoundingClientRect(); return { y: q(r.top - pr.top), h: q(r.height) }; };
        const flow = pg.querySelector('.page-body-flow');
        const blocks = flow ? Array.from(flow.children).map(b => ({ k: b.classList.contains('block-2col') ? '2c' : b.classList.contains('block-h3-span') ? 'h3' : b.classList.contains('block-single-col') ? '1c' : 'o', ...rel(b),
            cols: Array.from(b.querySelectorAll(':scope > .main-column, :scope > .single-wide-col')).map(c => ({ n: c.children.length, ...rel(c), th: fnv(c.textContent) })) })) : [];
        const fn = pg.querySelector('.footnote-area');
        return { n: i + 1, th: fnv(flow ? flow.textContent : ''), blocks, fn: fn ? rel(fn) : null };
    });
};

async function runTree(browser, root, plan) {
    const { server, port } = serve(root);
    const settings = JSON.parse(fs.readFileSync(path.join(root, 'default_settings.json'), 'utf8'));
    const fams = new Set();
    for (const [k, v] of Object.entries(settings)) if (typeof v === 'string' && /^(font-|f-)/.test(k)) for (const m of v.matchAll(/'([^']+)'/g)) fams.add(m[1]);
    const page = await browser.newPage();
    page.on('pageerror', e => console.error('[pageerror]', String(e).slice(0, 160)));
    await page.goto(`http://127.0.0.1:${port}/renderer.html`, { waitUntil: 'load' });
    if (o.audit) await page.addScriptTag({ path: o.audit });
    await page.waitForFunction(() => typeof window.typesetDocument === 'function' && !!window.__geomAudit, { timeout: 60000 });
    await page.evaluate(async f => { await Promise.all(f.map(n => document.fonts.load(`16px "${n}"`).catch(() => []))); await document.fonts.ready; }, [...fams]);
    /* חימום גופנים: הגופנים שהמנוע צריך נטענים באמצע ההרצה הראשונה (נמדד: Alpha, Livorna ו-FrankReal bold),
       והפריסה של ההרצה הראשונה שונה מהמצב היציב (127 מתוך 141 עמודים). מחממים עד שקבוצת הגופנים הטעונים יציבה. */
    const warmText = allLines.slice(0, 1500).join('\n');
    const warm = await page.evaluate(async (tx, st, fpSrc) => {
        const fpFn = eval('(' + fpSrc + ')');
        const loaded = () => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + '|' + f.weight);
        const ts = () => new Promise(resolve => { const h = e => { if (e.data && (e.data.type === 'render-done' || e.data.type === 'render-error')) { window.removeEventListener('message', h); resolve(); } };
            window.addEventListener('message', h); window.postMessage({ type: 'typeset', text: tx, settings: st }, '*'); });
        const sig = fp => JSON.stringify(fp.map(p => [p.th, p.blocks, p.fn]));
        const before = loaded(); await ts(); await document.fonts.ready; const first = sig(fpFn()); const afterFirst = loaded();
        let n = afterFirst.length, last = first;
        for (let i = 0; i < 3; i++) { await ts(); await document.fonts.ready; last = sig(fpFn()); const c = loaded().length; if (c === n) break; n = c; }
        return { lateFonts: afterFirst.filter(k => !before.includes(k)), firstRunDiffers: first !== last };
    }, warmText, settings, fpFn.toString());
    const out = [];
    out.warm = warm;
    for (const v of plan) {
        const r = await page.evaluate(async (tx, st, fpSrc) => {
            const fpFn = eval('(' + fpSrc + ')');
            const loadedNow = () => [...document.fonts].filter(f => f.status === 'loaded').length;
            const fontsBefore = loadedNow();
            const t0 = performance.now();
            const done = await new Promise(resolve => { const h = e => { if (e.data && (e.data.type === 'render-done' || e.data.type === 'render-error')) { window.removeEventListener('message', h); resolve(e.data); } };
                window.addEventListener('message', h); window.postMessage({ type: 'typeset', text: tx, settings: st }, '*'); });
            const ms = Math.round(performance.now() - t0);
            window.scrollTo({ top: 0, behavior: 'instant' });
            const fp = fpFn(); const a = window.__geomAudit.audit(window.__geomAudit.extract());
            const rank = { high: 3, medium: 2, low: 1 }, pri = { 'fn-overflow': 0, 'pn-overflow': 0, 'page-overflow': 0, 'fn-page-overflow': 0, 'fn-pn-overflow': 0, containment: 1, overlap: 2, imbalance: 3 };
            const top = a.issues.slice().sort((x, y) => (rank[y.severity] - rank[x.severity]) || ((pri[x.kind] ?? 9) - (pri[y.kind] ?? 9)) || x.pageIdx - y.pageIdx).slice(0, 8).map(i => ({ p: i.pageIdx + 1, k: i.kind, s: i.severity, m: String(i.message).slice(0, 80) }));
            await document.fonts.ready;
            return { ok: done.type === 'render-done', lateFonts: loadedNow() - fontsBefore, pages: fp.length, ms, issues: a.summary.total, high: a.summary.high, byKind: a.summary.byKind, top, fp };
        }, v.text, Object.assign({}, settings, v.set), fpFn.toString());
        out.push({ name: v.name, ...r });
        console.error(`  [${path.basename(root)}] ${v.name}: ${r.pages} עמודים, ${r.issues} ממצאים, ${(r.ms / 1000).toFixed(1)}s${r.lateFonts ? '  ⚠ נטענו ' + r.lateFonts + ' גופנים באמצע המדידה' : ''}`);
    }
    await page.close(); server.close();
    return out;
}

function diffFp(A, B) {
    const n = Math.max(A.length, B.length); let changed = 0, textMoved = 0, geomOnly = 0, first = -1;
    for (let i = 0; i < n; i++) {
        const x = A[i], y = B[i]; let c = false;
        if (!x || !y || x.th !== y.th) { c = true; textMoved++; }
        else if (JSON.stringify([x.blocks, x.fn]) !== JSON.stringify([y.blocks, y.fn])) { c = true; geomOnly++; }
        if (c) { changed++; if (first < 0) first = i + 1; }
    }
    return { changed, textMoved, geomOnly, first };
}

const browser = await puppeteer.launch({ args: launchArgs, executablePath: exe, headless: 'shell', protocolTimeout: 1800000, defaultViewport: { width: 1280, height: 900 } });
let resA, resB = null;
try {
    resA = await runTree(browser, o.a, PLAN);
    if (o.b) resB = await runTree(browser, o.b, PLAN);
} finally { await browser.close(); }

const sum = (rs, f) => rs.reduce((s, r) => s + f(r), 0);
for (const [nm, rs] of [['A', resA], ['B', resB]]) {
    if (!rs) continue;
    if (rs.warm.lateFonts.length) console.log(`⚠ ${nm}: גופנים שנטענו באמצע ההרצה הראשונה: ${rs.warm.lateFonts.join(', ')}${rs.warm.firstRunDiffers ? ' — והפריסה של ההרצה הראשונה שונה מהמצב היציב' : ''}. המדידות כאן אחרי חימום.`);
    const dirty = rs.filter(r => r.lateFonts).map(r => r.name);
    if (dirty.length) console.log(`⚠ ${nm}: נטענו גופנים נוספים באמצע המדידה בוריאנטים: ${dirty.join(', ')} — התוצאות שלהם לא יציבות`);
}
const kinds = new Set(); [resA, resB].filter(Boolean).forEach(rs => rs.forEach(r => Object.keys(r.byKind).forEach(k => kinds.add(k))));
console.log(`\nטקסט: ${path.basename(o.text)}${o.lines > 0 ? ` (${o.lines} שורות ראשונות)` : ''} | A=${path.basename(o.a)}${o.b ? ` | B=${path.basename(o.b)}` : ''} | ${VARIANTS.length} וריאנטים\n`);
if (o.selftest) {
    const d12 = diffFp(resA[0].fp, resA[1].fp), d13 = diffFp(resA[0].fp, resA[3].fp);
    resA.forEach(r => console.log(`${r.name.padEnd(24)} עמודים ${String(r.pages).padStart(4)} | ממצאים ${String(r.issues).padStart(4)} | ${(r.ms / 1000).toFixed(1)}s`));
    console.log(`\nA1 מול A2 (אותה קלט, אותו מושב):      עמודים ששונו ${d12.changed}`);
    console.log(`A1 מול A3 (אותו קלט אחרי טקסט אחר):    עמודים ששונו ${d13.changed}`);
    console.log(d12.changed === 0 && d13.changed === 0 ? 'המנוע דטרמיניסטי וללא זליגת מצב בין הרצות' : 'זוהתה תלות במצב/היסטוריה — המנוע אינו פונקציה טהורה של הקלט');
} else if (!resB) {
    if (resA[0].top && resA[0].top.length) { console.log('החמורים ביותר בבסיס:'); resA[0].top.forEach(t => console.log(`  עמוד ${t.p} [${t.s}] ${t.k}: ${t.m}`)); console.log(''); }
    resA.forEach((r, i) => { const d = i > 0 ? diffFp(resA[0].fp, r.fp) : null; console.log(`${r.name.padEnd(22)} עמודים ${String(r.pages).padStart(4)} | ממצאים ${String(r.issues).padStart(4)} (high ${r.high}) | ${JSON.stringify(r.byKind)}${d ? ` | שונו ${d.changed}/${Math.max(r.pages, resA[0].pages)} עמודים מול הבסיס` : ''}`); });
} else {
    console.log('וריאנט'.padEnd(22) + 'עמודים A→B'.padEnd(13) + 'ממצאים A→B (high)'.padEnd(22) + 'עמודים ששונו (טקסט/גיאומטריה בלבד)  ראשון');
    resA.forEach((a, i) => {
        const b = resB[i], d = diffFp(a.fp, b.fp);
        console.log(a.name.padEnd(22) + `${a.pages}→${b.pages}`.padEnd(13) + `${a.issues}→${b.issues} (${a.high}→${b.high})`.padEnd(22) + `${d.changed}/${Math.max(a.pages, b.pages)} (${d.textMoved}/${d.geomOnly})  ${d.first}`);
    });
    const pA = sum(resA, r => r.pages), pB = sum(resB, r => r.pages), iA = sum(resA, r => r.issues), iB = sum(resB, r => r.issues);
    console.log(`\nסה"כ על הסדרה: ממצאים לכל 100 עמודים: A ${(100 * iA / pA).toFixed(1)} | B ${(100 * iB / pB).toFixed(1)}  (high: A ${sum(resA, r => r.high)} | B ${sum(resB, r => r.high)})`);
    console.log('לפי סוג (סכום על הסדרה):', [...kinds].map(k => `${k} A:${sum(resA, r => r.byKind[k] || 0)} B:${sum(resB, r => r.byKind[k] || 0)}`).join(' | '));
}
if (o.json) fs.writeFileSync(o.json, JSON.stringify({ options: { text: o.text, lines: o.lines, variants: VARIANTS.map(v => v.name) }, A: resA.map(({ fp, ...r }) => r), B: resB && resB.map(({ fp, ...r }) => r) }, null, 2));
