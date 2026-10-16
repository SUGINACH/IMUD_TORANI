# מדיניות אבטחה — מערכת עימוד תורנית

מסמך זה מתעד את מודל האבטחה של מערכת העימוד, הפרצות שזוהו, והתיקונים שהוחלו (P0–P3).

---

## 1. מודל ארכיטקטורת האבטחה

המערכת פועלת בארכיטקטורת **Zero-Backend Pure Web**:

- אין שרת עיבוד; כל המידע נשאר בזיכרון ה-RAM של דפדפן המשתמש.
- ה-HTML נטען מ-`file:///` או מ-`blob:` כשמשתמש מוריד תבנית.
- אין שקיפות של נתונים לרשת חיצונית; יוצאים רק על-ידי `window.print()` (PDF) או ייצוא JSON יזום.

### יתרונות אבטחה
- **אין SSRF / RCE** — אין שרת שיכול לקבל בקשות זדוניות.
- **אין חשיפת מסמכים סודיים** — הכל נשמר בלקוח.
- **CORS Sandbox** — חסימת `fetch()` ב-`file:///` מגנה מפני גישה לא רצויה לקבצים מקומיים.

---

## 2. פרצות XSS שזוהו ותוקנו (P0-1)

### 2.1 הזרקת HTML ישירות דרך `innerHTML` ב-3 קבצים

| מיקום | מקור הקלט | וקטור התקפה | תיקון |
|------|----------|------------|------|
| `decorations.js` — `renderMainShaar` | שדות `inp-book-title`, `inp-book-author` | `<img src=x onerror=alert(1)>` | `escapeHTML()` על כל שדה |
| `decorations.js` — `renderBackShaar` | `inp-book-back-copyright`, `publishing`, `contact`, `extra` | כנ"ל | `escapeHTML()` |
| `decorations.js` — `renderSubShaar` | `token.text` מהדוקומנט | כנ"ל | `escapeHTML()` על `titleMain`/`titleSub` |
| `typesetter.js` — `createDropWord` | `text` מ-`getCleanEditorText()` | `<script>` | `escapeHTML()` על `dropWords`/`restOfText`/`isContinuation` |
| `typesetter.js` — `applyDibburHamatchil` | `text` גולמי | כנ"ל | `escapeHTML()` על `match[1]`/`match[2]` (למעט אם הקלט כבר HTML) |
| `typesetter.js` — `getLinesFromParagraph` | `displayW` מהפסקה | כנ"ל | `escapeHTML()` על `displayW` |
| `typesetter.js` — `createPageLayout` | `h2Text`, `framedPageNum`, `hdrRHTML` וכו' | כנ"ל | `escapeHTML()` על כל הזרקה |
| `typesetter.js` — `renderPaginatedTOC` | `it.text`, `grp.text`, `titleText` | כנ"ל | `escapeHTML()` על כל רשומה |
| `app.js` — `buildExtPanel` | `name`, `def.trigger.open/close/prefix` | כנ"ל | `escapeHTML()` על כל הזרקה |
| `app.js` — `refreshVisualPicker` | `opt.textContent` | כנ"ל | `escapeHTML()` על `curText`/`opt.value` |
| `app.js` — `renderEditorContent` (page breaks) | `pb.gematria`, `pb.pageNum` | כנ"ל | `escapeHTML()` |

### 2.2 הזרקת SVG זדוני דרך `wrapShaarMedia` ו-`registerExternal*`

