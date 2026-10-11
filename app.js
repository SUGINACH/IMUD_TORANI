
/* ==========================================================================
   מערכת עימוד תורנית מקצועית לדפי A4 — גרסת העל המושלמת (Master Edition)
   קובץ: app.js
   ========================================================================== */

const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');
const editorElem = document.getElementById('raw-input');
let isResizing = false;

/* מבנים גלובליים לתיאום מיקומי שערים ונכסים טעונים */
window.shaarBoxSavedPositions = window.shaarBoxSavedPositions || { main: {}, back: {}, sub: {} };
window.loadedShaarItems = window.loadedShaarItems || { main: {}, back: {}, sub: {} };

/* ==========================================================================
   1. סרגל הצד (Sidebar Resizer) ובקרת פאנל הגדרות
   ========================================================================== */
if (resizer && sidebar) {
    resizer.addEventListener('mousedown', () => {
        isResizing = true;
        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = document.body.clientWidth - e.clientX;
        if (newWidth >= 340 && newWidth <= 950) {
            sidebar.style.width = newWidth + 'px';
            updatePreviewScale();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            updatePreviewScale();
        }
    });
}

function toggleSettingsPane() {
    const sp = document.getElementById('settings-pane');
    if (!sp) return;
    const isCollapsed = sp.classList.toggle('collapsed');
    const icon = sp.querySelector('.collapse-icon');
    if (icon) icon.textContent = isCollapsed ? '◀' : '▶';

    setTimeout(() => {
        updatePreviewScale();
    }, 260);
}

function togglePanelBody(bodyId) {
    const body = document.getElementById(bodyId);
    if (!body) return;
    const isHidden = (body.style.display === 'none' || getComputedStyle(body).display === 'none');
    body.style.display = isHidden ? 'block' : 'none';
    const header = body.previousElementSibling;
    const indicator = header ? header.querySelector('.panel-toggle-indicator') : null;
    if (indicator) {
        indicator.textContent = isHidden ? '▲ סגור' : '▼ פתח';
    }
}

function toggleCbgSubRows(role, mode) {
    const rowColor = document.getElementById('row-cbg-' + role + '-color');
    const rowImg = document.getElementById('row-cbg-' + role + '-img');
    const rowOp = document.getElementById('row-cbg-' + role + '-op');
    if (rowColor) rowColor.style.display = (mode === 'color') ? 'flex' : 'none';
    if (rowImg) rowImg.style.display = (mode === 'image') ? 'flex' : 'none';
    if (rowOp) rowOp.style.display = (mode === 'image') ? 'flex' : 'none';
}

function markPendingChanges() {
    const btn = document.getElementById('btn-retypeset');
    if (btn) btn.classList.add('has-pending-changes');
}

function clearPendingChanges() {
    const btn = document.getElementById('btn-retypeset');
    if (btn) btn.classList.remove('has-pending-changes');
}

/* ==========================================================================
   2. ניהול עורך הטקסט, חילוץ תוכן נקי וחוצצי מעברי עמוד
   ========================================================================== */
function getCleanEditorText() {
    const el = document.getElementById('raw-input');
    if (!el) return '';
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.page-break-divider').forEach(d => d.remove());

    const lineDivs = clone.querySelectorAll('.editor-line');
    if (lineDivs.length > 0) {
        const lines = [];
        lineDivs.forEach(ld => {
            lines.push(ld.innerText.replace(/\r\n/g, '').replace(/\n/g, ''));
        });
        return lines.join('\n');
    }
    return clone.innerText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function renderEditorContent(text, pageBreaks = []) {
    const editor = document.getElementById('raw-input');
    if (!editor) return;

    const breakMap = {};
    (pageBreaks || []).forEach(pb => {
        if (pb && pb.lineIdx !== undefined && pb.pageNum > 1) {
            breakMap[pb.lineIdx] = pb;
        }
    });

    const lines = (text || '').split('\n');
    const frag = document.createDocumentFragment();

    lines.forEach((lineText, idx) => {
        if (breakMap[idx]) {
            const pb = breakMap[idx];
            const div = document.createElement('div');
            div.className = 'page-break-divider';
            div.setAttribute('contenteditable', 'false');
            div.setAttribute('data-page-num', pb.pageNum);
            div.innerHTML = `
        <span class="divider-badge">
          <span class="badge-dot">●</span>
          <span>מעבר עמוד — עמוד ${escapeHTML(String(pb.gematria || pb.pageNum))} (${escapeHTML(String(pb.pageNum))})</span>
        </span>
      `;
            frag.appendChild(div);
        }

        const lineEl = document.createElement('div');
        lineEl.className = 'editor-line';
        lineEl.setAttribute('data-line-idx', idx);
        if (!lineText) {
            lineEl.innerHTML = '<br>';
        } else {
            lineEl.textContent = lineText;
        }
        frag.appendChild(lineEl);
    });

    editor.innerHTML = '';
    editor.appendChild(frag);
    updateEditorStats();
}

function updateEditorWithPageBreaks(pageBreaks) {
    const clean = getCleanEditorText();
    renderEditorContent(clean, pageBreaks);
}

function updateEditorStats() {
    const statsEl = document.getElementById('editor-stats');
    if (!statsEl) return;
    const text = getCleanEditorText();
    const lines = text.split('\n').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    statsEl.textContent = `${lines} שורות | ${words} מילים`;
}

if (editorElem) {
    Object.defineProperty(editorElem, 'value', {
        get() { return getCleanEditorText(); },
        set(val) { renderEditorContent(val || '', []); },
        configurable: true
    });

    editorElem.addEventListener('copy', (e) => {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;
        let text = sel.toString();
        text = text.replace(/מעבר עמוד — עמוד [^\n\r]+/g, '');
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
    });

    editorElem.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        // FIX: החלפת document.execCommand('insertText') שהוצא משימוש ב-Ranges API.
        // execCommand אינו מובטח בדפדפנים עתידיים; Ranges API תקני ומדויק יותר.
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        updateEditorStats();
    });

    // FIX: debounce על אירוע input — updateEditorStats קורא ל-getCleanEditorText
    // שמבצע cloneNode(true) + innerText (reflow יקר). דביאונס 250ms מונע קפיאת UI.
    let inputStatsTimer = null;
    editorElem.addEventListener('input', () => {
        if (inputStatsTimer) clearTimeout(inputStatsTimer);
        inputStatsTimer = setTimeout(updateEditorStats, 250);
    });
}

function handleTxtFileImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    // FIX: ולידציה — הגבלת גודל (5MB) וסוג/סיומת.
    const MAX_TXT_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_TXT_SIZE) {
        alert('הקובץ גדול מדי (מקסימום 5MB).');
        return;
    }
    const isText = file.type === 'text/plain' || /\.(txt|text|md)$/i.test(file.name);
    if (!isText) {
        alert('נא לבחור קובץ טקסט (.txt, .md).');
        return;
    }
    const reader = new FileReader();
    // FIX: הוספת onerror למשוב על כשל קריאה.
    reader.onerror = function() {
        alert('שגיאה בקריאת הקובץ: ' + (file.name || ''));
    };
    reader.onload = function(e) {
        if (editorElem) {
            editorElem.value = e.target.result;
            typesetDocument();
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

/* ==========================================================================
   3. סנכרון תצוגה מקדימה, גלילה ומיקוד עורך
   ========================================================================== */
const bookContainerEl = document.getElementById('book-container');
if (bookContainerEl) {
    bookContainerEl.addEventListener('click', (e) => {
        const page = e.target.closest('.a4-page');
        if (!page) return;

        document.querySelectorAll('.a4-page.page-focused').forEach(p => p.classList.remove('page-focused'));
        page.classList.add('page-focused');

        const pageNum = page.getAttribute('data-page-index');
        const firstLineIdx = page.getAttribute('data-first-line-idx');
        let target = null;

        if (pageNum) {
            target = document.querySelector(`.page-break-divider[data-page-num="${pageNum}"]`);
        }
        if (!target && firstLineIdx !== null && firstLineIdx !== undefined) {
            target = document.querySelector(`.editor-line[data-line-idx="${firstLineIdx}"]`);
        }
        if (!target && pageNum === '1') {
            target = document.querySelector('.editor-line[data-line-idx="0"]');
        }

        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('editor-target-highlight');
            setTimeout(() => {
                target.classList.remove('editor-target-highlight');
            }, 1800);
        }
    });
}

function getActiveEditorLineIdx() {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return -1;
    let node = sel.anchorNode;
    if (node.nodeType === 3) node = node.parentElement;
    const lineEl = node.closest('.editor-line');
    if (lineEl && lineEl.hasAttribute('data-line-idx')) {
        return parseInt(lineEl.getAttribute('data-line-idx'), 10);
    }
    return -1;
}

function syncCursorToPreview() {
    const lineIdx = getActiveEditorLineIdx();
    if (lineIdx === -1) return;

    if (typeof lineToTokenMap !== 'undefined' && lineToTokenMap[lineIdx] !== undefined) {
        let tokenId = lineToTokenMap[lineIdx];
        if (tokenId === null) {
            for (let k = lineIdx - 1; k >= 0; k--) {
                if (lineToTokenMap[k] !== null && lineToTokenMap[k] !== undefined) {
                    tokenId = lineToTokenMap[k];
                    break;
                }
            }
        }

        if (tokenId !== null && tokenId !== undefined) {
            // תיקון: השתמש ב-querySelectorAll כדי למצוא את כל האלמנטים עם אותו token-id.
            // פסקאות מפוצלות (p-cut) יכולות להופיע בשני מקומות — נבחר את הקרוב ביותר
            // למיקום הגלילה הנוכחי של התצוגה המקדימה.
            const allMatches = document.querySelectorAll(`[data-token-id="${tokenId}"]`);
            if (allMatches.length === 0) return;
            
            if (allMatches.length === 1) {
                // מקרה רגיל — אלמנט אחד
                allMatches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            // מקרה מפוצל — מצא את האלמנט הקרוב ביותר למיקום הגלילה הנוכחי
            const previewPane = document.getElementById('preview-pane');
            const viewportCenter = previewPane 
                ? previewPane.scrollTop + previewPane.clientHeight / 2 
                : window.scrollY + window.innerHeight / 2;
            
            let closestEl = allMatches[0];
            let closestDist = Infinity;
            allMatches.forEach(el => {
                const rect = el.getBoundingClientRect();
                // חשב מיקום יחסי במסמך (לא יחסית לviewport)
                const absTop = rect.top + window.scrollY;
                const dist = Math.abs(absTop - viewportCenter);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestEl = el;
                }
            });
            closestEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

if (editorElem) {
    editorElem.addEventListener('click', syncCursorToPreview);
    editorElem.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
            syncCursorToPreview();
        }
    });
}

/* ==========================================================================
   4. זום רספונסיבי מדויק לדפי A4
   ========================================================================== */
function updatePreviewScale() {
    const previewPane = document.getElementById('preview-pane');
    const bookContainer = document.getElementById('book-container');
    if (!previewPane || !bookContainer) return;

    const availW = previewPane.clientWidth - 40;
    if (availW <= 50) return;

    const a4WidthPx = 793.7;
    const scale = Math.max(0.25, availW / a4WidthPx);

    document.documentElement.style.setProperty('--preview-scale', scale);

    const unscaledH = bookContainer.offsetHeight;
    if (unscaledH > 0) {
        const scaledH = unscaledH * scale;
        bookContainer.style.marginBottom = `${scaledH - unscaledH + 40}px`;
    }
}

window.addEventListener('resize', updatePreviewScale);
if (window.ResizeObserver && document.getElementById('preview-pane')) {
    const ro = new ResizeObserver(() => {
        updatePreviewScale();
    });
    ro.observe(document.getElementById('preview-pane'));
}

/* ==========================================================================
   5. כוונון תיבות שער בעכבר (Drag & Resize) וייצוא קובצי JSON
   ========================================================================== */
function toggleShaarBoxEditor() {
    const cb = document.getElementById('enable-shaar-box-editor');
    if (cb && !cb.checked) {
        document.body.classList.add('hide-shaar-editor');
    } else {
        document.body.classList.remove('hide-shaar-editor');
    }
}

function initShaarBoxResizer() {
    let activeDrag = null;

    document.addEventListener('mousedown', (e) => {
        const dragBar = e.target.closest('.shaar-drag-bar');
        const handle = e.target.closest('.shaar-resize-handle');
        if (!dragBar && !handle) return;

        const box = (dragBar || handle).closest('.theme-bounded-content');
        const page = box ? box.closest('.a4-page') : null;
        if (!box || !page) return;

        e.preventDefault();
        e.stopPropagation();

        const pageRect = page.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();

        const curTop = ((boxRect.top - pageRect.top) / pageRect.height) * 297;
        const curBottom = ((pageRect.bottom - boxRect.bottom) / pageRect.height) * 297;
        const curRight = ((pageRect.right - boxRect.right) / pageRect.width) * 210;
        const curLeft = ((boxRect.left - pageRect.left) / pageRect.width) * 210;

        activeDrag = {
            box,
            page,
            shaarType: box.getAttribute('data-shaar-type') || 'main',
            shaarId: box.getAttribute('data-shaar-id') || '',
            isMove: !!dragBar,
            handleType: handle ? handle.getAttribute('data-handle') : null,
            startX: e.clientX,
            startY: e.clientY,
            pageW: pageRect.width,
            pageH: pageRect.height,
            initTop: curTop,
            initBottom: curBottom,
            initRight: curRight,
            initLeft: curLeft
        };
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!activeDrag) return;
        const dx_mm = ((e.clientX - activeDrag.startX) / activeDrag.pageW) * 210;
        const dy_mm = ((e.clientY - activeDrag.startY) / activeDrag.pageH) * 297;

        let { initTop, initBottom, initRight, initLeft, isMove, handleType, box, shaarType, shaarId } = activeDrag;
        let nTop = initTop, nBottom = initBottom, nRight = initRight, nLeft = initLeft;

        if (isMove) {
            nTop = Math.max(5, initTop + dy_mm);
            nBottom = Math.max(5, initBottom - dy_mm);
            nRight = Math.max(5, initRight - dx_mm);
            nLeft = Math.max(5, initLeft + dx_mm);
        } else if (handleType) {
            if (handleType.includes('t')) nTop = Math.max(5, initTop + dy_mm);
            if (handleType.includes('b')) nBottom = Math.max(5, initBottom - dy_mm);
            if (handleType.includes('r')) nRight = Math.max(5, initRight - dx_mm);
            if (handleType.includes('l')) nLeft = Math.max(5, initLeft + dx_mm);
        }

        box.style.top = nTop.toFixed(1) + 'mm';
        box.style.bottom = nBottom.toFixed(1) + 'mm';
        box.style.right = nRight.toFixed(1) + 'mm';
        box.style.left = nLeft.toFixed(1) + 'mm';

        const tEl = document.getElementById(`builder-${shaarType}-top`);
        const bEl = document.getElementById(`builder-${shaarType}-bottom`);
        const rEl = document.getElementById(`builder-${shaarType}-right`);
        const lEl = document.getElementById(`builder-${shaarType}-left`);
        if (tEl) tEl.value = Math.round(nTop);
        if (bEl) bEl.value = Math.round(nBottom);
        if (rEl) rEl.value = Math.round(nRight);
        if (lEl) lEl.value = Math.round(nLeft);

        if (shaarId && window.shaarBoxSavedPositions) {
            if (!window.shaarBoxSavedPositions[shaarType]) window.shaarBoxSavedPositions[shaarType] = {};
            window.shaarBoxSavedPositions[shaarType][shaarId] = {
                top: nTop.toFixed(1), bottom: nBottom.toFixed(1), right: nRight.toFixed(1), left: nLeft.toFixed(1)
            };
        }
    });

    window.addEventListener('mouseup', () => {
        if (activeDrag) {
            activeDrag = null;
            document.body.style.userSelect = '';
        }
    });
}
initShaarBoxResizer();

function resetCurrentShaarBoxPosition(shaarType) {
    const sel = document.getElementById(`select-shaar-${shaarType}`);
    const shaarId = sel ? sel.value : 'theme_default';
    if (window.shaarBoxSavedPositions && window.shaarBoxSavedPositions[shaarType]) {
        delete window.shaarBoxSavedPositions[shaarType][shaarId];
    }
    typesetDocument();
}

function exportShaarJSONWithPositions(typeKey) {
    const items = window.loadedShaarItems[typeKey];
    if (!items || Object.keys(items).length === 0) {
        alert('לא נטענו שערים מקובצי JSON עבור סוג זה — אין נתונים לייצוא.');
        return;
    }
    const filenameMap = { main: 'shaar_main.json', sub: 'shaar_sub.json', back: 'shaar_back.json' };
    const output = Object.keys(items).map(id => {
        const item = items[id];
        const saved = window.shaarBoxSavedPositions[typeKey] && window.shaarBoxSavedPositions[typeKey][id];
        const entry = { id: item.id, name: item.name, svg: item.svg };
        if (saved) entry.box = saved;
        else if (item.box) entry.box = item.box;
        return entry;
    });
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenameMap[typeKey] || (typeKey + '.json');
    a.click();
    URL.revokeObjectURL(url);
}

/* ==========================================================================
   6. סנכרון ממדים דינמי ב-DOM
   ========================================================================== */
function applyHeadingOrnamentTextFit() {
    document.querySelectorAll('.h2-ornament-top, .h2-ornament-bottom').forEach(ornWrap => {
        const fitInner = ornWrap.querySelector('.heading-ornament-wrap.fit-heading-text');
        if (!fitInner) return;
        const isTop = ornWrap.classList.contains('h2-ornament-top');
        const targetEl = isTop ? ornWrap.nextElementSibling : ornWrap.previousElementSibling;
        if (!targetEl) return;
        const textWidth = targetEl.offsetWidth;
        if (textWidth > 0) {
            fitInner.style.width = textWidth + 'px';
            fitInner.style.maxWidth = '90%';
        }
    });

    document.querySelectorAll('.block-h3-span').forEach(wrap => {
        const textEl = wrap.querySelector('.h3-title-text');
        if (!textEl) return;
        const textHeight = textEl.offsetHeight;
        if (textHeight > 0) {
            wrap.querySelectorAll('.h3-ornament-right, .h3-ornament-left').forEach(ornEl => {
                ornEl.style.height = textHeight + 'px';
                ornEl.style.maxHeight = textHeight + 'px';
                const inner = ornEl.querySelector('.side-ornament-wrap, svg, img');
                if (inner) {
                    inner.style.height = textHeight + 'px';
                    inner.style.maxHeight = textHeight + 'px';
                    inner.style.width = 'auto';
                }
            });
        }
    });

    document.querySelectorAll('.block-h2-title-side').forEach(wrap => {
        const textEl = wrap.querySelector('.title-level-2-standalone');
        if (!textEl) return;
        const textHeight = textEl.offsetHeight;
        if (textHeight > 0) {
            wrap.querySelectorAll('.h2-title-ornament-right, .h2-title-ornament-left').forEach(ornEl => {
                ornEl.style.height = textHeight + 'px';
                ornEl.style.maxHeight = textHeight + 'px';
            });
        }
    });
}

/* ==========================================================================
   7. ניהול ערכות נושא מותאמות אישית (Custom Themes)
   ========================================================================== */
let customThemes = [];

function addNewCustomTheme() {
    const nameInput = document.getElementById('builder-theme-name');
    const name = nameInput?.value.trim();
    if (!name) {
        alert('אנא הזן שם לערכת הנושא.');
        return;
    }

    const mainSvg = document.getElementById('data-builder-main-svg')?.value;
    const backSvg = document.getElementById('data-builder-back-svg')?.value;
    const subSvg = document.getElementById('data-builder-sub-svg')?.value;

    const themeObj = {
        id: 'theme_' + Date.now(),
        name: name,
        mainShaar: {
            svgData: mainSvg || '',
            top: parseFloat(document.getElementById('builder-main-top')?.value) || 20,
            bottom: parseFloat(document.getElementById('builder-main-bottom')?.value) || 16,
            right: parseFloat(document.getElementById('builder-main-right')?.value) || 15,
            left: parseFloat(document.getElementById('builder-main-left')?.value) || 15
        },
        backShaar: {
            svgData: backSvg || '',
            top: parseFloat(document.getElementById('builder-back-top')?.value) || 22,
            bottom: parseFloat(document.getElementById('builder-back-bottom')?.value) || 18,
            right: parseFloat(document.getElementById('builder-back-right')?.value) || 15,
            left: parseFloat(document.getElementById('builder-back-left')?.value) || 95
        },
        subShaar: {
            svgData: subSvg || '',
            top: parseFloat(document.getElementById('builder-sub-top')?.value) || 20,
            bottom: parseFloat(document.getElementById('builder-sub-bottom')?.value) || 20,
            right: parseFloat(document.getElementById('builder-sub-right')?.value) || 95,
            left: parseFloat(document.getElementById('builder-sub-left')?.value) || 15
        }
    };

    customThemes.push(themeObj);
    refreshCustomThemesUI();

    const select = document.getElementById('active-theme-select');
    if (select) select.value = themeObj.id;

    alert(`ערכת הנושא "${name}" הוטמעה בהצלחה!`);
    typesetDocument();
}

