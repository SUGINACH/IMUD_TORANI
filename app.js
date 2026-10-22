/* ==========================================================================
   מערכת עימוד תורנית מקצועית לדפי A4 — גרסת העל המושלמת (Master Edition)
   קובץ: app.js
   ==========================================================================
   הסבר על השילוב והמיזוג שבוצע בקובץ זה:
   1. שחזור סורק התיקיות המקומי מגרסה 2 (חלוקת.txt):
      - הוטמעו הפונקציות 'triggerAssetsFolderPick' ו-'handleAssetsFolderSelected'
        המאפשרות בחירת תיקייה שלמה מהמחשב וטעינת כל העיטורים והשערים שבה
        ישירות לבוררים הוויזואליים בזיכרון, ללא תלות בשרת מקומי.
   2. אבטחת טעינת גופנים מגרסה 4 (עדכון.txt):
      - הפונקציה 'ensureBuiltinFontsLoaded' מוודאת שכל גופני הרשת נטענו במלואם
        לפני העימוד הראשון, ובכך מחסלת את באג ה-Layout Shift ומדידות הגובה השגויות.
   3. ניהול תיבות שער וייצוא JSON:
      - שילוב כפתורי ייצוא ה-JSON מגרסה 4 ('exportShaarJSONWithPositions') המאפשרים
        לשמור את מיקומי העכבר כקובץ JSON קבוע להחלפה במאגר המקורי.
      - שילוב כפתורי האיפוס מגרסה 3 ('resetCurrentShaarBoxPosition').
   4. בקרת שינויים ממתינים (Pending Changes):
      - הוטמעו הפונקציות 'markPendingChanges' ו-'clearPendingChanges' המדליקות
        חיווי פעימה זוהר על כפתור העימוד בעת שינוי הגדרות ללא הקפאת המסך.
   5. סנכרון ממדים דינמי ('applyHeadingOrnamentTextFit'):
      - מדידת פיקסלים אמיתית ב-DOM עבור כותרת 2, כותרת 3 ועיטורי צד עצמאיים.
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

/* סימון ויזואלי של שינויי הגדרות הממתינים לעימוד */
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
          <span>מעבר עמוד — עמוד ${pb.gematria || pb.pageNum} (${pb.pageNum})</span>
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
        document.execCommand('insertText', false, text);
        updateEditorStats();
    });

    editorElem.addEventListener('input', () => {
        updateEditorStats();
    });
}

function handleTxtFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        if (editorElem) {
            editorElem.value = e.target.result;
            // [תיקון] לא מפעילים עימוד אוטומטי אחרי ייבוא טקסט.
            // המשתמש ילחץ "עדכן ועמד מחדש" כדי להתחיל עימוד.
            // זה מונע עימוד כפול (פעם אחרי ייבוא, פעם אחרי הגדרות) ונותן שליטה למשתמש.
            // typesetDocument();  // — הוסר
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
            const targetEl = document.querySelector(`[data-token-id="${tokenId}"]`);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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

        /* שמירה פרטנית ומדויקת לפי מזהה השער הספציפי */
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
   6. סנכרון ממדים דינמי ב-DOM (Text-Fit לרוחב כותרת 2 וגובה עיטורי צד)
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
                html += `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #ddd; padding:3px 6px; border-radius:3px; margin-bottom:3px; font-size:8pt;">
            <span>🏷️ ${t.name}</span>
            <span style="color:#dc2626; cursor:pointer; font-weight:bold;" onclick="deleteCustomTheme('${t.id}')">🗑️ מחק</span>
          </div>
        `;
            });
            listContainer.innerHTML = html;
        }
    }

    if (select && currentVal) select.value = currentVal;
}

/* ==========================================================================
   8. תוספים חיצוניים (Extensions: סוגי עמוד, סגנונות טקסט ותמונות)
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
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
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
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
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
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
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
        triggerInfo = (def.trigger.type === 'delimiterPair') ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${def.trigger.open}" ל-"${def.trigger.close}"</div>` : `<div style="font-size:7.5pt;color:#888;">קידומת: "${def.trigger.prefix}"</div>`;
    }
    const anchorRow = (kind !== 'textStyle') ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${instanceId}-anchor" onchange="updateExtAnchor('${kind}','${instanceId}', this.value)">${EXT_ANCHOR_OPTIONS.map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>` : '';
    panel.innerHTML = `
    <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
      <span>${icon} ${name}</span>
      <span style="cursor:pointer;color:#a33;font-weight:700;" onclick="removeExtInstance('${kind}','${instanceId}')">✕ הסר</span>
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
        if (bs === 'color' && def.background.color) page.style.background = def.background.color;
        else if (bs === 'texture') page.style.background = '#fdfcf6 url("' + CBG_TEXTURE_SVG + '") repeat';
        else if (bs === 'image' && def.background.image) {
            const fade = 1 - (def.background.opacity != null ? def.background.opacity : 0.15);
            page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${def.background.image}")`;
            page.style.backgroundSize = 'cover';
            page.style.backgroundPosition = 'center';
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
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        reader.onload = function(e) {
            let svgText = e.target.result;
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
   9. שמירת תבנית מלאה (Save Template) כולל מיקומי שערים ותוספים
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
            { name: "גוטמן רש\"י (Guttman Rashi)", val: "'Guttman Rashi', 'Frank Ruhl Libre', serif" },
            { name: "פרנק-ריהל (Frank Ruhl Libre)", val: "'Frank Ruhl Libre', serif" },
            { name: "דוד ליברה (David Libre)", val: "'David Libre', serif" },
            { name: "נוטו סריף (Noto Serif Hebrew)", val: "'Noto Serif Hebrew', serif" },
            { name: "בלפייר (Bellefair)", val: "'Bellefair', serif" },
            { name: "ליבורנה (Livorna) + דוד", val: "'Livorna', 'David Libre', serif" },
            { name: "ליבורנה (Livorna) + פרנק רוהל", val: "'Livorna', 'Frank Ruhl Libre', serif" },
            { name: "אלפא בלק (AlphaBlack)", val: "'AlphaBlack', 'David Libre', serif" },
            { name: "אלפא (Alpha) + נוטו", val: "'Alpha', 'Noto Serif Hebrew', serif" },
            { name: "אלפא (Alpha) + פרנק רוהל", val: "'Alpha', 'Frank Ruhl Libre', serif" },
            { name: "אלפא לייט (AlphaLight)", val: "'AlphaLight', 'David Libre', serif" },
            { name: "ליה סגולה (Lia Sgula)", val: "'Lia Sgula', 'Bellefair', serif" },
            { name: "פרנקרעאל (FrankReal)", val: "'FrankReal', 'Frank Ruhl Libre', serif" },
            { name: "הדסה פרידלנדר (Hadassah)", val: "'Hadassah Friedlaender', 'David Libre', serif" },
            { name: "אסיסטנט (Assistant)", val: "'Assistant', sans-serif" },
            { name: "רוביק (Rubik)", val: "'Rubik', sans-serif" }
        ]}
    ];

    const pickerDefaults = {
        'font-body': "'Guttman Rashi', 'Frank Ruhl Libre', serif",
        'font-first-word': "'FrankReal', 'Frank Ruhl Libre', serif",
        'f-paren': "",  // [חדש] ברירת מחדל: ריק = כמו שאר הטקסט
        'f-dh': "'AlphaBlack', 'David Libre', serif",
        'f-hdr-r': "'Livorna', 'David Libre', serif",
        'f-hdr-c': "'Livorna', 'David Libre', serif",
        'f-hdr-l': "'Livorna', 'David Libre', serif",
        'f-hdr-verso-r': "'Livorna', 'David Libre', serif",
        'f-hdr-verso-c': "'Livorna', 'David Libre', serif",
        'f-hdr-verso-l': "'Livorna', 'David Libre', serif",
        'f-h0': "'AlphaBlack', 'David Libre', serif",
        'f-h0-body': "'Frank Ruhl Libre', serif",
        'f-h1': "'Lia Sgula', 'Bellefair', serif",
        'f-h2': "'AlphaBlack', 'David Libre', serif",
        'f-siman': "'AlphaBlack', 'David Libre', serif",
        'f-h3': "'Alpha', 'Noto Serif Hebrew', serif",
        'f-h4': "'Alpha', 'Frank Ruhl Libre', serif",
        'f-h5': "'AlphaLight', 'David Libre', serif",
        'f-h6': "'Noto Serif Hebrew', serif",
        'f-h7': "'Hadassah Friedlaender', 'David Libre', serif",
        'f-sh-title': "'Lia Sgula', 'Bellefair', serif",
        'f-sh-sub': "'Livorna', 'David Libre', serif",
        'f-sh-desc': "'Livorna', 'Frank Ruhl Libre', serif",
        'f-sh-sec': "'David Libre', serif",
        'f-sh-author': "'David Libre', serif",
        'f-sh-year': "'David Libre', serif",
        'f-note-title': "'David Libre', serif",
        'f-note-body': "'Frank Ruhl Libre', serif",
        'f-gtoc-1': "'David Libre', serif", 'f-gtoc-2': "'David Libre', serif",
        'f-gtoc-3': "'David Libre', serif", 'f-gtoc-4': "'David Libre', serif",
        'f-gtoc-5': "'David Libre', serif", 'f-gtoc-6': "'David Libre', serif",
        'f-gtoc-7': "'David Libre', serif",
        'f-dtoc-1': "'David Libre', serif", 'f-dtoc-2': "'David Libre', serif",
        'f-dtoc-3': "'David Libre', serif", 'f-dtoc-4': "'David Libre', serif",
        'f-dtoc-5': "'David Libre', serif", 'f-dtoc-6': "'David Libre', serif",
        'f-dtoc-7': "'David Libre', serif"
    };

    document.querySelectorAll('.font-picker').forEach(select => {
        if (select.children.length === 0) {
            // [חדש] עבור f-paren — הוסף אפשרות "ריק = כמו שאר הטקסט" בראש הרשימה
            if (select.id === 'f-paren') {
                const inheritOpt = document.createElement('option');
                inheritOpt.value = '';
                inheritOpt.textContent = '— כמו שאר הטקסט —';
                select.appendChild(inheritOpt);
            }
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
            if (defVal !== undefined) {
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
        // תיקון (2026-10-16): timeout במקום לחכות לנצח ל-document.fonts.ready
        // כי fonts-def.css (439 גופנים) גורם לזה לא להגיע.
        await Promise.race([
            Promise.all(loads),
            new Promise(resolve => setTimeout(resolve, 8000))
        ]);
        await Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(resolve, 3000))
        ]);
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
   11. סריקת תיקיית נכסים מקומית (שחזור מלא מגרסה 2 - חלוקת.txt)
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
    const sideRows = document.getElementById('h2-title-orn-side-rows');
    if (sideRows) sideRows.style.display = (mode === 'side') ? 'block' : 'none';
    typesetDocument();
}

// [חדש] תחולת עיטורי h2 — 4 אפשרויות: both / siman_only / title_only / separate
function onH2OrnScopeChange() {
    const scope = document.getElementById('h2-orn-scope')?.value || 'both';
    const tbRows = document.getElementById('h2-title-orn-tb-rows');
    // הצג עיטורי עליון/תחתון נפרדים לכותרת רק כש-separate
    if (tbRows) tbRows.style.display = (scope === 'separate') ? 'block' : 'none';
    typesetDocument();
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
      <span class="vp-trig-label">${curText}</span>
      <span class="vp-trig-arrow">▼</span>
    `;
    }

    const drop = document.getElementById('vp-drop-' + selectId);
    if (drop) {
        let cardsHTML = '';
        Array.from(select.options).forEach(opt => {
            const isSel = (opt.value === curVal);
            const prevHTML = getItemPreviewHTML(selectId, opt.value, opt.textContent);
            cardsHTML += `
        <div class="visual-card ${isSel ? 'selected' : ''} ${isShaar ? 'shaar-card' : 'ornament-card'}"
             data-val="${opt.value}"
             onclick="selectVisualPickerItem('${selectId}', '${opt.value}')">
          <div class="visual-card-preview">${prevHTML}</div>
          <div class="visual-card-name" title="${opt.textContent}">${opt.textContent}</div>
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

/* ==========================================================================
   14ב. טעינת רשימת גופנים מורחבת (Extended Fonts) — הוספה מ-v18
   ==========================================================================
   טוען את רשימה 2 של הגופנים (~1300 גופנים) מ-fonts-extended.css + fonts-extended.json.
   מופעלת על-ידי לחצן "📚 טען גופנים נוספים" בסרגל העליון.
   חשוב: אינה משפיעה על ברירות המחדל של העימוד — רק מוסיפה אפשרויות לבוררי הגופנים.
   ========================================================================== */
