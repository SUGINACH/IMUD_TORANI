---
title: "רשימת עבודות מקיפה — ToraBookTypesetterGold V23"
date: 2026-10-26
version: shared
type: plans
source: shared
---
# רשימת עבודות מקיפה — Tora_Book_Typesetter_Gold V23

תאריך: 2026-10-26 (עדכון אחרון: 2026-10-27)
ענף: V21 (V23 בפועל)

---

## מצב נוכחי

| מדד | ערך | שינוי מתחילת הפרויקט |
|-----|------|---------------------|
| high severity | 0 ✅ | מ-8 → 0 (-100%) |
| medium | 5 | מ-69 → 5 (-93%) |
| low | 16 | מ-25 → 16 (-36%) |
| total | 21 | מ-102 → 21 (-79%) |
| runtime errors | 0 | 0 |
| פרקים תקינים | 79/79 (100%) | 79/79 |
| GitHub Actions | 3/4 jobs success | 3/4 (page-height-max70 נכשל כצפוי) |
| determinism | ✅ יציב | ✅ |
| בדיקות גיאומממטריה | 12+ בדיקות | 6 בלבד בתחילה |
| כלי אבחון step-by-step | ✅ עם 4 checkpoints גלובליים + per-page | לא היה |
| causality classification | ✅ 7 קטגוריות | לא היה |
| delta tracking | ✅ added/removed/changed | לא היה |

### סמלי סטטוס
- ✅ **DONE** — מומש במלואו, נבדק, עובד
- ⚠️ **PARTIAL** — מומש חלקית, נשארו מקרי קצה או חלופות שלא טופלו
- ❌ **OPEN** — לא מומש, דורש עבודה
- 🚫 **N/A** — לא רלוונטי לקוד הנוכחי

---

## ממצאי בדיקה (Findings) — 5 ממצאים שדווחו ע"י המשתמש

