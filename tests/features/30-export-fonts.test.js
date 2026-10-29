'use strict';
/* Port from the v19 mainline: standalone HTML export and the "more fonts" (list 2) loader. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { typeset } = require('../lib/common');

const DOC = ['שם הספר - ייצוא', '', 'כותרת 1 - חלק', 'כותרת 2 - סימן א', '',
  'פסקת בדיקה ארוכה מספיק כדי למלא כמה שורות בעמוד ולוודא שהייצוא מכיל את המסמך המרונדר. '.repeat(7)].join('\n');

module.exports = (test) => {
  test('export-html: button downloads a standalone HTML containing the rendered pages', async ({ page, assert }) => {
    page.on('dialog', (d) => d.dismiss());
    const pages = await typeset(page, DOC, {});
    assert.ok(pages >= 1);
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.click('#btn-export-html')]);
    const file = path.join(os.tmpdir(), 'orange-export.html');
    await dl.saveAs(file);
    const html = fs.readFileSync(file, 'utf-8');
    const nPages = (html.match(/class="a4-page/g) || []).length;
    assert.ok(nPages >= 1, 'no a4-page elements in the export');
    assert.ok(/<style>[\s\S]*@font-face/.test(html), 'CSS / font-face missing in the export');
    assert.ok(!/onclick=/.test(html.split('<body')[1] || ''), 'event handlers were not stripped');
    assert.ok(html.length > 50000, 'export suspiciously small: ' + html.length);
  }, { settleMs: 2500 });

  test('extended-fonts: loads list 2 into every font picker', async ({ page, assert }) => {
    page.on('dialog', (d) => d.dismiss());
    await page.click('#btn-load-extended-fonts');
    await page.waitForFunction(() => /^✓/.test(document.getElementById('btn-load-extended-fonts').textContent), null, { timeout: 60000 });
    const r = await page.evaluate(async () => {
      const list = await (await fetch('fonts-extended.json')).json();
      const grp = document.querySelector('.font-picker optgroup[label="גופנים מקומיים — רשימה 2"]');
      return { want: list.length, got: grp ? grp.children.length : 0, link: !!document.getElementById('fonts-extended-stylesheet') };
    });
    assert.ok(r.link, 'fonts-extended.css link not injected');
    assert.strictEqual(r.got, r.want, 'picker options ' + r.got + ' != list ' + r.want);
  }, { settleMs: 2500 });
};
