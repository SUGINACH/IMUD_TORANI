/* ==========================================================================
   decorations.js - מאגר עיטורים, שערים ואלמנטים גרפיים (SVG)
   ========================================================================== */

const CBG_TEXTURE_SVG = "data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.18'/%3E%3C/svg%3E";

/* ==========================================================================
   מאגרי רישום דינמי עבור קובצי JSON חיצוניים
   ========================================================================== */
const EXTERNAL_SHAAR_ASSETS = {
    main: {},
    back: {},
    sub: {}
};
const ORNAMENTS_LR = {};
const ORNAMENTS_UD = {};
const EXTERNAL_ALL_ORNAMENTS = {};

function registerExternalShaarAsset(typeKey, id, name, svgContent) {
    if (EXTERNAL_SHAAR_ASSETS[typeKey]) {
        EXTERNAL_SHAAR_ASSETS[typeKey][id] = svgContent;
    }
}

function registerOrnamentsLR(id, name, svgContent) {
    ORNAMENTS_LR[id] = { id, name, svg: svgContent };
}

function registerOrnamentsUD(id, name, svgContent) {
    ORNAMENTS_UD[id] = { id, name, svg: svgContent };
}

function registerExternalAllOrnament(id, svgContent) {
    EXTERNAL_ALL_ORNAMENTS[id] = svgContent;
}

/* ==========================================================================
   1. עיטורי כותרת עליונה ומקורות תוכן מורחבים
   ========================================================================== */
const HEADER_ORNAMENTS = {
    diamonds: '<span style="letter-spacing:3px;">◈ ❖ ◈</span>',
    spear: '<svg style="height:9px; width:48px;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#444" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#444"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#444"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#444"/></svg>',
    swash: '<svg style="height:12px; width:44px; fill:#444;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>',
    pen: '<svg style="height:12px; width:44px;" viewBox="0 0 280 80"><g stroke="#444" fill="none" stroke-linecap="round"><path d="M30,55 C12,42 22,22 38,28 C50,32 55,48 45,58 C35,68 18,60 14,46 C10,32 25,18 42,22 C65,28 85,65 118,68 C128,69 135,62 135,50 C135,38 124,32 115,38" stroke-width="3"/><path d="M250,55 C268,42 258,22 242,28 C230,32 225,48 235,58 C245,68 262,60 266,46 C270,32 255,18 238,22 C215,28 195,65 162,68 C152,69 145,62 145,50 C145,38 156,32 165,38" stroke-width="3"/></g></svg>'
};

// פיצול מחרוזת מילים לשני חצאים (עבור פיצול שם הספר בין ימין לשמאל)
function splitTextInHalf(text, part) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= 1) return part === 'first' ? text : '';
    const mid = Math.ceil(words.length / 2);
    return part === 'first' ? words.slice(0, mid).join(' ') : words.slice(mid).join(' ');
}

function renderHeaderSectionHTML(type, customText, h1Title, h2Title, h3Title, bookTitle, tocFallback, contextExtra = {}) {
    const { simanBadge = '', rawH2WithoutSiman = '', h4Title = '', pageNum = '', firstLastWords = '' } = contextExtra;
    
    if (type === 'h1') return h1Title || tocFallback || '';
    if (type === 'h2') return h2Title || tocFallback || '';
    if (type === 'h2_with_siman') return (simanBadge ? simanBadge + ' - ' : '') + (rawH2WithoutSiman || h2Title || tocFallback || '');
    if (type === 'h2_without_siman') return rawH2WithoutSiman || h2Title || tocFallback || '';
    if (type === 'siman_alone') return simanBadge || '';
    if (type === 'h3') return h3Title || '';
    if (type === 'h4') return h4Title || '';
    if (type === 'book_title') return bookTitle || '';
    if (type === 'book_title_split_r') return splitTextInHalf(bookTitle, 'first');
    if (type === 'book_title_split_l') return splitTextInHalf(bookTitle, 'second');
    if (type === 'page_number') return pageNum ? String(pageNum) : '';
    if (type === 'first_word_last_word') return firstLastWords || '';
    if (type === 'custom') return customText || '';
    if (HEADER_ORNAMENTS[type]) return HEADER_ORNAMENTS[type];
    if (EXTERNAL_ALL_ORNAMENTS[type]) return EXTERNAL_ALL_ORNAMENTS[type];
    if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-hdr-c-img') ? document.getElementById('data-hdr-c-img').value : '';
        return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 100%; object-fit: contain; vertical-align: middle;" />` : '';
    }
    return '';
}