let _extendedFontsLoaded = false;
async function loadExtendedFonts() {
    if (_extendedFontsLoaded) {
        alert('רשימה 2 של הגופנים כבר נטענה.');
        return;
    }
    const btn = document.getElementById('btn-load-extended-fonts');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ טוען גופנים...';
    }

    try {
        // 1) הזרקת fonts-extended.css
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'fonts-extended.css';
        link.id = 'fonts-extended-stylesheet';
        document.head.appendChild(link);
        await new Promise((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
            setTimeout(resolve, 5000);
        });

        // 2) אכלוס ה-pickers מ-fonts-extended.json
        const res = await fetch('fonts-extended.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const fonts = await res.json();
        if (!Array.isArray(fonts)) throw new Error('פורמט שגוי');

        document.querySelectorAll('.font-picker').forEach(select => {
            const currentVal = select.value;
            let grp = select.querySelector('optgroup[label="גופנים מקומיים — רשימה 2"]');
            if (!grp) {
                grp = document.createElement('optgroup');
                grp.label = 'גופנים מקומיים — רשימה 2';
                select.appendChild(grp);
            }
            fonts.forEach(font => {
                const opt = document.createElement('option');
                opt.value = `'${font.family}', serif`;
                opt.textContent = font.family;
                grp.appendChild(opt);
            });
            select.value = currentVal;
        });

        _extendedFontsLoaded = true;
        if (btn) {
            btn.textContent = `✓ נטענו ${fonts.length} גופנים נוספים`;
        }
        console.log(`✓ רשימה 2: ${fonts.length} גופנים נטענו`);
    } catch (e) {
        console.error('loadExtendedFonts נכשל:', e);
        if (btn) {
            btn.disabled = false;
            btn.textContent = '📚 טען גופנים נוספים';
        }
        alert('טעינת רשימה 2 נכשלה. בדוק את הקונסול לפרטים.');
    }
}
window.loadExtendedFonts = loadExtendedFonts;

/* ==========================================================================
   14ג. ייצוא HTML מרונדר — הוספה מ-v18 (מותאם ל-עדכון_ממשק_9)
   ==========================================================================
   מייצר קובץ HTML עצמאי עם כל ה-CSS, גופני העדיפות מוטמעים כ-base64,
   ומשתני ה-:root שהוצבו על-ידי typesetter.js.
   חשוב: משתמש ב-CSS של המערכת הנוכחית (עדכון_ממשק_9), לא ב-CSS של v18.
   ========================================================================== */
