const { chromium } = require('playwright'); const fs = require('fs'); const { serve } = require('./run.js');
(async () => {
  const [site, doc, cfgArg, pg] = process.argv.slice(2); const cfg = JSON.parse(cfgArg);
  const srv = await serve(site, 8865); const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 1400 } });
  await page.goto('http://localhost:8865/index.html', { waitUntil: 'load' }); await page.waitForTimeout(300);
  const r = await page.evaluate(({t,cfg,pg}) => { document.getElementById('raw-input').value = t; for (const [id,v] of Object.entries(cfg)) { const el=document.getElementById(id); if(!el) continue; el.value=v; } performTypeset();
    const p = Array.from(document.querySelectorAll('#book-container .a4-page')).find(x => x.getAttribute('data-page-index') === pg);
    const sc = p.getBoundingClientRect().width / p.offsetWidth; const flow = p.querySelector('.page-body-flow'); const fr = flow.getBoundingClientRect();
    return { flowH: +(fr.height/sc).toFixed(1), kids: Array.from(flow.children).map(k => ({ cls: k.className.slice(0,26), top: +(((k.getBoundingClientRect().top - fr.top)/sc).toFixed(1)), bottom: +(((k.getBoundingClientRect().bottom - fr.top)/sc).toFixed(1)) })) }; }, {t: fs.readFileSync(doc,'utf-8'), cfg, pg});
  console.log(JSON.stringify(r)); await browser.close(); srv.close();
})();
