'use strict';
/* Port from the v19/V21 mainline: default settings, saved/imported settings (localStorage), style sets, export/import. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { openSettings } = require('../lib/common');

module.exports = (test) => {
  test('settings: style-set bar with export/import is present', async ({ page, assert }) => {
    const r = await page.evaluate(() => ({
      bar: !!document.getElementById('style-set-bar'),
      exp: !!document.getElementById('btn-export-settings'),
      imp: !!document.getElementById('btn-import-settings'),
      sets: document.querySelectorAll('#style-set-select option').length,
    }));
    assert.ok(r.bar && r.exp && r.imp, 'bar controls missing: ' + JSON.stringify(r));
    assert.ok(r.sets >= 4, 'expected default + 3 bundled style sets, got ' + r.sets);
  });

  test('settings: default_settings.json is applied at startup without blanking any selector', async ({ page, assert }) => {
    const r = await page.evaluate(async () => {
      const defs = await (await fetch('default_settings.json')).json();
      const blank = [];
      for (const [k, v] of Object.entries(defs)) {
        const el = document.getElementById(k);
        if (!el || el.tagName !== 'SELECT' || k === 'style-set-select') continue;
        if (el.value === '' && v !== '') blank.push(k);
      }
      return { blank, theme: document.getElementById('active-theme-select').value, want: defs['active-theme-select'] };
    });
    assert.deepStrictEqual(r.blank, [], 'selectors left blank: ' + r.blank.join(', '));
    assert.strictEqual(r.theme, r.want, 'default theme not applied');
  });

  test('settings: export -> change -> import restores values, and they survive a reload', async ({ page, assert, url }) => {
    await page.evaluate(() => {
      const set = (id, v) => { const el = document.getElementById(id); if (el.type === 'checkbox') el.checked = v; else el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
      set('size-body', '11.5'); set('line-height-body', '1.3'); set('avoid-runt-word', false);
    });
    await openSettings(page);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btn-export-settings')]);
    const file = path.join(os.tmpdir(), 'orange-settings-test.json');
    await dl.saveAs(file);
    const saved = JSON.parse(fs.readFileSync(file, 'utf-8'));
    assert.ok(Object.keys(saved).length > 200, 'export too small: ' + Object.keys(saved).length);
    assert.strictEqual(String(saved['size-body']), '11.5');
    assert.strictEqual(saved['avoid-runt-word'], false);

    await page.evaluate(() => { document.getElementById('size-body').value = '12'; document.getElementById('line-height-body').value = '1.5'; document.getElementById('avoid-runt-word').checked = true; });
    await page.setInputFiles('#file-import-settings', file);
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({ s: document.getElementById('size-body').value, l: document.getElementById('line-height-body').value, r: document.getElementById('avoid-runt-word').checked }));
    assert.deepStrictEqual(after, { s: '11.5', l: '1.3', r: false });

    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => window.__appReady === true, null, { timeout: 120000 });
    const persisted = await page.evaluate(() => document.getElementById('size-body').value);
    assert.strictEqual(persisted, '11.5', 'imported settings did not survive reload');
  }, { settleMs: 2500 });

  test('settings: a bundled style set (setting_sets/) can be applied', async ({ page, assert }) => {
    const r = await page.evaluate(async () => {
      const def = await (await fetch('default_settings.json')).json();
      const set = await (await fetch('setting_sets/' + encodeURIComponent('קונטרס.json'))).json();
      // pick a plain (non-font, non-select) control whose value differs between default and the set
      const key = Object.keys(set).find((k) => {
        const el = document.getElementById(k);
        return el && el.tagName === 'INPUT' && el.type !== 'file' && String(def[k]) !== String(set[k]) && !/^f-|^font-/.test(k) && k !== 'style-set-select';
      });
      return { key, want: key ? set[key] : null };
    });
    assert.ok(r.key, 'no distinguishing control found between default and the style set');
    await openSettings(page);
    await page.selectOption('#style-set-select', 'קונטרס.json');
    await page.waitForTimeout(1500);
    const got = await page.evaluate((k) => { const el = document.getElementById(k); return el.type === 'checkbox' ? el.checked : el.value; }, r.key);
    assert.strictEqual(String(got), String(r.want), 'style set value not applied for ' + r.key);
  }, { settleMs: 2500 });
};
