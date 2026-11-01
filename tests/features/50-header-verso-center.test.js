'use strict';
/* Fix: the centre slot of the running header on EVEN pages ignored its own font size and custom text
   (controls f-hdr-verso-c / s-hdr-verso-c / hdr-verso-c-custom existed in the UI of every version but were never read). */
const fs = require('fs');
const path = require('path');
const { typeset } = require('../lib/common');

const TEXT = fs.readFileSync(path.join(__dirname, '..', 'corpus', 'test_doc.txt'), 'utf-8').replace(/\r\n/g, '\n').split('\n').slice(0, 90).join('\n');

module.exports = (test) => {
  test('header verso centre: even pages use their own custom text and font size, odd pages keep theirs', async ({ page, assert }) => {
    await typeset(page, TEXT, {
      'hdr-distinct-even-odd': true,
      'hdr-c-type': 'custom', 'hdr-c-custom': 'מרכז-אי-זוגי', 's-hdr-c': 11,
      'hdr-verso-c-type': 'custom', 'hdr-verso-c-custom': 'מרכז-זוגי', 's-hdr-verso-c': 23,
    });
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#book-container .a4-page')).map((pg) => {
      const c = pg.querySelector('.top-header-grid .header-col-c');
      if (!c || !pg.querySelector('.main-column')) return null;   // content pages only (TOC pages use one header)
      return { idx: parseInt(pg.getAttribute('data-page-index'), 10), text: c.textContent.trim(), px: parseFloat(getComputedStyle(c).fontSize) };
    }).filter(Boolean));
    const even = rows.filter((r) => r.idx % 2 === 0), odd = rows.filter((r) => r.idx % 2 === 1);
    assert.ok(even.length >= 3 && odd.length >= 3, `not enough header pages: even=${even.length} odd=${odd.length}`);
    for (const r of even) { assert.strictEqual(r.text, 'מרכז-זוגי', 'even page ' + r.idx + ' text: ' + r.text); assert.ok(Math.abs(r.px - 23 * 96 / 72) < 0.6, 'even page ' + r.idx + ' font-size px ' + r.px); }
    for (const r of odd) { assert.strictEqual(r.text, 'מרכז-אי-זוגי', 'odd page ' + r.idx + ' text: ' + r.text); assert.ok(Math.abs(r.px - 11 * 96 / 72) < 0.6, 'odd page ' + r.idx + ' font-size px ' + r.px); }
  });
};
