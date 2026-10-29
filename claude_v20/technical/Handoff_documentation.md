---
title: "תיעוד טכני: מערכת עימוד ספרים תורניים (A4, עברית RTL)"
date: unknown
version: V20
type: technical
source: Claude
---
# תיעוד טכני: מערכת עימוד ספרים תורניים (A4, עברית RTL)

מסמך העברה (handoff) המסכם את הארכיטקטורה, האלגוריתמים, התקלות והניסיונות שנפסלו, ומצב הקוד, כפי שנצברו בשיחת הפיתוח. המסמך מבדיל בין מה שהורץ ואומת לבין מה שנקבע מקריאת קוד בלבד.

## תוכן עניינים

0. קונבנציות ומגבלות הסביבה, שושלות הקוד
1. סקירת המערכת והארכיטקטורה
2. מכלול האלגוריתמים והבעיות שנפתרו (2.1 טוקניזציה · 2.2 מדידת שורות · 2.3 מילוי טורים · 2.4 איזון · 2.5 יתומות/אלמנות/מילים/כותרות · 2.6 הערות צד · 2.7 הערות שוליים · 2.8 גלישה · 2.9 סוף פרק · 2.10 מספור · 2.11 עיטורים · 2.12 כותרות עליונות · 2.13 שערים ונכסים · 2.14 גופנים · 2.15 ממשק וביצועים · 2.16 שיטת בדיקה)
3. יומן כישלונות, טעויות וניסיונות שנפסלו (F-01 … F-21)
4. סטטוס קוד נוכחי (קטעי קוד סופיים)
5. מקרי קצה ובדיקות
6. מפת דרכים והנחיות ל-AI הבא (6.5: מסלול למנוע דטרמיניסטי)
נספח א — קוד הבדיקות · נספח ב — ציר זמן הבקשות

---

## 0. קונבנציות המסמך ומגבלות הסביבה

### 0.1 רמות ביסוס

| תג | משמעות |
|---|---|
| `[מאומת-בדיקה]` | נבדק בהרצה בפועל (Node / vm / mock layout) על הקוד האמיתי שנשלף מהקבצים. |
| `[מאומת-משתמש]` | המשתמש אישר מתוצאת הרצה אמיתית בדפדפן (צילומי מסך או דיווח). |
| `[קריאת-קוד]` | נקבע מקריאה ועקיבה אחרי הקוד. לא הורץ. |
| `[לא-מאומת]` | השערה או שינוי שלא נבדק בדפדפן ואין לגביו אישור משתמש. |

### 0.2 מגבלות הסביבה שהשפיעו על כל ההחלטות

- אין דפדפן אמיתי בסביבת העבודה. מנוע העימוד תלוי ב-layout אמיתי (`scrollHeight`, `offsetTop`, `getBoundingClientRect`), ולכן **לא ניתן להריץ אותו מקצה לקצה** (ראה סעיף 3, F-03). בדיקות בוצעו על פונקציות טהורות ועל פונקציות שנשלפו לתוך `vm` עם מודל layout דטרמיניסטי מדומה.
- Node v22, jsdom v30 (מותקן ב-npm). jsdom אינו מממש layout.
- הקונטיינר אופס פעמיים במהלך השיחה (אובדן כל `/home/claude`). רק `/mnt/user-data/outputs` נשמר. כל עבודה נשמרה בנקודות ביניים (checkpoint) לשם.
- אין גישה ל-Anthropic API או לדפדפן מהקוד שנבדק; חיפוש רשת היה זמין (שימש פעם אחת, F-02).

### 0.3 שושלות הקוד (lineages)

המונח "גרסה" בשיחה מתייחס בפועל לכמה בסיסי קוד שונים. ההבחנה חיונית כדי להבין למה ממצא מסוים תקף רק לחלקם.

| שושלת | מקור | מאפיינים עיקריים |
|---|---|---|
| **L-A** — "פיצול שני עמודות" | נכתבה בתחילת השיחה (תיקיית `typesetter/`) | `#paste-column` + `#settings-column` מתקפל, שכבת סימוני מעבר עמוד (`#raw-input-page-markers`) מעל `#raw-input` (פונקציות: `toggleSettingsPanel`, `applyPageZoom`, `measureLineTopOffsets`, `scrollTextareaToPage`, `handleTextFileImport`), גלילה לטקסט בלחיצה על עמוד, זום A4 בעזרת `.page-zoom-wrap` + `transform:scale`, ייבוא קובץ טקסט. |
| **L-B** — "הגרסה המורחבת" | הועלתה ע"י המשתמש; נוצרה בסשן עם AI אחר (תיקיית `ts2/`) | לוח הגדרות מורחב מאוד, `#text-pane`/`#settings-pane` משלה, עורך `contenteditable` עם `.page-break-divider`, מנוע עימוד מורחב. רוב התיקונים בשיחה בוצעו כאן. מאוחר יותר המשתמש החליף את `typesetter.js` בגרסה שתיקן בעצמו (ראה 2.4). |
| **Merge** | המשתמש העלה 4 גרסאות (V1 השוואת, V2 חלוקת, V3 מערכת, V4 עדכון), דוח השוואה, וגרסה משולבת (`combined`) | `combined` מכילה גם פונקציות שנכתבו בשיחה זו (`ensureBuiltinFontsLoaded`, `applyHeadingOrnamentTextFit`, `exportShaarJSONWithPositions`, `shaarBoxSavedPositions`, `formatPageNumberDisplay`, `resolveHeaderAlign`), ולכן נראה שנבנתה על גבי תוצרים קודמים. אין אפשרות לאמת מקור מדויק של כל גרסה. |

**הקבצים שנמסרו בסוף השיחה = `combined` + התיקונים המפורטים בסעיף 4.1.** כל הפניות לשמות פונקציות ולמספרי שורה בסעיף 4 מתייחסות לקבצים הללו.

---

## 1. סקירת המערכת והארכיטקטורה

### 1.1 ייעוד