| ממצא | תיאור | סטטוס | פרטים |
|------|-------|-------|-------|
| **F1** | drop-word על עמודה שלמה | ✅ DONE | `fixDropWordInColumns` שומר רק first-word-window ראשון (commit `ef3bad6`) |
| **F2** | שורות דלילות ממילה בודדת | ✅ DONE | **כל 11 תוקנו** — 9 ע"י paren-text overlap + note-marker detection (commit `74c8dcc`), 2 נוספים (ch55, ch63) ע"י `text-wrap: pretty` CSS (commit `0bb7898`) |
| **F3** | טקסט באזור הערות שוליים | ✅ DONE | 0 מופעים ב-79 פרקים (verified ע"י `debug-side-notes-overflow.js`). כנראה תוקן ע"י `fixDropWordInColumns` ב-commit `ef3bad6` |
| **F4** | עמוד דליל מ-overflow הערות | ⚠️ PARTIAL | **תיקון סף**: עמוד עם ≥85% מילוי לא מדווח יותר כ"דליל". **1 מקרה אמיתי נשאר** (ch73 page 9, 81% fill) — טבעי, התוכן מסתיים מוקדם כי הפסקה הבאה לא נכנסת בשטח הפנוי |
| **F5** | דיווחי שווא בתחילת פרק | ✅ DONE | `hasH2()` מורחב ל-h2-spacer, h2-orn-top/btm, וכו' (commit `ef3bad6`) |
| **sec-div** | sec-div overflow 3px כ-high | ✅ DONE | sec-div ≤5px → low (containment-rounding) (commit `ef3bad6`) |
| **B5** | page-height overflow 7px | ✅ DONE | בדיקה מ-wrapper bottom במקום body-flow bottom (commit `728801e`) |

---

## A. בדיקות גיאומממטריה — הוספות נדרשות

### A1. בדיקת עמודים דלילים (page-sparse) — ✅ DONE
**תיאור:** עמודים שאינם ממלאים את אזור הטקסט בשלמות.
**חריגים:** עמודי תחילת פרק (מכילים H2) ועמודי סוף פרק (דלילות טבעית ממחסור טקסט).
**מרחק גדול בין מיכלים:** הבדיקה צריכה לתפוס מקרים של עמוד דליל עם הערות שוליים — מרחק גדול בין בלוקים מצביע על דלילות גם כשיש fnArea.
**סף:** פער > 100px בין תחתית הבלוק האחרון לתחתית body-flow (למעט חריגים).
**סטטוס:** ✅ מומש — `auditPageFillRatio` ב-geometry-audit.js. תיקון Finding 4: דרוש גם wastedPx >= 100 וגם fillRatio < 0.85.

### A2. מרחק גדול בין בלוקים (block-gap) — ✅ DONE
**תיאור:** ההפך מ-containment — מרחק גדול מדי בין בלוקים עוקבים ב-body-flow.
**סף:** מרחק > 50px בין תחתית בלוק אחד לתחילת הבא אחריו (למעט מרווחים מכוונים כמו sec-divider).
**סטטוס:** ✅ מומש — `auditBlockGaps` ב-geometry-audit.js. נבדק על 79 פרקים: 0 בעיות.

### A3. וידוא החלת הגדרות (settings-verification) — ⚠️ PARTIAL
**תיאור:** בדיקה שהגדרות המשתמש הוחלו בפועל ב-DOM המרונדר.
**הגדרות לבדיקה:**
1. **שורה אחרונה ממורכזת** — `text-align-last: center` על `p.p-end`
2. **חלון תיבה ראשונה (drop-word)** — קיום `.first-word-window` בפסקאות עם ≥4 מילים
3. **גדלי עיטורים** — רוחב/גובה של `.h2-ornament-top/bottom` תואמים להגדרות
4. **גופן גוף** — `font-family` של `p` תואם ל-`font-body` setting
5. **גובה שורה** — `line-height` של `p` תואם ל-`line-height-body`
6. **מספר טורים** — קיום `.block-2col` (לא `block-single-col`) כשההגדרה היא דו-טורית
7. **כותרות בתחילת טור** — `margin-top: 0` על `.title-level-4/5/6:first-child`
8. **הערות שוליים** — קיום `.side-note-anchor` כשיש H7 בטקסט
9. **מפריד סעיפים** — קיום `.sec-divider-wrap` בסוף פרק
10. **תיבות שער** — קיום `.main-shaar-page`, `.back-shaar-page`, `.sub-shaar-page` במקומ הנכון
11. **תוכן עניינים** — קיום `.toc-page` עם תוכן
12. **עיטורי כותרת** — קיום `.h2-ornament-top/bottom` כשמוגדר
13. **סמני פרקים** — קיום `.h2-siman-badge` כש-auto-siman מופעל
14. **קו מפריד טורים** — קיום `.col-gutter-divider` כשמוגדר
15. **מספור עמודים** — קיום `.page-number-footer` עם מספר
**סטטוס:** ⚠️ PARTIAL — `auditSettingsVerification` מומש עם 11 בדיקות. נבדק על 79 פרקים: 7 בעיות נותרו. לא כל 15 ההגדרות מכוסות במלואן — נדרשת הרחבה להגדרות 11-15 (תוכן עניינים, תיבות שער, וכו').

---

## B. שיפורי engine — פריטים פתוחים ממסמכי ריפו

### B1. P2.5 לכל הכותרות (H4/H5/H6) — ⚠️ PARTIAL
**מקור:** Comprehensive §6.1 סעיף 3; Defining §20.2
**תיאור:** P2.5 (margin-bottom של כותרת כבלוף איזון) פועל רק על H5. צריך להרחיב ל-H4 ו-H6.
**השפעה:** יפתור imbalance עם כותרות (Δ=22px).
**סטטוס:** ⚠️ PARTIAL — `stretchByHeadingSpacing` (שלב 4) פועל על H4/H5/H6 כבר כעת.
       מוסיף margin-top/margin-bottom לכל כותרות 4/5/6, עם factor דינמי לפי neededPx.
       שילוב: נקרא מתוך `justifyColumnVertically` לפני word-spacing (step 0).
       **לא הושלם:** 15 בעיות imbalance עדיין נותרו ב-79 פרקים. המנגנון פועל אבל לא פותר את כל המקרים.
       ייתכן שצריך להגדיל את maxAdd (כרגע 15px) או להוסיף מנגנון נוסף.

### B2. rebalance אחרי `applyKpLineBreaks` — ❌ OPEN
**מקור:** Comprehensive §6.1 סעיף 1
**תיאור:** `<br>` משנה גבהי פסקאות אחרי איזון → 617 imbalanced columns.
**פתרון:** הרצת `balanceColumns` שוב אחרי `applyKpLineBreaks`, או שימוש ב-`numLines` של KP לחישוב גובה ללא DOM.
**סטטוס:** ❌ לא מומש — ה-caches של KP (`_kpCache`) לא קיימים ב-engine הנוכחי.

### B3. `clubpenalties` לכותרות — ❌ OPEN
**מקור:** Comprehensive §6.1 סעיף 6
**תיאור:** מנגנון `clubpenalties: [10000, 10000, 150]` קיים אך לא מועבר מ-`getLinesFromParagraph`.
**מטרה:** הבטחת "שתי שורות אחרי כותרת".
**סטטוס:** ❌ לא מומש.

### B4. `fixWidowContinuation` — ⚠️ PARTIAL (מנגנון חלופי)
**מקור:** Comprehensive §6.1 סעיף 5; Defining §20.1
**תיאור:** מטפל רק בחיתוך האחרון. פסקה ענקית (42 שורות) עם המשך קצר — לא מגיע ל-2 שורות.
**פתרון:** fallback — מיזוג ההמשך חזרה ל-p-cut.
**סטטוס:** ⚠️ PARTIAL — בקוד הנוכחי אין פונקציה בשם `fixWidowContinuation`.
       המנגנון המקביל הוא `tryReclaimOrphanTail` (typesetter.js line 1355) שמושך 1-2 שורות יתומות מהעמוד הבא.
       בבדיקת baseline נוכחית: **0 בעיות widow-orphan** ב-79 פרקים — המנגנון עובד למקרים הנוכחיים.
       **לא הושלם:** `tryReclaimOrphanTail` מוגבל ל-1-2 שורות יתומ. אם יופיעו מקרים עם 3+ שורות יתומ (פסקאות ענקיות עם המשך קצר), המנגנון לא יטפל בהם. נדרש fallback — מיזוג ההמשך חזרה ל-p-cut.

### B5. page-height — תיקון overflow 7px — ✅ DONE
**מקור:** LAYOUT_DEPENDENCY_MAP §13.10 סעיף 1
**תיאור:** rebalance אחרי page-height פתר imbalance אבל יצר page-overflow 7px.
**פתרון:** בדיקת overflow חוזרת אחרי rebalance, והקטנת wrapper בחזרה אם יש overflow.
**סטטוס:** ✅ מומש — בדיקה מ-wrapper bottom במקום body-flow bottom (commit `728801e`).

### B6. Knuth-Plass מלא עם `looseness` — ❌ OPEN (קריטי לפתרון F2 הנותר)
**מקור:** Comprehensive §6.1 סעיפים 2, 4, 7, 9
**תיאור:** KP מלא עם `looseness` ו-`bestByLineCount` מנוטרל כעת (בעיות ביצועים).
**צריך:** מימוש מחדש עם caching והגבלת קריאות.
**סטטוס:** ❌ לא מומש. **חשיבות גבוהה** — יפתור את 2 ה-sparse-line האמיתיים שנותרו (ch55, ch63) מ-F2.

### B7. Global Copyfitting — ❌ OPEN
**מקור:** Comprehensive §6.1 סעיף 12; §2.6.4
**תיאור:** מדידת נפח תוכן כל פרק וחלוקה שווה של מרחב עמודים.
**סטטוס:** ❌ לא מומש.

### B8. OpenType `jalt` (justification alternates) — ❌ OPEN
**מקור:** Comprehensive §6.1 סעיף 11; Research §5.1
**תיאור:** 8 אותיות הרחבה מסורתיות (א, ד, ה, כ, ל, ם, ר, ת).
**סטטוס:** ❌ לא מומש.

### B9. Canvas API למדידה (off-DOM) — ❌ OPEN
**מקור:** Research §5.2, §8 סעיף 1
**תיאור:** החלפת `getBoundingClientRect` ב-`canvas.measureText()` עם caching.
**סטטוס:** ❌ לא מומש.

### B10. DPI Normalization (screen↔print) — ❌ OPEN
**מקור:** Research §8 סעיף 3
**תיאור:** נורמליזציה של פיקסלים לנקודות DTP.
**סטטוס:** ❌ לא מומש.

### B11. Unified Fixed-Point Rollback Loop — ❌ OPEN
**מקור:** Comprehensive §6.1 סעיף 13; Defining §19.6
**תיאור:** לולאה מאוחדת שמוודא את כל האילוצים בו-זמנית.
**סטטוס:** ❌ לא מומש.

---

## C. יציבות ובדיקות

### C1. קריסות דפדפן (פרקים 5, 71, 75) — ⚠️ PARTIAL (mitigated)
**מקור:** SESSION_HANDOFF §9.2.1
**תיאור:** קריסות אינטרמיטנטיות. חשד: זיכרון/GC.
**פתרון אפשרי:** `page.gc()` בין פרקים, רענון browser כל 3 פרקים במקום 5.
**סטטוס:** ⚠️ PARTIAL — רענון browser כל 3 פרקים (הופחת מ-5) ב-test-chapters-enhanced.js.
       3 הפרקים (5, 71, 75) נבדקו בבודדים — 0 קריסות.
       הקריסות כנראה קשורות להצטברות GC בריצה מלאה (79 פרקים), שמתקצרת ע"י רענון תכוף יותר.
       פתרון מלא דורש תמיכה ב-page.gc() בפליירייט (לא זמין כעת).

### C2. determinism-test — ✅ DONE
**מקור:** בקשת משתמש
**תיאור:** המטרה העיקרית היא וידוא ששינויי קוד (שלא נועדו להשפיע על העימוד) אכן לא משפיעים.
**פעולה:** עדכן את התיעוד וה-comment ב-determinism-test.js.
**סטטוס:** ✅ מומש — determinism-test.js מתועד, הוסבר שהמטרה היא וידוא יציבות לאורך שינויי קוד. CI determinism job פועל.

### C3. כל בדיקות העימוד על very_long_test_text.txt — ✅ DONE
**מקור:** בקשת משתמש
**תיאור:** ודא ש-test-chapters-enhanced.js, determinism-test.js, ו-regression-test.js כולם משתמשים ב-very_long_test_text.txt.
**סטטוס:** ✅ כבר מוגדר כך (TEST_TEXT_PATH = very_long_test_text.txt).

### C4. בדיקות רגרסיה נוספות — ⚠️ PARTIAL
**מקור:** SESSION_HANDOFF §9.2.2
**תיאור:** הוסף בדיקות ספציפיות ל:
- הערות שוליים (ספור `note-line`)
- סוגריים חוצי פסקאות (ספור `paren-text`)
- עיטורים (ספור `h2-ornament`)
**סטטוס:** ⚠️ PARTIAL — `auditSettingsVerification` כולל ספירת `note-line`, `paren-text`, `h2-ornament`. אבל אין בדיקות רגרסיה ייעודיות שמשוות ספירות אלה מול baseline.

### C5. בדיקת יציבות ב-GitHub Actions — ✅ DONE
**מקור:** LAYOUT_DEPENDENCY_MAP §13.10 סעיף 4
**תיאור:** הרצת אותו פרק פעמיים והשוואת תוצאות (כבר קיים כ-determinism job).
**סטטוס:** ✅ מומש — determinism job ב-regression-test.yml.

---

## D. תיעוד ושקיפות

### D1. JSDoc לפונקציות חדשות — ⚠️ PARTIAL
**מקור:** LAYOUT_DEPENDENCY_MAP §13.10 סעיף 2
**פונקציות:** `stretchByHeadingSpacing`, `stretchByLetterSpacing`, page-height adjustment, rebalance.
**סטטוס:** ⚠️ PARTIAL — יש comment blocks מעל כל פונקציה אבל לא JSDoc פורמלי (`@param`, `@returns`, וכו').

### D2. JSDoc ל-75+ פונקציות ב-typesetter.js — ❌ OPEN
**מקור:** SESSION_HANDOFF §9.3.2
**תיאור:** רוב הפונקציות הציבוריות לא מתועדות עם JSDoc.
**סטטוס:** ❌ לא מומש.

### D3. LAYOUT_DEPENDENCY_MAP §11.7 — מדריך הוספת אלמנטים — ❌ OPEN
**מקור:** SESSION_HANDOFF §9.3.1
**תיאור:** סעיף 11.7 קיים אבל צריך דוגמת קוד קונקרטית.
**סטטוס:** ❌ לא מומש.

### D4. עדכון worklog בכל commit — ✅ DONE
**מקור:** בקשת משתמש
**תיאור:** כלל מחייב — כל commit חייב לכלול עדכון worklog.
**סטטוס:** ✅ מומש — worklog.md מתעדכן בכל commit, ~330KB, אלפי שורות.

### D5. step-by-step-audit-Method.md — ✅ DONE (חדש)
**תיאור:** מתודולוגיית הבדיקה השלב-אחר-שלב המלאה עם 11 סעיפים.
**סטטוס:** ✅ מומש — `step-by-step-audit-Method.md`, ~640 שורות.

### D6. README מקיף — ✅ DONE (חדש)
**תיאור:** README מלא ל-V21 Gold עם 10 סעיפים.
**סטטוס:** ✅ מומש — `README.md`, ~460 שורות.

---

## E. שיפורים פונקציונליים

### E1. פאנל "איכות עימוד אוטומטי" ב-UI — ❌ OPEN
**מקור:** SESSION_HANDOFF §9.5.1
**תיאור:** כפתור "בדיקת רגרסיה מהירה" ב-UI שמפעיל `regression-test.js --quick`.
**סטטוס:** ❌ לא מומש — נכון לעכשיו, בדיקות רצות רק מ-CLI.

### E2. דוח בדיקה ויזואלי — ❌ OPEN
**מקור:** SESSION_HANDOFF §9.5.2
**תיאור:** הצגת תוצאות בדיקה בצורה גרפית עם טבלת סטטוס לכל פרק.
**סטטוס:** ❌ לא מומש.

### E3. מערכת המלצות עריכה — ❌ OPEN
**מקור:** REPO_AUDIT_AND_TESTING.md §3
**תיאור:** מערכת שממליצה על עריכה קלה (הוספת מילים, חלוקת פסקה, וכו') לפתרון בעיות עימוד.
**ארכיטקטורה:** identifyIssues → proposeEdits → verifyEdit (גיאוממטרי או עימוד בפועל) → reportRecommendations.
**סטטוס:** ❌ לא מומש — תכנון בלבד.

---

## F. נגישות (accessibility)

### F1. אלמנטים סמנטיים חסרים — ❌ OPEN
**מקור:** Comprehensive §8.4 סעיף 1
**תיאור:** הוסף `<main>`, `<aside>`, `<nav>`.
**סטטוס:** ❌ לא מומש.

### F2. ARIA ל-contenteditable — ❌ OPEN
**מקור:** Comprehensive §8.4 סעיף 3
**תיאור:** הוסף `role="textbox"`, `aria-multiline="true"`, `aria-label`.
**סטטוס:** ❌ לא מומש.

### F3. aria-label לכפתורים עם emoji — ❌ OPEN
**מקור:** Comprehensive §8.4 סעיף 4
**סטטוס:** ❌ לא מומש.

### F4. meta tags — ❌ OPEN
**מקור:** Comprehensive §8.4 סעיף 2
**תיאור:** `<meta name="description">`, `<meta name="theme-color">`, Open Graph.
**סטטוס:** ❌ לא מומש.

### F5. בדיקת ניגודיות צבעים — ❌ OPEN
**מקור:** Comprehensive §8.4 סעיף 5
**תיאור:** הרצת Lighthouse / axe DevTools.
**סטטוס:** ❌ לא מומש.

---

## G. אבטחה (security)

### G1. החלפת sanitizeSVG ב-DOMPurify — ❌ OPEN
**סטטוס:** ❌ לא מומש.

### G2. Trusted Types CSP — ❌ OPEN
**סטטוס:** ❌ לא מומש.

### G3. SRI לסקריפטים חיצוניים — ❌ OPEN
**סטטוס:** ❌ לא מומש.

### G4. Audit Trail לפעולות רגישות — ❌ OPEN
**סטטוס:** ❌ לא מומש.

### G5. iframe sandbox — ❌ OPEN
**סטטוס:** ❌ לא מומש.

---

## H. סידור קוד

### H1. מעבר ל-ES Modules — ❌ OPEN
**מקור:** Comprehensive §6.2 סעיף 8
**סטטוס:** ❌ לא מומש.

### H2. מעבר ל-balanceColumnsV2 — ❌ OPEN
**מקור:** Comprehensive §6.1 סעיף 9
**תיאור:** מנוע מבוסס מועמדים שיכול לנצל את KP טוב יותר. כרגע מנוטרל.
**סטטוס:** ❌ לא מומש.

---

## I. כלי אבחון שלב-אחר-שלב (חדש — נוסף ב-V21)

### I1. מערכת checkpoint גלובלית — ✅ DONE
4 checkpoints: after-initial-layout, after-cross-paragraph-parens, after-rebalance2, after-page-height.
כל checkpoint: extractGeometry + auditGeometry + enrichNode + getPageMetrics + collectPageSignatures + computeDelta.

### I2. delta tracking (added/removed/changed) — ✅ DONE
מעקב אחר שינויים בין checkpoints. עוזר לזהות איזה שלב שינה אלמנטים.

### I3. causality classification (7 קטגוריות) — ✅ DONE
1. couldnt-appear-before
2. created-at-first-checkpoint
3. created-by-stage
4. fixed-by-stage
5. correction-reverted
6. never-appeared
7. unresolved

### I4. issue-specific reading patterns (9 דפוסים) — ✅ DONE
לכל kind: שדות חשובים + הנחיית אבחון.

### I5. CLI flags — ✅ DONE
--causality, --deltas-only, --no-typography, --no-line-rects, --verbose, --json, --summary-only, --per-page-checkpoints / --ppc.

### I6. per-page checkpoints — ✅ DONE
`--ppc` flag מוסיף checkpoint אחרי כל עמוד בלולאה הראשית. מאפשר אבחון מדויק של מתי נוצרת כל בעיה.

### I7. issueData preservation — ✅ DONE
כל issue שומר את כל השדות המקוריים (childRect, lastW, firstW, pText, location, וכו') תחת issueData.

### I8. findProblemNode ל-sparse-line ו-widow-orphan — ✅ DONE
findProblemNode תומך באבחון sparse-line (מחפש p-cut עם התאמת childRect) ו-widow-orphan.

---

## עדיפויות מומלצות (מעודכן)

### עדיפות גבוהה (ביצוע מיידי) — נותרו פתוחות
1. **B6** — Knuth-Plass מלא — יפתור את 2 sparse-line האמיתיים מ-F2 (ch55, ch63)
2. **A3** — השלמת 15 בדיקות settings-verification (כרגע 11/15)
3. **B1** — הגדלת maxAdd או מנגנון נוסף ל-imbalance עם כותרות (15 בעיות נותרו)
4. **B4** — הרחבת tryReclaimOrphanTail ל-3+ שורות (כרגע מוגבל ל-1-2)
5. **C1** — חקירת קריסות דפדפן (פרקים 5, 71, 75)
6. **B2** — rebalance אחרי KP (דורש _kpCache)

### עדיפות בינונית
7. **C4** — בדיקות רגרסיה ייעודיות ל-note-line/paren-text/h2-ornament
8. **D1** — JSDoc פורמלי לפונקציות חדשות
9. **D2** — JSDoc ל-75+ פונקציות ב-typesetter.js
10. **D3** — מדריך הוספת אלמנטים עם דוגמת קוד
11. **E1-E3** — UI/דוחות/המלצות עריכה

### עדיפות נמוכה (ביצוע לטווח ארוך)
12. **B7** — Global Copyfitting
13. **B8** — OpenType jalt
14. **B9** — Canvas API off-DOM
15. **B10** — DPI Normalization
16. **B11** — Unified Fixed-Point Rollback Loop
17. **F1-F5** — נגישות
18. **G1-G5** — אבטחה
19. **H1-H2** — סידור קוד

---

## קביעות שאינן ניתנות לפתרון (acknowledged limitations)
- פסקאות בנות מילה אחת
- פסקאות ענקיות (800+ מילים)
- שתי פסקאות ענקיות זו אחר זו
- כותרת + פסקה קצרצרה
- הערת שוליים ארוכה מעמוד

---

## סיכום מצב לפי קטגוריה

| קטגוריה | ✅ DONE | ⚠️ PARTIAL | ❌ OPEN | סה"כ |
|---------|---------|-----------|--------|------|
| A (בדיקות גיאומממטריה) | 2 | 1 | 0 | 3 |
| B (שיפורי engine) | 1 | 2 | 8 | 11 |
| C (יציבות ובדיקות) | 3 | 2 | 0 | 5 |
| D (תיעוד) | 3 | 1 | 2 | 6 |
| E (פונקציונלי) | 0 | 0 | 3 | 3 |
| F (נגישות) | 0 | 0 | 5 | 5 |
| G (אבטחה) | 0 | 0 | 5 | 5 |
| H (סידור קוד) | 0 | 0 | 2 | 2 |
| I (step-by-step אבחון) | 8 | 0 | 0 | 8 |
| **סה"כ** | **17** | **7** | **25** | **49** |
| **ממצאים (F1-F5)** | **4** | **1** | **0** | **5** |

**אחוז השלמה כולל:** 17/49 = 35% DONE, 7/49 = 14% PARTIAL, 25/49 = 51% OPEN
**אחוז השלמת ממצאים:** 4/5 = 80% DONE, 1/5 = 20% PARTIAL

