#!/usr/bin/env node
'use strict';
/*
 * Feature tests: small browser tests, one group per ported feature.
 *   node tests/features/run.js [--only=<substring>]
 * A test file exports a function  (test) => { test('name', async (ctx) => { ... }) }
 * ctx = { page, errors, url, browser, assert, root }.  A fresh page is opened for every test.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { startServer, requirePlaywright, openApp } = require('../lib/common');

const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const ROOT = path.resolve(__dirname, '..', '..');
const tests = [];
const test = (name, fn, opts) => tests.push({ name, fn, opts: opts || {} });

fs.readdirSync(__dirname).filter((f) => /\.test\.js$/.test(f)).sort().forEach((f) => require(path.join(__dirname, f))(test));

(async () => {
  const { chromium } = requirePlaywright();
  const { server, url } = await startServer(ROOT);
  const browser = await chromium.launch();
  let pass = 0, fail = 0;
  for (const t of tests) {
    if (only && !t.name.includes(only)) continue;
    const { page, errors } = await openApp(browser, url, t.opts);
    try {
      await t.fn({ page, errors, url, browser, assert, root: ROOT });
      pass++; console.log('  PASS  ' + t.name);
    } catch (e) {
      fail++; console.log('  FAIL  ' + t.name + '\n        ' + String(e.message).split('\n').slice(0, 4).join('\n        '));
    }
    await page.close();
  }
  await browser.close(); server.close();
  console.log(`\nfeature tests: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('FEATURE RUN FAILED:', e.message); process.exit(2); });
