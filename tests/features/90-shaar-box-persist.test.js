'use strict';
/* Cover text-box positions dragged by the user are applied on re-typeset (already in the base) and now also survive a reload. */
const { typeset } = require('../lib/common');
const DOC = ['שם הספר - בדיקת שער', 'נושא - כותרת משנה', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א - נושא', '', 'טקסט פסקה לדוגמה. '.repeat(20)].join('\n');

module.exports = (test) => {
  test('shaar box position: a dragged position is applied, persisted in localStorage and restored after reload', async ({ page, assert }) => {
    await typeset(page, DOC, {});
    const box = page.locator('.shaar-main-content.theme-bounded-content').first();
    await box.scrollIntoViewIfNeeded();
    const before = await box.evaluate((el) => ({ id: el.getAttribute('data-shaar-id'), top: el.style.top }));
    assert.ok(before.id, 'main cover has no data-shaar-id');
    // drag the box with the real handle (mouse), like the user does
    const bar = page.locator('.shaar-main-content .shaar-drag-bar').first();
    await bar.evaluate((el) => { el.style.display = 'block'; el.style.opacity = '1'; });
    const bb = await bar.boundingBox();
    assert.ok(bb, 'drag bar not found');
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await page.mouse.down();
    await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2 + 60, { steps: 6 });
    await page.mouse.up();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('orange.shaarBoxPositions') || '{}'));
    const saved = stored.main && stored.main[before.id];
    assert.ok(saved && saved.top, 'position was not persisted: ' + JSON.stringify(stored).slice(0, 200));
    assert.notStrictEqual(parseFloat(saved.top).toFixed(0), parseFloat(before.top).toFixed(0), 'the box did not move');

    // re-typeset: applied (in-session behaviour) ...
    await typeset(page, DOC, {});
    const again = await page.locator('.shaar-main-content.theme-bounded-content').first().evaluate((el) => el.style.top);
    assert.strictEqual(parseFloat(again).toFixed(1), parseFloat(saved.top).toFixed(1), 'saved position not applied on re-typeset');

    // ... and after a full reload (new in this version)
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => window.__appReady === true, null, { timeout: 120000 });
    await typeset(page, DOC, {});
    const reloaded = await page.locator('.shaar-main-content.theme-bounded-content').first().evaluate((el) => el.style.top);
    assert.strictEqual(parseFloat(reloaded).toFixed(1), parseFloat(saved.top).toFixed(1), 'position lost after reload');

    // reset clears it
    await page.evaluate(() => resetCurrentShaarBoxPosition('main'));
    await page.waitForTimeout(800);
    const cleared = await page.evaluate(() => JSON.parse(localStorage.getItem('orange.shaarBoxPositions') || '{}'));
    assert.ok(!(cleared.main && cleared.main[before.id]), 'reset did not clear the persisted position');
  }, { settleMs: 2500 });
};
