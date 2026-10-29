---
title: "סקירת בעיות מקיפה — מצב אמיתי מול מצב מדווח"
date: 2026-10-27
version: V21
type: issues
source: z.ai
---
# סקירת בעיות מקיפה — מצב אמיתי מול מצב מדווח

> **תאריך:** 2026-10-27
> **מקור:** סקירת כל מסמכי הפרויקט (WORK_PLAN, LAYOUT_DEPENDENCY_MAP, SESSION_HANDOFF, REPO_AUDIT_AND_TESTING, worklog, Reports_Summaries_Studies, step-by-step-audit-Method)

---

## מושגי יסוד

| סמל | משמעות |
|------|--------|
| ✅ **פתור באמת** | תיקון קוד ששינה את התנהגות ה-engine — הבעיה אינה קיימת עוד ב-DOM |
| 🔇 **מוסתר ע"י סף** | ה-audit לא מדווח עוד, אבל הבעיה עדיין קיימת ב-DOM |
| 🔍 **אמור היה להיות מאובחן** | ה-audit היה צריך לתפוס את זה אבל לא תפס |
| ❌ **פתוח** | לא טופל כלל |

---

## חלק א' — בעיות שנפתרו באמת (קוד השתנה)

אלה בעיות שתיקון הקוד שינה בפועל את התנהגות ה-engine והבעיה אינה קיימת עוד ב-DOM:

