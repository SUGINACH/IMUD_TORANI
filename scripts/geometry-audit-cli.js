#!/usr/bin/env node
'use strict';
/* מריץ את הבודק הגיאומטרי (geometry-audit.js) ב-Node על JSON מיוצא — בלי דפדפן ובלי צילומי מסך.
   הקלט: הקובץ שמורד מכפתור "📋 פירוט מלא" בממשק (geometry-*.json), או הפלט של
   scripts/geometry-audit-headless.mjs.

   שימוש:
     node scripts/geometry-audit-cli.js geometry.json
         [--json report.json]            כתיבת הדוח המלא ל-JSON
         [--max 40]                      כמה בעיות להדפיס (ברירת מחדל 30)
         [--kind widow,orphan]           סינון לפי סוג
         [--fail-on high|medium|low]     קוד יציאה 1 אם יש בעיה בחומרה הזו ומעלה (ל-CI) */
const fs = require('fs');
const api = require('../geometry-audit.js');

const RANK = { high: 3, medium: 2, low: 1 };
// סדר הצגה בתוך אותה חומרה: חריגות ושבירות קודם, אי-איזון בסוף
const KIND_PRIORITY = { 'fn-overflow': 0, 'pn-overflow': 0, 'page-overflow': 0, 'fn-page-overflow': 0, 'fn-pn-overflow': 0,
    'chain-broken': 1, 'pua-char': 1, 'widow': 2, 'orphan': 2, 'heading-at-bottom': 2, 'empty-column': 2,
    'containment': 3, 'fn-containment': 3, 'sparse-line': 4, 'imbalance': 5, 'overlap': 5 };

function parseArgs(argv) {
    const a = { file: null, json: null, max: 30, kinds: null, failOn: null };
    for (let i = 0; i < argv.length; i++) {
        const v = argv[i];
        if (v === '--json') a.json = argv[++i];
        else if (v === '--max') a.max = parseInt(argv[++i], 10) || 30;
        else if (v === '--kind') a.kinds = String(argv[++i] || '').split(',').filter(Boolean);
        else if (v === '--fail-on') a.failOn = argv[++i];
        else if (!v.startsWith('--') && !a.file) a.file = v;
    }
    return a;
}

function main() {
    const a = parseArgs(process.argv.slice(2));
    if (!a.file) {
        console.error('שימוש: node scripts/geometry-audit-cli.js <geometry.json> [--json out.json] [--max N] [--kind k1,k2] [--fail-on high|medium|low]');
        process.exit(2);
    }
    const raw = JSON.parse(fs.readFileSync(a.file, 'utf8'));
    const model = raw.model || raw;
    if (!model || !Array.isArray(model.pages)) {
        console.error('הקובץ אינו מודל גיאומטרי (חסר pages)');
        process.exit(2);
    }
    const res = api.audit(model);

    console.log(`עמודים: ${model.pages.length} | בעיות: ${res.summary.total} (high ${res.summary.high}, medium ${res.summary.medium}, low ${res.summary.low})`);
    const tab = {};
    res.issues.forEach(i => {
        const t = tab[i.kind] || (tab[i.kind] = { high: 0, medium: 0, low: 0 });
        t[i.severity]++;
    });
    console.log('\n' + 'סוג'.padEnd(24) + 'high'.padStart(6) + 'medium'.padStart(8) + 'low'.padStart(6));
    Object.entries(tab).sort((x, y) => (y[1].high - x[1].high) || (y[1].medium - x[1].medium)).forEach(([k, t]) => {
        console.log(k.padEnd(24) + String(t.high).padStart(6) + String(t.medium).padStart(8) + String(t.low).padStart(6));
    });

    let issues = res.issues.slice();
    if (a.kinds) issues = issues.filter(i => a.kinds.includes(i.kind));
    issues.sort((x, y) => (RANK[y.severity] || 0) - (RANK[x.severity] || 0)
        || (KIND_PRIORITY[x.kind] ?? 9) - (KIND_PRIORITY[y.kind] ?? 9) || x.pageIdx - y.pageIdx);
    console.log('');
    issues.slice(0, a.max).forEach(i => {
        console.log(`עמוד ${i.pageIdx >= 0 ? i.pageIdx + 1 : '?'} [${i.severity}] ${i.kind}: ${i.message}`);
    });
    if (issues.length > a.max) console.log(`... ועוד ${issues.length - a.max} (הגדל עם --max)`);

    if (a.json) fs.writeFileSync(a.json, JSON.stringify({ summary: res.summary, issues: res.issues }, null, 2));
    if (a.failOn) {
        const th = RANK[a.failOn] || 3;
        if (res.issues.some(i => (RANK[i.severity] || 0) >= th)) process.exit(1);
    }
}

main();
