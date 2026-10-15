# בדיקה ואימות בעיות עימוד במסמך מרונדר

> **מסמך זה מתעד את המסע המלא לבניית יכולת בדיקה ואימות אמינה של בעיות עימוד במסמך מרונדר.** המסמך מכסה שלושה מצבי רינדור: תצוגת המערכת (החיה בדפדפן), ייצוא ל-PDF, וייצוא ל-HTML עצמאי.
>
> **מטרת המסמך:** לשמש כ"מדריך הבדיקה" — איך בודקים כל בעיה, באילו כלים, מה נכון ומה שגוי, ואיך מאמתים שהבדיקה עצמה אמינה.
>
> **מקורות:**
> - `המשך_שיחה_ב.md` — ייצוא HTML מדויק — המסע המלא
> - `המשך_שיחה_ג.md` — אימות דוח עימוד 15/15
> - `worklog.md` — 8 משימות מתועדות (במיוחד `report-accuracy-validation`)
> - `trace-manager.js` — מערכת מעקב אחרי קריאות פונקציות
> - `test-suite.js` — מחולל טקסט seeded + דוח עימוד מדויק
> - `debug-panel.js` — דוח עימוד חי + מרקרים
> - `v18-kp-full-fix-report.md` — תיקונים שאומתו
> - `analysis_results.md` — תוצאות בדיקה מפורטות
> - שיחות Z.ai 1+2 — ניסיונות וטעויות בבדיקות

---

## תוכן עניינים