async function exportRenderedHTML() {
    const bookContainer = document.getElementById('book-container');
    if (!bookContainer) {
        alert('אין מסמך מרונדר. הרץ עימוד קודם.');
        return;
    }

    const btn = document.getElementById('btn-export-html');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ מייצא...';
    }

    try {
        // 1) שכפול ה-#preview-pane (שמכיל את #book-container) — כך המבנה
        // ההיררכי נשמר, וה-layout זהה ל-DOM החי.
        const previewPane = document.getElementById('preview-pane');
        const clone = previewPane.cloneNode(true);

        // 2) הסרת event handlers
        clone.querySelectorAll('*').forEach(el => {
            el.removeAttribute('onclick');
        });

        // 3) איסוף CSS — fetch style.css + fonts-def.css + fonts-extended.css (אם נטען)
        const cssFiles = ['style.css', 'fonts-def.css'];
        const extLink = document.getElementById('fonts-extended-stylesheet');
        if (extLink) cssFiles.push('fonts-extended.css');

        const cssContents = [];
        for (const file of cssFiles) {
            try {
                const res = await fetch(file);
                if (res.ok) {
                    const text = await res.text();
                    cssContents.push(`/* === ${file} === */\n${text}`);
                }
            } catch (e) {
                console.warn(`לא ניתן לטעון ${file}:`, e);
            }
        }

        // 3.5) הטמעת גופני העדיפות של עדכון_ממשק_9 כ-base64 — חיוני כדי שה-HTML
        // המיוצא יציג את הגופנים נכון גם בלי תיקיית fonts/ לידו.
        // רשימה זו כוללת את כל הגופנים שבשימוש ברירת המחדל של עדכון_ממשק_9
        // (מתוך fonts-priority.json / fonts-def.css):
        //   - Guttman Rashi (גוף הטקסט)
        //   - AlphaBlack / Alpha / AlphaLight (כותרות 0, 2, 3, 4, 5, סימן)
        //   - FrankReal (מילה ראשונה)
        //   - Hadassah Friedlaender (כותרת 7 / הערות צד)
        //   - Livorna (כותרות עליונות, שערים)
        //   - David Libre / Frank Ruhl Libre / Noto Serif Hebrew (Google fallback)
        // גם גופני Google נטענים דרך @import ב-style.css.
        const PRIORITY_FONT_FILES = [
            'Guttman-Rashi-Normal.woff2',
            'Guttman-Rashi-Bold.woff2',
            'Alpha-Black.woff2',
            'Alpha-Bold.woff2',
            'Alpha-Regular.woff2',
            'Alpha-Light.woff2',
            'FrankReal-Bold.woff2',
            'FrankReal-Regular.woff2',
            'Hadassah-Friedlaender-Regular.woff2',
            'Hadassah-Friedlaender-Bold.woff2',
            'Livorna-Regular.woff2',
            'Livorna-Bold.woff2',
            'Livornabook-Regular.woff2'
        ];
        const embeddedFonts = [];
        for (const fontFile of PRIORITY_FONT_FILES) {
            try {
                const res = await fetch('fonts/' + fontFile);
                if (res.ok) {
                    const blob = await res.blob();
                    const reader = new FileReader();
                    const base64 = await new Promise((resolve, reject) => {
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    embeddedFonts.push({ file: fontFile, base64 });
                }
            } catch (e) {
                console.warn(`לא ניתן להטמיע ${fontFile}:`, e);
            }
        }
        if (embeddedFonts.length > 0) {
            console.log(`exportRenderedHTML: הוטמעו ${embeddedFonts.length} גופנים`);
        }

        // 4) איסוף CSS variables מ-:root (computed) + inline styles שהוצבו ע"י JS
        const rootStyle = getComputedStyle(document.documentElement);
        const cssVars = [];
        const seenProps = new Set();

        // א. אסוף inline styles מ-document.documentElement (הוצבו ע"י JS)
        const rootEl = document.documentElement;
        for (let i = 0; i < rootEl.style.length; i++) {
            const prop = rootEl.style[i];
            if (prop.startsWith('--')) {
                const val = rootEl.style.getPropertyValue(prop).trim();
                if (val) {
                    cssVars.push(`${prop}: ${val};`);
                    seenProps.add(prop);
                }
            }
        }

        // ב. אסוף CSS variables מ-:root rules (רק אלה שלא הוצבו inline)
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText === ':root' && rule.style) {
                        for (let i = 0; i < rule.style.length; i++) {
                            const prop = rule.style[i];
                            if (prop.startsWith('--') && !seenProps.has(prop)) {
                                const val = rootStyle.getPropertyValue(prop).trim();
                                if (val) {
                                    cssVars.push(`${prop}: ${val};`);
                                    seenProps.add(prop);
                                }
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        // 4.5) החלפת src ב-@font-face של גופני העדיפות עם base64
        let cssText = cssContents.join('\n\n');
        for (const { file, base64 } of embeddedFonts) {
            const patterns = [
                `url('fonts/${file}')`,
                `url("fonts/${file}")`,
                `url(fonts/${file})`
            ];
            for (const pat of patterns) {
                cssText = cssText.split(pat).join(`url(${base64})`);
            }
        }

        // 5) בניית HTML עצמאי
        const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מסמך מרונדר — ייצוא</title>
<style>
${cssText}

/* === CSS Variables מהשורש (אחרי ה-CSS כדי לגבור על :root) === */
:root {
    ${cssVars.join('\n    ')}
}

/* === סגנונות ייצוא — מציגים רק את הספר === */
html, body {
    margin: 0;
    padding: 0;
    background: #334155;
    font-family: 'Assistant', sans-serif;
    height: auto !important;
    overflow: visible !important;
}
body {
    padding: 20px 0;
}
#sidebar, #text-pane, #settings-pane, #resizer, #measuring-box {
    display: none !important;
}
#preview-pane {
    display: flex !important;
    position: static !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 20px 0 !important;
    float: none !important;
    width: 100% !important;
    flex: none !important;
    background: #334155 !important;
}
#book-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    will-change: auto !important;
    transition: none !important;
}
.a4-page {
    margin: 0 auto 25px !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
    background: #ffffff !important;
    transform: none !important;
    flex-shrink: 0;
}
@media print {
    .a4-page {
        page-break-after: always;
    }
}
</style>
</head>
<body>
${clone.outerHTML}
<script>
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        document.body.offsetHeight;
    });
}
</script>
</body>
</html>`;

        // 6) הורדה — תיקון שגיאת תחביר שהייתה ב-v18 (Blob(tml] → Blob([html])
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rendered-document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);

        if (btn) {
            btn.textContent = '✓ יוצא';
            setTimeout(() => {
                btn.textContent = '💾 ייצוא HTML';
                btn.disabled = false;
            }, 2000);
        }
        console.log('✓ HTML מרונדר יוצא');
    } catch (e) {
        console.error('exportRenderedHTML נכשל:', e);
        if (btn) {
            btn.textContent = '💾 ייצוא HTML';
            btn.disabled = false;
        }
        alert('ייצוא HTML נכשל: ' + e.message);
    }
}
window.exportRenderedHTML = exportRenderedHTML;

/* ==========================================================================
   14ג2. הדפסה / PDF — מדפיס את תוכן ה-iframe (לא את הדף הראשי)
   ==========================================================================
   בעיה: window.print() על הדף הראשי מדפיס רק את השער (כי התוכן ב-iframe),
   והרקע האפור-כחול (#334155) של ה-iframe מכסה את התוכן.
   פתרון: קוראים ל-iframe.contentWindow.print() כדי להדפיס את ה-iframe בלבד.
   ========================================================================== */
function printRendered() {
    const iframe = document.getElementById('render-frame');
    if (!iframe || !iframe.contentWindow) {
        alert('שגיאה: iframe לא נמצא');
        return;
    }
    try {
        // Wait a tick to ensure fonts/content are ready, then print
        const w = iframe.contentWindow;
        if (w.document.fonts && w.document.fonts.ready) {
            w.document.fonts.ready.then(() => {
                w.focus();
                w.print();
            });
        } else {
            w.focus();
            w.print();
        }
    } catch (e) {
        console.error('printRendered נכשל:', e);
        alert('הדפסה נכשלה: ' + e.message);
    }
}
window.printRendered = printRendered;

/* ==========================================================================
   14ד. מערכת טאבים לסרגל הצידי — הוספה מ-v18
   ==========================================================================
   3 טאבים: עורך | הגדרות | בדיקה
   - עורך: אזור הטקסט המקורי (text-pane)
   - הגדרות: לוח ההגדרות (settings-pane) — במקום collapse-strip
   - בדיקה: כרטיסייה חדשה עם כפתורי בדיקה + דוח עימוד
   חשוב: אינה משנה את מנוע העימוד — רק מארגן מחדש את ה-UI.
   ========================================================================== */
function initTabSystem() {
    if (document.getElementById('tab-bar')) return;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const textPane = document.getElementById('text-pane');
    const settingsPane = document.getElementById('settings-pane');
    if (!textPane || !settingsPane) return;

    // 1. הסר את ה-collapse-strip של settings-pane (אם קיים)
    const collapseStrip = settingsPane.querySelector('.collapse-strip');
    if (collapseStrip) collapseStrip.remove();

    // 2. הגדל את text-pane ו-settings-pane לרוחב מלא
    textPane.style.width = '100%';
    textPane.style.borderLeft = 'none';
    textPane.style.flexShrink = '1';
    textPane.style.height = '100%';
    settingsPane.style.display = 'none';
    settingsPane.classList.remove('collapsed');
    settingsPane.style.width = '100%';
    settingsPane.style.height = '100%';
    settingsPane.style.borderLeft = 'none';
    settingsPane.style.flexShrink = '1';
    settingsPane.style.flexDirection = 'column';

    // 3. הוסף דרופדאון סגנונות + ייבוא/ייצוא לטאב ההגדרות (אם קיים)
    if (typeof initStyleSetDropdown === 'function') initStyleSetDropdown();

    // 4. צור טאב בדיקה
    const debugPane = document.createElement('div');
    debugPane.id = 'tab-debug';
    debugPane.style.cssText = 'display:none;flex:1;flex-direction:column;overflow-y:auto;padding:8px;background:#f8fafc;';
    debugPane.innerHTML = `
        <div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">
            <button id="btn-seeded" class="btn-tool btn-secondary" style="flex:1;" title="טקסט קבוע">📋 מסמך קבוע</button>
            <button id="btn-random" class="btn-tool btn-secondary" style="flex:1;" title="טקסט רנדומלי">🎲 מסמך רנדומלי</button>
            <button id="btn-report-window" class="btn-tool btn-secondary" style="flex:1;" title="דוח עימוד בחלון נפרד">📊 דוח עימוד</button>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">
            <button id="btn-retypeset-debug" class="btn-tool btn-primary" style="flex:1;" title="עדכן ועמד מחדש">⚡ עדכן ועמד מחדש</button>
            <button id="btn-import-debug" class="btn-tool btn-import" style="flex:1;" title="ייבוא טקסט">📄 ייבוא טקסט</button>
            <input type="file" id="file-import-debug" accept=".txt,.text,.md" style="display:none;">
        </div>
        <div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">
            <button id="btn-refresh-debug" class="btn-tool btn-secondary" style="flex:0.5;" title="רענן דוח">🔄 רענן</button>
            <button id="btn-export-marked" class="btn-tool btn-primary" style="flex:1;" title="ייצא HTML ממורקר">💾 ייצוא HTML ממורקר</button>
            <button id="btn-toggle-trace" class="btn-tool btn-secondary" style="flex:1;" title="מעקב אחרי קריאות פונקציות">🔍 מעקב פונקציות</button>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">
            <button id="btn-fn-audit" class="btn-tool btn-secondary" style="flex:1;" title="השוואת תחזית מדידת הערות מול גובה אמיתי">📏 בדיקת מדידת הערות</button>
            <button id="btn-fn-audit-clear" class="btn-tool btn-secondary" style="flex:0.7;" title="נקה לוג מדידה">🧹 נקה לוג</button>
        </div>
        <div id="fn-audit-results" style="margin-bottom:8px;display:none;"></div>
        <div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">
            <button id="btn-geom-paint" class="btn-tool btn-primary" style="flex:1;" title="הצג קווי גבול גיאומטריים על העמודים">📐 גיאומטריה</button>
            <button id="btn-geom-clear" class="btn-tool btn-secondary" style="flex:0.5;" title="נקה overlay">✖ נקה</button>
            <button id="btn-geom-export" class="btn-tool btn-secondary" style="flex:0.7;" title="ייצא פירוט מלא כ-JSON">📋 פירוט מלא</button>
            <select id="geom-level" style="flex:0.7;padding:4px;font-size:9pt;border:1px solid #cbd5e1;border-radius:3px;background:#fff;" title="רמת פירוט">
                <option value="0">רק בעיות</option>
                <option value="1" selected>בלוקים</option>
                <option value="2">פסקאות</option>
                <option value="3">שורות</option>
                <option value="4">מילים</option>
                <option value="5">רווחים</option>
            </select>
        </div>
        <div id="geom-results" style="margin-bottom:8px;display:none;"></div>
        <div id="debug-report-view">
            <div id="debug-summary"></div>
            <div id="debug-blocks-table" style="margin-top:12px;"></div>
            <div id="debug-issues-list" style="margin-top:12px;"></div>
        </div>
        <div id="trace-view" style="display:none;flex-direction:column;"></div>
    `;
    sidebar.appendChild(debugPane);

    // 5. צור שורת טאבים
    const tabBar = document.createElement('div');
    tabBar.id = 'tab-bar';
    tabBar.style.cssText = 'display:flex;flex-direction:row;background:#1e293b;flex-shrink:0;border-bottom:2px solid #334155;';
    tabBar.innerHTML = `
        <button class="tab-btn" data-tab="text-pane" style="flex:1;padding:8px 4px;border:none;background:#334155;color:#e2e8f0;cursor:pointer;font-size:9pt;font-family:inherit;">✍️ עורך</button>
        <button class="tab-btn" data-tab="settings-pane" style="flex:1;padding:8px 4px;border:none;background:#1e293b;color:#94a3b8;cursor:pointer;font-size:9pt;font-family:inherit;">⚙️ הגדרות</button>
        <button class="tab-btn" data-tab="tab-debug" style="flex:1;padding:8px 4px;border:none;background:#1e293b;color:#94a3b8;cursor:pointer;font-size:9pt;font-family:inherit;">🔬 בדיקה</button>
    `;
    sidebar.insertBefore(tabBar, sidebar.firstChild);

    // 6. הגדר את ה-sidebar כ-flex column
    sidebar.style.flexDirection = 'column';
    sidebar.style.width = '440px';

    // 7. טפל בלחיצות טאב
    tabBar.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { switchTab(this.dataset.tab); });
    });

    // 8. הגדר כפתורי בדיקה (אם הפונקציות קיימות)
    const btnSeeded = document.getElementById('btn-seeded');
    if (btnSeeded && typeof generateTestTextSeeded === 'function') {
        btnSeeded.addEventListener('click', function() {
            const txt = generateTestTextSeeded();
            if (editorElem) {
                editorElem.value = txt;
                typesetDocument();
                switchTab('tab-debug');
            }
        });
    }
    const btnRandom = document.getElementById('btn-random');
    if (btnRandom && typeof generateTestText === 'function') {
        btnRandom.addEventListener('click', function() {
            const txt = generateTestText();
            if (editorElem) {
                editorElem.value = txt;
                typesetDocument();
                switchTab('tab-debug');
            }
        });
    }
    const btnReport = document.getElementById('btn-report-window');
    if (btnReport && typeof generateLayoutReport === 'function') {
        btnReport.addEventListener('click', function() { generateLayoutReport(); });
    }
    const btnRetypesetDbg = document.getElementById('btn-retypeset-debug');
    if (btnRetypesetDbg) {
        btnRetypesetDbg.addEventListener('click', function() { typesetDocument(); });
    }
    const btnRefreshDbg = document.getElementById('btn-refresh-debug');
    if (btnRefreshDbg && typeof refreshDebugReport === 'function') {
        btnRefreshDbg.addEventListener('click', function() { refreshDebugReport(); });
    }
    const btnExportMarked = document.getElementById('btn-export-marked');
    if (btnExportMarked && typeof exportMarkedHTML === 'function') {
        btnExportMarked.addEventListener('click', function() { exportMarkedHTML(); });
    }
    const btnToggleTrace = document.getElementById('btn-toggle-trace');
    if (btnToggleTrace && typeof toggleTraceView === 'function') {
        btnToggleTrace.addEventListener('click', function() { toggleTraceView(); });
    }
    // [חדש — מהימנות מדידה] כפתורי בדיקת מדידת הערות
    const btnFnAudit = document.getElementById('btn-fn-audit');
    if (btnFnAudit) {
        btnFnAudit.addEventListener('click', async function() {
            const resultsDiv = document.getElementById('fn-audit-results');
            if (!resultsDiv) return;
            btnFnAudit.disabled = true;
            btnFnAudit.textContent = '⏳ מודד...';
            try {
                const result = await requestFnAudit();
                if (result.error) {
                    resultsDiv.style.display = 'block';
                    resultsDiv.innerHTML = '<div style="color:#dc2626;padding:6px;font-size:9pt;">✗ שגיאה: ' + result.error + '</div>';
                } else {
                    renderFnAuditResults(resultsDiv, result);
                }
            } finally {
                btnFnAudit.disabled = false;
                btnFnAudit.textContent = '📏 בדיקת מדידת הערות';
            }
        });
    }
    const btnFnAuditClear = document.getElementById('btn-fn-audit-clear');
    if (btnFnAuditClear) {
        btnFnAuditClear.addEventListener('click', function() {
            clearFnMeasureLog();
            const resultsDiv = document.getElementById('fn-audit-results');
            if (resultsDiv) {
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
            }
        });
    }
    // [חדש — גיאומטריה] כפתורי overlay גיאומטרי
    const btnGeomPaint = document.getElementById('btn-geom-paint');
    if (btnGeomPaint) {
        btnGeomPaint.addEventListener('click', async function() {
            const resultsDiv = document.getElementById('geom-results');
            const levelSel = document.getElementById('geom-level');
            const level = levelSel ? parseInt(levelSel.value, 10) : 1;
            btnGeomPaint.disabled = true;
            btnGeomPaint.textContent = '⏳ מחשב...';
            try {
                const result = await requestGeomAudit({ paint: true, level: level, labels: true });
                if (result.error) {
                    if (resultsDiv) {
                        resultsDiv.style.display = 'block';
                        resultsDiv.innerHTML = '<div style="color:#dc2626;padding:6px;font-size:9pt;">✗ ' + result.error + '</div>';
                    }
                } else {
                    renderGeomResults(resultsDiv, result);
                }
            } finally {
                btnGeomPaint.disabled = false;
                btnGeomPaint.textContent = '📐 גיאומטריה';
            }
        });
    }
    const btnGeomClear = document.getElementById('btn-geom-clear');
    if (btnGeomClear) {
        btnGeomClear.addEventListener('click', function() {
            clearGeomOverlay();
            const resultsDiv = document.getElementById('geom-results');
            if (resultsDiv) {
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
            }
        });
    }
    // [חדש] כפתור "פירוט מלא" — ייצוא JSON עם כל העץ כולל מילים/רווחים
    const btnGeomExport = document.getElementById('btn-geom-export');
    if (btnGeomExport) {
        btnGeomExport.addEventListener('click', async function() {
            btnGeomExport.disabled = true;
            btnGeomExport.textContent = '⏳ מייצא...';
            try {
                const result = await requestGeomExport();
                if (result.error) {
                    alert('שגיאה: ' + result.error);
                } else {
                    // ייצוא כקובץ JSON
                    const blob = new Blob([JSON.stringify(result.model, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                    a.download = `geometry-${ts}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 5000);
                    // הצג סיכום
                    const resultsDiv = document.getElementById('geom-results');
                    if (resultsDiv) {
                        resultsDiv.style.display = 'block';
                        renderGeomBreakdown(resultsDiv, result);
                    }
                }
            } finally {
                btnGeomExport.disabled = false;
                btnGeomExport.textContent = '📋 פירוט מלא';
            }
        });
    }
    // עדכן overlay אוטומטית כשמשנים רמת פירוט
    const levelSel = document.getElementById('geom-level');
    if (levelSel) {
        levelSel.addEventListener('change', function() {
            // רק אם יש overlay פעיל — צייר מחדש
            const frame = document.getElementById('render-frame');
            if (frame && frame.contentWindow && frame.contentWindow.document.querySelector('[data-geom-overlay]')) {
                btnGeomPaint?.click();
            }
        });
    }
    const btnImportDbg = document.getElementById('btn-import-debug');
    const fileImportDbg = document.getElementById('file-import-debug');
    if (btnImportDbg && fileImportDbg) {
        btnImportDbg.addEventListener('click', function() { fileImportDbg.click(); });
        fileImportDbg.addEventListener('change', function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                if (editorElem) {
                    editorElem.value = ev.target.result;
                    typesetDocument();
                    switchTab('tab-debug');
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    // 9. בחירת טאב ברירת מחדל
    switchTab('text-pane');

    // 10. הסר את ה-class 'tabs-not-ready'
    document.body.classList.remove('tabs-not-ready');
}
window.initTabSystem = initTabSystem;

function switchTab(tabId) {
    const tabBar = document.getElementById('tab-bar');
    if (!tabBar) return;
    tabBar.querySelectorAll('.tab-btn').forEach(function(btn) {
        const isActive = btn.dataset.tab === tabId;
        btn.style.background = isActive ? '#334155' : '#1e293b';
        btn.style.color = isActive ? '#e2e8f0' : '#94a3b8';
    });
    ['text-pane', 'settings-pane', 'tab-debug'].forEach(function(id) {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === 'text-pane' || id === 'tab-debug') {
            el.style.display = (id === tabId) ? 'flex' : 'none';
        } else if (id === 'settings-pane') {
            el.style.display = (id === tabId) ? 'flex' : 'none';
        }
    });
}
window.switchTab = switchTab;

/* ==========================================================================
   14ה. גשר תקשורת עם iframe המרנדר (רק בדף הראשי, לא ב-iframe)
   ========================================================================== */
if (!window.__isRenderer) {
let __renderFrame = null;
let __renderReady = false;
let __pendingTypeset = null;

function getRenderFrame() {
    if (!__renderFrame) __renderFrame = document.getElementById('render-frame');
    return __renderFrame;
}

// אסוף את כל ערכי ההגדרות מהדף הראשי
function collectAllSettingsForRenderer() {
    const settings = {};
    document.querySelectorAll('#settings-pane [id], #text-pane [id]').forEach(el => {
        if (!el.id || el.tagName === 'BUTTON' || el.type === 'file' || el.type === 'hidden') return;
        if (el.id.startsWith('vp-') || el.id.startsWith('file-') || el.id === 'assets-folder-input') return;
        if (el.type === 'checkbox') {
            settings[el.id] = el.checked;
        } else if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            settings[el.id] = el.value;
        }
    });
    // גם data- attributes
    ['data-cbg-regular-img','data-cbg-h0Open-img','data-cbg-h2Open-img','data-hdr-c-img','data-sec-div-img',
     'data-builder-main-svg','data-builder-back-svg','data-builder-sub-svg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) settings[id] = el.value;
    });
    // builder dimensions
    ['builder-main-top','builder-main-bottom','builder-main-right','builder-main-left',
     'builder-back-top','builder-back-bottom','builder-back-right','builder-back-left',
     'builder-sub-top','builder-sub-bottom','builder-sub-right','builder-sub-left',
     'builder-theme-name'].forEach(id => {
        const el = document.getElementById(id);
        if (el) settings[id] = el.value;
    });
    // [חדש] תיבות סימון של תוכן עניינים (gtoc-show, gtoc-grp, dtoc-show, dtoc-grp)
    // אלו checkboxים שמשתמשים ב-class + value במקום ב-ID, ולכן לא נאספים למעלה.
    // אוספים אותם כמערכים מופרדים בפסיקים: "1,2,3" = כותרות 1,2,3 מסומנות.
    ['gtoc-show', 'gtoc-grp', 'dtoc-show', 'dtoc-grp'].forEach(cls => {
        const checked = Array.from(document.querySelectorAll('.' + cls + ':checked')).map(cb => cb.value);
        settings[cls + 's'] = checked.join(',');
    });
    return settings;
}