/* ==========================================================================
   2. עיטורי סיום פרק ועיטורי כותרות עם שליטה מלאה במידות
   ========================================================================== */
const SECTION_DIVIDERS = {
    pyramid: '<div class="divider-pyramid" style="text-align: center; line-height: 0.9;"><div style="font-size: 10pt; letter-spacing: 6px;">❖ ❖ ❖</div><div style="font-size: 9pt; letter-spacing: 5px; margin-top: 3px;">❖ ❖</div><div style="font-size: 8pt; margin-top: 3px;">❖</div></div>',
    spear: '<svg style="width: 200px; height: 22px; margin: auto; display: block;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/><path d="M165,20 C165,22 150,24 130,24 C95,24 55,21 30,20 C55,19 95,16 130,16 C150,16 165,18 165,20 Z" fill="#fff"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/><path d="M235,20 C235,22 250,24 270,24 C305,24 345,21 370,20 C345,19 305,16 270,16 C250,16 235,18 235,20 Z" fill="#fff"/></svg>',
    swash: '<svg style="width: 170px; height: 18px; fill: #111; margin: auto; display: block;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>',
    flourish: '<svg style="width: 140px; height: 45px; fill: #000; margin: auto; display: block;" viewBox="0 0 240 90"><path d="M110,48 C105,44 92,30 82,30 C68,30 55,42 42,42 C30,42 22,32 22,22 C22,12 32,5 45,5 C60,5 72,18 78,28 C82,20 88,10 100,10 C108,10 114,16 114,24 C114,35 102,44 88,44 C72,44 58,35 48,22 C42,28 35,35 25,48 C15,62 10,72 20,82 C30,90 48,85 62,72 C78,58 92,54 110,48 Z"/><path d="M130,48 C135,44 148,30 158,30 C172,30 185,42 198,42 C210,42 218,32 218,22 C218,12 208,5 195,5 C180,5 168,18 162,28 C158,20 152,10 140,10 C132,10 126,16 126,24 C126,35 138,44 152,44 C168,44 182,35 192,22 C198,28 205,35 215,48 C225,62 230,72 220,82 C210,90 192,85 178,72 C162,58 148,54 130,48 Z"/></svg>'
};

function getSectionDividerHTML(type) {
    if (!type || type === 'none') return '';
    const userW = document.getElementById('dim-secdiv-w')?.value;
    const userH = document.getElementById('dim-secdiv-h')?.value;
    const dimStyle = (userW ? `width: ${userW}; ` : '') + (userH ? `height: ${userH}; max-height: ${userH}; ` : '');

    let content = '';
    if (SECTION_DIVIDERS[type]) {
        content = SECTION_DIVIDERS[type];
    } else if (EXTERNAL_ALL_ORNAMENTS[type]) {
        content = EXTERNAL_ALL_ORNAMENTS[type];
    } else if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-sec-div-img')?.value || '';
        if (imgSrc) {
            content = `<img src="${imgSrc}" style="max-width: 100%; max-height: 45px; margin: auto; display: block; object-fit: contain; ${dimStyle}" />`;
        }
    }
    if (!content) return '';
    return `<div class="sec-divider-wrap" style="grid-column: 3 / 6; text-align: center; margin: 16px auto 6px auto; ${dimStyle ? 'display:flex; justify-content:center; align-items:center;' : ''}">${content}</div>`;
}