1. [מבוא: למה אימות קריטי](#1-מבוא-למה-אימות-קריטי)
2. [שלושת מצבי הרינדור שיש לבדוק](#2-שלושת-מצבי-הרינדור-שיש-לבדוק)
3. [כלי הבדיקה העיקריים](#3-כלי-הבדיקה-העיקריים)
4. [מערכת אימות דוח העימוד — 17 בדיקות (T1-T17)](#4-מערכת-אימות-דוח-העימוד--17-בדיקות-t1-t17)
5. [שיטות מדידה נכונות vs שגויות](#5-שיטות-מדידה-נכונות-vs-שגויות)
6. [בדיקה בתצוגת המערכת (חיה בדפדפן)](#6-בדיקה-בתצוגת-המערכת-חיה-בדפדפן)
7. [בדיקה ב-PDF מיוצא](#7-בדיקה-ב-pdf-מיוצא)
8. [בדיקה ב-HTML מיוצא](#8-בדיקה-ב-html-מיוצא)
9. [מערכת trace-manager.js — מעקב אחרי קריאות פונקציות](#9-מערכת-trace-managerjs--מעקב-אחרי-קריאות-פונקציות)
10. [מחולל טקסט seeded (LCG) — בסיס לבדיקות עקביות](#10-מחולל-טקסט-seeded-lcg--בסיס-לבדיקות-עקביות)
11. [יומן הבאגים שנמצאו בבדיקות עצמן](#11-יומן-הבאגים-שנמצאו-בבדיקות-עצמן)
12. [ניסיונות בדיקה שנפסלו](#12-ניסיונות-בדיקה-שנפסלו)
13. [פרוטוקול בדיקה מלא אחרי כל תיקון](#13-פרוטוקול-בדיקה-מלא-אחרי-כל-תיקון)
14. [סקריפטים וכלי עזר](#14-סקריפטים-וכלי-עזר)
15. [מסקנות ועקרונות מנחים](#15-מסקנות-ועקרונות-מנחים)

---

## 1. מבוא: למה אימות קריטי

### 1.1 שורש הבעיה

במהלך פיתוח מערכת העימוד, התברר ש**חוסר יכולת לבדוק ולאמת קיום בעיות במסמך מרונדר** היה אחד משני גורמי הכשל המרכזיים שגרמו לתקיעת תיקון המערכת. בלי יכולת אימות:

- **ה-AI לא יכול היה לדעת אם תיקון עבד** — הוא שלח תיקון, המשתמש בדק ידנית, ולעיתים קרובות התברר שהתיקון לא עזר.
- **המשתמש וה-AI ראו מציאויות שונות** — ה-AI דיווח "0 דלילויות" אבל המשתמש ראה עשרות.
- **הדוח שיקר** — דיווח על 752 דלילויות שלא היו קיימות (false positives).
- **הדוח החמיץ בעיות** — לא דיווח על בעיות אמיתיות (false negatives).
- **לא יכולנו להבחין בין רגרסיות לשיפורים** — בלי בדיקה עקבית, אי אפשר לדעת אם שינוי עזר או הזיק.
- **בדיקות לא עקביות** — `Math.random()` יצר מסמך שונה בכל הרצה, ואי אפשר היה להשוות.

### 1.2 העיקרון המנחה

> **כל תיקון חייב בדיקה לפני הגשה.** אם אי אפשר לבדוק — אי אפשר לתקן. אם הבדיקה אינה אמינה — התיקון אינו אמיתי.

### 1.3 שלוש רמות אימות

1. **אימות פנימי** — הדוח עצמו נכון (לא משקר).
2. **אימות חיצוני** — הדוח תואם את ה-DOM החי.
3. **אימות חוצה-פלטפורמה** — הדוח תואם בין תצוגת מערכת, PDF, ו-HTML.

---

## 2. שלושת מצבי הרינדור שיש לבדוק

### 2.1 תצוגת המערכת (חיה בדפדפן)

**המצב הראשוני.** המשתמש מדביק טקסט, לוחץ "עדכן ועמד מחדש", ורואה את המסמך המעומד בתצוגה מקדימה.

**מאפיינים:**
- `transform: scale(--preview-scale)` על `#book-container` (לדוגמה: 1.3657).
- גופנים נטענים מ-`fonts-def.css` (439) ו-`fonts-extended.css` (1315).
- הדוח עימוד (`generateLayoutReport`) רץ על ה-DOM החי.
- `beforeprint` re-typeset רץ לפני הדפסה.

**בעיות ייחודיות:**
- `transform: scale` משפיע על `getBoundingClientRect` (מוגדל פי scale) אבל לא על `offsetWidth`/`clientWidth`.
- גופנים עשויים שלא להיטען ב-`file://` (CORS).
- `document.fonts.status === 'loaded'` אינו אמין.

### 2.2 ייצוא ל-PDF

**המצב השני.** המשתמש לוחץ "הדפסה / PDF", והדפדפן מייצא PDF.

**מאפיינים:**
- `beforeprint` re-typeset רץ לפני הייצוא.
- רינדור גופנים שונה בין מסך להדפסה (font hinting, subpixel positioning).
- הבדלי פלטפורמה: Windows vs Linux גורמים למספר עמודים שונה (362 ב-Linux, 373 ב-Windows).

**בעיות ייחודיות:**
- רינדור שונה מהמסך.
- קשה לבדוק באופן אוטומטי (צריך כלי כמו `pdftotext` או צילום מסך).
- VLM לא אמין לקריאת טקסט עברי דחוס (הזיות).

### 2.3 ייצוא ל-HTML עצמאי

**המצב השלישי.** המשתמש לוחץ "💾 ייצוא HTML", והמערכת מייצאת קובץ HTML עצמאי עם כל ה-CSS והגופנים.

**מאפיינים:**
- שכפול `#preview-pane` (לא רק `#book-container`).
- הטמעת 12 גופני priority כ-base64.
- CSS variables מ-`document.documentElement.style`.
- שמירת `--preview-scale` המקורי.

**בעיות ייחודיות:**
- אם גופנים לא מוטמעים כ-base64, ה-HTML המיוצא לא תואם את ה-DOM החי (גופן fallback עם מדדים שונים → שבירת שורות שונה → איזון שונה).
- `file://` protocol חוסם טעינת גופנים מקבצים חיצוניים.

---

## 3. כלי הבדיקה העיקריים

### 3.1 Playwright + Chromium headless

**הכלי הראשי לבדיקות אוטומטיות.** מריץ את המערכת בדפדפן חסר-ראש, מזריק טקסט, מפעיל עימוד, ובודק את ה-DOM.

**תבנית סקריפט בדיקה:**

```javascript
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // טען את המערכת
    await page.goto('https://suginach.github.io/IMUD_TORANI/');
    
    // המתן לטעינת גופנים
    await page.waitForFunction(() => document.fonts.status === 'loaded');
    await page.waitForTimeout(2000);
    
    // הזרק טקסט seeded
    await page.evaluate(() => {
        document.getElementById('raw-input').innerText = window.generateTestTextSeeded();
        window.typesetDocument();
    });
    
    // המתן לסיום עימוד
    await page.waitForFunction(() => {
        const pages = document.querySelectorAll('.a4-page');
        return pages.length >= 100; // מספר צפוי
    }, { timeout: 120000 });
    
    // הפק דוח עימוד
    const report = await page.evaluate(() => window.generateLayoutReport());
    
    // בדוק תוצאות
    console.log('עמודים:', report.totalPages);
    console.log('לא מאוזנים:', report.imbalanced);
    console.log('גלישות:', report.overflow);
    console.log('אלמנות:', report.widows);
    console.log('יתומים:', report.orphans);
    console.log('דלילות p-cut:', report.sparsePcut);
    
    await browser.close();
})();
```

### 3.2 דוח עימוד (`generateLayoutReport`)

**הכלי הפנימי של המערכת.** רץ על ה-DOM החי ומדווח על כל הבעיות.

**מאפיינים:**
- 15+ בדיקות (Widow/Orphan, Sparse, Overflow, Imbalanced, Heading at bottom, וכו').
- טבלת בלוקים מפורטת לכל בלוק.
- חשיפת 14 פונקציות על `window` לצורכי אימות חיצוני.

**בעיות ידועות שתוקנו:**
- `checkSparse` — `rect.width` → `rect.right - colRect.left` (RTL).
- `checkFontFallback` — רשימת fallback מלאה במקום ראשון בלבד.
- `detectTofu` — השוואה ל-serif גנרי במקום "האם משהו מצויר".

### 3.3 מערכת מעקב (`trace-manager.js`)

**כלי לאיתור קריאות פונקציות בעייתיות.** מאפשר רינדור פרק בודד עד לקריאה מסוימת.

**תרחיש שימוש:**
1. הפעל `__traceStartFullCapture()` — המערכת תרשום את כל הקריאות.
2. בחר פרק ב-UI — רשימת הקריאות תופיע.
3. לחץ על קריאה ספציפית — המערכת תרנדר רק את הפרק עד לקריאה הזו.
4. סמן צ'קבוקס "דילג" על קריאה חשודה — המערכת תדלג עליה ברינדור הבא.

### 3.4 כלי עזר

- **`pdftotext`** — חילוץ טקסט מ-PDF להשוואה.
- **`pdffonts`** — בדיקת גופנים ב-PDF (זיהוי fallback).
- **`canvas.measureText()`** — מדידת רוחב טקסט מנותקת מ-DOM.
- **`document.fonts.check()`** — בדיקת טעינת גופן אמיתית.

---

## 4. מערכת אימות דוח העימוד — 17 בדיקות (T1-T17)

### 4.1 רקע

דוח העימוד (`generateLayoutReport`) כולל 15+ בדיקות שונות. המשימה הייתה לבנות מערכת אימות שמשווה כל בדיקה ל"קרן אמת" (ground truth) בלתי-תלויה ברמת הפיקסל, ולתקן כל באג שנמצא.

התוצאה: `scripts/validate_report_accuracy.js` — 17 בדיקות שמשוות כל פונקציית דוח לעומת ground truth עצמאית.

### 4.2 רשימת הבדיקות

#### T1: Widow/Orphan — השוואה ל-Range.getClientRects

**מה נבדק:** הדוח מדווח על אלמנות/יתומים. האם הדיווח תואם את המציאות?

**Ground truth:** `Range.getClientRects()` על כל פסקה — ספירת שורות בפועל.

**תוצאה:** ✅ עבר.

#### T2: Sparse p-cut — השוואה למדידת טקסט-נודות עצמאית

**מה נבדק:** הדוח מדווח על שורות דלילות ב-p-cut. האם הדיווח תואם?

**Ground truth:** מדידת רוחב שורה עצמאית עם `Range.getClientRects`.

**באג קריטי שנמצא:** הדוח השתמש ב-`rect.width` למדידת רוחב שורה. ב-RTL, `Range.getClientRects()` מחזיר מספר rects לאותה שורה (אחד לכל span פנימי, כמו drop-word). כל `rect.width` הוא רק רוחב ה-span עצמו, לא רוחב השורה. כשהשורה האחרונה מתחילה מימין (RTL), `rect.width` קטן אף שהשורה מלאה.

**תוצאה:** 87 false positives — הדוח דיווח על 87 שורות דלילות שלא היו דלילות בכלל.

**תיקון:** החלפת `rect.width` ב-`rect.right - colRect.left` — המרחק מתחילת הטור עד סוף הטקסט. זה נכון ל-RTL ול-LTR כאחד.

**תוצאה אחרי תיקון:** ✅ עבר.

#### T3: Column overflow — השוואה ל-scrollHeight/clientHeight ישירות

**מה נבדק:** הדוח מדווח על גלישות. האם הדיווח תואם?

**Ground truth:** `column.scrollHeight > column.clientHeight + 2` ישירות.

**תוצאה:** ✅ עבר.

#### T4: Side-note overlap — השוואה עם סף 1px

**מה נבדק:** הדוח מדווח על חפיפות הערות שוליים. האם הדיווח תואם?

**Ground truth:** השוואת `offsetTop` של הערות עם סף 1px.

**תוצאה:** ✅ עבר.

#### T5: Heading at bottom — השוואה עם ספירת שורות עצמאית

**מה נבדק:** הדוח מדווח על כותרות בתחתית טור. האם הדיווח תואם?

**Ground truth:** ספירת שורות עצמאית עם `getClientRects` על האלמנט האחרון.

**תוצאה:** ✅ עבר.

#### T6: Single-line p-cut — השוואה ל-Range.getClientRects

**מה נבדק:** הדוח מדווח על פסקאות p-cut חד-שורתיות. האם הדיווח תואם?

**Ground truth:** `Range.getClientRects` על הפסקה.

**תוצאה:** ✅ עבר.

#### T7: Empty column — השוואה לבדיקת p.length + title-level.length

**מה נבדק:** הדוח מדווח על טורים ריקים. האם הדיווח תואם?

**Ground truth:** `column.querySelectorAll('p').length === 0 && column.querySelectorAll('[class*="title-level-"]').length === 0`.

**תוצאה:** ✅ עבר.

#### T8: Imbalanced columns — השוואה ישירה

**מה נבדק:** הדוח מדווח על טורים לא מאוזנים. האם הדיווח תואם?

**Ground truth:** `|right-col.scrollHeight - left-col.scrollHeight| > 5` ישירות.

**תוצאה:** ✅ עבר.

#### T9: Font fallback — השוואה לבדיקת רשימת fallback מלאה

**מה נבדק:** הדוח מדווח על גופנים שנפלו ל-fallback. האם הדיווח תואם?

**Ground truth:** בדיקת רשימת fallback מלאה.

**באג שנמצא:** `checkFontFallback` נירמל את ה-requested על-ידי `s.split(',')[0]` — לקח רק את הגופן הראשון ברשימת ה-fallback. אבל CSS var `--fn-body` מכיל רשימת fallback מלאה: `'גוטמן רש"י רגיל', 'פרנק רוהל ליברה רגיל', serif`. כשהגופן הראשון לא נטען, הדפדפן נופל לשני — שזה בסדר גמור. אבל הדוח דיווח על זה כ-fallback שגוי.

**תוצאה:** false positives (לא false negatives) — דיווח על fallback כשאין.

**תיקון:** פיצול ה-requested לרשימה, ובדיקה אם ה-actual מופיע בה. `isInRequestedList = requestedList.some(r => r === firstActual || ...)`. `isFallback = !isInRequestedList && firstRequested !== firstActual`.

**תוצאה אחרי תיקון:** ✅ עבר.

#### T12: Tofu detection — בדיקת גופנים ידועים (קיים/לא-קיים/גנרי)

**מה נבדק:** הדוח מדווח על tofu (תיבות ריקות). האם הדיווח תואם?

**Ground truth:** בדיקת גופנים ידועים (קיים/לא-קיים/גנרי).

**באג שנמצא:** הגרסה הישנה בדקה רק "האם משהו מצויר" — אבל כשהגופן לא קיים, הדפדפן נופל ל-serif גנרי שכן מצייר עברית. אז הבדיקה תמיד החזירה false.

**תיקון:** הגרסה החדשה משווה בין ציור הגופן המבוקש לבין ציור serif גנרי. אם הם זהים (הפרש < 5% ממספר הפיקסלים), הגופן לא נטען ויש fallback. כמו-כן, גופנים גנריים (serif, sans-serif, וכו') לעולם אינם tofu.

**תוצאה אחרי תיקון:** ✅ עבר.

#### T13: Page errors — אפס שגיאות

**מה נבדק:** האם יש שגיאות JavaScript בעמוד?

**Ground truth:** `window.onerror` + `console.error`.

**תוצאה:** ✅ עבר (0 שגיאות).

#### T14: Report determinism — הרצה כפולה, תוצאות זהות

**מה נבדק:** האם הדוח דטרמיניסטי? הרצה כפולה של אותו מסמך אמורה לתת תוצאות זהות.

**Ground truth:** השוואת שני דוחות על אותו מסמך.

**תוצאה:** ✅ עבר.

#### T15: Empty document edge case — אין קריסה

**מה נבדק:** האם המערכת קורסת על מסמך ריק?

**Ground truth:** הזרקת טקסט ריק ובדיקה שאין קריסה.

**תוצאה:** ✅ עבר.

#### T16: Knuth-Plass consistency — KP מייצר שורות תקינות

**מה נבדק:** האם Knuth-Plass מייצר שורות תקינות?

**Ground truth:** השוואת פלט KP ל-DOM-greedy על 30 מילים.

**תוצאה:** ✅ עבר (5 שורות אופטימליות במקום 24).

#### T17: Sparse threshold monotonicity — ספירה מונוטונית בעליית סף

**מה נבדק:** האם מספר הדלילויות יורד מונוטונית כשהסף עולה?

**Ground truth:** הרצת הדוח עם ספים שונים (30%, 40%, 50%, 60%, 70%) ובדיקת מונוטוניות.

**תוצאה:** ✅ עבר.

### 4.3 תוצאה סופית

```
=== FINAL SUMMARY ===
  ✓ T1: Widow/Orphan
  ✓ T2: Sparse p-cut
  ✓ T3: Column overflow
  ✓ T4: Side-note overlap
  ✓ T5: Heading at bottom
  ✓ T6: Single-line p-cut
  ✓ T7: Empty column
  ✓ T8: Imbalanced columns
  ✓ T9: Font fallback
  ✓ T12: Tofu detection
  ✓ T13: Page errors
  ✓ T14: Report determinism
  ✓ T15: Empty document edge case
  ✓ T16: Knuth-Plass consistency
  ✓ T17: Sparse threshold monotonicity

  Total: 15 passed, 0 failed
```

**3 באגים קריטיים תוקנו ב-`test-suite.js`:**
1. Sparse p-cut false positives ב-RTL (`rect.width` → `rect.right - colRect.left`).
2. Font fallback false negatives (רשימת fallback מלאה במקום ראשון בלבד).
3. detectTofu תמיד false (השוואה ל-serif גנרי).

**14 פונקציות חשופות על `window`** לצורכי אימות חיצוני.

---

## 5. שיטות מדידה נכונות vs שגויות

### 5.1 מדידת שורות בפסקה

#### ❌ שגוי: `getLinesFromParagraph` (measuring-box נפרד)

**הבעיה:** הפונקציה משתמשת ב-measuring-box נפרד עם ערכי CSS מחושבים. היא אינה תואמת את הרינדור בפועל בגלל:
- subpixel positioning שונה.
- font-hinting שונה בין measuring-box ו-DOM.
- `transform: scale` לא חל על measuring-box.

**תוצאה:** הדוח המקורי דיווח על 752 דלילויות (שגויות) במקום ~30 אמיתיות.

#### ✅ נכון: `Range.getClientRects()`

```javascript
const range = document.createRange();
range.selectNodeContents(paragraph);
const rects = Array.from(range.getClientRects());
const lineCount = rects.length;
```

מודד שורות בפועל ב-DOM החי.

### 5.2 מדידת רוחב שורה ב-RTL

#### ❌ שגוי: `rect.width`

**הבעיה:** ב-RTL, `Range.getClientRects()` מחזיר מספר rects לאותה שורה (אחד לכל span פנימי, כמו drop-word). כל `rect.width` הוא רק רוחב ה-span עצמו, לא רוחב השורה.

**דוגמה:** פסקה בעמוד 14, שורה אחרונה "שהרי בפני התחלה." — `rect.width=60px` אבל בפועל השורה מתפרסת מ-x=879 עד x=939 (הקצה הימני של הטור). רוחב אמיתי מ-colRect.left עד rect.right = 368px (מלא!).

**תוצאה:** 87 false positives — הדוח דיווח על 87 שורות דלילות שלא היו דלילות בכלל.

#### ✅ נכון: `rect.right - colRect.left`

```javascript
const colRect = column.getBoundingClientRect();
const range = document.createRange();
range.selectNodeContents(paragraph);
const rects = Array.from(range.getClientRects());
const lastRect = rects[rects.length - 1];
const lineWidth = lastRect.right - colRect.left;
const colWidth = colRect.width;
const ratio = lineWidth / colWidth;
```

המרחק מתחילת הטור עד סוף הטקסט. נכון ל-RTL ול-LTR כאחד.

### 5.3 בדיקת טעינת גופן

#### ❌ שגוי: `document.fonts.status === 'loaded'`

**הבעיה:** `document.fonts.status === 'loaded'` מציין שהדפדפן **סיים לנסות** לטעון גופנים — לא שהטעינה הצליחה.

**תוצאה:** המערכת חשבה שגופנים נטענו, אבל בפועל הם לא.

#### ✅ נכון: `document.fonts.check()`

```javascript
const isLoaded = await document.fonts.check('12pt "גופן עברי"');
if (!isLoaded) {
    console.warn('גופן לא נטען');
}
```

### 5.4 בדיקת fallback גופן

#### ❌ שגוי: בדיקת ראשון בלבד

```javascript
const requested = getComputedStyle(p).fontFamily.split(',')[0];
// אם actual !== requested → fallback
```

**הבעיה:** CSS var `--fn-body` מכיל רשימת fallback מלאה: `'גופן א', 'גופן ב', serif`. כשהראשון לא נטען, הדפדפן נופל לשני — שזה בסדר גמור. אבל הבדיקה דיווחה על זה כ-fallback שגוי.

#### ✅ נכון: בדיקת רשימת fallback מלאה

```javascript
const requested = getComputedStyle(p).fontFamily;
const requestedList = requested.split(',').map(s => s.trim().replace(/['"]/g, ''));
const actual = /* גופן בפועל */;
const isInRequestedList = requestedList.some(r => r === actual);
const isFallback = !isInRequestedList && requestedList[0] !== actual;
```

### 5.5 בדיקת tofu

#### ❌ שגוי: "האם משהו מצויר"

```javascript
function detectTofu(char, font) {
    const canvas = drawChar(char, font);
    return !isAnythingDrawn(canvas);
}
```

**הבעיה:** כשהגופן לא קיים, הדפדפן נופל ל-serif גנרי שכן מצייר עברית. אז הבדיקה תמיד החזירה false.

#### ✅ נכון: השוואה ל-serif גנרי

```javascript
function detectTofu(char, font) {
    if (['serif', 'sans-serif', 'monospace'].includes(font)) return false;
    
    const canvas1 = drawChar(char, font);
    const canvas2 = drawChar(char, 'serif');
    const diff = compareCanvases(canvas1, canvas2);
    return diff < 0.05; // אם זהים, הגופן לא נטען
}
```

### 5.6 מדידת גובה טור

#### ❌ שגוי: `offsetTop` עם `position: relative`

**הבעיה:** אם יש `p { position: relative; }` ב-CSS, כל פסקה הופכת ל-`offsetParent` עבור עצמה, וה-`offsetTop` של המילים נמדד יחסית לתחילת הפסקה המקומית ולא במצטבר לכל אורך הטור.

#### ✅ נכון: `getBoundingClientRect()`

```javascript
const measureBoxRect = measureBox.getBoundingClientRect();
const wordRect = wordSpan.getBoundingClientRect();
const absoluteTop = wordRect.top - measureBoxRect.top;
```

### 5.7 מדידת גובה טור עם `transform: scale`

#### הבדלים חשובים:

| מאפיין | מושפע מ-`scale`? |
|---|---|
| `getBoundingClientRect().width` | ✅ כן (מוגדל פי scale) |
| `getBoundingClientRect().height` | ✅ כן |
| `offsetWidth` | ❌ לא |
| `offsetHeight` | ❌ לא |
| `clientWidth` | ❌ לא |
| `clientHeight` | ❌ לא |
| `scrollWidth` | ❌ לא |
| `scrollHeight` | ❌ לא |
| `Range.getClientRects()` | ✅ כן |

**מסקנה:** יש להשתמש ב-`getBoundingClientRect().width` להשוואה עם `getClientRects().width` (שניהם מושפעים מ-scale), או להשתמש ב-`offsetWidth`/`scrollHeight` (לא מושפעים).

---

## 6. בדיקה בתצוגת המערכת (חיה בדפדפן)

### 6.1 פרוטוקול בדיקה

1. **טען את המערכת** מ-GitHub Pages: `https://suginach.github.io/IMUD_TORANI/`
2. **המתן לטעינת גופנים:**
   ```javascript
   await page.waitForFunction(() => document.fonts.status === 'loaded');
   await page.waitForTimeout(2000);
   ```
3. **בדוק שגופנים באמת נטענו:**
   ```javascript
   const fontsLoaded = await page.evaluate(() => {
       return document.fonts.check('12pt "פרנק רוהל ליברה רגיל"');
   });
   if (!fontsLoaded) throw new Error('גופנים לא נטענו');
   ```
4. **הזרק טקסט seeded:**
   ```javascript
   await page.evaluate(() => {
       document.getElementById('raw-input').innerText = window.generateTestTextSeeded();
       window.typesetDocument();
   });
   ```
5. **המתן לסיום עימוד:**
   ```javascript
   await page.waitForFunction(() => {
       const pages = document.querySelectorAll('.a4-page');
       return pages.length >= 100; // מספר צפוי
   }, { timeout: 120000 });
   ```
6. **הפק דוח עימוד:**
   ```javascript
   const report = await page.evaluate(() => window.generateLayoutReport());
   ```
7. **בדוק תוצאות:**
   - עמודים: מספר צפוי
   - גלישות: 0
   - אלמנות: 0 או מעט
   - יתומים: 0
   - דלילות p-cut: 0 או מעט
   - לא מאוזנים: מעט (תלוי בכותרות)
8. **צלם מסך לאימות ויזואלי:**
   ```javascript
   await page.screenshot({ path: 'page-1.png', fullPage: false });
   ```

### 6.2 בדיקות ספציפיות

#### 6.2.1 בדיקת אלמנות

```javascript
const widows = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('.block-2col').forEach(block => {
        const cols = block.querySelectorAll('.col-l, .col-r');
        cols.forEach(col => {
            const firstP = col.querySelector('p:first-child');
            if (!firstP || !firstP.classList.contains('p-cut')) return;
            
            const range = document.createRange();
            range.selectNodeContents(firstP);
            const rects = Array.from(range.getClientRects());
            if (rects.length === 1) {
                issues.push({
                    page: /* מספר עמוד */,
                    col: col.classList.contains('col-l') ? 'L' : 'R',
                    type: 'widow'
                });
            }
        });
    });
    return issues;
});
```

#### 6.2.2 בדיקת דלילות p-cut

```javascript
const sparse = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('.block-2col').forEach(block => {
        const cols = block.querySelectorAll('.col-l, .col-r');
        cols.forEach(col => {
            const colRect = col.getBoundingClientRect();
            const ps = col.querySelectorAll('p.p-cut');
            ps.forEach(p => {
                const range = document.createRange();
                range.selectNodeContents(p);
                const rects = Array.from(range.getClientRects());
                if (rects.length === 0) return;
                const lastRect = rects[rects.length - 1];
                const lineWidth = lastRect.right - colRect.left;
                const colWidth = colRect.width;
                const ratio = lineWidth / colWidth;
                if (ratio < 0.5) {
                    issues.push({
                        page: /* מספר עמוד */,
                        col: col.classList.contains('col-l') ? 'L' : 'R',
                        type: 'sparse',
                        ratio: ratio
                    });
                }
            });
        });
    });
    return issues;
});
```

#### 6.2.3 בדיקת גלישות

```javascript
const overflows = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('.col-l, .col-r').forEach(col => {
        if (col.scrollHeight > col.clientHeight + 2) {
            issues.push({
                page: /* מספר עמוד */,
                col: col.classList.contains('col-l') ? 'L' : 'R',
                type: 'overflow',
                scrollHeight: col.scrollHeight,
                clientHeight: col.clientHeight
            });
        }
    });
    return issues;
});
```

#### 6.2.4 בדיקת חוסר איזון

```javascript
const imbalanced = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('.block-2col').forEach(block => {
        const rCol = block.querySelector('.col-l');
        const lCol = block.querySelector('.col-r');
        if (!rCol || !lCol) return;
        const delta = Math.abs(rCol.scrollHeight - lCol.scrollHeight);
        if (delta > 5) {
            issues.push({
                page: /* מספר עמוד */,
                type: 'imbalanced',
                delta: delta,
                rHeight: rCol.scrollHeight,
                lHeight: lCol.scrollHeight
            });
        }
    });
    return issues;
});
```

### 6.3 בדיקת עמוד ספציפי

כשהמשתמש מדווח על בעיה בעמוד ספציפי:

```javascript
const pageIssues = await page.evaluate((pageNum) => {
    const page = document.querySelector(`.a4-page[data-page-num="${pageNum}"]`);
    if (!page) return null;
    
    // בדוק כל בעיה אפשרית בעמוד הזה
    return {
        overflow: /* בדוק גלישות */,
        imbalanced: /* בדוק חוסר איזון */,
        widows: /* בדוק אלמנות */,
        sparse: /* בדוק דלילות */,
        headings: /* בדוק כותרות בתחתית */,
        // ...
    };
}, 47);
```

---

## 7. בדיקה ב-PDF מיוצא

### 7.1 אתגרים ייחודיים

1. **רינדור שונה** — גופנים נרנדרים אחרת ב-PDF (font hinting, subpixel positioning).
2. **הבדלי פלטפורמה** — Windows vs Linux גורמים למספר עמודים שונה (362 ב-Linux, 373 ב-Windows).
3. **קשה לבדוק אוטומטית** — צריך כלי כמו `pdftotext` או צילום מסך.

### 7.2 שיטות בדיקה

#### 7.2.1 חילוץ טקסט עם `pdftotext`

```bash
pdftotext -layout rendered-document.pdf output.txt
```

**מגבלות:**
- לא מציג מיקומים מדויקים.
- לא מזהה גלישות.
- לא מזהה חוסר איזון.

#### 7.2.2 בדיקת גופנים עם `pdffonts`

```bash
pdffonts rendered-document.pdf
```

**שימוש:** זיהוי גופני fallback. אם רואים `TimesNewRomanPS-BoldMT` במקום הגופן העברי המבוקש — יש בעיית טעינת גופן.

#### 7.2.3 צילום מסך של עמוד ספציפי

```bash
# עם ImageMagick
convert rendered-document.pdf[46] page-47.png

# עם pdftoppm
pdftoppm -png -f 47 -l 47 rendered-document.pdf page
```

#### 7.2.4 VLM לניתוח תמונות — **אסור!**

**הבעיה:** VLM (Vision Language Model) **הזה (hallucinated)** — המציא טקסט שלא קיים במסמך ("השגחה פרטית", "שבת קכ"ט ע"ב", "שלוש עשרה עיקרים"). דיווח על בעיות שלא קיימות.

**מסקנה:** VLM אינו אמין לקריאת טקסט עברי דחוס. יש להשתמש ב-DOM inspection תכנוני במקום.

### 7.3 פרוטוקול בדיקת PDF

1. **ייצא PDF** מהמערכת (הדפסה → שמירה כ-PDF).
2. **השווה מספר עמודים** למספר הצפוי.
3. **בדוק גופנים** עם `pdffonts`.
4. **חלץ טקסט** עם `pdftotext` והשווה לטקסט המקור.
5. **צלם עמודים בעייתיים** לבדיקה ויזואלית.
6. **אל תשתמש ב-VLM** לניתוח.

### 7.4 `beforeprint` re-typeset

**חשוב:** `beforeprint` re-typeset רץ לפני הייצוא. זה אמור להבטיח שה-PDF תואם את המסך. אבל:

**בדיקה שנעשתה:** השוואת מצב screen מול מצב print באותו מסמך הראתה שהם זהים (2 לא מאוזנים בשניהם). **ה-beforeprint אינו הסבר להבדלים.**

**מסקנה:** ההסבר האמיתי להבדלי HTML/PDF היה טעינת גופנים (ראה סעיף 8), לא beforeprint.

---

## 8. בדיקה ב-HTML מיוצא

### 8.1 אתגרים ייחודיים

1. **גופנים לא נטענים** — `file://` protocol חוסם טעינת גופנים מקבצים חיצוניים (CORS).
2. **`document.fonts.check()` מחזיר false** — אפילו ש-`document.fonts.status === 'loaded'`.
3. **שבירת שורות שונה** — גופן fallback עם מדדים שונים → שבירה שונה → איזון שונה.

### 8.2 המסע ל-HTML מדויק — 5 ניסיונות

#### ניסיון 1 (נכשל): `beforeprint` re-typeset כהסבר

**השערה:** ה-HTML נוצר במצב screen, אבל ה-PDF נוצר אחרי `beforeprint` שמפעיל `performTypeset()` מחדש במצב print.

**בדיקה:** השוואת מצב screen מול מצב print באותו מסמך. תוצאה: **שניהם זהים** — 2 לא מאוזנים בשניהם. ה-beforeprint אינו הסבר.

**מסקנה:** ה-beforeprint לא הסבר הנכון. המסמך בדף המערכת (screen) כבר מאוזן נכון.

#### ניסיון 2 (נכשל): re-typeset ב-scale=1 לייצוא

**השערה:** ה-`transform: scale(1.3657)` על `#book-container` גורם ל-subpixel rendering שונה. כשמבטלים את ה-scale, שבירת השורות משתנה.

**בדיקה:** הגדרת `--preview-scale: 1`, הרצת `performTypeset()`, ייצוא. תוצאה: עדיין 199 לא מאוזנים.

**מסקנה:** ה-scale אינו הסבר. ה-re-typeset יצר מסמך שונה אבל עדיין לא זהה ל-DOM החי.

#### ניסיון 3 (הצליח חלקית): תיקון CSS variables

**גילוי:** `typesetter.js` מציב ערכים מדויקים (`--w-col: 39.604%`) ישירות על `document.documentElement.style`. אבל `exportRenderedHTML` קרא רק את ה-CSS rules המקוריים (`--w-col: 40%`).

**תיקון:** קריאת inline styles מ-`document.documentElement.style` + הצבתם אחרי ה-CSS המלא.

**תוצאה:** CSS variables זהים כעת. אבל עדיין 199 לא מאוזנים — רוחב הטור זהה אבל גובה הפסקאות שונה ב-1px.

#### ניסיון 4 (הצליח חלקית): שכפול `#preview-pane`

**גילוי:** ה-HTML המיוצא שכפל רק את `#book-container`, שהפך לילד ישיר של `<body>` במקום ילד של `#preview-pane`. המבנה ההיררכי השונה גרם ל-layout שונה.

**תיקון:** שכפול `#preview-pane` במקום `#book-container`.

**תוצאה:** עדיין 1px הבדל ב-`offsetHeight` של פסקאות.

#### ניסיון 5 (הצליח!): הטמעת גופנים כ-base64

**גילוי מרכזי:** `document.fonts.check()` החזיר **false** לכל 12 גופני העדיפות ב-HTML המיוצא! למרות ש-`document.fonts.status` היה "loaded", הגופנים לא באמת נטענו.

**סיבה:** ה-`@font-face` מפנה ל-`fonts/...` אבל התיקייה לא תמיד ליד ה-HTML. וגם כשהיא לידו, `file://` protocol חוסם טעינת גופנים בכמה דפדפנים (CORS).

**תיקון:** הטמעת 12 גופני העדיפות כ-base64 ישירות ב-CSS:
1. `fetch('fonts/' + fontFile)` → `blob`
2. `FileReader.readAsDataURL(blob)` → base64
3. החלפת `url('fonts/FILE.woff2')` עם `url(data:application/font-woff2;base64,...)`

**תוצאה:** **3 לא מאוזנים ב-HTML המיוצא = 3 ב-DOM החי (0.9%)** ✓

**מסקנה חשובה:** הבעיה לא הייתה ב-CSS variables או ב-scale או ב-re-typeset. הבעיה הייתה ש**הגופנים לא נטענו** ב-HTML המיוצא, והדפדפן השתמש ב-fallback (serif) עם מדדים שונים → שבירת שורות שונה → איזון שונה.

### 8.3 פרוטוקול בדיקת HTML מיוצא

1. **ייצא HTML** מהמערכת (כפתור "💾 ייצוא HTML").
2. **פתח את ה-HTML** בדפדפן.
3. **בדוק טעינת גופנים:**
   ```javascript
   const fontsLoaded = await document.fonts.check('12pt "פרנק רוהל ליברה רגיל"');
   if (!fontsLoaded) {
       console.error('גופנים לא נטענו ב-HTML המיוצא!');
   }
   ```
4. **השווה מספר עמודים** למספר בתצוגת המערכת.
5. **השווה דוח עימוד** לדוח בתצוגת המערכת.
6. **אם יש הבדלים:** בדוק אם גופנים מוטמעים כ-base64.

### 8.4 בדיקת השוואת מסמכים

**השוואת דוח עימוד — 22 מתוך 23 מדדים זהים לחלוטין** (מול המשתמש):

| מדד | אצלי (GitHub Pages) | אצל המשתמש | זהים? |
|---|---|---|---|
| עמודים | 558 | 558 | ✅ |
| בלוקים | 683 | 683 | ✅ |
| לא מאוזן | 67 | 67 | ✅ |
| מותאמות | 1117 | 1117 | ✅ |
| tightenRunts | 121 | 121 | ✅ |
| גופנים נטענו | 12/12 | 12/12 | ✅ |
| tofu | 2 | 1 | ⚠️ (דפדפן/מערכת הפעלה) |

**PDF — זהה לחלוטין:** 559 עמודים אצל שנינו, תוכן טקסט זהה ב-99.64%.

**HTML — כמעט זהה:** 7.7MB=7.7MB, 12 גופנים מוטמעים=12, כל המבנה תואם.

---

## 9. מערכת trace-manager.js — מעקב אחרי קריאות פונקציות

### 9.1 תכלית

מאפשר:
1. רישום כל הקריאות לפונקציות העימוד עבור כל פרק (H1/H2/H0) בנפרד.
2. לחיצה על קריאה → רינדור הפרק הזה בלבד עד לקריאה הזו.
3. צ'קבוקס לכל קריאה → דילוג על הקריאה ברינדור הבא.

### 9.2 ארכיטקטורה

- מקבל hooks מ-`typesetter.js`: `__traceOnChaptersBuilt`, `__traceOnChapterStart`.
- עוטף פונקציות גלובליות של `typesetter.js` כדי לתעד קריאות.
- מציג UI בכרטיסיית "בדיקה" (מוחלף בין דוח עימוד לבין תצוגת מעקב).

### 9.3 מצב גלובלי

```javascript
const state = {
  enabled: false,                  // האם מצב מעקב פעיל
  chapters: [],                    // רשימת פרקים שזוהו
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
```

### 9.4 פעולות ציבוריות

```javascript
window.__traceStartFullCapture()        // רינדור מלא עם capture של כל הקריאות
window.__traceRenderUpToStep(chapterIdx, seqInChapter)  // רינדור פרק בודד עד לקריאה
window.__traceRenderWithSkips()         // רינדור מלא עם skip set שמור
window.__traceStop()                    // עצירת מצב מעקב
window.__traceGetStepLog(chapterIdx)    // קבלת רשימת קריאות לפרק
window.__traceSetSkip(chapterIdx, seqInChapter, skip)  // סימון דילוג
```

### 9.5 תרחיש שימוש — איתור קריאה בעייתית

כשיש בעיה בעימוד פרק מסוים ולא ברור איזו פונקציה גורמת לה:

1. **הפעל `__traceStartFullCapture()`** — המערכת תרשום את כל הקריאות.
2. **בחר פרק ב-UI** — רשימת הקריאות תופיע.
3. **לחץ על קריאה ספציפית** — המערכת תרנדר רק את הפרק עד לקריאה הזו.
4. **בדוק אם הבעיה כבר קיימת** בנקודה הזו.
5. **אם לא — המשך לקריאה הבאה.** אם כן — הבעיה נוצרה בקריאה הזו.
6. **סמן צ'קבוקס "דילג" על הקריאה** — המערכת תדלג עליה ברינדור הבא.
7. **בדוק אם הבעיה נעלמה** — אם כן, אישרנו שהקריאה הזו גורמת לבעיה.
8. **חזור על התהליך** עד לאיתור הקריאה הבעייתית.

---

## 10. מחולל טקסט seeded (LCG) — בסיס לבדיקות עקביות

### 10.1 הבעיה עם `Math.random()`

`Math.random()` יוצר מסמך שונה בכל הרצה. זה מונע אימות עקבי — אי אפשר להשוות בין הרצות, ואי אפשר לדעת אם שינוי עזר או הזיק.

### 10.2 הפתרון: Seeded random (LCG)

`generateTestTextSeeded()` ב-`test-suite.js` משתמש ב-**LCG (Linear Congruential Generator)** עם seed קבוע (12345).

```javascript
function generateTestTextSeeded() {
    let seed = 12345;
    const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
    // ... יצירת טקסט עם rand()
}
```

### 10.3 יתרונות

1. **שחזור מלא** — אותו טקסט, אותם עמודים, אותן בעיות — בכל הרצה.
2. **השוואה אפשרית** — אפשר להשוות בין הרצות לפני ואחרי שינוי.
3. **דיבאג עקבי** — אם יש בעיה בעמוד 47, היא תהיה שם תמיד.
4. **בדיקות אוטומטיות** — אפשר לכתוב בדיקות שמצפות למספרים ספציפיים.

### 10.4 כיסוי טקסט הבדיקה

טקסט הבדיקה (1,106,519 תווים, 362 עמודים) מכסה:
- 17 רמות אורך פסקה (1 עד 800 מילים).
- סדרת פיבונאצ'י (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610).
- כל רמות הכותרות (H0-H7) בכל השילובים.
- H3 חוצה טורים (6 פעמים).
- H4 בתחילת טור (בדיקת `:first-child`).
- 80 סבבים של H4+H7+H5+H6+H7 עם אורכים עולים.
- רצף 25 פסקאות שורה אחת עם H7.
- פסקה באורך עמוד מלא (900 מילים).

---

## 11. יומן הבאגים שנמצאו בבדיקות עצמן

### 11.1 באג 1 (T2 — קריטי): Sparse p-cut false positives ב-RTL

**סיבה:** הדוח השתמש ב-`rect.width` למדידת רוחב שורה. ב-RTL, `Range.getClientRects()` מחזיר מספר rects לאותה שורה (אחד לכל span פנימי, כמו drop-word). כל `rect.width` הוא רק רוחב ה-span עצמו, לא רוחב השורה.

**תוצאה:** 87 false positives — הדוח דיווח על 87 שורות דלילות שלא היו דלילות בכלל.

**דוגמה:** פסקה בעמוד 14, שורה אחרונה "שהרי בפני התחלה." — `rect.width=60px` אבל בפועל השורה מתפרסת מ-x=879 עד x=939. רוחב אמיתי = 368px (מלא!).

**תיקון:** החלפת `rect.width` ב-`rect.right - colRect.left`.

### 11.2 באג 2 (T9): Font fallback false negatives

**סיבה:** `checkFontFallback` נירמל את ה-requested על-ידי `s.split(',')[0]` — לקח רק את הגופן הראשון ברשימת ה-fallback.

**תוצאה:** false positives — דיווח על fallback כשאין.

**תיקון:** פיצול ה-requested לרשימה, ובדיקה אם ה-actual מופיע בה.

### 11.3 באג 3 (T12): detectTofu תמיד false

**סיבה:** הגרסה הישנה בדקה רק "האם משהו מצויר" — אבל כשהגופן לא קיים, הדפדפן נופל ל-serif גנרי שכן מצייר עברית.

**תיקון:** השוואה ל-serif גנרי.

### 11.4 באג 4: פונקציות פנימיות לא חשופות על window

**סיבה:** כל פונקציות הבדיקה היו פנימיות ב-IIFE ולא חשופות על `window`. הקריאה `window.checkEmptyColumn` החזירה `undefined`.

**תיקון:** חשיפת 14 פונקציות על `window` לצורכי אימות חיצוני.

### 11.5 באג 5: 1087 דיווחי fallback גופן שווא (V16-V17)

**סיבה:** `checkFontFallback()` השווה את השם המבוקש `גוטמן רש"י רגיל` (עם גרשיים `"` U+0022) לעומת השם בפועל `גוטמן רש\י רגיל` (עם לוכסן אחורי `\` — בריחת דפדפן). ההשוואה נכשלה ודיווחה על fallback למרות שהגופן נטען כראוי.

**תיקון:** נרמול שמות גופן — הסרת גרשיים, לוכסנים, ורווחים לפני ההשוואה.

**תוצאה:** 1087 → 0 false positives.

### 11.6 באג 6: 752 דלילויות שווא (V16-V17)

**סיבה:** `checkSparse` השתמש ב-`getLinesFromParagraph` — פונקציה שמחשבת שבירת שורות ב-measuring-box נפרד. החישוב אינו תואם את הרינדור בפועל בדפדפן.

**תיקון:** החלפה מלאה ל-`Range.getClientRects()`.

**תוצאה:** 752 → 81 (ואז → 0 אחרי סינון p-end).

### 11.7 באג 7: דלילות p-end דווחה כבעיה (V16-V17)

**סיבה:** הדוח בדק כל פסקה (גם p-end וגם p-cut) לדלילות. אבל דלילות ב-p-end (סיום טבעי ממורכז) אינה בעיה.

**תיקון:** דלילות נבדקת **רק ב-p-cut**.

**תוצאה:** 81 → 0.

### 11.8 באג 8: 19 אלמנות שווא (V16-V17)

**סיבה:** סף `offsetHeight < lineHeight × 2.2` היה רגיש מדי — פסקאות עם 2 שורות סומנו כאלמנות.

**ניסיון 1:** הורדת סף ל-`× 1.5` — עדיין דיווח על פסקאות עם 2 שורות.

**ניסיון 2 (הצליח):** סף `× 1.1` — רק פסקאות עם שורה אחת ממש.

**תוצאה:** 19 → 4 אלמנות (ואז → 1 אחרי תיקון `fixWidowContinuation`).

### 11.9 באג 9: 3 כותרות בתחתית שווא (V16-V17)

**סיבה:** `checkHeadingAtColumnBottom` בדק רק אם האלמנט האחרון הוא כותרת. לא בדק את המקרה של "כותרת עם <2 שורות אחריה".

**תיקון:** נוספה בדיקה: אם האלמנט הלפני-אחרון הוא כותרת, ספור שורות באלמנט האחרון עם `getClientRects`. אם <2 שורות — דווח.

**תוצאה:** 0 (אין כותרות בתחתית במסמך הבדיקה).

### 11.10 באג 10: HTML מיוצא לא תואם DOM חי (V16-V17)

**סיבה:** 199–209 לא מאוזנים ב-HTML המיוצא (58%), בעוד ה-DOM החי הראה רק 2–4 (0.6%).

**ניסיונות שנכשלו:**
1. `beforeprint` re-typeset — לא הסבר.
2. re-typeset ב-scale=1 — יצר מסמך שונה.
3. תיקון CSS variables — עזר חלקית.
4. שכפול `#preview-pane` — עזר חלקית.

**הסבר האמיתי:** `document.fonts.check()` החזיר **false** לכל 12 גופני העדיפות ב-HTML המיוצא! הגופנים לא באמת נטענו, והדפדפן השתמש ב-fallback עם מדדים שונים.

**תיקון:** הטמעת 12 גופני העדיפות כ-base64 ישירות ב-CSS.

**תוצאה:** 3 לא מאוזנים ב-HTML המיוצא = 3 ב-DOM החי (0.9%) ✓.

---

## 12. ניסיונות בדיקה שנפסלו

### 12.1 VLM לבדיקה ויזואלית

**ניסיון:** שימוש ב-VLM (Vision Language Model) לניתוח תמונות PDF והשוואה לדוח.

**תוצאה:** ה-VLM **הזה (hallucinated)** — המציא טקסט שלא קיים במסמך ("השגחה פרטית", "שבת קכ"ט ע"ב", "שלוש עשרה עיקרים"). דיווח על בעיות שלא קיימות.

**מסקנה:** VLM אינו אמין לקריאת טקסט עברי דחוס. יש להשתמש ב-DOM inspection תכנוני במקום.

### 12.2 `beforeprint` כהסבר להבדלי HTML/PDF

**ניסיון:** הסבר ההבדל בין HTML ל-PDF על-ידי `beforeprint` re-typeset.

**תוצאה:** בדיקה הראתה שמצב screen ומצב print זהים (2 לא מאוזנים בשניהם). ה-beforeprint אינו הסבר.

**מסקנה:** ההסבר האמיתי היה טעינת גופנים (base64 embedding).

### 12.3 `performTypeset()` ב-scale=1 לייצוא

**ניסיון:** הרצת `performTypeset()` עם `--preview-scale: 1` לפני הייצוא, כדי שהאיזון יחושב בלי scale.

**תוצאה:** יצר מסמך **שונה** מה-DOM החי (כי העימוד חושב מחדש ב-scale שונה). ה-HTML המיוצא הכיל מסמך שונה ממה שהמשתמש רואה.

**מסקנה:** אל תריץ `performTypeset()` לפני הייצוא. שכפל את ה-DOM החי כמו שהוא.

### 12.4 `--preview-scale: 1` ב-HTML המיוצא

**ניסיון:** הגדרת `--preview-scale: 1` ב-CSS vars של ה-HTML המיוצא, כדי שלא יהיה scale.

**תוצאה:** ה-HTML המיוצא הכיל מסמך שעומד ב-scale=1, אבל ה-CSS var אמר 1 — כלומר ה-scale לא תאם את המסמך.

**מסקנה:** יש לשמור את ה-`--preview-scale` המקורי ב-HTML המיוצא.

### 12.5 מיזוג `@media print` לתוך ה-CSS הרגיל

**ניסיון:** חילוץ כללי `@media print` מ-`style.css` והחלתם כברירת מחדל ב-HTML המיוצא.

**תוצאה:** לא עזר — הבעיה הייתה בגופנים, לא ב-CSS.

### 12.6 `getLinesFromParagraph` לבדיקת שורות

**ניסיון:** שימוש ב-`getLinesFromParagraph()` (פונקציה שמחשבת שבירת שורות ב-measuring-box נפרד) לבדיקת דלילות.

**תוצאה:** החישוב אינו תואם את הרינדור בפועל בדפדפן. 752 דלילויות שגויות.

**מסקנה:** השתמש ב-`Range.getClientRects()` במקום.

### 12.7 `document.fonts.status` לבדיקת טעינת גופן

**ניסיון:** שימוש ב-`document.fonts.status === 'loaded'` לבדיקת טעינת גופן.

**תוצאה:** `document.fonts.status === 'loaded'` מציין שהדפדפן **סיים לנסות** לטעון — לא שהטעינה הצליחה.

**מסקנה:** השתמש ב-`document.fonts.check()` במקום.

### 12.8 `rect.width` ב-RTL

**ניסיון:** שימוש ב-`rect.width` למדידת רוחב שורה ב-RTL.

**תוצאה:** 87 false positives — `rect.width` אינו רוחב שורה ב-RTL.

**מסקנה:** השתמש ב-`rect.right - colRect.left` במקום.

### 12.9 `offsetTop` עם `position: relative`

**ניסיון:** שימוש ב-`span.offsetTop` למדידת מיקום מילים.

**תוצאה:** ערכי ה-`top` התאפסו בכל פסקה מחדש כי `p { position: relative; }` הפך כל פסקה ל-`offsetParent` עבור עצמה.

**מסקנה:** השתמש ב-`getBoundingClientRect()` במקום.

### 12.10 `Math.random()` לטקסט בדיקה

**ניסיון:** שימוש ב-`Math.random()` ליצירת טקסט בדיקה.

**תוצאה:** מסמך שונה בכל הרצה — אי אפשר להשוות בין הרצות.

**מסקנה:** השתמש ב-seeded random (LCG) במקום.

---

## 13. פרוטוקול בדיקה מלא אחרי כל תיקון

### 13.1 לפני הגשת כל תיקון

1. **בדוק את התיקון בדפדפן חסר-ראש (Playwright):**
   ```javascript
   // טען מערכת
   // הזרק טקסט seeded
   // המתן לעימוד
   // הפק דוח
   // בדוק שהבעיה נפתרה
   ```

2. **בדוק שלא נוצרו בעיות חדשות:**
   - גלישות: 0
   - אלמנות: 0 או מעט
   - יתומים: 0
   - דלילות p-cut: 0 או מעט
   - לא מאוזנים: לא גרוע יותר מלפני

3. **השווה להרצה הקודמת:**
   - מספר עמודים דומה?
   - מדדים דומים?

4. **בדוק בטקסט מלא** (אם התיקון עשוי להשפיע על ביצועים):
   - זמן רינדור סביר?
   - אין קריסת דפדפן?

### 13.2 בדיקות ספציפיות לכל סוג תיקון

#### תיקון אלמנות/יתומים

```javascript
// בדוק שאלמנות ירדו
const widowsBefore = /* מספר לפני תיקון */;
const widowsAfter = /* מספר אחרי תיקון */;
assert(widowsAfter < widowsBefore, 'אלמנות לא ירדו');

// בדוק שלא נוצרו דלילויות חדשות
const sparseBefore = /* מספר לפני */;
const sparseAfter = /* מספר אחרי */;
assert(sparseAfter <= sparseBefore + 2, 'נוצרו דלילויות חדשות');
```

#### תיקון דלילויות

```javascript
const sparseBefore = /* מספר לפני */;
const sparseAfter = /* מספר אחרי */;
assert(sparseAfter < sparseBefore, 'דלילויות לא ירדו');

// בדוק שלא נוצרו אלמנות חדשות
const widowsBefore = /* מספר לפני */;
const widowsAfter = /* מספר אחרי */;
assert(widowsAfter <= widowsBefore, 'נוצרו אלמנות חדשות');
```

#### תיקון חוסר איזון

```javascript
const imbalancedBefore = /* מספר לפני */;
const imbalancedAfter = /* מספר אחרי */;
assert(imbalancedAfter < imbalancedBefore, 'חוסר איזון לא ירד');

// בדוק שלא נוצרו גלישות
const overflowAfter = /* מספר אחרי */;
assert(overflowAfter === 0, 'נוצרו גלישות');
```

### 13.3 בדיקת רגרסיה

```javascript
// הרץ את כל 17 הבדיקות (T1-T17)
const results = await page.evaluate(() => {
    return window.runAllValidationTests();
});

assert(results.passed === 15, `${15 - results.passed} בדיקות נכשלו`);
```

### 13.4 בדיקת HTML מיוצא

```javascript
// ייצא HTML
const htmlContent = await page.evaluate(() => window.exportRenderedHTML());

// שמור לקובץ
fs.writeFileSync('test-export.html', htmlContent);

// פתח בדפדפן חדש
const page2 = await browser.newPage();
await page2.goto('file://' + path.resolve('test-export.html'));

// בדוק גופנים
const fontsLoaded = await page2.evaluate(() => {
    return document.fonts.check('12pt "פרנק רוהל ליברה רגיל"');
});
assert(fontsLoaded, 'גופנים לא נטענו ב-HTML המיוצא');

// השווה מספר עמודים
const pagesLive = await page.evaluate(() => document.querySelectorAll('.a4-page').length);
const pagesExported = await page2.evaluate(() => document.querySelectorAll('.a4-page').length);
assert(pagesLive === pagesExported, `מספר עמודים שונה: ${pagesLive} vs ${pagesExported}`);
```

---

## 14. סקריפטים וכלי עזר

### 14.1 סקריפטים שנוצרו

| סקריפט | תפקיד |
|---|---|
| `scripts/validate_report_accuracy.js` | 17 בדיקות אימות דוח עימוד |
| `scripts/verify_canvas_api.js` | אימות Canvas API |
| `scripts/compare_typeset_quality.js` | השוואת איכות baseline vs canvas |
| `scripts/v18_render_and_compare.js` | רינדור + השוואה מקומית |
| `scripts/v18_ghpages_via_buttons.js` | רינדור מ-GitHub Pages עם פונקציות קיימות |
| `scripts/v18_full_validation.js` | בדיקות מלאות מ-GitHub Pages |
| `scripts/v18_route_test.js` | בדיקה עם page.route() (ללא שרת) |
| `scripts/v18_kpon_medium.js` | בדיקת KP עם טקסט מלא |
| `scripts/v18_kpoff_test.js` | בדיקת KP כבוי |
| `scripts/http_server.js` | שרת HTTP מקומי |
| `scripts/debug_sparse_t2.js` | דיבאג מעמיק של T2 |
| `scripts/debug_sparse_t2_v2.js` | דיבאג נוסף (getClientRects behavior) |
| `scripts/debug_t7_t9.js` | דיבאג T7 ו-T9 |
| `scripts/debug_t9_v2.js` | דיבאג checkFontFallback על פסקה ספציפית |
| `scripts/check_window_fns.js` | בדיקת זמינות פונקציות על window |
| `scripts/check_t2_discrepancy.js` | בדיקת פער T2 vs T10 |
| `scripts/screenshot_problem_pages.js` | צילום עמודים לאימות ויזואלי |

### 14.2 פונקציות חשופות על `window` לאימות חיצוני

14 פונקציות פנימיות חשופות על `window` לצורכי אימות חיצוני:

```javascript
window.checkWidowOrphan          // בדיקת אלמנות/יתומים
window.checkSparse               // בדיקת דלילויות p-cut
window.checkOverflow             // בדיקת גלישות
window.checkSideNoteOverlap      // בדיקת חפיפות הערות
window.checkHeadingAtBottom      // בדיקת כותרות בתחתית
window.checkSingleLinePcut       // בדיקת p-cut חד-שורתי
window.checkEmptyColumn          // בדיקת טורים ריקים
window.checkImbalanced           // בדיקת חוסר איזון
window.checkFontFallback         // בדיקת fallback גופן
window.detectTofu                // בדיקת tofu
window.generateLayoutReport      // הפקת דוח עימוד
window.generateTestTextSeeded    // מחולל טקסט seeded
window.measureWordWidth          // מדידת רוחב מילה (Canvas)
window.estimateLineCountCanvas   // אומדן מספר שורות (Canvas)
```

### 14.3 תבנית סקריפט בדיקה מלא

```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('=== טעינת מערכת ===');
    await page.goto('https://suginach.github.io/IMUD_TORANI/');
    
    console.log('=== המתנה לטעינת גופנים ===');
    await page.waitForFunction(() => document.fonts.status === 'loaded');
    await page.waitForTimeout(2000);
    
    console.log('=== בדיקת טעינת גופנים ===');
    const fontsLoaded = await page.evaluate(() => {
        return document.fonts.check('12pt "פרנק רוהל ליברה רגיל"');
    });
    if (!fontsLoaded) {
        console.error('❌ גופנים לא נטענו');
        await browser.close();
        process.exit(1);
    }
    console.log('✅ גופנים נטענו');
    
    console.log('=== הזרקת טקסט seeded ===');
    await page.evaluate(() => {
        document.getElementById('raw-input').innerText = window.generateTestTextSeeded();
        window.typesetDocument();
    });
    
    console.log('=== המתנה לעימוד ===');
    await page.waitForFunction(() => {
        const pages = document.querySelectorAll('.a4-page');
        return pages.length >= 100;
    }, { timeout: 120000 });
    await page.waitForTimeout(2000); // המתנה לסיום post-processing
    
    console.log('=== הפקת דוח ===');
    const report = await page.evaluate(() => window.generateLayoutReport());
    
    console.log('=== תוצאות ===');
    console.log('עמודים:', report.totalPages);
    console.log('בלוקים:', report.totalBlocks);
    console.log('לא מאוזנים:', report.imbalanced.length);
    console.log('גלישות:', report.overflow.length);
    console.log('אלמנות:', report.widows.length);
    console.log('יתומים:', report.orphans.length);
    console.log('דלילות p-cut:', report.sparsePcut.length);
    console.log('כותרות בתחתית:', report.headingAtBottom.length);
    console.log('טורים ריקים:', report.emptyColumns.length);
    console.log('fallback גופן:', report.fontFallback.length);
    console.log('tofu:', report.tofu.length);
    console.log('page errors:', report.pageErrors);
    
    console.log('=== אימות 17 בדיקות ===');
    const validation = await page.evaluate(() => {
        return window.runAllValidationTests();
    });
    console.log(`עברו: ${validation.passed}/15`);
    
    if (validation.passed === 15) {
        console.log('✅ כל הבדיקות עברו');
    } else {
        console.log('❌ חלק מהבדיקות נכשלו:');
        validation.results.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.name}: ${r.reason}`);
        });
    }
    
    console.log('=== צילום מסך ===');
    await page.screenshot({ path: 'page-1.png' });
    
    await browser.close();
})();
```

---

## 15. מסקנות ועקרונות מנחים

### 15.1 עקרונות אימות

1. **כל תיקון חייב בדיקה לפני הגשה** — אם אי אפשר לבדוק, אי אפשר לתקן.
2. **הבדיקה חייבת להיות אמינה** — אם הבדיקה משקרת, התיקון אינו אמיתי.
3. **הבדיקה חייבת להיות עקבית** — seeded random לכל הבדיקות.
4. **הבדיקה חייבת לכסות את כל שלושת מצבי הרינדור** — תצוגת מערכת, PDF, HTML.

### 15.2 עקרונות מדידה

1. **השתמש ב-`Range.getClientRects()` לבדיקת שורות** — לא ב-`getLinesFromParagraph`.
2. **השתמש ב-`rect.right - colRect.left` ב-RTL** — לא ב-`rect.width`.
3. **השתמש ב-`document.fonts.check()` לבדיקת גופנים** — לא ב-`document.fonts.status`.
4. **בדוק רשימת fallback מלאה** — לא רק את הגופן הראשון.
5. **השווה ל-serif גנרי לבדיקת tofu** — לא "האם משהו מצויר".
6. **השתמש ב-`getBoundingClientRect()` למדידת מיקום** — לא ב-`offsetTop` עם `position: relative`.
7. **הבדל בין `getBoundingClientRect` ו-`offsetWidth`** — הראשון מושפע מ-`transform: scale`, השני לא.

### 15.3 עקרונות סף

1. **אלמנה/יתום:** `× 1.1` (רק שורה אחת ממש) — לא `× 2.2` או `× 1.5`.
2. **לא מאוזן:** `> 5px` (תת-פיקסל) — לא `0px` (רעידות) או `10px`.
3. **דלילות p-cut:** `< 50%` מרוחב הטור — רק ב-p-cut, לא ב-p-end.
4. **גלישה:** `scrollHeight > clientHeight + 2` — תת-פיקסל.
5. **חפיפות:** `< 1px`.

### 15.4 עקרונות הפרדה

1. **`p-cut` vs `p-end`:** דלילות נבדקת **רק ב-p-cut**.
2. **כותרת H7 (צד) vs כותרות H3-H6:** H7 לא נבדקת ל"כותרת בתחתית".
3. **כותרות H0/H1/H2:** תמיד פותחות עמוד חדש, לא נבדקות.
4. **טור ריק בסוף פרק:** תקין, לא בעיה.
5. **פסקה בת מילה אחת:** בלתי פתיר, המערכת מדלגת.

### 15.5 עקרונות בדיקת HTML מיוצא

1. **הטמע 12 גופני priority כ-base64** — אחרת ה-HTML לא תואם את ה-DOM החי.
2. **שכפל את `#preview-pane`** — לא רק את `#book-container`.
3. **שמור את `--preview-scale` המקורי** — אל תשנה ל-1.
4. **אל תריץ `performTypeset()` לפני ייצוא** — שכפל את ה-DOM החי כמו שהוא.
5. **קרא CSS variables מ-`document.documentElement.style`** — לא רק מ-CSS rules.

### 15.6 עקרונות בדיקת PDF

1. **השווה מספר עמודים** למספר הצפוי.
2. **בדוק גופנים עם `pdffonts`** — זיהוי fallback.
3. **חלץ טקסט עם `pdftotext`** — השוואה לטקסט המקור.
4. **צלם עמודים בעייתיים** לבדיקה ויזואלית.
5. **אל תשתמש ב-VLM** לניתוח — הזיות.

### 15.7 עקרונות אימות דוח

1. **השווה כל בדיקה ל-ground truth עצמאי** — לא לבדיקה עצמה.
2. **בדוק דטרמיניזם** — הרצה כפולה, תוצאות זהות.
3. **בדוק מקרי קצה** — מסמך ריק, מסמך ענק, מסמך עם כותרות בלבד.
4. **בדוק מונוטוניות** — ספירה מונוטונית בעליית סף.
5. **חשוף פונקציות על `window`** לאימות חיצוני.

### 15.8 עקרונות trace

1. **השתמש ב-`trace-manager.js` לאיתור קריאות בעייתיות** — רינדור פרק בודד עד לקריאה.
2. **סמן דילוג על קריאות חשודות** — בדוק אם הבעיה נעלמת.
3. **חזור על התהליך** עד לאיתור הקריאה הבעייתית.

### 15.9 עקרונות תיעוד

1. **תעד כל באג שנמצא בבדיקות** — מה הסיבה, מה התיקון, מה התוצאה.
2. **תעד כל ניסיון שנפסל** — מה נוסה, למה נכשל, מה המסקנה.
3. **תעד כל סף ששונה** — מה היה הסף הקודם, למה שונה, מה התוצאה.
4. **תעד כל כלי בדיקה** — מה התפקיד, איך משתמשים, מה המגבלות.

---

**תאריך עדכון:** 15 באוקטובר 2026
**גרסת קוד מתועדת:** V18-kp-full-fix
**מקורות:** 8 מסמכי GitHub + 2 שיחות Z.ai מלאות + קוד מקור נוכחי
