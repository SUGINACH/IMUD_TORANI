---
title: "ספר ההנדסה והתיעוד: מערכת עימוד תורנית מבוססת דפדפן"
date: unknown
version: shared
type: menu_spec
source: shared
---
# ספר ההנדסה והתיעוד: מערכת עימוד תורנית מבוססת דפדפן

ספר העימוד התורני

תיעוד הנדסי ומדריך פיתוח למעמד

מבוא וארכיטקטורה

[מטרת המערכת והארכיטקטורה](#section-overview)
[תרשים זרימת העימוד](#section-workflow)

מבנה הדף והגריד

[גריד ה-A4 היחסי (100%)](#section-grid)
[היררכיית 7 הכותרות](#section-headings)
[טיפוגרפיה, חלון מילה ויישור](#section-typography)

אלגוריתמים ומנוע ה-JS

[איזון סופי פרקים (Pre-Balancing)](#section-balancing)
[מניעת כותרות יתומות (רמות 3-6)](#section-orphans)
[הצדקה אנכית (Feathering)](#section-feathering)
[סנכרון סמן עורך (Cursor Sync)](#section-sync)

כרוניקת דיוקים והתאמות

[ריכוז כל הדיוקים שנפתרו](#section-refinements)

מדריך שינויים והתאמות

[כיצד לשנות את הקוד בעתיד](#section-customization)


# מערכת עימוד תורנית מבוססת דפדפן

תיעוד הנדסי מקיף: ניתוח מבנה הקוד, פירוט האלגוריתמים הטיפוגרפיים, הסיבות לכל הכרעה תכנותית, והנחיות לשינוי והתאמה אישית של ספרים ומאמרים תורניים.

## 1. מבוא, מטרת המערכת והארכיטקטורה הכוללת

מטרת הפרויקט הייתה להקים מנוע עימוד עצמאי, מהיר ואוטומטי הפועל ישירות בתוך הדפדפן, ומביא טקסט תורני-למדני גולמי ומורכב (עם 7 רמות היררכיה וכותרות שוליים) לרמת גימור של **ספר תורני מוכן לדפוס ברמה של תוכנת "תג" / InDesign**.

כלל הברזל של החיבור: אפס שינוי נוסח

הטקסט של המחבר מכיל ניתוח למדני מעמיק (סברות "חפצא וגברא", "קנייני שביתה", "מחיצות ורשויות"). הקוד נבנה כך שאינו עורך, משמיט או "מנחש" מילים – הנוסח נשמר אות באות במדויק.

### ארכיטקטורת המערכת (Split-Screen Engine)

המערכת בנויה משלוש שכבות מופרדות היטב:

- **שכבת הבקרה הימנית (Sidebar):** מכילה את סרגל הגדרות הגריד, בחירת 11 הגופנים והגדלים, ממשק טעינת גופני Windows המותקנים, ותיבת הטקסט הראשית.
- **שכבת התצוגה השמאלית (Preview Pane):** קונטיינר גלילה אנכי עצמאי המרנדר את דפי ה-A4 המעומדים בזמן אמת.
- **מנוע העיבוד (Pure JavaScript Engine):** מפרק את הטקסט לטוקנים, מחשב גבהים, מונע יתומים, מאזן טורים, ומציב כותרות צד עם אפס שימוש בספריות חיצוניות כבדות.

## 2. תרשים זרימת העימוד (Pipeline)

1

**פירוק לטוקנים (Tokenization):** פענוח שורות הטקסט, זיהוי כותרות 1–6, הצמדת כותרת 7 כהערת שוליים לפסקה הבאה, ויצירת מפת אינדקס שורות (Line-to-Token Map).

2

**חלוקה למקטעים (Section Chunking):** חלוקת הספר לפרקים סגורים התחומים בין כותרת 1 (שער) לכותרת 2 (פתיחת פרק).

3

**מדידת יתרה ואיזון מראש (Pre-Balancing):** מדידת גובה הטקסט שנותר במקטע; אם הוא נכנס בעמוד בודד – הגדרת גובה יעד מאוזן ($\text{Target} = \frac{\text{Total}}{2}$).

4

**מילוי טורים וחיתוך בינארי (Binary Search Word Splitting):** מילוי טור ימין ולאחריו טור שמאל; פסקאות שנחתכות מקבלות יישור מלא (`justify`), פסקאות שלמות מקבלות יישור מרכז (`center`).

5

**בקרת יתומים (Orphan Guard):** בדיקת רמות 3–6; כותרת ללא מקום לשתי שורות נדחית לטור הבא.

6

**הצדקה אנכית ועיגון שוליים (Vertical Justification & Side-Notes):** מתיחת מרווחי הפסקאות ל-Baseline המשותף, ומדידת `offsetTop` למיקום כותרות צד מול שורת הפתיחה בדיוק של 0px.

## 3. רשת העימוד (The 100% Proportional Grid)

העימוד מבוסס על ניתוח גריד יחסי שפותח בהשראת דפוסי ש"ס וספרי למדנות קלאסיים. שטח הדף מחולק ל-7 עמודות ב-CSS Grid:

| אזור בגריד | משתנה CSS | ערך ברירת מחדל | תפקיד טיפוגרפי |
| --- | --- | --- | --- |
| עמודה 1 (שוליים ימניים) | `--w-margin` | **7.5%** | כותרות צד (רמה 7) עבור הטור הימני |
| עמודה 2 (רווח ביניים) | `--w-gap` | **2.0%** | בידוד לבן בין שוליים ימניים לטור |
| עמודה 3 (טור ימני) | `--w-col` | **40.0%** | גוף הטקסט הראשי - טור ימין |
| עמודה 4 (רווח מרכזי / Gutter) | `--w-gutter` | **2.0%** | הפרדה נקייה בין שני טורי הטקסט (ללא קו) |
| עמודה 5 (טור שמאלי) | `--w-col` | **40.0%** | גוף הטקסט הראשי - טור שמאל |
| עמודה 6 (רווח ביניים) | `--w-gap` | **2.0%** | בידוד לבן בין הטור לשוליים השמאליים |
| עמודה 7 (שוליים שמאליים) | `--w-margin` | **7.5%** | כותרות צד (רמה 7) עבור הטור השמאלי |

```
/* הגדרת ה-CSS Grid הדינמי של גוף הדף והכותרות */
.page-content-grid, .top-header-grid {
display: grid;
grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
}
```

## 4. היררכיית הכותרות וכללי ההמרה

| רמת כותרת | התנהגות מבנית | גופן ברירת מחדל | גודל ומשקל |
| --- | --- | --- | --- |
| **כותרת 1** | דף שער עצמאי (שער ביניים). מקף (`-`) מפצל לכותרת ראשית וכותרת משנה תחת עיטור. | `Lia Sgula` / `David Libre` | 50pt / 28pt (Bold) |
| **כותרת 2** | פותחת **דף חדש תמיד**; ממוקמת בגובה 130px (שליש עליון) עם רווח 2 שורות (50px) אחריה. טורים נמתחים ל-660px. | `AAd_AlphaBlack` | 17pt (Bold) |
| **כותרות 3–6** | כותרות ביניים מודגשות בתוך הטור. מיושם חוק מניעת כותרת יתומה. | `AAd_AlphaLight` / `FrankRuehl` / `David` / `Noto Serif` | 13.5pt, 12.5pt, 11.5pt, 10.5pt |
| **כותרת 7** | מומרת לכותרת צד בשוליים (עמודות 1 או 7), בגוון אפור כהה (`#404040`), לא מודגשת (400), מיושרת לאמצע. | `Hadassah Friedlaender` | 6pt (Normal) |

## 5. טיפוגרפיה מתקדמת: "חלון" פתוח ויישור שורות

### א. חלון מילה ראשונה (Drop-Word Window)

במקום אות גדולה (Drop-Cap) הנהוגה בספרות לועזית, בספרי קודש נהוג להגדיל את **המילה הראשונה כולה** באותיות מרובעות שמנות, כאשר השורה השנייה של הפסקה נכנסת מתחתיה ויוצרת "חלון" טיפוגרפי פתוח:

```
/* הטריק הטיפוגרפי של החלון התורני */
.first-word-window {
float: right;
font-family: var(--fn-first-word); /* גופן עצמאי למילה ראשונה */
font-size: var(--sz-first-word); /* גודל 1.5em */
font-weight: 900;
line-height: 0.85;
height: 1.25em; /* גובה מאולץ שגורם לשורה השנייה להתחיל מתחת למילה */
margin-left: 6px;
margin-bottom: 1px;
display: block;
}
```

### ב. יישור שורות מותנה (Conditional Line Justification)

כאשר פסקה שלמה מסתיימת, מנהג הישיבות ששורת הסיום מיושרת לאמצע הדף. אולם, כאשר פסקה נחצית בסוף טור ועוברת לטור הבא – אסור ליישר את שורת החיתוך לאמצע (דבר שיוצר רווח ריק מוזר ברצף הקריאה). הפתרון בקוד מבוסס על שתי מחלקות CSS חכמות:

```
/* פסקה שמסתיימת לגמרי - שורה אחרונה במרכז */
p.p-end { text-align-last: center; }
/* פסקה שנחתכה וממשיכה בטור הבא - שורה אחרונה מיושרת לשני הצדדים ברצף מלא */
p.p-cut { text-align-last: justify; }
```

## 6. אלגוריתם איזון סופי פרקים (Pre-Balancing Engine)

**מדוע מנגנון האיזון הישן נכשל?**
בעבר המנוע מילא את טור ימין במלואו (עד 875px) ולאחר מכן ניסה להעביר פסקאות שלמות לטור שמאל. אם פסקה הייתה ארוכה (200px), לא ניתן היה לפצל אותה בדיעבד, והטור השמאלי נמתח ברווחים מוגזמים של 70px בין שורות או נשאר חצי ריק.

**הפתרון החדש: חישוב נקודת אמצע מקדימה (Pre-Balancing)**
בטרם תחילת מילוי העמוד, המערכת מודדת את סך כל הגובה של הטקסט שנותר במקטע באמצעות תיבת מדידה מוסתרת ב-DOM (`#measuring-box`). אם הטקסט נכנס בעמוד בודד ($H_{\text{rem}} \le 2 \times \text{maxH}$), נקבע יעד גובה מדויק לשני הטורים:

```
// חישוב גובה יעד מאוזן לסוף פרק
const totalRemH = measureRemainingHeight(secTokens, tokenIndex, pendingWordTokens, actualColWidth);
const isSectionClosingPage = totalRemH <= (2 * pageLayout.maxColHeight);
if (isSectionClosingPage) {
// חצי מדויק לכל טור + 4px גמישות
targetHeightPerColumn = Math.min(pageLayout.maxColHeight, Math.max(60, Math.ceil(totalRemH / 2) + 4));
}
```

טור ימין מתמלא בדיוק עד `targetHeightPerColumn` (אם צריך לחתוך פסקה – היא נחתכת מילה-במילה), וטור שמאל קולט את החצי השני. התוצאה: **שני הטורים מסתיימים באותו גובה בדיוק של 100% ללא מרווחי פסקאות מעוותים.**

## 7. מניעת כותרות יתומות (רמות 3 עד 6)

בהלכות עימוד דפוס, כותרת אינה יכולה להופיע בתחתית עמוד או טור כ"יתומה" (Orphan Heading) ללא גוף הטקסט שלה. הקוד בודק עבור כל כותרת מרמות 3, 4, 5, 6 האם נותר בטור מקום עבור **הכותרת + לפחות 2 שורות מתוכנה (כ-45-50px)**:

```
// בדיקת חוק יתומים לרמות 3-6
if (currentTok.type.startsWith('h')) {
const hElem = document.createElement('div');
hElem.className = `title-level-${currentTok.level}`;
hElem.textContent = currentTok.text;
targetCol.appendChild(hElem);
// אם הכותרת גולשת לאזור 45px האחרונים של הטור - דוחים אותה לטור הבא
if (targetCol.scrollHeight > effectiveColLimit - 45 && targetCol.children.length > 1) {
targetCol.removeChild(hElem);
break; // סגירת הטור והעברת הכותרת לראש הטור הבא
}
}
```

## 8. מנגנון הצדקה אנכית (Vertical Feathering)

כאשר כותרת נדחית לטור הבא, הטור הקודם עלול להסתיים מעט מוקדם יותר. פונקציית `justifyColumnVertically` מפזרת את יתרת הפיקסלים (עד 160px) באופן שווה ועדין בין ה-`margin-bottom` של כל הפסקאות בטור:

```
function justifyColumnVertically(col, maxH) {
const children = Array.from(col.children);
if (children.length <= 1) return;
const currentH = col.scrollHeight;
const diff = maxH - currentH;
// אם יש פער קטן עד בינוני - מותחים את המרווחים בעדינות שווה
if (diff > 2 && diff < 160) {
const extraPerItem = diff / (children.length - 1);
children.slice(0, -1).forEach(child => {
const curMB = parseFloat(getComputedStyle(child).marginBottom) || 0;
child.style.marginBottom = (curMB + extraPerItem) + 'px';
});
}
}
```

## 9. סנכרון סמן עורך (Bidirectional Cursor Sync)

המערכת יוצרת מיפוי מדויק בין מספרי השורות בתיבת ה-`textarea` לבין מזהה הטוקן (`data-token-id`) בעמודים המעומדים. בעת קליק או לחיצה על מקשי החצים בתיבת הטקסט, העמוד הרלוונטי נגלל אוטומטית למרכז התצוגה:

```
function syncCursorToPreview() {
const cursorPos = textarea.selectionStart;
const textBefore = textarea.value.substring(0, cursorPos);
const currentLineIdx = textBefore.split('\n').length - 1;
let tokenId = lineToTokenMap[currentLineIdx];
if (tokenId !== null && tokenId !== undefined) {
const targetEl = document.querySelector(`[data-token-id="${tokenId}"]`);
if (targetEl) {
targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
}
}
textarea.addEventListener('click', syncCursorToPreview);
textarea.addEventListener('keyup', syncCursorToPreview);
```

## 10. ריכוז הדיוקים והאתגרים שנפתרו לאורך הפיתוח

| נושא / בקשה | האתגר שנוצר | הפתרון ההנדסי שיושם |
| --- | --- | --- |
| **תקיעת הדף בטקסט ארוך** | מדידות DOM חוזרות בתוך לולאות סינכרוניות. | מנוע חיפוש בינארי מוגן (Binary Search) וביטול לולאות איטרטיביות כפולות. |
| **סטיית כותרות צד** | מיקום משוער שלא תאם את גובה הפסקה לאחר מתיחה. | חישוב `noteElem.style.top = pElem.offsetTop + 'px'` **לאחר** סיום מתיחת הטורים. |
| **כותרת 2 בגובה 2/3** | קיצור שגוי של גובה הטורים בעמוד פתיחת פרק. | קביעת גובה עמוד כותרת 2 ל-660px, הנמתח במדויק עד לאותו קו סיום תחתון (875px). |
| **פיצול מקף בשער** | שערים הכילו טקסט אוטומטי מיותר. | פיצול אוטומטי של כותרת 1 במקף (`-`): חלק ראשון כותרת עליונה, חלק שני משנה. |
| **מרכוז כותרות עליונות** | כותרות עליונות נצמדו לשולי הדף החיצוניים. | הצבת הכותרות בעמודות 3 ו-5 של הגריד, עם `text-align: center` מעל מרכז הטור. |
| **עיגון מספר עמוד** | מספר העמוד קפץ למעלה בעמודים קצרים. | קיבוע מוחלט בתחתית הדף (`bottom: 14mm`) במרחק קבוע של 28px מתחת לטקסט. |

## 11. מדריך התאמות והרחבות למפתח (How-To Customization)

### א. כיצד לשנות את הפורמט מ-A4 לפורמט ספר רגיל (17X24 ס"מ)?

אם תרצו להדפיס ספר בפורמט ישיבתי בגודל 17X24 ס"מ במקום A4, יש לעדכן את מידות ה-CSS של ה-`.a4-page`:

```
/* שינוי מידות הדף לפורמט 17X24 ס"מ */
.a4-page {
width: 170mm !important;
height: 240mm !important;
max-height: 240mm !important;
padding: 12mm 12mm 12mm 12mm !important;
}
/* התאמת גובה הטורים הפנימי לפורמט הקטן יותר */
.page-content-grid {
height: 680px !important; /* במקום 875px */
}
.page-content-grid.has-h2 {
height: 480px !important; /* במקום 660px */
}
```

### ב. כיצד להוסיף רמת כותרת חדשה (למשל: "כותרת 8")?

1. הוסיפו את הגדרת הגופן ב-CSS Variables בראש ה-CSS:

```
--fn-h8: 'David Libre', serif;
--sz-h8: 9.5pt;
.title-level-8 {
font-family: var(--fn-h8);
font-size: var(--sz-h8);
font-weight: 700;
text-align: right;
margin: 5px 0 2px 0;
}
```

2. הוסיפו ב-JavaScript למערך הפענוח של הכותרות, ועדכנו את ה-Regex לזהות רמה 8.

### ג. כיצד לשנות את עומק חלון המילה הראשונה (למשל ל-3 שורות)?

```
.first-word-window {
font-size: 2.1em; /* הגדלה מ-1.5em ל-2.1em */
height: 2.1em; /* גובה שמאלץ שלוש שורות להיכנס מתחתיו */
line-height: 0.8;
margin-left: 8px;
}
```

### ד. כיצד להוסיף קווי הפרדה עדינים בין הטורים (אם תרצו בעתיד)?

```
/* הוספת קו מפריד דק ועדין בין הטורים */
.main-column.right-col {
border-left: 0.5px solid #d0d0d0;
padding-left: 8px;
}
```
