'use strict';
/* Decisions confirmed by the user: second "apply changes" button, toasts instead of alert(), saved cover-box list with
   reset/export, and "a note on a separate line is invalid input" (lines are no longer joined into the previous line). */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { typeset, openSettings } = require('../lib/common');

const SMALL = ['שם הספר - בדיקה', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א - נושא', '', 'טקסט פסקה לדוגמה. '.repeat(12)].join('\n');

module.exports = (test) => {
  test('apply button: a second "apply changes" button in the settings header, pending state shared, click re-typesets', async ({ page, assert }) => {
    await typeset(page, SMALL, {});
    await openSettings(page);
    const exists = await page.evaluate(() => !!document.querySelector('.settings-top-bar #btn-apply-settings'));
    assert.ok(exists, 'button missing in the settings header');
    await page.evaluate(() => { const el = document.getElementById('size-body'); el.value = '11'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(300);
    let st = await page.evaluate(() => ({ a: document.getElementById('btn-apply-settings').classList.contains('has-pending-changes'), b: document.getElementById('btn-retypeset').classList.contains('has-pending-changes') }));
    assert.deepStrictEqual(st, { a: true, b: true }, 'both buttons should show pending changes');
    await page.evaluate(() => { window.__pt = 0; const o = window.performTypeset; window.performTypeset = function () { window.__pt++; return o.apply(this, arguments); }; });
    await page.click('#btn-apply-settings');
    await page.waitForFunction(() => window.__pt >= 1 && !document.body.classList.contains('is-typesetting'), null, { timeout: 60000 });
    st = await page.evaluate(() => ({ a: document.getElementById('btn-apply-settings').classList.contains('has-pending-changes'), b: document.getElementById('btn-retypeset').classList.contains('has-pending-changes') }));
    assert.deepStrictEqual(st, { a: false, b: false }, 'pending state not cleared after applying');
  }, { settleMs: 2000 });

  test('toast: an invalid settings file shows a non-blocking toast (no alert dialog)', async ({ page, assert }) => {
    let dialogs = 0;
    page.on('dialog', (d) => { dialogs++; d.dismiss(); });
    await openSettings(page);
    const bad = path.join(os.tmpdir(), 'orange-bad-settings.json');
    fs.writeFileSync(bad, '{ not json');
    await page.setInputFiles('#file-import-settings', bad);
    await page.waitForSelector('.app-toast-error', { timeout: 5000 });
    const text = await page.evaluate(() => document.querySelector('.app-toast-error').textContent);
    assert.ok(/שגיאת ייבוא/.test(text), 'unexpected toast: ' + text);
    assert.strictEqual(dialogs, 0, 'a blocking dialog appeared');
  }, { settleMs: 2000 });

  test('saved cover boxes: list shows entries, per-entry reset, reset-all with confirmation, export downloads the JSON cover file', async ({ page, assert }) => {
    await typeset(page, SMALL, {});
    await openSettings(page);
    const jsonId = await page.evaluate(() => Object.keys(window.shaarBoxJsonPositions.main)[0]);
    assert.ok(jsonId, 'no JSON cover with a box position');
    assert.strictEqual(await page.evaluate(() => document.querySelectorAll('#shaar-calib-list .calib-row').length), 0, 'positions that come from the JSON files must not be listed as user changes');
    await page.evaluate((id) => {
      setUserShaarPosition('main', id, { top: '33.0', bottom: '40.0', right: '10.0', left: '10.0' });
      setUserShaarPosition('main', 'theme_default:builtin_1', { top: '40.0', bottom: '30.0', right: '12.0', left: '12.0' });
      persistShaarBoxPositions();
    }, jsonId);
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#shaar-calib-list .calib-row')).map((r) => r.textContent));
    assert.strictEqual(rows.length, 2, 'rows: ' + JSON.stringify(rows));
    assert.ok(rows.some((t) => /בדפדפן בלבד/.test(t)), 'theme cover should be marked browser-only');

    // export: only the JSON cover is exportable
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.evaluate(() => exportAllShaarPositions())]);
    const file = path.join(os.tmpdir(), 'orange-shaar-export.json');
    await dl.saveAs(file);
    const exported = JSON.parse(fs.readFileSync(file, 'utf-8'));
    assert.ok(JSON.stringify(exported).includes(jsonId), 'exported file does not contain the cover');

    // per-entry reset
    await page.evaluate(() => document.querySelector('#shaar-calib-list .calib-row .btn-tool').click());   // the panel may be collapsed, so click via the DOM
    await page.waitForTimeout(500);
    assert.strictEqual(await page.evaluate(() => document.querySelectorAll('#shaar-calib-list .calib-row').length), 1);
    // the JSON cover goes back to its own JSON position when its override is removed
    const back = await page.evaluate((id) => JSON.stringify(window.shaarBoxSavedPositions.main[id]) === JSON.stringify(window.shaarBoxJsonPositions.main[id]) || !window.shaarBoxUserPositions.main[id], jsonId);
    assert.ok(back, 'effective position not restored to the JSON one');
    // reset all (confirm dialog)
    page.once('dialog', (d) => d.accept());
    await page.evaluate(() => resetAllShaarBoxPositions());
    await page.waitForTimeout(500);
    assert.strictEqual(await page.evaluate(() => document.querySelectorAll('#shaar-calib-list .calib-row').length), 0);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('orange.shaarBoxPositions') || '{}'));
    assert.deepStrictEqual([Object.keys(stored.main || {}).length, Object.keys(stored.sub || {}).length, Object.keys(stored.back || {}).length], [0, 0, 0]);
  }, { settleMs: 2000 });

  test('notes: a note on a separate line is not joined to the line before it (heading stays a heading)', async ({ page, assert }) => {
    const doc = ['שם הספר - בדיקה', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א - נושא', '', 'כותרת 4 - הגדרה', ' [הערה בתחילת שורה] וסדר הדברים הוא כך, ועוד טקסט של הפסקה. '.repeat(3), 'פסקה רגילה אחריה. '.repeat(5)].join('\n');
    await typeset(page, doc, {});
    const toks = await page.evaluate(() => globalTokens.map((t) => ({ type: t.type, text: (t.text || '').slice(0, 40) })));
    const h = toks.find((t) => t.type === 'h4');
    assert.ok(h && h.text === 'הגדרה', 'heading swallowed the next line: ' + JSON.stringify(h));
    assert.ok(toks.some((t) => t.type === 'p' && t.text.startsWith('[')), 'paragraph starting with a note not found: ' + JSON.stringify(toks));
  });
};