מערכת client-side לעימוד ספרים תורניים על דפי A4 (210×297 מ"מ) בעברית (RTL):

- גוף טקסט ב-2 טורים, עם **הערות צד** (marginalia) בשוליים כל פסקה.
- היררכיית כותרות 0–7 (כותרת 7 = הערת צד), כותרות "פורשות טור" (span_1col), מצבי כותרת: `new_page_1col`, `new_page_2col`, `span_1col`, `inline_2col`, `side_note`, `sub_shaar`, `run_in`.
- הערות שוליים (footnotes) בתחתית העמוד, הערות סיום (endnotes) בסוף חלק.
- שערים (ראשי / משנה / אחורי) כ-SVG רקע + תיבת טקסט ניתנת לכוונון בעכבר.
- כותרות עליונות (running headers) בשלושה אזורים, כולל "מתחלפות" ימין/שמאל.
- מספור עמודים באותיות (גימטריה) / מספרים, תוכן עניינים, עיטורים, מפרידי סוף פרק.
- פלט: תצוגה מקדימה בדפדפן + הדפסה / PDF (`window.print()`).

### 1.2 טכנולוגיות

| תחום | שימוש |
|---|---|
| שפות | HTML5, CSS3, JavaScript (ES2020+: `?.`, `async/await`, template literals). ללא בנייה (no build), ללא מסגרות (no frameworks), ללא מודולים (`<script>` רגילים). |
| CSS | Custom Properties (`--w-col`, `--sz-body`, `--hdr-w-r`…), Grid (בלוק 2 הטורים), Flexbox (זרימת העמוד, כותרות), `:has()`, `text-wrap: balance` (Chromium 114+), `@media print`. |
| API דפדפן | CSS Font Loading API (`FontFace`, `document.fonts.load/ready`), `window.queryLocalFonts` (Chromium בלבד), File API (`FileReader`, `Blob`), DOM measurement. |
| גופנים | Google Fonts דרך `@import` בראש `style.css` (Assistant, Rubik, Bellefair, David Libre, Frank Ruhl Libre, Noto Serif Hebrew) + גופנים מקומיים מתיקיית `fonts/` (`fonts.json`) + גופני מערכת. |
| נכסים חיצוניים | קובצי JSON (`shaar_main/sub/back.json`, `header_ornaments.json`, `section_dividers.json`, `note_rules.json`, `ornaments_left_right.json`, `ornaments_up_down.json`, `fonts.json`), פורמט פריט: `{id, name, svg[, box]}`. נוצרים בכלי אריזה נפרד (HTML עצמאי). |
| בדיקות (בשיחה) | `node --check`, מפרש HTML (`html.parser`) לבדיקת קינון, ספירת סוגריים ב-CSS, הצלבת handlers↔פונקציות, הצלבת `getElementById`↔`id=`, שליפת פונקציות ל-`vm` עם mock DOM. |

### 1.3 חלוקת קבצים

| קובץ | תפקיד |
|---|---|
| `index.html` | ה-View של לוח ההגדרות: 282 בקרות בגרסת combined (182 `<input>`, 96 `<select>`, 4 `<textarea>`), פאנלים, כפתורי פעולה. אין לוגיקה מלבד `onclick`/`onchange` שמפנים לפונקציות גלובליות. |
| `style.css` | מראה העמוד (`.a4-page`, `.page-body-flow`, `.block-2col`, כותרות, עיטורים, הערות), לוח ההגדרות, הדפסה. עיקר הגדרות העימוד מגיעות כמשתני CSS. |
| `decorations.js` | רישומים (registries) וגנרטורים של HTML: `BUILTIN_SHAAR_THEMES`, `EXTERNAL_SHAAR_ASSETS`, `ORNAMENTS_LR/UD`, `EXTERNAL_ALL_ORNAMENTS`, `HEADER_ORNAMENTS`, `SECTION_DIVIDERS`; רינדור שערים; עיטורי כותרת/צד; מפרידי סוף פרק; תיבת כוונון שער. |
| `typesetter.js` | מנוע העימוד: קריאת הגדרות ל-CSS, פרסור וטוקניזציה, מדידת שורות, מילוי טורים, איזון, הערות שוליים/סיום, יצירת עמודים, כותרות עליונות, מספור, TOC. |
| `app.js` | "דבק" ו-controller: אירועי UI, טעינת נכסים (JSON, גופנים), תבניות והטמעת ערכות נושא, ייבוא קבצים, סנכרון עורך↔תצוגה, זום תצוגה, `window.onload`. |

סדר טעינה: `decorations.js` → `typesetter.js` → `app.js`. כל הקבצים חולקים scope גלובלי; הפניות בין קבצים נפתרות בזמן קריאה, ולכן סדר ההגדרה אינו משנה כל עוד הקריאה מתבצעת אחרי הטעינה (כל הקריאות ל-`typesetDocument()` מתבצעות מ-handlers או מ-`window.onload`).

### 1.4 זרימת הנתונים

```
index.html (בקרות)
   │  ערכים נקראים ישירות מה-DOM (document.getElementById(...).value)
   ▼
updateGrid() / updateStyles()  ──►  :root { --w-col, --sz-body, --fn-h2, --hdr-divider-color, ... }
   │                                          │
   │                                          ▼
   │                                    style.css (var(--...))
   ▼
[לחיצה על "⚡ עדכן ועמד מחדש"]
typesetDocument()  ──(debounce 400ms, בגרסת combined)──►  performTypeset()
   │
   ├─ parseMetadataFromText(raw)     → ממלא inp-book-title/subtitle/desc/sections/author/year
   ├─ טוקניזציה                       → tokens[], lineToTokenMap[]
   ├─ בניית מקטעים                    → sections[] (sub_shaar | body)
   ├─ שערים: renderMainShaar / renderBackShaar / renderSubShaar   (decorations.js)
   ├─ לולאת עמודים:
   │     createPageLayout() → bodyFlow
   │     [עמוד פתיחת כותרת 2: spacer + title + siman + עיטורים → חישוב `used`]
   │     לולאת בלוקים: block2Col (גריד 2 טורים) ← מילוי ימין ואז שמאל
   │        מדידה: getLinesFromParagraph → bestFitLine → resolveParagraphCut
   │        הערות: queue → flushFootnotesInto(page)
   │        סוף בלוק: balanceColumns | justifyColumnVertically
   └─ שלב סיום: מספרי עמודים ב-TOC, מפת מעברי עמוד, זום תצוגה, התאמות עיטורים
```

### 1.5 עקרונות תכנון והפרדת אחריות

**אין MVC/MVVM פורמלי.** ההפרדה בפועל:

| שכבה | מימוש | הערה |
|---|---|---|
| View | `index.html` + `style.css` | המצב (state) של ההגדרות שמור ב-DOM עצמו, לא באובייקט נפרד. |
| Controller | `app.js` | אירועים, טעינת קבצים, תבניות. |
| Engine | `typesetter.js` | קורא הגדרות מה-DOM בזמן העימוד; מייצר DOM של עמודים. |
| Asset layer | `decorations.js` + קובצי JSON | רישומים גלובליים (`let`/`const` ברמה העליונה). |

**עקרונות מרכזיים שנקבעו או נאכפו במהלך השיחה:**

1. **ה-DOM הוא אורקל ה-layout (measure-then-commit).** מנוע העימוד אינו מחשב גבהים בעצמו; הוא מכניס תוכן ל-DOM, קורא `scrollHeight` / `offsetTop` / `offsetHeight`, ומחליט. לכן כל תוצאה תלויה בגופן, ברוחב, ב-CSS וב"הקשר" (ancestors) בזמן המדידה.
2. **גודל עמוד פיזי קבוע.** `.a4-page` הוא `210mm × 297mm`, `padding:15mm`, `overflow:hidden`. התאמה לרוחב המסך ("זום") היא תצוגתית בלבד (`transform:scale`), והדפסה מאפסת אותה (`@media print`).
3. **שני מנגנוני הגדרות:** (א) הגדרות שהופכות ל-CSS variables ב-`updateGrid()`/`updateStyles()` (זולות, ניתנות להחלה חיה); (ב) הגדרות שנקראות ב-`getElementById` בתוך מנוע העימוד (דורשות עימוד מחדש).
4. **עימוד רק בהפעלה מפורשת.** נקבע אחרי שנמצא שכל אחת מ-~204 הבקרות הריצה `typesetDocument()` בכל הקלדה (F-06).
5. **כל אלמנט שצורך גובה חייב להיות ב-DOM לפני המדידה שמתקצבת את העמוד, וכל הגנה (אלמנה/יתומה/כותרת/הערה) חייבת להיבדק מחדש אחרי כל שינוי שבא אחריה.** זה הלקח המרכזי של השיחה (סעיף 2.5 ו-3).

### 1.6 Threading ו-Rendering

- **Thread יחיד.** העימוד סינכרוני וחוסם. אי אפשר להעביר ל-Web Worker כי הוא תלוי ב-DOM layout.
- **Debounce:** בגרסת `combined`, `typesetDocument()` הוא עטיפה (`setTimeout` 400ms) סביב `performTypeset()`. השלכה: לחיצה על כפתור העדכון מתעכבת 400ms; קוד שמניח שהעימוד הושלם מיד אחרי הקריאה שגוי (נבדקו כל 16 אתרי הקריאה: ב-`window.onload` נקרא `initVisualPickers()` מיד אחרי, והוא אינו תלוי בתוצאת העימוד `[קריאת-קוד]`).
- **L-A בלבד:** איחוד רענונים בעזרת `requestAnimationFrame` (`scheduleEditorOverlaysRefresh`) לגרירת המפריד ולשינוי גודל חלון.
- **Rendering engine:** מנוע ה-layout של הדפדפן (Blink בפועל, בגלל `queryLocalFonts` ו-`:has()`). קונטיינר מדידה מוסתר `#measuring-box` עם `width` שווה לרוחב הטור האמיתי.


### 1.7 יעד אסטרטגי מוצהר ופער מהמצב הנוכחי

הודעת הפתיחה של ההקשר כללה הנחיות פרויקט (`CLAUDE.md`, "IMUD_TORANI Vector Typesetting Guidelines"):

| סעיף | תוכן ההנחיה |
|---|---|
| מטרה | להפוך את `typesetter.js` למנוע עימוד דטרמיניסטי של מתמטיקה טהורה: ללא תלות במידות אלמנטים של הדפדפן (`getBoundingClientRect`, `offsetHeight`) וללא ניתוח תמונות. מטרת-על: ולידציה מדויקת מבוססת קוד, ויצירת PDF ללא דפדפן (headless). |
| ולידציה | כל כלל פריסה מאומת במרחב קואורדינטות: מיקום מדויק של כל מילה, גבול טור, עיטור (`ornaments_up_down.json`) ומפריד פרקים (`section_dividers.json`) כמערכים גאומטריים; פונקציות ולידציה ב-`test-suite.js` סורקות את המערכים (חוסר התאמת גובה טורים, הפרות מרווח שורות). |
| מקרי קצה | איזון טורים בסוף מקטע; מניעת יתומות/אלמנות בשבירת עמוד לפי חישוב גובה כותרת + מרווח שורה; עיגון עיטורים (`shaar_main`, `shaar_sub`, מפרידים) כתיבות תוחמות ביחס למסגרת הטקסט. |
| סגנון | קוד מלא וניתן להרצה, ללא placeholders; נוסחאות מדויקות ולא היוריסטיקות CSS; שמירת היררכיית טעינת הגופנים הדו-שלבית ועדכון נקי של סכמות ההגדרות. |

**הפער:** המימוש הנוכחי הוא ההפך במרכיב אחד מרכזי: ה-DOM הוא אורקל ה-layout (עיקרון 1 בסעיף 1.5). כל החלטות העימוד נשענות על `scrollHeight` / `offsetTop` / `offsetHeight` / `getBoundingClientRect`. **ההנחיה הזו לא יושמה בשיחה**: העבודה בפועל הייתה ניפוי ותיקון של המנוע מבוסס-ה-DOM. הבדיקות שנכתבו (סעיף 5.2) הן גשר חלקי: הן מריצות לוגיקה על מודל layout מדומה, אך אינן מנוע דטרמיניסטי. מסלול מוצע: סעיף 6.5.

---

## 2. מכלול האלגוריתמים והבעיות שנפתרו

### 2.1 פרסור, טוקניזציה ובניית מקטעים

**קלט:** טקסט גולמי בתיבת ההדבקה. שורה = יחידה לוגית. אין תחביר Markdown.

**שלבים:**

1. `parseMetadataFromText(raw)` מסיר מראש הטקסט שורות מטא-דאטה ומעדכן שדות `inp-book-*`. התוויות שזוהו: `שם הספר`, `נושא`, `נושא מפורט`, `פרטי מהדורא`, `שם המחבר`, `מקום ושנת הוצאה`. תחביר שורה: `תווית - ערך` (מקף `-`/`–`/`—` או נקודתיים), עם קידומות חלופיות (למשל `נושא/כותרת משנה`, `נושא מפורט / תיאור`, `פרטי מהדורא / חלקים`). `[מאומת-בדיקה]` על מסמך אמיתי (6 שדות נקלטו נכון).
2. לולאת שורות. לכל שורה (אחרי `trim()`):
   - שורה ריקה → `lineToTokenMap[i] = null`.
   - כותרת: `/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/`. הקבוצה הראשונה = רמה (0–7). `.*?` הלא-חמדני "בולע" את `מספר N` ומסתיים במקף **הראשון**; מקפים נוספים נשארים בטקסט הכותרת. מספר הסימן (`מספר N`) אינו נקרא ע"י הטוקנייזר.
   - רמה 7 **ובתנאי** ש-`mode-h7 === 'side_note'` → `pendingSideNote = txt` (אינו טוקן; מתחבר לפסקה הבאה). ראה F-13.
   - רמה אחרת: אם `mode-hN === 'run_in'` → `pendingRunInHeading` (נשרשר לראש הפסקה הבאה כ-`<span class="heading-run-in title-level-N">`); אחרת טוקן `{type:'h'+N, level, text, id, lineIdx}`.
   - קידומות של text-styles מיובאים (`importedTextStyles`) ושל הערת סיום (`en-line-prefix`, ברירת מחדל `הערת סיום -`) → `pendingEndNote` / `customStyleId`.
   - אחרת: טוקן פסקה `{type:'p', text, id, lineIdx, sideNote, endNote}`; הערות ממתינות נמסרות לו ומתאפסות.
3. בניית מקטעים. `headingModes[level]` נקרא מ-`mode-hN`. כותרת במצב `sub_shaar` (ברירת מחדל: רמה 1) פותחת מקטע `sub_shaar`; כותרת ב-`new_page_1col`/`new_page_2col` פותחת מקטע `body` חדש עם `isNewPage`. `oddPageRequired[level]` מכריח התחלה בעמוד אי-זוגי (`ensureOddPageStart` מוסיף עמוד ריק ומקדם `pageIndex`).

**מבני נתונים:** `tokens[]` (אינדקס = `id`), `lineToTokenMap[lineIdx] → tokenId|null`, `sections[]`. בשושלת L-A נוסף `tokenLineIndex[tokenId] → lineIdx` ו-`pageBreakMarks[]` לצורך סימוני מעבר עמוד בעורך.

**תוצאות על מסמך אמיתי** (`חלק_ההקדמה_סדר_חדש.txt`, 1010 שורות, נבדק ע"י שליפת הטוקנייזר ל-`new Function` עם mock של `document`) `[מאומת-בדיקה]`:

| מדד | ערך |
|---|---|
| טוקנים | 701: h0=1, h1=1, h2=5, h3=21, h4=55, h5=14, h6=15, p=589 |
| כותרות 7 (הערות צד) | 303 בקובץ; 303 פסקאות נושאות `sideNote` — אפס אובדן |
| שורות לא ריקות ללא רישום ב-`lineToTokenMap` | 0 |
| מקטעים | 7 (1 `sub_shaar`, 6 `body`) |
| סוגרי הערות שוליים `[` `]` | 9 / 9, מאוזן |
| תוצאה זהה אחרי כל שינוי בקוד | כן (נבדק שוב אחרי תיקון h7 ואחרי הוספת פונקציות) |

**מקרי קצה:**

- שתי כותרות 7 רצופות ללא פסקה ביניהן: `pendingSideNote = txt` דורס, והראשונה אובדת. אין צבירה. בקובץ הנבדק: 0 מקרים. `[קריאת-קוד]` — לא תוקן.
- כותרת 7 כשורה אחרונה: ההערה אינה מתחברת לדבר ואובדת בשקט. `[קריאת-קוד]`.
- `\r` בסוף שורות (קבצי Windows): `trim()` מנקה. כשכל השורות התקבלו עם CRLF בבדיקות, נורמלו מראש.
- הערות שוליים עם סוגרים לא מאוזנים: לא נבדק מה מצב `findDelimiterMatches`; הבדיקה היחידה היא ספירת סוגרים בקובץ.

### 2.2 מדידת שורות (`getLinesFromParagraph`)

**בעיה:** לפצל פסקה לשורות חזותיות כפי שהדפדפן ישבור אותן, כדי להחליט כמה שורות נכנסות בטור ולחתוך פסקה בין טורים/עמודים בלי לדעת מראש גופן ומטריקות.

**אלגוריתם** (`[קריאת-קוד]` + `[מאומת-בדיקה]` על ההיגיון עם מודל layout מדומה):

1. `safeText = text.trim()`. מילות ההערה (`findDelimiterMatches(safeText,'body')`): כל רווח בתוך הערה מוחלף ב-`\uE000` (תו Private Use) כך ש-`split(/\s+/)` יראה את ההערה כ"מילה" אחת ולא תיקרע באמצע.
2. `words = safeText.split(/\s+/)`.
3. הערכת מספר שורות: פסקת בדיקה `pMeasure` עם `textContent = text`; `numLinesEstimated = offsetHeight / גובה שורה בודדת` (גובה שורה בודדת נמדד על התו `א`). מחליט אם להפעיל חלון "מילה ראשונה" (`first-word-window`, צף ימני) — מצב `drop-word-mode`, ומינימום שורות.
4. בניית HTML מדידה: כל מילה ב-`<span id="mw-i">` ואחריה רווח. מילת הערה מוצגת כ-`' א '` (קירוב לרוחב הסימון בפועל). `#measuring-box` ברוחב הטור האמיתי; `pMeasure` מעתיק `fontFamily/fontSize/lineHeight`.
5. קיבוץ לשורות: `top = span.offsetTop`; שורה חדשה כש-`|top − currentTop| > 8` (סף 8px לספיגת הבדלי baseline).
6. שחזור מחרוזות שורה: `realWord = words[i].replace(/\uE000/g,' ')` (תוכן ההערה האמיתי חוזר לטקסט).
7. החזרה: `{lines: string[], hasWindow, numLines}`.

**מגבלות מובנות:** המדידה מדויקת רק אם רוחב הקונטיינר וה-CSS שווים לאלו של הטור האמיתי; רוחב סימון הערה מקורב ב-`א`; הצף של "מילה ראשונה" אינו משפיע על קיבוץ המילים (שורה ראשונה נרשמת עם `dropWords` כרכיב ראשון).

**שינוי בשיחה:** קשירת שתי המילים האחרונות (מילה יתומה), סעיף 2.5.3.

### 2.3 מילוי שני טורים (גריד 2 טורים, זרימת עמוד)

**מבנה DOM של בלוק:**

```
.page-body-flow (flex column, flex-grow:1)
  └─ .block-2col (display:grid, align-items:start, 7 עמודות)
       ├─ .margin-notes-column.right-margin    (הערות צד, ימין)
       ├─ <div></div>                          (רווח --w-gap)
       ├─ .main-column.right-col               (rCol)
       ├─ .col-gutter-divider.col-rule-{none|plain|dashed|double}   (grid-column:4)
       ├─ .main-column.left-col                (lCol)
       ├─ <div></div>
       └─ .margin-notes-column.left-margin
```

רוחבי העמודות: משתני `--w-col` (ברירת מחדל 40%), `--w-margin` (7.5%), `--w-gutter` (2%), `--w-gap` (2%) מ-`updateGrid()`.

**תקציב גובה:**

```
totalFlowH   = bodyFlow.clientHeight || 870        // נמדד פעם אחת בפתיחת עמוד
used         = (spacer + Σ(offsetHeight + marginTop + marginBottom) של רכיבי הכותרת)  // רק בעמוד פתיחת כותרת 2
remPageHeight = isFirstPage ? totalFlowH - used : totalFlowH
remPageHeight -= max(rCol.scrollHeight, lCol.scrollHeight)     // אחרי כל בלוק
currentAvailH = remPageHeight - getFootnotesReservedHeight()
```

`getFootnotesReservedHeight()` היא פונקציה מקוננת בתוך `performTypeset`: אפס אם אין הערות בתור העמוד; אחרת `measureNoteBlockHeight(queue, fn-columns) + 24 + (24 אם יש כותרת מעל הערות)`. הקבוע 24 הוא קיזוז קבוע לקו/שוליים. `[קריאת-קוד]`.

**מילוי** (`['right','left'].forEach(colName => { while (…) {…} })`):

1. טור ימני מתמלא עד שנגמר מקום, אחריו השמאלי, מאותו `tokenIndex` (המשך).
2. בכל איטרציה: `curMode = headingModes[...]`. אם `span_1col` (כותרת 3 למשל) → `break` (הכותרת תוצג מחוץ לבלוק). אם `targetCol.scrollHeight >= currentAvailH − 10` וקיים תוכן → `break` (הטור מלא; 10px מרווח ביטחון).
3. כותרת רגילה (`title-level-N`): נוספת לטור; אם `scrollHeight > avail` והיא לא היחידה → מוסרת ו-`break`.
4. פסקה: נוצר `pElem` בטור; `bestFitLine` = מספר השורות המרבי כך ש-`targetCol.scrollHeight ≤ currentAvailH` (הוספת שורה אחר שורה, כל פעם מדידה). הערות שוליים בפסקה נבדקות ב"probe" ששומר מקום להערה (מקטין את `cachedAvailH`).
5. `bestFitLine === 0` → הפסקה מוסרת; כותרות עוקבות-לסוף מוסרות (`popTrailingHeadings`), `tokenIndex` מוקטן בהתאם, `break`.
6. `resolveParagraphCut` מקבע את החיתוך הסופי (2.5.1).
7. חיתוך באמצע פסקה: החלק הראשון `p.p-cut` (`text-align-last: justify`), ההמשך נשמר ב-`pendingWordTokens` ומוצב בראש הטור/העמוד הבא (`isContinuation=true` — ללא חלון מילה ראשונה); חלק אחרון `p.p-end` (`text-align-last: var(--last-line-align, center)`).
8. הערת צד (`sideNote`) נוצרת **אחרי** ההצבה, בעמודת השוליים של אותו טור, ונרשמת ב-`pagePendingNotes` (2.6).

**עמוד פתיחת כותרת 2 (`isFirstPage && h2Text`):** `createPageLayout` יוצר `.h2-spacer` (`flex-basis: var(--h2-top-distance, 22%)`) + `.title-level-2-standalone`. אחריו, בלולאה הראשית: שורת סימן (`.h2-siman-badge`), עיטורים עליונים/תחתונים לסימן ולכותרת, או עיטור צדדי (`.block-h2-title-side`). רק אחרי שכל אלה ב-DOM מחושב `used`.

**כותרת רחבה (h3, `span_1col`):** `.block-h3-span` (flex row: עיטור ימני, טקסט, עיטור שמאלי) נוסף ישירות ל-`bodyFlow`. אם `currentAvailH < 60` → `break` לפני ההצבה. אחרי ההצבה: `spanHeight = offsetHeight + 4`; אם גדול מהנותר → מוסרת ו-`break`. אחרת `remPageHeight -= spanHeight`.

**אתר שני — טור יחיד רחב** (`new_page_1col`, תוכן ב-`span_1col`): אותו עיקרון של `bestFitLine` ו-`resolveParagraphCut`, על `targetCol` יחיד.

**אין התקדמות (nothing placed):** אם אחרי המילוי שני הטורים ריקים → הבלוק מוסר; כותרות `.block-h3-span` עוקבות-לסוף מוסרות מ-`bodyFlow` (`tokenIndex--` לכל אחת); `break` → עמוד חדש. זה מנגנון "כותרת רחבה יתומה" (מימוש עצל: נסיגה). `[קריאת-קוד]`.

### 2.4 איזון ויישור טורים

#### 2.4.1 שני מנגנונים

| מנגנון | מה עושה | מתי |
|---|---|---|
| `justifyColumnVertically(col, targetH, style)` | מותח את הטור הקצר: מוסיף `margin-bottom` שווה בין פסקאות (או מגדיל `line-height` אם יש פסקה אחת) עד הגובה היעד. לא משנה את תוכן הטורים. | הפרש גבהים 2–60px |
| `balanceColumns(block, colWidth, style, snapshot, availH)` | ממזג את כל תוכן הבלוק, מונה נקודות פיצול אפשריות, מרנדר כל מועמד ומודד, בוחר את הטוב ביותר ובונה מחדש. | מעבר חד (סוף פרק / לפני כותרת רחבה) או חריגה / הפרש > 60px |

#### 2.4.2 `balanceColumns`

1. **איפוס תור ההערות** לתמונת-המצב `snapshot` של תחילת הבלוק (`footnoteQueueForPage.length`, מוני הערות), כי הרינדור החוזר ייצור אותן מחדש.
2. **מודל פריטים:** מכל ילדי `rCol`+`lCol` נבנים `items[]`: כותרת `{type:'h', html}` או פסקה `{type:'p', rawText, isCont, lines}` (טקסט מ-`data-raw-text`). חלקי פסקה עוקבים עם אותו `tokenId` מתמזגים (`rawText += ' ' + text`) ומחושבים מחדש ב-`getLinesFromParagraph`.
3. **נקודות פיצול:** לכל פריט: גבול לפני הפריט (`lineIndex=0`) ופנימי בכל שורה `l ∈ [1, lines−1]`. כל נקודה פנימית מסומנת `violatesRule` אם `avoidWidows && l===1` או `avoidOrphans && lines−l===1`.
4. **סינון:** נקודת גבול ישירות אחרי כותרת נפסלת (כותרת לא תסיים את הטור הימני). `strictPoints` = תקינות שאינן מפרות כלל.
5. **הערכה:** לכל מועמד — רינדור מבחן ל-`rCol`/`lCol` (`renderSingleItemFast`, עם `applyDelimiterStyles(..., true)` למדידה מדויקת של סימוני הערות), קריאת `rHeight/lHeight` מ-`scrollHeight`:
   ```
   absDiff       = |rHeight − lHeight|
   heightPenalty = (rHeight > availH ? (rHeight − availH)·2000 : 0) + (lHeight > availH ? (lHeight − availH)·2000 : 0)
   score         = absDiff + heightPenalty
   ```
   מינימום `score`; בשוויון — עדיפות להפרש `diff ≥ 0` (ימין גבוה או שווה). `availH = Infinity` מבטל את הקנס.
6. **רשת ביטחון (נוספה בשיחה):** אם הציון הטוב ביותר בקבוצת `strictPoints` נושא `heightPenalty > 0`, נסרקות גם נקודות שמפרות את כללי אלמנה/יתומה (אך לא כאלו שמשאירות כותרת יתומה). חריגה מבנית גרועה מהפרת כלל דפוס.
   (השוואת קבצים: בגרסת V4 — `עדכון.txt` — אין סינון אלמנה/יתומה בתוך `balanceColumns`; ב-`combined` הוא קיים. הרשת מרככת את השלכותיו.)
7. **בנייה סופית** עם `appendItemFinal` (`p-cut`/`p-end`, הערות צד מחדש לתוך השוליים, סימוני הערות לתור), הרצת `justifyColumnVertically` להפרש 2–60px, ו-`finalizeNotePositions(finalNotes, …)`.

#### 2.4.3 נקודות הקריאה (גרסת combined)

```
סוף פרק אמיתי (tokenIndex >= secTokens.length)        → balanceColumns(…, actualAvailH)   [תמיד] + מפריד סוף פרק
לפני כותרת span_1col                                  → balanceColumns(…, actualAvailH)   [תמיד]
באמצע זרימה, rCol.scrollHeight > actualAvailH
   או |rCol − lCol| > 60                              → balanceColumns(…, actualAvailH)
אחרת, הפרש קטן                                         → justifyColumnVertically על הטור הקצר
actualAvailH = remPageHeight − getFootnotesReservedHeight()    // לאחר שהערות העמוד ידועות
```

#### 2.4.4 היסטוריית הפתרון (כולל המפנים השגויים) — ראה גם F-07

| שלב | מה נעשה | תוצאה |
|---|---|---|
| 1 | הוספת `justifyColumnVertically` בנקודות המעבר (סוף פרק / לפני כותרת 3) | המשתמש: לא זו הבעיה; "פרק מסתיים בטור אחד במקום שניים". |
| 2 | איתור: `break` על `span_1col` בטור ימני גורם לטור שמאלי להיכשל מיד על אותו טוקן ולהישאר ריק. תיקון: `balanceColumns` תמיד כשטור ריק. | `[מאומת-משתמש]` — לא נמצא יותר מקרה של כותרת 3 באמצע עמוד עם טור אחד ריק. |
| 3 | נשאר: טקסט לפני כותרת 3 לא מחולק שווה, טור אחד מגיע לסוף הדף וכותרת 3 נדחית לעמוד הבא. | המשתמש מצא וגילה בעצמו את שורש הבעיה (ראה שלב 4). |
| 4 | **שורש (תיקון המשתמש, `[מאומת-משתמש]`):** תקציב הגובה לא כלל את שטח הערות השוליים לאחר שכל הערות העמוד ידועות. | הוכנס `actualAvailH` ואיזון בכל נקודת מעבר וגם בחריגה / הפרש > 60px ("היישור נראה מעולה"). בקוד הסופי קיימים גם `applyDelimiterStyles(…, true)` במדידת הניסוי והסרת רווח לפני סוגר פותח; **לא ניתן לאמת מהתמליל שהם חלק מאותו תיקון**. |
| 5 | ב-combined: ניקוד קנס `×2000` על חריגה + רשת הביטחון שלי. | `[לא-מאומת]` בדפדפן. |


### 2.5 בקרת שורות, מילים וכותרות בודדות (Orphan & Widow control)

**מינוח.** בקוד ובממשק המונחים "אלמנה/יתומה" מתהפכים ביחס לאנגלית, ולכן המסמך משתמש בתיאור מפורש:

| תיאור | מזהה בקוד | בקרה בממשק | תווית בממשק |
|---|---|---|---|
| שורה **ראשונה** בודדת של פסקה בתחתית טור/עמוד | `avoidWidows` | `avoid-widows` | "מנע שורות בודדות בסוף עמוד (יתומות)" |
| שורה **אחרונה** בודדת של פסקה בראש הטור/העמוד הבא | `avoidOrphans` | `avoid-orphans` | (בקרה סמוכה) |
| **מילה** בודדת בשורה האחרונה של פסקה | `bindPair` | `avoid-runt-word` (נוסף בשיחה) | "מנע מילה בודדת בשורה האחרונה של פסקה" |
| כותרת בסוף טור בלי טקסט אחריה | — (תמיד פעיל) | — | — |

#### 2.5.1 הגנת שורות: `resolveParagraphCut`

**עיקרון:** כל הגנה יכולה לשנות את תוצאת קודמתה, ולכן מפעילים את כולן בסדר קבוע וחוזרים עד ייצוב (עד 8 איטרציות).

```
fit = bestFitLine                                   // מכמות השורות שנכנסות פיזית
חזור:
   fit = adjustFitLineForNoteSpans(lines, fit)      // לא לחתוך בתוך הערה
   אם fit > maxFit → החזר fit                        // שלמות הערה גוברת על חריגה
   אם avoidOrphans וגם נשארת שורה אחת וגם fit > 1 → fit -= 1
   אם יש תוכן מעל:
        avoidWidows וגם fit == 1 → החזר 0 (להעביר פסקה שלמה)
        avoidOrphans וגם fit == 1 וגם נשארת שורה אחת → החזר 0
עד שאין שינוי
```

**טבלת אמת** (כל השורות `[מאומת-בדיקה]`, בדיקות R1–R12 בסעיף 5.2):

| שורות בפסקה | נכנסות | יש תוכן מעל | כלל "ראשונה" | כלל "אחרונה" | תוצאה |
|---|---|---|---|---|---|
| 3 | 2 | כן | כן | כן | **0** (קוד קודם החזיר 1 → 1 ו-2, מפר את הכלל השני) |
| 3 | 1 | כן | כן | כן | 0 |
| 4 | 3 | כן | כן | כן | 2 |
| 5 | 2 | כן | כן | כן | 2 (ללא שינוי) |
| 2 | 1 | כן | כן | כן | 0 |
| 2 | 1 | **לא** | כן | כן | 1 (חייבים התקדמות) |
| 3 | 2 | לא | כן | כן | 1 |
| 3 | 2 | כן | לא | כן | 1 (המשתמש ביקש רק מניעת "אחרונה"; "ראשונה" מותרת) |
| 2 | 1 | כן | לא | כן | 0 |
| 3 | 2 | כן | לא | לא | 2 (ללא הגנות) |
| n | n | — | — | — | n |
| n | 0 | — | — | — | 0 |

**מקרה הכלל "אין תוכן מעל":** כשהפסקה היא התוכן הראשון בעמוד (`pageHasContent=false`), לא ניתן להעביר אותה הלאה (לולאה אינסופית של עמודים), ולכן כללי ההגנה מושעים והתקדמות מובטחת. `pageHasContent` הוא דגל ברמת **העמוד**, לא הטור (בטור שמאלי הוא נכון אם הימני הניח תוכן).

#### 2.5.2 הגנת כותרות יתומות

כותרת בטור (`title-level-*`) שנשארת האלמנט האחרון בלי טקסט אחריה מוסרת ומחזירה את `tokenIndex`. מנגנון הנסיגה בנקודות הבאות:

| נקודה | מנגנון |
|---|---|
| `bestFitLine === 0` (פסקת המשך לא נכנסת) | `popTrailingHeadings(targetCol)` + `tokenIndex -= n` (מקורי) |
| `resolveParagraphCut === 0` (פסקה נדחית עקב כלל שורות) | **נוסף:** אותה נסיגה; בקוד המקורי הכותרת נשארה בתחתית הטור |
| יציאה מהלולאה כשהטור מלא | **נוסף:** אכיפה אחרי הלולאה (post-loop) — ראה קוד בסעיף 4.2 |
| כותרת רחבה (`block-h3-span`) | נסיגה עצלה: אם שני הטורים ריקים אחרי המילוי — מסירים את הבלוק ואת כותרות ה-h3 העוקבות-לסוף (`tokenIndex--` לכל אחת) |
| `balanceColumns` | נקודת פיצול מיד אחרי כותרת נפסלת; כותרת בראש הטור השמאלי מותרת |

**תנאי הגנה בכללי האכיפה (post-loop)** — כל אחד מונע לולאה אינסופית או נסיגה מיותרת `[קריאת-קוד]`:

1. `tokenIndex < secTokens.length` — כותרת שהיא הטוקן האחרון במקטע נשארת (אחרת: נסיגה → הצבה → נסיגה …).
2. `!pendingWordTokens` — כשהאלמנט האחרון הוא חלק מפסקה חתוכה, אין כותרות לאחור.
3. הטוקן הבא אינו כותרת `span_1col` — כותרת ברמה נמוכה לפני כותרת רחבה אינה "מחכה לטקסט"; בלי התנאי: `h4` ואחריו `h3` ← נסיגת `h4` בכל איטרציה ← לולאה אינסופית.
4. `targetCol.children.length > hn || pageHasContent` — עמוד/טור שכולו כותרות ללא טקסט בעמוד: הכותרות נשארות (העברה לעמוד חדש לא תועיל).

#### 2.5.3 הגנת מילה בודדת (runt) בשורה האחרונה

**בעיה:** שורה אחרונה בפסקה עם מילה אחת. בגלל `text-align-last: var(--last-line-align, center)` המילה מופיעה ממורכזת/מבודדת.

**פתרון:** קשירת שתי המילים האחרונות של הפסקה ברווח בלתי-שביר (U+00A0), ב-3 מקומות שחייבים להיות עקביים:

1. **מדידה:** ב-HTML המדידה מופרדות שתי המילים ב-`&nbsp;` במקום ברווח → הדפדפן שובר את השורה לפני הזוג, לא ביניהם.
2. **טקסט השורה:** `joinMeasuredLine(arr, idxs, pairStart, bindPair)` מחבר את שתי המילים ב-`\u00A0` בשורה האחרונה שנוצרת. כך הרינדור האמיתי (שנבנה מ-`lines.join(' ')`) שומר על הקשירה. בלי זה: המדידה מציגה זוג, הרינדור האמיתי שבור ומחזיר את המילה היתומה.
3. **נרמול רווחים:** `createDropWord` פיצל ב-`/\s+/` (JS מתייחס ל-NBSP כרווח) ובנה מחדש עם `' '` — מחק את הקשירה לכל פסקה שלמה בעמוד אחד. הוחלף ב-`/[ \t\r\n\f\v]+/`.

**תנאי הפעלה:** `avoid-runt-word` לא כבוי (ברירת מחדל: פועל; אם הבקרה חסרה — פועל); יש לפחות 3 מילים אחרי חלון "מילה ראשונה" (`words.length − flowStart ≥ 3`); הזוג לא נוגע בחלון.

**תכונות שהוכחו (מודל layout מדומה):** מספר השורות אינו משתנה; הזוג בשורה האחרונה; אף מילה לא אובדת/מוכפלת; פסקה של שתי מילים לא נקשרת; כשאין "מילה יתומה" — שורות זהות פרט ל-NBSP בזוג האחרון.

**כותרות רב-שורתיות:** `text-wrap: balance` ב-CSS לכל `.title-level-*`, `.h3-title-text`, `.h2-siman-badge` (מאזן אורך שורות מבלי לשנות מספרן, ולכן גם לא את חישובי הגובה). נתמך ב-Chromium 114+. `[לא-מאומת]` בדפדפן.

#### 2.5.4 מטריצה: איזו הגנה מוחלת אחרי איזה שלב

זו התשובה לדרישה "החלת כל הגנה אחרי כל שינוי". ✔ = מוחל ונבדק לוגית; ◐ = מוחל חלקית; ✘ = אינו מוחל (פער ידוע).

| שלב / שינוי בטקסט או בפריסה | שורה "ראשונה" בודדת | שורה "אחרונה" בודדת | כותרת יתומה | מילה בודדת | שלמות הערה |
|---|---|---|---|---|---|
| S1 מדידת `bestFitLine` | — | — | — | ✔ (קשירה בקלט המדידה) | — |
| S2 התאמת חיתוך להערות | ✔ (נבדק מחדש) | ✔ | — | — | ✔ |
| S3 החלת כללי שורות | ✔ | ✔ | ✔ (נסיגה אחרי הסרת פסקה) | — | ✔ (לולאת ייצוב) |
| S4 יציאה מהלולאה (טור מלא) | — | — | ✔ (post-loop) | — | — |
| S5 מדידה מחדש ב-`balanceColumns` | ✔ (סימון + רשת ביטחון) | ✔ | ✔ | ✔ (נמדד מחדש עם קשירה) | ✔ (קשירה בקלט) |
| S6 גדילת שטח הערות אחרי הצבת פסקאות קודמות | ✘ | ✘ | ✘ | — | — |
| S7 `justifyColumnVertically` | לא משנה שורות | לא משנה שורות | לא משנה | לא משנה | — |
| S8 התאמת עיטורים (`fitOneHeadingOrnament`, `fitSideOrnamentsToText`) | — | — | ◐ (מתבצע לפני חישוב הגובה, לא ידוע אם כיסה את כל המקרים) | — | — |
| S9 הדפסה/זום (`transform`) | אינו משפיע על layout | | | | |

**הפער S6:** `getFootnotesReservedHeight()` גדל ככל שנוספות הערות לעמוד. תוכן שהוצב קודם נמדד מול שטח קטן יותר. תיקון קיים רק דרך `balanceColumns` (חריגה → איזון מחדש); אם גם הפיצול הטוב ביותר חורג, החריגה נשארת (קנס, לא איסור) ואין דחיית שורות אחרונות לעמוד הבא. `[קריאת-קוד]`.

### 2.6 כותרות צד והערות שוליים-צד (Marginalia)

**מקור:** כותרת 7 ב-`mode-h7 === 'side_note'` → `pendingSideNote` → נצמדת לפסקה הבאה כ-`sideNote` (או `data-side-note` בפסקה המרונדרת).

**מיקום:**

1. אחרי הצבת פסקה: נוצר `div.side-note-anchor` בעמודת השוליים של אותו טור (`rMargin`/`lMargin`) ונרשם ב-`pagePendingNotes` יחד עם `pElem`.
2. בסוף בלוק: `finalizeNotePositions(notesList, columnBoundaryHeight)` — `columnBoundaryHeight = max(rCol.scrollHeight, lCol.scrollHeight)`:
   - מקבץ לפי עמודת השוליים (`item.elem.parentElement`), ממיין לפי `pElem.offsetTop`.
   - `top = pElem.offsetTop` (מיושר לשורה הראשונה של הפסקה).
   - אם `top + noteHeight > columnBoundaryHeight` (ההערה חורגת מתחתית הבלוק): `raisedTop = boundary − noteHeight`. אם `raisedTop ≥ minTop` (תחתית ההערה הקודמת + 6px, או 0) — מרימים. אחרת, אם לפסקה יש המשך (`p[data-token-id="…"][data-is-cont="true"]`) — מעבירים את ההערה לעמודת השוליים של ההמשך ומיישרים לשורתו (אם אין התנגשות).
   - `style.top = …px` (מיקום אבסולוטי בתוך עמודת השוליים).

**שלושה סיכונים שזוהו `[קריאת-קוד]`, לא תוקנו:**

1. **חפיפת הערות צד:** כשההערה גבוהה מהמרחק עד עוגן ההערה הבאה והיא עדיין בתוך גבולות הבלוק, אין דחיית ההערה הבאה כלפי מטה. `minTop` משמש רק בענף ההרמה.
2. **הפניות מיושנות אחרי איזון:** `balanceColumns` מרוקן את השוליים ובונה הערות חדשות (`finalNotes`), אך הקורא ממשיך לקרוא ל-`finalizeNotePositions(pagePendingNotes, …)` עם האלמנטים הישנים (מנותקים מה-DOM). בפועל לא מזיק כי אלמנט מנותק מחזיר `offsetTop = 0` ו-`offsetHeight = 0` ולכן אף תנאי לא מתקיים. תלוי באופן עקיף בהתנהגות DOM.
3. **כותרות 7 רצופות:** דריסה (ראה 2.1).

### 2.7 הערות שוליים בתחתית העמוד (Footnotes)

**סימון:** סוגרי הערה ניתנים להגדרה (`fn-delim-open/close`, ברירת מחדל `[` `]`). `findDelimiterMatches(text,'body')` מחזיר `{start,end}` להערות בטקסט.

**מבני נתונים:** `footnoteQueueForPage` (תור הערות לעמוד), `endnoteQueueForPart` (הערות סיום לחלק), `noteCounters {footnote,endnote}`, `noteUidCounter`; `getNoteConfig(styleId)`; `buildNoteBlockElement(queue, cols)`; `measureNoteBlockHeight(queue, cols)`; `flushFootnotesInto(pageEl)`; `flushEndnotesForPart(...)`.

**שימור מקום (קריטי לתקציב):**

```
reserve(queue, cols) = measureNoteBlockHeight(queue, cols) + 24 + (יש כותרת בלוק הערות ? 24 : 0)
cols = fn-columns (אם הוגדר) || cfg.columns || 1
```

בעת בדיקת `bestFitLine`, לכל מספר שורות `i` נבדק אילו הערות נכללות בטקסט שנבדק (`pendingFnMatches` עם `end ≤ testText.length`). כשמספרן משתנה, `cachedAvailH = remPageHeight − reserve(queue ∪ הערות חדשות)`; ההערות החדשות מדומות עם מספר מקום-שמור `א`.

**שגיאה שתוקנה בסוף השיחה (F-17):** שתי הנוסחאות היו שונות. הפרוב השמיט את גובה כותרת הבלוק (24px) ולא קרא את `fn-columns`. תוצאה: שורות עם הערה חדשה נמדדו מול שטח שמור קטן ב-24px ממה שהוחל בפועל. כעת שני המקומות קוראים ל-`footnoteReserveFor` / `getFootnoteColCount`. `[מאומת-בדיקה]` (4 בדיקות) על הנוסחה; ההשפעה על עימוד אמיתי `[לא-מאומת]`.

**הגנה אטומית:** תוכן הערה שווה "מילה" אחת במדידה (`\uE000`), ולכן לא נשבר בין שורות. מכאן ש-`adjustFitLineForNoteSpans` הוא **הגנה מונעת בלבד**: חיתוך בין שורות שנמדדו לא יכול לפול בתוך הערה (ראה F-12).

**הערות סיום:** שורות עם קידומת `en-line-prefix` נאספות ב-`endnoteQueueForPart` ומועברות ל-`flushEndnotesForPart` בסוף חלק; הרשימה מעומדת בעמודים לפי אותו עקרון של probe (`buildNoteBlockElement(remaining.slice(0, i+1))`).

**לא נסקר לעומק:** פורמט המספור בפועל (גימטריה / ספרות / גרש / כוכביות), `note-marker-type`, סגנונות קו מפריד, קו מפריד ועיטורי צד של בלוק ההערות (`renderSideOrnamentHTML` בהקשר `note`), גופן גוף ההערה (`f-note-body`, `s-note-body`, מחלקה `.note-body-text`). קיימים בקוד.

### 2.8 גלישת טקסט בין הטורים ולאזור ההערות (Overflow handling)

**עובדה מבנית חשובה:** `.a4-page` מוגדר `overflow:hidden; max-height:297mm`. חריגה אינה מייצרת פס גלילה והתראה; **היא נחתכת חזותית או נחפפת עם אלמנטים אחרים** (מספר עמוד, הערות). לכן חריגה היא באג עימוד שקט.

**שכבות הגנה:**

| שכבה | מנגנון |
|---|---|
| תקציב | `remPageHeight`, `getFootnotesReservedHeight()` |
| מילוי | `targetCol.scrollHeight ≥ currentAvailH − 10` עוצר; `bestFitLine` מגדיל שורה-שורה עד חריגה |
| אחרי בלוק | `actualAvailH` מול `rCol.scrollHeight` → `balanceColumns` (קנס ×2000) |
| כותרת רחבה | `spanHeight > remPageHeight − getFootnotesReservedHeight()` → הסרה ועמוד חדש |
| אין התקדמות | נסיגה של כותרות, עמוד חדש |
| אין פתרון | חריגה מתקבלת (קנס אינו איסור). אין אכיפה קשיחה של "אף פיקסל לא חורג". |

**חריגה בגלל אלמנט שנוסף אחרי המדידה** (למשל עיטור שהוגדל): ראה 2.11 ו-F-08.

### 2.9 איזון סוף פרק (Chapter balancing)

- בסוף מקטע (`tokenIndex >= secTokens.length && !pendingWordTokens`) מופעל `balanceColumns` **תמיד**, ואחריו נוסף מפריד סוף פרק (`getSectionDividerHTML`) אם הוגדר.
- הגדרת `balance-chapter-end` (כן/לא) הייתה **מנותקת**: לא נקראה בשום מקום (F-19). בשושלת L-B חוברה אליה הלוגיקה (המשתמש לא חייב איזון אסתטי, אך איזון **מבני** — טור ריק — נאכף תמיד). בגרסת combined האיזון נעשה תמיד לפי תנאי מדידה, ולכן הבקרה הוסרה מהממשק והוחלפה בהערת הסבר.
- **גודל מפריד:** היה מוחל רק על `custom_img`; SVG הוגבל ב-CSS (`max-height:32px`). תוקן: העטיפה מקבלת את מידות תיבת ה-dim והתוכן ממלא אותה.


### 2.10 מספור עמודים

`formatPageNumberDisplay(pNum)` היא נקודת העיצוב היחידה (משמשת עמודי תוכן ושערים). קריאות הגדרות ב-DOM בכל קריאה:

```
effectiveNum = pNum − startIdx + initialValue        // מוצג רק אם pNum ≥ startIdx וגם position ≠ none
format: gematria | page_gematria ("דף " + גימטריה) | numeric
frame:  none | …  → <span class="page-num-badge page-num-frame-{frame}">
החזרה: { displayPageNum, framedPageNum, pageNumPos }
```

הגדרות: `page-num-position`, `page-num-format`, `page-num-frame`, `page-num-start-idx`, `page-num-initial-value` (ערך התחלתי שמוצג בעמוד הראשון שמספרו מוצג).

**מספור שערים:** לכל שער (ראשי / משנה / אחורי) שתי הגדרות נפרדות: `*-shaar-count-numbering` (האם השער נספר ב-`pageIndex`) ו-`*-shaar-show-number` (האם מודפס עליו מספר). הנתון נצרך ב-`typesetter.js` (ראשי, משנה) וב-`decorations.js` (אחורי, רינדור כותרת תחתונה).

**לא נסקר ב-combined:** האם עמודי תוכן עניינים משתמשים ב-`formatPageNumberDisplay` או בקריאת גימטריה נפרדת (בשושלת L-B היו קריאות נפרדות).

**`ensureOddPageStart`:** כשמקטע מחייב פתיחה בעמוד אי-זוגי והעמוד הבא זוגי, מוסף עמוד ריק ו-`pageIndex` מתקדם. `[קריאת-קוד]`.

### 2.11 עיטורים: כותרות, צד, מפרידים

**נתונים:** `ORNAMENTS_UD` (למעלה/למטה), `ORNAMENTS_LR` (צדדי), `HEADER_ORNAMENTS`, `SECTION_DIVIDERS`, `EXTERNAL_ALL_ORNAMENTS`. פריט: `{id, name, svg}`. בחירה בממשק דרך `<select>` ו"בוחרי כרטיסים" (`initVisualPickers`).

**מבנה עיטורי כותרת 2 (עמוד פתיחת פרק):**

| רכיב | הגדרה | DOM |
|---|---|---|
| עיטור עליון/תחתון לסימן | סגנון עליון ותחתון | `div.h2-ornament-top|bottom` מעל/מתחת ל-`.h2-siman-badge`; אם אין סימן — מעל/מתחת לכותרת |
| עיטור עצמאי לכותרת | `h2-title-orn-mode`: `none` / `top_bottom` / `side` | `top_bottom`: כמו לעיל. `side`: `div.block-h2-title-side` (flex) עם `.h2-title-ornament-right`, הכותרת, `.h2-title-ornament-left` |
| התאמה לרוחב טקסט | תיבת סימון → מחלקה `fit-heading-text` | רוחב העיטור = רוחב `getBoundingClientRect()` של האלמנט הצמוד, מוגבל ל-90% |
| מידות | `dim-h2-top-w/h`, `dim-h2-btm-w/h`, `dim-h2-title-side-w/h`, `dim-h3-side-w/h`, `dim-note-side-w/h`, `dim-secdiv-*` | המזהים נבנים דינמית (`prefix + '-w'`), ולכן בדיקת "מזהה לא מופיע בקוד" נותנת תוצאות שווא (ראה 2.16) |

**עיטורי צד (`renderSideOrnamentHTML(key, isLeft, context)`):** הקשר `h3` / `note` / `h2title`. מחזיר `span.side-ornament-wrap` עם `style` שנגזר מ-`dim-*-w/h`, ובתוכו SVG גולמי. ה-wrapper הוא `inline-flex`.

**בעיית תזמון (F-08, תוקנה ב-combined):** התאמת רוחב/גובה העיטור לטקסט רצה כפוסט-פרוסס אחד בסוף העימוד (`applyHeadingOrnamentTextFit`, נקרא מ-`typesetter.js` בסיום). אבל גובה העיטור נקרא קודם:
- `used += el.offsetHeight (+ margins)` בפתיחת עמוד כותרת 2,
- `spanHeight = spanBlock.offsetHeight + 4` בכותרת 3.

לכן התקצוב התבסס על מידת העיטור הלא-מותאמת. תיקון: `fitOneHeadingOrnament(ornWrap, isTop)` ו-`fitSideOrnamentsToText(wrap)` רצות **מיד** אחרי ההכנסה ל-DOM ולפני אותן מדידות (6 אתרי קריאה). הפוסט-פרוסס נשאר כרשת ביטחון אידמפוטנטית. `[לא-מאומת]` בדפדפן; המשתמש דיווח שבשושלת L-B, אחרי גרסה שכללה רק את הפוסט-פרוסס, הבעיה לא נפתרה כלל.

**ממצאי CSS:**

| ממצא | פעולה |
|---|---|
| ב-flex-column שוליים אינם מתמוטטים; שוליים עליונים/תחתונים של עיטור תחתון יצרו אי-סימטריה בין עיטור עליון לתחתון | `margin-top:0` לעיטור התחתון כשלכותרת אין שוליים תחתונים |
| `.h2-ornament-top svg` וכו' ללא תקרה → עיטורים ענקיים בכותרות עליונות | `max-height:20px` ב-`.header-col svg/img` |
| ב-combined: `height:0.95em !important` על `.h3-ornament-* svg` ו-`height:1em !important; max-height:1.1em !important` על העטיפה | **הגדרת `dim-h3-side-h` מתה לחלוטין** (רק הרוחב השפיע, ובעקיפין). הוסרו; כעת `width/height:100%` על ה-SVG בתוך עטיפה שמידותיה מההגדרות |
| ב-L-B אין כלל CSS ל-`.side-ornament-wrap svg` בכלל | המנגנון שגרם ל"רוחב משנה את שני הממדים והגובה לא משפיע" **לא הוסבר** (F-09) |
| h3: `margin-top:-0.08em` לעיטורי צד | הרמה אופטית קלה (עיטורים נראו נמוכים) |

### 2.12 כותרות עליונות (Running headers)

`createPageLayout` בונה שורת כותרת עם שלושה אזורים: ימין (`r`), מרכז (`c`), שמאל (`l`). לכל אזור: סוג (`hdr-type-*`), יישור (`hdr-align-*`), רוחב (`hdr-w-*`), גופן וגודל. `renderHeaderSectionHTML(type, customText, h1, h2, h3, bookTitle, tocFallback, extra)` מחזיר את התוכן: כותרת 1 / 2 / 2 עם סימן / 2 בלי סימן / כותרת 4 / שם ספר / מספר עמוד / טקסט חופשי / מילה ראשונה-אחרונה (`firstLastWords`) וכו'.

**מנגנונים:**

| מנגנון | פירוט |
|---|---|
| מתחלפות (`hdr-alternating`) | בעמוד זוגי מתחלף תוכן ימין/שמאל, **כולל גופן וגודל** (בלי זה הגופן נשאר בצד הלא נכון). היישור לא מוחלף אלא נגזר מהמקום הפיזי (ראה הבא). |
| יישור סמנטי | `resolveHeaderAlign(align, slot)`: `outer` → `right` באזור `r` ו-`left` באזור `l`; `inner` הפוך; `right/left/center` ללא שינוי. מחליף ניסיון קודם להחליף ערכי יישור, שגרם לשבירת היישור אחרי כל חילוף. |
| פיצול שם ספר (`hdr-title-split`) | מחצית ראשונה בצד אחד, שנייה בצד שני. `splitTextInHalf`: `mid = ceil(n/2)`; מילה אחת → רק החצי הראשון. |
| הדדיות | `hdr-alternating` ⊕ `hdr-title-split` (בחירה באחד מכבה את השני). `hdr-distinct-even-odd` (הגדרות עצמאיות לעמוד זוגי, `hdr-verso-container`) מכבה את `hdr-alternating`. |
| קו מפריד | `hdr-divider-style` + משתנה `--hdr-divider-color`. |

**באג שנפתר (F-05):** כותרת "מרכז" הוצגה בימין. הסיבה: `.header-col-c` הוא `display:flex`, ו-`text-align` אינו חל על flex items. תיקון: `justify-content` לצד `text-align`.

### 2.13 שערים, נכסי JSON ושמירת מיקום תיבת טקסט

**סוגי שער:** `main`, `sub`, `back`. מקורות: מובנים (`BUILTIN_SHAAR_THEMES`) או JSON חיצוני `{id, name, svg[, box:{top,bottom,right,left}]}`; בגרסת combined גם מדיה לא-SVG (`wrapShaarMedia`) וטעינת תיקיית נכסים (`triggerAssetsFolderPick`, `handleAssetsFolderSelected`; לפי הדוח: `assets_manifest.json` ו-`webkitdirectory`) — לא נסקר לעומק.

**מיקום תיבת הטקסט:** `resolveShaarBoxStyle(type, id, …)` — סדר קדימויות:

1. שדה `box` שהוטמע בפריט ה-JSON,
2. מיקום שמור בסשן: `shaarBoxSavedPositions[type][shaarId]`,
3. ברירת מחדל.

גרירה/שינוי גודל (`initShaarBoxResizer`) שומרים **לפי מזהה שער** ולא לפי סוג (בגרסה מוקדמת הוחל מיקום אחד על כל השערים מהסוג). `loadedShaarItems` עוקב אחרי הפריטים שנטענו, ו-`exportShaarJSONWithPositions(typeKey)` מייצר קובץ JSON להורדה עם `box` מוטמע, להחלפת הקובץ המקורי (כך המיקום שורד טעינה מחדש). `[לא-מאומת]` בדפדפן.

**כלי האריזה (נפרד):** ממיר קובצי SVG בשם `N שם.svg` לקבוצות לפי המספר המוביל. נתגלה בבדיקת regex ב-Node: חילוץ ה-`id` מחליף תווים שאינם ASCII ב-`_`, ולכן "שער ראשי" ו"שער משנה" מקבלים אותו מזהה → אפשרות להתנגשות. **לא הוכח** שזו הסיבה לדיווח "ערכת JSON מאוחדת טוענת רק שער ראשי" (F-10).

### 2.14 גופנים

| מקור | טעינה |
|---|---|
| מובנים | `@import` Google Fonts בראש `style.css`. הדפדפן טוען גופן רק כשטקסט משתמש בו. |
| חיצוניים | `loadExternalFonts()` קורא `fonts/fonts.json`, יוצר `FontFace` ומחכה ל-`.load()`. |
| מערכת | `loadSystemFonts()` — `window.queryLocalFonts()` (Chromium, דורש אישור משתמש). |

**בעיית תזמון (F-08, שערכה השפעה אפשרית על העימוד הראשון):** העימוד הראשון רץ לפני שהגופנים המובנים נטענו, ולכן נמדד עם גופן חלופי (מדדים שונים). `ensureBuiltinFontsLoaded()` קוראת `document.fonts.load('{weight} 1em "{family}"')` ל-6 משפחות × 3 משקלים ואז `await document.fonts.ready`, ב-`window.onload` לפני `typesetDocument()`. `[לא-מאומת]` כגורם לבעיית עמוד הפתיחה; המשתמש דיווח שהבעיה נשארה, כך שאין ראיה שזה הגורם (או היחיד).

**תקלה שנפתרה (F-14):** `loadSystemFonts` ביצע `select.innerHTML = ''` ומחק גופנים שכבר נבחרו. הוחלף בהוספה בלבד (append-only) ושחזור `select.value`.

**סיכון מבני:** עימוד תלוי בגופנים שקיימים אצל המשתמש (גופני מערכת). מסמך שעומד במחשב אחד ומודפס באחר ישתנה.

**"היררכיית טעינה דו-שלבית"** (דרישה ב-`CLAUDE.md`): הסדר בפועל ב-`window.onload` הוא `loadExternalJSONAssets` ← `loadFolderAssetsAndThemes` ← `loadExternalFonts` ← `ensureBuiltinFontsLoaded` ← `typesetDocument()`; גופני מערכת נטענים לפי דרישה. לא ניתן לאמת מהשיחה מהי ההגדרה המדויקת של "דו-שלבית" שהתכוון אליה המשתמש; יש לברר לפני שינוי סדר הטעינה.

### 2.15 ממשק, ביצועים, עורך וזום

**הפעלת עימוד.** המצב ההתחלתי: כל אחת מ-~204 בקרות הפעילה `typesetDocument()` ב-`oninput`/`onchange`, כך ש-12–20 הקלדות מקפיאות את הדף. הוסרו כולן (F-06). נשארו קריאות עקיפות מפעולות בדידות (`onH2OrnamentSetChange`, `onH3OrnamentSetChange`, `selectVisualPickerItem`, `onHdrDistinctToggle`, ייבוא קבצים, העלאת תמונות — 16 אתרי קריאה בסך הכל). ב-combined נוסף debounce של 400ms ב-`typesetDocument`.

**עורך וסנכרון:**

| שושלת | מימוש |
|---|---|
| L-A | `<textarea>` + שכבת סימוני מעבר עמוד (`overlay`) + אלמנט מראה (mirror) למדידת שורות חזותיות (`measureLineTopOffsets`); גלילה לטקסט בלחיצה על עמוד (`lineToTokenMap`/`tokenLineIndex`); זום (`applyPageZoom`) בעזרת `.page-zoom-wrap` לכל עמוד + `transform:scale`; איחוד רענונים ב-`requestAnimationFrame` |
| L-B / combined | עורך `contenteditable` עם `.page-break-divider`, `updateEditorWithPageBreaks`; זום דרך משתנה `--preview-scale` ו-`updatePreviewScale` |

**ביצועים:** `balanceColumns` מרנדר ומודד כל מועמד פיצול (מספרם ≈ מספר שורות הבלוק) עם reflow כפוי לכל אחד; אין מטמון. אין נתוני פרופיילינג, לכן אין הוכחה שזה צוואר בקבוק `[לא-מאומת]`.

### 2.16 שיטת בדיקה

| בדיקה | מה בודקת | מגבלה |
|---|---|---|
| `node --check` לכל קובץ JS | תחביר | לא תופס שגיאות זמן ריצה (למשל TDZ — נבדק ידנית בנקודות המשונות) |
| מפרש HTML (`html.parser`) | קינון תגים | |
| ספירת `{`/`}` ב-CSS | איזון | |
| הצלבת `on*="fn("` ↔ `function fn(` | handlers חסרים | |
| הצלבת `getElementById('x')` ↔ `id="x"` | מזהים חסרים ב-HTML | בגרסה הסופית: תוצאה אחת (`ext-imports-data`, נוצר דינמית) |
| הצלבה הפוכה: `id` ב-HTML שאינו מופיע כמחרוזת ב-JS | בקרות "מתות" פוטנציאליות | ~87 מועמדים; כמעט כולם מזהים שנבנים דינמית (`prefix + '-w'`, `cbg-*`, `s-dtoc-N`) או אלמנטי מבנה. **לא אותרה בשיטה זו אף בקרה מתה ודאית**; `balance-chapter-end` התגלתה בחיפוש ידני (0 הפניות). |
| שליפת פונקציות ל-`vm` + mock DOM עם מודל layout חמדני דטרמיניסטי | לוגיקה של `getLinesFromParagraph`, `resolveParagraphCut`, עזרי כותרות, נוסחת הערות | מודל: 10px לתו, 5px לרווח, 20px לשורה; NBSP מחבר מילים ליחידה שאינה נשברת. אינו מייצג גופנים/justify אמיתיים. |
| שליפת הטוקנייזר לקובץ אמיתי | טוקנים/מקטעים/הערות | |
| jsdom | נכשל להרצת מנוע העימוד (F-03) | אין layout |


---

## 3. יומן כישלונות, טעויות וניסיונות שנפסלו

הערות על המקורות: ערכים F-01…F-07, F-10, F-13, F-14, F-19 אומתו מול התמליל המלא של השיחה (`/mnt/transcripts/2026-10-18-23-32-51-hebrew-typesetting-engine.txt`, מספרי שורה מצוינים). ערכים F-08, F-09, F-11, F-12, F-15–F-18, F-20 מקורם בחלק מאוחר יותר של השיחה (אחרי דחיסת ההקשר) ואומתו מול ההקשר הגלוי. פירוטי "חשיבה" פנימיים אינם שמורים בתמליל (רק סיכומי נושא), ולכן נימוקים שלא נשמרו מסומנים.

"תור N" = אינדקס מקטע בתמליל המלא (מתחיל מ-0; הודעות המשתמש באינדקסים זוגיים). "שורה N" = מספר שורה בקובץ התמליל.

### F-01 — עורך עם סימוני מעבר עמוד: סימון בתוך ה-HTML של המראה (L-A)

| שדה | תוכן |
|---|---|
| הגישה הראשונית | לבנות את סימוני מעבר העמוד (קו אדום + מספר) ישירות בתוך מבנה ה-HTML של שכבת מראה (mirror) לתיבת הטקסט. |
| כשל | נזנח כבר בשלב התכנון, לפני יישום. סיכום החשיבה בתמליל (שורות 1409–1424): "Building marker text directly into the mirrored HTML structure" ← "Switching to a hidden mirror purely for measuring line positions". הנימוק המלא לא נשמר. הנימוק הסביר (השערה שלי, לא מאומתת מהתמליל): תוכן חוסם שמוכנס למראה מזיז את שאר השורות ביחס ל-`<textarea>` השקוף שמעליו, ויוצר אי-יישור. |
| מסקנה | המראה משמש למדידת מיקום שורות בלבד (`measureLineTopOffsets`); הסימונים הם שכבת overlay נפרדת (`#raw-input-page-markers`) שממוקמת לפי הפיקסלים שנמדדו, ואינה משפיעה על התנהגות התיבה (העתקה לא כוללת אותם — דרישת המשתמש). |

### F-02 — העתקת סגנונות למראה דרך `getComputedStyle(...).cssText`

| שדה | תוכן |
|---|---|
| הגישה | להעתיק למראה את כל הסגנונות המחושבים של ה-`<textarea>` במחרוזת אחת: `mirror.style.cssText = getComputedStyle(textarea).cssText`. |
| כשל | בבדיקת jsdom: `cssText length: 0` (שורות 5037–5052). חיפוש רשת ("getComputedStyle cssText returns empty string Chrome") אישר שגם Chromium המודרני מחזיר מחרוזת ריקה לאובייקט סגנון מחושב (שורות 5107–5315: באג Chromium 805882, דיון CSSWG). |
| איך הוכח | הרצה בפועל + חיפוש חיצוני. |
| מסקנה / אסור לחזור | אין להסתמך על `cssText` של סגנון מחושב. רשימה מפורשת של מאפיינים (כולל `border-style` וגודלי border, שהושמטו בתחילה: "Ensuring border-style is copied for mirror layout accuracy", שורה 2767) — שורות 5462–5504. |

### F-03 — הרצת מנוע העימוד המלא ב-jsdom ("תריץ את התוכנה ממש")

| שדה | תוכן |
|---|---|
| הגישה | המשתמש ביקש (תור 10): "תריץ אתה את התוכנה ממש, ותבדוק את הבעיות". ניסיון: טעינת הקבצים ב-jsdom וקריאה ל-`window.onload`/`typesetDocument()`. |
| כשל | `exit code 134`, `JavaScript heap out of memory` (~2GB) (שורות 4869, 4954). |
| איך הוכח שהבעיה אינה בעריכות | הרצה זהה על **הקבצים המקוריים ללא שינוי** (שורות 4923–4969): אותה קריסה. |
| מנגנון (השערה סבירה, לא נבדקה ישירות) | לולאות העימוד מתקדמות לפי `scrollHeight`/`offsetHeight`; ב-jsdom הערכים 0, ולכן תנאי העצירה (גובה מלא) לעולם לא מתקיימים. |
| מסקנה / אסור לחזור | אין אפשרות להריץ את המנוע בלי layout אמיתי. כל בדיקה שאינה בדפדפן חייבת לשלוף פונקציות בודדות ולספק להן מודל layout מדומה (סעיף 2.16). **המשתמש לא קיבל "הרצה אמיתית"**; נאמר לו במפורש שהניתוחים מבוססי קריאת קוד. |

### F-04 — קריסה בסוף בדיקת ה-jsdom הממוקדת (L-A)

| שדה | תוכן |
|---|---|
| הגישה | בדיקה ממוקדת לפונקציות L-A החדשות (`toggleSettingsPanel`, `applyPageZoom`, `measureLineTopOffsets`, `scrollTextareaToPage`, `handleTextFileImport`). |
| כשל | כל הבדיקות עברו חוץ מאחת, ואז `returncode 134` (שורה 5709). הבדיקה שנכשלה: "line 3 offset is below line 0 offset" (`offsets {"0":0,"3":0}`) — צפוי ב-jsdom כי אין layout. |
| אבחון | חשד ל-timers/`requestAnimationFrame` של jsdom ול-`FileReader`. בדיקת `FileReader` מבודדת הצליחה ("loaded: hello world", שורה 5802). |
| מסקנה | שויכה ל"ארטיפקט של `pretendToBeVisual`" (שורה 5867), **ללא הוכחה ישירה**. לא להפעיל `pretendToBeVisual` כשאין צורך. הכשל בבדיקת המיקום נחשב מגבלת סביבה, לא באג. |

### F-05 — כותרת עליונה "מרכז" מוצגת בימין; כותרות מתחלפות מאבדות יישור

| שדה | תוכן |
|---|---|
| תסמין (המשתמש, תור 10) | כותרת ימנית עם יישור "ימין" שעברה לשמאל בעמוד זוגי נשארת מיושרת ימינה; כותרת אמצעית ממורכזת מוצגת בימין. |
| אבחון מאומת (תמליל, תגובת העוזר לתור 12) | `.header-col-c` הוא `display:flex`; `text-align` אינו חל על flex items (הם עוקבים אחרי `justify-content`, ברירת מחדל flex-start = ימין ב-RTL). בנפרד: הקוד החליף גם את הערך המוחלט של היישור (ימין/שמאל) בין העמודות בעמוד זוגי, ולכן כותרת "ימין" שעברה לשמאל נשארה מיושרת ימינה. |
| תיקון | `justify-content` לצד `text-align`; `resolveHeaderAlign(align, slot)` עם `outer`/`inner` סמנטיים (סעיף 2.12). |
| מסקנה | יישור בכותרות מתחלפות חייב להיגזר מהמקום הפיזי של העמודה, לא להתחלף יחד עם התוכן. כשגופן/גודל לא הוחלפו יחד עם התוכן, הם נשארו בצד הלא נכון (תוקן באותה עבודה). |

### F-06 — הסרת הפעלת עימוד אוטומטית מכל בקרה

| שדה | תוכן |
|---|---|
| תסמין | "שינוי נקודה אחת בגופן גוף הטקסט מעמד את כל המסמך מחדש והדף נתקע". |
| אבחון | 191+ (בדיווח הסופי: 204) בקרות עם `oninput`/`onchange="typesetDocument()"`. |
| ניסיון ראשון | הסרה בעזרת regex גורף. **החמיץ** handler אחד רב-שורתי (רווח לפני גרש הסוגר) — נמצא בסריקה שנייה (שורה 760 בקובץ אז). |
| כשל שני | כל הפעלות העימוד העקיפות מתוך פונקציות אחרות לא הוסרו. התגלה מאוחר יותר (תמליל שורה 25056: "this function still calls typesetDocument() internally, meaning my earlier bulk-fix … missed indirect triggers"). נשארו בכוונה כפעולות בדידות (בחירת ערכת עיטור, ייבוא קבצים וכו'). |
| מסקנה | לחפש גם `typesetDocument()` בתוך גופי פונקציות, לא רק ב-attributes. ב-combined: debounce של 400ms כרשת ביטחון, כולל השלכה על כפתור העדכון (מתעכב 400ms). |

### F-07 — יישור טורים בסוף פרק ולפני כותרת 3: שלוש אבחנות עוקבות

| שלב | אבחנה / תיקון | תוצאה |
|---|---|---|
| 1 | חשוד: הפרשי גובה קטנים בנקודות מעבר. הוספת `justifyColumnVertically` בסוף פרק ולפני כותרת רחבה. | תור 28 (המשתמש, עם תמונות): "לא עבד. אני לא מדבר על הבדלי גובה קלים — מקומות שהפרק מסתיים רק עם טור אחד". |
| 2 | אבחון (שורות 2037–2048 של הקובץ אז): כותרת `span_1col` שמופיעה באמצע מילוי הטור הימני עוצרת אותו (נכון), אך הטור השמאלי נתקל באותו טוקן מיד ונעצר ללא תוכן → טור שמאלי ריק. תיקון: `forceBalance` כשטור ריק וקיים תוכן בשני, בלי תלות בתג `balance-chapter-end`. (הודעת הסטטוס אמרה במפורש: "אני לא יכול להריץ דפדפן אמיתי… אבחנה מבוססת קריאת קוד".) | תור 30: "לא מצאתי מקרה שכותרת 3 התחילה באמצע עמוד וטקסט שלפניה היה בטור אחד" — `[מאומת-משתמש]` שמקרה הטור הריק נפתר. |
| 3 | נשאר: חלוקה לא שווה בטקסט שלפני כותרת 3, כותרת 3 נדחית לעמוד הבא. התוכנית שלי: להרחיב את תנאי האיזון. | **לא יושם.** המשתמש (תור 32) כתב: "מצאתי את כל הבעיות שגרמו לחוסר ישור ותיקנתי את הקובץ", והעלה `typesetter.js` מתוקן (לפי תגובת העוזר, תור 35: "חישוב הגובה הפנוי בפועל אחרי שכל ההערות בעמוד ידועות" היה "בדיוק מה שחסר"). בקוד הסופי קיימים גם מדידת סימוני הערות בניסוי בתוך `balanceColumns` (`applyDelimiterStyles(…, true)`) והסרת רווח לפני סוגר פותח של הערה; מהתמליל לא ניתן לאמת שהם חלק מאותו תיקון. תור 44: "בדקתי את היישור והכל נראה מעולה". |

מסקנה: שורש הבעיה לא היה במנגנון האיזון אלא בנתוני הקלט שלו (תקציב גובה שלא כלל הערות; מדידה לא נאמנה). שתי האבחנות הראשונות שלי טיפלו בתסמינים.

### F-08 — עמוד פתיחת כותרת 2: שיעור עמוד קצר מדי / ארוך מדי / "מסתדר אחרי הוספה והסרה של עיטור"

תסמין (המשתמש, תור 44, עם 3 צילומים): (1) לפני עיטורים — העמוד מסתיים במרחק גדול מדי מהתחתית; (2) אחרי הוספת עיטורים — העמוד ארוך מדי וגולש לאזור מספר העמוד; (3) אחרי הסרת עיטור — העמוד תקין. השערת המשתמש: העיטורים מוסיפים גובה שאינו מחושב, וגובה עיטור צדי בכותרת 3 אינו מותאם אוטומטית לטקסט.

| # | השערה | כיצד נבדקה / נפסלה | סטטוס |
|---|---|---|---|
| H1 | שוליים `prop-mt-h2` על `.page-body-flow` של עמוד כותרת 2 מקטינים את הגובה הזמין, בנוסף ל-`h2-top-distance` (spacer יחסי) הנכון. | נקראו שתי ההגדרות; הוסר ה-margin (תמליל תור 17: "Found the exact cause"). | **לא היה (או לא רק) השורש**: הבעיה דווחה שוב (תור 44) ושוב בסוף השיחה: "לא נפתרה בכלל". |
| H2 | העימוד הראשון רץ לפני טעינת הגופנים (מדידה עם גופן חלופי) — מסביר "קצר" בעימוד הראשון ו"מתיישר" בעימודים הבאים. | `ensureBuiltinFontsLoaded()`. | `[לא-מאומת]`; המשתמש דיווח שהבעיה נשארה. מנגנון סביר, אך אין ראיה. |
| H3 | `totalFlowH` נמדד לפני שסימן ועיטורים מוכנסים ולכן הם "לא מתוקצבים". | נקרא קוד: `used` מסכם `offsetHeight`+שוליים של כל רכיבי הכותרת **אחרי** הכנסתם, ו-`.page-body-flow` הוא `flex-grow:1` ולכן `clientHeight` אינו תלוי בתוכן. | **נפסלה** (השערה שגויה שאבחנתי תחילה כשורש הבעיה). |
| H4 | התאמת עיטור לטקסט (רוחב / תקרת גובה) רצה כפוסט-פרוסס בסוף העימוד, אחרי ש-`used`/`spanHeight` כבר נמדדו מהגודל הלא-מותאם. | נקרא סדר ההרצה. תיקון: `fitOneHeadingOrnament` / `fitSideOrnamentsToText` מיד אחרי ההכנסה. | `[לא-מאומת]` בדפדפן. תואם להשערת המשתמש. |
| H5 | גובה הסימון/ההכנסה של שורת הסימן (`.h2-siman-badge`) תלוי בגופן — לא נבדק. | — | פתוח. |

**תצפית שלא הוסברה:** "הוספה והסרה של עיטור מתקנות את הגובה". כל הוספה/הסרה מפעילה `typesetDocument()` עקיף (`onH2OrnamentSetChange`), כלומר עימוד חוזר כשהגופנים כבר נטענו — עולה בקנה אחד עם H2, אבל לא הוכח.

מסקנה: לא לקבוע "שורש" לפני שהדפדפן מאשר. ראה סעיף 6, צעד 1, למתכון אבחון (instrumentation).

### F-09 — גובה עיטור צדי: "הגדרת הגובה לא משפיעה, רק הרוחב משנה את שני הממדים"

| שדה | תוכן |
|---|---|
| תסמין (המשתמש, אחרי הגרסה שלי) | הגדרת הגובה של עיטור צדי (כותרת 3) אינה משפיעה; שינוי הרוחב משנה גם גובה וגם רוחב. בנוסף: התאמת הגובה לטקסט (תקרת הגובה שהוספתי) לא עבדה. |
| אבחון ב-L-B (בקוד שלי, לאחר שחזור) | ה-wrapper `span.side-ornament-wrap` מקבל `width/height/max-height` מההגדרות, אך לא נמצא שום כלל CSS שמכריח את ה-SVG שבתוכו למלא אותו. חיפשתי `.side-ornament-wrap` ב-CSS: אין. |
| אבחון ב-combined | כלל `.h3-ornament-right svg {height:0.95em !important; width:auto !important; …}` ועטיפה עם `height:1em !important; max-height:1.1em !important` — **גורמים לכך שההגדרה `dim-h3-side-h` מתה לחלוטין**. הוסרו; ה-SVG ממלא עכשיו את העטיפה. |
| השערה ל"הרוחב משנה את שניהם" | `object-fit: contain` מקטין את התוכן כשרוחב ה-wrapper קטן מרוחב ה-SVG ברוחב הטבעי; הגובה קבוע ע"י הכלל. עקבי עם התצפית. `[לא-מאומת]`; קבצי L-B אבדו באיפוס קונטיינר, ולכן לא נבדק ישירות. |
| מסקנה | כל ממד שנשלט ע"י משתמש צריך מקור אחד: אי-אפשר ש-CSS עם `!important` ו-inline style יתחרו עליו. |

### F-10 — "איחוד שערי JSON: בחירה בסט טוענת רק את השער הראשי"

| שדה | תוכן |
|---|---|
| עבודה | נבדקו: יצירת id, רישום (`registerExternalShaar`), `syncThemeToIndividualShaars`, חילוץ מספר ערכה מהשם (regex), ושלוש פונקציות הרינדור. סימולציה ב-Node עם שמות קבצים ריאליים של כלי האריזה (תמליל שורות 27478–27555). |
| ממצא | התנגשות id אמיתית: ה-`id` נגזר משם הקובץ ותווים שאינם ASCII הוחלפו ב-`_`, כך ששמות עבריים שונים מניבים אותו id. |
| תוצאה | בתמליל (שורת סיכום ב-[37]): "structurally consistent — I can't find a concrete bug in the current code without being able to actually run it". **לא שוחזר; פתוח.** |
| מידע חסר שהתבקש מהמשתמש | האם התפריט בכלל מציג את הערכה המאוחדת, או שהוא מוצג והשערים ריקים. |

### F-11 — הערכה ראשונית "הגנת יתומות/אלמנות וכותרות נראית תקינה"

| שדה | תוכן |
|---|---|
| הגישה | בתשובה לחשש המשתמש (תור 14) קראתי את הלוגיקה ב-3 המקומות. תמליל, תור 17: "בדקתי ולא מצאתי בעיה … נראה תקין ועקבי בכל 3 המקומות". |
| כשל | ביקורת עמוקה יותר (בקשת המשתמש: להחיל כל הגנה אחרי כל שלב) מצאה: (א) כותרת נשארת בתחתית הטור כשהפסקה שאחריה נדחית עקב כלל השורות (הנסיגה הייתה רק בענף `bestFitLine===0`); (ב) כללי "ראשונה"/"אחרונה" מתנגשים (פסקה של 3 שורות, 2 נכנסות: ביטול ה"אחרונה" מוריד ל-1 ומפר את ה"ראשונה", ואינו נבדק שוב); (ג) כותרת יכולה להישאר אחרון בטור כשהטור מלא ולא ניסו פסקה; (ד) אין שום הגנה על מילה בודדת. |
| איך נתגלה | מעבר שלב-שלב על המסלולים, לא בהרצה. |
| מסקנה | קריאת קוד של "אותה לוגיקה ב-3 מקומות" אינה מספיקה: נדרש לבדוק **אינטראקציה בין** הכללים. איחוד ב-`resolveParagraphCut` + בדיקות על טבלת אמת. |

### F-12 — ההנחה ש-`adjustFitLineForNoteSpans` עלול לבטל את החלטות היתומה/אלמנה

| שדה | תוכן |
|---|---|
| ההנחה | הפונקציה רצה אחרי כללי השורות ויכולה להזיז את נקודת החיתוך (למעלה או למטה), ולכן "מבטלת" אותם; יש להפעיל את הכללים שוב אחריה. |
| בדיקה | הוטמע שילוב בלולאת ייצוב (`resolveParagraphCut`). בדיקת יחידה על שורות סינתטיות עם הערה החוצה שורות: עברה. |
| ביקורת עצמית (בשלב התיעוד) | במדידה האמיתית תוכן הערה הוא "מילה" אחת (`\uE000`), ולכן שורות מדודות לעולם אינן חוצות הערה. הפונקציה היא הגנה מונעת בלבד, וההנחה שהיא משנה חיתוך בפועל **לא הוכחה** על שורות אמיתיות. הלולאה נשארת כי אינה מזיקה, אך אין להציג אותה כתיקון של באג שנצפה. |

### F-13 — כותרת 7 קבועה כהערת צד (מתעלמת מ-`mode-h7`)

| שדה | תוכן |
|---|---|
| איך נתגלה | הרצת הטוקנייזר (שנשלף מהקובץ) על המסמך האמיתי (שורה 28238: "Found a real bug through this process"). |
| הבעיה | רמה 7 טופלה תמיד כ-`pendingSideNote`, גם כש-`mode-h7 = inline_2col`. |
| תיקון | תנאי: `lvl === 7 && (mode-h7 || 'side_note') === 'side_note'`. |
| מסקנה | לכל רמה יש מצב; ערכים קבועים בקוד הם סימן לבקרה מתה. |

### F-14 — גופנים שנבחרו נעלמים אחרי "טען גופני מערכת"

| שדה | תוכן |
|---|---|
| השערות | (א) הוספת `<option>` בתחילת הרשימה (`prepend`) מזיזה את הבחירה; (ב) מירוץ תזמון. נבדקו (סיכומי חשיבה, שורות 27721–27727: "Checking whether inserting new options shifts the default selection", "Weighing a timing race against a simpler reset explanation"). |
| ממצא | `loadSystemFonts` ביצע `select.innerHTML = ''` ומחק את כל האפשרויות שכבר נבחרו. |
| תיקון | הוספה בלבד (append-only), ושחזור `select.value`. ב-`loadExternalFonts` הוספו אפשרויות בלי לאפס את הבחירה. |
| מסקנה | בבקרות `<select>` שמתמלאות אסינכרונית, אין לרוקן; לשחזר ערך נבחר. |

### F-15 — טענות בביקורת של גרסת combined: שגיאות שאבחנתי ותיקנתי

| טענה ראשונה | מה התברר |
|---|---|
| "ב-combined חסר כלל `.side-ornament-wrap svg` שהיה ב-V4 — רגרסיה שגורמת לתסמין של המשתמש" | נכון כהשוואת קבצים (אין הפניות ל-`side-ornament` ב-`style.css` של combined), **שגוי כייחוס סיבתי**. הכלל הרלוונטי היה אחר (`.h3-ornament-right svg` עם גובה קשיח, F-09). תוקן. |
| "הגדרת `balance-chapter-end` נשברה במיזוג (מנותקת)" | נכון שאינה נקראת, אך האיזון ב-combined **אוטומטי בכוונה** (חכם יותר). לכן הבקרה הוסרה במקום לחבר אותה מחדש (F-19). |
| "ה-debounce החדש עלול לשבור קוד שמניח עימוד סינכרוני" | נבדקו כל 16 אתרי הקריאה; היחיד החשוד (`initVisualPickers` מיד אחרי) אינו תלוי בתוצאה. אין באג. |
| "`totalFlowH` נמדד מוקדם → באג" | נפסל (F-08, H3). |

### F-16 — נתיב "מכריחים שורה אחת" מנתק את הפסקה מה-DOM (אובדן טקסט)

| שדה | תוכן |
|---|---|
| הקוד | כש-`bestFitLine===0` ועמוד/טור ריקים (`!pageHasContent`): `targetCol.removeChild(pElem); … bestFitLine = 1;`, ואז כותבים את התוכן ל-`pElem` — שכבר מנותק. הפסקה לא מוצגת; הערת הצד שלה כן נוצרת. |
| איך נתגלה | עקיבה אחרי המסלול בביקורת הכללים (לא הורץ). |
| תיקון | `targetCol.appendChild(pElem)` לפני `bestFitLine = 1`, בשני האתרים. |
| תנאי מציאות | דורש שאפילו שורה אחת לא נכנסת בעמוד ריק (הערה ארוכה על השורה הראשונה, או עיטור ענק). נדיר; חמור כשקורה. `[קריאת-קוד]` |

### F-17 — נוסחת שטח ההערות בפרוב ≠ נוסחת השטח השמור

| שדה | תוכן |
|---|---|
| הקוד | `getFootnotesReservedHeight()`: `measure + 24 + headerH`, עמודות לפי `fn-columns`. בלולאת ההתאמה (פרוב): `measure + 24`, עמודות לפי `cfg.columns` בלבד. |
| תוצאה | שורה עם הערה חדשה נמדדת מול שטח שמור קטן ב-24px (כשיש כותרת לבלוק ההערות), ובעמודות לא נכונות כש-`fn-columns` נבחר. ההערה יכולה לחרוג מעבר לתחתית העמוד. |
| איך נתגלה | השוואת שתי הנוסחאות בזמן כתיבת מסמך זה. |
| תיקון | `footnoteReserveFor` ו-`getFootnoteColCount` משותפות; 4 בדיקות יחידה. השפעה על עימוד אמיתי `[לא-מאומת]`. |

### F-18 — כשלי כלים ותהליך

| כשל | פרט |
|---|---|
| איפוס קונטיינר (×2) | אובדן `/home/claude` ושחזור עבודה. מאז: checkpoint ל-`/mnt/user-data/outputs` אחרי כל שינוי. |
| checkpoint שנשכח | העתקה מחדש מ-outputs דרסה פאץ' שלא נשמר (אבדה והוחל מחדש). |
| שליפת קוד לבדיקות לפי טווחי שורות | נשברה כמה פעמים (`SyntaxError: Unexpected end of input`, `Illegal return statement`, הצהרה כפולה) (שורות 28784, 29307, 29599, 31879) — נפתר בשליפה לפי איזון סוגריים ו-`new Function`. |
| מודל ה-layout המדומה | בגרסה הראשונה כתבתי את ה-spans לקונטיינר במקום ל-`<p>` שהפונקציה באמת משתמשת בו, והתוצאה הייתה רשימת שורות ריקה. אובחן בעזרת מעקב אחרי קריאות ה-DOM. |
| ציפיות שגויות בבדיקה | בדיקת "כלל ראשונה כבוי, אחרונה פעיל, 3 שורות/2 נכנסות" ציפתה ל-0; הקוד נכון (התוצאה 1: המשתמש ביקש רק מניעת "אחרונה"). תוקנה הבדיקה, לא הקוד. |
| בדיקות `str_replace` | עריכות עם `old_str` ריק/זהה, ועריכה שהשאירה `<div>` לא סגור (נתפסה בבדיקת קינון). |

### F-19 — הגדרת `balance-chapter-end` מנותקת

| שלב | פרט |
|---|---|
| גילוי | תמליל, תור 17: "הגדרת איזון סוף-פרק קיימת בממשק … אבל הערך שלה לא נקרא בשום מקום". |
| תיקון ראשון | חיבור הערך לשער הקריאה ל-`balanceColumns` (תמליל שורות 2198–2207), עם `forceBalance` מבני (טור ריק). |
| היפוך | ב-combined האיזון מתבצע תמיד לפי תנאי מדידה (סעיף 2.4.3); הבקרה נשארה בממשק כבקרה מתה → הוסרה והוחלפה בהערה. |
| מסקנה | בקרה שאינה נקראת מטעה. אין להשאיר בקרות מתות. הבדיקה הנכונה: חיפוש הפניות לכל `id` של בקרה (הצלבה הפוכה, סעיף 2.16). |

### F-20 — חלופות שנשקלו ונדחו (מניעת מילה בודדת; מימוש)

הערכים הבאים נדחו **בניתוח**, לא בניסוי.

| חלופה | סיבת הדחייה |
|---|---|
| `text-wrap: pretty` של הדפדפן | תלוי בגרסת דפדפן, ומשפיע על שבירת השורות של כל הפסקה, בעוד שהמערכת מודדת שורות ומרנדרת מחדש מקטעים (מדידה ≠ רינדור). |
| תיקון מערך השורות אחרי המדידה (העברת המילה האחרונה של השורה הלפני אחרונה) | הרינדור האמיתי בונה מ-`lines.join(' ')` וחוזר לשבור לפי הדפדפן — היתומה חוזרת. הקשירה חייבת להיות בטקסט עצמו. |
| קשירה ב-U+2060 (Word Joiner) במקום NBSP | שורד נרמול `\s+`, אך התנהגות לפי UAX #14 לא נבדקה בדפדפן; NBSP מובטח. מחיר NBSP: שינוי ביטוי רגולרי אחד ב-`createDropWord`. |
| הזזת מדידת `totalFlowH` | נפסל (F-08, H3). |
| נסיגת כותרות ללא תנאים | סיכון ללולאה אינסופית (כותרת אחרונה במקטע; `h4` לפני `h3`; עמוד שכולו כותרות). נוספו 4 תנאי הגנה (2.5.2). |
| חיבור מחדש של `balance-chapter-end` | נדחה לטובת הסרה (F-19). |


### F-21 — "בדקתי ולא מצאתי בעיה" במרווחי עיטורי כותרת 2

| שדה | תוכן |
|---|---|
| הגישה | בתשובה לבקשת המשתמש (תור 20) לשוות את מרחק העיטורים העליון והתחתון מהטקסט: "ה-CSS מראה 6px משני הצדדים באופן זהה" (תמליל, תגובה 21). |
| כשל | בבדיקה חוזרת (תגובה 29): שוליים של הכותרת ושוליים של העיטור התחתון **מצטברים** ב-flex-column (אין התמוטטות שוליים): 12px מול 6px. |
| איך נתגלה | קריאה חוזרת של כלל `:has()` הקיים והשוואת סכום השוליים בפועל. |
| מסקנה | להשוות שוליים **אפקטיביים** (חישוב מצטבר בזרימה), לא ערכי CSS בודדים. ביחד עם F-11: "בדקתי ולא מצאתי בעיה" ללא מדידה בדפדפן אינו ממצא. |

---

## 4. סטטוס קוד נוכחי ורכיבים מוכנים

קטעי הקוד בסעיף זה **נשלפו אוטומטית מהקבצים הסופיים** בעת יצירת המסמך (לא הוקלדו מחדש), ולכן זהים לקוד שנמסר. פונקציות מופיעות במלואן; קטעים מתוך פונקציות גדולות (נתיבי ההתאמה, אכיפת הכותרות, יצירת מועמדי האיזון) הם **ציטוטים (excerpts)** של שורות רצופות בלבד, והקשרם המלא בקבצים.

### 4.1 מה שונה ביחס ל-`combined` שהועלתה

| קובץ | שינוי | סעיף |
|---|---|---|
| `typesetter.js` | `fitOneHeadingOrnament`, `fitSideOrnamentsToText` (חדשות) + 6 אתרי קריאה (עיטורי כותרת 2 ו-3) | 2.11 |
| `typesetter.js` | `resolveParagraphCut`, `trailingHeadingCount`, `popTrailingHeadings` (חדשות); שכתוב נתיבי `bestFitLine===0` וחוקי אלמנה/יתומה בשני אתרי ההתאמה; אכיפת כותרת יתומה אחרי לולאת הטור | 2.5 |
| `typesetter.js` | תיקון נתיב "מכריחים שורה אחת" (החזרת `pElem` ל-DOM) בשני האתרים | F-16 |
| `typesetter.js` | קשירת שתי המילים האחרונות: `joinMeasuredLine`, לוגיקה ב-`getLinesFromParagraph`, רגקס ב-`createDropWord` | 2.5.3 |
| `typesetter.js` | `balanceColumns`: סימון `violatesRule`, `strictPoints`, `scanPoints`, רשת ביטחון | 2.4.2 |
| `typesetter.js` | `getFootnoteColCount`, `footnoteReserveFor` — נוסחה אחת לפרוב ולשטח השמור | F-17 |
| `index.html` | הוסרה הבקרה `balance-chapter-end` והוחלפה בהערה; נוספה הבקרה `avoid-runt-word` | F-19, 2.5.3 |
| `style.css` | הוסרו הגבהים הקשיחים של `.h3-ornament-*`; נוסף כלל `text-wrap: balance` לכותרות | F-09, 2.5.3 |
| `app.js`, `decorations.js` | ללא שינוי | |

### 4.2 מפת הקבצים

| קובץ | שורות | בתים |
|---|---|---|
| `index.html` | 1325 | 98980 |
| `style.css` | 1623 | 49386 |
| `app.js` | 1742 | 79945 |
| `decorations.js` | 615 | 36808 |
| `typesetter.js` | 2563 | 128021 |

#### פונקציות ברמה העליונה (שם: מספר שורה)

**`typesetter.js`** (44 פונקציות): `stripEditorialNotes`:42 · `toGematria`:47 · `toGematriaWithGeresh`:72 · `formatPageNumberDisplay`:80 · `updateGrid`:110 · `updateStyles`:127 · `applyDibburHamatchil`:213 · `createDropWord`:223 · `joinMeasuredLine`:260 · `getLinesFromParagraph`:269 · `adjustFitLineForNoteSpans`:383 · `resolveParagraphCut`:409 · `trailingHeadingCount`:432 · `popTrailingHeadings`:441 · `resolveHeaderAlign`:451 · `fitOneHeadingOrnament`:462 · `fitSideOrnamentsToText`:476 · `createPageLayout`:491 · `parseMetadataFromText`:591 · `estimateSectionFillRatio`:651 · `justifyColumnVertically`:685 · `balanceColumns`:710 · `finalizeNotePositions`:965 · `findDelimiterMatches`:1013 · `applyDelimiterStyles`:1064 · `getHostSizePt`:1114 · `getBodySizePt`:1124 · `getNoteConfig`:1129 · `formatNoteMarker`:1134 · `resetNoteCounterIfNeeded`:1146 · `applyNoteMarkerStyle`:1172 · `createNoteMarkerAndQueue`:1196 · `buildNoteBlockElement`:1218 · `flushFootnotesInto`:1247 · `flushEndnotesForPart`:1307 · `getFootnoteColCount`:1349 · `footnoteReserveFor`:1353 · `measureNoteBlockHeight`:1359 · `appendMainSubParts`:1374 · `renderCustomHeadingInto`:1389 · `buildStructuredTOC`:1420 · `renderPaginatedTOC`:1450 · `typesetDocument`:1573 · `performTypeset`:1580

**`decorations.js`** (22 פונקציות): `registerExternalShaarAsset`:52 · `registerOrnamentsLR`:58 · `registerOrnamentsUD`:62 · `registerExternalAllOrnament`:66 · `wrapShaarMedia`:70 · `resolveShaarBoxStyle`:77 · `splitTextInHalf`:98 · `renderHeaderSectionHTML`:106 · `getSectionDividerHTML`:142 · `getHeadingOrnamentHTML`:163 · `renderSideOrnamentHTML`:191 · `buildNoteRuleElement`:226 · `getShaarBoxEditorHTML`:307 · `renderMainShaar`:324 · `renderBackShaar`:404 · `renderSubShaar`:473 · `getContentBgCSS`:555 · `applyContentBg`:578 · `registerExternalShaar`:586 · `registerExternalHeader`:602 · `registerExternalDivider`:607 · `registerExternalNoteRule`:612

**`app.js`** (63 פונקציות): `toggleSettingsPane`:64 · `togglePanelBody`:76 · `toggleCbgSubRows`:88 · `markPendingChanges`:98 · `clearPendingChanges`:103 · `getCleanEditorText`:111 · `renderEditorContent`:128 · `updateEditorWithPageBreaks`:174 · `updateEditorStats`:179 · `handleTxtFileImport`:216 · `getActiveEditorLineIdx`:266 · `syncCursorToPreview`:278 · `updatePreviewScale`:314 · `toggleShaarBoxEditor`:345 · `initShaarBoxResizer`:354 · `resetCurrentShaarBoxPosition`:448 · `exportShaarJSONWithPositions`:457 · `applyHeadingOrnamentTextFit`:484 · `addNewCustomTheme`:534 · `deleteCustomTheme`:582 · `refreshCustomThemesUI`:589 · `validateExtJSON`:634 · `handlePageTypeImportFile`:641 · `handleTextStyleImportFile`:664 · `handleImagePageImportFile`:683 · `buildExtPanel`:712 · `updateExtAnchor`:739 · `removeExtInstance`:746 · `findPrefixLineInSource`:755 · `applyExtStyleToNode`:767 · `renderImportedPage`:782 · `renderImportedImagePage`:823 · `renderExtAnchor`:832 · `findExtTextStyle`:837 · `handleImageUpload`:841 · `saveAsDefaultTemplate`:879 · `rehydrateExtImports`:929 · `initFontPickers`:967 · `ensureBuiltinFontsLoaded`:1046 · `loadSystemFonts`:1061 · `loadExternalFonts`:1093 · `triggerAssetsFolderPick`:1128 · `readFileAsText`:1133 · `readFileAsDataURL`:1142 · `handleAssetsFolderSelected`:1151 · `loadExternalJSONAssets`:1271 · `loadFolderAssetsAndThemes`:1382 · `syncThemeToIndividualShaars`:1406 · `appendOptionToSelect`:1418 · `onHdrAlternatingToggle`:1440 · `onHdrTitleSplitToggle`:1446 · `onHdrDistinctToggle`:1452 · `onH2TitleOrnamentModeChange`:1461 · `onH2OrnamentSetChange`:1469 · `onH2IndividualOrnamentChange`:1479 · `onH3OrnamentSetChange`:1490 · `onH3IndividualOrnamentChange`:1500 · `getItemPreviewHTML`:1522 · `initVisualPickers`:1587 · `refreshVisualPicker`:1593 · `toggleVisualPickerDropdown`:1657 · `closeAllVisualPickers`:1665 · `selectVisualPickerItem`:1669

אין מחלקות (`class`); מצב גלובלי ברמה העליונה:

- `typesetter.js`: `noteCounters`, `noteUidCounter`, `footnoteQueueForPage`, `endnoteQueueForPart`, `lineToTokenMap`, `globalTokens`, `typesetTimer`
- `decorations.js`: `CBG_TEXTURE_SVG`, `EXTERNAL_SHAAR_ASSETS`, `ORNAMENTS_LR`, `ORNAMENTS_UD`, `EXTERNAL_ALL_ORNAMENTS`, `HEADER_ORNAMENTS`, `SECTION_DIVIDERS`, `NOTE_RULE_GLYPHS`, `BUILTIN_SHAAR_THEMES`
- `app.js`: `resizer`, `sidebar`, `editorElem`, `isResizing`, `bookContainerEl`, `customThemes`, `importedPageTypes`, `importedTextStyles`, `importedImagePages`, `extImportCounter`, `nextSyntheticLevel`, `EXT_ANCHOR_OPTIONS`, `EXT_V_MAP`, `VISUAL_PICKER_TARGETS`

### 4.3 הכרעת חיתוך פסקה ובקרת כותרות יתומות

```js
function resolveParagraphCut(lines, maxFit, hasContentAbove, avoidWidows, avoidOrphans) {
    const total = lines.length;
    if (maxFit <= 0) return 0;
    if (maxFit >= total) return total;
    let fit = maxFit;
    for (let iter = 0; iter < 8; iter++) {
        const before = fit;
        fit = adjustFitLineForNoteSpans(lines, fit);
        if (fit <= 0) return 0;
        if (fit >= total) return total;
        // אם לא ניתן לחתוך מעל הערה בלי לחרוג, שלמות ההערה גוברת
        if (fit > maxFit) return fit;
        if (avoidOrphans && total - fit === 1 && fit > 1) fit -= 1;
        if (hasContentAbove) {
            if (avoidWidows && fit === 1) return 0;
            if (avoidOrphans && fit === 1 && total - fit === 1) return 0;
        }
        if (fit === before) break;
    }
    return fit;
}
```

```js
function trailingHeadingCount(col) {
    let n = 0;
    let el = col.lastElementChild;
    while (el && typeof el.className === 'string' && el.className.startsWith('title-level-')) {
        n++;
        el = el.previousElementSibling;
    }
    return n;
}
```

```js
function popTrailingHeadings(col) {
    const n = trailingHeadingCount(col);
    for (let k = 0; k < n; k++) col.removeChild(col.lastElementChild);
    return n;
}
```

**הערות טיפול בשגיאות ומקרי קצה:**

- `maxFit ≤ 0` ← 0; `maxFit ≥ total` ← `total` (בלי עיבוד).
- לולאה חסומה ב-8 איטרציות; גם אם לא התייצבה, מוחזר ערך תקין (≥1).
- `fit > maxFit` (חיתוך שנאלץ לחרוג כדי לא לקרוע הערה): מוחזר כמות שהוא, כי שלמות הערה גוברת.
- אין החלטת 0 כשאין תוכן מעל (מבטיח התקדמות).

נתיבי השימוש בשני אתרי ההתאמה (אתר ה-2-טורים):

```js
if (bestFitLine === 0) {
    targetCol.removeChild(pElem);
    if (targetCol.children.length > 0) {
        tokenIndex -= popTrailingHeadings(targetCol);
        break;
    } else {
        // הפסקה נשלפה מהטור למעלה; כשמכריחים שורה אחת (עמוד ריק) חייבים להחזיר אותה
        if (!pageHasContent) { targetCol.appendChild(pElem); bestFitLine = 1; }
        else break;
    }
}

const avoidOrphans = document.getElementById('avoid-orphans')?.checked ?? true;
const avoidWidows = document.getElementById('avoid-widows')?.checked ?? true;
{
    // כל ההגנות (הערות/יתומה/אלמנה) מוחלות יחד, בסדר קבוע וחוזר עד ייצוב
    const cut = resolveParagraphCut(lines, bestFitLine, pageHasContent, avoidWidows, avoidOrphans);
    if (cut === 0) {
        targetCol.removeChild(pElem);
        tokenIndex -= popTrailingHeadings(targetCol);   // כותרת שנשארה מעליה לא נשארת יתומה
        break;
    }
    bestFitLine = cut;
}
```

אכיפת כותרת יתומה אחרי הלולאה:

```js
// הגנת "כותרת יתומה": כל יציאה מהלולאה (טור מלא, כותרת שגרמה לגלישה, חוקי אלמנה/יתומה וכו')
// עלולה להשאיר כותרת כרכיב האחרון בטור בלי טקסט אחריה. לא מושכים כשהכותרת הבאה פורשת
// טור יחיד (אז אין טקסט שהיא אמורה להישאר איתו), וגם לא כשהטור כולו כותרות בעמוד ריק (למניעת לולאה).
if (tokenIndex < secTokens.length && !pendingWordTokens) {
    const nxt = secTokens[tokenIndex];
    const nxtMode = nxt && nxt.type.startsWith('h') ? headingModes[nxt.level] : 'inline_2col';
    const hn = trailingHeadingCount(targetCol);
    if (hn > 0 && nxtMode !== 'span_1col' && (targetCol.children.length > hn || pageHasContent)) {
        popTrailingHeadings(targetCol);
        tokenIndex -= hn;
    }
}
```

### 4.4 מדידת שורות וקשירת מילים אחרונות

```js
function joinMeasuredLine(arr, idxs, pairStart, bindPair) {
    let s = '';
    for (let k = 0; k < arr.length; k++) {
        if (k > 0) s += (bindPair && idxs[k - 1] === pairStart && idxs[k] === pairStart + 1) ? '\u00A0' : ' ';
        s += arr[k];
    }
    return s;
}
```

```js
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

    const fnOpen = document.getElementById('fn-delim-open')?.value?.trim() || '[';
    const fnClose = document.getElementById('fn-delim-close')?.value?.trim() || ']';
    let safeText = text.trim();

    /* הגנה אטומית: הפיכת תוכן ההערה למילה בודדת במדידה */
    if (fnOpen && fnClose) {
        const escO = fnOpen.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escC = fnClose.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        safeText = safeText.replace(new RegExp(escO + '([\\s\\S]*?)' + escC, 'g'), (m, inner) => {
            return fnOpen + inner.replace(/\s+/g, '\uE000') + fnClose;
        });
    }

    const words = safeText.split(/\s+/);
    if (words.length === 0) {
        return { lines: [], hasWindow: false, numLines: 0 };
    }

    const pMeasure = document.createElement('p');
    pMeasure.style.margin = '0';
    pMeasure.style.padding = '0';
    pMeasure.style.lineHeight = styleObj.lineHeight;

    pMeasure.textContent = text;
    measureContainer.appendChild(pMeasure);
    const singleLineHeight = pMeasure.offsetHeight;
    pMeasure.textContent = "א";
    const oneLineH = pMeasure.offsetHeight;
    const numLinesEstimated = Math.max(1, Math.round(singleLineHeight / oneLineH));

    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    const shouldApplyWindow = useWindowIfMultipleLines && (numLinesEstimated >= minLines) && (mode === 'window');

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ').replace(/\uE000/g, ' ');

    // מניעת מילה יתומה בשורה האחרונה: שתי המילים האחרונות נשארות יחד (כמו שתי מילים לפחות בשורה האחרונה).
    // לא חלה כשהפסקה קצרה מדי, או כשהזוג נוגע בחלון "מילה ראשונה".
    const avoidRunt = document.getElementById('avoid-runt-word')?.checked !== false;
    const flowStart = shouldApplyWindow ? wordCount : 0;
    const pairStart = words.length - 2;
    const bindPair = avoidRunt && (words.length - flowStart) >= 3 && pairStart >= flowStart;

    let html = '';
    if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${dropWords}</span> `;
        for (let i = wordCount; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : w.replace(/\uE000/g, ' ');
            html += `<span id="mw-${i}">${displayW}</span>${(bindPair && i === pairStart) ? '&nbsp;' : ' '}`;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : w.replace(/\uE000/g, ' ');
            html += `<span id="mw-${i}">${displayW}</span>${(bindPair && i === pairStart) ? '&nbsp;' : ' '}`;
        }
    }

    pMeasure.innerHTML = html;

    const lines = [];
    let currentLine = [];
    let currentIdx = [];
    let currentTop = -1;
    const startIndex = shouldApplyWindow ? wordCount : 0;
    if (shouldApplyWindow) {
        currentLine.push(dropWords);
        currentIdx.push(-1);
    }

    for (let i = startIndex; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        const realWord = words[i].replace(/\uE000/g, ' ');
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
            lines.push(joinMeasuredLine(currentLine, currentIdx, pairStart, bindPair));
            currentLine = [realWord];
            currentIdx = [i];
            currentTop = top;
        } else {
            currentLine.push(realWord);
            currentIdx.push(i);
        }
    }
    if (currentLine.length > 0) {
        lines.push(joinMeasuredLine(currentLine, currentIdx, pairStart, bindPair));
    }

    measureContainer.innerHTML = '';
    return {
        lines,
        hasWindow: shouldApplyWindow,
        numLines: lines.length
    };
}
```

**מקרי קצה בקשירה:** פחות מ-3 מילים אחרי חלון "מילה ראשונה" ← אין קשירה; זוג רחב מהטור ← גלישה (לא מטופל; ראה סעיף 6); `avoid-runt-word` חסר ב-DOM ← פעיל. `createDropWord` מפצל כעת לפי `/[ \t\r\n\f\v]+/` כדי לא לבלוע את ה-NBSP.

### 4.5 הגנת הערות: חיתוך, שטח שמור, מיקום הערות צד

```js
function adjustFitLineForNoteSpans(lines, bestFitLine) {
    if (bestFitLine <= 0 || bestFitLine >= lines.length) return bestFitLine;
    const fullText = lines.join(' ');
    const spans = findDelimiterMatches(fullText, 'body');
    if (!spans.length) return bestFitLine;
    const cutsNote = (fit) => {
        const offset = lines.slice(0, fit).join(' ').length;
        return spans.some(m => offset > m.start && offset < m.end);
    };
    for (let fit = bestFitLine; fit > 0; fit--) {
        if (!cutsNote(fit)) return fit;
    }
    for (let fit = bestFitLine + 1; fit <= lines.length; fit++) {
        if (!cutsNote(fit)) return fit;
    }
    return bestFitLine;
}
```

```js
function getFootnoteColCount(styleId) {
    const cfg = getNoteConfig(styleId);
    return parseInt(document.getElementById('fn-columns')?.value, 10) || cfg.columns || 1;
}
```

```js
function footnoteReserveFor(queue, colCount) {
    const titleText = document.getElementById('fn-title-text')?.value?.trim();
    const headerH = titleText ? 24 : 0;
    return measureNoteBlockHeight(queue, colCount) + 24 + headerH;
}
```

```js
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
```

### 4.6 איזון טורים: יצירת מועמדים וקנס ורשת ביטחון

```js
const violatesRule = (avoidWidows && l === 1) || (avoidOrphans && (lines.length - l) === 1);
splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines, violatesRule: violatesRule });
```

```js
const strictPoints = validSplitPoints.filter(sp => !sp.violatesRule);
let pointsToEvaluate = strictPoints.length > 0 ? strictPoints : (validSplitPoints.length > 0 ? validSplitPoints : splitPoints);
```

```js
let bestPenalty = Infinity;
function scanPoints(points) {
for (let sp of points) {
    rCol.innerHTML = '';
    for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
    if (sp.lineIndex > 0) {
        let item = items[sp.itemIndex];
        let pRight = document.createElement('p');
        pRight.className = 'p-cut';
        let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
        pRight.innerHTML = createDropWord(rightText, item.isCont, false, sp.lineIndex);
        applyDelimiterStyles(pRight, 'body', getBodySizePt(), true);
        rCol.appendChild(pRight);
    }
    let rHeight = rCol.scrollHeight;

    lCol.innerHTML = '';
    if (sp.lineIndex > 0) {
        let item = items[sp.itemIndex];
        let pLeft = document.createElement('p');
        pLeft.className = 'p-end';
        let leftText = sp.lines.slice(sp.lineIndex).join(' ');
        pLeft.innerHTML = createDropWord(leftText, true, false, item.lines.length - sp.lineIndex);
        applyDelimiterStyles(pLeft, 'body', getBodySizePt(), true);
        lCol.appendChild(pLeft);
    }
    for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) {
        renderSingleItemFast(lCol, items[i]);
    }
    let lHeight = lCol.scrollHeight;

    let diff = rHeight - lHeight;
    let absDiff = Math.abs(diff);

    /* עונש גובה קשיח (x2000) במקרה של חדירה לתקציב הערות שוליים */
    let heightPenalty = 0;
    if (availableHeight && availableHeight < Infinity) {
        if (rHeight > availableHeight) heightPenalty += (rHeight - availableHeight) * 2000;
        if (lHeight > availableHeight) heightPenalty += (lHeight - availableHeight) * 2000;
    }

    let score = absDiff + heightPenalty;

    if (score < minAbsDiff) {
        minAbsDiff = score;
        bestSplit = sp;
        bestDiff = diff;
        bestPenalty = heightPenalty;
    } else if (score === minAbsDiff && diff >= 0) {
        bestSplit = sp;
        bestDiff = diff;
        bestPenalty = heightPenalty;
    }
}
}
scanPoints(pointsToEvaluate);
// רשת ביטחון: חריגה מהגובה המותר (גלישה לאזור ההערות/מספר העמוד) גרועה מהפרת כלל אלמנה/יתומה.
// אם כל הפיצולים שעומדים בכללים חורגים - בודקים גם פיצולים שמפרים אותם (אך לא כאלה שמשאירים כותרת יתומה).
if (bestPenalty > 0 && pointsToEvaluate !== validSplitPoints) {
    scanPoints(validSplitPoints.filter(sp => !pointsToEvaluate.includes(sp)));
}
```


### 4.7 עיטורים: התאמה סינכרונית

```js
function fitOneHeadingOrnament(ornWrap, isTop) {
    const fitInner = ornWrap.querySelector('.heading-ornament-wrap.fit-heading-text');
    if (!fitInner) return;
    const targetEl = isTop ? ornWrap.nextElementSibling : ornWrap.previousElementSibling;
    if (!targetEl) return;
    const textWidth = targetEl.getBoundingClientRect().width;
    if (textWidth > 0) {
        fitInner.style.width = textWidth + 'px';
        fitInner.style.maxWidth = '90%';
    }
}
```

```js
function fitSideOrnamentsToText(wrap) {
    const textEl = wrap.querySelector('.title-level-2-standalone, .h3-title-text');
    if (!textEl) return;
    const textHeight = textEl.getBoundingClientRect().height;
    if (textHeight <= 0) return;
    wrap.querySelectorAll('.h2-title-ornament-right, .h2-title-ornament-left, .h3-ornament-right, .h3-ornament-left').forEach(ornEl => {
        ornEl.style.maxHeight = textHeight + 'px';
        const innerImg = ornEl.querySelector('svg, img');
        if (innerImg) {
            innerImg.style.maxHeight = textHeight + 'px';
            innerImg.style.height = 'auto';
        }
    });
}
```

**שגיאות ומקרי קצה:** אלמנט ללא אחיו (`nextElementSibling` / `previousElementSibling` חסר) ← יציאה שקטה; רוחב/גובה טקסט 0 (אלמנט מנותק) ← אין שינוי. קורא בזמן ההכנסה, לכן האלמנט חייב להיות מחובר ל-DOM (כך נעשה).

### 4.8 כותרות עליונות, מספור, טעינת גופנים, שמירת מיקום שער

```js
function resolveHeaderAlign(align, slot) {
    if (align === 'outer') return slot === 'r' ? 'right' : 'left';
    if (align === 'inner') return slot === 'r' ? 'left' : 'right';
    return align;
}
```

```js
function formatPageNumberDisplay(pNum) {
    const pageNumPos = document.getElementById('page-num-position')?.value || 'bottom_center';
    const pageNumFormat = document.getElementById('page-num-format')?.value || 'gematria';
    const pageNumFrame = document.getElementById('page-num-frame')?.value || 'none';
    const startIdx = parseInt(document.getElementById('page-num-start-idx')?.value, 10) || 1;
    const initialValue = parseInt(document.getElementById('page-num-initial-value')?.value, 10) || 1;

    let displayPageNum = '';
    if (pageNumPos !== 'none' && pNum >= startIdx) {
        const effectiveNum = pNum - startIdx + initialValue;
        if (pageNumFormat === 'gematria') {
            displayPageNum = toGematria(effectiveNum);
        } else if (pageNumFormat === 'page_gematria') {
            displayPageNum = 'דף ' + toGematria(effectiveNum);
        } else if (pageNumFormat === 'numeric') {
            displayPageNum = String(effectiveNum);
        }
    }

    let framedPageNum = displayPageNum;
    if (displayPageNum && pageNumFrame !== 'none') {
        framedPageNum = `<span class="page-num-badge page-num-frame-${pageNumFrame}">${displayPageNum}</span>`;
    }

    return { displayPageNum, framedPageNum, pageNumPos };
}
```

```js
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
```

```js
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
```

```js
function splitTextInHalf(text, part) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= 1) return part === 'first' ? text : '';
    const mid = Math.ceil(words.length / 2);
    return part === 'first' ? words.slice(0, mid).join(' ') : words.slice(mid).join(' ');
}
```

### 4.9 נקודת הכניסה של העימוד (debounce)

```js
let typesetTimer = null;
function typesetDocument() {
    if (typesetTimer) clearTimeout(typesetTimer);
    typesetTimer = setTimeout(() => {
        performTypeset();
    }, 400);
}

