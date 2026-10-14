/* ==========================================================================
   trace-manager.js — מערכת מעקב אחרי קריאות פונקציות לפרק
   ==========================================================================
   מאפשר:
   1. רישום כל הקריאות לפונקציות העימוד עבור כל פרק (H1/H2/H0) בנפרד
   2. לחיצה על קריאה → רינדור הפרק הזה בלבד עד לקריאה הזו
   3. צ'קבוקס לכל קריאה → דילוג על הקריאה ברינדור הבא

   ארכיטקטורה:
   - מקבל hooks מ-typesetter.js: __traceOnChaptersBuilt, __traceOnChapterStart
   - עוטף פונקציות גלובליות של typesetter.js כדי לתעד קריאות
   - מציג UI בכרטיסיית "בדיקה" (מוחלף בין דוח עימוד לבין תצוגת מעקב)
   ========================================================================== */

(function() {
'use strict';

// ==========================================================================
// מצב גלובלי
// ==========================================================================
const state = {
  enabled: false,                  // האם מצב מעקב פעיל
  chapters: [],                    // רשימת פרקים שזוהו (מתמלא ע"י typesetter)
  stepsByChapter: {},              // {chapterIdx: [step, step, ...]}
  currentChapterIdx: -1,           // הפרק שכרגע מעובד
  chapterStepCounter: 0,           // counter לקריאות בתוך הפרק הנוכחי
  stopAt: null,                    // {chapterIdx, seqInChapter} או null
  skipSet: new Set(),              // Set<"chapterIdx:seqInChapter"> של קריאות לדלג
  selectedChapterIdx: null,        // הפרק שכרגע נבחר ב-UI
  filterChapterIdx: null,          // כש-number, רק הפרק הזה ירונדר
  captureMode: 'none',             // 'none' | 'full' | 'partial'
  viewMode: 'report',              // 'report' (דוח עימוד) | 'trace' (תצוגת מעקב)
  lastRunSummary: null,            // סיכום הריצה האחרונה
};

window.__traceState = state;

// ==========================================================================
// עדכוני state מ-typesetter.js
// ==========================================================================
window.__traceOnChaptersBuilt = function(chapters) {
  state.chapters = chapters || [];
  // אם זו ריצת capture מלאה — נאפס את stepsByChapter
  if (state.captureMode === 'full') {
    state.stepsByChapter = {};
  }
};

window.__traceOnChapterStart = function(sIdx, totalSections) {
  state.currentChapterIdx = sIdx;
  state.chapterStepCounter = 0;
};

window.__traceOnStopped = function() {
  // נקרא כשהעימוד נעצר ע"י __TRACE_STOP__
  if (state.captureMode === 'partial') {
    state.lastRunSummary = {
      mode: 'partial',
      stoppedAt: state.stopAt,
      timestamp: Date.now(),
    };
  }
};

// ==========================================================================
// פעולות ציבוריות
// ==========================================================================

/** רינדור מלא עם capture של כל הקריאות */
window.__traceStartFullCapture = function() {
  state.enabled = true;
  state.captureMode = 'full';
  state.stepsByChapter = {};
  state.currentChapterIdx = -1;
  state.chapterStepCounter = 0;
  state.stopAt = null;
  state.filterChapterIdx = null;
  // נשמור את ה-skipSet (כדי שהמשתמש יוכל לראות איזה קריאות דולגו)
  if (typeof typesetDocument === 'function') {
    typesetDocument();
  }
};

/** רינדור פרק בודד עד לקריאה מסוימת */
window.__traceRenderUpToStep = function(chapterIdx, seqInChapter) {
  state.enabled = true;
  state.captureMode = 'partial';
  state.stopAt = { chapterIdx: chapterIdx, seqInChapter: seqInChapter };
  state.filterChapterIdx = chapterIdx;
  if (typeof typesetDocument === 'function') {
    typesetDocument();
  }
};

/** רינדור מלא עם skip set שמור */
window.__traceRenderWithSkips = function() {
  state.enabled = true;
  state.captureMode = 'full';
  state.stopAt = null;
  state.filterChapterIdx = null;
  // לא מאפסים את stepsByChapter — הקריאות כבר רשומות מהריצה הקודמת
  // אבל כן נאפס כדי לקלוט את הסדר החדש (אם יש שינוי)
  state.stepsByChapter = {};
  if (typeof typesetDocument === 'function') {
    typesetDocument();
  }
};

/** רינדור נורמלי ללא מעקב */
window.__traceDisable = function() {
  state.enabled = false;
  state.captureMode = 'none';
  state.stopAt = null;
  state.filterChapterIdx = null;
  state.currentChapterIdx = -1;
  if (typeof typesetDocument === 'function') {
    typesetDocument();
  }
};

/** דילוג/החזרה של קריאה */
window.__traceToggleSkip = function(chapterIdx, seqInChapter) {
  const id = chapterIdx + ':' + seqInChapter;
  if (state.skipSet.has(id)) {
    state.skipSet.delete(id);
  } else {
    state.skipSet.add(id);
  }
};

window.__traceClearSkips = function() {
  state.skipSet.clear();
};

// ==========================================================================
// מעטפת פונקציות
// ==========================================================================
function wrapFunction(name, opts) {
  // נשתמש ב-eval כדי לקבל reference לפונקציה הגלובלית
  // (top-level function declarations ב-typesetter.js הן גלובליות)
  let original;
  try {
    original = eval(name);
  } catch (e) {
    console.warn('[trace] Function not found:', name);
    return;
  }
  if (typeof original !== 'function') {
    console.warn('[trace] Not a function:', name);
    return;
  }

  const skippable = opts.skippable !== false;
  const argsSummary = opts.argsSummary || function() { return ''; };
  const skipReturnValue = opts.skipReturnValue;

  // נשתמש ב-eval כדי להקצות למשתנה הגלובלי
  const wrapper = function() {
    const args = Array.prototype.slice.call(arguments);
    if (!state.enabled || state.currentChapterIdx < 0) {
      return original.apply(this, args);
    }

    state.chapterStepCounter++;
    const seq = state.chapterStepCounter;
    const chapterIdx = state.currentChapterIdx;
    const stepId = chapterIdx + ':' + seq;

    // ניגש ל-pageIndex אם קיים גלובלית
    let pageIdx = 0;
    try {
      if (typeof pageIndex !== 'undefined') pageIdx = pageIndex;
    } catch (e) {}

    const step = {
      id: stepId,
      chapterIdx: chapterIdx,
      seqInChapter: seq,
      functionName: name,
      argsSummary: argsSummary.apply(null, args) || '',
      pageIdx: pageIdx,
      skippable: skippable,
      timestamp: Date.now(),
    };

    // רק ב-capture מלא נוסיף ללוג (ב-partial אנחנו לא רוצים לשנות את הלוג הקיים)
    if (state.captureMode === 'full') {
      if (!state.stepsByChapter[chapterIdx]) state.stepsByChapter[chapterIdx] = [];
      state.stepsByChapter[chapterIdx].push(step);
    }

    // בדיקת skip
    if (skippable && state.skipSet.has(stepId)) {
      console.log('[trace] SKIP', name, 'step', stepId);
      if (typeof skipReturnValue === 'function') return skipReturnValue.apply(null, args);
      return skipReturnValue;
    }

    // בדיקת stop — רק ב-partial mode
    if (state.captureMode === 'partial' && state.stopAt &&
        state.stopAt.chapterIdx === chapterIdx &&
        state.stopAt.seqInChapter === seq) {
      console.log('[trace] STOP at', name, 'step', stepId, '(chapter', chapterIdx + ')');
      throw new Error('__TRACE_STOP__');
    }

    return original.apply(this, args);
  };

  // הקצאה למשתנה הגלובלי
  try {
    eval(name + ' = wrapper;');
  } catch (e) {
    console.warn('[trace] Failed to assign wrapper for:', name, e);
  }
}

function installWrappers() {
  const list = [
    // Skippable (side-effect functions)
    { name: 'balanceColumns', skippable: true, argsSummary: (b, w) => 'w=' + w },
    { name: 'balanceColumnsV2', skippable: true, argsSummary: (b, w) => 'w=' + w },
    { name: 'rollbackColumnTail', skippable: true, argsSummary: (c) => 'col=' + (c ? c.className : '?') },
    { name: 'finalizeTwoColumnBlockLayout', skippable: true, argsSummary: (b) => 'block' },
    { name: 'tightenRunts', skippable: true, argsSummary: (c, w) => 'w=' + w },
    { name: 'tightenRuntsInBlock', skippable: true, argsSummary: (b) => 'block' },
    { name: 'distributeColumnJustification', skippable: true, argsSummary: (c, n) => 'n=' + n },
    { name: 'justifyColumnsPair', skippable: true, argsSummary: (r, l) => 'pair' },
    { name: 'fixWidowContinuation', skippable: true, argsSummary: (b) => 'block' },
    { name: 'finalizeNotePositions', skippable: true, argsSummary: () => 'notes' },
    { name: 'flushFootnotesInto', skippable: true, argsSummary: (p) => 'page' },
    { name: 'flushEndnotesForPart', skippable: true, argsSummary: () => 'part' },
    { name: 'applyDelimiterStyles', skippable: true, argsSummary: (el, ctx) => String(ctx || '') },
    { name: 'createDropWord', skippable: true, argsSummary: (t) => '"' + String(t || '').slice(0, 15) + '..."', skipReturnValue: (t) => t },
    { name: 'fitOneHeadingOrnament', skippable: true, argsSummary: (w, top) => top ? 'top' : 'bottom' },
    { name: 'fitSideOrnamentsToText', skippable: true, argsSummary: () => 'wrap' },
    // ensureOddPageStart היא פונקציה מקוננת בתוך performTypesetInner — לא ניתנת לעטיפה חיצונית
    { name: 'createNoteMarkerAndQueue', skippable: true, argsSummary: (t, s, kind) => String(kind || ''), skipReturnValue: null },
    // Not skippable (return value drives algorithm)
    { name: 'getLinesFromParagraph', skippable: false, argsSummary: (t, w) => '"' + String(t || '').slice(0, 15) + '...", w=' + w },
    { name: 'measureMaxFitLines', skippable: false, argsSummary: (p, c, l) => 'lines=' + (l ? l.length : 0) },
    { name: 'refineParagraphFitLine', skippable: false, argsSummary: (l, f) => 'fit=' + f },
    { name: 'shrinkFitUntilFitsDry', skippable: false, argsSummary: (p, c, l, f) => 'fit=' + f },
    { name: 'canHeadingFitWithBody', skippable: false, argsSummary: (c, t) => 'tok=' + (t ? t.id : '?') },
    { name: 'createPageLayout', skippable: false, argsSummary: (c, h2, id, p) => 'p=' + p },
  ];

  list.forEach(function(opts) {
    wrapFunction(opts.name, opts);
  });

  console.log('[trace] wrappers installed for', list.length, 'functions');
}

// ==========================================================================
// עזרי HTML
// ==========================================================================
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================================================
// רינדור UI
// ==========================================================================

function renderTraceUI() {
  const container = document.getElementById('trace-view');
  if (!container) return;

  let html = '';

  // ---- שורת כלים עליונה ----
  html += '<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">';
  html += '<button id="trace-btn-full" class="btn-tool btn-primary" style="flex:1;font-size:8pt;padding:4px 6px;">🔄 רינדור מלא + מעקב</button>';
  html += '<button id="trace-btn-clear-skips" class="btn-tool btn-secondary" style="flex:0.7;font-size:8pt;padding:4px 6px;">🗑 נקה דילוגים</button>';
  html += '<button id="trace-btn-back" class="btn-tool btn-secondary" style="flex:0.7;font-size:8pt;padding:4px 6px;">📊 חזרה לדוח</button>';
  html += '</div>';

  // ---- סטטוס ----
  const totalSteps = Object.values(state.stepsByChapter).reduce((sum, arr) => sum + arr.length, 0);
  const skipCount = state.skipSet.size;
  html += '<div style="background:#e2e8f0;padding:6px 8px;border-radius:4px;margin-bottom:8px;font-size:8pt;color:#1e293b;">';
  html += '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">';
  html += '<span>📚 פרקים: <b>' + state.chapters.length + '</b></span>';
  html += '<span>📞 קריאות: <b>' + totalSteps + '</b></span>';
  html += '<span style="color:' + (skipCount > 0 ? '#dc2626' : '#059669') + ';">⏭ דילוגים: <b>' + skipCount + '</b></span>';
  html += '</div>';
  if (state.lastRunSummary && state.lastRunSummary.mode === 'partial') {
    const sa = state.lastRunSummary.stoppedAt;
    if (sa) {
      html += '<div style="margin-top:4px;color:#7c2d12;font-size:7pt;">⏸ עצרנו בפרק ' + (sa.chapterIdx + 1) + ' קריאה #' + sa.seqInChapter + '</div>';
    }
  }
  html += '</div>';

  if (state.chapters.length === 0) {
    html += '<div style="padding:24px 12px;color:#64748b;text-align:center;font-size:9pt;line-height:1.6;">';
    html += 'לחץ על <b>🔄 רינדור מלא + מעקב</b> כדי להתחיל.<br>';
    html += '<span style="font-size:7pt;color:#94a3b8;">המערכת תעבד את כל הפרקים ותרשום כל קריאה לפונקציה.</span>';
    html += '</div>';
    container.innerHTML = html;
    wireUpButtons(container);
    return;
  }

  // ---- רשימת פרקים ----
  html += '<div style="font-size:8pt;font-weight:bold;color:#475569;margin-bottom:4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">פרקים (' + state.chapters.length + ')</div>';
  html += '<div style="display:flex;flex-direction:column;gap:2px;margin-bottom:12px;max-height:200px;overflow-y:auto;">';
  state.chapters.forEach(function(ch) {
    const isSelected = state.selectedChapterIdx === ch.idx;
    const stepCount = (state.stepsByChapter[ch.idx] || []).length;
    const skipCountCh = (state.stepsByChapter[ch.idx] || []).filter(s => state.skipSet.has(s.id)).length;
    const borderColor = isSelected ? '#2563eb' : '#cbd5e1';
    const bgColor = isSelected ? '#dbeafe' : '#fff';
    const typeLabel = ch.isSubShaar ? 'H1' : (ch.isNewPage ? 'H' + ch.level : 'גוף');
    const typeColor = ch.isSubShaar ? '#7c3aed' : (ch.level === 2 ? '#2563eb' : (ch.level === 0 ? '#0891b2' : '#475569'));
    html += '<button class="trace-chapter-btn" data-chapter-idx="' + ch.idx + '" style="padding:5px 7px;text-align:right;border:1px solid ' + borderColor + ';background:' + bgColor + ';color:#1e293b;cursor:pointer;font-size:8pt;font-family:inherit;border-radius:4px;display:flex;align-items:center;gap:4px;">';
    html += '<span style="background:' + typeColor + ';color:#fff;padding:1px 5px;border-radius:3px;font-size:7pt;font-weight:bold;min-width:24px;text-align:center;">' + typeLabel + '</span>';
    html += '<span style="background:#1e293b;color:#fff;padding:1px 5px;border-radius:3px;font-size:7pt;min-width:18px;text-align:center;">' + (ch.idx + 1) + '</span>';
    html += '<span style="flex:1;color:#475569;font-size:7pt;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(ch.title) + '</span>';
    html += '<span style="color:#64748b;font-size:6pt;white-space:nowrap;">' + stepCount + ' קריאות' + (skipCountCh > 0 ? ' <span style="color:#dc2626;">(' + skipCountCh + ' ⏭)</span>' : '') + '</span>';
    html += '</button>';
  });
  html += '</div>';

  // ---- רשימת קריאות לפרק הנבחר ----
  if (state.selectedChapterIdx !== null) {
    const ch = state.chapters[state.selectedChapterIdx];
    const steps = state.stepsByChapter[state.selectedChapterIdx] || [];
    html += '<div style="font-size:8pt;font-weight:bold;color:#475569;margin-bottom:4px;border-bottom:1px solid #cbd5e1;padding-bottom:2px;">';
    html += 'קריאות פרק ' + (state.selectedChapterIdx + 1);
    if (ch) html += ' <span style="color:#64748b;font-weight:normal;font-size:7pt;">— ' + escapeHtml(ch.title) + '</span>';
    html += ' (' + steps.length + ')</div>';

    if (steps.length === 0) {
      html += '<div style="padding:12px;color:#64748b;text-align:center;font-size:7pt;">אין קריאות מוקלטות. הרץ "רינדור מלא + מעקב" כדי לתעד.</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:1px;">';
      steps.forEach(function(step) {
        const isSkipped = state.skipSet.has(step.id);
        const bg = isSkipped ? '#fee2e2' : '#fff';
        const skipIcon = step.skippable ? '☑' : '—';
        const fnColor = step.skippable ? '#1e40af' : '#64748b';
        const fnWeight = step.skippable ? 'bold' : 'normal';
        html += '<div class="trace-step-row" data-step-id="' + step.id + '" data-chapter-idx="' + step.chapterIdx + '" data-seq="' + step.seqInChapter + '" style="display:flex;align-items:center;gap:3px;padding:3px 4px;border:1px solid #e2e8f0;background:' + bg + ';cursor:pointer;font-size:7pt;">';
        html += '<input type="checkbox" class="trace-skip-cb" data-step-id="' + step.id + '" ' + (step.skippable ? '' : 'disabled') + ' ' + (isSkipped ? 'checked' : '') + ' style="margin:0;cursor:' + (step.skippable ? 'pointer' : 'not-allowed') + ';flex-shrink:0;" title="' + (step.skippable ? 'דלג/החזר קריאה זו' : 'קריאה זו אינה ניתנת לדילוג (ערך החזרה נדרש)') + '" />';
        html += '<span style="background:#e2e8f0;padding:1px 4px;border-radius:3px;font-size:6pt;min-width:20px;text-align:center;color:#475569;flex-shrink:0;">' + step.seqInChapter + '</span>';
        html += '<span style="font-family:monospace;color:' + fnColor + ';font-weight:' + fnWeight + ';white-space:nowrap;flex-shrink:0;">' + escapeHtml(step.functionName) + '</span>';
        html += '<span style="color:#475569;font-size:6pt;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;" title="' + escapeHtml(step.argsSummary) + '">' + escapeHtml(step.argsSummary) + '</span>';
        html += '<span style="color:#94a3b8;font-size:6pt;white-space:nowrap;flex-shrink:0;">עמ\' ' + step.pageIdx + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }
  }

  container.innerHTML = html;
  wireUpButtons(container);
  wireUpChapterButtons(container);
  wireUpStepRows(container);
  wireUpSkipCheckboxes(container);
}

function wireUpButtons(container) {
  const btnFull = container.querySelector('#trace-btn-full');
  if (btnFull) {
    btnFull.addEventListener('click', function() {
      window.__traceStartFullCapture();
      // נמתין לסיום הרינדור ואז נרענן את ה-UI
      setTimeout(renderTraceUI, 1500);
    });
  }
  const btnClear = container.querySelector('#trace-btn-clear-skips');
  if (btnClear) {
    btnClear.addEventListener('click', function() {
      if (state.skipSet.size === 0) {
        alert('אין דילוגים מוגדרים.');
        return;
      }
      if (!confirm('לנקות את כל ' + state.skipSet.size + ' הדילוגים?')) return;
      window.__traceClearSkips();
      renderTraceUI();
    });
  }
  const btnBack = container.querySelector('#trace-btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', function() {
      window.__traceSetViewMode('report');
    });
  }
}

function wireUpChapterButtons(container) {
  container.querySelectorAll('.trace-chapter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      state.selectedChapterIdx = parseInt(this.dataset.chapterIdx, 10);
      renderTraceUI();
    });
  });
}

