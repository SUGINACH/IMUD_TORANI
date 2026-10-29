---
title: "שיטת הבדיקה הגיאוממטרית נב-שלבית — step-by-step-audit"
date: 2026-10-27
version: V21
type: audits
source: z.ai
---
# שיטת הבדיקה הגיאוממטרית נב-שלבית — step-by-step-audit

> **תאריך:** 2026-10-27
> **ענף:** V21
> **קבצים:**
> - `typesetter.js` (מנגנון `__runAuditCheckpoint`)
> - `geometry-audit.js` (helpers: `enrichNode`, `getPageMetrics`, `semanticRole`)
> - `scripts/step-by-step-audit.js` (runner עם CLI flags, causality classification, delta analysis)

---

## 1. מטרה

הבדיקה הגיאוממטרית נב-שלבית נועדה להחליף וידוא חזותי ידני. במקום שהמפתח יסתכל בעמודים המרונדרים ויחפש בעיות בעיניים, המערכת:

1. **מבודדת פרק אחד** (אין השפעת עימוד בין פרקים — כותרת 2 מתחילה עמוד חדש)
2. **מעמידה את הפרק לבד** (עם כל ההגדרות המלאות מ-`collectAllSettingsForRenderer`)
3. **מפעילה בדיקה גיאוממטרית אחרי כל שלב עימוד** (4 checkpoints גלובליים + אפשרות להרחבה)
4. **מתעדת את ההגדרות של האלמנטים הבעייתיים** — `role`, `type`, `cls`, `rect`, `text`, `tokenId`, `dataAttrs`, `lineRects`, `typography`, `children`
5. **מתעדת את כל האלמנטים בעמוד** — רשימה מלאה להשוואה בין שלבים
6. **מתעדת pageMetrics** — `bodyFlow.rect`, `footnoteArea.rect`, `twoColumnBlocks`, `bodyParagraphs`, `noteLines`
7. **מחשבת delta בין checkpoints** — אילו אלמנטים נוספו/הוסרו/השתנו
8. **מסווגת סיבתיות** — 7 קטגוריות: created-by-stage / fixed-by-stage / correction-reverted / couldnt-appear-before / created-at-first-checkpoint / never-appeared / unresolved

---

## 2. ארכיטקטורה — זרימת נתונים

