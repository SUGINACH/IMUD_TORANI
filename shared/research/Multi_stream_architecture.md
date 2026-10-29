---
title: "מסמך ארכיטקטורה — מנוע עימוד תורני רב-ערוצי מאפס"
date: unknown
version: shared
type: research
source: shared
---

מסמך ארכיטקטורה זה מפרט את ה-Lifecycle, מבני הנתונים והאלגוריתמים הנדרשים לבניית מנוע עימוד תורני רב-ערוצי (Multi-stream Synchronized Typesetting Engine) מאפס, המיושם ב-Python או ב-Node.js/TypeScript.

---

# 1. פונקציות הליבה של מנוע העימוד (Core Engine Functions)

המנוע מבוסס על הרחבה דו-ממדית של מודל ה-Boxes, Glue & Penalties של דונלד קנות' (TeX), המותאם למספר תזרימי טקסט מקבילים הנקשרים על ידי עוגנים (Anchors) וצורניות משתנה (Non-rectangular Shapes).

```
+-----------------------------------------------------------------------+
|                         Text Streams + Fonts                          |
+-----------------------------------------------------------------------+
                                   |
                                   v
                   +-------------------------------+
                   | 1.1 TokenizeAndMeasureStream  |
                   +-------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|          Trial Loop: Candidate Page Layout (Pass k)                   |
|                                                                       |
|  +---------------------------+        +----------------------------+  |
|  | 1.4 DeriveStreamGeometries|<-------| 1.2 BreakStreamLinesOptimal|  |
|  +---------------------------+        +----------------------------+  |
|               |                                      ^                |
|               v                                      |                |
|  +---------------------------+                       |                |
|  | 1.3 ResolveAnchorsForSlice|                       |                |
|  +---------------------------+                       |                |
|               |                                      |                |
|               v                                      |                |
|  +---------------------------+                       |                |
|  | 1.5 EvaluatePageConstraints|-----------------------+                |
|  +---------------------------+ (If badness > threshold: Adjust Cuts)  |
+-----------------------------------------------------------------------+
                                   | (Equilibrium Reached)
                                   v
                   +-------------------------------+
                   | 1.6 JustifyAndExpandLine      |
                   +-------------------------------+
                                   |
                                   v
                   +-------------------------------+
                   | 1.7 AssembleAndRenderPage     |
                   +-------------------------------+
```