// שלח עימוד ל-iframe
function sendTypesetToRenderer() {
    const frame = getRenderFrame();
    if (!frame || !frame.contentWindow) return false;
    if (!__renderReady) {
        // iframe עדיין לא מוכן — שמור בצד
        __pendingTypeset = true;
        return false;
    }
    const text = document.getElementById('raw-input')?.value || '';
    const settings = collectAllSettingsForRenderer();
    frame.contentWindow.postMessage({
        type: 'typeset',
        text: text,
        settings: settings
    }, '*');
    return true;
}

// האזנה להודעות מה-iframe (רק בדף הראשי, לא ב-iframe)
window.addEventListener('message', function(e) {
    const msg = e.data;
    if (!msg || !msg.type) return;
    if (msg.type === 'renderer-ready') {
        __renderReady = true;
        if (__pendingTypeset) {
            __pendingTypeset = false;
            sendTypesetToRenderer();
        }
    } else if (msg.type === 'render-done') {
        console.log('✓ עימוד הושלם:', msg.pageCount, 'עמודים');
    } else if (msg.type === 'render-error') {
        console.error('✗ שגיאת עימוד:', msg.error);
    } else if (msg.type === 'fn-audit-result') {
        // [חדש — מהימנות מדידה] הצגת תוצאות audit
        if (typeof window.__fnAuditPending === 'function') {
            window.__fnAuditPending(msg);
            window.__fnAuditPending = null;
        } else {
            window.__fnAuditLastResult = msg;
            console.log('📊 fn-audit התקבל:', msg);
        }
    } else if (msg.type === 'fn-audit-error') {
        console.error('✗ fn-audit שגיאה:', msg.error);
        if (typeof window.__fnAuditPending === 'function') {
            window.__fnAuditPending({ error: msg.error });
            window.__fnAuditPending = null;
        }
    } else if (msg.type === 'fn-audit-log-cleared') {
        console.log('🧹 לוג מדידה נוקה');
    } else if (msg.type === 'geom-audit-result' || msg.type === 'geom-paint-done') {
        // [חדש — גיאומטריה] תוצאת בודק גיאומטרי
        if (typeof window.__geomAuditPending === 'function') {
            window.__geomAuditPending(msg);
            window.__geomAuditPending = null;
        } else {
            window.__geomAuditLastResult = msg;
            console.log('📐 geom-audit התקבל:', msg);
        }
    } else if (msg.type === 'geom-export-result') {
        // [חדש — גיאומטריה] תוצאת ייצוא פירוט מלא
        if (typeof window.__geomExportPending === 'function') {
            window.__geomExportPending(msg);
            window.__geomExportPending = null;
        } else {
            window.__geomExportLastResult = msg;
            console.log('📋 geom-export התקבל');
        }
    } else if (msg.type === 'geom-clear-done') {
        console.log('🧹 overlay גיאומטרי נוקה');
    } else if (msg.type === 'geom-error') {
        console.error('✗ geom שגיאה:', msg.error, msg.stack);
        if (typeof window.__geomAuditPending === 'function') {
            window.__geomAuditPending({ error: msg.error });
            window.__geomAuditPending = null;
        }
    }
});

