/* ==========================================================================
   generate-settings-review.js — יוצר דף HTML אינטראקטיבי לסקירת כל ההגדרות
   ==========================================================================
   הסקריפט:
   1. טוען את המערכת בדפדפן
   2. אוסף את כל ההגדרות (233) עם הפרטים המלאים
   3. מייצר דף HTML עם:
      - טבלה מקובצת לפי פאנלים
      - לכל הגדרה: צ'קבוקס "שמור" (מסומן) + צ'קבוקס "מיידי" (לא מסומן) + תיבת הערות
      - כפתור ייצוא ל-JSON
   ========================================================================== */

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('http://localhost:8765/index.html', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(25000);

    // Collect all settings
    const allSettings = await page.evaluate(() => {
        const result = [];
        const allElements = document.querySelectorAll('#settings-pane [id], #text-pane [id]');
        const seen = new Set();
        
        const panelNames = {
            'panel-themes-body': 'פאנל 1: ערכות נושא, שערים ורקעים',
            'new-theme-panel-body': 'פאנל 2: ערכת נושא חדשה',
            'panel-plugins-body': 'פאנל 3: ייבוא תוספים',
            'panel-ornaments-body': 'פאנל 4: מאגר עיטורים ומידות',
            'panel-typography-body': 'פאנל 5: טיפוגרפיה וכותרות',
            'panel-notes-body': 'פאנל 6: הערות שוליים וסיום',
            'panel-quality-body': 'פאנל 7: איכות עימוד אוטומטי',
            'panel-headers-body': 'פאנל 8: כותרות עליונות',
            'panel-toc-body': 'פאנל 9: תוכן עניינים',
            'panel-grid-body': 'פאנל 10: רשת, קו טורים ומספור'
        };

        // Find label text for each element
        function findLabel(el) {
            // Check for preceding <label> sibling
            let prev = el.previousElementSibling;
            if (prev && prev.tagName === 'LABEL') return prev.textContent.trim();
            // Check for <label for="id">
            const lbl = document.querySelector('label[for="' + el.id + '"]');
            if (lbl) return lbl.textContent.trim();
            // Check parent's first label
            if (el.parentElement) {
                const pl = el.parentElement.querySelector('label');
                if (pl) return pl.textContent.trim();
            }
            return '';
        }

        allElements.forEach(el => {
            if (!el.id || seen.has(el.id)) return;
            seen.add(el.id);
            
            if (el.tagName === 'INPUT') {
                if (el.type === 'file' || el.type === 'hidden' || el.type === 'button' || el.type === 'submit') return;
            } else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                // OK
            } else {
                return;
            }
            
            const skipIds = ['style-set-select', 'file-txt-import', 'file-settings-import', 
                             'file-import-settings', 'file-import-debug', 'file-builder-main-svg',
                             'file-builder-back-svg', 'file-builder-sub-svg', 'file-cbg-regular-img',
                             'file-cbg-h0Open-img', 'file-cbg-h2Open-img', 'file-hdr-c-img',
                             'file-sec-div-img', 'assets-folder-input'];
            if (skipIds.includes(el.id)) return;
            
            let type, currentValue;
            if (el.type === 'checkbox') {
                type = 'checkbox';
                currentValue = el.checked;
            } else if (el.tagName === 'SELECT') {
                type = 'select';
                currentValue = el.value;
            } else if (el.tagName === 'INPUT') {
                type = el.type || 'text';
                currentValue = el.value;
            } else if (el.tagName === 'TEXTAREA') {
                type = 'textarea';
                currentValue = el.value;
            }
            
            let panel = 'אחר';
            let p = el.parentElement;
            while (p) {
                if (p.id && p.id.startsWith('panel-') && p.id.endsWith('-body')) {
                    panel = panelNames[p.id] || p.id;
                    break;
                }
                if (p.id === 'new-theme-panel-body') {
                    panel = panelNames['new-theme-panel-body'];
                    break;
                }
                p = p.parentElement;
            }
            
            const label = findLabel(el);
            
            // Get available options for select
            let options = [];
            if (el.tagName === 'SELECT') {
                options = Array.from(el.options).map(o => ({ value: o.value, text: o.textContent.trim() }));
            }
            
            result.push({
                id: el.id,
                type: type,
                label: label,
                value: String(currentValue).slice(0, 100),
                panel: panel,
                options: options.slice(0, 30) // limit
            });
        });
        return result;
    });

    await browser.close();
    console.log(`Collected ${allSettings.length} settings`);

    // Group by panel
    const byPanel = {};
    allSettings.forEach(s => {
        if (!byPanel[s.panel]) byPanel[s.panel] = [];
        byPanel[s.panel].push(s);
    });

    // Sort panels numerically by panel number
    const sortedPanelNames = Object.keys(byPanel).sort((a, b) => {
        const numA = parseInt(a.match(/פאנל (\d+)/)?.[1] || '99');
        const numB = parseInt(b.match(/פאנל (\d+)/)?.[1] || '99');
        return numA - numB;
    });

    // Generate HTML
    let html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>סקירת הגדרות מערכת עימוד</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Assistant', 'Segoe UI', sans-serif; background: #f1f5f9; color: #0f172a; padding: 20px; font-size: 13px; }
