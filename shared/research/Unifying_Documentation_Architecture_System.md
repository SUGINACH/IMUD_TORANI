---
title: "איחוד ותיעוד ארכיטקטורת המערכת"
date: 2026-10-06
version: V21
type: transcripts
source: Gemini (Google AI Studio)
---


# איחוד ותיעוד ארכיטקטורת המערכת

> שיחת Google AI Studio (Gemini) — מודל: `models/gemini-3.8-flash`

---

## פנייה 1: [קובץ מצורף מ-Google Drive — מזהה: 1HYDuX3mObnu-iD5MjFqpEsdNYUZBMHS]

[קובץ מצורף מ-Google Drive — מזהה: 1HYDuX3mObnu-iD5MjFqpEsd_NYUZBMHS]

---

## פנייה 2: אתה משמש כרגע כארכיטקט תוכנה ראשי ומומחה לייעול ותיעוד מערכות (Technical Lead &…

אתה משמש כרגע כארכיטקט תוכנה ראשי ומומחה לייעול ותיעוד מערכות (Technical Lead & Documentation Architect).

להלן מספר מסמכי סיכום של שיחות פיתוח, שנכתבו בשלבים שונים של הפרויקט וכחלק מגרסאות שונות של המערכת. 

תפקידך הוא לבצע מיזוג ואיחוד מלא (Consolidation) של כל המסמכים למסמך ארכיטקטוני אחד מפורט, מקיף ומעודכן, ללא איבוד של אף פריט מידע טכני, ניסיון שנכשל או מקרה קצה שנבדק.

### הנחיות מיוחדות למיזוג:
1. זיהוי והכרעה בגרסאות: אם קיימות סתירות בין הסיכומים (למשל: אלגוריתם שהוצע בסיכום מוקדם והוחלף בסיכום מאוחר יותר) — התייחס לגרסה המאוחרת והעדכנית ביותר כפתרון הנכון, אך העבר את ההצעה הישנה לפרק "יומן כישלונות וגישות שנפסלו" תוך נימוק מדוע היא הוחלפה.
2. מניעת כפילויות: אל תציג מידע כפול, אלא מזג סעיפים מקבילים למבנה אחוד אחד.
3. שמירה על עומק טכני: שמור על קטעי הקוד המלאים והסופיים (Production-Ready Code Snippets), מבני הנתונים והחישובים המדויקים.

אנא בנה את המסמך המאוחד במבנה המובנה הבא:

### 1. תמונת מצב וארכיטקטורה מעודכנת (Consolidated Architecture)
- הגדרת המערכת, מטרותיה והטכנולוגיות שנבחרו לשימוש בגרסה הסופית.
- Architectural Patterns, הפרדת אחריות, ניהול זיכרון ותהליכים (Threading/Async).

### 2. פירוט המודולים והאלגוריתמים המאוחד (Detailed Master Modules)
- ריכוז כל המנגנונים והרכיבים שפותחו בכל הטיעונים/הסיכומים.
- עבור כל מודול: לוגיקה עסקית, מבני נתונים (Data Schemas), חישובים וקשרים בין הרכיבים.

### 3. יומן כישלונות, היסטוריית החלטות וניסיונות שנפסלו (Consolidated Failed Approaches & Decision Log)
- ריכוז מלא של כל הניסיונות שנכשלו, הרעיונות שנפסלו והגרסאות הישנות שהוחלפו לאורך כל השיחות.
- עבור כל ניסיון: מה היתה ההצעה, באיזה מקרה קצה/בדיקה היא נכשלה, ומדוע אסור לחזור אליה.

### 4. בסיס הקוד הנוכחי והמוסכם (Current Complete Codebase)
- מפת המחלקות (Classes), הממשקים והפונקציות המעודכנים.
- קטעי הקוד המלאים והסופיים שנבנו (ללא קיצורים או placeholders), כולל טיפול בשגיאות ואימות קלטים.

### 5. מקרי קצה, אבטחה וביצועים (Master Edge Cases & Constraints)
- רשימה מקיפה של כל מקרי הקצה והתרחישים החריגים שעלו בכל הסיכומים וכיצד המערכת מטפלת בהם.
- היבטי אבטחה, יעילות סיבוכיות (Time/Space Complexity) וביצועים.

### 6. תוכנית עבודה והצעדים הבאים (Master Roadmap)
- משימות פתוחות (TODOs), אופטימיזציות נדרשות והנחיות להמשך הפיתוח.

---
הנה מסמכי הסיכום המקוריים לאיחוד:

---

### 🤖 תגובה 1: Defining the Core Need I'm now focused on clarifying the ultimate objective: a…

**Defining the Core Need**

I'm now focused on clarifying the ultimate objective: a comprehensive, unified document—a "Single Source of Truth"—that synthesizes all prior summaries and iterations. The user's need for a fully consolidated architectural and engineering document is driving my approach.


**Synthesizing the Components**

I'm now diving deep into the individual source documents. I need to synthesize these distinct components into a cohesive, high-quality master specification document. This is challenging because the documents cover distinct tech stacks, and I need to ensure a production-grade level of technical accuracy with no omissions. I need to capture edge cases, code snippets, and even failed approaches in the final documentation.


**Detailing the Technical Elements**

I'm now integrating the intricacies revealed in Documents 4, 5, and 6. I'm prioritizing edge-case handling, like those specific Hebrew numbering forms. I'm focusing on preserving endnote data and ensuring seamless handling of web-based file separations and the challenges of the Offscreen DOM. Also, my focus is on preserving responsive auto-zoom and visual card pickers. I'm also capturing the nuance in editorial notes and interactive tools that were added.


**Integrating Technical Details**

I'm now focusing on integrating the technical specifications from Documents 7, 8, and 9. I'm prioritizing the implementation details of the vertical gutter rule adjustments, handling header ornaments with `preserveAspectRatio`, addressing RTL flexbox bugs, and implementing CORS fallback font selectors. I'm also addressing the singleton popover font picker, forward headroom allocation, and eliminating raw text footnote placeholders, while ensuring column balancing and atomic footnote isolation. I'm paying close attention to Unicode Private Use Area characters.


**Refining the Implementation**

I'm now zeroing in on Document 10's layout details, particularly the 3-pane Studio Workspace and the multi-line delimiter merger. I'm focusing on the two-pass page feedback loop for refined layouts, the use of `getColumnContentBottom`, and run suppression techniques. Moving on to Document 11, I'm examining how to handle `eval()` collisions, CSS specificity bugs in the settings pane, theme persistence, and in-memory ZIP encoding. Finally, Document 12 has me considering solutions for the single-token blowout issue, and `balanceColumns` restrictions.


**Reconciling and Documenting Failures**

I'm now integrating information from documents 13, 14, and 15. I'm focusing on the 7-track Grid topology, the two-pass feedback loop, and the run suppression techniques. The use of `rollbackOrphanEnd` for cascading recursive rollbacks and run-on footnote mode (`.run-on-notes` with `❖`) are also critical. The 5-Tier vertical justification and overshoot guard refinements from Document 14 are also essential. I'm also now analyzing the detailed failure reports to understand and address the issues. Specific failures such as word truncation, spacing overshoots, CSS grid stretching and post-render validation are being scrutinized in depth. I need to document these failures and their solutions thoroughly.


**Clarifying Architecture Components**

I'm now articulating the core architectural shift. While document ingestion began with native engines, the current reality involves a full client-side web platform. This means a complete SPA in HTML5 DOM, CSS3 Paged Media, and vanilla JS, with no backend requirements. I am also working on capturing the two key phases: document normalization, and the production engine, while accounting for the original mathematical rules. I've synthesized a solution to footnote isolation when measuring, by tokenizing it with a specific pattern.


**Refining Page Layout Strategy**

I'm now zeroing in on Document 16's page layout refinements and the problems that arose. The initial approach to `balanceColumns` led to problems, especially a broken continuous flow across pages. The final rule dictates it run only at section ends or before spanning headers, using a five-tiered vertical justification system and strict rules against the use of `word-spacing`. I'm also ensuring runts and orphans are managed to prevent word drops.


**Analyzing Technical Issues**

I'm now focused on refining the CSS Grid layout rules for `.block-2col`, ensuring `align-items: start !important;` to address scrollHeight issues. Also, I am now working on Shaar coordinate persistence. I've designed a multi-level fallback system: mm drag coordinates, JSON-embedded boxes, and manual input. I'm also capturing hardcoded defaults. I'm also now organizing the structure of the consolidated document, adhering to the 6-section structure outlined in the prompt.



**Defining Core Principles**

I'm now focusing on defining the coding style and language standards to ensure clarity and maintainability. Hebrew will be used where requested, while standard English will be applied for all technical terms, identifiers and comments. This should create an authoritative tone and eliminate any ambiguous placeholders within the documentation. I'm also adding details for Section 1, including the full pre-processing bridge, and core files needed for the client-side.



**Integrating Complex Logic**

I'm now integrating the intricacies of the Column Grid and Balancing Engine, particularly the cost function, split points, and height penalty logic, alongside the five-tiered vertical justification and overshoot guard. I'm also capturing the details of cascading rollback functionality to handle orphan headings and widows. The Footnote and Endnote Engine's dynamic reserve height and lookahead systems are now also included. Finally, I am working on the marginalia, running headers, and Shaar implementations. I will next work on capturing the TOC generation and Gematria Engine. I will also incorporate a deep, exhaustive Decision & Failure Log.


**Addressing Specific Issues**

I'm now focusing on a range of crucial, specific issues to achieve full documentation. These include issues from failure analysis: line-count balancing failure, sacred text hyphenation errors, state pollution during evaluations, and incorrect Gematria implementation. Hardcoded absolute positioning, layout issues with side-notes, distorted Sub-Shaar layouts, CSS multi-column failures, and float spillover are also being addressed. CORS sandbox blocks, gating `balanceColumns`, replacement of footnotes with placeholder text, and the evaluation of footnote heights are all now considered.


**Addressing Specific Issues**

I'm now focusing on integrating fixes for a number of crucial problems identified across many of the documents. I'm focusing on non-collapsing flexbox margins, styling `<option>` elements in Windows Chromium, pasting font preview logic, and preventing UI freezing with debounce on input events. I'm also addressing the vertical gutter rule, CSS `fit-content` for heading ornaments, and double margins in Flexbox. The goal is to fully document these fixes and the associated failures to provide a complete understanding of all previous iterations. I'm prioritizing `eval()` collisions, specificity bugs, and Shaar coordinate persistence. I'm also making sure I handle `<div contenteditable>` properly. Finally, I'm integrating the fixes for the CSS grid stretch bug and `offsetTop` reset.


**Addressing Layout Refinements**

I'm now integrating critical adjustments for Document 18. I'm focusing on the bug under `p { position: relative }`, and addressing runts and overshoots, especially those resulting from `word-spacing`. I am prioritizing the 5-tiered `word-spacing` issues and handling continuous body pages based on the `diff > 60px` threshold. Also, I am documenting the full code for Section 4, including data structures, Gematria functions, and all the core layout functions. I'm also addressing the `balanceColumns` issue.

---

### 🤖 תגובה 2: # מסמך ארכיטקטורה, מפרט אלגוריתמי ותיעוד הנדסי מקיף ## מערכת עימוד והוצאה לאור…

# מסמך ארכיטקטורה, מפרט אלגוריתמי ותיעוד הנדסי מקיף
## מערכת עימוד והוצאה לאור לספרות תורנית ועיונית (Master Studio Edition)

---

## 1. תמונת מצב וארכיטקטורה מעודכנת (Consolidated Architecture)

