---
title: "חלוקת קוד וארגון פרויקט מודולרי"
date: 2026-09-07
version: V21
type: transcripts
source: Gemini (Google AI Studio)
---


# חלוקת קוד וארגון פרויקט מודולרי

> שיחת Google AI Studio (Gemini) — מודל: `models/gemini-3.8-flash`

---

## פנייה 1: [קובץ מצורף מ-Google Drive — מזהה: 1ekhEQ-8ZneZ5txF-8K7yw6-SupluqA04]

[קובץ מצורף מ-Google Drive — מזהה: 1ekhEQ-8ZneZ5txF-8K7yw6-SupluqA04]

---

## פנייה 2: יש לי כאן קובץ HTML ארוך מדי האם תוכל לחלקו לכמה קבצים (HTML, CSS, JS, שישמרו…

יש לי כאן קובץ HTML ארוך מדי האם תוכל לחלקו לכמה קבצים (HTML, CSS, JS, שישמרו בתקייה אחת), 
עדיף לחלק את פונקציות העימוד שבJS לקובץ JS נפרד.
וכן עדיף לחלק את האלמנטים (שערים ראשי\משנה, עיטורי כותרת עליונה וסיום פרק, ומפרידי הערות שולים) לקובץ נפרד ולהכין בקוד דרך קלה להטמיע אלמנטים נוספים (כקוד SVG) ע"י הדבקה במקומות מוגדרים.
אבל אני מתריע בך! היזהר מאוד שלא יהרס שום דבר בתהליך החלוקה
עבודה רבה וקשה נעשתה להגיע לתוצאה הנ"ל.
הגש את סוגי הקבצים בהודעות נפרדות, הודעה ראשונה - HTML, שניה - CSS, שלישית  - JS.

---

### 🤖 תגובה 1: Defining the Problem I'm currently focused on defining the core goal: a…

**Defining the Problem**

I'm currently focused on defining the core goal: a monolithic HTML file that delivers a professional Torah typesetting web app for A4 format. I’m thinking about what the user needs, focusing on the functionality already in place.


**Decomposing the Monolith**

I'm now diving deep into the code, starting with an analysis of the monolithic HTML structure. The goal is a clean split into HTML, CSS, and JS files, which will be submitted separately. I'm focusing on the current HTML structure, and I'm moving toward identifying key components for separation, all the while taking extreme caution to avoid regressions or disruptions.


**Analyzing the Architecture**

I've been looking closely at the structure of the HTML, noticing that there's an inline style on the `<html>` tag itself! Inside, the `<head>` is packed with meta tags, the title, and Google Fonts imported via `<style>`. The `<body>` has a sidebar with controls, a resizer, a preview pane, a measuring box, and a single `<script>` tag for the whole application.

The CSS is equally dense, starting with Google Fonts and a root with custom properties. There are resets, layout styles for the sidebar, panels, tables, buttons, and A4 page styles, which include headers and footers. The Shaar themes have several built-in styles and background patterns. I see general and detailed TOC styles and body styles that include 2-column and 1-column layouts, headers, drop words, side notes, and footnotes.


**Dissecting the JavaScript**

I am now focusing on the JavaScript section, identifying its functional modules. There's logic for resizing, background management, custom theme handling, and an extension system. Also, I see footnote and endnote management, image upload handlers, and font loading. The save template feature is present. There are also Hebrew gematria conversions, grid updates, and updates for CSS properties. I am also identifying renderers for headers, dividers, and decorative SVGs.


**Mapping the Typesetting Engine**

I'm now zeroing in on the typesetting engine functions. I've broken down `typesetDocument()`, and the metadata parsing. I am looking at how `getLinesFromParagraph()` leverages the measuring box, along with functions for vertical justification and column balancing. I need to handle drop words, page layout, and note positioning, along with TOC and text area synchronization. Finally, I must ensure the `window.onload` properly initializes and triggers typesetting.

**Structuring the Separation**

The separation strategy is coalescing. I'm finalizing the file breakdown: `index.html` as the orchestrator, `style.css` for all styles, and `decorations.js` to manage decorative assets, SVG templates, and Shaar templates. I want to build a centralized registry.


**Refining the HTML**

I'm now integrating the recent update: I'm splitting the monolith based on file type, starting with HTML. This first output will be just the HTML file. It will reference `style.css`, `decorations.js`, `typesetter.js`, and `app.js` using `<link>` and `<script>` tags, respectively, ensuring a clear and organized separation and meeting the user's specific request.


**Confirming the JavaScript Split**

I've confirmed the JavaScript split aligns perfectly with the user's feedback. I am building around the three-file structure: `decorations.js` for decorative elements, `typesetter.js` for typesetting functions, and `app.js` for user interface and interaction. I am now double-checking the HTML structure.


**Preserving the Defaults**

I'm now focusing on the HTML `<html>` tag and its inline style attribute. My concern is the default CSS variables defined there. I've decided to keep them in the HTML exactly as is, to ensure a 100% identical initial render until the JavaScript updates them. Ideally, CSS `:root` will provide defaults, and the HTML attribute will remain for safety or be cleaned up safely later. I've ensured `<head>` contains the necessary meta tags and links to `style.css`. The `<body>` includes `#sidebar`, `#resizer`, `#preview-pane`, `#book-container`, and `#measuring-box`.


**Validating the Event Handlers**

I'm verifying the current event handlers within the sidebar. I've found multiple `onclick` and `onchange` attributes with functions called directly from the HTML, which means these must exist at the global scope, a vital point when splitting the files! I'm double-checking every element and confirming nothing has been accidentally omitted or hidden. I'm now drafting a clear explanation of the separation plan for the user, with `index.html`, `style.css`, and a third component.

---

### 🤖 תגובה 2: הנה החלוקה המלאה של המערכת. כדי לשמור על יציבות של 100% ולא לפגוע באף פרט מתוך…

הנה החלוקה המלאה של המערכת. כדי לשמור על יציבות של 100% ולא לפגוע באף פרט מתוך העבודה המורכבת שנעשתה, תוכנית הקבצים כוללת 5 קבצים שישבו יחד באותה תיקייה:

1. **`index.html`** – מבנה הדף, השדות והבקרים (מוגש בהודעה זו).
2. **`style.css`** – כל הגדרות העיצוב, המשתנים, גריד העמודים ותצוגת ההדפסה.
3. **`decorations.js`** – קובץ נכסים ועיטורים ייעודי: מרכז את כל קוד ה-SVG של השערים, מפרידי הפרקים, הכותרות העליונות וקווי ההערות בתוך אובייקטים מסודרים, עם הסבר מובנה כיצד להוסיף עיטורים חדשים בהדבקה בלבד.
4. **`typesetter.js`** – מנוע העימוד הטהור: מדידת שורות, איזון טורים, חיתוך פסקאות, חלון מילה ראשונה, הערות שוליים/סיום ובניית דפי A4 ותוכן עניינים.
5. **`app.js`** – ניהול ממשק המשתמש: שינוי גודל הסרגל (Resizer), טעינת גופני מערכת, סנכרון סמן עריכה, ייבוא תוספים ושמירת תבנית.

---

### קובץ 1: `index.html`

שמור קובץ זה בשם `index.html`:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>מערכת עימוד תורנית מקצועית לדפי A4</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">

      <!-- פאנל 1: שערים -->
      <div class="panel-static">
        <div class="panel-header">👑 בחירת ערכת נושא לשערי הספר</div>
        
        <div class="inline-cfg-row" style="margin-bottom: 6px;">
          <label>ערכת נושא פעילה:</label>
          <select id="active-theme-select" style="flex:1;" onchange="typesetDocument()">
            <optgroup label="ערכות מובנות">
              <option value="builtin_1" selected="selected">1. דמסק ושיש מרכזי</option>
              <option value="builtin_2">2. תחרת סלסולים כפולה</option>
              <option value="builtin_3">3. קרנות וילנא וגיליושה</option>
            </optgroup>
            <optgroup id="custom-themes-optgroup" label="ערכות שהוטמעו בקובץ">
            </optgroup>
          </select>
        </div>

        <div style="margin-bottom: 6px; display:flex; gap:12px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked" onchange="typesetDocument()"> שער ראשי</label>
          <label style="font-size: 8.5pt; font-weight: 700;" title="מציג שער אחורי בעמוד 2 (גב השער הראשי)"><input type="checkbox" id="show-back-shaar" onchange="typesetDocument()"> שער אחורי (גב השער)</label>
        </div>

        <div class="inline-cfg-row">
          <label>שם הספר:</label>
          <input type="text" id="inp-book-title" value="שם הספר" placeholder="שם הספר (כותרת ראשית)">
          <select id="f-sh-title" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-sh-title" class="size-input" value="46">
        </div>
        <div class="inline-cfg-row">
          <label>נושא / משנה:</label>
          <input type="text" id="inp-book-subtitle" value="נושא הספר מונסח בתמציות" placeholder="נושא / כותרת משנה">
          <select id="f-sh-sub" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-sub" class="size-input" value="21">
        </div>
        <div class="inline-cfg-row">
          <label>נושא מפורט:</label>
          <input type="text" id="inp-book-desc" value="נושא הספר בפרטות ובנוסח ארוך יותר" placeholder="נושא מפורט / תיאור החיבור">
          <select id="f-sh-desc" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-desc" class="size-input" value="12">
        </div>
        <div class="inline-cfg-row">
          <label>פרטי מהדורא:</label>
          <input type="text" id="inp-book-sections" value="פרטי מהדורה | פרטי מהדורה" placeholder="פרטי מהדורא / חלקים">
          <select id="f-sh-sec" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-sec" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>שם המחבר:</label>
          <input type="text" id="inp-book-author" value="שם המחבר" placeholder="שם המחבר">
          <select id="f-sh-author" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-author" class="size-input" value="15">
        </div>
        <div class="inline-cfg-row">
          <label>מקום ושנה:</label>
          <input type="text" id="inp-book-year" value="מקום ההוצאה | שנת ההוצאה" placeholder="מקום ושנת הוצאה">
          <select id="f-sh-year" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-year" class="size-input" value="12">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div class="inline-cfg-row">
            <label>עיטור סיום פרק:</label>
            <select id="section-divider-style" style="flex:1;" onchange="document.getElementById('row-sec-div-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'; typesetDocument();">
              <option value="pyramid">1. פירמידת וילנא (❖ ❖ ❖)</option>
              <option value="spear" selected="selected">2. רומח מחודד עם טבעת (SVG)</option>
              <option value="swash">3. שושנתא וילנאית (SVG)</option>
              <option value="flourish">4. סלסול תורני כפול (SVG)</option>
              <option value="custom_img">5. תמונת עיטור אישית</option>
              <option value="none">ללא עיטור</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sec-div-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ עיטור פרק:</label>
            <input type="file" id="file-sec-div-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>

      <!-- פאנל 2: ערכת נושא חדשה -->
      <div class="panel-static">
        <div class="panel-header" style="cursor:pointer;" onclick="togglePanelBody('new-theme-panel-body')">
          🎨 יצירת והטמעת ערכת נושא חדשה (SVG) <span style="font-size:8pt; font-weight:normal; float:left;">▼ פתח/סגור</span>
        </div>
        <div id="new-theme-panel-body">
          <div class="inline-cfg-row" style="margin-bottom: 6px;">
            <label style="color:#1e3a8a;">שם הערכה:</label>
            <input type="text" id="builder-theme-name" placeholder="הזן שם לערכת הנושא החדשה...">
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">🏛️ 1. שער ראשי (מרכז הדף):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-main-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-main-svg')">
              <input type="hidden" id="data-builder-main-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-main-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-main-bottom" value="16" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-main-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-main-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📖 2. שער אחורי (טור ימני / גב השער):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-back-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-back-svg')">
              <input type="hidden" id="data-builder-back-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-back-top" value="22" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-back-bottom" value="18" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-back-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים משמאל תוחמים את הטור הימני">שמאל (mm):</label><input type="number" id="builder-back-left" value="95" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📜 3. שער משנה (טור שמאלי / פותח חלק):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-sub-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-sub-svg')">
              <input type="hidden" id="data-builder-sub-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-sub-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-sub-bottom" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים מימין תוחמים את הטור השמאלי">ימין (mm):</label><input type="number" id="builder-sub-right" value="95" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-sub-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <button class="btn-load-fonts" style="width:100%; padding:6px; background:#1e3a8a; margin-top:4px;" onclick="addNewCustomTheme()">➕ הטמע ערכת נושא זו בקובץ</button>
          
          <div id="custom-themes-list" style="margin-top:8px;"></div>
        </div>
      </div>

      <!-- פאנל ייבוא תוספים -->
      <div class="panel-static">
        <div class="panel-header">🧩 ייבוא תוספים (סוגי עמוד / סגנונות טקסט)</div>
        <div class="inline-cfg-row">
          <label>סוג עמוד:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handlePageTypeImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>סגנון טקסט:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handleTextStyleImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>תמונה כעמוד:</label>
          <input type="file" accept="image/*" style="flex:1;font-size:8pt;" onchange="handleImagePageImportFile(event)">
        </div>
      </div>
      <div id="ext-imports-container"></div>

      <!-- פאנל הגדרות הערות מורחב ומדויק -->
      <div class="panel-static">
        <div class="panel-header">📝 הגדרות הערות (שוליים / סיום)</div>

        <div style="font-weight:700; font-size:8pt; margin: 2px 0 3px 0; color:#1e3a8a;">📌 הערות שוליים (בתחתית העמוד):</div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="fn-delim-open" value="[" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" oninput="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="fn-delim-close" value="]" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" oninput="typesetDocument()">
          </div>
        </div>

        <div style="font-weight:700; font-size:8pt; margin: 6px 0 3px 0; color:#1e3a8a; border-top:1px dashed #ddd; padding-top:4px;">📚 הערות סיום (מרוכזות בסוף חלק):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="en-line-prefix" value="הערת סיום -" placeholder="למשל: הערת סיום -" oninput="typesetDocument()">
        </div>

        <div style="border-top:1px dashed #ddd; margin-top:6px; padding-top:4px;"></div>
        <div class="inline-cfg-row"><label>סגנון מספור:</label>
          <select id="note-numbering-style" onchange="typesetDocument()">
            <option value="gematria" selected="selected">אותיות עבריות (א, ב, ג...)</option>
            <option value="decimal">ספרות (1, 2, 3...)</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>סוג סימון בטקסט:</label>
          <select id="note-marker-type" onchange="typesetDocument()">
            <option value="super" selected="selected">כתב עילי</option>
            <option value="normal">רגיל (על השורה)</option>
            <option value="sub">כתב תחתי</option>
            <option value="brackets">בסוגריים מרובעים [1]</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>גודל סימון בטקסט:</label><input type="number" id="note-marker-size" value="8" class="size-input" oninput="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>גודל מס' ברשימה:</label><input type="number" id="note-listing-num-size" value="8" class="size-input" oninput="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>מפריד אחרי מספר:</label><input type="text" id="note-num-separator" value="." style="flex:0 0 40px;" oninput="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>קו מפריד (שוליים):</label>
          <select id="note-rule-style" onchange="typesetDocument()">
            <option value="plain" selected="selected">קו רגיל</option>
            <option value="dots">קו + עיגולים ◦◦◦</option>
            <option value="sparkle">קו + ניצוץ ❖❖❖</option>
            <option value="star">קו + כוכבית ✧✧✧</option>
            <option value="diamond">קו + יהלום ♦♦♦</option>
            <option value="none">ללא קו</option>
          </select>
        </div>
      </div>

      <!-- פאנל איכות עימוד -->
      <div class="panel-static">
        <div class="panel-header">✍️ איכות עימוד אוטומטי</div>
        <div class="inline-cfg-row"><label>מניעת שורות בודדות:</label>
          <select id="avoid-widows-select" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>איזון סוף-פרק:</label>
          <select id="balance-chapter-end" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
      </div>

      <!-- פאנל רקעים -->
      <div class="panel-static">
        <div class="panel-header">🎨 רקע לעמודי תוכן</div>
        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד טקסט רגיל:</label>
          <select id="cbg-regular-mode" style="flex:1;" onchange="toggleCbgSubRows('regular', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-regular-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-regular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-regular-img')">
          <input type="hidden" id="data-cbg-regular-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-regular-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 0":</label>
          <select id="cbg-h0Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h0Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h0Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h0Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h0Open-img')">
          <input type="hidden" id="data-cbg-h0Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h0Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 2":</label>
          <select id="cbg-h2Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h2Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h2Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h2Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h2Open-img')">
          <input type="hidden" id="data-cbg-h2Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h2Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div style="font-size:8pt; font-weight:700; margin-bottom:6px;">תוכן העניינים</div>
          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד ראשון:</label>
            <select id="cbg-tocFirst-mode" style="flex:1;" onchange="toggleCbgSubRows('tocFirst', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocFirst-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocFirst-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocFirst-img')">
            <input type="hidden" id="data-cbg-tocFirst-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocFirst-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד רגיל (ביניים):</label>
            <select id="cbg-tocRegular-mode" style="flex:1;" onchange="toggleCbgSubRows('tocRegular', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocRegular-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocRegular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocRegular-img')">
            <input type="hidden" id="data-cbg-tocRegular-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocRegular-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד אחרון:</label>
            <select id="cbg-tocLast-mode" style="flex:1;" onchange="toggleCbgSubRows('tocLast', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocLast-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocLast-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocLast-img')">
            <input type="hidden" id="data-cbg-tocLast-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocLast-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>
        </div>
      </div>

      <!-- פאנל כותרות 0-7 -->
      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h0" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>טקסט כותרת 0:</label>
          <span style="font-size:7.5pt; color:#666; width:95px; flex-shrink:0;">(גוף ההקדמה)</span>
          <select id="f-h0-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Frank Ruhl Libre', serif" selected="selected">Frank Ruhl Libre</option></optgroup></select>
          <input type="number" id="s-h0-body" class="size-input" value="11.5" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 1 (שער משנה):</label>
          <select id="mode-h1"><option value="sub_shaar" selected="selected">שער משנה נפרד</option><option value="new_page_1col">טור 1 עמוד הבא</option></select>
          <select id="f-h1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-h1" class="size-input" value="50">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h1" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h2" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 3:</label>
          <select id="mode-h3"><option value="span_1col" selected="selected">טור 1 רציף (רוחב דף)</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h3" class="size-input" value="13.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 4:</label>
          <select id="mode-h4"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h4" class="size-input" value="12.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 5:</label>
          <select id="mode-h5"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaLight', serif" selected="selected">AlphaLight</option></optgroup></select>
          <input type="number" id="s-h5" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 6:</label>
          <select id="mode-h6"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Noto Serif Hebrew', serif" selected="selected">Noto Serif Hebrew</option></optgroup></select>
          <input type="number" id="s-h6" class="size-input" value="10.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 7 (צד):</label>
          <select id="mode-h7"><option value="side_note" selected="selected">כותרת צד בשוליים</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Hadassah Friedlaender', serif" selected="selected">Hadassah Friedlaender</option></optgroup></select>
          <input type="number" id="s-h7" class="size-input" value="6" step="0.2">
        </div>
      </div>

      <!-- פאנל כותרות עליונות -->
      <div class="panel-static">
        <div class="panel-header">📑 כותרות עליונות (3 אזורים)</div>
        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">1. מעל הטור הימני:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-r-type" style="flex:1;" onchange="document.getElementById('hdr-r-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1" selected="selected">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-r-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option><option value="left">שמאל</option></select>
          <select id="f-hdr-r" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-r" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-r-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">2. מעל הרווח המרכזי (Gutter):</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-c-type" style="flex:1;" onchange="
            document.getElementById('hdr-c-custom').style.display = this.value === 'custom' ? 'block' : 'none';
            document.getElementById('row-hdr-c-img').style.display = this.value === 'custom_img' ? 'flex' : 'none';
          ">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear" selected="selected">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="custom_img">תמונת עיטור (קובץ)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-c-align" style="width:65px;"><option value="center" selected="selected">מרכז</option></select>
          <select id="f-hdr-c" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-c" class="size-input" value="11">
        </div>
        <input type="text" id="hdr-c-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
        <div class="inline-cfg-row" id="row-hdr-c-img" style="display:none; margin-bottom:8px;">
          <label>קובץ עיטור מרכזי:</label>
          <input type="file" id="file-hdr-c-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
          <input type="hidden" id="data-hdr-c-img" value="">
        </div>

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">3. מעל הטור השמאלי:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-l-type" style="flex:1;" onchange="document.getElementById('hdr-l-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2" selected="selected">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-l-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option></select>
          <select id="f-hdr-l" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-l" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-l-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:4px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
      </div>

      <!-- פאנל תוכן העניינים -->
      <div class="panel-static">
        <div class="panel-header">📑 תוכן העניינים (כללי ומפורט)</div>
        <div style="margin-bottom:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-general-toc" checked="checked"> הצג תוכן עניינים כללי בראש הספר</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="gtoc-show" value="1" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="1"></td><td><select id="f-gtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="gtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="2"></td><td><select id="f-gtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="gtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="3" checked="checked"></td><td><select id="f-gtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="gtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="4"></td><td><select id="f-gtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="gtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="5"></td><td><select id="f-gtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="gtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="6"></td><td><select id="f-gtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="gtoc-show" value="7"></td><td><input type="checkbox" class="gtoc-grp" value="7"></td><td><select id="f-gtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>

        <div style="margin: 8px 0 4px 0; border-top:1px dashed #ccc; padding-top:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-detailed-toc" checked="checked"> הצג תוכן מפורט בראש שערי משנה</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="dtoc-show" value="1"></td><td><input type="checkbox" class="dtoc-grp" value="1"></td><td><select id="f-dtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="dtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="2"></td><td><select id="f-dtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="dtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="3"></td><td><select id="f-dtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="dtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="4"></td><td><select id="f-dtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="dtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="5"></td><td><select id="f-dtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="dtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="6"></td><td><select id="f-dtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="dtoc-show" value="7" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="7"></td><td><select id="f-dtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>
      </div>

      <!-- פאנל גריד וטיפוגרפיה -->
      <div class="panel-static">
        <div class="panel-header">📐 גריד וטיפוגרפיה כללית</div>
        <div class="inline-cfg-row">
          <label>גוף הטקסט:</label>
          <select id="font-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Guttman Rashi', serif" selected="selected">Guttman Rashi</option></optgroup></select>
          <input type="number" id="size-body" class="size-input" value="12" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>מילה ראשונה:</label>
          <select id="font-first-word" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'FrankReal', serif" selected="selected">FrankReal</option></optgroup></select>
          <input type="number" id="size-first-word" class="size-input" value="1.5" step="0.1">
        </div>
        <div class="proportions-grid" style="margin-top:6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div class="prop-item"><label>טור (%):</label><input type="number" id="prop-col" value="40" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח מרכזי (%):</label><input type="number" id="prop-gutter" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח ביניים (%):</label><input type="number" id="prop-gap" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>מרחק עליון (px):</label><input type="number" id="prop-mt" value="20" step="1" class="size-input"></div>
          <div class="prop-item"><label>מרחק תחתון (px):</label><input type="number" id="prop-mb" value="20" step="1" class="size-input"></div>
        </div>
      </div>

    </div>

    <div class="btn-bar-bottom">
      <button class="btn-save-template" onclick="saveAsDefaultTemplate()">💾 שמור תבנית</button>
      <button class="btn-primary" onclick="typesetDocument()">⚡ עדכן ועמד מחדש</button>
      <button class="btn-secondary" onclick="window.print()">🖨️ הדפסה / PDF</button>
    </div>
  </div>

  <div id="resizer"></div>

  <div id="preview-pane">
    <div id="book-container"></div>
  </div>

  <div id="measuring-box"></div>

  <!-- טעינת סקריפטים בסדר תלויות מדויק -->
  <script src="decorations.js"></script>
  <script src="typesetter.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

---

כתוב "המשך" (או אישור), ואגיש מיד בהודעה הבאה את קובץ ה-**CSS** המלא (`style.css`).

---

## פנייה 3: המשך!

המשך!

---

### 🤖 תגובה 3: Defining the Next Step I've just finalized the identification of my immediate…

**Defining the Next Step**

I've just finalized the identification of my immediate next step: creating `style.css` according to the plan we've established. The plan is to create the CSS file as the second step in the process. Now I will move to create the CSS file, and deliver it.


**Extracting CSS Rules**

I am now focused on extracting all CSS rules from the original file's `<style>` tags. I'm making sure to capture everything, including `@import` statements, `:root` definitions, universal resets, base layouts, sidebar styles, preview pane styles, and A4 page styles. I'm paying careful attention to every element and class.


**Cataloging Element Classes**

I'm now cataloging all the element classes. This includes everything related to the main page, various themes (like m1, m2, m3), sub-shaar and back-shaar pages, and the table of contents (TOC). I'm meticulously listing each class, from `.main-shaar-page` to `.toc-page-num` and all TOC levels.

---

### 🤖 תגובה 4: הנה הקובץ השני בסדרה – style.css. קובץ זה מכיל את כל עיצובי המערכת, משתני ה-CSS…

הנה הקובץ השני בסדרה – **`style.css`**.

קובץ זה מכיל את כל עיצובי המערכת, משתני ה-CSS הדינמיים, רשת העמודים (A4 Grid), כותרות, הערות שוליים, ערכות נושא מובנות והגדרות מדויקות להדפסה וייצוא ל-PDF.

---

### קובץ 2: `style.css`