// [חדש — מהימנות מדידה] בקשת audit מה-iframe
function requestFnAudit() {
    return new Promise((resolve) => {
        const frame = document.getElementById('render-frame');
        if (!frame || !frame.contentWindow) { resolve({ error: 'no iframe' }); return; }
        window.__fnAuditPending = resolve;
        frame.contentWindow.postMessage({ type: 'fn-audit' }, '*');
        // timeout 5s
        setTimeout(() => {
            if (window.__fnAuditPending) {
                window.__fnAuditPending({ error: 'timeout' });
                window.__fnAuditPending = null;
            }
        }, 5000);
    });
}

// [חדש — מהימנות מדידה] ניקוי לוג מדידה
function clearFnMeasureLog() {
    const frame = document.getElementById('render-frame');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'fn-audit-clear-log' }, '*');
}

window.requestFnAudit = requestFnAudit;
window.clearFnMeasureLog = clearFnMeasureLog;

// [חדש — גיאומטריה] בקשת audit גיאומטרי מה-iframe
function requestGeomAudit(opts) {
    return new Promise((resolve) => {
        const frame = document.getElementById('render-frame');
        if (!frame || !frame.contentWindow) { resolve({ error: 'no iframe' }); return; }
        window.__geomAuditPending = resolve;
        frame.contentWindow.postMessage({ type: 'geom-audit', opts: opts || {} }, '*');
        setTimeout(() => {
            if (window.__geomAuditPending) {
                window.__geomAuditPending({ error: 'timeout' });
                window.__geomAuditPending = null;
            }
        }, 10000);
    });
}

