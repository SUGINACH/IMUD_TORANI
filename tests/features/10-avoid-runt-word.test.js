'use strict';
/* Port from V20.5: the last two words of a paragraph stay together ("no runt word on the last line"). */
module.exports = (test) => {
  test('avoid-runt-word: removes single-word last lines without changing the line count', async ({ page, assert }) => {
    const res = await page.evaluate(() => {
      const style = { fontFamily: 'serif', fontSize: '12pt', lineHeight: '1.4' };
      const wordsPool = ['בראשית', 'ברא', 'אלהים', 'את', 'השמים', 'ואת', 'הארץ', 'והארץ', 'היתה', 'תהו', 'ובהו'];
      const mk = (n) => Array.from({ length: n }, (_, i) => wordsPool[i % wordsPool.length] + (i % 7 === 0 ? 'ם' : '')).join(' ');
      const lastWords = (l) => l.lines[l.lines.length - 1].split(/[\s\u00A0]+/).filter(Boolean).length;
      const cb = document.getElementById('avoid-runt-word');
      let runtsOff = 0, runtsOn = 0, lineDiff = 0, tested = 0;
      for (let n = 12; n <= 90; n++) {
        const text = mk(n);
        cb.checked = false; const off = getLinesFromParagraph(text, 320, style, false);
        cb.checked = true;  const on = getLinesFromParagraph(text, 320, style, false);
        tested++;
        if (off.lines.length >= 2 && lastWords(off) === 1) runtsOff++;
        if (on.lines.length >= 2 && lastWords(on) === 1) runtsOn++;
        if (off.lines.length !== on.lines.length) lineDiff++;
      }
      cb.checked = true;
      return { tested, runtsOff, runtsOn, lineDiff };
    });
    assert.ok(res.runtsOff > 0, 'test did not produce any runt line to remove: ' + JSON.stringify(res));
    assert.strictEqual(res.runtsOn, 0, 'runt lines remain with the option on: ' + JSON.stringify(res));
    assert.strictEqual(res.lineDiff, 0, 'line count changed: ' + JSON.stringify(res));
  });

  test('avoid-runt-word: option exists in the settings panel and defaults to on', async ({ page, assert }) => {
    const on = await page.evaluate(() => document.getElementById('avoid-runt-word')?.checked);
    assert.strictEqual(on, true);
  });
};