שמור קובץ זה באותה תיקייה בשם `style.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

/* ============================================================
   משתני CSS גלובליים: גדלי גופנים, רשת העמוד, צבעים.
   ============================================================ */
:root {
  --fn-header-r: 'AAd_Livorna4', 'David Libre', 'David', serif;
  --sz-header-r: 13pt;
  --fn-header-c: 'AAd_Livorna4', 'David Libre', 'David', serif;
  --sz-header-c: 11pt;
  --fn-header-l: 'AAd_Livorna4', 'David Libre', 'David', serif;
  --sz-header-l: 13pt;

  --fn-h0: 'David Libre', 'David', serif;
  --sz-h0: 18pt;
  --fn-h0-body: 'Frank Ruhl Libre', serif;
  --sz-h0-body: 11.5pt;

  --fn-h1: 'Lia Sgula', 'Bellefair', serif;
  --sz-h1: 50pt;
  --fn-h1-sub: 'David Libre', 'David', serif;
  --sz-h1-sub: 28pt;

  --fn-h2: 'AAd_AlphaBlack', 'David Libre', 'David', serif;
  --sz-h2: 17pt;
  --fn-h3: 'AAd_AlphaLight', 'Noto Serif Hebrew', serif;
  --sz-h3: 13.5pt;
  --fn-h4: 'FrankRuehl', 'Frank Ruhl Libre', serif;
  --sz-h4: 12.5pt;
  --fn-h5: 'David Libre', 'David', serif;
  --sz-h5: 11.5pt;
  --fn-h6: 'Noto Serif Hebrew', serif;
  --sz-h6: 10.5pt;
  --fn-h7: 'Hadassah Friedlaender', 'Hadassah', 'Noto Serif Hebrew', serif;
  --sz-h7: 6pt;

  --fn-sh-title: 'Bellefair', serif;
  --sz-sh-title: 46pt;
  --fn-sh-sub: 'David Libre', serif;
  --sz-sh-sub: 21pt;
  --fn-sh-desc: 'Frank Ruhl Libre', serif;
  --sz-sh-desc: 12pt;
  --fn-sh-sec: 'David Libre', serif;
  --sz-sh-sec: 11.5pt;
  --fn-sh-author: 'David Libre', serif;
  --sz-sh-author: 15pt;
  --fn-sh-year: 'David Libre', serif;
  --sz-sh-year: 12pt;

  --fn-body: 'Rashi DP', 'Frank Ruhl Libre', serif;
  --sz-body: 11.2pt;
  --fn-first-word: 'Rashi DP', 'Frank Ruhl Libre', serif;
  --sz-first-word: 1.5em;

  --w-margin: 7.5%;
  --w-gap: 2%;
  --w-col: 40%;
  --w-gutter: 2%;
  --flow-mt: 20px;
  --flow-mb: 20px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ============================================================
   איפוס בסיסי ותצוגת שני-חלקים (סרגל צד + תצוגה מקדימה)
   ============================================================ */
html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background-color: #555555;
  font-family: var(--fn-body);
  color: #000000;
  display: flex;
  flex-direction: row;
}

#sidebar {
  width: 540px;
  min-width: 380px;
  max-width: 800px;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  box-shadow: -3px 0 15px rgba(0,0,0,0.3);
  z-index: 100;
  font-family: 'David Libre', serif;
  flex-shrink: 0;
}

#resizer {
  width: 6px;
  height: 100vh;
  background: #333333;
  cursor: col-resize;
  flex-shrink: 0;
  z-index: 110;
  transition: background 0.2s;
}
#resizer:hover, #resizer.resizing {
  background: #b8860b;
}

.sidebar-top-half {
  height: 36vh;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding-bottom: 6px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.sidebar-title {
  font-size: 12.5pt;
  font-weight: 700;
}

.btn-load-fonts {
  background-color: #2c3e50;
  color: #fff;
  border: none;
  padding: 3px 8px;
  font-size: 8.5pt;
  font-weight: 700;
  cursor: pointer;
  border-radius: 3px;
}

#raw-input {
  width: 100%;
  flex: 1;
  font-family: monospace;
  font-size: 9pt;
  padding: 6px;
  border: 1px solid #777;
  border-radius: 3px;
  direction: rtl;
  resize: none;
}

.sidebar-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
  margin-top: 4px;
}

.panel-static {
  background: #fbfbfb;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 8px 10px;
}

.panel-header {
  font-size: 10pt;
  font-weight: 700;
  background: #eaeaea;
  padding: 4px 8px;
  border-radius: 3px;
  margin: -8px -10px 8px -10px;
  color: #111;
  border-bottom: 1px solid #ccc;
}

.inline-cfg-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 5px;
  font-size: 8.5pt;
}
.inline-cfg-row label {
  font-weight: 700;
  width: 105px;
  flex-shrink: 0;
  font-size: 8pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.inline-cfg-row input[type="text"] {
  flex: 1;
  min-width: 80px;
  padding: 2px 4px;
  font-size: 8.5pt;
  border: 1px solid #aaa;
  border-radius: 2px;
}
.inline-cfg-row select {
  padding: 2px 3px;
  font-size: 8pt;
  border: 1px solid #aaa;
  border-radius: 2px;
}
.inline-cfg-row select.font-picker {
  width: 100px;
}
.inline-cfg-row input.size-input {
  width: 38px;
  text-align: center;
  font-size: 8pt;
  padding: 2px;
  border: 1px solid #aaa;
  border-radius: 2px;
}

.toc-levels-table {
  width: 100%;
  font-size: 8pt;
  margin-top: 4px;
  border-collapse: collapse;
}
.toc-levels-table th, .toc-levels-table td {
  padding: 2px 4px;
  text-align: right;
}
.toc-levels-table th {
  background: #eee;
  font-weight: 700;
}

.btn-bar-bottom {
  display: flex;
  gap: 6px;
  padding-top: 8px;
  border-top: 1.5px solid #ccc;
  background: #fff;
  flex-shrink: 0;
}
.btn-primary {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 8px 12px;
  font-size: 10pt;
  font-weight: 700;
  cursor: pointer;
  border-radius: 3px;
  flex-grow: 1;
}
.btn-save-template {
  background-color: #1e3a8a;
  color: #fff;
  border: none;
  padding: 8px 10px;
  font-size: 9pt;
  font-weight: 700;
  cursor: pointer;
  border-radius: 3px;
}
.btn-secondary {
  background-color: #f0f0f0;
  color: #000;
  border: 1px solid #666;
  padding: 8px 10px;
  font-size: 9pt;
  cursor: pointer;
  border-radius: 3px;
}

#preview-pane {
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  scroll-behavior: smooth;
  background-color: #555555;
}

/* ============================================================
   עמוד ה-A4 עצמו
   ============================================================ */
.a4-page {
  background-color: #ffffff;
  width: 210mm;
  height: 297mm;
  max-height: 297mm;
  padding: 15mm 15mm 15mm 15mm;
  box-shadow: 0 0 15px rgba(0,0,0,0.4);
  position: relative;
  margin-bottom: 30px;
  page-break-after: always;
  overflow: hidden;
  flex-shrink: 0;
}

.page-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  justify-content: space-between;
}

/* ============================================================
   עמודי השער: ראשי, אחורי, ומשנה
   ============================================================ */
.main-shaar-page {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
}

.shaar-main-content {
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 20mm 12mm 16mm 12mm;
  z-index: 20;
  position: relative;
}

.custom-bg-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  z-index: 5;
  pointer-events: none;
}

.bsd-header {
  font-family: 'David Libre', serif;
  font-size: 15pt;
  letter-spacing: 5px;
  font-weight: 700;
  margin-bottom: 40px;
}
.sefer-label {
  font-family: 'David Libre', serif;
  font-size: 15pt;
  letter-spacing: 5px;
  font-weight: 700;
  margin-top: 4px;
}

.book-title-main {
  font-family: var(--fn-sh-title);
  font-size: var(--sz-sh-title);
  line-height: 1.1;
  margin: 10px 0 40px 0;
}
.book-subtitle {
  font-family: var(--fn-sh-sub);
  font-size: var(--sz-sh-sub);
  font-weight: 700;
  line-height: 1.25;
}
.book-description {
  font-family: var(--fn-sh-desc);
  font-size: var(--sz-sh-desc);
  line-height: 1.5;
  max-width: 65%;
  margin: 10px auto;
}
.book-sections-summary {
  font-family: var(--fn-sh-sec);
  font-size: var(--sz-sh-sec);
  line-height: 1.5;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 6px 12px;
  margin: 8px 0;
  font-weight: 700;
}
.author-block {
  font-family: var(--fn-sh-author);
  font-size: calc(var(--sz-sh-author) * 0.85);
  line-height: 1.3;
}
.author-name {
  font-size: var(--sz-sh-author);
  font-weight: 700;
}
.publication-footer {
  font-family: var(--fn-sh-year);
  font-size: var(--sz-sh-year);
  font-weight: 700;
  letter-spacing: 1px;
}

.m1-bg-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%);
  border-bottom: 1px solid #d0d0d0;
}
.m1-bg-middle {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  height: 60%;
  background: #ffffff;
}
.m1-bg-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%);
  border-top: 1px solid #d0d0d0;
}
.m1-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12%;
  right: 12%;
  background: #ffffff;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  z-index: 10;
}
.m1-damask {
  width: 30px;
  height: 100%;
  background: #fafafa url("data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.35'/%3E%3C/svg%3E") repeat-y;
  flex-shrink: 0;
}

.m2-bg-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 18%;
  background: #eaeaea;
}
.m2-bg-middle {
  position: absolute;
  top: 18%;
  left: 0;
  right: 0;
  height: 64%;
  background: #ffffff;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.06), inset 0 -2px 6px rgba(0,0,0,0.06);
}
.m2-bg-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 18%;
  background: #eaeaea;
}
.m2-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10%;
  right: 10%;
  background: #ffffff;
  box-shadow: 0 0 25px rgba(0,0,0,0.12);
  display: flex;
  justify-content: space-between;
  z-index: 10;
}
.m2-lace {
  width: 24px;
  height: 100%;
  background: #ffffff url("data:image/svg+xml,%3Csvg width='26' height='40' viewBox='0 0 26 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13,20 C4,16 2,8 2,2 C2,0 8,0 13,8 C18,0 24,0 24,2 C24,8 22,16 13,20 Z M13,20 C4,24 2,32 2,38 C2,40 8,40 13,32 C18,40 24,40 24,38 C24,32 22,24 13,20 Z M13,10 A3,3 0 1,0 13,16 A3,3 0 1,0 13,10 Z M13,30 A3,3 0 1,0 13,24 A3,3 0 1,0 13,30 Z' fill='%23888888' fill-opacity='0.45'/%3E%3C/svg%3E") repeat-y;
  flex-shrink: 0;
}

.m3-wavy-band {
  position: absolute;
  top: 14%;
  left: 0;
  right: 0;
  height: 72%;
  background: #ffffff;
  border-top: 1.5px solid #d4d4d4;
  border-bottom: 1.5px solid #d4d4d4;
}
.m3-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 9%;
  right: 9%;
  background: #ffffff;
  border-right: 1.5px solid #ccc;
  border-left: 1.5px solid #ccc;
  box-shadow: 0 0 25px rgba(0,0,0,0.14);
  z-index: 10;
}
.m3-corner {
  position: absolute;
  width: 65px;
  height: 65px;
  fill: #111;
  z-index: 25;
}
.m3-corner.tr {
  top: 10mm;
  right: 10mm;
}
.m3-corner.tl {
  top: 10mm;
  left: 10mm;
  transform: scaleX(-1);
}
.m3-corner.br {
  bottom: 10mm;
  right: 10mm;
  transform: scaleY(-1);
}
.m3-corner.bl {
  bottom: 10mm;
  left: 10mm;
  transform: scale(-1, -1);
}

.sub-shaar-page {
  position: relative;
  padding: 0;
}
.sub-shaar-col {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: auto;
  width: 55%;
  background: #ffffff;
  border-right: 1.5px solid #ccc;
  box-shadow: 5px 0 18px rgba(0,0,0,0.08);
  display: flex;
  z-index: 10;
}
.sub-shaar-bg-right {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 55%;
  background: #f4f4f4;
}
.sub-shaar-content-centered {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20mm 12mm;
  z-index: 20;
}

.back-shaar-page {
  position: relative;
  padding: 0;
}
.back-shaar-col {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: auto;
  width: 55%;
  background: #ffffff;
  border-left: 1.5px solid #ccc;
  box-shadow: -5px 0 18px rgba(0,0,0,0.08);
  display: flex;
  z-index: 10;
}
.back-shaar-bg-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 55%;
  background: #f4f4f4;
}
.back-shaar-content-centered {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 22mm 12mm 18mm 12mm;
  z-index: 20;
}

.theme-bounded-content {
  position: absolute;
  width: auto !important;
  height: auto !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  z-index: 20;
  box-sizing: border-box;
}

/* ============================================================
   תוכן העניינים
   ============================================================ */
.toc-page {
  padding: 15mm 15mm 15mm 15mm;
}
.toc-grid-full {
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
  max-width: 175mm;
  margin: 0 auto;
}
.toc-entry-group {
  break-inside: avoid;
  margin-bottom: 3px;
}
.toc-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2px;
  font-family: 'David Libre', serif;
  font-size: 10.5pt;
}
.toc-title {
  flex-shrink: 1;
  max-width: 84%;
  font-weight: 600;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: right;
  line-height: 1.3;
}
.toc-dots {
  flex-grow: 1;
  border-bottom: 1px dotted #777;
  margin: 0 8px;
  height: 1px;
  min-width: 25px;
}
.toc-page-num {
  flex-shrink: 0;
  font-weight: 700;
  font-family: 'David Libre', serif;
  font-size: 10.5pt;
  min-width: 25px;
  text-align: left;
}

.toc-lvl-1 {
  font-size: 12pt;
  font-weight: 700;
  margin-top: 8px;
  margin-bottom: 3px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2px;
}
.toc-lvl-2 {
  font-size: 11pt;
  font-weight: 700;
  margin-top: 5px;
  padding-right: 8px;
}
.toc-lvl-3 {
  font-size: 10.5pt;
  font-weight: 700;
  padding-right: 16px;
}
.toc-lvl-4 {
  padding-right: 24px;
  font-size: 10pt;
}
.toc-lvl-5 {
  padding-right: 32px;
  font-size: 9.5pt;
}
.toc-lvl-6 {
  padding-right: 40px;
  font-size: 9pt;
}
.toc-lvl-7 {
  padding-right: 48px;
  font-size: 8.8pt;
}

.toc-grouped-block {
  padding-right: 30px;
  font-size: 9pt;
  color: #222;
  line-height: 1.5;
  margin: 2px 0 5px 0;
  text-align: right;
  font-family: 'David Libre', serif;
}
.grp-item {
  font-size: inherit;
  white-space: normal;
}
.grp-title {
  font-weight: 600;
  color: #111;
}
.grp-page {
  font-weight: 700;
  color: #4a5568 !important;
  font-family: 'David Libre', serif;
}
.grp-sep {
  color: #888;
  margin: 0 6px;
  font-weight: bold;
  white-space: nowrap;
}

/* ============================================================
   הכותרת העליונה
   ============================================================ */
.top-header-grid {
  display: grid;
  grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
  align-items: center;
  height: 24px;
  flex-shrink: 0;
}

.header-col-r {
  grid-column: 3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--fn-header-r);
  font-size: var(--sz-header-r);
  font-weight: 700;
}
.header-col-c {
  grid-column: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: visible;
  font-family: var(--fn-header-c);
  font-size: var(--sz-header-c);
}
.header-col-l {
  grid-column: 5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--fn-header-l);
  font-size: var(--sz-header-l);
  font-weight: 700;
}

/* ============================================================
   גוף הטקסט: כותרות, טורים, פסקאות
   ============================================================ */
.title-level-2-standalone {
  font-family: var(--fn-h2);
  font-size: var(--sz-h2);
  font-weight: 700;
  text-align: center;
  margin-top: 0;
  margin-bottom: 40px;
  width: 100%;
  line-height: 1.25;
  flex-shrink: 0;
}

.h2-spacer {
  flex-basis: 33.33%;
  flex-shrink: 0;
}

.page-body-flow {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  flex-grow: 1;
  justify-content: flex-start;
  margin-top: var(--flow-mt);
  margin-bottom: var(--flow-mb);
  min-height: 0;
}

.block-2col {
  display: grid;
  grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
  width: 100%;
  position: relative;
  align-items: start;
}

.block-h3-span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0 6px 0;
  margin-bottom: 4px;
  flex-shrink: 0;
}
.block-h3-span .h3-title-text {
  font-family: var(--fn-h3);
  font-size: var(--sz-h3);
  font-weight: 900;
  text-align: center;
  width: 100%;
  line-height: 1.22;
}

.title-level-4 {
  font-family: var(--fn-h4);
  font-size: var(--sz-h4);
  font-weight: 900;
  text-align: center;
  margin: 9px 0 4px 0;
  line-height: 1.22;
}
.title-level-custom {
  margin: 9px 0 4px 0;
  line-height: 1.3;
}

.note-marker {
  line-height: 0;
  cursor: pointer;
}

/* אזור הערות השוליים - יושב בזרימה הטבעית מעל מספר העמוד */
.footnote-area {
  position: relative;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 4px;
  flex-shrink: 0;
  z-index: 25;
}

.note-rule-plain {
  border-top: 1px solid #555;
  margin-bottom: 5px;
}
.note-rule-decorative {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.note-rule-decorative .rule-seg {
  flex: 1;
  height: 1px;
  background: #555;
}
.note-rule-decorative .rule-glyphs {
  font-size: 9px;
  letter-spacing: 3px;
  color: #555;
  white-space: nowrap;
}
.note-block {
  font-size: 8.5pt;
  line-height: 1.5;
}
.note-line {
  break-inside: avoid;
  margin-bottom: 3px;
}
.note-line-num {
  font-weight: 700;
  margin-left: 3px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.endnote-page-block {
  margin-top: 10mm;
  padding: 0 10mm;
}
.title-level-5 {
  font-family: var(--fn-h5);
  font-size: var(--sz-h5);
  font-weight: 700;
  text-align: center;
  margin: 7px 0 3px 0;
  line-height: 1.22;
}
.title-level-6 {
  font-family: var(--fn-h6);
  font-size: var(--sz-h6);
  font-weight: 700;
  text-align: center;
  margin: 6px 0 3px 0;
  line-height: 1.22;
}

.block-single-col {
  display: grid;
  grid-template-columns: var(--w-margin) var(--w-gap) calc(var(--w-col)*2 + var(--w-gutter)) var(--w-gap) var(--w-margin);
  width: 100%;
  position: relative;
  align-items: start;
}
.block-single-col .single-wide-col {
  grid-column: 3;
  font-family: var(--fn-h0-body);
  font-size: var(--sz-h0-body);
  line-height: 1.45;
  text-align: justify;
  text-justify: inter-word;
}

.margin-notes-column {
  font-family: var(--fn-h7);
  font-size: var(--sz-h7);
  line-height: 1.18;
  text-align: center;
  text-align-last: center;
  font-weight: 400;
  color: #404040;
  position: relative;
  width: 100%;
  height: 100%;
}

.right-margin {
  grid-column: 1;
}
.left-margin {
  grid-column: 7;
}
.side-note-anchor {
  position: absolute;
  width: 100%;
}

.main-column {
  font-family: var(--fn-body);
  font-size: var(--sz-body);
  line-height: 1.34;
  text-align: justify;
  text-justify: inter-word;
  min-height: 0;
  height: auto;
  position: relative;
}

.right-col {
  grid-column: 3;
}
.left-col {
  grid-column: 5;
}

p {
  margin-bottom: 7px;
  text-align: justify;
  text-justify: inter-word;
  position: relative;
}
p.p-end {
  text-align-last: center;
}
p.p-cut {
  text-align-last: justify;
}

.first-word-window {
  float: right;
  font-family: var(--fn-first-word);
  font-size: var(--sz-first-word);
  font-weight: 900;
  line-height: 0.85;
  height: 1.25em;
  margin-left: 6px;
  margin-bottom: 1px;
  display: block;
}

.first-word-inline {
  font-family: var(--fn-first-word);
  font-size: var(--sz-first-word);
  font-weight: 900;
  line-height: 1;
}

.page-number-footer {
  text-align: center;
  font-family: var(--fn-header-r);
  font-size: 12pt;
  font-weight: 700;
  height: 24px;
  flex-shrink: 0;
}

#measuring-box {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  top: -9999px;
  left: -9999px;
  font-family: var(--fn-body);
  font-size: var(--sz-body);
  line-height: 1.34;
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }
  body {
    background: none;
    padding: 0;
    overflow: visible;
    display: block;
  }
  #sidebar, #resizer {
    display: none !important;
  }
  #preview-pane {
    height: auto !important;
    overflow: visible !important;
    padding: 0 !important;
    background: none !important;
    display: block !important;
  }
  .a4-page {
    box-shadow: none;
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    padding: 15mm !important;
    margin: 0 !important;
    page-break-after: always;
    break-after: page;
    position: relative;
  }
  .page-content-wrapper,
  .shaar-main-content,
  .sub-shaar-content-centered,
  .back-shaar-content-centered {
    height: 100% !important;
  }
}
```

---

כתוב "המשך", ובשלב הבא (ההודעה השלישית) אגיש את קובצי ה-**JavaScript**:
1. `decorations.js` – מאגר כל העיטורים, השערים וה-SVG בצורה מודולרית המוכנה להרחבה מיידית.
2. `typesetter.js` – מנוע העימוד, חישוב הגבהים ואיזון הטורים.
3. `app.js` – ניהול ה-UI והאתחול.

---

## פנייה 4: המשך!

המשך!

---

### 🤖 תגובה 5: Analyzing the Command I've got the command: "המשך!" (Continue!). It's the third…

**Analyzing the Command**

I've got the command: "המשך!" (Continue!). It's the third and final message I need to provide, as per the established delivery plan. The previous messages were `index.html` and `style.css`. Now I just have to move on!


**Delivering the Final Code**

I'm now delivering the final code, the JS files. This includes `decorations.js`, `typesetter.js`, and `app.js`. I've focused intensely on ensuring absolutely no regressions, verifying every function, variable, event listener, DOM element, and logic flow works in concert. I've analyzed the JS files, keeping global state in mind.


**Refining the Structure**

Okay, I've got a tighter focus now. I'm looking at `decorations.js` more closely, specifically the user requirements for it. It's becoming clearer what needs to go in this file: the SVG texture, header ornaments, and the `renderHeaderSectionHTML` function. I'm also thinking how the code's going to be extensible for adding more ornaments in the future, with emphasis on the `HEADER_ORNAMENTS` object.


**Expanding the Ornaments**

I'm now diving into the `decorations.js` file and focusing on expanding ornaments and design elements. I'm building out objects for `SECTION_DIVIDERS` (pyramid, spear, etc.) and `NOTE_RULES` (dots, sparkle, etc.). I'm refining the functions `getSectionDividerHTML(type)` and `buildNoteRuleElement()` to use these objects. I'm also planning the `SHAAR_THEMES` dictionary for different Shaar templates and working on rendering functions like `renderMainShaar`. I'm starting the `getContentBgCSS(roleKey)` to work on Content background generators. I will be including clear comments.


**Organizing the Functions**

Now, I'm concentrating on `typesetter.js`, as it should contain typesetting state variables like `noteCounters` and helper functions that assist with typography and notes. This includes functions such as `toGematria(num)`, `createDropWord(text, isContinuation, isSingleLine)`, and others. I will be including clear comments.


**Defining the Functions**

I'm now getting a clear picture of `typesetter.js`. I am identifying and defining the remaining crucial typesetting functions. I'm focusing on the core utility functions like `buildNoteBlockElement()`, `flushFootnotesInto()`, and `typesetDocument()`. I'm paying close attention to how they interact, ensuring smooth operation of the note block and endnote processes, and paginated TOC. I also added `renderCustomHeadingInto()` and `buildStructuredTOC()`. Finally I am working on the orchestration function: `typesetDocument()`.



**Finalizing the Functionality**

I'm now implementing the final crucial functions in `app.js`. This includes event handlers for various import, upload, and saving functionalities. I'm focusing on the image and SVG file uploads, with functions such as `handleImagePageImportFile(event)` and `handleImageUpload(event, targetInputId)`. I'm also finishing the `saveAsDefaultTemplate()` function for template saving and `loadSystemFonts()` for local system fonts. I'm carefully managing the interaction of `syncCursorToPreview()` and ensuring a correct rehydration using `rehydrateExtImports()`. Finally I am finishing the `window.onload` with the `typesetDocument()` for a fully functioning tool.



**Ensuring Global Scope**

I'm now making sure that global variables used across files are properly declared, specifically `window.customThemes = [];`. This prevents any potential errors when functions in `decorations.js` or `typesetter.js` access it. I'm focusing on ensuring functions within each module can depend on functions in other modules that have already been declared, especially in the context of the onload function. I'm taking care to ensure that the order of the script tags properly ensures this.


**Prioritizing Event Handlers**

I'm now prioritizing event handler placement, ensuring all functions are defined before `window.onload`. I'm confirming global scope for inline HTML event handlers, and I'm placing all of them in `app.js` with their specific event handlers. I'm focusing on getting `loadSystemFonts()` and `typesetDocument()` defined first.


**Implementing SVG Elements**

I'm now implementing the SVG elements per user request in `decorations.js`. I am creating and organizing registries for `HEADER_ORNAMENTS`, `SECTION_DIVIDERS`, `NOTE_RULES`, and `SHAAR_THEMES`. These dictionaries will hold the SVG code. Each dictionary will have a clear, easy way to add new elements.

---

### 🤖 תגובה 6: הנה החלק השלישי והמרכזי: חלוקת קוד ה-JavaScript לשלושה קבצים ייעודיים. החלוקה…

הנה החלק השלישי והמרכזי: חלוקת קוד ה-JavaScript לשלושה קבצים ייעודיים.

החלוקה נעשתה בזהירות מרבית תוך שמירה מלאה על כל שמות הפונקציות, המשתנים, מנגנוני המדידה ואלגוריתמי האיזון:
1. **`decorations.js`** – מאגר העיטורים, השערים ומפרידי ההערות (מרוכז במילונים מסודרים שבהם קל מאוד להדביק קוד SVG חדש).
2. **`typesetter.js`** – מנוע העימוד (איזון טורים, חישוב גבהים, שבירת שורות, תוכן עניינים ורשת הדפים).
3. **`app.js`** – לוגיקת הממשק (סרגל צד, טעינת גופנים, ייבוא תוספים, סנכרון סמן עריכה ושמירת תבניות).

---

### קובץ 3: `decorations.js`

קובץ זה מרכז את כל הגרפיקה, השערים וה-SVG. **בראש הקובץ מוגדרים מילונים (Dictionaries) ברורים שבהם ניתן להוסיף עיטורים חדשים פשוט על ידי הדבקת מחרוזת ה-SVG שלכם.**