function deleteCustomTheme(themeId) {
    if (!confirm('האם ברצונך למחוק ערכת נושא זו?')) return;
    customThemes = customThemes.filter(t => t.id !== themeId);
    refreshCustomThemesUI();
    typesetDocument();
}

function refreshCustomThemesUI() {
    const optgroup = document.getElementById('custom-themes-optgroup');
    const listContainer = document.getElementById('custom-themes-list');
    const select = document.getElementById('active-theme-select');
    const currentVal = select ? select.value : '';

    if (optgroup) {
        optgroup.innerHTML = '';
        customThemes.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            optgroup.appendChild(opt);
        });
    }

    if (listContainer) {
        if (customThemes.length === 0) {
            listContainer.innerHTML = '<div style="font-size:7.5pt; color:#888;">עדיין לא הוטמעו ערכות מותאמות אישית.</div>';
        } else {
            let html = '<div style="font-size:8pt; font-weight:700; margin-bottom:4px; color:#333;">ערכות שהוטמעו בקובץ:</div>';
            customThemes.forEach(t => {
                const safeId = escapeHTML(t.id);
                const safeName = escapeHTML(t.name);
                html += `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #ddd; padding:3px 6px; border-radius:3px; margin-bottom:3px; font-size:8pt;">
            <span>🏷️ ${safeName}</span>
            <span style="color:#dc2626; cursor:pointer; font-weight:bold;" data-action="delete-theme" data-theme-id="${safeId}" class="delete-theme-btn">🗑️ מחק</span>
          </div>
        `;
            });
            listContainer.innerHTML = html;
        }
    }

    if (select && currentVal) select.value = currentVal;
}

/* ==========================================================================
   8. תוספים חיצוניים (Extensions)
   ========================================================================== */
let importedPageTypes = [];
let importedTextStyles = [];
let importedImagePages = [];
let extImportCounter = 0;
let nextSyntheticLevel = 8;

function validateExtJSON(def, expectedKind) {
    if (!def || typeof def !== 'object') return 'קובץ לא תקין (לא JSON תקין).';
    if (def.kind !== expectedKind) return 'הקובץ אינו מסוג ' + (expectedKind === 'pageType' ? 'סוג עמוד' : 'סגנון טקסט') + ' (kind=' + def.kind + ').';
    if (!def.name) return 'להגדרה שיובאה אין שם (name).';
    return null;
}

function handlePageTypeImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    // ולידציה
    const MAX_JSON_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_JSON_SIZE) { alert('הקובץ גדול מדי (מקסימום 5MB).'); event.target.value = ''; return; }
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') { alert('נא לבחור קובץ .json'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onerror = function() { alert('שגיאה בקריאת הקובץ: ' + (file.name || '')); };
    reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch (err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'pageType');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-pt-' + (extImportCounter++);
        importedPageTypes.push({
            instanceId,
            def,
            anchor: def.insertionAnchor || 'afterAll',
            repeatMode: def.repeatMode || 'once'
        });
        buildExtPanel('pageType', instanceId, def.name, def);
        typesetDocument();
    };
    reader.readAsText(file);
    event.target.value = '';
}

function handleTextStyleImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const MAX_JSON_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_JSON_SIZE) { alert('הקובץ גדול מדי (מקסימום 5MB).'); event.target.value = ''; return; }
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') { alert('נא לבחור קובץ .json'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onerror = function() { alert('שגיאה בקריאת הקובץ: ' + (file.name || '')); };
    reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch (err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'textStyle');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-ts-' + (extImportCounter++);
        const syntheticLevel = (def.trigger && def.trigger.type === 'linePrefix') ? (nextSyntheticLevel++) : null;
        importedTextStyles.push({ instanceId, def, syntheticLevel });
        buildExtPanel('textStyle', instanceId, def.name, def);
        typesetDocument();
    };
    reader.readAsText(file);
    event.target.value = '';
}

function handleImagePageImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    // ולידציה
    const MAX_IMG_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_IMG_SIZE) { alert('התמונה גדולה מדי (מקסימום 5MB).'); event.target.value = ''; return; }
    if (!/^image\//.test(file.type) && !/\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(file.name)) {
        alert('נא לבחור קובץ תמונה תקין.');
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onerror = function() { alert('שגיאה בקריאת התמונה: ' + (file.name || '')); };
    reader.onload = function(e) {
        const instanceId = 'ext-img-' + (extImportCounter++);
        importedImagePages.push({
            instanceId,
            name: file.name,
            dataUrl: e.target.result,
            anchor: 'afterAll'
        });
        buildExtPanel('imagePage', instanceId, 'תמונה: ' + file.name, null);
        typesetDocument();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

const EXT_ANCHOR_OPTIONS = [
    ['beforeAll', 'לפני הכל'],
    ['afterMainShaar', 'אחרי השער הראשי'],
    ['afterGeneralToc', 'אחרי תוכן עניינים כללי'],
    ['beforeEachPart', 'לפני כל שער-חלק'],
    ['afterEachPart', 'מיד אחרי כל שער-חלק'],
    ['endOfEachPart', 'בסוף כל חלק'],
    ['afterAll', 'אחרי הכל']
];

function buildExtPanel(kind, instanceId, name, def) {
    const panel = document.createElement('div');
    panel.className = 'panel-static';
    panel.id = instanceId + '-panel';
    const icon = kind === 'pageType' ? '📄' : kind === 'textStyle' ? '🅰️' : '🖼️';
    let triggerInfo = '';
    if (kind === 'textStyle' && def && def.trigger) {
        const safeOpen = escapeHTML(def.trigger.open || '');
        const safeClose = escapeHTML(def.trigger.close || '');
        const safePrefix = escapeHTML(def.trigger.prefix || '');
        triggerInfo = (def.trigger.type === 'delimiterPair')
            ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${safeOpen}" ל-"${safeClose}"</div>`
            : `<div style="font-size:7.5pt;color:#888;">קידומת: "${safePrefix}"</div>`;
    }
    const safeKind = escapeHTML(kind);
    const safeInstanceId = escapeHTML(instanceId);
    const safeName = escapeHTML(name);
    const safeIcon = escapeHTML(icon);
    const anchorRow = (kind !== 'textStyle') ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${safeInstanceId}-anchor" data-kind="${safeKind}" data-instance="${safeInstanceId}" class="ext-anchor-select">${EXT_ANCHOR_OPTIONS.map(([v,l]) => `<option value="${escapeHTML(v)}">${escapeHTML(l)}</option>`).join('')}</select></div>` : '';
    panel.innerHTML = `
    <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
      <span>${safeIcon} ${safeName}</span>
      <span style="cursor:pointer;color:#a33;font-weight:700;" data-kind="${safeKind}" data-instance="${safeInstanceId}" class="ext-remove-btn">✕ הסר</span>
    </div>
    ${triggerInfo}
    ${anchorRow}
  `;
    document.getElementById('ext-imports-container')?.appendChild(panel);
    if (kind !== 'textStyle') {
        const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
        const inst = store.find(x => x.instanceId === instanceId);
        const sel = document.getElementById(instanceId + '-anchor');
        if (sel && inst) sel.value = inst.anchor;
    }
}

function updateExtAnchor(kind, instanceId, val) {
    const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
    const inst = store.find(x => x.instanceId === instanceId);
    if (inst) inst.anchor = val;
    typesetDocument();
}

function removeExtInstance(kind, instanceId) {
    if (kind === 'pageType') importedPageTypes = importedPageTypes.filter(x => x.instanceId !== instanceId);
    else if (kind === 'textStyle') importedTextStyles = importedTextStyles.filter(x => x.instanceId !== instanceId);
    else importedImagePages = importedImagePages.filter(x => x.instanceId !== instanceId);
    const p = document.getElementById(instanceId + '-panel');
    if (p) p.remove();
    typesetDocument();
}

function findPrefixLineInSource(rawText, prefix) {
    if (!prefix) return null;
    const lines = rawText.split('\n');
    for (const line of lines) {
        const t = line.trim();
        if (t.startsWith(prefix)) return t.slice(prefix.length).replace(/^[:\-–—]\s*/, '').trim();
    }
    return null;
}

const EXT_V_MAP = { top: '14mm', upperMid: '25%', center: '50%', lowerMid: '75%' };

function applyExtStyleToNode(node, style, hostFontSizePt) {
    if (!style) return;
    if (style.family) node.style.fontFamily = style.family;
    if (typeof style.size === 'number') node.style.fontSize = style.size + 'pt';
    if (typeof style.sizeDelta === 'number') node.style.fontSize = ((hostFontSizePt || 12) + style.sizeDelta) + 'pt';
    if (style.weight) node.style.fontWeight = style.weight;
    if (style.color) node.style.color = style.color;
    if (style.align) node.style.textAlign = style.align;
    if (style.border) {
        node.style.border = style.border.width + 'px solid ' + style.border.color;
        node.style.borderRadius = style.border.radius + 'px';
        node.style.padding = '2px 8px';
    }
}

function renderImportedPage(container, inst, rawSourceText) {
    const def = inst.def;
    const page = document.createElement('div');
    page.className = 'a4-page';
    if (def.background && def.background.mode === 'fixed') {
        const bs = def.background.style;
        if (bs === 'color' && def.background.color) {
            // ולידציה: רק ערכי צבע תקניים (#hex, rgb(), rgba(), named colors)
            const colorVal = String(def.background.color).trim();
            if (/^(#[0-9a-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|[a-zA-Z]+)$/i.test(colorVal)) {
                page.style.background = colorVal;
            }
        }
        else if (bs === 'texture') page.style.background = '#fdfcf6 url("' + CBG_TEXTURE_SVG + '") repeat';
        else if (bs === 'image' && def.background.image) {
            const safeImg = sanitizeURL(def.background.image);
            if (safeImg) {
                const op = def.background.opacity != null ? safeNumber(def.background.opacity, 0.15) : 0.15;
                const fade = (1 - op).toFixed(3);
                page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${safeImg}")`;
                page.style.backgroundSize = 'cover';
                page.style.backgroundPosition = 'center';
            }
        }
    } else {
        applyContentBg(page, 'regular');
    }
    (def.elements || []).forEach(elDef => {
        const matched = findPrefixLineInSource(rawSourceText, elDef.prefix);
        const text = matched || elDef.defaultText || '';
        if (!text) return;
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.textContent = text;
        const pos = elDef.position || {};
        const va = pos.vAnchor || 'center', ha = pos.hAlign || 'center', off = pos.offsetY || 0;
        if (va === 'bottom') {
            el.style.bottom = (18 - off) + 'mm';
        } else {
            el.style.top = `calc(${EXT_V_MAP[va] || '50%'} + ${off}px)`;
            if (va === 'center' || va === 'upperMid' || va === 'lowerMid') el.style.transform = 'translateY(-50%)';
        }
        if (ha === 'right' || ha === 'rightMid') el.style.right = (ha === 'right' ? '15mm' : '25%');
        else if (ha === 'left' || ha === 'leftMid') el.style.left = (ha === 'left' ? '15mm' : '25%');
        else { el.style.right = '0'; el.style.left = '0'; el.style.textAlign = 'center'; }
        applyExtStyleToNode(el, elDef.style, 12);
        page.appendChild(el);
    });
    container.appendChild(page);
}

function renderImportedImagePage(container, inst) {
    const page = document.createElement('div');
    page.className = 'a4-page';
    page.style.backgroundImage = `url("${inst.dataUrl}")`;
    page.style.backgroundSize = 'cover';
    page.style.backgroundPosition = 'center';
    container.appendChild(page);
}

function renderExtAnchor(container, anchorKey, rawSourceText) {
    importedPageTypes.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedPage(container, inst, rawSourceText));
    importedImagePages.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedImagePage(container, inst));
}

function findExtTextStyle(instanceId) {
    return importedTextStyles.find(x => x.instanceId === instanceId);
}

function handleImageUpload(event, targetInputId) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    // ולידציה: הגבלת גודל (מקסימ 5MB) וסוג MIME
    const MAX_IMG_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_IMG_SIZE) {
        alert('הקובץ גדול מדי (מקסימום 5MB).');
        return;
    }
    if (!/^image\//.test(file.type) && !file.name.toLowerCase().endsWith('.svg')) {
        alert('נא לבחור קובץ תמונה תקין.');
        return;
    }

    const reader = new FileReader();
    reader.onerror = function() {
        alert('שגיאה בקריאת הקובץ: ' + (file.name || ''));
    };

    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        reader.onload = function(e) {
            let svgText = String(e.target.result || '');
            // סניטציה: הסרת <script>, on* handlers, javascript: URLs, <iframe>, <object>, <embed>
            if (typeof sanitizeSVG === 'function') {
                svgText = sanitizeSVG(svgText);
            } else {
                // Fallback אם sanitizeSVG לא נטען (decorations.js לא נטען)
                svgText = svgText
                    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
                    .replace(/<\s*iframe[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')
                    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, ' ')
                    .replace(/javascript:/gi, '');
            }
            if (svgText.includes('preserveAspectRatio')) {
                svgText = svgText.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
            } else {
                svgText = svgText.replace(/<svg\b/, '<svg preserveAspectRatio="none"');
            }
            const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
            const targetInput = document.getElementById(targetInputId);
            if (targetInput) {
                targetInput.value = dataUrl;
                targetInput.setAttribute('value', dataUrl);
                typesetDocument();
            }
        };
        reader.readAsText(file);
    } else {
        reader.onload = function(e) {
            const targetInput = document.getElementById(targetInputId);
            if (targetInput) {
                targetInput.value = e.target.result;
                targetInput.setAttribute('value', e.target.result);
                typesetDocument();
            }
        };
        reader.readAsDataURL(file);
    }
}