h1 { text-align: center; margin-bottom: 8px; color: #1e293b; }
.subtitle { text-align: center; color: #64748b; margin-bottom: 20px; font-size: 12px; }
.toolbar { background: #fff; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 10; }
.toolbar button { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; }
.btn-export { background: #2563eb; color: #fff; }
.btn-export:hover { background: #1d4ed8; }
.btn-check-all { background: #10b981; color: #fff; }
.btn-uncheck-all { background: #ef4444; color: #fff; }
.btn-expand { background: #64748b; color: #fff; }
.btn-collapse { background: #64748b; color: #fff; }
.stats { margin-right: auto; font-size: 12px; color: #64748b; }
.panel { background: #fff; margin-bottom: 12px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.panel-header { background: #1e293b; color: #fff; padding: 10px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; }
.panel-header:hover { background: #334155; }
.panel-header .count { background: #475569; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.panel-header .arrow { margin-right: auto; transition: transform 0.2s; }
.panel-header.expanded .arrow { transform: rotate(90deg); }
.panel-body { display: none; }
.panel-body.expanded { display: block; }
table { width: 100%; border-collapse: collapse; }
th { background: #f8fafc; padding: 8px 10px; text-align: right; font-size: 11px; color: #475569; border-bottom: 2px solid #e2e8f0; }
td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
tr:hover { background: #f8fafc; }
td.id { font-family: monospace; font-size: 11px; color: #1e293b; }
td.label { padding: 4px 6px; }
td.value { font-size: 11px; color: #475569; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
td.value:hover { white-space: normal; overflow: visible; }
td.type { font-size: 10px; color: #64748b; text-align: center; }
input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
input[type="text"].notes { width: 100%; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 11px; }
input[type="text"].notes:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
input[type="text"].label-edit { width: 100%; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 11px; font-weight: 600; }
input[type="text"].label-edit:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
.center { text-align: center; }
.legend { background: #fff; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 12px; color: #475569; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.legend strong { color: #1e293b; }
</style>
</head>
<body>

<h1>📋 סקירת הגדרות מערכת עימוד תורנית</h1>
<p class="subtitle">סה"כ ${allSettings.length} הגדרות ב-${Object.keys(byPanel).length} פאנלים — סמן/בטל סימון, הגדר טעינה מיידית, הוסף הערות, וייצא</p>

<div class="legend">
<strong>הוראות:</strong>
• <strong>צ'קבוקס "שמור"</strong> — מסומן כברירת מחדל. הסר סימון כדי לבטל הגדרה שאינה נצרכת.<br>
• <strong>צ'קבוקס "מיידי"</strong> — לא מסומן כברירת מחדל. סמן כדי להגדיר שההגדרה תתעדכן מיידית (ללא עימוד מחדש).<br>
• <strong>תיבת הערות</strong> — הוסף בקשות לשינוי/תוספת.<br>
• <strong>כפתור ייצוא</strong> — מייצא את כל הבחירות וההערות לקובץ JSON שניתן להעלות.
</div>

<div class="toolbar">
<button class="btn-check-all" onclick="checkAll(true)">☑ סמן הכל</button>
<button class="btn-uncheck-all" onclick="checkAll(false)">☐ בטל הכל</button>
<button class="btn-expand" onclick="expandAll(true)">▼ פתח הכל</button>
<button class="btn-collapse" onclick="expandAll(false)">▲ סגור הכל</button>
<button class="btn-export" onclick="exportData()">💾 ייצוא JSON</button>
<span class="stats" id="stats"></span>
</div>

`;

    // Generate panels
    sortedPanelNames.forEach(panelName => {
        const settings = byPanel[panelName];
        html += `<div class="panel">
<div class="panel-header" onclick="togglePanel(this)">
<span>${panelName}</span>
<span class="count">${settings.length}</span>
<span class="arrow">◀</span>
</div>
<div class="panel-body">
<table>
<thead>
<tr>
<th class="center" style="width:50px;">שמור</th>
<th class="center" style="width:50px;">מיידי</th>
<th style="width:180px;">מזהה</th>
<th style="width:150px;">תווית</th>
<th class="center" style="width:60px;">סוג</th>
<th style="width:200px;">ערך נוכחי</th>
<th>הערות</th>
</tr>
</thead>
<tbody>`;

        settings.forEach(s => {
            const valueDisplay = s.type === 'checkbox' ? (s.value === 'true' ? '☑' : '☐') : s.value;
            const labelValue = (s.label || '').replace(/"/g, '&quot;');
            html += `<tr>
<td class="center"><input type="checkbox" class="keep" data-id="${s.id}" checked></td>
<td class="center"><input type="checkbox" class="immediate" data-id="${s.id}"></td>
<td class="id">${s.id}</td>
<td class="label"><input type="text" class="label-edit" data-id="${s.id}" value="${labelValue}" placeholder="(ריק)"></td>
<td class="type">${s.type}</td>
<td class="value" title="${s.value.replace(/"/g, '&quot;')}">${valueDisplay}</td>
<td><input type="text" class="notes" data-id="${s.id}" placeholder="הערות..."></td>
</tr>`;
        });

        html += `</tbody>
</table>
</div>
</div>`;
    });

    html += `<script>
function togglePanel(header) {
    header.classList.toggle('expanded');
    header.nextElementSibling.classList.toggle('expanded');
}
function expandAll(expand) {
    document.querySelectorAll('.panel-header').forEach(h => {
        if (expand) { h.classList.add('expanded'); h.nextElementSibling.classList.add('expanded'); }
        else { h.classList.remove('expanded'); h.nextElementSibling.classList.remove('expanded'); }
    });
}
function checkAll(check) {
    document.querySelectorAll('.keep').forEach(cb => cb.checked = check);
    updateStats();
}
function updateStats() {
    const total = document.querySelectorAll('.keep').length;
    const checked = document.querySelectorAll('.keep:checked').length;
    const immediate = document.querySelectorAll('.immediate:checked').length;
    document.getElementById('stats').textContent = 'שמור: ' + checked + '/' + total + ' | מיידי: ' + immediate;
}
function exportData() {
    const data = [];
    document.querySelectorAll('tr').forEach(tr => {
        const keep = tr.querySelector('.keep');
        const immediate = tr.querySelector('.immediate');
        const notes = tr.querySelector('.notes');
        const labelEdit = tr.querySelector('.label-edit');
        if (!keep) return;
        const id = keep.dataset.id;
        const idCell = tr.querySelector('.id');
        const typeCell = tr.querySelector('.type');
        const valueCell = tr.querySelector('.value');
        data.push({
            id: id,
            label: labelEdit ? labelEdit.value : '',
            type: typeCell ? typeCell.textContent : '',
            currentValue: valueCell ? valueCell.getAttribute('title') || valueCell.textContent : '',
            keep: keep.checked,
            immediate: immediate ? immediate.checked : false,
            notes: notes ? notes.value : ''
        });
    });
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings-review.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}
// Update stats on change
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('keep') || e.target.classList.contains('immediate')) {
        updateStats();
    }
});
// Initial: expand all panels
expandAll(true);
updateStats();
</script>
</body>
</html>`;

    fs.writeFileSync('/home/z/my-project/download/settings-review.html', html);
    console.log('HTML saved to /home/z/my-project/download/settings-review.html');
    console.log('Size:', (html.length / 1024).toFixed(1) + ' KB');
})();