// [חדש — גיאומטריה] ניקוי overlay
function clearGeomOverlay() {
    const frame = document.getElementById('render-frame');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'geom-clear' }, '*');
}

// [חדש — גיאומטריה] ייצוא פירוט מלא כ-JSON
function requestGeomExport() {
    return new Promise((resolve) => {
        const frame = document.getElementById('render-frame');
        if (!frame || !frame.contentWindow) { resolve({ error: 'no iframe' }); return; }
        window.__geomExportPending = resolve;
        frame.contentWindow.postMessage({ type: 'geom-export' }, '*');
        setTimeout(() => {
            if (window.__geomExportPending) {
                window.__geomExportPending({ error: 'timeout' });
                window.__geomExportPending = null;
            }
        }, 30000);
    });
}

window.requestGeomAudit = requestGeomAudit;
window.clearGeomOverlay = clearGeomOverlay;
window.requestGeomExport = requestGeomExport;

/* [חדש — גיאומטריה] מציג סיכום מקוצר של פירוט מלא */
function renderGeomBreakdown(container, result) {
    if (!container) return;
    container.style.display = 'block';
    const model = result.model || {};
    const pages = model.pages || [];
    const audit = result.audit || { summary: { total: 0 } };

    // ספירת רכיבים כולל מילים ורווחים
    let totalColumns = 0, totalParagraphs = 0, totalLines = 0, totalWords = 0, totalSpaces = 0;
    function countRec(node) {
        if (node.type === 'column') totalColumns++;
        if (node.type === 'p' || node.type === 'p-cut' || node.type === 'p-end') totalParagraphs++;
        if (node.lines) totalLines += node.lines.length;
        if (node.words) {
            totalWords += node.words.filter(w => w.type === 'word').length;
            totalSpaces += node.words.filter(w => w.type === 'space').length;
        }
        if (node.children) node.children.forEach(countRec);
    }
    pages.forEach(p => p.children.forEach(countRec));

    let html = '<div style="padding:8px;background:#1e293b;color:#e2e8f0;border-radius:4px;font-size:9pt;font-weight:bold;">';
    html += '📋 פירוט גיאומטרי מלא — ';
    html += `${pages.length} עמודים · ${totalColumns} טורים · ${totalParagraphs} פסקאות<br>`;
    html += `<span style="font-size:8pt;font-weight:normal;color:#94a3b8;">`;
    html += `${totalLines} שורות · ${totalWords} מילים · ${totalSpaces} רווחים · ${audit.summary.total} בעיות`;
    html += `</span></div>`;

    html += '<div style="padding:6px;font-size:8pt;color:#475569;background:#f1f5f9;border-radius:0 0 4px 4px;">';
    html += '<b>קובץ JSON הורד בהצלחה.</b> הקובץ מכיל את העץ המלא: page → column → paragraph → line + words[] + spaces[]. ';
    html += 'כל רכיב כולל קואורדינטות מוחלטות (x, y, w, h, right, bottom). ';
    html += 'ניתן לפתוח בעורך JSON ולחפש בעיות ספציפיות.';
    html += '</div>';

    // טבלת סיכום לעמודים
    html += '<details style="margin-top:8px;"><summary style="cursor:pointer;padding:4px;background:#e2e8f0;font-size:9pt;font-weight:bold;border-radius:4px;">סיכום לעמוד</summary>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:7pt;background:#fff;margin-top:4px;">';
    html += '<thead><tr style="background:#e2e8f0;">'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">עמוד</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">טורים</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">פסקאות</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">שורות</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">מילים</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">רווחים</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">בעיות</th>'
        + '</tr></thead><tbody>';
    pages.forEach(p => {
        let pCols = 0, pParas = 0, pLines = 0, pWords = 0, pSpaces = 0;
        function countP(node) {
            if (node.type === 'column') pCols++;
            if (node.type === 'p' || node.type === 'p-cut' || node.type === 'p-end') pParas++;
            if (node.lines) pLines += node.lines.length;
            if (node.words) {
                pWords += node.words.filter(w => w.type === 'word').length;
                pSpaces += node.words.filter(w => w.type === 'space').length;
            }
            if (node.children) node.children.forEach(countP);
        }
        p.children.forEach(countP);
        const issueCount = p._issues ? p._issues.length : 0;
        html += `<tr style="border:1px solid #cbd5e1;">`
            + `<td style="padding:2px;text-align:center;font-weight:bold;">${p.label}</td>`
            + `<td style="padding:2px;text-align:center;">${pCols}</td>`
            + `<td style="padding:2px;text-align:center;">${pParas}</td>`
            + `<td style="padding:2px;text-align:center;">${pLines}</td>`
            + `<td style="padding:2px;text-align:center;">${pWords}</td>`
            + `<td style="padding:2px;text-align:center;">${pSpaces}</td>`
            + `<td style="padding:2px;text-align:center;color:${issueCount > 0 ? '#dc2626' : '#059669'};">${issueCount}</td>`
            + `</tr>`;
    });
    html += '</tbody></table></details>';

    container.innerHTML = html;
}