| # | בעיה | תיקון | commit | ודאות |
|---|------|-------|--------|-------|
| 1 | drop-word על עמודה שלמה (F1) | `fixDropWordInColumns` — שומר רק first-word-window ראשון | `ef3bad6` | ✅ ודאי |
| 2 | דיווחי שווא בתחילת פרק (F5) | `hasH2()` מורחב ל-h2-spacer, h2-orn-top/btm | `ef3bad6` | ✅ ודאי |
| 3 | sec-div overflow 3px כ-high | sec-div ≤5px → low (containment-rounding) | `ef3bad6` | ✅ ודאי |
| 4 | page-height overflow 7px (B5) | בדיקה מ-wrapper bottom | `728801e` | ✅ ודאי |
| 5 | **`compressByWordSpacing` expansion bug** | הפונקציה הרחיבה טורים במקום לכווץ (freed < 0 לא בוטל) | `07a6291` | ✅ ודאי — **שורש ה-imbalance הגדול** |
| 6 | paren-text overlap detection (F2, 9/11) | בדיקת חפיפה אנכית במקום top-proximity | `74c8dcc` | ✅ ודאי |
| 7 | sparse-line ch55+ch63 (F2, 2/11) | `text-wrap: pretty` CSS — דפדפן מאפטמize שבירת שורות | `0bb7898` | ✅ ודאי |
| 8 | טקסט באזור הערות שוליים (F3) | 0 מופעים — כנראה תוקן ע"י fixDropWordInColumns | — | ✅ ודאי (verified ע"י `debug-side-notes-overflow.js`) |
| 9 | סף page-underfill 88% מדווח (F4) | דרוש גם wastedPx ≥ 100 וגם fillRatio < 0.80 | `6e9f8a1` | ⚠️ חלקי — **ראה חלק ב'** |
| 10 | settings-verification section-divider false positive | דלג בפרק בודד (רק במסמך מלא) | `6e9f8a1` | ✅ ודאי |
| 11 | imbalance severity diff>10 = medium (שגוי) | diff > 50 = medium, diff ≤ 50 = low | `86f0f78` | ✅ ודאי |
| 12 | stretchByWordSpacing overshoot (SESSION_HANDOFF §2.3) | `lastGoodFactor` revert logic | היסטורי | ✅ ודאי |
| 13 | totalFlowH + fnArea mismatch (SESSION_HANDOFF §2.6) | `getFootnotesReservedHeight()` | היסטורי | ✅ ודאי |
| 14 | 15 בעיות גיאוממטריה מקוריות (V1.1 §13) | 14 תוקנו באמת (1 חלקי — #9 עמודים קצרים לפני H3) | היסטורי | ✅ 14/15 |

**סה"כ: 14 בעיות נפתרו באמת.**

---

## חלק ב' — בעיות שהוסתרו ע"י כיוון ספים (עדיין קיימות ב-DOM)

אלה בעיות שה-DOM **עדיין מכיל** — הן פשוט לא מדווחות עוד ע"י ה-audit:

| # | בעיה | סף ישן | סף חדש | האם לגיטימי? | סיכון |
|---|------|---------|---------|-------------|-------|
| 1 | p-cut cross-page overflow ≤ 42px | 15px → medium | 42px → skip | ✅ כן — engine בחר במכוון לגלוש כדי למלא עמוד | נמוך — אם טקסט ישתנה, עלול להיווצר overflow > 42px שלא ידווח |
| 2 | side-note overflow ≤ 15px | 10px → medium | 15px → skip | ✅ כן — פחות משורה של טקסט קטן | נמוך |
| 3 | column balance diff ≤ 30px | 5px → low | 30px → skip | ⚠️ **חלקית** — 30px הוא 1.5 שורות, זה ראוי לדווח כ-low | בינוני — מסתיר אי-איזון אמיתי עד 1.5 שורות |
| 4 | page-underfill ≥ 80% | 85% → low | 80% → skip | ⚠️ **חלקית** — 80% מילוי עם 172px ריק יכול להיות בעיה | בינוני — מסתיר עמודים דלילים אמיתיים |
| 5 | containment overflow ≤ 5px (ללא p-cut) | 1px → reported | 5px → skip | ✅ כן — עיגול פיקסלים | נמוך |
| 6 | ch72 page 9 — overflow 38px | medium | skip (≤42px) | ⚠️ **בעייתי** — 38px הוא 1.8 שורות, **בעיה אמיתית שהוסתרה** | גבוה — זו הייתה הבעיה האמיתית היחידה שנשארה |

**סה"כ: 6 סוגי בעיות הוסתרו ע"י ספים. 4 לגיטימיים, 2 בעייתיים.**

### המלצה לכיוון נכון:
- **מומלץ להחזיר**: סף column balance ל-15px (כדי לדווח פערים של יותר מחצי שורה)
- **מומלץ להחזיר**: סף page-underfill ל-85% (כדי לדווח עמודים עם יותר מ-15% ריק)
- **מומלץ להחזיר**: סף p-cut overflow ל-25px (כדי לדווח overflow > 1 שורה)
- **חובה לטפל**: ch72 page 9 — 38px overflow הוא בעיה אמיתית שהוסתרה

---

## חלק ג' — בעיות שה-audit אמור היה לתפוס אבל לא תפס

אלה בעיות שה-audit **לא בודק כלל** — אם יקרו, לא ידווחו:

| # | בעיה | סיבה שה-audit לא תופס | מקור |
|---|------|----------------------|------|
| 1 | כותרת בתחתית טור עם < 2 שורות אחריה | auditWidowOrphan בודק רק שורות בודדות, לא "כותרת + < 2 שורות" | LAYOUT_DEPENDENCY_MAP §5.7, Comprehensive §6.1 #6 (B3) |
| 2 | מרווח גדול בין בלוקים עם fnArea (page-underfill חלקי) | auditBlockGaps לא בודק מרווחים כשיש fnArea | WORK_PLAN A1 |
| 3 | חפיפה בין טקסט לעיטורים (ornament overlap) | auditOrnaments לא בודק חפיפה עם טקסט, רק מיקום/רוחב | LAYOUT_DEPENDENCY_MAP §5.2 |
| 4 | עמוד עם 2 block-2col (קריאה לא טבעית) | אין בדיקה שבודקת "האם יש יותר מ-block-2col אחד בעמוד" | Comprehensive §13 #7 |
| 5 | הערה שארוכה מעמוד (footnote > page) | auditFnContainment בודק רק overflow מ-footnote-area, לא אורך הערה | WORK_PLAN acknowledged limitations |
| 6 | ריבועים במקום רווחים (U+E000) | אין בדיקה לתווי Private Use Area | 1_Defining_Layout_Issues.md #9 |
| 7 | שבירת שורה אחרי סמן הערה | אין בדיקה ייעודית | 1_Defining_Layout_Issues.md #10 |
| 8 | טופו (תיבות ריקות — תו לא קיים בגופן) | אין בדיקה ייעודית (detectTofu תוקן אבל לא מחובר ל-audit הנוכחי) | 1_Defining_Layout_Issues.md #12 |
| 9 | גופן לא נטען (fallback לא נכון) | auditSettingsVerification בודק font-family אבל לא טעינה בפועל | 1_Defining_Layout_Issues.md #11 |
| 10 | חוסר יציבות בין פלטפורמות (Windows/Linux) | אין בדיקה cross-platform | Comprehensive §6.2 #6 |
| 11 | תיעוד החלטות engine (decision ledger) | data-layout-* attributes קיימים אבל לא נבדקים עקביות | LAYOUT_DEPENDENCY_MAP §8 |
| 12 | Candidate/final height discrepancy | לא נבדק שהמועמד הנבחר אכן מיוצר בגובה החזוי | LAYOUT_DEPENDENCY_MAP §8 |

**סה"כ: 12 סוגי בעיות שה-audit לא תופס.**

---

## חלק ד' — בעיות פתוחות (לא טופלו כלל)

אלה פריטים מ-WORK_PLAN שלא מומשו:

### פתוחות — Engine (B2-B11)
| # | פריט | תיאור | חשיבות |
|---|------|-------|--------|
| 1 | B2 — rebalance אחרי KP | `<br>` משנה גבהי פסקאות → 617 imbalanced | גבוהה אם יתווסף KP |
| 2 | B3 — clubpenalties לכותרות | "שתי שורות אחרי כותרת" לא מובטח | בינונית |
| 3 | B6 — Knuth-Plass מלא | לא נדרש כעת (text-wrap: pretty פתר), אבל עתידי | נמוכה כעת |
| 4 | B7 — Global Copyfitting | חלוקה שווה של מרחב עמודים | נמוכה |
| 5 | B8 — OpenType jalt | 8 אותיות הרחבה מסורתיות | נמוכה |
| 6 | B9 — Canvas API off-DOM | החלפת getBoundingClientRect | נמוכה (ביצועים) |
| 7 | B10 — DPI Normalization | פיקסלים לנקודות DTP | נמוכה |
| 8 | B11 — Unified Rollback Loop | לולאה מאוחדת לכל האילוצים | נמוכה |

### פתוחות — פונקציונלי (E1-E2)
| # | פריט | תיאור |
|---|------|-------|
| 9 | E1 — פאנל UI לבדיקת רגרסיה | כפתור ב-UI |
| 10 | E2 — דוח ויזואלי | טבלת סטטוס גרפית |

### פתוחות — נגישות (F1-F5)
| # | פריט | תיאור |
|---|------|-------|
| 11 | F1 — אלמנטים סמנטיים | `<main>`, `<aside>`, `<nav>` |
| 12 | F2 — ARIA ל-contenteditable | `role="textbox"`, `aria-multiline` |
| 13 | F3 — aria-label לכפתורים | כפתורי emoji |
| 14 | F4 — meta tags | description, theme-color, OG |
| 15 | F5 — ניגודיות צבעים | Lighthouse / axe |

### פתוחות — אבטחה (G1-G5)
| # | פריט | תיאור |
|---|------|-------|
| 16 | G1 — DOMPurify | החלפת sanitizeSVG |
| 17 | G2 — Trusted Types CSP | |
| 18 | G3 — SRI | |
| 19 | G4 — Audit Trail | |
| 20 | G5 — iframe sandbox | |

### פתוחות — קוד (H1-H2)
| # | פריט | תיאור |
|---|------|-------|
| 21 | H1 — ES Modules | מעבר מ-global scope |
| 22 | H2 — balanceColumnsV2 | מנוע מבוסס מועמדים |

### פתוחות — תיעוד (D2-D3)
| # | פריט | תיאור |
|---|------|-------|
| 23 | D2 — JSDoc ל-75+ פונקציות | |
| 24 | D3 — מדריך הוספת אלמנטים | דוגמת קוד קונקרטית |

### פתוחות — מקוריות (V1.1 §13 #9)
| # | פריט | תיאור |
|---|------|-------|
| 25 | עמודים קצרים לפני H3 | סף 120px הוא patch, לא פתרון אמיתי |

### מוגבלויות שאינן ניתנות לפתרון
| # | תיאור |
|---|--------|
| 26 | פסקאות בנות מילה אחת |
| 27 | פסקאות ענקיות (800+ מילים) |
| 28 | שתי פסקאות ענקיות זו אחר זו |
| 29 | כותרת + פסקה קצרצרה |
| 30 | הערת שוליים ארוכה מעמוד |

**סה"כ: 25 פריטים פתוחים + 5 מוגבלויות בלתי-פתירות.**

---

## חלק ה' — סיכום מספרי

| קטגוריה | מספר | אחוז מסך הבעיות שדווחו אי פעם |
|----------|------|------------------------------|
| ✅ פתור באמת (קוד השתנה) | 14 | ~14% |
| 🔇 מוסתר ע"י סף (עדיין ב-DOM) | 6 סוגים | ~6% |
| 🔍 אמור היה להיות מאובחן (gap) | 12 סוגים | ~12% |
| ❌ פתוח (לא טופל) | 25 פריטים | ~25% |
| 🚫 לא פתיר (מוגבלויות) | 5 | ~5% |
| 📝 תיעוד מתודולוגי (שגיאות עבר, anti-patterns) | 31+10 | תיעוד |

### המצב האמיתי:
- **0 בעיות מדווחות** — ה-audit לא מדווח על שום דבר
- **אבל**: יש 6 סוגים של בעיות שעדיין קיימות ב-DOM והוסתרו ע"י ספים
- **ויש**: 12 סוגים של בעיות שה-audit לא בודק כלל
- **והחמור ביותר**: ch72 page 9 — 38px overflow אמיתי שהוסתר

---

## המלצות

### מיידיות (שיבטיח את האמת):
1. **החזר סף column balance ל-15px** — אל תסתיר פערים של יותר מחצי שורה
2. **החזר סף page-underfill ל-85%** — אל תסתיר עמודים עם >15% ריק
3. **החזר סף p-cut overflow ל-25px** — אל תסתיר overflow > 1 שורה (זה יחזיר את ch72)
4. **טפל ב-ch72 page 9** — ה-38px overflow הוא בעיה אמיתית שדורשת עריכת טקסט או שינוי מבני

### לטווח בינוני:
5. **הוסף בדיקת "כותרת + < 2 שורות"** (B3 / clubpenalties)
6. **הוסף בדיקת detectTofu** — תווים שלא קיימים בגופן
7. **הוסף בדיקת detectFallback** — גופן לא נטען
8. **הוסף בדיקת ornament-text overlap**

### לטווח ארוך:
9. **ממש B2 — rebalance אחרי KP** (דורש _kpCache)
10. **ממש E1+E2 — UI פאנל + דוח ויזואלי**
11. **טפל ב-F1-F5 + G1-G5** (נגישות + אבטחה)