שמור קובץ זה באותה תיקייה בשם `decorations.js`:

```javascript
/* ==========================================================================
   decorations.js - מאגר עיטורים, שערים ואלמנטים גרפיים (SVG)
   ==========================================================================
   הוראות להוספת עיטורים חדשים:
   1. לכותרת עליונה: הדבק SVG חדש בתוך HEADER_ORNAMENTS.
   2. לסיום פרק: הדבק SVG חדש בתוך SECTION_DIVIDERS.
   3. לקו מפריד הערות: הוסף סימן/קוד בתוך NOTE_RULE_GLYPHS.
   4. לערכת שער מובנית חדשה: הוסף מבנה חדש בתוך BUILTIN_SHAAR_THEMES.
   ========================================================================== */

// רקע מרקם דמשק עדין לעמודים
const CBG_TEXTURE_SVG = "data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.18'/%3E%3C/svg%3E";

/* ==========================================================================
   1. עיטורי כותרת עליונה (Running Header Ornaments)
   ========================================================================== */
const HEADER_ORNAMENTS = {
  diamonds: '<span style="letter-spacing:3px;">◈ ❖ ◈</span>',
  spear: '<svg style="height:9px; width:48px;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#444" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#444"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#444"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#444"/></svg>',
  swash: '<svg style="height:12px; width:44px; fill:#444;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>',
  pen: '<svg style="height:12px; width:44px;" viewBox="0 0 280 80"><g stroke="#444" fill="none" stroke-linecap="round"><path d="M30,55 C12,42 22,22 38,28 C50,32 55,48 45,58 C35,68 18,60 14,46 C10,32 25,18 42,22 C65,28 85,65 118,68 C128,69 135,62 135,50 C135,38 124,32 115,38" stroke-width="3"/><path d="M250,55 C268,42 258,22 242,28 C230,32 225,48 235,58 C245,68 262,60 266,46 C270,32 255,18 238,22 C215,28 195,65 162,68 C152,69 145,62 145,50 C145,38 156,32 165,38" stroke-width="3"/></g></svg>'
  // להוספת עיטור כותרת עליונה נוסף, הדבק כאן:
  // my_header_svg: '<svg ...>...</svg>',
};

function renderHeaderSectionHTML(type, customText, h1Title, h2Title, h3Title, bookTitle, tocFallback) {
  if (type === 'h1') return h1Title || tocFallback || '';
  if (type === 'h2') return h2Title || tocFallback || '';
  if (type === 'h3') return h3Title || '';
  if (type === 'book_title') return bookTitle || '';
  if (type === 'custom') return customText || '';
  if (HEADER_ORNAMENTS[type]) return HEADER_ORNAMENTS[type];
  if (type === 'custom_img') {
    const imgSrc = document.getElementById('data-hdr-c-img') ? document.getElementById('data-hdr-c-img').value : '';
    return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 100%; object-fit: contain; vertical-align: middle;" />` : '';
  }
  return '';
}

/* ==========================================================================
   2. עיטורי סיום פרק (Section Dividers)
   ========================================================================== */
const SECTION_DIVIDERS = {
  pyramid: '<div style="grid-column: 3 / 6; text-align: center; line-height: 0.9; margin: 18px 0 6px 0;"><div style="font-size: 10pt; letter-spacing: 6px;">❖ ❖ ❖</div><div style="font-size: 9pt; letter-spacing: 5px; margin-top: 3px;">❖ ❖</div><div style="font-size: 8pt; margin-top: 3px;">❖</div></div>',
  spear: '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 200px; height: 22px; margin: auto;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/><path d="M165,20 C165,22 150,24 130,24 C95,24 55,21 30,20 C55,19 95,16 130,16 C150,16 165,18 165,20 Z" fill="#fff"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/><path d="M235,20 C235,22 250,24 270,24 C305,24 345,21 370,20 C345,19 305,16 270,16 C250,16 235,18 235,20 Z" fill="#fff"/></svg></div>',
  swash: '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 170px; height: 18px; fill: #111; margin: auto;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg></div>',
  flourish: '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 140px; height: 45px; fill: #000; margin: auto;" viewBox="0 0 240 90"><path d="M110,48 C105,44 92,30 82,30 C68,30 55,42 42,42 C30,42 22,32 22,22 C22,12 32,5 45,5 C60,5 72,18 78,28 C82,20 88,10 100,10 C108,10 114,16 114,24 C114,35 102,44 88,44 C72,44 58,35 48,22 C42,28 35,35 25,48 C15,62 10,72 20,82 C30,90 48,85 62,72 C78,58 92,54 110,48 Z"/><path d="M130,48 C135,44 148,30 158,30 C172,30 185,42 198,42 C210,42 218,32 218,22 C218,12 208,5 195,5 C180,5 168,18 162,28 C158,20 152,10 140,10 C132,10 126,16 126,24 C126,35 138,44 152,44 C168,44 182,35 192,22 C198,28 205,35 215,48 C225,62 230,72 220,82 C210,90 192,85 178,72 C162,58 148,54 130,48 Z"/></svg></div>'
  // להוספת עיטור סיום פרק נוסף, הדבק כאן:
  // my_divider: '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg ...>...</svg></div>',
};

function getSectionDividerHTML(type) {
  if (SECTION_DIVIDERS[type]) return SECTION_DIVIDERS[type];
  if (type === 'custom_img') {
    const imgSrc = document.getElementById('data-sec-div-img') ? document.getElementById('data-sec-div-img').value : '';
    return imgSrc ? `<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><img src="${imgSrc}" style="max-width: 260px; max-height: 45px; margin: auto; display: block; object-fit: contain;" /></div>` : '';
  }
  return '';
}

/* ==========================================================================
   3. קווי מפריד להערות שוליים (Footnote Rules)
   ========================================================================== */
const NOTE_RULE_GLYPHS = {
  dots: '◦◦◦',
  sparkle: '❖❖❖',
  star: '✧✧✧',
  diamond: '♦♦♦'
  // להוספת סגנון קו נוסף:
  // my_glyphs: '✦✦✦'
};

function buildNoteRuleElement() {
  const sel = document.getElementById('note-rule-style');
  const style = sel ? sel.value : 'plain';
  const rule = document.createElement('div');
  if (style === 'none') { rule.style.display = 'none'; return rule; }
  if (style === 'plain') { rule.className = 'note-rule-plain'; return rule; }
  rule.className = 'note-rule-decorative';
  const segR = document.createElement('span'); segR.className = 'rule-seg';
  const mid = document.createElement('span'); mid.className = 'rule-glyphs'; mid.textContent = NOTE_RULE_GLYPHS[style] || '';
  const segL = document.createElement('span'); segL.className = 'rule-seg';
  rule.appendChild(segR); rule.appendChild(mid); rule.appendChild(segL);
  return rule;
}

/* ==========================================================================
   4. ערכות נושא מובנות לשערים (Built-in Shaar Themes)
   ========================================================================== */
const BUILTIN_SHAAR_THEMES = {
  builtin_1: {
    mainHTML: `
      <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
      <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
    `,
    backHTML: `<div class="back-shaar-bg-left"></div>`,
    backStyle: `position:absolute; top:0; bottom:0; right:0; left:45%;`,
    subHTML: `<div class="sub-shaar-bg-right"></div>`,
    subStyle: `position:absolute; top:0; bottom:0; right:45%; left:0;`
  },
  builtin_2: {
    mainHTML: `
      <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
      <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
    `,
    backHTML: `<div class="back-shaar-bg-left"></div>`,
    backStyle: `position:absolute; top:0; bottom:0; right:0; left:45%;`,
    subHTML: `<div class="sub-shaar-bg-right"></div>`,
    subStyle: `position:absolute; top:0; bottom:0; right:45%; left:0;`
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
    backStyle: `position:absolute; top:0; bottom:0; right:0; left:45%;`,
    subHTML: `<div class="sub-shaar-bg-right"></div>`,
    subStyle: `position:absolute; top:0; bottom:0; right:45%; left:0;`
  }
};

/* ==========================================================================
   5. פונקציות יצירת דפי השער
   ========================================================================== */
