/* ==========================================================================
   debug-panel.js — מערכת טאבים לסרגל הצידי + מצב בדיקה
   ==========================================================================
   מבנה חדש: ה-sidebar הופך לפאנל יחיד (440px) עם 3 טאבים:
   1. עורך תוכן וחלוקת עמודים (כולל כל הלחצנים הרגילים + לחצני בדיקה)
   2. לוח הגדרות עימוד (מחליף את הפאנל המתרחב)
   3. מצב בדיקה (דוח עימוד חי + מרקרים)
   ========================================================================== */
(function() {
'use strict';

let _debugMode = false;
let _lastReportData = null;
let _blockMarkers = [];

function initTabSystem() {
    if (document.getElementById('tab-bar')) return;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const textPane = document.getElementById('text-pane');
    const settingsPane = document.getElementById('settings-pane');
    if (!textPane || !settingsPane) return;

    // 1. הסר את ה-collapse-strip של settings-pane
    const collapseStrip = settingsPane.querySelector('.collapse-strip');
    if (collapseStrip) collapseStrip.remove();

    // 2. הגדל את text-pane לרוחב מלא, הסתר את settings-pane
    textPane.style.width = '100%';
    textPane.style.borderLeft = 'none';
    settingsPane.style.display = 'none';
    settingsPane.classList.remove('collapsed');
    settingsPane.style.width = '100%';
    settingsPane.style.height = '100%';
    settingsPane.style.borderLeft = 'none';

    // 3. הגדל את textPane ל-flex column רגיל
    textPane.style.height = '100%';

    // 4. הוסף לחצני בדיקה לתוך ה-text-actions-bar של textPane
    const actionsBar = textPane.querySelector('.text-actions-bar');
    if (actionsBar) {
        // מסמך קבוע
        const btnSeeded = document.createElement('button');
        btnSeeded.type = 'button';
        btnSeeded.className = 'btn-tool btn-secondary';
        btnSeeded.innerHTML = '📋 מסמך קבוע';
        btnSeeded.style.flex = '0.7';
        btnSeeded.title = 'טקסט בדיקה קבוע (אותו טקסט בכל פעם)';
        btnSeeded.addEventListener('click', function() {
            if (typeof generateTestTextSeeded === 'function') {
                const text = generateTestTextSeeded();
                if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
                setTimeout(function() { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
            }
        });
        actionsBar.insertBefore(btnSeeded, actionsBar.firstChild);

        // מסמך רנדומלי
        const btnRandom = document.createElement('button');
        btnRandom.type = 'button';
        btnRandom.className = 'btn-tool btn-secondary';
        btnRandom.innerHTML = '🎲 מסמך רנדומלי';
        btnRandom.style.flex = '0.7';
        btnRandom.title = 'טקסט בדיקה רנדומלי (טקסט שונה בכל פעם)';
        btnRandom.addEventListener('click', function() {
            if (typeof generateTestText === 'function') {
                const text = generateTestText();
                if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
                setTimeout(function() { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
            }
        });
        actionsBar.insertBefore(btnRandom, btnSeeded.nextSibling);

        // דוח עימוד (חלון נפרד)
        const btnReport = document.createElement('button');
        btnReport.type = 'button';
        btnReport.className = 'btn-tool btn-secondary';
        btnReport.innerHTML = '📊 דוח עימוד';
        btnReport.style.flex = '0.7';
        btnReport.title = 'הפקת דוח עימוד מפורט בחלון נפרד';
        btnReport.addEventListener('click', function() {
            if (typeof generateLayoutReport === 'function') generateLayoutReport();
        });
        actionsBar.insertBefore(btnReport, btnRandom.nextSibling);
    }

    // 5. צור טאב בדיקה
    const debugPane = document.createElement('div');
    debugPane.id = 'tab-debug';
    debugPane.style.cssText = 'display:none;flex:1;flex-direction:column;overflow-y:auto;padding:8px;background:#f8fafc;';
    debugPane.innerHTML = `
        <div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">
            <button id="btn-refresh-debug" class="btn-tool btn-secondary" style="flex:0.5;" title="רענן דוח">🔄 רענן</button>
            <button id="btn-export-marked" class="btn-tool btn-primary" style="flex:1;" title="ייצא HTML ממורקר">💾 ייצא HTML ממורקר</button>
        </div>
        <div id="debug-summary"></div>
        <div id="debug-blocks-table" style="margin-top:12px;"></div>
        <div id="debug-issues-list" style="margin-top:12px;"></div>
    `;
    sidebar.appendChild(debugPane);

    // 6. צור שורת טאבים — מצורפת מעל textPane
    const tabBar = document.createElement('div');
    tabBar.id = 'tab-bar';
    tabBar.style.cssText = 'display:flex;flex-direction:row;background:#1e293b;flex-shrink:0;border-bottom:2px solid #334155;';
    tabBar.innerHTML = `
        <button class="tab-btn" data-tab="text-pane" style="flex:1;padding:8px 4px;border:none;background:#334155;color:#e2e8f0;cursor:pointer;font-size:9pt;font-family:inherit;">✍️ עורך</button>
        <button class="tab-btn" data-tab="settings-pane" style="flex:1;padding:8px 4px;border:none;background:#1e293b;color:#94a3b8;cursor:pointer;font-size:9pt;font-family:inherit;">⚙️ הגדרות</button>
        <button class="tab-btn" data-tab="tab-debug" style="flex:1;padding:8px 4px;border:none;background:#1e293b;color:#94a3b8;cursor:pointer;font-size:9pt;font-family:inherit;">🔬 בדיקה</button>
    `;
    sidebar.insertBefore(tabBar, sidebar.firstChild);

    // 7. הגדר את ה-sidebar כ-flex column (טאבים מלמעלה, תוכן מתחת)
    sidebar.style.flexDirection = 'column';
    sidebar.style.width = '440px';

    // 8. טפל בלחיצות טאב
    function switchTab(tabId) {
        // הסתר את כל הפאנלים
        textPane.style.display = 'none';
        settingsPane.style.display = 'none';
        debugPane.style.display = 'none';
        // הצג את הנבחר
        const target = document.getElementById(tabId);
        if (target) target.style.display = (tabId === 'tab-debug') ? 'flex' : 'flex';
        // עדכן כפתורים
        tabBar.querySelectorAll('.tab-btn').forEach(function(b) {
            b.style.background = '#1e293b';
            b.style.color = '#94a3b8';
        });
        const activeBtn = tabBar.querySelector('[data-tab="' + tabId + '"]');
        if (activeBtn) {
            activeBtn.style.background = '#334155';
            activeBtn.style.color = '#e2e8f0';
        }
        // אם עברנו לטאב בדיקה
        if (tabId === 'tab-debug') {
            _debugMode = true;
            runDebugReport();
        } else {
            _debugMode = false;
            clearBlockMarkers();
        }
    }

    tabBar.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { switchTab(this.dataset.tab); });
    });

    // טאב ברירת מחדל: עורך
    switchTab('text-pane');

    // 9. חבר לחצני דוח
    document.getElementById('btn-refresh-debug').addEventListener('click', runDebugReport);
    document.getElementById('btn-export-marked').addEventListener('click', exportMarkedHTML);

    // 10. בטל את toggleSettingsPane הישן כדי שלא יתנגש
    if (typeof window.toggleSettingsPane === 'function') {
        const orig = window.toggleSettingsPane;
        window.toggleSettingsPane = function() { switchTab('settings-pane'); };
    }
}

function runDebugReport() {
    var pages = document.querySelectorAll('#book-container .a4-page');
    if (pages.length === 0) return;
    clearBlockMarkers();
    var S = { totalPages: pages.length, totalBlocks: 0, imbalanced: 0, sparse: 0, sparseCut: 0, overflow: 0, widows: 0, orphans: 0, headingAtBottom: 0, singleLinePCut: 0, emptyColumns: 0, sideNoteOverlap: 0, shortPages: 0 };
    var blockData = []; var allIssues = [];
    pages.forEach(function(pg, pIdx) {
        var pNum = (pg.querySelector('.page-number-footer') || {}).textContent ? pg.querySelector('.page-number-footer').textContent.trim() : '';
        var bf = pg.querySelector('.page-body-flow');
        if (bf && pIdx < pages.length - 1 && bf.scrollHeight < bf.clientHeight * 0.80) { S.shortPages++; allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'עמוד קצר', severity: 'medium', detail: Math.round(bf.scrollHeight / bf.clientHeight * 100) + '% מילוי' }); }
        if (typeof checkWidowOrphan === 'function') { var wo = checkWidowOrphan(pg); S.widows += wo.widows; S.orphans += wo.orphans; wo.details.widows.forEach(function(w) { allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'אלמנה', severity: 'high', detail: 'טור ' + (w.col + 1) }); }); wo.details.orphans.forEach(function(o) { allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'יתום', severity: 'high', detail: 'טור ' + (o.col + 1) }); }); }
        if (typeof checkHeadingAtColumnBottom === 'function') { var hb = checkHeadingAtColumnBottom(pg); S.headingAtBottom += hb.length; hb.forEach(function(h) { allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'כותרת בתחתית', severity: 'high', detail: 'טור ' + (h.col + 1) + ', H' + h.headingType }); }); }
        if (typeof checkSingleLinePCut === 'function') { var slpc = checkSingleLinePCut(pg); S.singleLinePCut += slpc.length; slpc.forEach(function(s) { allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'p-cut חד-שורתי', severity: 'medium', detail: 'טור ' + (s.col + 1) }); }); }
        if (typeof checkEmptyColumn === 'function') { var ec = checkEmptyColumn(pg); S.emptyColumns += ec.length; ec.forEach(function(e) { allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'טור ריק', severity: 'low', detail: 'טור ' + (e.col + 1) }); }); }
        if (typeof checkSideNoteOverlap === 'function') { var sno = checkSideNoteOverlap(pg); S.sideNoteOverlap += sno.length; sno.forEach(function(o) { allIssues.push({ page: pIdx + 1, pNum: pNum, type: 'חפיפת הערות', severity: 'high', detail: o.overlapPx + 'px' }); }); }
        pg.querySelectorAll('.block-2col').forEach(function(b, bi) {
            var r = b.querySelector('.right-col'), l = b.querySelector('.left-col');
            if (!r || !l) return; S.totalBlocks++;
            var rH = r.scrollHeight, lH = l.scrollHeight, d = Math.abs(rH - lH);
            var blockIssues = [];
            if (d > 5) { S.imbalanced++; blockIssues.push({ type: 'אי-איזון', severity: d > 30 ? 'high' : 'medium', detail: d + 'px' }); }
            if (typeof checkColumnOverflow === 'function') { var rOv = checkColumnOverflow(r), lOv = checkColumnOverflow(l); if (rOv && rOv.overflow) { S.overflow++; blockIssues.push({ type: 'גלישה ימין', severity: 'high', detail: rOv.overflowPx + 'px' }); } if (lOv && lOv.overflow) { S.overflow++; blockIssues.push({ type: 'גלישה שמאל', severity: 'high', detail: lOv.overflowPx + 'px' }); } }
            [r, l].forEach(function(col, ci) {
                var colRect = col.getBoundingClientRect(); var cw = colRect.width;
                col.querySelectorAll('p.p-cut').forEach(function(p) {
                    try { var range = document.createRange(); range.selectNodeContents(p); var rects = range.getClientRects(); var lineMap = new Map();
                        for (var rect of rects) { if (rect.height > 0) { var top = Math.round(rect.top); var rightFromColLeft = rect.right - colRect.left; if (!lineMap.has(top) || rightFromColLeft > lineMap.get(top)) { lineMap.set(top, rightFromColLeft); } } }
                        if (lineMap.size === 0) return; var sortedTops = Array.from(lineMap.keys()).sort(function(a, b) { return a - b; });
                        var lastLineWidth = lineMap.get(sortedTops[sortedTops.length - 1]) || 0;
                        if (lineMap.size > 1 && lastLineWidth < cw * 0.5) { S.sparse++; S.sparseCut++; blockIssues.push({ type: 'שורה דלילה', severity: 'medium', detail: 'טור ' + (ci === 0 ? 'ימין' : 'שמאל') + ', ' + Math.round(lastLineWidth) + 'px' }); }
                        if (lineMap.size > 1 && lastLineWidth < cw * 0.15) { blockIssues.push({ type: 'מילה בודדת', severity: 'high', detail: 'טור ' + (ci === 0 ? 'ימין' : 'שמאל') }); }
                    } catch (e) {}
                });
            });
            var color = '#10b981'; var tooltip = 'תקין';
            if (blockIssues.length > 0) { var hasHigh = blockIssues.some(function(i) { return i.severity === 'high'; });
                if (hasHigh) { if (blockIssues.some(function(i) { return i.type.indexOf('גלישה') >= 0; })) color = '#ef4444'; else if (blockIssues.some(function(i) { return i.type === 'מילה בודדת'; })) color = '#f97316'; else color = '#a855f7'; }
                else { if (blockIssues.some(function(i) { return i.type === 'שורה דלילה'; })) color = '#f59e0b'; else color = '#eab308'; }
                tooltip = blockIssues.map(function(i) { return i.type + ': ' + i.detail; }).join('\n');
            }
            blockData.push({ page: pIdx + 1, pNum: pNum, block: bi, rH: rH, lH: lH, d: d, ok: d <= 5 && blockIssues.length === 0, issues: blockIssues, color: color, tooltip: tooltip });
            applyBlockMarker(b, color, tooltip, blockIssues);
        });
    });
    _lastReportData = { S: S, blockData: blockData, allIssues: allIssues };
    renderDebugPanel(S, blockData, allIssues);
}

