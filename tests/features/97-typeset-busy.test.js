'use strict';
/* The "update and re-typeset" button shows a busy state before the browser blocks, and clears it afterwards. */
const fs = require('fs');
const path = require('path');
const { typeset } = require('../lib/common');

const TEXT = fs.readFileSync(path.join(__dirname, '..', 'corpus', 'test_doc.txt'), 'utf-8').replace(/\r\n/g, '\n').split('\n').slice(0, 80).join('\n');

module.exports = (test) => {
  test('busy indicator: shown while the re-typeset button runs, removed afterwards, result unchanged', async ({ page, assert }) => {
    await typeset(page, TEXT, {});
    const pagesBefore = await page.evaluate(() => document.querySelectorAll('#book-container .a4-page').length);
    await page.evaluate(() => {
      window.__busySeen = false;
      new MutationObserver(() => { if (document.body.classList.contains('is-typesetting')) window.__busySeen = true; }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
      document.getElementById('btn-retypeset').click();
    });
    await page.waitForFunction(() => window.__busySeen === true && !document.body.classList.contains('is-typesetting'), null, { timeout: 60000 });
    const r = await page.evaluate(() => ({ pages: document.querySelectorAll('#book-container .a4-page').length, busy: document.body.classList.contains('is-typesetting') }));
    assert.strictEqual(r.busy, false);
    assert.strictEqual(r.pages, pagesBefore, 'page count changed after re-typeset');
  });
};
