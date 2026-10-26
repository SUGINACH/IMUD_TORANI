const fs = require('fs'); const { synth } = require('./fuzz.js');
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const seed = parseInt(process.argv[2]);
const pool = [{}, { 'size-body': 10.5 }, { 'size-body': 12.5 }, { 'line-height-body': 1.28 }, { 'line-height-body': 1.5 }, { 'fn-columns': 2 }, { 'prop-col': 44, 'prop-margin': 5.5 }, { 'balance-chapter-end': 'yes' }, { 'mode-h4': 'span_1col' }, { 'mode-h3': 'inline_2col' }];
const r = rng(seed * 7919); const cfg = Object.assign({}, pool[Math.floor(r() * pool.length)], pool[Math.floor(r() * pool.length)]);
const o = { sections: 1 + Math.floor(r() * 2), perSec: 18 + Math.floor(r() * 16), noteRate: [0.1, 0.3, 0.5][Math.floor(r() * 3)], headRate: [0.1, 0.25, 0.4][Math.floor(r() * 3)], short: r() < 0.4, noteLen: [120, 260, 500][Math.floor(r() * 3)] };
fs.writeFileSync('wide' + seed + '.txt', synth(seed, o)); console.log(JSON.stringify(cfg), JSON.stringify(o));
