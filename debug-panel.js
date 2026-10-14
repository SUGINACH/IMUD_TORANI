/* ==========================================================================
   debug-panel.js — מצב בדיקה: דוח עימוד חי + מרקרים ויזואליים
   ========================================================================== */
(function() {
'use strict';

let _debugMode = false;
let _lastReportData = null;
let _blockMarkers = [];

function initDebugPanel() {
    if (document.getElementById('btn-debug-mode')) return;
    const bar = document.querySelector('.text-actions-bar');
    if (!bar) return;

    // צור קונטיינר ללחצני בדיקה (מוסתר במצב רגיל)
    const testBtns = document.createElement('div');
    testBtns.id = 'debug-test-buttons';
    testBtns.style.cssText = 'display:none; flex-direction:row; gap:4px;';

    // לחצן 1: מסמך בדיקה קבוע
    const btnFixed = document.createElement('button');
    btnFixed.type = 'button';
    btnFixed.className = 'btn-tool btn-secondary';
    btnFixed.innerHTML = '📋 מסמך קבוע';
    btnFixed.style.flex = '0.7';
    btnFixed.title = 'הזרקת טקסט בדיקה קבוע (seeded — אותו טקסט בכל פעם)';
    btnFixed.addEventListener('click', function() {
        if (typeof generateTestTextSeeded === 'function') {
            const text = generateTestTextSeeded();
            if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
            setTimeout(function() { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
        }
    });
    testBtns.appendChild(btnFixed);

    // לחצן 2: מסמך בדיקה רנדומלי
    const btnRandom = document.createElement('button');
    btnRandom.type = 'button';
    btnRandom.className = 'btn-tool btn-secondary';
    btnRandom.innerHTML = '🎲 מסמך רנדומלי';
    btnRandom.style.flex = '0.7';
    btnRandom.title = 'הזרקת טקסט בדיקה רנדומלי (טקסט שונה בכל פעם)';
    btnRandom.addEventListener('click', function() {
        if (typeof generateTestText === 'function') {
            const text = generateTestText();
            if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
            setTimeout(function() { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
        }
    });
    testBtns.appendChild(btnRandom);

    // לחצן 3: דוח עימוד (חלון נפרד)
    const btnReport = document.createElement('button');
    btnReport.type = 'button';
    btnReport.className = 'btn-tool btn-secondary';
    btnReport.innerHTML = '📊 דוח עימוד';
    btnReport.style.flex = '0.7';
    btnReport.title = 'הפקת דוח עימוד מפורט בחלון נפרד';
    btnReport.addEventListener('click', function() {
        if (typeof generateLayoutReport === 'function') generateLayoutReport();
    });
    testBtns.appendChild(btnReport);

    bar.insertBefore(testBtns, bar.firstChild);

    // כפתור מצב בדיקה
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-debug-mode';
    btn.className = 'btn-tool btn-secondary';
    btn.innerHTML = '🔬 מצב בדיקה';
    btn.style.flex = '0.7';
    btn.title = 'הפעלת מצב בדיקה — דוח עימוד חי עם מרקרים ויזואליים';
    btn.addEventListener('click', toggleDebugMode);
    bar.insertBefore(btn, testBtns);

    createDebugPanel();
}

function toggleDebugMode() {
    _debugMode = !_debugMode;
    const btn = document.getElementById('btn-debug-mode');
    if (btn) {
        btn.style.background = _debugMode ? '#10b981' : '';
        btn.style.color = _debugMode ? '#fff' : '';
        btn.textContent = _debugMode ? '✓ מצב בדיקה פעיל' : '🔬 מצב בדיקה';
    }
    const panel = document.getElementById('debug-panel');
    if (panel) panel.style.display = _debugMode ? 'flex' : 'none';
    // הצג/הסתר את לחצני הבדיקה בסרגל
    const testButtons = document.getElementById('debug-test-buttons');
    if (testButtons) testButtons.style.display = _debugMode ? 'flex' : 'none';
    if (_debugMode) { runDebugReport(); } else { clearBlockMarkers(); }
}

function createDebugPanel() {
    if (document.getElementById('debug-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = 'display:none;position:fixed;top:0;left:0;width:500px;height:100vh;background:#0f172a;color:#e2e8f0;font-family:monospace;font-size:10pt;z-index:9999;overflow-y:auto;padding:16px;box-shadow:4px 0 20px rgba(0,0,0,0.5);direction:rtl;';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:2px solid #334155;padding-bottom:8px;"><h2 style="color:#38bdf8;margin:0;font-size:14pt;">🔬 דוח עימוד חי</h2><div><button id="debug-export-btn" style="background:#2563eb;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:9pt;margin-left:4px;">💾 ייצא HTML ממורקר</button><button id="debug-refresh-btn" style="background:#475569;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:9pt;margin-left:4px;">🔄 רענן</button><button id="debug-close-btn" style="background:#dc2626;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:9pt;">✕</button></div></div><div id="debug-summary"></div><div id="debug-blocks-table" style="margin-top:16px;"></div><div id="debug-issues-list" style="margin-top:16px;"></div>';
    document.body.appendChild(panel);
    document.getElementById('debug-close-btn').addEventListener('click', toggleDebugMode);
    document.getElementById('debug-refresh-btn').addEventListener('click', runDebugReport);
    document.getElementById('debug-export-btn').addEventListener('click', exportMarkedHTML);
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
    block.dataset.debugTooltip = tooltip; block.dataset.debugColor = color;
    var marker = document.createElement('div'); marker.className = 'debug-block-marker';
    marker.style.cssText = 'position:absolute;top:4px;right:4px;background:' + color + ';color:#fff;padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:bold;z-index:100;pointer-events:none;opacity:0.9;';
    marker.textContent = issues.length > 0 ? issues.length + '⚠' : '✓';
    block.style.position = 'relative'; block.appendChild(marker); block.title = 'בלוק — ' + tooltip;
    _blockMarkers.push({ element: block, color: color, tooltip: tooltip, issues: issues });
}

function clearBlockMarkers() {
    _blockMarkers.forEach(function(m) { m.element.style.outline = ''; m.element.style.outlineOffset = ''; m.element.removeAttribute('data-debug-tooltip'); m.element.removeAttribute('data-debug-color'); m.element.removeAttribute('title'); var marker = m.element.querySelector('.debug-block-marker'); if (marker) marker.remove(); });
    _blockMarkers = [];
}

function renderDebugPanel(S, blockData, allIssues) {
    var summary = document.getElementById('debug-summary');
    if (summary) {
        var issueCount = S.imbalanced + S.overflow + S.sparseCut + S.widows + S.orphans + S.headingAtBottom + S.singleLinePCut + S.emptyColumns + S.sideNoteOverlap + S.shortPages;
        var okBlocks = S.totalBlocks - S.imbalanced;
        summary.innerHTML = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;"><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:#38bdf8;">' + S.totalPages + '</div><div style="font-size:8pt;color:#94a3b8;">עמודים</div></div><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:' + (okBlocks > 0 ? '#10b981' : '#ef4444') + ';">' + okBlocks + '/' + S.totalBlocks + '</div><div style="font-size:8pt;color:#94a3b8;">בלוקים תקינים</div></div><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:' + (issueCount === 0 ? '#10b981' : '#ef4444') + ';">' + issueCount + '</div><div style="font-size:8pt;color:#94a3b8;">סה"כ בעיות</div></div><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:' + (S.sparseCut === 0 ? '#10b981' : '#f59e0b') + ';">' + S.sparseCut + '</div><div style="font-size:8pt;color:#94a3b8;">שורות דלילות</div></div></div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-size:8pt;"><div style="text-align:center;"><span style="color:' + (S.imbalanced ? '#eab308' : '#10b981') + ';font-weight:bold;">' + S.imbalanced + '</span> לא מאוזן</div><div style="text-align:center;"><span style="color:' + (S.overflow ? '#ef4444' : '#10b981') + ';font-weight:bold;">' + S.overflow + '</span> גלישות</div><div style="text-align:center;"><span style="color:' + (S.widows ? '#ef4444' : '#10b981') + ';font-weight:bold;">' + S.widows + '</span> אלמנות</div><div style="text-align:center;"><span style="color:' + (S.orphans ? '#ef4444' : '#10b981') + ';font-weight:bold;">' + S.orphans + '</span> יתומים</div><div style="text-align:center;"><span style="color:' + (S.shortPages ? '#f59e0b' : '#10b981') + ';font-weight:bold;">' + S.shortPages + '</span> עמודים קצרים</div></div>';
    }
    var tableDiv = document.getElementById('debug-blocks-table');
    if (tableDiv) {
        var html = '<h3 style="color:#818cf8;font-size:11pt;margin-bottom:6px;">טבלת בלוקים מפורטת</h3><div style="font-size:7pt;color:#94a3b8;margin-bottom:4px;">🟢 תקין | 🟡 אי-איזון | 🟠 דלילות | 🔴 גלישה | 🟣 כותרת/אלמנה</div><table style="width:100%;border-collapse:collapse;font-size:8pt;"><thead><tr style="background:#334155;"><th style="padding:3px;text-align:center;">עמוד</th><th style="padding:3px;">בלוק</th><th style="padding:3px;">R</th><th style="padding:3px;">L</th><th style="padding:3px;">Δ</th><th style="padding:3px;">סטטוס</th><th style="padding:3px;">בעיות</th></tr></thead><tbody>';
        blockData.forEach(function(b) {
            html += '<tr class="debug-block-row" data-page="' + b.page + '" data-block="' + b.block + '" style="cursor:pointer;border-bottom:1px solid #1e293b;' + (b.ok ? '' : 'background:rgba(245,158,11,0.08);') + '"><td style="padding:2px;text-align:center;">' + (b.pNum || b.page) + '</td><td style="padding:2px;text-align:center;">#' + b.block + '</td><td style="padding:2px;text-align:center;">' + b.rH + '</td><td style="padding:2px;text-align:center;">' + b.lH + '</td><td style="padding:2px;text-align:center;color:' + (b.d > 5 ? '#eab308' : '#10b981') + ';">' + b.d + '</td><td style="padding:2px;text-align:center;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + b.color + ';"></span></td><td style="padding:2px;font-size:7pt;">' + (b.issues.map(function(i) { return i.type + '(' + i.detail + ')'; }).join(', ') || '—') + '</td></tr>';
        });
        html += '</tbody></table>';
        tableDiv.innerHTML = html;
        tableDiv.querySelectorAll('.debug-block-row').forEach(function(row) { row.addEventListener('click', function() { var page = parseInt(row.dataset.page); var block = parseInt(row.dataset.block); scrollToBlock(page, block); }); });
    }
    var issuesDiv = document.getElementById('debug-issues-list');
    if (issuesDiv && allIssues.length > 0) {
        var h = '<h3 style="color:#ef4444;font-size:11pt;margin-bottom:6px;">רשימת בעיות</h3><table style="width:100%;border-collapse:collapse;font-size:8pt;"><thead><tr style="background:#334155;"><th style="padding:3px;">עמוד</th><th style="padding:3px;">סוג</th><th style="padding:3px;">חומרה</th><th style="padding:3px;">פרטים</th></tr></thead><tbody>';
        allIssues.slice(0, 200).forEach(function(iss) { var sevColor = iss.severity === 'high' ? '#ef4444' : (iss.severity === 'medium' ? '#f59e0b' : '#94a3b8'); h += '<tr style="border-bottom:1px solid #1e293b;"><td style="padding:2px;">' + (iss.pNum || iss.page) + '</td><td style="padding:2px;">' + iss.type + '</td><td style="padding:2px;color:' + sevColor + ';">' + iss.severity + '</td><td style="padding:2px;">' + iss.detail + '</td></tr>'; });
        h += '</tbody></table>'; issuesDiv.innerHTML = h;
    } else if (issuesDiv) { issuesDiv.innerHTML = '<h3 style="color:#10b981;font-size:11pt;">✓ אין בעיות!</h3>'; }
}

function scrollToBlock(pageNum, blockIdx) {
    var pages = document.querySelectorAll('#book-container .a4-page'); var pg = pages[pageNum - 1]; if (!pg) return;
    var blocks = pg.querySelectorAll('.block-2col'); var block = blocks[blockIdx]; if (!block) return;
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var origOutline = block.style.outline; var origOutlineOffset = block.style.outlineOffset;
    block.style.outline = '5px solid #38bdf8'; block.style.outlineOffset = '4px';
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
    var panelHTML = '<div id="debug-panel-export" style="position:fixed;top:0;left:0;width:500px;height:100vh;background:#0f172a;color:#e2e8f0;font-family:monospace;font-size:10pt;z-index:9999;overflow-y:auto;padding:16px;box-shadow:4px 0 20px rgba(0,0,0,0.5);direction:rtl;"><h2 style="color:#38bdf8;border-bottom:2px solid #334155;padding-bottom:8px;">🔬 דוח עימוד ממורקר</h2><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:12px 0;"><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:#38bdf8;">' + S.totalPages + '</div><div style="font-size:8pt;color:#94a3b8;">עמודים</div></div><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:#10b981;">' + (S.totalBlocks - S.imbalanced) + '/' + S.totalBlocks + '</div><div style="font-size:8pt;color:#94a3b8;">תקינים</div></div><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:' + ((S.imbalanced + S.overflow + S.sparseCut + S.widows + S.orphans) > 0 ? '#ef4444' : '#10b981') + ';">' + (S.imbalanced + S.overflow + S.sparseCut + S.widows + S.orphans) + '</div><div style="font-size:8pt;color:#94a3b8;">בעיות</div></div><div style="background:#1e293b;padding:8px;border-radius:6px;text-align:center;"><div style="font-size:16pt;font-weight:bold;color:' + (S.sparseCut > 0 ? '#f59e0b' : '#10b981') + ';">' + S.sparseCut + '</div><div style="font-size:8pt;color:#94a3b8;">דלילות</div></div></div><h3 style="color:#818cf8;font-size:11pt;">טבלת בלוקים</h3><table style="width:100%;border-collapse:collapse;font-size:8pt;"><thead><tr style="background:#334155;"><th style="padding:3px;">עמוד</th><th style="padding:3px;">בלוק</th><th style="padding:3px;">R</th><th style="padding:3px;">L</th><th style="padding:3px;">Δ</th><th style="padding:3px;">סטטוס</th><th style="padding:3px;">בעיות</th></tr></thead><tbody>';
    blockData.forEach(function(b, i) { panelHTML += '<tr style="cursor:pointer;border-bottom:1px solid #1e293b;" onclick="document.querySelectorAll(\'.block-2col\')[' + i + '].scrollIntoView({behavior:\'smooth\',block:\'center\'});"><td style="padding:2px;text-align:center;">' + (b.pNum || b.page) + '</td><td style="padding:2px;text-align:center;">#' + b.block + '</td><td style="padding:2px;text-align:center;">' + b.rH + '</td><td style="padding:2px;text-align:center;">' + b.lH + '</td><td style="padding:2px;text-align:center;color:' + (b.d > 5 ? '#eab308' : '#10b981') + ';">' + b.d + '</td><td style="padding:2px;text-align:center;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + b.color + ';"></span></td><td style="padding:2px;font-size:7pt;">' + (b.issues.map(function(iss) { return iss.type + '(' + iss.detail + ')'; }).join(', ') || '—') + '</td></tr>'; });
    panelHTML += '</tbody></table>';
    if (allIssues.length > 0) { panelHTML += '<h3 style="color:#ef4444;font-size:11pt;margin-top:12px;">רשימת בעיות</h3><table style="width:100%;border-collapse:collapse;font-size:8pt;"><thead><tr style="background:#334155;"><th style="padding:3px;">עמוד</th><th style="padding:3px;">סוג</th><th style="padding:3px;">חומרה</th><th style="padding:3px;">פרטים</th></tr></thead><tbody>'; allIssues.slice(0, 200).forEach(function(iss) { var sc = iss.severity === 'high' ? '#ef4444' : (iss.severity === 'medium' ? '#f59e0b' : '#94a3b8'); panelHTML += '<tr style="border-bottom:1px solid #1e293b;"><td style="padding:2px;">' + (iss.pNum || iss.page) + '</td><td style="padding:2px;">' + iss.type + '</td><td style="padding:2px;color:' + sc + ';">' + iss.severity + '</td><td style="padding:2px;">' + iss.detail + '</td></tr>'; }); panelHTML += '</tbody></table>'; }
    panelHTML += '</div>';
    var html = '<!DOCTYPE html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="UTF-8">\n<title>מסמך מרונדר ממורקר</title>\n' + stylesHTML + '\n<style>\nhtml,body{margin:0;padding:0;background:#334155;}\n#sidebar,#text-pane,#settings-pane,#resizer,#measuring-box{display:none!important;}\n#preview-pane{display:block!important;position:static!important;width:calc(100% - 500px)!important;margin-right:500px!important;}\n#book-container{margin:0 auto;}\n.block-2col{position:relative;}\n.debug-block-marker{position:absolute;top:4px;right:4px;padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:bold;z-index:100;color:#fff;}\n</style>\n</head>\n<body>\n' + panelHTML + '\n' + clone.outerHTML + '\n</body>\n</html>';
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' }); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'marked-document.html'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
    console.log('✓ HTML ממורקר יוצא');
}

var _origTypesetDocument = typeof typesetDocument === 'function' ? typesetDocument : null;
if (_origTypesetDocument) { typesetDocument = function() { _origTypesetDocument.apply(this, arguments); if (_debugMode) { setTimeout(function() { runDebugReport(); }, 5000); } }; }
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initDebugPanel); } else { initDebugPanel(); }
window.toggleDebugMode = toggleDebugMode; window.runDebugReport = runDebugReport; window.exportMarkedHTML = exportMarkedHTML; window.isDebugMode = function() { return _debugMode; };
})();
