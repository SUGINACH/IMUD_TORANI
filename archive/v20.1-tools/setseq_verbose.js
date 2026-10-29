const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright'); const { serve } = require('./run.js'); const { synth, scenario } = require('./fuzz.js');
(async () => {
  const srv = await serve(process.argv[2], 8830); const browser = await chromium.launch();
  const steps = [
    { 'size-body': 10.5 }, { 'line-height-body': 1.45 }, { 'fn-columns': 2 }, { 'mode-h4': 'span_1col' }, { 'size-body': 12 },
    { 'mode-h3': 'inline_2col' }, { 'mode-h4': 'inline_2col' }, { 'balance-chapter-end': 'yes' }, { 'prop-col': 44, 'prop-margin': 5.5 }, { 'line-height-body': 1.25 },
    { 'fn-columns': 1 }, { 'mode-h3': 'span_1col' }, { 'size-body': 11.2, 'line-height-body': 1.34, 'prop-col': 41 }];
  const text = process.argv[3] === 'real' ? fs.readFileSync(path.join(__dirname, 'doc_part1.txt'), 'utf-8') : synth(parseInt(process.argv[3]), { sections: 1, perSec: 24, noteRate: 0.3, headRate: 0.25 });
  const res = await scenario(browser, 8830, { name: 'x', text, seed: 5, cfgSteps: steps });
  res.results.forEach((r, i) => console.log('step', i, i ? JSON.stringify(steps[i - 1]) : 'initial', 'pages', r.pages, JSON.stringify(Object.fromEntries(Object.entries(r.counts).filter(([k]) => !k.startsWith('GRAN'))))));
  await browser.close(); srv.close();
})();
