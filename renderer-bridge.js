/* ==========================================================================
   renderer-bridge.js — גשר תקשורת בין הדף הראשי ל-iframe המרנדר
   ==========================================================================
   פועל בתוך ה-iframe. מקבל הודעות מהדף הראשי דרך postMessage:
   - {type:'typeset', text, settings} → מזריק הגדרות, מעמד, שולח חזרה {type:'done', pageCount}
   - {type:'getHTML'} → שולח חזרה {type:'html', html: book-container.innerHTML}
   - {type:'print'} → מפעיל window.print()
   ========================================================================== */

(function() {
    'use strict';

    // רשימת כל מזהי ההגדרות שהמנוע קורא (133)
    const SETTING_IDS = [
        'active-theme-select','auto-dh','avoid-orphans','avoid-widows','back-shaar-count-numbering',
        'balance-chapter-end','col-divider-style','drop-word-count','drop-word-min-lines','drop-word-mode',
        'en-line-prefix','enable-detailed-toc','enable-general-toc',
        'f-dh','f-h0','f-h0-body','f-h1','f-h2','f-h3','f-h4','f-h5','f-h6','f-h7',
        'f-hdr-c','f-hdr-l','f-hdr-r','f-hdr-verso-c','f-hdr-verso-l','f-hdr-verso-r',
        'f-note-body','f-note-title','f-sh-author','f-sh-desc','f-sh-sec','f-sh-sub','f-sh-title','f-sh-year',
        'f-siman','fn-columns','fn-layout-mode','fn-delim-close','fn-delim-open','fn-reset-mode','fn-title-text',
        'font-body','font-first-word','f-paren','s-paren-mode','s-paren',
        'gtoc-groups','gtoc-shows',
        'h2-auto-siman','h2-orn-fit-text','h2-orn-scope','h2-ornament-bottom-style','h2-ornament-set',
        'h2-ornament-top-style','h2-reset-siman','h2-title-orn-mode','h2-title-ornament-bottom-style',
        'h2-title-ornament-l','h2-title-ornament-r','h2-title-ornament-top-style',
        'h2-top-distance','h3-ornament-l','h3-ornament-r','h3-ornament-set',
        'heading-divider-h1','heading-divider-h2','heading-divider-h3','heading-divider-h4',
        'heading-divider-h5','heading-divider-h6','heading-divider-h7',
        'shaar-main-divider','shaar-sub-divider',
        'hdr-alternating','hdr-c-align','hdr-c-custom','hdr-c-type','hdr-divider-style',
        'hdr-distinct-even-odd','hdr-l-align','hdr-l-custom','hdr-l-type','hdr-r-align','hdr-r-custom','hdr-r-type',
        'hdr-title-split','hdr-verso-c-align','hdr-verso-c-custom','hdr-verso-c-type',
        'hdr-verso-l-align','hdr-verso-l-custom','hdr-verso-l-type',
        'hdr-verso-r-align','hdr-verso-r-custom','hdr-verso-r-type',
        'hdr-w-c','hdr-w-l','hdr-w-r',
        'inp-book-author','inp-book-back-contact','inp-book-back-copyright','inp-book-back-extra',
        'inp-book-back-publishing','inp-book-desc','inp-book-sections','inp-book-subtitle','inp-book-title','inp-book-year',
        'line-height-body','main-shaar-count-numbering','main-shaar-show-number',
        'mode-h0','mode-h1','mode-h2','mode-h3','mode-h4','mode-h5','mode-h6','mode-h7',
        'note-header-orn-l','note-header-orn-r','note-listing-num-size','note-marker-size','note-marker-type',
        'note-num-separator','note-numbering-style','note-rule-style',
        'odd-h0','odd-h1','odd-h2',
        'page-num-format','page-num-frame','page-num-initial-value','page-num-position','page-num-start-idx',
        'prop-col','prop-gap','prop-gutter','prop-margin','prop-mb','prop-mt','prop-mt-h2',
        's-dtoc-1','s-dtoc-2','s-dtoc-3','s-dtoc-4','s-dtoc-5','s-dtoc-6','s-dtoc-7',
        'f-dtoc-1','f-dtoc-2','f-dtoc-3','f-dtoc-4','f-dtoc-5','f-dtoc-6','f-dtoc-7',
        's-gtoc-1','s-gtoc-2','s-gtoc-3','s-gtoc-4','s-gtoc-5','s-gtoc-6','s-gtoc-7',
        'f-gtoc-1','f-gtoc-2','f-gtoc-3','f-gtoc-4','f-gtoc-5','f-gtoc-6','f-gtoc-7',
        's-h0','s-h0-body','s-h1','s-h2','s-h3','s-h4','s-h5','s-h6','s-h7',
        's-hdr-c','s-hdr-l','s-hdr-r','s-hdr-verso-c','s-hdr-verso-l','s-hdr-verso-r',
        's-note-body','s-note-title','s-sh-author','s-sh-desc','s-sh-sec','s-sh-sub','s-sh-title','s-sh-year','s-siman',
        'section-divider-style','select-shaar-back','select-shaar-main','select-shaar-sub',
        'show-back-shaar','show-main-shaar','show-sub-shaar',
        'back-shaar-show-number',
        'size-body','size-first-word','sub-shaar-count-numbering','sub-shaar-show-number',
        'detailed-toc-count-numbering','detailed-toc-show-numbering',
        'general-toc-count-numbering','general-toc-show-numbering',
        'cbg-regular-mode','cbg-regular-color','cbg-regular-opacity',
        'cbg-h0Open-mode','cbg-h0Open-color','cbg-h0Open-opacity',
        'cbg-h2Open-mode','cbg-h2Open-color','cbg-h2Open-opacity',
        'data-cbg-regular-img','data-cbg-h0Open-img','data-cbg-h2Open-img',
        'data-hdr-c-img','data-sec-div-img',
        'data-builder-main-svg','data-builder-back-svg','data-builder-sub-svg',
        'builder-main-top','builder-main-bottom','builder-main-right','builder-main-left',
        'builder-back-top','builder-back-bottom','builder-back-right','builder-back-left',
        'builder-sub-top','builder-sub-bottom','builder-sub-right','builder-sub-left',
        'builder-theme-name',
        'avoid-runt-word','body-last-line-align',
        'dtoc-groups','dtoc-shows',
        'enable-shaar-box-editor',
        // [חדש] מימדי עיטורים (רוחב/גובה) — היו חסרים
        'dim-h2-top-w','dim-h2-top-h','dim-h2-btm-w','dim-h2-btm-h',
        'dim-h2-title-side-w','dim-h2-title-side-h',
        'dim-h3-side-w','dim-h3-side-h',
        'dim-secdiv-w','dim-secdiv-h',
        'dim-note-side-w','dim-note-side-h'
    ];

    // צור פקדים נסתרים עבור כל ההגדרות
    function createHiddenInputs() {
        const container = document.getElementById('settings-hidden');
        if (!container) return;
        SETTING_IDS.forEach(id => {
            if (document.getElementById(id)) return; // כבר קיים
            const el = document.createElement('input');
            el.type = 'hidden';
            el.id = id;
            container.appendChild(el);
        });
    }

    // הזרקת ערכי הגדרות מהדף הראשי
    function applySettings(settings) {
        Object.keys(settings).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const val = settings[id];
            if (typeof val === 'boolean') {
                // checkbox — צור checkbox אמיתי
                if (el.type !== 'checkbox') {
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.id = id;
                    el.parentNode.replaceChild(cb, el);
                    cb.checked = val;
                } else {
                    el.checked = val;
                }
            } else {
                // select/text/number
                if (el.type === 'checkbox') {
                    // המר ל-hidden
                    const hi = document.createElement('input');
                    hi.type = 'hidden';
                    hi.id = id;
                    el.parentNode.replaceChild(hi, el);
                    hi.value = val;
                } else {
                    el.value = val;
                }
            }
        });
    }

    // הזרקת טקסט מהדף הראשי
    function applyText(text) {
        const el = document.getElementById('raw-input');
        if (el) {
            // raw-input הוא contenteditable div — השתמש ב-value אם מוגדר, אחרת innerText
            if ('value' in el) {
                el.value = text;
            } else {
                el.innerText = text;
            }
        }
    }

    // האזנה להודעות מהדף הראשי
    window.addEventListener('message', function(e) {
        const msg = e.data;
        if (!msg || !msg.type) return;

        if (msg.type === 'typeset') {
            try {
                applySettings(msg.settings);
                applyText(msg.text);
                // עדכן CSS vars
                if (typeof updateGrid === 'function') updateGrid();
                if (typeof updateStyles === 'function') updateStyles();
                // עמד
                if (typeof typesetDocument === 'function') {
                    typesetDocument();
                }
                // שלח חזרה תוצאה
                const pageCount = document.querySelectorAll('.a4-page').length;
                e.source.postMessage({ type: 'render-done', pageCount: pageCount }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'render-error', error: err.message }, e.origin);
            }
        } else if (msg.type === 'getHTML') {
            const html = document.getElementById('book-container')?.innerHTML || '';
            e.source.postMessage({ type: 'html-result', html: html }, e.origin);
        } else if (msg.type === 'print') {
            window.print();
        } else if (msg.type === 'fn-audit') {
            // [חדש — מהימנות מדידה] מחזיר את תוצאות auditFnMeasurement + את הלוג המלא
            try {
                const audit = (typeof auditFnMeasurement === 'function') ? auditFnMeasurement() : [];
                const log = window.__fnMeasureLog || [];
                e.source.postMessage({ type: 'fn-audit-result', audit: audit, logSize: log.length, logSample: log.slice(-200) }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'fn-audit-error', error: err.message }, e.origin);
            }
        } else if (msg.type === 'fn-audit-clear-log') {
            window.__fnMeasureLog = [];
            e.source.postMessage({ type: 'fn-audit-log-cleared' }, e.origin);
        } else if (msg.type === 'geom-extract') {
            // [חדש — גיאומטריה] חלץ מודל גיאומטרי מה-iframe
            try {
                if (!window.__geomAudit) {
                    e.source.postMessage({ type: 'geom-error', error: 'geometry-audit.js לא נטען' }, e.origin);
                    return;
                }
                const model = window.__geomAudit.extract();
                e.source.postMessage({ type: 'geom-extract-result', model: model }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'geom-error', error: err.message, stack: err.stack }, e.origin);
            }
        } else if (msg.type === 'geom-audit') {
            // [חדש — גיאומטריה] הרץ בודק מתמטי + (אופציונלי) צייר overlay
            try {
                if (!window.__geomAudit) {
                    e.source.postMessage({ type: 'geom-error', error: 'geometry-audit.js לא נטען' }, e.origin);
                    return;
                }
                const model = window.__geomAudit.extract();
                const audit = window.__geomAudit.audit(model);
                if (msg.opts && msg.opts.paint) {
                    window.__geomAudit.paint(model, audit, { level: msg.opts.level || 2, labels: msg.opts.labels !== false });
                }
                e.source.postMessage({
                    type: 'geom-audit-result',
                    summary: audit.summary,
                    issues: audit.issues,
                    stats: model.stats
                }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'geom-error', error: err.message, stack: err.stack }, e.origin);
            }
        } else if (msg.type === 'geom-paint') {
            // [חדש — גיאומטריה] צייר overlay על הדף
            try {
                if (!window.__geomAudit) {
                    e.source.postMessage({ type: 'geom-error', error: 'geometry-audit.js לא נטען' }, e.origin);
                    return;
                }
                const model = window.__geomAudit.extract();
                const audit = window.__geomAudit.audit(model);
                window.__geomAudit.paint(model, audit, { level: msg.level || 2, labels: msg.labels !== false });
                e.source.postMessage({
                    type: 'geom-paint-done',
                    summary: audit.summary,
                    stats: model.stats
                }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'geom-error', error: err.message, stack: err.stack }, e.origin);
            }
        } else if (msg.type === 'geom-clear') {
            // [חדש — גיאומטריה] נקה overlay
            try {
                if (window.__geomAudit) window.__geomAudit.clear();
                e.source.postMessage({ type: 'geom-clear-done' }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'geom-error', error: err.message }, e.origin);
            }
        } else if (msg.type === 'geom-export') {
            // [חדש — גיאומטריה] ייצוא פירוט מלא כ-JSON (כולל מילים/רווחים)
            try {
                if (!window.__geomAudit) {
                    e.source.postMessage({ type: 'geom-error', error: 'geometry-audit.js לא נטען' }, e.origin);
                    return;
                }
                const model = window.__geomAudit.extract();
                const audit = window.__geomAudit.audit(model);
                // נקה את העץ מ-_parent (circular) לפני ייצוא
                const cleanModel = {
                    pages: model.pages.map(p => window.__geomAudit.cleanForExport(p)),
                    stats: model.stats
                };
                e.source.postMessage({
                    type: 'geom-export-result',
                    model: cleanModel,
                    audit: audit
                }, e.origin);
            } catch (err) {
                e.source.postMessage({ type: 'geom-error', error: err.message, stack: err.stack }, e.origin);
            }
        } else if (msg.type === 'geom-scroll-to-page') {
            // [חדש — גיאומטריה] גלול לעמוד מסוים ב-iframe
            try {
                const pages = document.querySelectorAll('#book-container .a4-page');
                const idx = msg.pageIdx;
                // [תיקון חשוב] ה-<html> הוא overflow:hidden, וה-<body> הוא זה שגולל.
                // לכן window.scrollTo לא עובד — צריך לגלול את body.scrollTop.
                const body = document.body;
                // [תיקון] אם יש issue עם childRect/rightRect, נגלול למיקום המדויק
                if (msg.issue) {
                    let targetRect = msg.issue.childRect || msg.issue.rightRect || msg.issue.aRect;
                    if (targetRect) {
                        // ה-childRect הוא יחסי ל-#book-container. נמיר ל-document-absolute.
                        // bcRect.top הוא viewport-relative. בגלל ש-body גולל, bcRect.top כולל את ה-offset הנוכחי.
                        const bc = document.getElementById('book-container');
                        const bcRect = bc ? bc.getBoundingClientRect() : { top: 0 };
                        const currentBodyScroll = body.scrollTop || 0;
                        // document-absolute Y = currentBodyScroll + bcRect.top (viewport) + targetRect.y (relative to bc)
                        const docAbsoluteY = currentBodyScroll + bcRect.top + targetRect.y;
                        // נגלול כך שהאזור הבעייתי יהיה במרכז התצוגה
                        const targetScrollY = docAbsoluteY - (window.innerHeight / 2) + (targetRect.h / 2);
                        body.scrollTop = Math.max(0, targetScrollY);
                        // הבהב את המסגרת אחרי הגלילה
                        if (window.__geomAudit) {
                            setTimeout(() => {
                                window.__geomAudit.highlightIssue(msg.issue);
                            }, 300);
                        }
                        return;
                    }
                }
                // fallback: גלול לעמוד
                if (pages[idx]) {
                    const r = pages[idx].getBoundingClientRect();
                    const currentBodyScroll = body.scrollTop || 0;
                    body.scrollTop = currentBodyScroll + r.top - 20;
                }
                if (msg.issue && window.__geomAudit) {
                    setTimeout(() => {
                        window.__geomAudit.highlightIssue(msg.issue);
                    }, 300);
                }
            } catch (err) {
                console.error('scroll error:', err);
            }
        } else if (msg.type === 'geom-highlight') {
            // [חדש — גיאומטריה] הבהב מסגרת על בעיה ספציפית
            try {
                if (window.__geomAudit && msg.issue) {
                    window.__geomAudit.highlightIssue(msg.issue);
                }
            } catch (err) {
                console.error('highlight error:', err);
            }
        } else if (msg.type === 'geom-clear-highlight') {
            try {
                if (window.__geomAudit) window.__geomAudit.clearHighlight();
            } catch (err) {
                console.error('clear highlight error:', err);
            }
        }
    });

    // אתחול
    createHiddenInputs();
    // הודע לדף הראשי שה-iframe מוכן
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'renderer-ready' }, '*');
    }
})();