function wireUpStepRows(container) {
  container.querySelectorAll('.trace-step-row').forEach(function(row) {
    row.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return; // checkbox handles itself
      const chapterIdx = parseInt(this.dataset.chapterIdx, 10);
      const seq = parseInt(this.dataset.seq, 10);
      window.__traceRenderUpToStep(chapterIdx, seq);
      // נמתין לרינדור ונעדכן את ה-UI
      setTimeout(renderTraceUI, 1500);
    });
  });
}

function wireUpSkipCheckboxes(container) {
  container.querySelectorAll('.trace-skip-cb').forEach(function(cb) {
    cb.addEventListener('change', function(e) {
      e.stopPropagation();
      const stepId = this.dataset.stepId;
      const parts = stepId.split(':');
      const chapterIdx = parseInt(parts[0], 10);
      const seq = parseInt(parts[1], 10);
      window.__traceToggleSkip(chapterIdx, seq);
      // אם יש כבר רינדור מלא, נריץ מחדש עם הדילוגים
      // (נדחה מעט כדי לאפשר multi-toggle)
      if (this._traceDebounce) clearTimeout(this._traceDebounce);
      this._traceDebounce = setTimeout(function() {
        // רק אם יש לנו capture מלא קודם — נריץ מחדש
        if (Object.keys(state.stepsByChapter).length > 0) {
          window.__traceRenderWithSkips();
          setTimeout(renderTraceUI, 1500);
        } else {
          renderTraceUI();
        }
      }, 400);
    });
  });
}