/* ==========================================================================
   9. שמירת תבנית מלאה (Save Template)
   ========================================================================== */
function saveAsDefaultTemplate() {
    let dataIsland = document.getElementById('ext-imports-data');
    if (!dataIsland) {
        dataIsland = document.createElement('script');
        dataIsland.type = 'application/json';
        dataIsland.id = 'ext-imports-data';
        document.head.appendChild(dataIsland);
    }
    dataIsland.textContent = JSON.stringify({
        pageTypes: importedPageTypes,
        textStyles: importedTextStyles,
        imagePages: importedImagePages,
        customThemes: customThemes,
        shaarBoxPositions: window.shaarBoxSavedPositions
    });

    document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"], input[type="color"], input[type="range"]').forEach(input => {
        input.setAttribute('value', input.value);
    });
    document.querySelectorAll('textarea').forEach(ta => {
        ta.textContent = ta.value;
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) cb.setAttribute('checked', 'checked');
        else cb.removeAttribute('checked');
    });
    document.querySelectorAll('select').forEach(sel => {
        Array.from(sel.options).forEach(opt => {
            if (opt.value === sel.value) opt.setAttribute('selected', 'selected');
            else opt.removeAttribute('selected');
        });
    });

    const prevVal = editorElem ? editorElem.value : '';
    if (editorElem) {
        editorElem.innerHTML = '';
        editorElem.value = '';
    }

    const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    if (editorElem) editorElem.value = prevVal;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'torani-master-template.html';
    a.click();
    URL.revokeObjectURL(a.href);
}

function rehydrateExtImports() {
    const island = document.getElementById('ext-imports-data');
    if (!island || !island.textContent.trim()) return;
    let data;
    try { data = JSON.parse(island.textContent); } catch (e) { return; }
    (data.pageTypes || []).forEach(inst => {
        importedPageTypes.push(inst);
        buildExtPanel('pageType', inst.instanceId, inst.def.name, inst.def);
    });
    (data.textStyles || []).forEach(inst => {
        importedTextStyles.push(inst);
        buildExtPanel('textStyle', inst.instanceId, inst.def.name, inst.def);
    });
    (data.imagePages || []).forEach(inst => {
        importedImagePages.push(inst);
        buildExtPanel('imagePage', inst.instanceId, 'תמונה: ' + inst.name, null);
    });
    if (data.customThemes && Array.isArray(data.customThemes)) {
        customThemes = data.customThemes;
        refreshCustomThemesUI();
    }
    if (data.shaarBoxPositions && typeof data.shaarBoxPositions === 'object') {
        window.shaarBoxSavedPositions = data.shaarBoxPositions;
    }
    let maxCounter = 0;
    let maxSynth = 7;
    [...importedPageTypes, ...importedTextStyles, ...importedImagePages].forEach(inst => {
        const n = parseInt((inst.instanceId.match(/-(\d+)$/) || [0, 0])[1], 10);
        if (n >= maxCounter) maxCounter = n + 1;
        if (typeof inst.syntheticLevel === 'number' && inst.syntheticLevel > maxSynth) maxSynth = inst.syntheticLevel;
    });
    extImportCounter = maxCounter;
    nextSyntheticLevel = maxSynth + 1;
}

/* ==========================================================================
   10. אתחול מאגר הגופנים והמתנה לטעינת גופני רשת
   ========================================================================== */