function performTypeset() {
```


---

## 5. מקרי קצה שנבדקו ותורגמו לבדיקות

### 5.1 מקרי קצה ומצב הטיפול

| # | מקרה | טיפול נוכחי | ביסוס |
|---|---|---|---|
| 1 | הערת שוליים ארוכה מעמוד שלם | `getFootnotesReservedHeight()` עולה על גובה העמוד ← `bestFitLine=0` לכל פסקה ← נתיב "מכריחים שורה" (מתוקן, F-16) ← עמוד עם הערות חורגות, `.a4-page{overflow:hidden}` חותך. **אין פיצול של הערה בין עמודים.** | `[קריאת-קוד]`; לא מטופל |
| 2 | כותרת בתחתית טור | נסיגת כותרות (2.5.2): אחרי `bestFitLine=0`, אחרי הסרת פסקה בגלל כלל שורות, ואחרי יציאה מהלולאה בטור מלא | `[מאומת-בדיקה]` (עזרי נסיגה), `[קריאת-קוד]` (שילוב במנוע) |
| 3 | כותרת רחבה (h3) בתחתית עמוד | נסיגה עצלה אחרי שני טורים ריקים; `currentAvailH < 60` ← עמוד חדש | `[קריאת-קוד]` |
| 4 | חוסר מקום בטור שמאלי | הטור השמאלי ממשיך מאותו טוקן; אם הימני מלא והשמאלי ריק ← `balanceColumns` תמיד | `[מאומת-משתמש]` למקרה כותרת 3 |
| 5 | טקסט קודש מול פירושים (פריסה מקבילה, בסגנון דף גמרא) | **לא קיים.** המערכת מייצגת רק גוף 2 טורים + הערות צד + הערות שוליים | — |
| 6 | פסקה של שורה אחת / שתיים / שלוש בתחתית | `resolveParagraphCut` (טבלת אמת 2.5.1) | `[מאומת-בדיקה]` |
| 7 | שורה ראשונה לא נכנסת בעמוד ריק | מכריחים שורה אחת, מחזירים את `pElem` ל-DOM | `[קריאת-קוד]` (תוקן) |
| 8 | כותרת היא הטוקן האחרון במקטע | נשארת במקומה (אין נסיגה) | `[קריאת-קוד]` |
| 9 | `h4` ואחריו `h3` | הכותרת התחתונה לא נמשכת (מונע לולאה אינסופית) | `[קריאת-קוד]` |
| 10 | כותרות רצופות בסוף טור | נמשכות כולן (`popTrailingHeadings`) | `[מאומת-בדיקה]` |
| 11 | הערת שוליים באמצע פסקה | "מילה" אחת במדידה (`\uE000`) ← אינה נקרעת בין שורות | `[קריאת-קוד]` |
| 12 | סוגרי הערה לא מאוזנים | לא מטופל; הבדיקה היחידה היא ספירה בקובץ הדוגמה | `[מאומת-בדיקה]` (9/9) |
| 13 | מילה יתומה בשורה אחרונה | קשירת שתי המילים האחרונות (2.5.3) | `[מאומת-בדיקה]` (מודל מדומה) |
| 14 | פסקה של פחות מ-3 מילים | אין קשירה | `[מאומת-בדיקה]` |
| 15 | זוג קשור רחב מהטור | **לא מטופל**: גלישה אופקית | `[קריאת-קוד]` |
| 16 | מילה ארוכה מהטור (URL) | **לא מטופל** | — |
| 17 | הערות צד: הערה גבוהה מהמרחק לעוגן הבא | **חפיפה אפשרית** (2.6) | `[קריאת-קוד]` |
| 18 | הערות צד: אחרי `balanceColumns` | הפניות ישנות ב-`pagePendingNotes` (בלתי מזיק כי מנותקות) | `[קריאת-קוד]` |
| 19 | כותרת 7 רצופות / כותרת 7 אחרונה | דריסה / אובדן שקט | `[קריאת-קוד]` |
| 20 | `mode-h7 ≠ side_note` | מכובד (F-13) | `[מאומת-בדיקה]` |
| 21 | עמוד פתיחת כותרת 2 עם עיטורים | מתוקצב ב-`used`; התאמה סינכרונית. **בעיה פתוחה** (F-08) | `[לא-מאומת]` |
| 22 | עיטור צדי בגובה הגדרה גבוה מהטקסט | תקרה לגובה הטקסט (`fitSideOrnamentsToText`) | `[לא-מאומת]` |
| 23 | שורת סימן חסרה | עיטורי "סימן" חלים על הכותרת | `[קריאת-קוד]` |
| 24 | הערות בעמוד שבו הגדלת שטח ההערות מקטינה את התקציב אחרי שפסקאות כבר הוצבו | רק איזון; **אין דחיית שורות** | `[קריאת-קוד]`; פער S6 |
| 25 | גופן שלא נטען בעת העימוד הראשון | `ensureBuiltinFontsLoaded` (גורם אפשרי; לא הוכח) | `[לא-מאומת]` |
| 26 | קובץ עם CRLF | `trim()` ו-`split('\n')` | `[מאומת-בדיקה]` |
| 27 | שערי JSON עם `id` זהה | התנגשות אפשרית (F-10) | `[מאומת-בדיקה]` (סימולציה), השפעה `[לא-מאומת]` |
| 28 | פתיחה בעמוד אי-זוגי | `ensureOddPageStart` | `[קריאת-קוד]` |
| 29 | הדפסה | `transform` מאופס; `.a4-page{overflow:hidden}` | `[קריאת-קוד]` |

### 5.2 מלאי הבדיקות האוטומטיות (29 בדיקות, כולן עוברות)

הבדיקות רצות על הקוד האמיתי: הפונקציות נשלפות מהקבצים לפי איזון סוגריים ומורצות ב-`vm`. `getLinesFromParagraph` רצה מול מודל layout דטרמיניסטי (10px לתו, 5px לרווח, 20px לשורה, חמדני, NBSP מחבר מילים ליחידה שאינה נשברת; `offsetTop = שורה × 20`).

| מזהה | מה נבדק | תוצאה צפויה |
|---|---|---|
| R1 | 3 שורות, 2 נכנסות, תוכן מעל, שני הכללים | 0 (העברת כל הפסקה) |
| R2 | 3 שורות, 1 נכנסת | 0 |
| R3 | 4 שורות, 3 נכנסות | 2 |
| R4 | 5 שורות, 2 נכנסות | 2 |
| R5 | 2 שורות, 1 נכנסת, תוכן מעל | 0 |
| R6 | 2 שורות, 1 נכנסת, **אין** תוכן מעל | 1 |
| R7 | 3 שורות, 2 נכנסות, אין תוכן מעל | 1 |
| R8 | הפסקה כולה נכנסת | `total` |
| R9 | שום שורה לא נכנסת | 0 |
| R10 | כלל "ראשונה" כבוי, "אחרונה" פעיל, 3/2 | 1 |
| R11 | כנ"ל, 2/1 עם תוכן מעל | 0 |
| R12 | שני הכללים כבויים, 3/2 | 2 |
| R13 | חיתוך בתוך הערה (שורות סינתטיות) | 2 (עובר מעבר לחיתוך שבור, ללא פרצה של שורה בודדת) |
| W1 | הגנה כבויה: פסקה של 9 מילים ← 4,4,1 | שורה אחרונה: מילה אחת |
| W2 | הגנה פעילה: מספר השורות | 3 (ללא שינוי) |
| W3 | הגנה פעילה: שורה אחרונה | `hhhh\u00A0iiii` |
| W4 | שורה לפני אחרונה | `eeee ffff gggg` |
| W5 | אף מילה לא אבדה/הוכפלה | רשימת המילים זהה |
| W6 | פסקה של 2 מילים | אין קשירה |
| W7 | אין "מילה יתומה" מלכתחילה | שורות זהות פרט ל-NBSP בזוג האחרון |
| W8 | בקרת `avoid-runt-word` חסרה | ברירת מחדל פעיל |
| H1 | ספירת כותרות עוקבות-לסוף | 2 |
| H2 | משיכת כותרות מחזירה כמה טוקנים להחזיר | 2 |
| H3 | הפסקה שמעל נשמרת | `['p-end']` |
| H4 | טור שמסתיים בפסקה | 0 |
| N1 | שטח שמור להערות: ללא כותרת | `מדידה + 24` |
| N2 | עם כותרת בלוק | `מדידה + 24 + 24` |
| N3 | עקיפת `fn-columns` | 1 |
| N4 | נפילה לעמודות לפי סגנון | 2 |

(בדיקת הטוקנייזר על המסמך האמיתי, סעיף 2.1, מתווספת לאלו.)

### 5.3 איך להריץ

```
cd <תיקיית הקבצים>
node test_logic.js        # R1–R13, W1–W8, H1–H4 (25 בדיקות)
node test_reserve.js      # N1–N4
```

קוד הבדיקות מצורף בנספח א'. הם דורשים רק Node (ללא תלויות).

---

## 6. מפת דרכים והצעדים הבאים

### 6.1 מצב: מה נסגר ומה לא

| נושא | מצב |
|---|---|
| יישור טורים בסוף פרק / לפני כותרת 3 | נסגר בשושלת L-B אחרי תיקון המשתמש `[מאומת-משתמש]`. ב-combined: ציון עונש ורשת ביטחון `[לא-מאומת]` |
| עמוד פתיחת כותרת 2 (קצר/ארוך/מסתדר אחרי הוספה והסרה) | **פתוח**. שלוש השערות נפסלו או לא אומתו (F-08) |
| גובה עיטור צדי | תוקן ב-combined (CSS) `[לא-מאומת]`; מנגנון L-B לא הוסבר (F-09) |
| איחוד שערי JSON | **פתוח**, לא שוחזר (F-10) |
| הגנות שורות/כותרות/מילים | הוחלו ונבדקו לוגית; דפדפן `[לא-מאומת]` |
| שטח הערות שוליים: נוסחה אחידה | תוקן `[מאומת-בדיקה]` על הנוסחה |
| יישור "מילה ראשונה" (קצה עליון) מול גוף הטקסט | **לא יושם** (בקשת המשתמש בסשן; תלוי מטריקות גופן) |

### 6.2 צעדים מומלצים לפי סדר עדיפות

1. **אימות בדפדפן של כל הרשימה בסעיף 4.1** על המסמך האמיתי (`חלק_ההקדמה_סדר_חדש.txt`, 1010 שורות). מתכון אבחון לעמוד פתיחת כותרת 2, מותנה בדגל DEV:
   - לכל עמוד פתיחה לתעד: `totalFlowH`, `spacer.offsetHeight`, גובה כל רכיב ב-`headerEls`, `used`, `remPageHeight`, `bodyFlow.scrollHeight` וגם `bodyFlow.clientHeight` **בסוף העמוד**, ותקן: `clientHeight − (max(rCol,lCol).scrollHeight + used + reserve)`.
   - להשוות שלושה מצבים כמו בצילומי המשתמש: בלי עיטורים / עם / אחרי הסרה, ועימוד שני **ללא שינוי הגדרות** (בודק את H2 — גופנים).
   - לתעד `document.fonts.status` ו-`document.fonts.check('1em "<font>"')` בעימוד הראשון.
2. **אוטומציית דפדפן אמיתי** (Playwright / puppeteer) עם אינווריאנטים מחייבים לכל עמוד: (א) `page.scrollHeight ≤ page.clientHeight`; (ב) האלמנט האחרון ב-`.page-body-flow` אינו `title-level-*`; (ג) אין `p.p-end` שבו השורה האחרונה היא מילה אחת (לפי `Range.getClientRects`); (ד) אין שורה בודדת בתחתית/בראש טור; (ה) `footnote-area` אינו חורג מתחתית העמוד. בסביבה שבה נכתב המסמך אין דפדפן.
3. **פער S6:** מעבר "re-fit" בסוף עמוד אחרי `flushFootnotesInto`: אם התוכן חורג מ-`remPageHeight − reserve` — להחזיר את השורות/הפסקה האחרונות לתור ולעבור לעמוד הבא.
4. **אכיפה קשיחה** של "אין חריגה" (היום: קנס ×2000, לא איסור).
5. **זוג קשור רחב מהטור:** למדוד את רוחב הזוג; אם גדול מרוחב הטור — לוותר על הקשירה.
6. **הערות צד:** (א) אלגוריתם דחיפה כלפי מטה עם `minTop` לכל הערה, גם כשאינה חורגת מתחתית הבלוק; (ב) ניקוי `pagePendingNotes` אחרי `balanceColumns`; (ג) צבירת כותרות 7 רצופות.
7. **כפתור "עדכן ועמד מחדש":** נתיב מיידי (בלי debounce) והשארת ה-debounce לקריאות עקיפות.
8. **איחוד שערי JSON:** לשחזר עם קובצי JSON אמיתיים; לוודא ייחודיות `id` בכלי האריזה (לשרשר אינדקס/hash); לברר מהמשתמש האם התפריט מציג את הערכה המאוחדת או שהשערים ריקים.
9. **ביצועים:** מטמון ל-`getLinesFromParagraph`; הגבלת מועמדי הפיצול בסביבת הפיצול הנוכחי; פרופיילינג אמיתי לפני אופטימיזציה.
10. **הערת שוליים ארוכה מעמוד:** פיצול הערה בין עמודים (כיום לא קיים).
11. **פריסת "טקסט קודש מול פירושים"** — אם נדרש: להגדיר דרישות (לא קיים מנוע לכך).
12. **יישור גובה "מילה ראשונה"** (קצה עליון של אותיות מול גוף הטקסט).
13. **הצלבה הפוכה של בקרות מתות** (מזהי HTML שלא נקראים) כבדיקה קבועה, עם הכרה במזהים דינמיים (`prefix + '-w'`).

### 6.3 דרישות המשתמש שנרשמו בשיחה ומצבן

| דרישה (לפי הודעות המשתמש) | מצב |
|---|---|
| פיצול לוח צד ל-2 חלקים, סימוני מעבר עמוד בטקסט, גלילה בלחיצה על עמוד, הרחבה/כיווץ, ייבוא קובץ טקסט, זום אוטומטי לרוחב | מומש ב-L-A. ב-combined: עורך `contenteditable` + `--preview-scale` (מימוש שונה) |
| כותרות עליונות מתחלפות: יישור חיצוני/פנימי/מרכזי; גופן מתחלף | מומש |
| שם ספר חצי/חצי כמתג (מבטל מתחלפות) | מומש (`hdr-title-split`) |
| התאמת רוחב עיטור לכותרת 2 | מומש (JS), תוזמן מחדש סינכרונית |
| קו מפריד בין טורים: קצה תחתון | תוקן (`calc(100% - 8px)`) |
| ללא עימוד אוטומטי בכל שינוי הגדרה | מומש (ובדיקת קריאות עקיפות; debounce) |
| שמירת מיקום תיבת טקסט לכל שער, בתוך קובץ ה-JSON | מומש (`box` מוטמע + ייצוא) |
| גובה "מילה ראשונה" מיושר לגוף הטקסט | **לא מומש** |
| עיטורי כותרת 3 מיושרים למרכז הגופן; מרווחי עיטורי כותרת 2 שווים | מומש (`margin-top:-0.08em`, איפוס `margin-top` בתחתון) |
| גודל עיטור סוף פרק לפי ההגדרות | מומש |
| קו מפריד בין כותרות עליונות לגוף (ללא/אפור/שחור) | מומש |
| גופן להערות שוליים/סיום + יישור שורה אחרונה | מומש (`f-note-body`, `s-note-body`, `body-last-line-align`) |
| עיטור נפרד ל"סימן" ולכותרת 2, כולל צדדי | מומש |
| התחלת מספור בערך אחר; אילו עמודים נספרים ומציגים מספר | מומש (`page-num-initial-value`, זוגות `count/show` לשערים) |
| שערי JSON מאוחדים (ערכה שלמה) | **חלקי/פתוח** (F-10) |

### 6.4 הנחיות ל-AI הבא

1. **אל תריץ את מנוע העימוד ב-jsdom** (OOM, F-03). בדיקות לוגיקה: שליפת פונקציות ל-`vm` + מודל layout (סעיף 5.2).
2. **אל תקבע "שורש הבעיה" לפני אישור בדפדפן.** סמן כל טענה ברמת ביסוס (סעיף 0.1). חמש אבחנות בשיחה זו התבררו כשגויות או חלקיות (F-07, F-08, F-11, F-15, F-21).
3. **בכל שינוי שמזיז חיתוך, גובה או תוכן — החל מחדש את כל ההגנות** לפי מטריצת 2.5.4. אחרי `balanceColumns`, אחרי התאמת עיטורים, ואחרי גדילת שטח הערות.
4. **כל אלמנט שצורך גובה** חייב להיות ב-DOM ובגודלו הסופי **לפני** חישוב `used` / `spanHeight` / `remPageHeight`. אל תוסיף פוסט-פרוסס שמשנה גובה אחרי העימוד.
5. **אל תחזיר הפעלת עימוד אוטומטית לבקרות.** כל פעולה חדשה שקוראת ל-`typesetDocument()` עקיפות — לבדוק (F-06).
6. **בקרה בממשק חייבת להיות מחוברת לקוד** (F-13, F-19, F-09). לפני הוספת בקרה: מי קורא אותה? אחרי הוספה: הצלבה הפוכה.
7. **מקור אחד לכל ממד שהמשתמש שולט בו** (F-09): לא `!important` מול inline style.
8. **שמור עבודה ל-`/mnt/user-data/outputs` אחרי כל שינוי** (איפוס קונטיינר, F-18). אל תעתיק מ-outputs על קובץ עבודה שלא נשמר.
9. **מגבלת האינטראקציה של המשתמש:** המשתמש ביקש במפורש לסיים (גם חלקית) ולהחזיר הודעת עדכון (תור 8). "המשך!!!" פירושו: להמשיך עבודה מהנקודה שנקטעה. אל תחזור על עבודה שכבר נעשתה.
10. **סגנון תשובות:** עברית, טכני, ללא שיווק; לציין במפורש מה לא נבדק בדפדפן.
11. **אל תעמיק את התלות ב-DOM:** כל קוד חדש שמודד גובה/רוחב צריך לעבור דרך פונקציית מדידה אחת (כך שניתן להחליפה במימוש מתמטי, סעיף 6.5), לא לקרוא `offsetHeight` בפיזור.
12. **בקשות המשתמש שטרם נענו / מידע חסר ממנו:** תסמין איחוד JSON (תפריט או שערים ריקים); האם בעיית עמוד פתיחת כותרת 2 נשארת אחרי `fitOneHeadingOrnament`; צילומי מסך של עמוד עם הערות שוליים ארוכות.

### 6.5 מסלול למנוע עימוד דטרמיניסטי ללא דפדפן (לפי `CLAUDE.md`)

**הכל בסעיף זה הצעה; דבר מזה לא מומש ולא נבדק.** לא נבדק גם אם הסביבה מאפשרת התקנת ספריות WASM (הרשת מאפשרת את רישום npm, לא נוסה).

| שלב | תוכן | פלט / קריטריון קבלה |
|---|---|---|
| 1. ממשק מדידה יחיד | להחליף את כל קריאות ה-`offsetHeight`/`scrollHeight` בקריאות ל-`measureParagraph(text, widthPx, fontSpec, opts) → {lines:[{words:[{text,x,w}],width}], lineHeight}` ול-`blockHeight(...)`. מימוש א' = הקוד הנוכחי (DOM). מימוש ב' = מתמטי. | אותה חתימה; אפשר להחליף מימוש בלי לגעת בלולאת העימוד |
| 2. מטריקות גופן | קריאת קבצי הגופן (TTF/OTF/WOFF2) והפקת רוחבי glyph, kerning ו-GSUB/GPOS לעברית (ניקוד וטעמים: mark positioning). שייפינג עם HarfBuzz (WASM); מטריקות בסיס עם fontkit / opentype.js. **לא** `canvas.measureText` (תלוי דפדפן). | רוחב מילה זהה לרוחב ב-Chromium בסטייה ≤ 0.01px על כל מילות המסמך הדוגמה |
| 3. שבירת שורות | חמדן שמשחזר את הדפדפן (שבירה ברווח; NBSP ו-`\uE000` כיחידה). אופציונלי: Knuth–Plass, שמייתר קשירת NBSP. | אותן שורות כמו המימוש הא' על המסמך האמיתי (0 הבדלים) |
| 4. מודל גאומטרי | מערך `{type,page,col,x,y,w,h,tokenId,lineIndex}` לכל מילה/שורה/טור/עיטור/מפריד/הערת צד/אזור הערות. תקציב גובה: `h = lines × lineHeight + margins`. | אין קריאה ל-DOM בלולאת העימוד |
| 5. `test-suite.js` | פונקציות טהורות על המערך: `columnHeightDelta`, `loneLineAtColumnBottom/Top`, `headingAtColumnEnd`, `runtWordLastLine`, `overflowBeyondFrame`, `overlap` (הערות צד, עיטורים, אזור הערות), `ornamentAnchor` (שער/מפריד מול המסגרת), `lineSpacingUniform`. מטריצת ההגנות (2.5.4) הופכת לסט בדיקות. | כל בדיקה מחזירה רשימת הפרות עם קואורדינטות |
| 6. פלט | PDF וקטורי ב-Node (pdf-lib / PDFKit) עם הטמעת subset של הגופנים והצבת glyph runs לפי המערך (RTL). HTML ממשיך כצופה. | PDF נוצר ללא דפדפן |
| 7. מעבר | להריץ את שני המימושים על `חלק_ההקדמה_סדר_חדש.txt`; להשוות שורות לכל פסקה ומספר עמודים; להחליף רק ב-0 הבדלים. | דוח שקילות |

**סיכונים ידועים:** גופני מערכת (`queryLocalFonts`) אינם זמינים ב-Node, ולכן נדרש לשמור קבצי גופן בפרויקט; `text-align: justify` משפיע רק על הרינדור ולא על שבירת שורות; ניקוד וטעמים דורשים GPOS נכון; הסתמכות המערכת על הפרשים של פיקסלים בודדים (`8px`, `−10`, `+4`, `24`) צריכה להיות מוחלפת בנוסחאות מפורשות.

---

## נספח א — קוד הבדיקות

### `test_logic.js`

```js
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync('typesetter.js', 'utf8');

function blockEnd(s, start) {
  let i = s.indexOf('{', start), d = 0;
  for (let j = i; j < s.length; j++) { if (s[j]==='{') d++; else if (s[j]==='}') { d--; if (d===0) return j+1; } }
  throw new Error('unbalanced');
}
function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) throw new Error('missing ' + name);
  return src.slice(i, blockEnd(src, i));
}
const names = ['joinMeasuredLine','getLinesFromParagraph','adjustFitLineForNoteSpans','resolveParagraphCut','trailingHeadingCount','popTrailingHeadings'];
const code = names.map(grab).join('\n\n');

