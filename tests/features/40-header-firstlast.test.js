'use strict';
/* Port from V20.4: running header of type "first word - last word of the page" (was always empty before). */
const fs = require('fs');
const path = require('path');
const { typeset } = require('../lib/common');

const TEXT = fs.readFileSync(path.join(__dirname, '..', 'corpus', 'test_doc.txt'), 'utf-8').replace(/\r\n/g, '\n').split('\n').slice(0, 90).join('\n');

module.exports = (test) => {
  test('header first/last word: filled on every body page, matching the page text', async ({ page, assert }) => {
    const pages = await typeset(page, TEXT, { 'hdr-r-type': 'first_word_last_word' });
    assert.ok(pages > 5, 'document too short: ' + pages);
    const res = await page.evaluate(() => {
      const TRIM = /^[\s"'“”‘’(){}\[\]<>.,;:!?\-–—…]+|[\s"'“”‘’(){}\[\]<>.,;:!?\-–—…]+$/g;
      const wordsOf = (el) => {
        let s = '';
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest('.note-marker')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
        while (w.nextNode()) s += w.currentNode.nodeValue;
        return s.split(/\s+/).map((x) => x.replace(TRIM, '')).filter(Boolean);
      };
      const rows = [];
      document.querySelectorAll('#book-container .a4-page').forEach((pg) => {
        const holders = pg.querySelectorAll('.hdr-firstlast');
        if (!holders.length) return;
        const paras = [...pg.querySelectorAll('.main-column p, .single-wide-col p')];
        let first = '', last = '';
        for (let i = 0; i < paras.length && !first; i++) { const w = wordsOf(paras[i]); if (w.length) first = w[0]; }
        for (let i = paras.length - 1; i >= 0 && !last; i--) { const w = wordsOf(paras[i]); if (w.length) last = w[w.length - 1]; }
        rows.push({ got: holders[0].textContent, nParas: paras.length, first, last });
      });
      return rows;
    });
    assert.ok(res.length >= 3, 'expected header placeholders on several pages, got ' + res.length);
    const withText = res.filter((r) => r.nParas > 0);
    assert.ok(withText.length >= 3);
    for (const r of withText) {
      assert.ok(r.got.length > 0, 'empty first/last header on a page with text');
      assert.ok(r.got.startsWith(r.first) && r.got.endsWith(r.last), `header "${r.got}" does not match first="${r.first}" last="${r.last}"`);
    }
  });
};