function initFontPickers() {
    const defaultFonts = [
        { label: "גופנים תורניים נפוצים", fonts: [
            { name: "גוטמן רש\"י רגיל", val: "'גוטמן רש\"י רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "פרנק רוהל ליברה רגיל", val: "'פרנק רוהל ליברה רגיל', serif" },
            { name: "פרנק רוהל ליברה מודגש", val: "'פרנק רוהל ליברה מודגש', serif" },
            { name: "פרנק רוהל ליברה שחור", val: "'פרנק רוהל ליברה שחור', serif" },
            { name: "פרנק רוהל ליברה קל", val: "'פרנק רוהל ליברה קל', serif" },
            { name: "פרנק רוהל ליברה בינוני", val: "'פרנק רוהל ליברה בינוני', serif" },
            { name: "פרנק רוהל רגיל", val: "'פרנק רוהל רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "פרנק רוהל דפ רגיל", val: "'פרנק רוהל דפ רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "פרנק רוהל דפ מודגש", val: "'פרנק רוהל דפ מודגש', 'פרנק רוהל ליברה מודגש', serif" },
            { name: "נוטו סריף עברית רגיל", val: "'נוטו סריף עברית רגיל', serif" },
            { name: "נוטו סריף עברית מודגש", val: "'נוטו סריף עברית מודגש', serif" },
            { name: "נוטו סריף עברית שחור", val: "'נוטו סריף עברית שחור', serif" },
            { name: "ליבורנה רגיל", val: "'ליבורנה רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "ליבורנה מודגש", val: "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif" },
            { name: "ליבורנה ספר רגיל", val: "'ליבורנה ספר רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "אלפא רגיל", val: "'אלפא רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "אלפא מודגש", val: "'אלפא מודגש', 'פרנק רוהל ליברה מודגש', serif" },
            { name: "אלפא קל", val: "'אלפא קל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "אלפא שחור", val: "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif" },
            { name: "פרנק ריל רגיל", val: "'פרנק ריל רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "פרנק ריל מודגש", val: "'פרנק ריל מודגש', 'פרנק רוהל ליברה מודגש', serif" },
            { name: "פרנק ריל קל", val: "'פרנק ריל קל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "פרנק ריל בינוני", val: "'פרנק ריל בינוני', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "הדסה פרידלנדר רגיל", val: "'הדסה פרידלנדר רגיל', 'פרנק רוהל ליברה רגיל', serif" },
            { name: "הדסה פרידלנדר מודגש", val: "'הדסה פרידלנדר מודגש', 'פרנק רוהל ליברה מודגש', serif" },
            { name: "אסיסטנט (Assistant)", val: "'Assistant', sans-serif" },
            { name: "רוביק (Rubik)", val: "'Rubik', sans-serif" }
        ]}
    ];

    const pickerDefaults = {
        'font-body': "'גוטמן רש\"י רגיל', 'פרנק רוהל ליברה רגיל', serif",
        'font-first-word': "'פרנק ריל מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-dh': "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif",
        'f-hdr-r': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-hdr-c': "'ליבורנה רגיל', 'פרנק רוהל ליברה רגיל', serif",
        'f-hdr-l': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-hdr-verso-r': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-hdr-verso-c': "'ליבורנה רגיל', 'פרנק רוהל ליברה רגיל', serif",
        'f-hdr-verso-l': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-h0': "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif",
        'f-h0-body': "'פרנק רוהל ליברה רגיל', serif",
        'f-h1': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-h2': "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif",
        'f-siman': "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif",
        'f-h3': "'אלפא שחור', 'נוטו סריף עברית שחור', serif",
        'f-h4': "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif",
        'f-h5': "'אלפא מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-h6': "'נוטו סריף עברית מודגש', serif",
        'f-h7': "'הדסה פרידלנדר מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-sh-title': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-sh-sub': "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif",
        'f-sh-desc': "'ליבורנה רגיל', 'פרנק רוהל ליברה רגיל', serif",
        'f-sh-sec': "'פרנק רוהל ליברה רגיל', serif",
        'f-sh-author': "'פרנק רוהל ליברה רגיל', serif",
        'f-sh-year': "'פרנק רוהל ליברה רגיל', serif",
        'f-note-title': "'פרנק רוהל ליברה מודגש', serif",
        'f-note-body': "'פרנק רוהל ליברה רגיל', serif",
        'f-gtoc-1': "'פרנק רוהל ליברה רגיל', serif", 'f-gtoc-2': "'פרנק רוהל ליברה רגיל', serif",
        'f-gtoc-3': "'פרנק רוהל ליברה רגיל', serif", 'f-gtoc-4': "'פרנק רוהל ליברה רגיל', serif",
        'f-gtoc-5': "'פרנק רוהל ליברה רגיל', serif", 'f-gtoc-6': "'פרנק רוהל ליברה רגיל', serif",
        'f-gtoc-7': "'פרנק רוהל ליברה רגיל', serif",
        'f-dtoc-1': "'פרנק רוהל ליברה רגיל', serif", 'f-dtoc-2': "'פרנק רוהל ליברה רגיל', serif",
        'f-dtoc-3': "'פרנק רוהל ליברה רגיל', serif", 'f-dtoc-4': "'פרנק רוהל ליברה רגיל', serif",
        'f-dtoc-5': "'פרנק רוהל ליברה רגיל', serif", 'f-dtoc-6': "'פרנק רוהל ליברה רגיל', serif",
        'f-dtoc-7': "'פרנק רוהל ליברה רגיל', serif"
    };

    document.querySelectorAll('.font-picker').forEach(select => {
        if (select.children.length === 0) {
            defaultFonts.forEach(grp => {
                const optGroup = document.createElement('optgroup');
                optGroup.label = grp.label;
                grp.fonts.forEach(f => {
                    const opt = document.createElement('option');
                    opt.value = f.val;
                    opt.textContent = f.name;
                    optGroup.appendChild(opt);
                });
                select.appendChild(optGroup);
            });
            const defVal = pickerDefaults[select.id];
            if (defVal) {
                select.value = defVal;
            }
        }
    });
}

async function ensureBuiltinFontsLoaded() {
    const families = ['Assistant', 'Rubik', 'Bellefair', 'David Libre', 'Frank Ruhl Libre', 'Noto Serif Hebrew'];
    const weights = ['400', '700', '900'];
    try {
        const loads = [];
        families.forEach(f => {
            weights.forEach(w => {
                loads.push(document.fonts.load(`${w} 1em "${f}"`).catch(() => {}));
            });
        });
        await Promise.all(loads);
        await document.fonts.ready;
    } catch (e) {}
}

async function loadSystemFonts() {
    if ('queryLocalFonts' in window) {
        try {
            const availableFonts = await window.queryLocalFonts();
            const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));

            if (fontFamilies.length > 0) {
                document.querySelectorAll('.font-picker').forEach(select => {
                    const currentVal = select.value;
                    const sysGroup = document.createElement('optgroup');
                    sysGroup.label = `גופני מחשב (${fontFamilies.length} נמצאו)`;

                    fontFamilies.forEach(family => {
                        const opt = document.createElement('option');
                        opt.value = `'${family}', serif`;
                        opt.textContent = family;
                        sysGroup.appendChild(opt);
                    });

                    select.appendChild(sysGroup);
                    select.value = currentVal;
                });
                alert(`נטענו בהצלחה ${fontFamilies.length} גופנים מהמחשב!`);
            }
        } catch (err) {
            alert('לא ניתנה הרשאה לגישה לגופני המחשב.');
        }
    } else {
        alert('הדפדפן אינו תומך בגישה ישירה לגופני המערכת. מומלץ להשתמש ב-Chrome או Edge.');
    }
}

async function loadExternalFonts() {
    try {
        const res = await fetch('fonts/fonts.json');
        if (!res.ok) return;
        const fonts = await res.json();
        if (!Array.isArray(fonts)) return;

        for (const font of fonts) {
            try {
                const fontFace = new FontFace(font.family, `url(fonts/${encodeURIComponent(font.file)})`);
                await fontFace.load();
                document.fonts.add(fontFace);

                document.querySelectorAll('.font-picker').forEach(select => {
                    const currentVal = select.value;
                    let grp = select.querySelector('optgroup[label="גופנים מקומיים (תיקיית fonts)"]');
                    if (!grp) {
                        grp = document.createElement('optgroup');
                        grp.label = 'גופנים מקומיים (תיקיית fonts)';
                        select.prepend(grp);
                    }
                    const opt = document.createElement('option');
                    opt.value = `'${font.family}', serif`;
                    opt.textContent = font.family;
                    grp.appendChild(opt);
                    select.value = currentVal;
                });
            } catch (err) {}
        }
    } catch (e) {}
}

/* ==========================================================================
   11. סריקת תיקיית נכסים מקומית
   ========================================================================== */
function triggerAssetsFolderPick() {
    const inp = document.getElementById('assets-folder-input');
    if (inp) inp.click();
}

function readFileAsText(file) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsText(file);
    });
}

function readFileAsDataURL(file) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(file);
    });
}

async function handleAssetsFolderSelected(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const IMG_RE = /\.(png|jpe?g|gif|webp|svg)$/i;
    const status = document.getElementById('assets-folder-status');
    let loaded = 0, themesLoaded = 0;

    const FOLDER_MAP = {
        'section_dividers': 'divider',
        'header_ornaments': 'header',
        'ornaments_up_down': 'updown',
        'ornaments_left_right': 'leftright',
        'note_rules': 'noterule',
        'shaar_main': 'shaar_main',
        'shaar_sub': 'shaar_sub',
        'shaar_back': 'shaar_back'
    };

    const themeBuckets = {};

    for (const file of files) {
        if (!IMG_RE.test(file.name)) continue;
        const rel = (file.webkitRelativePath || file.name).replace(/\\/g, '/');
        const parts = rel.split('/');
        const baseName = file.name.replace(IMG_RE, '');
        const isSvg = /\.svg$/i.test(file.name);

        let content;
        try {
            content = isSvg ? await readFileAsText(file) : `<img src="${await readFileAsDataURL(file)}" style="object-fit:contain;" />`;
        } catch (e) { continue; }

        const themesIdx = parts.findIndex(p => p.toUpperCase() === 'THEMES');
        if (themesIdx !== -1 && parts.length > themesIdx + 2) {
            const themeName = parts[themesIdx + 1];
            const lower = file.name.toLowerCase();
            let slot = null;
            if (/main|ראשי/.test(lower)) slot = 'main';
            else if (/sub|משנה/.test(lower)) slot = 'sub';
            else if (/back/.test(lower) || lower.includes('אחורי')) slot = 'back';
            if (slot) {
                themeBuckets[themeName] = themeBuckets[themeName] || {};
                themeBuckets[themeName][slot] = content;
            }
            continue;
        }

        let kind = null;
        for (let i = parts.length - 2; i >= 0; i--) {
            const key = parts[i].toLowerCase();
            if (FOLDER_MAP[key]) { kind = FOLDER_MAP[key]; break; }
        }
        if (!kind) continue;

        const id = `folder_${kind}_${baseName}`.replace(/\s+/g, '_');
        try {
            if (kind === 'divider') {
                registerExternalDivider(id, content);
                appendOptionToSelect('section-divider-style', id, baseName, 'מתיקייה', 'sec-div-folder-optgroup');
            } else if (kind === 'header') {
                registerExternalHeader(id, content);
                ['hdr-r-type', 'hdr-c-type', 'hdr-l-type', 'hdr-verso-r-type', 'hdr-verso-c-type', 'hdr-verso-l-type']
                    .forEach(sel => appendOptionToSelect(sel, id, baseName, 'מתיקייה'));
            } else if (kind === 'updown') {
                registerExternalAllOrnament(id, content);
                appendOptionToSelect('h2-ornament-top-style', id, baseName, 'מתיקייה');
                appendOptionToSelect('h2-ornament-bottom-style', id, baseName, 'מתיקייה');
            } else if (kind === 'leftright') {
                registerExternalAllOrnament(id, content);
                if (typeof ORNAMENTS_LR !== 'undefined') ORNAMENTS_LR[id] = { svg: content, name: baseName };
                ['h3-ornament-r', 'h3-ornament-l', 'h2-title-ornament-r', 'h2-title-ornament-l']
                    .forEach(sel => appendOptionToSelect(sel, id, baseName, 'מתיקייה'));
            } else if (kind === 'noterule') {
                registerExternalNoteRule(id, content);
                appendOptionToSelect('note-rule-style', id, baseName, 'מתיקייה');
            } else if (kind.startsWith('shaar_')) {
                const t = kind.split('_')[1];
                registerExternalShaar(t, id, baseName, content);
                appendOptionToSelect(`select-shaar-${t}`, id, baseName, 'מתיקייה');
            }
            loaded++;
        } catch (e) {}
    }

    Object.entries(themeBuckets).forEach(([themeName, slots]) => {
        const themeId = `folder_theme_${themeName}`.replace(/\s+/g, '_');
        ['main', 'sub', 'back'].forEach(slot => {
            if (!slots[slot]) return;
            const sid = `${themeId}_${slot}`;
            try {
                registerExternalShaar(slot, sid, `${themeName} (${slot})`, slots[slot]);
                appendOptionToSelect(`select-shaar-${slot}`, sid, `${themeName} - ${slot}`, 'ערכות מתיקייה');
            } catch (e) {}
        });
        if (typeof BUILTIN_SHAAR_THEMES !== 'undefined') {
            BUILTIN_SHAAR_THEMES[themeId] = {
                mainHTML: slots.main || '',
                backHTML: slots.back || '',
                backStyle: 'position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;',
                subHTML: slots.sub || '',
                subStyle: 'position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;'
            };
        }
        appendOptionToSelect('active-theme-select', themeId, `ערכה מתיקייה: ${themeName}`, 'ערכות מתיקייה', 'folder-themes-optgroup');
        themesLoaded++;
    });

    if (status) {
        status.textContent = (loaded || themesLoaded)
            ? `נטענו ${loaded} נכסים${themesLoaded ? ` ו-${themesLoaded} ערכות שערים` : ''}.`
            : 'לא נמצאו נכסים מתאימים בתיקייה.';
    }
    typesetDocument();
    initVisualPickers();
}