```
┌─────────────────────────────────────────────────────────────┐
│  סקריפט חיצוני (step-by-step-audit.js)                    │
│                                                             │
│  1. טוען דף (index.html) משרת HTTP                         │
│  2. מפעיל דגל ב-iframe: window.__stepByStepAudit = true   │
│  3. שולח טקסט פרק + הגדרות ל-iframe (postMessage typeset) │
│  4. ממתין ל-render-done                                     │
│  5. קורא window.__auditCheckpoints מה-iframe                 │
│  6. מנתח: summary, deltas, causality classification        │
│  7. מדפיס דוח                                               │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │ iframe (renderer.html)                           │      │
│  │                                                   │      │
│  │  typesetDocumentCore()                           │      │
│  │  ├── שלב 1: לולאה ראשית (מילוי עמודים)         │      │
│  │  │   └── balanceColumns לכל block-2col          │      │
│  │  │       ├── split point selection               │      │
│  │  │       ├── appendItemFinal (לכל פסקה)         │      │
│  │  │       │   └── createDropWord                   │      │
│  │  │       ├── justifyColumnVertically              │      │
│  │  │       │   ├── stretchByHeadingSpacing          │      │
│  │  │       │   ├── stretchByWordSpacing             │      │
│  │  │       │   ├── stretchByLetterSpacing           │      │
│  │  │       │   └── line-height stretch              │      │
│  │  │       ├── fixDropWordInColumns                 │      │
│  │  │       └── finalizeNotePositions                │      │
│  │  │                                               │      │
│  │  ├── stretchPageToBottom (לכל עמוד)              │      │
│  │  ├── tryReclaimOrphanTail (לכל עמוד)             │      │
│  │  ├── rebalance1 (לכל עמוד — פערים שנותרו)       │      │
│  │  ├── flushFootnotesInto (לכל עמוד)               │      │
│  │  │                                               │      │
│  │  ╔═══════════════════════════════════════════╗   │      │
│  │  ║ CHECKPOINT 1: after-initial-layout         ║   │      │
│  │  ║   - extractGeometry → audit               ║   │      │
│  │  ║   - enrichNode(role/tokenId/dataAttrs/    ║   │      │
│  │  ║     lineRects/typography)                 ║   │      │
│  │  ║   - getPageMetrics(bodyFlow/footnoteArea)  ║   │      │
│  │  ║   - collectPageSignatures                  ║   │      │
│  │  ║   - computeDelta (added/removed/changed)   ║   │      │
│  │  ╚═══════════════════════════════════════════╝   │      │
│  │  │                                               │      │
│  │  ├── applyCrossParagraphParens (גלובלי)         │      │
│  │  │                                               │      │
│  │  ╔═══════════════════════════════════════════╗   │      │
│  │  ║ CHECKPOINT 2: after-cross-paragraph-parens ║   │      │
│  │  ╚═══════════════════════════════════════════╝   │      │
│  │  │                                               │      │
│  │  ├── rebalance2 (גלובלי — פערים אחרי paren)     │      │
│  │  │   └── justifyColumnVertically + shrink        │      │
│  │  │                                               │      │
│  │  ╔═══════════════════════════════════════════╗   │      │
│  │  ║ CHECKPOINT 3: after-rebalance2             ║   │      │
│  │  ╚═══════════════════════════════════════════╝   │      │
│  │  │                                               │      │
│  │  ├── page-height adjustment (אם מופעל)           │      │
│  │  │   └── rebalance אחרי page-height              │      │
│  │  │                                               │      │
│  │  ╔═══════════════════════════════════════════╗   │      │
│  │  ║ CHECKPOINT 4: after-page-height            ║   │      │
│  │  ╚═══════════════════════════════════════════╝   │      │
│  │  │                                               │      │
│  │  └── (סיום typesetDocumentCore)                  │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. מה קורה בכל checkpoint

בכל checkpoint, הפונקציה `window.__runAuditCheckpoint(name)` מופעלת ומבצעת:

### 3.1 `extractGeometry()` — בניית מודל

בונה מודל גיאוממטרי מלא מה-DOM הנוכחי:
- עובר על כל `.a4-page`
- לכל עמוד: שומר `idx`, `label`, `rect`, `cls`, `children`
- לכל אלמנט: שומר `type`, `cls`, `rect` (x, y, w, h, bottom), `text`, `lines`, `children`

### 3.2 `auditGeometry(model)` — הרצת 12+ בדיקות

| בדיקה | מה בודק |
|-------|---------|
| `auditContainment` | האם בלוק חורג מטור/עמוד? (overflow) |
| `auditSiblingOverlap` | האם יש חפיפה בין אחים? |
| `auditColumnBalance` | האם יש פער בין טור ימין ושמאל? (imbalance) |
| `auditWidowOrphan` | האם יש שורה בודדת בתחילת/סוף טור? |
| `auditSparseLastLine` | האם השורה האחרונה ב-p-cut דלילה (<50% רוחב)? |
| `auditOverflowToFootnote` | האם טקסט גולש לאזור הערות? |
| `auditFnContainment` | האם הערות שוליים חורגות? |
| `auditPageOverflow` | האם תוכן חורג מגבולות העמוד? |
| `auditOrnaments` | האם עיטורים במקום הנכון? |
| `auditPageFillRatio` | האם עמוד מלא פחות מ-50%? (page-underfill) |
| `auditBlockGaps` | האם יש מרחק גדול בין בלוקים? |
| `auditSettingsVerification` | האם הגדרות המשתמש הוחלו ב-DOM? |

### 3.3 העשרת נתונים — `enrichNode(node)`

עבור כל אלמנט בעייתי וכל אלמנט בעמוד, המערכת מוסיפה מה-DOM:

1. **`role`** — סיווג סמנטי מורחב (מעבר ל-`type` הבסיסי):
   - `paragraph` / `paragraph-continuation-cut` / `paragraph-continuation-end`
   - `two-column-block` / `single-column-block` / `right-column` / `left-column`
   - `heading` / `footnote` / `side-note` / `note-marker`
   - `ornament` / `divider` / `drop-word` / `parenthetical-run`
   - `running-header` / `page-number`

2. **`tokenId`** — `data-token-id` (למעקב חוצה-שלבים של אותה ישות לוגית)

3. **`dataAttrs`** — allowlist של תכונות החלטה מה-DOM:
   - `data-token-id`, `data-is-cont`, `data-raw-text`
   - `data-side-note`, `data-end-note`, `data-note-style-id`, `data-note-level`
   - `data-layout-*` (מוכן לעתיד — כשיוספו תכונות החלטה ל-balanceColumns וכו')

4. **`lineRects`** — רשימת שורות עם (x, y, w, h) יחסיות ל-parent.
   נחוץ לאבחון widow/orphan, sparse-last-line, ושורות דלילות.

5. **`typography`** — `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `textAlign`,
   `textAlignLast`, `whiteSpace`, `marginTop`, `marginBottom`, `paddingTop`,
   `paddingBottom`, `display`.
   נחוץ לאבחון בעיות פונט/spacing/alignment.

