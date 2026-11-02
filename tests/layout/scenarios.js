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
  let openParen = 0;   // paragraphs left until a deliberately open '(' is closed
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
        let at = Math.floor(r() * p.length * 0.8);
        // a paragraph that starts with a footnote right after a heading is joined to that heading by the tokenizer (by design)
        if (o.noNoteAtStart && at < 1) at = 1;
        const n = pick(pool).slice(0, 30 + Math.floor(r() * (o.noteLen || 260)));
        p = p.slice(0, at) + ' [' + n + '] ' + p.slice(at);
      }
      if (o.parenRate && r() < o.parenRate) {
        // wrap a random run of words in ( ... ), sometimes with a nested pair, sometimes left open to be closed 1-2 paragraphs later
        const w = p.split(' ');
        if (w.length > 12) {
          const a = Math.floor(r() * (w.length - 10)), len = 2 + Math.floor(r() * 8);
          const kind = r();
          if (kind < 0.2 && !openParen) { w[a] = '(' + w[a]; openParen = 1 + Math.floor(r() * 2); }
          else {
            w[a] = '(' + w[a]; w[a + len] = w[a + len] + ')';
            if (kind > 0.7 && len > 4) { w[a + 1] = '(' + w[a + 1]; w[a + 2] = w[a + 2] + ')'; }
          }
          p = w.join(' ');
        }
      }
      if (openParen) { openParen--; if (openParen === 0) p = p.replace(/^(\S+)/, '$1)'); }
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
  'dividers': null,   // filled below (needs DIVIDER_ID)
  'fncont': { 'fn-layout-mode': 'continuous' },
  'paren-fixed9': { 's-paren-mode': 'fixed', 's-paren': 9 },
  'paren-off': { 's-paren': 0, 'f-paren': '' },
};

// id of a flat calligraphic divider from section_dividers.json (used by the divider scenarios)
const DIVIDER_ID = 'ext_calligraphics_47__2019_06_24_13_53_22_utc__svg';
const DIVIDER_CFG = { 'heading-divider-h3': DIVIDER_ID, 'heading-divider-h4': DIVIDER_ID, 'heading-divider-h5': DIVIDER_ID, 'heading-divider-h6': DIVIDER_ID, 'shaar-main-divider': DIVIDER_ID, 'shaar-sub-divider': DIVIDER_ID };

const QUICK = new Set(['doc', 'cfg-size13.4', 'cfg-lh1.5', 'cfg-fn2col', 'cfg-dividers', 'cfg-fncont', 'cfg-paren-fixed9', 'synthParen-41', 'synth-1', 'synth-2', 'synthShort-11']);

CFGS.dividers = DIVIDER_CFG;

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
  for (let seed = 21; seed <= 22; seed++) all.push({ name: 'synthDiv-' + seed, group: 'synth', text: synth(pool, seed, { headRate: 0.4, noteRate: 0.3, noNoteAtStart: true }), cfg: DIVIDER_CFG });
  // footnote-heavy documents: continuous footnote layout vs the same text in block layout (control)
  for (let seed = 31; seed <= 32; seed++) all.push({ name: 'synthFnCont-' + seed, group: 'synth', text: synth(pool, seed, { noteRate: 0.8, noteLen: 150, noNoteAtStart: true }), cfg: { 'fn-layout-mode': 'continuous' } });
  for (let seed = 31; seed <= 32; seed++) all.push({ name: 'synthFnBlock-' + seed, group: 'synth', text: synth(pool, seed, { noteRate: 0.8, noteLen: 150, noNoteAtStart: true }), cfg: {} });
  // parenthesis-rich documents (nested pairs, pairs spanning paragraphs): styled vs the same text with paren styling off
  for (let seed = 41; seed <= 43; seed++) all.push({ name: 'synthParen-' + seed, group: 'synth', text: synth(pool, seed, { parenRate: 0.7, noteRate: 0.3, noNoteAtStart: true }), cfg: {} });
  for (let seed = 41; seed <= 42; seed++) all.push({ name: 'synthParenOff-' + seed, group: 'synth', text: synth(pool, seed, { parenRate: 0.7, noteRate: 0.3, noNoteAtStart: true }), cfg: { 's-paren': 0, 'f-paren': '' } });
  // control: the same heading-rich documents WITHOUT dividers (separates divider effects from pre-existing edge cases)
  for (let seed = 21; seed <= 22; seed++) all.push({ name: 'synthNoDiv-' + seed, group: 'synth', text: synth(pool, seed, { headRate: 0.4, noteRate: 0.3, noNoteAtStart: true }), cfg: {} });
  return quick ? all.filter((s) => QUICK.has(s.name)) : all;
}

module.exports = { buildScenarios, CFGS, DIVIDER_ID, DIVIDER_CFG };