// ==========================================================================
// מעבר בין תצוגות
// ==========================================================================
window.__traceSetViewMode = function(mode) {
  state.viewMode = mode;
  const reportView = document.getElementById('debug-report-view');
  const traceView = document.getElementById('trace-view');
  const toggleBtn = document.getElementById('btn-toggle-trace');
  if (mode === 'trace') {
    if (reportView) reportView.style.display = 'none';
    if (traceView) traceView.style.display = 'flex';
    if (toggleBtn) {
      toggleBtn.textContent = '📊 דוח עימוד';
      toggleBtn.classList.add('active');
    }
    renderTraceUI();
  } else {
    if (reportView) reportView.style.display = 'block';
    if (traceView) traceView.style.display = 'none';
    if (toggleBtn) {
      toggleBtn.textContent = '🔍 מעקב פונקציות';
      toggleBtn.classList.remove('active');
    }
    // נכבה את המעקב כשחוזרים לדוח
    if (state.enabled) {
      window.__traceDisable();
    }
  }
};

window.__traceGetState = function() { return state; };

// ==========================================================================
// אתחול
// ==========================================================================
function init() {
  installWrappers();
  // אתחול תצוגת trace כ-mock ריק
  const traceView = document.getElementById('trace-view');
  if (traceView) {
    renderTraceUI();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('[trace] trace-manager.js loaded — wrappers will be installed after typesetter.js loads');

})();