function renderMainShaar(container, themeId) {
  const page = document.createElement('div');
  page.className = `a4-page main-shaar-page`;

  const title = document.getElementById('inp-book-title').value || "שם הספר";
  const subtitle = document.getElementById('inp-book-subtitle').value || "";
  const desc = document.getElementById('inp-book-desc').value || "";
  const sections = document.getElementById('inp-book-sections').value || "";
  const author = document.getElementById('inp-book-author').value || "";
  const year = document.getElementById('inp-book-year').value || "";

  let frameHTML = '';
  let boxStyle = '';
  const customTheme = (typeof customThemes !== 'undefined') ? customThemes.find(t => t.id === themeId) : null;

  if (customTheme) {
    if (customTheme.mainShaar && customTheme.mainShaar.svgData) {
      frameHTML = `<img class="custom-bg-img" src="${customTheme.mainShaar.svgData}" alt="שער ראשי">`;
    }
    const m = customTheme.mainShaar || { top: 20, bottom: 16, right: 15, left: 15 };
    boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
  } else if (BUILTIN_SHAAR_THEMES[themeId]) {
    frameHTML = BUILTIN_SHAAR_THEMES[themeId].mainHTML;
  }

  page.innerHTML = `
    ${frameHTML}
    <div class="shaar-main-content theme-bounded-content" style="${boxStyle}">
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

  const title = document.getElementById('inp-book-title').value || "שם הספר";
  const sections = document.getElementById('inp-book-sections').value || "";
  const author = document.getElementById('inp-book-author').value || "";
  const year = document.getElementById('inp-book-year').value || "";

  let bgHTML = '';
  let boxStyle = '';
  const customTheme = (typeof customThemes !== 'undefined') ? customThemes.find(t => t.id === themeId) : null;

  if (customTheme) {
    if (customTheme.backShaar && customTheme.backShaar.svgData) {
      bgHTML = `<img class="custom-bg-img" src="${customTheme.backShaar.svgData}" alt="שער אחורי">`;
    }
    const m = customTheme.backShaar || { top: 22, bottom: 18, right: 15, left: 95 };
    boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
  } else if (BUILTIN_SHAAR_THEMES[themeId]) {
    bgHTML = BUILTIN_SHAAR_THEMES[themeId].backHTML;
    boxStyle = BUILTIN_SHAAR_THEMES[themeId].backStyle;
  } else {
    bgHTML = `<div class="back-shaar-bg-left"></div>`;
    boxStyle = `position:absolute; top:0; bottom:0; right:0; left:45%;`;
  }

  page.innerHTML = `
    ${bgHTML}
    <div class="theme-bounded-content" style="${boxStyle}">
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

  if (customTheme) {
    if (customTheme.subShaar && customTheme.subShaar.svgData) {
      bgHTML = `<img class="custom-bg-img" src="${customTheme.subShaar.svgData}" alt="שער משנה">`;
    }
    const m = customTheme.subShaar || { top: 20, bottom: 20, right: 95, left: 15 };
    boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
  } else if (BUILTIN_SHAAR_THEMES[themeId]) {
    bgHTML = BUILTIN_SHAAR_THEMES[themeId].subHTML;
    boxStyle = BUILTIN_SHAAR_THEMES[themeId].subStyle;
  } else {
    bgHTML = `<div class="sub-shaar-bg-right"></div>`;
    boxStyle = `position:absolute; top:0; bottom:0; right:45%; left:0;`;
  }

  page.innerHTML = `
    ${bgHTML}
    <div class="theme-bounded-content" style="${boxStyle} justify-content:center;">
      <div class="sefer-label">חלק</div>
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
```

---

### קובץ 4: `typesetter.js`

קובץ זה הוא לב המערכת: הוא אחראי על אלגוריתם המדידה, איזון הטורים, שבירת הפסקאות, חלונות המילה הראשונה, מיקום הערות השוליים והסיום, והפקת עמודי ה-A4.

שמור קובץ זה באותה תיקייה בשם `typesetter.js`:

```javascript
/* ==========================================================================
   typesetter.js - מנוע העימוד המרכזי לדפי A4
   ========================================================================== */

let noteCounters = { footnote: 0, endnote: 0 };
let noteUidCounter = 0;
let footnoteQueueForPage = [];
let endnoteQueueForPart = [];
let lineToTokenMap = [];

function toGematria(num) {
  num = parseInt(num, 10);
  if (isNaN(num) || num <= 0) return "";
  if (num === 15) return "טו";
  if (num === 16) return "טז";
  const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  let str = "";
  let h = Math.floor(num / 100);
  if (h > 0) {
    if (h <= 4) str += ["", "ק", "ר", "ש", "ת"][h];
    else if (h < hundreds.length) str += hundreds[h];
    num %= 100;
  }
  let t = Math.floor(num / 10);
  let o = num % 10;
  if (t === 1 && (o === 5 || o === 6)) {
    str += (o === 5) ? "טו" : "טז";
  } else {
    str += tens[t] + ones[o];
  }
  return str;
}

function updateGrid() {
  const root = document.documentElement;
  const rawCol = parseFloat(document.getElementById('prop-col').value) || 0;
  const rawMargin = parseFloat(document.getElementById('prop-margin').value) || 0;
  const rawGutter = parseFloat(document.getElementById('prop-gutter').value) || 0;
  const rawGap = parseFloat(document.getElementById('prop-gap').value) || 0;
  const total = 2 * rawCol + 2 * rawMargin + rawGutter + 2 * rawGap;
  const scale = total > 0 ? 100 / total : 1;
  root.style.setProperty('--w-col', (rawCol * scale) + '%');
  root.style.setProperty('--w-margin', (rawMargin * scale) + '%');
  root.style.setProperty('--w-gutter', (rawGutter * scale) + '%');
  root.style.setProperty('--w-gap', (rawGap * scale) + '%');
  root.style.setProperty('--flow-mt', document.getElementById('prop-mt').value + 'px');
  root.style.setProperty('--flow-mb', document.getElementById('prop-mb').value + 'px');
}

function updateStyles() {
  const root = document.documentElement;
  root.style.setProperty('--fn-header-r', document.getElementById('f-hdr-r').value);
  root.style.setProperty('--sz-header-r', document.getElementById('s-hdr-r').value + 'pt');
  root.style.setProperty('--fn-header-c', document.getElementById('f-hdr-c').value);
  root.style.setProperty('--sz-header-c', document.getElementById('s-hdr-c').value + 'pt');
  root.style.setProperty('--fn-header-l', document.getElementById('f-hdr-l').value);
  root.style.setProperty('--sz-header-l', document.getElementById('s-hdr-l').value + 'pt');

  root.style.setProperty('--fn-h0', document.getElementById('f-h0').value);
  root.style.setProperty('--sz-h0', document.getElementById('s-h0').value + 'pt');
  root.style.setProperty('--fn-h0-body', document.getElementById('f-h0-body').value);
  root.style.setProperty('--sz-h0-body', document.getElementById('s-h0-body').value + 'pt');

  root.style.setProperty('--fn-h1', document.getElementById('f-h1').value);
  root.style.setProperty('--sz-h1', document.getElementById('s-h1').value + 'pt');
  root.style.setProperty('--fn-h2', document.getElementById('f-h2').value);
  root.style.setProperty('--sz-h2', document.getElementById('s-h2').value + 'pt');
  root.style.setProperty('--fn-h3', document.getElementById('f-h3').value);
  root.style.setProperty('--sz-h3', document.getElementById('s-h3').value + 'pt');
  root.style.setProperty('--fn-h4', document.getElementById('f-h4').value);
  root.style.setProperty('--sz-h4', document.getElementById('s-h4').value + 'pt');
  root.style.setProperty('--fn-h5', document.getElementById('f-h5').value);
  root.style.setProperty('--sz-h5', document.getElementById('s-h5').value + 'pt');
  root.style.setProperty('--fn-h6', document.getElementById('f-h6').value);
  root.style.setProperty('--sz-h6', document.getElementById('s-h6').value + 'pt');
  root.style.setProperty('--fn-h7', document.getElementById('f-h7').value);
  root.style.setProperty('--sz-h7', document.getElementById('s-h7').value + 'pt');

  root.style.setProperty('--fn-sh-title', document.getElementById('f-sh-title').value);
  root.style.setProperty('--sz-sh-title', document.getElementById('s-sh-title').value + 'pt');
  root.style.setProperty('--fn-sh-sub', document.getElementById('f-sh-sub').value);
  root.style.setProperty('--sz-sh-sub', document.getElementById('s-sh-sub').value + 'pt');
  root.style.setProperty('--fn-sh-desc', document.getElementById('f-sh-desc').value);
  root.style.setProperty('--sz-sh-desc', document.getElementById('s-sh-desc').value + 'pt');
  root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec').value);
  root.style.setProperty('--sz-sh-sec', document.getElementById('s-sh-sec').value + 'pt');
  root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author').value);
  root.style.setProperty('--sz-sh-author', document.getElementById('s-sh-author').value + 'pt');
  root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year').value);
  root.style.setProperty('--sz-sh-year', document.getElementById('s-sh-year').value + 'pt');

  root.style.setProperty('--fn-first-word', document.getElementById('font-first-word').value);
  root.style.setProperty('--sz-first-word', document.getElementById('size-first-word').value + 'em');
  root.style.setProperty('--fn-body', document.getElementById('font-body').value);
  root.style.setProperty('--sz-body', document.getElementById('size-body').value + 'pt');
}

function createDropWord(text, isContinuation, isSingleLine) {
  if (isContinuation) return text;
  text = text.trim();
  const firstSpace = text.indexOf(' ');
  if (firstSpace === -1) {
    return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${text}</span>`;
  }
  const firstWord = text.substring(0, firstSpace);
  const rest = text.substring(firstSpace + 1);
  return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${firstWord}</span> ${rest}`;
}

function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole) {
  const page = document.createElement('div');
  page.className = 'a4-page';
  applyContentBg(page, pageRole || 'regular');

  const hdrRType = document.getElementById('hdr-r-type').value;
  const hdrRAlign = document.getElementById('hdr-r-align').value;
  const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, h1Title, h2Title, h3Title, bookTitle);

  const hdrCType = document.getElementById('hdr-c-type').value;
  const hdrCAlign = document.getElementById('hdr-c-align').value;
  const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, h1Title, h2Title, h3Title, bookTitle);

  const hdrLType = document.getElementById('hdr-l-type').value;
  const hdrLAlign = document.getElementById('hdr-l-align').value;
  const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, h1Title, h2Title, h3Title, bookTitle);

  page.innerHTML = `
    <div class="page-content-wrapper">
      <div class="top-header-grid">
        <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
        <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
        <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
      </div>
      <div class="page-body-flow">
        ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${h2TokenId}" id="heading-tok-${h2TokenId}"` : ''}>${h2Text}</div>` : ''}
      </div>
      <div class="page-number-footer">${toGematria(pNum)}</div>
    </div>
  `;

  container.appendChild(page);
  const bodyFlow = page.querySelector('.page-body-flow');
  return { page, bodyFlow };
}

function parseMetadataFromText(rawText) {
  const lines = rawText.split('\n');
  const cleanLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    let match = false;

    if (/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
      document.getElementById('inp-book-title').value = trimmed.replace(/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*/i, '').trim();
      match = true;
    } else if (/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
      document.getElementById('inp-book-subtitle').value = trimmed.replace(/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*/i, '').trim();
      match = true;
    } else if (/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
      document.getElementById('inp-book-desc').value = trimmed.replace(/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*/i, '').trim();
      match = true;
    } else if (/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
      document.getElementById('inp-book-sections').value = trimmed.replace(/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*/i, '').trim();
      match = true;
    } else if (/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
      document.getElementById('inp-book-author').value = trimmed.replace(/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*/i, '').trim();
      match = true;
    } else if (/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
      document.getElementById('inp-book-year').value = trimmed.replace(/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*/i, '').trim();
      match = true;
    }

    if (!match) {
      cleanLines.push(line);
    }
  }
  return cleanLines.join('\n');
}

function estimateSectionFillRatio(tokens) {
  const sampleFlow = document.querySelector('.page-body-flow');
  const perPageCapacity = (sampleFlow ? sampleFlow.clientHeight : 900) * 2;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;width:580px;';
  probe.className = 'page-body-flow';
  document.body.appendChild(probe);
  let totalHeight = 0;
  tokens.forEach(t => {
    if (t.type === 'p') {
      const p = document.createElement('p');
      p.innerHTML = createDropWord(t.text, false, true);
      probe.appendChild(p);
      totalHeight += p.getBoundingClientRect().height;
      probe.removeChild(p);
    } else if (t.type.startsWith('h')) {
      const h = document.createElement('div');
      h.className = t.customStyleId ? 'title-level-custom' : `title-level-${t.level}`;
      h.textContent = t.text;
      probe.appendChild(h);
      totalHeight += h.getBoundingClientRect().height;
      const hStyle = window.getComputedStyle(h);
      totalHeight += parseFloat(hStyle.marginTop) + parseFloat(hStyle.marginBottom);
      probe.removeChild(h);
    }
  });
  document.body.removeChild(probe);
  if (totalHeight <= 0) return 1;
  const naivePages = Math.ceil(totalHeight / perPageCapacity);
  if (naivePages <= 1) return 1;
  const ratio = totalHeight / (naivePages * perPageCapacity);
  return Math.max(0.3, Math.min(1, ratio));
}

function getLinesFromParagraph(text, colWidth, styleObj, useWindowIfMultipleLines) {
  const measureContainer = document.getElementById('measuring-box');
  measureContainer.style.width = colWidth + 'px';
  measureContainer.style.fontFamily = styleObj.fontFamily;
  measureContainer.style.fontSize = styleObj.fontSize;
  measureContainer.style.lineHeight = styleObj.lineHeight;
  measureContainer.style.textAlign = 'justify';
  measureContainer.style.textJustify = 'inter-word';
  measureContainer.style.direction = 'rtl';
  measureContainer.innerHTML = '';
  
  const pMeasure = document.createElement('p');
  pMeasure.style.margin = '0';
  pMeasure.style.padding = '0';
  
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return { lines: [], hasWindow: false };

  pMeasure.textContent = text;
  measureContainer.appendChild(pMeasure);
  const singleLineHeight = pMeasure.offsetHeight;
  pMeasure.textContent = "א";
  const oneLineH = pMeasure.offsetHeight;
  const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
  const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
  
  let html = '';
  if (shouldApplyWindow) {
    html += `<span class="first-word-window" id="mw-0">${words[0]}</span> `;
    for (let i = 1; i < words.length; i++) {
      html += `<span id="mw-${i}">${words[i]}</span> `;
    }
  } else {
    for (let i = 0; i < words.length; i++) {
      html += `<span id="mw-${i}">${words[i]}</span> `;
    }
  }
  
  pMeasure.innerHTML = html;
  
  const lines = [];
  let currentLine = [];
  let currentTop = -1;
  
  for (let i = 0; i < words.length; i++) {
    const span = document.getElementById(`mw-${i}`);
    if (!span) continue;
    const top = span.offsetTop;
    if (currentTop === -1) currentTop = top;
    if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
      lines.push(currentLine.join(' '));
      currentLine = [words[i]];
      currentTop = top;
    } else {
      currentLine.push(words[i]);
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }
  
  measureContainer.innerHTML = '';
  return { lines, hasWindow: shouldApplyWindow };
}

function justifyColumnVertically(col, targetHeight, styleObj) {
  const currentH = col.scrollHeight;
  const diff = targetHeight - currentH;
  if (diff > 2 && diff <= 60) {
    let pElements = Array.from(col.querySelectorAll('p'));
    if (pElements.length > 1) {
       let extraSpacing = diff / (pElements.length - 1);
       pElements.slice(0, -1).forEach(p => {
         let currentMargin = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
         p.style.marginBottom = (currentMargin + extraSpacing) + 'px';
       });
    } else if (pElements.length === 1) {
       let p = pElements[0];
       let currentLineHeight = parseFloat(styleObj.lineHeight) || 1.34;
       let linesInfo = getLinesFromParagraph(p.getAttribute('data-raw-text') || p.textContent, col.offsetWidth, styleObj, false);
       let numLines = linesInfo.lines.length;
       if (numLines > 1) {
           let fontSizePx = parseFloat(styleObj.fontSize) * 1.333;
           let extraLh = (diff / numLines) / fontSizePx;
           p.style.lineHeight = (currentLineHeight + extraLh).toString();
       }
    }
  }
}

function balanceColumns(block, colWidth, styleObj, snapshot) {
  if (snapshot) {
    footnoteQueueForPage.length = snapshot.footnoteQueueLen;
    endnoteQueueForPart.length = snapshot.endnoteQueueLen;
    noteCounters.footnote = snapshot.footnoteCounter;
    noteCounters.endnote = snapshot.endnoteCounter;
    noteUidCounter = snapshot.noteUid;
  }

  const rCol = block.querySelector('.right-col');
  const lCol = block.querySelector('.left-col');
  const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
  if (allChildren.length === 0) return;

  let mergedItems = [];
  for (let child of allChildren) {
    if (child.tagName === 'P') {
      let id = child.getAttribute('data-token-id');
      let text = child.getAttribute('data-raw-text');
      let isCont = child.getAttribute('data-is-cont') === 'true';
      let sideNote = child.getAttribute('data-side-note');
      let endNote = child.getAttribute('data-end-note');
      let lastItem = mergedItems[mergedItems.length - 1];
      if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
         lastItem.rawText += ' ' + text;
         if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
         if (endNote && !lastItem.endNote) lastItem.endNote = endNote;
      } else {
         mergedItems.push({ type: 'p', id: id, rawText: text, isCont: isCont, sideNote: sideNote, endNote: endNote });
      }
    } else {
      mergedItems.push({ type: 'h', id: child.getAttribute('data-token-id'), html: child.outerHTML, level: child.className.match(/title-level-(\d+)/)?.[1] });
    }
  }

  const items = mergedItems.map(item => {
    if (item.type === 'p') {
      let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
      return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow };
    }
    return item;
  });

  const splitPoints = [];
  for (let i = 0; i <= items.length; i++) {
    if (i < items.length && items[i].type === 'p') {
      let lines = items[i].lines;
      splitPoints.push({ itemIndex: i, lineIndex: 0 });
      for (let l = 1; l < lines.length; l++) {
        splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines });
      }
    } else {
      splitPoints.push({ itemIndex: i, lineIndex: 0 });
    }
  }

  const validSplitPoints = splitPoints.filter(sp => {
    if (sp.lineIndex > 0) return true;
    if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
    return true;
  });

  let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
  if (pointsToEvaluate.length === 0) return;

  function renderSingleItemFast(col, item) {
    if (item.type === 'h') {
      col.insertAdjacentHTML('beforeend', item.html);
    } else {
      const p = document.createElement('p');
      p.className = 'p-end';
      p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
      applyDelimiterStyles(p, 'body', getBodySizePt(), true);
      col.appendChild(p);
    }
  }

  let bestSplit = pointsToEvaluate[0];
  let minAbsDiff = Infinity;

  for (let sp of pointsToEvaluate) {
    rCol.innerHTML = '';
    for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
    if (sp.lineIndex > 0) {
      let item = items[sp.itemIndex];
      let pRight = document.createElement('p');
      pRight.className = 'p-cut';
      let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
      pRight.innerHTML = createDropWord(rightText, item.isCont, false);
      rCol.appendChild(pRight);
    }
    let rHeight = rCol.scrollHeight;

    lCol.innerHTML = '';
    if (sp.lineIndex > 0) {
      let item = items[sp.itemIndex];
      let pLeft = document.createElement('p');
      pLeft.className = 'p-end';
      let leftText = sp.lines.slice(sp.lineIndex).join(' ');
      pLeft.innerHTML = createDropWord(leftText, true, false);
      lCol.appendChild(pLeft);
    }
    for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) renderSingleItemFast(lCol, items[i]);
    let lHeight = lCol.scrollHeight;
    let diff = rHeight - lHeight;
    let absDiff = Math.abs(diff);
    
    if (absDiff < minAbsDiff || (absDiff === minAbsDiff && diff >= 0)) {
        minAbsDiff = absDiff;
        bestSplit = sp;
    }
  }

  rCol.innerHTML = '';
  lCol.innerHTML = '';
  const rMargin = block.querySelector('.right-margin');
  const lMargin = block.querySelector('.left-margin');
  rMargin.innerHTML = '';
  lMargin.innerHTML = '';
  const finalNotes = [];

  function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
    if (item.type === 'h') {
      col.insertAdjacentHTML('beforeend', item.html);
    } else {
      const p = document.createElement('p');
      p.className = isPartial && isRight ? 'p-cut' : 'p-end';
      p.setAttribute('data-token-id', item.id);
      
      let textToRender = isPartial ? partialText : item.rawText;
      p.setAttribute('data-raw-text', textToRender);
      p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
      if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
      if (item.endNote) p.setAttribute('data-end-note', item.endNote);
      
      let isSingleLine = false;
      if (!isPartial) {
          isSingleLine = item.isSingleLine;
      } else {
          let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
          isSingleLine = linesInfo.lines.length <= 1;
      }
      
      p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
      applyDelimiterStyles(p, 'body', getBodySizePt(), false);

      if (item.endNote && !isCont) {
        const marker = createNoteMarkerAndQueue(item.endNote, null, 'endnote');
        p.appendChild(marker);
      }

      col.appendChild(p);

      if (item.sideNote && !isCont) {
        const noteElem = document.createElement('div');
        noteElem.className = 'side-note-anchor';
        noteElem.textContent = item.sideNote;
        if (item.sideNoteStyleId) {
          const inst = findExtTextStyle(item.sideNoteStyleId);
          if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
        }
        margin.appendChild(noteElem);
        finalNotes.push({ elem: noteElem, pElem: p });
      }
    }
  }

  for (let i = 0; i < bestSplit.itemIndex; i++) appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
  if (bestSplit.lineIndex > 0) {
    let item = items[bestSplit.itemIndex];
    let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
    appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont);
    let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
    appendItemFinal(lCol, lMargin, item, false, true, leftText, true);
  }
  for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
    appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
  }

  let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
  if (finalDiff > 2 && finalDiff <= 60) {
      justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
  } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
      justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
  }

  finalizeNotePositions(finalNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
}

function finalizeNotePositions(notesList, columnBoundaryHeight) {
  const byMargin = new Map();
  notesList.forEach(item => {
    if (!item.elem || !item.pElem) return;
    const marg = item.elem.parentElement;
    if (!marg) return;
    if (!byMargin.has(marg)) byMargin.set(marg, []);
    byMargin.get(marg).push(item);
  });
  byMargin.forEach(group => {
    group.sort((a, b) => a.pElem.offsetTop - b.pElem.offsetTop);
    group.forEach((item, idx) => {
      const noteHeight = item.elem.getBoundingClientRect().height || item.elem.offsetHeight || 0;
      let top = item.pElem.offsetTop;
      if (top + noteHeight > columnBoundaryHeight) {
        const prev = idx > 0 ? group[idx - 1] : null;
        const prevBottom = prev ? (parseFloat(prev.elem.style.top || 0) + (prev.elem.getBoundingClientRect().height || 0)) : 0;
        const minTop = prev ? prevBottom + 6 : 0;
        const raisedTop = columnBoundaryHeight - noteHeight;
        if (raisedTop >= minTop) {
          top = raisedTop;
        } else {
          const tokenId = item.pElem.getAttribute('data-token-id');
          const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
          if (contElem && contElem !== item.pElem) {
            const page = contElem.closest('.a4-page');
            const isRightCol = !!contElem.closest('.right-col');
            const destMargin = page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null;
            if (destMargin) {
              const next = idx < group.length - 1 ? group[idx + 1] : null;
              const maxTop = next ? (parseFloat(next.elem.style.top || Infinity) - noteHeight - 6) : Infinity;
              const contTop = contElem.offsetTop;
              if (contTop <= maxTop) {
                destMargin.appendChild(item.elem);
                top = contTop;
              }
            }
          }
        }
      }
      item.elem.style.top = top + 'px';
    });
  });
}

function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt, isDryRun = false) {
  const activeStyles = [];

  const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
  const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
  if (fnOpen && fnClose) {
    activeStyles.push({
      def: { trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose }, target: 'footnote' },
      instanceId: 'builtin-footnote'
    });
  }

  if (typeof importedTextStyles !== 'undefined') {
    importedTextStyles.forEach(inst => {
      const trig = inst.def && inst.def.trigger;
      if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
      const scope = trig.appliesWithin;
      if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
      activeStyles.push(inst);
    });
  }

  if (!activeStyles.length) return;
  const effHostSize = hostSizePt || 12;

  const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let n;
  while (n = walker.nextNode()) textNodes.push(n);

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    let matches = [];
    activeStyles.forEach(inst => {
      const trig = inst.def.trigger;
      let searchFrom = 0;
      while (true) {
        const oIdx = text.indexOf(trig.open, searchFrom);
        if (oIdx === -1) break;
        const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
        if (cIdx === -1) break;
        matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
        searchFrom = cIdx + trig.close.length;
      }
    });
    if (!matches.length) return;
    matches.sort((a,b) => a.start - b.start);
    const dedup = [];
    let lastEnd = -1;
    matches.forEach(m => { if (m.start >= lastEnd) { dedup.push(m); lastEnd = m.end; } });

    const frag = document.createDocumentFragment();
    let cursor = 0;
    dedup.forEach(m => {
      if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
      if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
        const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
        const innerText = text.slice(m.start + openLen, m.end - closeLen);
        
        if (isDryRun) {
          const dummyMarker = document.createElement('a');
          dummyMarker.className = 'note-marker';
          dummyMarker.textContent = 'א';
          applyNoteMarkerStyle(dummyMarker, false);
          frag.appendChild(dummyMarker);
        } else {
          const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
          frag.appendChild(marker);
        }
      } else {
        const span = document.createElement('span');
        span.textContent = text.slice(m.start, m.end);
        applyExtStyleToNode(span, m.inst.def.style, effHostSize);
        frag.appendChild(span);
      }
      cursor = m.end;
    });
    if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function getHostSizePt(level, customStyleId) {
  if (customStyleId && typeof findExtTextStyle === 'function') {
    const inst = findExtTextStyle(customStyleId);
    if (inst && inst.def.style && typeof inst.def.style.size === 'number') return inst.def.style.size;
    return 12;
  }
  const el = document.getElementById('s-h' + level);
  return el ? parseFloat(el.value) : 12;
}

function getBodySizePt() {
  const el = document.getElementById('size-body');
  return el ? parseFloat(el.value) : 12;
}

function getNoteConfig(styleId) {
  const inst = (typeof findExtTextStyle === 'function') ? findExtTextStyle(styleId) : null;
  return (inst && inst.def.noteConfig) || {};
}

function formatNoteMarker(n, styleId) {
  const cfg = getNoteConfig(styleId);
  const globalNumStyle = document.getElementById('note-numbering-style')?.value || 'gematria';
  const numStyle = cfg.numberingStyle || globalNumStyle;
  if (numStyle === 'decimal' || numStyle === 'numeric') {
    return String(n);
  }
  return toGematria(n) || String(n);
}

function resetNoteCounterIfNeeded(target, trigger) {
  let shouldReset = false;
  if (target === 'footnote' && trigger === 'page') shouldReset = true;
  if (target === 'endnote' && trigger === 'part') shouldReset = true;

  if (typeof importedTextStyles !== 'undefined') {
    importedTextStyles.forEach(inst => {
      if (inst.def && inst.def.target === target) {
        const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt) || (target === 'footnote' ? 'page' : 'part');
        if (resetAt === trigger) shouldReset = true;
      }
    });
  }

  if (shouldReset) {
    noteCounters[target] = 0;
  }
}

function applyNoteMarkerStyle(el, isBacklink) {
  const typeEl = document.getElementById('note-marker-type');
  const sizeEl = isBacklink ? document.getElementById('note-listing-num-size') : document.getElementById('note-marker-size');
  const type = (!isBacklink && typeEl) ? typeEl.value : 'normal';
  const size = sizeEl ? parseFloat(sizeEl.value) : 8;
  el.style.fontSize = size + 'pt';
  el.style.fontWeight = '700';
  el.style.textDecoration = 'none';
  el.style.color = 'inherit';
  el.style.cursor = 'pointer';
  if (type === 'super') { el.style.verticalAlign = 'super'; el.style.lineHeight = '0'; }
  else if (type === 'sub') { el.style.verticalAlign = 'sub'; el.style.lineHeight = '0'; }
  else { el.style.verticalAlign = 'baseline'; }
  if (!isBacklink && type === 'brackets') { el.textContent = '[' + el.textContent + ']'; }
}

function createNoteMarkerAndQueue(text, styleId, target) {
  noteCounters[target] = (noteCounters[target] || 0) + 1;
  const num = noteCounters[target];
  const markerText = formatNoteMarker(num, styleId);
  const uid = 'n' + (noteUidCounter++);
  const marker = document.createElement('a');
  marker.className = 'note-marker';
  marker.href = '#note-' + uid;
  marker.id = 'noteref-' + uid;
  marker.textContent = markerText;
  applyNoteMarkerStyle(marker, false);
  const item = { number: markerText, text: text, styleId: styleId, uid: uid };
  if (target === 'footnote') footnoteQueueForPage.push(item);
  else endnoteQueueForPart.push(item);
  return marker;
}

function buildNoteBlockElement(queue, columns) {
  const wrap = document.createElement('div');
  wrap.className = 'note-block';
  if (columns === 2) wrap.style.columnCount = '2';
  const sepEl = document.getElementById('note-num-separator');
  const globalSep = sepEl ? sepEl.value : '.';
  queue.forEach(item => {
    const line = document.createElement('div');
    line.className = 'note-line';
    line.id = 'note-' + item.uid;
    const num = document.createElement('a');
    num.className = 'note-line-num';
    num.href = '#noteref-' + item.uid;
    num.textContent = item.number + globalSep + ' ';
    applyNoteMarkerStyle(num, true);
    const body = document.createElement('span');
    body.textContent = item.text;
    const inst = (typeof findExtTextStyle === 'function') ? findExtTextStyle(item.styleId) : null;
    if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
    line.appendChild(num); line.appendChild(body);
    wrap.appendChild(line);
  });
  return wrap;
}

function flushFootnotesInto(pageEl) {
  if (!footnoteQueueForPage.length) { 
    resetNoteCounterIfNeeded('footnote', 'page'); 
    return; 
  }
  const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
  const rule = buildNoteRuleElement();
  const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
  const area = document.createElement('div');
  area.className = 'footnote-area';
  area.appendChild(rule);
  area.appendChild(block);

  const wrapper = pageEl.querySelector('.page-content-wrapper');
  const footer = pageEl.querySelector('.page-number-footer');
  if (wrapper && footer) {
    wrapper.insertBefore(area, footer);
  } else {
    pageEl.appendChild(area);
  }

  footnoteQueueForPage = [];
  resetNoteCounterIfNeeded('footnote', 'page');
}

function flushEndnotesForPart(container, pIdx) {
  if (!endnoteQueueForPart.length) { resetNoteCounterIfNeeded('endnote', 'part'); return 0; }
  const cfg0 = getNoteConfig(endnoteQueueForPart[0].styleId);
  const columns = cfg0.columns || 1;
  let pagesUsed = 0;
  let remaining = endnoteQueueForPart.slice();
  while (remaining.length) {
    const page = document.createElement('div');
    page.className = 'a4-page';
    applyContentBg(page, 'regular');
    const title = document.createElement('div');
    title.className = 'title-level-2-standalone';
    title.textContent = pagesUsed === 0 ? 'הערות' : 'הערות (המשך)';
    page.appendChild(title);
    const wrap = document.createElement('div');
    wrap.className = 'note-block endnote-page-block';
    if (columns === 2) wrap.style.columnCount = '2';
    page.appendChild(wrap);
    container.appendChild(page);
    let fit = 0;
    for (let i = 0; i < remaining.length; i++) {
      const testBlock = buildNoteBlockElement(remaining.slice(0, i + 1), columns);
      wrap.innerHTML = ''; wrap.appendChild(testBlock);
      if (wrap.scrollHeight > page.clientHeight - 60 && i > 0) { break; }
      fit = i + 1;
    }
    remaining = remaining.slice(fit);
    pagesUsed++;
    if (pagesUsed > 200) break;
  }
  endnoteQueueForPart = [];
  resetNoteCounterIfNeeded('endnote', 'part');
  return pagesUsed;
}

function measureNoteBlockHeight(queue, columns) {
  if (!queue.length) return 0;
  const probe = buildNoteBlockElement(queue, columns);
  probe.style.position = 'absolute'; probe.style.visibility = 'hidden'; probe.style.width = '160mm';
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  document.body.removeChild(probe);
  return h;
}

function appendMainSubParts(hostElem, mainText, subText, def) {
  const mainPart = document.createElement('div');
  mainPart.textContent = mainText.trim();
  applyExtStyleToNode(mainPart, def.style, 14);
  hostElem.appendChild(mainPart);
  if (subText && subText.trim()) {
    const subPart = document.createElement('div');
    subPart.textContent = subText.trim();
    subPart.style.fontSize = '0.68em'; subPart.style.opacity = '0.78'; subPart.style.marginTop = '3px';
    hostElem.appendChild(subPart);
  }
}

function renderCustomHeadingInto(hostElem, inst, text) {
  const def = inst.def;
  hostElem.innerHTML = '';

  if (def.parseMode === 'splitFirstDash' && /[-–—]/.test(text)) {
    appendMainSubParts(hostElem, text.split(/[-–—]/)[0], text.split(/[-–—]/).slice(1).join(' - '), def);
    return;
  }

  if (def.parseMode === 'splitCustomDelimiter' && def.parseDelimiter && text.indexOf(def.parseDelimiter) > -1) {
    const idx = text.indexOf(def.parseDelimiter);
    appendMainSubParts(hostElem, text.slice(0, idx), text.slice(idx + def.parseDelimiter.length), def);
    return;
  }

  if (def.parseMode === 'regexGroups' && def.parseRegex) {
    let match = null;
    try {
      match = text.match(new RegExp(def.parseRegex));
    } catch (e) {
      console.warn('סגנון "' + def.name + '": ביטוי רגולרי לא תקין (' + def.parseRegex + ') — ' + e.message);
    }
    if (match && match.groups && Object.keys(match.groups).length) {
      const vals = Object.values(match.groups).filter(v => v !== undefined);
      if (vals.length) {
        appendMainSubParts(hostElem, vals[0], vals.slice(1).join(' '), def);
        return;
      }
    }
  }

  hostElem.textContent = text;
  applyExtStyleToNode(hostElem, def.style, 12);
}

function buildStructuredTOC(tokenList, showLevels, groupLevels) {
  const entries = [];
  const minGroupLevel = groupLevels.length > 0 ? Math.min(...groupLevels) : 99;
  let currentGroupItems = [];

  function flushGroup() {
    if (currentGroupItems.length > 0) {
      entries.push({ isGroup: true, items: currentGroupItems.slice() });
      currentGroupItems = [];
    }
  }

  tokenList.forEach(t => {
    const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? 7 : null);
    const txt = t.type.startsWith('h') ? t.text : t.sideNote;
    if (lvl === null || !txt) return;
    if (!showLevels.includes(lvl)) return;

    if (lvl >= minGroupLevel) {
      currentGroupItems.push({ id: t.id, level: lvl, text: txt });
    } else {
      flushGroup();
      entries.push({ id: t.id, level: lvl, text: txt, isGroup: false });
    }
  });

  flushGroup();
  return entries;
}

function renderPaginatedTOC(container, entries, titleText, bookTitle, h1Title, pageIndex, curH1, curH2, tocPrefix) {
  if (entries.length === 0) return 0;

  let pagesCount = 0;
  let currentEntryIdx = 0;
  let lastRenderedGrid = null;
  let lastRenderedPage = null;

  const hdrRType = document.getElementById('hdr-r-type').value;
  const hdrCType = document.getElementById('hdr-c-type').value;
  const hdrLType = document.getElementById('hdr-l-type').value;
  const hdrRAlign = document.getElementById('hdr-r-align').value;
  const hdrCAlign = document.getElementById('hdr-c-align').value;
  const hdrLAlign = document.getElementById('hdr-l-align').value;
  
  const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
  const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
  const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

  const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
  const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
  const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);

  function getTocStyle(level) {
    const f = document.getElementById(`f-${tocPrefix}-${level}`);
    const s = document.getElementById(`s-${tocPrefix}-${level}`);
    if(f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
    return '';
  }

  while (currentEntryIdx < entries.length) {
    const isFirstTOCPage = (pagesCount === 0);
    pagesCount++;

    const page = document.createElement('div');
    page.className = 'a4-page toc-page';
    applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
    lastRenderedPage = page;
    
    page.innerHTML = `
      <div class="page-content-wrapper">
        <div class="top-header-grid">
          <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
          <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
          <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
        </div>
        <div class="page-body-flow">
          ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
          <div class="toc-grid-full"></div>
        </div>
        <div class="page-number-footer">${toGematria(pageIndex + pagesCount - 1)}</div>
      </div>
    `;
    container.appendChild(page);

    const gridFull = page.querySelector('.toc-grid-full');
    lastRenderedGrid = gridFull;

    const bodyFlow = page.querySelector('.page-body-flow');
    const maxH = bodyFlow.clientHeight || 870;

    let pageStartIndex = currentEntryIdx;
    let lastSubjectIdx = currentEntryIdx; 

    while (currentEntryIdx < entries.length) {
      const it = entries[currentEntryIdx];
      
      if (!it.isGroup && (it.level === 1 || it.level === 2)) {
         lastSubjectIdx = currentEntryIdx;
      }

      let itemHTML = '';
      
      if (it.isGroup) {
        const inlineSpans = it.items.map(grp => 
          `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${grp.id}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${grp.text}</span> - <span class="grp-page" data-target-id="${grp.id}"></span></a></span>`
        ).join('<span class="grp-sep">|</span>');
        itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
      } else {
        itemHTML = `
          <div class="toc-entry-group" style="${getTocStyle(it.level)}">
            <a href="#heading-tok-${it.id}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
              <span class="toc-title">${it.text}</span>
              <span class="toc-dots"></span>
              <span class="toc-page-num" data-target-id="${it.id}"></span>
            </a>
          </div>
        `;
      }

      gridFull.insertAdjacentHTML('beforeend', itemHTML);
      
      if (bodyFlow.scrollHeight > maxH) {
        gridFull.lastElementChild.remove();
        
        if (gridFull.children.length > 0) {
            if (lastSubjectIdx > pageStartIndex) {
                const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                for (let k = 0; k < itemsToRemove; k++) {
                    gridFull.lastElementChild.remove();
                }
                currentEntryIdx = lastSubjectIdx;
            }
            break;
        } else {
            gridFull.insertAdjacentHTML('beforeend', itemHTML);
            currentEntryIdx++;
            break;
        }
      }
      
      currentEntryIdx++;
    }
  }

  if (lastRenderedGrid) {
    lastRenderedGrid.style.justifyContent = 'flex-start';
  }
  if (lastRenderedPage) {
    applyContentBg(lastRenderedPage, 'tocLast');
  }

  return pagesCount;
}

/* ==========================================================================
   7. מנוע העימוד המלא (Main Typesetting Function)
   ========================================================================== */
function typesetDocument() {
  updateGrid();
  updateStyles();

  noteCounters = { footnote: 0, endnote: 0 };
  noteUidCounter = 0;
  footnoteQueueForPage = [];
  endnoteQueueForPart = [];

  let rawText = document.getElementById('raw-input').value;
  if (!rawText.trim()) return;

  rawText = parseMetadataFromText(rawText);

  const container = document.getElementById('book-container');
  container.innerHTML = '';

  const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

  const lines = rawText.split('\n');
  const tokens = [];
  let pendingSideNote = null;
  let pendingSideNoteStyleId = null;
  let pendingEndNote = null;
  lineToTokenMap = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx].trim();
    if (!line) {
      lineToTokenMap[lineIdx] = null;
      continue;
    }

    if (enLinePrefix && line.startsWith(enLinePrefix)) {
      pendingEndNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
      lineToTokenMap[lineIdx] = null;
      continue;
    }

    const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
    if (hMatch) {
      const lvl = parseInt(hMatch[1], 10);
      const txt = hMatch[2].trim();
      if (lvl === 7) {
        pendingSideNote = txt;
        pendingSideNoteStyleId = null;
        lineToTokenMap[lineIdx] = null;
      } else {
        const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
        tokens.push(tokenObj);
        lineToTokenMap[lineIdx] = tokenObj.id;
      }
    } else {
      let customMatch = null;
      if (typeof importedTextStyles !== 'undefined') {
        for (const inst of importedTextStyles) {
          const trig = inst.def && inst.def.trigger;
          if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
            customMatch = { inst, text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim() };
            break;
          }
        }
      }
      if (customMatch) {
        if (customMatch.inst.def.target === 'endnote') {
          pendingEndNote = customMatch.text;
          lineToTokenMap[lineIdx] = null;
        } else if (customMatch.inst.def.layoutMode === 'side_note') {
          pendingSideNote = customMatch.text;
          pendingSideNoteStyleId = customMatch.inst.instanceId;
          lineToTokenMap[lineIdx] = null;
        } else {
          const lvl = customMatch.inst.syntheticLevel;
          const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: customMatch.text, lineIdx: lineIdx, customStyleId: customMatch.inst.instanceId };
          tokens.push(tokenObj);
          lineToTokenMap[lineIdx] = tokenObj.id;
        }
      } else {
        const tokenObj = {
          id: tokens.length,
          type: 'p',
          text: line,
          sideNote: pendingSideNote,
          sideNoteStyleId: pendingSideNoteStyleId,
          endNote: pendingEndNote,
          lineIdx: lineIdx
        };
        tokens.push(tokenObj);
        lineToTokenMap[lineIdx] = tokenObj.id;
        pendingSideNote = null;
        pendingSideNoteStyleId = null;
        pendingEndNote = null;
      }
    }
  }

  const headingModes = {
    0: document.getElementById('mode-h0').value,
    1: document.getElementById('mode-h1').value,
    2: document.getElementById('mode-h2').value,
    3: document.getElementById('mode-h3').value,
    4: document.getElementById('mode-h4').value,
    5: document.getElementById('mode-h5').value,
    6: document.getElementById('mode-h6').value,
    7: document.getElementById('mode-h7').value
  };
  if (typeof importedTextStyles !== 'undefined') {
    importedTextStyles.forEach(inst => {
      if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
    });
  }

  const oddPageRequired = {
    0: document.getElementById('odd-h0').checked,
    1: document.getElementById('odd-h1').checked,
    2: document.getElementById('odd-h2').checked
  };
  if (typeof importedTextStyles !== 'undefined') {
    importedTextStyles.forEach(inst => {
      if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
    });
  }

  function ensureOddPageStart(level) {
    if (!oddPageRequired[level]) return;
    if (pageIndex % 2 === 0) {
      const blank = document.createElement('div');
      blank.className = 'a4-page blank-page';
      container.appendChild(blank);
      pageIndex++;
    }
  }

  const sections = [];
  let currentSection = { type: 'body', tokens: [] };

  tokens.forEach(t => {
    const mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
    if (mode === 'sub_shaar') {
      if (currentSection.tokens.length > 0) sections.push(currentSection);
      sections.push({ type: 'sub_shaar', token: t, tokens: [] });
      currentSection = { type: 'body', tokens: [] };
    } else if (mode === 'new_page_1col') {
      if (currentSection.tokens.length > 0) sections.push(currentSection);
      currentSection = { type: 'body', isNewPage: true, hToken: t, tokens: [] };
    } else {
      currentSection.tokens.push(t);
    }
  });
  if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
    sections.push(currentSection);
  }

  const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
  const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
  if (typeof importedTextStyles !== 'undefined') {
    importedTextStyles.forEach(inst => {
      if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
        gtocShows.push(inst.syntheticLevel);
        if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
      }
    });
  }

  const headingPageMap = {};
  let pageIndex = 1;
  let currentH1Title = '';
  let currentH2Title = '';
  let currentH3Title = '';

  const bookTitle = document.getElementById('inp-book-title').value || "ספר";
  const showMainShaar = document.getElementById('show-main-shaar').checked;
  const showBackShaar = document.getElementById('show-back-shaar').checked;
  const activeThemeId = document.getElementById('active-theme-select').value;
  const secDivStyle = document.getElementById('section-divider-style').value;
  const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
  const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

  const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
  const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
  const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

  if (showMainShaar) {
    renderExtAnchor(container, 'beforeAll', rawText);
    renderMainShaar(container, activeThemeId);
    renderExtAnchor(container, 'afterMainShaar', rawText);
  } else {
    renderExtAnchor(container, 'beforeAll', rawText);
  }

  if (showBackShaar) {
    renderBackShaar(container, activeThemeId);
  }

  if (enableGeneralTOC) {
    const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
    const pagesRendered = renderPaginatedTOC(
      container, 
      generalTocEntries, 
      "תוכן העניינים הכללי", 
      bookTitle, 
      "תוכן העניינים הכללי", 
      pageIndex,
      "תוכן העניינים הכללי", "תוכן העניינים הכללי",
      "gtoc"
    );
    pageIndex += pagesRendered;
  }
  renderExtAnchor(container, 'afterGeneralToc', rawText);

  const styleObj = {
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
    fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
    lineHeight: '1.34'
  };

  function getFootnotesReservedHeight() {
    if (!footnoteQueueForPage.length) return 0;
    const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
    return measureNoteBlockHeight(footnoteQueueForPage, cfg0.columns || 1) + 24;
  }

  let hasOpenPart = false;
  let prevPageEl = null;

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const sec = sections[sIdx];

    if (sec.type === 'sub_shaar') {
      if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
      if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
      renderExtAnchor(container, 'beforeEachPart', rawText);
      hasOpenPart = true;
      ensureOddPageStart(sec.token.level);
      renderSubShaar(container, sec.token, activeThemeId);
      if (sec.token.customStyleId) {
        const inst = findExtTextStyle(sec.token.customStyleId);
        const justRendered = container.lastElementChild;
        if (inst && justRendered) {
          const tEl = justRendered.querySelector('.book-title-main');
          const sEl = justRendered.querySelector('.book-subtitle');
          if (tEl) applyExtStyleToNode(tEl, inst.def.style, 36);
          if (sEl) applyExtStyleToNode(sEl, inst.def.style, 21);
        }
      }
      currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
      headingPageMap[sec.token.id] = toGematria(pageIndex);

      if (enableDetailedTOC) {
        let inThisH1 = false;
        const thisH1Tokens = [];

        for (let t of tokens) {
          if (t.id === sec.token.id) { inThisH1 = true; continue; }
          if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
          if (inThisH1) thisH1Tokens.push(t);
        }

        const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
        const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
        if (typeof importedTextStyles !== 'undefined') {
          importedTextStyles.forEach(inst => {
            if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
              dtocShows.push(inst.syntheticLevel);
              if (inst.def.toc.grouping) dtocGroups.push(inst.syntheticLevel);
            }
          });
        }
        const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
        const dtocPages = renderPaginatedTOC(
          container, 
          detailedTocEntries, 
          "מפתח ולוח עניינים מפורט", 
          currentH1Title, 
          "תוכן העניינים המפורט", 
          pageIndex,
          currentH1Title, "תוכן העניינים המפורט",
          "dtoc"
        );
        pageIndex += dtocPages;
      }
      renderExtAnchor(container, 'afterEachPart', rawText);
      continue;
    }

    let isFirstPage = true;
    let h2Text = sec.isNewPage ? sec.hToken.text : '';
    let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
    let isH0 = sec.isNewPage && sec.hToken.level === 0;

    if (h2Text) {
      currentH2Title = h2Text;
      headingPageMap[h2Id] = toGematria(pageIndex);
    }

    let secTokens = sec.tokens.slice();
    let tokenIndex = 0;
    let pendingWordTokens = null;
    const sectionFillRatio = (document.getElementById('balance-chapter-end').value === 'yes')
      ? estimateSectionFillRatio(secTokens) : 1;

    while (tokenIndex < secTokens.length || pendingWordTokens) {
      if (prevPageEl) flushFootnotesInto(prevPageEl);
      if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);
      const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
      let pageLayout = createPageLayout(
        container, 
        isFirstPage ? h2Text : '', 
        isFirstPage ? h2Id : undefined, 
        pageIndex, 
        currentH1Title, 
        currentH2Title,
        currentH3Title,
        bookTitle,
        customR, customC, customL,
        pageRole
      );
      pageIndex++;
      prevPageEl = pageLayout.page;
      
      let remPageHeight = pageLayout.bodyFlow.clientHeight * sectionFillRatio;
      if (isFirstPage && h2Text) {
         const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
         const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
         if (title && sec.hToken.customStyleId) {
            const inst = findExtTextStyle(sec.hToken.customStyleId);
            if (inst) renderCustomHeadingInto(title, inst, h2Text);
         }
         let used = 0;
         if (spacer) used += spacer.getBoundingClientRect().height;
         if (title) {
             used += title.getBoundingClientRect().height;
             const titleStyle = window.getComputedStyle(title);
             used += parseFloat(titleStyle.marginTop) + parseFloat(titleStyle.marginBottom);
         }
         remPageHeight -= used;
      }
      isFirstPage = false;

      if (isH0) {
        const singleBlock = document.createElement('div');
        singleBlock.className = 'block-single-col';
        singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
        pageLayout.bodyFlow.appendChild(singleBlock);
        const targetCol = singleBlock.querySelector('.single-wide-col');
        let pageHasContent = false;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
          const currentAvailH = remPageHeight - getFootnotesReservedHeight();
          if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
            break;
          }

          let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

          if (currentTok.type.startsWith('h')) {
            if (currentTok.level === 3) currentH3Title = currentTok.text;
            const hElem = document.createElement('div');
            hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
            hElem.setAttribute('data-token-id', currentTok.id);
            if (currentTok.customStyleId) {
              const inst = findExtTextStyle(currentTok.customStyleId);
              if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
            } else {
              hElem.textContent = currentTok.text;
            }
            applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId), false);
            targetCol.appendChild(hElem);
            
            if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
              targetCol.removeChild(hElem);
              break;
            }

            if (document.getElementById('avoid-widows-select').value === 'yes'
                && (tokenIndex + 1 < secTokens.length)
                && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                && targetCol.children.length > 1) {
              targetCol.removeChild(hElem);
              break;
            }
            
            headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
            tokenIndex++;
            continue;
          }

          if (currentTok.type === 'p') {
            let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
            let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
            let isContinuation = !!pendingWordTokens;
            let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

            const pElem = document.createElement('p');
            pElem.setAttribute('data-token-id', currentTok.id);
            targetCol.appendChild(pElem);

            let bestFitLine = 0;
            for (let i = 1; i <= lines.length; i++) {
              let testText = lines.slice(0, i).join(' ');
              pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
              pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
              
              const availH = remPageHeight - getFootnotesReservedHeight();
              if (targetCol.scrollHeight <= availH) {
                bestFitLine = i;
              } else {
                break;
              }
            }

            if (bestFitLine === 0) {
              targetCol.removeChild(pElem);
              if (targetCol.children.length > 0) {
                let lastEl = targetCol.lastElementChild;
                while (lastEl && lastEl.className.startsWith('title-level-')) {
                  targetCol.removeChild(lastEl);
                  tokenIndex--;
                  lastEl = targetCol.lastElementChild;
                }
                break;
              } else {
                if (!pageHasContent) {
                    bestFitLine = 1;
                } else {
                    break;
                }
              }
            }

            if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
              const remainingAfterSplit = lines.length - bestFitLine;
              if (bestFitLine === 1 && pageHasContent) {
                targetCol.removeChild(pElem);
                break;
              } else if (remainingAfterSplit === 1) {
                if (bestFitLine > 1) {
                  bestFitLine -= 1;
                } else if (pageHasContent) {
                  targetCol.removeChild(pElem);
                  break;
                }
              }
            }

            if (bestFitLine > 0) pageHasContent = true;

            const chunk = lines.slice(0, bestFitLine).join(' ');
            const isEndOfP = (bestFitLine === lines.length);
            pElem.className = isEndOfP ? 'p-end' : 'p-cut';
            pElem.setAttribute('data-raw-text', chunk);
            pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
            applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

            if (isEndOfP) {
              pendingWordTokens = null;
              tokenIndex++;
            } else {
              pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
              break;
            }
          }
        }
        continue;
      }

      let pagePendingNotes = [];

      while ((tokenIndex < secTokens.length || pendingWordTokens) && (remPageHeight - getFootnotesReservedHeight()) > 45) {
        let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
        const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

        if (peekMode === 'span_1col' && !pendingWordTokens) {
          const currentAvailH = remPageHeight - getFootnotesReservedHeight();
          if (currentAvailH < 60) {
            break;
          }
          if (peekTok.level === 3) currentH3Title = peekTok.text;
          const spanBlock = document.createElement('div');
          spanBlock.className = 'block-h3-span';
          const spanTitle = document.createElement('div');
          spanTitle.className = 'h3-title-text';
          spanTitle.setAttribute('data-token-id', peekTok.id);
          spanTitle.id = `heading-tok-${peekTok.id}`;
          if (peekTok.customStyleId) {
            const inst = findExtTextStyle(peekTok.customStyleId);
            if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text); else spanTitle.textContent = peekTok.text;
          } else {
            spanTitle.textContent = peekTok.text;
          }
          applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId), false);
          spanBlock.appendChild(spanTitle);
          pageLayout.bodyFlow.appendChild(spanBlock);

          const spanHeight = spanBlock.getBoundingClientRect().height + 4;
          if (spanHeight > (remPageHeight - getFootnotesReservedHeight())) {
            pageLayout.bodyFlow.removeChild(spanBlock);
            break;
          }
          if (document.getElementById('avoid-widows-select').value === 'yes'
              && (tokenIndex + 1 < secTokens.length)
              && ((remPageHeight - getFootnotesReservedHeight()) - spanHeight < 30)) {
            pageLayout.bodyFlow.removeChild(spanBlock);
            break;
          }

          headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
          remPageHeight -= spanHeight;
          tokenIndex++;
          continue;
        }

        const block2Col = document.createElement('div');
        block2Col.className = 'block-2col';
        block2Col.innerHTML = `
          <div class="margin-notes-column right-margin"></div>
          <div></div>
          <div class="main-column right-col"></div>
          <div></div>
          <div class="main-column left-col"></div>
          <div></div>
          <div class="margin-notes-column left-margin"></div>
        `;
        pageLayout.bodyFlow.appendChild(block2Col);

        const blockNoteSnapshot = {
          footnoteQueueLen: footnoteQueueForPage.length,
          endnoteQueueLen: endnoteQueueForPart.length,
          footnoteCounter: noteCounters.footnote || 0,
          endnoteCounter: noteCounters.endnote || 0,
          noteUid: noteUidCounter
        };

        const rCol = block2Col.querySelector('.right-col');
        const lCol = block2Col.querySelector('.left-col');
        const rMargin = block2Col.querySelector('.right-margin');
        const lMargin = block2Col.querySelector('.left-margin');
        const colWidth = rCol.offsetWidth || 272;
        let pageHasContent = false;

        ['right', 'left'].forEach((colName) => {
          let targetCol = colName === 'right' ? rCol : lCol;
          let targetMargin = colName === 'right' ? rMargin : lMargin;

          while (tokenIndex < secTokens.length || pendingWordTokens) {
            let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
            const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

            if (curMode === 'span_1col' && !pendingWordTokens) {
              break;
            }

            const currentAvailH = remPageHeight - getFootnotesReservedHeight();
            if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
              break;
            }

            if (currentTok.type.startsWith('h')) {
              if (currentTok.level === 3) currentH3Title = currentTok.text;
              const hElem = document.createElement('div');
              hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
              hElem.setAttribute('data-token-id', currentTok.id);
              hElem.id = `heading-tok-${currentTok.id}`;
              if (currentTok.customStyleId) {
                const inst = findExtTextStyle(currentTok.customStyleId);
                if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
              } else {
                hElem.textContent = currentTok.text;
              }
              applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId), false);
              targetCol.appendChild(hElem);

              if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                targetCol.removeChild(hElem);
                break;
              }

              if (document.getElementById('avoid-widows-select').value === 'yes'
                  && (tokenIndex + 1 < secTokens.length)
                  && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                  && targetCol.children.length > 1) {
                targetCol.removeChild(hElem);
                break;
              }

              if (!headingPageMap[currentTok.id]) {
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
              }

              tokenIndex++;
              continue;
            }

            if (currentTok.type === 'p') {
              let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
              let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
              let isContinuation = !!pendingWordTokens;
              let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

              const pElem = document.createElement('p');
              pElem.setAttribute('data-token-id', currentTok.id);
              pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
              if (currentTok.endNote) pElem.setAttribute('data-end-note', currentTok.endNote);
              targetCol.appendChild(pElem);

              if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
              }

              let bestFitLine = 0;
              for (let i = 1; i <= lines.length; i++) {
                let testText = lines.slice(0, i).join(' ');
                pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                
                const availH = remPageHeight - getFootnotesReservedHeight();
                if (targetCol.scrollHeight <= availH) {
                  bestFitLine = i;
                } else {
                  break;
                }
              }

              if (bestFitLine === 0) {
                targetCol.removeChild(pElem);
                if (targetCol.children.length > 0) {
                  let lastEl = targetCol.lastElementChild;
                  while (lastEl && lastEl.className.startsWith('title-level-')) {
                    targetCol.removeChild(lastEl);
                    tokenIndex--;
                    lastEl = targetCol.lastElementChild;
                  }
                  break;
                } else {
                  if (!pageHasContent) {
                      bestFitLine = 1;
                  } else {
                      break;
                  }
                }
              }

              if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                const remainingAfterSplit = lines.length - bestFitLine;
                if (bestFitLine === 1 && pageHasContent) {
                  targetCol.removeChild(pElem);
                  break;
                } else if (remainingAfterSplit === 1) {
                  if (bestFitLine > 1) {
                    bestFitLine -= 1;
                  } else if (pageHasContent) {
                    targetCol.removeChild(pElem);
                    break;
                  }
                }
              }

              if (bestFitLine > 0) pageHasContent = true;

              const chunk = lines.slice(0, bestFitLine).join(' ');
              const isEndOfP = (bestFitLine === lines.length);
              pElem.className = isEndOfP ? 'p-end' : 'p-cut';
              pElem.setAttribute('data-raw-text', chunk);
              pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
              applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

              if (currentTok.endNote && isEndOfP) {
                const marker = createNoteMarkerAndQueue(currentTok.endNote, null, 'endnote');
                pElem.appendChild(marker);
              }

              if (!isContinuation && currentTok.sideNote) {
                pElem.setAttribute('data-side-note', currentTok.sideNote);
                const noteElem = document.createElement('div');
                noteElem.className = 'side-note-anchor';
                noteElem.textContent = currentTok.sideNote;
                if (currentTok.sideNoteStyleId) {
                  const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                  if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                }
                targetMargin.appendChild(noteElem);
                pagePendingNotes.push({ elem: noteElem, pElem: pElem });
              }

              if (isEndOfP) {
                pendingWordTokens = null;
                tokenIndex++;
              } else {
                pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                break;
              }
            }
          }
        });

        if (rCol.children.length === 0 && lCol.children.length === 0) {
            if (blockNoteSnapshot) {
              footnoteQueueForPage.length = blockNoteSnapshot.footnoteQueueLen;
              endnoteQueueForPart.length = blockNoteSnapshot.endnoteQueueLen;
              noteCounters.footnote = blockNoteSnapshot.footnoteCounter;
              noteCounters.endnote = blockNoteSnapshot.endnoteCounter;
              noteUidCounter = blockNoteSnapshot.noteUid;
            }
            pageLayout.bodyFlow.removeChild(block2Col);
            let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
            while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                pageLayout.bodyFlow.removeChild(lastFlowEl);
                tokenIndex--;
                lastFlowEl = pageLayout.bodyFlow.lastElementChild;
            }
            break;
        }

        if (tokenIndex >= secTokens.length && !pendingWordTokens) {
          balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot);
          const divHTML = getSectionDividerHTML(secDivStyle);
          if (divHTML) {
            const divContainer = document.createElement('div');
            divContainer.innerHTML = divHTML;
            pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
          }
          break;
        } else {
          let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
          const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';
          if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
            balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot);
          } else {
            let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
            if (finalDiff > 2 && finalDiff <= 60) {
                justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
            } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
            }
          }
        }
        
        remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
        finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
      }
    }
  }

  if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
  if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
  else if (endnoteQueueForPart.length) { flushEndnotesForPart(container, pageIndex); }
  renderExtAnchor(container, 'afterAll', rawText);

  document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
    const targetId = span.getAttribute('data-target-id');
    if (targetId && headingPageMap[targetId]) {
      span.textContent = headingPageMap[targetId];
    }
  });
}
```