### 3.4 `getPageMetrics(page)` — מדדי עמוד

לכל עמוד, המערכת מתעדת:

```json
{
  "page": { "w": 595, "h": 842 },
  "bodyFlow":    { "y": 110, "h": 690, "bottom": 800 },
  "footnoteArea":{ "y": 800, "h": 42,  "bottom": 842 },
  "twoColumnBlocks": 3,
  "bodyParagraphs": 12,
  "noteLines":      4
}
```

נחוץ לאבחון:
- **overflow** — `problemElement.rect.bottom > pageMetrics.bodyFlow.bottom`?
- **footnote overflow** — `noteLines` חרג מ-`footnoteArea`?
- **sparse page** — `bodyFlow.bottom < page.h - 50%`?
- **block overflow** — `problemElement.bottom > page.h`?

### 3.5 `collectPageSignatures` — חתימות אלמנטים

לכל אלמנט בעמוד, בונה signature: `tokenId (אם יש) | type | cls-trim | round(y) | round(h)`.

כאשר `tokenId` זמין, הוא מאפשר לעקוב אחר אותה ישות לוגית למרות שינויי מיקום בין checkpoints.

### 3.6 `computeDelta(prevSigs, currSigs)` — השוואת delta

בין כל שני checkpoints, מחשב:
- **`added`** — אלמנטים שנוספו בין N-1 ל-N (חתימה חדשה)
- **`removed`** — אלמנטים שהוסרו (חתימה נעלמה)
- **`changed`** — אלמנטים שה-rect שלהם השתנה (y או h)

נחוץ לאבחון:
- **מתי נוצרה הבעיה?** — ה-delta הראשון שבו מופיע האלמנט הבעייתי
- **מה השתנה ליד האלמנט הבעייתי?** — אלמנטים חדשים באותו עמוד עשויים להסביר overflow
- **איזה שלב שינה את ה-rect?** — עוזר לזהות איזה שלב עימוד גרם לבעיה

### 3.7 הנתונים שנשמרים לכל issue

כל issue בכל checkpoint מכיל:

```json
{
  "kind": "containment",
  "severity": "high",
  "pageIdx": 5,
  "message": "block-2col bottom 723 > body-flow bottom 690",
  "problemElement": {
    "type": "block-2col", "role": "two-column-block",
    "cls": "block-2col",
    "tokenId": null,
    "dataAttrs": {},
    "rect": { "x": 57, "y": 120, "w": 680, "h": 603 },
    "text": "",
    "lineCount": null,
    "lineRects": null,
    "typography": null,
    "childCount": 4,
    "children": [...]
  },
  "pageElements": [ ... 20+ אלמנטים עם role/cls/rect/text ... ],
  "pageMetrics": { "bodyFlow": {...}, "footnoteArea": {...}, ... },
  "pageDelta": {
    "added": [ ... אלמנטים חדשים מאז ה-checkpoint הקודם ... ],
    "removed": [ ... אלמנטים שהוסרו ... ],
    "changed": [ { "sig": "...", "before": {...}, "after": {...} } ... ]
  }
}
```

---

## 4. לוגיקת אבחון — סיווג סיבתיות (7 קטגוריות)

עבור כל בעיה (kind + pageIdx), המערכת עוקבת אחרי הופעתה לאורך השלבים ומסווגת:

### 4.1 `couldnt-appear-before` — "לא יכלה להופיע קודם"

הבעיה מופיעה בשלב N אבל לא בשלב N-1, **כי העמוד לא היה קיים עדיין**.

**איך מזהה:**
- `pageCount` בשלב N-1 ≤ `pageIdx` של הבעיה (העמוד לא היה קיים)

**מסקנה:** הבעיה נוצרה יחד עם האלמנט — חלק טבעי מתהליך היצירה. לא רגרסיה.

**דוגמה:** עמוד 13 נוצר בלולאה הראשית. בעיית containment-rounding על עמוד 13 מופיעה ב-checkpoint 1 (after-initial-layout) — ברור שהבעיה נוצרה במהלך הלולאה.

### 4.2 `created-at-first-checkpoint` — "נוצרה בשלב הראשון"

הבעיה מופיעה ב-checkpoint 0 (הראשון). אין "אחרון תקין" לפניו.

**מסקנה:** הבעיה נוצרה בתוך הלולאה הראשית (או קודם לכן). לא ניתן לדעת באיזה עמוד בדיוק, כי אין checkpoint per-page.

**פתרון:** הוסף checkpoint per-page בתוך הלולאה (ראה סעיף 7.1).

### 4.3 `created-by-stage` — "היה כראוי ואז נוצרה" (regression של שלב)

