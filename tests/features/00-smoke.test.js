'use strict';
const { typeset } = require('../lib/common');

const SMALL = [
  'שם הספר - מסמך בדיקה', '',
  'כותרת 1 - חלק ראשון', 'כותרת 2 - סימן א - נושא', '',
  'זהו פסקה ראשונה של בדיקה, עם מספיק טקסט כדי לתפוס כמה שורות בעמוד ולבדוק שהמנוע עובד כראוי ושאין שגיאות. '.repeat(6),
  'כותרת 3 - דין', 'פסקה נוספת [הערת שוליים קצרה] ועוד טקסט שממשיך להתפרס. '.repeat(8),
].join('\n');

module.exports = (test) => {
  test('smoke: app loads without JavaScript errors', async ({ errors }) => {
    if (errors.length) throw new Error('JS errors on load: ' + errors.join(' | '));
  });

  test('smoke: a small document typesets into A4 pages', async ({ page, errors, assert }) => {
    const pages = await typeset(page, SMALL, {});
    assert.ok(pages >= 1, 'expected at least one page, got ' + pages);
    assert.strictEqual(errors.length, 0, 'JS errors: ' + errors.join(' | '));
  });

  test('smoke: data files populated the cover / ornament pickers', async ({ page, assert }) => {
    const n = await page.evaluate(() => ({
      main: document.querySelectorAll('#select-shaar-main option').length,
      h2: document.querySelectorAll('#h2-ornament-set option').length,
      div: document.querySelectorAll('#section-divider-style option').length,
    }));
    assert.ok(n.main > 10, 'cover list too short: ' + n.main);
    assert.ok(n.h2 > 10, 'h2 ornament list too short: ' + n.h2);
    assert.ok(n.div > 10, 'divider list too short: ' + n.div);
  });
};