window.renderGeomBreakdown = renderGeomBreakdown;

/* [חדש — גיאומטריה] מציג את תוצאות ה-bug הגיאומטרי */
function renderGeomResults(container, result) {
    if (!container) return;
    container.style.display = 'block';
    const summary = result.summary || { total: 0, high: 0, medium: 0, low: 0, byKind: {} };
    const issues = result.issues || [];
    const stats = result.stats || {};

    let html = '<div style="padding:8px;background:#1e293b;color:#e2e8f0;border-radius:4px 4px 0 0;font-size:9pt;font-weight:bold;">';
    html += '📐 בודק גיאומטריה — ';
    html += `${stats.pageCount || 0} עמודים · ${summary.total} בעיות`;
    if (summary.total > 0) {
        const parts = [];
        if (summary.high > 0) parts.push(`<span style="color:#fca5a5;">${summary.high} קריטיות</span>`);
        if (summary.medium > 0) parts.push(`<span style="color:#fcd34d;">${summary.medium} בינוניות</span>`);
        if (summary.low > 0) parts.push(`<span style="color:#86efac;">${summary.low} קלות</span>`);
        html += ' · ' + parts.join(' · ');
    } else {
        html += ' · <span style="color:#86efac;">✓ אין בעיות!</span>';
    }
    if (summary.byKind && Object.keys(summary.byKind).length > 0) {
        const kindNames = {
            'containment': 'חריגת הכלה',
            'overlap': 'חפיפה',
            'imbalance': 'אי-איזון טורים',
            'widow': 'אלמנה',
            'orphan': 'יתום',
            'sparse-line': 'שורה דלילה',
            'fn-overflow': 'גלישה להערות',
            'pn-overflow': 'גלישה למספר עמוד',
            'page-overflow': 'גלישת עמוד'
        };
        html += '<br><span style="font-size:7pt;font-weight:normal;color:#94a3b8;">';
        html += Object.entries(summary.byKind).map(([k, v]) => `${kindNames[k] || k}: ${v}`).join(' · ');
        html += '</span>';
    }
    html += '</div>';

    if (issues.length > 0) {
        html += '<table style="width:100%;border-collapse:collapse;font-size:7pt;background:#fff;">';
        html += '<thead><tr style="background:#e2e8f0;">'
            + '<th style="padding:3px;border:1px solid #cbd5e1;">עמוד</th>'
            + '<th style="padding:3px;border:1px solid #cbd5e1;">סוג</th>'
            + '<th style="padding:3px;border:1px solid #cbd5e1;">חומרה</th>'
            + '<th style="padding:3px;border:1px solid #cbd5e1;">פירוט</th>'
            + '</tr></thead><tbody>';
        issues.slice(0, 200).forEach((iss, i) => {
            const sc = iss.severity === 'high' ? '#dc2626' : (iss.severity === 'medium' ? '#d97706' : '#64748b');
            const kindNames = {
                'containment': 'חריגת הכלה', 'overlap': 'חפיפה', 'imbalance': 'אי-איזון',
                'widow': 'אלמנה', 'orphan': 'יתום', 'sparse-line': 'שורה דלילה',
                'containment-rounding': 'עיגול פיקסלים',
                'fn-overflow': 'גוף→הערות', 'pn-overflow': 'גוף→מספר', 'page-overflow': 'גלישת עמוד',
                'fn-page-overflow': 'הערות→תחתית', 'fn-pn-overflow': 'הערות→מספר',
                'fn-containment': 'הכלה בהערות', 'fn-line-overflow': 'שורת הערה'
            };
            const pageIdx = iss.pageIdx !== undefined ? iss.pageIdx : -1;
            const clickable = pageIdx >= 0 ? `cursor:pointer;` : '';
            const title = pageIdx >= 0 ? ` title="לחץ לגלילה לעמוד ${pageIdx + 1} והבהוב הבעיה"` : '';
            // העבר את ה-issue המלא כדי שה-iframe יוכל להבהב את המסגרת
            // נשמור את ה-issue ב-data attribute כדי להימנע מ-escaping issues
            const issueJson = pageIdx >= 0 ? `data-issue-idx="${i}"` : '';
            const onclick = pageIdx >= 0 ? ` onclick="scrollToIssuePage(${pageIdx}, ${i})"` : '';
            const hover = pageIdx >= 0 ? ` onmouseover="this.style.background=\'#fef3c7\'" onmouseout="this.style.background=\'#fff\'"` : '';
            html += `<tr style="border:1px solid #cbd5e1;${clickable}"${title}${issueJson}${onclick}${hover}>`
                + `<td style="padding:2px;text-align:center;font-weight:bold;">${pageIdx >= 0 ? pageIdx + 1 : '?'}</td>`
                + `<td style="padding:2px;">${kindNames[iss.kind] || iss.kind}</td>`
                + `<td style="padding:2px;color:${sc};">${iss.severity}</td>`
                + `<td style="padding:2px;">${iss.message || ''}</td>`
                + `</tr>`;
        });
        html += '</tbody></table>';
    }

    // [תיקון חשוב] שמור את ה-issues ישירות ב-window — לא דרך <script> ב-innerHTML
    // (scripts ב-innerHTML לא מורצים על ידי דפדפנים)
    window.__lastGeomIssues = issues.slice(0, 200);

    // מקרא צבעים
    html += '<div style="padding:6px;font-size:7pt;color:#475569;background:#f1f5f9;border-radius:0 0 4px 4px;">';
    html += '<b>מקרא צבעים:</b> ';
    html += '<span style="color:#1e40af;">■</span> עמוד · ';
    html += '<span style="color:#dc2626;">■</span> אזור הערות · ';
    html += '<span style="color:#059669;">■</span> בלוק/טור · ';
    html += '<span style="color:#0ea5e9;">■</span> p-cut · ';
    html += '<span style="color:#0891b2;">■</span> p-end · ';
    html += '<span style="color:#f59e0b;">■</span> כותרות · ';
    html += '<span style="color:#7c3aed;">■</span> H3-H7 · ';
    html += '<b style="color:#dc2626;">אדום עבה = בעיה</b><br>';
    html += '<b>לחץ על שורת בעיה</b> כדי לגלול לעמוד המתאים בתצוגה';
    html += '</div>';

    container.innerHTML = html;
}

/* [חדש] גולל לעמוד הבעיה ב-iframe ומבהב את המסגרת */
function scrollToIssuePage(pageIdx, issueIdx) {
    const frame = document.getElementById('render-frame');
    if (!frame || !frame.contentWindow) return;
    // קבל את ה-issue מהמערך השמור
    let issue = null;
    if (issueIdx !== undefined && window.__lastGeomIssues && window.__lastGeomIssues[issueIdx]) {
        issue = window.__lastGeomIssues[issueIdx];
    }
    // שלח הודעה ל-iframe לגלול לעמוד ולהבהב את הבעיה
    frame.contentWindow.postMessage({ type: 'geom-scroll-to-page', pageIdx: pageIdx, issue: issue }, '*');
}

window.scrollToIssuePage = scrollToIssuePage;

window.renderGeomResults = renderGeomResults;

/* [חדש — מהימנות מדידה] מציג את תוצאות ה-audit בצורה טבלאית.
   מציג לכל עמוד עם הערות: מספר העמוד, מספרי ההערות, תחזית מדידה, גובה אמיתי, פער. */