הבעיה מופיעה בשלב N אבל לא בשלב N-1, **למרות שהעמוד כבר היה קיים** בשלב N-1.

**איך מזהה:**
- `pageCount` בשלב N-1 > `pageIdx` של הבעיה (העמוד כבר היה קיים)
- הבעיה לא הייתה קיימת בשלב N-1 (count = 0 עבור אותו kind באותו עמוד)

**מסקנה:** השלב N גרם לבעיה. השלב שינה משהו שהיה תקין ויצר חריגה.

**דוגמה:** עמוד 6 קיים ב-checkpoint 1 (pageCount=19) ללא בעיות containment/imbalance. ב-checkpoint 3 (after-rebalance2) מופיעות בעיות חדשות בעמוד 6. מסקנה: **rebalance2 גרם לבעיה** — הוא שינה את גובה הטורים ויצר חריגה.

### 4.4 `fixed-by-stage` — "תוקנה ע"י שלב"

הבעיה הייתה קיימת בשלב N-1 ונעלמת בשלב N (ולא חוזרת).

**מסקנה:** השלב N תיקן את הבעיה. התיקון הצליח.

**דוגמה:** בעיית imbalance בעמוד 3 קיימת ב-checkpoint 1. ב-checkpoint 3 (after-rebalance2) היא נעלמת. rebalance2 תיקן את הפער.

### 4.5 `correction-reverted` — "בוטל פתרון שהוחל"

הבעיה מופיעה בשלב N, **נעלמת בשלב N+1**, ואז **חוזרת בשלב N+2**.

**מסקנה:** שלב N יצר את הבעיה, שלב N+1 תיקן אותה, אבל שלב N+2 ביטל את התיקון. זהו קונפליקט בין שלבים.

**דוגמה:** `balanceColumns` מאזן טורים (תיקון). אחר כך `applyCrossParagraphParens` עוטף פסקאות ב-span עם גופן קטן יותר — זה משנה את גובה הטורים ומבטל את האיזון. `rebalance2` אמור לתקן, אבל לפעמים הוא יוצר בעיה חדשה.

### 4.6 `never-appeared` — "מעולם לא הופיעה"

הבעיה לא מופיעה באף checkpoint, **אבל אמורה להופיע** כי הטקסט יוצר מצב שדורש תיקון.

**מסקנה:** הבעיה נגרמת רק בריצה המלאה, או שהיא בעיה חבויה. יש להשוות בין מסמכים דומים (אותו פרק עם ובלי שלב תיקון מסוים).

### 4.7 `unresolved` — "נתונים לא מספיקים"

Checkpoint חסר, trace קטוע, או שאי אפשר להתאים את האלמנט. יש להוסיף checkpoint ולהריץ מחדש.

---

## 5. Issue-specific reading patterns

לכל סוג בעיה, השדות החשובים שיש לבדוק:

| kind | שדות חשובים | הנחיית אבחון |
|------|------------|--------------|
| **widow-orphan** | tokenId, dataAttrs (data-is-cont), lineCount, lineRects, typography.lineHeight, pageMetrics.bodyFlow.bottom | האם lineCount=1? האם data-is-cont=true? מתי נוסף ה-p-cut/p-end? האם tryReclaimOrphanTail פעל? |
| **imbalance** | problemElement.rect.h, children heights (R vs L), pageMetrics.twoColumnBlocks, pageDelta.changed | מה היה גובה הטורים בכל checkpoint? מתי נוצר הפער? האם balanceColumns פעל אחרי שינוי? |
| **containment** | problemElement.rect.bottom, pageMetrics.bodyFlow.bottom, problemElement.rect.h, pageDelta.changed | האם problemElement.bottom > bodyFlow.bottom? מתי נוספו אלמנטים שגורמים ל-overflow? האם אלמנט חדש הוסיף גובה? |
| **page-overflow** | problemElement.rect.bottom, pageMetrics.page.h, pageMetrics.bodyFlow.bottom, pageMetrics.footnoteArea.bottom, pageDelta.added | האם problemElement.bottom > page.h? האם footnote-area חרג? האם אלמנט חדש דחף תוכן? |
| **sparse-last-line** | problemElement.lineCount, problemElement.lineRects[last], pageMetrics.bodyFlow.bottom | האם השורה האחרונה < 50% מרוחב הטור? האם יש מילה בודדת? מאיפה הגיעה המילה? |
| **page-underfill** | pageMetrics.bodyFlow.bottom, pageMetrics.page.h, pageDelta.removed | האם bodyFlow.bottom < page.h - 50%? האם תוכן הועבר לעמוד הבא? האם יש h2-title/h2-spacer שמתחיל עמוד חדש? |
| **block-gap** | pageElements (rects sorted by y), pageDelta.added, pageMetrics.bodyFlow.bottom | מתי נוצר ה-gap? האם אלמנט הוסר בין שני בלוקים? האם heading-spacing גדול מדי? |
| **overflow-to-footnote** | problemElement.rect.x, pageMetrics.bodyFlow (right edge), pageDelta.added (side-notes) | האם טקסט גולש ימינה לאזור הערות השוליים? האם totalFlowH לא הופעל? |
| **fn-containment** | problemElement.rect.bottom, pageMetrics.footnoteArea.bottom, pageMetrics.noteLines, pageDelta.added (note-lines) | האם note-lines חרגו מ-footnote-area? האם נדרש פיצול הערות? |