// ---------- mock DOM with a deterministic greedy line-layout model ----------
const CH = 10, SP = 5, LH = 20;
function makeEnv(opts) {
  const settings = Object.assign({ runt: true, mode: 'none' }, opts || {});
  let W = 200;
  const spans = {};
  function layoutUnits(tokens, width) {           // tokens: {w, nbspNext}
    const units = []; let cur = null;
    tokens.forEach(t => { if (cur && cur.link) { cur.tokens.push(t); cur.w += SP + t.w; cur.link = t.nbspNext; } else { cur = { tokens:[t], w:t.w, link:t.nbspNext }; units.push(cur); } });
    const lineOf = []; let line = 0, used = 0;
    units.forEach(u => { if (used > 0 && used + SP + u.w > width) { line++; used = 0; } used += (used>0?SP:0) + u.w; u.tokens.forEach(t => lineOf.push(line)); });
    return lineOf;
  }
  const container = { style: {}, _html: '', set innerHTML(h) { this._html = h; }, get innerHTML() { return this._html; }, appendChild() {} };
  const pMeasure = { style:{}, _t:'',
    set textContent(t){ this._t=t; },
    set innerHTML(h) { for (const k in spans) delete spans[k];
      const re = /<span[^>]*id="mw-(\d+)"[^>]*>(.*?)<\/span>(&nbsp;| )/g; let m; const toks = [];
      while ((m = re.exec(h))) toks.push({ id: +m[1], w: m[2].length*CH, nbspNext: m[3] === '&nbsp;' });
      const lines = layoutUnits(toks, W); toks.forEach((t, k) => { spans[t.id] = { offsetTop: lines[k]*LH }; }); },
    get offsetHeight(){
      if (this._t === 'א') return LH;
      const toks = this._t.split(/\s+/).filter(Boolean).map(w => ({ w: w.length*CH, nbspNext:false }));
      const ls = layoutUnits(toks, W); return (Math.max(...ls)+1)*LH; } };
  const document = {
    getElementById(id) {
      if (id === 'measuring-box') { return Object.assign(container, { setW(x){ W = x; } }); }
      if (id === 'avoid-runt-word') return settings.runt === null ? null : { checked: settings.runt };
      if (id === 'drop-word-mode') return { value: settings.mode };
      const m = /^mw-(\d+)$/.exec(id); if (m) return spans[+m[1]] || null;
      return null;
    },
    createElement() { return pMeasure; }
  };
  const ctx = { document, console, Math, parseInt, RegExp,
    findDelimiterMatches(text) { const out=[]; const re=/\[[\s\S]*?\]/g; let m; while((m=re.exec(text))) out.push({start:m.index,end:m.index+m[0].length}); return out; } };
  // widen container to colWidth: patch style.width setter -> W
  Object.defineProperty(container.style, 'width', { set(v){ W = parseInt(v,10); }, get(){ return W+'px'; }, configurable:true });
  vm.createContext(ctx); vm.runInContext(code, ctx);
  return ctx;
}

