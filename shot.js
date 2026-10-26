const { chromium } = require('playwright'); const fs = require('fs'); const { serve } = require('./run.js');
(async () => {
  const [site, doc, pagesArg, outPrefix] = process.argv.slice(2); const want = pagesArg.split(',');
  const srv = await serve(site, 8880); const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
  await page.goto('http://localhost:8880/index.html', { waitUntil: 'load' }); await page.waitForTimeout(300);
  await page.evaluate((t) => { document.getElementById('raw-input').value = t; performTypeset(); }, fs.readFileSync(doc, 'utf-8'));
  await page.waitForTimeout(500);
  const els = await page.$$('#book-container .a4-page');
  for (const el of els) { const id = await el.getAttribute('data-page-index'); if (want.includes(id)) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: outPrefix + '_p' + id + '.png' }); } }
  await browser.close(); srv.close();
})();