function renderFnAuditResults(container, result) {
    container.style.display = 'block';
    const audit = result.audit || [];
    const logSize = result.logSize || 0;

    if (audit.length === 0) {
        container.innerHTML = '<div style="padding:8px;background:#e2e8f0;border:1px solid #cbd5e1;border-radius:4px;font-size:9pt;color:#475569;">'
            + 'ℹ️ לא נמצאו אזורי הערות בעמודים שרונדרו.<br>'
            + 'סה"כ רשומות בלוג המדידה: <b>' + logSize + '</b><br>'
            + '<span style="color:#64748b;">ייתכן שהמסמך לא מכיל הערות שוליים, או שהמדידה עדיין לא רצה.</span>'
            + '</div>';
        return;
    }

    // סיכום: כמה עמודים עם פער משמעותי (|diff| > 3)
    const significant = audit.filter(r => r.diff !== null && Math.abs(r.diff) > 3);
    const maxDiff = audit.reduce((m, r) => r.diff !== null ? Math.max(m, Math.abs(r.diff)) : m, 0);

    let html = '<div style="padding:8px;background:#1e293b;color:#e2e8f0;border-radius:4px 4px 0 0;font-size:9pt;font-weight:bold;">'
        + '📊 בדיקת מהימנות מדידת הערות — '
        + audit.length + ' עמודים עם הערות'
        + (significant.length > 0 ? ' · <span style="color:#fca5a5;">' + significant.length + ' עם פער &gt; 3px</span>' : ' · <span style="color:#86efac;">✓ כל הפערים קטנים</span>')
        + ' · פער מקסימלי: ' + maxDiff + 'px'
        + ' · רשומות לוג: ' + logSize
        + '</div>';

    html += '<table style="width:100%;border-collapse:collapse;font-size:7pt;background:#fff;">'
        + '<thead><tr style="background:#e2e8f0;">'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">עמוד</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">מס׳ הערות</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">תחזית</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">scrollH</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">offsetH</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">אמיתי</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">realScroll</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">realOffset</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">פער</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">host</th>'
        + '<th style="padding:3px;border:1px solid #cbd5e1;">רוחב</th>'
        + '</tr></thead><tbody>';

    audit.forEach(r => {
        const diffColor = r.diff === null ? '#64748b' : (Math.abs(r.diff) <= 1 ? '#059669' : (Math.abs(r.diff) <= 3 ? '#d97706' : '#dc2626'));
        const diffText = r.diff === null ? '—' : (r.diff > 0 ? '+' : '') + r.diff;
        const host = r.measuredAttachedToBody === null ? '—' : (r.measuredAttachedToBody ? 'body' : 'wrapper');
        const numbersStr = (r.numbers || []).slice(0, 8).join(',') + ((r.numbers || []).length > 8 ? '...' : '');
        html += '<tr style="border:1px solid #cbd5e1;">'
            + '<td style="padding:2px;text-align:center;font-weight:bold;">' + r.pageLabel + '</td>'
            + '<td style="padding:2px;font-size:6pt;">' + numbersStr + '</td>'
            + '<td style="padding:2px;text-align:center;">' + (r.measured !== null ? r.measured : '?') + '</td>'
            + '<td style="padding:2px;text-align:center;color:#64748b;">' + (r.measuredScrollH !== null ? r.measuredScrollH : '?') + '</td>'
            + '<td style="padding:2px;text-align:center;color:#64748b;">' + (r.measuredOffsetH !== null ? r.measuredOffsetH : '?') + '</td>'
            + '<td style="padding:2px;text-align:center;font-weight:bold;">' + r.realH + '</td>'
            + '<td style="padding:2px;text-align:center;color:#64748b;">' + r.realScroll + '</td>'
            + '<td style="padding:2px;text-align:center;color:#64748b;">' + r.realOffset + '</td>'
            + '<td style="padding:2px;text-align:center;color:' + diffColor + ';font-weight:bold;">' + diffText + '</td>'
            + '<td style="padding:2px;text-align:center;font-size:6pt;">' + host + '</td>'
            + '<td style="padding:2px;text-align:center;font-size:6pt;">' + Math.round(r.realWidth) + '</td>'
            + '</tr>';
    });
    html += '</tbody></table>';

    // הסבר
    html += '<div style="padding:6px;font-size:7pt;color:#64748b;background:#f1f5f9;border-radius:0 0 4px 4px;">'
        + '<b>מקרא:</b> פער = אמיתי − תחזית. '
        + 'פער חיובי = המדידה חזתה פחות מדי → גלישה אפשרית. '
        + 'פער שלילי = המדידה חזתה יותר מדי → בזבוז מקום. '
        + '<b>host</b> = היכן ה-probe חובר (wrapper = אמיתי, body = נפילה לברירת מחדל).'
        + '</div>';

    container.innerHTML = html;
}

window.renderFnAuditResults = renderFnAuditResults;
} // end if (!window.__isRenderer)


/* ==========================================================================
   15. אירוע טעינת הדף הראשי (Window Onload)
   ========================================================================== */
window.onload = async function() {
    // במצב renderer (iframe) — טען נכסי JSON (עיטורים, שערים) אבל דלג על אתחול UI.
    // [תיקון חשוב] קודם, ה-iframe חזר מיד ולא טען את קבצי ה-JSON, ולכן עיטורים
    // מ-JSON (כמו orn_ud_022) לא היו זמינים ב-iframe ולא הופיעו בעימוד.
    if (window.__isRenderer) {
        if (typeof loadDefaultSettings === 'function') {
            try { await loadDefaultSettings(); } catch(e) {}
        }
        try { await loadExternalJSONAssets(); } catch(e) { console.warn('loadExternalJSONAssets (iframe):', e); }
        try { await loadFolderAssetsAndThemes(); } catch(e) {}
        // הודע לדף הראשי שה-iframe מוכן (כולל נכסים)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'renderer-ready' }, '*');
        }
        return;
    }

    initFontPickers();
    // טען הגדרות ברירת מחדל מ-default_settings.json דרך settings-manager.js
    // חשוב: default_settings.json כעת מכיל את ברירת המחדל של עדכון_ממשק_9 (שמות גופנים אנגליים)
    if (typeof loadDefaultSettings === 'function') {
        await loadDefaultSettings();
    }
    refreshCustomThemesUI();
    rehydrateExtImports();

    await loadExternalJSONAssets();
    await loadFolderAssetsAndThemes();
    // תיקון (2026-10-16): loadExternalFonts טוען 1754 גופנים — חוסם את window.onload.
    // מריצים ברקע בלי לחכות.
    loadExternalFonts();
    await ensureBuiltinFontsLoaded();

    if (document.getElementById('section-divider-style')?.value === 'custom_img') {
        const row = document.getElementById('row-sec-div-img');
        if (row) row.style.display = 'flex';
    }
    if (document.getElementById('hdr-c-type')?.value === 'custom_img') {
        const row = document.getElementById('row-hdr-c-img');
        if (row) row.style.display = 'flex';
    }

    if (editorElem && !editorElem.value.trim()) {
        editorElem.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - דיני תפילת השחר וזמנה
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום [כאן הערת שוליים בתחתית העמוד הנלמדת מדברי הראשונים].
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית.
הערת סיום - כאן הערת סיום מורחבת המרוכזת בסוף החלק.

כותרת 3 - ענף א: שיטת הרמב"ם בדין אונס ועבר זמן תפילה
גוף הטקסט בטורים המיושרים באופן מושלם. פסקאות אלו מדגימות את מנגנון האיזון המדויק המופעל בכל חיתוך.
כאשר טור אחד ימני מתמלא הוא מעביר שורות שלמות בלבד אל הטור השמאלי כדי שלא תיווצר מילה בודדת קטועה.
העימוד התורני מקפיד מאוד על שלמות הפסקאות והשורות כך שהקריאה תהיה רציפה ונעימה לעין הלומד.

כותרת 4 - סעיף א: בירור דעת בעל השאילתות
גוף הטקסט הבא תחת סעיף א מיועד לבאר את דברי הראשונים. כל פסקה מקבלת חלון מילה ראשונה רק אם היא מחזיקה שתי שורות ומעלה. פסקאות קצרות של שורה אחת אינן מקבלות חלון מילה ראשונה כדי למנוע שיבושים בעימוד הפסקאות הבאות אחריהן.
פיסקה קצרה.

כותרת 5 - סעיף ב: יישוב קושיית הנודע ביהודה
גוף הטקסט ממשיך לזרום בטורים שווים.

כותרת 7 - הערה נחוצה בצד העמוד
גוף הטקסט המכיל הערות צד בשולי הדף. הערות אלו ממוקמות בדיוק מול הפסקה אליה הן מתייחסות, ובכך מאפשרות ללומד לעיין במקורות תוך כדי לימודו הרציף בגוף הספר.`;
    }

    typesetDocument();
    initVisualPickers();
    initTabSystem();
};