function applyBlockMarker(block, color, tooltip, issues) {
    var old = block.querySelector('.debug-block-marker'); if (old) old.remove();
    block.style.outline = '3px solid ' + color; block.style.outlineOffset = '2px';
    var marker = document.createElement('div'); marker.className = 'debug-block-marker';
    marker.style.cssText = 'position:absolute;top:4px;right:4px;background:' + color + ';color:#fff;padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:bold;z-index:100;pointer-events:none;opacity:0.9;';
    marker.textContent = issues.length > 0 ? issues.length + '⚠' : '✓';
    block.style.position = 'relative'; block.appendChild(marker); block.title = 'בלוק — ' + tooltip;
    _blockMarkers.push({ element: block, color: color, tooltip: tooltip, issues: issues });
}

function clearBlockMarkers() {
    _blockMarkers.forEach(function(m) { m.element.style.outline = ''; m.element.style.outlineOffset = ''; m.element.removeAttribute('title'); var marker = m.element.querySelector('.debug-block-marker'); if (marker) marker.remove(); });
    _blockMarkers = [];
}

function renderDebugPanel(S, blockData, allIssues) {
    var summary = document.getElementById('debug-summary');
    if (summary) {
        var issueCount = S.imbalanced + S.overflow + S.sparseCut + S.widows + S.orphans + S.headingAtBottom + S.singleLinePCut + S.emptyColumns + S.sideNoteOverlap + S.shortPages;
        var okBlocks = S.totalBlocks - S.imbalanced;
        summary.innerHTML = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:8px;">'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:#1e293b;">' + S.totalPages + '</div><div style="font-size:7pt;color:#64748b;">עמודים</div></div>'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (okBlocks > 0 ? '#059669' : '#dc2626') + ';">' + okBlocks + '/' + S.totalBlocks + '</div><div style="font-size:7pt;color:#64748b;">תקינים</div></div>'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (issueCount === 0 ? '#059669' : '#dc2626') + ';">' + issueCount + '</div><div style="font-size:7pt;color:#64748b;">בעיות</div></div>'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (S.sparseCut === 0 ? '#059669' : '#d97706') + ';">' + S.sparseCut + '</div><div style="font-size:7pt;color:#64748b;">דלילות</div></div>'
            + '</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px;font-size:7pt;margin-bottom:8px;">'
            + '<div style="text-align:center;">אי-איזון: <b style="color:' + (S.imbalanced ? '#ca8a04' : '#059669') + '">' + S.imbalanced + '</b></div>'
            + '<div style="text-align:center;">גלישות: <b style="color:' + (S.overflow ? '#dc2626' : '#059669') + '">' + S.overflow + '</b></div>'
            + '<div style="text-align:center;">אלמנות: <b style="color:' + (S.widows ? '#dc2626' : '#059669') + '">' + S.widows + '</b></div>'
            + '<div style="text-align:center;">יתומים: <b style="color:' + (S.orphans ? '#dc2626' : '#059669') + '">' + S.orphans + '</b></div>'
            + '<div style="text-align:center;">קצרים: <b style="color:' + (S.shortPages ? '#d97706' : '#059669') + '">' + S.shortPages + '</b></div></div>';
    }
    var tableDiv = document.getElementById('debug-blocks-table');
    if (tableDiv) {
        var html = '<div style="font-size:8pt;font-weight:bold;color:#475569;margin-bottom:4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">טבלת בלוקים</div><div style="font-size:6pt;color:#64748b;margin-bottom:3px;">🟢תקין 🟡אי-איזון 🟠דלילות 🔴גלישה 🟣אלמנה</div>';
        html += '<table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">בלוק</th><th style="padding:2px;border:1px solid #cbd5e1;">R</th><th style="padding:2px;border:1px solid #cbd5e1;">L</th><th style="padding:2px;border:1px solid #cbd5e1;">Δ</th><th style="padding:2px;border:1px solid #cbd5e1;">●</th><th style="padding:2px;border:1px solid #cbd5e1;">בעיות</th></tr></thead><tbody>';
        blockData.forEach(function(b) {
            html += '<tr class="debug-block-row" data-page="' + b.page + '" data-block="' + b.block + '" style="cursor:pointer;border:1px solid #cbd5e1;' + (b.ok ? '' : 'background:#fef3c7;') + '"><td style="padding:1px;text-align:center;">' + (b.pNum || b.page) + '</td><td style="padding:1px;text-align:center;">#' + b.block + '</td><td style="padding:1px;text-align:center;">' + b.rH + '</td><td style="padding:1px;text-align:center;">' + b.lH + '</td><td style="padding:1px;text-align:center;color:' + (b.d > 5 ? '#ca8a04' : '#059669') + ';">' + b.d + '</td><td style="padding:1px;text-align:center;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + b.color + ';"></span></td><td style="padding:1px;font-size:6pt;">' + (b.issues.map(function(i) { return i.type + '(' + i.detail + ')'; }).join(', ') || '—') + '</td></tr>';
        });
        html += '</tbody></table>'; tableDiv.innerHTML = html;
        tableDiv.querySelectorAll('.debug-block-row').forEach(function(row) { row.addEventListener('click', function() { scrollToBlock(parseInt(row.dataset.page), parseInt(row.dataset.block)); }); });
    }
    var issuesDiv = document.getElementById('debug-issues-list');
    if (issuesDiv && allIssues.length > 0) {
        var h = '<div style="font-size:8pt;font-weight:bold;color:#dc2626;margin-bottom:4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">רשימת בעיות (' + allIssues.length + ')</div><table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">סוג</th><th style="padding:2px;border:1px solid #cbd5e1;">חומרה</th><th style="padding:2px;border:1px solid #cbd5e1;">פרטים</th></tr></thead><tbody>';
        allIssues.slice(0, 200).forEach(function(iss) { var sc = iss.severity === 'high' ? '#dc2626' : (iss.severity === 'medium' ? '#d97706' : '#64748b'); h += '<tr style="border:1px solid #cbd5e1;"><td style="padding:1px;">' + (iss.pNum || iss.page) + '</td><td style="padding:1px;">' + iss.type + '</td><td style="padding:1px;color:' + sc + ';">' + iss.severity + '</td><td style="padding:1px;">' + iss.detail + '</td></tr>'; });
        h += '</tbody></table>'; issuesDiv.innerHTML = h;
    } else if (issuesDiv) { issuesDiv.innerHTML = '<div style="color:#059669;font-weight:bold;font-size:10pt;">✓ אין בעיות!</div>'; }
}