function getHeadingOrnamentHTML(type, isTop = false, isH2 = true) {
    if (!type || type === 'none') return '';
    const flipStyle = isTop ? 'transform: scaleY(-1);' : '';
    
    // שליטה במידות מותאמות אישית
    const prefix = isH2 ? (isTop ? 'dim-h2-top' : 'dim-h2-btm') : 'dim-generic';
    const userW = document.getElementById(`${prefix}-w`)?.value;
    const userH = document.getElementById(`${prefix}-h`)?.value;
    const fitToText = isH2 && document.getElementById('h2-orn-fit-text')?.checked;
    
    let sizeStyle = '';
    if (userW) sizeStyle += `width: ${userW}; `;
    if (userH) sizeStyle += `height: ${userH}; max-height: ${userH}; `;
    if (fitToText) sizeStyle += `width: 100% !important; max-width: 100% !important; `;

    let inner = '';
    if (ORNAMENTS_UD[type]) {
        inner = `<div class="ornament-svg-inner" style="display:inline-flex; align-items:center; justify-content:center; ${flipStyle} ${sizeStyle}">${ORNAMENTS_UD[type].svg}</div>`;
    } else if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-sec-div-img')?.value || '';
        if (imgSrc) {
            inner = `<img src="${imgSrc}" style="max-width: 200px; max-height: 35px; margin: auto; display: block; object-fit: contain; ${flipStyle} ${sizeStyle}" />`;
        }
    }
    if (!inner) return '';
    const fitClass = fitToText ? ' fit-heading-text' : '';
    return `<div class="heading-ornament-wrap${fitClass}" style="text-align:center; margin: 6px auto;">${inner}</div>`;
}

function renderSideOrnamentHTML(styleKey, isLeft = false, context = 'h3') {
    if (!styleKey || styleKey === 'none') return '';
    const flipStyle = isLeft ? 'transform: scaleX(-1);' : '';
    
    const prefix = context === 'note' ? 'dim-note-side' : 'dim-h3-side';
    const userW = document.getElementById(`${prefix}-w`)?.value;
    const userH = document.getElementById(`${prefix}-h`)?.value;
    let sizeStyle = '';
    if (userW) sizeStyle += `width: ${userW}; `;
    if (userH) sizeStyle += `height: ${userH}; max-height: ${userH}; `;

    if (ORNAMENTS_LR[styleKey]) {
        return `<span class="side-ornament-wrap" style="display:inline-flex; align-items:center; ${flipStyle} ${sizeStyle}">${ORNAMENTS_LR[styleKey].svg}</span>`;
    } else if (styleKey === 'custom_img') {
        const imgSrc = document.getElementById('data-hdr-c-img')?.value || document.getElementById('data-sec-div-img')?.value || '';
        return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 60px; object-fit: contain; vertical-align: middle; ${flipStyle} ${sizeStyle}" />` : '';
    }
    return '';
}

/* ==========================================================================
   3. קווי מפריד להערות שוליים (כולל "ללא", קו קצר, קו חצי וקו כפול)
   ========================================================================== */
const NOTE_RULE_GLYPHS = {
    dots: '◦◦◦',
    sparkle: '❖❖❖',
    star: '✧✧✧',
    diamond: '♦♦♦'
};

function buildNoteRuleElement() {
    const sel = document.getElementById('note-rule-style');
    const style = sel ? sel.value : 'plain';
    const rule = document.createElement('div');
    
    if (style === 'none') {
        rule.style.display = 'none';
        return rule;
    }
    if (style === 'plain') {
        rule.className = 'note-rule-plain';
        return rule;
    }
    if (style === 'short_right') {
        rule.className = 'note-rule-short-right';
        return rule;
    }
    if (style === 'half') {
        rule.className = 'note-rule-half';
        return rule;
    }
    if (style === 'double') {
        rule.className = 'note-rule-double';
        return rule;
    }
    
    rule.className = 'note-rule-decorative';
    const segR = document.createElement('span');
    segR.className = 'rule-seg';
    const mid = document.createElement('span');
    mid.className = 'rule-glyphs';
    mid.textContent = NOTE_RULE_GLYPHS[style] || '';
    const segL = document.createElement('span');
    segL.className = 'rule-seg';
    rule.appendChild(segR);
    rule.appendChild(mid);
    rule.appendChild(segL);
    return rule;
}