---

## 6. שימוש

### 6.1 הרצה בסיסית

```bash
# ודא ששרת HTTP רץ
python3 -m http.server 8765

# הרץ על פרק 9 — פלט מלא
cd scripts
node step-by-step-audit.js 9

# הרץ על פרק 35
node step-by-step-audit.js 35
```

### 6.2 CLI flags

| flag | תיאור |
|------|-------|
| `--causality` | הדפס סיווג סיבתיות (7 קטגוריות) לכל בעיה |
| `--deltas-only` | הדפס רק את ה-delta בין checkpoints (added/removed/changed) |
| `--no-typography` | דלג על computed typography (מהיר יותר) |
| `--no-line-rects` | דלג על lineRects (מהיר יותר, אבל פחות אבחון widow/orphan) |
| `--verbose` / `-v` | פלט מלא — כולל children, lineRects, typography |
| `--json <FILE>` | שמור checkpoints מלא ל-JSON |
| `--summary-only` | הדפס רק summary לכל checkpoint (מהיר) |
| `--per-page-checkpoints` / `--ppc` | הפעל checkpoint אחרי כל עמוד בלולאה הראשית (איטי יותר, אבל מאפשר אבחון מדויק של מתי נוצרת כל בעיה) |

#### שימוש ב-`--per-page-checkpoints`

כאשר בעיה מסווגת כ-`created-at-first-checkpoint` (ב-checkpoint 0 = after-initial-layout),
לא ניתן לדעת באיזה עמוד בדיוק היא נוצרה. הפלאג `--per-page-checkpoints` (או `--ppc`)
מוסיף checkpoint אחרי כל עמוד בלולאה הראשית, כך שהסיווג הסיבתי יכול להיות מדויק יותר:

- **לפני `--ppc`**: `created-at-first-checkpoint` — הבעיה הופיעה ב-checkpoint 0.
- **אחרי `--ppc`**: `created-by-stage: page-N` — הבעיה נוצרה בעמוד N ספציפי.

**חיסרון:** איטי יותר — כל עמוד מוסיף checkpoint שמפעיל `extractGeometry()` + `auditGeometry()`.
עבור פרק עם 18 עמודים, זה מוסיף ~18 checkpoints × ~200ms = ~3.6 שניות.

**דוגמה לפלט עם `--ppc`:**

```
[containment-rounding] page 7 — נוצרה ע"י page-5
  category: created-by-stage
  note: העמוד היה קיים ב-page-4 ללא הבעיה. הבעיה נוצרה ב-page-5.
    page-1:✗  page-2:✗  page-3:✗  page-4:✗  page-5:✓(1)  page-6:✓(1)  ...
```

### 6.3 דוגמאות שימוש

```bash
# אבחון מלא של פרק 9
node step-by-step-audit.js 9 --causality --verbose

# מצא רק מה השתנה בין שלבים
node step-by-step-audit.js 9 --deltas-only

# שמור נתונים מלאים לניתוח חיצוני
node step-by-step-audit.js 9 --json /tmp/ch9.json

# השוואה מהירה
node step-by-step-audit.js 9 --summary-only
node step-by-step-audit.js 35 --summary-only

# אבחון מדויק של מתי נוצרת כל בעיה (per-page granularity)
node step-by-step-audit.js 3 --causality --per-page-checkpoints

# אבחון מלא עם per-page ו-dump JSON
node step-by-step-audit.js 9 --ppc --causality --verbose --json /tmp/ch9-ppc.json
```

### 6.4 פלט הסקריפט

1. **ניתוח כל checkpoint** — summary + issues מקובצים לפי kind + problemElement + pageMetrics + pageDelta
2. **טבלת התפתחות** — kind × checkpoint (כמה בעיות מכל סוג בכל שלב) + pageCount
3. **בעיות high — מתי נוצרו** — רק בעיות high עם השלב שבו הופיעו
4. **השוואת התחלה → סוף** — מה נעלם, מה נוצר
5. **Delta בין checkpoints** — פעילות לפי עמוד (added/removed/changed counts)
6. **סיווג סיבתיות** — (עם `--causality`) סיווג לכל בעיה + appearances table
7. **Issue-specific reading patterns** — (עם `--verbose`) שדות חשובים לכל kind

