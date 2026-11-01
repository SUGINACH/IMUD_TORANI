'use strict';
/* Port from V21: ornaments between consecutive headings of the same level (h3-h6) and on the cover pages. */
const fs = require('fs');
const path = require('path');
const { typeset } = require('../lib/common');
const { DIVIDER_ID } = require('../layout/scenarios');

const checker = fs.readFileSync(path.join(__dirname, '..', 'layout', 'check_layout.js'), 'utf-8');
const P = (n) => ('טקסט פסקה לדוגמה שממלא כמה שורות בעמוד כדי שהכותרות לא ייפלו בראש טור, ' + 'והוא חוזר על עצמו. ').repeat(n);
const DOC = [
  'שם הספר - בדיקת עיטורי הפרדה', 'נושא - כותרת משנה לבדיקה', '',
  'כותרת 1 - חלק ראשון', 'כותרת 2 - סימן א - נושא', '',
  'כותרת 3 - א', P(3),
  'כותרת 4 - א1', P(4),
  'כותרת 4 - א2', P(4),
  'כותרת 5 - א2א', P(3),
  'כותרת 5 - א2ב', P(3),
  'כותרת 3 - ב', P(3),
  'כותרת 4 - ב1', P(4),
  'כותרת 4 - ב2', P(4),
].join('\n');

const dividersInfo = (page) => page.evaluate(() => Array.from(document.querySelectorAll('.main-column .heading-divider-wrap, .single-wide-col .heading-divider-wrap')).map((d) => ({
  next: d.nextElementSibling ? (d.nextElementSibling.className.match(/title-level-\d/) || ['?'])[0] + ':' + d.nextElementSibling.textContent.trim().slice(0, 6) : null,
})));

module.exports = (test) => {
  test('heading dividers: between same-level headings only, never stray, none when disabled', async ({ page, assert }) => {
    await typeset(page, DOC, { 'heading-divider-h4': 'none', 'heading-divider-h3': 'none', 'heading-divider-h5': 'none', 'heading-divider-h6': 'none' });
    assert.deepStrictEqual(await dividersInfo(page), [], 'dividers appeared although disabled');

    await typeset(page, DOC, { 'heading-divider-h4': DIVIDER_ID });
    const info = await dividersInfo(page);
    assert.ok(info.length >= 1, 'no divider rendered for h4');
    for (const d of info) {
      assert.ok(/^title-level-4:/.test(d.next), 'divider not followed by an h4 heading: ' + d.next);
      assert.ok(!/ב1|א1/.test(d.next), 'first heading of a run must not get a divider: ' + d.next);
    }
    // only level 4 was configured: no divider before h3/h5 headings
    assert.ok(info.every((d) => /title-level-4/.test(d.next)));
  });

  test('heading dividers: text integrity and layout stay valid with all four levels enabled', async ({ page, assert }) => {
    await page.addScriptTag({ content: checker });
    await typeset(page, DOC, { 'heading-divider-h3': DIVIDER_ID, 'heading-divider-h4': DIVIDER_ID, 'heading-divider-h5': DIVIDER_ID, 'heading-divider-h6': DIVIDER_ID });
    const viol = await page.evaluate(() => window.__checkLayout({}).filter((v) => v.type !== 'GRANULARITY(ok)'));
    assert.deepStrictEqual(viol, [], 'layout violations: ' + JSON.stringify(viol).slice(0, 300));
    const headings = await page.evaluate(() => Array.from(document.querySelectorAll('.main-column [class*="title-level-"], .single-wide-col [class*="title-level-"]')).map((h) => h.textContent.trim()));
    for (const t of ['א1', 'א2', 'א2א', 'א2ב', 'ב1', 'ב2']) assert.ok(headings.includes(t), 'heading lost: ' + t);
  });

  test('cover dividers: a chosen ornament replaces the default one on the main cover', async ({ page, assert }) => {
    await typeset(page, DOC, { 'shaar-main-divider': 'none' });
    const none = await page.evaluate(() => document.querySelectorAll('.shaar-main-content .heading-divider-wrap').length);
    assert.strictEqual(none, 0);
    await typeset(page, DOC, { 'shaar-main-divider': DIVIDER_ID });
    const chosen = await page.evaluate(() => document.querySelectorAll('.shaar-main-content .heading-divider-wrap svg').length);
    assert.ok(chosen >= 1, 'chosen cover divider not rendered');
  });
};
