---
title: "כללי עבודה — מערכת עימוד תורנית V21"
date: 2026-10-27
version: shared
type: plans
source: shared
---
# כללי עבודה — מערכת עימוד תורנית V21

> **תאריך:** 2026-10-27
> **מקור:** החלטות משתמש מתיקונים ומשוב
> **סטטוס יישום:** כללים 1–4 מיושמים במלואם ✓

---

## כלל 1 — שמות בעיות בעברית ✓ מיושם

כל שמות הבעיות בדוח הגיאוממטרי ב-UI חייבים להיות בעברית.

**יישום (2026-10-27):** הוגדר האובייקט הגלובלי `GEOM_KIND_NAMES` ב-`app.js` (line 2668) עם 30 סוגי בעיות. כל שימוש ב-`iss.kind` בטבלת ה-UI עובר דרך `GEOM_KIND_NAMES[iss.kind] || iss.kind`. גם ה-`byKind` בסיכום וגם הדרופדאון צ'קליסט משתמשים בו.

| kind (מזהה פנימי) | שם תצוגה בעברית |
|---|---|
| widow | אלמנה |
| orphan | יתום |
| sparse-line | שורה דלילה |
| imbalance | אי-איזון טורים |
| containment | גלישת תיבה |
| containment-rounding | גלישת עיגול |
| overlap | חפיפה |
| page-overflow | גלישת עמוד |
| page-underfill | עמוד דליל |
| block-gap | מרווח בין בלוקים |
| fn-overflow | גלישה לאזור הערות |
| fn-containment | הערה חורגת |
| fn-line-overflow | שורת הערה חורגת |
| fn-page-overflow | הערות גולשות מעמוד |
| pn-overflow | גלישה למספר עמוד |
| footnote-overflow | הערות חורגות מאזור |
| ornament-overflow | עיטור חורג |
| ornament-overlap | עיטור חופף |
| ornament-asymmetry | עיטור א-סימטרי |
| heading-escort | כותרת בתחתית טור |
| orphan-heading-block | בלוק עם כותרת אלמנה |
| candidate-vs-final | פער מועמד-סופי |
| private-use-chars | תווים פרטיים (ריבועים) |
| tofu | טופו (תו חסר) |
| font-not-loaded | גופן לא נטען |
| settings-verification | הגדרה לא הוחלה |
| text-completeness | שלמות טקסט |
| h7-conversion | המרת H7 לכותרת צד |
| bracket-conversion | המרת סוגריים להערות |
| note-marker-line-break | סמן הערה בסוף שורה |

---

## כלל 2 — הבהוב אזור הבעיה ✓ מיושם

יש ליישם את תכונת הבהוב אזור הבעיה (`highlightIssue`) גם בדיווחים החדשים:
- orphan-heading-block
- candidate-vs-final
- private-use-chars
- tofu
- font-not-loaded
- text-completeness
- h7-conversion
- bracket-conversion
- note-marker-line-break
- footnote-overflow
- heading-escort

**אופן יישום:** כל issue שנבחר בטבלת הדיווח ב-UI יפעיל `window.__geomAudit.highlightIssue(issue)` שמצייר מסגרת כתומה מהבהבת על האזור הבעייתי למשך 3 שניות. יש לוודא שהפונקציה תומכת בכל סוגי הבעיות החדשים (משתמשת ב-childRect/aRect/bRect/rightRect/leftRect לפי סוג הבעיה).

**יישום (2026-10-27):** הוסף `childRect` לכל הבאגים החדשים ב-`audit-expansion.js`:
- `auditHeadingEscort` — kid.rect
- `auditOrphanH3Block` — block.rect
- `auditFootnoteOverflow` — fnArea.rect
- `auditPrivateUseCharacters` — node.rect
- `auditCandidateVsFinalHeight` — blk.getBoundingClientRect()
- `auditTofu` — firstP.getBoundingClientRect()
- `auditNoteMarkerLineBreak` — marker rect
- `auditH7ToSideNote` / `auditBracketToFootnote` / `auditTextCompleteness` — גלובליים (pageIdx=-1), ישלח `geom-highlight` postMessage עם ה-issue המלא — אם יש rect יודגש, אחרת רק יוצג הודעה. ה-`scrollToIssuePage()` שוכתב לטפל בכל המקרים.

---

## כלל 3 — דרופדאון צ'קליסט לסינון דיווחים ✓ מיושם

בראש טבלת הדיווח הגיאומטרי ב-UI, יש להוסיף רשימת דרופדאון עם צ'קליסט:
- כל סוגי הבעיות מופיעים כצ'קבוקסים
- **ברירת מחדל: הכל מסומן** (כל הדיווחים מוצגים)
- המשתמש יכול לבטל סימון של סוגים לא רצויים
- הטבלה מתעדכנת מיידית בעת שינוי הסימון
- כפתור "סמן הכל" וכפתור "בטל הכל" בראש הרשימה

**יישום (2026-10-27):** נוספה הפונקציה `renderGeomKindFilter(issues)` ב-`app.js` המציירת `<details>` collapsible עם צ'קבוקסים ב-grid 2 עמודות. הסטייט נשמר ב-`window.__geomFilter.enabledKinds` — `null` = הכל מסומן, `Set` = רק הסוגים שב-Set. כפתורי "סמן הכל" / "בטל הכל" מחליפים בין `null` ל-`Set` ריק. הריענון נעשה ע"י re-call ל-`renderGeomResults` עם `window.__lastGeomResult`.

