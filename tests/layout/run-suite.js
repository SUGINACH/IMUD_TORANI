#!/usr/bin/env node
'use strict';
/*
 * Layout acceptance suite.
 *
 *   node tests/layout/run-suite.js [--quick] [--only=<scenario>] [--update-baseline] [--root=<dir>] [--out=<file>]
 *
 * Typesets every scenario in headless Chromium and runs check_layout.js on the result
 * (overflow, column misalignment, orphan headings, widow/orphan lines, lost or altered text).
 * Results are compared with baseline.json: any violation type that INCREASES for a scenario is a
 * regression and makes the process exit with code 1.  Run it before accepting any change.
 *
 * The comparison is only meaningful with the real fonts (fonts/ folder, see tools/import-from-old-repo.sh).
 */
const fs = require('fs');
const path = require('path');
const { startServer, requirePlaywright, hasFonts, openApp, typeset } = require('../lib/common');
const { buildScenarios } = require('./scenarios');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const a = args.find((x) => x.startsWith(n + '=')); return a ? a.slice(n.length + 1) : ''; };

const ROOT = val('--root') ? path.resolve(val('--root')) : path.resolve(__dirname, '..', '..');
const BASELINE = path.join(__dirname, 'baseline.json');
const OUT = val('--out') || path.join(__dirname, 'results', 'latest.json');
const checker = fs.readFileSync(path.join(__dirname, 'check_layout.js'), 'utf-8');

(async () => {
  const { chromium } = requirePlaywright();
  const fonts = hasFonts(ROOT);
  if (!fonts) console.warn('WARNING: fonts/ folder not found - results are NOT comparable with the baseline (run tools/import-from-old-repo.sh).');
  let scenarios = buildScenarios({ quick: flag('--quick') });
  if (val('--only')) scenarios = scenarios.filter((s) => s.name === val('--only'));
  const { server, url } = await startServer(ROOT);
  const browser = await chromium.launch();
  const results = {};
  for (const sc of scenarios) {
    const { page, errors } = await openApp(browser, url);
    await page.addScriptTag({ content: checker });
    const t0 = Date.now();
    let pages = 0, counts = {}, total = 0;
    try {
      pages = await typeset(page, sc.text, sc.cfg);
      const viol = await page.evaluate(() => { try { return window.__checkLayout({}); } catch (e) { return [{ type: 'CHECKER_ERROR' }]; } });
      viol.forEach((v) => { if (v.type !== 'GRANULARITY(ok)') counts[v.type] = (counts[v.type] || 0) + 1; });
      total = Object.values(counts).reduce((a, b) => a + b, 0);
    } catch (e) { counts = { HARNESS_ERROR: 1 }; total = 1; errors.push(String(e.message).slice(0, 160)); }
    results[sc.name] = { group: sc.group, pages, total, counts, jsErrors: errors.length, ms: Date.now() - t0 };
    console.log(`${sc.name.padEnd(16)} pages=${String(pages).padStart(3)}  violations=${String(total).padStart(3)}  ${JSON.stringify(counts)}${errors.length ? '  JS-ERRORS=' + errors.length + ' ' + errors[0] : ''}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    await page.close();
  }
  await browser.close(); server.close();

  const summary = { fonts, quick: flag('--quick'), generated: new Date().toISOString(), scenarios: results };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 1));

  if (flag('--update-baseline')) {
    if (!fonts) { console.error('Refusing to write a baseline without the real fonts.'); process.exit(2); }
    let base = { scenarios: {} };
    if (fs.existsSync(BASELINE)) base = JSON.parse(fs.readFileSync(BASELINE, 'utf-8'));
    Object.assign(base.scenarios, results);
    base.updated = summary.generated;
    fs.writeFileSync(BASELINE, JSON.stringify(base, null, 1));
    console.log('Baseline updated for ' + Object.keys(results).length + ' scenario(s).');
    return;
  }

  // compare with baseline
  if (!fs.existsSync(BASELINE)) { console.log('No baseline.json - nothing to compare.'); return; }
  const base = JSON.parse(fs.readFileSync(BASELINE, 'utf-8')).scenarios;
  let regress = 0, improved = 0, pageDiff = 0;
  const lines = [];
  for (const [name, cur] of Object.entries(results)) {
    const b = base[name];
    if (!b) { lines.push(`  (new scenario, no baseline) ${name}`); continue; }
    const types = new Set([...Object.keys(cur.counts), ...Object.keys(b.counts)]);
    for (const t of types) {
      const c = cur.counts[t] || 0, o = b.counts[t] || 0;
      if (c > o) { regress++; lines.push(`  REGRESSION ${name}: ${t} ${o} -> ${c}`); }
      else if (c < o) { improved++; lines.push(`  improved   ${name}: ${t} ${o} -> ${c}`); }
    }
    if (cur.jsErrors > (b.jsErrors || 0)) { regress++; lines.push(`  REGRESSION ${name}: JS errors ${b.jsErrors || 0} -> ${cur.jsErrors}`); }
    if (cur.pages !== b.pages) { pageDiff++; lines.push(`  note       ${name}: page count ${b.pages} -> ${cur.pages}`); }
  }
  console.log('\n=== comparison with baseline ===');
  console.log(lines.length ? lines.join('\n') : '  identical to baseline');
  console.log(`regressions=${regress} improvements=${improved} page-count-changes=${pageDiff}`);
  if (regress && fonts) process.exit(1);
  if (regress && !fonts) console.log('(fonts missing: not failing the run)');
})().catch((e) => { console.error('SUITE FAILED:', e.message); process.exit(2); });