/* ==========================================================================
   12. טעינת נכסי JSON וערכות מניפסט
   ========================================================================== */
async function loadExternalJSONAssets() {
    const assetsToLoad = [
        { file: 'shaar_main.json', type: 'shaar_main' },
        { file: 'shaar_sub.json', type: 'shaar_sub' },
        { file: 'shaar_back.json', type: 'shaar_back' },
        { file: 'header_ornaments.json', type: 'header' },
        { file: 'section_dividers.json', type: 'divider' },
        { file: 'note_rules.json', type: 'note_rule' },
        { file: 'ornaments_left_right.json', type: 'ornaments_lr' },
        { file: 'ornaments_up_down.json', type: 'ornaments_ud' }
    ];

    const jsonShaarSets = {};

    for (const asset of assetsToLoad) {
        try {
            const response = await fetch(asset.file);
            if (!response.ok) continue;
            const items = await response.json();
            if (!Array.isArray(items)) continue;

            items.forEach(item => {
                const numMatch = (item.name && item.name.match(/^(\d+)/)) || (item.id && item.id.match(/(\d+)/));
                const setNum = numMatch ? numMatch[1] : null;

                if (asset.type === 'shaar_main') {
                    registerExternalShaar('main', item.id, item.name, item.svg);
                    appendOptionToSelect('select-shaar-main', item.id, item.name, 'שערים ראשיים מ-JSON', 'shaar-main-json-optgroup');
                    if (window.loadedShaarItems) window.loadedShaarItems.main[item.id] = item;
                    if (item.box && window.shaarBoxSavedPositions) {
                        window.shaarBoxSavedPositions.main[item.id] = item.box;
                    }
                    if (setNum) {
                        if (!jsonShaarSets[setNum]) jsonShaarSets[setNum] = {};
                        jsonShaarSets[setNum].main = item;
                    }
                } else if (asset.type === 'shaar_sub') {
                    registerExternalShaar('sub', item.id, item.name, item.svg);
                    appendOptionToSelect('select-shaar-sub', item.id, item.name, 'שערי משנה מ-JSON', 'shaar-sub-json-optgroup');
                    if (window.loadedShaarItems) window.loadedShaarItems.sub[item.id] = item;
                    if (item.box && window.shaarBoxSavedPositions) {
                        window.shaarBoxSavedPositions.sub[item.id] = item.box;
                    }
                    if (setNum) {
                        if (!jsonShaarSets[setNum]) jsonShaarSets[setNum] = {};
                        jsonShaarSets[setNum].sub = item;
                    }
                } else if (asset.type === 'shaar_back') {
                    registerExternalShaar('back', item.id, item.name, item.svg);
                    appendOptionToSelect('select-shaar-back', item.id, item.name, 'שערים אחוריים מ-JSON', 'shaar-back-json-optgroup');
                    if (window.loadedShaarItems) window.loadedShaarItems.back[item.id] = item;
                    if (item.box && window.shaarBoxSavedPositions) {
                        window.shaarBoxSavedPositions.back[item.id] = item.box;
                    }
                    if (setNum) {
                        if (!jsonShaarSets[setNum]) jsonShaarSets[setNum] = {};
                        jsonShaarSets[setNum].back = item;
                    }
                } else if (asset.type === 'header') {
                    registerExternalHeader(item.id, item.svg);
                    appendOptionToSelect('hdr-c-type', item.id, item.name, 'עיטורי כותרת מ-JSON', 'hdr-c-json-optgroup');
                    appendOptionToSelect('hdr-r-type', item.id, item.name, 'עיטורי כותרת מ-JSON', 'hdr-r-json-optgroup');
                    appendOptionToSelect('hdr-l-type', item.id, item.name, 'עיטורי כותרת מ-JSON', 'hdr-l-json-optgroup');
                } else if (asset.type === 'divider') {
                    registerExternalDivider(item.id, item.svg);
                    appendOptionToSelect('section-divider-style', item.id, item.name, 'עיטורי סיום מ-JSON', 'sec-div-json-optgroup');
                } else if (asset.type === 'note_rule') {
                    registerExternalNoteRule(item.id, item.svg);
                    appendOptionToSelect('note-rule-style', item.id, item.name, 'מפרידים מ-JSON', 'note-rules-json-optgroup');
                } else if (asset.type === 'ornaments_lr') {
                    registerOrnamentsLR(item.id, item.name, item.svg);
                    appendOptionToSelect('h3-ornament-set', item.id, item.name, 'סטים שלמים מ-JSON', 'h3-set-json-optgroup');
                    appendOptionToSelect('h3-ornament-r', item.id, item.name, 'עיטורי ימין מ-JSON', 'h3-r-json-optgroup');
                    appendOptionToSelect('h3-ornament-l', item.id, item.name, 'עיטורי שמאל מ-JSON', 'h3-l-json-optgroup');
                    appendOptionToSelect('note-header-orn-r', item.id, item.name, 'מתוך ornaments_left_right.json', 'note-orn-r-json');
                    appendOptionToSelect('note-header-orn-l', item.id, item.name, 'מתוך ornaments_left_right.json', 'note-orn-l-json');
                    appendOptionToSelect('h2-title-ornament-r', item.id, item.name, 'עיטורי צד מ-JSON', 'h2-title-lr-json-optgroup');
                    appendOptionToSelect('h2-title-ornament-l', item.id, item.name, 'עיטורי צד מ-JSON', 'h2-title-lr-json-optgroup-l');
                } else if (asset.type === 'ornaments_ud') {
                    registerOrnamentsUD(item.id, item.name, item.svg);
                    appendOptionToSelect('h2-ornament-set', item.id, item.name, 'סטים שלמים מ-JSON', 'h2-set-json-optgroup');
                    appendOptionToSelect('h2-ornament-top-style', item.id, item.name, 'עיטורים עליונים מ-JSON', 'h2-top-json-optgroup');
                    appendOptionToSelect('h2-ornament-bottom-style', item.id, item.name, 'עיטורים תחתונים מ-JSON', 'h2-btm-json-optgroup');
                    appendOptionToSelect('h2-title-ornament-top-style', item.id, item.name, 'עיטורים עליונים מ-JSON', 'h2-title-top-json-optgroup');
                    appendOptionToSelect('h2-title-ornament-bottom-style', item.id, item.name, 'עיטורים תחתונים מ-JSON', 'h2-title-btm-json-optgroup');
                }
            });
        } catch (e) {}
    }

    Object.keys(jsonShaarSets).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).forEach(num => {
        const set = jsonShaarSets[num];
        const themeId = 'json_theme_' + num;
        const themeName = `ערכה ${num} (מ-JSON)`;

        if (typeof BUILTIN_SHAAR_THEMES !== 'undefined') {
            BUILTIN_SHAAR_THEMES[themeId] = {
                mainHTML: set.main ? set.main.svg : '',
                backHTML: set.back ? set.back.svg : '',
                backStyle: 'position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;',
                subHTML: set.sub ? set.sub.svg : '',
                subStyle: 'position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;'
            };
        }

        appendOptionToSelect('active-theme-select', themeId, themeName, 'ערכות מאוחדות מ-JSON', 'json-themes-optgroup');
    });

    initVisualPickers();
}

async function loadFolderAssetsAndThemes() {
    try {
        const manifestRes = await fetch('assets_manifest.json');
        if (manifestRes.ok) {
            const manifest = await manifestRes.json();
            if (manifest.themes) {
                Object.keys(manifest.themes).forEach(tId => {
                    const theme = manifest.themes[tId];
                    if (typeof BUILTIN_SHAAR_THEMES !== 'undefined') {
                        BUILTIN_SHAAR_THEMES[tId] = {
                            mainHTML: theme.main || '',
                            backHTML: theme.back || '',
                            backStyle: 'position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;',
                            subHTML: theme.sub || '',
                            subStyle: 'position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;'
                        };
                    }
                    appendOptionToSelect('active-theme-select', tId, `ערכת ${theme.name} (מ-THEMES)`, 'ערכות מתוך תיקיית THEMES', 'themes-folder-optgroup');
                });
            }
        }
    } catch(e) {}
}

function syncThemeToIndividualShaars() {
    const m = document.getElementById('select-shaar-main');
    const b = document.getElementById('select-shaar-back');
    const s = document.getElementById('select-shaar-sub');
    if (m) m.value = 'theme_default';
    if (b) b.value = 'theme_default';
    if (s) s.value = 'theme_default';
    refreshVisualPicker('select-shaar-main');
    refreshVisualPicker('select-shaar-back');
    refreshVisualPicker('select-shaar-sub');
}

function appendOptionToSelect(selectId, value, text, groupLabel, optgroupId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    if (select.querySelector(`option[value="${value}"]`)) return;

    let optgroup = optgroupId ? document.getElementById(optgroupId) : select.querySelector(`optgroup[label="${groupLabel}"]`);
    if (!optgroup) {
        optgroup = document.createElement('optgroup');
        if (optgroupId) optgroup.id = optgroupId;
        optgroup.label = groupLabel;
        select.appendChild(optgroup);
    }

    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    optgroup.appendChild(opt);
}

/* ==========================================================================
   13. סנכרון כפתורים, בוררים ולוגיקה הדדית
   ========================================================================== */
function onHdrAlternatingToggle() {
    const alt = document.getElementById('hdr-alternating');
    const split = document.getElementById('hdr-title-split');
    if (alt && alt.checked && split) split.checked = false;
}

function onHdrTitleSplitToggle() {
    const alt = document.getElementById('hdr-alternating');
    const split = document.getElementById('hdr-title-split');
    if (split && split.checked && alt) alt.checked = false;
}

function onHdrDistinctToggle() {
    const isDistinct = document.getElementById('hdr-distinct-even-odd')?.checked;
    const vCont = document.getElementById('hdr-verso-container');
    const altToggle = document.getElementById('hdr-alternating');
    if (vCont) vCont.style.display = isDistinct ? 'block' : 'none';
    if (isDistinct && altToggle) altToggle.checked = false;
    typesetDocument();
}

function onH2TitleOrnamentModeChange() {
    const mode = document.getElementById('h2-title-orn-mode')?.value || 'none';
    const tbRows = document.getElementById('h2-title-orn-tb-rows');
    const sideRows = document.getElementById('h2-title-orn-side-rows');
    if (tbRows) tbRows.style.display = (mode === 'top_bottom') ? 'block' : 'none';
    if (sideRows) sideRows.style.display = (mode === 'side') ? 'block' : 'none';
}

