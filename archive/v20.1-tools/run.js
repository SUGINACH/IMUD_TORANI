const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
function serve(dir, port) {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
      if (f.endsWith('/')) f += 'index.html';
      fs.readFile(f, (e, d) => { if (e) { rsp.writeHead(404); rsp.end(); return; }
        rsp.writeHead(200, { 'Content-Type': (mime[path.extname(f)] || 'application/octet-stream') + '; charset=utf-8' }); rsp.end(d); });
    }).listen(port, () => res(srv));
  });
}
async function runOne(browser, port, text, cfg, label, opts) {
  const page = await browser.newPage({ viewport: { width: 1300, height: 1400 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await page.addScriptTag({ path: path.join(__dirname, 'check_layout.js') });
  const t0 = Date.now();
  await page.evaluate(({ text, cfg }) => {
    document.getElementById('raw-input').value = text;
    for (const [id, v] of Object.entries(cfg || {})) {
      const el = document.getElementById(id); if (!el) { console.warn('no el', id); continue; }
      if (el.type === 'checkbox') el.checked = !!v; else el.value = v;
    }
    if (typeof performTypeset === 'function') performTypeset(); else typesetDocument(0);
  }, { text, cfg });
  await page.waitForTimeout(200);
  const viol = await page.evaluate(() => window.__checkLayout({}));
  const pages = await page.evaluate(() => document.querySelectorAll('#book-container .a4-page').length);
  const ms = Date.now() - t0;
  const byType = {}; viol.forEach(v => { (byType[v.type] = byType[v.type] || []).push(v); });
  const shots = [];
  if (opts && opts.shots) {
    const pg = new Set(viol.map(v => v.page).filter(Boolean));
    const els = await page.$$('#book-container .a4-page'); let n = 0;
    for (const el of els) {
      const idx = await el.getAttribute('data-page-index');
      if (pg.has(idx) && n < (opts.maxShots || 6)) { await el.scrollIntoViewIfNeeded(); const f = path.join(opts.shots, `${label}_p${idx}.png`); await el.screenshot({ path: f }); shots.push(f); n++; }
    }
  }
  await page.close();
  return { label, pages, ms, errors, counts: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.length])),
           examples: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.slice(0, 3)])), shots };
}
module.exports = { serve, runOne };
if (require.main === module) (async () => {
  const [siteDir, textArg, cfgArg] = process.argv.slice(2);
  const shotsArg = process.argv.find(a => a.startsWith('--shots='));
  const text = fs.readFileSync(textArg, 'utf-8'); const cfg = cfgArg && !cfgArg.startsWith('--') ? JSON.parse(cfgArg) : {};
  const srv = await serve(siteDir, 8811); const browser = await chromium.launch();
  const r = await runOne(browser, 8811, text, cfg, 'run', shotsArg ? { shots: shotsArg.split('=')[1] } : null);
  console.log(JSON.stringify(r, null, 1)); await browser.close(); srv.close();
})();