---

### קובץ 5: `app.js`

קובץ זה מנהל את כל פעולות המשתמש, שינוי גודל הסרגל בעכבר, טעינת הפונטים מהמחשב, ייבוא תוספים חיצוניים, שמירת תבנית HTML מלאה וטעינת ברירת המחדל באתחול הדף.

שמור קובץ זה באותה תיקייה בשם `app.js`:

```javascript
/* ==========================================================================
   app.js - ניהול ממשק משתמש, סרגל צד, קבצים ואתחול
   ========================================================================== */

const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');
let isResizing = false;

resizer.addEventListener('mousedown', () => {
  isResizing = true;
  resizer.classList.add('resizing');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
});

window.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  const newWidth = document.body.clientWidth - e.clientX;
  if (newWidth >= 360 && newWidth <= 800) {
    sidebar.style.width = newWidth + 'px';
  }
});

window.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    resizer.classList.remove('resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
});

function toggleCbgSubRows(role, mode) {
  const rowColor = document.getElementById('row-cbg-' + role + '-color');
  const rowImg = document.getElementById('row-cbg-' + role + '-img');
  const rowOp = document.getElementById('row-cbg-' + role + '-op');
  if (rowColor) rowColor.style.display = (mode === 'color') ? 'flex' : 'none';
  if (rowImg) rowImg.style.display = (mode === 'image') ? 'flex' : 'none';
  if (rowOp) rowOp.style.display = (mode === 'image') ? 'flex' : 'none';
}

function togglePanelBody(bodyId) {
  const body = document.getElementById(bodyId);
  if (body) {
    body.style.display = (body.style.display === 'none') ? 'block' : 'none';
  }
}

/* ==========================================================================
   ניהול ערכות נושא מותאמות אישית
   ========================================================================== */
let customThemes = [];

function addNewCustomTheme() {
  const nameInput = document.getElementById('builder-theme-name');
  const name = nameInput.value.trim();
  if (!name) {
    alert('אנא הזן שם לערכת הנושא.');
    return;
  }

  const mainSvg = document.getElementById('data-builder-main-svg').value;
  const backSvg = document.getElementById('data-builder-back-svg').value;
  const subSvg = document.getElementById('data-builder-sub-svg').value;

  const themeObj = {
    id: 'theme_' + Date.now(),
    name: name,
    mainShaar: {
      svgData: mainSvg || '',
      top: parseFloat(document.getElementById('builder-main-top').value) || 20,
      bottom: parseFloat(document.getElementById('builder-main-bottom').value) || 16,
      right: parseFloat(document.getElementById('builder-main-right').value) || 15,
      left: parseFloat(document.getElementById('builder-main-left').value) || 15
    },
    backShaar: {
      svgData: backSvg || '',
      top: parseFloat(document.getElementById('builder-back-top').value) || 22,
      bottom: parseFloat(document.getElementById('builder-back-bottom').value) || 18,
      right: parseFloat(document.getElementById('builder-back-right').value) || 15,
      left: parseFloat(document.getElementById('builder-back-left').value) || 95
    },
    subShaar: {
      svgData: subSvg || '',
      top: parseFloat(document.getElementById('builder-sub-top').value) || 20,
      bottom: parseFloat(document.getElementById('builder-sub-bottom').value) || 20,
      right: parseFloat(document.getElementById('builder-sub-right').value) || 95,
      left: parseFloat(document.getElementById('builder-sub-left').value) || 15
    }
  };

  customThemes.push(themeObj);
  refreshCustomThemesUI();

  const select = document.getElementById('active-theme-select');
  if (select) {
    select.value = themeObj.id;
  }

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

  if (select && currentVal) {
    select.value = currentVal;
  }
}

/* ==========================================================================
   ניהול תוספים (Extensions)
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
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    let def;
    try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
    const errMsg = validateExtJSON(def, 'pageType');
    if (errMsg) { alert(errMsg); return; }
    const instanceId = 'ext-pt-' + (extImportCounter++);
    importedPageTypes.push({ instanceId, def, anchor: def.insertionAnchor || 'afterAll', repeatMode: def.repeatMode || 'once' });
    buildExtPanel('pageType', instanceId, def.name, def);
    typesetDocument();
  };
  reader.readAsText(file);
  event.target.value = '';
}

function handleTextStyleImportFile(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    let def;
    try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
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
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const instanceId = 'ext-img-' + (extImportCounter++);
    importedImagePages.push({ instanceId, name: file.name, dataUrl: e.target.result, anchor: 'afterAll' });
    buildExtPanel('imagePage', instanceId, 'תמונה: ' + file.name, null);
    typesetDocument();
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

const EXT_ANCHOR_OPTIONS = [
  ['beforeAll','לפני הכל'], ['afterMainShaar','אחרי השער הראשי'], ['afterGeneralToc','אחרי תוכן העניינים הכללי'],
  ['beforeEachPart','לפני כל שער-חלק'], ['afterEachPart','מיד אחרי כל שער-חלק'], ['endOfEachPart','בסוף כל חלק'], ['afterAll','אחרי הכל']
];

function buildExtPanel(kind, instanceId, name, def) {
  const panel = document.createElement('div');
  panel.className = 'panel-static';
  panel.id = instanceId + '-panel';
  const icon = kind === 'pageType' ? '📄' : kind === 'textStyle' ? '🅰️' : '🖼️';
  let triggerInfo = '';
  if (kind === 'textStyle' && def && def.trigger) {
    triggerInfo = (def.trigger.type === 'delimiterPair')
      ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${def.trigger.open}" ל-"${def.trigger.close}"</div>`
      : `<div style="font-size:7.5pt;color:#888;">קידומת: "${def.trigger.prefix}"</div>`;
  }
  const anchorRow = (kind !== 'textStyle')
    ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${instanceId}-anchor" onchange="updateExtAnchor('${kind}','${instanceId}', this.value)">${EXT_ANCHOR_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>`
    : '';
  panel.innerHTML = `
    <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
      <span>${icon} ${name}</span>
      <span style="cursor:pointer;color:#a33;font-weight:700;" onclick="removeExtInstance('${kind}','${instanceId}')">✕ הסר</span>
    </div>
    ${triggerInfo}
    ${anchorRow}
  `;
  document.getElementById('ext-imports-container').appendChild(panel);
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

const EXT_V_MAP = { top:'14mm', upperMid:'25%', center:'50%', lowerMid:'75%' };

function applyExtStyleToNode(node, style, hostFontSizePt) {
  if (!style) return;
  if (style.family) node.style.fontFamily = style.family;
  if (typeof style.size === 'number') node.style.fontSize = style.size + 'pt';
  if (typeof style.sizeDelta === 'number') node.style.fontSize = ((hostFontSizePt||12) + style.sizeDelta) + 'pt';
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
    else if (bs === 'texture') { page.style.background = '#fdfcf6 url("'+CBG_TEXTURE_SVG+'") repeat'; }
    else if (bs === 'image' && def.background.image) {
      const fade = 1 - (def.background.opacity != null ? def.background.opacity : 0.15);
      page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${def.background.image}")`;
      page.style.backgroundSize = 'cover'; page.style.backgroundPosition = 'center';
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
    if (va === 'bottom') { el.style.bottom = (18 - off) + 'mm'; }
    else {
      el.style.top = `calc(${EXT_V_MAP[va] || '50%'} + ${off}px)`;
      if (va === 'center' || va === 'upperMid' || va === 'lowerMid') el.style.transform = 'translateY(-50%)';
    }
    if (ha === 'right' || ha === 'rightMid') { el.style.right = (ha === 'right' ? '15mm' : '25%'); }
    else if (ha === 'left' || ha === 'leftMid') { el.style.left = (ha === 'left' ? '15mm' : '25%'); }
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

/* ==========================================================================
   העלאת קבצי תמונה ו-SVG
   ========================================================================== */
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
   שמירת תבנית מלאה (Save Template)
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
    customThemes: customThemes
  });

  document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"], input[type="color"], input[type="range"]').forEach(input => {
    input.setAttribute('value', input.value);
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

  const rawInputElem = document.getElementById('raw-input');
  const prevVal = rawInputElem.value;
  rawInputElem.innerHTML = '';
  rawInputElem.value = '';

  const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  rawInputElem.value = prevVal;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'torani-typesetting-template.html';
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ==========================================================================
   טעינת גופני Windows מקומיים
   ========================================================================== */
