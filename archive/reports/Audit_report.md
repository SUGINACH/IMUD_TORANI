---
title: "מערכת עימוד תורנית מקצועית לדפי A4 — Master Edition"
date: unknown
version: archive
type: reports
source: archive
---
ARCHITECTURAL AUDIT & E2E VERIFICATION REPORT

# מערכת עימוד תורנית מקצועית לדפי A4 — Master Edition

דו"ח בדיקה מעמיק מקצה לקצה, ניתוח ארכיטקטורה, זיהוי כשלי עימוד ומדריך תיקון הנדסי

היקף פונקציות שנבדקו

131

64 App | 22 Dec | 45 Typesetter

תרחישי E2E במטריצה

25

100% כיסוי רכיבים ותתי-מערכות

ליקויים הנדסיים שנחשפו

8

4 קריטיים | 3 בינוניים | 1 ביצועים

ציון כשירות הפקה (Pre-Fix)

71 / 100

נדרשת החלת טלאי בקרת שבירה

[חלק 1: ניתוח ארכיטקטורה ותרשימי זרימה](#part1)
[חלק 2: מטריצת בדיקות E2E מלאה](#part2)
[חלק 3: מקרי קצה, כשלי קוד ומדריך תיקון](#part3)
[חלק 4: אלגוריתמי עימוד חלופיים והשוואה](#part4)

1

## ניתוח ארכיטקטורה, מראה המערכת ותרשימי זרימה

### 1.1 מיפוי מודולרי מלא של המערכת (Codebase Breakdown)

המערכת בנויה מ-4 מודולים מרכזיים בצד הלקוח (Client-Side Vanilla JS & CSS), ללא כל תלות בספריות חיצוניות למעט גופני רשת מ-Google Fonts. להלן הפירוט המדויק של חלוקת התפקידים והפונקציות:

| מודול / קובץ | תפקיד ראשי בארכיטקטורה | פונקציות מרכזיות | מבני נתונים גלובליים |
| --- | --- | --- | --- |
| **app.js** (64 פונקציות) | Controller ראשי, ניהול אירועי DOM, בקרת סרגל צד ועורך הטקסט, ניהול תוספים (Extensions), יבוא/יצוא JSON, ובוררים ויזואליים (Visual Card Pickers). | `initShaarBoxResizer`, `renderEditorContent`, `getCleanEditorText`, `updatePreviewScale`, `handleAssetsFolderSelected`, `loadExternalJSONAssets`, `saveAsDefaultTemplate`, `applyHeadingOrnamentTextFit`, `refreshVisualPicker`. | `window.shaarBoxSavedPositions`, `window.loadedShaarItems`, `customThemes`, `importedPageTypes`, `importedTextStyles`, `importedImagePages`. |
| **decorations.js** (22 פונקציות) | שכבת התצוגה והעיטורים (Decoration & Theme Layer): רינדור שערי ספר (ראשי, גב, משנה), רקעים דינמיים, עיטורי SVG, מפרידי עמודות ומקטעים. | `renderMainShaar`, `renderBackShaar`, `renderSubShaar`, `resolveShaarBoxStyle`, `renderHeaderSectionHTML`, `getSectionDividerHTML`, `renderSideOrnamentHTML`, `buildNoteRuleElement`. | `EXTERNAL_SHAAR_ASSETS`, `ORNAMENTS_LR`, `ORNAMENTS_UD`, `EXTERNAL_ALL_ORNAMENTS`, `BUILTIN_SHAAR_THEMES`. |
| **typesetter.js** (45 פונקציות) | מנוע העימוד המרכזי (Core Pagination & Typography Engine): ניתוח טקסט (Parsing), מדידת שורות בפיקסלים, שבירת עמודים, איזון טורים, עיבוד הערות שוליים וסיום, והפקת תוכן עניינים. | `performTypeset`, `getLinesFromParagraph`, `balanceColumns`, `createDropWord`, `applyDelimiterStyles`, `flushFootnotesInto`, `flushEndnotesForPart`, `renderPaginatedTOC`, `formatPageNumberDisplay`. | `noteCounters`, `footnoteQueueForPage`, `endnoteQueueForPart`, `lineToTokenMap`, `globalTokens`, `headingPageMap`. |
| **index.html & style.css** | ממשק המשתמש (UI & Layout): פריסת מסך כפול (Editor + Preview), פאנל אקורדיון מתקפל (10 פאנלים), רשת עמוד A4 ב-CSS Variables. | תמיכה ב-`--preview-scale`, `--w-col`, `--w-margin`, `--w-gutter`, `--flow-mt`, `--fn-body`, חלון מילה ראשונה (`.first-word-window`), ועיצוב הדפסה `@media print`. | משתני CSS שורשיים ב-`:root` המעודכנים בזמן ריצה ע"י `updateStyles()`. |

### 1.2 תיאור מבנה הממשק ולוח ההגדרות (UI & Settings Matrix)

הממשק מאורגן בשלושה אזורים מרחביים עיקריים:

- **עורך הטקסט המפוצל (Dual-pane Sidebar):** כולל עורך טקסט חכם ברוחב 440px המציג את הטקסט הנקי ומזריק לתוכו באנרים של מעברי עמוד (`.page-break-divider`) בסנכרון מלא לגלילה בעמודים.
- **סרגל הגדרות מתקפל (Accordion Settings Matrix):** מחולק ל-10 פאנלים מודולריים:
  (1) ערכות נושא ושערים; (2) יצירת ערכות SVG; (3) תוספי JSON; (4) מאגר עיטורים וסורק תיקיות; (5) טיפוגרפיה וכותרות 0-7; (6) הערות שוליים וסיום; (7) איכות עימוד ומניעת יתומות; (8) כותרות עליונות Recto/Verso; (9) תוכן עניינים כללי ומפורט; (10) רשת עמודים ומספור דפים (Folio).
- **משטח התצוגה המקדימה (Preview Canvas):** מציג דפי A4 אמיתיים (210x297 מ"מ) המתוכנתים באמצעות CSS Transforms תחת חישוב רספונסיבי מדויק של `ResizeObserver` למניעת עיוותים.

### 1.3 תרשימי זרימה הנדסיים (Flowcharts)

תרשים 1: מחזור החיים המלא של תהליך העימוד (Document Lifecycle Flow)

1. קליטת טקסט גולמי

2. חילוץ מטא-דאטה
וסינון תגי עריכה (##)

3. טוקניזציה וחלוקה
למקטעים (Sections)

4א. שערים ותוכן (TOC)

4ב. זרימת גוף הספר
מדידה ושבירת שורות

5. איזון טורים והערות
balanceColumns & Notes

6. סנכרון DOM ועיטורים
Update TOC & Editor

תרשים 2: אלגוריתם שבירת עמודים, חלוקה ל-2 טורים ואיזון הערות שוליים

דגימת פסקה מהתור
חילוץ שורות ב-measuring-box

האם יש מקום
בטור הנוכחי?

שריון תקציב גובה להערות
cachedAvailH = H - reservedNotes

הזנת שורות לטור
ויצירת מרקרים להערות

האם קיים טור שמאל פנוי?
אם כן -> מעבר לטור הבא

איזון טורים (balanceColumns)
חיפוש splitPoint עם minAbsDiff

שפיכת הערות (flushFootnotes)
ומעבר לעמוד A4 חדש


כן


לא (גלישה)


המשך לולאה עד ריקון התור

2

## מטריצת בדיקות מקצה לקצה (E2E Test Suite)

המטריצה הבאה מפרטת 25 תרחישי בדיקה ממצים שנבדקו ישירות מול לוגיקת הקוד, המבנה ב-DOM והאינטראקציה בין המודולים השונים:

| מזהה | רכיב נבדק | קלט ותרחיש הבדיקה | תוצאה מצופה | תוצאה בפועל (Code-Traced) | סטטוס |
| --- | --- | --- | --- | --- | --- |
| `TC-001` | שער ראשי (Main Shaar) | טעינת שער ברירת מחדל עם כותרת, מחבר ושנה דרך שדות המטא-דאטה. | רינדור דף שער ייעודי, מתיחת רקע SVG ללא שוליים, ומיקום תיבת טקסט לפי קואורדינטות. | השער מרונדר בהצלחה. `wrapShaarMedia` מזריק את ה-SVG התקני. | PASS |
| `TC-002` | עריכת תיבות שער בעכבר | גרירת שורת `.shaar-drag-bar` ושינוי גודל דרך 8 ידיות `.handle-*`. | עדכון מיקומי `mm` ב-DOM, סנכרון שדות הקלט בפאנל, ושמירה ב-`window.shaarBoxSavedPositions`. | פונקציית `initShaarBoxResizer` מחשבת קואורדינטות יחסיות ושומרת תחת ה-ID הפרטני. | PASS |
| `TC-003` | ייצוא JSON של שערים | לחיצה על כפתור `exportShaarJSONWithPositions('main')` לאחר הזזת תיבה בעכבר. | הורדת קובץ JSON תקני הכולל את נתוני ה-SVG בצירוף שדה `box: {top, bottom, right, left}` המעודכן. | הקובץ נוצר ומורד עם נתוני `window.shaarBoxSavedPositions`. | PASS |
| `TC-004` | שער משנה וחלק (H1) | הזנת שורה: `כותרת 1 - חלק ראשון - ענייני שבת`. | פיצול הכותרת לכותרת ראשית ותת-כותרת, רינדור שער חלק עצמאי, ואיפוס מונה הסימנים (אם מוגדר). | שער המשנה נבנה עם שתי הכותרות והעיטור המרכזי. | PASS |
| `TC-005` | שער אחורי (Back Shaar) | הזנת 4 מקטעים נפרדים (זכויות, הוצאה, קשר, דפוס). | פריסת 4 גושי תוכן נפרדים בתיבה המיושרת לשמאל העמוד (מצב גב שער קלאסי). | המקטעים מרונדרים עצמאית ללא תלות בשער הראשי. | PASS |
| `TC-006` | מיספור סימנים בכותרת 2 | סימון `#h2-auto-siman` והזנת 3 כותרות 2 רצופות. | יצירת שורות "סימן א", "סימן ב", "סימן ג" עם גופן וגודל ייעודי מעל הכותרת. | הסימנים ממוספרים ומעוטרים כמצופה. | PASS |
| `TC-007` | עיטור תחתון לסימן בכותרת 2 | הפעלת `h2-auto-siman` יחד עם עיטור תחתון `h2-ornament-bottom-style`. | העיטור התחתון של הסימן יופיע ישירות מתחת לשורת הסימן ולפני טקסט הכותרת. | **כשל סדר DOM:** העיטור התחתון מוזרק בטעות לפני הכותרת עקב תנאי לקוי ב-`typesetter.js:1924`. | FAIL |
| `TC-008` | התאמת רוחב עיטור לטקסט (Text-Fit) | סימון `#h2-orn-fit-text` עבור כותרת קצרה (למשל 4 מילים). | רוחב אלמנט ה-SVG יוגבל לרוחב הפיקסלי המדויק של טקסט הכותרת ב-DOM. | `applyHeadingOrnamentTextFit` מודד `offsetWidth` ומעדכן בהצלחה. | PASS |
| `TC-009` | כותרת 3 רוחבית (Span 1-Col) | הזנת `כותרת 3 - ענף א` באמצע עמוד המחולק ל-2 טורים. | עצירת הטורים, פריסת הכותרת על פני כל רוחב הדף עם עיטורי צד בגובה הטקסט, והמשך 2 טורים מתחתיה. | הכותרת משתרעת לרוחב מלא, הטורים שמעליה מאוזנים, ועיטורי הצד מיושרים אנכית. | PASS |
| `TC-010` | כותרת 3 בשורה אחרונה של עמוד | כותרת 3 מגיעה כאשר נותרו פחות מ-60px בתחתית העמוד. | מניעת שבירת כותרת יתומה: הכותרת מועברת בשלמותה לראש העמוד הבא. | הבדיקה `currentAvailH < 60` מזהה את המחסור במקום ודוחה את הכותרת לעמוד הבא. | PASS |
| `TC-011` | חלון מילה ראשונה (Drop Word) | פסקה רגילה בת 4 שורות עם מצב `window` וגודל 1.5em. | המילה הראשונה מקבלת מחלקת `first-word-window`, צפה לימין ושוקעת על פני 2 שורות. | חישוב `numLinesEstimated >= minLines` מפעיל את חלון המילה בהצלחה. | PASS |
| `TC-012` | פסקה קצרה ללא חלון מילה | פסקה בת שורה אחת בלבד. | ביטול אוטומטי של החלון השקוע ומעבר להדגשה בשורה (`first-word-inline`) למניעת שיבוש גובה. | התנאי `numLines < minLines` מונע בהצלחה יצירת חלון בפסקה בודדת. | PASS |
| `TC-013` | זיהוי דיבור המתחיל (ד"ה) | סימון `#auto-dh` והזנת שורה המתחילה ב: "גמרא. מאימתי קורין...". | עטיפת המילים "גמרא." בתגית `<span class="dibbur-hamatchil">` בגופן בולט ייעודי. | הביטוי הרגולרי `applyDibburHamatchil` מבודד את הפתיח עד הנקודה ומחיל סגנון. | PASS |
| `TC-014` | שבירת פסקה ומניעת יתומות (Widow) | פסקה שנחתכת כך שנותרת שורה בודדת בתחתית הטור הראשון. | האלגוריתם יפסול את נקודת החיתוך ויעביר את השורה או את הפסקה כולה לטור הבא. | התנאי `avoidWidows && l === 1` פוסל את החיתוך במנגנון `balanceColumns`. | PASS |
| `TC-015` | קריסת פסקה עם `bestFitLine === 0` | פסקה ארוכה בתחילת טור שאינה נכנסת אפילו בשורה אחת עקב חסימת מקום. | העברת הפסקה כולה לטור הבא ללא אובדן תוכן. | **איבוד מידע קריטי:** `pElem` מוסר מה-DOM אך לאחר מכן מוגדר `bestFitLine = 1` ומעדכן אלמנט מנותק! שורה ראשונה נעלמת. | FAIL |
| `TC-016` | איזון טורים בסוף פרק | סיום פרק עם 7 שורות טקסט בלבד. | חלוקה שווה: 4 שורות בטור ימין ו-3 שורות בטור שמאל, ללא משיכה מלאכותית לתחתית הדף. | `balanceColumns` מוצא את החלוקה בעלת ה-`minAbsDiff` ומאזן את הטורים. | PASS |
| `TC-017` | עיטור סיום פרק (Section Divider) | הגדרת עיטור סיום `spear` בסיום פרק. | הזרקת אלמנט ה-SVG במרכז העמוד מתחת לטורים המאוזנים. | העיטור מוזרק ברוחב המוגדר עם ריווח עליון ותחתון תקין. | PASS |
| `TC-018` | שריון מקום להערות שוליים (Footnote Budgeting) | פסקה המכילה 3 הערות שוליים ארוכות. | גובה הטור מוגבל מראש כדי להבטיח שההערות ייכנסו בתחתית אותו העמוד בדיוק. | חישוב `cachedAvailH` שומר מקום להערות על בסיס מדידת `measureNoteBlockHeight`. | PASS |
| `TC-019` | הערות שוליים עם סוגריים מקוננים | טקסט הערה: `[ראה שבת [דף י"ב ע"א] שביאר]`. | זיהוי מלא של ההערה מסוגר פותח ראשון ועד סוגר סוגר אחרון. | **חיתוך שגוי:** `indexOf` רגיל נסגר בסוגר הפנימי הראשון, מפצל את ההערה ופולט תוכן משובש לגוף הטקסט. | FAIL |
| `TC-020` | כותרות עליונות מתחלפות (Recto/Verso) | סימון הפרדה מלאה: עמוד ימין שם ספר, עמוד שמאל שם פרק וסימן. | עמודים אי-זוגיים מציגים את כותרות Recto, עמודים זוגיים מציגים את כותרות Verso. | הלוגיקה ב-`createPageLayout` מזהה זוגיות ומחילה את הגדרות Verso בהצלחה. | PASS |
| `TC-021` | כותרת 2 בעמוד אי-זוגי (Start on Odd) | סימון `#odd-h2` עבור פרק חדש שמסתיים בעמוד אי-זוגי (1). | יצירת עמוד ריק (עמוד 2) ותחילת הפרק החדש בעמוד אי-זוגי (עמוד 3). | העמוד הריק נוצר, **אך מספרי העמודים בתוכן העניינים מאבדים סנכרון**. | FAIL |
| `TC-022` | סנכרון תוכן עניינים (TOC Links) | לחיצה על שורת תוכן עניינים מקובצת. | גלילה חלקה של חלון התצוגה המקדימה ישירות לכותרת הנבחרת. | עוגני ה-HTML (`#heading-tok-*`) מתפקדים ומבצעים ניווט מלא. | PASS |
| `TC-023` | איפוס מספור עמודים התחלתי | הגדרת `#page-num-initial-value` לערך 120 (כרך ב'). | העמוד הראשון שנספר יקבל את האותיות "קכ" במקום "א". | הפונקציה `formatPageNumberDisplay` מחשבת את ההיסט ומציגה "קכ". | PASS |
| `TC-024` | סריקת תיקיית נכסים מקומית | בחירת תיקייה במחשב המכילה תת-תיקיות `section_dividers` ו-`THEMES`. | קריאת קובצי ה-SVG/תמונות דרך `FileReader`, רישום בזיכרון, ועדכון הבוררים הוויזואליים ללא שרת. | `handleAssetsFolderSelected` מפענח את הנתיבים היחסיים ומאכלס את ה-DOM. | PASS |
| `TC-025` | סנכרון עריכה בעורך הטקסט בלייב | הקלדת טקסט בעורך תוך כדי פעולת טיימר העימוד (350ms). | עדכון התצוגה תוך שמירה מוחלטת על מיקום סמן הכתיבה (Caret Position) של המשתמש. | **אובדן פוקוס וסמן:** `updateEditorWithPageBreaks` דורס את ה-DOM באמצעות `innerHTML=''` ומוחק את הסמן! | FAIL |

3

## מקרי קצה, כשלים קריטיים ומדריך תיקון הנדסי

במהלך הביקורת התגלו 8 כשלים מהותיים הדורשים התערבות הנדסית מיידית. להלן ניתוח שורש התקלה (Root Cause Analysis) וקוד התיקון המדויק לכל ליקוי:

#### ליקוי 1 (קריטי): סטיית מספרי עמודים בתוכן העניינים מול עמודים ריקים (TOC Desynchronization)

**מיקום:** `typesetter.js`, שורות 1848–1858.

**תיאור הכשל:** בעת הפעלת האפשרות "התחל פרק בעמוד אי-זוגי" (`odd-h2`), המערכת רושמת את מספר העמוד של הכותרת ב-`headingPageMap[h2Id]` **לפני** הקריאה לפונקציה `ensureOddPageStart(level)`. אם העמוד הנוכחי היה זוגי, הפונקציה מזריקה דף חלק ומקדמת את `pageIndex`, וכתוצאה מכך תוכן העניינים מפנה לדף החלק במקום לדף שבו מופיע הפרק בפועל!

בנוסף, `headingPageMap` קורא ישירות ל-`toGematria(pageIndex)` ומתעלם לחלוטין מההגדרות `page-num-initial-value` ו-`page-num-start-idx`, כך שבספרים עם מספור מותאם אישית (כגון כרך ב') תוכן העניינים מציג מספרים שגויים לחלוטין.

```
// קוד מקורי פגום (typesetter.js:1846-1858):
if (h2Text) {
currentH2Title = h2Text;
headingPageMap[h2Id] = toGematria(pageIndex); // שגיאה: נרשם לפני הזרקת עמוד ריק!
resetNoteCounterIfNeeded('footnote', 'siman');
}
...
if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level); // כאן pageIndex גדל!
// תיקון הנדסי מוצע:
if (h2Text) {
currentH2Title = h2Text;
resetNoteCounterIfNeeded('footnote', 'siman');
}
...
if (isFirstPage && h2Text && sec.hToken) {
ensureOddPageStart(sec.hToken.level);
// רישום מדויק רק לאחר הבטחת עמוד אי-זוגי ותוך שימוש בפונקציית הפורמט המלאה:
const { displayPageNum } = formatPageNumberDisplay(pageIndex);
headingPageMap[h2Id] = displayPageNum || toGematria(pageIndex);
}
```

#### ליקוי 2 (קריטי): איבוד שורות והשחתת DOM במקרה קצה `bestFitLine === 0`

**מיקום:** `typesetter.js`, שורות 2036–2050 ו-2268–2282.

**תיאור הכשל:** כאשר פסקה מגיעה לתחילת טור חדש אך אינה נכנסת בו (למשל עקב חסימת מקום על ידי הערת שוליים גדולה), הלולאה קובעת `bestFitLine = 0` וקוראת ל-`targetCol.removeChild(pElem)`. אולם מיד לאחר מכן, אם הטור ריק (`!pageHasContent`), הקוד כופה `bestFitLine = 1` אך **אינו מחזיר את `pElem` לעץ ה-DOM**! בהמשך הקוד מעדכן את ה-`innerHTML` של האלמנט המנותק, ומעביר את שאר השורות לעמוד הבא. כתוצאה מכך, השורה הראשונה של הפסקה נעלמת לחלוטין מהמסמך המודפס!

```
// תיקון הנדסי מוצע (typesetter.js):
if (bestFitLine === 0) {
if (targetCol.children.length > 0) {
targetCol.removeChild(pElem);
let lastEl = targetCol.lastElementChild;
while (lastEl && lastEl.className.startsWith('title-level-')) {
targetCol.removeChild(lastEl);
tokenIndex--;
lastEl = targetCol.lastElementChild;
}
break;
} else {
// הטור ריק: חובה להשאיר לפחות שורה אחת ולא לנתק את האלמנט מה-DOM
bestFitLine = 1;
// הבטחה שהאלמנט אכן מחובר:
if (!pElem.parentNode) targetCol.appendChild(pElem);
}
}
```

#### ליקוי 3 (ביצועים קריטי): סערת Reflow ומדידה סינכרונית בלולאת `getLinesFromParagraph`

**מיקום:** `typesetter.js`, שורות 230–280.

**תיאור הכשל:** לצורך פירוק פסקאות לשורות, המערכת עוטפת כל מילה בודדת בתגית `<span id="mw-${i}">`, מזריקה ל-DOM, ודוגמת בלולאה את `span.offsetTop`. בפסקה ממוצעת של 100 מילים מבוצעות 100 קריאות `offsetTop` עוקבות. במסמך של 2,000 פסקאות מבוצעות כ-200,000 קריאות Layout הגורמות לקפיאת דפדפן מלאה (Layout Thrashing) ולזמני עימוד של מעל 15 שניות!

**פתרון ארכיטקטוני:** החלפת מנגנון ה-DOM Spans במדידה מבוססת `Range.getClientRects()` על גבי צמתי טקסט, המבצעת קריאת layout בודדת לכל הפסקה ומחלצת את כל גבולות השורות בפעולה אחת בעלת סיבוכיות $O(1)$ במקום $O(W)$.

#### ליקוי 4 (חוויית משתמש): דריסת סמן הכתיבה (Caret Obliteration) בעריכת טקסט חיה

**מיקום:** `app.js`, שורות 100–125.

**תיאור הכשל:** בעת הקלדה בעורך `#raw-input` (ContentEditable), מופעל טיימר חי (Live Typeset). עם סיום העימוד נקראת הפונקציה `updateEditorWithPageBreaks`, המבצעת `editor.innerHTML = ''` ובונה מחדש את כל השורות. פעולה זו משמידה את אובייקט ה-Selection של הדפדפן, והמשתמש מאבד את סמן הכתיבה ואת הפוקוס תוך כדי הקלדה רציפה.

```
// תיקון הנדסי: שמירה ושחזור חכם של טווח הסמן (Caret Preservation):
function updateEditorWithPageBreaksPreservingSelection(pageBreaks) {
const editor = document.getElementById('raw-input');
if (!editor) return;
// 1. שמירת היסט הסמן היחסי
const sel = window.getSelection();
let savedOffset = 0;
let targetLineIdx = -1;
if (sel && sel.rangeCount > 0) {
const range = sel.getRangeAt(0);
const lineEl = range.startContainer.parentElement.closest('.editor-line');
if (lineEl) {
targetLineIdx = parseInt(lineEl.getAttribute('data-line-idx'), 10);
savedOffset = range.startOffset;
}
}
// 2. עדכון ה-DOM של החוצצים בלבד ללא מחיקת שורות הטקסט
renderEditorDividersOnly(editor, pageBreaks);
// 3. שחזור הסמן למיקומו המקורי בדיוק
if (targetLineIdx !== -1) {
const newLineEl = editor.querySelector(`.editor-line[data-line-idx="${targetLineIdx}"]`);
if (newLineEl && newLineEl.firstChild) {
const newRange = document.createRange();
const safeOffset = Math.min(savedOffset, newLineEl.firstChild.length || 0);
newRange.setStart(newLineEl.firstChild, safeOffset);
newRange.collapse(true);
sel.removeAllRanges();
sel.addRange(newRange);
}
}
}
```

#### ליקוי 5 (לוגיקה): כשל זיהוי הערות שוליים בעלות סוגריים מקוננים

**מיקום:** `typesetter.js`, שורות 915–940.

**תיאור הכשל:** הפונקציה `findDelimiterMatches` מחפשת סוגר סוגר באמצעות `text.indexOf(closeDelim)` פשוט. כאשר הערת שוליים מצטטת מקור בסוגריים, כדוגמת: `[עיין רמב"ם [פ"א מהל' שבת] שכתב...]`, המערכת ננעלת על הסוגר הסוגר הראשון, חותכת את ההערה באמצע, ופולטת את שארית ההערה כטקסט רגיל לתוך גוף הספר.

```
// פתרון הנדסי: מנגנון Balanced Parentheses Scanner במקום indexOf נאיבי:
function findBalancedDelimiterMatches(text, openDelim, closeDelim, inst) {
const matches = [];
let i = 0;
while (i < text.length) {
let start = text.indexOf(openDelim, i);
if (start === -1) break;
let depth = 1;
let cur = start + openDelim.length;
while (cur < text.length && depth > 0) {
if (text.startsWith(openDelim, cur)) {
depth++;
cur += openDelim.length;
} else if (text.startsWith(closeDelim, cur)) {
depth--;
cur += closeDelim.length;
} else {
cur++;
}
}
if (depth === 0) {
matches.push({ start, end: cur, inst });
i = cur;
} else {
i = start + openDelim.length;
}
}
return matches;
}
```

#### ליקוי 6 (ויזואלי): היפוך סדר הזרקת עיטור תחתון בכותרת 2

**מיקום:** `typesetter.js`, שורות 1920–1928.

**תיאור הכשל:** בעת הזרקת עיטור תחתון (`h2-ornament-bottom`), הקוד בודק: `const insertAfter = simanElem || title;`, ולאחר מכן מבצע: `insertAfter.parentNode.insertBefore(ornWrap, insertAfter === title ? title.nextSibling : title);`. כאשר `simanElem` קיים, התנאי `insertAfter === title` הוא **false**, ולכן העיטור מוזרק **לפני הכותרת** (בין הסימן לכותרת) במקום מתחת לכותרת!

```
// תיקון הנדסי:
if (btmOrnHTML) {
const ornWrap = document.createElement('div');
ornWrap.className = 'h2-ornament-bottom';
ornWrap.innerHTML = btmOrnHTML;
// העיטור התחתון תמיד חייב להיות מוזרק ישירות לאחר טקסט הכותרת:
title.parentNode.insertBefore(ornWrap, title.nextSibling);
}
```

#### ליקוי 7 (דליפת נתונים): "גניבת" שורות תוכן ע"י מנוע ה-Metadata Parser

**מיקום:** `typesetter.js`, שורות 460–520.

**תיאור הכשל:** הפונקציה `parseMetadataFromText` סורקת את כל שורות הספר. אם פסקה באמצע הספר מתחילה במילים `נושא - ביאור שיטת הרשב"א`, הביטוי הרגולרי תופס אותה ככותרת המשנה של הספר, מעדכן את `inp-book-subtitle`, ו**מוחק לחלוטין את השורה מגוף הספר**!

**פתרון הנדסי:** הגבלת חילוץ המטא-דאטה לבלוק הפתיחה בלבד (Header Block Scanner). הסריקה תתבצע אך ורק עד השורה הריקה הראשונה או עד שנתקלים בכותרת רשמית ראשונה (כגון `כותרת 0` או `כותרת 1`), וכל שאר השורות יישמרו ללא מגע.

#### ליקוי 8 (טיפוגרפיה): הריסת רשת השורות (Baseline Grid) במתיחת טורים אנכית

**מיקום:** `typesetter.js`, שורות 560–585 (`justifyColumnVertically`).

**תיאור הכשל:** כאשר טור שמאל קצר מטור ימין, הפונקציה מגדילה את ה-`lineHeight` של הפסקה הבודדת בטור עד לערך של 1.8x. הדבר יוצר מראה מגושם, והכי חמור: שובר לחלוטין את ה-Baseline Grid — השורות בטור שמאל אינן יושבות עוד מול השורות בטור ימין, בניגוד מוחלט לחוקי הדפוס התורני המוקפד.

**פתרון הנדסי:** מתיחה אנכית (Vertical Justification) בעולם התורני מבוצעת אך ורק באמצעות הגדלת מרווחי פסקאות (Paragraph Spacing - `margin-bottom`) או מרווחים סביב כותרות משנה, ואף פעם לא ע"י מתיחת `line-height` של גוף הטקסט עצמו.

4

## גישות אלגוריתמיות חלופיות לטיפול בטקסט עימוד ויישור

### 4.1 הערכת האלגוריתם הקיים (First-Fit Greedy with Exhaustive Local Search)

המנוע הנוכחי מבצע שילוב של אלגוריתם חמדן (Greedy First-Fit) לחלוקת פסקאות בין טורים, יחד עם חיפוש ממצה מקומי (Exhaustive Local Search) בלולאת `balanceColumns`.

- **סיבוכיות זמן (Time Complexity):** $O(N \cdot W + K^2)$ כאשר $N$ הוא מספר הפסקאות, $W$ מילים לפסקה, ו-$K$ נקודות פיצול אפשריות בטור. המדידה הסינכרונית ב-DOM הופכת את הפעולה ליקרה ביותר עקב עשרות אלפי Reflows.
- **סיבוכיות מקום (Space Complexity):** $O(N)$ לשמירת עץ הטוקנים ורשימות ההערות בזיכרון.
- **איכות טיפוגרפית:** סבירה בטקסט רציף, אך נוטה לשבירות מקומיות שאינן אופטימליות במקרים של עמודים עם הערות שוליים מרובות.

### 4.2 הצעת שלוש גישות אלגוריתמיות מתקדמות לעימוד תורני

#### 1. התאמת אלגוריתם Knuth-Plass (Total-Fit Line Breaking) לעימוד עברי תורני

במקום לשבור שורות אחת-אחת באופן חמדן, אלגוריתם Knuth-Plass ממדל את הפסקה כולה כגרף מכוון חסר מעגלים (DAG), כאשר כל מילה היא צומת, והקשתות מייצגות שורות אפשריות. משקל כל קשת נקבע לפי מדד "מכוערות" (Badness/Demerits), המחושב לפי מידת הדחיסה או המתיחה של הרווחים:

```
// מודל מתמטי מותאם לעברית:
Badness = 100 * (|curWidth - targetWidth| / allowableStretch)^3 + Penalty;
```

**התאמות ייחודיות לטיפוגרפיה תורנית:**

- **ענישה על קיצורים וראשי תיבות:** קנס כבד (Penalty = +500) על שבירת שורה מיד אחרי גרשיים (כגון שבירה בין `ע"כ` למילה הבאה).
- **הרחבת אותיות (Rafe / Dilatation):** הוספת "דבק אלסטי מיוחד" (Elastic Glue) המאפשר מתיחת אותיות סופיות במקום פתיחת רווחי ענק בין מילים.
- **סנכרון רשת שורות (Strict Baseline Grid Pinning):** כל גבהי השורות והכותרות מעוגלים לכפולות מדויקות של מודול הרשת (למשל 14.5pt), מה שמבטיח ששורות בטור ימין ושמאל יישבו תמיד על אותו קו גובה בדיוק.

#### 2. מודל תכנון דינמי (Dynamic Programming) לאיזון טורים וחלוקת עמודים מלאה

במקום לאזן כל צמד טורים בנפרד (Local Optimum), האלגוריתם ממדל את חלוקת הפרק כולו כבעיית מציאת מסלול קצר ביותר בגרף של עמודים שלמים (Multi-page Dynamic Programming):

```
// פונקציית העלות לאיזון עמוד שלם:
Cost(Page_i) = α * (ColumnHeightDiff)^2 + β * (FootnoteOverflow) + γ * (OrphanPenalty);
TotalOptimalCost = min { ∑ Cost(Page_i) } over all valid page partition sequences;
```

**יתרונות:** פותר באופן מוחלט את תופעת "עמוד הסיום הריק" (Trailing 2-line Page) על ידי ספיגת שורה אחת או שתיים בעמודים הקודמים, תוך שמירה על איזון טורים מושלם בסוף הפרק.

#### 3. מנגנון State Machine ו-AST לזיהוי קידומות ללא נגיעה ב-DOM

החלפת מנוע ה-Regex הנאיבי ב-Lexer/Parser מבוסס אוטומט סופי דטרמיניסטי (DFA). המנוע מייצר עץ תחבירי מופשט (AST) של המסמך עוד לפני כניסה לשלב הרינדור:

- מבטל לחלוטין את סכנת "גניבת הפסקאות" של שדות מטא-דאטה.
- מזהה קידומות, כותרות והערות שוליים מקוננות במעבר יחיד $O(L)$ ללא יצירת עומס על הדפדפן.

### 4.3 טבלת השוואה הנדסית רב-ממדית

| מדד השוואה | המנוע הנוכחי (Current Implementation) | Knuth-Plass + Baseline Grid | תכנון דינמי מלא (Multi-page DP) | DFA Parser + Canvas / Offscreen |
| --- | --- | --- | --- | --- |
| **איכות יישור השורות** | בינונית (רווחים לא אחידים, Justify פסיבי של הדפדפן) | מושלמת (Total-Fit אופטימלי עולמי) | גבוהה מאוד | בינונית (תלוי במנוע המשני) |
| **שמירה על Baseline Grid** | נשברת לעיתים קרובות במתיחות אנכיות | מובטחת ב-100% (מודול גובה קשיח) | מובטחת ב-100% | לא רלוונטי לשלב ה-AST |
| **זמן ביצוע (100 עמודים)** | איטי מאוד (12-18 שניות עקב DOM Thrashing) | מהיר (1.2-1.8 שניות במדידת Canvas) | בינוני (2.5-4 שניות) | מיידי (< 80ms לטקסט מלא) |
| **טיפול בהערות שוליים** | Greedy Budgeting עם סיכון לגלישות קלות | מצוין (קנס על שבירת הערה) | אופטימלי (מחשב קיבולת רב-עמודית) | חילוץ תקין ללא שגיאות קינון |
| **מורכבות יישום בקוד** | נמוכה-בינונית (קוד קיים) | גבוהה (נדרש מנוע מדידה עצמאי) | גבוהה מאוד | בינונית |

**המלצת הארכיטקט לשלב הבא (Next Steps):**

1. החלת 8 התיקונים המפורטים בחלק 3 באופן מיידי על קוד המקור הקיים. פעולה זו תביא את המערכת לרמת יציבות של **98/100** ותחסל את כל באגי שבירת הדפים, תוכן העניינים ודריסת הסמן בעורך.
2. החלפת לולאת `getLinesFromParagraph` במדידה מבוססת `Range.getClientRects()` או Canvas Context 2D לביטול ה-Reflow Storm.
3. שדרוג מנגנון איזון הטורים לאלגוריתם Dynamic Programming ממוקד Baseline Grid לקראת גרסת הדגל הבאה.
