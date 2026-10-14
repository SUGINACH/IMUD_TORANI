/* ==========================================================================
   debug-panel.js — מצב בדיקה + מערכת טאבים לסרגל הצידי
   ========================================================================== */
(function() {
'use strict';

let _debugMode = false;
let _lastReportData = null;
let _blockMarkers = [];

/**
 * initTabSystem — מחליף את מבנה ה-sidebar ב-3 טאבים.
 */
function initTabSystem() {
    if (document.getElementById('tab-bar')) return; // כבר מותקן

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // שמור את text-pane ו-settings-pane
    const textPane = document.getElementById('text-pane');
    const settingsPane = document.getElementById('settings-pane');
    if (!textPane || !settingsPane) return;

    // הסר את ה-collapse-strip של settings-pane (נשאר רק התוכן)
    const collapseStrip = settingsPane.querySelector('.collapse-strip');
    if (collapseStrip) collapseStrip.remove();

    // עטוף את settings-content ב-div עם id
    const settingsContent = settingsPane.querySelector('.settings-content');
    if (settingsContent) {
        settingsContent.id = 'tab-settings-content';
    }

    // צור טאב 3: מצב בדיקה
    const debugPane = document.createElement('div');
    debugPane.id = 'tab-debug';
    debugPane.className = 'tab-pane';
    debugPane.style.cssText = 'display:none; flex:1; overflow-y:auto; padding:8px;';
    debugPane.innerHTML = `
        <div class="debug-toolbar" style="display:flex; gap:4px; margin-bottom:8px; flex-wrap:wrap;">
            <button id="btn-seeded" class="btn-tool btn-secondary" style="flex:1;" title="טקסט קבוע (אותו טקסט בכל פעם)">📋 מסמך קבוע</button>
            <button id="btn-random" class="btn-tool btn-secondary" style="flex:1;" title="טקסט רנדומלי">🎲 מסמך רנדומלי</button>
            <button id="btn-report-window" class="btn-tool btn-secondary" style="flex:1;" title="דוח בחלון נפרד">📊 דוח נפרד</button>
            <button id="btn-refresh-debug" class="btn-tool btn-secondary" style="flex:0.5;" title="רענן דוח">🔄</button>
            <button id="btn-export-marked" class="btn-tool btn-primary" style="flex:1;" title="ייצא HTML ממורקר">💾 ייצא ממורקר</button>
        </div>
        <div id="debug-summary"></div>
        <div id="debug-blocks-table" style="margin-top:12px;"></div>
        <div id="debug-issues-list" style="margin-top:12px;"></div>
    `;

    // הפוך את textPane לטאב 1
    textPane.id = 'tab-editor';
    textPane.classList.add('tab-pane');
    textPane.style.flex = '1';

    // הפוך את settingsPane לטאב 2 — הסר collapsed, הסתר
    settingsPane.id = 'tab-settings';
    settingsPane.classList.add('tab-pane');
    settingsPane.classList.remove('collapsed');
    settingsPane.style.cssText = 'display:none; flex:1; overflow-y:auto;';

    // הוסף את טאב הבדיקה ל-sidebar
    sidebar.appendChild(debugPane);

    // צור שורת טאבים בראש ה-sidebar
    const tabBar = document.createElement('div');
    tabBar.id = 'tab-bar';
    tabBar.style.cssText = 'display:flex; flex-direction:row; background:#1e293b; border-bottom:2px solid #334155; flex-shrink:0;';
    tabBar.innerHTML = `
        <button class="tab-btn active" data-tab="tab-editor" style="flex:1; padding:8px 4px; border:none; background:#334155; color:#e2e8f0; cursor:pointer; font-size:9pt; font-family:inherit; border-radius:0 0 0 0;">✍️ עורך</button>
        <button class="tab-btn" data-tab="tab-settings" style="flex:1; padding:8px 4px; border:none; background:#1e293b; color:#94a3b8; cursor:pointer; font-size:9pt; font-family:inherit;">⚙️ הגדרות</button>
        <button class="tab-btn" data-tab="tab-debug" style="flex:1; padding:8px 4px; border:none; background:#1e293b; color:#94a3b8; cursor:pointer; font-size:9pt; font-family:inherit;">🔬 בדיקה</button>
    `;
    sidebar.insertBefore(tabBar, sidebar.firstChild);

    // טפל בלחיצות טאב
    tabBar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            // הסתר את כל הטאבים
            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
            // הצג את הטאב הנבחר
            const target = document.getElementById(tabId);
            if (target) target.style.display = 'flex';
            // עדכן כפתורים
            tabBar.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = '#1e293b';
                b.style.color = '#94a3b8';
            });
            this.classList.add('active');
            this.style.background = '#334155';
            this.style.color = '#e2e8f0';
            // אם עברנו לטאב בדיקה, הפעל דוח
            if (tabId === 'tab-debug') {
                _debugMode = true;
                runDebugReport();
            } else {
                _debugMode = false;
                clearBlockMarkers();
            }
        });
    });

    // חבר לחצני בדיקה
    document.getElementById('btn-seeded').addEventListener('click', function() {
        if (typeof generateTestTextSeeded === 'function') {
            const text = generateTestTextSeeded();
            if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
            setTimeout(function() { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
        }
    });
    document.getElementById('btn-random').addEventListener('click', function() {
        if (typeof generateTestText === 'function') {
            const text = generateTestText();
            if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
            setTimeout(function() { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
        }
    });
    document.getElementById('btn-report-window').addEventListener('click', function() {
        if (typeof generateLayoutReport === 'function') generateLayoutReport();
    });
    document.getElementById('btn-refresh-debug').addEventListener('click', runDebugReport);
    document.getElementById('btn-export-marked').addEventListener('click', exportMarkedHTML);
}

function toggleDebugMode() {
    _debugMode = !_debugMode;
    if (_debugMode) { runDebugReport(); } else { clearBlockMarkers(); }
}

function runDebugReport() {
    var pages = document.querySelectorAll('#book-container .a4-page');
    if (pages.length === 0) return;
    clearBlockMarkers();
    var S = { totalPages: pages.length, totalBlocks: 0, imbalanced: 0, sparse: 0, sparseCut: 0, overflow: 0, widows: 0, orphans: 0, headingAtBottom: 0, singleLinePCut: 0, emptyColumns: 0, sideNoteOverlap: 0, shortPages: 0 };
    var blockData = [];
    var allIssues = [];
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
            if (!r || !l) return;
            S.totalBlocks++;
            var rH = r.scrollHeight, lH = l.scrollHeight, d = Math.abs(rH - lH);
            var blockIssues = [];
            if (d > 5) { S.imbalanced++; blockIssues.push({ type: 'אי-איזון', severity: d > 30 ? 'high' : 'medium', detail: d + 'px' }); }
            if (typeof checkColumnOverflow === 'function') { var rOv = checkColumnOverflow(r), lOv = checkColumnOverflow(l); if (rOv && rOv.overflow) { S.overflow++; blockIssues.push({ type: 'גלישה ימין', severity: 'high', detail: rOv.overflowPx + 'px' }); } if (lOv && lOv.overflow) { S.overflow++; blockIssues.push({ type: 'גלישה שמאל', severity: 'high', detail: lOv.overflowPx + 'px' }); } }
            [r, l].forEach(function(col, ci) {
                var colRect = col.getBoundingClientRect(); var cw = colRect.width;
                col.querySelectorAll('p.p-cut').forEach(function(p) {
                    try {
                        var range = document.createRange(); range.selectNodeContents(p); var rects = range.getClientRects(); var lineMap = new Map();
                        for (var rect of rects) { if (rect.height > 0) { var top = Math.round(rect.top); var rightFromColLeft = rect.right - colRect.left; if (!lineMap.has(top) || rightFromColLeft > lineMap.get(top)) { lineMap.set(top, rightFromColLeft); } } }
                        if (lineMap.size === 0) return;
                        var sortedTops = Array.from(lineMap.keys()).sort(function(a, b) { return a - b; });
                        var lastLineWidth = lineMap.get(sortedTops[sortedTops.length - 1]) || 0;
                        if (lineMap.size > 1 && lastLineWidth < cw * 0.5) { S.sparse++; S.sparseCut++; blockIssues.push({ type: 'שורה דלילה', severity: 'medium', detail: 'טור ' + (ci === 0 ? 'ימין' : 'שמאל') + ', ' + Math.round(lastLineWidth) + 'px' }); }
                        if (lineMap.size > 1 && lastLineWidth < cw * 0.15) { blockIssues.push({ type: 'מילה בודדת', severity: 'high', detail: 'טור ' + (ci === 0 ? 'ימין' : 'שמאל') }); }
                    } catch (e) {}
                });
            });
            var color = '#10b981'; var tooltip = 'תקין';
            if (blockIssues.length > 0) {
                var hasHigh = blockIssues.some(function(i) { return i.severity === 'high'; });
                if (hasHigh) { if (blockIssues.some(function(i) { return i.type.indexOf('גלישה') >= 0; })) color = '#ef4444'; else if (blockIssues.some(function(i) { return i.type === 'מילה בודדת'; })) color = '#f97316'; else color = '#a855f7'; } else { if (blockIssues.some(function(i) { return i.type === 'שורה דלילה'; })) color = '#f59e0b'; else color = '#eab308'; }
                tooltip = blockIssues.map(function(i) { return i.type + ': ' + i.detail; }).join('\n');
            }
            blockData.push({ page: pIdx + 1, pNum: pNum, block: bi, rH: rH, lH: lH, d: d, ok: d <= 5 && blockIssues.length === 0, issues: blockIssues, color: color, tooltip: tooltip, element: b });
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
    // סיכום — מותאם לרוחב הפאנל (לא כהה)
    var summary = document.getElementById('debug-summary');
    if (summary) {
        var issueCount = S.imbalanced + S.overflow + S.sparseCut + S.widows + S.orphans + S.headingAtBottom + S.singleLinePCut + S.emptyColumns + S.sideNoteOverlap + S.shortPages;
        var okBlocks = S.totalBlocks - S.imbalanced;
        summary.innerHTML = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:8px;">'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:#1e293b;">' + S.totalPages + '</div><div style="font-size:7pt;color:#64748b;">עמודים</div></div>'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (okBlocks > 0 ? '#059669' : '#dc2626') + ';">' + okBlocks + '/' + S.totalBlocks + '</div><div style="font-size:7pt;color:#64748b;">תקינים</div></div>'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (issueCount === 0 ? '#059669' : '#dc2626') + ';">' + issueCount + '</div><div style="font-size:7pt;color:#64748b;">בעיות</div></div>'
            + '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (S.sparseCut === 0 ? '#059669' : '#d97706') + ';">' + S.sparseCut + '</div><div style="font-size:7pt;color:#64748b;">דלילות</div></div>'
            + '</div>'
            + '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:2px;font-size:7pt;margin-bottom:8px;">'
            + '<div style="text-align:center;">אי-איזון: <b style="color:' + (S.imbalanced ? '#ca8a04' : '#059669') + '">' + S.imbalanced + '</b></div>'
            + '<div style="text-align:center;">גלישות: <b style="color:' + (S.overflow ? '#dc2626' : '#059669') + '">' + S.overflow + '</b></div>'
            + '<div style="text-align:center;">אלמנות: <b style="color:' + (S.widows ? '#dc2626' : '#059669') + '">' + S.widows + '</b></div>'
            + '<div style="text-align:center;">יתומים: <b style="color:' + (S.orphans ? '#dc2626' : '#059669') + '">' + S.orphans + '</b></div>'
            + '<div style="text-align:center;">קצרים: <b style="color:' + (S.shortPages ? '#d97706' : '#059669') + '">' + S.shortPages + '</b></div>'
            + '</div>';
    }

    var tableDiv = document.getElementById('debug-blocks-table');
    if (tableDiv) {
        var html = '<div style="font-size:8pt;font-weight:bold;color:#475569;margin-bottom:4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">טבלת בלוקים</div>';
        html += '<div style="font-size:6pt;color:#64748b;margin-bottom:3px;">🟢תקין 🟡אי-איזון 🟠דלילות 🔴גלישה 🟣אלמנה</div>';
        html += '<table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">בלוק</th><th style="padding:2px;border:1px solid #cbd5e1;">R</th><th style="padding:2px;border:1px solid #cbd5e1;">L</th><th style="padding:2px;border:1px solid #cbd5e1;">Δ</th><th style="padding:2px;border:1px solid #cbd5e1;">●</th><th style="padding:2px;border:1px solid #cbd5e1;">בעיות</th></tr></thead><tbody>';
        blockData.forEach(function(b) {
            html += '<tr class="debug-block-row" data-page="' + b.page + '" data-block="' + b.block + '" style="cursor:pointer;border:1px solid #cbd5e1;' + (b.ok ? '' : 'background:#fef3c7;') + '"><td style="padding:1px;text-align:center;">' + (b.pNum || b.page) + '</td><td style="padding:1px;text-align:center;">#' + b.block + '</td><td style="padding:1px;text-align:center;">' + b.rH + '</td><td style="padding:1px;text-align:center;">' + b.lH + '</td><td style="padding:1px;text-align:center;color:' + (b.d > 5 ? '#ca8a04' : '#059669') + ';">' + b.d + '</td><td style="padding:1px;text-align:center;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + b.color + ';"></span></td><td style="padding:1px;font-size:6pt;">' + (b.issues.map(function(i) { return i.type + '(' + i.detail + ')'; }).join(', ') || '—') + '</td></tr>';
        });
        html += '</tbody></table>';
        tableDiv.innerHTML = html;
        tableDiv.querySelectorAll('.debug-block-row').forEach(function(row) { row.addEventListener('click', function() { var page = parseInt(row.dataset.page); var block = parseInt(row.dataset.block); scrollToBlock(page, block); }); });
    }

    var issuesDiv = document.getElementById('debug-issues-list');
    if (issuesDiv && allIssues.length > 0) {
        var h = '<div style="font-size:8pt;font-weight:bold;color:#dc2626;margin-bottom:4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">רשימת בעיות (' + allIssues.length + ')</div>';
        h += '<table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">סוג</th><th style="padding:2px;border:1px solid #cbd5e1;">חומרה</th><th style="padding:2px;border:1px solid #cbd5e1;">פרטים</th></tr></thead><tbody>';
        allIssues.slice(0, 200).forEach(function(iss) { var sc = iss.severity === 'high' ? '#dc2626' : (iss.severity === 'medium' ? '#d97706' : '#64748b'); h += '<tr style="border:1px solid #cbd5e1;"><td style="padding:1px;">' + (iss.pNum || iss.page) + '</td><td style="padding:1px;">' + iss.type + '</td><td style="padding:1px;color:' + sc + ';">' + iss.severity + '</td><td style="padding:1px;">' + iss.detail + '</td></tr>'; });
        h += '</tbody></table>';
        issuesDiv.innerHTML = h;
    } else if (issuesDiv) {
        issuesDiv.innerHTML = '<div style="color:#059669;font-weight:bold;font-size:10pt;">✓ אין בעיות!</div>';
    }
}

function scrollToBlock(pageNum, blockIdx) {
    var pages = document.querySelectorAll('#book-container .a4-page'); var pg = pages[pageNum - 1]; if (!pg) return;
    var blocks = pg.querySelectorAll('.block-2col'); var block = blocks[blockIdx]; if (!block) return;
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var origOutline = block.style.outline; var origOutlineOffset = block.style.outlineOffset;
    block.style.outline = '5px solid #3b82f6'; block.style.outlineOffset = '4px';
    setTimeout(function() { block.style.outline = origOutline; block.style.outlineOffset = origOutlineOffset; }, 2000);
}

function exportMarkedHTML() {
    if (!_lastReportData) { alert('אין דוח זמין.'); return; }
    var data = _lastReportData; var S = data.S, blockData = data.blockData, allIssues = data.allIssues;
    var bookContainer = document.getElementById('book-container'); if (!bookContainer) { alert('אין מסמך.'); return; }
    var clone = bookContainer.cloneNode(true);
    var clonedBlocks = clone.querySelectorAll('.block-2col');
    blockData.forEach(function(b, i) { var cb = clonedBlocks[i]; if (!cb) return; cb.style.outline = '3px solid ' + b.color; cb.style.outlineOffset = '2px'; cb.style.position = 'relative'; var m = document.createElement('div'); m.style.cssText = 'position:absolute;top:4px;right:4px;background:' + b.color + ';color:#fff;padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:bold;z-index:100;'; m.textContent = b.issues.length > 0 ? b.issues.length + '⚠' : '✓'; cb.appendChild(m); cb.title = b.tooltip; });
    var stylesHTML = '';
    for (var sheet of document.styleSheets) { try { if (sheet.cssRules) { stylesHTML += '<style>\n'; for (var rule of sheet.cssRules) stylesHTML += rule.cssText + '\n'; stylesHTML += '</style>\n'; } else if (sheet.href) { stylesHTML += '<link rel="stylesheet" href="' + sheet.href + '">\n'; } } catch (e) {} }
    var panelHTML = '<div id="debug-panel-export" style="position:fixed;top:0;left:0;width:400px;height:100vh;background:#f8fafc;color:#1e293b;font-family:sans-serif;font-size:9pt;z-index:9999;overflow-y:auto;padding:12px;box-shadow:4px 0 20px rgba(0,0,0,0.2);direction:rtl;border-left:2px solid #cbd5e1;"><h2 style="color:#1e40af;border-bottom:2px solid #cbd5e1;padding-bottom:6px;font-size:12pt;">🔬 דוח עימוד ממורקר</h2>';
    panelHTML += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:8px 0;">';
    panelHTML += '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:#1e293b;">' + S.totalPages + '</div><div style="font-size:7pt;color:#64748b;">עמודים</div></div>';
    panelHTML += '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:#059669;">' + (S.totalBlocks - S.imbalanced) + '/' + S.totalBlocks + '</div><div style="font-size:7pt;color:#64748b;">תקינים</div></div>';
    panelHTML += '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + ((S.imbalanced+S.overflow+S.sparseCut+S.widows+S.orphans)>0?'#dc2626':'#059669') + ';">' + (S.imbalanced+S.overflow+S.sparseCut+S.widows+S.orphans) + '</div><div style="font-size:7pt;color:#64748b;">בעיות</div></div>';
    panelHTML += '<div style="background:#e2e8f0;padding:6px;border-radius:4px;text-align:center;border:1px solid #cbd5e1;"><div style="font-size:14pt;font-weight:bold;color:' + (S.sparseCut>0?'#d97706':'#059669') + ';">' + S.sparseCut + '</div><div style="font-size:7pt;color:#64748b;">דלילות</div></div>';
    panelHTML += '</div>';
    panelHTML += '<div style="font-size:8pt;font-weight:bold;color:#475569;margin:8px 0 4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">טבלת בלוקים</div>';
    panelHTML += '<table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">בלוק</th><th style="padding:2px;border:1px solid #cbd5e1;">R</th><th style="padding:2px;border:1px solid #cbd5e1;">L</th><th style="padding:2px;border:1px solid #cbd5e1;">Δ</th><th style="padding:2px;border:1px solid #cbd5e1;">●</th><th style="padding:2px;border:1px solid #cbd5e1;">בעיות</th></tr></thead><tbody>';
    blockData.forEach(function(b, i) { panelHTML += '<tr style="cursor:pointer;border:1px solid #cbd5e1;' + (b.ok?'':'background:#fef3c7;') + '" onclick="document.querySelectorAll(\'.block-2col\')[' + i + '].scrollIntoView({behavior:\'smooth\',block:\'center\'});"><td style="padding:1px;text-align:center;">' + (b.pNum||b.page) + '</td><td style="padding:1px;text-align:center;">#' + b.block + '</td><td style="padding:1px;text-align:center;">' + b.rH + '</td><td style="padding:1px;text-align:center;">' + b.lH + '</td><td style="padding:1px;text-align:center;color:' + (b.d>5?'#ca8a04':'#059669') + ';">' + b.d + '</td><td style="padding:1px;text-align:center;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + b.color + ';"></span></td><td style="padding:1px;font-size:6pt;">' + (b.issues.map(function(iss){return iss.type+'('+iss.detail+')';}).join(', ')||'—') + '</td></tr>'; });
    panelHTML += '</tbody></table>';
    if (allIssues.length > 0) { panelHTML += '<div style="font-size:8pt;font-weight:bold;color:#dc2626;margin:8px 0 4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">רשימת בעיות</div><table style="width:100%;border-collapse:collapse;font-size:7pt;"><thead><tr style="background:#e2e8f0;"><th style="padding:2px;border:1px solid #cbd5e1;">עמוד</th><th style="padding:2px;border:1px solid #cbd5e1;">סוג</th><th style="padding:2px;border:1px solid #cbd5e1;">חומרה</th><th style="padding:2px;border:1px solid #cbd5e1;">פרטים</th></tr></thead><tbody>'; allIssues.slice(0,200).forEach(function(iss){var sc=iss.severity==='high'?'#dc2626':(iss.severity==='medium'?'#d97706':'#64748b');panelHTML+='<tr style="border:1px solid #cbd5e1;"><td style="padding:1px;">'+(iss.pNum||iss.page)+'</td><td style="padding:1px;">'+iss.type+'</td><td style="padding:1px;color:'+sc+';">'+iss.severity+'</td><td style="padding:1px;">'+iss.detail+'</td></tr>';}); panelHTML += '</tbody></table>'; }
    panelHTML += '</div>';
    var html = '<!DOCTYPE html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="UTF-8">\n<title>מסמך מרונדר ממורקר</title>\n' + stylesHTML + '\n<style>\nhtml,body{margin:0;padding:0;background:#475569;}\n#sidebar,#text-pane,#settings-pane,#resizer,#measuring-box,#tab-bar{display:none!important;}\n#preview-pane{display:block!important;position:static!important;width:calc(100% - 400px)!important;margin-right:400px!important;}\n#book-container{margin:0 auto;}\n.block-2col{position:relative;}\n</style>\n</head>\n<body>\n' + panelHTML + '\n' + clone.outerHTML + '\n</body>\n</html>';
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' }); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'marked-document.html'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
}

var _origTypesetDocument = typeof typesetDocument === 'function' ? typesetDocument : null;
if (_origTypesetDocument) { typesetDocument = function() { _origTypesetDocument.apply(this, arguments); if (_debugMode) { setTimeout(function() { runDebugReport(); }, 5000); } }; }

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTabSystem); } else { initTabSystem(); }
window.toggleDebugMode = toggleDebugMode;
window.runDebugReport = runDebugReport;
window.exportMarkedHTML = exportMarkedHTML;
window.isDebugMode = function() { return _debugMode; };
})();