### 1.1 ייעוד המערכת ומטרותיה
המערכת היא מנוע הוצאה לאור שולחני (DTP Engine) מבוסס טכנולוגיות ווב הפועל בצד לקוח באופן אוטונומי ומלא (Client-Side Pure Web Architecture), ללא תלות בשרת עיבוד (Zero-Backend) וללא שלב קומפילציה חיצוני בזמן ריצה. ייעודה הבלעדי הוא עימוד, פריסה והפקה לדפוס (A4 Print-Ready PDF) של ספרות תורנית ועיונית מורכבת (ספרי שו"ת, חידושים, מפרשים, ספרי הלכה ומחקר תורני), תוך עמידה בדרישות הטיפוגרפיות וההלכתיות המסורתיות (נוסח דפוסי וילנא, ונציה ולבוב) והגעה לרמת דיוק והפקה המשתווה לתוכנות כגון "תג" ו-Adobe InDesign.

המערכת פותרת את אתגרי העימוד הייחודיים של הספר התורני:
1. **עימוד רב-שכבתי משולב באותו עמוד:** גוף טקסט דו-טורי מיושר לשני הצדדים, כותרות רוחביות חוצות-טורים (`span_1col`), כותרות מובלעות (`run_in`), כותרות צד בשוליים (Marginalia), מילות פתיחה משוקעות בחלון (`Drop Word`), הדגשת "דיבור המתחיל" (ד"ה), והערות שוליים דינמיות בתחתית העמוד.
2. **איזון טורים ויישור תחתית אנכי (Two-Column Balancing & Vertical Justification):** נעילה של שני הטורים לקו בסיס תחתון (Baseline) מפולס לחלוטין בכל עמוד ובסופי פרקים ללא מדרגות וללא פגיעה ברווחי שורות.
3. **תקציב אנכי דינמי (Dynamic Height Budgeting):** אזור הערות שוליים הגדל ומתכווץ בהתאם לציוני ההערות בגוף הטקסט, תוך שריון מקום מקדים המונע גלישה של טקסט ראשי על גבי ההערות.
4. **מערך שערים וקטורי מודולרי:** שער ראשי, שער אחורי בן 4 מקטעים, ושערי משנה, הניתנים לכוונון קואורדינטות אינטראקטיבי (Drag & Resize) בדיוק מילימטרי.
5. **כותרות עליונות רצות נפרדות (Recto / Verso):** הפרדה מוחלטת בין עמודי ימין לעמודי שמאל, פיצול שמות ספרים לשני העמודים, ומספור עמודים בגימטריה תורנית מדויקת.
6. **קליטת טקסט וניקוי מזהים (Pre-processing Pipeline):** זיהוי ופירוק קידומות כותרות מתוך קובצי מקור, ניקוי אטומי והחלת סגנונות.

```
+----------------------------------------------------------------------------------------------------+
|                                    ארכיטקטורת הצינור הכוללת (Pipeline)                             |
+----------------------------------------------------------------------------------------------------+
|  [Ingestion & Preprocessing]                                                                       |
|  - Raw Source Text / Word Import -> Header Regex Normalizer -> Editorial Notes Stripper (##...##)  |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|  [Lexing, Tokenization & AST]                                                                      |
|  - Token Classification (h0-h7, p, run-in, sideNote, endNote)                                      |
|  - Multi-line Delimiter Merger (Unclosed brackets '[' ... ']')                                     |
|  - Section Partitioning (Main Shaar, Back Shaar, Sub Shaar, TOC, Chapter Openings, Body Flow)      |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|  [Virtual DOM Probing & Measuring Sandbox]                                                         |
|  - Offscreen #measuring-box (Width locked to exact column width, true font metrics)                |
|  - Atomic Delimiter Protection (\uE000 space masking inside note brackets)                         |
|  - Line Slicing with Runt Prevention (No trailing single-word lines)                               |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|  [Layout, Balancing & Constraint Engine]                                                           |
|  - Dynamic Page Budget Equation: Total Available Height minus Footnote Reservations               |
|  - Two-Column Packing & Lookahead Space Allocation                                                 |
|  - Section-End / Span-Heading Balance (balanceColumns via Cost Function + Hard Height Penalty)     |
|  - Cascading Rollback Engine (rollbackColumnTail: Headings, Widows, Orphans, Note Crossings)       |
|  - Two-Pass Overflow Trimming & PushBack Loop                                                      |
|  - 5-Tier Vertical Justification (Inter-block Margins -> Line Height -> Fine Closure)             |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|  [DOM Materialization & Output Surface]                                                            |
|  - 7-Track CSS Grid Generation (Margins, Columns, Gutter Divider locked to min(rCol, lCol))        |
|  - Footnote Block Insertion (In-flow flex layout above footer)                                     |
|  - Marginalia Collision Solver (Vertical collision stacking & boundary clamping)                   |
|  - Running Headers (Recto/Verso, Split Title) & Hebrew Gematria Folios                             |
|  - High-Fidelity CSS Paged Media Print Target (@media print, ISO 216 A4 210mm x 297mm)             |
+----------------------------------------------------------------------------------------------------+
```

### 1.2 ערימת הטכנולוגיות הנבחרת (Consolidated Tech Stack)
* **Core Runtime:** Vanilla ECMAScript 2022+ (ללא ספריות כדוגמת React, Vue, jQuery או Paged.js, כדי להבטיח שליטה מלאה ב-Reflow וב-DOM Rendering).
* **Layout & Geometry:** CSS Grid System (7 עמודות סימטריות), CSS Flexbox, CSS Custom Properties (`:root` variables) לניהול פרמטרים גיאומטריים בזמן אמת, ו-Virtual Measuring Box מבודד.
* **Print Specification:** CSS3 Paged Media Module (`@page { size: A4 portrait; margin: 0; }`), Print Media Queries, כללי בידוד דפים (`break-inside: avoid; page-break-after: always;`).
* **Vector Graphics:** SVG 1.1 מוטמע (Inline SVG) עם שליטה ביחסי היטל (`preserveAspectRatio="none"`), מטריצות טרנספורמציה (היפוך מראה `scaleX(-1)` ו-`scaleY(-1)`), וייבוא תמונות Base64/Data-URL.
* **טיפוגרפיה וגופנים:** Local Font Access API (`window.queryLocalFonts`), CSS Font Loading API (`document.fonts.load`, `document.fonts.ready`), OpenType features (`hebr`, `kern`, `mark`, `mkmk`, `dlig`, `jalt`), ותמיכה מלאה בפיסוק עברי, ניקוד וטעמי מקרא.
* **אריזה וסריאליזציה:**
  * מנוע דחיסה בינארי טהור מבוסס JavaScript (`ArrayBuffer`, `DataView`, חישוב CRC32 בזיכרון) המייצר קובצי ZIP עצמאיים ללא ספריות חיצוניות.
  * שמירת תבניות מלאה באמצעות JSON Data Island המוטמע בתוך ה-HTML (`<script id="ext-imports-data" type="application/json">`).

### 1.3 הפרדת אחריות ומודל המודולים (Module Decomposition)
המערכת מורכבת משישה רכיבי ליבה בעלי גבולות אחריות חדים:
1. **`index.html` (View Skeleton & Configuration Surface):** שלד ה-DOM הסטטי, ממשק סרגל הצד (עורך טקסט ולוח הגדרות אקורדיוני בן 10 פאנלים), מכולת הספר המעומד (`#book-container`), ותיבת המדידה הנסתרת (`#measuring-box`).
2. **`style.css` (Presentation Layer & Paged Layout):** חוקי הרשת, משתנים גלובליים, טיפוגרפיה תורנית, חוקי שורות חתוכות (`p-cut` לעומת `p-end`), ועיצוב דפוס נקי ב-100% ללא עיוותים.
3. **`decorations.js` (Asset Registry & Frame Engine):** מאגר עיטורים וקטוריים (SVG), מחולל שערי ספר (ראשי, אחורי, משנה), קווי הפרדה להערות שוליים, ופסי סיום פרק.
4. **`typesetter.js` (Typesetting & Layout Kernel):** המוח החישובי. אחראי על טוקניזציה, מדידת שורות, אלגוריתמי איזון, אכיפת יתומות ואלמנות, שריון גובה הערות, חלוקת עמודים, וייצור תוכן עניינים (TOC).
5. **`app.js` (UI Controller & Event Bus):** ניהול אינטראקציית משתמש, סנכרון סמן עריכה דו-כיווני, גרירה ושינוי גודל תיבות שער בעכבר (במילימטרים), ניהול זום רספונסיבי, טעינת גופנים מקומיים, וניהול מצבי שינויים ממתינים.
6. **`packer_and_configurator.html` (Asset Pipeline & In-Memory Packager):** כלי עזר עצמאי לאריזת גופנים וקובצי SVG לתוך קובצי JSON מובנים בסדר טבעי (Natural Sort) ומנוע ייצוא ZIP בינארי.

### 1.4 ניהול זיכרון, תהליכים ומניעת Layout Thrashing
- **מניעת Layout Thrashing ו-Force Reflow:** קריאות גובה (`scrollHeight`, `offsetHeight`, `getBoundingClientRect`) מתבצעות אך ורק בתוך תיבת המדידה המבודדת (`#measuring-box`) או בנקודות בקרה ייעודיות בסיום פאזת רינדור. נאסר שימוש בקריאות גובה חוזרות בתוך לולאות מילים פנימיות.
- **סנכרון Event Loop ו-Debounced Pipeline:** שינויי הגדרות כבדים מושהים באמצעות מנגנון Debounce של 400ms או מופעלים ידנית באמצעות לחצן "עדכן ועמד מחדש" המהבהב בעת שינויים ממתינים (`markPendingChanges`), מה שמונע הקפאה של ה-Main Thread של הדפדפן.
- **טעינת גופנים מובטחת טרם חישוב:** פונקציית `ensureBuiltinFontsLoaded` מעכבת את העימוד הראשון עד לקבלת הבטחה מלאה מ-`document.fonts.ready` ומבצעת טעינה מוקדמת של כל המשקלים הנדרשים, כדי למנוע חישובי גובה שגויים מול גופני ברירת מחדל (FOUT / Fallback Shift).

---

## 2. פירוט המודולים והאלגוריתמים המאוחד (Detailed Master Modules)

### 2.1 מודול קליטת הטקסט ועיבוד מקדים (Pre-processing & Tokenization)

#### א. מפענח כותרות מובנה (Header Normalizer Engine)
כותרות מקור מגיעות בשלושה מבנים שונים בתחילת שורה. המנוע מזהה, מסיר את הקידומת במדויק ומחיל את הסגנון הנדרש.
- **מבנה 1:** `[Style] - [Content]` (למשל: `כותרת 7 - שלושה נושאים...`)
- **מבנה 2:** `[Style] מספר [X] - [Content]` (למשל: `כותרת 7 מספר 401 - שלושה נושאים...`)
- **מבנה 3:** `[Style] מספר [X] ([Y]) - [Content]` (למשל: `כותרת 1 מספר 1 (1) - הקדמות...`)

הביטוי הרגולרי התקני:
$$\text{Pattern} = \texttt{\textasciicircum(.+?)(?:\text{ מספר }\textbackslash\text{d}+(?:\textbackslash\text{s}*\textbackslash(\textbackslash\text{d}+\textbackslash))?)? - }$$

```
^ (.+?) (?:  מספר  \d+ (?: \s* \( \d+ \) )? )?  - 
|  |     |___________________________________|   |
|  |             Optional Numbering              |
|  Capture Group 1 (Style Name)                  Exact Match (Full Prefix)
Start of Line
```

*כלל ברזל:* מחיקת הקידומת מתבצעת אך ורק לפי אורך ההתאמה המלאה (`Len(match.Value)`), ללא הרכבה ידנית של מחרוזות משנה.

#### ב. סינון הערות עריכה פנימיות (`stripEditorialNotes`)
טקסט המסומן ב-`##טקסט כלשהו##` מזוהה כהערת מחבר/עורך:
- בעורך הטקסט: נשמר לצורך עבודה רציפה.
- במנוע העימוד: מסולק לחלוטין טרם הטוקניזציה תוך ניקוי רווחים עודפים והצמדת סימני פיסוק:
```javascript
function stripEditorialNotes(text) {
    if (!text) return '';
    return text
        .replace(/##[\s\S]*?##/g, '')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\s+([,.:;!?])/g, '$1')
        .trim();
}
```

#### ג. איחוד תוחמי הערות שוליים רב-שורתיים (`mergeMultilineFootnoteSpans`)
אם הערת שוליים נפתחת בשורה אחת (`[`) ומסתיימת מספר שורות לאחר מכן (`]`), שלב הטוקניזציה מאחד את השורות לטוקן פסקה בודד, כדי למנוע פיצול של תוחם פתוח.

---

### 2.2 מודול מדידה אטומית ושבירת שורות (`getLinesFromParagraph`)

#### א. הבעיה
מדידת פסקה המכילה הערת שוליים ארוכה בגוף הטקסט (עשרות מילים בסוגריים `[...]`) גורמת למנוע השבירה לחלק את מילות ההערה על פני שורות רבות בתוך הטור הראשי. ברגע שההערה נשלפת החוצה לתחתית העמוד, גוף הפסקה קורס ומתכווץ, מה שיוצר פערי גובה ענקיים ועיוותי איזון.

#### ב. פתרון הבידוד האטומי והגנת הרווחים (`\uE000`)
1. **טוקניזציה מוקדמת:** תוחמי ההערות מזוהים בטקסט באמצעות ביטוי רגולרי קשיח הכולל סימני פיסוק צמודים.
2. **נעילת רווחים אטומית:** כל הרווחים בתוך סוגרי ההערה מוחלפים בתו Unicode שמור לשימוש פרטי (`\uE000`):
   ```javascript
   safeText = safeText.replace(new RegExp(escO + '([\\s\\S]*?)' + escC + '([,.:;!?]*)', 'g'), (m, inner, punct) => {
       return fnOpen + inner.replace(/\s+/g, '\uE000') + fnClose + (punct || '');
   });
   ```
3. **החלפה בסימון מדומה במדידה:** בתוך ה-DOM הווירטואלי של תיבת המדידה (`#measuring-box`), מילה המזוהה כהערה מוחלפת במחרוזת תצוגה בת אות בודדת עם גרש וסימן פיסוק (`' א\'' + punct`). כך תיבת המדידה מודדת במדויק את נפח גוף הפסקה האמיתי כפי שיופיע בטור.
4. **דגימת קואורדינטות ב-DOM:** המילים מוזרקות עטופות ב-`<span id="mw-i">`, והמערכת דוגמת את ה-`offsetTop` של כל מילה. שורה נשברת כאשר הפרש הגובה מול השורה הנוכחית עולה על 8 פיקסלים.
5. **מניעת מילה בודדת בשורה האחרונה (Runt Prevention):** לאחר חילוץ מערך השורות, אם בשורה האחרונה נותרה מילה בודדת, ולפניה עומדת שורה בת 3 מילים ומעלה – המילה האחרונה מהשורה הקודמת נמשכת לשורה האחרונה. המערך המקורי של המילים אינו נפגע, ואף אות אינה נשמטת.
6. **שחזור שורות מלא:** בסיום המדידה, תווי `\uE000` מוחזרים לרווחים רגילים, ומבנה השורות המדויק נשמר במערך `lines`.

---

### 2.3 מודול גיאומטריית הרשת ואיזון שני טורים (Grid & Balancing Engine)

#### א. מבנה הרשת (CSS Grid Topology)
המכולה הדו-טורית מוגדרת ברשת בעלת 7 עמודות ב-CSS Grid:
$$\text{Grid Columns} = [\text{Margin}_R,\, \text{Gap}_R,\, \text{Col}_R,\, \text{Gutter},\, \text{Col}_L,\, \text{Gap}_L,\, \text{Margin}_L]$$
- רוחב הטורים ($\text{Col}_R, \text{Col}_L$): 40% כל אחד.
- שוליים להערות צד ($\text{Margin}_R, \text{Margin}_L$): 7.5% כל אחד.
- מרזב מרכזי לקו מפריד אנכי ($\text{Gutter}$): 2%.
- רווחי ביניים ($\text{Gap}_R, \text{Gap}_L$): 2% כל אחד.
- **אילוץ קשיח:** `align-items: start !important;` מוטל תמיד על `.block-2col`.

#### ב. אלגוריתם תקצוב גובה העמוד (Page Budget Equation)
גובה התוכן הפנוי לטורי הטקסט בעמוד ($H_{\text{avail}}$) מחושב באופן דטרמיניסטי:
$$H_{\text{avail}} = H_{\text{wrapper}} - H_{\text{header}} - H_{\text{footer}} - \text{Margin}_{\text{top}} - \text{Margin}_{\text{bottom}} - H_{\text{spans}} - H_{\text{footnotes\_reserved}}$$
כאשר $H_{\text{footnotes\_reserved}}$ מחושב במדידה מקדימה ב-DOM הכוללת את בלוק ההערות, קו המפריד, וכותרת ההערות במידה וקיימת.

#### ג. אלגוריתם איזון הטורים בסופי פרקים ולפני כותרות רוחב (`balanceColumns`)
1. **איחוד פסקאות וכותרות:** כל האלמנטים בבלוק נסכמים ומאוחדים למערך `items`.
2. **פריסת נקודות חיתוך חוקיות (`validSplitPoints`):** יצירת רשימת נקודות פיצול אפשריות $(i, l)$ ברמת השורה הבודדת.
3. **סינון נקודות חיתוך אסורות:**
   - נפסלת נקודה שחוצה תוחם הערת שוליים (`adjustFitLineForNoteSpans`).
   - נפסלת נקודה המותירה שורה בודדת בסוף טור ימין (Widow) או בראש טור שמאל (Orphan).
   - נפסלת נקודה שבה כותרת נשארת בודדת בסוף טור ימין ללא טקסט אחריה.
   - נפסלת נקודה שבה השורה האחרונה בטור ימין מכילה פחות מ-3 מילים.
4. **פונקציית עלות ואופטימיזציה מבוססת קנסות:**
   עבור כל נקודת פיצול חוקית, מתבצעת הדמיית רינדור מהירה ב-DOM ונמדדים $H_R$ ו-$H_L$:
   $$\Delta H = H_R - H_L$$
   $$\text{BaseScore} = \begin{cases} 
   |\Delta H| \times 0.6 & \text{if } 0 \le \Delta H \le 24\text{px} \quad \text{(בונוס למבנה עברי טבעי שבו ימין ארוך מעט משמאל)} \\
   |\Delta H| \times 1.3 & \text{if } \Delta H < 0 \quad \text{(קנס כבד כאשר שמאל ארוך מימין)} \\
   |\Delta H| & \text{otherwise}
   \end{cases}$$
   $$\text{HeightPenalty} = \max(0, H_R - H_{\text{avail}}) \times 5000 + \max(0, H_L - H_{\text{avail}}) \times 5000$$
   $$\text{TotalScore} = \text{BaseScore} + \text{HeightPenalty}$$
   הפיצול בעל ה-$\text{TotalScore}$ המינימלי נבחר ומיושם ב-DOM.

#### ד. מנוע יישור אנכי מדורג ב-5 רמות (`distributeColumnJustification`)
כאשר קיים פער גובה שיורי ($2\text{px} < \Delta H \le 140\text{px}$), מופעל מנגנון מתיחה מדורג המפזר את הפער בטור הקצר:
* **עדיפות 1 (משקל 6):** הגדלת `margin-top` לפני כותרות ברמות 3–6 (למעט כותרת בראש הטור), עד מקסימום 30px לכותרת.
* **עדיפות 2 (משקל 4):** הגדלת `margin-bottom` אחרי כותרות ברמות 3–6, עד מקסימום 22px לכותרת.
* **עדיפות 3 (משקל 3):** הגדלת `margin-bottom` בין פסקאות, עד מקסימום 24px לכל מרווח.
* **עדיפות 4 (משקל 2):** הגדלת מרווח שורות (`line-height`) בפסקאות, עד לתוספת מרבית של $+0.12$.
* **עדיפות 5 (משקל 1):** סגירה מיקרו-טיפוגרפית עדינה של יתרת הפער בפסקאות (תומך גם בטור בעל פסקה יחידה).
* **בקרת Overshoot קשיחה:** בכל שלב נמדד `shortCol.scrollHeight`. אם הטור חורג מ-`targetCeiling` (גובה הטור הארוך) ביותר מ-0.5px, הפעולה מבוטלת מיידית (`revert`). חל איסור מוחלט על שימוש ב-`word-spacing` לפריצת שורות חדשות במסגרת היישור.

#### ה. קו מפריד אנכי בין טורים (`.col-gutter-divider`)
בסיום העימוד, גובה הקו המפריד ננעל ב-JavaScript בדיוק לפי הטור הנמוך מבין השניים:
$$H_{\text{divider}} = \min(H_{\text{rCol}}, H_{\text{lCol}})$$
באמצעות `align-self: start`, כך שהוא אינו בולט אל תוך שטח לבן ריק בסופי פרקים.

---

### 2.4 מודול בקרת יתומות ואלמנות מפלתי (Cascading Orphan/Widow Engine)

#### א. אכיפת שורות בפסקאות (`refineParagraphFitLine`)
- **מניעת יתומה:** אם פסקה נחתכת בשורה הראשונה בלבד ($\text{fit} = 1$), הפסקה כולה מועברת לטור/עמוד הבא ($\text{fit} = 0$).
- **מניעת אלמנה:** אם נותרה שורה בודדת לעמוד הבא ($\text{totalLines} - \text{fit} = 1$), קו החיתוך נסוג שורה אחת לאחור ($\text{fit} = \text{fit} - 1$), כך שלפחות 2 שורות יעברו יחד.
- **לולאת התכנסות להגנת הערות:** לאחר כל שינוי של שומרי יתומות/אלמנות, מופעלת בדיקת חציית סוגרי הערות שוליים (`adjustFitLineForNoteSpans`). הלולאה רצה עד להשגת חיתוך העונה על שני האילוצים במקביל.

#### ב. אלגוריתם הנסיגה המפלתי המחזורי (`rollbackColumnTail`)
כאשר אלמנטים נסוגים עקב חוסר מקום, עלולה להיחשף כותרת שנותרת בודדת בסוף הטור. האלגוריתם מנקה את קצה הטור בלולאת `while` רציפה:
1. **כלל 1:** אם האלמנט האחרון הוא כותרת מכל סוג (`isAnyHeadingElement`) – הכותרת מוסרת מיד, והלולאה חוזרת לראשיתה לבדוק את האלמנט שנחשף לפניה.
2. **כלל 2:** אם האלמנט האחרון הוא פסקה, והאלמנט שלפניו הוא כותרת – מודדים את כמות השורות בפסקה זו. אם נכנסה שורה אחת בלבד – הפסקה והכותרת שלפניה מוסרות שתיהן, והלולאה ממשיכה.
3. **כלל 3:** אם האלמנט האחרון הוא פסקה מקוטעת (`p-cut`) המכילה פחות מ-2 שורות – הפסקה מוסרת.

---

### 2.5 מודול הערות שוליים וסיום (Footnotes & Endnotes Subsystem)

#### א. שריון תקציב In-Flow
בלוק הערות השוליים (`.footnote-area`) מוזרק כאלמנט זורם במעטפת ה-Flexbox (`.page-content-wrapper`) ישירות מעל הפוטר, מה שמונע חפיפה פיזית עם מספרי העמודים.
הגובה הפנוי לטורים מתעדכן דינמית בכל עמוד:
$$H_{\text{body\_avail}} = H_{\text{total}} - H_{\text{footnotes\_reserved}}$$

#### ב. לולאת משוב דו-שלבית וקיטוע עודפים (Two-Pass Trimming & PushBack)
במקרים שבהם טור ימין התמלא לגובה מלא, וטור שמאל גילה הערת שוליים גדולה שצמצמה את שטח הדף:
1. המנוע מזהה את הגובה המותר המעודכן (`actualAvailH`).
2. כל עוד גובה הטורים חורג מ-`actualAvailH + 2px`, מופעל מנגנון PushBack: אלמנטים עודפים נשלפים מסוף טור שמאל, מוחזרים למבנה `pendingWordTokens`, ונפלטים לראש העמוד הבא.
3. פסקה שנחצתה וממשיכה בעמוד הבא מסומנת תמיד ב-`class="p-cut"` עם `text-align-last: justify !important`, ובכך נמנע מרכוז שגוי של שורות חתוכות.

#### ג. מצבי פריסת הערות
1. **מצב בלוק (Block Mode):** פריסה בטור יחיד רחב או בשני טורים מקבילים מאוזנים (`fn-columns`).
2. **מצב הערות רצות (Run-on Mode):** שרשור כל הערות העמוד לפסקה רציפה אחת (`.run-on-notes`), מופרדות באמצעות מפריד מעוצב (` ❖ `).

---

### 2.6 מודול כותרות צד בשוליים (Marginalia / Side Notes)

כותרות רמה 7 מנותבות לשוליים החיצוניים (`.right-margin` או `.left-margin`) כאלמנטים בעלי `position: absolute`:
- **עיגון ראשוני:** מיושרות מול `p.offsetTop` של פסקת היעד.
- **פתרון התנגשויות אנכיות (`finalizeNotePositions`):** מיון כל ההערות באותו שול ואכיפת מרווח ביטחון מינימלי של 6px בין תחתית הערה עליונה לראש הערה תחתונה.
- **חריגה מתחתית הטור:** ניסיון הגבהה כלפי מעלה. אם המרחב תפוס, והפסקה נחצתה וממשיכה בטור שמאל או בעמוד הבא (`data-is-cont="true"`), אלמנט הערת הצד מועבר אוטומטית לעוגן ההמשך.

---

### 2.7 מודול טיפוגרפיה תורנית ושערי ספר (Typography & Vector Shaar)

#### א. חלון מילה ראשונה (Drop Word) ודיבור המתחיל (ד"ה)
- **חלון שקוע (`first-word-window`):** מילה ראשונה מוגדלת במשקל כבד עם `float: right; line-height: 0.85; height: 1.25em;`. מוחל אך ורק אם הפסקה מחזיקה לפחות 2 שורות ואינה פסקת המשך. בפסקאות קצרות בנות שורה אחת – מוחל סגנון שומר-גובה `first-word-inline` ללא float.
- **דיבור המתחיל אוטומטי (`applyDibburHamatchil`):** זיהוי רגולרי של פתיח עד נקודה או מקף (`^([^.\-–—]{1,80}[.\-–—])\s*(.*)$`) ועטיפתו ב-`<span class="dibbur-hamatchil">` בעל גופן ייעודי.

#### ב. שערי ספר וקטוריים וכוונון אינטראקטיבי
- **מבנה השערים:** שער ראשי, שער אחורי (גב ספר מודולרי ב-4 מקטעים), ושערי משנה. קובצי SVG מוזרקים עם `preserveAspectRatio="none"` למתיחה מדויקת ביחס ל-A4.
- **עורך תיבות שער אינטראקטיבי (Drag & Resize):** כוונון מיקום תיבת הטקסט על גבי השער בעזרת 8 ידיות אחיזה בעכבר. תזוזת העכבר בפיקסלים מתורגמת ישירות למילימטרים יחסיים של דף A4:
  $$\Delta X_{\text{mm}} = \left(\frac{\Delta X_{\text{px}}}{\text{pageWidth}_{\text{px}}}\right) \times 210, \quad \Delta Y_{\text{mm}} = \left(\frac{\Delta Y_{\text{px}}}{\text{pageHeight}_{\text{px}}}\right) \times 297$$
- **רזולוציית קואורדינטות רב-דרגתית (`resolveShaarBoxStyle`):** עדיפות לקואורדינטות שנשמרו בעריכת עכבר $\rightarrow$ קואורדינטות מוטמעות ב-JSON של השער $\rightarrow$ ערכי שדות הקלט בלוח ההגדרות $\rightarrow$ ברירת מחדל הנדסית.

#### ג. כותרות עליונות מתחלפות (Recto / Verso Running Headers)
- הפרדה מלאה בין עמודי ימין (אי-זוגי) לשמאל (זוגי) עם הגדרות תוכן ויישור עצמאיות (חיצוני/פנימי).
- פיצול שם ספר אוטומטי (`splitTextInHalf`): חלוקת מילות שם הספר חצי-בחצי (חצי ראשון בעמוד ימין, חצי שני בעמוד שמאל).
- מילת פתיחה ומילת סיום (`first_word_last_word`): דגימת המילה הראשונה בטור ימין והמילה האחרונה בטור שמאל להצגה בכותרת הדף.

---

### 2.8 מודול תוכן עניינים ומספור גימטרי (TOC & Gematria Engine)

#### א. אלגוריתם גימטריה תורנית מדויק (`toGematria`)
המרה דטרמיניסטית של ערכים נומריים לאותיות עבריות לפי כללי המסורת:
- טיפול חמור באיסור שמות קודש: 15 מומר ל-`טו` ו-16 ל-`טז`.
- פירוק רב-דרגתי: מאות ($100-900$), עשרות ($10-90$), ואחדות ($1-9$), כולל מאות מורכבות מעל 400 (תק, תר, תש, תת, תתק).
- הוספת גרש לאות בודדת (למשל `א'`) וגרשיים לפני האות האחרונה בשתי אותיות ומעלה (למשל `תשפ"ו`).

#### ב. תוכן עניינים מקובץ ורציף (Grouped Headings TOC)
- תוכן העניינים נבנה לאחר סיום הפאגינציה של הספר, כאשר מספרי העמודים נשאבים ישירות מתוך `headingPageMap` שנרשם בזמן הרינדור.
- תמיכה במובילי נקודות (Dot Leaders) המיושרים לשני הצדדים.
- תמיכה בקיבוץ כותרות משנה (כגון רמות 4–6) לשורות רציפות המופרדות במפרידים מעוצבים, כדי לחסוך עמודים בתוכן העניינים.

---

## 3. יומן כישלונות, היסטוריית החלטות וניסיונות שנפסלו (Consolidated Failed Approaches & Decision Log)

פרק זה מהווה את מאגר הלקחים המלא של הפרויקט. כל סעיף מתעד גישה שנפסלה, את התרחיש ומקרה הקצה שבו כשלה, את ההוכחה הטכנית לכשל, ואת האיסור ההנדסי המחייב:

### 1. שחזור ידני של מחרוזות Regex בעת ניקוי כותרות (String Re-composition Failure)
* **ההצעה שנפסלה:** פירוק הביטוי הרגולרי לתת-קבוצות (`SubMatches`) והרכבה ידנית של מחרוזת המחיקה:
  `prefixStr = styleName & " מספר " & numStr & " - "`
* **תרחיש הכשל:** כותרות ללא מספר (`כותרת 7 - תוכן`) או כותרות עם סוגריים כפולים (`כותרת 1 מספר 1 (1) - תוכן`). קריסה ב-`SubMatches(1)` או השמטת הסוגריים והשארת טקסט מקולקל במסמך: `(1) - תוכן`.
* **האיסור ההנדסי:** לעולם אין להרכיב ידנית מחרוזת למחיקה מחלקי Regex. יש להשתמש תמיד ב-Match Length ישיר של המנוע (`Len(match.Value)`).

### 2. לולאת רטט אינסופית בעימוד הערות שוליים (Footnote Oscillation Thrashing)
* **הגישה שנפסלה:** מנוע חמדן (Single-Pass) המוסיף שטח הערות שוליים לתחתית הדף ומקטין את גובה הטור בזמן אמת.
* **תרחיש הכשל:** שורה אחרונה בטור ב' מכילה עוגן הערה. הוספת שטח ההערה מקטינה את הטור ודוחקת את שורת העוגן לעמוד הבא. בעמוד הנוכחי אין יותר עוגן, שטח ההערות מתבטל, הטור גדל חזרה, שורת העוגן חוזרת לעמוד א' – והמערכת נכנסת ללולאת רטט אינסופית.
* **האיסור ההנדסי:** עימוד עמוד עם הערות שוליים חייב לפעול במודל תקצוב מקדים עם שמירת מצב היסטורי (`Visited States Hash`). במקרה של מעגליות, המנוע מפעיל חוק הכרעה חד-כיווני: שורת העוגן ננעלת למעבר לעמוד הבא יחד עם הערת השוליים שלה (Eager Push).

### 3. איזון טורים מבוסס ספירת שורות פשטנית (Line-Count Balancing Failure)
* **הגישה שנפסלה:** חלוקת סך השורות בפסקה ב-2 (20 שורות לטור ימין ו-20 שורות לטור שמאל).
* **תרחיש הכשל:** פסקאות הכוללות כותרות ביניים, גופנים שונים (רש"י מול מרובע), ושוליים עליונים (`SpaceBefore`). טור א' שהכיל 2 כותרות היה ארוך פיזית ב-35pt מטור ב', מה שיצר קו תחתית שבור ומכוער.
* **האיסור ההנדסי:** איזון טורים מתבצע במרחב הפיזי הממשי (בפיקסלים/נקודות) על פי גובה מצטבר אנכי ולא לפי ספירת שורות גולמית.

### 4. שימוש במקפי מילים (Hyphenation) ביישור טורים תורניים
* **הגישה שנפסלה:** שימוש באלגוריתם שבירת שורות סטנדרטי (TeX Knuth-Plass עם מילון מקפים).
* **תרחיש הכשל:** המנוע חצה מילים תורניות, שמות קדושים (שנאסר על פי הלכה למוחקם או לחצותם), וקיצורים תורניים (כגון `רמב"ם`, `עכו"ם`), דבר שיצר פגמים חמורים שאינם קבילים בספרות תורנית.
* **האיסור ההנדסי:** שבירת שורות עברית תורנית מבוצעת אך ורק ברווחים בין מילים שלמות. מילוי השורה (Full Justification) מבוצע באמצעות ריווח מילים, אותיות מתרחבות (JALT) ושינוי מיקרו-טיפוגרפי של ה-Tracking בין 98% ל-102%.

### 5. שימוש ב-CSS Multi-Column מקורי (`column-count: 2`) לגוף הספר
* **הגישה שנפסלה:** מתן אפשרות למנוע הדפדפן לפצל את הטקסט לשני טורים באופן טבעי באמצעות `column-count: 2` על גוף הפסקה.
* **תרחיש הכשל:**
  1. אין שליטה בשבירת חלון מילה ראשונה (`float: right`).
  2. חוסר יכולת לשלב כותרת רוחבית (`span_1col` כותרת 3) באמצע עמוד בלי שבירת עמוד פנימית בלתי נשלטת.
  3. CSS Columns מציג הערות שוליים מתחת לכל טור בנפרד במקום לרוחב כל תחתית העמוד.
  4. בלתי אפשרי לעגן כותרות צד בשוליים מול שורה מדויקת בתוך עמודת CSS וירטואלית.
* **האיסור ההנדסי:** חל איסור מוחלט להשתמש ב-CSS Columns לגוף הטקסט. חובה לנהל טורים ידנית ברמת ה-DOM (`.right-col` ו-`.left-col` נפרדים).

### 6. חלון מילה ראשונה שובר פסקאות בנות שורה אחת (Float Spillover Bug)
* **הגישה שנפסלה:** החלת תגית `<span class="first-word-window">` (בעלת `float: right; height: 1.25em;`) על המילה הראשונה בכל פסקה חדשה באופן גורף.
* **תרחיש הכשל:** כאשר לפסקה הייתה שורה אחת בלבד, אלמנט ה-Float חרג מגובה השורה הבודדת. כתוצאה מכך, הפסקה הבאה אחריה נלכדה תחת אותו Float וזזה שמאלה באופן מעוות, או שהמילים שלה התנגשו במילים של הפסקה הקודמת.
* **האיסור ההנדסי:** חובה לבצע בדיקת גובה מקדימה. אם הפסקה אינה מחזיקה לפחות 2 שורות מלאות, מבוטל ה-Float ומוחל סגנון אינליין שומר-שורה (`first-word-inline`).

### 7. קריסת טעינת קובצי JSON חיצוניים בפרוטוקול `file:///` (CORS Sandbox Block)
* **הגישה שנפסלה:** שימוש ב-`fetch('shaar_main.json')` מתוך הנחה שהקבצים ייטענו מאותה תיקייה מקומית.
* **תרחיש הכשל:** משתמשי קצה הפותחים את קובץ ה-HTML בלחיצה כפולה מקומית (`file:///C:/...`) נחסמו ע"י מנגנון האבטחה של הדפדפן (Same-Origin Policy), והמערכת קרסה עם שגיאת רשת קריטית.
* **האיסור ההנדסי:** כל קריאת `fetch()` מקומית חייבת להיות עטופה ב-`try/catch` שקט, ותמיד יש לספק חלופה מקבילה של בחירת קובץ/תיקייה ידנית דרך `FileReader` ו-`webkitdirectory`.

### 8. שכפול מרובה של הערות שוליים וזינוק מונה המספור בבדיקות איזון
* **הגישה שנפסלה:** קריאה ישירה ל-`applyDelimiterStyles` מתוך פונקציית הבדיקה המהירה `renderSingleItemFast` בעת הרצת לולאת איזון הטורים (`balanceColumns`).
* **תרחיש הכשל:** אלגוריתם האיזון בודק עשרות נקודות פיצול אפשריות בלולאה. בכל בדיקה, `applyDelimiterStyles` קידמה את מונה ההערות הגלובלי והכניסה עותק נוסף של ההערה לתור. מונה ההערות זינק מ-1 ישירות ל-14, וההערה שוכפלה 14 פעמים בתחתית העמוד.
* **האיסור ההנדסי:** איסור מוחלט על Side-Effects (מוטציות במצב המערכת) בתוך פונקציות מדידה ובדיקה! פונקציית `applyDelimiterStyles` חייבת לקבל פרמטר `isDryRun = true`, היוצר סימון דמה ללא עדכון מונים וללא דחיפה לתורים, לצד שימוש במנגנון Snapshot & Rollback מלא.

### 9. שיבוש מספור אותיות עבריות באמצעות חלוקה מודולרית (Modulo 22 Failure)
* **הגישה שנפסלה:** שימוש באלגוריתם המרה מבוסס מודולו 22 אותיות האלפבית (`num % 22`).
* **תרחיש הכשל:** מספר 15 הומר לאות ס' (האות ה-15) או לצירוף האסור `יה`. מספר 16 הומר ל-`ע` או `יו`. מספרים מעל 22 הניבו רצפים בסגנון טבלאות אקסל (`אא`, `אב` במקום `כג`, `כד`).
* **האיסור ההנדסי:** מספור עברי אינו בסיס 22 פוליאדי אלא מערכת חיבורית אדיטיבית (Additive System / Gematria). חובה להשתמש בפונקציית `toGematria` התקנית הכוללת פירוק למאות, עשרות ויחידות, וטיפול בחריגי `טו` ו-`טז`.

### 10. התנגשות הערות שוליים עם מספר העמוד וגוף הטקסט
* **הגישה שנפסלה:** מיקום `.footnote-area` באמצעות CSS קשיח: `position: absolute; bottom: 15mm;`.
* **תרחיש הכשל:** תיבת ההערות דרסה פיזית את מספר העמוד (`.page-number-footer`), וגוף הטקסט שמילא את הדף עד סופו נדרס תחת תיבת ההערות.
* **האיסור ההנדסי:** תיבת ההערות חייבת להיות חלק מ-DOM Flow הטבעי מעל ה-Footer ב-Flexbox, ומנוע העימוד חייב לנכות את גובהה מראש מקיבולת העמוד הזמינה לטורים.

### 11. ערבוב בין כותרת 7 (הערת צד) להערות שוליים תחתונות
* **הגישה שנפסלה:** איחוד כל מנגנוני ההערות תחת טבלה אחת שבה `כותרת 7 -` נותבה להערת שוליים תחתונה.
* **תרחיש הכשל:** ביטול מוחלט של מוסכמת העימוד התורני שבה כותרת 7 מהווה "הערת צד" (כדוגמת מסורת הש"ס / הגהות הב"ח) המוצגת בשוליים החיצוניים של הדף במקביל לפסקה.
* **האיסור ההנדסי:** הפרדה סמנטית ומבנית מוחלטת: כותרת 7 היא הערת צד בשוליים (`margin-notes-column`), הערות שוליים מוגדרות בתוחמי טקסט בלבד (`[...]`), והערות סיום מוגדרות בקידומת שורה (`הערת סיום -`).

### 12. עיוות שער משנה בעת טעינת רקע מותאם
* **הגישה שנפסלה:** החלפת מבנה ה-HTML של שער המשנה לקונטיינר ממורכז כללי ברוחב 100% בעת בחירת רקע מותאם.
* **תרחיש הכשל:** הטקסט של שער המשנה קפץ ממיקומו המסורתי (טור שמאלי) למרכז הדף ודרס את העיטורים של קובץ ה-SVG.
* **האיסור ההנדסי:** הפרדה מוחלטת בין שכבת ה-Background (Z-Index 5) לשכבת ה-Content Layout (Z-Index 20). מיקום הטקסט בשער המשנה חייב להישאר נעול בטור השמאלי לפי 4 השוליים של ערכת הנושא.

### 13. החלת יחס מילוי פרק (`sectionFillRatio`) על עמודי פתיחה ומלאים
* **הגישה שנפסלה:** הכפלת תקציב הגובה של כל עמודי הפרק במקדם המילוי $R$ שחושב לסוף הפרק.
* **תרחיש הכשל:** בעמודי פתיחת סימן (המכילים כותרת 2 שתפסה 350px מתוך 870px), החישוב הכפיל `(870 * 0.6) - 350 = 172px` בלבד עבור טקסט! עמוד הפתיחה נחתך בחצי ויצר חלל לבן ענק בתחתיתו.
* **האיסור ההנדסי:** יחס מילוי פרק מיועד אך ורק לעמוד האחרון של הפרק. עמוד פתיחה חייב לקבל `totalFlowH - used` מלא עד קו הבסיס התחתון.

### 14. רוחב אזור הערות שוליים מוגדר כ-`width: 100%`
* **הגישה שנפסלה:** הגדרת `.footnote-area` ברוחב 100% ממכולת הדף.
* **תרחיש הכשל:** בעמודים המכילים גם כותרות צד בשוליים וגם הערות שוליים בתחתית, קו ההפרדה של הערות השוליים והטקסט שלהן חצו את כל רוחב הדף מקצה לקצה ודרסו פיזית את הערות הצד.
* **האיסור ההנדסי:** הערות שוליים שייכות לגוף הטקסט בלבד. חובה להגדיר להן שוליים ימניים ושמאליים זהים לגבולות הטורים:
  `margin-right: calc(var(--w-margin) + var(--w-gap)) !important;`
  `width: calc(100% - 2 * (var(--w-margin) + var(--w-gap))) !important;`

### 15. כותרת 3 רוחבית עם `width: 100%`
* **הגישה שנפסלה:** הגדרת `width: 100%` על `.h3-title-text` בתוך בלוק כותרת 3 עם עיטורי צד.
* **תרחיש הכשל:** הכותרת תפסה את כל רוחב המכולה ודחקה את העיטורים החוצה לקצוות הדף לתוך עמודות הערות הצד.
* **האיסור ההנדסי:** כותרת הנמצאת בתוך בלוק עם עיטורי צד חייבת להיות ברוחב `width: auto !important` עם `gap: 10px`.

### 16. באג הזרקת ממדי דיבידר ב-`getSectionDividerHTML`
* **הגישה שנפסלה:** בדיקה האם מחרוזת הסטייל קיימת כבוליאני, מבלי לשרשר אותה בפועל:
  ```javascript
  return `<div style="... ${dimStyle ? 'display:flex;...' : ''}">${content}</div>`;
  ```
* **תרחיש הכשל:** המשתמש הזין רוחב 75% וגובה 35px לרומח SVG, אך הסטייל לא הוזרק וה-SVG נשאר בגודל ה-ViewBox המקורי הענק שלו.
* **האיסור ההנדסי:** שרשור מפורש של מחרוזת הממדים: `... + dimStyle`.

### 17. קו מפריד אנכי עם `height: 100%` בגריד הטורים
* **הגישה שנפסלה:** הגדרת הקו המפריד האנכי (`.col-gutter-divider`) ב-CSS כ-`height: 100%` עם `align-items: stretch`.
* **תרחיש הכשל:** בעמוד סוף סימן שבו הטקסט מילא רק חצי עמוד, הקו האנכי נמתח עד תחתית גבול הגריד וחצה מאות פיקסלים של שטח לבן ריק מתחת לטקסט.
* **האיסור ההנדסי:** גובה הקו המפריד חייב להיקבע תמיד ב-DOM Scripting לפי הטור הנמוך מבין השניים:
  `divider.style.height = Math.min(rBottom, lBottom) + 'px';` עם `align-self: start;`.

### 18. התאמת רוחב עיטור ב-CSS טהור (`fit-content`)
* **הגישה שנפסלה:** ניסיון לכפות על עיטור וקטורי להתכווץ לרוחב הטקסט של כותרת 2 באמצעות `width: fit-content` ב-CSS.
* **תרחיש הכשל:** נוצרה תלות מעגלית ב-Flexbox: ה-SVG קרס לאפס פיקסלים או התרחב ל-100% מרוחב הדף.
* **האיסור ההנדסי:** התאמת רוחב עיטור לטקסט מחייבת מדידה מפורשת של רוחב אותיות הכותרת ב-DOM (`measureHeadingTextWidth`) והזרקת פיקסלים קשיחים לקונטיינר העיטור.

### 19. סטיית כותרת מרכזית לימין בגלל Flexbox RTL
* **הגישה שנפסלה:** שימוש ב-`text-align: center` על `.header-col-c` בכותרת עליונה.
* **תרחיש הכשל:** האלמנט הוגדר כ-`display: flex`. בסביבת `dir="rtl"`, ברירת המחדל של flex היא `justify-content: flex-start` (צד ימין). `text-align: center` לא השפיע, והכותרת המרכזית נצמדה לימין.
* **האיסור ההנדסי:** שליטה במיקום אלמנטים ב-Flexbox תחת RTL מחייבת שימוש בלעדי ב-`justify-content` (מיפוי `right` ל-`flex-start`, ו-`left` ל-`flex-end`).

### 20. היעלמות רשימת הגופנים בהרצה מקומית ללא שרת
* **הגישה שנפסלה:** השארת תגיות `<select class="font-picker">` ריקות והסתמכות על קריאת `fetch('fonts/fonts.json')`.
* **תרחיש הכשל:** בפתיחה ישירה מקומית (`file:///`), מנגנון ה-CORS של הדפדפן חסם את ה-`fetch`, וכל 37 בוררי הגופנים במערכת נותרו ריקים לחלוטין.
* **האיסור ההנדסי:** חובה להטמיע מאגר גופנים תורניים מובנה בקוד (`DEFAULT_HEBREW_FONTS_LIST`) המאכלס את הבוררים מיידית בעליית הדף ללא תלות ברשת.

### 21. קיפאון דפדפן (UI Freeze) בהזנת שדות קלט ללא Debounce
* **הגישה שנפסלה:** הצמדת `oninput="typesetDocument()"` לכל שדות הקלט המספריים.
* **תרחיש הכשל:** בעת לחיצה רציפה על חיצי שינוי גודל גופן או הקלדת טקסט, המנוע הריץ את כל אלגוריתם העימוד עשרות פעמים בשנייה. הדפדפן נתקע לחלוטין למשך 4–8 שניות.
* **האיסור ההנדסי:** חובה להשתמש ב-Debounce של 180ms–400ms עבור אירועי קלט רציפים, או לחבר מאזין אירועים מרכזי המדליק חיווי "שינויים ממתינים" בלבד.

### 22. התניית `balanceColumns` במתג המשתמש `balance-chapter-end`
* **הגישה שנפסלה:** עטיפת הקריאות לאיזון טורים בבדיקת:
  `if (document.getElementById('balance-chapter-end')?.value === 'yes')`
* **תרחיש הכשל:** ברירת המחדל הייתה `no`. כתוצאה מכך, בסופי פרקים ולפני כותרות רוחב הטורים לא התאזנו כלל; טור ימין מילא את הדף וטור שמאל נקטע לאחר שורות ספורות.
* **האיסור ההנדסי:** איזון טורים בסוף מקטע או לפני כותרת רוחבית הוא חוק גיאומטרי מחייב, ואסור להתנות אותו בהגדרות משתמש אופציונליות.

### 23. סירוס נקודות החיתוך עקב איסור שורה בודדת נוקשה מדי
* **הגישה שנפסלה:** פסילת נקודות חיתוך בפסקה בת 3 שורות:
  `if (avoidWidows && l === 1) continue;`
  `if (avoidOrphans && (lines.length - l) === 1) continue;`
* **תרחיש הכשל:** בפסקה בת 3 שורות בסוף פרק, שורה 1 נפסלה בגלל Widow, ושורה 2 נפסלה בגלל Orphan. האלגוריתם לא מצא שום נקודת חיתוך פנימית, ונאלץ להשאיר את כל 3 השורות בימין ולהותיר את טור שמאל ריק לחלוטין!
* **האיסור ההנדסי:** באיזון טורים בסוף פרק, חלוקת השורות קודמת לאיסור שורה בודדת. יש לאפשר חלוקה של 2 שורות בימין ושורה אחת בשמאל, ולהשתמש ביישור אנכי (`distributeColumnJustification`) להסדרת הפער.

### 24. החלפת תוכן הערות שוליים במחרוזת שווא בטקסט הגולמי
* **הגישה שנפסלה:** החלפת תוכן הסוגריים `[...]` במחרוזת סטטית `" א "` בתוך פונקציית מדידת השורות.
* **תרחיש הכשל:** מחרוזת השורות שנמדדה שימשה להרכבת הטקסט שרונדר ל-DOM. תגיות הסוגריים נמחקו מה-DOM, פונקציית `applyDelimiterStyles` לא מצאה סוגריים, הערות השוליים נעלמו לחלוטין מתחתית העמוד, ובגוף הטקסט נותרה אות "א" פשוטה בגודל רגיל.
* **האיסור ההנדסי:** אסור לשנות את תוכן הטקסט הפיזי המוחזר ממנוע המדידה! הבידוד חייב להתבצע על מחרוזת פנימית לצורכי מדידת רוחב בלבד, מבלי להשמיד את תגיות הסוגריים המקוריות.

### 25. הערכת חסר של תקציב הערות השוליים (פער Flexbox Margin)
* **הגישה שנפסלה:** חישוב גובה אזור ההערות לפי גובה הטקסט בתוספת קבוע של 24px בלבד.
* **תרחיש הכשל:** ב-Flexbox שוליים אנכיים (Margins) אינם מתמזגים (No Margin Collapsing). נוצר פער לא מחושב של 20px (שולי גוף הטקסט) + 10px (שולי תיבת ההערות) + 5px (קו מפריד) = 35px. שורת הטקסט האחרונה בטור נחתכה והודפסה ישירות על גבי הקו המפריד של ההערות.
* **האיסור ההנדסי:** קבוע שריון גובה ההערות (`measureFootnoteAreaReserve`) עודכן ל-48px–52px לפחות כדי לכלול במלואם את כל המרווחים שאינם מתמזגים.

### 26. ניסיון עיצוב גופנים בתגיות `<option>` של הדפדפן ב-Windows
* **הגישה שנפסלה:** הזרקת `style.fontFamily` ישירות על תגיות `<option>` בתיבות `<select>`.
* **תרחיש הכשל:** ב-Windows, תפריט הבחירה מנוהל ע"י Native Window Widget של מערכת ההפעלה, המתעלם לחלוטין מכללי CSS על גבי `<option>`. כל 400 הגופנים הוצגו בגופן Segoe UI אחיד.
* **האיסור ההנדסי:** אסור להסתמך על `<select>` טבעי לתצוגה מקדימה של גופנים. יש להשתמש ברכיב Popover צף מבוסס HTML מלא (`#font-picker-popover`).

### 27. הזרקה דינמית של סקריפטים באמצעות `eval()` ותגיות `<script>` כפולות
* **הגישה שנפסלה:** שימוש ב-`eval()` או הזרקת תגיות `<script>` חוזרות לטעינה דינמית של `typesetter.js` ו-`decorations.js` בכלי העזר.
* **תרחיש הכשל:** קריסה עם שגיאת `Uncaught SyntaxError: Identifier '...' has already been declared`. משתני `const` ו-`let` ברמה הגלובלית אינם נמחקים מהזיכרון גם אם התגית מוסרת מה-DOM.
* **האיסור ההנדסי:** סקריפטים נטענים פעם אחת בלבד בעליית הדף. במקרה של טעינה ידנית, חובה להשתמש בשומר מצב: `if (typeof window.performTypeset === 'function') return;`.

### 28. שגיאת `renderExtAnchor is not defined`
* **הגישה שנפסלה:** הרצת מנוע העימוד `typesetter.js` בכלי עזר מבודד ללא טעינת `app.js`.
* **תרחיש הכשל:** קריסה בשורה 1727: `renderExtAnchor is not defined`. הקריסה אירעה מיד לאחר איפוס המכולה, וכל העמודים נעלמו והשאירו מסך לבן.
* **האיסור ההנדסי:** חובה להטמיע Stubs / Polyfills גלובליים לכל הפונקציות החיצוניות בראש המסמך:
  `window.renderExtAnchor = window.renderExtAnchor || function() {};`.

### 29. התנגשות Specificity שביטלה גלילה בלוח ההגדרות
* **הגישה שנפסלה:** עטיפת פאנל ההגדרות ב-`<div class="cfg-scrollable-content" id="settings-pane">` עם `overflow-y: auto`.
* **תרחיש הכשל:** בקובץ `style.css` הוגדר כלל קודם: `#settings-pane { overflow: hidden; height: 100%; }`. משקל ה-ID (`0,1,0,0`) דרס את ה-Class (`0,0,1,0`), ופאנלים 5–10 נחתכו ולא היו נגישים לגלילה.
* **האיסור ההנדסי:** הפרדת תפקידים מוחלטת: ביטול שימוש ב-ID הישן על מכולת הגלילה, והגדרת `overflow-y: scroll !important; min-height: 0 !important;`.

### 30. איבוד קואורדינטות של שערים בערכות נושא מאוחדות
* **הגישה שנפסלה:** בעת בחירת ערכה מאוחדת ב-`active-theme-select`, יצירת מזהה שמירה גנרי: `'theme_default:' + themeId`.
* **תרחיש הכשל:** המשתמש כיוונן את תיבת הטקסט עבור שער מסוים, אך בבחירת הערכה המאוחדת התיבה חזרה למיקום ברירת המחדל הגולמי ולא טענה את המיקום שנשמר.
* **האיסור ההנדסי:** ערכות מאוחדות חייבות לשמור ולהעביר את המזהה האמיתי של השער המקורי (`mainId`, `subId`, `backId`) ואת אובייקט ה-`box` המקורי שלו.

### 31. קריאת `.value` על אלמנט `<div contenteditable id="raw-input">`
* **הגישה שנפסלה:** שליפת טקסט העורך באמצעות:
  `const rawText = document.getElementById('raw-input').value;`
* **תרחיש הכשל:** לאלמנט `<div>` אין מאפיין `.value` בדפדפנים. הקריאה החזירה תמיד `undefined`, והמערכת הפיקה שער בלבד ואפס עמודי תוכן.
* **האיסור ההנדסי:** שאיבת טקסט מ-Contenteditable מתבצעת אך ורק באמצעות פונקציה תקנית הקוראת `innerText` ומסננת חוצצי עמודים (`getCleanEditorText`).

### 32. CSS Grid Stretch: עמודות ריקות שנמתחו ל-900px
* **הגישה שנפסלה:** הגדרת `.block-2col` עם ברירת המחדל `align-items: stretch`.
* **תרחיש הכשל:** טור ימין התמלא ל-900px, והדפדפן מתח אוטומטית גם את טור שמאל הריק ל-900px. מנוע האיזון קרא `scrollHeight` זהה לשני הטורים, הסיק שהבלוק מאוזן, והותיר את כל מאות שורות הטקסט בטור ימין תוך פליטתן אל מחוץ לדף לגובה 1,560px.
* **האיסור ההנדסי:** חובה להגדיר תמיד: `.block-2col { align-items: start !important; }`.

### 33. איסור מוחלט על הרצת `balanceColumns` בעמודים שוטפים באמצע פרק
* **הגישה שנפסלה:** הפעלת `balanceColumns` בעמוד שוטף אם הפרש הגבהים בין הטורים עלה על 60px.
* **תרחיש הכשל (דף 52):** הטור השמאלי הכיל את סוף פסקה א' ואת תחילת פסקה ב' (שממשיכה בעמוד הבא). מנוע האיזון לקח את כל האלמנטים בעמוד ואיזן אותם לחצי גובה. כתוצאה מכך, תחילת פסקה ב' הועברה לטור הימני! נוצר מצב שהשורה האחרונה בטור ימין הייתה המשך של הפסקה מטור שמאל, וסדר הקריאה התהפך לחלוטין.
* **האיסור ההנדסי:** `balanceColumns` מופעל **אך ורק** בסיום פרק מוחלט או לפני כותרת רוחבית (`span_1col`). בעמוד שוטף רגיל הטורים זורמים באופן סדרתי מימין לשמאל, ופערים קלים מיושרים אך ורק ע"י `distributeColumnJustification`.

---

## 4. בסיס הקוד הנוכחי והמוסכם (Current Complete Codebase)

### 4.1 מפת הממשקים, המחלקות והפונקציות המרכזיות

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TYPESETTER.JS (CORE ENGINE)                               │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ stripEditorialNotes()          │ ניקוי אטומי של הערות עריכה ##...##                    │
│ toGematria() / WithGeresh()    │ המרת מספרים לגימטריה תורנית מדויקת (כולל טו/טז)        │
│ formatPageNumberDisplay()      │ חישוב מספור עמודים עם מסגרות והיסט initialValue       │
│ getLinesFromParagraph()        │ שבירת שורות מדויקת ב-DOM עם מניעת Runt ונעילת \uE000  │
│ refineParagraphFitLine()       │ לולאת התכנסות לחיתוך פסקה סביב הערות שוליים ויתומות   │
│ isAnyHeadingElement()          │ זיהוי כותרות מכל הרמות (0–7 וכותרות מותאמות)          │
│ rollbackColumnTail()           │ אלגוריתם נסיגה מפלתי מחזורי לכותרות יתומות ואלמנות    │
│ distributeColumnJustification()│ מנוע יישור 5 רמות ללא Overshoot ותמיכה בפסקה בודדת    │
│ balanceColumns()               │ איזון טורים בסוף פרק מבוסס פונקציית עלות וקנסות גובה  │
│ finalizeNotePositions()        │ מניעת התנגשויות והעברת כותרות צד בין טורים            │
│ measureFootnoteAreaReserve()   │ שריון גובה מראש להערות שוליים בתחתית העמוד             │
│ flushFootnotesInto()           │ רינדור אזור הערות השוליים ב-Flow של העמוד מעל הפוטר   │
│ postRenderColumnAuditAnd...()  │ לולאת בקרה סגורה ב-DOM החי לאימות פער 0px             │
│ performTypeset()               │ מתאם הצינור הראשי (Main Pipeline Orchestrator)         │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

### 4.2 מימושי קוד מלאים, סופיים ומוכנים לייצור (Production-Ready Implementations)

#### א. אלגוריתם גימטריה תורנית מדויק (`toGematria` ו-`toGematriaWithGeresh`)
```javascript
function toGematria(num) {
    num = parseInt(num, 10);
    if (isNaN(num) || num <= 0) return "";
    if (num === 15) return "טו";
    if (num === 16) return "טז";
    const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
    const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    let str = "";
    let h = Math.floor(num / 100);
    if (h > 0) {
        if (h <= 4) str += ["", "ק", "ר", "ש", "ת"][h];
        else if (h < hundreds.length) str += hundreds[h];
        num %= 100;
    }
    let t = Math.floor(num / 10);
    let o = num % 10;
    if (t === 1 && (o === 5 || o === 6)) {
        str += (o === 5) ? "טו" : "טז";
    } else {
        str += tens[t] + ones[o];
    }
    return str;
}

function toGematriaWithGeresh(num) {
    const raw = toGematria(num);
    if (!raw) return "";
    if (raw.length === 1) return raw + "'";
    return raw.slice(0, -1) + '"' + raw.slice(-1);
}
```

---

#### ב. מנוע מדידת שורות אטומי עם מניעת Runt והגנת הערות שוליים (`getLinesFromParagraph`)
```javascript
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

    // בידוד תוחמי הערות מפני שבירת שורות פנימית
    if (fnOpen && fnClose) {
        const escO = fnOpen.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escC = fnClose.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        safeText = safeText.replace(new RegExp(escO + '([\\s\\S]*?)' + escC, 'g'), (m, inner) => {
            return fnOpen + inner.replace(/\s+/g, '\uE000') + fnClose;
        });
    }

    const words = safeText.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) {
        return { lines: [], hasWindow: false, numLines: 0 };
    }

    const pMeasure = document.createElement('p');
    pMeasure.style.margin = '0';
    pMeasure.style.padding = '0';
    pMeasure.style.lineHeight = styleObj.lineHeight;
    pMeasure.style.fontFamily = styleObj.fontFamily;
    pMeasure.style.fontSize = styleObj.fontSize;

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

    let html = '';
    if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${dropWords}</span> `;
        for (let i = wordCount; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : w.replace(/\uE000/g, ' ');
            html += `<span id="mw-${i}">${displayW}</span> `;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : w.replace(/\uE000/g, ' ');
            html += `<span id="mw-${i}">${displayW}</span> `;
        }
    }

    pMeasure.innerHTML = html;

    const lines = [];
    let currentLine = [];
    let currentTop = -1;
    const startIndex = shouldApplyWindow ? wordCount : 0;
    if (shouldApplyWindow) {
        currentLine.push(dropWords);
    }

    // מעבר מדויק 1:1 על כל מילות הפסקה ללא השמטה
    for (let i = startIndex; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        const realWord = words[i].replace(/\uE000/g, ' ');
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
            lines.push(currentLine.join(' '));
            currentLine = [realWord];
            currentTop = top;
        } else {
            currentLine.push(realWord);
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }

    // מניעת שורת מילה בודדת (Runt) בשורה האחרונה ללא אובדן אף אות
    if (lines.length >= 2) {
        const lastLineWords = lines[lines.length - 1].trim().split(/\s+/);
        if (lastLineWords.length === 1) {
            const prevLineWords = lines[lines.length - 2].trim().split(/\s+/);
            if (prevLineWords.length >= 3) {
                const pulledWord = prevLineWords.pop();
                lastLineWords.unshift(pulledWord);
                lines[lines.length - 2] = prevLineWords.join(' ');
                lines[lines.length - 1] = lastLineWords.join(' ');
            }
        }
    }

    measureContainer.innerHTML = '';
    return {
        lines,
        hasWindow: shouldApplyWindow,
        numLines: lines.length
    };
}
```

---

#### ג. אלגוריתם נסיגה מפלתי מחזורי (`rollbackColumnTail`)
```javascript
function isAnyHeadingElement(el) {
    if (!el || el.tagName !== 'DIV') return false;
    const c = el.className || '';
    return c.indexOf('title-level-') !== -1 || c.indexOf('title-level-custom') !== -1;
}

function rollbackColumnTail(col, colWidth, styleObj, onRollback) {
    if (!col || col.children.length === 0) return false;
    let anyChanged = false;
    let changed = true;

    while (changed && col.children.length > 0) {
        changed = false;
        const lastEl = col.lastElementChild;
        if (!lastEl) break;

        // כלל 1: שום כותרת אינה יכולה להיות האלמנט המסיים של טור
        if (isAnyHeadingElement(lastEl)) {
            const hId = lastEl.getAttribute('data-token-id');
            col.removeChild(lastEl);
            if (onRollback) onRollback({ type: 'h', id: hId, elem: lastEl });
            changed = true;
            anyChanged = true;
            continue;
        }

        // כלל 2: אימות פסקאות
        if (lastEl.tagName === 'P') {
            const prevEl = lastEl.previousElementSibling;
            const pRaw = lastEl.getAttribute('data-raw-text') || lastEl.textContent || '';
            const isCont = lastEl.getAttribute('data-is-cont') === 'true';
            const linesInfo = getLinesFromParagraph(pRaw, colWidth, styleObj, !isCont);
            const lineCount = linesInfo.lines.length;

            // כלל 2א: פסקה שאחרי כותרת חייבת לפחות 2 שורות
            if (prevEl && isAnyHeadingElement(prevEl) && lineCount < 2) {
                const pId = lastEl.getAttribute('data-token-id');
                col.removeChild(lastEl);
                if (onRollback) onRollback({ type: 'p', id: pId, elem: lastEl, rawText: pRaw, linesInfo });
                changed = true;
                anyChanged = true;
                continue; // באיטרציה הבאה תוסר הכותרת שנחשפה
            }

            // כלל 2ב: פסקה מקוטעת חייבת לפחות 2 שורות
            if (lastEl.classList.contains('p-cut') && lineCount < 2) {
                const pId = lastEl.getAttribute('data-token-id');
                col.removeChild(lastEl);
                if (onRollback) onRollback({ type: 'p', id: pId, elem: lastEl, rawText: pRaw, linesInfo });
                changed = true;
                anyChanged = true;
                continue;
            }
        }
    }
    return anyChanged;
}
```

---

#### ד. מנוע יישור 5 רמות מכויל ללא Overshoot (`distributeColumnJustification`)
```javascript
function distributeColumnJustification(shortCol, neededGrowth, styleObj, targetCeiling, colWidth, traceObj = null) {
    if (!shortCol || neededGrowth <= 1) return 0;

    let remaining = neededGrowth;
    const logDetails = { neededGrowth, targetCeiling, tiersApplied: {} };

    function colOverCeiling() {
        return targetCeiling < Infinity && shortCol.scrollHeight > targetCeiling + 0.5;
    }

    function queryHeadings() {
        return Array.from(shortCol.querySelectorAll('.title-level-3, .title-level-4, .title-level-5, .title-level-6, .title-level-custom'))
            .filter(isInlineHeadingLevel3456);
    }

    // עדיפות 1: רווח לפני כותרות
    function applyPriority1_HeadingBefore(budget) {
        const headings = queryHeadings().filter(h => h !== shortCol.firstElementChild);
        if (!headings.length || budget <= 0.5) return 0;
        const perHead = Math.min(20, budget / headings.length);
        let applied = 0;
        headings.forEach(h => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perHead, budget - applied);
            const base = parseFloat(window.getComputedStyle(h).marginTop) || 0;
            const prev = h.style.marginTop;
            const delta = measureColScrollDelta(shortCol, () => {
                h.style.marginTop = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                h.style.marginTop = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority1_headingBefore'] = (logDetails.tiersApplied['priority1_headingBefore'] || 0) + applied;
        return applied;
    }

    // עדיפות 2: רווח אחרי כותרות
    function applyPriority2_HeadingAfter(budget) {
        const headings = queryHeadings();
        if (!headings.length || budget <= 0.5) return 0;
        const perHead = Math.min(16, budget / headings.length);
        let applied = 0;
        headings.forEach(h => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perHead, budget - applied);
            const base = parseFloat(window.getComputedStyle(h).marginBottom) || 0;
            const prev = h.style.marginBottom;
            const delta = measureColScrollDelta(shortCol, () => {
                h.style.marginBottom = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                h.style.marginBottom = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority2_headingAfter'] = (logDetails.tiersApplied['priority2_headingAfter'] || 0) + applied;
        return applied;
    }

    // עדיפות 3: רווח בין פסקאות
    function applyPriority3_ParagraphSpacing(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        if (pElements.length < 2 || budget <= 0.5) return 0;
        const perGap = Math.min(22, budget / (pElements.length - 1));
        let applied = 0;
        pElements.slice(0, -1).forEach(p => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perGap, budget - applied);
            const base = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
            const prev = p.style.marginBottom;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.marginBottom = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                p.style.marginBottom = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority3_paragraphSpacing'] = (logDetails.tiersApplied['priority3_paragraphSpacing'] || 0) + applied;
        return applied;
    }

    // עדיפות 4: רווח שורות עדין
    function applyPriority4_LineHeight(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        if (!pElements.length || budget <= 0.5) return 0;
        const baseLh = parseFloat(styleObj.lineHeight) || 1.34;
        const fontSizePx = parseFloat(styleObj.fontSize) * 1.333 || 15;
        let applied = 0;
        pElements.forEach(p => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const linesInfo = getLinesFromParagraph(
                p.getAttribute('data-raw-text') || p.textContent,
                colWidth || shortCol.offsetWidth,
                styleObj,
                false
            );
            const n = Math.max(1, linesInfo.lines.length);
            const extraLh = Math.min((budget - applied) / n / fontSizePx, 0.08);
            if (extraLh <= 0.001) return;
            const prev = p.style.lineHeight;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.lineHeight = (baseLh + extraLh).toString();
            });
            if (colOverCeiling()) {
                p.style.lineHeight = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority4_lineHeight'] = (logDetails.tiersApplied['priority4_lineHeight'] || 0) + applied;
        return applied;
    }

    // עדיפות 5: סגירה מיקרו-טיפוגרפית (תומכת גם בפסקה יחידה בטור)
    function applyPriority5_FineSpacingClosure(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        if (!pElements.length || budget <= 0.2) return 0;
        const currentDeficit = targetCeiling - shortCol.scrollHeight;
        if (currentDeficit <= 0.2) return 0;

        let applied = 0;
        if (pElements.length >= 2) {
            const perGap = currentDeficit / (pElements.length - 1);
            pElements.slice(0, -1).forEach(p => {
                if (colOverCeiling()) return;
                const currentMb = parseFloat(p.style.marginBottom) || parseFloat(window.getComputedStyle(p).marginBottom) || 7;
                const delta = measureColScrollDelta(shortCol, () => {
                    p.style.marginBottom = (currentMb + perGap) + 'px';
                });
                if (colOverCeiling()) {
                    p.style.marginBottom = currentMb + 'px';
                } else {
                    applied += delta;
                }
            });
        } else if (pElements.length === 1) {
            const p = pElements[0];
            const currentMb = parseFloat(p.style.marginBottom) || 7;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.marginBottom = (currentMb + currentDeficit) + 'px';
            });
            if (colOverCeiling()) {
                p.style.marginBottom = currentMb + 'px';
            } else {
                applied += delta;
            }
        }

        logDetails.tiersApplied['priority5_fineSpacing'] = (logDetails.tiersApplied['priority5_fineSpacing'] || 0) + applied;
        return applied;
    }

    const priorityTiers = [
        { name: 'P1 (רווח לפני כותרת)', fn: applyPriority1_HeadingBefore, weight: 6 },
        { name: 'P2 (רווח אחרי כותרת)', fn: applyPriority2_HeadingAfter, weight: 4 },
        { name: 'P3 (רווח פסקאות)', fn: applyPriority3_ParagraphSpacing, weight: 5 },
        { name: 'P4 (רווח שורות)', fn: applyPriority4_LineHeight, weight: 2 },
        { name: 'P5 (סגירה מדויקת)', fn: applyPriority5_FineSpacingClosure, weight: 4 }
    ];

    const totalWeight = priorityTiers.reduce((acc, t) => acc + t.weight, 0);

    for (const tier of priorityTiers) {
        if (remaining <= 0.5 || colOverCeiling()) break;
        const share = remaining * (tier.weight / totalWeight);
        const gained = tier.fn(share);
        remaining -= gained;
    }

    for (const tier of priorityTiers) {
        if (remaining <= 0.5 || colOverCeiling()) break;
        const gained = tier.fn(remaining);
        remaining -= gained;
    }

    if (shortCol.scrollHeight < targetCeiling - 0.5) {
        applyPriority5_FineSpacingClosure(targetCeiling - shortCol.scrollHeight);
    }

    if (traceObj) {
        traceObj.justificationLog = logDetails;
    }

    return neededGrowth - remaining;
}
```

---

#### ה. לולאת בקרה סגורה ב-DOM לאחר הרינדור (`postRenderColumnAuditAndReconcile`)
```javascript
function postRenderColumnAuditAndReconcile(block, bodyFlow, pageEl, budget) {
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return;

    // 1. נטרול כל wordSpacing שיוצר עיוות
    [rCol, lCol].forEach(col => {
        col.querySelectorAll('p').forEach(p => {
            if (p.style.wordSpacing) {
                p.style.wordSpacing = '';
            }
        });
    });

    // 2. בדיקה סופית ואיזון מוחלט (עד 0px) ב-DOM החי
    let diff = rCol.scrollHeight - lCol.scrollHeight;
    if (Math.abs(diff) > 1 && Math.abs(diff) <= 60) {
        const shortCol = diff > 0 ? lCol : rCol;
        const targetH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
        if (targetH <= budget + 2) {
            const ps = Array.from(shortCol.querySelectorAll('p'));
            const deficit = targetH - shortCol.scrollHeight;
            if (deficit > 0.5) {
                if (ps.length >= 2) {
                    const extraPerGap = deficit / (ps.length - 1);
                    ps.slice(0, -1).forEach(p => {
                        const curMb = parseFloat(p.style.marginBottom) || parseFloat(window.getComputedStyle(p).marginBottom) || 7;
                        p.style.marginBottom = (curMb + extraPerGap) + 'px';
                    });
                } else if (ps.length === 1) {
                    const p = ps[0];
                    const curLh = parseFloat(p.style.lineHeight) || 1.34;
                    const linesCount = Math.max(1, Math.round(p.offsetHeight / 21));
                    const extraLh = deficit / (linesCount * 16);
                    if (extraLh <= 0.18) {
                        p.style.lineHeight = (curLh + extraLh).toFixed(3);
                    } else {
                        const curMb = parseFloat(p.style.marginBottom) || 7;
                        p.style.marginBottom = (curMb + deficit) + 'px';
                    }
                }
            }
        }
    }

    // 3. אימות סופי לשומרי כותרות
    [rCol, lCol].forEach(col => {
        const lastEl = col.lastElementChild;
        if (!lastEl) return;
        if (isAnyHeadingElement(lastEl)) {
            col.removeChild(lastEl);
        }
    });
}
```

---

#### ו. מנוע אריזה בינארי עצמאי לקובצי ZIP בזיכרון (`createZip`)
```javascript
function createZip(files) {
    const textEncoder = new TextEncoder();
    const crcTable = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        crcTable[i] = c >>> 0;
    }
    function crc32(buf) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    const localHeaders = [];
    const centralHeaders = [];
    let offset = 0;

    for (const f of files) {
        const nameBytes = textEncoder.encode(f.name);
        const dataBytes = typeof f.content === 'string' ? textEncoder.encode(f.content) : new Uint8Array(f.content);
        const crc = crc32(dataBytes);
        const size = dataBytes.length;

        // Local Header (30 Bytes + Filename)
        const lh = new Uint8Array(30 + nameBytes.length);
        const dv = new DataView(lh.buffer);
        dv.setUint32(0, 0x04034b50, true);
        dv.setUint16(4, 20, true);
        dv.setUint16(6, 0x0800, true); // UTF-8 Flag
        dv.setUint16(8, 0, true);      // Store mode
        dv.setUint16(10, 0, true);
        dv.setUint16(12, 0, true);
        dv.setUint32(14, crc, true);
        dv.setUint32(18, size, true);
        dv.setUint32(22, size, true);
        dv.setUint16(26, nameBytes.length, true);
        dv.setUint16(28, 0, true);
        lh.set(nameBytes, 30);

        localHeaders.push(lh, dataBytes);

        // Central Directory Header (46 Bytes + Filename)
        const ch = new Uint8Array(46 + nameBytes.length);
        const cdv = new DataView(ch.buffer);
        cdv.setUint32(0, 0x02014b50, true);
        cdv.setUint16(4, 20, true);
        cdv.setUint16(6, 20, true);
        cdv.setUint16(8, 0x0800, true);
        cdv.setUint16(10, 0, true);
        cdv.setUint16(12, 0, true);
        cdv.setUint16(14, 0, true);
        cdv.setUint32(16, crc, true);
        cdv.setUint32(20, size, true);
        cdv.setUint32(24, size, true);
        cdv.setUint16(28, nameBytes.length, true);
        cdv.setUint16(30, 0, true);
        cdv.setUint16(32, 0, true);
        cdv.setUint16(34, 0, true);
        cdv.setUint16(36, 0, true);
        cdv.setUint32(38, 0, true);
        cdv.setUint32(42, offset, true);
        ch.set(nameBytes, 46);

        centralHeaders.push(ch);
        offset += lh.length + dataBytes.length;
    }

    const cdOffset = offset;
    let cdSize = 0;
    for (const ch of centralHeaders) cdSize += ch.length;

    // End of Central Directory Record (22 Bytes)
    const eocd = new Uint8Array(22);
    const edv = new DataView(eocd.buffer);
    edv.setUint32(0, 0x06054b50, true);
    edv.setUint16(4, 0, true);
    edv.setUint16(6, 0, true);
    edv.setUint16(8, files.length, true);
    edv.setUint16(10, files.length, true);
    edv.setUint32(12, cdSize, true);
    edv.setUint32(16, cdOffset, true);
    edv.setUint16(20, 0, true);

    return new Blob([...localHeaders, ...centralHeaders, eocd], { type: 'application/zip' });
}
```

---

## 5. מקרי קצה, אבטחה וביצועים (Master Edge Cases & Constraints)

### 5.1 מטריצת מקרי הקצה המאוחדת

| מזהה | מקרה קצה (Edge Case) | אופי האתגר הטיפוגרפי | פתרון מיושם ומאומת במערכת |
| :--- | :--- | :--- | :--- |
| **EC-01** | **הערת שוליים ארוכה במיוחד (12 שורות / 220px)** | מצמצמת את תקציב הדף מ-870px ל-650px; הטקסט עלול לגלוש ולדרוס את הקו המפריד ב-125px (דף 47). | שריון מראש של גובה ההערה (`measureFootnoteAreaReserve`), קנס חריגה קשיח של 5000 לכל פיקסל חורג, ופליטת עודפי טור שמאל לעמוד הבא. |
| **EC-02** | **טור בעל פסקה יחידה לפני כותרת רוחבית** | פער של 40px (עמוד 13) או 21px (עמוד 31) נותר ללא מענה עקב דילוג על טורים עם פחות מ-2 פסקאות. | ענף ייעודי לפסקה יחידה ב-Tier 5 וב-`postRenderColumnAuditAndReconcile` המתאים `lineHeight` ושוליים לפסקה הבודדת. פער 0px מוחלט. |
| **EC-03** | **חריגת יתר (Overshoot) ביישור אנכי** | תוספת שורה ע"י `word-spacing` מגדילה טור ב-21.4px במקום ב-11px, וגורמת לטור הקצר להיות גבוה ב-10px (עמוד 58). | ביטול מוחלט של שבירת שורות חדשות במסגרת יישור אנכי; שימוש בלעדי בריווח אלסטי רציף ומדידת תקרה קשיחה. |
| **EC-04** | **פסקת המשך בראש עמוד שאינה Continuation** | פסקה שנדחפה בשלמותה (0 שורות נשארו בעמוד קודם) סומנה כ-`true` ואיבדה את חלון הפתיח והערת הצד שלה (עמוד 49). | התנאי שודרג: `isContinuation` מוגדר `true` רק אם מספר השורות שנותרו קטן ממספר השורות המקורי של הפסקה. חלון הפתיח והערת הצד משוחזרים במלואם. |
| **EC-05** | **כותרת יתומה בעקבות קיטוע עודפים** | קיטוע שורות העביר את הפסקה לעמוד הבא והותיר כותרת סעיף בודדת בשורה התחתונה של טור ימין (עמוד 35). | מנגנון נסיגה מפלתי מחזורי (`rollbackColumnTail`) המזהה כותרת בסוף טור ומסיג אותה יחד עם פסקתה. |
| **EC-06** | **סוגרי הערת שוליים `[...]` על קו חיתוך** | חיתוך שורה חוצה הערת שוליים באמצע הסוגריים, מה שגורם לקריעת ההערה והיעלמותה. | פונקציית `adjustFitLineForNoteSpans` מזהה חפיפה להיסט התווים ומסיגה את החיתוך לפני פתיחת הסוגריים. |
| **EC-07** | **שם ספר בעל מספר מילים אי-זוגי בכותרת עליונה** | חלוקת מילים רגילה השאירה מילה בודדת בצד אחד ומחרוזת ארוכה בצד שני. | חלוקת תקרה ($\lceil N/2 \rceil$) המעבירה את המילה המרכזית לטור הימני ומאזנת ויזואלית בין עמוד ימין לשמאל. |
| **EC-08** | **כותרות צד מרובות סמוכות (כותרת 7)** | שתי פסקאות קצרות סמוכות גורמות להערות הצד לעלות זו על זו בשוליים. | `finalizeNotePositions` סורקת את ההערות, דוחפת מטה עם רווח של 6px, ומעבירה לטור הבא אם אזור השוליים מוצה. |
| **EC-09** | **ספר המתחיל בכרך ב' (מספור שרירותי פ"ז / 87)** | המערכת מתחילה תמיד מ-1 (עמוד א') ומחייבת יצירת עשרות עמודים פיקטיביים. | שדה `#page-num-initial-value` משולב בנוסחה: $\text{EffectivePage} = \text{CurrentPage} - \text{StartIdx} + \text{InitialVal}$. |
| **EC-10** | **שורה מסיימת בת מילה אחת (Runt)** | מילה בודדת נותרת בסוף טור ימין לפני מעבר לשמאל ונמתחת בצורה מעוותת. | מנגנון Runt Prevention מושך מילה שלמה מהשורה הקודמת (אם יש בה $\ge 3$ מילים) לשורה האחרונה ללא איבוד אף אות. |

---

### 5.2 היבטי אבטחה (Security Architecture)
1. **Zero-Backend Execution:** היעדר מוחלט של שרת עיבוד מונע וקטורי התקפה מסוג Server-Side Request Forgery (SSRF), Remote Code Execution (RCE) או הדלפת מסמכים סודיים ברשת. כל המידע נשאר בזיכרון ה-RAM של דפדפן המשתמש.
2. **Local Protocol Sandbox Isolation:** נטרול מוחלט של תלויות `fetch()` בפרוטוקול `file:///`. המערכת עמידה לחסימות CORS של דפדפנים מודרניים.
3. **סניטציית קלט וטוקניזציה נקייה:** טקסט המקור מעובד דרך מנוע ה-Tokenizer תוך המרת תווים מיוחדים ומניעת הזרקת סקריפטים (XSS) דרך תגיות Markup מותאמות.

---

### 5.3 ביצועים וסיבוכיות (Complexity & Performance Metrics)
- **סיבוכיות זמן (Time Complexity):**
  - טוקניזציה ומדידת שורות: $O(N)$ כאשר $N$ הוא מספר המילים במסמך.
  - איזון טורים (`balanceColumns`): $O(K)$ כאשר $K$ הוא מספר נקודות הפיצול האפשריות בבלוק (בדרך כלל $K \le 40$).
  - עימוד המסמך כולו: $O(P)$ כאשר $P$ הוא מספר הפסקאות.
- **סיבוכיות מקום (Space Complexity):** $O(N)$ בזיכרון הדפדפן להחזקת מודל הטוקנים ועץ ה-DOM של הדפים.
- **ביצועים שנמדדו בפועל:** מסמך בדיקה מלא בן 1,014 שורות, 303 הערות שוליים ו-85 עמודי A4 מעומד במלואו בתוך פחות מ-**900 מילי-שניות** בדפדפן Chromium סטנדרטי.
- **מניעת Layout Thrashing:** כל מדידה ב-`#measuring-box` מבודדת לחלוטין מעץ הדפים הפעיל, ונמנע ביצוע Force Reflow בלולאות פנימיות.

---

## 6. תוכנית עבודה והצעדים הבאים (Master Roadmap)

### 6.1 יעדים הנדסיים לשלבים הבאים

```
┌────────────────────────────────────────────────────────────────────────┐
│                        מפת דרכים לפיתוח עתידי                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. פיצול הערות שוליים בין עמודים (Footnote Continuation Across Pages)   │
│    - שבירת גוף הערת שוליים ארוכה בין עמוד המקור לתחתית העמוד הבא.     │
│    - סימון מסורתי: "(המשך מעמוד פלוני בעמוד הבא)".                    │
├────────────────────────────────────────────────────────────────────────┤
│ 2. מנוע פריסה צורני רב-שכבתי ("צורת הדף" / שולחן ערוך / ש"ס וילנא)    │
│    - טקסט ראשי במרכז מוקף בשני מפרשים מקבילים ברוחב משתנה.            │
│    - חישוב עטיפת פוליגונים (Polygon Exclusion Paths / CSS Shapes).     │
├────────────────────────────────────────────────────────────────────────┤
│ 3. אותיות מתרחבות באמצעות OpenType Justification Alternates (`jalt`)  │
│    - החלפת ריווח מילים מלאכותי בהרחבת אותיות עבריות מסורתיות          │
│      (א, ד, ה, כ, ל, ם, ר, ת) בגופנים תומכים.                         │
├────────────────────────────────────────────────────────────────────────┤
│ 4. האצת מדידות ב-Web Worker באמצעות OffscreenCanvas                   │
│    - העברת פירוק השורות ומדידת הטקסט מחוץ ל-Main Thread.              │
│    - עימוד מסמכי ענק של 500+ עמודים ללא שום שיהוי ב-UI.                │
├────────────────────────────────────────────────────────────────────────┤
│ 5. ייצוא ישיר ל-PDF/X-1a וקטורי לדפוס תעשייתי                          │
│    - הפקת קובץ PDF ישיר ברזולוציית 300 DPI עם פרופילי CMYK,           │
│      בליד (Bleed 3mm) וסימוני חיתוך (Crop Marks).                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 6.2 הנחיות קריטיות למהנדס / AI הבא שימשיך את הפיתוח

> **חוקי ברזל להמשך תחזוקה ופיתוח:**
>
> 1. **שמירה על מבנה 5 הקבצים:** לעולם אין לאחד את הקבצים לקובץ מונוליטי בודד. יש לשמר בקפדנות את ההפרדה בין `typesetter.js`, `decorations.js`, `app.js`, `style.css` ו-`index.html`.
> 2. **קדושת שלמות הטקסט (Text Integrity is Sacred):** לעולם, בשום אופן, אין לקצר, לאחד או לשנות איברים במערך המילים הגולמי (`words`) בתוך `getLinesFromParagraph`. כל שינוי במערך זה יוצר חוסר התאמה לאינדקסים של תיבת המדידה הנסתרת וימחק את המילים האחרונות של הפסקאות בספר (כפי שאירע בכשל מס' 1 בסעיף 3).
> 3. **איסור שבירת שורות במסגרת יישור אנכי:** אין להשתמש ב-`wordSpacing` כדי לפרוץ שורות חדשות לצורך סגירת פער אנכי בטורים. שבירת שורה מוסיפה גובה בדיד של ~21.5px ויוצרת מילים יתומות (Runts) וחריגות Overshoot הרסניות. יש להשתמש אך ורק במתיחה רציפה של שולי פסקאות, רווחי כותרות ומיקרו-ריווח שורות (`lineHeight`).
> 4. **שמירה על `align-items: start !important` ב-CSS:** לעולם אין להסיר או לשנות הגדרה זו ב-`.block-2col`. חזרה ל-`stretch` תפעיל מחדש את באג ה-Grid Stretch שיקפיא את חישובי ה-`scrollHeight` וישבית את אלגוריתם האיזון.
> 5. **איסור הפעלת `balanceColumns` בעמודים שוטפים:** אלגוריתם איזון הטורים מיועד אך ורק לסיום פרק מוחלט או לפני כותרת רוחבית (`span_1col`). הפעלתו באמצע עמוד שוטף תהפוך את סדר הקריאה בין ימין לשמאל ותשבור את רצף הפסקאות.
> 6. **תחזוקת אלגוריתם הנסיגה המפלתי (`rollbackColumnTail`):** כל שינוי בעתיד בלוגיקת חיתוך טקסט או מילוי עמודות חייב להישאר מחובר ללולאת הנסיגה המחזורית. אין להסתפק בהסרה נקודתית של אלמנט ללא אימות מפלתי של האלמנטים שקדמו לו.

---

## 📊 סיכום שיחה

- **סה"כ הודעות:** 4
- **פניות משתמש:** 2
- **תגובות AI:** 2
- **מודל:** `models/gemini-3.8-flash`
- **תאריך:** 2026-10-06