---

## 7. אפשרויות כיוונון למקרים שהסיבה לא מתגלה

### 7.1 הוספת checkpoint per-page (בתוך הלולאה הראשית)

כאשר 4 ה-checkpoints הגלובליים לא מספיקים (הבעיה מסווגת כ-`created-at-first-checkpoint`), אפשר להוסיף checkpoint אחרי כל עמוד:

```javascript
// בתוך הלולאה הראשית, אחרי עיבוד כל עמוד:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('page-' + pageIndex);

// אחרי stretchPageToBottom:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('stretchPageToBottom-page-' + pageIndex);

// אחרי tryReclaimOrphanTail:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('reclaimOrphan-page-' + pageIndex);

// אחרי rebalance1:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('rebalance1-page-' + pageIndex);

// אחרי flushFootnotesInto:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('flushFootnotes-page-' + pageIndex);
```

**מתי להפעיל:** כשהבעיה מופיעה ב-checkpoint 1 (after-initial-layout) וצריך לדעת באיזה עמוד בדיוק.

**חיסרון:** איטי יותר (כל checkpoint מפעיל layout flush).

### 7.2 הוספת checkpoint בתוך balanceColumns

```javascript
// בתוך balanceColumns, אחרי בחירת נקודת החיתוך:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('balanceColumns-split-block-' + blockIdx);

// אחרי justifyColumnVertically:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('balanceColumns-justify-block-' + blockIdx);

// אחרי fixDropWordInColumns:
if (window.__stepByStepAudit) window.__runAuditCheckpoint('fixDropWord-block-' + blockIdx);
```

**מתי להפעיל:** כשהבעיה היא imbalance וצריך לדעת איזה שלב בתוך balanceColumns יצר אותה.

### 7.3 הוספת `data-layout-*` attributes ל-balanceColumns

כדי לתעד את החלטות ה-engine (לא רק את התוצאה הגיאוממטרית), אפשר להוסיף תכונות החלטה לבלוקים:

```javascript
// בסוף balanceColumns:
block.setAttribute('data-layout-balance-status', status);    // 'balanced' | 'failed' | 'skipped'
block.setAttribute('data-layout-balance-diff', diff);       // px
block.setAttribute('data-layout-balance-skip-reason', reason); // 'no-candidates' | 'one-sided' | ...
block.setAttribute('data-layout-split-input-lines', inputLines);
block.setAttribute('data-layout-split-fit-lines', fitLines);
block.setAttribute('data-layout-split-placed-lines', placedLines);

// בסוף justifyColumnVertically:
col.setAttribute('data-layout-final-phase', phase);
col.setAttribute('data-layout-final-diff', diff);
col.setAttribute('data-layout-final-fits', fits ? 'true' : 'false');
col.setAttribute('data-layout-global-justify-rolled-back', rolledBack ? 'true' : 'false');
col.setAttribute('data-layout-global-justify-rollback-reason', reason);
```

ה-`enrichNode` כבר קולט כל `data-layout-*` (ראה `attrRe` ב-`geometry-audit.js`).
**מתי להפעיל:** כשרוצים לדעת **למה** ה-engine בחר חלוקה מסוימת, לא רק מה התוצאה.

### 7.4 השוואת מצבים — עם ובלי פונקציית תיקון (counterfactual)

```bash
# 1. הרץ עם הפונקציה מופעלת:
node step-by-step-audit.js 9 > with-fix.txt

# 2. כבה את הפונקציה (למשל aq-heading-spacing):
ENABLE_HEADING_SPACING=0 node step-by-step-audit.js 9 > without-fix.txt

# 3. השווה:
diff with-fix.txt without-fix.txt
```

**מתי להפעיל:** כשהבעיה מסווגת כ-`never-appeared` — כלומר ה-engine לא מייצר אותה באף שלב, אבל הטקסט יוצר מצב שדורש תיקון.

### 7.5 מצב debug מפורט — תיעוד מלא של כל אלמנט

```javascript
// ב-collectPageElements, הגדל maxDepth:
pageElements = collectPageElements(page, 5);  // במקום 3

// ב-describeNode, הגדל depth:
problemElements = [describeNode(problemNode, 4)];  // במקום 2

// ב-text, הגדל אורך:
text: (node.text || '').slice(0, 100),  // במקום 50
```