---

## כלל 4 — מיון טבלת הדיווחים ✓ מיושם

טבלת הדיווחים ב-UI תתמך במיון לפי:
- **ברירת מחדל: לפי עמוד** (סדר עולה)
- לחיצה על כותרת "עמוד" → מיון לפי מספר עמוד
- לחיצה על כותרת "סוג" → מיון לפי סוג בעיה
- לחיצה על כותרת "חומרה" → מיון לפי חומרה (high > medium > low)
- **לחיצה נוספת על אותה כותרת → מיון הפוך** (descending)
- חץ ↑/↓ ליד הכותרת מציין את כיוון המיון הנוכחי

**יישום (2026-10-27):** נוספה הפונקציה `sortGeomIssues(issues, key, dir)` ב-`app.js` המטפלת בשלושה מפתחות (page, type, severity) ובשני כיוונים. הסטייט נשמר ב-`window.__geomFilter.sortKey/sortDir`. כיוון ברירת המחדל: `page asc`. הפונקציה `sortIndicator(key)` מחזירה חץ `' ↑'` / `' ↓'` ליד הכותרת הפעילה. הכותרת הפעילה מודגשת בצבע כחול `#1e40af`. מיון severity: `asc` = low→high, `desc` = high→low (אינטואיטיבי). מיון type משתמש ב-`localeCompare` עם שפה `he` כדי שעברית תסודר נכון. שובר שוויון במיון page: לפי סוג (Hebrew). נבדק ע"י unit-test (`scripts/test-sort-filter.js`).

---

## כלל 5 — דיווחי false-positive

**כלל עבודה:** אם דיווח מסוג מסוים מופיע הרבה פעמים אבל אין פגם נראה לעין, יש לבדוק:
1. האם החפיפה/גלישה נובעת מטווח מותר (לצורכי הכלת טקסט, שאיבת שורות יתומות, עיגול פיקסלים)?
2. האם סוגי האלמנטים החופפים הם זוגות תקינים (margin-col↔column, gutter↔column, side-note↔margin-col)?
3. האם הסף נמוך מדי?

אם התשובה כן — יש להעלות את הסף או להוסיף חריג לזוג הסוגים.

**היסטוריה:**
- overlap: סף 1px² → 5px² + חריגים לזוגות תקינים (כלל 2026-10-27)
- footnote-overflow: סף 5px → 15px + ביטול low (כלל 2026-10-27)
- multiple-blocks: הוסר לחלוטין — אינה בעיה (כלל 2026-10-27)
- candidate-vs-final: הפך ל-no-op — אינו בעיה עצמאית, אינדיקציה בלבד (כלל 2026-10-28)
  - **סיבה:** ה-engine מודד מועמדים עם placeholder marker קבוע `'א'` (isDryRun=true),
    בעוד הרינדור הסופי משתמש ב-marker גימטריה אמיתי (isDryRun=false) ברוחב משתנה.
    ההפרש placeholder-vs-real הוא 7-43px ב-ch9 — אך בכל 13 ה-cases האיזון בפועל
    היה מצוין (Δ ≤ 3px בין טור R ו-L). כלומר ה-diff הוא approximation noise, לא באג.
  - **ניתוח מפורט:** `worklog.md` task `cvf-threshold-fix`.
- containment-rounding: סף 5px → 10px (כלל 2026-10-28)
  - **סיבה:** גלישות עד 10px (פחות מחצי שורה של 21px) אינן נראות לעין ונובעות מעיגול
    פיקסלים של stretchPageToBottom. ch28 p11 (6.23px) היה false positive.
- bracket-conversion: prefix match 10 → 5 תווים + נרמול תווי ציטוט (כלל 2026-10-28)
  - **סיבה:** המקור יכול להכיל " ' וה-DOM יכול להכיל ״ ׳ (גרשיים). נרמול הכל לתווים רגילים.
  - **סיבה 2:** prefix של 10 תווים היה ארוך מדי — 5 תווים מספיקים לזיהוי ייחודי.
- side-note containment: סף 15px → 20px (כלל 2026-10-28)
  - **סיבה:** גלישת הערת צד עד 20px (פחות משורה אחת של 21px) אינה נראית לעין.
    ch30 p22 (16.19px) היה false positive.
- text-completeness: דילוג על note-marker רקורסיבי (כלל 2026-10-28)
  - **סיבה:** note-markers בתוך paren-text spans נכללו ב-textContent, מה שיצר
    טוקנים שגויים כמו "וכו'א" (סמן 'א' מצטרף למילה). פונקציית collectTextSkipNoteMarkers
    עוברת רקורסיבית ודילגת על .note-marker בכל עומק.

---

## כלל 6 — multiple-blocks אינה בעיה

**קביעה סופית:** שני בלוקים דו-טוריים באותו עמוד **אינם בעיה**.

זרימת הטקסט הטבעית היא:
```
עמוד 1 → בלוק 1 → טור ימני ← טור שמאלי ← כותרת ← בלוק 2 → טור ימני ← טור שמאלי ← עמוד 2
```

אין שום פגם בזרימה זו. ההפך הוא הנכון — אם בלוק מכיל **רק** כותרת H3 רוחבית **בלי** טקסט גוף, זו בעיה של **כותרת אלמנה** (orphan-heading-block).

**יוצא מן הכלל:** block-h3-span שמכיל רק H3 הוא **תקין** — ה-H3 היא כותרת רוחבית והטקסט בא בבלוק הבא.