/* ==========================================================================
   4. ערכות נושא מובנות לשערים
   ========================================================================== */
const BUILTIN_SHAAR_THEMES = {
    builtin_1: {
        mainHTML: `
      <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
      <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
    `,
        backHTML: `<div class="back-shaar-bg-left"></div>`,
        backStyle: `position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;`,
        subHTML: `<div class="sub-shaar-bg-right"></div>`,
        subStyle: `position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;`
    },
    builtin_2: {
        mainHTML: `
      <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
      <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
    `,
        backHTML: `<div class="back-shaar-bg-left"></div>`,
        backStyle: `position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;`,
        subHTML: `<div class="sub-shaar-bg-right"></div>`,
        subStyle: `position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;`
    },
    builtin_3: {
        mainHTML: `
      <div class="m3-wavy-band"></div>
      <div class="m3-panel">
        <svg class="m3-corner tr" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
        <svg class="m3-corner tl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
        <svg class="m3-corner br" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
        <svg class="m3-corner bl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
      </div>
    `,
        backHTML: `<div class="back-shaar-bg-left"></div>`,
        backStyle: `position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;`,
        subHTML: `<div class="sub-shaar-bg-right"></div>`,
        subStyle: `position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;`
    }
};

function getShaarBoxEditorHTML(shaarType) {
    return `
    <div class="shaar-drag-bar" title="גרור להזזת מיקום תיבת הטקסט">✥ הזז תיבה</div>
    <div class="shaar-resize-handle handle-t" data-handle="t"></div>
    <div class="shaar-resize-handle handle-b" data-handle="b"></div>
    <div class="shaar-resize-handle handle-r" data-handle="r"></div>
    <div class="shaar-resize-handle handle-l" data-handle="l"></div>
    <div class="shaar-resize-handle handle-tr" data-handle="tr"></div>
    <div class="shaar-resize-handle handle-tl" data-handle="tl"></div>
    <div class="shaar-resize-handle handle-br" data-handle="br"></div>
    <div class="shaar-resize-handle handle-bl" data-handle="bl"></div>
  `;
}

/* ============================================================
   5. פונקציות יצירת דפי השער (כולל שליטה בממדים אישיים)
   ============================================================ */
