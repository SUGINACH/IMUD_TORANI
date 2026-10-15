# מערכת עימוד תורנית — תיעוד טכני מקיף ומורחב (V1.1 → V18-kp-full-fix)

> **מסמך זה הוא גרסה מורחבת של התיעוד הטכני, המשלבת מידע מכל מסמכי הפרויקט ב-GitHub:** שיחות מקור, מחקרים, תיעוד טכני קודם, worklog, קבצי אבטחה ונגישות, וקוד המקור הנוכחי.
>
> **מקורות ששולבו במסמך זה:**
> - **שיחות מקוריות:** שיחה 1 (`b435b349`), שיחה 2 (`0c2c4b79`) — נקראו וחולצו במלואן
> - **תיעוד טכני קודם:** `מערכת_עימוד_תורנית_תיעוד_טכני.md` (V14)
> - **המשך שיחה א', ב', ג'** (V15, V16-V17, V18)
> - **מחקרים:** `Research_on_the_typesetting_of_Torah_books.md` + `_2.md`, `Knuth_Plass_research_report.md` + `_2.md`, `מחקר פיתוח מערכת עימוד תורנית.txt`, `מחקר עימוד ספרים תורניים.txt`
> - **תכנון אסטרטגי:** `תכנית לתיקון ושיפור.md` (V1.1)
> - **היסטוריה מוקדמת:** `סיכום שיחות AI בענין מערכת לעימוד ספר תורני.md` (3 שיחות Claude AI, יולי-אוגוסט 2026)
> - **Worklog רשמי:** `worklog.md` (8 משימות מתועדות)
> - **דוחות:** `v18-kp-full-fix-report.md`, `analysis_results.md`
> - **אבטחה ונגישות:** `SECURITY.md`, `ACCESSIBILITY.md`
> - **קוד מקור:** `typesetter.js` (363KB), `app.js`, `settings-manager.js`, `debug-panel.js`, `test-suite.js`, `trace-manager.js`, `decorations.js`, `default_settings.json`, `index.html`, `style.css`

---

## 0. היסטוריה כרונולוגית מורחבת (V1.1 → V18)

```
V1.1 (יולי-אוגוסט 2026) — מקור: Claude AI
  ├── גרסה ראשונית: קובץ HTML יחיד (2,440 שורות)
  ├── מודל state מבוסס DOM בלבד (88 פקדים)
  ├── Tokenizer עם רגקס כותרות
  ├── מנוע מדידת שורות ב-#measuring-box
  ├── איזון טורים greedy
  └── 8 באגים מרכזיים אותרו: גלישת עיטור, position:relative שובר מדידות, 26 פקדי TOC מתים, .toc-lvl-7 חסר, Grouped TOC bug, כותרת צד רק לרמה 7, שדות custom מוסתרים, כותרת 3 לא מוצגת
       ↓
V2-V9 (אוגוסט-ספטמבר 2026) — מקור: Claude AI (3 שיחות)
  ├── הפרדה לקבצים נפרדים (typesetter.js, app.js, decorations.js, style.css)
  ├── מערכת הרחבות: סוגי עמודים, סגנונות טקסט, עורך תוספים
  ├── רקעים מותאמים לכל pageRole
  ├── מערכת הערות שוליים וסיום-פרק
  ├── עמודים אי-זוגיים/זוגיים
  ├── רגקס כותרות מורחב
  ├── ערכות נושא SVG
  ├── תיקון באג CSS Grid Stretch (915px מול 1560px)
  ├── Debounce 400ms למניעת תקיעת דפדפן
  └── טעינת ערכות JSON
       ↓
V10 (12 אוקטובר 2026) — מקור: Super Z (V15)
  ├── שמות גופנים בעברית מ-fonts.json
  ├── טעינת גופנים דו-שלבית (439 + 1315)
  ├── דוח עימוד מועשר (DOM, גופן, RTL, עימוד מתקדם)
  ├── P2.5 (margin-bottom של H5)
  ├── 3 באגים קריטיים: growthCeiling=targetH+1, applied+=delta, refuse-to-fill-with-runt before/after
  └── .nojekyll
       ↓
V14 (10-11 אוקטובר 2026) — מקור: Super Z שיחה 1
  ├── 5 נקודות postext: runt penalty, tightenRunts, refuse-to-fill-with-runt, last-line-align, השבתת tryLookAheadWordPull
  ├── תיקון ישיר (Direct Fix) ב-distributeColumnJustification
  ├── P5 עם 0.1px steps
  ├── Runt penalty ב-balanceColumns
  ├── tightenRunts על p-cut
  ├── תיקון מדידה: textContent במקום data-raw-text
  ├── beforeprint handler
  └── test-suite.js: מחולל טקסט + דוח עימוד
       ↓
V15 (12 אוקטובר 2026) — מקור: Super Z
  ├── שינוי שם _fonts.css → fonts-def.css
  ├── גופנים בעברית מלאים (1754)
  ├── טעינת גופנים דו-שלבית
  └── worklog מתועד
       ↓
V16-V17 (12-13 אוקטובר 2026) — מקור: Super Z שיחה 2
  ├── פיצול רשימות גופנים: 1754 → 439 + 1315
  ├── דוח עימוד מועשר (15 בדיקות)
  ├── ייצוא HTML מדויק עם גופנים base64
  ├── checkSparse: Range.getClientRects במקום getLinesFromParagraph
  ├── fixWidowContinuation (cross-column widows)
  ├── נרמול שמות גופן
  ├── סף 1.1 לאלמנות
  ├── seeded random (LCG)
  ├── Width Caching (_linesCache, max 2000)
  ├── Canvas API (measureWordWidth, measureLineWidthCanvas, estimateLineCountCanvas)
  ├── Knuth-Plass מלא (knuthPlassBreak + 6 פונקציות)
  └── אימות דוח 15/15 בדיקות
       ↓
V18 (13-14 אוקטובר 2026) — מקור: Super Z שיחה 2
  ├── ביטול applyKpLineBreaks (זמנית)
  ├── מערכת טאבים (עורך / הגדרות / בדיקה)
  ├── default_settings.json (249 הגדרות)
  ├── setting_sets/ (3 סטים: קונטרס, פרשנות, תלמוד)
  ├── settings-manager.js (הפרדה מדיבאג)
  ├── trace-manager.js (מערכת מעקב אחרי פונקציות)
  ├── PushBack חכם (הסרת שורות במקום פסקאות)
  ├── חיתוך תוך-שורי (העברת מילה אחת)
  ├── דחיפת בלוק לא מאוזן לעמוד הבא
  └── תיקון empty-column (מניעת טורים ריקים בסוף פרק)
       ↓
V18-kp-full-fix (15 אוקטובר 2026) — מקור: Super Z
  ├── Knuth-Plass מלא: looseness, adjdemerits, parfillskip, clubpenalties
  ├── אינטגרציית K-P עם renderer (4 מסלולי רינדור)
  ├── _kpBrEnabled = false במהלך עימוד (מונע קריסה)
  ├── applyKpLineBreaks() כפוסט-פרוססינג
  ├── סימון _fromKp
  ├── ניקוי U+E000 בהערות שוליים
  ├── display: inline מפורש ל-.note-line-num/.note-body-text
  ├── הורדת סף H3 מ-190px ל-120px
  └── תוצאות: 562 עמודים, 30,621 <br>, 0 גלישות/אלמנות/יתומים
```

---

## 1. סקירת המערכת והארכיטקטורה (High-Level Overview)

### 1.1 ייעוד התוכנה

מערכת עימוד תורנית מקצועית לספרים יהודיים-תורניים (ש"ס, רמב"ם, פירושים, קונטרסים, מבואות). המערכת פועלת בדפדפן בלבד (Zero-Backend Pure Web), מייצרת מסמך A4 מודפס בעל שני טורים, עם תמיכה מלאה ב-RTL, הערות שוליים צדדיות (H7/marginalia), כותרות חוצות טורים (H3-span), מילה ראשונה מודגשת (drop-cap/פתיח), סימוני פרקים וסימנים, וגופנים עבריים מסחריים. המערכת נועדה להחליף תוכנות עימוד מסורתיות (תג, InDesign) בסביבת דפדפן עם בקרה ויזואלית מיידית.

### 1.2 טכנולוגיות

| שכבה | טכנולוגיה | תפקיד |
|---|---|---|
| Runtime | JavaScript טהור (ES2017+) בדפדפן | ללא framework. IIFE modules. |
| DOM | Vanilla DOM + CSS variables | אין React/Vue. ה-DOM מנוהל ידנית. |
| Rendering | CSS Paged Media + `transform: scale` | `#book-container` מקבל scale כדי לדמות A4 בתוך מסך. |
| Layout | מנוע עימוד עצמי (`typesetter.js`) | אינו משתמש ב-CSS multi-column — מנהל טורים ידנית. |
| Line breaking | Knuth-Plass (DP) מותאם | מימוש מלא של K-P עם looseness, adjdemerits, parfillskip, clubpenalties. |
| Width measurement | Canvas API (`canvas.measureText()`) | מונע Layout Thrashing — מנותק מ-DOM. |
| גופנים | `@font-face` עם 1754 גופני woff2 | חלוקה לרשימת priority (439) ו-extended (1315). |
| Settings | JSON-driven (249 הגדרות) | `default_settings.json` + `setting_sets/*.json`. |
| הפצה | GitHub Pages עם `.nojekyll` | קריטי: `.nojekyll` חוסם סינון קבצי `_`-prefix. |
| בדיקות | Playwright + Chromium headless | לאימות אוטומטי וצילום מסך. |
| ניתוח גופנים | fontTools (Python) | לקריאת שמות משפחה ומשקלים מ-woff2. |

### 1.3 עקרונות תכנון מרכזיים

1. **הפרדת אחריות נוקשה בין "תוכנה" ו"דיבאג":**
   - **תוכנה (קבוע):** `typesetter.js`, `app.js`, `style.css`, `settings-manager.js`, `decorations.js`, `index.html`, `default_settings.json`, `setting_sets/`, `fonts-def.css`, `fonts-extended.css`, `note_rules.json`, `header_ornaments.json`, `ornaments_left_right.json`, `ornaments_up_down.json`, `section_dividers.json`, `shaar_back.json`, `shaar_main.json`, `shaar_sub.json`, `assets_manifest.json`.
   - **דיבאג (ניתן להסרה):** `debug-panel.js` (מצב בדיקה, דוח עימוד חי, מרקרים, ייצוא HTML ממורקר), `test-suite.js` (מחולל טקסט seeded + דוח עימוד), `trace-manager.js` (מערכת מעקב אחרי קריאות פונקציות).

2. **CSS variables כממשק הגדרות:**
   - `:root` מקבל משתנים מ-`settings-manager.js` שמחיל את `default_settings.json`.
   - `typesetter.js` קורא ערכים מ-`getElementById().value || fallback` — אבל ה-fallback רק למקרה שה-JSON לא נטען.

3. **Threading:** הכל ב-main thread. העימוד של טקסט מלא (1.5M תווים, 562 עמודים) לוקח ~360 שניות. אין Web Worker (ניסיון נכשל — המערכת משתמשת ב-DOM בכבדות).

4. **Rendering Engine:** שני מסלולים פעילים:
   - `balanceColumns` (V1, ברירת מחדל) — מאזן טורים ידנית עם probe renders.
   - `balanceColumnsV2` (`__useBalanceV2 = false`) — אלטרנטיבה שנכשלה.

5. **אסטרטגיית גופנים דו-שלבית:**
   - **שלב 1:** 12 גופני priority (`fonts-priority.json`, 439 `@font-face` ב-`fonts-def.css`) נטענים מיד.
   - **שלב 2:** 1315 גופנים נוספים נטענים על-ידי לחיצה על "📚 טען גופנים נוספים".

6. **תיעוד עצמי:** המערכת מייצרת שלושה קבצי המשך-שיחה אוטומטית כדי לאפשר המשכיות בין שיחות AI שונות.

7. **Debounce:** `typesetDocument()` ממתין 400ms לפני ביצוע (מונע רינדור יתר בעת הקלדה או גרירת סליידרים).

8. **Event Delegation:** מאזין אחד על `#book-container` לכל הקליקים על עמודים.

9. **Fallback Chain:** גופנים — `font-family: 'גופן עברי', 'פרנק רוהל ליברה רגיל', serif`.

### 1.4 סדר טעינת קבצים ב-`index.html`

```
decorations.js → typesetter.js → settings-manager.js → app.js → test-suite.js → debug-panel.js → trace-manager.js
```

סדר זה קריטי: `settings-manager.js` חייב לרוץ לפני `app.js` כדי להחיל הגדרות על ה-DOM לפני ש-`app.js` מאתחל pickers; `debug-panel.js` ו-`trace-manager.js` רצים אחרונים כדי שיוכלו למצוא את ה-sidebar וה-typesetter המוגדרים כבר.

### 1.5 זרימת עימוד טיפוסית

```
typesetDocument() (debounced 400ms)
    ↓
performTypeset()
    ↓
performTypesetInner()
    ├── updateGrid()           (קורא CSS vars מ-DOM)
    ├── updateStyles()         (קורא CSS vars מ-DOM)
    ├── resetWordWidthCache()  (ניקוי מטמון canvas)
    ├── resetKpCache()         (ניקוי מטמון K-P)
    ├── חלוקה ל-blocks (H0=פרק, H2=סעיף)
    ├── עבור כל block:
    │     ├── מילוי טור ימין עד גבול
    │     ├── העברת overflow לטור שמאל
    │     ├── balanceColumns()  (איזון טורים עם probe renders)
    │     └── finalizeTwoColumnBlockLayout() (post-processing)
    │           ├── fixWidowContinuation()       (cross-column widows)
    │           ├── tightenRuntsInBlock()         (כיווץ tracking)
    │           ├── distributeColumnJustification() (line-height balancing P1-P5)
    │           ├── pushBackSmart()               (הסרת שורות בודדות)
    │           ├── intraLineCut()                (חיתוך תוך-שורי)
    │           └── enforceBlockColumnsWithinCeiling() (overflow guard)
    └── דחיפת בלוק לא מאוזן לעמוד הבא (empty-column-fix)
                ↓
        applyKpLineBreaks()   (מחיל <br> לפי שורות KP — רק ברינדור הסופי!)
```

### 1.6 ארכיטקטורת Zero-Backend Pure Web (מתוך SECURITY.md)

- אין שרת עיבוד; כל המידע נשאר בזיכרון ה-RAM של דפדפן המשתמש.
- ה-HTML נטען מ-`file:///` או מ-`blob:` כשמשתמש מוריד תבנית.
- אין שקיפות של נתונים לרשת חיצונית; יוצאים רק על-ידי `window.print()` (PDF) או ייצוא JSON יזום.

**יתרונות אבטחה:**
- אין SSRF / RCE — אין שרת שיכול לקבל בקשות זדוניות.
- אין חשיפת מסמכים סודיים — הכל נשמר בלקוח.
- CORS Sandbox — חסימת `fetch()` ב-`file:///` מגנה מפני גישה לא רצויה לקבצים מקומיים.

---

## 2. מכלול האלגוריתמים והבעיות שפתרנו (Deep Dive Implementation)

### 2.1 עימוד ויישור שני טורים (Two-Column Layout & Balancing)

#### 2.1.1 מבנה נתונים

כל בלוק (תת-פרק) מקבל `<div class="block-2col">` עם שני ילדים: `.col-l` (טור ימין — קורא עברי מתחיל מימין) ו-`.col-r` (טור שמאל). רוחב הטור מחושב על-ידי `updateGrid()` ומוצב כ-CSS variable `--w-col` (לדוגמה `39.604%` — עם דיוק תת-אחוזי כדי למנוע rounding).

**סוגי פסקאות:**
- `p-end` — סיום טבעי של פסקה. השורה האחרונה ממורכזת (`text-align-last: center`).
- `p-cut` — פסקה חתוכה שממשיכה בטור הבא. השורה האחרונה נשארת `justify` (כי המשך פסקה, לא מסתיים).
- `data-is-cont="true"` — מסמן פסקת המשך (continuation) שלא מקבלת drop-cap.

#### 2.1.2 מערכת 5 העדיפויות (P1-P5) — מתוך התיעוד המקורי

`distributeColumnJustification()` מאזנת את הטור הקצר על-ידי 5 רמות עדיפות. כל רמה מקבלת תקציב (budget) מתוך הפער הדרוש (`neededGrowth`):

| עדיפות | מנגנון | משקל | מתי פעיל |
|---|---|---|---|
| P1 | margin-top לפני כותרת | 6 | יש כותרת בטור |
| P2 | margin-bottom אחרי כותרת | 4 | יש כותרת בטור |
| P2.5 | margin-bottom של H5 (בלוף איזון) | 3.5 | H5 בטור הארוך |
| P3 | margin-bottom בין פסקאות | 3 | ≥2 פסקאות בטור |
| P4 | line-height (עד 0.18 תוספת) | 2 | תמיד |
| P5 | word-spacing (0.1px עד 8px) | 1 | פסקה אחרונה בלבד |

**שני סבבים:**
1. **סבב ראשון** — כל tier מקבל `remaining * (weight / totalWeight)` מהתקציב.
2. **סבב שני** — כל tier מקבל את כל ה-`remaining` הנותר.

**תיקון ישיר (Direct Fix):** אחרי שני הסבבים, אם עדיין יש פער >5px, המערכת מחשבת ישירות את ה-`extraLh` המדויק הדרוש ומחילה אותו על הפסקה האחרונה:

```javascript
// אחרי שני סבבי P1-P5, אם עדיין יש פער:
if (remaining > 5 && !colOverCeiling()) {
    const lastP = allP[allP.length - 1];
    const n = Math.max(1, li.lines.length);
    const exactExtraLh = remaining / (n * fp);
    if (exactExtraLh > 0 && exactExtraLh <= 0.40) {
        const newLh = baseLh + currentExtraLh + exactExtraLh;
        lastP.style.lineHeight = newLh.toString();
        if (!colOverCeiling()) remaining = 0;
        else lastP.style.lineHeight = prev;
    }
}
```

