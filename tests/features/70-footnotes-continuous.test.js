'use strict';
/* Port from V21: "continuous" footnote layout (notes flow as running text instead of one line each). */
const fs = require('fs');
const path = require('path');
const { typeset } = require('../lib/common');

const checker = fs.readFileSync(path.join(__dirname, '..', 'layout', 'check_layout.js'), 'utf-8');
const NOTE = (n) => ` [הערה מספר ${n} קצרה לדוגמה עם כמה מילים]`;
const PARA = 'פסקת בדיקה ארוכה מספיק כדי שתהיה על העמוד' + NOTE(1) + ' ועוד טקסט שממשיך להתפרס כך שיהיו מספר הערות שוליים בעמוד אחד' + NOTE(2) + ' ועוד קצת טקסט כדי למלא שורות' + NOTE(3) + ' וסיום הפסקה' + NOTE(4) + '.';
const DOC = ['שם הספר - הערות רציפות', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א - נושא', '', PARA, PARA, PARA].join('\n');

const noteInfo = (page) => page.evaluate(() => {
  const b = document.querySelector('.footnote-area .note-block');
  if (!b) return null;
  const line = b.querySelector('.note-line');
  return { cont: b.classList.contains('continuous-mode'), display: getComputedStyle(line).display, lines: b.querySelectorAll('.note-line').length, h: b.getBoundingClientRect().height };
});

module.exports = (test) => {
  test('continuous footnotes: notes flow inline, take less height than one-line-per-note, layout stays valid', async ({ page, assert }) => {
    await page.addScriptTag({ content: checker });
    await typeset(page, DOC, { 'fn-layout-mode': 'block' });
    const block = await noteInfo(page);
    assert.ok(block && block.lines >= 3, 'expected a footnote block with several notes: ' + JSON.stringify(block));
    assert.strictEqual(block.cont, false);
    assert.strictEqual(block.display, 'block');

    await typeset(page, DOC, { 'fn-layout-mode': 'continuous' });
    const cont = await noteInfo(page);
    assert.ok(cont && cont.cont, 'continuous-mode class missing');
    assert.strictEqual(cont.display, 'inline');
    assert.strictEqual(cont.lines, block.lines, 'notes lost or duplicated');
    assert.ok(cont.h < block.h, `continuous block (${cont.h}px) should be shorter than block layout (${block.h}px)`);
    const viol = await page.evaluate(() => window.__checkLayout({}).filter((v) => v.type !== 'GRANULARITY(ok)'));
    assert.deepStrictEqual(viol, [], 'layout violations: ' + JSON.stringify(viol).slice(0, 300));
  });

  test('continuous footnotes: control exists and defaults to separate lines', async ({ page, assert }) => {
    assert.strictEqual(await page.evaluate(() => document.getElementById('fn-layout-mode').value), 'block');
  });
};