let pass = 0, fail = 0;
function eq(label, got, want) { const ok = JSON.stringify(got) === JSON.stringify(want); (ok?pass++:fail++); console.log((ok?'PASS':'FAIL') + ' - ' + label + (ok?'':`\n     got:  ${JSON.stringify(got)}\n     want: ${JSON.stringify(want)}`)); }
const NB = '\u00A0';
const style = { fontFamily:'x', fontSize:'1', lineHeight:'1' };
const words9 = 'aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii';   // 9 words x 4 chars: 4 words/line unbound -> 4,4,1 (runt)

// ---- word-level runt prevention ----
let env = makeEnv({ runt: false });
let r = env.getLinesFromParagraph(words9, 200, style, false);
eq('runt OFF: reproduces the lone last word (4,4,1)', r.lines, ['aaaa bbbb cccc dddd','eeee ffff gggg hhhh','iiii']);

env = makeEnv({ runt: true });
r = env.getLinesFromParagraph(words9, 200, style, false);
eq('runt ON: same number of lines (no height change)', r.lines.length, 3);
eq('runt ON: last line has two words bound with NBSP', r.lines[2], 'hhhh'+NB+'iiii');
eq('runt ON: previous line lost only the moved word', r.lines[1], 'eeee ffff gggg');
eq('runt ON: no words lost or duplicated', r.lines.join(' ').split(/[\s\u00A0]+/), words9.split(' '));

