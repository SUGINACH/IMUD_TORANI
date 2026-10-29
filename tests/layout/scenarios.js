'use strict';
/*
 * Scenario catalogue for the layout acceptance suite.
 *   doc            the real book excerpt (1009 lines)
 *   prob           "problem chapters" stress document
 *   cfg-*          the first 230 lines of the excerpt under different typography settings
 *   synth-*        deterministic random documents (headings of all levels, side notes, footnotes)
 * Every scenario is { name, group, text, cfg }, where cfg maps element ids to values.
 */
const fs = require('fs');
const path = require('path');

const corpus = (n) => fs.readFileSync(path.join(__dirname, '..', 'corpus', n), 'utf-8').replace(/\r\n/g, '\n');

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function makePool(full) {
  return full.split('\n').map((l) => l.trim())
    .filter((l) => l && !/^(כותרת|שם הספר|נושא|פרטי|שם המחבר|מקום)/.test(l) && l.length > 40 && l.length < 1100);
}

function synth(pool, seed, o = {}) {
  const r = rng(seed);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const out = ['שם הספר - בדיקה סינתטית ' + seed, ''];
  const nSec = o.sections || 2, perSec = o.perSec || 26;
  for (let s = 0; s < nSec; s++) {
    out.push('כותרת 1 - חלק ' + (s + 1));
    out.push('כותרת 2 - סימן ' + (s + 1) + ' - נושא');
    out.push('');
    for (let i = 0; i < perSec; i++) {
      const roll = r();
      if (roll < (o.headRate ?? 0.18)) {
        const lvl = pick([3, 4, 4, 5, 6]);
        out.push('כותרת ' + lvl + ' - ' + pick(['דין', 'ביאור', 'הגדרה', 'שיטת הרמב"ם', 'מקור הדין', 'סיכום']));
      }
      if (roll > 0.93 && o.sideNotes !== false) out.push('כותרת 7 - הערת צד ' + Math.floor(r() * 99));
      let p = pick(pool);
      if (o.short && r() < 0.5) p = p.slice(0, 60 + Math.floor(r() * 140));
      if (r() < (o.noteRate ?? 0.3)) {
        const at = Math.floor(r() * p.length * 0.8);
        const n = pick(pool).slice(0, 30 + Math.floor(r() * (o.noteLen || 260)));
        p = p.slice(0, at) + ' [' + n + '] ' + p.slice(at);
      }
      out.push(p);
    }
  }
  return out.join('\n');
}

const CFGS = {
  'default': {},
  'size10': { 'size-body': 10 },
  'size11': { 'size-body': 11 },
  'size13.4': { 'size-body': 13.4 },
  'lh1.25': { 'line-height-body': 1.25 },
  'lh1.5': { 'line-height-body': 1.5 },
  'fn2col': { 'fn-columns': 2 },
  'h3h4inline2': { 'mode-h3': 'inline_2col', 'mode-h4': 'inline_2col' },
  'col44': { 'prop-col': 44, 'prop-margin': 5.5 },
};

const QUICK = new Set(['doc', 'cfg-size13.4', 'cfg-lh1.5', 'cfg-fn2col', 'synth-1', 'synth-2', 'synthShort-11']);

function buildScenarios({ quick = false } = {}) {
  const full = corpus('test_doc.txt');
  const part1 = full.split('\n').slice(0, 230).join('\n');
  const pool = makePool(full);
  const all = [];
  all.push({ name: 'doc', group: 'doc', text: full, cfg: {} });
  all.push({ name: 'prob', group: 'prob', text: corpus('problem_chapters.txt'), cfg: {} });
  for (const [k, cfg] of Object.entries(CFGS)) all.push({ name: 'cfg-' + k, group: 'cfg', text: part1, cfg });
  for (let seed = 1; seed <= 6; seed++) all.push({ name: 'synth-' + seed, group: 'synth', text: synth(pool, seed, { noteRate: 0.35 }), cfg: {} });
  for (let seed = 11; seed <= 14; seed++) all.push({ name: 'synthShort-' + seed, group: 'synth', text: synth(pool, seed, { short: true, headRate: 0.3, noteRate: 0.4 }), cfg: {} });
  return quick ? all.filter((s) => QUICK.has(s.name)) : all;
}

module.exports = { buildScenarios, CFGS };