### 7.6 השוואת עמודים בין checkpoints

כדי לראות בדיוק מה השתנה בעמוד מסוים בין שני checkpoints, טען JSON והשווה:

```javascript
const data = JSON.parse(fs.readFileSync('/tmp/ch9.json'));
const pageIdx = 5;
const cp1 = data[0].issues.find(i => i.pageIdx === pageIdx);
const cp3 = data[2].issues.find(i => i.pageIdx === pageIdx);

// השווה pageElements בין cp1 ל-cp3
const cp1_elements = cp1?.pageElements || [];
const cp3_elements = cp3?.pageElements || [];

// מצא אלמנטים שנוספו/השתנו
for (const el of cp3_elements) {
    const prev = cp1_elements.find(e => e.type === el.type && e.rect?.y === el.rect?.y);
    if (!prev) console.log('NEW:', el.type, el.rect);
    else if (prev.rect?.h !== el.rect?.h) console.log('CHANGED:', el.type, 'h:', prev.rect?.h, '→', el.rect?.h);
}
```

### 7.7 הגבלת maxEvents / maxElements (עתידי)

אם הפלט גדול מדי, אפשר להוסיף הגבלות:
- `maxEventsPerCheckpoint` — מספר בעיות מקסיממלי לכל checkpoint
- `maxElementsPerPage` — מספר אלמנטים מקסיממלי לתיעוד בכל עמוד
- `maxTextChars` — אורך מקסיממלי של תצוגית טקסט

**כרגע אין הגבלה — המערכת מתעדת הכל.**

---

## 8. מגבלות נוכחיות

1. **4 checkpoints גלובליים בלבד** — לא תופס בעיות שנוצרות בתוך הלולאה הראשית (בין עמוד לעמוד). פתרון: סעיף 7.1.

2. **ביצועים** — כל checkpoint מפעיל `extractGeometry()` + `auditGeometry()` + `enrichNode()` לכל אלמנט. זה לוקח ~100-500ms לכל checkpoint. עם 4 checkpoints, זה מוסיף ~1-2 שניות לעימוד. עם `--no-typography --no-line-rects` זה מהיר יותר.

3. **אין wrapping של פונקציות פנימיות** — המערכת מבוססת על `__runAuditCheckpoint(name)` שנקרא ידנית בתוך `typesetDocumentCore`. זה אומר שצריך לערוך את typesetter.js כדי להוסיף checkpoints. (בשונה מגישת ה-parallel שעוטפת פונקציות אוטומטית.)

4. **אין מיפוי מספר עמוד מלא → מבודד** — כשבודקים את המסמך המלא (79 פרקים), מספר העמוד של בעיה הוא גלובלי. בבדיקה המבודדת, המספר מתחיל מ-1. פתרון: להריץ קודם את הפרק המבודד, למצוא את הבעיה לפי kind+severity (לא לפי מספר עמוד), ואז להריץ step-by-step.

5. **אין תמיכה בבידוד אוטומטי** — המשתמש צריך לציין את מספר הפרק ידנית. פתרון עתידי: סקריפט שקורא את תוצאות ה-baseline, מוצא פרקים עם בעיות, ומריץ step-by-step על כל אחד.

6. **אין תיעוד אוטומטי של כל שינוי DOM** — ה-delta tracking מבוסס על signatures של אלמנטים שנבנו ע"י `extractGeometry()`. אלמנטים ש-`extractGeometry` לא קולט (למשל inline spans) לא נכללים ב-delta.

7. **ה-baseline הסטטי** — כל השוואת delta משווה את ה-checkpoint הנוכחי ל-checkpoint הקודם בלבד, לא לכל ה-history. אם הבעיה נוצרה ב-checkpoint 1 והשתנתה ב-checkpoint 3, ה-delta ב-checkpoint 3 יראה רק את השינוי האחרון.

---

## 9. דוגמה מעשית — פרק 9, עמוד 6

### הבעיה

ב-checkpoint 3 (after-rebalance2), מופיעות 2 בעיות חדשות בעמוד 6:
- `containment` (medium) — block-2col חורג 63.6px מ-body-flow
- `imbalance` (medium) — פער 66px בין טור ימין (355px) ושמאל (289px)

### האבחון

| שלב | pageCount | בעיות בעמוד 6 | מסקנה |
|-----|-----------|---------------|-------|
| after-initial-layout | 19 | 0 | עמוד 6 קיים ותקין |
| after-cross-paragraph-parens | 19 | 0 | אין שינוי |
| **after-rebalance2** | **19** | **2** | **rebalance2 גרם לבעיות!** |
| after-page-height | 19 | 2 | אין שינוי (page-height כבוי) |