env = makeEnv({ runt: true });
r = env.getLinesFromParagraph('aaaa bbbb', 200, style, false);
eq('2-word paragraph: no binding applied', r.lines, ['aaaa bbbb']);

env = makeEnv({ runt: true });
r = env.getLinesFromParagraph('aaaa bbbb cccc dddd eeee ffff gggg', 200, style, false);   // 7 words -> 4,3 (no runt)
eq('no runt originally: lines unchanged except NBSP inside last pair', r.lines, ['aaaa bbbb cccc dddd','eeee ffff'+NB+'gggg']);

env = makeEnv({ runt: null });
r = env.getLinesFromParagraph(words9, 200, style, false);
eq('toggle element missing -> defaults to ON', r.lines[2], 'hhhh'+NB+'iiii');

// ---- paragraph cut resolver (widow/orphan rule interplay) ----
const L = n => Array.from({length:n}, (_, i) => 'line'+i);
env = makeEnv();
const cut = (n, fit, above, w, o, lines) => env.resolveParagraphCut(lines || L(n), fit, above, w, o);
eq('3 lines, 2 fit, content above, both rules -> push whole paragraph (old code left 1 | 2)', cut(3,2,true,true,true), 0);
eq('3 lines, 1 fit, content above, widow rule -> push whole', cut(3,1,true,true,true), 0);
eq('4 lines, 3 fit, orphan rule -> keep 2 (leave 2)', cut(4,3,true,true,true), 2);
eq('5 lines, 2 fit -> unchanged', cut(5,2,true,true,true), 2);
eq('2 lines, 1 fit, content above -> push whole', cut(2,1,true,true,true), 0);
eq('2 lines, 1 fit, NOTHING above -> forced progress (keep 1)', cut(2,1,false,true,true), 1);
eq('3 lines, 2 fit, nothing above -> orphan rule gives 1 (progress guaranteed)', cut(3,2,false,true,true), 1);
eq('whole paragraph fits', cut(6,6,true,true,true), 6);
eq('nothing fits', cut(6,0,true,true,true), 0);
eq('widow rule OFF, orphan rule ON: 3 lines/2 fit -> keep 1 (leaving 2 is what the user asked for)', cut(3,2,true,false,true), 1);
eq('widow OFF, orphan ON: 2 lines/1 fit/content above -> push (leaving 1 line is forbidden)', cut(2,1,true,false,true), 0);
eq('both rules OFF: untouched', cut(3,2,true,false,false), 2);
const noteLines = ['a [b','c] d','e','f'];
eq('cut inside a footnote moves out of it, and result is re-validated (3 | 1 would be a lone line)', cut(4,1,true,true,true,noteLines), 2);

