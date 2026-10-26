const { chromium } = require('playwright'); const fs = require('fs'); const { serve } = require('./run.js');
(async () => {
  const [site, doc, pagesArg, cfgArg] = process.argv.slice(2); const cfg = cfgArg ? JSON.parse(cfgArg) : {}; const want = pagesArg.split(',');
  const srv = await serve(site, 8812); const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 1400 } });
  await page.goto('http://localhost:8812/index.html', { waitUntil: 'load' }); await page.waitForTimeout(400);
  await page.evaluate(({t,cfg}) => { document.getElementById('raw-input').value = t; for (const [id,v] of Object.entries(cfg)) { const el=document.getElementById(id); if(!el) continue; if(el.type==='checkbox') el.checked=!!v; else el.value=v; } performTypeset(); }, {t: fs.readFileSync(doc, 'utf-8'), cfg});
  const out = await page.evaluate((want) => {
    const res = {};
    document.querySelectorAll('#book-container .a4-page').forEach(pg => {
      const id = pg.getAttribute('data-page-index'); if (!want.includes(id)) return;
      const scale = pg.getBoundingClientRect().width / pg.offsetWidth;
      res[id] = Array.from(pg.querySelectorAll('.block-2col, .block-h3-span')).map(b => {
        if (b.classList.contains('block-h3-span')) return { span: b.textContent.trim().slice(0, 20) };
        const col = c => Array.from(b.querySelector(c).children).map(k => ({ t: k.tagName + '.' + k.className.slice(0, 14), tok: k.getAttribute('data-token-id'), mb: k.style.marginBottom, lh: k.style.lineHeight, bot: +((k.getBoundingClientRect().bottom - b.getBoundingClientRect().top) / scale).toFixed(1), len: k.textContent.length }));
        return { right: col('.right-col'), left: col('.left-col') };
      });
    });
    return res;
  }, want);
  console.log(JSON.stringify(out, null, 1)); await browser.close(); srv.close();
})();
