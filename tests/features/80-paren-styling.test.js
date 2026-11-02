'use strict';
/* Port from V21: text inside parentheses is styled (font / relative or fixed size). New implementation in the base:
   token pre-pass with invisible range markers, read identically by the measurement and the renderer. */
const fs = require('fs');
const path = require('path');
const { typeset } = require('../lib/common');

const checker = fs.readFileSync(path.join(__dirname, '..', 'layout', 'check_layout.js'), 'utf-8');
const W = (n, w = 'מילה') => Array.from({ length: n }, (_, i) => w + (i % 5)).join(' ');
const HEAD = ['שם הספר - בדיקת סוגריים', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א - נושא', ''];

const info = (page) => page.evaluate(() => {
  const spans = Array.from(document.querySelectorAll('#book-container .paren-style'));
  const body = document.querySelector('#book-container .main-column p, #book-container .single-wide-col p');
  const bodyPx = body ? parseFloat(getComputedStyle(body).fontSize) : 0;
  return {
    n: spans.length, texts: spans.map((s) => s.textContent), px: spans.map((s) => parseFloat(getComputedStyle(s).fontSize)),
    fam: spans.map((s) => getComputedStyle(s).fontFamily), bodyPx,
    markers: /[\uE001\uE002]/.test(document.getElementById('book-container').textContent),
  };
});

module.exports = (test) => {
  test('paren styling: relative size, nested pairs form one range, notes inside stay notes, no markers leak', async ({ page, assert }) => {
    const doc = HEAD.concat([
      `פתיחה (${W(3)}) אמצע (חיצוני (פנימי) המשך) סוף.`,
      `משפט (שיש בו [הערה פנימית] בתוך הסוגריים) ועוד [הערה (עם סוגריים) בתוכה] ללא עיצוב.`,
    ]).join('\n');
    await typeset(page, doc, {});
    const r = await info(page);
    assert.strictEqual(r.markers, false, 'invisible markers leaked into the page');
    assert.strictEqual(r.n, 3, 'expected 3 styled ranges, got ' + r.n + ': ' + JSON.stringify(r.texts));
    assert.ok(r.texts.some((t) => /^\(חיצוני \(פנימי\) המשך\)$/.test(t)), 'nested pair must be a single range: ' + JSON.stringify(r.texts));
    assert.ok(r.texts.some((t) => /שיש בו.*בתוך הסוגריים\)$/.test(t)), 'range containing a footnote marker missing');
    for (const px of r.px) assert.ok(Math.abs(px - (r.bodyPx - 2 * 96 / 72)) < 0.6, `size ${px}px != body ${r.bodyPx}px - 2pt`);
    const notes = await page.evaluate(() => document.querySelectorAll('#book-container .note-marker').length);
    assert.strictEqual(notes, 2, 'footnotes lost or swallowed by the paren range: ' + notes);
  });

  test('paren styling: a parenthetical open across paragraphs is styled; an unclosed one is not', async ({ page, assert }) => {
    const doc = HEAD.concat([
      `פסקה ראשונה (שנפתחת כאן ${W(8)}`,
      `פסקה אמצעית שלמה בתוך הסוגריים ${W(8)}`,
      `ומסתיימת כאן) ואחריה טקסט רגיל ${W(5)}`,
      `כותרת 3 - פרק חדש`,
      `פסקה עם סוגריים שלא נסגרים (ולכן אינה מעוצבת ${W(6)}`,
      `פסקה נוספת בלי סגירה ${W(6)}`,
      `ועוד פסקה ${W(6)}`,
      `ועוד אחת ${W(6)}`,
      `סוף ${W(4)}`,
    ]).join('\n');
    await typeset(page, doc, {});
    const r = await info(page);
    assert.strictEqual(r.markers, false);
    const joined = r.texts.join(' | ');
    // the first word of each paragraph is the (unstyled) drop word, so the ranges start after it
    assert.ok(/שנפתחת כאן/.test(joined) && /אמצעית שלמה בתוך הסוגריים/.test(joined) && /כאן\)/.test(joined), 'cross-paragraph range not fully styled: ' + joined.slice(0, 300));
    assert.ok(!/שלא נסגרים|ולכן אינה/.test(joined), 'an unclosed "(" must not be styled: ' + joined.slice(0, 300));
  });

  test('paren styling: fixed size and font apply; off when delta is 0 and no font', async ({ page, assert }) => {
    const doc = HEAD.concat([`טקסט (בסוגריים ${W(4)}) והמשך.`]).join('\n');
    await typeset(page, doc, { 's-paren-mode': 'fixed', 's-paren': 9, 'f-paren': "'Frank Ruhl Libre', serif" });
    let r = await info(page);
    assert.strictEqual(r.n, 1);
    assert.ok(Math.abs(r.px[0] - 9 * 96 / 72) < 0.6, 'fixed size px ' + r.px[0]);
    assert.ok(/Frank Ruhl Libre/.test(r.fam[0]), 'font not applied: ' + r.fam[0]);
    await typeset(page, doc, { 's-paren-mode': 'relative', 's-paren': 0, 'f-paren': '' });
    r = await info(page);
    assert.strictEqual(r.n, 0, 'styling should be off');
    assert.strictEqual(r.markers, false);
  });

  test('paren styling: a range cut across column/page fragments stays styled on both sides and the layout is valid', async ({ page, assert }) => {
    await page.addScriptTag({ content: checker });
    const filler = Array.from({ length: 6 }, (_, i) => `פסקת מילוי ${i} ${W(60)}.`);
    const doc = HEAD.concat(filler, [`התחלה (${W(260, 'ארוך')}) סיום ${W(20)}.`], filler).join('\n');
    await typeset(page, doc, {});
    const r = await page.evaluate(() => {
      const frags = Array.from(document.querySelectorAll('#book-container p[data-token-id]')).filter((p) => /ארוך/.test(p.textContent));
      const byTok = {};
      frags.forEach((p) => { (byTok[p.getAttribute('data-token-id')] = byTok[p.getAttribute('data-token-id')] || []).push(p); });
      const toks = Object.values(byTok).sort((a, b) => b.length - a.length)[0] || [];
      let inside = 0, total = 0;
      toks.forEach((p) => { total += (p.textContent.match(/ארוך\d/g) || []).length; p.querySelectorAll('.paren-style').forEach((s) => { inside += (s.textContent.match(/ארוך\d/g) || []).length; }); });
      return { frags: toks.length, inside, total, viol: window.__checkLayout({}).filter((v) => v.type !== 'GRANULARITY(ok)') };
    });
    assert.ok(r.frags >= 2, 'paragraph was not cut (fragments=' + r.frags + ')');
    assert.strictEqual(r.inside, r.total, `words of the range left unstyled across the cut: ${r.inside}/${r.total}`);
    assert.deepStrictEqual(r.viol, [], 'layout violations: ' + JSON.stringify(r.viol).slice(0, 300));
  });

  test('paren styling: controls exist; default is relative -2', async ({ page, assert }) => {
    const v = await page.evaluate(() => ({ mode: document.getElementById('s-paren-mode').value, d: document.getElementById('s-paren').value, f: document.getElementById('f-paren').value, opts: document.querySelectorAll('#f-paren option').length }));
    assert.strictEqual(v.mode, 'relative'); assert.strictEqual(String(parseFloat(v.d)), '-2'); assert.strictEqual(v.f, ''); assert.ok(v.opts > 5);
  });
};