function scrollToBlock(pageNum, blockIdx) {
    var pages = document.querySelectorAll('#book-container .a4-page'); var pg = pages[pageNum - 1]; if (!pg) return;
    var blocks = pg.querySelectorAll('.block-2col'); var block = blocks[blockIdx]; if (!block) return;
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var o = block.style.outline, o2 = block.style.outlineOffset;
    block.style.outline = '5px solid #3b82f6'; block.style.outlineOffset = '4px';
    setTimeout(function() { block.style.outline = o; block.style.outlineOffset = o2; }, 2000);
}

function exportMarkedHTML() {
    if (!_lastReportData) { alert('אין דוח זמין.'); return; }
    var data = _lastReportData; var S = data.S, blockData = data.blockData, allIssues = data.allIssues;
    var bc = document.getElementById('book-container'); if (!bc) return;
    var clone = bc.cloneNode(true); var cbs = clone.querySelectorAll('.block-2col');
    blockData.forEach(function(b, i) { var cb = cbs[i]; if (!cb) return; cb.style.outline = '3px solid ' + b.color; cb.style.outlineOffset = '2px'; cb.style.position = 'relative'; var m = document.createElement('div'); m.style.cssText = 'position:absolute;top:4px;right:4px;background:' + b.color + ';color:#fff;padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:bold;z-index:100;'; m.textContent = b.issues.length > 0 ? b.issues.length + '⚠' : '✓'; cb.appendChild(m); cb.title = b.tooltip; });
    var sh = ''; for (var s of document.styleSheets) { try { if (s.cssRules) { sh += '<style>\n'; for (var r of s.cssRules) sh += r.cssText + '\n'; sh += '</style>\n'; } else if (s.href) sh += '<link rel="stylesheet" href="' + s.href + '">\n'; } catch (e) {} }
    var p = '<div style="position:fixed;top:0;left:0;width:400px;height:100vh;background:#f8fafc;color:#1e293b;font-family:sans-serif;font-size:9pt;z-index:9999;overflow-y:auto;padding:12px;box-shadow:4px 0 20px rgba(0,0,0,0.2);direction:rtl;border-left:2px solid #cbd5e1;"><h2 style="color:#1e40af;border-bottom:2px solid #cbd5e1;padding-bottom:6px;font-size:12pt;">🔬 דוח עימוד ממורקר</h2><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:8px 0;"><div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><b style="font-size:14pt;">' + S.totalPages + '</b><div style="font-size:7pt;color:#64748b;">עמודים</div></div><div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><b style="font-size:14pt;color:#059669;">' + (S.totalBlocks-S.imbalanced) + '/' + S.totalBlocks + '</b><div style="font-size:7pt;color:#64748b;">תקינים</div></div><div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><b style="font-size:14pt;color:' + ((S.imbalanced+S.overflow+S.sparseCut+S.widows+S.orphans)>0?'#dc2626':'#059669') + ';">' + (S.imbalanced+S.overflow+S.sparseCut+S.widows+S.orphans) + '</b><div style="font-size:7pt;color:#64748b;">בעיות</div></div><div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><b style="font-size:14pt;color:' + (S.sparseCut>0?'#d97706':'#059669') + ';">' + S.sparseCut + '</b><div style="font-size:7pt;color:#64748b;">דלילות</div></div></div>';
    p += '<div style="font-size:8pt;font-weight:bold;color:#475569;margin:8px 0 4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">טבלת בלוקים</div><table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">בלוק</th><th style="padding:2px;border:1px solid #cbd5e1;">R</th><th style="padding:2px;border:1px solid #cbd5e1;">L</th><th style="padding:2px;border:1px solid #cbd5e1;">Δ</th><th style="padding:2px;border:1px solid #cbd5e1;">●</th><th style="padding:2px;border:1px solid #cbd5e1;">בעיות</th></tr></thead><tbody>';
    blockData.forEach(function(b, i) { p += '<tr style="cursor:pointer;border:1px solid #cbd5e1;' + (b.ok?'':'background:#fef3c7;') + '" onclick="document.querySelectorAll(\'.block-2col\')[' + i + '].scrollIntoView({behavior:\'smooth\',block:\'center\'});"><td style="padding:1px;text-align:center;">' + (b.pNum||b.page) + '</td><td style="padding:1px;text-align:center;">#' + b.block + '</td><td style="padding:1px;text-align:center;">' + b.rH + '</td><td style="padding:1px;text-align:center;">' + b.lH + '</td><td style="padding:1px;text-align:center;color:' + (b.d>5?'#ca8a04':'#059669') + ';">' + b.d + '</td><td style="padding:1px;text-align:center;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + b.color + ';"></span></td><td style="padding:1px;font-size:6pt;">' + (b.issues.map(function(iss){return iss.type+'('+iss.detail+')';}).join(', ')||'—') + '</td></tr>'; });
    p += '</tbody></table>';
    if (allIssues.length > 0) { p += '<div style="font-size:8pt;font-weight:bold;color:#dc2626;margin:8px 0 4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">רשימת בעיות</div><table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">סוג</th><th style="padding:2px;border:1px solid #cbd5e1;">חומרה</th><th style="padding:2px;border:1px solid #cbd5e1;">פרטים</th></tr></thead><tbody>'; allIssues.slice(0,200).forEach(function(iss){var sc=iss.severity==='high'?'#dc2626':(iss.severity==='medium'?'#d97706':'#64748b');p+='<tr style="border:1px solid #cbd5e1;"><td style="padding:1px;">'+(iss.pNum||iss.page)+'</td><td style="padding:1px;">'+iss.type+'</td><td style="padding:1px;color:'+sc+';">'+iss.severity+'</td><td style="padding:1px;">'+iss.detail+'</td></tr>';}); p += '</tbody></table>'; }
    p += '</div>';
    var html = '<!DOCTYPE html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="UTF-8">\n<title>מסמך ממורקר</title>\n' + sh + '\n<style>\nhtml,body{margin:0;padding:0;background:#475569;}\n#sidebar,#text-pane,#settings-pane,#resizer,#measuring-box,#tab-bar{display:none!important;}\n#preview-pane{display:block!important;position:static!important;width:calc(100% - 400px)!important;margin-right:400px!important;}\n#book-container{margin:0 auto;}\n.block-2col{position:relative;}\n</style>\n</head>\n<body>\n' + p + '\n' + clone.outerHTML + '\n</body>\n</html>';
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' }); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'marked-document.html'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
}

var _orig = typeof typesetDocument === 'function' ? typesetDocument : null;
if (_orig) { typesetDocument = function() { _orig.apply(this, arguments); if (_debugMode) { setTimeout(runDebugReport, 5000); } }; }
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTabSystem); } else { initTabSystem(); }
window.runDebugReport = runDebugReport; window.exportMarkedHTML = exportMarkedHTML;
})();