- **הבעיה:** SVG חיצוני מ-JSON / העלאת משתמש הוחזר ישירות ל-`innerHTML` ללא סינון.
- **תיקון:** הוספת `sanitizeSVG()` שמסיר:
  - `<script>`, `<iframe>`, `<object>`, `<embed>` (גם self-closing).
  - `on*` handlers (`onload=`, `onclick=`, וכו').
  - פרוטוקול `javascript:`.
- **שימוש:** `sanitizeSVG()` מופעלת בעת רישום נכס חיצוני (`registerExternalShaarAsset`, `registerExternalAllOrnament`, `registerOrnamentsLR`, `registerOrnamentsUD`) ובעת הזרקה דרך `wrapShaarMedia`.

### 2.3 CSS Injection דרך `style="..."`

- **הבעיה:** `dimStyle` מ-קלט משתמש הוזרק ישירות ל-`style` ללא סינון.
- **תיקון:** הוספת `sanitizeStyleValue()` שמסירה תווים שיכולים "לשבור" את התכונה (`<`, `>`, `}`, וכו').
- **שימוש:** ב-`getSectionDividerHTML`, `getHeadingOrnamentHTML`, `renderSideOrnamentHTML`, `render*Shaar`.

### 2.4 URL Injection דרך `src="..."`

- **הבעיה:** `imgSrc` מ-קלט משתמש הוזרק ישירות ל-`src` ללא סינון.
- **תיקון:** הוספת `sanitizeURL()` שחוסמת:
  - `javascript:`, `vbscript:`, `file:`, `data:text/html`.
  - תווים מסוכנים: `"`, `'`, `<`, `>`, `\`, control chars.
  - מתיר רק: `http(s)://`, `data:image/`, `blob:`, `/relative`, `./`.
- **שימוש:** ב-`wrapShaarMedia`, `renderHeaderSectionHTML` (custom_img), `getSectionDividerHTML`, `getHeadingOrnamentHTML`, `renderSideOrnamentHTML`, `customTheme.*.svgData`, `getContentBgCSS`, `renderImportedPage`.

### 2.5 הזרקת `</script>` דרך `JSON.stringify` ב-`exportPageDebugReport`

- **הבעיה:** אם `trace` מכיל את המחרוזת `</script>`, הוא יכול לשבור את ה-`<script>` ולהזריק סקריפט זדוני.
- **תיקון:** החלפת `</` ב-`<\/` בכל קריאה ל-`JSON.stringify` בתוך `<script>`.

---

## 3. ולידציה של קבצים (P1-3)

### 3.1 הגבלות גודל וסוג

| פונקציה | סוג קובץ מותר | גודל מקסימלי | `onerror` |
|--------|------------|-------------|----------|
| `handleTxtFileImport` | `.txt`, `.text`, `.md` | 5 MB | ✓ |
| `handlePageTypeImportFile` | `.json` / `application/json` | 5 MB | ✓ |
| `handleTextStyleImportFile` | `.json` / `application/json` | 5 MB | ✓ |
| `handleImagePageImportFile` | `image/*` | 5 MB | ✓ |
| `handleImageUpload` | `image/*` או `.svg` | 5 MB | ✓ |

### 3.2 סניטציית SVG בעת העלאה

`handleImageUpload` מפעיל `sanitizeSVG()` על קבצי SVG לפני המרה ל-`data:` URL.

---

## 4. הגנה מפני דליפת state (P1-1)

- **הבעיה:** `performTypeset` לא עוטף את הלולאה הראשית ב-`try/catch`. טוקן יחיד שזורק קורס את כל התצוגה ללא משוב.
- **תיקון:** הלולאה הראשית עברה ל-`performTypesetInner()` ועטופה ב-`try/catch`. במקרה של שגיאה:
  - נכתבת הודעה ל-`#editor-stats` (צבע אדום).
  - מופעל `console.error` לדיבאג.
  - קריאה עתידית ל-`window.showToast()` (אם מוגדר) להודעה לא-חוסמת.

---

## 5. החלפת `eval()` / הזרקת `<script>` דינמית

- **הבעיה (P0 מתועד):** שימוש ב-`eval()` להזרקת קוד עם `const`/`let` גלובליים גרם ל-`SyntaxError: Identifier has already been declared`.
- **כלל הנגזר:** "אסור re-injection דינמי של קוד עם `const`/`let` גלובליים. טעינה חד-פעמית ב-`<script src>` עם Guard Flag `if (typeof window.performTypeset === 'function') return;`."

---

## 6. עומס גלובלי (Namespace Pollution)

### 6.1 גלובלים נוכחיים (לאחר רפקטורינג)

| קובץ | גלובלים | סטטוס |
|------|---------|------|
| `decorations.js` | `CBG_TEXTURE_SVG`, `EXTERNAL_SHAAR_ASSETS`, `ORNAMENTS_LR`, `ORNAMENTS_UD`, `EXTERNAL_ALL_ORNAMENTS`, `BUILTIN_SHAAR_THEMES`, `HEADER_ORNAMENTS`, `SECTION_DIVIDERS`, `NOTE_RULE_GLYPHS`, `escapeHTML`, `sanitizeURL`, `sanitizeSVG`, `sanitizeStyleValue`, `safeNumber`, `sanitizeSVG`, `wrapShaarMedia`, `resolveShaarBoxStyle`, `splitTextInHalf`, `renderHeaderSectionHTML`, `getSectionDividerHTML`, `getHeadingOrnamentHTML`, `renderSideOrnamentHTML`, `buildShaarFooterHTML`, `resolveShaarBackground`, `registerExternal*` (×6), `renderMainShaar`, `renderBackShaar`, `renderSubShaar`, `getContentBgCSS`, `applyContentBg` | ידוע |
| `typesetter.js` | `noteCounters`, `noteUidCounter`, `footnoteQueueForPage`, `endnoteQueueForPart`, `lineToTokenMap`, `globalTokens`, `typesetTimer`, `window.__pageDebugStore`, `window.exportPageDebugReport`, `toGematria`, `toGematriaWithGeresh`, `stripEditorialNotes`, `formatPageNumberDisplay`, `getLinesFromParagraph`, `applyDibburHamatchil`, `createDropWord`, `parseMetadataFromText`, `createPageLayout`, `renderPaginatedTOC`, `performTypeset`, `performTypesetInner`, `typesetDocument`, `updateGrid`, `updateStyles`, `getBlockColumnBudget`, `balanceColumns`, `distributeColumnJustification`, `rollbackColumnTail`, `finalizeNotePositions`, `applyDelimiterStyles`, `measureFootnoteAreaReserve`, `getFootnotesReservedHeight`, `adjustFitLineForNoteSpans`, `refineParagraphFitLine`, `lineBreakCharIndex`, `lineBreakCrossesNoteSpan`, `postRenderColumnAuditAndReconcile`, `enforceBlockColumnsWithinCeiling`, `stripOneColumnJustifyLayer`, `measureColScrollDelta`, `isInlineHeadingLevel3456`, `queryInlineHeadingLevels`, `canHeadingFitWithBody`, `resetColumnJustificationStyles`, `getColumnContentBottom`, `measureMaxFitLines`, `renderParagraphProbe` ועוד | **בעיה פתוחה — ראה Roadmap** |
| `app.js` | `customThemes`, `importedPageTypes`, `importedTextStyles`, `importedImagePages`, `extImportCounter`, `nextSyntheticLevel`, `resizer`, `sidebar`, `editorElem`, `shaarBoxSavedPositions`, `loadedShaarItems`, `EXT_ANCHOR_OPTIONS`, `VISUAL_PICKER_TARGETS`, `DEFAULT_HEBREW_FONTS_LIST` ועוד | **בעיה פתוחה — ראה Roadmap** |

### 6.2 המלצה עתידית

- מעבר ל-**ES Modules** — כל מודול ייצא את ה-API שלו דרך `export`.
- שימוש ב-`<script type="module">` ב-HTML.
- אריזת ה-state הגלובלי של `typesetter.js` באובייקט `typesetState` שמועבר כפרמטר.

---

## 7. הנחיות CSP מומלצות

לאחר הרפקטורינג, אפשר להפעיל מדיניות CSP מחמירה:

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

> **אבקה:** הוסרו 11 מאפייני `onclick` inline מ-HTML (P2-1) ועוד ~5 מאפיינים מ-`app.js`/`typesetter.js`. נותרו כ-14 `onclick` על `<button>` (תקין — לא דורש `unsafe-inline`).

---

## 8. Roadmap — אבטחה

1. **DOMPurify** — להחליף את `sanitizeSVG` הביתי ב-DOMPurify (ספרייה מקצועית). גרסה מקומית נטענת כ-`<script src="dompurify.min.js">`.
2. **Trusted Types** — הפעלת `Content-Security-Policy: trusted-types` למניעת הזרקת HTML מקוד.
3. **Subresource Integrity (SRI)** — הוספת `integrity="sha384-..."` לכל ה-`<script src>` ו-`<link rel="stylesheet">` חיצוניים.
4. **Audit Trail** — רישום פעולות רגישות (יבוא JSON, ייצוא תבנית) ל-`console` לצורך ביקורת.
5. **Sandboxing** — הפעלת האפליקציה ב-`<iframe sandbox="allow-scripts">` לבידוד מוחלט מ-iframe-ים אחים.

---

## 9. בדיקות יחידה (P3-2)

הפונקציות הטהורות (`escapeHTML`, `sanitizeURL`, `sanitizeSVG`, `sanitizeStyleValue`, `safeNumber`, `toGematria`, `toGematriaWithGeresh`, `stripEditorialNotes`) מכוסות ב-56 בדיקות יחידה ב-`scripts/tests/test_pure_functions.js`. הרצה:

```bash
node scripts/tests/test_pure_functions.js
```

כיסוי נוכחי: 56/56 עוברות. מומלץ להרחיב ל-`getLinesFromParagraph` ו-`balanceColumns` בעתיד (דורשות mock מלא של DOM).

---

**תאריך עדכון:** 2026-10-06
**סטטוס:** P0–P3 הושלמו לפי תכנית מפת הדרכים.