function renderMainShaar(container, themeId) {
    const page = document.createElement('div');
    page.className = `a4-page main-shaar-page`;
    page.setAttribute('data-page-index', '1');

    const title = document.getElementById('inp-book-title')?.value || "שם הספר";
    const subtitle = document.getElementById('inp-book-subtitle')?.value || "";
    const desc = document.getElementById('inp-book-desc')?.value || "";
    const sections = document.getElementById('inp-book-sections')?.value || "";
    const author = document.getElementById('inp-book-author')?.value || "";
    const year = document.getElementById('inp-book-year')?.value || "";

    let frameHTML = '';
    let boxStyle = '';
    const customTheme = (typeof customThemes !== 'undefined') ? customThemes.find(t => t.id === themeId) : null;

    const selMain = document.getElementById('select-shaar-main')?.value || 'theme_default';

    if (selMain !== 'theme_default') {
        if (EXTERNAL_SHAAR_ASSETS.main[selMain]) {
            frameHTML = EXTERNAL_SHAAR_ASSETS.main[selMain];
        } else if (BUILTIN_SHAAR_THEMES[selMain]) {
            frameHTML = BUILTIN_SHAAR_THEMES[selMain].mainHTML;
        }
    } else if (customTheme && customTheme.mainShaar && customTheme.mainShaar.svgData) {
        frameHTML = `<img class="custom-bg-img" src="${customTheme.mainShaar.svgData}" alt="שער ראשי">`;
    } else if (BUILTIN_SHAAR_THEMES[themeId]) {
        frameHTML = BUILTIN_SHAAR_THEMES[themeId].mainHTML;
    }

    // קריאת שולי תיבת הטקסט: קודם כל כיוונון שמור ספציפית לתמונה הזו, אחר-כך
    // השדות הגלובליים של בונה-הערכות (למי שבתהליך יצירת ערכה חדשה), ורק
    // לבסוף ברירת המחדל של הערכה/הכללית.
    const savedStyle = getSavedShaarBoxStyle('main');
    const uTop = document.getElementById('builder-main-top')?.value;
    const uBottom = document.getElementById('builder-main-bottom')?.value;
    const uRight = document.getElementById('builder-main-right')?.value;
    const uLeft = document.getElementById('builder-main-left')?.value;

    if (savedStyle) {
        boxStyle = savedStyle;
    } else if (uTop || uBottom || uRight || uLeft) {
        boxStyle = `position:absolute; top:${uTop || 20}mm; bottom:${uBottom || 16}mm; right:${uRight || 15}mm; left:${uLeft || 15}mm;`;
    } else if (customTheme && customTheme.mainShaar) {
        const m = customTheme.mainShaar;
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
    } else {
        boxStyle = `position:absolute; top:20mm; bottom:16mm; right:15mm; left:15mm;`;
    }

    page.innerHTML = `
    ${frameHTML}
    <div class="shaar-main-content theme-bounded-content" data-shaar-type="main" style="${boxStyle}">
      ${getShaarBoxEditorHTML('main')}
      <div>
        <div class="bsd-header">בס"ד</div>
        <div class="sefer-label"></div>
        <div class="book-title-main">${title}</div>
        <div class="book-subtitle">${subtitle}</div>
        <svg style="width: 180px; height: 24px; margin: 12px auto;" viewBox="0 0 400 40">
          <circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/>
          <path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/>
          <path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/>
        </svg>
      </div>
      <div class="book-description">${desc}</div>
      <div class="book-sections-summary">${sections}</div>
      <div class="author-block"><br><span class="author-name">${author}</span></div>
      <div class="publication-footer">${year}</div>
    </div>
  `;
    container.appendChild(page);
}

