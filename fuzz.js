const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { serve } = require('./run.js');
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function loadPool() {
  const lines = fs.readFileSync(path.join(__dirname, 'doc_full.txt'), 'utf-8').split('\n').map(l => l.trim());
  return lines.filter(l => l && !/^(כותרת|שם הספר|נושא|פרטי|שם המחבר|מקום)/.test(l) && l.length > 40 && l.length < 1100);
}
const POOL = loadPool();
function synth(seed, o = {}) {
  const r = rng(seed); const pick = a => a[Math.floor(r() * a.length)];
  const out = ['שם הספר - בדיקה סינתטית ' + seed, ''];
  const nSec = o.sections || 2, perSec = o.perSec || 26;
  for (let s = 0; s < nSec; s++) {
    out.push('כותרת 1 - חלק ' + (s + 1)); out.push('כותרת 2 - סימן ' + (s + 1) + ' - נושא'); out.push('');
    for (let i = 0; i < perSec; i++) {
      const roll = r();
      if (roll < (o.headRate ?? 0.18)) { const lvl = pick([3, 4, 4, 5, 6]); out.push('כותרת ' + lvl + ' - ' + pick(['דין', 'ביאור', 'הגדרה', 'שיטת הרמב"ם', 'מקור הדין', 'סיכום']) + ' ' + Math.floor(r() * 90)); }
      if (roll > 0.93 && o.sideNotes !== false) out.push('כותרת 7 - הערת צד ' + Math.floor(r() * 99));
      let p = pick(POOL);
      if (o.short && r() < 0.5) p = p.slice(0, 60 + Math.floor(r() * 140));
      if (r() < (o.noteRate ?? 0.3)) { const at = Math.floor(r() * p.length * 0.8); const n = pick(POOL).slice(0, 30 + Math.floor(r() * (o.noteLen || 260))); p = p.slice(0, at) + ' [' + n + '] ' + p.slice(at); }
      out.push(p);
    }
  }
  return out.join('\n');
}
function mutate(text, r) {
  const L = text.split('\n'); const pick = a => a[Math.floor(r() * a.length)];
  const op = Math.floor(r() * 5); const i = 3 + Math.floor(r() * (L.length - 4));
  if (op === 0) L.splice(i, 1);
  else if (op === 1) L.splice(i, 0, pick(POOL));
  else if (op === 2) L.splice(i, 0, 'כותרת ' + pick([3, 4, 5]) + ' - כותרת חדשה ' + Math.floor(r() * 99));
  else if (op === 3) L[i] = L[i].length > 100 ? L[i].slice(0, 100) + ' [הערה חדשה ארוכה למדי לבדיקה ' + 'מילים '.repeat(Math.floor(r() * 30)) + '] ' + L[i].slice(100) : L[i] + ' [הערה]';
  else L.splice(i, 0, pick(POOL).slice(0, 80 + Math.floor(r() * 120)));
  return L.join('\n');
}
async function scenario(browser, port, sc) {
  const page = await browser.newPage({ viewport: { width: 1300, height: 1400 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'load' }); await page.waitForTimeout(300);
  await page.addScriptTag({ path: path.join(__dirname, 'check_layout.js') });
  const results = []; let text = sc.text; const r = rng(sc.seed || 1);
  const steps = sc.cfgSteps ? sc.cfgSteps.length : (sc.edits || 0);
  let curCfg = Object.assign({}, sc.cfg || {});
  for (let st = 0; st <= steps; st++) {
    if (st > 0 && sc.cfgSteps) Object.assign(curCfg, sc.cfgSteps[st - 1]);
    else if (st > 0) text = mutate(text, r);
    const t0 = Date.now();
    await page.evaluate(({ text, cfg }) => {
      document.getElementById('raw-input').value = text;
      for (const [id, v] of Object.entries(cfg || {})) { const el = document.getElementById(id); if (!el) continue; if (el.type === 'checkbox') el.checked = !!v; else el.value = v; }
      performTypeset();
    }, { text, cfg: curCfg });
    const viol = await page.evaluate(() => window.__checkLayout({}));
    const pages = await page.evaluate(() => document.querySelectorAll('#book-container .a4-page').length);
    const counts = {}; viol.forEach(v => { counts[v.type] = (counts[v.type] || 0) + 1; });
    results.push({ step: st, pages, ms: Date.now() - t0, counts, ex: viol.filter(v => v.type !== 'GRANULARITY(ok)').slice(0, 2) });
  }
  await page.close();
  return { name: sc.name, errors, results, finalText: text };
}
module.exports = { synth, scenario, POOL, mutate, rng };
if (require.main === module) (async () => {
  const site = process.argv[2]; const which = process.argv[3] || 'all';
  const srv = await serve(site, 8813); const browser = await chromium.launch();
  const scs = [];
  if (which === 'all' || which === 'real') {
    scs.push({ name: 'real-full-default', text: fs.readFileSync(path.join(__dirname, 'doc_full.txt'), 'utf-8') });
  }
  if (which === 'all' || which === 'cfg') {
    const t1 = fs.readFileSync(path.join(__dirname, 'doc_part1.txt'), 'utf-8');
    const cfgs = { 'size10': { 'size-body': 10 }, 'size12.5': { 'size-body': 12.5 }, 'lh1.25': { 'line-height-body': 1.25 }, 'lh1.5': { 'line-height-body': 1.5 }, 'noWidow': { 'avoid-widows': false, 'avoid-orphans': false }, 'balEnd': { 'balance-chapter-end': 'yes' }, 'fn2col': { 'fn-columns': 2 }, 'col44': { 'prop-col': 44, 'prop-margin': 5.5 } };
    for (const [k, v] of Object.entries(cfgs)) scs.push({ name: 'cfg-' + k, text: t1, cfg: v });
  }
  if (which === 'all' || which === 'synth') {
    for (let seed = 1; seed <= 6; seed++) scs.push({ name: 'synth-' + seed, text: synth(seed, { noteRate: 0.35 }), seed });
    for (let seed = 11; seed <= 14; seed++) scs.push({ name: 'synthShort-' + seed, text: synth(seed, { short: true, headRate: 0.3, noteRate: 0.4 }), seed });
  }
  if (which === 'setseq') {
    const steps = [
      { 'size-body': 10.5 }, { 'line-height-body': 1.45 }, { 'fn-columns': 2 }, { 'mode-h4': 'span_1col' }, { 'size-body': 12 },
      { 'mode-h3': 'inline_2col' }, { 'mode-h4': 'inline_2col' }, { 'balance-chapter-end': 'yes' }, { 'prop-col': 44, 'prop-margin': 5.5 }, { 'line-height-body': 1.25 },
      { 'fn-columns': 1 }, { 'mode-h3': 'span_1col' }, { 'size-body': 11.2, 'line-height-body': 1.34, 'prop-col': 41 }
    ];
    for (let seed = 31; seed <= 34; seed++) scs.push({ name: 'setseq-' + seed, text: synth(seed, { sections: 1, perSec: 24, noteRate: 0.3, headRate: 0.25 }), seed, cfgSteps: steps });
    const t1 = fs.readFileSync(path.join(__dirname, 'doc_part1.txt'), 'utf-8');
    scs.push({ name: 'setseq-real', text: t1, seed: 5, cfgSteps: steps });
  }
  if (which === 'wide') {
    const from = parseInt(process.argv[4] || '100'), to = parseInt(process.argv[5] || '115');
    const pool = [{}, { 'size-body': 10.5 }, { 'size-body': 12.5 }, { 'line-height-body': 1.28 }, { 'line-height-body': 1.5 }, { 'fn-columns': 2 }, { 'prop-col': 44, 'prop-margin': 5.5 }, { 'balance-chapter-end': 'yes' }, { 'mode-h4': 'span_1col' }, { 'mode-h3': 'inline_2col' }];
    for (let seed = from; seed <= to; seed++) {
      const r = rng(seed * 7919); const cfg = Object.assign({}, pool[Math.floor(r() * pool.length)], pool[Math.floor(r() * pool.length)]);
      const o = { sections: 1 + Math.floor(r() * 2), perSec: 18 + Math.floor(r() * 16), noteRate: [0.1, 0.3, 0.5][Math.floor(r() * 3)], headRate: [0.1, 0.25, 0.4][Math.floor(r() * 3)], short: r() < 0.4, noteLen: [120, 260, 500][Math.floor(r() * 3)] };
      scs.push({ name: 'wide-' + seed, text: synth(seed, o), seed, cfg, edits: 3 });
    }
  }
  if (which === 'edits') {
    for (let seed = 21; seed <= 24; seed++) scs.push({ name: 'edits-' + seed, text: synth(seed, { sections: 1, perSec: 20, noteRate: 0.3 }), seed, edits: 8 });
  }
  const summary = [];
  for (const sc of scs) {
    const res = await scenario(browser, 8813, sc);
    const agg = {}; let maxMs = 0, pages = 0;
    res.results.forEach(x => { maxMs = Math.max(maxMs, x.ms); pages = x.pages; for (const [k, v] of Object.entries(x.counts)) agg[k] = (agg[k] || 0) + v; });
    const bad = Object.fromEntries(Object.entries(agg).filter(([k]) => k !== 'GRANULARITY(ok)'));
    summary.push({ name: res.name, pages, maxMs, errors: res.errors.length, bad, gran: agg['GRANULARITY(ok)'] || 0, ex: res.results.flatMap(x => x.ex).slice(0, 3) });
    console.log(res.name.padEnd(18), 'pages', String(pages).padStart(3), 'ms', String(maxMs).padStart(5), 'errs', res.errors.length, JSON.stringify(bad), 'gran', agg['GRANULARITY(ok)'] || 0);
    if (Object.keys(bad).length) console.log('     ex:', JSON.stringify(summary[summary.length - 1].ex));
  }
  fs.writeFileSync(path.join(__dirname, 'fuzz_last.json'), JSON.stringify(summary, null, 1));
  await browser.close(); srv.close();
})();