async function loadSystemFonts() {
  if ('queryLocalFonts' in window) {
    try {
      const availableFonts = await window.queryLocalFonts();
      const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));
      
      if (fontFamilies.length > 0) {
        document.querySelectorAll('.font-picker').forEach(select => {
          const currentVal = select.value;
          select.innerHTML = '';
          
          const sysGroup = document.createElement('optgroup');
          sysGroup.label = `גופני מחשב (${fontFamilies.length} נמצאו)`;
          
          fontFamilies.forEach(family => {
            const opt = document.createElement('option');
            opt.value = `'${family}', serif`;
            opt.textContent = family;
            if (currentVal.includes(family)) opt.selected = true;
            sysGroup.appendChild(opt);
          });
          
          select.appendChild(sysGroup);
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

/* ==========================================================================
   סנכרון סמן עריכה לתצוגה המקדימה
   ========================================================================== */
const textarea = document.getElementById('raw-input');

function syncCursorToPreview() {
  const cursorPos = textarea.selectionStart;
  const textBefore = textarea.value.substring(0, cursorPos);
  const currentLineIdx = textBefore.split('\n').length - 1;

  if (lineToTokenMap && lineToTokenMap[currentLineIdx] !== undefined) {
    let tokenId = lineToTokenMap[currentLineIdx];
    if (tokenId === null) {
      for (let k = currentLineIdx - 1; k >= 0; k--) {
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

textarea.addEventListener('click', syncCursorToPreview);
textarea.addEventListener('keyup', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
    syncCursorToPreview();
  }
});

/* ==========================================================================
   שחזור הגדרות תוספים ואירוע טעינה ראשוני (Bootstrap)
   ========================================================================== */
function rehydrateExtImports() {
  const island = document.getElementById('ext-imports-data');
  if (!island || !island.textContent.trim()) return;
  let data;
  try { data = JSON.parse(island.textContent); } catch(e) { return; }
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
  let maxCounter = 0;
  let maxSynth = 7;
  [...importedPageTypes, ...importedTextStyles, ...importedImagePages].forEach(inst => {
    const n = parseInt((inst.instanceId.match(/-(\d+)$/) || [0,0])[1], 10);
    if (n >= maxCounter) maxCounter = n + 1;
    if (typeof inst.syntheticLevel === 'number' && inst.syntheticLevel > maxSynth) maxSynth = inst.syntheticLevel;
  });
  extImportCounter = maxCounter;
  nextSyntheticLevel = maxSynth + 1;
}

window.onload = function() {
  refreshCustomThemesUI();
  rehydrateExtImports();
  
  if (document.getElementById('section-divider-style').value === 'custom_img') {
    document.getElementById('row-sec-div-img').style.display = 'flex';
  }
  if (document.getElementById('hdr-c-type').value === 'custom_img') {
    document.getElementById('row-hdr-c-img').style.display = 'flex';
  }

  textarea.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - סימן א - דיני תפילת השחר וזמנה
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
  
  typesetDocument();
};
```

---

### סיכום מבנה הקבצים בתיקייה:
ודא שכל 5 הקבצים שמורים באותה תיקייה בדיוק:
- `index.html`
- `style.css`
- `decorations.js`
- `typesetter.js`
- `app.js`

כעת המערכת מודולרית לחלוטין: מנוע העימוד מופרד ומוגן, עיצוב ה-CSS עומד בפני עצמו, וב-`decorations.js` תוכל להוסיף כל עיטור SVG עתידי בקלות ישירות לאובייקטים המתאימים.

---

## פנייה 5: לא כלכך הבנתי איך להטמיע והיכן ערכת נושא (הכוללת (לכל היותר, אבל תיתכן ערכת…

לא כלכך הבנתי איך להטמיע והיכן ערכת נושא (הכוללת (לכל היותר, אבל תיתכן ערכת נושא שיהיו בה חלק מהקבצים) 1. שער ראשי. 2. שער משנה. 3. שער אחורי. 4. עיטור כותרת עליונה. 5. עיטור סוף פרק. 6. מפריד הערות שוליים)
אשמח אם תחזיר טמפלט שבו אצטרך רק להדביק את הקוד של הSVG.
ותורה לי היכן להדביקו בדיוק.

---

### 🤖 תגובה 7: Clarifying User Understanding I'm focusing now on the user's need. It's…

**Clarifying User Understanding**

I'm focusing now on the user's need. It's becoming clearer that the core issue is a lack of clarity on *where* and *how* to embed a complete "Theme Set" (ערכת נושא). I am working to define all the required parts of this.


**Defining Theme Structure**

I've outlined the necessary components of a "Theme Set" – Main, Sub, and Back Shaar, Running Header ornament, Chapter divider, and Footnote rule separator. I'm aiming for a ready-made template snippet with SVG placeholders and precise instructions.


**Pinpointing Core Functionality**

I'm now zeroing in on the essence of the user's intent. The crucial aspect seems to be the relationship between the Shaar themes and the broader decorative elements. I need to determine if they want a cohesive, bundled "Theme" or just guidance for configuring decorations. The HTML and JS examples are helping to clarify potential solutions.


**Refining Component Grouping**

I'm now clarifying the relationship between the UI components and the user's concept of a "Theme Set". The user seeks a ready-made template with SVG placeholders. The Shaar themes, handled by the system, correspond to items 1, 2, and 3. The other decorative elements (4, 5, 6) are separate, but users expect a complete stylistic package. The next step is to unify these expectations.


**Simplifying Integration Paths**

I'm now determining the most straightforward method for incorporating SVGs into the system. Option A involves direct modular placement within `decorations.js` using copy-paste templates for each of the six items. Option B focuses on a unified theme object, but it might overcomplicate things. I'm leaning toward Option A because I need a perfectly straightforward method aligned with the existing code so I don't break anything. I'm focusing on clarifying how `BUILTIN_SHAAR_THEMES`, `HEADER_ORNAMENTS`, and `SECTION_DIVIDERS` work to integrate the new decorations.


**Uncovering Elegant SVG Placement**

I've realized something exciting. If a user pastes raw SVG code directly into the `mainHTML`, `backHTML`, or `subHTML` fields within `BUILTIN_SHAAR_THEMES`, it will render perfectly as a page frame or background! This simple approach elegantly addresses the full-page SVG scenario for Shaar themes, by using the already existing `.a4-page` HTML structure. It's a great example of an easy-to-use option, which I'll focus on in the documentation!


**Clarifying Layout Options**

I'm now zeroing in on defining the precise placement of each decorative element. Specifically, I'm focusing on where the user should embed the SVG code for each item: Shaar (main, back, sub), Running Header, Section Divider, and Footnote Separator. I'm also considering the ideal SVG structure, with `<svg>` tags and margins. I am finalizing the "where" and "how" instructions for the user.


**Centralizing Theme Registration**

I'm now focusing on streamlining the theme integration process. Editing multiple files seems cumbersome, so I am exploring the idea of a single "Theme Registration" block in `decorations.js`. I am trying to create a template with clear, step-by-step instructions. This will include adding a simple function or registry within `decorations.js`, coupled with instructions for updating the `index.html` menu.


**Defining Integration Templates**

I'm now outlining a clear and direct method for theme integration. I've broken down the steps: paste the SVG code (from `<svg>` to `</svg>`) into a template object in `decorations.js`, then update `index.html`. For partial themes, I'll clarify that missing elements are just omitted from the template. I'm focusing on ensuring this is easy to understand and use. I want to provide a clean template object for `decorations.js` and 1-line code additions for `index.html`.

---

### 🤖 תגובה 8: כדי שתוכל להוסיף ערכות נושא ועיטורים בקלות ובלי להסתבך עם קוד מורכב, הנה הסבר…

כדי שתוכל להוסיף ערכות נושא ועיטורים בקלות ובלי להסתבך עם קוד מורכב, הנה הסבר פשוט וטמפלט מוכן להדבקה.

כל ההדבקות של קובצי ה-SVG נעשות **בקובץ אחד בלבד: `decorations.js`**. 
לאחר מכן מוסיפים שורה פשוטה ב-`index.html` כדי שהעיטורים יופיעו ברשימות הנפתחות בסרגל הצד.

---

### שלב 1: פתח את הקובץ `decorations.js`

בתחילת הקובץ (או בסופו), הדבק את הבלוק הבא. החלף את הטקסטים המסומנים בקוד ה-SVG שלך (פתח את קובץ ה-SVG בפנקס רשימות / Notepad, העתק את כל הטקסט מ-`<svg>` עד `</svg>`, והדבק אותו בין הגרשים ההפוכים \` \`).

> **שים לב:** אם בערכה מסוימת **חסר לך אלמנט** (למשל אין שער אחורי או אין עיטור כותרת) – פשוט השאר את המקום ריק: `''`, והמערכת תתעלם ממנו אוטומטית.

```javascript
/* ==========================================================================
   הגדרת ערכת נושא חדשה (שערים + עיטורים)
   החלף את "my_theme" במזהה באנגלית (למשל "vilna", "jerusalem")
   ========================================================================== */

// --------------------------------------------------------------------------
// 1-3. שערי הספר (ראשי, משנה, אחורי)
// --------------------------------------------------------------------------
BUILTIN_SHAAR_THEMES['my_theme'] = {
  // 1. שער ראשי
  mainHTML: `
    <!-- הדבק כאן את קוד ה-SVG של השער הראשי -->
    <!-- טיפ: הוסף ל-svg את התכונה class="custom-bg-img" כדי שיימתח על כל הדף -->
    <svg class="custom-bg-img" preserveAspectRatio="none" viewBox="0 0 794 1123">
      <!-- קוד ה-SVG של השער הראשי כאן -->
    </svg>
  `,

  // 2. שער משנה (טור שמאלי) - אם אין, השאר ריק: ''
  subHTML: `
    <svg class="custom-bg-img" preserveAspectRatio="none" viewBox="0 0 794 1123">
      <!-- קוד ה-SVG של שער המשנה כאן -->
    </svg>
  `,
  subStyle: `position:absolute; top:20mm; bottom:20mm; right:95mm; left:15mm;`,

  // 3. שער אחורי (גב השער - טור ימני) - אם אין, השאר ריק: ''
  backHTML: `
    <svg class="custom-bg-img" preserveAspectRatio="none" viewBox="0 0 794 1123">
      <!-- קוד ה-SVG של השער האחורי כאן -->
    </svg>
  `,
  backStyle: `position:absolute; top:22mm; bottom:18mm; right:15mm; left:95mm;`
};


// --------------------------------------------------------------------------
// 4. עיטור כותרת עליונה (Running Header) - אם אין, ניתן למחוק שורה זו
// --------------------------------------------------------------------------
HEADER_ORNAMENTS['my_theme_header'] = `
  <!-- הדבק כאן את קוד ה-SVG של כותרת עליונה (מומלץ גובה סביב 12-18px) -->
  <svg style="height:14px; width:50px;" viewBox="0 0 200 40">
    <!-- קוד ה-SVG של העיטור העליון כאן -->
  </svg>
`;


// --------------------------------------------------------------------------
// 5. עיטור סיום פרק (Section Divider) - אם אין, ניתן למחוק שורה זו
// --------------------------------------------------------------------------
SECTION_DIVIDERS['my_theme_divider'] = `
  <div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;">
    <!-- הדבק כאן את קוד ה-SVG של סיום פרק -->
    <svg style="width: 180px; height: 25px; margin: auto;" viewBox="0 0 300 40">
      <!-- קוד ה-SVG של עיטור סוף פרק כאן -->
    </svg>
  </div>
`;


// --------------------------------------------------------------------------
// 6. מפריד הערות שוליים (סימנים או גליף SVG בין הקווים) - אם אין, מחק
// --------------------------------------------------------------------------
NOTE_RULE_GLYPHS['my_theme_rule'] = '✦ ✦ ✦'; 
// לחלופין, ניתן להדביק גם SVG קטן:
// NOTE_RULE_GLYPHS['my_theme_rule'] = '<svg style="width:16px;height:16px;" viewBox="0 0 24 24">...</svg>';
```

---

### שלב 2: הוספת האפשרויות לתפריטי הבחירה ב-`index.html`

כדי שתוכל לבחור את העיטורים שהדבקת בסרגל הצד, פתח את `index.html` והוסף שורה אחת בתיבת הבחירה המתאימה (לפי מה שהגדרת):

#### עבור שערי הספר (1-3):
חפש את `<select id="active-theme-select">` (סביב שורה 28), והוסף:
```html
<option value="my_theme">4. הערכה החדשה שלי</option>
```

#### עבור עיטור כותרת עליונה (4):
חפש את `<select id="hdr-c-type">` (סביב שורה 220), והוסף:
```html
<option value="my_theme_header">עיטור הערכה החדשה (SVG)</option>
```

#### עבור עיטור סיום פרק (5):
חפש את `<select id="section-divider-style">` (סביב שורה 75), והוסף:
```html
<option value="my_theme_divider">עיטור סיום פרק חדש (SVG)</option>
```

#### עבור מפריד הערות שוליים (6):
חפש את `<select id="note-rule-style">` (סביב שורה 155), והוסף:
```html
<option value="my_theme_rule">קו + כוכביות הערכה ✦✦✦</option>
```

---

### טיפ חשוב ל-SVG של שערים:
- כדי ששער (SVG) יימתח באופן מושלם על כל שטח עמוד ה-A4, ודא שתגית ה-`<svg>` שלו כוללת את התכונות:
  ```html
  <svg class="custom-bg-img" preserveAspectRatio="none" viewBox="0 0 794 1123">
  ```
  (הגדלים 794x1123 מייצגים יחס מדויק של דף A4 ב-96 DPI).
- הטקסט של השערים (שם הספר, המחבר, ההקדשה וכו') ימוקם אוטומטית מעל ה-SVG בעזרת השכבות המובנות במערכת (`z-index: 20`).

---

## פנייה 6: יש דרך להכניס את כל קבצי הSVG שיש לי (יש כ1000), לתוך כמה קבצים, קובץ אחד לכל…

יש דרך להכניס את כל קבצי הSVG שיש לי (יש כ1000), לתוך כמה קבצים, קובץ אחד לכל סוג (. שער ראשי. 2. שער משנה. 3. שער אחורי. 4. עיטור כותרת עליונה. 5. עיטור סוף פרק. 6. מפריד הערות שוליים) לייצא אותם כקובץ ג'סון ,ושהמערכת תטען אותם באופן אוטומטי מתוך התקייה בה נמצא הקובץ הראשי.
אני אשמח שתכתוב את הקוד לטעינה האטומטית ותוסיף טעינה אוטומטית לכל הפונטים שנמצאים בתת תקייה בשם "fonts".
וכן, שתיצור קובץ HTML פשוט שבו יהיה לי אפשרות לבחור את כל קבצי הSVG שלי והוא ייצא אותם כבר כקובץ ג'סון ואני אשנה את השם של הקובץ לשם שתבחר ויטען אוטומטית.

---

### 🤖 תגובה 9: Analyzing the SVG Collection I'm currently focused on the user's overarching…

**Analyzing the SVG Collection**

I'm currently focused on the user's overarching goal: managing a vast SVG library across various categories. I've begun dissecting the problem, noting the specific number of files and the defined categories. I'm focusing on the implications of a 1,000-file collection for effective organization.


**Considering JSON Formatting**

I've been thinking about the practical implementation. Packing those SVG elements, like "Back Shaar" and "Footnote rule separator," into JSON seems the right approach. I'm imagining one JSON file per category, or possibly a more structured format for increased flexibility. Automatic loading of these JSONs and local fonts on startup is next. I am also pondering the browser sandbox restrictions on local file access and how to resolve.


**Addressing Local File Access**

My latest focus is on the crucial issue of accessing JSON files locally. The common `file:///` protocol restriction for `fetch()` presents a key hurdle. I'm exploring solutions like using a local web server (simple or more involved) or resorting to global variables within `.js` files if a server isn't feasible. The user's explicit request for JSON files adds another layer to my considerations.


**Refining Automatic Loading**

I'm now zeroing in on the file loading strategies. I'm prioritizing `fetch()` for JSON files, as planned, and will add direct support for them if the packer exports as `.json`. I'll provide clear guidance about potential CORS issues for users opening files directly in the browser and suggest local server solutions like Live Server as an alternative. Considering the user's specific workflow is key. I'm also addressing the challenge of identifying fonts within the 'fonts/' directory without relying on server-side capabilities, and considering ways JavaScript could discover and load font paths effectively.


**Structuring the File System**

I'm now clarifying the solution's structural components. I've outlined the JSON file naming convention, identifying six main files plus an optional `fonts.json` manifest. I'm imagining a `pack-assets.html` tool to manage the files. The tool will likely have buttons for file selections. I'm giving thought to adding a function to generate and insert the `fonts.json` directly.


**Designing the Asset Manager**

I'm now sketching out the asset management tool's user interface. I envision a selector for asset categories, allowing users to choose between categories 1 through 6 or Fonts. I will incorporate drag-and-drop or a multi-file picker to facilitate importing SVG files. I'm focusing on ensuring robust SVG handling, including `FileReader` and cleaning functions. The tool should export a JSON file with the correct name and has a tab to allow management of fonts and the generation of `fonts.json`.


**Implementing Dynamic UI Elements**

I'm now putting ideas into action, with updates on user interface elements. I'm focusing on dynamic injection of `<option>` tags within the sidebar's `<select>` elements. This includes the `#active-theme-select`, the header type selectors, and various other dropdowns. I'm prioritizing the dynamic loading of fonts from `fonts/fonts.json` using `FontFace` for broader accessibility. I'm also ensuring the loaded font names are injected into the `.font-picker` elements.

```
```

**Adding UI Input Options**

I'm now thinking about how to ensure the asset management tool is as user-friendly as possible, regardless of the user's setup. I'll add a file input button in the UI, even if a server is running. This approach offers flexibility and ensures users are never blocked from accessing and using the tool.

```json
```

**Designing the Packer Tool**

I'm now designing the file packer. I will use a dropdown menu to select the target category. The packer tool will include options for various categories. I'm imagining a multi-file input feature for SVG files and a corresponding table. The table will contain file name previews and a count. This tool needs to be self-contained, elegant, and in Hebrew.


**Integrating Autoloader Function**

I'm now determining the best location for the autoloader. I'm leaning toward a dedicated `initAssetAutoloader()` function. This should be placed in `decorations.js` or `app.js` at the bottom of `app.js` inside `window.onload`. This function must ensure seamless updates to the UI dropdowns. It will append external ornaments, dividers, and rule glyphs to their respective dropdown menus. I am also planning a feature to automatically name downloads correctly. I'm also planning batch handling of many files without crashing by using `FileReader` sequentially or in promises.

---

### 🤖 תגובה 10: כדי לנהל כמות כה גדולה של עיטורים (כ-1,000 קבצים) ביעילות ובלי להעמיס על קובצי…

כדי לנהל כמות כה גדולה של עיטורים (כ-1,000 קבצים) ביעילות ובלי להעמיס על קובצי הקוד, הפתרון הנכון ביותר הוא **מערכת מבוססת JSON חיצונית עם טעינה אוטומטית (Asynchronous Auto-Loader)**.

להלן הפתרון המלא, המחולק ל-3 חלקים:
1. **שמות הקבצים המוגדרים** (שבהם המערכת תחפש את הנתונים).
2. **קובץ כלי עצמאי (`svg-packer.html`)** – דף HTML פשוט שבו תבחר מאות קובצי SVG (או פונטים), והוא ייצור ויוריד עבורך מיד את קובץ ה-JSON המדויק בלחיצת כפתור.
3. **קוד הטעינה האוטומטית** – תוספת נקייה לקבצים הקיימים (`decorations.js` ו-`app.js`) שטוענת את כל ה-JSON-ים ואת כל הפונטים מתיקיית `fonts/`.

---

### חלק 1: שמות הקבצים והמיקום שלהם

המערכת תחפש אוטומטית בתיקייה הראשית את 6 קובצי ה-JSON הבאים, ובנוסף קובץ מפתח לפונטים:

| סוג האלמנט | שם קובץ ה-JSON שייטען אוטומטית | מיקום |
| :--- | :--- | :--- |
| **1. שער ראשי** | `shaar_main.json` | בתיקייה הראשית |
| **2. שער משנה** | `shaar_sub.json` | בתיקייה הראשית |
| **3. שער אחורי** | `shaar_back.json` | בתיקייה הראשית |
| **4. עיטור כותרת עליונה** | `header_ornaments.json` | בתיקייה הראשית |
| **5. עיטור סוף פרק** | `section_dividers.json` | בתיקייה הראשית |
| **6. מפריד הערות שוליים** | `note_rules.json` | בתיקייה הראשית |
| **📁 פונטים מקומיים** | `fonts.json` | בתוך תת-התיקייה `fonts/` |

---

### חלק 2: כלי האריזה – `svg-packer.html`

שמור קובץ זה בשם `svg-packer.html` ופתח אותו בדפדפן. הכלי מאפשר לך לבחור את סוג האלמנט, לבחור בבת אחת מאות קבצים (עם `Ctrl+A`), וללחוץ על **"ייצא קובץ JSON"** – והוא יוריד את הקובץ עם השם הנכון בדיוק!

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>אורז קובצי SVG ופונטים למערכת העימוד</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f1f5f9; padding: 30px; direction: rtl; }
    .card { max-width: 650px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    h2 { margin-top: 0; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    .field { margin-bottom: 18px; }
    label { display: block; font-weight: bold; margin-bottom: 6px; font-size: 14px; color: #334155; }
    select, input[type="file"] { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 5px; box-sizing: border-box; font-size: 14px; }
    .btn { background: #1e3a8a; color: #fff; border: none; padding: 12px 20px; font-size: 15px; font-weight: bold; border-radius: 5px; cursor: pointer; width: 100%; transition: background 0.2s; }
    .btn:hover { background: #172554; }
    .status { margin-top: 15px; font-size: 13px; color: #475569; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; }
  </style>
</head>
<body>

<div class="card">
  <h2>📦 אורז קובצי SVG ופונטים ל-JSON</h2>

  <div class="field">
    <label>בחר את סוג הקבצים שברצונך לארוז:</label>
    <select id="asset-type" onchange="updateAccept()">
      <option value="shaar_main.json">1. שער ראשי (shaar_main.json)</option>
      <option value="shaar_sub.json">2. שער משנה (shaar_sub.json)</option>
      <option value="shaar_back.json">3. שער אחורי (shaar_back.json)</option>
      <option value="header_ornaments.json">4. עיטורי כותרת עליונה (header_ornaments.json)</option>
      <option value="section_dividers.json">5. עיטורי סוף פרק (section_dividers.json)</option>
      <option value="note_rules.json">6. מפרידי הערות שוליים (note_rules.json)</option>
      <option value="fonts.json">📁 פונטים עבור תיקיית fonts (fonts.json)</option>
    </select>
  </div>

  <div class="field">
    <label id="file-label">בחר את כל קובצי ה-SVG (אפשר לבחור מאות בבת אחת):</label>
    <input type="file" id="file-input" multiple accept=".svg">
  </div>

  <button class="btn" onclick="processAndExport()">⚡ ארוז וייצא קובץ JSON</button>

  <div class="status" id="status-box">מוכן לפעולה. בחר קבצים ולחץ על ייצוא.</div>
</div>

<script>
  function updateAccept() {
    const type = document.getElementById('asset-type').value;
    const input = document.getElementById('file-input');
    const label = document.getElementById('file-label');
    if (type === 'fonts.json') {
      input.accept = '.ttf,.otf,.woff,.woff2';
      label.textContent = 'בחר את כל קובצי הפונטים (TTF, OTF, WOFF, WOFF2):';
    } else {
      input.accept = '.svg';
      label.textContent = 'בחר את כל קובצי ה-SVG:';
    }
  }

  async function processAndExport() {
    const fileInput = document.getElementById('file-input');
    const targetFilename = document.getElementById('asset-type').value;
    const statusBox = document.getElementById('status-box');
    const files = Array.from(fileInput.files);

    if (files.length === 0) {
      alert('אנא בחר קבצים תחילה!');
      return;
    }

    statusBox.textContent = `מעבד ${files.length} קבצים... אנא המתן.`;

    if (targetFilename === 'fonts.json') {
      // עיבוד פונטים
      const fontList = files.map(f => {
        const ext = f.name.split('.').pop().toLowerCase();
        const baseName = f.name.substring(0, f.name.lastIndexOf('.'));
        const formatMap = { ttf: 'truetype', otf: 'opentype', woff: 'woff', woff2: 'woff2' };
        return {
          family: baseName.replace(/[-_]/g, ' '),
          file: f.name,
          format: formatMap[ext] || 'truetype'
        };
      });

      downloadJSON(fontList, 'fonts.json');
      statusBox.innerHTML = `✅ נוצר בהצלחה קובץ <b>fonts.json</b> עם ${fontList.length} פונטים!<br><b>שים לב:</b> יש לשמור קובץ זה <u>בתוך תיקיית fonts</u> לצד קובצי הפונטים.`;
      return;
    }

    // עיבוד SVG
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let svgText = await file.text();

      // ניקוי והבטחת מתיחה נכונה לשערים
      if (targetFilename.startsWith('shaar_')) {
        if (!svgText.includes('preserveAspectRatio')) {
          svgText = svgText.replace(/<svg\b/, '<svg preserveAspectRatio="none"');
        } else {
          svgText = svgText.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
        }
        if (!svgText.includes('class=')) {
          svgText = svgText.replace(/<svg\b/, '<svg class="custom-bg-img"');
        } else if (!svgText.includes('custom-bg-img')) {
          svgText = svgText.replace(/class="([^"]*)"/, 'class="$1 custom-bg-img"');
        }
      }

      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')).replace(/[-_]/g, ' ');
      const cleanId = 'ext_' + file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

      results.push({
        id: cleanId,
        name: cleanName,
        svg: svgText
      });
    }

    downloadJSON(results, targetFilename);
    statusBox.innerHTML = `✅ נוצר בהצלחה הקובץ <b>${targetFilename}</b> המכיל ${results.length} אלמנטים!<br>שמור אותו בתיקייה הראשית של התוכנה (לצד index.html).`;
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>
</body>
</html>
```

---

### חלק 3: קוד הטעינה האוטומטית במערכת

כעת נחבר את המערכת כך שתסרוק ותטען הכל לבד בעת ההפעלה.

#### 1. עדכון בקובץ `decorations.js`
הוסף בסוף הקובץ `decorations.js` את פונקציות הרישום הדינמיות הבאות (פונקציות אלו מכניסות את ה-SVG שנטענו מה-JSON לתוך המילונים הפנימיים של התוכנה):

```javascript
/* ==========================================================================
   פונקציות רישום דינמי עבור קובצי JSON חיצוניים
   ========================================================================== */

function registerExternalShaar(typeKey, id, name, svgContent) {
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
}

function registerExternalDivider(id, svgContent) {
  SECTION_DIVIDERS[id] = `<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;">${svgContent}</div>`;
}

function registerExternalNoteRule(id, svgContent) {
  NOTE_RULE_GLYPHS[id] = svgContent;
}
```

---

#### 2. עדכון בקובץ `app.js`
החלף את פונקציית `window.onload` בסוף הקובץ `app.js` בקוד הבא, המבצע טעינה אסינכרונית (`async/await`) של כל קובצי ה-JSON וכל הפונטים:

```javascript
/* ==========================================================================
   טעינה אוטומטית של קובצי JSON ופונטים מתיקיית fonts
   ========================================================================== */

async function loadExternalJSONAssets() {
  const assetsToLoad = [
    { file: 'shaar_main.json', type: 'shaar_main' },
    { file: 'shaar_sub.json', type: 'shaar_sub' },
    { file: 'shaar_back.json', type: 'shaar_back' },
    { file: 'header_ornaments.json', type: 'header' },
    { file: 'section_dividers.json', type: 'divider' },
    { file: 'note_rules.json', type: 'note_rule' }
  ];

  for (const asset of assetsToLoad) {
    try {
      const response = await fetch(asset.file);
      if (!response.ok) continue; // הקובץ אינו קיים, ממשיכים הלאה
      const items = await response.json();
      if (!Array.isArray(items)) continue;

      items.forEach(item => {
        if (asset.type === 'shaar_main') {
          registerExternalShaar('main', item.id, item.name, item.svg);
          appendOptionToSelect('active-theme-select', item.id, item.name, 'שערים ראשיים שנטענו');
        } else if (asset.type === 'shaar_sub') {
          registerExternalShaar('sub', item.id, item.name, item.svg);
          appendOptionToSelect('active-theme-select', item.id, item.name, 'שערי משנה שנטענו');
        } else if (asset.type === 'shaar_back') {
          registerExternalShaar('back', item.id, item.name, item.svg);
          appendOptionToSelect('active-theme-select', item.id, item.name, 'שערים אחוריים שנטענו');
        } else if (asset.type === 'header') {
          registerExternalHeader(item.id, item.svg);
          appendOptionToSelect('hdr-c-type', item.id, item.name, 'עיטורי כותרת (JSON)');
          appendOptionToSelect('hdr-r-type', item.id, item.name, 'עיטורי כותרת (JSON)');
          appendOptionToSelect('hdr-l-type', item.id, item.name, 'עיטורי כותרת (JSON)');
        } else if (asset.type === 'divider') {
          registerExternalDivider(item.id, item.svg);
          appendOptionToSelect('section-divider-style', item.id, item.name, 'עיטורי סיום פרק (JSON)');
        } else if (asset.type === 'note_rule') {
          registerExternalNoteRule(item.id, item.svg);
          appendOptionToSelect('note-rule-style', item.id, item.name, 'מפרידי הערות (JSON)');
        }
      });
      console.log(`נטענו בהצלחה ${items.length} פריטים מתוך ${asset.file}`);
    } catch (e) {
      // שקט - הקובץ פשוט לא נמצא
    }
  }
}

function appendOptionToSelect(selectId, value, text, groupLabel) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // מניעת כפילויות
  if (select.querySelector(`option[value="${value}"]`)) return;

  let optgroup = select.querySelector(`optgroup[label="${groupLabel}"]`);
  if (!optgroup) {
    optgroup = document.createElement('optgroup');
    optgroup.label = groupLabel;
    select.appendChild(optgroup);
  }

  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = text;
  optgroup.appendChild(opt);
}

/* ==========================================================================
   טעינה אוטומטית של פונטים מתוך fonts/fonts.json
   ========================================================================== */
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

        // הוספה לכל תיבות בחירת הגופנים בסרגל הצד
        document.querySelectorAll('.font-picker').forEach(select => {
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
        });
      } catch (err) {
        console.warn('שגיאה בטעינת גופן:', font.file, err);
      }
    }
    console.log(`נטענו בהצלחה ${fonts.length} פונטים מתיקיית fonts!`);
  } catch (e) {
    // fonts.json לא קיים
  }
}

// עדכון פונקציית הטעינה הראשית של הדף
window.onload = async function() {
  refreshCustomThemesUI();
  rehydrateExtImports();

  // 1. טעינת ה-JSON-ים של ה-SVG והפונטים
  await loadExternalJSONAssets();
  await loadExternalFonts();

  if (document.getElementById('section-divider-style').value === 'custom_img') {
    document.getElementById('row-sec-div-img').style.display = 'flex';
  }
  if (document.getElementById('hdr-c-type').value === 'custom_img') {
    document.getElementById('row-hdr-c-img').style.display = 'flex';
  }

  textarea.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - סימן א - דיני תפילת השחר וזמנה
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

  typesetDocument();
};
```

---

### 💡 נקודה חשובה לגבי הפעלה במחשב (דפדפן ו-CORS):
דפדפנים מודרניים (Chrome, Edge, Firefox) חוסמים פקודת `fetch` לקריאת קובצי JSON מקומיים אם פותחים את הקובץ בלחיצה כפולה ישירה (`file:///C:/...`).
כדי שהטעינה האוטומטית תפעל בצורה חלקה:
* מומלץ להריץ את התיקייה באמצעות **Live Server** (תוסף פשוט של VS Code).
* או לפתוח שורת פקודה (CMD) בתיקייה ולהקליד: `python -m http.server` ואז לפתוח בדפדפן `http://localhost:8000`.

---

## פנייה 7: עכשיו צור מסמך מסודר, מפורט ומעמיק בפורמט Markdown הכולל את כל הפרטים הטכניים,…

עכשיו צור מסמך מסודר, מפורט ומעמיק בפורמט Markdown הכולל את כל הפרטים הטכניים, האלגוריתמים, מקרי הקצה והניסיונות שבוצעו בשיחה זו. 

שים לב: התוכנה היא מערכת מורכבת לעימוד ספרים תורניים. חשוב לתעד לא רק מה עובד, אלא גם מה שנכשל ואיך גילינו זאת.

אנא חלק את המסמך למבנה הבא:

### 1. סקירת המערכת והארכיטקטורה (High-Level Overview)
- ייעוד התוכנה, הטכנולוגיות שבשימוש (שפות, ספריות, Architectural Patterns).
- עקרונות תכנון מרכזיים והפרדת אחריות במערכת (MVC/MVVM, Threading, Rendering Engine).

### 2. מכלול האלגוריתמים והבעיות שפתרנו (Deep Dive Implementation)
עבור כל אחד מהנושאים הבאים (ועבור כל נושא נוסף שעלה בשיחה), פרט את הלוגיקה, המבנים הנתונים, והחישובים שנבחרו:
- עימוד ויישור שני טורים (Two-Column Layout & Balancing).
- מניעת שורות וכותרות יתומות/אלמנות (Orphan & Widow control).
- עימוד וניהול כותרות צד (Side Headings / Marginalia).
- מנגנון הערות שוליים בתחתית העמוד (Footnotes Positioning).
- גלישת טקסט בין הטורים ולאזור הערות השוליים (Text Flow & Area Overflow Handling).
- איזון סוף פרק / סוף מודול (Chapter Balancing).
- נושאים נוספים שנידונו בשיחה (חטיפות טקסט, גופנים, שילוב עיטורים, Layout Engine, Performance וכו').

### 3. יומן כישלונות, טעויות וניסיונות שנפסלו (Mistakes & Failed Approaches)
זהו חלק קריטי! מנה את כל הניסיונות, המנגנונים או האלגוריתמים שהוצעו במהלך השיחה והתבררו כבלתי מתאימים:
- מה הייתה ההצעה/הגישה הראשונית?
- באיזה תרחיש או מקרה קצה (Edge Case) היא נכשלה?
- כיצד הטיעון/המבחן הוכיח שהיא מוטעית?
- מה המסקנה הנלמדת מניסיון זה ולמה אסור לחזור אליו?

### 4. סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase & Implementation State)
- מפה של המחלקות (Classes), הפונקציות והמנגנונים שנכתבו והוסכמו.
- קטעי הקוד המרכזיים והסופיים שנבנו (Complete Production-Ready Code Snippets), כולל הסבר על טיפול בשגיאות ומקרי קצה.

### 5. מקרי קצה שנבדקו ותורגמו לבדיקות (Edge Cases & Validation)
- רשימה של מקרי הקצה המיוחדים לעימוד תורני שנלקחו בחשבון (כגון: הערת שוליים ארוכה מעמוד كامل, כותרת בתחתית טור, חוסר מקום בטור ב', טקסט קודש מול פירושים וכו').
- כיצד המערכת מטפלת בהם כעת?

### 6. מפת דרכים והצעדים הבאים (Roadmap & Pending Tasks)
- מה מתוכנן לשלב הבא?
- איזה בעיות נותרו פתוחות או דורשות אופטימיזציה נוספת?
- הנחיות ספציפיות ל-AI הבא שימשיך את הפיתוח מנקודה זו.

כתובי את המסמך בצורה טכנית, מדויקת ומפורטת ככל האפשר, ללא שיווק או מילות קישור מיותרות.

---

### 🤖 תגובה 11: Defining the Project Scope I'm now zeroing in on defining the project scope,…

**Defining the Project Scope**

I'm now zeroing in on defining the project scope, prioritizing the user's desire for a complete technical specification and architectural documentation, formatted as Markdown. My focus is on ensuring the final product meets the user's high standards.


**Analyzing the Technical Journey**

I'm now diving deep into the technical journey. I see a distinct 6-part structure emerging, driven by a need for precision. Each section demands exhaustive Hebrew prose detailing the system. I'm focusing on "mistakes and failed approaches," as I realized its emphasis on edge cases and hard-learned invariants is critical. The tone needs to be highly technical and rigorous.


**Tracing the System's Ancestry**

I've traced the system's lineage back to its monolithic HTML origin and am now analyzing its evolution. Key challenges tackled include separating concerns from a monolithic file and addressing crucial Hebrew typography issues. My main focus is on *חלון מילה ראשונה* (drop word), two-column balancing, and vertical justification mechanics. I'm noting the vital roles of off-screen measurement and virtual scratchpads in the solutions.


**Detailing the Design Challenges**

I'm now grappling with the intricate design challenges. I've pinpointed several critical components: fine-tuning sub-60px differences using bottom scaling or line-height, implementing robust handling of widows and orphans, and ensuring dynamic footnote allocation through a two-pass height subtraction method. A vital aspect is the implementation of a rollback/snapshot mechanism to prevent duplicate insertions, and counter corruption during balanced column layouts. Also, marginalia and Shaar layout mechanics are critical. I also need to make progress on TOC generation, multi-level dot leaders, and dynamic page numbers.


**Mapping Asset Dependencies**

I'm now focused on the SVG and font asset pipelines. My current priority is scaling from a few hardcoded SVGs to approximately 1,000, while avoiding memory crashes and CORS blocks on `file:///` protocols. The failed architectural approaches are instructive. I can now avoid the CSS multi-column trap for Torah text and focus on algorithmic two-column DOM allocation. Also, I need to address the footnote state corruption and naive word-count splitting challenges.


**Refining the Rendering Pipeline**

I'm now refining the rendering pipeline details. I fixed a drop-window visual bug that impacted short, one-line paragraphs by measuring the height ratio and implementing a fix. I've also addressed the `fetch()` issue with `file:///` protocols by using a modular packer with local server guidelines, and embedded fallback scripts. I'm actively drafting section 1, focused on a high-level overview of the client-side typesetting engine.


**Outlining Implementation Structure**

I'm now outlining the implementation structure in detail. I'm focusing on the interplay of pagination, balancing, note injection, and post-layout TOC reconciliation, all facilitated by a data-driven rendering approach with the virtual scratchpad. I'm working on separating concerns across the UI/IO, graphic/asset, layout/typesetting, stylesheet, and semantic canvas components. Section 2, a "deep dive," is now being planned around two-column layout, balancing techniques and paragraph token data structure.


**Optimizing Text Balancing**

I'm now fully immersed in refining column balancing. I'm prioritizing the development of valid `(itemIndex, lineIndex)` split points, ensuring no split points follow headers to prevent widows. The objective function centers on minimizing the absolute height difference between columns, favoring a positive right-bias. I'm planning to handle vertical justification by distributing residual space using bottom margin or line-height adjustments.

I'm also focusing on orphan and widow control, and I've started on marginalia and side headings.


**Refining Footnote Mechanics**

I'm now deep in the footnote mechanics. My priority is designing the two-phase budget calculation, pre-measuring queued footnotes to adjust available space before column fill. I've designed the regex-free delimiters parser for bracket pairs. I'm actively working on a Gematria converter for numerical conversion to Hebrew letters and also developing continuation tokens and dynamic line windows.


**Analyzing Page Capacity**

I'm now focusing on a critical aspect: optimizing page capacity. I'm pre-scanning section tokens to compute total rendered height and then calculating each page's capacity to prevent undesirable two-line final pages. This height management applies to throttling on intermediate pages. I'm documenting detailed failed approaches, including why native CSS columns, and naive character/word balancing, did not work.


**Addressing Visual Glitches**

I've tackled the problematic visual glitch in the first-word window of single-line paragraphs. The threshold test successfully fixes wrapping issues. I've also shifted away from absolute footnote positioning to a more flexible flex flow approach. Further, I can now read files by using a server-guided fetch with the new `svg-packer.html` tool.

I am working on `Section 4: סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase & Implementation State)` with components now mapped to files.


**Documenting Critical Code Functions**

I'm now writing Section 4, focused on the current codebase and implementation state, and I'm detailing all critical algorithms. I'm focusing on providing code snippets for the layout engine functions and describing the core of typesetter.js, including `typesetDocument`, `balanceColumns`, `getLinesFromParagraph`, and `finalizeNotePositions`. I'm detailing the `app.js` event listeners, font loader and file importer, and the `svg-packer.html` asset bundler.

---

### 🤖 תגובה 12: # תיעוד ארכיטקטוני ומפרט טכני מקיף: מנוע עימוד תורני לספרי A4 --- ## 1. סקירת…

# תיעוד ארכיטקטוני ומפרט טכני מקיף: מנוע עימוד תורני לספרי A4

---

## 1. סקירת המערכת והארכיטקטורה (High-Level Overview)

### 1.1 ייעוד המערכת
המערכת פותחה כמנוע עימוד (Typesetting Engine) בדפדפן, המיועד לעימוד ספרות תורנית מורכבת (ספרי שו"ת, חידושים, ספרי הלכה ומפרשים) בתקן הדפסה A4. המערכת מחליפה תוכנות עימוד שולחניות כבדות עבור תרחישים של הפקה מהירה, תוך שמירה על כללי הטיפוגרפיה התורנית המסורתית:
* חלוקה סימטרית לשני טורים מיושרים לשני הצדדים (Justified).
* פתיחת פסקאות באמצעות "חלון מילה ראשונה" (Drop-word / פתיח מוגדל צף).
* מנגנון כותרות צד (Marginalia) המיושרות לפסקה המקורית בשולי העמוד.
* הערות שוליים דינמיות בתחתית העמוד והערות סיום מרוכזות בסוף חלק.
* שערי ספר (ראשי, משנה, אחורי) בעלי עיטורים וקטוריים (SVG) וגריד קשיח.
* הפקת תוכן עניינים מדורג (TOC) הכולל מובילי נקודות (Dot Leaders) ומספור עברי בגימטריה.

```
+---------------------------------------------------------------------------------------+
|                                    ארכיטקטורת המערכת                                   |
+---------------------------------------------------------------------------------------+
|  [Input Layer]                                                                        |
|    - Raw Text Input (Textarea) / Meta tags (מחבר, שם הספר, שנה)                       |
|    - Dynamic Asset Loader (Fonts via Web Font API, SVGs via JSON Packs)               |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|  [Parsing & AST Layer]                                                                |
|    - Lexical Parser: זיהוי תגי כותרות (0-7), הערות סיום, שוליים, ופסקאות              |
|    - Token Stream Generator: יצירת מבנה נתונים טוקניזרי עם מיפוי שורות מקור            |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|  [Layout & Typesetting Core Engine] (typesetter.js)                                   |
|    +-------------------------------------------------------------------------------+  |
|    | Virtual DOM Probe (#measuring-box) - מדידת שורות, גבהים וחלון מילה ראשונה     |  |
|    +-------------------------------------------------------------------------------+  |
|    | Section Fill Estimator - חישוב יחס מילוי למניעת עמודי קצה דלילים              |  |
|    +-------------------------------------------------------------------------------+  |
|    | Two-Column Balancer - אלגוריתם חיתוך ואיזון שורות בין טורים                   |  |
|    +-------------------------------------------------------------------------------+  |
|    | Footnote Budget Allocator - חישוב גובה דינמי וקיזוז נפח טקסט ראשי             |  |
|    +-------------------------------------------------------------------------------+  |
|    | Marginalia Collision Resolver - פיזור כותרות צד ומניעת דריסה                  |  |
|    +-------------------------------------------------------------------------------+  |
|    | Pagination & Sheet Assembly - פריסה לדפי A4 (210mm x 297mm)                   |  |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|  [Post-Processing & Output]                                                           |
|    - TOC Reconciliation: עדכון מספרי עמודים בגימטריה בתוכן העניינים                   |
|    - Print Stylesheet Engine: פלט הדפסה מבוסס @media print וקטורי נקי לחלוטין          |
+---------------------------------------------------------------------------------------+
```

### 1.2 סטאק טכנולוגי (Tech Stack)
* **שפות**: Vanilla ECMAScript 2022+ (ללא תלות בספריות צד-שלישי כגון React, Vue או jQuery כדי למנוע Overhead ולשמור על ביצועי רינדור מקסימליים).
* **מנוע עיצוב וסגנון**: CSS3 מודרני: CSS Grid תלת-ממדי להגדרת עמודי ה-A4, CSS Custom Properties (Variables) לניהול הגריד בזמן אמת, ו-Flexbox לניהול זרימת התוכן האנכית.
* **מדידות גיאומטריות**: DOM Canvas/Probe היברידי מבוסס אלמנט מדידה מוסתר (`#measuring-box`).
* **ממשקי דפדפן (APIs)**:
  * `document.fonts` ו-`FontFace API`: טעינת גופנים מקומיים מתיקיית `fonts/` בזמן ריצה.
  * `queryLocalFonts API`: סריקת גופני מערכת ההפעלה (Windows/Mac) ישירות לסרגל הגופנים.
  * `FileReader API`: טעינה ועיבוד של קובצי תמונה, סגנונות ו-SVG מקומיים.

### 1.3 עקרונות תכנון והפרדת אחריות (Separation of Concerns)
המערכת עברה ארגון מחדש ממבנה מונוליתי למבנה מודולרי מופרד:
1. **`index.html` (View/Layout Canvas)**: שלד ה-DOM הסטטי, רכיבי הקלט של סרגל הבקרה (Sidebar) ומכולת העמודים (`#book-container`).
2. **`style.css` (Presentation Layer)**: משתנים טיפוגרפיים, כללי רשת A4 מדויקים במילימטרים (`mm`), עיצובי שערי ספר, והגדרות ייצוא לדפוס (`@page`, `@media print`).
3. **`decorations.js` (Asset Registry)**: מילון וקטורי מרכזי המאחסן את כל תבניות ה-SVG עבור כותרות עליונות, קווי הפרדה, סיומות פרקים ושערי ספר, ומאפשר הרחבה דינמית.
4. **`typesetter.js` (Layout Engine)**: מנוע החישוב הטהור. אחראי על מדידת הטקסט, חלוקת שורות, איזון טורים, פתרון התנגשויות של הערות שוליים וחלוקה לעמודים.
5. **`app.js` (Application Controller)**: מנהל את האינטראקציה עם המשתמש, שינוי גודל הסרגל (Resizer), סנכרון סמן עריכה בזמן אמת (Bidirectional Cursor Sync), וטעינת תוספים ונכסים חיצוניים.
6. **`svg-packer.html` (Asset Pipeline)**: כלי עזר חיצוני לאריזת מאות קובצי SVG ופונטים לקובצי JSON ייעודיים הנטענים אסינכרונית על ידי המערכת הראשית.

---

## 2. מכלול האלגוריתמים והבעיות שפתרנו (Deep Dive Implementation)

### 2.1 עימוד ויישור שני טורים ואיזונם (Two-Column Layout & Balancing)

#### הבעיה
בעימוד טקסט עברי מיושר לשני הצדדים (Justified), חלוקה פשוטה של טקסט בין שני טורים מובילה לפערי גובה ניכרים בין הטור הימני לטור השמאלי בסוף סימן או עמוד. בנוסף, חיתוך שרירותי גורם לשבירת מילים, להיווצרות שורות יתומות, ולשיבוש בחלון המילה הראשונה בפסקה הבאה.

#### מבנה הנתונים
כל פסקה מעובדת למבנה מפורט:
```javascript
{
  id: Number,              // מזהה טוקן ייחודי
  type: 'p' | 'h0'..'h7',  // סוג האלמנט
  rawText: String,         // תוכן הטקסט הנקי
  lines: Array<String>,    // מערך השורות המדויק כפי שנמדד ברוחב הטור
  isSingleLine: Boolean,   // האם הפסקה תופסת שורה אחת בלבד
  hasWindow: Boolean,      // האם הוחל חלון מילה ראשונה
  isCont: Boolean,         // האם זו פסקת המשך מטור/עמוד קודם
  sideNote: String|null,   // תוכן הערת צד הצמודה לפסקה
  endNote: String|null     // תוכן הערת סיום
}
```

#### האלגוריתם לפירוק שורות (`getLinesFromParagraph`)
במקום להסתמך על חישוב תווים משוער, המערכת מזריקה את הפסקה לתוך `#measuring-box` שרוחבו הוגדר בדיוק לרוחב הטור (`colWidth`):
1. המילים מופרדות ונעטפות ב-`<span>` ייחודי: `<span id="mw-i">word</span>`.
2. הפונקציה מודדת את ה-`offsetTop` של כל ספאן.
3. כאשר מילה חורגת ב-$|top - currentTop| > 8\text{px}$, מזוהה שבירת שורה חדשה.
4. התוצאה היא מערך שורות אמיתי המשקף בדיוק של 100% את התנהגות מנוע הרינדור של הדפדפן.

#### אלגוריתם איזון הטורים (`balanceColumns`)
עבור בלוק של שני טורים (`.block-2col`):
1. **הגדרת מרחב הפיצול (Split Points)**:
   נוצר מערך של כל נקודות החיתוך האפשריות:
   $$\mathcal{S} = \{ (i, l) \mid i \in [0, N], l \in [0, \text{lines}(i)] \}$$
   כאשר $i$ הוא אינדקס הפסקה ו-$l$ הוא אינדקס השורה בתוך הפסקה.
2. **סינון נקודות לא חוקיות**:
   נקודת פיצול שבה השורה הקודמת היא כותרת ($item_{i-1}.type = 'h'$) נפסלת מיידית כדי למנוע כותרת יתומה בתחתית טור ימין.
3. **הערכת גבהים מהירה (Fast Evaluation)**:
   המערכת מבצעת רינדור וירטואלי זמני של כל נקודת פיצול $sp \in \mathcal{S}$:
   - צד ימין מקבל את הפריטים $0 \dots i-1$ ואת שורות $0 \dots l-1$ של פריט $i$.
   - צד שמאל מקבל את שורות $l \dots \text{end}$ של פריט $i$ ואת שאר הפריטים עד הסוף.
   - נמדד ההפרש: $\Delta H = H_{\text{right}} - H_{\text{left}}$.
4. **פונקציית המטרה (Objective Function)**:
   האלגוריתם בוחר את הנקודה הממזערת את $|\Delta H|$, עם עדיפות קלה לטור ימני ארוך יותר במקרה של שוויון:
   $$\min |\Delta H| \quad \text{subject to} \quad \Delta H \ge 0$$
5. **יישור אנכי מיקרומטרי (`justifyColumnVertically`)**:
   אם בסיום החלוקה קיים פער קטן ($2\text{px} < |\Delta H| \le 60\text{px}$):
   - במקרה של ריבוי פסקאות: מחלקים את ההפרש שווה בשווה כתוספת `margin-bottom` בין הפסקאות בטור הקצר.
   - במקרה של פסקה יחידה: מחשבים את תוספת ה-`line-height` המדויקת לכל שורה:
     $$\Delta lh = \frac{\Delta H}{\text{numLines} \times \text{fontSizePx}}$$

---

### 2.2 מניעת שורות וכותרות יתומות/אלמנות (Orphan & Widow Control)

```
[תרחיש אלמנה שנחסם]           [תרחיש כותרת יתומה שנחסם]
+----------------------+      +----------------------+
| פסקה... שורה 1       |      | פסקה... שורה אחרונה  |
| פסקה... שורה 2       |      | -------------------- |
| פסקה... שורה 3       |      | [כותרת סעיף ב']      | <-- נחסם! מועבר
+----------------------+      +----------------------+     לראש הטור הבא
| [שורה 4 בלבד!]       | <-- נחסם ע"י                
| פסקה חדשה...         |     avoid-widows
+----------------------+
```

1. **אלמנות ברמת הפסקה (Widow Lines)**:
   כאשר פסקה נשברת בין טורים או בין עמודים:
   - אם נותרה שורה אחת בלבד בסוף הטור הקודם ($bestFitLine = 1$), האלגוריתם מבטל את הפיצול ומעביר את כל הפסקה לטור הבא.
   - אם נותרה שורה בודדת לתחילת הטור הבא ($\text{remainingAfterSplit} = 1$), האלגוריתם מושך שורה נוספת מטור ימין ($bestFitLine \leftarrow bestFitLine - 1$), כך שבטור הבא ייפתחו לפחות 2 שורות.
2. **כותרות יתומות (Orphan Headings)**:
   לפני הצבת כותרת בתחתית טור או עמוד, נבדק שטח הפנים השיורי:
   $$\text{remPageHeight} - \text{footnotesReservedHeight} - H_{\text{heading}} < 30\text{px}$$
   אם יתרת הגובה אינה מספיקה להכיל את הכותרת ולפחות 2 שורות טקסט של הפסקה העוקבת, הכותרת נדחית ונאלצת לפתוח את ראש הטור הבא או העמוד הבא.

---

### 2.3 עימוד וניהול כותרות צד בשוליים (Side Headings / Marginalia)

#### המבנה הגיאומטרי
עמוד ה-A4 מוגדר ברשת של 7 עמודות:
`[שוליים ימניים] [רווח] [טור ימין] [רווח מרכזי] [טור שמאל] [רווח] [שוליים שמאליים]`
כותרות צד (רמה 7 או תוספים ייעודיים) ממוקמות בעמודה 1 (עבור טור ימין) או בעמודה 7 (עבור טור שמאל).

#### פתרון התנגשויות וגלישה (`finalizeNotePositions`)
מאחר שכותרות צד מוצבות ב-`position: absolute` בתוך עמודת השוליים, הן אינן דוחפות אחת את השנייה באופן טבעי. האלגוריתם מבצע סריקה ותיקון מיקומים:
1. **קיבוץ לפי שוליים**: הערות ממוינות לפי ה-`offsetTop` של הפסקה המארחת שלהן.
2. **בדיקת גבול תחתון**:
   אם $Top_{\text{note}} + Height_{\text{note}} > ColumnBoundaryHeight$:
   - נבדק האם ניתן להרים את ההערה כלפי מעלה מבלי לפגוע בהערה שמעליה:
     $$\text{raisedTop} = ColumnBoundaryHeight - Height_{\text{note}} \ge Top_{\text{prev}} + Height_{\text{prev}} + 6\text{px}$$
   - אם אין מקום להרים אותה, המערכת מחפשת האם הפסקה המארחת פוצלה וממשיכה בעמוד הבא (באמצעות `data-token-id` ו-`data-is-cont="true"`).
   - אם קיימת פסקת המשך, אלמנט ההערה מועבר ב-DOM ישירות לשולי העמוד הבא ומעוגן לראש פסקת ההמשך.

---

### 2.4 מנגנון הערות שוליים דינמיות בתחתית העמוד (Footnotes Positioning)

#### בעיית תקציב הגובה (Height Budgeting)
הערת שוליים שמופיעה בטור הטקסט גוזלת שטח מתחתית העמוד. אם הטקסט הראשי ימלא את העמוד לחלוטין, הערת השוליים תידחק אל מעבר לגבולות דף ה-A4.

#### הפתרון הדו-שלבי:
1. **שלב המדידה והקיזוז המקדים**:
   תוך כדי ריצה על פסקאות הטור, כל סימון הערה שוליים מפעיל תור זמני (`footnoteQueueForPage`). פונקציית `getFootnotesReservedHeight()` מודדת מראש את הגובה הכולל של בלוק ההערות שהצטבר:
   $$\text{ReservedHeight} = \text{measureNoteBlockHeight}(\text{queue}, \text{columns}) + 24\text{px (Separator Rule)}$$
   גובה זה מקוזז באופן רציף מתקציב הגובה הזמין של הטורים:
   $$\text{CurrentAvailHeight} = \text{remPageHeight} - \text{ReservedHeight}$$
2. **הזרקה סופית בסגירת העמוד (`flushFootnotesInto`)**:
   בסיום מילוי שני הטורים של העמוד, בלוק ההערות מיוצר, מקבל קו מפריד מעוצב (Plain/Decorative SVG), ומוזרק בדיוק מעל ה-Footer (`.page-number-footer`), כחלק מהזרימה הטבעית של ה-Flexbox.

---

### 2.5 חלון מילה ראשונה (Drop-Word Window)
בספרות תורנית מקובל כי המילה הראשונה בפסקה מוגדלת ומודגשת, והשורות הבאות עוקפות אותה ("חלון").
* **הלוגיקה**:
  ```javascript
  function createDropWord(text, isContinuation, isSingleLine) {
    if (isContinuation) return text; // פסקת המשך לעולם אינה מקבלת חלון
    // ...
    // אם הפסקה מחזיקה שורה אחת בלבד - חובה לבצע inline ולא window!
    return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${firstWord}</span> ${rest}`;
  }
  ```
* **כלל קריטי**: אם פסקה מכילה שורה אחת בלבד, החלת `float: right` (`first-word-window`) גורמת לחלון לחרוג מגובה השורה ולפלוש אל הפסקה הבאה אחריה. האלגוריתם מזהה פסקאות בנות שורה אחת ומחיל עליהן מחלקת `first-word-inline` שומרת-גובה.

---

### 2.6 איזון סוף-פרק ויחס מילוי (`estimateSectionFillRatio`)
כאשר פרק מסתיים, פעמים רבות העמוד האחרון מכיל שורות בודדות בלבד, דבר היוצר מראה ריקני ולא אסתטי.
* האלגוריתם סורק מראש את כל הטוקנים של הפרק ומחשב את נפח הטקסט הכולל מול קיבולת עמודי ה-A4.
* אם נוצר מצב שבו העמוד האחרון יקבל פחות מ-30% שטח, מחושב פקטור איזון ($\text{FillRatio}$ בין 0.3 ל-1.0) המצמצם את הגובה המקסימלי המותר בכל עמודי הפרק, ובכך מאלץ את הטקסט להיפרס באופן שווה ואחיד על פני כל העמודים.

---

## 3. יומן כישלונות, טעויות וניסיונות שנפסלו (Mistakes & Failed Approaches)

חלק זה מתעד לקחים הנדסיים קריטיים שנלמדו במהלך פיתוח וכיול המערכת.

---

### כישלון 1: הסתמכות על מנגנון הטורים המובנה של CSS (`column-count: 2`)

```
[הגישה שנכשלה: CSS Columns]               [הגישה שיושמה: Explicit DOM Allocation]
+-----------------------------------+     +-----------------------------------+
| .container { column-count: 2; }   |     | .block-2col { display: grid; }   |
|                                   |     |                                   |
| בעיה:                            |     | יתרונות:                         |
| 1. כותרת H3 חוצה נשברת באקראי    |     | 1. שליטה מדויקת בכל שורה ושורה    |
| 2. אין גישה לגובה טור מדויק       |     | 2. H3 Spanning מושלם              |
| 3. הערות שוליים הוצגו מתחת לכל טור|     | 3. הערות שוליים גלובליות בתחתית הדף|
|    במקום בתחתית כל העמוד          |     | 4. איזון מתמטי בין ימין לשמאל     |
+-----------------------------------+     +-----------------------------------+
```

* **הגישה הראשונית**:
  שימוש בתכונות CSS סטנדרטיות: `column-count: 2` ו-`column-gap: 2%` בתוך מכולת הדף, מתוך הנחה שהדפדפן יאזן את הטקסט בעצמו.
* **באיזה תרחיש זה נכשל?**
  1. כאשר נדרש לשלב כותרת רוחבית (`span_1col` / כותרת 3) החוצה את שני הטורים באמצע עמוד: מנוע ה-CSS יצר שבירות עמודים פנימיות בלתי נשלטות.
  2. הערות שוליים: CSS Multi-column אינו תומך בהצגת הערות שוליים לרוחב כל תחתית העמוד, אלא דוחף אותן לתחתית כל טור בנפרד.
  3. כותרות צד: בלתי אפשרי היה לחשב מיקום אבסולוטי עבור כותרות צד בשוליים ביחס לפסקה הממוקמת בתוך עמודת CSS וירטואלית.
* **המסקנה הנלמדת**:
  **אסור להשתמש ב-CSS Columns עבור עימוד ספר תורני רב-שכבתי.** הפתרון היחיד הוא ניהול טורים ידני ברמת ה-DOM (`.block-2col` עם שתי מכולות נפרדות: `.right-col` ו-`.left-col`), שבהן הקוד מחליט במדויק איזו שורה תוזן לאיזה טור.

---

### כישלון 2: השחתת מוני הערות שוליים במהלך בדיקות איזון טורים (State Pollution in Dry-Run)

* **הגישה הראשונית**:
  בפונקציה `balanceColumns`, כדי לבדוק גובה של חלוקה אפשרית, נעשה שימוש בפונקציה הרגילה שמרנדרת פסקה (`applyDelimiterStyles` שקוראת ל-`createNoteMarkerAndQueue`).
* **באיזה תרחיש זה נכשל?**
  מאחר שאלגוריתם האיזון בודק עשרות נקודות פיצול חלופיות בלולאה עבור כל בלוק:
  ```javascript
  for (let sp of pointsToEvaluate) {
    // רינדור דמה לבדיקת גובה...
    renderSingleItemFast(rCol, items[i]); // קרא ל-createNoteMarkerAndQueue!
  }
  ```
  כל איטרציה הגדילה את המונה הגלובלי `noteCounters.footnote` והוסיפה עותקים כפולים ומשולשים של הערות לתוך `footnoteQueueForPage`. בסיום הריצה, עמוד עם 2 הערות שוליים הציג מספור שגוי (למשל: יז, קד) ומאות הערות כפולות בתחתית העמוד.
* **כיצד תוקן?**
  1. הוגדר דגל `isDryRun`:
     ```javascript
     function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt, isDryRun = false)
     ```
     כאשר הדגל דולק, נוצר אלמנט תצוגה מדומה בלבד (`<a>א</a>`) שאינו מקדם את המונים ואינו נוגע בתורים.
  2. נבנה מנגנון Snapshot מלא לפני הכניסה לאיזון:
     ```javascript
     const blockNoteSnapshot = {
       footnoteQueueLen: footnoteQueueForPage.length,
       endnoteQueueLen: endnoteQueueForPart.length,
       footnoteCounter: noteCounters.footnote || 0,
       endnoteCounter: noteCounters.endnote || 0,
       noteUid: noteUidCounter
     };
     ```
     בסיום כל בדיקה – ובמקרה של ביטול פעולה – התור והמונים משוחזרים במדויק למצבם טרם הבדיקה.
* **המסקנה הנלמדת**:
  **במנוע מדידה מבוסס DOM, פעולות מדידה חייבות להיות טהורות (Idempotent / Side-effect Free).** אסור לשנות State גלובלי בתוך לולאות חישוב גובה.

---

### כישלון 3: חלון מילה ראשונה שובר פסקאות בנות שורה אחת (Float Spillover Bug)

* **הגישה הראשונית**:
  החלת תגית `<span class="first-word-window">` (בעלת `float: right; height: 1.25em; line-height: 0.85;`) על המילה הראשונה בכל פסקה חדשה.
* **באיזה תרחיש זה נכשל?**
  כאשר לפסקה הייתה שורה אחת בלבד (למשל הערה קצרה או פסיקה: "וכן עיקר להלכה."):
  1. השורה האחת הסתיימה, אך אלמנט ה-Float של המילה הראשונה היה גבוה יותר מגובה השורה הבודדת.
  2. כתוצאה מכך, הפסקה הבאה אחריה נלכדה תחת אותו Float וזזה שמאלה באופן מעוות, או שהמילה הראשונה שלה התנגשה במילה של הפסקה הקודמת.
* **כיצד תוקן?**
  הוספת מדידה מוקדמת בפונקציה `getLinesFromParagraph`:
  ```javascript
  const singleLineHeight = pMeasure.offsetHeight;
  pMeasure.textContent = "א";
  const oneLineH = pMeasure.offsetHeight;
  const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
  ```
  אם הפסקה אינה מחזיקה לפחות שתי שורות מלאות, מבוטל ה-Float ומוחל סגנון אינליין שומר-שורה (`first-word-inline`).

---

### כישלון 4: קריסת טעינת קובצי JSON חיצוניים בפרוטוקול `file:///` (CORS Sandbox Block)

* **הגישה הראשונית**:
  שימוש ב-`fetch('shaar_main.json')` מתוך הנחה שקובצי ה-JSON ייטענו אוטומטית מאותה תיקייה שבה שמור קובץ ה-HTML.
* **באיזה תרחיש זה נכשל?**
  משתמשי קצה פותחים את קובץ ה-HTML בלחיצה כפולה מקומית (`file:///C:/Book/index.html`). במצב זה, מנגנון האבטחה של דפדפנים מודרניים (Same-Origin Policy על פרוטוקול קבצים) חוסם קריאות `fetch()` מקומיות ומחזיר שגיאת רשת קריטית:
  `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///...`
* **המסקנה והפתרון**:
  1. פיתוח כלי האריזה `svg-packer.html` המאפשר הפקת קבצים מסודרת.
  2. תיעוד הנחיות עבודה ברורות להרצה מקומית מבוססת שרת קל (`Live Server` או פקודת `python -m http.server 8000`).
  3. הוספת תמיכה מקבילה בייבוא ידני (`<input type="file">`) הזמין תמיד דרך ממשק המשתמש ועוקף את מגבלות ה-CORS ללא צורך בשרת.

---

## 4. סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase & Implementation State)

### 4.1 מפת רכיבים ומודולים

```
typesetting-system/
│
├── index.html          # מבנה הדף, טפסי שליטה, פאנלים של כותרות וגריד
├── style.css           # סגנונות הדפסה, משתני גריד, חוקי טיפוגרפיה ושערים
├── decorations.js      # מאגר SVG, שערים, כותרות עליונות, קווי הערות
├── typesetter.js       # מנוע הליבה: חלוקת שורות, איזון טורים, הערות שוליים ותוכן עניינים
├── app.js              # בקרי ממשק משתמש, סנכרון סמן, טעינת פונטים ותוספים
└── svg-packer.html     # כלי חיצוני לאריזת מאות קובצי SVG ופונטים ל-JSON
```

---

### 4.2 קטעי קוד ליבה מרכזיים (Production-Ready Core Snippets)

#### מתוך `typesetter.js`: אלגוריתם חילוץ שורות מדויק באמצעות מדידת DOM וירטואלית
```javascript
function getLinesFromParagraph(text, colWidth, styleObj, useWindowIfMultipleLines) {
  const measureContainer = document.getElementById('measuring-box');
  measureContainer.style.width = colWidth + 'px';
  measureContainer.style.fontFamily = styleObj.fontFamily;
  measureContainer.style.fontSize = styleObj.fontSize;
  measureContainer.style.lineHeight = styleObj.lineHeight;
  measureContainer.style.textAlign = 'justify';
  measureContainer.style.textJustify = 'inter-word';
  measureContainer.style.direction = 'rtl';
  measureContainer.innerHTML = '';
  
  const pMeasure = document.createElement('p');
  pMeasure.style.margin = '0';
  pMeasure.style.padding = '0';
  
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return { lines: [], hasWindow: false };

  pMeasure.textContent = text;
  measureContainer.appendChild(pMeasure);
  const singleLineHeight = pMeasure.offsetHeight;
  pMeasure.textContent = "א";
  const oneLineH = pMeasure.offsetHeight;
  const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
  const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
  
  let html = '';
  if (shouldApplyWindow) {
    html += `<span class="first-word-window" id="mw-0">${words[0]}</span> `;
    for (let i = 1; i < words.length; i++) {
      html += `<span id="mw-${i}">${words[i]}</span> `;
    }
  } else {
    for (let i = 0; i < words.length; i++) {
      html += `<span id="mw-${i}">${words[i]}</span> `;
    }
  }
  
  pMeasure.innerHTML = html;
  
  const lines = [];
  let currentLine = [];
  let currentTop = -1;
  
  for (let i = 0; i < words.length; i++) {
    const span = document.getElementById(`mw-${i}`);
    if (!span) continue;
    const top = span.offsetTop;
    if (currentTop === -1) currentTop = top;
    // הפרש של מעל 8 פיקסלים מעיד באופן חד משמעי על ירידת שורה
    if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
      lines.push(currentLine.join(' '));
      currentLine = [words[i]];
      currentTop = top;
    } else {
      currentLine.push(words[i]);
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }
  
  measureContainer.innerHTML = '';
  return { lines, hasWindow: shouldApplyWindow };
}
```

---

#### מתוך `typesetter.js`: אלגוריתם איזון הטורים ושחזור מצב הערות שוליים
```javascript
function balanceColumns(block, colWidth, styleObj, snapshot) {
  // שחזור תור ההערות והמונים למצב המדויק שהיה לפני הבלוק כדי למנוע כפילויות
  if (snapshot) {
    footnoteQueueForPage.length = snapshot.footnoteQueueLen;
    endnoteQueueForPart.length = snapshot.endnoteQueueLen;
    noteCounters.footnote = snapshot.footnoteCounter;
    noteCounters.endnote = snapshot.endnoteCounter;
    noteUidCounter = snapshot.noteUid;
  }

  const rCol = block.querySelector('.right-col');
  const lCol = block.querySelector('.left-col');
  const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
  if (allChildren.length === 0) return;

  // פירוק הפסקאות והכותרות למבנה נתונים אחיד
  let mergedItems = [];
  for (let child of allChildren) {
    if (child.tagName === 'P') {
      let id = child.getAttribute('data-token-id');
      let text = child.getAttribute('data-raw-text');
      let isCont = child.getAttribute('data-is-cont') === 'true';
      let sideNote = child.getAttribute('data-side-note');
      let endNote = child.getAttribute('data-end-note');
      let lastItem = mergedItems[mergedItems.length - 1];
      if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
         lastItem.rawText += ' ' + text;
      } else {
         mergedItems.push({ type: 'p', id, rawText: text, isCont, sideNote, endNote });
      }
    } else {
      mergedItems.push({ 
        type: 'h', 
        id: child.getAttribute('data-token-id'), 
        html: child.outerHTML, 
        level: child.className.match(/title-level-(\d+)/)?.[1] 
      });
    }
  }

  const items = mergedItems.map(item => {
    if (item.type === 'p') {
      let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
      return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow };
    }
    return item;
  });

  // יצירת מרחב נקודות הפיצול
  const splitPoints = [];
  for (let i = 0; i <= items.length; i++) {
    if (i < items.length && items[i].type === 'p') {
      let lines = items[i].lines;
      splitPoints.push({ itemIndex: i, lineIndex: 0 });
      for (let l = 1; l < lines.length; l++) {
        splitPoints.push({ itemIndex: i, lineIndex: l, lines });
      }
    } else {
      splitPoints.push({ itemIndex: i, lineIndex: 0 });
    }
  }

  // סינון נקודות פיצול המשאירות כותרת יתומה בתחתית טור ימין
  const validSplitPoints = splitPoints.filter(sp => {
    if (sp.lineIndex > 0) return true;
    if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
    return true;
  });

  let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
  if (pointsToEvaluate.length === 0) return;

  let bestSplit = pointsToEvaluate[0];
  let minAbsDiff = Infinity;

  // מציאת הפיצול האופטימלי (ריצת מדידה ללא שינוי State)
  for (let sp of pointsToEvaluate) {
    rCol.innerHTML = '';
    for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
    if (sp.lineIndex > 0) {
      let item = items[sp.itemIndex];
      let pRight = document.createElement('p');
      pRight.className = 'p-cut';
      pRight.innerHTML = createDropWord(sp.lines.slice(0, sp.lineIndex).join(' '), item.isCont, false);
      rCol.appendChild(pRight);
    }
    let rHeight = rCol.scrollHeight;

    lCol.innerHTML = '';
    if (sp.lineIndex > 0) {
      let item = items[sp.itemIndex];
      let pLeft = document.createElement('p');
      pLeft.className = 'p-end';
      pLeft.innerHTML = createDropWord(sp.lines.slice(sp.lineIndex).join(' '), true, false);
      lCol.appendChild(pLeft);
    }
    for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) {
      renderSingleItemFast(lCol, items[i]);
    }
    let lHeight = lCol.scrollHeight;
    let diff = rHeight - lHeight;
    let absDiff = Math.abs(diff);
    
    if (absDiff < minAbsDiff || (absDiff === minAbsDiff && diff >= 0)) {
        minAbsDiff = absDiff;
        bestSplit = sp;
    }
  }

  // רינדור סופי של הפיצול שנבחר כולל הפעלת רישום הערות שוליים
  commitFinalColumns(rCol, lCol, block, items, bestSplit, colWidth, styleObj);
}
```

---

## 5. מקרי קצה שנבדקו ותורגמו לבדיקות (Edge Cases & Validation)

| מזהה מקרה קצה | תיאור התרחיש הטיפוגרפי | אופן הטיפול במערכת | תוצאה מאומתת |
| :--- | :--- | :--- | :--- |
| **EC-01** | **פסקה של שורה אחת בלבד** (`Short Paragraph`) | פונקציית `getLinesFromParagraph` בודקת יחס גובה. אם שורה בודדת, מוחל `first-word-inline` ללא `float`. | נמנעת חדירת המילה המודגשת לשורות הפסקה העוקבת. |
| **EC-02** | **הערת שוליים מצטברת מעבר לגובה העמוד** | `getFootnotesReservedHeight` מקזזת את שטח ההערות לפני חלוקת הפסקאות לטורים. | טקסט הטורים נחתך מוקדם יותר ועובר לעמוד הבא, וההערות נשארות בתוך גבול ה-A4. |
| **EC-03** | **כותרת סעיף הממוקמת בסוף טור ימין** | סינון ב-`validSplitPoints`: נקודת פיצול המייצרת כותרת בודדת בסוף טור ימין נפסלת. | הכותרת נדחקת לראש טור שמאל או לראש העמוד הבא. |
| **EC-04** | **שבירת פסקה בת 2 שורות בלבד** | מנגנון האלמנות דורש לפחות שתי שורות בכל צד של השבירה. | הפסקה נשארת בשלמותה ועוברת כגוש אחד לטור/עמוד הבא. |
| **EC-05** | **מספרי עמודים והערות בגימטריה: 15 ו-16** | פונקציית `toGematria` מכילה תנאי קשיח מפורש: `if (num === 15) return "טו"; if (num === 16) return "טז";`. | מניעת הופעת שמות קודש (יה / יו) בספר. |
| **EC-06** | **כותרת צד בשוליים של עמוד מלא** | `finalizeNotePositions` מזהה ש-`Top + Height > ColumnBoundaryHeight`, בודקת אפשרות הרמה, ואם אין מקום – מעבירה את האלמנט לעמוד הבא. | מניעת חיתוך או זליגה של הערות צד מעבר לשולי הדף התחתונים. |
| **EC-07** | **עמוד סיום פרק עם שורות בודדות** | אלגוריתם `estimateSectionFillRatio` מחשב את הנפח ומקטין את גובה כל העמודים בפרק באופן יחסי. | פריסה מאוזנת ואסתטית לכל אורך הפרק ללא עמוד סיום דליל. |
| **EC-08** | **ריבוי הערות שוליים באותה פסקה** | מנגנון ה-TreeWalker מפרק את הפסקה למקטעי טקסט ומייצר עוגנים מרובים לפי סדר הופעתם. | מספור עוקב רציף והזרקה מסודרת בתחתית העמוד. |

---

## 6. מפת דרכים והצעדים הבאים (Roadmap & Pending Tasks)

### 6.1 בעיות פתוחות הדורשות המשך פיתוח
1. **פיצול הערת שוליים ארוכה בין עמודים (Footnote Continuation Across Pages)**:
   * *הבעיה*: כיום, אם הערת שוליים אחת ארוכה במיוחד (מעל 30 שורות), היא אינה יודעת להישבר באמצעיתה ולהמשיך בתחתית העמוד הבא ("שם ע"ב"). היא נדחקת כולה או דוחקת את הטקסט.
   * *הפתרון הנדרש*: החלת מנגנון חיתוך שורות (`getLinesFromParagraph`) גם על בלוק ההערות עצמו בתוך `flushFootnotesInto`.
2. **צורת הדף / עימוד שו"ע (Multi-Text Commentary Wrap Around Primary Text)**:
   * *הבעיה*: עימוד שבו טקסט מרכזי (מרן) מוקף בטורים צדדיים או הערות היקפיות (רמ"א, ט"ז, ש"ך).
   * *הפתרון הנדרש*: פיתוח מודול גריד תלת-שכבתי עם מנגנון חישוב חללים פנויים (Collision-Free Polygonal Flow).
3. **ביצועים בטעינת ספרים של מעל 500 עמודים (Performance & Virtualization)**:
   * *הבעיה*: הרצת `measureContainer.offsetHeight` אלפי פעמים גורמת ל-DOM Reflow חזרתי (Layout Thrashing). במסמך של מעל 300 עמודים, פעולת העימוד עשויה להימשך 4-8 שניות.
   * *הפתרון הנדרש*: העברת לוגיקת החישוב המילולית ל-Web Worker תוך שימוש ב-`OffscreenCanvas.measureText()` לצורך חיזוי גבהים ללא נגיעה ב-DOM הראשי.

---

### 6.2 הנחיות ספציפיות למהנדס ה-AI הבא שימשיך את הפיתוח

> **הנחיות קריטיות להמשך עבודה:**
>
> 1. **שמירה על מבנה הקבצים**:
>    אין לאחד מחדש את הקבצים לקובץ HTML בודד. יש לשמר בקפדנות את ההפרדה בין `typesetter.js`, `decorations.js`, `app.js` ו-`style.css`.
>
> 2. **שמירה על טוהר הרינדור (Idempotency)**:
>    בכל פיתוח של אלגוריתם חיתוך, מדידה או איזון חדש – **אין לשנות את המונים הגלובליים** (`noteCounters`, `footnoteQueueForPage`) במהלך לולאות איטרטיביות. יש להשתמש תמיד בדגל `isDryRun` ובמנגנון ה-Snapshot שהוגדר ב-`balanceColumns`.
>
> 3. **אי-תלות בספריות חיצוניות**:
>    המערכת בנויה על ביצועי Vanilla JS טהורים. אין להכניס ספריות חיצוניות כבדות (כגון jQuery, Paged.js, או ספריות PDF מבוססות Canvas). הדפדפן עצמו מייצר את ה-PDF דרך `window.print()` בעזרת הגדרות ה-`@media print` המדויקות ב-`style.css`.
>
> 4. **טיפול בקובצי SVG ושערי ספר**:
>    כל תוספת של שער ספר וקטורי חייבת לכלול את התכונות `class="custom-bg-img"` ו-`preserveAspectRatio="none"` כדי להבטיח התאמה מדויקת לרשת ה-A4 (יחס 794x1123 ב-96 DPI).
>
> 5. **תמיכה בפרוטוקול קבצים מקומי (`file:///`)**:
>    בעת הרחבת מנגנוני הטעינה האוטומטית, יש לזכור שמשתמשים רבים מריצים את הקובץ מקומית ללא שרת. לכן, כל מנגנון מבוסס `fetch()` חייב להיות עטוף ב-`try/catch` שקט, ותמיד יש לספק חלופה מקבילה של בחירת קובץ ידנית דרך `FileReader`.

---

## 📊 סיכום שיחה

- **סה"כ הודעות:** 19
- **פניות משתמש:** 7
- **תגובות AI:** 12
- **מודל:** `models/gemini-3.8-flash`
- **תאריך:** 2026-09-07