function renderBackShaar(container, themeId) {
    const page = document.createElement('div');
    page.className = 'a4-page back-shaar-page';
    page.setAttribute('data-page-index', 'גב-שער');

    const title = document.getElementById('inp-book-title')?.value || "שם הספר";
    const sections = document.getElementById('inp-book-sections')?.value || "";
    const author = document.getElementById('inp-book-author')?.value || "";
    const year = document.getElementById('inp-book-year')?.value || "";

    let bgHTML = '';
    let boxStyle = '';
    const customTheme = (typeof customThemes !== 'undefined') ? customThemes.find(t => t.id === themeId) : null;

    const selBack = document.getElementById('select-shaar-back')?.value || 'theme_default';

    if (selBack !== 'theme_default') {
        if (EXTERNAL_SHAAR_ASSETS.back[selBack]) {
            bgHTML = EXTERNAL_SHAAR_ASSETS.back[selBack];
        } else if (BUILTIN_SHAAR_THEMES[selBack]) {
            bgHTML = BUILTIN_SHAAR_THEMES[selBack].backHTML;
        }
    } else if (customTheme && customTheme.backShaar && customTheme.backShaar.svgData) {
        bgHTML = `<img class="custom-bg-img" src="${customTheme.backShaar.svgData}" alt="שער אחורי">`;
    } else if (BUILTIN_SHAAR_THEMES[themeId]) {
        bgHTML = BUILTIN_SHAAR_THEMES[themeId].backHTML;
    } else {
        bgHTML = `<div class="back-shaar-bg-left"></div>`;
    }

    const savedStyleBack = getSavedShaarBoxStyle('back');
    const uTop = document.getElementById('builder-back-top')?.value;
    const uBottom = document.getElementById('builder-back-bottom')?.value;
    const uRight = document.getElementById('builder-back-right')?.value;
    const uLeft = document.getElementById('builder-back-left')?.value;

    if (savedStyleBack) {
        boxStyle = savedStyleBack;
    } else if (uTop || uBottom || uRight || uLeft) {
        boxStyle = `position:absolute; top:${uTop || 22}mm; bottom:${uBottom || 18}mm; right:${uRight || 15}mm; left:${uLeft || 95}mm;`;
    } else if (customTheme && customTheme.backShaar) {
        const m = customTheme.backShaar;
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
    } else if (BUILTIN_SHAAR_THEMES[themeId]) {
        boxStyle = BUILTIN_SHAAR_THEMES[themeId].backStyle;
    } else {
        boxStyle = `position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;`;
    }

    page.innerHTML = `
    ${bgHTML}
    <div class="theme-bounded-content" data-shaar-type="back" style="${boxStyle}">
      ${getShaarBoxEditorHTML('back')}
      <div>
        <div style="font-size: 13pt; font-weight: 700; margin-bottom: 8px;">כל הזכויות שמורות</div>
        <div style="font-size: 10.5pt; line-height: 1.6; max-width: 90%; margin: 10px auto; color: #333;">
          אין לשכפל, להעתיק, לצלם, לתרגם, לאחסן במאגר מידע, למסור או לקלוט בכל דרך או אמצעי אלקטרוני, אופטי או מכני אחר כל חלק שהוא מספר זה, ללא רשות מפורשת בכתב מבעל הזכויות.
        </div>
      </div>
      <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 12px 10px; width: 85%;">
        <div style="font-weight: 700; font-size: 11pt; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 10pt; color: #555;">${sections}</div>
        <div style="font-size: 10.5pt; font-weight: 700; margin-top: 6px;">${author}</div>
      </div>
      <div style="font-size: 10pt; color: #666;">${year}</div>
    </div>
  `;
    container.appendChild(page);
}