// ---- trailing heading ("orphan heading") helpers ----
function fakeCol(classes) { const kids = classes.map(c => ({ className:c, previousElementSibling:null })); kids.forEach((k,i)=>k.previousElementSibling = kids[i-1]||null);
  return { children: kids, get lastElementChild(){ return kids[kids.length-1]||null; }, removeChild(el){ const i=kids.indexOf(el); kids.splice(i,1); } }; }
let col = fakeCol(['p-end','title-level-4','title-level-5']);
eq('counts consecutive trailing headings', env.trailingHeadingCount(col), 2);
eq('pops them all and reports how many tokens to give back', env.popTrailingHeadings(col), 2);
eq('paragraph above is preserved', col.children.map(k=>k.className), ['p-end']);
col = fakeCol(['title-level-4','p-cut']);
eq('column ending in a paragraph: nothing popped', env.popTrailingHeadings(col), 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

### `test_reserve.js`

```js
const fs=require('fs'),vm=require('vm');const src=fs.readFileSync('typesetter.js','utf8');
function be(s,st){let i=s.indexOf('{',st),d=0;for(let j=i;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'){d--;if(d===0)return j+1}}}
function grab(n){const i=src.indexOf('function '+n+'(');return src.slice(i,be(src,i))}
let title='', cols='';
const ctx={document:{getElementById:id=>id==='fn-title-text'?{value:title}:id==='fn-columns'?{value:cols}:null},
  getNoteConfig:()=>({columns:2}), measureNoteBlockHeight:(q,c)=>q.length*20/c};
vm.createContext(ctx); vm.runInContext(grab('getFootnoteColCount')+grab('footnoteReserveFor'),ctx);
let p=0,f=0; const eq=(l,g,w)=>{const ok=g===w;ok?p++:f++;console.log((ok?'PASS':'FAIL')+' - '+l+(ok?'':` got ${g} want ${w}`))};
const q=[{},{},{},{}];
eq('no title, cfg columns=2 -> 40+24', ctx.footnoteReserveFor(q, ctx.getFootnoteColCount('x')), 4*20/2+24);
title='כותרת'; eq('with block title -> +24 (the probe used to omit this)', ctx.footnoteReserveFor(q, ctx.getFootnoteColCount('x')), 4*20/2+24+24);
cols='1'; eq('fn-columns override wins over per-style columns', ctx.getFootnoteColCount('x'), 1);
cols=''; eq('falls back to per-style columns', ctx.getFootnoteColCount('x'), 2);
console.log(`${p} passed, ${f} failed`); process.exit(f?1:0);
```

---

## נספח ב — ציר זמן הבקשות (מתוך התמליל המלא)

| תאריך | בקשה / אירוע |
|---|---|
| 2026-09-08 | בקשה ראשונית: פיצול לוח הצד לשני חלקים (אזור הדבקה + לוח הגדרות מתקפל), סימוני מעבר עמוד בתוך הטקסט, גלילה לטקסט בלחיצה על עמוד, ייבוא קובץ טקסט, זום אוטומטי לרוחב. (L-A) |
| 2026-09-09 | המשתמש העלה גרסה שהתקדמה עם AI אחר (+ שיחה), וביקש ביקורת ושיפור תוך מודעות למגבלת האינטראקציה שלו. (L-B) |
| 2026-09-09/10 | רשימת בעיות: כותרות מתחלפות, שם ספר חצי/חצי, התאמת עיטור לרוחב כותרת, קו מפריד בין טורים, איחוד שערי JSON, גופנים שנעלמו, עיטור כותרת עליונה גדול, קיפאון בעת שינוי הגדרות, גלישת לוח הגדרות. |
| 2026-09-10 | חשד שה-AI האחר פגע במנוע: איזון טורים, מניעת כותרות בסוף טור, גובה עמוד כותרת 2, הגדרות שמחילות בלי "עדכן". בקשה לשמירת כיוונון תיבת שער בתוך קובץ ה-JSON. |
| 2026-09-10 | רשימה גדולה: גובה "מילה ראשונה", גופן בכותרות מתחלפות, טקסט שער אחורי, יישור טורים, עיטורי כותרת 2/3, גופן להערות, "סימן" נפרד מכותרת 2, מספור לפי סוג עמוד. |
| 2026-09-11 | "יישור הטורים לא עבד" (תמונות); סבב נוסף. |
| 2026-09-13 | המשתמש מצא את שורש בעיית היישור ותיקן בעצמו; העלה את הקובץ. |
| 2026-09-14 | בקשה לניסוי על מסמך אמיתי (טוקנייזר: 701 טוקנים). |
| 2026-09-15 | "היישור נראה מעולה", ודיווח על עמוד פתיחת כותרת 2 (3 צילומים). |
| בהמשך | דיווח: הבעיה לא נפתרה; הגדרת גובה עיטור אינה משפיעה. העלאת 4 גרסאות + דוח השוואה + גרסה משולבת לחוות דעה. בקשת בדיקה חוזרת עם דגש על אלמנות/יתומות (מילים וכותרות) והחלתן אחרי כל שלב. בקשת מסמך זה. |
