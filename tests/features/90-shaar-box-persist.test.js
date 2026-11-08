'use strict';
/* Cover text-box positions dragged by the user are applied on re-typeset, persisted in localStorage as user overrides
   (separately from the positions that come with the cover JSON files) and restored after a reload. Reset returns to the
   JSON position (or to the default when the cover has none). */
const { typeset } = require('../lib/common');
const DOC = ['שם הספר - בדיקת שער', 'נושא - כותרת משנה', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א - נושא', '', 'טקסט פסקה לדוגמה. '.repeat(20)].join('\n');

async function dragMainBox(page) {
  const bar = page.locator('.shaar-main-content .shaar-drag-bar').first();
  await bar.evaluate((el) => { el.style.display = 'block'; el.style.opacity = '1'; });
  const bb = await bar.boundingBox();
  if (!bb) throw new Error('drag bar not found');
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.mouse.down();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2 + 60, { steps: 6 });
  await page.mouse.up();
}
const topOf = (page) => page.locator('.shaar-main-content.theme-bounded-content').first().evaluate((el) => ({ id: el.getAttribute('data-shaar-id'), top: el.style.top }));
const waitReady = (page) => page.waitForFunction(() => window.__appReady === true, null, { timeout: 120000 });

module.exports = (test) => {
  test('shaar box position (theme cover): dragged position is applied, persisted, restored after reload and reset clears it', async ({ page, assert }) => {
    await typeset(page, DOC, {});
    await page.locator('.shaar-main-content.theme-bounded-content').first().scrollIntoViewIfNeeded();
    const before = await topOf(page);
    assert.ok(before.id, 'main cover has no data-shaar-id');
    await dragMainBox(page);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('orange.shaarBoxPositions') || '{}'));
    const saved = stored.main && stored.main[before.id];
    assert.ok(saved && saved.top, 'position was not persisted: ' + JSON.stringify(stored).slice(0, 200));
    assert.notStrictEqual(parseFloat(saved.top).toFixed(0), parseFloat(before.top).toFixed(0), 'the box did not move');
    await typeset(page, DOC, {});
    assert.strictEqual(parseFloat((await topOf(page)).top).toFixed(1), parseFloat(saved.top).toFixed(1), 'saved position not applied on re-typeset');
    await page.reload({ waitUntil: 'load' }); await waitReady(page);
    await typeset(page, DOC, {});
    assert.strictEqual(parseFloat((await topOf(page)).top).toFixed(1), parseFloat(saved.top).toFixed(1), 'position lost after reload');
    await page.evaluate(() => resetCurrentShaarBoxPosition('main'));
    await page.waitForTimeout(800);
    const cleared = await page.evaluate(() => JSON.parse(localStorage.getItem('orange.shaarBoxPositions') || '{}'));
    assert.ok(!(cleared.main && cleared.main[before.id]), 'reset did not clear the persisted position');
  }, { settleMs: 2500 });

  test('shaar box position (JSON cover): the user override survives a reload and beats the position inside the JSON; reset restores the JSON one', async ({ page, assert }) => {
    await typeset(page, DOC, {});
    const jsonId = await page.evaluate(() => Object.keys(window.shaarBoxJsonPositions.main)[0]);
    assert.ok(jsonId, 'no JSON cover with a box position');
    const select = (id) => page.evaluate((v) => { const el = document.getElementById('select-shaar-main'); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); }, id);
    await select(jsonId); await page.waitForTimeout(800);
    await page.locator('.shaar-main-content.theme-bounded-content').first().scrollIntoViewIfNeeded();
    const orig = await topOf(page);
    assert.strictEqual(orig.id, jsonId);
    const jsonTop = await page.evaluate((id) => window.shaarBoxJsonPositions.main[id].top, jsonId);
    assert.strictEqual(parseFloat(orig.top).toFixed(1), parseFloat(jsonTop).toFixed(1), 'JSON position not used initially');
    await dragMainBox(page);
    const moved = await topOf(page);
    assert.notStrictEqual(parseFloat(moved.top).toFixed(0), parseFloat(orig.top).toFixed(0), 'the box did not move');
    const userTop = await page.evaluate((id) => window.shaarBoxUserPositions.main[id].top, jsonId);

    await page.reload({ waitUntil: 'load' }); await waitReady(page);
    await typeset(page, DOC, {});
    await select(jsonId); await page.waitForTimeout(800);
    assert.strictEqual(parseFloat((await topOf(page)).top).toFixed(1), parseFloat(userTop).toFixed(1), 'user override lost after reload (JSON position won)');

    await page.evaluate(() => resetCurrentShaarBoxPosition('main'));
    await page.waitForTimeout(800);
    assert.strictEqual(parseFloat((await topOf(page)).top).toFixed(1), parseFloat(jsonTop).toFixed(1), 'reset did not restore the JSON position');
  }, { settleMs: 2500 });
};