function renderSubShaar(container, token, themeId) {
    const page = document.createElement('div');
    page.className = 'a4-page sub-shaar-page';
    page.setAttribute('data-token-id', token.id);
    page.id = `heading-tok-${token.id}`;

    let titleMain = token.text;
    let titleSub = '';

    if (token.text.includes('-') || token.text.includes('–') || token.text.includes('—')) {
        const parts = token.text.split(/[-–—]/);
        titleMain = parts[0].trim();
        titleSub = parts.slice(1).join(' - ').trim();
    }

    let bgHTML = '';
    let boxStyle = '';
    const customTheme = (typeof customThemes !== 'undefined') ? customThemes.find(t => t.id === themeId) : null;

    const selSub = document.getElementById('select-shaar-sub')?.value || 'theme_default';

    if (selSub !== 'theme_default') {
        if (EXTERNAL_SHAAR_ASSETS.sub[selSub]) {
            bgHTML = EXTERNAL_SHAAR_ASSETS.sub[selSub];
        } else if (BUILTIN_SHAAR_THEMES[selSub]) {
            bgHTML = BUILTIN_SHAAR_THEMES[selSub].subHTML;
        }
    } else if (customTheme && customTheme.subShaar && customTheme.subShaar.svgData) {
        bgHTML = `<img class="custom-bg-img" src="${customTheme.subShaar.svgData}" alt="שער משנה">`;
    } else if (BUILTIN_SHAAR_THEMES[themeId]) {
        bgHTML = BUILTIN_SHAAR_THEMES[themeId].subHTML;
    } else {
        bgHTML = `<div class="sub-shaar-bg-right"></div>`;
    }

    const savedStyleSub = getSavedShaarBoxStyle('sub');
    const uTop = document.getElementById('builder-sub-top')?.value;
    const uBottom = document.getElementById('builder-sub-bottom')?.value;
    const uRight = document.getElementById('builder-sub-right')?.value;
    const uLeft = document.getElementById('builder-sub-left')?.value;

    if (savedStyleSub) {
        boxStyle = savedStyleSub;
    } else if (uTop || uBottom || uRight || uLeft) {
        boxStyle = `position:absolute; top:${uTop || 20}mm; bottom:${uBottom || 20}mm; right:${uRight || 95}mm; left:${uLeft || 15}mm;`;
    } else if (customTheme && customTheme.subShaar) {
        const m = customTheme.subShaar;
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
    } else if (BUILTIN_SHAAR_THEMES[themeId]) {
        boxStyle = BUILTIN_SHAAR_THEMES[themeId].subStyle;
    } else {
        boxStyle = `position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;`;
    }

    page.innerHTML = `
    ${bgHTML}
    <div class="theme-bounded-content" data-shaar-type="sub" style="${boxStyle} justify-content:center;">
      ${getShaarBoxEditorHTML('sub')}
      <div class="sefer-label"></div>
      <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
      ${titleSub ? `
        <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
          <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
        </svg>
        <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
    </div>
  `;
    container.appendChild(page);
}

/* ==========================================================================
   6. רקעים מותאמים לעמודי תוכן
   ========================================================================== */
function getContentBgCSS(roleKey) {
    const modeEl = document.getElementById('cbg-' + roleKey + '-mode');
    if (!modeEl) return '';
    const mode = modeEl.value;
    if (mode === 'color') {
        const c = document.getElementById('cbg-' + roleKey + '-color');
        return c ? `background-color:${c.value};background-image:none;` : '';
    }
    if (mode === 'texture') {
        return `background-color:#fdfcf6;background-image:url("${CBG_TEXTURE_SVG}");background-repeat:repeat;`;
    }
    if (mode === 'image') {
        const imgEl = document.getElementById('data-cbg-' + roleKey + '-img');
        const opEl = document.getElementById('cbg-' + roleKey + '-opacity');
        const img = imgEl ? imgEl.value : '';
        if (!img) return '';
        const op = opEl ? (parseInt(opEl.value, 10) / 100) : 0.15;
        const fade = 1 - op;
        return `background-image:linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${img}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
    }
    return '';
}

function applyContentBg(pageEl, roleKey) {
    const css = getContentBgCSS(roleKey);
    if (css) pageEl.style.cssText += css;
}

/* ==========================================================================
   רישום דינמי עבור קובצי JSON חיצוניים
   ========================================================================== */
function registerExternalShaar(typeKey, id, name, svgContent) {
    registerExternalShaarAsset(typeKey, id, name, svgContent);
    if (!BUILTIN_SHAAR_THEMES[id]) {
        BUILTIN_SHAAR_THEMES[id] = {
            mainHTML: '',
            backHTML: '',
            backStyle: 'position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;',
            subHTML: '',
            subStyle: 'position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;'
        };
    }
    if (typeKey === 'main') BUILTIN_SHAAR_THEMES[id].mainHTML = svgContent;
    if (typeKey === 'sub') BUILTIN_SHAAR_THEMES[id].subHTML = svgContent;
    if (typeKey === 'back') BUILTIN_SHAAR_THEMES[id].backHTML = svgContent;
}

function registerExternalHeader(id, svgContent) {
    HEADER_ORNAMENTS[id] = svgContent;
    registerExternalAllOrnament(id, svgContent);
}

function registerExternalDivider(id, svgContent) {
    SECTION_DIVIDERS[id] = `<div style="grid-column: 3 / 6; text-align: center; margin: 16px auto 6px auto; max-width: 50%;">${svgContent}</div>`;
    registerExternalAllOrnament(id, svgContent);
}

function registerExternalNoteRule(id, svgContent) {
    NOTE_RULE_GLYPHS[id] = svgContent;
}