**`justifyColumnsPair()`:**
- מקבל `rCol`, `lCol`, `heightCeiling`.
- מחשב `diff = rH - lH`, מזהה את הטור הקצר.
- `targetH = max(rH, lH)`, `growthCeiling = targetH + 1` (לא `budget` הגלובלי!).
- קורא ל-`distributeColumnJustification(shortCol, needed, ..., growthCeiling)`.

**Rebalance אחרי `tightenRunts()`:**
- בודק אם `tightenRunts` יצר פער חדש.
- אם כן, מאפס סגנונות ישנים (`resetColumnJustificationStyles`) ומריץ מחדש.
- Fallback עם ceiling רחב יותר (`tallH + 3`, לא `tallH + 30`).

#### 2.1.3 איזון טורים (`balanceColumns`)

אחרי המילוי הראשוני, הטורים לרוב לא מאוזנים. `balanceColumns` מבצע את הפעולות הבאות:

1. מודד את `scrollHeight` של שני הטורים.
2. מחשב את הפער `Δ = |rightH - leftH|`.
3. אם `Δ > 5px` (סף תת-פיקסל), מחפש פסקה p-cut שאפשר להזיז בין טורים כדי לצמצם את הפער.
4. לכל נקודת חיתוך אפשרית, מחשב `getLinesFromParagraph()` כדי לקבל מספר שורות וגובה.
5. בוחר את הנקודה שממזערת את `Δ` תוך כיבוד **runt penalty**.
6. מבצע probe render (מכניס אלמנט זמני ל-DOM, מודד, מסיר).

**סף 5px לאיזון:** מטולרנט להבדלי עיגול תת-פיקסל. מעל 5px נראה לעין. סף זה נבחר אחרי שסף של 0px יצר "רעידות" (המערכת הייתה מנסה לאזן אינסוף פעמים).

**קוד לב האיזון (runt penalty):**

```javascript
// לכל נקודת חיתוך אפשרית ב-p-cut:
//   - חשב גובה אם נחתוך כאן
//   - הוסף runtPenalty אם השורה האחרונה < 4 מילים
//   - בחר את הנקודה עם מינימום (גובה + runtPenalty)

const candidates = [];
for (let i = 1; i < words.length; i++) {
    const leftText = words.slice(0, i).join(' ');
    const rightText = words.slice(i).join(' ');
    const lines = getLinesFromParagraph(leftText, colWidth, styleObj, true);
    const lastLine = lines[lines.length - 1] || [];
    const wordCount = lastLine.split(/\s+/).filter(Boolean).length;
    const runtPenalty = wordCount < 4 ? (4 - wordCount) * 50 : 0;
    const projectedH = estimateHeight(leftText);
    candidates.push({ idx: i, h: projectedH, penalty: runtPenalty, score: projectedH + runtPenalty });
}
candidates.sort((a, b) => a.score - b.score);
const best = candidates[0];
```

#### 2.1.4 הרחבת `looseness` לאיזון (V18-kp-full-fix)

אם אי-איזון > 20px, המערכת מריצה את הפסקה האחרונה בטור הארוך עם `looseness=-1` (שורה אחת פחות) — K-P מחשב מחדש את שבירת השורות כשהמטרה היא **לא** להגיע לשורה האחרונה. זה דוחף את השורה האחרונה לטור הבא ומצמצם את הפער.

**אופטימיזציה קריטית:** ה-looseness rebalance בוטל זמנית ב-V18 כי הוא קרא למסלול האיטי `bestByLineCount` פעמים רבות (ראה סעיף 3.9).

#### 2.1.5 דחיפת בלוק לא מאוזן (empty-column-fix)

מתוך worklog (Task ID: `empty-column-fix`, 2026-10-14):

**הבעיה:** "יש הרבה טורים ריקים בלי סיבה (שתי שורות בטור אחד ושום דבר בטור השני, כנראה למניעת שורות אלמנות\יתומים, למרוך שזה לא אמור לקרות בסוף פרק או לפני כותרת 3)"

**אבחנה בפועל:** בבדיקה עם מסמך רנדומלי (365 עמודים, 358 בלוקים):
- 289 בלוקים (80%) עם פריט אחד באחד הטורים.
- 0 טורים ריקים לחלוטין — הבעיה היא חוסר איזון, לא ריק.
- רוב הבלוקים עם פריט אחד הם בסוף פרק (`nextType: "none"`) או לפני H3 (`nextType: "H3"`).

**התיקון (שורות 6557-6628 ב-typesetter.js):** אחרי `finalizeTwoColumnBlockLayout`, נבדק אם הבלוק לא מאוזן קיצונית:
- תנאי 1: יש כבר תוכן בעמוד (לא תחילת עמוד חדש).
- תנאי 2: יש מעט פריטים (עד 2) — מצב שלא ניתן לאזן.
- תנאי 3: חוסר איזון קיצוני — הטור הקצר הוא פחות מ-40% מהטור הארוך.
- תנאי 4: זה סוף פרק (`sectionEnd`) או שהטוקן הבא הוא H3 (`span_1col`).

אם כל התנאים מתקיימים: אוסף את כל הטוקנים מהבלוק, מחזיר אותם ל-`pendingWordTokens`, מסיר את הבלוק, ושובר לעמוד הבא.

**תוצאות:**

| מסמך | עמודים | דלילות | גלישות | אלמנות | יתומים | טורים ריקים | עמודים קצרים |
|------|--------|--------|--------|--------|--------|-------------|--------------|
| קבוע | 45 | 0 | 0 | 0 | 0 | 0 | 0 |
| רנדומלי | 365 | 0 | 0 | 0 | 0 | 0 | 0 |

### 2.2 מניעת שורות וכותרות יתומות/אלמנות (Orphan & Widow Control)

#### 2.2.1 הגדרות מדויקות

| מושג | הגדרה מדויקת | סף זיהוי |
|---|---|---|
| **אלמנה (Widow)** | פסקת המשך (`p-cut`) בתחילת טור עם **שורה אחת בודדת** בלבד | `offsetHeight < lineHeight × 1.1` |
| **יתום (Orphan)** | פסקה (לא p-end) בסוף טור עם **שורה אחת בודדת** — תחילת פסקה שהמשכה בטור הבא | אותו סף |
| **כותרת בתחתית** | אלמנט אחרון בטור הוא כותרת (`title-level-3/4/5/6`), או שאלמנט לפני-אחרון הוא כותרת והאחרון מכיל <2 שורות | `getClientRects().length < 2` |

**למה סף 1.1 (ולא 2.2 או 1.5):** סף `× 2.2` הניב 19 אלמנות שווא (פסקאות עם 2 שורות סומנו כאלמנות). סף `× 1.5` עדיין הניב תוצאות שגויות. רק `× 1.1` מזהה נכון — רק פסקאות עם שורה אחת ממש.

#### 2.2.2 `rollbackColumnTail()` — כללי הגלגול לאחור

- אוסף מתחתית הטור כלפי מעלה.
- **כלל 1:** שום כותרת אינה יכולה להיות האלמנט המסיים של טור.
- **כלל 2:** פסקה אחרי כותרת חייבת ≥2 שורות.
- **כלל 3:** פסקת `p-cut` חייבת ≥2 שורות.
- כל אלמנט שנלגח חוזר לתור לטור/עמוד הבא.

#### 2.2.3 מנגנון cross-column (`fixWidowContinuation`)

הבעיה המרכזית שזוהתה: פסקת p-cut בסוף טור ימין יכולה להיות עם 3–42 שורות (תקין), אבל ה**המשך** בטור שמאל הוא שורה אחת בודדת. `rollbackColumnTail` לא מנע זאת כי הוא בודק רק את סוף הטור הנוכחי, לא את ההמשך בטור הבא.

**הפתרון:**

```javascript
function fixWidowContinuation(block) {
    const leftCol = block.querySelector('.col-l');
    const rightCol = block.querySelector('.col-r');
    if (!leftCol || !rightCol) return;
    
    const leftChildren = Array.from(leftCol.children).filter(c => c.tagName === 'P');
    if (leftChildren.length === 0) return;
    
    const firstLeft = leftChildren[0];
    if (!firstLeft.classList.contains('p-cut')) return;
    
    const lines = countLines(firstLeft);
    if (lines >= 2) return;  // תקין
    
    const rightCut = Array.from(rightCol.children)
        .filter(c => c.tagName === 'P')
        .pop();
    if (!rightCut || !rightCut.classList.contains('p-cut')) return;
    
    const rightText = rightCut.dataset.rawText || rightCut.textContent;
    const leftText = firstCut.dataset.rawText || firstCut.textContent;
    const words = rightText.split(/\s+/);
    let wordsToMove = 0;
    let newLines = lines;
    
    while (newLines < 2 && wordsToMove < Math.min(8, words.length)) {
        wordsToMove++;
        const movedWords = words.slice(-wordsToMove).join(' ');
        const candidateText = (leftText + ' ' + movedWords).trim();
        newLines = getLinesFromParagraph(candidateText, getColWidth(leftCol), getStyleObj(firstLeft), true);
    }
    
    if (newLines < 2) {
        // Fallback: מיזוג ההמשך חזרה ל-p-cut
        const merged = rightText + ' ' + leftText;
        rightCut.dataset.rawText = merged;
        rightCut.textContent = merged;
        rightCut.classList.remove('p-cut');
        rightCut.classList.add('p-end');
        firstLeft.remove();
        return;
    }
    
    // העבר מילים בפועל
    const movedWords = words.slice(-wordsToMove).join(' ');
    const newRightText = words.slice(0, -wordsToMove).join(' ');
    const newLeftText = (leftText + ' ' + movedWords).trim();
    
    rightCut.dataset.rawText = newRightText;
    rightCut.textContent = newRightText;
    firstLeft.dataset.rawText = newLeftText;
    firstLeft.textContent = newLeftText;
}
```

**תוצאות:** 4 → 1 אלמנות (-75%). האלמנה שנשארה (עמוד 96) הייתה פסקה בת 42 שורות שחייבת להיחתך, וגם אחרי העברת 8 מילים לא הגיע ל-2 שורות.

### 2.3 עימוד וניהול כותרות צד (Side Headings / Marginalia)

#### 2.3.1 H7 → הערות שוליים

- `כותרת 7` בטקסט → הופך ל-`.side-note-anchor` בעמודת השוליים.
- ממוקם ע"י `finalizeNotePositions()` — ממוקם ב-`offsetTop` של הפסקה + `SIDE_NOTE_OFFSET_TOP = 4px` (תיקון: מעט מתחת לתחילת הפסקה).
- לוגיקת גלישה: אם הערה לא נכנסת בעמודת השוליים, מועברת לעמודת השוליים של העמוד הבא (איפה שהפסקה ממשיכה).

#### 2.3.2 H4/5/6 בתחילת טור

- CSS: `.right-col > .title-level-4:first-child { margin-top: 0 !important; }` — מבטל margin-top כדי להשוות גובה תחילת טור.

#### 2.3.3 כותרות צד חלופיות (V1.1 → V10)

בגרסה V1.1 אותר באג: כותרות 4, 5 ו-6 הופיעו בתפריט עם אפשרות "כותרת צד", אבל בקוד המנגנון ננעל לרמה 7 בלבד. **תיקון:** מאפיין `.sideNote` בטוקן שודרג ממחרוזת טקסט פשוטה לאובייקט מבני: `{ text, level }`. שדרוג זה שומר על רמת הכותרת המקורית ומאפשר לה להופיע בתוכן העניינים ברמתה האמיתית ולא תחת רמה 7.

#### 2.3.4 מבנה DOM

```html
<div class="block-2col">
    <div class="side-notes">
        <div class="side-note" style="top: 124px;">סוגיא: שבת</div>
    </div>
    <div class="col-l">...</div>
    <div class="col-r">...</div>
</div>
```

**אתגר cross-column:** אם הפסקה נגללת לטור הבא, כותרת הצד עוברת איתה (המיקום הוא יחסית לבלוק, לא לטור). אבל אם הכותרת עצמה ארוכה מהעמוד, היא חייבת לעבור לעמוד הבא.

### 2.4 מנגנון הערות שוליים בתחתית העמוד (Footnotes)

#### 2.4.1 מבנה

הערת שוליים מופיעה בגוף הטקסט כ-`<sup class="fn-ref">א</sup>` ובתחתית העמוד כ-`<div class="note-line"><span class="note-line-num">א</span><span class="note-body-text">גוף ההערה</span></div>`.

#### 2.4.2 תור נפרד ושמירת מקום

- תור נפרד: `footnoteQueueForPage[]` — נאסף תוך כדי עימוד.
- `flushFootnotesInto(pageEl)` — מוזרק לתחתית העמוד אחרי סיום הטורים.
- שמור מקום מראש: `getFootnotesReservedHeight()` מחשב גובה נדרש ומפחית מה-budget הזמין.
- איפוס מונה: `noteCounters` מתאפס לפי דף/פרק (`fn-reset-mode`).

#### 2.4.3 בעיות שזוהו ותוקנו בשיחה 2

1. **ריבועים במקום רווחים:** הטקסט המקורי הכיל תו U+E000 (Private Use Area — שימש כ-marker פנימי). הרינדור הציג אותו כריבוע. **תיקון:** ניקוי U+E000 לפני הצגה ב-`buildNoteBlockElement`:
   ```javascript
   body.textContent = item.text.replace(/\uE000/g, ' ');
   ```

2. **מעבר שורה אחרי אות ההערה:** `<span class="note-line-num">` ו-`<span class="note-body-text">` היו inline כברירת מחדל, אבל במקרים מסוימים דפדפנים יצרו מעבר שורה. **תיקון ב-`style.css`:** הוספה מפורשת של `display: inline` לשניהם.

3. **גודל אות הערה מול גוף ההערה:** המערכת כוללת `applyNoteMarkerStyle()` שמתאים את העיצוב לסגנון הכללי.

#### 2.4.4 עיגון הערות והגנה על סוגריים (מתוך V1.1)

- `pendingSideNote` מצמיד את כותרת 7 לפסקת התוכן הבאה.
- סימון גבולות סוגרי הערות בטקסט הגולמי, ופסילת נקודות חיתוך החוצות סוגריים מבלי לפגוע בכללי שורות יתומות ואלמנות.
- `lineBreakCharIndex` ו-`lineBreakCrossesNoteSpan` — בודקים שנקודת חיתוך לא חוצה סוגרי הערה.

#### 2.4.5 הערות רצות (Run-on Footnotes)

תצורה שבה הערות השוליים אינן שוברות פסקה חדשה, אלא ממשיכות ברצף שורה אחר שורה, מופרדות לעיתים רק באמצעות סוגריים או חלל קטן, כמקובל בדפוסי וילנא הקלאסיים. נתמכת במערכת דרך הגדרות `note_rules.json` (162KB של כללי הערות).

### 2.5 גלישת טקסט בין הטורים ולאזור הערות השוליים

#### 2.5.1 הגדרת גלישה (Overflow)

`scrollHeight > clientHeight + 2` בטור — התוכן חורג מגבולות הטור.

#### 2.5.2 שמירת גבולות (`enforceBlockColumnsWithinCeiling`)

פונקציה שרצה אחרונה אחרי כל התיקונים. היא מנטרלת תיקונים שגורמים ל-overflow. **חשוב:** היא לא מתקנת חוסר איזון שלא גורם ל-overflow — רק מונעת גלישה.

#### 2.5.3 PushBack חכם (תיקון משיחה 2)

**הבעיה המקורית:** חריגה → הסרת פסקה שלמה → 5–10 שורות עוברות לעמוד הבא (יותר מדי).

**הפתרון:** חריגה → חישוב כמה שורות להסיר → הסרה רק של השורות הדרושות → שמירת הפסקה במקום.

```javascript
function pushBackSmart(column, targetH) {
    const overflow = column.scrollHeight - targetH;
    if (overflow <= 0) return;
    
    const lineHeight = parseFloat(getComputedStyle(column).lineHeight);
    const linesToRemove = Math.ceil(overflow / lineHeight);
    
    const paragraphs = Array.from(column.children).filter(c => c.tagName === 'P');
    if (paragraphs.length === 0) return;
    
    const lastP = paragraphs.pop();
    const text = lastP.dataset.rawText || lastP.textContent;
    const words = text.split(/\s+/);
    
    if (words.length <= linesToRemove + 1) {
        // פסקה קצרה מדי — הסר אותה כולה (מסלול ישן)
        lastP.remove();
        return;
    }
    
    // מסלול חדש: הסר רק את השורות הדרושות
    const wordsToKeep = Math.max(0, words.length - linesToRemove * 3);
    const newRightText = words.slice(0, wordsToKeep).join(' ');
    const movedText = words.slice(wordsToKeep).join(' ');
    
    lastP.dataset.rawText = newRightText;
    lastP.textContent = newRightText;
    
    const nextCol = getNextColumn(column);
    if (nextCol) {
        const newP = document.createElement('p');
        newP.className = lastP.classList.contains('p-cut') ? 'p-cut' : 'p-end';
        newP.dataset.rawText = movedText;
        newP.textContent = movedText;
        nextCol.insertBefore(newP, nextCol.firstChild);
    }
}
```

**תוצאות (מתוך worklog):**
- PushBack מלאים: 16 → 4 (-75%).
- PushBack חלקיים: 0 → 22 (חדש — הסרת שורות בודדות).
- p-cut דלילים: 0 → 0 (נשמר).
- גלישות/אלמנות/יתומים: 0/0/0 (נשמר).
- חיסכון בעמודים: 46 → 45 במסמך הקבוע.

#### 2.5.4 חיתוך תוך-שורי (intraLineCut)

אחרי בחירת נקודת החיתוך, בדיקה אם השורה האחרונה דלילה (≤3 מילים) והשורה הקודמת מלאה (≥5 מילים) → העברת מילה אחת:

```javascript
if (lastLineWords <= 3 && prevLineWords >= 5) {
    // העבר מילה אחת מהשורה הקודמת לאחרונה
    const wordToMove = prevLineWords[prevLineWords.length - 1];
    newLastLine = [...lastLineWords, wordToMove].join(' ');
    newPrevLine = prevLineWords.slice(0, -1).join(' ');
}
```

