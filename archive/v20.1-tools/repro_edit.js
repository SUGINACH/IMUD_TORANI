const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright'); const { serve } = require('./run.js'); const fz = require('./fuzz.js');
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
(async () => {
  const seed = parseInt(process.argv[2]);
  const pool = [{}, { 'size-body': 10.5 }, { 'size-body': 12.5 }, { 'line-height-body': 1.28 }, { 'line-height-body': 1.5 }, { 'fn-columns': 2 }, { 'prop-col': 44, 'prop-margin': 5.5 }, { 'balance-chapter-end': 'yes' }, { 'mode-h4': 'span_1col' }, { 'mode-h3': 'inline_2col' }];
  const r0 = rng(seed * 7919); const cfg = Object.assign({}, pool[Math.floor(r0() * pool.length)], pool[Math.floor(r0() * pool.length)]);
  const o = { sections: 1 + Math.floor(r0() * 2), perSec: 18 + Math.floor(r0() * 16), noteRate: [0.1, 0.3, 0.5][Math.floor(r0() * 3)], headRate: [0.1, 0.25, 0.4][Math.floor(r0() * 3)], short: r0() < 0.4, noteLen: [120, 260, 500][Math.floor(r0() * 3)] };
  let text = fz.synth(seed, o); const r = rng(seed);
  const srv = await serve('site_fix', 8860); const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1300, height: 1400 } });
  await page.goto('http://localhost:8860/index.html', { waitUntil: 'load' }); await page.waitForTimeout(300);
  await page.addScriptTag({ path: path.join(__dirname, 'check_layout.js') });
  for (let st = 0; st <= 3; st++) {
    if (st > 0) text = fz.mutate ? fz.mutate(text, r) : text;
    fs.writeFileSync('edit' + seed + '_step' + st + '.txt', text);
    const evp = page.evaluate(({ text, cfg }) => { document.getElementById('raw-input').value = text; for (const [id, val] of Object.entries(cfg)) { const el = document.getElementById(id); if (el) el.value = val; } performTypeset(); return window.__checkLayout({}); }, { text, cfg });
    const v = await Promise.race([evp, new Promise(r => setTimeout(() => r('HANG'), 25000))]);
    if (v === 'HANG') { console.log('step', st, 'HANG (text saved)'); console.log('cfg', JSON.stringify(cfg)); process.exit(0); }
    const bad = v.filter(x => !x.type.startsWith('GRAN'));
    console.log('step', st, JSON.stringify(bad.slice(0, 4)));
    fs.writeFileSync('edit' + seed + '_step' + st + '.txt', text);
  }
  console.log('cfg', JSON.stringify(cfg)); await browser.close(); srv.close();
})();
