'use strict';
/* Port from V20.4: editing cover fields refreshes only the cover pages (no full re-typeset). */
const fs = require('fs');
const path = require('path');
const { typeset, openSettings } = require('../lib/common');

const BODY = fs.readFileSync(path.join(__dirname, '..', 'corpus', 'test_doc.txt'), 'utf-8').replace(/\r\n/g, '\n').split('\n')
  .filter((l) => !/^(שם הספר|נושא|פרטי|שם המחבר|מקום)/.test(l)).slice(0, 90).join('\n');

module.exports = (test) => {
  test('cover refresh: editing a cover field swaps only the cover pages and does not re-typeset', async ({ page, assert }) => {
    await typeset(page, BODY, {});
    await openSettings(page);
    await page.evaluate(() => {
      window.__pt = 0;
      const orig = window.performTypeset;
      window.performTypeset = function () { window.__pt++; return orig.apply(this, arguments); };
      const pages = document.querySelectorAll('#book-container .a4-page');
      window.__bodyPage = pages[pages.length - 2];
      window.__nPages = pages.length;
    });
    // 1) type into a cover field
    await page.evaluate(() => {
      const el = document.getElementById('inp-book-subtitle'); el.value = 'כותרת-משנה-חדשה-לבדיקה';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(700);
    let r = await page.evaluate(() => ({
      pt: window.__pt, same: window.__bodyPage.isConnected, n: document.querySelectorAll('#book-container .a4-page').length,
      cover: (document.querySelector('#book-container .main-shaar-page') || {}).textContent || '',
    }));
    assert.strictEqual(r.pt, 0, 'a full re-typeset ran (' + r.pt + ')');
    assert.ok(r.same, 'body pages were re-created');
    assert.strictEqual(r.n, await page.evaluate(() => window.__nPages));
    assert.ok(r.cover.includes('כותרת-משנה-חדשה-לבדיקה'), 'cover text not updated');
    // 2) the title also appears in headers/TOC -> the "re-typeset" button is flagged as pending
    await page.evaluate(() => { const el = document.getElementById('inp-book-title'); el.value = 'שם-חדש-לבדיקה'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(500);
    r = await page.evaluate(() => ({ pt: window.__pt, cover: document.querySelector('#book-container .main-shaar-page').textContent, pending: document.getElementById('btn-retypeset').classList.contains('has-pending-changes') }));
    assert.strictEqual(r.pt, 0);
    assert.ok(r.cover.includes('שם-חדש-לבדיקה'));
    assert.ok(r.pending, 'title change should flag pending changes');
    // 3) a non-cover control still only flags pending (no live typeset)
    await page.evaluate(() => { const el = document.getElementById('size-body'); el.value = '11'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(500);
    assert.strictEqual(await page.evaluate(() => window.__pt), 0);
  }, { settleMs: 2500 });

  test('cover refresh: picking another main cover swaps the cover page in place', async ({ page, assert }) => {
    await typeset(page, BODY, {});
    await openSettings(page);
    await page.evaluate(() => { window.__pt = 0; const o = window.performTypeset; window.performTypeset = function () { window.__pt++; return o.apply(this, arguments); }; window.__before = document.querySelector('#book-container .main-shaar-page').innerHTML; });
    await page.evaluate(() => { const el = document.getElementById('select-shaar-main'); el.value = 'builtin_2'; el.dispatchEvent(new Event('change', { bubbles: true })); });   // the select is replaced by a visual picker, so drive it directly
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({ pt: window.__pt, changed: document.querySelector('#book-container .main-shaar-page').innerHTML !== window.__before }));
    assert.strictEqual(r.pt, 0, 'full re-typeset ran');
    assert.ok(r.changed, 'main cover did not change');
  }, { settleMs: 2500 });
};