**סיווג causality:** `created-by-stage` — העמוד היה קיים (pageCount=19 בכל השלבים) ותקין, אבל rebalance2 שינה את גובה הטורים ויצר חריגה.

### ה-delta (מה השתנה בין checkpoint 2 ל-3 בעמוד 6)

```
ADDED:
  (none)
CHANGED:
  tok:abc123 | column | right-col
    before: y=120 h=355 bottom=475
    after:  y=120 h=355 bottom=475  (no change)
  tok:abc124 | column | left-col
    before: y=120 h=355 bottom=475
    after:  y=120 h=289 bottom=409  (h: 355 → 289, diff: -66)
  block-2col | block-2col
    before: y=120 h=355 bottom=475
    after:  y=120 h=355 bottom=475  (no change to block, but child changed)
```

### ה-pageMetrics

```
bodyFlow:    y=110 h=690 bottom=800
footnoteArea: y=800 h=42 bottom=842
twoColumnBlocks: 2
bodyParagraphs: 12
noteLines: 4
```

### האלמנט הבעייתי (problemElement, מתועד)

```json
{
  "type": "block-2col",
  "role": "two-column-block",
  "cls": "block-2col",
  "rect": { "x": 57, "y": 5769, "w": 680, "h": 355 },
  "childCount": 4,
  "children": [
    { "type": "margin-col", "h": 355 },
    { "type": "column", "role": "right-column", "h": 355 },
    { "type": "column", "role": "left-column",  "h": 289 },  // ← קצר ב-66px!
    { "type": "margin-col", "h": 355 }
  ]
}
```

### מסקנה מעשית

rebalance2 שינה את גובה הטור השמאלי מ-355 ל-289 (-66px), ויצר פער. הבלוק השני בעמוד (h=586) חורג מ-body-flow ב-60px בגלל שהפער נוצר לפניו ודחף תוכן.

---

## 10. כללי זהב

1. **השווה pageCount תמיד** — אם pageCount גדל בין checkpoints, הבעיות החדשות עשויות להיות `couldnt-appear-before`.
2. **השווה pageIdx** — אם pageIdx ≥ pageCount הקודם, העמוד לא היה קיים.
3. **השווה problemElement.rect** — אם ה-rect השתנה בין checkpoints, השלב שינה את האלמנט.
4. **השווה pageElements** — אם נוספו/נעלמו אלמנטים, השלב שינה את מבנה העמוד.
5. **בדוק children** — אם childCount השתנה, השלב הוסיף/הסיר ילדים.
6. **השתמש ב-pageDelta** — `added` מראה מה נוסף, `changed` מראה מה השתנה, `removed` מראה מה הוסר.
7. **השתמש ב-pageMetrics.bodyFlow.bottom** — הגבול העליון של overflow.
8. **השתמש ב-pageMetrics.footnoteArea.bottom** — הגבול העליון של fn-containment.
9. **השתמש ב-typography** — אם fontFamily/lineHeight השתנו בין checkpoints, זה מסביר שינוי בגובה שורות.
10. **השתמש ב-lineRects** — לאבחון widow/orphan ושורות דלילות.
11. **עדכן worklog** — תעד כל ממצא ב-worklog.md עם Task ID.

---

## 11. מפת דרכים עתידית

### 11.1 כיוונון ביצועים (TBD)
- [ ] הוסף `maxEventsPerCheckpoint` flag
- [ ] הוסף `maxElementsPerPage` flag
- [ ] אפשרות לדגם על פרק מסוים בלבד (per-chapter isolation אוטומטי מתוך baseline)

### 11.2 הרחבת תיעוד (TBD)
- [ ] הוסף `data-layout-*` attributes ל-balanceColumns, justifyColumnVertically, shrinkColumnVertically
- [ ] הוסף checkpoint per-page (אופציונלי, עם flag `--per-page-checkpoints`)
- [ ] הוסף checkpoint בתוך balanceColumns (אופציונלי, עם flag `--per-block-checkpoints`)
- [ ] עטוף פונקציות אוטומטית (במקום קריאה ידנית ל-`__runAuditCheckpoint`)

### 11.3 שילוב עם CI (TBD)
- [ ] הרץ step-by-step-audit ב-CI על פרקים עם בעיות (לפי baseline)
- [ ] השווה causality classification בין commits — האם שלב חדש יצר בעיה חדשה?
- [ ] הפקת דוח Markdown עם טבלאות causality

### 11.4 מצבים מתקדמים (TBD)
- [ ] counterfactual mode — השבת פונקציה אחת והשוואה
- [ ] git bisect — השווה גיאוממטריה בין commits
- [ ] visual diff — צור תמונת PNG של כל checkpoint והשווה
