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
        's-gtoc-1','s-gtoc-2','s-gtoc-3','s-gtoc-4','s-gtoc-5','s-gtoc-6','s-gtoc-7',
        's-h0','s-h0-body','s-h1','s-h2','s-h3','s-h4','s-h5','s-h6','s-h7',
        's-hdr-c','s-hdr-l','s-hdr-r','s-hdr-verso-c','s-hdr-verso-l','s-hdr-verso-r',
        's-note-body','s-note-title','s-sh-author','s-sh-desc','s-sh-sec','s-sh-sub','s-sh-title','s-sh-year','s-siman',
        'section-divider-style','select-shaar-back','select-shaar-main','select-shaar-sub',
        'show-back-shaar','show-main-shaar','show-sub-shaar',
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
        'enable-shaar-box-editor'
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
        }
    });

    // אתחול
    createHiddenInputs();
    // הודע לדף הראשי שה-iframe מוכן
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'renderer-ready' }, '*');
    }
})();