### 1.1 `TokenizeAndMeasureStream`
* **תפקיד:** פירוק מחרוזת המקור (כולל תגיות עיצוב, ניקוד, טעמים ועוגנים) לרצף של צמתים טיפוגרפיים תוך שאילתת Font Metrics (באמצעות HarfBuzz או FreeType/OpenType.js).
* **קלט:** 
  * `rawText`: מחרוזת טקסט גולמית.
  * `fontMetricsProvider`: ממשק למדידת רוחב גליפים, גובה (Ascent/Descent) וליגטורות לפי גופן ומשקל.
  * `hyphenationOrStretchRules`: הגדרות אותיות מתרחבות (אותיות אהלמ"ת) וחוקי ריווח.
* **פלט:** רשימה ליניארית של צמתים טיפוגרפיים: `Box` (גליף או מילה קשיחה), `Glue` (רווח אלסטי: רוחב בסיס, יכולת מתיחה ויכולת כיווץ), `Penalty` (נקודות שבירה מועדפות או אסורות), ו-`AnchorDef` (נקודת צימוד לפירוש/הערה).

### 1.2 `BreakStreamLinesOptimal`
* **תפקיד:** שבירת פסקאות לשורות אופטימליות עבור מעטפת גיאומטרית נתונה (שיכולה להיות שונה מרוחב קבוע, למשל צורת "ר" או עמודה מדורגת), תוך שימוש באלגוריתם Knuth-Plass לתכנות דינמי.
* **קלט:**
  * `nodeList`: רצף הצמתים שיצא מ-`TokenizeAndMeasureStream`.
  * `geometryProfile`: פונקציה $W(y)$ המגדירה את הרוחב והמיקום האופקי הזמין עבור כל שורה $y$.
  * `tolerance`: מקדם קנס מקסימלי (Badness / Demerits) לשורה.
* **פלט:** מערך של אובייקטי `LineBox` (שורות לא מיושרות סופית), כאשר כל שורה כוללת את רשימת הצמתים שלה, רוחב טבעי, כמות המתיחה/כיווץ הנדרשת, ומדד ה-Demerits שלה.

### 1.3 `ResolveAnchorsForSlice`
* **תפקיד:** סריקת שורות הטקסט הראשי המיועדות להיכנס לעמוד, זיהוי כל העוגנים המוכלים בהן, וגזירת טווח הטקסט (Token Range) הנדרש בכל אחד מתזרימי המפרשים וההערות.
* **קלט:**
  * `mainLinesSlice`: חתך שורות הטקסט הראשי הנבדק עבור העמוד הנוכחי.
  * `streamCursors`: מצביעים למיקום הנוכחי שטרם עומד בכל אחד מתזרימי המפרשים.
* **פלט:** מפה של `AnchorSyncMap` המגדירה לכל מפרש $S_i$: נקודת התחלה (`startToken`), נקודת יעד הכרחית בעמוד (`mustIncludeToken`), ונקודת סיום אופציונלית (`canIncludeToken`).

### 1.4 `DeriveStreamGeometries`
* **תפקיד:** חישוב המבנה הגאומטרי והתיחום (Bounding Boxes / Polygons) של כל אזור בעמוד בהתבסס על גובה הטקסט הראשי שנבחר בניסוי הנוכחי וכללי הגריד (למשל: צורת הדף שבה שורות הגמרא תופסות שטח מרכזי, ורש"י ותוספות ממלאים את השטחים הצדדיים והתחתונים).
* **קלט:**
  * `mainBlockHeight`: הגובה המצטבר של הטקסט הראשי בניסוי הנוכחי.
  * `pageTemplate`: תבנית העמוד (שוליים, עמודות, גדלי מרווחים בין בלוקים).
  * `activeStreams`: רשימת המפרשים שדורשים מקום בעמוד הנוכחי.
* **פלט:** `Map<StreamId, GeometryProfile>` המגדיר לכל מפרש את קווי הרוחב הזמינים עבורו לפי קואורדינטת $y$.

### 1.5 `EvaluatePageConstraints`
* **תפקיד:** פונקציית הערכת איכות (Cost Function / Loss) הבוחנת האם חלוקת השורות הנוכחית בין הראשי למפרשים יוצרת עמוד מאוזן, חוקי ונטול התנגשויות.
* **קלט:**
  * `trialLayout`: אובייקט המכיל את כל ה-`LineBoxes` של כל התזרימים בעמוד הנוכחי.
  * `pageBounds`: גובה העמוד הזמין וגבולות השוליים.
  * `constraints`: חוקי יתומות ואלמנות (Widow/Orphan), איסור שורת פירוש ללא עוגן מתאים, גובה מילוי מינימלי/מקסימלי לעמוד.
* **פלט:** `ConstraintEvaluationResult` הכולל:
  * `isFeasible`: בוליאני (האם העמוד חוקי לחלוטין).
  * `verticalDelta`: סטיית הגובה (הפרש מפיקסלים/נקודות של שיווי משקל).
  * `totalBadness`: ציון עונש משוקלל המשלב קשיי יישור, חריגות מקום ושבירות לא אידיאליות.

### 1.6 `JustifyAndExpandLine`
* **תפקיד:** יישור סופי של שורה בודדת לגבולות הבלוק. בעברית תורנית: אם הרווחים האלסטיים בין המילים מגיעים לתקרה (קנס מתיחה גבוה), הפונקציה מפעילה מתיחת אותיות (אותיות מתרחבות אהלמ"ת) באמצעות החלפת גליפים (OpenType Glyph Substitution) או מתיחת רכיבי שלד (Glyph Stem Extension).
* **קלט:**
  * `lineBox`: שורה נבחרת עם נתוני המתיחה המבוקשים.
  * `targetWidth`: הרוחב המדויק הנדרש עבור שורה זו.
  * `expansionConfig`: מדיניות השימוש באותיות מתרחבות (מקסימום אותיות מורחבות בשורה, סדר עדיפויות של האותיות).
* **פלט:** `JustifiedLineBox` שבו לכל גליף יש היסט אופקי ($x$) אבסולוטי ביחס לשורה, והרווחים והאותיות המתרחבות מקובעים סופית.

### 1.7 `AssembleAndRenderPage`
* **תפקיד:** קביעת קואורדינטות $(x, y)$ גלובליות לכל שורה וגליף, הוספת כותרות עליונות/תחתונות (Running Headers), מחיצות הפרדה (Rules/Borders בין הראשי למפרש) וייצוא למבנה ביניים (Display List / PDF / SVG primitives).
* **קלט:**
  * `pagePlan`: כל הבלוקים והשורות המיושרות שאושרו בשלב ה-Equilibrium.
  * `decorationRules`: הגדרות קווי הפרדה גרפיים, מספור עמודים וכותרות דינמיות.
* **פלט:** `PageRenderCommands` (אובייקט קואורדינטות סופי מוכן לרינדור).

---

# 2. סדר הקריאה (Pipeline Architecture)

הארכיטקטורה בנויה משלוש רמות הפשטה ומחזורי חיים היררכיים:

```
[ ספר שלם (Book Scope) ]
   |
   +--> 1. AST Parsing & Stream Normalization
   +--> 2. Global Indexing (בניית טבלת עוגנים חוצת-ספר)
   +--> 3. Chapter Partitioning
   |
   V
[ פרק בודד (Chapter Scope) ]
   |
   +--> 4. Stream Tokenization & Font Measurement (מקבילי לכל התזרימים)
   +--> 5. Build Dependency DAG (מיפוי עוגנים לטקסט מפרש)
   +--> 6. Sequential Page Accumulation (לולאת עמודים עד לסיום תוכן הפרק)
   |
   V
[ עמוד בודד (Page Scope Lifecycle) ]
   |
   +--> (Pass 1) הערכת שטח בסיסית וקביעת גובה משוער לראשי
   +--> (Pass 2..N) לולאת רלקסציה ואיזון (Equilibrium Relaxation Loop):
   |       |-- DeriveStreamGeometries
   |       |-- BreakStreamLinesOptimal (עבור ראשי ומפרשים לפי גיאומטריה נוכחית)
   |       |-- ResolveAnchorsForSlice (בדיקת התאמת עוגנים לשורות מפרש)
   |       |-- EvaluatePageConstraints & Adjust Line Cuts
   +--> (Finalization) JustifyAndExpandLine (יישור שורות באמצעות אותיות מתרחבות)
   +--> (Assembly) קביעת קואורדינטות אבסולוטיות והוספת גרפיקה
```

### פירוט השלבים לפי סדר ביצוע:

1. **שלב ה-Book Scope:**
   * קליטת הקבצים המפורסרים (JSON/XML/Text).
   * יצירת טבלת עוגנים גלובלית: מיפוי מזהי עוגנים ייחודיים המקשרים מקטעים בראשי לקטעי פירוש מקבילים.
   * חלוקת הספר לפרקים/מקטעים שביניהם יש אילוץ איפוס (Hard Page Break).

2. **שלב ה-Chapter Scope:**
   * הפעלת `TokenizeAndMeasureStream` עבור כל תזרימי הפרק. צעד זה מבוצע **פעם אחת בלבד לכל מילה/גליף**; התוצאות נשמרות במטמון (Cache) של אובייקטי `Box` ו-`Glue` לצורך מדידות מהירות בהמשך.
   * הקמת מבנה נתונים מסוג Directed Acyclic Graph (DAG) של תלויות: כל צומת הוא עוגן שמחזיק מצביע לטווח הטקסט שהוא פותח בתזרים המפרש המשויך.

3. **שלב ה-Page Scope (המחזור הקריטי):**
   * **אתחול:** קביעת סמני הקריאה (Cursors) למיקום הטקסט שטרם עומד בראשי ובמפרשים.
   * **השערה גיאומטרית (Initial Hypothesis):** המנוע מנחש יחס שטח (למשל: 50% מהגובה לטקסט הראשי, 50% למפרשים).
   * **חיתוך טיוטה ראשי (Trial Main Cut):** שבירת שורות של הטקסט הראשי בתוך הגובה המשוער באמצעות `BreakStreamLinesOptimal`.
   * **חילוץ אילוצי מפרש:** סריקת שורות הראשי שנכנסו בניסוי, זיהוי העוגנים שבהן וגזירת נפח המפרש המינימלי והמקסימלי הנדרש בעמוד דרך `ResolveAnchorsForSlice`.
   * **עדכון גיאומטריה:** הרצת `DeriveStreamGeometries` המחשב מחדש את הצורה והשטח הפנוי לכל מפרש.
   * **חיתוך טיוטה מפרשים:** הרצת `BreakStreamLinesOptimal` עבור כל מפרש בתוך הפרופיל הגיאומטרי שנגזר עבורו.
   * **חישוב שגיאה (Evaluation):** הפעלת `EvaluatePageConstraints`. נבדקות שלוש תוצאות אפשריות:
     * *עודף שטח (Underfull):* הטקסטים אינם ממלאים את העמוד.
     * *חוסר שטח (Overfull / Collision):* המפרשים גולשים מעבר לגבולות העמוד או דורשים שטח שגוזל מקום מהטקסט הראשי.
     * *הפרת עוגן (Anchor Lag):* עוגן של שורה ראשית מסוימת נמצא בעמוד, אך שורות הפירוש שלו לא הספיקו להתחיל בעמוד זה ונדחקו לעמוד הבא (מצב אסור ברוב הסגנונות התורניים).
   * **רלקסציה / שינוי חיתוך (Relaxation Step):** הזזת סמן החיתוך של הטקסט הראשי (הוספה או החסרה של שורה/שורות) והרצה חוזרת של הלולאה.
   * **נעילה (Equilibrium Lock):** כאשר נמצא המצב הממזער את שגיאת השטח והקנסות, המנוע נועל את רשימת השורות של העמוד.
   * **יישור סופי (Justification):** קריאה ל-`JustifyAndExpandLine` רק עבור השורות שאושרו לעמוד.
   * **רינדור (Assembly):** קביעת $(x,y)$ גלובליים ושמירת העמוד. התקדמות ה-Cursors לשלב הבא.

---

# 3. ריבוי מעברים (Multi-pass Rendering) ומספר קריאות

האתגר המרכזי בעימוד תורני הוא תלות מעגלית דו-ממדית (2D Cyclic Dependency):
$$H_{\text{commentaries}} = f(\text{MainAnchors}(H_{\text{main}}))$$
$$\text{Geometry}_{\text{commentaries}} = g(H_{\text{main}})$$
$$H_{\text{main}} = H_{\text{page}} - H_{\text{commentaries}}$$

שינוי של שורה אחת בטקסט הראשי משנה את מספר העוגנים, מה שמשנה את כמות הטקסט של המפרשים, מה שמשנה את הגובה שנותר לטקסט הראשי, מה שמשנה בחזרה את נקודת השבירה שלו.

```
       +---------------------------------------------+
       |   הוספה / הפחתה של שורת טקסט ראשי (Main)     |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       |  שינוי כמות העוגנים (Anchors) הנכנסים בעמוד |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       | שינוי נפח הטקסט הנדרש עבור המפרשים (Volume) |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       |  שינוי גובה/צורת השטח הזמין עבור המפרשים   |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       | חריגה מעבר לעמוד או היווצרות שטח ריק בעמוד   |
       +---------------------------------------------+
                              |
                              +---> Backtracking / התאמת שורות מחדש
```

### 3.1 מספר קריאות לפונקציות במהלך חישוב עמוד בודד

בהנחה שממוצע האיטרציות למציאת שיווי משקל (Equilibrium) בעמוד מורכב עומד על $K$ איטרציות (בפועל: בין 3 ל-8 איטרציות; מקסימום 15 לפני Fallback):

| פונקציה | מספר קריאות ממוצע לעמוד | הסבר טכני |
| :--- | :--- | :--- |
| `TokenizeAndMeasureStream` | **0** | מבוצע מראש ברמת הפרק. התוצאות נמשכות מזיכרון מטמון בגישה של $O(1)$. |
| `DeriveStreamGeometries` | **$K$** | נקראת פעם אחת בכל איטרציה לאחר שנקבע גובה משוער חדש לראשי. |
| `BreakStreamLinesOptimal` | **$K \times (1 + M)$** | $M$ הוא מספר המפרשים הפעילים. נקראת לראשי ולכל מפרש בכל איטרציה עבור הגיאומטריה שנבדקת. |
| `ResolveAnchorsForSlice` | **$K$** | נקראת בכל איטרציה לבדיקת התאמת עוגנים בין החיתוך הראשי לחיתוך המפרשים. |
| `EvaluatePageConstraints` | **$K$** | נקראת בסוף כל איטרציה לבדיקת חוקיות וחישוב שגיאת השטח. |
| `JustifyAndExpandLine` | **$L_{\text{total}}$** | נקראת **פעם אחת בלבד לכל שורה סופית** ($L_{\text{total}}$ הוא סך כל השורות בעמוד, כ-40–80 שורות). אינה מופעלת במהלך איטרציות הגישוש. |
| `AssembleAndRenderPage` | **1** | נקראת פעם אחת בלבד עם קבלת שיווי המשקל. |

### 3.2 מנגנון ה-Backtracking והאיטרציות (Relaxation & Bisection Solver)

כדי לפתור את המעגליות ללא כניסה ללולאות אינסופיות, המנוע מיישם שילוב של **Discrete Bisection** (חיפוש בינארי על מספר שורות הראשי) יחד עם **Penalty-directed Branch & Bound**:

1. **הגדרת גבולות חיפוש (Search Bounds):**
   * נקבע גבול תחתון $L_{\min}$ (למשל: מינימום 2 שורות ראשי בעמוד למניעת יתמות קיצונית).
   * נקבע גבול עליון $L_{\max}$ (המספר המקסימלי של שורות ראשי שיכולות להיכנס בעמוד אם אין מפרשים כלל).

2. **איטרציית הרפיה (Relaxation Step):**
   * המנוע בוחר נקודת אמצע $L_{\text{trial}} = \lfloor \frac{L_{\min} + L_{\max}}{2} \rfloor$.
   * מתבצעת שבירת שורות לטקסט הראשי באורך $L_{\text{trial}}$.
   * מחושב השטח הדרוש לכל המפרשים שעוגניהם נכללו בשורות אלו.
   * מחושב סך השטח: $\Delta H = (H_{\text{main}} + H_{\text{mefarshim}}) - H_{\text{pageAvailable}}$.

3. **כללי התכנסות ותיקון (Convergence Heuristics):**
   * **אם $\Delta H > 0$ (Overfull):** העמוד גדוש מדי. שורות המפרש גולשות. $L_{\max} \leftarrow L_{\text{trial}} - 1$. מבצעים Backtracking ומפחיתים שורות מהראשי.
   * **אם $\Delta H < 0$ (Underfull):** נותר שטח ריק בעמוד. בוחנים האם ניתן להגדיל את הראשי: $L_{\min} \leftarrow L_{\text{trial}} + 1$.
   * **טיפול בפיגור פירושים (Commentary Lag / Spillover):**
     אם שורה ראשית כוללת עוגן למפרש ארוך מאוד (למשל תוספות של 200 מילים), המפרש אינו יכול להסתיים באותו עמוד. המנוע מפעיל חוק חלוקה (Splitting Rule):
     * האם המפרש יכול להתחיל בעמוד הנוכחי ולהמשיך לעמוד הבא? אם כן, מועברים רק שברי פסקאות חוקיים (לפחות 2 שורות בעמוד הנוכחי, ולפחות 2 שורות בעמוד הבא).
     * אם לא ניתן להכניס אפילו שתי שורות מהמפרש, השורה הראשית כולה **חייבת להידחות** לעמוד הבא ($L_{\max} \leftarrow L_{\text{trial}} - 1$).

4. **זיהוי ומניעת תנודות מחזוריות (Oscillation / Limit Cycles):**
   * במקרים שבהם הוספת שורה ראשית גורמת ל-Overfull והורדתה גורמת ל-Underfull (ללא נקודת איזון מושלמת של 0 פיקסלים), המערכת בוחרת בחלופה בעלת מדד ה-Badness המינימלי ומפעילה את מנגנון ה-Glue והרחבת האותיות כדי לספוג את הפער האנכי הנותר ($\Delta H$) על פני כל השורות בעמוד (Vertical Justification).

---

# 4. פסאודו-קוד תשתיתי (Production-Ready Architecture)

הקוד להלן מדגים את ה-Main Layout Loop עבור מנוע עימוד תורני ב-TypeScript/Node.js או Python (מוצג ב-TypeScript מודרני מונחה-עצמים, ללא תלויות חיצוניות וללא שום קיצורי דרך).

```typescript
export interface GlyphBox {
  id: string;
  char: string;
  width: number;
  height: number;
  ascent: number;
  descent: number;
  isExpandable: boolean; // אותיות אהלמ"ת
}

export interface GlueNode {
  width: number;
  stretch: number;
  shrink: number;
}

export interface AnchorNode {
  anchorId: string;
  targetStreamId: string;
}

export type LayoutNode = 
  | { type: 'BOX'; box: GlyphBox }
  | { type: 'GLUE'; glue: GlueNode }
  | { type: 'PENALTY'; penalty: number; width: number }
  | { type: 'ANCHOR'; anchor: AnchorNode };

export interface LineBox {
  nodes: LayoutNode[];
  width: number;
  height: number;
  ascent: number;
  descent: number;
  badness: number;
  anchors: AnchorNode[];
}

export interface GeometryProfile {
  getAvailableWidthAtY(y: number): number;
  getTotalHeight(): number;
}

export interface StreamCursor {
  streamId: string;
  tokenIndex: number;
}

export interface PageLayoutConstraints {
  maxPageHeight: number;
  minMainLines: number;
  maxMainLines: number;
  verticalTolerance: number;
}

export interface PageLayoutResult {
  mainLines: LineBox[];
  commentaryLines: Map<string, LineBox[]>;
  isEquilibriumReached: boolean;
  finalBadness: number;
}

export class TorahPageLayoutEngine {
  private mainStreamNodes: LayoutNode[];
  private commentaryStreamNodes: Map<string, LayoutNode[]>;
  private constraints: PageLayoutConstraints;

  constructor(
    mainStreamNodes: LayoutNode[],
    commentaryStreamNodes: Map<string, LayoutNode[]>,
    constraints: PageLayoutConstraints
  ) {
    this.mainStreamNodes = mainStreamNodes;
    this.commentaryStreamNodes = commentaryStreamNodes;
    this.constraints = constraints;
  }

  /**
   * הלולאה הראשית למציאת שיווי משקל בעמוד בודד (Equilibrium Solver)
   */
  public solvePageLayout(
    mainCursor: number,
    commentaryCursors: Map<string, number>
  ): { result: PageLayoutResult; nextMainCursor: number; nextCommentaryCursors: Map<string, number> } {
    let lowerBoundLines = this.constraints.minMainLines;
    let upperBoundLines = this.constraints.maxMainLines;
    
    let bestLayout: PageLayoutResult | null = null;
    let lowestPenalty = Number.MAX_VALUE;
    let optimalNextMainCursor = mainCursor;
    let optimalNextCommentaryCursors = new Map<string, number>(commentaryCursors);

    const MAX_ITERATIONS = 12;
    let iteration = 0;

    while (lowerBoundLines <= upperBoundLines && iteration < MAX_ITERATIONS) {
      iteration++;
      const trialMainLineCount = Math.floor((lowerBoundLines + upperBoundLines) / 2);

      // 1. חיתוך שורות ניסיוני לטקסט הראשי
      const trialMainBreak = this.breakOptimalLinesForMain(
        mainCursor,
        trialMainLineCount
      );

      if (trialMainBreak.lines.length === 0) {
        break;
      }

      // 2. זיהוי עוגנים פעילים בחתך הנוכחי
      const activeAnchors = this.collectAnchorsFromLines(trialMainBreak.lines);

      // 3. חישוב גובה הטקסט הראשי וגזירת גיאומטריה למפרשים
      const mainTotalHeight = trialMainBreak.lines.reduce((acc, l) => acc + l.height, 0);
      const remainingHeight = this.constraints.maxPageHeight - mainTotalHeight;

      if (remainingHeight < 0) {
        // הטקסט הראשי חורג לבדו מכל גובה העמוד - חובה להפחית שורות
        upperBoundLines = trialMainLineCount - 1;
        continue;
      }

      const streamGeometries = this.deriveGeometries(mainTotalHeight, remainingHeight);

      // 4. שבירת שורות לכל מפרש לפי שטח הגיאומטריה הנגזרת
      const commentaryBreaks = new Map<string, { lines: LineBox[]; newCursor: number }>();
      let commentaryTotalHeight = 0;
      let hasSevereAnchorLag = false;

      for (const [streamId, startToken] of commentaryCursors.entries()) {
        const geometry = streamGeometries.get(streamId);
        if (!geometry) continue;

        // חישוב כמות המלל שהעוגנים מחייבים עבור מפרש זה
        const requiredTokensForStream = this.calculateRequiredTokenRange(
          streamId,
          startToken,
          activeAnchors
        );

        const commBreak = this.breakCommentaryLines(
          streamId,
          startToken,
          geometry,
          requiredTokensForStream.maxTokens
        );

        // בדיקה: האם המפרש פיגר ולא כיסה אפילו את דרישת המינימום של העוגנים שבראשי?
        if (commBreak.newCursor < requiredTokensForStream.mustIncludeToken) {
          hasSevereAnchorLag = true;
        }

        commentaryBreaks.set(streamId, commBreak);
        const streamH = commBreak.lines.reduce((acc, l) => acc + l.height, 0);
        commentaryTotalHeight = Math.max(commentaryTotalHeight, streamH);
      }

      // 5. הערכת שיווי המשקל של העמוד (Loss Function)
      const totalPageContentHeight = mainTotalHeight + commentaryTotalHeight;
      const verticalDelta = totalPageContentHeight - this.constraints.maxPageHeight;
      
      const currentPenalty = this.calculateLayoutPenalty(
        verticalDelta,
        trialMainBreak.totalDemerits,
        hasSevereAnchorLag
      );

      if (currentPenalty < lowestPenalty) {
        lowestPenalty = currentPenalty;
        bestLayout = {
          mainLines: trialMainBreak.lines,
          commentaryLines: new Map(Array.from(commentaryBreaks.entries()).map(([k, v]) => [k, v.lines])),
          isEquilibriumReached: Math.abs(verticalDelta) <= this.constraints.verticalTolerance && !hasSevereAnchorLag,
          finalBadness: currentPenalty,
        };

        optimalNextMainCursor = trialMainBreak.newCursor;
        optimalNextCommentaryCursors = new Map(
          Array.from(commentaryBreaks.entries()).map(([k, v]) => [k, v.newCursor])
        );
      }

      // 6. כיוונון החיפוש הדו-כיווני (Search Step Adjustment)
      if (hasSevereAnchorLag || verticalDelta > this.constraints.verticalTolerance) {
        // עומס יתר או פיגור עוגנים: הראשי דורש מפרש שאין עבורו מקום -> חייבים לכווץ את הראשי
        upperBoundLines = trialMainLineCount - 1;
      } else if (verticalDelta < -this.constraints.verticalTolerance) {
        // שטח ריק בעמוד -> יש לנסות להגדיל את הראשי
        lowerBoundLines = trialMainLineCount + 1;
      } else {
        // מצב שיווי משקל בתוך גבולות הטולרנס
        break;
      }
    }

    if (!bestLayout) {
      throw new Error("Fatal: Typesetting Engine failed to produce a valid page configuration.");
    }

    // 7. שלב סופי: יישור שורות (Justification) והרחבת אותיות מתרחבות לשורות הזוכות בלבד
    this.finalizeAndJustifyPage(bestLayout);

    return {
      result: bestLayout,
      nextMainCursor: optimalNextMainCursor,
      nextCommentaryCursors: optimalNextCommentaryCursors,
    };
  }

  private breakOptimalLinesForMain(
    startToken: number,
    targetLineCount: number
  ): { lines: LineBox[]; newCursor: number; totalDemerits: number } {
    const lines: LineBox[] = [];
    let currentToken = startToken;
    let accumulatedDemerits = 0;

    // מימוש מודל שבירה Knuth-Plass לתקרת שורות מבוקשת
    for (let i = 0; i < targetLineCount && currentToken < this.mainStreamNodes.length; i++) {
      const sliceResult = this.takeNextFeasibleLine(this.mainStreamNodes, currentToken, 450); // רוחב ראשי
      if (!sliceResult) break;

      lines.push(sliceResult.line);
      currentToken = sliceResult.nextIndex;
      accumulatedDemerits += sliceResult.line.badness;
    }

    return { lines, newCursor: currentToken, totalDemerits: accumulatedDemerits };
  }

  private breakCommentaryLines(
    streamId: string,
    startToken: number,
    geometry: GeometryProfile,
    maxTokensToConsume: number
  ): { lines: LineBox[]; newCursor: number } {
    const nodes = this.commentaryStreamNodes.get(streamId) || [];
    const lines: LineBox[] = [];
    let currentToken = startToken;
    let currentY = 0;

    while (currentToken < nodes.length && currentToken < maxTokensToConsume) {
      const availableWidth = geometry.getAvailableWidthAtY(currentY);
      const sliceResult = this.takeNextFeasibleLine(nodes, currentToken, availableWidth);
      
      if (!sliceResult) break;
      if (currentY + sliceResult.line.height > geometry.getTotalHeight()) {
        break; // חריגה מגבולות השטח שהוקצה לתזרים זה
      }

      lines.push(sliceResult.line);
      currentY += sliceResult.line.height;
      currentToken = sliceResult.nextIndex;
    }

    return { lines, newCursor: currentToken };
  }

  private collectAnchorsFromLines(lines: LineBox[]): AnchorNode[] {
    const anchors: AnchorNode[] = [];
    for (const line of lines) {
      for (const node of line.nodes) {
        if (node.type === 'ANCHOR') {
          anchors.push(node.anchor);
        }
      }
    }
    return anchors;
  }

  private deriveGeometries(mainHeight: number, remainingHeight: number): Map<string, GeometryProfile> {
    const geometries = new Map<string, GeometryProfile>();
    
    // מודל צורת הדף בסיסי: מפרש ימין ומפרש שמאל חולקים את השטח הנותר בצדדים/למטה
    const sideCommentaryWidth = 140;
    const bottomCommentaryHeight = remainingHeight;

    geometries.set('rashi', {
      getAvailableWidthAtY: () => sideCommentaryWidth,
      getTotalHeight: () => this.constraints.maxPageHeight,
    });

    geometries.set('tosafot', {
      getAvailableWidthAtY: () => sideCommentaryWidth,
      getTotalHeight: () => this.constraints.maxPageHeight,
    });

    geometries.set('bottom_commentary', {
      getAvailableWidthAtY: () => 450, // רוחב מלא בתחתית
      getTotalHeight: () => bottomCommentaryHeight,
    });

    return geometries;
  }

  private calculateRequiredTokenRange(
    streamId: string,
    currentStartToken: number,
    activeAnchors: AnchorNode[]
  ): { mustIncludeToken: number; maxTokens: number } {
    const streamAnchors = activeAnchors.filter(a => a.targetStreamId === streamId);
    if (streamAnchors.length === 0) {
      return { mustIncludeToken: currentStartToken, maxTokens: currentStartToken + 50 };
    }
    
    // מציאת העוגן האחרון בראשי המחייב התחלה או סיום בעמוד
    const lastAnchorId = streamAnchors[streamAnchors.length - 1].anchorId;
    const targetTokenIndex = this.findTokenIndexForAnchor(streamId, lastAnchorId);

    return {
      mustIncludeToken: targetTokenIndex,
      maxTokens: targetTokenIndex + 200 // אפשרות לספוג עודף פירוש עד גבול מסוים
    };
  }

  private calculateLayoutPenalty(
    verticalDelta: number,
    demerits: number,
    hasSevereAnchorLag: boolean
  ): number {
    let penalty = Math.abs(verticalDelta) * 10 + demerits;
    if (verticalDelta > 0) penalty += 50000; // קנס כבד מאוד על חריגה מגבולות העמוד
    if (hasSevereAnchorLag) penalty += 100000; // קנס קריטי על פיגור פירוש
    return penalty;
  }

  private takeNextFeasibleLine(
    nodes: LayoutNode[],
    startIndex: number,
    targetWidth: number
  ): { line: LineBox; nextIndex: number } | null {
    if (startIndex >= nodes.length) return null;

    let currentWidth = 0;
    let index = startIndex;
    const lineNodes: LayoutNode[] = [];
    const anchors: AnchorNode[] = [];

    while (index < nodes.length) {
      const node = nodes[index];
      
      if (node.type === 'BOX') {
        if (currentWidth + node.box.width > targetWidth && lineNodes.length > 0) {
          break; // שורה מלאה
        }
        currentWidth += node.box.width;
        lineNodes.push(node);
      } else if (node.type === 'GLUE') {
        currentWidth += node.glue.width;
        lineNodes.push(node);
      } else if (node.type === 'ANCHOR') {
        anchors.push(node.anchor);
        lineNodes.push(node);
      } else if (node.type === 'PENALTY') {
        lineNodes.push(node);
      }
      index++;
    }

    const deficit = targetWidth - currentWidth;
    const badness = deficit > 0 ? Math.min(1000, Math.floor((deficit / targetWidth) * 100)) : 0;

    return {
      line: {
        nodes: lineNodes,
        width: currentWidth,
        height: 14, // Line-height קבוע או דינמי לפי הגופן
        ascent: 10,
        descent: 4,
        badness,
        anchors,
      },
      nextIndex: index,
    };
  }

  private findTokenIndexForAnchor(streamId: string, anchorId: string): number {
    const nodes = this.commentaryStreamNodes.get(streamId) || [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === 'ANCHOR' && node.anchor.anchorId === anchorId) {
        return i;
      }
    }
    return nodes.length;
  }

  /**
   * יישור סופי: ביצוע Justification והרחבת אותיות אהלמ"ת על השורות הנבחרות בלבד
   */
  private finalizeAndJustifyPage(layout: PageLayoutResult): void {
    const justifyLine = (line: LineBox, targetWidth: number) => {
      const deficit = targetWidth - line.width;
      if (deficit <= 0) return;

      // 1. איתור אותיות שניתן להרחיב בשורה (אל"ף, ה"א, למ"ד, מ"ם, תי"ו)
      const expandableBoxes: GlyphBox[] = [];
      for (const node of line.nodes) {
        if (node.type === 'BOX' && node.box.isExpandable) {
          expandableBoxes.push(node.box);
        }
      }

      if (expandableBoxes.length > 0) {
        // חלוקת עודף המרווח בין האותיות המתרחבות
        const addedWidthPerChar = deficit / expandableBoxes.length;
        for (const box of expandableBoxes) {
          box.width += addedWidthPerChar; // החלפת גליף למורחב או מתיחת אופסט
        }
        line.width = targetWidth;
      } else {
        // פיזור הגרעון על גבי ה-Glue (מרווח בין מילים)
        const glueNodes = line.nodes.filter(n => n.type === 'GLUE') as { type: 'GLUE'; glue: GlueNode }[];
        if (glueNodes.length > 0) {
          const addedWidthPerGlue = deficit / glueNodes.length;
          for (const g of glueNodes) {
            g.glue.width += addedWidthPerGlue;
          }
          line.width = targetWidth;
        }
      }
    };

    // ביצוע עבור הראשי
    for (const line of layout.mainLines) {
      justifyLine(line, 450);
    }

    // ביצוע עבור כל מפרש לפי רוחב העמודה הייעודי שלו
    for (const [streamId, lines] of layout.commentaryLines.entries()) {
      const targetW = streamId === 'bottom_commentary' ? 450 : 140;
      for (const line of lines) {
        justifyLine(line, targetW);
      }
    }
  }
}
```

---

# 5. דגשים קריטיים למימוש במערכות Production

1. **ניהול הזיכרון ומניעת שכפול גליפים (Flyweight Pattern):**
   בספר של מאות עמודים עם רבבות שורות, אין לשכפל אובייקטי גליפים (`GlyphBox`). יש להחזיק טבלת גליפים יחידה במנוע (Glyph Cache לפי זיהוי Unicode וגודל גופן) וצמתי הטקסט יחזיקו רק מצביעים (Pointers / Numeric Indices) למטמון.
2. **מניעת חיתוך מילים (No Hyphenation בעברית תורנית):**
   בניגוד לטקסט לועזי ב-TeX שבו קנס מקושר למקף (`hyphen_penalty`), בעימוד תורני קלאסי נמנעים לחלוטין משבירת מילים על ידי מקף. שיווי המשקל חייב להישען כולו על שילוב מבוקר של:
   * **רווחים אלסטיים:** יחס מתיחה מקסימלי מוגדר היטב (למשל: עד 150% מרוחב הרווח הטבעי).
   * **אותיות מתרחבות:** החלפת גליפים לאלטרנטיבות OpenType רחבות ברגע שמקדם המתיחה חורג מהסף המותר.
3. **סנכרון תחתית עמוד (Bottom Alignment / Page Page-Spread Balancing):**
   בספרים תורניים מקובל ששני העמודים הפתוחים (צמד עמודים - Spread) מסתיימים באותו קו אופקי מדויק בתחתית העמוד. אם עמוד אחד קצר יותר, יש להפעיל כיוונון אנכי של מרווחים (Vertical Glue - בדומה ל-`\vfill` ו-`\baselineskip` של TeX) בין הפסקאות ובין הבלוק הראשי למפרשים כדי לכפות יישור תחתון מושלם.