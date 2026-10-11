/* ==========================================================================
   test-suite.js — מחולל טקסט בדיקה אולטימטיבי + דוח עימוד מפורט
   ========================================================================== */

(function() {
'use strict';

// ==========================================================================
// 1. מחולל טקסט בדיקה
// ==========================================================================

const W = [
    'השבת','המצווה','המעשה','הגדר','הרשות','ההוצאה','המלאכה','האיסור',
    'הקדוש','החילול','השביתה','המנוחה','הנפישה','הזכירה','השמירה',
    'היום','הזמן','המקום','החפץ','האדם','הכח','הפעולה','התוצאה',
    'העושה','הנעשה','המציאות','ההויה','החלל','הכלל','הפרט',
    'הצורה','החומר','השינוי','ההמצאה','העילוי','היצירה','הבריאה',
    'התחלה','הסוף','האמצע','הקודם','המאוחר','הראשון','השני','השלישי',
    'הכרחי','אפשרי','מחויב','מותר','אסור','חיובי','שלילי','מעורב',
    'פשוט','מורכב','כללי','פרטי','מיוחד','סתמי','מפורש','רמוז',
    'מבואר','מקוצר','מורחב','מדויק','משוער','קבוע','משתנה','תדיר',
    'מזומן','חד-פעמי','תמידי','זמני','עקרוני','מעשי','תיאורטי',
    'ובזה','ובכך','ולכן','ואכן','והנה','וביאור','ומכח','ומצד',
    'שהרי','שכן','שהוא','שזה','שאין','שיש','שמה','שכל',
    'ביחס','בפני','כולל','מחמת','על-פי','כשיש','כשאין','כאשר'
];

function randWords(n) {
    let parts = [];
    for (let i = 0; i < n; i++) {
        parts.push(W[Math.floor(Math.random() * W.length)]);
    }
    return parts.join(' ') + '.';
}

function para(wordCount) {
    let parts = [];
    let remaining = wordCount;
    while (remaining > 0) {
        let chunk = Math.min(remaining, 8 + Math.floor(Math.random() * 5));
        parts.push(randWords(chunk));
        remaining -= chunk;
    }
    return parts.join(' ');
}

function generateTestText() {
    let lines = [];
    
    // מטא-דאטא
    lines.push('שם הספר - טקסט בדיקה אולטימטיבי');
    lines.push('נושא - בדיקת עימוד');
    lines.push('נושא מפורט - כיסוי כל מקרי העימוד');
    lines.push('פרטי מהדורא - גרסת בדיקה');
    lines.push('שם המחבר - מערכת עימוד');
    lines.push('מקום ושנת הוצאה - ירושלים | תשפ"ו');
    lines.push('שמירת זכויות - כל הזכויות הפקר');
    lines.push('פרטי הוצאה לאור - הוצאת בדיקה');
    lines.push('פרטי קשר - 000-0000000');
    lines.push('פרטים נוספים - טקסט לבדיקה בלבד');
    lines.push('');
    
    // פרק ראשון
    lines.push('כותרת 1 מספר 1 - בדיקת פרקים - כל המקרים - עימוד - איזון - יישור');
    lines.push('כותרת 0 מספר 1 - מבוא לבדיקה');
    
    // פסקת מבוא ארוכה (50 מילים)
    lines.push(para(50));
    
    // פסקה קצרה (3 מילים — מקרה קצה)
    lines.push(para(3));
    
    // פסקה בת מילה אחת (מקרה קצה קיצוני)
    lines.push(randWords(1));
    
    // פסקה בת שתי מילים
    lines.push(randWords(2));
    
    lines.push('');
    lines.push('כותרת 2 מספר 2 - בדיקת סעיפים וכותרות');
    
    // פסקה בינונית
    lines.push(para(80));
    
    // H3 חוצה טורים
    lines.push('כותרת 3 מספר 1 - כותרת חוצה טורים ראשונה');
    
    // פסקאות באורכים שונים — מבחן איזון
    lines.push(para(15));   // 1 שורה
    lines.push(para(30));   // 2 שורות
    lines.push(para(45));   // 3 שורות
    lines.push(para(75));   // 5 שורות
    lines.push(para(150));  // 10 שורות
    lines.push(para(300));  // 20 שורות — יפוצל בין טורים
    
    // H7 סימוכין (הערת שוליים)
    lines.push('כותרת 7 מספר 1 - הערת שוליים ראשונה - הגדרת המושג');
    lines.push(para(60));
    
    lines.push('כותרת 7 מספר 2 - הערת שוליים שניה - משמעות נוספת');
    lines.push(para(40));
    
    // H4 בתחילת טור (בדיקת ביטול margin-top)
    lines.push('כותרת 4 מספר 1 - כותרת משנה ראשונה');
    lines.push(para(100));
    
    lines.push('כותרת 4 מספר 2 - כותרת משנה שניה');
    lines.push(para(50));
    
    // H5
    lines.push('כותרת 5 מספר 1 - כותרת קטנה ראשונה');
    lines.push(para(40));
    
    // H6
    lines.push('כותרת 6 מספר 1 - כותרת קטנטנה');
    lines.push(para(35));
    
    // H3 שניה
    lines.push('כותרת 3 מספר 2 - כותרת חוצה טורים שניה');
    
    // פסקאות קצרות רבות ברצף (מבחן אלמנות/יתוממות)
    for (let i = 0; i < 10; i++) {
        lines.push(para(10 + i * 3));
    }
    
    // פסקה ארוכה מאוד (מבחן פיצול בין עמודים)
    lines.push(para(500));
    
    // H3 שלישית
    lines.push('כותרת 3 מספר 3 - כותרת חוצה טורים שלישית');
    
    // שילוב: H7 + פסקה קצרה + H4 + פסקה ארוכה
    lines.push('כותרת 7 מספר 3 - הערה שלישית - גדר מיוחד');
    lines.push(para(20));
    lines.push('כותרת 4 מספר 3 - כותרת אחרי הערה');
    lines.push(para(200));
    
    // רצף כותרות (H3 → H4 ברצף, ללא פסקה ביניהן)
    lines.push('כותרת 3 מספר 4 - כותרת רביעית');
    lines.push('כותרת 4 מספר 4 - כותרת מיד אחרי H3');
    lines.push(para(100));
    
    lines.push('');
    lines.push('כותרת 2 מספר 3 - סעיף שני של הפרק');
    
    // פסקאות באורכים שיטתיים: 1, 2, 3, ..., 20 מילים
    for (let n = 1; n <= 20; n++) {
        lines.push(para(n));
    }
    
    // פסקה ארוכה במיוחד
    lines.push(para(1000));
    
    lines.push('כותרת 3 מספר 5 - חלוקה לתת-סעיפים');
    
    // כל גודל פסקה עם H7 לפניה
    for (let n = 5; n <= 100; n += 10) {
        lines.push('כותרת 7 מספר ' + (n/5) + ' - הערה לפסקה באורך ' + n);
        lines.push(para(n));
    }
    
    // H3 שישית — עם הרבה פסקאות קצרות
    lines.push('כותרת 3 מספר 6 - פסקאות קצרות רבות');
    for (let i = 0; i < 20; i++) {
        lines.push(para(5 + (i % 7) * 5));
    }
    
    // פסקה ענקית אחרונה
    lines.push(para(2000));
    
    // סיום
    lines.push('כותרת 2 מספר 4 - סיכום ומסקנות');
    lines.push(para(200));
    lines.push(para(100));
    lines.push(para(50));
    lines.push(para(10));
    lines.push(randWords(1));
    
    return lines.join('\n');
}

// ==========================================================================
// 2. דוח עימוד מפורט
// ==========================================================================

function generateLayoutReport() {
    const pages = document.querySelectorAll('#book-container .a4-page');
    if (pages.length === 0) {
        alert('אין עמודים מעומדים. העמד תחילה את המסמך.');
        return;
    }
    
    const report = {
        summary: { totalPages: pages.length, totalBlocks: 0, imbalancedBlocks: 0, sparseLastLines: 0, adjustedParagraphs: 0, columnStartMismatches: 0 },
        pages: [],
    };
    
    pages.forEach((page, idx) => {
        const pageNum = page.querySelector('.page-number-footer')?.textContent?.trim() || '';
        const role = page.getAttribute('data-page-role') || page.className.match(/page-role-(\w+)/)?.[1] || 'regular';
        const bodyFlow = page.querySelector('.page-body-flow');
        const availH = bodyFlow ? bodyFlow.clientHeight : null;
        
        const blocks = page.querySelectorAll('.block-2col, .block-h3-span');
        const blockInfos = [];
        
        blocks.forEach((b, bi) => {
            if (b.classList.contains('block-h3-span')) {
                blockInfos.push({ type: 'h3-span', idx: bi, text: (b.textContent || '').slice(0, 40) });
                return;
            }
            
            const rCol = b.querySelector('.right-col');
            const lCol = b.querySelector('.left-col');
            if (!rCol || !lCol) return;
            
            report.summary.totalBlocks++;
            
            const rH = rCol.scrollHeight;
            const lH = lCol.scrollHeight;
            const diff = Math.abs(rH - lH);
            const balanced = diff <= 5;
            if (!balanced) report.summary.imbalancedBlocks++;
            
            // בדוק התאמת תחילת טור
            const rFirst = rCol.firstElementChild;
            const lFirst = lCol.firstElementChild;
            let startMismatch = null;
            if (rFirst && lFirst) {
                const rTop = rFirst.offsetTop;
                const lTop = lFirst.offsetTop;
                if (Math.abs(rTop - lTop) > 2) {
                    startMismatch = { rTop, lTop, diff: Math.abs(rTop - lTop) };
                    report.summary.columnStartMismatches++;
                }
            }
            
            // בדוק פסקאות עם התאמות
            const rPs = rCol.querySelectorAll('p');
            const lPs = lCol.querySelectorAll('p');
            [...rPs, ...lPs].forEach(p => {
                const hasAdjust = p.style.marginBottom || p.style.lineHeight || p.style.wordSpacing || p.style.letterSpacing;
                if (hasAdjust) report.summary.adjustedParagraphs++;
            });
            
            // בדוק שורה אחרונה דלילה
            const checkSparse = (col, colName) => {
                const ps = col.querySelectorAll('p');
                if (ps.length === 0) return;
                const lastP = ps[ps.length - 1];
                const raw = lastP.getAttribute('data-raw-text') || lastP.textContent || '';
                if (!raw.trim()) return;
                if (typeof getLinesFromParagraph === 'function') {
                    const styleObj = {
                        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
                        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
                        lineHeight: getComputedStyle(document.documentElement).getPropertyValue('--line-height-body') || '1.34',
                    };
                    const info = getLinesFromParagraph(raw, col.offsetWidth - 40, styleObj, false);
                    if (info.lines && info.lines.length > 0) {
                        const lastLine = info.lines[info.lines.length - 1];
                        const words = lastLine.split(/\s+/).filter(w => w.length > 0).length;
                        if (words > 0 && words <= 4) {
                            report.summary.sparseLastLines++;
                        }
                    }
                }
            };
            checkSparse(rCol, 'R');
            checkSparse(lCol, 'L');
            
            blockInfos.push({
                type: '2col', idx: bi,
                rH, lH, diff, balanced,
                rP: rPs.length, lP: lPs.length,
                rFirst: rFirst ? { tag: rFirst.tagName, class: rFirst.className.slice(0, 25) } : null,
                lFirst: lFirst ? { tag: lFirst.tagName, class: lFirst.className.slice(0, 25) } : null,
                startMismatch,
            });
        });
        
        report.pages.push({ idx: idx + 1, pageNum, role, availH, blocks: blockInfos });
    });
    
    // הפקת HTML
    let html = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><title>דוח עימוד</title>
<style>
body { font-family: monospace; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 10px; }
.summary { background: #0f172a; padding: 16px; border-radius: 8px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.summary div { text-align: center; }
.summary .num { font-size: 24pt; font-weight: bold; color: #38bdf8; }
.summary .label { font-size: 9pt; color: #94a3b8; }
.bad { color: #ef4444; }
.ok { color: #10b981; }
.warn { color: #f59e0b; }
table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 8pt; }
th { background: #334155; padding: 6px; text-align: center; }
td { padding: 4px 6px; border-bottom: 1px solid #1e293b; text-align: center; }
tr.imbalanced { background: rgba(239, 68, 68, 0.1); }
</style></head><body>`;
    
    html += `<h1>דוח עימוד מפורט</h1>`;
    const s = report.summary;
    html += `<div class="summary">
        <div><div class="num">${s.totalPages}</div><div class="label">סה"כ עמודים</div></div>
        <div><div class="num ${s.imbalancedBlocks === 0 ? 'ok' : 'bad'}">${s.imbalancedBlocks}</div><div class="label">בלוקים לא מאוזנים</div></div>
        <div><div class="num">${s.totalBlocks}</div><div class="label">סה"כ בלוקים</div></div>
        <div><div class="num ${s.sparseLastLines < 10 ? 'ok' : 'warn'}">${s.sparseLastLines}</div><div class="label">שורות אחרונות דלילות</div></div>
        <div><div class="num">${s.adjustedParagraphs}</div><div class="label">פסקאות עם התאמות</div></div>
        <div><div class="num ${s.columnStartMismatches === 0 ? 'ok' : 'bad'}">${s.columnStartMismatches}</div><div class="label">חוסר התאמת תחילת טור</div></div>
    </div>`;
    
    html += '<table><thead><tr><th>עמוד</th><th>מספר</th><th>תפקיד</th><th>בלוק</th><th>R גובה</th><th>L גובה</th><th>הפרש</th><th>סטטוס</th><th>R פסקאות</th><th>L פסקאות</th><th>R ראשון</th><th>L ראשון</th><th>תחילת טור</th></tr></thead><tbody>';
    
    report.pages.forEach(p => {
        p.blocks.forEach(b => {
            if (b.type === 'h3-span') {
                html += `<tr><td>${p.idx}</td><td>${p.pageNum}</td><td>${p.role}</td><td colspan="11" style="text-align:right;color:#38bdf8;">⬩ H3: ${b.text}</td></tr>`;
            } else {
                const cls = b.diff > 5 ? 'imbalanced' : '';
                const status = b.balanced ? '<span class="ok">✓</span>' : `<span class="bad">${b.diff}px</span>`;
                const start = b.startMismatch ? `<span class="bad">${b.startMismatch.diff}px</span>` : '<span class="ok">✓</span>';
                html += `<tr class="${cls}"><td>${p.idx}</td><td>${p.pageNum}</td><td>${p.role}</td><td>#${b.idx}</td><td>${b.rH}</td><td>${b.lH}</td><td>${b.diff}</td><td>${status}</td><td>${b.rP}</td><td>${b.lP}</td><td>${b.rFirst ? b.rFirst.tag + '.' + b.rFirst.class : '—'}</td><td>${b.lFirst ? b.lFirst.tag + '.' + b.lFirst.class : '—'}</td><td>${start}</td></tr>`;
            }
        });
    });
    
    html += '</tbody></table></body></html>';
    
    // פתח בחלון חדש
    const w = window.open('', '_blank');
    if (w) {
        w.document.write(html);
        w.document.close();
    } else {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
}

// ==========================================================================
// 3. כפתורים ב-UI
// ==========================================================================

function initTestSuiteButtons() {
    const actionsBar = document.querySelector('.text-actions-bar');
    if (!actionsBar) return;
    
    // כפתור טקסט בדיקה
    const btnTest = document.createElement('button');
    btnTest.type = 'button';
    btnTest.className = 'btn-tool btn-secondary';
    btnTest.innerHTML = '🧪 טקסט בדיקה';
    btnTest.style.flex = '0.8';
    btnTest.title = 'הזרקת טקסט בדיקה מקיף המכסה את כל מקרי העימוד';
    btnTest.addEventListener('click', () => {
        const text = generateTestText();
        if (typeof renderEditorContent === 'function') {
            renderEditorContent(text, []);
        } else {
            const el = document.getElementById('raw-input');
            if (el) {
                el.innerHTML = '';
                text.split(/\r?\n/).forEach(line => {
                    const div = document.createElement('div');
                    div.className = 'editor-line';
                    div.textContent = line;
                    el.appendChild(div);
                });
            }
        }
        // הפעלת העימוד אוטומטית
        setTimeout(() => { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
    });
    actionsBar.insertBefore(btnTest, actionsBar.firstChild);
    
    // כפתור דוח עימוד
    const btnReport = document.createElement('button');
    btnReport.type = 'button';
    btnReport.className = 'btn-tool btn-secondary';
    btnReport.innerHTML = '📊 דוח עימוד';
    btnReport.style.flex = '0.8';
    btnReport.title = 'הפקת דוח מפורט על מצב העימוד';
    btnReport.addEventListener('click', generateLayoutReport);
    actionsBar.insertBefore(btnReport, btnTest.nextSibling);
}

// אתחול
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestSuiteButtons);
} else {
    initTestSuiteButtons();
}

window.generateTestText = generateTestText;
window.generateLayoutReport = generateLayoutReport;

})();