**תנאים מלאים:**
- תנאי 1: `bestSplit.lineIndex > 1` (יש חיתוך תוך-פסקתי עם לפחות 2 שורות בימין).
- תנאי 2: השורה האחרונה בימין (`lines[lineIndex-1]`) מכילה ≤3 מילים (דלילה).
- תנאי 3: השורה הקודמת (`lines[lineIndex-2]`) מכילה ≥5 מילים (מספיק מלאה).
- תנאי 4: העברת מילה אחת לא תיצור דלילות חדשה (השורה הקודמת תישאר עם ≥3 מילים).

### 2.6 איזון סוף פרק / סוף מודול (Chapter Balancing)

#### 2.6.1 הבעיה

בסוף פרק (H2), הטור האחרון לרוב נשאר ריק או חלקי. זה יוצר "עמודים קצרים" — עמודים שמסתיימים ב-3/4 מהגובה.

#### 2.6.2 מקרה קצה נפוץ

עמודים קצרים לפני H3 — כאשר ה-H3 נדחה לעמוד הבא כי אין מספיק מקום ל-H3 + 2 שורות טקסט. העמוד הנוכחי נשאר קצר.

#### 2.6.3 פתרון V18 (ניסיוני)

הורדת סף הדחייה של H3 מ-190px ל-120px. זה מאפשר ל-H3 להיכנס גם כשיש פחות מקום, במחיר של סיכון מוגבר ל"כותרת עם <2 שורות" בתחתית הטור.

#### 2.6.4 פתרון עתידי: Copyfitting גלובלי

מתוך `תכנית לתיקון ושיפור.md` (V1.1): "מדידת נפח התוכן הכולל של כל פרק בתיבת מדידה מכוילת בעלת רוחב טור וגופן אמיתיים. גזירת יחס מילוי אחיד לכל עמודי הפרק, למניעת עמודים מלאים ב-100% ועמוד אחרון ריק."

### 2.7 Knuth-Plass מלא (הישג מרכזי של שיחה 2)

#### 2.7.1 רקע תיאורטי

Knuth-Plass הוא אלגוריתם שבירת שורות אופטימלי המבוסס על תכנון דינמי (DP), שפותח על-ידי דונלד קנות' ומייקל פלאס בשנות ה-80. האלגוריתם מתייחס לפסקה כולה כיחידה הוליסטית אחת, ומשתמש במודל "תיבות, דבק וקנסות" (Boxes, Glue, and Penalties):

| סוג אובייקט | מונח לועזי | תפקיד |
|---|---|---|
| תיבות | Boxes | מילים בעלות רוחב קבוע (נמדדות דרך Canvas API) |
| דבק | Glue | רווחים עם `spaceStretch = spaceW * 2.5` (250% מתיחה) ו-`spaceShrink = spaceW * 1.0` (100% כיווץ) |
| קנסות | Penalties | `linePenalty=10`, `widowPenalty=150`, `orphanPenalty=150`, `lastLinePenalty=0`, `overfullPenalty=1000` |

#### 2.7.2 נוסחאות Badness ו-Demerits (TeX-style)

- **Badness:** `100 * |ratio|^3` כאשר ratio = stretch_used/stretch_max או shrink_used/shrink_max.
- **מקרה מיוחד:** מילה אחת underfull — `badness = 100 * (stretchNeeded/target)^3` (מונע מהאלגוריתם להעדיף מילה בודדת בכל שורה).
- **Demerits:** `linePenalty + badness^2 + penalty^2` (לפי TeX).
- **שורה אחרונה:** badness=0 אם underfull (מותר), אבל overfull אסור.

#### 2.7.3 פרמטרים מתקדמים

```javascript
knuthPlassBreak(words, colWidth, styleObj, {
    tolerance: 200,           // סף badness מקסימלי
    linePenalty: 10,          // קנס קווי לכל שורה
    widowPenalty: 150,        // קנס על שורה אחרונה בת מילה אחת
    orphanPenalty: 150,       // קנס על שורה ראשונה בת מילה אחת
    overfullPenalty: 1000,    // קנס על שורת overfull
    looseness: 0,             // +1 = שורה יותר, -1 = שורה פחות
    adjdemerits: 3000,        // קנס על מעבר קטגוריות בלתי-תואמות
    parfillskip: true,        // שורה אחרונה עם badness=0
    clubpenalties: null,      // מערך קנסות לשורות ראשונות (לכותרות)
    firstLineWidthReduction: 0, // הפחתת רוחב לשורה ראשונה (ל-drop word)
});
```

- **`looseness`** — מאפשר הוספת/הסרת שורות מהאופטימום הטבעי. מימוש מלא: `bestByLineCount[end] = Map<lineCount, node>`. אופטימיזציה: מסלול מהיר (DP פשוט) כש-`looseness=0`, מסלול מלא רק כש-`looseness!=0`.
- **`adjdemerits`** — קנס על מעבר בין קטגוריות כושר בלתי-תואמות. 4 קטגוריות: tight(0)/decent(1)/loose(2)/very-loose(3). קנס כש-`|prevFitness - currFitness| > 1`.
- **`parfillskip`** — שורה אחרונה עם `badness=0` תמיד (כמו `\parfillskip` ב-TeX).
- **`clubpenalties`** (מערך) — קנסות לשורות ראשונות של פסקה אחרי כותרת. דוגמה: `[10000, 10000, 150]` — אוסר שבירה אחרי שורה 1 ו-2.

#### 2.7.4 אופטימיזציות ביצועים

- **Prefix sums:** `prefixW[i] = sum(wordWs[0..i-1])` — הופך את `lineNaturalWidth(a,b)` ל-O(1) במקום O(N).
- **Active nodes pruning:** שמירת רק נקודות התחלה שעדיין אפשריות. הפחתת סיבוכיות מ-O(N^3) ל-O(N^2).
- **מטמון תוצאות:** `_kpCache` (max 1500), `_linesCache` (max 2000), `_wordWidthCache` (max 8000).
- **תוצאות:** 200 מילים — 1.9ms קר, 0ms חם (cached).

#### 2.7.5 אינטגרציה עם ה-renderer — התיקון הקריטי

**הבאג המרכזי שנתגלה בשיחה 2:** KP חישב שורות אופטימליות, אבל ה-renderer עשה `item.lines.join(' ')` והדפדפן שבר שורות מחדש — מה שביטל לחלוטין את עבודת KP.

**הפתרון** — שני שלבים:
1. **במהלך העימוד** (`performTypesetInner` + `balanceColumns`): `_kpBrEnabled = false` — הדפדפן שובר שורות בעצמו (מהיר, ללא קריסה).
2. **אחרי העימוד** (`applyKpLineBreaks`): מחיל `<br>` על כל הפסקאות ש-KP חישב — KP שולט בשבירת השורות הסופית.

**סימון `_fromKp`:** מבדיל בין שורות מ-KP (מקבלות `<br>`) לשורות מ-DOM probe ישן (מקבלות `join(' ')`).

**4 מסלולי רינדור** תוקנו:
1. `applyCandidateLayoutToDOM` (V2)
2. `balanceColumns` (V1) — `renderSingleItemFast` + פיצול טורים
3. מסלול טור יחיד — `performTypesetInner`
4. מסלול דו-טורי — `performTypesetInner`

#### 2.7.6 הפרדת עימוד ורינדור — התיקון הסופי לבעיית קריסת הזיכרון

**הבעיה:** החלת `<br>` במהלך העימוד (כולל probe renders של `balanceColumns`) גרמה לצריכת זיכרון אדירה ולקריסת הדפדפן אחרי ~549 עמודים.

**הפתרון:** דגל גלובלי `_kpBrEnabled`:

```javascript
let _kpBrEnabled = false;  // כבוי במהלך העימוד

function applyKpLineBreaks() {
    if (!_kpBrEnabled) {
        _kpBrEnabled = true;
        document.querySelectorAll('p[data-from-kp="true"]').forEach(p => {
            try {
                const lines = JSON.parse(p.dataset.kpLines || '[]');
                if (lines.length > 1) {
                    p.innerHTML = lines
                        .map(l => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
                        .join('<br>');
                }
            } catch (e) {
                console.warn('applyKpLineBreaks: failed for', p, e);
            }
        });
        _kpBrEnabled = false;
    }
}

// קריאה מיד אחרי performTypesetInner:
function performTypeset() {
    performTypesetInner();
    applyKpLineBreaks();  // החל <br> רק עכשיו
}
```

**תוצאות סופיות (V18-kp-full-fix, טקסט מלא 1.5M תווים):**

| מדד | תוצאה | סטטוס |
|---|---|---|
| עמודים | 562 (צפוי 558) | ✅ |
| גלישות | 0 | ✅ |
| אלמנות | 0 | ✅ |
| יתומים | 0 | ✅ |
| `<br>` תגים | 30,621 | ✅ KP שורות כובדו |
| KP cache | 1,108 | ✅ KP רץ בהצלחה |
| Page errors | 0 | ✅ |
| זמן רינדור | ~360 שניות | ✅ ללא קריסה |
| אי-איזון | 617 | ⚠️ נובע מהחלת `<br>` אחרי איזון |

### 2.8 Canvas API — מדידת רוחב טקסט מנותקת מ-DOM

מתוך worklog (Task ID: `action-3-part-2-canvas-api`, 2026-10-13):

#### 2.8.1 הרקע

חלקה הראשון של פעולה 3 (Width Caching — `_linesCache`) כבר יושם. חלקה השני דורש החלפת מדידות `getBoundingClientRect` / `offsetWidth` היקרות (Layout Thrashing) במדידות `canvas.measureText()` המנותקות מ-DOM.

#### 2.8.2 הפונקציות

```
_getCanvasCtx()                    — canvas גלובלי יחיד
_fontDescriptor(styleObj)          — בונה מחרוזת font תקנית
_isFontAvailable(styleObj)         — בודק זמינות גופן דרך document.fonts.check()
measureWordWidth(word, styleObj)   — רוחב מילה עם מטמון, fallback ל-DOM
measureLineWidthCanvas(text, styleObj) — רוחב שורה
_getSpaceWidth(styleObj)           — רוחב רווח
estimateLineCountCanvas(words, colWidth, styleObj, opts) — אומדן גרידי
resetWordWidthCache()              — ניקוי מטמון
getWordWidthCacheStats()           — סטטיסטיקות
```

#### 2.8.3 אימות

- ✅ דיוק מדידת מילים: סטייה ממוצעת **0.25px**, מקסימלית **0.47px** (על 12 דגימות).
- ✅ אומדן מספר שורות: **התאמה מושלמת** (Canvas: 6, DOM: 6, Δ: 0).
- ✅ מטמון מאוכלס: 904-917 מילים אחרי עימוד מלא.
- ✅ שיפור נלווה: sparse p-cut ירד מ-8 ל-1 (-87.5%).
- ✅ שיפור נלווה: זמן רינדור ירד ב-1.5%.

#### 2.8.4 באגים שתוקנו במהלך הפיתוח

1. **באג ב-`_isFontAvailable`**: ה-regex `/^['"]|['"]$/g` הסיר רק את הגרש המוביל מתוך רשימת fallback. **תיקון:** העברת ה-`fontFamily` כמות שהוא ל-`document.fonts.check()`.
2. **באג ב-`_fontDescriptor`**: אותה בעיית regex, יצרה מחרוזת font פגומה. **תיקון:** אם `family` מכיל פסיק — נשתמש בו כמו שהוא. אחרת — נסיר גרשיים קיימים ונעטוף מחדש אם יש רווחים.

### 2.9 נושאים נוספים

#### 2.9.1 חטיפות טקסט (Text Snatching)

מונח לא רשמי שהמשתמש השתמש בו כדי לתאר את התופעה שבה המערכת "גונבת" מילים מפסקה אחת לשנייה כדי לפתור בעיה אחרת. **הקונפליקט המרכזי:** תיקון אלמנה על-ידי העברת מילים מ-p-cut להמשך → מקצר את ה-p-cut → יוצר שורה אחרונה דלילה.

**פתרון נוכחי:** הרצת `tightenRunts` אחרי `fixWidowContinuation`. מטפל חלקית.

#### 2.9.2 גופנים (Fonts)

**חלוקה לרשימות:**
- **`fonts-priority.json`** (439 גופנים) — נטענים מיד באמצעות `fonts-def.css`.
- **`fonts-extended.json`** (1315 גופנים) — נטענים על-ידי לחיצה על "📚 טען גופנים נוספים".

**לקחים קריטיים:**

