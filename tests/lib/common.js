'use strict';
/* Shared helpers for the acceptance tests: static server, browser launch, typeset driver. */
const fs = require('fs');
const path = require('path');
const http = require('http');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

/** Serve `root` over http on a random free port. Resolves to { server, port, url }. */
function startServer(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, rsp) => {
      let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(root)) { rsp.writeHead(403); rsp.end(); return; }
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      fs.readFile(f, (err, data) => {
        if (err) { rsp.writeHead(404); rsp.end(); return; }
        rsp.writeHead(200, { 'Content-Type': (MIME[path.extname(f).toLowerCase()] || 'application/octet-stream') + '; charset=utf-8' });
        rsp.end(data);
      });
    }).listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port, url: `http://127.0.0.1:${port}/index.html` });
    });
  });
}

function requirePlaywright() {
  try { return require('playwright'); }
  catch (e) {
    console.error('Playwright is not installed. Run:  npm install  &&  npx playwright install chromium');
    process.exit(2);
  }
}

/** True when the fonts folder is present (layout results are only comparable with the real fonts). */
function hasFonts(root) { return fs.existsSync(path.join(root, 'fonts', 'fonts.json')); }

/** Open the app in a fresh page and wait until it is ready for input. */
async function openApp(browser, url, opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1500 }, acceptDownloads: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Failed to load resource|ERR_NAME_NOT_RESOLVED|net::ERR_/.test(t)) return;   // offline Google Fonts etc.
    errors.push('console: ' + t.slice(0, 200));
  });
  await page.goto(url, { waitUntil: 'load' });
  // wait for the application's own "initialisation finished" flag (set at the end of window.onload)
  await page.waitForFunction(() => window.__appReady === true, null, { timeout: 120000 });
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(opts.settleMs || 300);
  return { page, errors };
}

/** Put `text` into the editor, apply { elementId: value } settings, run the typesetter. */
async function typeset(page, text, cfg) {
  await page.evaluate(({ text, cfg }) => {
    document.getElementById('raw-input').value = text;
    for (const [id, v] of Object.entries(cfg || {})) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.type === 'checkbox') el.checked = !!v; else el.value = v;
    }
    if (typeof typesetDocumentNow === 'function') typesetDocumentNow();
    else if (typeof performTypeset === 'function') performTypeset();
    else typesetDocument(0);
  }, { text, cfg });
  // wait until the page count is stable
  let last = -1, stable = 0, pages = 0;
  for (let i = 0; i < 800; i++) {
    await page.waitForTimeout(150);
    pages = await page.evaluate(() => document.querySelectorAll('#book-container .a4-page').length);
    if (pages > 0 && pages === last) stable++; else stable = 0;
    last = pages;
    if (stable >= 2) break;
  }
  return pages;
}

/** The settings pane starts collapsed; expand it so its controls are visible/clickable. */
async function openSettings(page) {
  await page.evaluate(() => { const sp = document.getElementById('settings-pane'); if (sp && sp.classList.contains('collapsed') && typeof toggleSettingsPane === 'function') toggleSettingsPane(); });
  await page.waitForTimeout(500);
}

module.exports = { startServer, requirePlaywright, hasFonts, openApp, typeset, openSettings };