function onH2OrnamentSetChange(val) {
    const topEl = document.getElementById('h2-ornament-top-style');
    const btmEl = document.getElementById('h2-ornament-bottom-style');
    if (topEl) topEl.value = val;
    if (btmEl) btmEl.value = val;
    refreshVisualPicker('h2-ornament-top-style');
    refreshVisualPicker('h2-ornament-bottom-style');
    typesetDocument();
}

function onH2IndividualOrnamentChange() {
    const setEl = document.getElementById('h2-ornament-set');
    const topVal = document.getElementById('h2-ornament-top-style')?.value;
    const btmVal = document.getElementById('h2-ornament-bottom-style')?.value;
    if (setEl) {
        if (topVal === btmVal) setEl.value = topVal;
        else setEl.value = 'custom';
        refreshVisualPicker('h2-ornament-set');
    }
}

function onH3OrnamentSetChange(val) {
    const rEl = document.getElementById('h3-ornament-r');
    const lEl = document.getElementById('h3-ornament-l');
    if (rEl) rEl.value = val;
    if (lEl) lEl.value = val;
    refreshVisualPicker('h3-ornament-r');
    refreshVisualPicker('h3-ornament-l');
    typesetDocument();
}

function onH3IndividualOrnamentChange() {
    const setEl = document.getElementById('h3-ornament-set');
    const rVal = document.getElementById('h3-ornament-r')?.value;
    const lVal = document.getElementById('h3-ornament-l')?.value;
    if (setEl) {
        if (rVal === lVal) setEl.value = rVal;
        else setEl.value = 'custom';
        refreshVisualPicker('h3-ornament-set');
    }
}

/* ==========================================================================
   14. כרטיסיות הבחירה הוויזואליות (Visual Card Selector)
   ========================================================================== */
const VISUAL_PICKER_TARGETS = [
    'select-shaar-main', 'select-shaar-back', 'select-shaar-sub', 'active-theme-select',
    'section-divider-style', 'h2-ornament-set', 'h2-ornament-top-style', 'h2-ornament-bottom-style',
    'h3-ornament-set', 'h3-ornament-r', 'h3-ornament-l', 'hdr-c-type', 'hdr-r-type', 'hdr-l-type',
    'note-rule-style', 'note-header-orn-r', 'note-header-orn-l',
    'hdr-verso-c-type', 'hdr-verso-r-type', 'hdr-verso-l-type'
];

function getItemPreviewHTML(selectId, value, text) {
    if (selectId.includes('shaar') || selectId === 'active-theme-select') {
        let type = selectId.includes('back') ? 'back' : selectId.includes('sub') ? 'sub' : 'main';
        if (value === 'theme_default') {
            return '<div class="vp-badge-theme">👑 לפי ערכה</div>';
        }
        if (typeof BUILTIN_SHAAR_THEMES !== 'undefined' && BUILTIN_SHAAR_THEMES[value]) {
            const t = BUILTIN_SHAAR_THEMES[value];
            const html = (type === 'back' ? t.backHTML : type === 'sub' ? t.subHTML : t.mainHTML) || t.mainHTML || '';
            return '<div class="vp-shaar-thumb">' + html + '</div>';
        }
        if (typeof EXTERNAL_SHAAR_ASSETS !== 'undefined' && EXTERNAL_SHAAR_ASSETS[type] && EXTERNAL_SHAAR_ASSETS[type][value]) {
            return '<div class="vp-shaar-thumb">' + EXTERNAL_SHAAR_ASSETS[type][value] + '</div>';
        }
        return '<div class="vp-badge-theme">🏛️ שער</div>';
    }

    if (selectId.includes('ornament') || selectId.includes('divider') || selectId.startsWith('hdr-') || selectId.startsWith('note-header-orn')) {
        if (value === 'none' || value === 'empty') return '<span class="vp-text-none">🚫 ללא</span>';
        if (value === 'custom_img') return '<span class="vp-text-muted">🖼️ תמונה</span>';
        if (value === 'custom') return '<span class="vp-text-muted">⚙️ מותאם</span>';

        if (selectId.startsWith('h2-ornament')) {
            const isTop = (selectId === 'h2-ornament-top-style');
            const flip = isTop ? 'transform: scaleY(-1);' : '';
            if (typeof ORNAMENTS_UD !== 'undefined' && ORNAMENTS_UD[value]) {
                return `<div class="vp-ornament-thumb" style="${flip}">${ORNAMENTS_UD[value].svg}</div>`;
            }
        }

        if (selectId.startsWith('h3-ornament') || selectId.startsWith('note-header-orn')) {
            const isLeft = (selectId === 'h3-ornament-l' || selectId === 'note-header-orn-l');
            const flip = isLeft ? 'transform: scaleX(-1);' : '';
            if (typeof ORNAMENTS_LR !== 'undefined' && ORNAMENTS_LR[value]) {
                return `<div class="vp-ornament-thumb" style="${flip}">${ORNAMENTS_LR[value].svg}</div>`;
            }
        }

        if (value === 'diamonds') return '<span style="letter-spacing:2px; font-size:8.5pt;">◈ ❖ ◈</span>';
        if (value === 'pyramid') return '<div style="font-size:7.5pt; letter-spacing:2px; line-height:1;">❖ ❖ ❖</div>';
        if (typeof EXTERNAL_ALL_ORNAMENTS !== 'undefined' && EXTERNAL_ALL_ORNAMENTS[value]) {
            return '<div class="vp-ornament-thumb">' + EXTERNAL_ALL_ORNAMENTS[value] + '</div>';
        }
        if (typeof HEADER_ORNAMENTS !== 'undefined' && HEADER_ORNAMENTS[value]) {
            return '<div class="vp-ornament-thumb">' + HEADER_ORNAMENTS[value] + '</div>';
        }
        if (typeof SECTION_DIVIDERS !== 'undefined' && SECTION_DIVIDERS[value]) {
            return '<div class="vp-ornament-thumb">' + SECTION_DIVIDERS[value] + '</div>';
        }
    }

    if (selectId === 'note-rule-style') {
        if (value === 'plain') return '<div style="border-top:1.5px solid #333; width:70%; margin:auto;"></div>';
        if (value === 'short_right') return '<div style="border-top:1.5px solid #333; width:30%; margin-left:auto; margin-right:15%;"></div>';
        if (value === 'half') return '<div style="border-top:1.5px solid #333; width:50%; margin:auto;"></div>';
        if (value === 'double') return '<div style="border-top:3px double #333; width:70%; margin:auto;"></div>';
        if (value === 'none') return '<span class="vp-text-none">🚫 ללא קו</span>';
        if (typeof NOTE_RULE_GLYPHS !== 'undefined' && NOTE_RULE_GLYPHS[value]) {
            return '<span style="letter-spacing:2px; font-size:8.5pt; font-weight:bold;">' + NOTE_RULE_GLYPHS[value] + '</span>';
        }
    }

    return '<span class="vp-text-fallback">' + (text || value) + '</span>';
}

function initVisualPickers() {
    VISUAL_PICKER_TARGETS.forEach(selectId => {
        refreshVisualPicker(selectId);
    });
}

function refreshVisualPicker(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const isShaar = selectId.includes('shaar') || selectId === 'active-theme-select';

    let wrap = document.getElementById('vp-wrap-' + selectId);
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'visual-picker-wrapper';
        wrap.id = 'vp-wrap-' + selectId;
        select.parentNode.insertBefore(wrap, select);
        select.style.display = 'none';
        wrap.appendChild(select);

        const trig = document.createElement('button');
        trig.type = 'button';
        trig.className = 'visual-picker-trigger';
        trig.id = 'vp-trig-' + selectId;
        trig.onclick = (e) => {
            e.stopPropagation();
            toggleVisualPickerDropdown(selectId);
        };
        wrap.appendChild(trig);

        const drop = document.createElement('div');
        drop.className = 'visual-picker-dropdown';
        drop.id = 'vp-drop-' + selectId;
        wrap.appendChild(drop);
    }

    const selectedOpt = select.options[select.selectedIndex] || select.options[0];
    const curVal = selectedOpt ? selectedOpt.value : '';
    const curText = selectedOpt ? selectedOpt.textContent : '';

    const trig = document.getElementById('vp-trig-' + selectId);
    if (trig) {
        trig.innerHTML = `
      <div class="vp-trig-preview">${getItemPreviewHTML(selectId, curVal, curText)}</div>
      <span class="vp-trig-label">${escapeHTML(curText)}</span>
      <span class="vp-trig-arrow">▼</span>
    `;
    }

    const drop = document.getElementById('vp-drop-' + selectId);
    if (drop) {
        let cardsHTML = '';
        Array.from(select.options).forEach(opt => {
            const isSel = (opt.value === curVal);
            const prevHTML = getItemPreviewHTML(selectId, opt.value, opt.textContent);
            const safeVal = escapeHTML(opt.value);
            const safeText = escapeHTML(opt.textContent);
            cardsHTML += `
        <div class="visual-card ${isSel ? 'selected' : ''} ${isShaar ? 'shaar-card' : 'ornament-card'}"
             data-val="${safeVal}"
             data-select-id="${escapeHTML(selectId)}">
          <div class="visual-card-preview">${prevHTML}</div>
          <div class="visual-card-name" title="${safeText}">${safeText}</div>
          ${isSel ? '<div class="visual-card-check">✓</div>' : ''}
        </div>
      `;
        });
        drop.innerHTML = `<div class="visual-cards-grid ${isShaar ? 'shaar-grid' : 'ornament-grid'}">${cardsHTML}</div>`;
    }
}

function toggleVisualPickerDropdown(selectId) {
    const drop = document.getElementById('vp-drop-' + selectId);
    if (!drop) return;
    const isOpen = drop.classList.contains('open');
    closeAllVisualPickers();
    if (!isOpen) drop.classList.add('open');
}

function closeAllVisualPickers() {
    document.querySelectorAll('.visual-picker-dropdown.open').forEach(d => d.classList.remove('open'));
}

function selectVisualPickerItem(selectId, val) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.value = val;
    select.dispatchEvent(new Event('change'));
    refreshVisualPicker(selectId);
    closeAllVisualPickers();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.visual-picker-wrapper')) {
        closeAllVisualPickers();
    }
});

/* ---------------------------------------------------------------------------
   Event Delegation: כל הכפתורים שהוסרו מ-onclick inline מטופלים כאן.
   תומך CSP מחמיר (script-src 'self').
   --------------------------------------------------------------------------- */