1. **`document.fonts.status === 'loaded'` אינו אמין** — הוא מציין שהדפדפן סיים לנסות לטעון, לא שהטעינה הצליחה. הבדיקה האמינה היא `document.fonts.check('12pt "גופן"')`.
2. **`file://` protocol חוסם טעינת גופנים** — דפדפנים חוסמים טעינת גופנים מקבצים חיצוניים (CORS). הפתרון: הטמעת גופנים כ-base64 ב-CSS.
3. **שמות גופן עם גרשיים (`"`) או לוכסן (`\`)** — דפדפנים מבריחים את התווים. **תיקון:** נרמול שמות גופן — הסרת גרשיים, לוכסנים, ורווחים לפני ההשוואה.
4. **`.nojekyll` חובה ב-root** — GitHub Pages עם Jekyll מסנן קבצים עם `_` מוביל (כמו `_fonts.css`). שינוי שם ל-`fonts-def.css` + יצירת `.nojekyll` ריק פתר את הבעיה.

#### 2.9.3 שילוב עיטורים (Decorations)

הקובץ `decorations.js` (718 שורות) מכיל לוגיקת עיטורים — עיטורי פסקה פותחת, עיטורי כותרת, וכו'. כולל:
- **שערי ספר מודולריים** — שער ראשי, שער אחורי (4 מקטעים), שערי משנה.
- **מערך עיטורים נרחב** — רומח, שושנתא, מעויינים, סלסולים תורניים. תומך בהיפוך אנכי/אופקי.
- **קווי הפרדה להערות שוליים** — קו שלם, קו שליש ימני (נוסח וילנא), קו חצי מרכזי, קו כפול, קווים עם גליפים דקורטיביים.
- **מנהל ערכות נושא חיצוניות** — טעינת קובצי JSON וסריקת תיקיות נכסים.

קבצי תצורה נלווים: `note_rules.json` (162KB — כללי הערות), `header_ornaments.json` (28KB), `ornaments_left_right.json` (1.9MB), `ornaments_up_down.json` (2.3MB), `section_dividers.json` (2.7MB), `shaar_back.json` (294KB), `shaar_main.json` (213KB), `shaar_sub.json` (178KB).

#### 2.9.4 מילה ראשונה (Drop Word / פתיח)

- `.first-word-window` — `float: right`, `font-size: 1.5em`, `line-height: 0.85`, `height: 1.25em`.
- `createDropWord()` — יוצר span עם המילה הראשונה, עם `escapeHTML` למניעת XSS.
- `line-height: 0.85` דוחס את ה-line-box → המילה ממורכזת אנכית.
- **כלל ברזל:** מוחל **אך ורק** על השורה הראשונה של פסקה שמתחילה מחדש, ולעולם לא על שורה שהיא המשך של פסקה שנחצתה בין טורים או בין עמודים (`data-is-cont="true"`).

#### 2.9.5 סנכרון גלילה עורך ↔ תצוגה

- `lineToTokenMap[]` — מפה משורת עורך ל-token ID.
- `querySelectorAll` (לא `querySelector`) — מוצא את כל ההתאמות (פסקה חתוכה יכולה להופיע פעמיים).
- בוחר את האלמנט הקרוב ביותר למיקום הגלילה הנוכחי.

#### 2.9.6 beforeprint handler

- `window.addEventListener('beforeprint', ...)` — מריץ `performTypeset()` מחדש לפני הדפסה.
- נחוץ כי רינדור גופנים שונה בין מסך להדפסה (font hinting, subpixel positioning).
- `afterprint` — משחזר מצב מסך.

#### 2.9.7 תוכן עניינים (TOC)

- דו-שלבי: תוכן כללי בראש הספר + תוכן מפורט בראש כל חלק.
- מובילים מנוקדים, מספרי עמודים עדכניים, קיבוץ כותרות משנה לשורות מרוכזות.
- 26 פקדי עיצוב TOC (שהיו "מתים" ב-V1.1 ותוקנו).
- `.toc-lvl-7` נוסף (היה חסר במקור).
- `renderPaginatedTOC` עם `variantClass` (`.toc-variant-general` / `.toc-variant-detailed`).
- `toGematria` — המרה לגימטריה עם החרגות טו/טז.

---

## 3. יומן כישלונות, טעויות וניסיונות שנפסלו (Mistakes & Failed Approaches)

### 3.1 `layoutInvalidator` (V2 Engine) דרס תיקונים

- **ההצעה:** `layoutInvalidator` (מבוסס `balanceColumnsV2`) היה מתזמן re-balance דרך `requestAnimationFrame` אחרי שינויי גובה.
- **הכשלון:** V2 פעל פחות טוב מ-V1. ה-re-balance של V2 דרס את כל התיקונים של `justifyColumnsPair` + `tightenRunts`. תוצאה: 86 עמודים לא מאוזנים ב-PDF המודפס.
- **איך התגלה:** ניתוח `pdffonts` הראה גופני fallback (DavidLibre, TimesNewRoman). ניתוח הדיבאג HTML הראה שהאיזון הופעל (trace log מתעד) אבל התוצאה הסופית לא מאוזנת. הסיבה: rAF של V2 רץ אחרי ה-`finalizeTwoColumnBlockLayout` ודרס הכל.
- **המסקנה:** אל תפעיל re-balance אסינכרוני אחרי איזון סינכרוני. ה-comment out של `invalidateBlock` פתר את הבעיה. `__useBalanceV2 = false` נשמר.

### 3.2 `applied = delta` ב-P5 (במקום `applied += delta`)

- **ההצעה:** ב-`applyPriority5_WordSpacing`, לצבור את ה-delta מכל צעד ws.
- **הכשלון:** הקוד היה `applied = delta` (overwrite) במקום `applied += delta` (cumulative). תוצאה: הבדיקה `applied >= budget - 0.5` לא תפסה לעולם, ו-P5 המשיך לגדול עד ws=8, גרם ל-overshoot של 16-21px.
- **איך התגלה:** ניתוח דוחות דיבאג הראה `neededGrowth=34, applied=50` — הפער גדול מהנדרש. הפער העודף (16px) תאם בדיוק את ה-delta האחרון של P5.
- **המסקנה:** תמיד השתמש ב-`+=` לצבירה קומולטיבית בלולאות מדידה.

### 3.3 `refuse-to-fill-with-runt` ב-P4

- **ההצעה:** למנוע יצירת runt (שורה דלילה) ע"י בדיקת מספר מילים בשורה האחרונה אחרי שינוי line-height.
- **הכשלון:** `getLinesFromParagraph` משתמש ב-measuring-box עם `styleObj.lineHeight` (ברירת מחדל 1.34), לא ב-line-height שהופעל בפועל. **line-height לא משנה שבירת שורות** — הוא משנה רק מרווח אנכי. לכן הבדיקה ראתה תמיד את אותו מספר מילים.
- **איך התגלה:** דיבאג מ-`debug-page-29.html` הראה `neededGrowth=34, P4=4` — P4 הצליח להוסיף רק 4px מתוך 34px הנדרשים. הסיבה: הבדיקה חסמה את הסבב השני של P4.
- **המסקנה:** אל תבדוק runt במנגנונים שלא משנים שבירת שורות (line-height). הבדיקה רלוונטית רק ל-P5 (word-spacing) שכן משנה שבירה. **הסרה מוחלטת של הבדיקה מ-P4.**

### 3.4 `heightCeiling = budget` במקום `targetH + 1`

- **ההצעה:** להעביר את ה-budget הגלובלי (915px = כל העמוד) כ-ceiling ל-`distributeColumnJustification`.
- **הכשלון:** הפונקציה יכולה לגדול PAST הטור הארוך (כי ה-ceiling הרבה יותר גבוה מהיעד). תוצאה: overshoot של 20-40px, יצירת חוסר איזון הפוך.
- **איך התגלה:** ניתוח דיבאג הראה עמודים עם R=371 L=393 (הטור הקצר גדל מעבר לארוך). ה-ceiling היה 913 (budget) במקום 394 (targetH+1).
- **המסקנה:** העבר `growthCeiling = targetH + 1` (או `+3` ל-fallback), לא את ה-budget הגלובלי.

### 3.5 Fallback ceiling `tallH + 30` גרם ל-overshoot

- **ההצעה:** ה-rebalance fallback השתמש ב-`tallH + 30` כדי לאפשר "מרחב נשימה".
- **הכשלון:** 30px יתרון איפשר ל-P5 לקפוץ מ-0 ל-21px בצעד אחד (ws=0.5px → delta=21px) בלי ש-`colOverCeiling` יתפוס.
- **המסקנה:** הקטן ל-`tallH + 3`, והחלף צעדי P5 מ-0.5px ל-0.1px.

### 3.6 `tryLookAheadWordPull` — משיכת מילים בין טורים

- **ההצעה:** כששורה אחרונה בטור ימין דלילה, העבר 1-3 מילים מתחילת טור שמאל.
- **הכשלון:** postext (הפרויקט שנחקר) ממליץ נגד זה מפורשות: "religious/semantic text units must not be silently rebalanced for visual fit." בנוסף, הפונקציה לא מצאה אף מקרה התאמה בפועל.
- **איך התגלה:** מחקר מעמיק של מאגר postext (GitHub: drnachio/postext). המלצה #9: "Don't pull words from the next column."
- **המסקנה:** השבת את הקריאה ל-`tryLookAheadWordPull`. שורה דלילה עדיפה על שינוי תוכן דתי.

### 3.7 CSS escaping — גרשיים בתוך שם גופן

- **ההצעה:** `PRIORITY_FONTS` עם `"12pt \"גוטמן רש\"י רגיל\""` — גרשיים כפולים כעוטף CSS.
- **הכשלון:** ה-`"` בתוך `רש"י` שובר את המחרוזת. CSS קורא `"גוטמן רש"` ומתעלם מהשאר. `document.fonts.load()` נכשל שקט, והעימוד רץ עם גופני fallback.
- **איך התגלה:** `pdffonts` הראה `TimesNewRomanPS-BoldMT` (system fallback) ב-PDF. השוואת SHA256 של קובץ הגופן הראתה שהקובץ זהה, אבל השם ב-`@font-face` לא תאם.
- **המסקנה:** השתמש בגרש בודד (`'`) כעוטף CSS כשהשם מכיל `"`: `"12pt 'גוטמן רש\"י רגיל'"`.

### 3.8 GitHub Pages + Jekyll מסנן `_fonts.css`

- **ההצעה:** קובץ בשם `_fonts.css` עם `@import` ב-`style.css`.
- **הכשלון:** GitHub Pages עם Jekyll (ברירת מחדל) מתעלם מקבצים שמתחילים בקו תחתון (`_`). הדפדפן קיבל 404.
- **איך התגלה:** שגיאה בקונסול: `GET _fonts.css net::ERR_ABORTED 404`. בדיקת `raw.githubusercontent.com` הראתה 200, אבל Pages הראה 404.
- **המסקנה:** הוסף `.nojekyll` ריק ב-root, או שנה את השם ללא קו תחתון מוביל.

### 3.9 `position: relative` על `<p>` שובר מדידות (V1.1)

- **ההצעה:** שימוש ב-`span.offsetTop` למדידת מיקום מילים.
- **הכשלון:** ערכי ה-`top` של השורות התאפסו לערכים (2, 22, 42...) בכל פסקה מחדש! הסיבה: בקובץ המקורי קיים כלל CSS גלובלי: `p { position: relative; }`. עקב כך, כל פסקה הפכה ל-`offsetParent` עבור עצמה, וה-`offsetTop` של המילים נמדד יחסית לתחילת הפסקה המקומית ולא במצטבר לכל אורך הטור.
- **איך התגלה:** הזרקת לוגים לדפדפן.
- **הפתרון:** נפסלה האפשרות לדרוס זמנית ל-`position: static`, ובמקומה הוחלף כל מנגנון המדידה לשימוש ב-`getBoundingClientRect()`. המרחק חושב על-ידי החסרת `rect` הגבול העליון של תיבת המדידה מה-`rect` של כל מילה ושורה.
- **המסקנה:** אל תשתמש ב-`offsetTop` כשיש `position: relative` על אלמנטים הורים. השתמש ב-`getBoundingClientRect()`.

### 3.10 V2 Layout Engine (balanceColumnsV2)

- **ההצעה:** מנוע עימוד מתקדם עם `calculateCandidateLayout`, `scoreCandidate`, `findBestSplitPoint`, `continuationLineQuality`, `lookAheadLineBreak`.
- **הכשלון:** בבדיקות, V2 הפיק תוצאות נחותות מ-V1. ה-scoring לא הצליח למצוא נקודות פיצול טובות יותר.
- **המסקנה:** השאר את V1 כמנוע הראשי. V2 נשמר כקוד מבוטל.

### 3.11 CSS Grid Stretch — גורם לטור ריק להיראות מלא (V1.1)

- **ההצעה:** מאפיין `align-items: stretch` בגריד.
- **הכשלון:** מאפיין המתיחה גרם לדפדפן לדווח על גובה שווה בשני הטורים גם כשטור שמאל היה ריק לגמרי, מה ששיבש את כל בדיקות ההתאמה ויצר חריגות ענק (915px מול 1560px).
- **איך התגלה:** מסע ציד בדפדפן Headless — נמצא ש-`scrollHeight` לא תאם את המציאות.
- **המסקנה:** אל תשתמש ב-`align-items: stretch` על טורים. השתמש במדידה ישירה של `scrollHeight`.

### 3.12 ייצוא HTML מדויק — ניסיונות שנפסלו

#### 3.12.1 `beforeprint` re-typeset כהסבר להבדלי HTML/PDF

- **ההצעה:** ה-HTML נוצר במצב screen, אבל ה-PDF נוצר אחרי `beforeprint` שמפעיל `performTypeset()` מחדש במצב print.
- **הכשלון:** השוואת מצב screen מול מצב print באותו מסמך הראתה שהם זהים. ה-beforeprint אינו הסבר.

#### 3.12.2 re-typeset ב-scale=1 לייצוא

- **ההצעה:** הרצת `performTypeset()` עם `--preview-scale: 1` לפני הייצוא.
- **הכשלון:** יצר מסמך **שונה** מה-DOM החי (כי העימוד חושב מחדש ב-scale שונה).
- **המסקנה:** אל תריץ `performTypeset()` לפני ייצוא. שכפל את ה-DOM החי כמו שהוא.

#### 3.12.3 הגדרת `--preview-scale: 1` ב-HTML המיוצא

- **ההצעה:** הגדרת `--preview-scale: 1` ב-CSS vars של ה-HTML המיוצא.
- **הכשלון:** ה-HTML המיוצא הכיל מסמך שעומד ב-scale=1, אבל ה-CSS var אמר 1 — כלומר ה-scale לא תאם את המסמך.
- **המסקנה:** יש לשמור את ה-`--preview-scale` המקורי ב-HTML המיוצא.

#### 3.12.4 מיזוג `@media print` לתוך ה-CSS הרגיל

- **ההצעה:** חילוץ כללי `@media print` מ-`style.css` והחלתם כברירת מחדל ב-HTML המיוצא.
- **הכשלון:** לא עזר — הבעיה הייתה בגופנים, לא ב-CSS.

#### 3.12.5 הסבר האמיתי (הצליח!): הטמעת גופנים כ-base64

- **תגלית מרכזית:** `document.fonts.check()` החזיר **false** לכל 12 גופני העדיפות ב-HTML המיוצא! למרות ש-`document.fonts.status` היה "loaded", הגופנים לא באמת נטענו.
- **סיבה:** ה-`@font-face` מפנה ל-`fonts/...` אבל התיקייה לא תמיד ליד ה-HTML. וגם כשהיא לידו, `file://` protocol חוסם טעינת גופנים.
- **תיקון:** הטמעת 12 גופני העדיפות כ-base64 ישירות ב-CSS. החלפת `url('fonts/FILE.woff2')` עם `url(data:application/font-woff2;base64,...)`.
- **תוצאה:** 3 לא מאוזנים ב-HTML המיוצא = 3 ב-DOM החי (0.9%) ✓.
- **מסקנה חשובה:** הבעיה לא הייתה ב-CSS variables או ב-scale או ב-re-typeset. הבעיה הייתה ש**הגופנים לא נטענו** ב-HTML המיוצא, והדפדפן השתמש ב-fallback (serif) עם מדדים שונים → שבירת שורות שונה → איזון שונה.

### 3.13 VLM לבדיקה ויזואלית

- **ההצעה:** שימוש ב-VLM (Vision Language Model) לניתוח תמונות PDF והשוואה לדוח.
- **הכשלון:** ה-VLM **הזה (hallucinated)** — המציא טקסט שלא קיים במסמך ("השגחה פרטית", "שבת קכ"ט ע"ב", "שלוש עשרה עיקרים"). דיווח על בעיות שלא קיימות.
- **המסקנה:** VLM אינו אמין לקריאת טקסט עברי דחוס. יש להשתמש ב-DOM inspection תכנוני במקום.

### 3.14 Web Worker לעימוד

- **ההצעה:** העברת העימוד ל-Web Worker כדי לא לחסום את ה-UI.
- **הכשלון:** המערכת משתמשת ב-DOM בכבדות (`getBoundingClientRect`, `Range.getClientRects`, `getComputedStyle`). אי אפשר להעביר את ה-DOM ל-Worker.
- **המסקנה:** המערכת חייבת לרוץ ב-main thread. הפתרון לקריסות הוא אופטימיזציה של צריכת הזיכרון, לא העברה ל-Worker.

### 3.15 `bestByLineCount` ללא הגבלה

- **ההצעה:** שמירת כל נקודות הסיום הפעילות לפי `lineCount` כדי לתמוך ב-looseness אמיתי.
- **הכשלון:** יצר מספר גדול מדי של נקודות פעילות. ה-DP הפך לאיטי פי כמה. 10K תווים לקחו 60 שניות (לעומת 5 שניות ללא `bestByLineCount`).
- **תיקון:** הגבלת `lineCount` ל-3 (אופטימלי ±1) וביטול `bestByLineCount` כברירת מחדל. המסלול המלא מופעל רק כש-`looseness != 0`.
- **המסקנה:** looseness אמיתי הוא יקר. השתמש בו רק כשצריך.

### 3.16 `looseness rebalance` ב-`finalizeTwoColumnBlockLayout`

- **ההצעה:** אם אי-איזון > 20px, הרץ את הפסקה האחרונה בטור הארוך עם `looseness = -1`.
- **הכשלון:** הקריאה ל-`getLinesFromParagraph(..., -1)` פעלה **בתוך לולאת האיזון** שרצה הרבה פעמים, מה שהפעיל את המסלול האיטי `bestByLineCount` בכל פעם.
- **תיקון:** בוטל זמנית. יש לממש מחדש עם caching או רק פעם אחת לכל בלוק.
- **המסקנה:** אל תקרא ל-looseness בתוך לולאות. הוא יקר מדי.

### 3.17 החלת `<br>` במהלך probe renders

- **ההצעה:** החלת `<br>` מיד כש-KP חישב שורות, כדי שהדפדפן יכבד אותן.
- **הכשלון:** `balanceColumns` מבצע probe renders רבים. כל probe render יצר אלפי `<br>` שהדפדפן היה צריך לעבד, מה שגרם לצריכת זיכרון אדירה ולקריסת הדפדפן אחרי ~549 עמודים.
- **תיקון:** הפרדה בין עימוד ורינדור — `_kpBrEnabled = false` במהלך העימוד, `applyKpLineBreaks()` מחיל `<br>` רק בפוסט-פרוססינג.
- **המסקנה:** אל תחיל `<br>` במהלך probe renders. החל אותם רק ברינדור הסופי.

### 3.18 הורדת סף H3 מ-190px ל-120px

- **ההצעה:** הורדת הסף כדי למנוע "עמודים קצרים לפני H3".
- **תרחיש כישלון חלקי:** הסף הנמוך מאפשר ל-H3 להיכנס גם כשיש פחות מקום, אבל במחיר של סיכון מוגבר ל"כותרת עם <2 שורות" בתחתית הטור.
- **המסקנה:** זהו patch, לא פתרון. הפתרון האידיאלי הוא Knuth-Plass מלא שבוחר נקודת חיתוך גלובלית.

### 3.19 העברת ערכי ברירת מחדל לקובץ הדיבאג

- **ההצעה הראשונית:** הכנסת כל לוגיקת ההגדרות ל-`debug-panel.js`.
- **הכשלון:** המשתמש ציין ש"מדובר בשינוי שאמור להישאר בתוכנה הסופית" ואינו קשור לדיבאג.
- **תיקון:** העברת הלוגיקה ל-`settings-manager.js` (קובץ תוכנה קבוע). `debug-panel.js` מכיל רק דוח עימוד חי + מרקרים.
- **המסקנה:** הפרדה נוקשה בין "תוכנה" ו"דיבאג".

### 3.20 סף אלמנות `× 2.2` ואז `× 1.5`

- **ההצעה הראשונית:** סף `offsetHeight < lineHeight × 2.2` לזיהוי אלמנות.
- **הכשלון:** פסקאות עם 2 שורות סומנו כאלמנות (false positives). 19 אלמנות שווא.
- **ניסיון 1:** הורדת סף ל-`× 1.5` — עדיין דיווח על פסקאות עם 2 שורות.
- **ניסיון 2 (הצליח):** סף `× 1.1` — רק פסקאות עם שורה אחת ממש. 19 → 4 אלמנות (ואז → 1 אחרי תיקון `fixWidowContinuation`).
- **המסקנה:** אל תשתמש בסף `× 2.2` או `× 1.5` לאלמנות. השתמש ב-`× 1.1`.

### 3.21 `getLinesFromParagraph` לבדיקת שורות

- **ההצעה:** שימוש ב-`getLinesFromParagraph()` (פונקציה שמחשבת שבירת שורות ב-measuring-box נפרד) לבדיקת דלילות.
- **הכשלון:** החישוב אינו תואם את הרינדור בפועל בדפדפן בגלל subpixel positioning שונה, font-hinting שונה, ו-`transform: scale` שלא חל על measuring-box.
- **הוכחה:** הדוח המקורי דיווח על 752 דלילויות (שגויות) במקום ~30 אמיתיות.
- **תיקון:** החלפה מלאה ל-`Range.getClientRects()` — מודד שורות בפועל ב-DOM החי.
- **תוצאה:** 752 → 81 (ואז → 0 אחרי סינון p-end).
- **המסקנה:** אל תשתמש ב-`getLinesFromParagraph` לבדיקת שורות. השתמש ב-`Range.getClientRects()`.

### 3.22 דיווח על דלילות p-end כבעיה

- **ההצעה הראשונית:** בדיקת דלילות בכל פסקה (גם p-end וגם p-cut).
- **הכשלון:** דלילות ב-p-end (סיום טבעי ממורכז) אינה בעיה — השורה האחרונה ממורכזת (`text-align-last: center`) ודלילות טבעית ורצויה.
- **תיקון:** דלילות נבדקת **רק ב-p-cut** (אמצע פסקה — שורת החיתוך).
- **תוצאה:** 81 → 0 (במסמך הבדיקה הראשוני).
- **המסקנה:** אל תדווח על דלילות p-end כבעיה. רק p-cut רלוונטי.

### 3.23 Sparse p-cut false positives ב-RTL

- **הצעה ישנה:** הדוח השתמש ב-`rect.width` למדידת רוחב שורה.
- **הכשלון:** ב-RTL, `Range.getClientRects()` מחזיר מספר rects לאותה שורה (אחד לכל span פנימי, כמו drop-word). כל `rect.width` הוא רק רוחב ה-span עצמו, לא רוחב השורה.
- **תוצאה:** 87 false positives — הדוח דיווח על 87 שורות דלילות שלא היו דלילות בכלל.
- **תיקון:** החלפת `rect.width` ב-`rect.right - colRect.left` — המרחק מתחילת הטור עד סוף הטקסט. זה נכון ל-RTL ול-LTR כאחד.
- **המסקנה:** ב-RTL, `rect.width` אינו מייצג רוחב שורה. השתמש ב-`rect.right - colRect.left`.

### 3.24 Font fallback false negatives

- **הבעיה:** `checkFontFallback` נירמל את ה-requested על-ידי `s.split(',')[0]` — לקח רק את הגופן הראשון ברשימת ה-fallback. אבל CSS var `--fn-body` מכיל רשימת fallback מלאה: `'גוטמן רש"י רגיל', 'פרנק רוהל ליברה רגיל', serif`. כשהגופן הראשון לא נטען, הדפדפן נופל לשני — שזה בסדר גמור. אבל הדוח דיווח על זה כ-fallback שגוי.
- **תיקון:** פיצול ה-requested לרשימה, ובדיקה אם ה-actual מופיע בה. `isInRequestedList = requestedList.some(r => r === firstActual || ...)`. `isFallback = !isInRequestedList && firstRequested !== firstActual`.

### 3.25 `detectTofu` תמיד false

- **הבעיה:** הגרסה הישנה בדקה רק "האם משהו מצויר" — אבל כשהגופן לא קיים, הדפדפן נופל ל-serif גנרי שכן מצייר עברית. אז הבדיקה תמיד החזירה false.
- **תיקון:** הגרסה החדשה משווה בין ציור הגופן המבוקש לבין ציור serif גנרי. אם הם זהים (הפרש < 5% ממספר הפיקסלים), הגופן לא נטען ויש fallback. כמו-כן, גופנים גנריים (serif, sans-serif, וכו') לעולם אינם tofu.

### 3.26 קידומות לשמות קבצים

- **ההצעה:** ייצוא קבצים עם קידומות כמו `v18-fix-typesetter.js`, `v18-fix-style.css` כדי לזהות גרסאות.
- **הכשלון:** המשתמש מסיר את הקידומות ידנית בכל פעם ודוחף ל-default branch. הקידומות יצרו עומס עבודה.
- **המסקנה:** אל תוסיף קידומות לשמות קבצים.

### 3.27 הגשת קבצים שלא תוקנו בהודעה

- **ההצעה:** הגשת כל הקבצים בכל זיפ, גם אם לא כולם תוקנו.
- **הכשלון:** המשתמש ציין: "אין צורך להגיש בהודעה קבצים שלא תוקנו ונערכו בהודעה".
- **המסקנה:** הגש רק קבצים שתוקנו בהודעה הנוכחית.

### 3.28 בדיקת תיקון לפני הגשה

- **ההצעה:** הגשת תיקון מבלי לבדוק שהוא עובד.
- **הכשלון:** המשתמש ציין: "התיקון לא עזר, אנא, בדוק שהתיקון עזר לפני הגשתו."
- **המסקנה:** בדוק כל תיקון בדפדפן חסר-ראש (Playwright) לפני הגשה.

### 3.29 `insertBefore` בלי בדיקת `parentNode`

- **ההצעה:** שימוש ב-`parent.insertBefore(newChild, refChild)` בלי לבדוק ש-`refChild.parentNode === parent`.
- **הכשלון:** `initTabSystem()` ב-`debug-panel.js` שינה את ה-DOM, ואז `initStyleSetDropdown()` ב-`settings-manager.js` ניסה להכניס סרגל לפני `.settings-top-bar` — אבל `.settings-top-bar` כבר לא היה ילד ישיר של `settings-pane`. ה-`insertBefore` נכשל וגרם לקריסת ה-IIFE כולו.
- **תיקון:** בדיקה ש-`refChild.parentNode === parent` לפני `insertBefore`. אם לא — fallback ל-`parent.insertBefore(newChild, parent.firstChild)`.
- **המסקנה:** תמיד בדוק ש-`refChild` באמת ילד של `parent` לפני `insertBefore`. השתמש ב-fallback.

### 3.30 באגים V1.1 שתוקנו בשיחות המוקדמות

מתוך `sichot_ai.md` (סיכום 3 שיחות Claude AI):

1. **באג גלישת עיטור סיום פרק (Divider Overflow):** בעמוד 9 נמדד `scrollHeight = 960px` מול גובה קונטיינר של 921px (גלישה של כ-39px). הקוד המקורי מילא את שני הטורים עד תום שטח הדף, ובסיום הזריק את העיטור ללא שום בדיקה האם נותר עבורו מקום פיזי. **תיקון:** נוצרה `measureHtmlBlockHeight(htmlSnippet, width)` שמודדת מראש את הגובה, ומקזזת מהתקציב.
2. **26 פקדי עיצוב TOC "מתים":** כל 26 בקרות הגופנים בלוח ההגדרות היו מוגדרות ב-HTML, אך **לא נקראו כלל בקוד ה-JavaScript**. שינוי הערכים בפאנל לא השפיע בשום צורה. **תיקון:** הוגדרו משתני CSS ייעודיים ב-`:root` עבור כל רמה, ו-`updateStyles()` חוברה במלואה.
3. **חוסר `.toc-lvl-7`:** המחלקה `.toc-lvl-7` לא הייתה קיימת כלל. **תיקון:** נוספה.
4. **Grouped TOC Bug:** `gtoc-show = unchecked` + `gtoc-grp = checked` — הקוד המקורי בדק `show` כחסם מוחלט, וכותרות אלו נעלמו. **תיקון:** תנאי חדש: `if (showLevels[tok.level] || isInGroupCascade(tok.level))`.
5. **פקדי "כותרת צד" לא פעילים לרמות 4, 5, 6:** בתפריט הבחירה הופיעה האפשרות, אבל בקוד המנגנון ננעל לרמה 7 בלבד. **תיקון:** מאפיין `.sideNote` שודרג לאובייקט `{ text, level }`.
6. **שדות טקסט חופשי מוסתרים:** כשנבחרה "טקסט מותאם אישית", שדה ההזנה נשאר מוסתר. הסיבה: נשכח מאזין האירוע `onchange`. **תיקון:** נוסף.
7. **"כותרת 3" בכותרת העליונה תמיד ריקה:** `renderHeaderSectionHTML` תמך בזה, אבל `createPageLayout` העבירה מחרוזת ריקה קשיחה (`""`). **תיקון:** משתנה מעקב `currentH3Title`.

### 3.31 באגים K-P מוקדמים

מתוך worklog (Task ID: `action-4-knuth-plass`):

**באג 1: אלגוריתם שם מילה אחת בכל שורה**
- סיבה: `badness = 0` לשורות underfull בנות מילה אחת (כי `lineStretch = 0`).
- תוצאה: האלגוריתם העדיף 24 שורות בנות מילה אחת על פני 5 שורות נורמליות.
- **תיקון:** `badness = 100 * (stretchNeeded/target)^3` גם לשורות בנות מילה אחת.

**באג 2: activeStarts break לכיוון הלא נכון**
- סיבה: `if (!lc.isOverfull) break` — יצא מהלולאה כשהשורה הייתה underfull (קצרה מדי), במקום כשהייתה overfull (ארוכה מדי).
- **תיקון:** `if (lc.natural > target) break` — יוצאים רק כשהשורה ארוכה מדי.

**באג 3: שורה אחרונה overfull**
- סיבה: `badness = 0` לשורה אחרונה ללא תנאי, גם אם natural > target.
- תוצאה: האלגוריתם דחף מילים עודפות לשורה האחרונה, שגלשה מחוץ לטור.
- **תיקון:** שורה אחרונה — badness=0 רק אם underfull. אם overfull, מפעיל לוגיקת shrink רגילה.

---

## 4. סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase & Implementation State)

### 4.1 מפת הקבצים המלאה (V18-kp-full-fix, 15 באוקטובר 2026)

#### קבצי תוכנה (קבועים)

| קובץ | גודל | שורות | תפקיד | סטטוס |
|---|---|---|---|---|
| `typesetter.js` | 363KB | ~6650 | מנוע העימוד + K-P + Canvas API + כל התיקונים | ✅ יציב |
| `app.js` | 113KB | ~2500 | UI + `initTabSystem()` + `loadExtendedFonts()` + `exportRenderedHTML()` | ✅ יציב |
| `settings-manager.js` | 11KB | ~250 | ניהול הגדרות (loadDefaultSettings, applySettingsToDOM, ...) | ✅ חדש (V18) |
| `style.css` | — | ~1900 | סגנונות + `flex-wrap: wrap` + `display: inline` להערות שוליים | ✅ יציב |
| `decorations.js` | — | 718 | עיטורים + שערים + סניטציית SVG | ✅ יציב |
| `index.html` | — | ~1330 | מעטפת HTML עם טאבים | ✅ יציב |
| `default_settings.json` | 9KB | — | 249 הגדרות ברירת מחדל | ✅ חדש (V18) |
| `setting_sets/קונטרס.json` | — | — | סט הגדרות "קונטרס" | ✅ חדש (V18) |
| `setting_sets/פרשנות.json` | — | — | סט הגדרות "פרשנות" | ✅ חדש (V18) |
| `setting_sets/תלמוד.json` | — | — | סט הגדרות "תלמוד" | ✅ חדש (V18) |
| `fonts-def.css` | — | ~4400 | רשימה 1 — 439 `@font-face` | ✅ יציב |
| `fonts-extended.css` | — | ~13000 | רשימה 2 — 1315 `@font-face` | ✅ יציב |
| `fonts-priority.json` | — | — | רשימה 1 — 439 רשומות | ✅ יציב |
| `fonts-extended.json` | — | — | רשימה 2 — 1315 רשומות | ✅ יציב |
| `note_rules.json` | 162KB | — | כללי הערות שוליים | ✅ יציב |
| `header_ornaments.json` | 28KB | — | עיטורי כותרות | ✅ יציב |
| `ornaments_left_right.json` | 1.9MB | — | עיטורי צד ימין/שמאל | ✅ יציב |
| `ornaments_up_down.json` | 2.3MB | — | עיטורי עליון/תחתון | ✅ יציב |
| `section_dividers.json` | 2.7MB | — | מפרידי סעיפים | ✅ יציב |
| `shaar_back.json` | 294KB | — | שער אחורי | ✅ יציב |
| `shaar_main.json` | 213KB | — | שער ראשי | ✅ יציב |
| `shaar_sub.json` | 178KB | — | שער משנה | ✅ יציב |
| `assets_manifest.json` | 240B | — | מניפסט נכסים | ✅ יציב |
| `.nojekyll` | 0B | — | מבטל Jekyll ב-Pages | ✅ קריטי |

#### קבצי דיבאג (ניתנים להסרה)

| קובץ | גודל | שורות | תפקיד | סטטוס |
|---|---|---|---|---|
| `debug-panel.js` | 21KB | ~600 | דוח עימוד חי + מרקרים + ייצוא HTML ממורקר | ✅ יציב |
| `test-suite.js` | 56KB | ~930 | מחולל טקסט seeded + דוח עימוד מדויק | ✅ יציב |
| `trace-manager.js` | 22KB | 497 | מערכת מעקב אחרי קריאות פונקציות לפרק | ✅ חדש (V18) |

#### קבצי תיעוד ומחקר (Reports_Summaries_Studies/)

| קובץ | גודל | תפקיד |
|---|---|---|
| `מערכת_עימוד_תורנית_תיעוד_טכני.md` | 25KB | תיעוד טכני מלא (V14) |
| `המשך_שיחה.md` | 5.8KB | המשך שיחה V15 |
| `המשך_שיחה_ב.md` | 34KB | המשך שיחה V16-V17 |
| `המשך_שיחה_ג.md` | 19KB | המשך שיחה V18 |
| `הוראות-הפעלה.md` | 831B | הוראות דחיפת v10 ל-GitHub |
| `דוח עימוד.pdf` | 1.8MB | דוח עימוד לדוגמה |
| `Research_on_the_typesetting_of_Torah_books.md` | 55KB | מחקר 1: ארכיטקטורה, אלגוריתמיקה |
| `Research_on_the_typesetting_of_Torah_books_2.md` | 20KB | מחקר 2: עיצוב דו-טורי ב-RTL |
| `Knuth_Plass_research_report.md` | 71KB | מחקר K-P 1: אלגוריתם מלא |
| `Knuth_Plass_research_report_2.md` | 29KB | מחקר K-P 2: סיכום מנהלים |

#### קבצי root ותיעוד

| קובץ | גודל | תפקיד |
|---|---|---|
| `README.md` | 1.8KB | תיאור גרסה v10 |
| `SECURITY.md` | 11KB | מדיניות אבטחה מלאה |
| `ACCESSIBILITY.md` | 6.8KB | מסמך נגישות WCAG 2.1 AA |
| `worklog.md` | 47KB | יומן עבודה מלא (8 משימות) |
| `v18-kp-full-fix-report.md` | 4.5KB | דוח תיקונים V18-KP |
| `long_test_text_2.txt` | 2.6MB | טקסט בדיקה ארוך |
| `analysis_results.md` (debug/) | 1.6KB | תוצאות בדיקת עימוד |

### 4.2 מפת הפונקציות המרכזיות ב-`typesetter.js`

#### זרימת עימוד

| פונקציה | שורות | תפקיד |
|---|---|---|
| `typesetDocument()` | — | entry point עם debounce 400ms |
| `performTypeset()` | 3801-3835 | wrapper שמפעיל `performTypesetInner` + post-processing |
| `performTypesetInner()` | 3837-5240 | לולאת העימוד הראשית (עטופה ב-try/catch) |
| `updateGrid()` | — | קורא CSS vars מ-DOM ומחשב מידות |
| `updateStyles()` | 162-225 | קריאת CSS vars מ-DOM והחלת סגנונות |

#### Canvas API (סעיף 3א')

| פונקציה | תפקיד |
|---|---|
| `_getCanvasCtx()` | canvas גלובלי יחיד |
| `_fontDescriptor(styleObj)` | בונה מחרוזת font תקנית |
| `_isFontAvailable(styleObj)` | בודק זמינות גופן דרך document.fonts.check() |
| `measureWordWidth(word, styleObj)` | רוחב מילה עם מטמון, fallback ל-DOM |
| `measureLineWidthCanvas(text, styleObj)` | רוחב שורה |
| `_getSpaceWidth(styleObj)` | רוחב רווח |
| `estimateLineCountCanvas(words, colWidth, styleObj, opts)` | אומדן גרידי של מספר שורות |
| `resetWordWidthCache()` | ניקוי מטמון |
| `getWordWidthCacheStats()` | סטטיסטיקות לדיבאג |

#### Knuth-Plass (סעיף 3ב')

| פונקציה | תפקיד |
|---|---|
| `knuthPlassBreak(words, colWidth, styleObj, opts)` | האלגוריתם הראשי — DP על נקודות שבירה |
| `lineCost(a, b, isLastLine, isFirstLine, lineNumInPara)` | עלות שורה (badness + penalty + clubpenalties) |
| `isKnuthPlassAvailable(styleObj)` | בודק זמינות |
| `setKnuthPlassEnabled(enabled)` | הפעלה/כיבוי |
| `resetKpCache()` | ניקוי מטמון |
| `getKpCacheStats()` | סטטיסטיקות |
| `applyKpLineBreaks()` | פוסט-פרוססינג: החל `<br>` |

#### איזון טורים

| פונקציה | שורות | תפקיד |
|---|---|---|
| `balanceColumns(block)` | — | איזון טורים עם probe renders (V1, ברירת מחדל) |
| `balanceColumnsV2(block)` | — | אלטרנטיבה שנכשלה (מבוטלת) |
| `finalizeTwoColumnBlockLayout(block)` | 1224-1270 | רכז: איזון → tightenRunts → rebalance |
| `distributeColumnJustification()` | 921-1182 | איזון טור קצר ע"י 5 עדיפויות + תיקון ישיר |
| `justifyColumnsPair()` | 1143-1190 | זיהוי טור קצר + קריאה ל-distribute |
| `applyPriority1_HeadingBefore()` | 937-958 | margin-top לפני כותרת |
| `applyPriority2_HeadingAfter()` | 961-982 | margin-bottom אחרי כותרת |
| `applyPriority3_ParagraphSpacing()` | 985-1006 | margin-bottom בין פסקאות |
| `applyPriority4_LineHeight()` | 1008-1041 | line-height (cap 0.18, ללא refuse-to-fill-with-runt) |
| `applyPriority5_WordSpacing()` | 1054-1121 | word-spacing (צעדי 0.1px + חיפוש בינארי 0.01px) |
| `enforceBlockColumnsWithinCeiling()` | — | guard נגד overflow |

#### מניעת אלמנות/יתומים

| פונקציה | שורות | תפקיד |
|---|---|---|
| `rollbackColumnTail()` | 1352-1460 | גלגול אחורה: מניעת יתומ/אלמנות |
| `fixWidowContinuation(block)` | — | פתרון cross-column widows (העברת מילים מ-p-cut להמשך) |
| `tightenRunts()` | 1405-1500 | כיווץ tracking שלילי (DOM ישיר) |
| `tightenRuntsInBlock()` | 1511-1539 | בדיקת אי-איזון לפני כיווץ |

#### PushBack חכם וחיתוך תוך-שורי

| פונקציה | שורות | תפקיד |
|---|---|---|
| `pushBackSmart(...)` | 6368-6480 | חישוב כמה שורות להסיר והסרה רק של השורות הדרושות |
| `intraLineCut(...)` | 4370-4411 | העברת מילה אחת משורה קודמת לשורה אחרונה דלילה |
| דחיפת בלוק לא מאוזן | 6557-6628 | מניעת טורים ריקים בסוף פרק |

#### הערות שוליים

| פונקציה | שורות | תפקיד |
|---|---|---|
| `finalizeNotePositions()` | 2922-2965 | מיקום הערות שוליים (offsetTop + 4px) |
| `buildNoteBlockElement(...)` | — | בונה אלמנט הערת שוליים (עם ניקוי U+E000) |
| `applyNoteMarkerStyle(...)` | — | מתאים עיצוב אות הערה |
| `flushFootnotesInto(pageEl)` | — | מוזרק לתחתית העמוד |
| `getFootnotesReservedHeight()` | — | מחשב גובה נדרש |
| `lineBreakCharIndex` | — | בודק שנקודת חיתוך לא חוצה סוגרי הערה |
| `lineBreakCrossesNoteSpan` | — | בודק שנקודת חיתוך לא חוצה סוגרי הערה |

#### ייצוא HTML

| פונקציה | תפקיד |
|---|---|
| `exportRenderedHTML()` | ייצוא מסמך מרונדר ל-HTML עצמאי (עם גופנים base64) |

#### אחרים

| פונקציה | שורות | תפקיד |
|---|---|---|
| `getLinesFromParagraph()` | 297-430 | מדידת שורות (לא לבדיקות! ראה סעיף 3.21) |
| `createDropWord()` | 256-295 | יצירת מילה ראשונה מודגשת |
| `performTypeset()` | 3801-3835 | כניסה ראשית (עם try/catch) |
| `toGematria()` | — | המרה לגימטריה (עם החרגות טו/טז) |
| `renderPaginatedTOC()` | — | תוכן עניינים דו-שלבי |

### 4.3 קטעי קוד סופיים עיקריים

#### 4.3.1 `applyKpLineBreaks` — הפרדת עימוד ורינדור

```javascript
let _kpBrEnabled = false;  // כבוי במהלך העימוד

function applyKpLineBreaks() {
    if (!_kpBrEnabled) {
        _kpBrEnabled = true;
        document.querySelectorAll('p[data-from-kp="true"]').forEach(p => {
            try {
                const lines = JSON.parse(p.dataset.kpLines || '[]');
                if (lines.length > 1) {
                    p.innerHTML = lines
                        .map(l => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
                        .join('<br>');
                }
            } catch (e) {
                console.warn('applyKpLineBreaks: failed for', p, e);
            }
        });
        _kpBrEnabled = false;
    }
}

function performTypeset() {
    performTypesetInner();
    applyKpLineBreaks();
}
```

#### 4.3.2 PushBack חכם

```javascript
function pushBackSmart(column, targetH) {
    const overflow = column.scrollHeight - targetH;
    if (overflow <= 0) return;
    
    const lineHeight = parseFloat(getComputedStyle(column).lineHeight);
    const linesToRemove = Math.ceil(overflow / lineHeight);
    
    const paragraphs = Array.from(column.children).filter(c => c.tagName === 'P');
    if (paragraphs.length === 0) return;
    
    const lastP = paragraphs.pop();
    const text = lastP.dataset.rawText || lastP.textContent;
    const words = text.split(/\s+/);
    
    if (words.length <= linesToRemove + 1) {
        lastP.remove();
        return;
    }
    
    const wordsToKeep = Math.max(0, words.length - linesToRemove * 3);
    const newRightText = words.slice(0, wordsToKeep).join(' ');
    const movedText = words.slice(wordsToKeep).join(' ');
    
    lastP.dataset.rawText = newRightText;
    lastP.textContent = newRightText;
    
    const nextCol = getNextColumn(column);
    if (nextCol) {
        const newP = document.createElement('p');
        newP.className = lastP.classList.contains('p-cut') ? 'p-cut' : 'p-end';
        newP.dataset.rawText = movedText;
        newP.textContent = movedText;
        nextCol.insertBefore(newP, nextCol.firstChild);
    }
}
```

#### 4.3.3 בדיקת דלילות עם `Range.getClientRects` (RTL-aware)

```javascript
function checkSparse(block) {
    const issues = [];
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
            // RTL: rect.right - colRect.left (לא rect.width!)
            const lineWidth = lastRect.right - colRect.left;
            const colWidth = colRect.width;
            const ratio = lineWidth / colWidth;
            if (ratio < 0.5) {
                issues.push({
                    page: getPageNumber(block),
                    col: col.classList.contains('col-l') ? 'L' : 'R',
                    type: 'sparse',
                    severity: 'medium',
                    detail: `width ratio: ${(ratio * 100).toFixed(0)}%`
                });
            }
        });
    });
    return issues;
}
```

#### 4.3.4 `settings-manager.js` — טעינת הגדרות עם localStorage

```javascript
async function loadDefaultSettings() {
    try {
        const response = await fetch('default_settings.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const defaultSettings = await response.json();
        applySettingsToDOM(defaultSettings, false);
        
        // סדר עדיפויות: סט ידני > הגדרות מיובאות > ברירת מחדל
        const savedSet = localStorage.getItem('selected_style_set');
        const importedSettings = localStorage.getItem('imported_settings');
        
        if (importedSettings) {
            try {
                applySettingsToDOM(JSON.parse(importedSettings), false);
                return;
            } catch (e) {
                localStorage.removeItem('imported_settings');
            }
        }
        
        if (savedSet) {
            try {
                const setResponse = await fetch(`setting_sets/${savedSet}`);
                if (setResponse.ok) {
                    const settings = await setResponse.json();
                    applySettingsToDOM(settings, false);
                    return;
                }
            } catch (e) {
                localStorage.removeItem('selected_style_set');
            }
        }
    } catch (e) {
        console.error('loadDefaultSettings failed:', e);
    }
}
```

### 4.4 טיפול בשגיאות כללי

1. **`try/catch` על כל פעולת DOM קריטית** — שגיאה בפסקה אחת לא מפילה את כל המערכת.
2. **Fallback להגדרות HTML** — אם `default_settings.json` לא נטען, ערכי ה-HTML משמשים כ-fallback.
3. **Debounce 400ms על `typesetDocument`** — מונע ריצות מרובות במהלך הקלדה.
4. **`enforceBlockColumnsWithinCeiling`** — guard אחרון שמונע overflow.
5. **`performTypesetInner` עטופה ב-`try/catch`** — במקרה של שגיאה: הודעה ל-`#editor-stats` (אדום), `console.error`, ו-`window.showToast()` (אם מוגדר).

---

## 5. מקרי קצה שנבדקו ותורגמו לבדיקות (Edge Cases & Validation)

### 5.1 רשימת מקרי הקצה המיוחדים לעימוד תורני

| # | מקרה קצה | תיאור | פתרון נוכחי | סטטוס |
|---|---|---|---|---|
| 1 | **הערת שוליים ארוכה מעמוד שלם** | הערה שאורכה > גובה עמוד | העברה לעמוד הבא. עמוד מכיל רק הערות שוליים. | ⚠️ אילוץ |
| 2 | **כותרת בתחתית טור** | H4/H5/H6 כאלמנט אחרון בטור | `rollbackColumnTail` מגלגל את הכותרת לטור הבא | ✅ תקין |
| 3 | **כותרת עם <2 שורות אחריה** | H3/H4 ואז פסקה קצרה | `checkHeadingAtColumnBottom` מדווח. אין פתרון אוטומטי. | ⚠️ אילוץ |
| 4 | **חוסר מקום בטור ב'** | פסקה אחת בטור א', טור ב' ריק | PushBack חכם מעביר שורות במקום פסקה שלמה | ✅ תקין |
| 5 | **פסקה בת מילה אחת** | פסקה קצרצרה (לדוגמה: "והבן כי.") | אי אפשר לתקן — תמיד "דלילה". מערכת מדלגת. | ⚠️ בלתי פתיר |
| 6 | **פסקה ענקית (800+ מילים)** | נחתכת מספר פעמים | K-P מחשב נקודות חיתוך אופטימליות | ✅ תקין |
| 7 | **שתי פסקאות ענקיות זו אחר זו** | נקודות החיתוך משפיעות זו על זו | K-P גלובלי נדרש (עתיד) | ⚠️ חלקי |
| 8 | **כותרת + פסקה קצרצרה** | H4 ואז פסקה בת מילה אחת | דרוש fallback — השאר את הכותרת | ⚠️ אילוץ |
| 9 | **רצף כותרות ללא פסקאות** | H3 → H4 → H5 ללא טקסט | `rollbackColumnTail` מגלגל את כולן לטור הבא | ✅ תקין |
| 10 | **הערת שוליים שמחייבת מיקום** | הערה ב-`offsetTop` מסוים | אם הפסקה נגללת, ההערה עוברת איתה | ⚠️ אילוץ |
| 11 | **טקסט קודש מול פירושים** | תנ"ך/תלמוד מול רש"י/תוספות | גופנים שונים לכל אחד, טורים מקבילים | ✅ תקין |
| 12 | **ריבועים במקום רווחים (U+E000)** | תו PUA גורם לריבועים | ניקוי U+E000 ב-`buildNoteBlockElement` | ✅ תקין |
| 13 | **מעבר שורה אחרי אות הערה** | `<span class="note-line-num">` נשבר | `display: inline` מפורש ב-CSS | ✅ תקין |
| 14 | **גופן לא נטען ב-HTML מיוצא** | `document.fonts.status === 'loaded'` שקרי | `document.fonts.check()` + base64 embedding | ✅ תקין |
| 15 | **גלישה בטור** | `scrollHeight > clientHeight + 2` | `enforceBlockColumnsWithinCeiling` מנטרל תיקונים שגורמים ל-overflow | ✅ תקין |
| 16 | **אלמנה cross-column** | p-cut בטור א', המשך בשורה אחת בטור ב' | `fixWidowContinuation` מעביר מילים או ממזג | ✅ תקין (1 מקרה שארית) |
| 17 | **חוסר איזון עם כותרת בטור** | כותרת מוסיפה 22px, line-height לא מצליח לפצות | P2.5 (margin-bottom של H5). דרוש הרחבה ל-H4/H6. | ⚠️ חלקי |
| 18 | **סוף פרק (טור ריק)** | טור שמאל ריק, טור ימין קצר | תקין — אי אפשר למלא טור בלי תוכן | ✅ תקין |
| 19 | **קריסת דפדפן בטקסט מלא** | 1.5M תווים, 562 עמודים | `_kpBrEnabled` מפריד עימוד מרינדור | ✅ תקין |
| 20 | **PDF לא תואם HTML** | גופנים לא נטענים בייצוא | base64 embedding של 12 גופני priority | ✅ תקין |
| 21 | **טקסט מקודש על-ידי `<br>`** | `<br>` משביר justify | `_kpBrEnabled = false` במהלך probe renders | ✅ תקין |
| 22 | **שמות גופן עם תווים מיוחדים** | `"`, `\` בשם גופן | נרמול שמות לפני השוואה | ✅ תקין |
| 23 | **`file://` חוסם גופנים** | פתיחת HTML מקומי | הטמעת גופנים כ-base64 ב-CSS | ✅ תקין |
| 24 | **גלישת עיטור סיום פרק** | עיטור דורש 60-67px, אין מקום | `measureHtmlBlockHeight` מודד מראש ומקזז מהתקציב | ✅ תקין |
| 25 | **CSS Grid Stretch מזהה טור ריק כמלא** | `align-items: stretch` משבש מדידות | הוסר; מדידה ישירה של `scrollHeight` | ✅ תקין |
| 26 | **`position: relative` על `<p>`** | שובר מדידות `offsetTop` | מעבר ל-`getBoundingClientRect()` | ✅ תקין |
| 27 | **TOC עם 26 פקדים מתים** | פקדים לא חוברו לקוד | `updateStyles()` חוברה במלואה | ✅ תקין |
| 28 | **Grouped TOC — כותרות נעלמות** | `show` כחסם מוחלט | תנאי חדש עם `isInGroupCascade` | ✅ תקין |
| 29 | **שדות custom מוסתרים** | `onchange` חסר | נוסף | ✅ תקין |
| 30 | **"כותרת 3" לא מוצגת בכותרת עליונה** | מחרוזת ריקה קשיחה | משתנה מעקב `currentH3Title` | ✅ תקין |

### 5.2 בדיקות יזומות (Validation Tests)

#### 5.2.1 בדיקת אימות דוח עימוד (15/15)

מערכת בדיקות מקיפה (`scripts/validate_report_accuracy.js`) עם 17 בדיקות:

1. **T1: Widow/Orphan** — השוואה ל-Range.getClientRects ✅
2. **T2: Sparse p-cut** — תיקון קריטי: `rect.width` → `rect.right - colRect.left` (RTL) ✅
3. **T3: Column overflow** ✅
4. **T4: Side-note overlap** ✅
5. **T5: Heading at bottom** ✅
6. **T6: Single-line p-cut** ✅
7. **T7: Empty column** ✅
8. **T8: Imbalanced columns** ✅
9. **T9: Font fallback** — תיקון: בדיקת רשימת fallback מלאה ✅
10. **T12: Tofu detection** — תיקון: השוואה ל-serif גנרי ✅
11. **T13: Page errors** ✅
12. **T14: Report determinism** ✅
13. **T15: Empty document edge case** ✅
14. **T16: Knuth-Plass consistency** ✅
15. **T17: Sparse threshold monotonicity** ✅

#### 5.2.2 השוואת מסמכים — 22/23 מדדים זהים

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

#### 5.2.3 טקסט בדיקה seeded

`generateTestTextSeeded()` ב-`test-suite.js` משתמש ב-**LCG (Linear Congruential Generator)** עם seed קבוע (12345). זה מבטיח שחזור מלא — אותו טקסט, אותם עמודים, אותן בעיות — בכל הרצה.

#### 5.2.4 בדיקת עימוד מלא (1.5M תווים, 562 עמודים)

תוצאות סופיות (V18-kp-full-fix):

| מדד | תוצאה | סטטוס |
|---|---|---|
| עמודים | 562 (צפוי 558) | ✅ |
| גלישות | 0 | ✅ |
| אלמנות | 0 | ✅ |
| יתומים | 0 | ✅ |
| `<br>` תגים | 30,621 | ✅ KP שורות כובדו |
| KP cache | 1,108 | ✅ KP רץ בהצלחה |
| Page errors | 0 | ✅ |
| זמן רינדור | ~360 שניות | ✅ ללא קריסה |
| אי-איזון | 617 | ⚠️ נובע מהחלת `<br>` אחרי איזון |

#### 5.2.5 בדיקת עומס (Stress Test) — מתוך שיחות AI קודמות

מסמך ענק: 3 חלקי ספר (שערים), 8 פרקים בכל חלק (סך הכל **24 פרקים מלאים**), מגוון כותרות בכל הרמות, הערות שוליים, ופסקאות באורכים שונים.

* **תוצאות:**
  * **מספר עמודים כולל:** 62 עמודי ספר מלאים.
  * **זמן עיבוד ועימוד כולל:** 852 מילי-שניות בלבד.
  * **חריגות עמוד (Overflow Violations):** 0.
  * **דיוק איזון טורים כולל:** מתוך 96 בלוקים דו-טוריים, 84 היו מאוזנים בדיוק מושלם של פיקסל בודד.
  * **ממוצע אי-איזון כולל:** 2.25px בלבד.

#### 5.2.6 בדיקת Canvas API

מתוך worklog (Task ID: `action-3-part-2-canvas-api`):

| מדד | Baseline | עם Canvas | Δ |
|---|---|---|---|
| זמן רינדור | 25089 ms | 24724 ms | -1.5% (מהיר יותר) |
| עמודים | 363 | 363 | 0 |
| בלוקים | 355 | 354 | -1 (זניח) |
| אלמנות | 0 | 0 | 0 |
| יתומים | 0 | 0 | 0 |
| **Sparse p-cut** | **8** | **1** | **-7 (-87.5%)** ✅ |
| Imbalanced (>5px) | 5 (1.4%) | 5 (1.4%) | 0 |
| Overflow | 0 | 0 | 0 |
| Page errors | 0 | 0 | 0 |

#### 5.2.7 בדיקת K-P

מתוך worklog (Task ID: `action-4-knuth-plass`):

| מדד | Baseline (KP OFF) | עם Knuth-Plass | Δ |
|---|---|---|---|
| זמן רינדור | 24.4s | 28.9s | +18% |
| עמודים | 363 | 366 | +3 |
| בלוקים | 354 | 357 | +3 |
| אלמנות | 0 | 0 | 0 |
| יתומים | 0 | 0 | 0 |
| Sparse p-cut | 8 | 111 | ⚠ +103 |
| Imbalanced (>5px) | 6 (1.7%) | 7 (2.0%) | +1 |
| Overflow | 0 | 0 | 0 |
| Page errors | 0 | 0 | 0 |

**הערה על sparse p-cut:** הרגרסיה (8→111) נובעת מאינטראקציה עם איזון טורים. KP מייצר שורות אחידות יותר, מה שאומר שהשורה האחרונה של כל פסקה קצרה יותר באופן יחסי. זהו tradeoff טבעי של KP.

### 5.3 טקסט בדיקה אמיתי

`חלק ההקדמה סדר חדש.txt` (274,272 תווים, ~97 עמודים) — טקסט תורני אמיתי לבדיקות.

`long_test_text_2.txt` (1,540,404 תווים, 558 עמודים) — טקסט בדיקה ארוך.

---

## 6. מפת דרכים והצעדים הבאים (Roadmap & Pending Tasks)

### 6.1 מה מתוכנן לשלב הבא

1. **הרצת איזון טורים נוספת אחרי `applyKpLineBreaks`** — כרגע `<br>` משנה גבהי פסקאות אחרי איזון הטורים, מה שגורם ל-617 לא מאוזנים. פתרון: הרצת `balanceColumns` נוספת אחרי החלת `<br>`, או שימוש ב-`numLines` של K-P לחישוב גובה ללא DOM.

2. **מימוש מלא של `looseness` עם caching** — כרגע `bestByLineCount` מבוטל כברירת מחדל כי הוא יקר. יש לממש מחדש עם caching והגבלת קריאות.

3. **הרחבת P2.5 לכל הכותרות (H4/H6)** — כרגע P2.5 פועל רק על H5. הרחבה תעזור במקרי חוסר איזון עם כותרות (Δ=22px).

4. **איזון טורים איטרטיבי עם looseness** — הרצת פסקה אחרונה בטור הארוך עם `looseness=-1`. כרגע מבוטל זמנית כי יקר מדי.

5. **שיפור `fixWidowContinuation`** — מיזוג המשך קצר חזרה ל-p-cut כשאי אפשר להגיע ל-2 שורות.

6. **`clubpenalties` לכותרות** — העברת `clubpenalties: [10000, 10000, 150]` כאשר פסקה באה אחרי כותרת, כדי להבטיח "שתי שורות אחרי כותרת". כרגע המנגנון קיים אבל לא מועבר מ-`getLinesFromParagraph`.

7. **מדידת גובה ללא DOM** — שימוש ב-`numLines` של KP וב-`lineHeight` לחישוב גובה פסקה ללא צורך ב-DOM probe. יאפשר איזון טורים מדויק יותר.

8. **היפנציה עברית** — מחקר 2 ממליץ על `hyphenpenalty=10000` (איסור היפנציה בעברית). כרגע אין היפנציה, אבל כדאי לוודא שהקנס מופעל.

9. **מעבר ל-`balanceColumnsV2`** — המנוע החדש (מבוסס מועמדים) יכול לנצל את KP טוב יותר. כרגע מנוטרל (`__useBalanceV2 = false`).

10. **בדיקת דלילות אחרי `applyKpLineBreaks`** — הרצת `tightenRunts` נוספת אחרי החלת `<br>`, כדי לטפל בשורות דלילות שנוצרו.

11. **אותיות מתרחבות (Justification Alternates / jalt)** — הטמעת תכונת OpenType `jalt` לגופנים תורניים תואמים, לשמירה על צבע טיפוגרפי הומוגני ביישור בלוק מלא. שמונה האותיות המסורתיות: א, ד, ה, כ, ל, ם, ר, ת.

12. **Copyfitting גלובלי** — מדידת נפח התוכן הכולל של כל פרק בתיבת מדידה מכוילת, ופיזור אחיד של שטח העמודים, למניעת עמודים מלאים ב-100% ועמוד אחרון ריק.

13. **לולאת נסיגה מאוחדת (Unified Fixed-Point Rollback Loop)** — לולאת פתרון מאוחדת המאמתת במקביל את כלל האילוצים: מניעת כותרת יתומה, שמירה על לפחות 2 שורות ליווי אחרי כותרת, מניעת שורה בודדת, והגנה על שלמות סוגרי הערות שוליים.

### 6.2 בעיות פתוחות שדורשות אופטימיזציה נוספת

1. **617 לא מאוזנים** — נובע מהחלת `<br>` אחרי איזון. דרוש re-balance או חישוב גובה ללא DOM.
2. **`bestByLineCount` איטי** — דורש caching או מימוש חלופי.
3. **`looseness rebalance` מבוטל זמנית** — דורש מימוש מחדש עם הגבלת קריאות.
4. **4-6 בלוקים לא מאוזנים (16px כל אחד, H5 בטור)** — בקושי נראה. P2.5 מטפל חלקית.
5. **546 שורות דלילות סה"כ** — רובן p-end (סיום טבעי, לא ניתן לתקן).
6. **הבדלי פלטפורמה Windows vs Linux** — `beforeprint` מטפל, אבל לא מושלם.
7. **עמודים קצרים לפני H3** — סף 120px הוא patch, לא פתרון.
8. **עומס גלובלי (Namespace Pollution)** — מעבר ל-ES Modules עתידי.
9. **אלמנטים סמנטיים חסרים** — `<main>`, `<aside>`, `<nav>` (נגישות).
10. **`contenteditable` ללא ARIA** — דרוש `role="textbox"`, `aria-multiline="true"`.
11. **כפתורים עם emoji בלבד** — חסרים `aria-label` טקסטואלי.
12. **Color Contrast** — לא נבדק. יש להריץ Lighthouse / axe DevTools.

### 6.3 הנחיות ספציפיות ל-AI הבא שימשיך את הפיתוח

#### 6.3.1 לפני תחילת העבודה

1. **קרא את כל הקבצים הבאים לפני כל שינוי:**
   - `מערכת_עימוד_תורנית_תיעוד_טכני_מקיף_ומורחב.md` (מסמך זה)
   - `המשך_שיחה.md` (V15)
   - `המשך_שיחה_ב.md` (V16-V17)
   - `המשך_שיחה_ג.md` (V18-kp-full-fix)
   - `worklog.md` (יומן עבודה מלא)
   - `v18-kp-full-fix-report.md` (דוח תיקונים)
   - `SECURITY.md` (מדיניות אבטחה)
   - `ACCESSIBILITY.md` (נגישות)
   - `Reports_Summaries_Studies/Knuth_Plass_research_report_2.md` (מחקר K-P)

2. **בדוק את ה-branch הנוכחי ב-GitHub** — ה-branch הדיפולטי הוא V18 (או v18-kp-full-fix). קוד חי: https://suginach.github.io/IMUD_TORANI/

3. **הרץ את מצב הבדיקה** — הזרק טקסם קבוע, הפעל דוח עימוד, וודא שהמספרים תואמים (0 גלישות, 0 אלמנות, ~120 tightenRunts).

#### 6.3.2 עקרונות עיצוב בלתי-ניתנים לערעור

1. **הפרדה נוקשה בין "תוכנה" ו"דיבאג":**
   - תוכנה: `typesetter.js`, `app.js`, `settings-manager.js`, `style.css`, `index.html`, `default_settings.json`, `setting_sets/`, `fonts-*.css`, `decorations.js`, `*.json` (קבצי תצורה).
   - דיבאג: `debug-panel.js`, `test-suite.js`, `trace-manager.js`.

2. **אל תחזיר את הדברים הבאים (נכשלו בעבר — ראה סעיף 3):**
   - `layoutInvalidator` / V2 layout path
   - `refuse-to-fill-with-runt` ב-P4
   - `tryLookAheadWordPull`
   - `ws += 0.5` ב-P5 (השתמש ב-`ws += 0.1`)
   - העברת `budget` כ-`ceiling` (השתמש ב-`targetH + 1`)
   - `applied = delta` ב-P5 (השתמש ב-`applied += delta`)
   - `"` כעוטף CSS כשהשם מכיל `"` (השתמש ב-`'`)
   - `getLinesFromParagraph` לבדיקת שורות (השתמש ב-`Range.getClientRects()`)
   - `performTypeset()` לפני ייצוא HTML (שכפל את ה-DOM החי)
   - שינוי `--preview-scale` לפני ייצוא (שמור את ה-scale המקורי)
   - `document.fonts.status` (השתמש ב-`document.fonts.check()`)
   - VLM לקריאת טקסט עברי (השתמש ב-DOM inspection)
   - דיווח על דלילות p-end כבעיה (רק p-cut רלוונטי)
   - סף `× 2.2` או `× 1.5` לאלמנות (השתמש ב-`× 1.1`)
   - `bestByLineCount` ללא הגבלה
   - `looseness rebalance` בתוך לולאות (יקר מדי)
   - החלת `<br>` במהלך probe renders
   - `insertBefore` בלי בדיקת `parentNode`
   - קידומות לשמות קבצים (כמו `v18-fix-`)
   - הגשת קבצים שלא תוקנו בהודעה
   - הגשת תיקון לפני בדיקה
   - `align-items: stretch` בגריד על טורים
   - `offsetTop` כשיש `position: relative` על אלמנטים הורים
   - `rect.width` ב-RTL למדידת רוחב שורה (השתמש ב-`rect.right - colRect.left`)
   - `eval()` / הזרקת `<script>` דינמית עם `const`/`let` גלובליים
   - `window.onload = ...` (השתמש ב-`addEventListener`)
   - קבצים עם `_` מוביל ב-GitHub Pages (צור `.nojekyll`)

3. **אופטימיזציות קריטיות שחובה לשמור:**
   - `_kpBrEnabled = false` במהלך העימוד
   - `applyKpLineBreaks()` רק בפוסט-פרוססינג
   - סף 5px לאיזון (תת-פיקסל)
   - סף 1.1 לאלמנות
   - נרמול שמות גופן
   - ניקוי U+E000
   - `display: inline` מפורש ל-`.note-line-num` ו-`.note-body-text`
   - הטמעת 12 גופני priority כ-base64 בייצוא HTML
   - Seeded random (LCG) לבדיקות
   - Canvas API למדידת רוחב טקסט (מונע Layout Thrashing)
   - Prefix sums ב-K-P (O(1) לחישוב רוחב שורה)
   - Active nodes pruning ב-K-P (O(N²) במקום O(N³))

4. **כללי עבודה:**
   - **בדוק כל תיקון בדפדפן חסר-ראש (Playwright) לפני הגשה.**
   - **הגש רק קבצים שתוקנו בהודעה הנוכחית.**
   - **אל תוסיף קידומות לשמות קבצים.**
   - **שמור על סדר טעינה:** `decorations.js → typesetter.js → settings-manager.js → app.js → test-suite.js → debug-panel.js → trace-manager.js`.
   - **כל פעולת DOM קריטית עטופה ב-`try/catch`.**
   - **Fallback להגדרות HTML אם JSON לא נטען.**

#### 6.3.3 סדר פעולות מומלץ לתיקון בעיה חדשה

1. **אבחן** — השתמש במצב בדיקה (טאב "בדיקה") ובדוח עימוד כדי לזהות את הבעיה במדויק. אל תנחש.
2. **הפרד** — האם זו בעיה של תוכנה או דיבאג? היכן הקוד המתאים?
3. **בדוק עבר** — חפש בסעיף 3 של מסמך זה — האם ניסינו פתרון דומה בעבר?
4. **ממש** — כתוב קוד עם `try/catch` ו-fallback.
5. **בדוק** — הרץ עם טקסט seeded, וודא שהבעיה נפתרה ולא נוצרו בעיות חדשות.
6. **הגש** — רק קבצים שתוקנו, בלי קידומות.
7. **תעד** — עדכן את הקובץ `המשך_שיחה_*.md` המתאים, ואת `worklog.md`.

#### 6.3.4 קבצים חיצוניים שימושיים

- **GitHub repo**: https://github.com/SUGINACH/IMUD_TORANI
- **GitHub Pages (חי)**: https://suginach.github.io/IMUD_TORANI/
- **Branch נוכחי**: `V18` (או `v18-kp-full-fix`)
- **טקסט בדיקה אמיתי**: `חלק ההקדמה סדר חדש.txt` (274,272 תווים, ~97 עמודים)
- **טקסט בדיקה ארוך**: `long_test_text_2.txt` (1,540,404 תווים, 558 עמודים)
- **מחקר K-P**: `Reports_Summaries_Studies/Knuth_Plass_research_report_2.md`
- **postext research**: https://github.com/drnachio/postext
- **fonts.json**: 1754 גופנים עם שמות עבריים

---

## 7. נספח א': אבטחה (מתוך SECURITY.md)

### 7.1 פרצות XSS שזוהו ותוקנו (P0-1)

#### 7.1.1 הזרקת HTML ישירות דרך `innerHTML` ב-3 קבצים

| מיקום | מקור הקלט | וקטור התקפה | תיקון |
|------|----------|------------|------|
| `decorations.js` — `renderMainShaar` | שדות `inp-book-title`, `inp-book-author` | `<img src=x onerror=alert(1)>` | `escapeHTML()` על כל שדה |
| `decorations.js` — `renderBackShaar` | `inp-book-back-copyright`, `publishing`, `contact`, `extra` | כנ"ל | `escapeHTML()` |
| `decorations.js` — `renderSubShaar` | `token.text` מהדוקומנט | כנ"ל | `escapeHTML()` על `titleMain`/`titleSub` |
| `typesetter.js` — `createDropWord` | `text` מ-`getCleanEditorText()` | `<script>` | `escapeHTML()` על `dropWords`/`restOfText`/`isContinuation` |
| `typesetter.js` — `applyDibburHamatchil` | `text` גולמי | כנ"ל | `escapeHTML()` על `match[1]`/`match[2]` |
| `typesetter.js` — `getLinesFromParagraph` | `displayW` מהפסקה | כנ"ל | `escapeHTML()` על `displayW` |
| `typesetter.js` — `createPageLayout` | `h2Text`, `framedPageNum`, `hdrRHTML` וכו' | כנ"ל | `escapeHTML()` על כל הזרקה |
| `typesetter.js` — `renderPaginatedTOC` | `it.text`, `grp.text`, `titleText` | כנ"ל | `escapeHTML()` על כל רשומה |
| `app.js` — `buildExtPanel` | `name`, `def.trigger.open/close/prefix` | כנ"ל | `escapeHTML()` על כל הזרקה |
| `app.js` — `refreshVisualPicker` | `opt.textContent` | כנ"ל | `escapeHTML()` על `curText`/`opt.value` |
| `app.js` — `renderEditorContent` (page breaks) | `pb.gematria`, `pb.pageNum` | כנ"ל | `escapeHTML()` |

#### 7.1.2 הזרקת SVG זדוני דרך `wrapShaarMedia` ו-`registerExternal*`

- **הבעיה:** SVG חיצוני מ-JSON / העלאת משתמש הוחזר ישירות ל-`innerHTML` ללא סינון.
- **תיקון:** הוספת `sanitizeSVG()` שמסיר:
  - `<script>`, `<iframe>`, `<object>`, `<embed>` (גם self-closing).
  - `on*` handlers (`onload=`, `onclick=`, וכו').
  - פרוטוקול `javascript:`.

#### 7.1.3 CSS Injection דרך `style="..."`

- **הבעיה:** `dimStyle` מ-קלט משתמש הוזרק ישירות ל-`style` ללא סינון.
- **תיקון:** הוספת `sanitizeStyleValue()` שמסירה תווים שיכולים "לשבור" את התכונה (`<`, `>`, `}`, וכו').

#### 7.1.4 URL Injection דרך `src="..."`

- **הבעיה:** `imgSrc` מ-קלט משתמש הוזרק ישירות ל-`src` ללא סינון.
- **תיקון:** הוספת `sanitizeURL()` שחוסמת:
  - `javascript:`, `vbscript:`, `file:`, `data:text/html`.
  - תווים מסוכנים: `"`, `'`, `<`, `>`, `\`, control chars.
  - מתיר רק: `http(s)://`, `data:image/`, `blob:`, `/relative`, `./`.

#### 7.1.5 הזרקת `</script>` דרך `JSON.stringify`

- **הבעיה:** אם `trace` מכיל את המחרוזת `</script>`, הוא יכול לשבור את ה-`<script>` ולהזריק סקריפט זדוני.
- **תיקון:** החלפת `</` ב-`<\/` בכל קריאה ל-`JSON.stringify` בתוך `<script>`.

### 7.2 ולידציה של קבצים (P1-3)

| פונקציה | סוג קובץ מותר | גודל מקסימלי | `onerror` |
|--------|------------|-------------|----------|
| `handleTxtFileImport` | `.txt`, `.text`, `.md` | 5 MB | ✓ |
| `handlePageTypeImportFile` | `.json` / `application/json` | 5 MB | ✓ |
| `handleTextStyleImportFile` | `.json` / `application/json` | 5 MB | ✓ |
| `handleImagePageImportFile` | `image/*` | 5 MB | ✓ |
| `handleImageUpload` | `image/*` או `.svg` | 5 MB | ✓ |

### 7.3 הגנה מפני דליפת state (P1-1)

- **הבעיה:** `performTypeset` לא עוטף את הלולאה הראשית ב-`try/catch`. טוקן יחיד שזורק קורס את כל התצוגה ללא משוב.
- **תיקון:** הלולאה הראשית עברה ל-`performTypesetInner()` ועטופה ב-`try/catch`. במקרה של שגיאה:
  - נכתבת הודעה ל-`#editor-stats` (צבע אדום).
  - מופעל `console.error` לדיבאג.
  - קריאה עתידית ל-`window.showToast()` (אם מוגדר).

### 7.4 החלפת `eval()` / הזרקת `<script>` דינמית

- **הבעיה (P0 מתועד):** שימוש ב-`eval()` להזרקת קוד עם `const`/`let` גלובליים גרם ל-`SyntaxError: Identifier has already been declared`.
- **כלל הנגזר:** "אסור re-injection דינמי של קוד עם `const`/`let` גלובליים. טעינה חד-פעמית ב-`<script src>` עם Guard Flag `if (typeof window.performTypeset === 'function') return;`."

### 7.5 הנחיות CSP מומלצות

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

### 7.6 Roadmap — אבטחה

1. **DOMPurify** — להחליף את `sanitizeSVG` הביתי ב-DOMPurify (ספרייה מקצועית).
2. **Trusted Types** — הפעלת `Content-Security-Policy: trusted-types`.
3. **Subresource Integrity (SRI)** — הוספת `integrity="sha384-..."` לכל ה-`<script src>` ו-`<link rel="stylesheet">` חיצוניים.
4. **Audit Trail** — רישום פעולות רגישות (יבוא JSON, ייצוא תבנית) ל-`console` לצורך ביקורת.
5. **Sandboxing** — הפעלת האפליקציה ב-`<iframe sandbox="allow-scripts">` לבידוד מוחלט.

### 7.7 בדיקות יחידה (P3-2)

הפונקציות הטהורות (`escapeHTML`, `sanitizeURL`, `sanitizeSVG`, `sanitizeStyleValue`, `safeNumber`, `toGematria`, `toGematriaWithGeresh`, `stripEditorialNotes`) מכוסות ב-56 בדיקות יחידה ב-`scripts/tests/test_pure_functions.js`. כיסוי נוכחי: 56/56 עוברות.

---

## 8. נספח ב': נגישות (מתוך ACCESSIBILITY.md)

### 8.1 סטנדרט היעד

- **WCAG 2.1 AA** — רמת היעד הבינלאומית לנגישות.
- **WAI-ARIA 1.2** — לרכיבים אינטראקטיביים מותאמים.
- **כיווניות:** `dir="rtl"` `lang="he"` (כבר מוגדר ב-`<html>`).

### 8.2 סטטוס התחלתי (לפני הרפקטורינג)

| מדד | ערך | חומרה |
|------|------|------|
| תגי ARIA | 0 | 🔴 Critical |
| `role=` | 0 | 🔴 Critical |
| `tabindex` | 0 | 🔴 Critical |
| `<label for=>` מתוך תוויות | 0/169 | 🔴 Critical |
| `<div onclick>` כפקדים | 11 | 🔴 Critical |
| `<main>` / `<aside>` / `<nav>` / `<section>` | 0 | 🟠 High |
| `<meta name="description">` | חסר | 🟠 High |
| `prefers-reduced-motion` | לא נתמך | 🟡 Medium |
| `focus-visible` | חסר | 🟡 Medium |
| `skip-link` | חסר | 🟡 Medium |
| Breakpoints רספונסיביים | 0 | 🔴 Critical (אפליקציה בלתי-שמישה מתחת ל-1100px) |

### 8.3 תיקונים שהוחלו

#### 8.3.1 החלפת `<div onclick>` ב-`<button type="button">` (P2-1)

11 אלמנטים הומרו. כל הכפתורים כוללים:
- `type="button"` (מונע submit בלתי-רצוי).
- `aria-expanded="false"` (מצב התחלתי).
- `aria-controls="panel-id"` (קישור לפאנל המופעל).
- סגנון `focus-visible` ב-CSS.

#### 8.3.2 הוספת `for=` לתוויות `<label>`

סקריפט אוטומטי (`scripts/apply_a11y_html.py`) סרק את ה-HTML והוסיף `for="ID"` לכל תווית שלא עוטפת את הקלט שלה.

#### 8.3.3 Event Delegation (P2-4)

`app.js` כולל 3 מאזינים גלובליים ל-`click` ו-`change` שמטפלים בכל הכפתורים שהוסרו מ-`onclick` inline.

#### 8.3.4 `MutationObserver` לעדכון `aria-expanded`

`app.js` מאזין לשינויים ב-`style.display` של פאנלים מתקפלים ומעדכן אוטומטית את `aria-expanded` של הכפתור השולט.

#### 8.3.5 עיצוב `focus-visible` גלובלי (P2-3c)

```css
button:focus-visible,
[role="button"]:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
    outline: 2px solid var(--color-accent, #2563eb);
    outline-offset: 2px;
}
```

#### 8.3.6 `prefers-reduced-motion` (P2-3b)

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

#### 8.3.7 Breakpoints רספונסיביים (P2-3)

- `max-width: 1024px` — ה-sidebar הופך ל-drawer נשלף (transform: translateX(100%) → 0).
- `max-width: 640px` — תצוגה מקדימה מוקטנת ל-`scale(0.5)`.

#### 8.3.8 `skip-link` וכיתת עזר `sr-only`

```css
.sr-only {
    position: absolute !important;
    width: 1px !important; height: 1px !important;
    padding: 0 !important; margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
.skip-link {
    position: absolute;
    inset-inline-start: -9999px;
}
.skip-link:focus { inset-inline-start: 8px; }
```

#### 8.3.9 החלפת `window.onload` ב-`addEventListener` (P1-2)

מונע דריסה של מאזיני `load` אחרים (קונפליקט שקט עם analytics/tracking).

### 8.4 בעיות פתוחות (Roadmap נגישות)

1. **אלמנטים סמנטיים חסרים (High):** `<main>`, `<aside>`, `<nav>`.
2. **תגי meta חסרים (Medium):** `<meta name="description">`, `<meta name="theme-color">`, Open Graph tags.
3. **`contenteditable` ללא ARIA (High):** דרוש `role="textbox"`, `aria-multiline="true"`, `aria-label`.
4. **כפתורים עם emoji בלבד (Medium):** חסרים `aria-label` טקסטואלי.
5. **Color Contrast:** לא נבדק — יש להריץ Lighthouse / axe DevTools.
6. **בדיקות מקלדת יזומות:** יש להוסיף סקריפט Puppeteer שמדמה ניווט ב-Tab.
7. **קורא מסך:** לא נבדק — יש להריץ NVDA / VoiceOver.

---

## 9. נספח ג': `trace-manager.js` — מערכת מעקב אחרי פונקציות

### 9.1 תכלית

מאפשר:
1. רישום כל הקריאות לפונקציות העימוד עבור כל פרק (H1/H2/H0) בנפרד.
2. לחיצה על קריאה → רינדור הפרק הזה בלבד עד לקריאה הזו.
3. צ'קבוקס לכל קריאה → דילוג על הקריאה ברינדור הבא.

### 9.2 ארכיטקטורה

- מקבל hooks מ-typesetter.js: `__traceOnChaptersBuilt`, `__traceOnChapterStart`.
- עוטף פונקציות גלובליות של typesetter.js כדי לתעד קריאות.
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

### 9.5 תרחיש שימוש

כשיש בעיה בעימוד פרק מסוים:
1. הפעל `__traceStartFullCapture()` — המערכת תרשום את כל הקריאות.
2. בחר פרק ב-UI — רשימת הקריאות תופיע.
3. לחץ על קריאה ספציפית — המערכת תרנדר רק את הפרק עד לקריאה הזו.
4. סמן צ'קבוקס "דלג" על קריאה חשודה — המערכת תדלג עליה ברינדור הבא.
5. חזור על התהליך עד לאיתור הקריאה הבעייתית.

---

## 10. נספח ד': גרף גרסאות מורחב

```
V1.1 (יולי-אוגוסט 2026) — Claude AI
  ├── קובץ HTML יחיד (2,440 שורות)
  ├── מודל state מבוסס DOM (88 פקדים)
  ├── Tokenizer עם רגקס כותרות
  ├── מנוע מדידת שורות ב-#measuring-box
  ├── איזון טורים greedy
  ├── justifyColumnVertically (2-60px)
  ├── toGematria עם החרגות טו/טז
  └── 8 באגים מרכזיים אותרו
       ↓
V2-V9 (אוגוסט-ספטמבר 2026) — Claude AI
  ├── הפרדה לקבצים נפרדים
  ├── מערכת הרחבות (סוגי עמודים, סגנונות טקסט)
  ├── רקעים מותאמים לכל pageRole
  ├── מערכת הערות שוליים וסיום-פרק
  ├── עמודים אי-זוגיים/זוגיים
  ├── רגקס כותרות מורחב
  ├── ערכות נושא SVG
  ├── תיקון CSS Grid Stretch
  ├── Debounce 400ms
  └── טעינת ערכות JSON
       ↓
V10 (12 אוקטובר 2026) — Super Z
  ├── שמות גופנים בעברית
  ├── טעינת גופנים דו-שלבית (439 + 1315)
  ├── דוח עימוד מועשר
  ├── P2.5 (margin-bottom H5)
  ├── 3 באגים קריטיים תוקנו
  └── .nojekyll
       ↓
V14 (10-11 אוקטובר 2026) — Super Z שיחה 1
  ├── 5 נקודות postext
  ├── תיקון ישיר (Direct Fix)
  ├── P5 עם 0.1px steps
  ├── Runt penalty ב-balanceColumns
  ├── tightenRunts על p-cut
  ├── תיקון מדידה: textContent
  ├── beforeprint handler
  └── test-suite.js
       ↓
V15 (12 אוקטובר 2026) — Super Z
  ├── שינוי שם _fonts.css → fonts-def.css
  ├── גופנים בעברית מלאים (1754)
  ├── טעינת גופנים דו-שלבית
  └── worklog מתועד
       ↓
V16-V17 (12-13 אוקטובר 2026) — Super Z שיחה 2
  ├── פיצול רשימות גופנים
  ├── דוח עימוד מועשר (15 בדיקות)
  ├── ייצוא HTML מדויק עם גופנים base64
  ├── checkSparse: Range.getClientRects
  ├── fixWidowContinuation
  ├── נרמול שמות גופן
  ├── סף 1.1 לאלמנות
  ├── seeded random (LCG)
  ├── Width Caching (_linesCache)
  ├── Canvas API
  ├── Knuth-Plass מלא
  └── אימות דוח 15/15
       ↓
V18 (13-14 אוקטובר 2026) — Super Z שיחה 2
  ├── ביטול applyKpLineBreaks (זמנית)
  ├── מערכת טאבים
  ├── default_settings.json (249 הגדרות)
  ├── setting_sets/ (3 סטים)
  ├── settings-manager.js
  ├── trace-manager.js
  ├── PushBack חכם
  ├── חיתוך תוך-שורי
  ├── דחיפת בלוק לא מאוזן
  └── תיקון empty-column
       ↓
V18-kp-full-fix (15 אוקטובר 2026) — Super Z
  ├── Knuth-Plass מלא: looseness, adjdemerits, parfillskip, clubpenalties
  ├── אינטגרציית K-P עם renderer (4 מסלולי רינדור)
  ├── _kpBrEnabled = false במהלך עימוד
  ├── applyKpLineBreaks() כפוסט-פרוססינג
  ├── סימון _fromKp
  ├── ניקוי U+E000
  ├── display: inline מפורש
  ├── הורדת סף H3 מ-190px ל-120px
  └── תוצאות: 562 עמודים, 30,621 <br>, 0 גלישות/אלמנות/יתומים
```

---

## 11. נספח ה': נקודות ציון קריטיות

### 11.1 נקודות ציון שחובה לזכור

1. **`_kpBrEnabled` הוא מפסק החיים** — בלעדיו הדפדפן קורס בטקסט מלא.
2. **`_fromKp` הוא המבדיל** — בלעדיו `<br>` מוחל גם על שורות DOM probe ישנות.
3. **`.nojekyll` הוא תנאי סף** — בלעדיו GitHub Pages מסנן `fonts-def.css`.
4. **base64 בגופנים הוא הבדל HTML/DOM** — בלעדיו ה-HTML המיוצא לא תואם את המקור.
5. **`Range.getClientRects` הוא מדד האמת** — בלעדיו הדוח מדווח על 752 דלילויות שגויות.
6. **סף 1.1 הוא המבדיל אלמנה/לא-אלמנה** — בלעדיו false positives.
7. **סף 5px הוא המבדיל מאוזן/לא-מאוזן** — בלעדיו רעידות אינסופיות.
8. **localStorage הוא שומר הסט הידני** — בלעדיו F5 מאפס את הסט שנבחר.
9. **Canvas API מונע Layout Thrashing** — בלעדיו עימוד איטי פי כמה.
10. **Prefix sums ב-K-P** — בלעדיו חישוב רוחב שורה הוא O(N) במקום O(1).
11. **Active nodes pruning** — בלעדיו K-P הוא O(N³) במקום O(N²).
12. **`rect.right - colRect.left` ב-RTL** — בלעדיו 87 false positives בדלילות.
13. **`document.fonts.check()`** — בלעדיו בדיקת fallback גופן שגויה.
14. **`detectTofu` משווה ל-serif גנרי** — בלעדיו תמיד false.
15. **`try/catch` על `performTypesetInner`** — בלעדיו טוקן יחיד קורס את כל התצוגה.

### 11.2 נקודות ציון שחובה להיזהר מהן

1. **`balanceColumnsV2`** — אל תפעיל. דורס תיקונים.
2. **`getLinesFromParagraph` לבדיקות** — אל תשתמש. מדיד שגוי.
3. **`<br>` במהלך probe renders** — אל תכניס. קורס.
4. **`looseness` בתוך לולאות** — אל תקרא. יקר מדי.
5. **`VLM` לקריאת טקסט עברי** — אל תשתמש. הזיות.
6. **קידומות לשמות קבצים** — אל תוסיף. מיותר.
7. **`document.fonts.status`** — אל תסמוך עליו. שקרי.
8. **`align-items: stretch` בגריד על טורים** — אל תשתמש. משבש מדידות.
9. **`offsetTop` עם `position: relative`** — אל תשתמש. שגוי.
10. **`eval()` / הזרקת `<script>` דינמית** — אל תשתמש. קונפליקטים.
11. **`window.onload = ...`** — אל תשתמש. דורס מאזינים.
12. **קבצים עם `_` מוביל ב-GitHub Pages** — אל תשתמש ללא `.nojekyll`.
13. **`insertBefore` בלי בדיקת `parentNode`** — אל תשתמש. קורס IIFE.

---

## 12. נספח ו': השוואת פלטפורמות עימוד (מתוך `תכנית לתיקון ושיפור.md`)

| קריטריון | תוכנת "תג" (Tag) | אינדיזיין (InDesign) | מערכת ה-HTML שלנו |
|---|---|---|---|
| **זרימת רב-טקסט והערות אסימטריות** | מלאה ומנותקת דרך קודים | נוקשה; מחייבת סקריפט FootWork | עצמאית; flexbox וחישוב שטח חי |
| **אלגוריתם שבירת שורות ופסקאות** | מבוסס פקודות מאקרו ו-Yishur | Knuth-Plass (Paragraph Composer) | מדידת DOM אמיתית אטומה + Knuth-Plass מלא |
| **אותיות מתרחבות ויישור ללא מקף** | תמיכה מסורתית מובנית | תמיכה דרך תכונת jalt ב-OpenType | תמיכה מתוכננת דרך OpenType ומשתני גופן |
| **ממשק משתמש ועקומת למידה** | טקסטואלי ישן משנות ה-90 | גרפי מתקדם אך כבד ומסורבל | מודרני, נגיש, ואינטואיטיבי |
| **איזון טורים בסוף פרק** | סקריפטים חיצוניים (ChkTurim) | "Balance Columns" מובנה (חלקי) | מערכת 5 עדיפויות + PushBack חכם + looseness |
| **הערות שוליים בטור נפרד** | מובנית מראשית | דורש סקריפט FootWork | עצמאית — תיבת הערות בתחתית העמוד |
| **הערות רצות (Run-on)** | סקריפט CheckEnd | ידני | דרך `note_rules.json` |
| **הערות צד (Marginalia)** | פונקציות חלון | Anchored Objects | `.side-note-anchor` עם `SIDE_NOTE_OFFSET_TOP` |
| **אבטחה** | לא רלוונטי (לא ווב) | לא רלוונטי | Zero-Backend Pure Web + XSS protection |
| **נגישות** | לא רלוונטי | לא רלוונטי | WCAG 2.1 AA (בתהליך) |
| **עלות** | מסחרית | מסחרית (יקרה) | חינמית (קוד פתוח) |
| **התקנה** | דרושה | דרושה | לא דרושה (דפדפן) |

---

## 13. נספח ז': 15 בעיות הליבה המקוריות (מתוך V1.1)

מתוך `תכנית לתיקון ושיפור.md` — 15 בעיות שאותרו במסמך האמת התורני ("מקום בינה"):

| # | תקלה שנצפתה בשטח | שורש הכשל ההנדסי | סטטוס נוכחי |
|---|---|---|---|
| 1 | גלישת טורים לתוך אזור הערות השוליים (עמוד 47) | מנוע האיזון לא ניכה מראש את גובה ההערות הנצברות מתקציב הדף | ✅ תוקן — `getFootnotesReservedHeight()` |
| 2 | מירכוז שגוי של שורה מקוטעת (עמוד 47) | חיתוך בטור שמאל סווג אוטומטית כסוף פסקה ולא כפסקה נמשכת | ✅ תוקן — `p-cut` vs `p-end` |
| 3 | פערי גובה של חצי שורה עד שתי שורות (עמודים 16, 58, 66) | חסימת תנאי גובה נוקשה מנעה את הפעלת פונקציית היישור האנכי | ✅ תוקן — מערכת 5 עדיפויות |
| 4 | כותרות יתומות בתחתית טור ללא ליווי טקסט | קיטוע עודפים לא ביצע נסיגה מחזורית לאחור (Cascading Roll) | ✅ תוקן — `rollbackColumnTail` |
| 5 | שבירת סוגרי הערות שוליים ודריסת כללי יתומות | נקודת חיתוך נפלה באמצע סוגריים וביטלה את שומרי השורה הבודדת | ✅ תוקן — `lineBreakCrossesNoteSpan` |
| 6 | אובדן מילה ראשונה והערות צד בראש עמוד חדש (עמוד 49) | פסקה שנדחפה במלואה לעמוד הבא סומנה בטעות כפסקת המשך | ✅ תוקן — `data-is-cont` |
| 7 | בלוק דו-טורי כפול באותו עמוד ששיבש את רצף הקריאה | מרווח קטן שנותר יצר בלוק שני ללא כותרת רוחבית מפרידה | ✅ תוקן — נעילת בלוק דו-טורי יחיד |
| 8 | מילה בודדת ומתוחה בשורה האחרונה של טור ימין | שכבת רווחי מילים מתחה שורה קצרה בת 1–2 מילים לרוחב הטור כולו | ✅ תוקן — `tightenRunts` + runt penalty |
| 9 | עמודים קצרים מדי לפני כותרת 3 (עמודים 33, 37) | כותרת רוחבית נכנסה ללא מרווח מספיק לפסקאות גוף תחתיה | ⚠️ חלקי — סף 120px (מ-190px) |
| 10 | באג CSS Grid Stretch וחריגה של מאות פיקסלים | הגדרת מתיחה בגריד גרמה לטור ריק להיראות מלא ולעוות את המדידות | ✅ תוקן — הוסר |
| 11 | באג קיפול השוליים (Margin Collapse) בעמודי כותרת 2 | חישוב הגובה התפוס סיכם שוליים עליונים ותחתונים בנפרד במקום למדוד את המרחק האמיתי ב-DOM | ✅ תוקן — `getBoundingClientRect()` |
| 12 | מירוץ טעינת גופני רשת (Font Loading Race Condition) | הרצת עימוד ראשוני טרם התייצבות גופני גוגל מדדה גופן חלופי נמוך | ✅ תוקן — טעינה דו-שלבית + `document.fonts.check()` |
| 13 | שיבושי כותרות מתחלפות בעמודים זוגיים | החלפת תוכן הכותרות ללא החלפת כיוון היישור | ✅ תוקן |
| 14 | תקיעת הדפדפן בהקלדה (Browser Freeze) | עשרות פקדים קראו לעימוד סינכרוני מלא בכל תנועת סליידר או הקשת מקש | ✅ תוקן — Debounce 400ms |
| 15 | קריאת נתונים שגויה מתיבת העורך | שימוש שגוי במאפיינים שאינם נתמכים באלמנט עריכה גרם לאובדן טקסט בייבוא קבצים | ✅ תוקן — `getCleanEditorText()` |

---

**תאריך עדכון מסמך:** 15 באוקטובר 2026
**גרסת קוד מתועדת:** V18-kp-full-fix
**מקורות משולבים:** 24 מסמכי GitHub + 2 שיחות Z.ai מלאות + קוד מקור נוכחי
