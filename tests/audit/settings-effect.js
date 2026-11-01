#!/usr/bin/env node
'use strict';
/*
 * Settings-effect audit: does every control in the settings panel actually change the typeset result?
 *
 *   node tests/audit/settings-effect.js [--root=<dir>] [--shard=i/n] [--out=<file>] [--only=<id>] [--fast]
 *
 * For each control it applies 1-3 alternative values, re-typesets a rich document and compares a signature of the
 * rendered output (book DOM + root CSS variables + dynamic <style>). Controls that never change the signature are
 * reported as "no effect" - either options the engine ignores (like the header type "first word - last word", which
 * was dead in V20.1) or options that need a parent toggle to matter (verify those by hand).
 * Works on any version of the app (an /app.js transform skips the 1,754-font background load, which is irrelevant here).
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { requirePlaywright } = require('../lib/common');

const args = process.argv.slice(2);
const val = (n, d = '') => { const a = args.find((x) => x.startsWith(n + '=')); return a ? a.slice(n.length + 1) : d; };
const ROOT = path.resolve(val('--root', path.join(__dirname, '..', '..')));
const [SHARD_I, SHARD_N] = (val('--shard', '0/1')).split('/').map(Number);
const OUT = val('--out', path.join(__dirname, 'results', `settings-effect-${path.basename(ROOT)}-${SHARD_I}of${SHARD_N}.json`));
const ONLY = val('--only');
const FAST = args.includes('--fast');   // one alternative value per control; restore verified every 12 controls

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain' };
function serve(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, rsp) => {
      const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(f, (err, data) => {
        if (err) { rsp.writeHead(404); rsp.end(); return; }
        if (f.endsWith(path.sep + 'app.js')) data = Buffer.from(data.toString('utf-8').replace(/(await\s+)?loadExternalFonts\(\);/g, '/* skipped by the audit: 1,754 fonts are irrelevant here */'));
        rsp.writeHead(200, { 'Content-Type': (MIME[path.extname(f)] || 'application/octet-stream') + '; charset=utf-8' });
        rsp.end(data);
      });
    }).listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}/index.html` }));
  });
}

// ---- the audit document: real excerpt + a synthetic section with every structure
const full = fs.readFileSync(path.join(__dirname, '..', 'corpus', 'test_doc.txt'), 'utf-8').replace(/\r\n/g, '\n').split('\n');
const pool = full.map((l) => l.trim()).filter((l) => l.length > 60 && l.length < 500 && !/^(כותרת|שם|נושא|פרטי|מקום)/.test(l));
let k = 0; const P = () => pool[(k++ * 7) % pool.length];
const synthetic = ['כותרת 1 מספר 2 - חלק שני - בדיקת מבנים', 'כותרת 2 מספר 5 - סימן ה - נושא נוסף', ''];
for (let lvl = 0; lvl <= 6; lvl++) { synthetic.push(`כותרת ${lvl} - כותרת רמה ${lvl}`); synthetic.push(P()); synthetic.push(P() + ' [זוהי הערת שוליים קצרה לדוגמה] ועוד טקסט.'); }
synthetic.push('כותרת 7 - הערת צד לדוגמה'); synthetic.push(P());
synthetic.push(P() + ' (טקסט בסוגריים בתוך הפסקה) וממשיך הלאה.'); synthetic.push('הערת סיום - זוהי הערת סיום לדוגמה שמופיעה בסוף החלק.');
for (let i = 0; i < 6; i++) { synthetic.push(P()); synthetic.push(P() + ' [הערה ארוכה יותר, עם כמה מילים כדי לתפוס שורות באזור ההערות בתחתית העמוד.]'); }
const DOC = full.slice(0, 70).join('\n') + '\n' + synthetic.join('\n');

const SKIP_ID = /^(file-|raw-input|style-set-select|vp-|btn-|assets-folder-input|settings-search)/;

(async () => {
  const { chromium } = requirePlaywright();
  const { server, url } = await serve(ROOT);
  const browser = await chromium.launch();
  let page;
  const open = async () => {
    if (page) await page.close();
    page = await browser.newPage({ viewport: { width: 1500, height: 1500 } });
    page.on('dialog', (d) => d.dismiss());
    await page.goto(url, { waitUntil: 'load' });
    for (let i = 0; i < 480; i++) {                       // wait until the app has typeset once (init finished) or is ready
      const ok = await page.evaluate(() => window.__appReady === true || document.querySelectorAll('#book-container .a4-page').length > 0).catch(() => false);
      if (ok) break; await page.waitForTimeout(250);
    }
    await page.waitForTimeout(500);
    await page.addScriptTag({ content: `
      window.__sig = () => {
        const bc = document.getElementById('book-container');
        let h = bc ? bc.innerHTML : '';
        h = h.replace(/\\s(id|for|data-[a-z-]*id|aria-[a-z]+)="[^"]*"/g, '').replace(/url\\(#[^)]*\\)/g, 'url(#)').replace(/href="#[^"]*"/g, 'href="#"')
             .replace(/data:image[^"')]*/g, 'DATA').replace(/\\s+/g, ' ');
        const styles = Array.from(document.querySelectorAll('style')).map((s) => s.textContent.length + ':' + s.textContent.slice(0, 80)).join('|');
        const s = h + '|' + document.documentElement.style.cssText + '|' + document.documentElement.className + '|' + document.body.className + '|' + styles;
        let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
        return (x >>> 0).toString(16) + ':' + s.length + ':' + (bc ? bc.querySelectorAll('.a4-page').length : 0);
      };
      window.__run = () => { if (typeof typesetDocumentNow === 'function') typesetDocumentNow(); else if (typeof performTypeset === 'function') performTypeset(); else typesetDocument(0); };
      window.__ctl = (id) => document.getElementById(id);
    ` });
  };
  const typesetAndSig = async () => {
    await page.evaluate(() => window.__run());
    let last = '', stable = 0;
    for (let i = 0; i < 400; i++) {
      const s = await page.evaluate(() => window.__sig());
      if (s === last) stable++; else { stable = 0; last = s; }
      if (stable >= 2) return s; await page.waitForTimeout(120);
    }
    return last;
  };

  await open();
  await page.evaluate((doc) => { document.getElementById('raw-input').value = doc; }, DOC);
  const s0 = await typesetAndSig();
  const s0b = await typesetAndSig();
  console.log(`baseline signature ${s0} ${s0 === s0b ? '(stable)' : '(UNSTABLE: ' + s0b + ')'}`);
  if (s0 !== s0b) console.log('WARNING: typeset is not deterministic for this signature; results may contain false positives');

  const controls = await page.evaluate((skipSrc) => {
    const skip = new RegExp(skipSrc);
    const out = [];
    document.querySelectorAll('#settings-pane input[id], #settings-pane select[id], #settings-pane textarea[id]').forEach((el) => {
      if (skip.test(el.id) || ['file', 'button', 'submit', 'reset', 'image'].includes(el.type)) return;
      const c = { id: el.id, tag: el.tagName, type: el.type || el.tagName, value: el.type === 'checkbox' ? el.checked : el.value };
      if (el.tagName === 'SELECT') c.options = Array.from(el.options).map((o) => o.value);
      if (el.type === 'number' || el.type === 'range') { c.min = el.min; c.max = el.max; c.step = el.step; }
      out.push(c);
    });
    return out;
  }, SKIP_ID.source);
  console.log(`controls found: ${controls.length}`);

  const alts = (c) => {
    if (c.type === 'checkbox') return [!c.value];
    if (c.tag === 'SELECT') {
      const o = c.options.filter((v) => v !== c.value && v !== '');
      if (o.length <= 3) return o;
      return [o[0], o[Math.floor(o.length / 2)], o[o.length - 1]];
    }
    if (c.type === 'number' || c.type === 'range') {
      const v = parseFloat(c.value), step = parseFloat(c.step) || 1, min = c.min === '' ? -Infinity : parseFloat(c.min), max = c.max === '' ? Infinity : parseFloat(c.max);
      const cand = [];
      const up = v + Math.max(step, Math.abs(v) * 0.3 || 1), dn = v - Math.max(step, Math.abs(v) * 0.3 || 1);
      if (up <= max) cand.push(up); if (dn >= min) cand.push(dn);
      if (!cand.length) cand.push(isFinite(max) ? max : v + 1);
      return cand.slice(0, 2).map((x) => String(Math.round(x * 100) / 100));
    }
    if (c.type === 'color') return ['#ff0000'];
    return [String(c.value || '') + ' בדיקה'];
  };

  const mine = controls.filter((c, i) => i % SHARD_N === SHARD_I && (!ONLY || c.id === ONLY));
  const results = [];
  let n = 0;
  for (const c of mine) {
    n++;
    const rec = { id: c.id, type: c.type, default: c.value, alts: [] };
    const altList = FAST ? alts(c).slice(-1) : alts(c);
    for (const a of altList) {
      try {
        await page.evaluate(({ id, a }) => {
          const el = window.__ctl(id); if (!el) return;
          if (el.type === 'checkbox') el.checked = a; else el.value = a;
          el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
        }, { id: c.id, a });
        const s = await typesetAndSig();
        rec.alts.push({ value: a, changed: s !== s0, sig: s });
      } catch (e) { rec.alts.push({ value: a, error: String(e.message).slice(0, 80) }); }
      // restore
      await page.evaluate(({ id, v }) => {
        const el = window.__ctl(id); if (!el) return;
        if (el.type === 'checkbox') el.checked = v; else el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
      }, { id: c.id, v: c.value });
    }
    const sr = (!FAST || n % 12 === 0) ? await typesetAndSig() : s0;
    if (sr !== s0) {                                       // restore drift: start from a clean page
      rec.restoreDrift = true;
      await open(); await page.evaluate((doc) => { document.getElementById('raw-input').value = doc; }, DOC); await typesetAndSig();
    }
    rec.effect = rec.alts.some((x) => x.changed);
    results.push(rec);
    if (n % 20 === 0) console.log(`  ${n}/${mine.length} ...`);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ root: ROOT, baseline: s0, stable: s0 === s0b, total: controls.length, results }, null, 1));
  const noEff = results.filter((r) => !r.effect);
  console.log(`shard ${SHARD_I}/${SHARD_N}: controls=${results.length} with-effect=${results.length - noEff.length} no-effect=${noEff.length} drift=${results.filter((r) => r.restoreDrift).length}`);
  await browser.close(); server.close();
})().catch((e) => { console.error('AUDIT FAILED:', e.message); process.exit(2); });