document.addEventListener('click', (e) => {
    // כפתור דיבאג של עמוד
    const debugBtn = e.target.closest('.page-debug-btn[data-debug-page]');
    if (debugBtn) {
        e.stopPropagation();
        const pNum = parseInt(debugBtn.dataset.debugPage, 10);
        if (Number.isFinite(pNum) && typeof window.exportPageDebugReport === 'function') {
            window.exportPageDebugReport(pNum);
        }
        return;
    }

    // כרטיס בורר ויזואלי
    const visualCard = e.target.closest('.visual-card[data-val]');
    if (visualCard) {
        const selectId = visualCard.dataset.selectId;
        const val = visualCard.dataset.val;
        if (selectId && val !== undefined) {
            selectVisualPickerItem(selectId, val);
        }
        return;
    }

    // כפתור "הסר" של תוסף חיצוני
    const removeBtn = e.target.closest('.ext-remove-btn');
    if (removeBtn) {
        const kind = removeBtn.dataset.kind;
        const instance = removeBtn.dataset.instance;
        if (kind && instance) {
            removeExtInstance(kind, instance);
        }
        return;
    }

    // כפתור "מחק" של ערכת נושא מותאמת
    const deleteThemeBtn = e.target.closest('.delete-theme-btn');
    if (deleteThemeBtn) {
        const themeId = deleteThemeBtn.dataset.themeId;
        if (themeId && typeof deleteCustomTheme === 'function') {
            deleteCustomTheme(themeId);
        }
        return;
    }
});

// Event Delegation עבור שינוי anchor של תוסף חיצוני
document.addEventListener('change', (e) => {
    const sel = e.target.closest('.ext-anchor-select');
    if (sel) {
        const kind = sel.dataset.kind;
        const instance = sel.dataset.instance;
        const val = sel.value;
        if (kind && instance && typeof updateExtAnchor === 'function') {
            updateExtAnchor(kind, instance, val);
        }
    }
});

// Event Delegation עבור כפתורי אקורדיון שהוסרו מ-onclick inline ב-HTML.
// תומך בשני סוגי כפתורים:
//   1. data-action="toggle-settings-pane" — פותח/סוגר את לוח ההגדרות הראשי.
//   2. data-action="toggle-panel-body" עם data-target="panel-id" — פותח/סוגר פאנל אקורדיון.
document.addEventListener('click', (e) => {
    const toggleSettingsBtn = e.target.closest('[data-action="toggle-settings-pane"]');
    if (toggleSettingsBtn) {
        if (typeof toggleSettingsPane === 'function') {
            toggleSettingsPane();
        }
        return;
    }
    const togglePanelBtn = e.target.closest('[data-action="toggle-panel-body"]');
    if (togglePanelBtn) {
        const target = togglePanelBtn.dataset.target;
        if (target && typeof togglePanelBody === 'function') {
            togglePanelBody(target);
        }
        return;
    }
});

// עדכון aria-expanded לאחר החלפת מצב פאנל/אקורדיון.
// המקור: togglePanelBody ו-toggleSettingsPane כבר קיימות ב-app.js. אנו רק מוסיפים
// "Wrapper" שמעדכן את ה-aria. לשם כך נאזין ל-shorthand CSS class במוטציה.
const _a11yObserver = new MutationObserver((mutations) => {
    for (const mut of mutations) {
        if (mut.type !== 'attributes' || mut.attributeName !== 'style') continue;
        const el = mut.target;
        // אם אלמנט שינה display, נבדוק אם יש לו כפתור שולט (data-target).
        if (!el.id) continue;
        const ctrl = document.querySelector(`[data-action="toggle-panel-body"][data-target="${el.id}"]`);
        if (ctrl) {
            const isHidden = (el.style.display === 'none') || (window.getComputedStyle(el).display === 'none');
            ctrl.setAttribute('aria-expanded', String(!isHidden));
        }
    }
});
// נרשום את כל הפאנלים המתקפלים לאחר טעינת ה-DOM.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[id$="-body"][data-panel-body], .panel-body').forEach(el => {
            _a11yObserver.observe(el, { attributes: true, attributeFilter: ['style'] });
        });
    });
} else {
    document.querySelectorAll('[id$="-body"][data-panel-body], .panel-body').forEach(el => {
        _a11yObserver.observe(el, { attributes: true, attributeFilter: ['style'] });
    });
}

/* ==========================================================================
   15. אירוע טעינת הדף הראשי (Window Onload)
   ========================================================================== */
// FIX: החלפת window.onload = ... ב-addEventListener — מונע דריסה של מאזינים
// שהוגדרו קודם על-ידי ספריות אחרות (קונפליקט שקט עם analytics/tracking).
window.addEventListener('load', async function() {
    initFontPickers();
    refreshCustomThemesUI();
    rehydrateExtImports();

    await loadExternalJSONAssets();
    await loadFolderAssetsAndThemes();
    await loadExternalFonts();
    await ensureBuiltinFontsLoaded();
    
    // תיקון: טעינת גופנים בשני שלבים.
    // שלב א': טען רק את הגופנים הנחוצים לעמודי טקסט רגילים (12 גופנים).
    // שלב ב': שאר הגופנים ייטענו ברקע תוך כדי עבודה.
    const PRIORITY_FONTS = [
        '12pt "גוטמן רש\"י רגיל"',
        '12pt "פרנק ריל מודגש"',
        '12pt "אלפא שחור"',
        '12pt "אלפא מודגש"',
        '12pt "ליבורנה רגיל"',
        '12pt "ליבורנה מודגש"',
        '12pt "הדסה פרידלנדר מודגש"',
        '12pt "פרנק רוהל ליברה רגיל"',
        '12pt "פרנק רוהל ליברה מודגש"',
        '12pt "פרנק רוהל ליברה שחור"',
        '12pt "נוטו סריף עברית מודגש"',
        '12pt "נוטו סריף עברית שחור"',
    ];
    try {
        if (document.fonts && document.fonts.load) {
            // טען רק את הגופנים העיקריים וחכה להם
            await Promise.all(PRIORITY_FONTS.map(f => document.fonts.load(f).catch(() => {})));
            console.log('✓ גופנים עיקריים נטענו — מתחיל עימוד');
        }
    } catch (e) {
        console.warn('Priority font loading failed (non-critical):', e);
    }
    
    // שלב ב': טען את שאר הגופנים ברקע (לא חיוני לעימוד)
    try {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                console.log('✓ כל הגופנים נטענו ברקע');
            }).catch(() => {});
        }
    } catch (e) { /* non-critical */ }

    if (document.getElementById('section-divider-style')?.value === 'custom_img') {
        const row = document.getElementById('row-sec-div-img');
        if (row) row.style.display = 'flex';
    }
    if (document.getElementById('hdr-c-type')?.value === 'custom_img') {
        const row = document.getElementById('row-hdr-c-img');
        if (row) row.style.display = 'flex';
    }

    if (editorElem && !editorElem.value.trim()) {
        editorElem.value = `שם הספר - מקום בינה
נושא - הוצאה - רשויות - חצירות - תחומין
נושא מפורט - הקדמות וביאורים במסכתות שבת ועירובין
פרטי מהדורא - מהדורת ניסיון | לא מוגה
שם המחבר - נתנאל דיינובסקי
מקום ושנת הוצאה - ירושלים | תשפ"ו
שמירת זכויות - כל הזכויות הפקר
פרטי הוצאה לאור - הוצאת זוכמיר בע"מ
פרטי קשר - 052-7666666
פרטים נוספים - אין לסמוך על האמור להלכה

כותרת 1 מספר 1 - הקדמות וכללים - יום השבת - גדרי מלאכה - הוצאה - רשויות
כותרת 0 מספר 1 - הקדמה
כהקדמה לדיני הוצאה וגדרי רשויות ועל מנת לבאר את הדינים התלויים בגדרים אלו, נצרכים אנו לבאר את גדרי האיסור ואת המציאות שעליה נאמר האיסור, ולראות איזה מהם מזה ואיזה מזה.
והנה כהרבה מדיני התורה הק' ניתנו לנו איסורי התורה על מציאות מוקדמת הברורה לנו, חלק מהם ברורים לנו מבלי להעמיד בהם גדרים במציאות ושאר שיעורים, ועיקרם של הלכות אלו להאיר עינינו לראות המציאות הקיימת וחילוקיה, לחייב ולפטור, להתיר ולאסור.

כותרת 2 מספר 2 - קדושת יום השבת ומצוותיה
כותרת 3 מספר 1 - מהות השבת וחלקי מצוותה
כותרת 4 מספר 1 - חלקי מצוות השבת
כותרת 7 מספר 1 - חילוקי משמעות בשם שבת
השבת תבוא בשני משמעויות. א. השבת לעצמה. ב. מצות השבת. מצוות השבת תחלק לשלושה חלקים. א. המצווה. ב. סיבת המצווה. ג. מטרת המצווה. המצווה תחלק לשני חלקים. א. בעשייה. ב. באי עשייה. בחלק העשייה מצאנו שני גדרים. א. הקדושה. ב. השביתה. בחלק הקדושה מצאנו שני גדרים. א. זכירה. ב. שמירה. [כאן הערת שוליים המבארת את יסודות קדושת השבת והשביתה כהלכתם לפי שיטות הראשונים].`;
    }

    typesetDocument();
    initVisualPickers();

    // תיקון קריטי: re-typeset לפני הדפסה.
    // רינדור הגופנים שונה בין מסך להדפסה (font hinting, subpixel positioning).
    // לכן האיזון שחושב על מסך לא תקף להדפסה. צריך להריץ מחדש.
    let isRebalancingForPrint = false;
    window.addEventListener('beforeprint', () => {
        if (isRebalancingForPrint) return;
        isRebalancingForPrint = true;
        try {
            // הרץ מחדש את העימוד — ה-layout כעת במצב print (@media print)
            // והאיזון יחושב על בסיס המדידות האמיתיות של ההדפסה.
            if (typeof performTypeset === 'function') {
                performTypeset();
            }
        } catch (e) {
            console.warn('beforeprint re-typeset failed:', e);
        }
    });
    window.addEventListener('afterprint', () => {
        // אחרי ההדפסה, הרץ מחדש למצב מסך
        isRebalancingForPrint = false;
        try {
            if (typeof performTypeset === 'function') {
                performTypeset();
            }
        } catch (e) {
            console.warn('afterprint re-typeset failed:', e);
        }
    });
});

