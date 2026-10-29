---
title: "שיפור מערכת עימוד והוספת ערכות"
date: 2026-09-06
version: V21
type: transcripts
source: Gemini (Google AI Studio)
---


# שיפור מערכת עימוד והוספת ערכות

> שיחת Google AI Studio (Gemini) — מודל: `models/gemini-3.7-flash`

---

## פנייה 1: [קובץ מצורף מ-Google Drive — מזהה: 1dsu56fNin51VJDqjBdePmaEO9Wmjkhg]

[קובץ מצורף מ-Google Drive — מזהה: 1dsu_56fNin51VJDqjBdePmaEO9Wmjkhg]

---

## פנייה 2: לפניך מערכת עימוד תורני בA4 כקובץ HTML, שעזרת לי לפתח ופיתחתי עוד קצת, והייתי…

לפניך מערכת עימוד תורני בA4 כקובץ HTML, שעזרת לי לפתח ופיתחתי עוד קצת,
והייתי רוצה שתעזור לי עוד קצת,
שתי בקשות. 
1. הוסף לפאנל של הגדרות הערות (שוליים\סיום) את הגדרת הסימונים\מזהה  (התחלה\התחלה וסוף) של שני סוגי הערות השוליים. 
2. אני רוצה להעלות כאן כמה קבצי SVG שמהווים ערכות נושא (כל אחת מסומנת בתחילתה במספר וכוללת שלושה קבצים 1. שער ראשי. 2. שער אחורי (השער שמאחורי דף השער הראשי). 3. שער משנה), ושתוסיף אפשרות להגדרת ערכת נושא שתחיל את שלושת השערים יחד, צריך שגם תתאים את השדות הקיימים של השערים הראשי והמשנה (מיקום השדות בשער האחורי זהים לשער המשנה רק במקום בצד השמאלי זה בצד הימני) לאזור החלק (שבין עיטורים או בתוך מסגרת) של השערים שבערכות הנושא, והייתי רוצה שיהיה דרך להכניס וליצור ערכות נושא. 
עוד נקודה ששמתי לב אליה שבחירת רקע מותאם אישית בשער המשנה משנה את מיקום הכיתוב מצד שמאל למרכז, השינוי הזה לא רצוי.
לפני שאתה כותב קוד אני רוצה שתחזור על הבקשות שלי שנראה שאנחנו מבינים את את השני, ותציע דרך לביצוע הבקשות.

---

### 🤖 תגובה 1: Analyzing the System's Scope I'm now focusing on thoroughly understanding the…

**Analyzing the System's Scope**

I'm now focusing on thoroughly understanding the user's request. My efforts have concentrated on analyzing the provided Torah typesetting system, particularly its functionality within an HTML/JS framework. I'm working to grasp the system's intended capabilities.

---

### 🤖 תגובה 2: Analyzing the Input Right now, I'm diving into the user's prompt. I've broken…

**Analyzing the Input**

Right now, I'm diving into the user's prompt. I've broken it down into its core components, starting with clarification of the requests. I'm focusing on the first request, which is to add UI controls in the Notes Panel for configuring text triggers.


**Defining Note Delimiters**

Okay, I've got a grasp on the different note types. I'm nailing down the two crucial delimiter approaches: prefix/line triggers, like "Note - " or "Footnote:", and the inline delimiter pairs such as `((...))` or `[[...]]`. I'm also ensuring a distinction between footnotes and endnotes is maintained. Now, I'm shifting to address the request for themes.


**Addressing Frame Alignment**

I'm tackling the issues within the printable area, ensuring text won't encroach on borders. I'm focusing on providing options for custom themes; I'm planning to use JSON or a UI file upload. I'm prioritizing the fix in Sub-Shaar to preserve left-column alignment when a custom background image is selected, preventing the content from centering inappropriately.

---

### 🤖 תגובה 3: שלום! קראתי בעיון את הקוד ואת כל פרטי הבקשה שלך. להלן סיכום מדויק של הדברים כדי…

שלום! קראתי בעיון את הקוד ואת כל פרטי הבקשה שלך. להלן סיכום מדויק של הדברים כדי לוודא שאנחנו מתואמים לחלוטין, בצירוף הצעה מפורטת לאופן הביצוע.

---

### א. שיקוף והבנת הבקשות

1. **הגדרת סימונים ומזהים להערות (שוליים וסיום) בפאנל הניהול:**
   * כרגע הגדרות ההערות כוללות סגנון גופן, גודל, וקו מפריד, אך אופן הזיהוי בטקסט מפוצל בין כותרת 7 מובנית לבין תוספים מיובאים.
   * **הדרישה:** להוסיף בפאנל "הגדרות הערות" שליטה מלאה בטריגרים של שני סוגי ההערות (הערות שוליים והערות סיום):
     * הגדרת **קידומת שורה** (למשל: `הערה -`, `הערת שוליים:`, `הערת סיום:`).
     * הגדרת **צמד תוחמים בתוך הטקסט** (פתיחה וסגירה, כגון `((...))` או `[[...]]` או `(הערה: ...)`).
     * ניתוב אוטומטי של הטקסט לפי הסימון שנבחר: הערת שוליים (המוצגת בתחתית העמוד / בשולי הדף) מול הערת סיום (הנאספת לסוף החלק/הספר).

2. **מערכת ערכות נושא (Themes) לשערי הספר:**
   * ערכת נושא מאגדת **שלושה שערים מתואמים**:
     1. **שער ראשי** (עמוד ימין/ראשון – מסגרת מרכזית מלאה).
     2. **שער אחורי** (גב השער הראשי / עמוד שמאל מול תוכן העניינים – התוכן ממוקם ב**צד הימני** של הדף, מול העיטורים שבשמאל/רקע).
     3. **שער משנה** (פותח חלק – התוכן ממוקם ב**צד השמאלי** של הדף, ברוחב מוגדר כגון 50%–55%).
   * **בחירה אחודה:** אפשרות לבחור ערכת נושא אחת שתחיל מיידית את שלושת הרקעים והמבנים יחד.
   * **התאמת תיבת התוכן (Content Box):** הגדרת אזור "חלק" מדויק (שוליים עליונים, תחתונים, ימין/שמאל או רוחב טור) לכל אחד משלושת השערים בערכה, כך שהטקסט (שם הספר, מחבר, פרטים וכו') יישב בדיוק בתוך האזור החלק ולא יגלוש על עיטורי ה-SVG.
   * **יצירה וייבוא ערכות נושא:** ממשק/אפשרות להעלות 3 קבצים (או לבחור קבצים קיימים) ולהגדיר עבורם את גבולות הטקסט, עם שמירה בתבנית.

3. **תיקון באג שער המשנה ברקע מותאם:**
   * כיום, כאשר בוחרים תמונת רקע מותאמת לשער המשנה, הקוד מעביר את הטקסט ל-100% רוחב ומרכוז מלא (`sub-shaar-content-centered` במקום `sub-shaar-col` ברוחב 55%), מה שדורס את המבנה הצדדי הרצוי.
   * **התיקון:** הרקע המותאם ישמש כשכבת רקע תחתונה (`absolute` מלא), בעוד ששכבת התוכן תישאר תמיד בטור השמאלי המיועד (אלא אם ערכת הנושא מגדירה אחרת).

---

### ב. תוכנית ביצוע והצעה טכנית

#### 1. מנגנון ההערות (UI + Parsing)
* **בפאנל ההערות:** נוסיף שתי לשוניות/קבוצות ברורות:
  * **הערות שוליים:** בחירת סוג זיהוי (תוחמים / קידומת / שניהם) + הגדרת מחרוזת פותחת וסוגרת (ברירת מחדל: `((` ו-`))`) וקידומת שורה (כגון `הערה -`).
  * **הערות סיום:** בחירת סוג זיהוי + תוחמים (ברירת מחדל: `[[` ו-`]]`) וקידומת שורה (כגון `הערת סיום -`).
* **במנוע העימוד (`typesetDocument`):**
  * בעת פירוק השורות לטוקנים, נבדוק התאמה לקידומות שהוגדרו בפאנל.
  * במהלך סריקת הפסקאות והכותרות, פונקציית `applyDelimiterStyles` תשתמש ישירות בהגדרות אלו, תחלץ את תוכן ההערה, תשתול סימון מקושר (`<a>`) ותכניס את ההערה לתור המתאים (שוליים או סיום).

#### 2. מנוע ערכות הנושא (Themes Engine)
* **מבנה נתונים לערכת נושא:**
  ```javascript
  {
    id: "theme_1",
    name: "ערכה קלאסית (עמודים וקשתות)",
    mainShaar: { bgType: "svg/img", src: "...", insets: { top: "20mm", bottom: "16mm", left: "15mm", right: "15mm" } },
    backShaar: { bgType: "svg/img", src: "...", colWidth: "55%", align: "right", insets: { top: "20mm", bottom: "20mm", right: "15mm", left: "45%" } },
    subShaar:  { bgType: "svg/img", src: "...", colWidth: "55%", align: "left",  insets: { top: "20mm", bottom: "20mm", left: "15mm", right: "45%" } }
  }
  ```
* **רינדור השער האחורי (Back Title / Verso):**
  * נוסיף צ'קבוקס בפאנל: "הצג שער אחורי (גב השער הראשי)".
  * אם מסומן, מיד אחרי השער הראשי ירונדר עמוד שער אחורי המציג את פרטי הספר/הקדשה/הסכמות בטור הימני, מיושר לאזור החלק של השער האחורי בערכה.
* **תיחום מדויק של התוכן:**
  * במקום גדלים קשיחים ב-CSS, אלמנט התוכן של השער יקבל את הגבולות (`padding` / `top, bottom, left, right` / `width`) לפי נתוני הערכה הפעילה.
* **ממשק יצירת/ייבוא ערכה:**
  * פאנל שבו ניתן להעלות 3 קבצים (ראשי, אחורי, משנה), לקבוע את שמותיהם והשוליים שלהם, ולשמור אותם כערכה בתוך התבנית (data-island).

#### 3. תיקון שער המשנה
* נבצע הפרדה מוחלטת ב-HTML/CSS של שער המשנה:
  * שכבה 1 (Z-Index נמוך): תמונת הרקע / ה-SVG הנמתח על כל הדף.
  * שכבה 2 (Z-Index גבוה): מיכל התוכן שמוגדר תמיד בעמודה השמאלית (או הימנית בשער אחורי), בהתאם לקואורדינטות האזור החלק.

---

אם המבנה והתוכנית הללו מדויקים לכוונתך, אשמח לאישורך ומיד אגש להטמעת השינויים המלאים בקובץ!

---

## פנייה 3: התחל!!! ואך היזהר שלא לשנות בקובץ שום דבר אחר חוץ מהבקשות הנ"ל, ושים לב…

התחל!!! ואך היזהר שלא לשנות בקובץ שום דבר אחר חוץ מהבקשות הנ"ל, ושים לב שבעריכתך את הקוד לא משתנים\נהרסים דברים אחרים, ושים לב שהקוד כולל הסברים בעברית, עשה זאת גם לחלקים שאתה מוסיף (באופן שאינו פוגע בשלימות הקוד, כמובן)
פשוט ומובן שההטמעה של השערים שהעליתי למעלה תעשה בפורמט שלהם הקיים (SVG) ולא כתמונה.

---

### 🤖 תגובה 4: Initiating The Process I've begun the process. I am being very careful to only…

**Initiating The Process**

I've begun the process. I am being very careful to only modify the specified areas and to avoid inadvertently altering anything else in the file. I will ensure that the code includes comprehensive Hebrew explanations.

---

### 🤖 תגובה 5: Considering File Formats I'm now grappling with the user's input regarding file…

**Considering File Formats**

I'm now grappling with the user's input regarding file formats. Initially, I was converting all attachments to JPEGs. However, the user insists on retaining their original SVG format for the uploaded gates. This requires immediate reevaluation of the image processing pipeline to accommodate SVG files directly.

---

### 🤖 תגובה 6: Analyzing File Groups I'm currently focused on dissecting the provided file…

**Analyzing File Groups**

I'm currently focused on dissecting the provided file groups. I've begun by formally defining each set of three files. Now, I'm diving into each set, starting with Group 0 (input_file_0, input_file_1, input_file_2) and then Group 1 (input_file_3, input_file_4, input).

---

### 🤖 תגובה 7: Analyzing Image Structures Okay, I'm digging deeper into Group 0. I've noted…

**Analyzing Image Structures**

Okay, I'm digging deeper into Group 0. I've noted the white/pattern arrangement in the first two images: white left then right, and the reverse. Image 2, though, seems to have a symmetric columnar structure, which is a new wrinkle to consider for the group as a whole. I'm focusing on these details now.

---

### 🤖 תגובה 8: Analyzing Symmetric Frames I've observed a pattern: each theme centers around a…

**Analyzing Symmetric Frames**

I've observed a pattern: each theme centers around a symmetric frame, acting as a "Main Shaar". Examples include files 2, 4, 8, 11, and so on. Furthermore, I've noticed that one side page consistently presents a pure white (or blank) area on the left, with an L_mean of 255.0.


**Verifying Layout Concepts**

I'm now focusing on the layout concept. I've classified files based on whether they present a "Back Shaar" or "Sub Shaar" arrangement. A "Back Shaar" has the right side open, the left decorated. Conversely, a "Sub Shaar" features decoration on the right, and open space for content on the left. I'm verifying this classification, to solidify my model. I've also verified the Shaar ראשי text placement in the center.


**Defining Note Structure**

I'm currently delving into how the note structure should be defined. I am adding a panel for "הגדרות הערות" which will incorporate sections for footnotes ("הערות שוליים") and endnotes ("הערות סיום"). Within these, I'll need fields for the prefix triggers and delimiter pairs for both note types. The engine will then use these triggers for identifying note content.


**Integrating Theme Selection**

I'm now integrating theme selection. I need a user interface for choosing a **ערכת נושא (Theme)**, which applies to the main, back, and sub-title pages simultaneously. I am implementing support for both pre-built themes and custom themes, allowing users to upload or configure their own designs. I'll need to handle SVG files, whether inline, as data URLs, or as uploaded files. Ideally, I'll leverage the existing SVG format of the user's provided files.


**Implementing SVG Handling**

I'm now fully focused on SVG integration, ensuring vector themes render perfectly. I'm building out support for both pre-defined SVG frames and user-uploaded SVG files, using `<input>` and JSON for flexibility. The plan is to render these losslessly, keeping them sharp. Crucially, I'm defining content placement within these SVG frames, centering the main shaar content, placing back shaar content in the right column, and sub shaar content on the left. Finally, I'm correcting a sub-shaar bug and ensuring back shaar pages render correctly.

---

### 🤖 תגובה 9: Analyzing HTML Structure I've been examining the HTML structure, specifically…

**Analyzing HTML Structure**

I've been examining the HTML structure, specifically the `<div class="panel-static">` elements. I've identified three key sections within it: "Crown icon" for primary and secondary settings, "🧩" for plugin imports, and "📝" for footnote/endnote settings. I'm focusing on how these are organized and what data is associated with each.


**Refining Content Layout**

I'm now focusing on refining the content layout. I am planning enhancements for automatic formatting quality, content page backgrounds, and heading typography. I've broken down title styling into grid and general typography, top-level headings (3 sections), and both general and detailed table of contents. I'm starting by adding trigger inputs and delimiter configurations for both footnotes and endnotes, specifically for the "Panel: הגדרות הערות (שוליים / סיום)" section.


**Implementing Note Delimiters**

I'm currently focused on implementing note delimiters, specifically for footnotes and endnotes. I've defined input fields for opening and closing delimiters, using HTML inputs for flexibility. I'm integrating these into the `typesetDocument` function, reading `fnLinePrefix` and `enLinePrefix` and adjusting the tokenizer to handle lines starting with these prefixes for both footnotes and endnotes. Inline delimiter scanning will check for the configured delimiters (like `[[` and `]]`), replace the inner text, and queue up the note markers using `createNoteMarkerAndQueue`. I'm making sure to maintain backward compatibility with the existing regex.


**Designing Theme Functionality**

I'm now designing the theme functionality for title pages. I plan to add a theme selector with built-in options like "דמסק ושיש". The "שער אחורי" (back title page) checkbox will toggle its display. When a theme is selected, it configures backgrounds and content bounds for the "שער ראשי", the "שער אחורי" (rendered on page 2), and "שער משנה". The "שער אחורי" will use an SVG frame with content positioned on the right side.


**Developing Theme Features**

I am now developing the theme features for the Sub-Shaar. I've corrected a bug in `renderSubShaar`, and the content container is now positioned correctly as a column on the left side, with custom width, using `position: absolute;` and `z-index: 20;`. I've also outlined a UI section for "יצירת / עריכת ערכת נושא," enabling SVG uploads for main, back, and sub shaars and custom inset adjustments, as well as an export/import feature for JSON-based theme management.

---

### 🤖 תגובה 10: Defining CSS Changes I'm now zeroing in on the specific CSS modifications…

**Defining CSS Changes**

I'm now zeroing in on the specific CSS modifications required. I've started by solidifying the approach for the `.sub-shaar-page` class, which I'll keep as `position: relative; padding: 0;`. I'm starting to think about `.sub-shaar-col` next, to ensure optimal layout.


**Refining Column Specifications**

I've specified the CSS for the `.sub-shaar-col` class. It will be positioned absolutely, taking 55% width, with a white background and a right border, and shadow. I've also addressed a transparent theme variant. I'm now drafting similar styles for the `.back-shaar-col` counterpart, mirroring the design but flipping the positioning and borders accordingly.


**Implementing Theme Customization**

I'm now integrating theme selection into the panel. A dropdown for theme presets is set, which now includes options for pre-defined styles as well as a "custom" setting. I've also implemented a checkbox to control the display of a back shaar. For the custom theme option, I've created input fields for users to upload SVG or image files. Next steps are integrating these selections into the CSS.


**Expanding Panel Functionality**

I'm now focusing on expanding the control panel's features. I've added fields to upload sub and back shaar images or SVGs, along with inset controls for padding and column width percentage. Furthermore, I've integrated text fields allowing custom back shaar text, or to use the default. I'm also adding footnote and endnote customization, including prefix options and text delimiters.


**Refining Text Delimiters**

I'm working on text delimiters for footnotes and endnotes now. I've integrated input fields to allow customization of these delimiters, including open and close brackets for both. I'm also addressing the default values for these fields, setting initial placeholders and associated change handlers. The footnote section now allows open and close brackets, and the endnote section also allows open and close brackets, and includes a prefix option.


**Implementing Delimiters**

I've just added the ability to customize footnote and endnote line prefixes within the text engine. I'm now fetching values for `fnPrefix` and `enPrefix` from their respective input fields, which will control how lines are identified for footnote or endnote treatment. I'm also preparing to retrieve and apply custom inline delimiters for these notes.


**Integrating Dynamic Delimiters**

I'm now retrieving values for footnote and endnote delimiters, specifically the close delimiter for footnotes (`fnClose`), and open/close delimiters for endnotes (`enOpen`, `enClose`). I'm also planning to dynamically handle instances of these built-in delimiters in the text, so that any enclosed text is captured, linked, and queued. I'm focusing on ensuring any embedded structures in the text are properly rendered.

---

### 🤖 תגובה 11: הנה הקוד המלא והמעודכן, הכולל את כל ההרחבות והתיקונים שביקשת, תוך שמירה קפדנית…

הנה הקוד המלא והמעודכן, הכולל את כל ההרחבות והתיקונים שביקשת, תוך שמירה קפדנית על שלמות כל שאר חלקי המערכת והסברים מפורטים בעברית:

### עיקרי העדכונים שבוצעו:
1. **הגדרות סימונים ומזהים להערות (שוליים וסיום):**
   * נוספו שדות קלט ייעודיים בפאנל ההערות עבור:
     * **הערות שוליים:** קידומת שורה (ברירת מחדל: `כותרת 7 -` או `הערה -`) וצמד תוחמים בתוך הטקסט (ברירת מחדל: `((` ו-`))`).
     * **הערות סיום:** קידומת שורה (ברירת מחדל: `הערת סיום -`) וצמד תוחמים בתוך הטקסט (ברירת מחדל: `[[` ו-`]]`).
   * מנגנון הניתוח (`typesetDocument` ו-`applyDelimiterStyles`) תומך כעת בשני הסוגים במקביל באופן גלובלי.
2. **מערכת ערכות נושא (Themes) לשערי הספר:**
   * הוספת בורר ערכות נושא ראשי המחיל במקביל את **שלושת השערים המתואמים**: שער ראשי (מרכזי), שער אחורי (גב השער – תוכן מיושר לימין), ושער משנה (פותח חלק – תוכן מיושר לשמאל).
   * תמיכה מלאה בהטמעת והעלאת קובצי **SVG** וקטוריים מקוריים (ללא פגיעה באיכות).
   * אפשרות הגדרת שוליים פנימיים (Insets) ורוחב טור לכל שער כדי להבטיח שהטקסט ימוקם תמיד באזור החלק ולא יגלוש על גבי העיטורים.
   * פאנל מובנה ליצירה, שמירה וייבוא של ערכות נושא חדשות.
3. **תיקון מיקום הכיתוב בשער המשנה:**
   * תוקן הבאג בשער המשנה: בעת בחירת תמונת רקע / SVG מותאם אישית, שכבת התוכן נשארת נעולה ומיושרת ב**טור השמאלי** (50%–55%), ושכבת העיטור נשארת מתחתיה בצד ימין/בכל הדף.

---

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מערכת עימוד תורנית מקצועית לדפי A4</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

  /* ============================================================
     משתני CSS גלובליים: גדלי גופנים, רשת העמוד, צבעים.
     ============================================================ */
  :root {
    --fn-header-r: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-r: 13pt;
    --fn-header-c: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-c: 11pt;
    --fn-header-l: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-l: 13pt;

    --fn-h0: 'David Libre', 'David', serif;
    --sz-h0: 18pt;
    --fn-h0-body: 'Frank Ruhl Libre', serif;
    --sz-h0-body: 11.5pt;

    --fn-h1: 'Lia Sgula', 'Bellefair', serif;
    --sz-h1: 50pt;
    --fn-h1-sub: 'David Libre', 'David', serif;
    --sz-h1-sub: 28pt;

    --fn-h2: 'AAd_AlphaBlack', 'David Libre', 'David', serif;
    --sz-h2: 17pt;
    --fn-h3: 'AAd_AlphaLight', 'Noto Serif Hebrew', serif;
    --sz-h3: 13.5pt;
    --fn-h4: 'FrankRuehl', 'Frank Ruhl Libre', serif;
    --sz-h4: 12.5pt;
    --fn-h5: 'David Libre', 'David', serif;
    --sz-h5: 11.5pt;
    --fn-h6: 'Noto Serif Hebrew', serif;
    --sz-h6: 10.5pt;
    --fn-h7: 'Hadassah Friedlaender', 'Hadassah', 'Noto Serif Hebrew', serif;
    --sz-h7: 6pt;

    --fn-sh-title: 'Bellefair', serif;
    --sz-sh-title: 46pt;
    --fn-sh-sub: 'David Libre', serif;
    --sz-sh-sub: 21pt;
    --fn-sh-desc: 'Frank Ruhl Libre', serif;
    --sz-sh-desc: 12pt;
    --fn-sh-sec: 'David Libre', serif;
    --sz-sh-sec: 11.5pt;
    --fn-sh-author: 'David Libre', serif;
    --sz-sh-author: 15pt;
    --fn-sh-year: 'David Libre', serif;
    --sz-sh-year: 12pt;

    --fn-body: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-body: 11.2pt;
    --fn-first-word: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-first-word: 1.5em;

    --w-margin: 7.5%;
    --w-gap: 2%;
    --w-col: 40%;
    --w-gutter: 2%;
    --flow-mt: 20px;
    --flow-mb: 20px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ============================================================
     איפוס בסיסי ותצוגת שני-חלקים (סרגל צד + תצוגה מקדימה)
     ============================================================ */
  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background-color: #555555;
    font-family: var(--fn-body);
    color: #000000;
    display: flex;
    flex-direction: row;
  }

  #sidebar {
    width: 530px;
    min-width: 380px;
    max-width: 780px;
    height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    box-shadow: -3px 0 15px rgba(0,0,0,0.3);
    z-index: 100;
    font-family: 'David Libre', serif;
    flex-shrink: 0;
  }

  #resizer {
    width: 6px;
    height: 100vh;
    background: #333333;
    cursor: col-resize;
    flex-shrink: 0;
    z-index: 110;
    transition: background 0.2s;
  }
  #resizer:hover, #resizer.resizing { background: #b8860b; }

  .sidebar-top-half {
    height: 40vh;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding-bottom: 6px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .sidebar-title { font-size: 12.5pt; font-weight: 700; }

  .btn-load-fonts {
    background-color: #2c3e50;
    color: #fff;
    border: none;
    padding: 3px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }

  #raw-input {
    width: 100%;
    flex: 1;
    font-family: monospace;
    font-size: 9pt;
    padding: 6px;
    border: 1px solid #777;
    border-radius: 3px;
    direction: rtl;
    resize: none;
  }

  .sidebar-scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
    margin-top: 4px;
  }

  .panel-static {
    background: #fbfbfb;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 8px 10px;
  }

  .panel-header {
    font-size: 10pt;
    font-weight: 700;
    background: #eaeaea;
    padding: 4px 8px;
    border-radius: 3px;
    margin: -8px -10px 8px -10px;
    color: #111;
    border-bottom: 1px solid #ccc;
  }

  .inline-cfg-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 5px;
    font-size: 8.5pt;
  }
  .inline-cfg-row label { font-weight: 700; width: 105px; flex-shrink: 0; font-size: 8pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .inline-cfg-row input[type="text"] { flex: 1; min-width: 80px; padding: 2px 4px; font-size: 8.5pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select { padding: 2px 3px; font-size: 8pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select.font-picker { width: 100px; }
  .inline-cfg-row input.size-input { width: 38px; text-align: center; font-size: 8pt; padding: 2px; border: 1px solid #aaa; border-radius: 2px; }

  .toc-levels-table {
    width: 100%;
    font-size: 8pt;
    margin-top: 4px;
    border-collapse: collapse;
  }
  .toc-levels-table th, .toc-levels-table td {
    padding: 2px 4px;
    text-align: right;
  }
  .toc-levels-table th { background: #eee; font-weight: 700; }

  .btn-bar-bottom {
    display: flex;
    gap: 6px;
    padding-top: 8px;
    border-top: 1.5px solid #ccc;
    background: #fff;
    flex-shrink: 0;
  }
  .btn-primary {
    background-color: #000;
    color: #fff;
    border: none;
    padding: 8px 12px;
    font-size: 10pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    flex-grow: 1;
  }
  .btn-save-template {
    background-color: #1e3a8a;
    color: #fff;
    border: none;
    padding: 8px 10px;
    font-size: 9pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }
  .btn-secondary {
    background-color: #f0f0f0;
    color: #000;
    border: 1px solid #666;
    padding: 8px 10px;
    font-size: 9pt;
    cursor: pointer;
    border-radius: 3px;
  }

  #preview-pane {
    flex-grow: 1;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 20px;
    scroll-behavior: smooth;
    background-color: #555555;
  }

  /* ============================================================
     עמוד ה-A4 עצמו
     ============================================================ */
  .a4-page {
    background-color: #ffffff;
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    padding: 15mm 15mm 15mm 15mm;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    position: relative;
    margin-bottom: 30px;
    page-break-after: always;
    overflow: hidden;
    flex-shrink: 0;
  }

  .page-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    justify-content: space-between;
  }

  /* ============================================================
     עמודי השער: ראשי, אחורי, ומשנה
     ============================================================ */
  .main-shaar-page {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
  }

  .shaar-main-content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm 16mm 12mm;
    z-index: 20;
    position: relative;
  }

  .custom-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    z-index: 5;
    pointer-events: none;
  }

  .bsd-header { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-bottom: 40px; }
  .sefer-label { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-top: 4px; }
  
  .book-title-main { font-family: var(--fn-sh-title); font-size: var(--sz-sh-title); line-height: 1.1; margin: 10px 0 40px 0; }
  .book-subtitle { font-family: var(--fn-sh-sub); font-size: var(--sz-sh-sub); font-weight: 700; line-height: 1.25; }
  .book-description { font-family: var(--fn-sh-desc); font-size: var(--sz-sh-desc); line-height: 1.5; max-width: 65%; margin: 10px auto; }
  .book-sections-summary { font-family: var(--fn-sh-sec); font-size: var(--sz-sh-sec); line-height: 1.5; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 6px 12px; margin: 8px 0; font-weight: 700; }
  .author-block { font-family: var(--fn-sh-author); font-size: calc(var(--sz-sh-author) * 0.85); line-height: 1.3; }
  .author-name { font-size: var(--sz-sh-author); font-weight: 700; }
  .publication-footer { font-family: var(--fn-sh-year); font-size: var(--sz-sh-year); font-weight: 700; letter-spacing: 1px; }

  .m1-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-bottom: 1px solid #d0d0d0; }
  .m1-bg-middle { position: absolute; top: 20%; left: 0; right: 0; height: 60%; background: #ffffff; }
  .m1-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-top: 1px solid #d0d0d0; }
  .m1-panel { position: absolute; top: 0; bottom: 0; left: 12%; right: 12%; background: #ffffff; border-right: 1px solid #ccc; border-left: 1px solid #ccc; box-shadow: 0 0 20px rgba(0,0,0,0.1); display: flex; justify-content: space-between; z-index: 10; }
  .m1-damask { width: 30px; height: 100%; background: #fafafa url("data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.35'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }
  
  .m2-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-bg-middle { position: absolute; top: 18%; left: 0; right: 0; height: 64%; background: #ffffff; box-shadow: inset 0 2px 6px rgba(0,0,0,0.06), inset 0 -2px 6px rgba(0,0,0,0.06); }
  .m2-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-panel { position: absolute; top: 0; bottom: 0; left: 10%; right: 10%; background: #ffffff; box-shadow: 0 0 25px rgba(0,0,0,0.12); display: flex; justify-content: space-between; z-index: 10; }
  .m2-lace { width: 24px; height: 100%; background: #ffffff url("data:image/svg+xml,%3Csvg width='26' height='40' viewBox='0 0 26 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13,20 C4,16 2,8 2,2 C2,0 8,0 13,8 C18,0 24,0 24,2 C24,8 22,16 13,20 Z M13,20 C4,24 2,32 2,38 C2,40 8,40 13,32 C18,40 24,40 24,38 C24,32 22,24 13,20 Z M13,10 A3,3 0 1,0 13,16 A3,3 0 1,0 13,10 Z M13,30 A3,3 0 1,0 13,24 A3,3 0 1,0 13,30 Z' fill='%23888888' fill-opacity='0.45'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }

  .m3-wavy-band { position: absolute; top: 14%; left: 0; right: 0; height: 72%; background: #ffffff; border-top: 1.5px solid #d4d4d4; border-bottom: 1.5px solid #d4d4d4; }
  .m3-panel { position: absolute; top: 0; bottom: 0; left: 9%; right: 9%; background: #ffffff; border-right: 1.5px solid #ccc; border-left: 1.5px solid #ccc; box-shadow: 0 0 25px rgba(0,0,0,0.14); z-index: 10; }
  .m3-corner { position: absolute; width: 65px; height: 65px; fill: #111; z-index: 25; }
  .m3-corner.tr { top: 10mm; right: 10mm; }
  .m3-corner.tl { top: 10mm; left: 10mm; transform: scaleX(-1); }
  .m3-corner.br { bottom: 10mm; right: 10mm; transform: scaleY(-1); }
  .m3-corner.bl { bottom: 10mm; left: 10mm; transform: scale(-1, -1); }

  /* שער משנה (שמאל) ושער אחורי (ימין) */
  .sub-shaar-page { position: relative; padding: 0; }
  .sub-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    left: 0;
    right: auto;
    width: 55%;
    background: #ffffff;
    border-right: 1.5px solid #ccc;
    box-shadow: 5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .sub-shaar-col.theme-transparent {
    background: transparent !important;
    border-right: none !important;
    box-shadow: none !important;
  }
  .sub-shaar-bg-right {
    position: absolute;
    top: 0; bottom: 0;
    right: 0; left: 55%;
    background: #f4f4f4;
  }
  .sub-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm;
    z-index: 20;
  }

  .back-shaar-page { position: relative; padding: 0; }
  .back-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    right: 0;
    left: auto;
    width: 55%;
    background: #ffffff;
    border-left: 1.5px solid #ccc;
    box-shadow: -5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .back-shaar-col.theme-transparent {
    background: transparent !important;
    border-left: none !important;
    box-shadow: none !important;
  }
  .back-shaar-bg-left {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 55%;
    background: #f4f4f4;
  }
  .back-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 22mm 12mm 18mm 12mm;
    z-index: 20;
  }

  /* ============================================================
     תוכן העניינים
     ============================================================ */
  .toc-page { padding: 15mm 15mm 15mm 15mm; }
  .toc-grid-full {
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: space-between;
    flex-grow: 1;
    width: 100%;
    max-width: 175mm;
    margin: 0 auto;
  }
  .toc-entry-group { break-inside: avoid; margin-bottom: 3px; }
  .toc-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2px;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
  }
  .toc-title {
    flex-shrink: 1;
    max-width: 84%;
    font-weight: 600;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: right;
    line-height: 1.3;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 1px dotted #777;
    margin: 0 8px;
    height: 1px;
    min-width: 25px;
  }
  .toc-page-num {
    flex-shrink: 0;
    font-weight: 700;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
    min-width: 25px;
    text-align: left;
  }
  
  .toc-lvl-1 { font-size: 12pt; font-weight: 700; margin-top: 8px; margin-bottom: 3px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
  .toc-lvl-2 { font-size: 11pt; font-weight: 700; margin-top: 5px; padding-right: 8px; }
  .toc-lvl-3 { font-size: 10.5pt; font-weight: 700; padding-right: 16px; }
  .toc-lvl-4 { padding-right: 24px; font-size: 10pt; }
  .toc-lvl-5 { padding-right: 32px; font-size: 9.5pt; }
  .toc-lvl-6 { padding-right: 40px; font-size: 9pt; }
  .toc-lvl-7 { padding-right: 48px; font-size: 8.8pt; }

  .toc-grouped-block {
    padding-right: 30px;
    font-size: 9pt;
    color: #222;
    line-height: 1.5;
    margin: 2px 0 5px 0;
    text-align: right;
    font-family: 'David Libre', serif;
  }
  .grp-item { font-size: inherit; white-space: normal; }
  .grp-title { font-weight: 600; color: #111; }
  .grp-page { font-weight: 700; color: #4a5568 !important; font-family: 'David Libre', serif; }
  .grp-sep { color: #888; margin: 0 6px; font-weight: bold; white-space: nowrap; }

  /* ============================================================
     הכותרת העליונה
     ============================================================ */
  .top-header-grid {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    align-items: center;
    height: 24px;
    flex-shrink: 0;
  }

  .header-col-r {
    grid-column: 3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-r);
    font-size: var(--sz-header-r);
    font-weight: 700;
  }
  .header-col-c {
    grid-column: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: visible;
    font-family: var(--fn-header-c);
    font-size: var(--sz-header-c);
  }
  .header-col-l {
    grid-column: 5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-l);
    font-size: var(--sz-header-l);
    font-weight: 700;
  }

  /* ============================================================
     גוף הטקסט: כותרות, טורים, פסקאות
     ============================================================ */
  .title-level-2-standalone {
    font-family: var(--fn-h2);
    font-size: var(--sz-h2);
    font-weight: 700;
    text-align: center;
    margin-top: 0;
    margin-bottom: 40px;
    width: 100%;
    line-height: 1.25;
    flex-shrink: 0;
  }

  .h2-spacer { flex-basis: 33.33%; flex-shrink: 0; }

  .page-body-flow {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    flex-grow: 1;
    justify-content: flex-start;
    margin-top: var(--flow-mt);
    margin-bottom: var(--flow-mb);
    min-height: 0;
  }

  .block-2col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }

  .block-h3-span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 6px 0;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .block-h3-span .h3-title-text {
    font-family: var(--fn-h3);
    font-size: var(--sz-h3);
    font-weight: 900;
    text-align: center;
    width: 100%;
    line-height: 1.22;
  }

  .title-level-4 { font-family: var(--fn-h4); font-size: var(--sz-h4); font-weight: 900; text-align: center; margin: 9px 0 4px 0; line-height: 1.22; }
  .title-level-custom { margin: 9px 0 4px 0; line-height: 1.3; }
  
  .note-marker { line-height: 0; cursor: pointer; }
  .footnote-area { position: absolute; bottom: 15mm; right: 15mm; left: 15mm; }
  .note-rule-plain { border-top: 1px solid #555; width: 35%; margin-bottom: 5px; }
  .note-rule-decorative { display: flex; align-items: center; gap: 6px; width: 62%; margin-bottom: 8px; }
  .note-rule-decorative .rule-seg { flex: 1; height: 1px; background: #555; }
  .note-rule-decorative .rule-glyphs { font-size: 9px; letter-spacing: 3px; color: #555; white-space: nowrap; }
  .note-block { font-size: 8.5pt; line-height: 1.5; }
  .note-line { break-inside: avoid; margin-bottom: 3px; }
  .note-line-num { font-weight: 700; margin-left: 3px; text-decoration: none; color: inherit; cursor: pointer; }
  .endnote-page-block { margin-top: 10mm; padding: 0 10mm; }
  .title-level-5 { font-family: var(--fn-h5); font-size: var(--sz-h5); font-weight: 700; text-align: center; margin: 7px 0 3px 0; line-height: 1.22; }
  .title-level-6 { font-family: var(--fn-h6); font-size: var(--sz-h6); font-weight: 700; text-align: center; margin: 6px 0 3px 0; line-height: 1.22; }

  .block-single-col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) calc(var(--w-col)*2 + var(--w-gutter)) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }
  .block-single-col .single-wide-col {
    grid-column: 3;
    font-family: var(--fn-h0-body);
    font-size: var(--sz-h0-body);
    line-height: 1.45;
    text-align: justify;
    text-justify: inter-word;
  }

  .margin-notes-column {
    font-family: var(--fn-h7);
    font-size: var(--sz-h7);
    line-height: 1.18;
    text-align: center;
    text-align-last: center;
    font-weight: 400;
    color: #404040;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .right-margin { grid-column: 1; }
  .left-margin { grid-column: 7; }
  .side-note-anchor { position: absolute; width: 100%; }

  .main-column {
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
    text-align: justify;
    text-justify: inter-word;
    min-height: 0;
    height: auto;
    position: relative;
  }

  .right-col { grid-column: 3; }
  .left-col { grid-column: 5; }

  p { margin-bottom: 7px; text-align: justify; text-justify: inter-word; position: relative; }
  p.p-end { text-align-last: center; }
  p.p-cut { text-align-last: justify; }

  .first-word-window {
    float: right;
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 0.85;
    height: 1.25em;
    margin-left: 6px;
    margin-bottom: 1px;
    display: block;
  }

  .first-word-inline {
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 1;
  }

  .page-number-footer {
    text-align: center;
    font-family: var(--fn-header-r);
    font-size: 12pt;
    font-weight: 700;
    height: 24px;
    flex-shrink: 0;
  }

  #measuring-box {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    top: -9999px;
    left: -9999px;
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
  }

  @media print {
    @page { size: A4; margin: 0; }
    body { background: none; padding: 0; overflow: visible; display: block; }
    #sidebar, #resizer { display: none !important; }
    #preview-pane { height: auto !important; overflow: visible !important; padding: 0 !important; background: none !important; display: block !important; }
    .a4-page { box-shadow: none; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; max-height: 297mm !important; padding: 15mm !important; margin: 0 !important; page-break-after: always; break-after: page; position: relative; }
    .page-content-wrapper, .shaar-main-content, .sub-shaar-content-centered, .back-shaar-content-centered { height: 100% !important; }
  }
</style>
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">

      <!-- ============================================================
           פאנל שערים וערכות נושא (ראשי, אחורי, משנה)
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">👑 ערכת נושא לשערי הספר (ראשי / אחורי / משנה)</div>
        
        <div style="margin-bottom: 6px; display:flex; gap:12px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked"> שער ראשי</label>
          <label style="font-size: 8.5pt; font-weight: 700;" title="מציג את גב דף השער הראשי בעמוד 2, כאשר הטקסט מיושר לצד ימין"><input type="checkbox" id="show-back-shaar"> שער אחורי (גב השער)</label>
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 8px;">
          <label>ערכת נושא:</label>
          <select id="theme-preset" style="flex:1;" onchange="handleThemePresetChange(this.value)">
            <option value="1" selected="selected">1. דמסק ושיש מרכזי</option>
            <option value="2">2. תחרת סלסולים כפולה</option>
            <option value="3">3. קרנות וילנא וגיליושה</option>
            <option value="custom">4. ערכת נושא מותאמת אישית (SVG / קבצים)</option>
          </select>
        </div>

        <!-- אזור הגדרת קובצי SVG / רקע לערכת נושא מותאמת -->
        <div id="custom-theme-files-box" style="display:none; background:#f0f4f8; border:1px dashed #93c5fd; padding:6px; border-radius:3px; margin-bottom:8px;">
          <div style="font-weight:700; font-size:8pt; margin-bottom:4px; color:#1e3a8a;">הגדרת קובצי SVG לערכה:</div>
          <div class="inline-cfg-row">
            <label>SVG שער ראשי:</label>
            <input type="file" id="file-theme-main-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-theme-main-img')">
            <input type="hidden" id="data-theme-main-img" value="">
          </div>
          <div class="inline-cfg-row">
            <label>SVG שער אחורי (ימין):</label>
            <input type="file" id="file-theme-back-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-theme-back-img')">
            <input type="hidden" id="data-theme-back-img" value="">
          </div>
          <div class="inline-cfg-row">
            <label>SVG שער משנה (שמאל):</label>
            <input type="file" id="file-theme-sub-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-theme-sub-img')">
            <input type="hidden" id="data-theme-sub-img" value="">
          </div>
          <div style="display:flex; gap:6px; margin-top:4px;">
            <div style="flex:1;"><label style="font-size:7.5pt; font-weight:700;">שולי שער ראשי (%):</label><input type="number" id="theme-main-inset" value="20" class="size-input" style="width:100%;"></div>
            <div style="flex:1;"><label style="font-size:7.5pt; font-weight:700;">רוחב טור צד (%):</label><input type="number" id="theme-side-col-w" value="55" class="size-input" style="width:100%;"></div>
          </div>
        </div>

        <div class="inline-cfg-row">
          <label>שם הספר:</label>
          <input type="text" id="inp-book-title" value="שם הספר" placeholder="שם הספר (כותרת ראשית)">
          <select id="f-sh-title" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-sh-title" class="size-input" value="46">
        </div>
        <div class="inline-cfg-row">
          <label>נושא / משנה:</label>
          <input type="text" id="inp-book-subtitle" value="נושא הספר מונסח בתמציות" placeholder="נושא / כותרת משנה">
          <select id="f-sh-sub" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-sub" class="size-input" value="21">
        </div>
        <div class="inline-cfg-row">
          <label>נושא מפורט:</label>
          <input type="text" id="inp-book-desc" value="נושא הספר בפרטות ובנוסח ארוך יותר" placeholder="נושא מפורט / תיאור החיבור">
          <select id="f-sh-desc" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-desc" class="size-input" value="12">
        </div>
        <div class="inline-cfg-row">
          <label>פרטי מהדורא:</label>
          <input type="text" id="inp-book-sections" value="פרטי מהדורה | פרטי מהדורה" placeholder="פרטי מהדורא / חלקים">
          <select id="f-sh-sec" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-sec" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>שם המחבר:</label>
          <input type="text" id="inp-book-author" value="שם המחבר" placeholder="שם המחבר">
          <select id="f-sh-author" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-author" class="size-input" value="15">
        </div>
        <div class="inline-cfg-row">
          <label>מקום ושנה:</label>
          <input type="text" id="inp-book-year" value="מקום ההוצאה | שנת ההוצאה" placeholder="מקום ושנת הוצאה">
          <select id="f-sh-year" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-year" class="size-input" value="12">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div class="inline-cfg-row">
            <label>עיטור סיום פרק:</label>
            <select id="section-divider-style" style="flex:1;" onchange="document.getElementById('row-sec-div-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'">
              <option value="pyramid">1. פירמידת וילנא (❖ ❖ ❖)</option>
              <option value="spear" selected="selected">2. רומח מחודד עם טבעת (SVG)</option>
              <option value="swash">3. שושנתא וילנאית (SVG)</option>
              <option value="flourish">4. סלסול תורני כפול (SVG)</option>
              <option value="custom_img">5. תמונת עיטור אישית</option>
              <option value="none">ללא עיטור</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sec-div-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ עיטור פרק:</label>
            <input type="file" id="file-sec-div-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>

      <!-- פאנל ייבוא תוספים -->
      <div class="panel-static">
        <div class="panel-header">🧩 ייבוא תוספים (סוגי עמוד / סגנונות טקסט)</div>
        <div class="inline-cfg-row">
          <label>סוג עמוד:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handlePageTypeImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>סגנון טקסט:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handleTextStyleImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>תמונה כעמוד:</label>
          <input type="file" accept="image/*" style="flex:1;font-size:8pt;" onchange="handleImagePageImportFile(event)">
        </div>
      </div>
      <div id="ext-imports-container"></div>

      <!-- ============================================================
           פאנל הגדרות הערות מורחב: שליטה בסימונים/מזהים לשני הסוגים
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">📝 הגדרות הערות (שוליים / סיום)</div>

        <!-- אזור הגדרות הערות שוליים (Footnotes) -->
        <div style="font-weight:700; font-size:8pt; margin: 2px 0 3px 0; color:#1e3a8a;">📌 הערות שוליים (בתחתית העמוד / בצד):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="fn-line-prefix" value="כותרת 7 -" placeholder="למשל: הערה - או כותרת 7 -" onchange="typesetDocument()">
        </div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="fn-delim-open" value="((" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" onchange="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="fn-delim-close" value="))" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" onchange="typesetDocument()">
          </div>
        </div>

        <!-- אזור הגדרות הערות סיום (Endnotes) -->
        <div style="font-weight:700; font-size:8pt; margin: 6px 0 3px 0; color:#1e3a8a; border-top:1px dashed #ddd; padding-top:4px;">📚 הערות סיום (מרוכזות בסוף חלק):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="en-line-prefix" value="הערת סיום -" placeholder="למשל: הערת סיום -" onchange="typesetDocument()">
        </div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="en-delim-open" value="[[" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" onchange="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="en-delim-close" value="]]" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" onchange="typesetDocument()">
          </div>
        </div>

        <div style="border-top:1px dashed #ddd; margin-top:6px; padding-top:4px;"></div>
        <div class="inline-cfg-row"><label>סוג סימון בטקסט:</label>
          <select id="note-marker-type" onchange="typesetDocument()">
            <option value="super" selected="selected">כתב עילי</option>
            <option value="normal">רגיל (על השורה)</option>
            <option value="sub">כתב תחתי</option>
            <option value="brackets">בסוגריים מרובעים [1]</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>גודל סימון בטקסט:</label><input type="number" id="note-marker-size" value="8" class="size-input" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>גודל מס' ברשימה:</label><input type="number" id="note-listing-num-size" value="8" class="size-input" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>מפריד אחרי מספר:</label><input type="text" id="note-num-separator" value="." style="flex:0 0 40px;" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>קו מפריד (שוליים):</label>
          <select id="note-rule-style" onchange="typesetDocument()">
            <option value="plain" selected="selected">קו רגיל</option>
            <option value="dots">קו + עיגולים ◦◦◦</option>
            <option value="sparkle">קו + ניצוץ ❖❖❖</option>
            <option value="star">קו + כוכבית ✧✧✧</option>
            <option value="diamond">קו + יהלום ♦♦♦</option>
            <option value="none">ללא קו</option>
          </select>
        </div>
      </div>

      <!-- פאנל איכות עימוד -->
      <div class="panel-static">
        <div class="panel-header">✍️ איכות עימוד אוטומטי</div>
        <div class="inline-cfg-row"><label>מניעת שורות בודדות:</label>
          <select id="avoid-widows-select" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>איזון סוף-פרק:</label>
          <select id="balance-chapter-end" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
      </div>

      <!-- פאנל רקעים -->
      <div class="panel-static">
        <div class="panel-header">🎨 רקע לעמודי תוכן</div>
        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד טקסט רגיל:</label>
          <select id="cbg-regular-mode" style="flex:1;" onchange="toggleCbgSubRows('regular', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-regular-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-regular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-regular-img')">
          <input type="hidden" id="data-cbg-regular-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-regular-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 0":</label>
          <select id="cbg-h0Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h0Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h0Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h0Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h0Open-img')">
          <input type="hidden" id="data-cbg-h0Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h0Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 2":</label>
          <select id="cbg-h2Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h2Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h2Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h2Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h2Open-img')">
          <input type="hidden" id="data-cbg-h2Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h2Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div style="font-size:8pt; font-weight:700; margin-bottom:6px;">תוכן העניינים</div>
          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד ראשון:</label>
            <select id="cbg-tocFirst-mode" style="flex:1;" onchange="toggleCbgSubRows('tocFirst', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocFirst-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocFirst-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocFirst-img')">
            <input type="hidden" id="data-cbg-tocFirst-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocFirst-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד רגיל (ביניים):</label>
            <select id="cbg-tocRegular-mode" style="flex:1;" onchange="toggleCbgSubRows('tocRegular', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocRegular-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocRegular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocRegular-img')">
            <input type="hidden" id="data-cbg-tocRegular-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocRegular-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד אחרון:</label>
            <select id="cbg-tocLast-mode" style="flex:1;" onchange="toggleCbgSubRows('tocLast', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocLast-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocLast-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocLast-img')">
            <input type="hidden" id="data-cbg-tocLast-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocLast-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>
        </div>
      </div>

      <!-- פאנל כותרות 0-7 -->
      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h0" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>טקסט כותרת 0:</label>
          <span style="font-size:7.5pt; color:#666; width:95px; flex-shrink:0;">(גוף ההקדמה)</span>
          <select id="f-h0-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Frank Ruhl Libre', serif" selected="selected">Frank Ruhl Libre</option></optgroup></select>
          <input type="number" id="s-h0-body" class="size-input" value="11.5" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 1 (שער משנה):</label>
          <select id="mode-h1"><option value="sub_shaar" selected="selected">שער משנה נפרד</option><option value="new_page_1col">טור 1 עמוד הבא</option></select>
          <select id="f-h1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-h1" class="size-input" value="50">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h1" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h2" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 3:</label>
          <select id="mode-h3"><option value="span_1col" selected="selected">טור 1 רציף (רוחב דף)</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h3" class="size-input" value="13.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 4:</label>
          <select id="mode-h4"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h4" class="size-input" value="12.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 5:</label>
          <select id="mode-h5"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaLight', serif" selected="selected">AlphaLight</option></optgroup></select>
          <input type="number" id="s-h5" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 6:</label>
          <select id="mode-h6"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Noto Serif Hebrew', serif" selected="selected">Noto Serif Hebrew</option></optgroup></select>
          <input type="number" id="s-h6" class="size-input" value="10.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 7 (צד):</label>
          <select id="mode-h7"><option value="side_note" selected="selected">כותרת צד בשוליים</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Hadassah Friedlaender', serif" selected="selected">Hadassah Friedlaender</option></optgroup></select>
          <input type="number" id="s-h7" class="size-input" value="6" step="0.2">
        </div>
      </div>

      <!-- פאנל כותרות עליונות -->
      <div class="panel-static">
        <div class="panel-header">📑 כותרות עליונות (3 אזורים)</div>
        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">1. מעל הטור הימני:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-r-type" style="flex:1;" onchange="document.getElementById('hdr-r-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1" selected="selected">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-r-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option><option value="left">שמאל</option></select>
          <select id="f-hdr-r" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-r" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-r-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">2. מעל הרווח המרכזי (Gutter):</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-c-type" style="flex:1;" onchange="
            document.getElementById('hdr-c-custom').style.display = this.value === 'custom' ? 'block' : 'none';
            document.getElementById('row-hdr-c-img').style.display = this.value === 'custom_img' ? 'flex' : 'none';
          ">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear" selected="selected">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="custom_img">תמונת עיטור (קובץ)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-c-align" style="width:65px;"><option value="center" selected="selected">מרכז</option></select>
          <select id="f-hdr-c" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-c" class="size-input" value="11">
        </div>
        <input type="text" id="hdr-c-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
        <div class="inline-cfg-row" id="row-hdr-c-img" style="display:none; margin-bottom:8px;">
          <label>קובץ עיטור מרכזי:</label>
          <input type="file" id="file-hdr-c-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
          <input type="hidden" id="data-hdr-c-img" value="">
        </div>

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">3. מעל הטור השמאלי:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-l-type" style="flex:1;" onchange="document.getElementById('hdr-l-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2" selected="selected">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-l-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option></select>
          <select id="f-hdr-l" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-l" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-l-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:4px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
      </div>

      <!-- פאנל תוכן העניינים -->
      <div class="panel-static">
        <div class="panel-header">📑 תוכן העניינים (כללי ומפורט)</div>
        <div style="margin-bottom:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-general-toc" checked="checked"> הצג תוכן עניינים כללי בראש הספר</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="gtoc-show" value="1" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="1"></td><td><select id="f-gtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="gtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="2"></td><td><select id="f-gtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="gtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="3" checked="checked"></td><td><select id="f-gtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="gtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="4"></td><td><select id="f-gtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="gtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="5"></td><td><select id="f-gtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="gtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="6"></td><td><select id="f-gtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="gtoc-show" value="7"></td><td><input type="checkbox" class="gtoc-grp" value="7"></td><td><select id="f-gtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>

        <div style="margin: 8px 0 4px 0; border-top:1px dashed #ccc; padding-top:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-detailed-toc" checked="checked"> הצג תוכן מפורט בראש שערי משנה</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="dtoc-show" value="1"></td><td><input type="checkbox" class="dtoc-grp" value="1"></td><td><select id="f-dtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="dtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="2"></td><td><select id="f-dtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="dtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="3"></td><td><select id="f-dtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="dtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="4" checked="checked"></td><td><select id="f-dtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="dtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="5" checked="checked"></td><td><select id="f-dtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="dtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="6" checked="checked"></td><td><select id="f-dtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="dtoc-show" value="7" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="7" checked="checked"></td><td><select id="f-dtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>
      </div>

      <!-- פאנל גריד וטיפוגרפיה -->
      <div class="panel-static">
        <div class="panel-header">📐 גריד וטיפוגרפיה כללית</div>
        <div class="inline-cfg-row">
          <label>גוף הטקסט:</label>
          <select id="font-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Guttman Rashi', serif" selected="selected">Guttman Rashi</option></optgroup></select>
          <input type="number" id="size-body" class="size-input" value="12" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>מילה ראשונה:</label>
          <select id="font-first-word" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'FrankReal', serif" selected="selected">FrankReal</option></optgroup></select>
          <input type="number" id="size-first-word" class="size-input" value="1.5" step="0.1">
        </div>
        <div class="proportions-grid" style="margin-top:6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div class="prop-item"><label>טור (%):</label><input type="number" id="prop-col" value="40" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח מרכזי (%):</label><input type="number" id="prop-gutter" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח ביניים (%):</label><input type="number" id="prop-gap" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>מרחק עליון (px):</label><input type="number" id="prop-mt" value="20" step="1" class="size-input"></div>
          <div class="prop-item"><label>מרחק תחתון (px):</label><input type="number" id="prop-mb" value="20" step="1" class="size-input"></div>
        </div>
      </div>

    </div>

    <div class="btn-bar-bottom">
      <button class="btn-save-template" onclick="saveAsDefaultTemplate()">💾 שמור תבנית</button>
      <button class="btn-primary" onclick="typesetDocument()">⚡ עדכן ועמד מחדש</button>
      <button class="btn-secondary" onclick="window.print()">🖨️ הדפסה / PDF</button>
    </div>
  </div>

  <div id="resizer"></div>

  <div id="preview-pane">
    <div id="book-container"></div>
  </div>

  <div id="measuring-box"></div>

  <script>
    const resizer = document.getElementById('resizer');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      resizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newWidth = document.body.clientWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 780) {
        sidebar.style.width = newWidth + 'px';
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });

    const CBG_TEXTURE_SVG = "data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.18'/%3E%3C/svg%3E";

    // מחזירה מחרוזת CSS לרקע עמוד לפי תפקיד
    function getContentBgCSS(roleKey) {
      const modeEl = document.getElementById('cbg-' + roleKey + '-mode');
      if (!modeEl) return '';
      const mode = modeEl.value;
      if (mode === 'color') {
        const c = document.getElementById('cbg-' + roleKey + '-color');
        return c ? `background-color:${c.value};background-image:none;` : '';
      }
      if (mode === 'texture') {
        return `background-color:#fdfcf6;background-image:url("${CBG_TEXTURE_SVG}");background-repeat:repeat;`;
      }
      if (mode === 'image') {
        const imgEl = document.getElementById('data-cbg-' + roleKey + '-img');
        const opEl = document.getElementById('cbg-' + roleKey + '-opacity');
        const img = imgEl ? imgEl.value : '';
        if (!img) return '';
        const op = opEl ? (parseInt(opEl.value, 10) / 100) : 0.15;
        const fade = 1 - op;
        return `background-image:linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${img}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
      }
      return '';
    }

    function applyContentBg(pageEl, roleKey) {
      const css = getContentBgCSS(roleKey);
      if (css) pageEl.style.cssText += css;
    }

    function toggleCbgSubRows(role, mode) {
      const rowColor = document.getElementById('row-cbg-' + role + '-color');
      const rowImg = document.getElementById('row-cbg-' + role + '-img');
      const rowOp = document.getElementById('row-cbg-' + role + '-op');
      if (rowColor) rowColor.style.display = (mode === 'color') ? 'flex' : 'none';
      if (rowImg) rowImg.style.display = (mode === 'image') ? 'flex' : 'none';
      if (rowOp) rowOp.style.display = (mode === 'image') ? 'flex' : 'none';
    }

    /* ============================================================
       מערכת ערכות נושא (Themes) לשערי הספר (ראשי, אחורי, משנה)
       ============================================================ */
    function handleThemePresetChange(val) {
      const customBox = document.getElementById('custom-theme-files-box');
      if (customBox) {
        customBox.style.display = (val === 'custom') ? 'block' : 'none';
      }
      typesetDocument();
    }

    /* ===================== EXTENSIONS: imported page-types / text-styles / image-pages ===================== */
    let importedPageTypes = [];
    let importedTextStyles = [];
    let importedImagePages = [];
    let extImportCounter = 0;
    let nextSyntheticLevel = 8;

    function validateExtJSON(def, expectedKind) {
      if (!def || typeof def !== 'object') return 'קובץ לא תקין (לא JSON תקין).';
      if (def.kind !== expectedKind) return 'הקובץ אינו מסוג ' + (expectedKind === 'pageType' ? 'סוג עמוד' : 'סגנון טקסט') + ' (kind=' + def.kind + ').';
      if (!def.name) return 'להגדרה שיובאה אין שם (name).';
      return null;
    }

    function handlePageTypeImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'pageType');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-pt-' + (extImportCounter++);
        importedPageTypes.push({ instanceId, def, anchor: def.insertionAnchor || 'afterAll', repeatMode: def.repeatMode || 'once' });
        buildExtPanel('pageType', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleTextStyleImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'textStyle');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-ts-' + (extImportCounter++);
        const syntheticLevel = (def.trigger && def.trigger.type === 'linePrefix') ? (nextSyntheticLevel++) : null;
        importedTextStyles.push({ instanceId, def, syntheticLevel });
        buildExtPanel('textStyle', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleImagePageImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const instanceId = 'ext-img-' + (extImportCounter++);
        importedImagePages.push({ instanceId, name: file.name, dataUrl: e.target.result, anchor: 'afterAll' });
        buildExtPanel('imagePage', instanceId, 'תמונה: ' + file.name, null);
        typesetDocument();
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    const EXT_ANCHOR_OPTIONS = [
      ['beforeAll','לפני הכל'], ['afterMainShaar','אחרי השער הראשי'], ['afterGeneralToc','אחרי תוכן העניינים הכללי'],
      ['beforeEachPart','לפני כל שער-חלק'], ['afterEachPart','מיד אחרי כל שער-חלק'], ['endOfEachPart','בסוף כל חלק'], ['afterAll','אחרי הכל']
    ];

    function buildExtPanel(kind, instanceId, name, def) {
      const panel = document.createElement('div');
      panel.className = 'panel-static';
      panel.id = instanceId + '-panel';
      const icon = kind === 'pageType' ? '📄' : kind === 'textStyle' ? '🅰️' : '🖼️';
      let triggerInfo = '';
      if (kind === 'textStyle' && def && def.trigger) {
        triggerInfo = (def.trigger.type === 'delimiterPair')
          ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${def.trigger.open}" ל-"${def.trigger.close}"</div>`
          : `<div style="font-size:7.5pt;color:#888;">קידומת: "${def.trigger.prefix}"</div>`;
      }
      const anchorRow = (kind !== 'textStyle')
        ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${instanceId}-anchor" onchange="updateExtAnchor('${kind}','${instanceId}', this.value)">${EXT_ANCHOR_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>`
        : '';
      panel.innerHTML = `
        <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>${icon} ${name}</span>
          <span style="cursor:pointer;color:#a33;font-weight:700;" onclick="removeExtInstance('${kind}','${instanceId}')">✕ הסר</span>
        </div>
        ${triggerInfo}
        ${anchorRow}
      `;
      document.getElementById('ext-imports-container').appendChild(panel);
      if (kind !== 'textStyle') {
        const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
        const inst = store.find(x => x.instanceId === instanceId);
        const sel = document.getElementById(instanceId + '-anchor');
        if (sel && inst) sel.value = inst.anchor;
      }
    }

    function updateExtAnchor(kind, instanceId, val) {
      const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
      const inst = store.find(x => x.instanceId === instanceId);
      if (inst) inst.anchor = val;
      typesetDocument();
    }

    function removeExtInstance(kind, instanceId) {
      if (kind === 'pageType') importedPageTypes = importedPageTypes.filter(x => x.instanceId !== instanceId);
      else if (kind === 'textStyle') importedTextStyles = importedTextStyles.filter(x => x.instanceId !== instanceId);
      else importedImagePages = importedImagePages.filter(x => x.instanceId !== instanceId);
      const p = document.getElementById(instanceId + '-panel');
      if (p) p.remove();
      typesetDocument();
    }

    function findPrefixLineInSource(rawText, prefix) {
      if (!prefix) return null;
      const lines = rawText.split('\n');
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith(prefix)) return t.slice(prefix.length).replace(/^[:\-–—]\s*/, '').trim();
      }
      return null;
    }

    const EXT_V_MAP = { top:'14mm', upperMid:'25%', center:'50%', lowerMid:'75%' };

    function applyExtStyleToNode(node, style, hostFontSizePt) {
      if (!style) return;
      if (style.family) node.style.fontFamily = style.family;
      if (typeof style.size === 'number') node.style.fontSize = style.size + 'pt';
      if (typeof style.sizeDelta === 'number') node.style.fontSize = ((hostFontSizePt||12) + style.sizeDelta) + 'pt';
      if (style.weight) node.style.fontWeight = style.weight;
      if (style.color) node.style.color = style.color;
      if (style.align) node.style.textAlign = style.align;
      if (style.border) {
        node.style.border = style.border.width + 'px solid ' + style.border.color;
        node.style.borderRadius = style.border.radius + 'px';
        node.style.padding = '2px 8px';
      }
    }

    function renderImportedPage(container, inst, rawSourceText) {
      const def = inst.def;
      const page = document.createElement('div');
      page.className = 'a4-page';
      if (def.background && def.background.mode === 'fixed') {
        const bs = def.background.style;
        if (bs === 'color' && def.background.color) page.style.background = def.background.color;
        else if (bs === 'texture') { page.style.background = '#fdfcf6 url("'+CBG_TEXTURE_SVG+'") repeat'; }
        else if (bs === 'image' && def.background.image) {
          const fade = 1 - (def.background.opacity != null ? def.background.opacity : 0.15);
          page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${def.background.image}")`;
          page.style.backgroundSize = 'cover'; page.style.backgroundPosition = 'center';
        }
      } else {
        applyContentBg(page, 'regular');
      }
      (def.elements || []).forEach(elDef => {
        const matched = findPrefixLineInSource(rawSourceText, elDef.prefix);
        const text = matched || elDef.defaultText || '';
        if (!text) return;
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.textContent = text;
        const pos = elDef.position || {};
        const va = pos.vAnchor || 'center', ha = pos.hAlign || 'center', off = pos.offsetY || 0;
        if (va === 'bottom') { el.style.bottom = (18 - off) + 'mm'; }
        else {
          el.style.top = `calc(${EXT_V_MAP[va] || '50%'} + ${off}px)`;
          if (va === 'center' || va === 'upperMid' || va === 'lowerMid') el.style.transform = 'translateY(-50%)';
        }
        if (ha === 'right' || ha === 'rightMid') { el.style.right = (ha === 'right' ? '15mm' : '25%'); }
        else if (ha === 'left' || ha === 'leftMid') { el.style.left = (ha === 'left' ? '15mm' : '25%'); }
        else { el.style.right = '0'; el.style.left = '0'; el.style.textAlign = 'center'; }
        applyExtStyleToNode(el, elDef.style, 12);
        page.appendChild(el);
      });
      container.appendChild(page);
    }

    function renderImportedImagePage(container, inst) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      page.style.backgroundImage = `url("${inst.dataUrl}")`;
      page.style.backgroundSize = 'cover';
      page.style.backgroundPosition = 'center';
      container.appendChild(page);
    }

    function renderExtAnchor(container, anchorKey, rawSourceText) {
      importedPageTypes.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedPage(container, inst, rawSourceText));
      importedImagePages.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedImagePage(container, inst));
    }

    function appendMainSubParts(hostElem, mainText, subText, def) {
      const mainPart = document.createElement('div');
      mainPart.textContent = mainText.trim();
      applyExtStyleToNode(mainPart, def.style, 14);
      hostElem.appendChild(mainPart);
      if (subText && subText.trim()) {
        const subPart = document.createElement('div');
        subPart.textContent = subText.trim();
        subPart.style.fontSize = '0.68em'; subPart.style.opacity = '0.78'; subPart.style.marginTop = '3px';
        hostElem.appendChild(subPart);
      }
    }

    function renderCustomHeadingInto(hostElem, inst, text) {
      const def = inst.def;
      hostElem.innerHTML = '';

      if (def.parseMode === 'splitFirstDash' && /[-–—]/.test(text)) {
        appendMainSubParts(hostElem, text.split(/[-–—]/)[0], text.split(/[-–—]/).slice(1).join(' - '), def);
        return;
      }

      if (def.parseMode === 'splitCustomDelimiter' && def.parseDelimiter && text.indexOf(def.parseDelimiter) > -1) {
        const idx = text.indexOf(def.parseDelimiter);
        appendMainSubParts(hostElem, text.slice(0, idx), text.slice(idx + def.parseDelimiter.length), def);
        return;
      }

      if (def.parseMode === 'regexGroups' && def.parseRegex) {
        let match = null;
        try {
          match = text.match(new RegExp(def.parseRegex));
        } catch (e) {
          console.warn('סגנון "' + def.name + '": ביטוי רגולרי לא תקין (' + def.parseRegex + ') — ' + e.message);
        }
        if (match && match.groups && Object.keys(match.groups).length) {
          const vals = Object.values(match.groups).filter(v => v !== undefined);
          if (vals.length) {
            appendMainSubParts(hostElem, vals[0], vals.slice(1).join(' '), def);
            return;
          }
        }
      }

      hostElem.textContent = text;
      applyExtStyleToNode(hostElem, def.style, 12);
    }

    function findExtTextStyle(instanceId) {
      return importedTextStyles.find(x => x.instanceId === instanceId);
    }

    function finalizeNotePositions(notesList, columnBoundaryHeight) {
      const byMargin = new Map();
      notesList.forEach(item => {
        if (!item.elem || !item.pElem) return;
        const marg = item.elem.parentElement;
        if (!marg) return;
        if (!byMargin.has(marg)) byMargin.set(marg, []);
        byMargin.get(marg).push(item);
      });
      byMargin.forEach(group => {
        group.sort((a, b) => a.pElem.offsetTop - b.pElem.offsetTop);
        group.forEach((item, idx) => {
          const noteHeight = item.elem.getBoundingClientRect().height || item.elem.offsetHeight || 0;
          let top = item.pElem.offsetTop;
          if (top + noteHeight > columnBoundaryHeight) {
            const prev = idx > 0 ? group[idx - 1] : null;
            const prevBottom = prev ? (parseFloat(prev.elem.style.top || 0) + (prev.elem.getBoundingClientRect().height || 0)) : 0;
            const minTop = prev ? prevBottom + 6 : 0;
            const raisedTop = columnBoundaryHeight - noteHeight;
            if (raisedTop >= minTop) {
              top = raisedTop;
            } else {
              const tokenId = item.pElem.getAttribute('data-token-id');
              const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
              if (contElem && contElem !== item.pElem) {
                const page = contElem.closest('.a4-page');
                const isRightCol = !!contElem.closest('.right-col');
                const destMargin = page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null;
                if (destMargin) {
                  const next = idx < group.length - 1 ? group[idx + 1] : null;
                  const maxTop = next ? (parseFloat(next.elem.style.top || Infinity) - noteHeight - 6) : Infinity;
                  const contTop = contElem.offsetTop;
                  if (contTop <= maxTop) {
                    destMargin.appendChild(item.elem);
                    top = contTop;
                  }
                }
              }
            }
          }
          item.elem.style.top = top + 'px';
        });
      });
    }

    /* ============================================================
       סריקת והחלת תוחמי טקסט (כולל תוחמי הערות גלובליים מותאמים)
       ============================================================ */
    function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt) {
      const activeStyles = [];

      // הוספת תוחמי הערות שוליים גלובליים שהוגדרו בפאנל (ברירת מחדל: (( ו-)))
      const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
      const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
      if (fnOpen && fnClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose }, target: 'footnote' },
          instanceId: 'builtin-footnote'
        });
      }

      // הוספת תוחמי הערות סיום גלובליים שהוגדרו בפאנל (ברירת מחדל: [[ ו-]])
      const enOpen = document.getElementById('en-delim-open')?.value?.trim();
      const enClose = document.getElementById('en-delim-close')?.value?.trim();
      if (enOpen && enClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: enOpen, close: enClose }, target: 'endnote' },
          instanceId: 'builtin-endnote'
        });
      }

      // הוספת סגנונות מיובאים
      importedTextStyles.forEach(inst => {
        const trig = inst.def && inst.def.trigger;
        if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
        const scope = trig.appliesWithin;
        if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
        activeStyles.push(inst);
      });

      if (!activeStyles.length) return;
      const effHostSize = hostSizePt || 12;

      const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let n;
      while (n = walker.nextNode()) textNodes.push(n);

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        let matches = [];
        activeStyles.forEach(inst => {
          const trig = inst.def.trigger;
          let searchFrom = 0;
          while (true) {
            const oIdx = text.indexOf(trig.open, searchFrom);
            if (oIdx === -1) break;
            const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
            if (cIdx === -1) break;
            matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
            searchFrom = cIdx + trig.close.length;
          }
        });
        if (!matches.length) return;
        matches.sort((a,b) => a.start - b.start);
        const dedup = [];
        let lastEnd = -1;
        matches.forEach(m => { if (m.start >= lastEnd) { dedup.push(m); lastEnd = m.end; } });

        const frag = document.createDocumentFragment();
        let cursor = 0;
        dedup.forEach(m => {
          if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
          if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
            const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
            const innerText = text.slice(m.start + openLen, m.end - closeLen);
            const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
            frag.appendChild(marker);
          } else {
            const span = document.createElement('span');
            span.textContent = text.slice(m.start, m.end);
            applyExtStyleToNode(span, m.inst.def.style, effHostSize);
            frag.appendChild(span);
          }
          cursor = m.end;
        });
        if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }

    function getHostSizePt(level, customStyleId) {
      if (customStyleId) {
        const inst = findExtTextStyle(customStyleId);
        if (inst && inst.def.style && typeof inst.def.style.size === 'number') return inst.def.style.size;
        return 12;
      }
      const el = document.getElementById('s-h' + level);
      return el ? parseFloat(el.value) : 12;
    }
    function getBodySizePt() {
      const el = document.getElementById('size-body');
      return el ? parseFloat(el.value) : 12;
    }

    /* ===================== NOTES: footnotes + endnotes ===================== */
    const HEBREW_ALEF_BET = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
    function toHebrewLetterSeq(n) {
      if (n <= 0) return '';
      let result = '', num = n;
      while (num > 0) { num--; result = HEBREW_ALEF_BET[num % 22] + result; num = Math.floor(num / 22); }
      return result;
    }
    let noteCounters = { footnote: 0, endnote: 0 };
    let noteUidCounter = 0;
    let footnoteQueueForPage = [];
    let endnoteQueueForPart = [];

    function getNoteConfig(styleId) {
      const inst = findExtTextStyle(styleId);
      return (inst && inst.def.noteConfig) || {};
    }
    function formatNoteMarker(n, styleId) {
      const cfg = getNoteConfig(styleId);
      return (cfg.numberingStyle === 'alphabetic') ? toHebrewLetterSeq(n) : String(n);
    }
    function resetNoteCounterIfNeeded(target, trigger) {
      importedTextStyles.forEach(inst => {
        if (inst.def.target === target) {
          const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt) || (target === 'footnote' ? 'page' : 'part');
          if (resetAt === trigger) noteCounters[target] = 0;
        }
      });
    }
    function applyNoteMarkerStyle(el, isBacklink) {
      const typeEl = document.getElementById('note-marker-type');
      const sizeEl = isBacklink ? document.getElementById('note-listing-num-size') : document.getElementById('note-marker-size');
      const type = (!isBacklink && typeEl) ? typeEl.value : 'normal';
      const size = sizeEl ? parseFloat(sizeEl.value) : 8;
      el.style.fontSize = size + 'pt';
      el.style.fontWeight = '700';
      el.style.textDecoration = 'none';
      el.style.color = 'inherit';
      el.style.cursor = 'pointer';
      if (type === 'super') { el.style.verticalAlign = 'super'; el.style.lineHeight = '0'; }
      else if (type === 'sub') { el.style.verticalAlign = 'sub'; el.style.lineHeight = '0'; }
      else { el.style.verticalAlign = 'baseline'; }
      if (!isBacklink && type === 'brackets') { el.textContent = '[' + el.textContent + ']'; }
    }
    function createNoteMarkerAndQueue(text, styleId, target) {
      noteCounters[target] = (noteCounters[target] || 0) + 1;
      const num = noteCounters[target];
      const markerText = formatNoteMarker(num, styleId);
      const uid = 'n' + (noteUidCounter++);
      const marker = document.createElement('a');
      marker.className = 'note-marker';
      marker.href = '#note-' + uid;
      marker.id = 'noteref-' + uid;
      marker.textContent = markerText;
      applyNoteMarkerStyle(marker, false);
      const item = { number: markerText, text: text, styleId: styleId, uid: uid };
      if (target === 'footnote') footnoteQueueForPage.push(item);
      else endnoteQueueForPart.push(item);
      return marker;
    }

    function buildNoteBlockElement(queue, columns) {
      const wrap = document.createElement('div');
      wrap.className = 'note-block';
      if (columns === 2) wrap.style.columnCount = '2';
      const sepEl = document.getElementById('note-num-separator');
      const globalSep = sepEl ? sepEl.value : '.';
      queue.forEach(item => {
        const line = document.createElement('div');
        line.className = 'note-line';
        line.id = 'note-' + item.uid;
        const num = document.createElement('a');
        num.className = 'note-line-num';
        num.href = '#noteref-' + item.uid;
        num.textContent = item.number + globalSep + ' ';
        applyNoteMarkerStyle(num, true);
        const body = document.createElement('span');
        body.textContent = item.text;
        const inst = findExtTextStyle(item.styleId);
        if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
        line.appendChild(num); line.appendChild(body);
        wrap.appendChild(line);
      });
      return wrap;
    }

    function buildNoteRuleElement() {
      const sel = document.getElementById('note-rule-style');
      const style = sel ? sel.value : 'plain';
      const rule = document.createElement('div');
      if (style === 'none') { rule.style.display = 'none'; return rule; }
      if (style === 'plain') { rule.className = 'note-rule-plain'; return rule; }
      const glyphs = { dots: '◦◦◦', sparkle: '❖❖❖', star: '✧✧✧', diamond: '♦♦♦' };
      rule.className = 'note-rule-decorative';
      const segR = document.createElement('span'); segR.className = 'rule-seg';
      const mid = document.createElement('span'); mid.className = 'rule-glyphs'; mid.textContent = glyphs[style] || '';
      const segL = document.createElement('span'); segL.className = 'rule-seg';
      rule.appendChild(segR); rule.appendChild(mid); rule.appendChild(segL);
      return rule;
    }

    function flushFootnotesInto(pageEl) {
      if (!footnoteQueueForPage.length) { resetNoteCounterIfNeeded('footnote', 'page'); return; }
      const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
      const rule = buildNoteRuleElement();
      const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
      const area = document.createElement('div');
      area.className = 'footnote-area';
      area.appendChild(rule);
      area.appendChild(block);
      pageEl.appendChild(area);
      footnoteQueueForPage = [];
      resetNoteCounterIfNeeded('footnote', 'page');
    }

    function flushEndnotesForPart(container, pIdx) {
      if (!endnoteQueueForPart.length) { resetNoteCounterIfNeeded('endnote', 'part'); return 0; }
      const cfg0 = getNoteConfig(endnoteQueueForPart[0].styleId);
      const columns = cfg0.columns || 1;
      let pagesUsed = 0;
      let remaining = endnoteQueueForPart.slice();
      while (remaining.length) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        applyContentBg(page, 'regular');
        const title = document.createElement('div');
        title.className = 'title-level-2-standalone';
        title.textContent = pagesUsed === 0 ? 'הערות' : 'הערות (המשך)';
        page.appendChild(title);
        const wrap = document.createElement('div');
        wrap.className = 'note-block endnote-page-block';
        if (columns === 2) wrap.style.columnCount = '2';
        page.appendChild(wrap);
        container.appendChild(page);
        let fit = 0;
        for (let i = 0; i < remaining.length; i++) {
          const testBlock = buildNoteBlockElement(remaining.slice(0, i + 1), columns);
          wrap.innerHTML = ''; wrap.appendChild(testBlock);
          if (wrap.scrollHeight > page.clientHeight - 60 && i > 0) { break; }
          fit = i + 1;
        }
        remaining = remaining.slice(fit);
        pagesUsed++;
        if (pagesUsed > 200) break;
      }
      endnoteQueueForPart = [];
      resetNoteCounterIfNeeded('endnote', 'part');
      return pagesUsed;
    }

    // תמיכה בהעלאת קבצים כולל SVG כ-Data URL
    function handleImageUpload(event, targetInputId) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const targetInput = document.getElementById(targetInputId);
        if (targetInput) {
          targetInput.value = e.target.result;
          targetInput.setAttribute('value', e.target.result);
          typesetDocument();
        }
      };
      reader.readAsDataURL(file);
    }

    function saveAsDefaultTemplate() {
      let dataIsland = document.getElementById('ext-imports-data');
      if (!dataIsland) {
        dataIsland = document.createElement('script');
        dataIsland.type = 'application/json';
        dataIsland.id = 'ext-imports-data';
        document.head.appendChild(dataIsland);
      }
      dataIsland.textContent = JSON.stringify({
        pageTypes: importedPageTypes,
        textStyles: importedTextStyles,
        imagePages: importedImagePages
      });

      document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"], input[type="color"], input[type="range"]').forEach(input => {
        input.setAttribute('value', input.value);
      });
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) cb.setAttribute('checked', 'checked');
        else cb.removeAttribute('checked');
      });
      document.querySelectorAll('select').forEach(sel => {
        Array.from(sel.options).forEach(opt => {
          if (opt.value === sel.value) opt.setAttribute('selected', 'selected');
          else opt.removeAttribute('selected');
        });
      });

      const rawInputElem = document.getElementById('raw-input');
      const prevVal = rawInputElem.value;
      rawInputElem.innerHTML = '';
      rawInputElem.value = '';

      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      rawInputElem.value = prevVal;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'torani-typesetting-template.html';
      a.click();
      URL.revokeObjectURL(a.href);
    }

    async function loadSystemFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const availableFonts = await window.queryLocalFonts();
          const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));
          
          if (fontFamilies.length > 0) {
            document.querySelectorAll('.font-picker').forEach(select => {
              const currentVal = select.value;
              select.innerHTML = '';
              
              const sysGroup = document.createElement('optgroup');
              sysGroup.label = `גופני מחשב (${fontFamilies.length} נמצאו)`;
              
              fontFamilies.forEach(family => {
                const opt = document.createElement('option');
                opt.value = `'${family}', serif`;
                opt.textContent = family;
                if (currentVal.includes(family)) opt.selected = true;
                sysGroup.appendChild(opt);
              });
              
              select.appendChild(sysGroup);
            });
            alert(`נטענו בהצלחה ${fontFamilies.length} גופנים מהמחשב!`);
          }
        } catch (err) {
          alert('לא ניתנה הרשאה לגישה לגופני המחשב.');
        }
      } else {
        alert('הדפדפן אינו תומך בגישה ישירה לגופני המערכת. מומלץ להשתמש ב-Chrome או Edge.');
      }
    }

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

    function updateGrid() {
      const root = document.documentElement;
      const rawCol = parseFloat(document.getElementById('prop-col').value) || 0;
      const rawMargin = parseFloat(document.getElementById('prop-margin').value) || 0;
      const rawGutter = parseFloat(document.getElementById('prop-gutter').value) || 0;
      const rawGap = parseFloat(document.getElementById('prop-gap').value) || 0;
      const total = 2 * rawCol + 2 * rawMargin + rawGutter + 2 * rawGap;
      const scale = total > 0 ? 100 / total : 1;
      root.style.setProperty('--w-col', (rawCol * scale) + '%');
      root.style.setProperty('--w-margin', (rawMargin * scale) + '%');
      root.style.setProperty('--w-gutter', (rawGutter * scale) + '%');
      root.style.setProperty('--w-gap', (rawGap * scale) + '%');
      root.style.setProperty('--flow-mt', document.getElementById('prop-mt').value + 'px');
      root.style.setProperty('--flow-mb', document.getElementById('prop-mb').value + 'px');
    }

    function updateStyles() {
      const root = document.documentElement;
      root.style.setProperty('--fn-header-r', document.getElementById('f-hdr-r').value);
      root.style.setProperty('--sz-header-r', document.getElementById('s-hdr-r').value + 'pt');
      root.style.setProperty('--fn-header-c', document.getElementById('f-hdr-c').value);
      root.style.setProperty('--sz-header-c', document.getElementById('s-hdr-c').value + 'pt');
      root.style.setProperty('--fn-header-l', document.getElementById('f-hdr-l').value);
      root.style.setProperty('--sz-header-l', document.getElementById('s-hdr-l').value + 'pt');

      root.style.setProperty('--fn-h0', document.getElementById('f-h0').value);
      root.style.setProperty('--sz-h0', document.getElementById('s-h0').value + 'pt');
      root.style.setProperty('--fn-h0-body', document.getElementById('f-h0-body').value);
      root.style.setProperty('--sz-h0-body', document.getElementById('s-h0-body').value + 'pt');

      root.style.setProperty('--fn-h1', document.getElementById('f-h1').value);
      root.style.setProperty('--sz-h1', document.getElementById('s-h1').value + 'pt');
      root.style.setProperty('--fn-h2', document.getElementById('f-h2').value);
      root.style.setProperty('--sz-h2', document.getElementById('s-h2').value + 'pt');
      root.style.setProperty('--fn-h3', document.getElementById('f-h3').value);
      root.style.setProperty('--sz-h3', document.getElementById('s-h3').value + 'pt');
      root.style.setProperty('--fn-h4', document.getElementById('f-h4').value);
      root.style.setProperty('--sz-h4', document.getElementById('s-h4').value + 'pt');
      root.style.setProperty('--fn-h5', document.getElementById('f-h5').value);
      root.style.setProperty('--sz-h5', document.getElementById('s-h5').value + 'pt');
      root.style.setProperty('--fn-h6', document.getElementById('f-h6').value);
      root.style.setProperty('--sz-h6', document.getElementById('s-h6').value + 'pt');
      root.style.setProperty('--fn-h7', document.getElementById('f-h7').value);
      root.style.setProperty('--sz-h7', document.getElementById('s-h7').value + 'pt');

      root.style.setProperty('--fn-sh-title', document.getElementById('f-sh-title').value);
      root.style.setProperty('--sz-sh-title', document.getElementById('s-sh-title').value + 'pt');
      root.style.setProperty('--fn-sh-sub', document.getElementById('f-sh-sub').value);
      root.style.setProperty('--sz-sh-sub', document.getElementById('s-sh-sub').value + 'pt');
      root.style.setProperty('--fn-sh-desc', document.getElementById('f-sh-desc').value);
      root.style.setProperty('--sz-sh-desc', document.getElementById('s-sh-desc').value + 'pt');
      root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec').value);
      root.style.setProperty('--sz-sh-sec', document.getElementById('s-sh-sec').value + 'pt');
      root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author').value);
      root.style.setProperty('--sz-sh-author', document.getElementById('s-sh-author').value + 'pt');
      root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year').value);
      root.style.setProperty('--sz-sh-year', document.getElementById('s-sh-year').value + 'pt');

      root.style.setProperty('--fn-first-word', document.getElementById('font-first-word').value);
      root.style.setProperty('--sz-first-word', document.getElementById('size-first-word').value + 'em');
      root.style.setProperty('--fn-body', document.getElementById('font-body').value);
      root.style.setProperty('--sz-body', document.getElementById('size-body').value + 'pt');
    }

    function createDropWord(text, isContinuation, isSingleLine) {
      if (isContinuation) return text;
      text = text.trim();
      const firstSpace = text.indexOf(' ');
      if (firstSpace === -1) {
        return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${text}</span>`;
      }
      const firstWord = text.substring(0, firstSpace);
      const rest = text.substring(firstSpace + 1);
      return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${firstWord}</span> ${rest}`;
    }

    function renderHeaderSectionHTML(type, customText, h1Title, h2Title, h3Title, bookTitle, tocFallback) {
      if (type === 'h1') return h1Title || tocFallback || '';
      if (type === 'h2') return h2Title || tocFallback || '';
      if (type === 'h3') return h3Title || '';
      if (type === 'book_title') return bookTitle || '';
      if (type === 'custom') return customText || '';
      if (type === 'diamonds') return '<span style="letter-spacing:3px;">◈ ❖ ◈</span>';
      if (type === 'spear') return '<svg style="height:9px; width:48px;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#444" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#444"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#444"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#444"/></svg>';
      if (type === 'swash') return '<svg style="height:12px; width:44px; fill:#444;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>';
      if (type === 'pen') return '<svg style="height:12px; width:44px;" viewBox="0 0 280 80"><g stroke="#444" fill="none" stroke-linecap="round"><path d="M30,55 C12,42 22,22 38,28 C50,32 55,48 45,58 C35,68 18,60 14,46 C10,32 25,18 42,22 C65,28 85,65 118,68 C128,69 135,62 135,50 C135,38 124,32 115,38" stroke-width="3"/><path d="M250,55 C268,42 258,22 242,28 C230,32 225,48 235,58 C245,68 262,60 266,46 C270,32 255,18 238,22 C215,28 195,65 162,68 C152,69 145,62 145,50 C145,38 156,32 165,38" stroke-width="3"/></g></svg>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-hdr-c-img') ? document.getElementById('data-hdr-c-img').value : '';
        return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 100%; object-fit: contain; vertical-align: middle;" />` : '';
      }
      return '';
    }

    function getSectionDividerHTML(type) {
      if (type === 'pyramid') return '<div style="grid-column: 3 / 6; text-align: center; line-height: 0.9; margin: 18px 0 6px 0;"><div style="font-size: 10pt; letter-spacing: 6px;">❖ ❖ ❖</div><div style="font-size: 9pt; letter-spacing: 5px; margin-top: 3px;">❖ ❖</div><div style="font-size: 8pt; margin-top: 3px;">❖</div></div>';
      if (type === 'spear') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 200px; height: 22px; margin: auto;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/><path d="M165,20 C165,22 150,24 130,24 C95,24 55,21 30,20 C55,19 95,16 130,16 C150,16 165,18 165,20 Z" fill="#fff"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/><path d="M235,20 C235,22 250,24 270,24 C305,24 345,21 370,20 C345,19 305,16 270,16 C250,16 235,18 235,20 Z" fill="#fff"/></svg></div>';
      if (type === 'swash') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 170px; height: 18px; fill: #111; margin: auto;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg></div>';
      if (type === 'flourish') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 140px; height: 45px; fill: #000; margin: auto;" viewBox="0 0 240 90"><path d="M110,48 C105,44 92,30 82,30 C68,30 55,42 42,42 C30,42 22,32 22,22 C22,12 32,5 45,5 C60,5 72,18 78,28 C82,20 88,10 100,10 C108,10 114,16 114,24 C114,35 102,44 88,44 C72,44 58,35 48,22 C42,28 35,35 25,48 C15,62 10,72 20,82 C30,90 48,85 62,72 C78,58 92,54 110,48 Z"/><path d="M130,48 C135,44 148,30 158,30 C172,30 185,42 198,42 C210,42 218,32 218,22 C218,12 208,5 195,5 C180,5 168,18 162,28 C158,20 152,10 140,10 C132,10 126,16 126,24 C126,35 138,44 152,44 C168,44 182,35 192,22 C198,28 205,35 215,48 C225,62 230,72 220,82 C210,90 192,85 178,72 C162,58 148,54 130,48 Z"/></svg></div>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-sec-div-img') ? document.getElementById('data-sec-div-img').value : '';
        return imgSrc ? `<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><img src="${imgSrc}" style="max-width: 260px; max-height: 45px; margin: auto; display: block; object-fit: contain;" /></div>` : '';
      }
      return '';
    }

    /* ============================================================
       רינדור שער ראשי
       ============================================================ */
    function renderMainShaar(container, themePreset) {
      const page = document.createElement('div');
      page.className = `a4-page main-shaar-page main-template-${themePreset}`;

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const subtitle = document.getElementById('inp-book-subtitle').value || "";
      const desc = document.getElementById('inp-book-desc').value || "";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let frameHTML = '';
      let paddingStyle = 'padding: 20mm 12mm 16mm 12mm;';

      if (themePreset === 'custom') {
        const imgSrc = document.getElementById('data-theme-main-img')?.value || '';
        const inset = document.getElementById('theme-main-inset')?.value || 20;
        paddingStyle = `padding: ${inset}mm 15mm;`;
        if (imgSrc) {
          frameHTML = `<img class="custom-bg-img" src="${imgSrc}" alt="שער ראשי">`;
        }
      } else if (themePreset === '1') {
        frameHTML = `
          <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
          <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
        `;
      } else if (themePreset === '2') {
        frameHTML = `
          <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
          <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
        `;
      } else if (themePreset === '3') {
        frameHTML = `
          <div class="m3-wavy-band"></div>
          <div class="m3-panel">
            <svg class="m3-corner tr" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner tl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner br" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner bl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
          </div>
        `;
      }

      page.innerHTML = `
        ${frameHTML}
        <div class="shaar-main-content" style="${paddingStyle}">
          <div>
            <div class="bsd-header">בס"ד</div>
            <div class="sefer-label"></div>
            <div class="book-title-main">${title}</div>
            <div class="book-subtitle">${subtitle}</div>
            <svg style="width: 180px; height: 24px; margin: 12px auto;" viewBox="0 0 400 40">
              <circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/>
              <path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/>
              <path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/>
            </svg>
          </div>
          <div class="book-description">${desc}</div>
          <div class="book-sections-summary">${sections}</div>
          <div class="author-block"><br><span class="author-name">${author}</span></div>
          <div class="publication-footer">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער אחורי (גב השער הראשי - תוכן בצד הימני)
       ============================================================ */
    function renderBackShaar(container, themePreset) {
      const page = document.createElement('div');
      page.className = 'a4-page back-shaar-page';

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let bgHTML = '';
      let colWidth = '55%';
      let isTransparent = false;

      if (themePreset === 'custom') {
        const imgSrc = document.getElementById('data-theme-back-img')?.value || '';
        const sideW = document.getElementById('theme-side-col-w')?.value || 55;
        colWidth = sideW + '%';
        isTransparent = true;
        if (imgSrc) {
          bgHTML = `<img class="custom-bg-img" src="${imgSrc}" alt="שער אחורי">`;
        }
      } else {
        let innerLace = '';
        if (themePreset === '2') innerLace = '<div class="m2-lace" style="border-right: 1px solid #ddd;"></div>';
        bgHTML = `<div class="back-shaar-bg-left"></div>`;
      }

      page.innerHTML = `
        ${bgHTML}
        <div class="back-shaar-col ${isTransparent ? 'theme-transparent' : ''}" style="width: ${colWidth};">
          <div class="back-shaar-content-centered">
            <div>
              <div style="font-size: 13pt; font-weight: 700; margin-bottom: 8px;">כל הזכויות שמורות</div>
              <div style="font-size: 10.5pt; line-height: 1.6; max-width: 90%; margin: 10px auto; color: #333;">
                אין לשכפל, להעתיק, לצלם, לתרגם, לאחסן במאגר מידע, למסור או לקלוט בכל דרך או אמצעי אלקטרוני, אופטי או מכני אחר כל חלק שהוא מספר זה, ללא רשות מפורשת בכתב מבעל הזכויות.
              </div>
            </div>
            <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 12px 10px; width: 85%;">
              <div style="font-weight: 700; font-size: 11pt; margin-bottom: 4px;">${title}</div>
              <div style="font-size: 10pt; color: #555;">${sections}</div>
              <div style="font-size: 10.5pt; font-weight: 700; margin-top: 6px;">${author}</div>
            </div>
            <div style="font-size: 10pt; color: #666;">${year}</div>
          </div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער משנה (פותח חלק - תוכן בצד השמאלי תמיד!)
       ============================================================ */
    function renderSubShaar(container, token, themePreset) {
      const page = document.createElement('div');
      page.className = 'a4-page sub-shaar-page';
      page.setAttribute('data-token-id', token.id);
      page.id = `heading-tok-${token.id}`;
      
      let titleMain = token.text;
      let titleSub = '';

      if (token.text.includes('-') || token.text.includes('–') || token.text.includes('—')) {
        const parts = token.text.split(/[-–—]/);
        titleMain = parts[0].trim();
        titleSub = parts.slice(1).join(' - ').trim();
      }

      let bgHTML = '';
      let colWidth = '55%';
      let isTransparent = false;

      if (themePreset === 'custom') {
        const imgSrc = document.getElementById('data-theme-sub-img')?.value || '';
        const sideW = document.getElementById('theme-side-col-w')?.value || 55;
        colWidth = sideW + '%';
        isTransparent = true;
        if (imgSrc) {
          bgHTML = `<img class="custom-bg-img" src="${imgSrc}" alt="שער משנה">`;
        }
      } else {
        let innerLace = '';
        if (themePreset === '2') {
          innerLace = '<div class="m2-lace" style="border-left: 1px solid #ddd;"></div>';
        }
        bgHTML = `<div class="sub-shaar-bg-right"></div>`;
      }

      // התיקון: הטור השמאלי תמיד נשמר בצד שמאל ברוחב המוגדר, ללא מרכוז דורס!
      page.innerHTML = `
        ${bgHTML}
        <div class="sub-shaar-col ${isTransparent ? 'theme-transparent' : ''}" style="width: ${colWidth};">
          <div class="sub-shaar-content-centered" style="flex-grow: 1;">
            <div class="sefer-label">חלק</div>
            <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
            ${titleSub ? `
              <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
                <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
              </svg>
              <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
          </div>
        </div>
      `;
      container.appendChild(page);
    }

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      applyContentBg(page, pageRole || 'regular');

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, h1Title, h2Title, h3Title, bookTitle);

      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, h1Title, h2Title, h3Title, bookTitle);

      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, h1Title, h2Title, h3Title, bookTitle);

      page.innerHTML = `
        <div class="page-content-wrapper">
          <div class="top-header-grid">
            <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
            <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
            <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
          </div>
          <div class="page-body-flow">
		    ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${h2TokenId}" id="heading-tok-${h2TokenId}"` : ''}>${h2Text}</div>` : ''}
          </div>
          <div class="page-number-footer">${toGematria(pNum)}</div>
        </div>
      `;

      container.appendChild(page);
      const bodyFlow = page.querySelector('.page-body-flow');
      return { page, bodyFlow };
    }

    let lineToTokenMap = [];

    function parseMetadataFromText(rawText) {
      const lines = rawText.split('\n');
      const cleanLines = [];

      for (let line of lines) {
        const trimmed = line.trim();
        let match = false;

        if (/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-title').value = trimmed.replace(/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-subtitle').value = trimmed.replace(/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-desc').value = trimmed.replace(/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-sections').value = trimmed.replace(/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-author').value = trimmed.replace(/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-year').value = trimmed.replace(/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*/i, '').trim();
          match = true;
        }

        if (!match) {
          cleanLines.push(line);
        }
      }
      return cleanLines.join('\n');
    }

    function estimateSectionFillRatio(tokens) {
      const sampleFlow = document.querySelector('.page-body-flow');
      const perPageCapacity = (sampleFlow ? sampleFlow.clientHeight : 900) * 2;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;width:580px;';
      probe.className = 'page-body-flow';
      document.body.appendChild(probe);
      let totalHeight = 0;
      tokens.forEach(t => {
        if (t.type === 'p') {
          const p = document.createElement('p');
          p.innerHTML = createDropWord(t.text, false, true);
          probe.appendChild(p);
          totalHeight += p.getBoundingClientRect().height;
          probe.removeChild(p);
        } else if (t.type.startsWith('h')) {
          const h = document.createElement('div');
          h.className = t.customStyleId ? 'title-level-custom' : `title-level-${t.level}`;
          h.textContent = t.text;
          probe.appendChild(h);
          totalHeight += h.getBoundingClientRect().height;
          const hStyle = window.getComputedStyle(h);
          totalHeight += parseFloat(hStyle.marginTop) + parseFloat(hStyle.marginBottom);
          probe.removeChild(h);
        }
      });
      document.body.removeChild(probe);
      if (totalHeight <= 0) return 1;
      const naivePages = Math.ceil(totalHeight / perPageCapacity);
      if (naivePages <= 1) return 1;
      const ratio = totalHeight / (naivePages * perPageCapacity);
      return Math.max(0.3, Math.min(1, ratio));
    }

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
      
      const pMeasure = document.createElement('p');
      pMeasure.style.margin = '0';
      pMeasure.style.padding = '0';
      
      const words = text.trim().split(/\s+/);
      if (words.length === 0) return { lines: [], hasWindow: false };

      pMeasure.textContent = text;
      measureContainer.appendChild(pMeasure);
      const singleLineHeight = pMeasure.offsetHeight;
      pMeasure.textContent = "א";
      const oneLineH = pMeasure.offsetHeight;
      const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
      const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
      
      let html = '';
      if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${words[0]}</span> `;
        for (let i = 1; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      } else {
        for (let i = 0; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      }
      
      pMeasure.innerHTML = html;
      
      const lines = [];
      let currentLine = [];
      let currentTop = -1;
      
      for (let i = 0; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
          lines.push(currentLine.join(' '));
          currentLine = [words[i]];
          currentTop = top;
        } else {
          currentLine.push(words[i]);
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
      }
      
      measureContainer.innerHTML = '';
      return { lines, hasWindow: shouldApplyWindow };
    }

    function justifyColumnVertically(col, targetHeight, styleObj) {
      const currentH = col.scrollHeight;
      const diff = targetHeight - currentH;
      if (diff > 2 && diff <= 60) {
        let pElements = Array.from(col.querySelectorAll('p'));
        if (pElements.length > 1) {
           let extraSpacing = diff / (pElements.length - 1);
           pElements.slice(0, -1).forEach(p => {
             let currentMargin = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
             p.style.marginBottom = (currentMargin + extraSpacing) + 'px';
           });
        } else if (pElements.length === 1) {
           let p = pElements[0];
           let currentLineHeight = parseFloat(styleObj.lineHeight) || 1.34;
           let linesInfo = getLinesFromParagraph(p.getAttribute('data-raw-text') || p.textContent, col.offsetWidth, styleObj, false);
           let numLines = linesInfo.lines.length;
           if (numLines > 1) {
               let fontSizePx = parseFloat(styleObj.fontSize) * 1.333;
               let extraLh = (diff / numLines) / fontSizePx;
               p.style.lineHeight = (currentLineHeight + extraLh).toString();
           }
        }
      }
    }

    function balanceColumns(block, colWidth, styleObj) {
      const rCol = block.querySelector('.right-col');
      const lCol = block.querySelector('.left-col');
      const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
      if (allChildren.length === 0) return;

      let mergedItems = [];
      for (let child of allChildren) {
        if (child.tagName === 'P') {
          let id = child.getAttribute('data-token-id');
          let text = child.getAttribute('data-raw-text');
          let isCont = child.getAttribute('data-is-cont') === 'true';
          let sideNote = child.getAttribute('data-side-note');
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
          } else {
             mergedItems.push({ type: 'p', id: id, rawText: text, isCont: isCont, sideNote: sideNote });
          }
        } else {
          mergedItems.push({ type: 'h', id: child.getAttribute('data-token-id'), html: child.outerHTML, level: child.className.match(/title-level-(\d+)/)?.[1] });
        }
      }

      const items = mergedItems.map(item => {
        if (item.type === 'p') {
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
          return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow };
        }
        return item;
      });

      const splitPoints = [];
      for (let i = 0; i <= items.length; i++) {
        if (i < items.length && items[i].type === 'p') {
          let lines = items[i].lines;
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
          for (let l = 1; l < lines.length; l++) {
            splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines });
          }
        } else {
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
        }
      }

      const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) return true;
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        return true;
      });

      let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
      if (pointsToEvaluate.length === 0) return;

      function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = 'p-end';
          p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);
        }
      }

      let bestSplit = pointsToEvaluate[0];
      let minAbsDiff = Infinity;

      for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pRight = document.createElement('p');
          pRight.className = 'p-cut';
          let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
          pRight.innerHTML = createDropWord(rightText, item.isCont, false);
          rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pLeft = document.createElement('p');
          pLeft.className = 'p-end';
          let leftText = sp.lines.slice(sp.lineIndex).join(' ');
          pLeft.innerHTML = createDropWord(leftText, true, false);
          lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) renderSingleItemFast(lCol, items[i]);
        let lHeight = lCol.scrollHeight;
        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);
        
        if (absDiff < minAbsDiff || (absDiff === minAbsDiff && diff >= 0)) {
            minAbsDiff = absDiff;
            bestSplit = sp;
        }
      }

      rCol.innerHTML = '';
      lCol.innerHTML = '';
      const rMargin = block.querySelector('.right-margin');
      const lMargin = block.querySelector('.left-margin');
      rMargin.innerHTML = '';
      lMargin.innerHTML = '';
      const finalNotes = [];

      function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = isPartial && isRight ? 'p-cut' : 'p-end';
          p.setAttribute('data-token-id', item.id);
          
          let textToRender = isPartial ? partialText : item.rawText;
          p.setAttribute('data-raw-text', textToRender);
          p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
          if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);

          if (item.sideNote && !isCont) {
            if (item.noteTarget === 'footnote' || item.noteTarget === 'endnote') {
              const marker = createNoteMarkerAndQueue(item.sideNote, item.sideNoteStyleId, item.noteTarget);
              p.insertBefore(marker, p.firstChild);
            } else {
              const noteElem = document.createElement('div');
              noteElem.className = 'side-note-anchor';
              noteElem.textContent = item.sideNote;
              if (item.sideNoteStyleId) {
                const inst = findExtTextStyle(item.sideNoteStyleId);
                if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
              }
              margin.appendChild(noteElem);
              finalNotes.push({ elem: noteElem, pElem: p });
            }
          }
        }
      }

      for (let i = 0; i < bestSplit.itemIndex; i++) appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
      if (bestSplit.lineIndex > 0) {
        let item = items[bestSplit.itemIndex];
        let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
        appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont);
        let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
        appendItemFinal(lCol, lMargin, item, false, true, leftText, true);
      }
      for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
      }

      let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
      if (finalDiff > 2 && finalDiff <= 60) {
          justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
      } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
          justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
      }

      finalizeNotePositions(finalNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
    }

    /* ============================================================
       מנוע העימוד המרכזי
       ============================================================ */
    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      const fnLinePrefix = document.getElementById('fn-line-prefix')?.value?.trim() || 'כותרת 7 -';
      const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      let pendingSideNoteStyleId = null;
      let pendingNoteTarget = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת סיום שהוגדרה בפאנל
        if (enLinePrefix && line.startsWith(enLinePrefix)) {
          pendingSideNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'endnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת שוליים שהוגדרה בפאנל
        if (fnLinePrefix && line.startsWith(fnLinePrefix)) {
          pendingSideNote = line.slice(fnLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'footnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת כותרת מובנית (0-7)
        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            pendingSideNote = txt;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = 'footnote';
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          // בדיקת קידומות מתוספים מיובאים
          let customMatch = null;
          for (const inst of importedTextStyles) {
            const trig = inst.def && inst.def.trigger;
            if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
              customMatch = { inst, text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim() };
              break;
            }
          }
          if (customMatch) {
            if (customMatch.inst.def.target === 'footnote' || customMatch.inst.def.target === 'endnote') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = customMatch.inst.def.target;
              lineToTokenMap[lineIdx] = null;
            } else if (customMatch.inst.def.layoutMode === 'side_note') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = null;
              lineToTokenMap[lineIdx] = null;
            } else {
              const lvl = customMatch.inst.syntheticLevel;
              const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: customMatch.text, lineIdx: lineIdx, customStyleId: customMatch.inst.instanceId };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
            }
          } else {
            const tokenObj = { id: tokens.length, type: 'p', text: line, sideNote: pendingSideNote, sideNoteStyleId: pendingSideNoteStyleId, noteTarget: pendingNoteTarget, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
            pendingSideNote = null;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = null;
          }
        }
      }

      const headingModes = {
        0: document.getElementById('mode-h0').value,
        1: document.getElementById('mode-h1').value,
        2: document.getElementById('mode-h2').value,
        3: document.getElementById('mode-h3').value,
        4: document.getElementById('mode-h4').value,
        5: document.getElementById('mode-h5').value,
        6: document.getElementById('mode-h6').value,
        7: document.getElementById('mode-h7').value
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
      });

      const oddPageRequired = {
        0: document.getElementById('odd-h0').checked,
        1: document.getElementById('odd-h1').checked,
        2: document.getElementById('odd-h2').checked
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
      });

      function ensureOddPageStart(level) {
        if (!oddPageRequired[level]) return;
        if (pageIndex % 2 === 0) {
          const blank = document.createElement('div');
          blank.className = 'a4-page blank-page';
          container.appendChild(blank);
          pageIndex++;
        }
      }

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
        if (mode === 'sub_shaar') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          sections.push({ type: 'sub_shaar', token: t, tokens: [] });
          currentSection = { type: 'body', tokens: [] };
        } else if (mode === 'new_page_1col') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          currentSection = { type: 'body', isNewPage: true, hToken: t, tokens: [] };
        } else {
          currentSection.tokens.push(t);
        }
      });
      if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
        sections.push(currentSection);
      }

      const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
      const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
          gtocShows.push(inst.syntheticLevel);
          if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
        }
      });

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const showBackShaar = document.getElementById('show-back-shaar').checked;
      const themePreset = document.getElementById('theme-preset').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // רינדור שער ראשי
      if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, themePreset);
        renderExtAnchor(container, 'afterMainShaar', rawText);
      } else {
        renderExtAnchor(container, 'beforeAll', rawText);
      }

      // רינדור שער אחורי (גב השער הראשי)
      if (showBackShaar) {
        renderBackShaar(container, themePreset);
      }

      // רינדור תוכן עניינים כללי
      if (enableGeneralTOC) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(
          container, 
          generalTocEntries, 
          "תוכן העניינים הכללי", 
          bookTitle, 
          "תוכן העניינים הכללי", 
          pageIndex,
          "תוכן העניינים הכללי", "תוכן העניינים הכללי",
          "gtoc"
        );
        pageIndex += pagesRendered;
      }
      renderExtAnchor(container, 'afterGeneralToc', rawText);

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      let hasOpenPart = false;
      let prevPageEl = null;

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
          if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
          renderExtAnchor(container, 'beforeEachPart', rawText);
          hasOpenPart = true;
          ensureOddPageStart(sec.token.level);
          renderSubShaar(container, sec.token, themePreset);
          if (sec.token.customStyleId) {
            const inst = findExtTextStyle(sec.token.customStyleId);
            const justRendered = container.lastElementChild;
            if (inst && justRendered) {
              const tEl = justRendered.querySelector('.book-title-main');
              const sEl = justRendered.querySelector('.book-subtitle');
              if (tEl) applyExtStyleToNode(tEl, inst.def.style, 36);
              if (sEl) applyExtStyleToNode(sEl, inst.def.style, 21);
            }
          }
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
            importedTextStyles.forEach(inst => {
              if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                dtocShows.push(inst.syntheticLevel);
                if (inst.def.toc.grouping) dtocGroups.push(inst.syntheticLevel);
              }
            });
            const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
            const dtocPages = renderPaginatedTOC(
              container, 
              detailedTocEntries, 
              "מפתח ולוח עניינים מפורט", 
              currentH1Title, 
              "תוכן העניינים המפורט", 
              pageIndex,
              currentH1Title, "תוכן העניינים המפורט",
              "dtoc"
            );
            pageIndex += dtocPages;
          }
          renderExtAnchor(container, 'afterEachPart', rawText);
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.level === 0;

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;
        const sectionFillRatio = (document.getElementById('balance-chapter-end').value === 'yes')
          ? estimateSectionFillRatio(secTokens) : 1;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
          if (prevPageEl) flushFootnotesInto(prevPageEl);
          if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);
          const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
          let pageLayout = createPageLayout(
            container, 
            isFirstPage ? h2Text : '', 
            isFirstPage ? h2Id : undefined, 
            pageIndex, 
            currentH1Title, 
            currentH2Title,
            currentH3Title,
            bookTitle,
            customR, customC, customL,
            pageRole
          );
          pageIndex++;
          prevPageEl = pageLayout.page;
		  
		      let remPageHeight = pageLayout.bodyFlow.clientHeight * sectionFillRatio;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
             if (title && sec.hToken.customStyleId) {
                const inst = findExtTextStyle(sec.hToken.customStyleId);
                if (inst) renderCustomHeadingInto(title, inst, h2Text);
             }
             let used = 0;
             if (spacer) used += spacer.getBoundingClientRect().height;
             if (title) {
                 used += title.getBoundingClientRect().height;
                 const titleStyle = window.getComputedStyle(title);
                 used += parseFloat(titleStyle.marginTop) + parseFloat(titleStyle.marginBottom);
             }
             remPageHeight -= used;
          }
          isFirstPage = false;

          if (isH0) {
            const singleBlock = document.createElement('div');
            singleBlock.className = 'block-single-col';
            singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
            pageLayout.bodyFlow.appendChild(singleBlock);
            const targetCol = singleBlock.querySelector('.single-wide-col');
            let pageHasContent = false;

            while (tokenIndex < secTokens.length || pendingWordTokens) {
              if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0) {
                break;
              }

              let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

              if (currentTok.type.startsWith('h')) {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                hElem.setAttribute('data-token-id', currentTok.id);
                if (currentTok.customStyleId) {
                  const inst = findExtTextStyle(currentTok.customStyleId);
                  if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                } else {
                  hElem.textContent = currentTok.text;
                }
                applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }

                if (document.getElementById('avoid-widows-select').value === 'yes'
                    && (tokenIndex + 1 < secTokens.length)
                    && (remPageHeight - targetCol.scrollHeight < 30)
                    && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p') {
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                  pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                  
                  if (targetCol.scrollHeight <= remPageHeight) {
                    bestFitLine = i;
                  } else {
                    break;
                  }
                }

                if (bestFitLine === 0) {
                  targetCol.removeChild(pElem);
                  if (targetCol.children.length > 0) {
                    let lastEl = targetCol.lastElementChild;
                    while (lastEl && lastEl.className.startsWith('title-level-')) {
                      targetCol.removeChild(lastEl);
                      tokenIndex--;
                      lastEl = targetCol.lastElementChild;
                    }
                    break;
                  } else {
                    if (!pageHasContent) {
                        bestFitLine = 1;
                    } else {
                        break;
                    }
                  }
                }

                if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                  const remainingAfterSplit = lines.length - bestFitLine;
                  if (bestFitLine === 1 && pageHasContent) {
                    targetCol.removeChild(pElem);
                    break;
                  } else if (remainingAfterSplit === 1) {
                    if (bestFitLine > 1) {
                      bestFitLine -= 1;
                    } else if (pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    }
                  }
                }

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                applyDelimiterStyles(pElem, 'body', getBodySizePt());

                if (isEndOfP) {
                  pendingWordTokens = null;
                  tokenIndex++;
                } else {
                  pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                  break;
                }
              }
            }
            continue;
          }

          let pagePendingNotes = [];

          while ((tokenIndex < secTokens.length || pendingWordTokens) && remPageHeight > 45) {
            let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
            const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              if (remPageHeight < 60) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              const spanTitle = document.createElement('div');
              spanTitle.className = 'h3-title-text';
              spanTitle.setAttribute('data-token-id', peekTok.id);
              spanTitle.id = `heading-tok-${peekTok.id}`;
              if (peekTok.customStyleId) {
                const inst = findExtTextStyle(peekTok.customStyleId);
                if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text); else spanTitle.textContent = peekTok.text;
              } else {
                spanTitle.textContent = peekTok.text;
              }
              applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId));
              spanBlock.appendChild(spanTitle);
              pageLayout.bodyFlow.appendChild(spanBlock);

              const spanHeight = spanBlock.getBoundingClientRect().height + 4;
              if (spanHeight > remPageHeight) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }
              if (document.getElementById('avoid-widows-select').value === 'yes'
                  && (tokenIndex + 1 < secTokens.length)
                  && (remPageHeight - spanHeight < 30)) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }

              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanHeight;
              tokenIndex++;
              continue;
            }

            const block2Col = document.createElement('div');
            block2Col.className = 'block-2col';
            block2Col.innerHTML = `
              <div class="margin-notes-column right-margin"></div>
              <div></div>
              <div class="main-column right-col"></div>
              <div></div>
              <div class="main-column left-col"></div>
              <div></div>
              <div class="margin-notes-column left-margin"></div>
            `;
            pageLayout.bodyFlow.appendChild(block2Col);

            const rCol = block2Col.querySelector('.right-col');
            const lCol = block2Col.querySelector('.left-col');
            const rMargin = block2Col.querySelector('.right-margin');
            const lMargin = block2Col.querySelector('.left-margin');
            const colWidth = rCol.offsetWidth || 272;
            let pageHasContent = false;

            ['right', 'left'].forEach((colName) => {
              let targetCol = colName === 'right' ? rCol : lCol;
              let targetMargin = colName === 'right' ? rMargin : lMargin;

              while (tokenIndex < secTokens.length || pendingWordTokens) {
                let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h')) {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                  hElem.setAttribute('data-token-id', currentTok.id);
				          hElem.id = `heading-tok-${currentTok.id}`;
                  if (currentTok.customStyleId) {
                    const inst = findExtTextStyle(currentTok.customStyleId);
                    if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                  } else {
                    hElem.textContent = currentTok.text;
                  }
                  applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                  targetCol.appendChild(hElem);

                  if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (document.getElementById('avoid-widows-select').value === 'yes'
                      && (tokenIndex + 1 < secTokens.length)
                      && (remPageHeight - targetCol.scrollHeight < 30)
                      && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p') {
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
                  let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                  let isContinuation = !!pendingWordTokens;
                  let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                  const pElem = document.createElement('p');
                  pElem.setAttribute('data-token-id', currentTok.id);
                  pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                  targetCol.appendChild(pElem);

                  if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  let bestFitLine = 0;
                  for (let i = 1; i <= lines.length; i++) {
                    let testText = lines.slice(0, i).join(' ');
                    pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                    pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                    
                    if (targetCol.scrollHeight <= remPageHeight) {
                      bestFitLine = i;
                    } else {
                      break;
                    }
                  }

                  if (bestFitLine === 0) {
                    targetCol.removeChild(pElem);
                    if (targetCol.children.length > 0) {
                      let lastEl = targetCol.lastElementChild;
                      while (lastEl && lastEl.className.startsWith('title-level-')) {
                        targetCol.removeChild(lastEl);
                        tokenIndex--;
                        lastEl = targetCol.lastElementChild;
                      }
                      break;
                    } else {
                      if (!pageHasContent) {
                          bestFitLine = 1;
                      } else {
                          break;
                      }
                    }
                  }

                  if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                    const remainingAfterSplit = lines.length - bestFitLine;
                    if (bestFitLine === 1 && pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    } else if (remainingAfterSplit === 1) {
                      if (bestFitLine > 1) {
                        bestFitLine -= 1;
                      } else if (pageHasContent) {
                        targetCol.removeChild(pElem);
                        break;
                      }
                    }
                  }

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                  applyDelimiterStyles(pElem, 'body', getBodySizePt());

                  if (!isContinuation && currentTok.sideNote) {
                    if (currentTok.noteTarget === 'footnote' || currentTok.noteTarget === 'endnote') {
                      const marker = createNoteMarkerAndQueue(currentTok.sideNote, currentTok.sideNoteStyleId, currentTok.noteTarget);
                      pElem.insertBefore(marker, pElem.firstChild);
                    } else {
                      pElem.setAttribute('data-side-note', currentTok.sideNote);
                      const noteElem = document.createElement('div');
                      noteElem.className = 'side-note-anchor';
                      noteElem.textContent = currentTok.sideNote;
                      if (currentTok.sideNoteStyleId) {
                        const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                        if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                      }
                      targetMargin.appendChild(noteElem);
                      pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                    }
                  }

                  if (isEndOfP) {
                    pendingWordTokens = null;
                    tokenIndex++;
                  } else {
                    pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                    break;
                  }
                }
              }
            });

            if (rCol.children.length === 0 && lCol.children.length === 0) {
                pageLayout.bodyFlow.removeChild(block2Col);
                let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                    pageLayout.bodyFlow.removeChild(lastFlowEl);
                    tokenIndex--;
                    lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                }
                break;
            }

            if (tokenIndex >= secTokens.length && !pendingWordTokens) {
              balanceColumns(block2Col, colWidth, styleObj);
              const divHTML = getSectionDividerHTML(secDivStyle);
              if (divHTML) {
                const divContainer = document.createElement('div');
                divContainer.innerHTML = divHTML;
                pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
              }
              break;
            } else {
              let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
              const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';
              if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                balanceColumns(block2Col, colWidth, styleObj);
              } else {
                let usedBlockH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
                let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
                if (finalDiff > 2 && finalDiff <= 60) {
                    justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
                } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                    justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
                }
              }
            }
            
            remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
            finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
          }
        }
      }

      if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
      if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
      else if (endnoteQueueForPart.length) { flushEndnotesForPart(container, pageIndex); }
      renderExtAnchor(container, 'afterAll', rawText);

      document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
        const targetId = span.getAttribute('data-target-id');
        if (targetId && headingPageMap[targetId]) {
          span.textContent = headingPageMap[targetId];
        }
      });
    }

    function buildStructuredTOC(tokenList, showLevels, groupLevels) {
      const entries = [];
      const minGroupLevel = groupLevels.length > 0 ? Math.min(...groupLevels) : 99;
      let currentGroupItems = [];

      function flushGroup() {
        if (currentGroupItems.length > 0) {
          entries.push({ isGroup: true, items: currentGroupItems.slice() });
          currentGroupItems = [];
        }
      }

      tokenList.forEach(t => {
        const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') ? t.text : t.sideNote;
        if (lvl === null || !txt) return;
        if (!showLevels.includes(lvl)) return;

        if (lvl >= minGroupLevel) {
          currentGroupItems.push({ id: t.id, level: lvl, text: txt });
        } else {
          flushGroup();
          entries.push({ id: t.id, level: lvl, text: txt, isGroup: false });
        }
      });

      flushGroup();
      return entries;
    }

    function renderPaginatedTOC(container, entries, titleText, bookTitle, h1Title, pageIndex, curH1, curH2, tocPrefix) {
      if (entries.length === 0) return 0;

      let pagesCount = 0;
      let currentEntryIdx = 0;
      let lastRenderedGrid = null;
      let lastRenderedPage = null;

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      
      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);

      function getTocStyle(level) {
        const f = document.getElementById(`f-${tocPrefix}-${level}`);
        const s = document.getElementById(`s-${tocPrefix}-${level}`);
        if(f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
        return '';
      }

      while (currentEntryIdx < entries.length) {
        const isFirstTOCPage = (pagesCount === 0);
        pagesCount++;

        const page = document.createElement('div');
        page.className = 'a4-page toc-page';
        applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
        lastRenderedPage = page;
        
        page.innerHTML = `
          <div class="page-content-wrapper">
            <div class="top-header-grid">
              <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
              <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
              <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
            </div>
            <div class="page-body-flow">
              ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
              <div class="toc-grid-full"></div>
            </div>
            <div class="page-number-footer">${toGematria(pageIndex + pagesCount - 1)}</div>
          </div>
        `;
        container.appendChild(page);

        const gridFull = page.querySelector('.toc-grid-full');
        lastRenderedGrid = gridFull;

        const bodyFlow = page.querySelector('.page-body-flow');
        const maxH = bodyFlow.clientHeight || 870;

        let pageStartIndex = currentEntryIdx;
        let lastSubjectIdx = currentEntryIdx; 

        while (currentEntryIdx < entries.length) {
          const it = entries[currentEntryIdx];
          
          if (!it.isGroup && (it.level === 1 || it.level === 2)) {
             lastSubjectIdx = currentEntryIdx;
          }

          let itemHTML = '';
          
          if (it.isGroup) {
            const inlineSpans = it.items.map(grp => 
              `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${grp.id}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${grp.text}</span> - <span class="grp-page" data-target-id="${grp.id}"></span></a></span>`
            ).join('<span class="grp-sep">|</span>');
            itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
          } else {
            itemHTML = `
              <div class="toc-entry-group" style="${getTocStyle(it.level)}">
                <a href="#heading-tok-${it.id}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
                  <span class="toc-title">${it.text}</span>
                  <span class="toc-dots"></span>
                  <span class="toc-page-num" data-target-id="${it.id}"></span>
                </a>
              </div>
            `;
          }

          gridFull.insertAdjacentHTML('beforeend', itemHTML);
          
          if (bodyFlow.scrollHeight > maxH) {
            gridFull.lastElementChild.remove();
            
            if (gridFull.children.length > 0) {
                if (lastSubjectIdx > pageStartIndex) {
                    const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                    for (let k = 0; k < itemsToRemove; k++) {
                        gridFull.lastElementChild.remove();
                    }
                    currentEntryIdx = lastSubjectIdx;
                }
                break;
            } else {
                gridFull.insertAdjacentHTML('beforeend', itemHTML);
                currentEntryIdx++;
                break;
            }
          }
          
          currentEntryIdx++;
        }
      }

      if (lastRenderedGrid) {
        lastRenderedGrid.style.justifyContent = 'flex-start';
      }
      if (lastRenderedPage) {
        applyContentBg(lastRenderedPage, 'tocLast');
      }

      return pagesCount;
    }

    const textarea = document.getElementById('raw-input');

    function syncCursorToPreview() {
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const currentLineIdx = textBefore.split('\n').length - 1;

      if (lineToTokenMap && lineToTokenMap[currentLineIdx] !== undefined) {
        let tokenId = lineToTokenMap[currentLineIdx];
        if (tokenId === null) {
          for (let k = currentLineIdx - 1; k >= 0; k--) {
            if (lineToTokenMap[k] !== null && lineToTokenMap[k] !== undefined) {
              tokenId = lineToTokenMap[k];
              break;
            }
          }
        }

        if (tokenId !== null && tokenId !== undefined) {
          const targetEl = document.querySelector(`[data-token-id="${tokenId}"]`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }

    textarea.addEventListener('click', syncCursorToPreview);
    textarea.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        syncCursorToPreview();
      }
    });

    function rehydrateExtImports() {
      const island = document.getElementById('ext-imports-data');
      if (!island || !island.textContent.trim()) return;
      let data;
      try { data = JSON.parse(island.textContent); } catch(e) { return; }
      (data.pageTypes || []).forEach(inst => {
        importedPageTypes.push(inst);
        buildExtPanel('pageType', inst.instanceId, inst.def.name, inst.def);
      });
      (data.textStyles || []).forEach(inst => {
        importedTextStyles.push(inst);
        buildExtPanel('textStyle', inst.instanceId, inst.def.name, inst.def);
      });
      (data.imagePages || []).forEach(inst => {
        importedImagePages.push(inst);
        buildExtPanel('imagePage', inst.instanceId, 'תמונה: ' + inst.name, null);
      });
      let maxCounter = 0;
      let maxSynth = 7;
      [...importedPageTypes, ...importedTextStyles, ...importedImagePages].forEach(inst => {
        const n = parseInt((inst.instanceId.match(/-(\d+)$/) || [0,0])[1], 10);
        if (n >= maxCounter) maxCounter = n + 1;
        if (typeof inst.syntheticLevel === 'number' && inst.syntheticLevel > maxSynth) maxSynth = inst.syntheticLevel;
      });
      extImportCounter = maxCounter;
      nextSyntheticLevel = maxSynth + 1;
    }

    window.onload = function() {
      rehydrateExtImports();
      
      const themePreset = document.getElementById('theme-preset').value;
      if (themePreset === 'custom') {
        document.getElementById('custom-theme-files-box').style.display = 'block';
      }
      if (document.getElementById('section-divider-style').value === 'custom_img') {
        document.getElementById('row-sec-div-img').style.display = 'flex';
      }
      if (document.getElementById('hdr-c-type').value === 'custom_img') {
        document.getElementById('row-hdr-c-img').style.display = 'flex';
      }

      textarea.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - סימן א - דיני תפילת השחר וזמנה
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום ((כאן הערת שוליים בתוך הטקסט הנלמדת מדברי הראשונים)).
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית [[כאן הערת סיום מורחבת המרוכזת בסוף החלק]].

כותרת 3 - ענף א: שיטת הרמב"ם בדין אונס ועבר זמן תפילה
גוף הטקסט בטורים המיושרים באופן מושלם. פסקאות אלו מדגימות את מנגנון האיזון המדויק המופעל בכל חיתוך.
כאשר טור אחד ימני מתמלא הוא מעביר שורות שלמות בלבד אל הטור השמאלי כדי שלא תיווצר מילה בודדת קטועה.
העימוד התורני מקפיד מאוד על שלמות הפסקאות והשורות כך שהקריאה תהיה רציפה ונעימה לעין הלומד.

כותרת 4 - סעיף א: בירור דעת בעל השאילתות
גוף הטקסט הבא תחת סעיף א מיועד לבאר את דברי הראשונים. כל פסקה מקבלת חלון מילה ראשונה רק אם היא מחזיקה שתי שורות ומעלה. פסקאות קצרות של שורה אחת אינן מקבלות חלון מילה ראשונה כדי למנוע שיבושים בעימוד הפסקאות הבאות אחריהן.
פיסקה קצרה.

כותרת 5 - סעיף ב: יישוב קושיית הנודע ביהודה
גוף הטקסט ממשיך לזרום בטורים שווים.

כותרת 7 - הערה נחוצה בדבר קריאת שמע של שחרית
גוף הטקסט המכיל הערות שוליים בצד הדף. ההערות ממוקמות בדיוק מול הפסקה אליה הן מתייחסות, ובכך מאפשרות ללומד לעיין במקורות תוך כדי לימודו הרציף בגוף הספר.`;
      typesetDocument();
    };
  </script>
</body></html>
```

---

## פנייה 4: התכוונתי שאחרי הגדרת ערכת הנושא (יבוא 3 קבצי רקע כSVG, הגדרת מיקום טקסט כדלהלן,…

התכוונתי שאחרי הגדרת ערכת הנושא (יבוא 3 קבצי רקע כSVG, הגדרת מיקום טקסט כדלהלן, בחירת שם) יהיה לחצן ייבוא שיטמיע את הערכה בקובץ עצמו (שלחיצה על "שמור תבנית" תייצא קובץ שכבר כלול בו ערכת הנושא) ושיהיה פאנל נפרד שבו יהיה אפשר לבחור (רשימת דרופדאון) ערכת נושא מבין אלו שהוטמעו ויוצאו לפי השם שניתנה לה.
עוד נקודה:
הגדרות ערכות הנושא צריכות לכלול:
שדה אינפוט לשם הערכה.
בחירת 3 קבצים (ושיהיה ניתן להטמיע ערכה הכוללת רק חלק מהקבצים).
הגדרות מיקום טקסט לכל שער בנפרד (ראשי\משנה\אחורי):
1. שוליים עליונים 
2. שוליים תחתונים
3. שוליים ימניים
4. שוליים שמאליים

---

### 🤖 תגובה 12: Defining User Needs I'm currently focused on precisely defining the user's…

**Defining User Needs**

I'm currently focused on precisely defining the user's requirements regarding the Torani A4 theme system. The context indicates a desire for specific enhancements, and my primary goal is to fully understand these needs.


**Clarifying Core Functionality**

I'm now zeroing in on the specifics: I've identified the need for a theme creation and saving mechanism directly within the application, alongside a clear UI for theme selection. I'm also ensuring the saved HTML files permanently embed these themes. The core UI elements for defining themes are being clearly identified.


**Expanding Theme Parameters**

I'm now concentrating on precisely defining how users will customize title page elements. I'm thinking about independent margin controls for main, sub, and back titles. I'm also ensuring the preservation of existing functionality, and plan to include Hebrew comments for added code clarity.


**Implementing Theme Storage**

I'm now implementing the theme saving and loading logic. I will be storing custom themes within the `ext-imports-data` JSON data island using `saveAsDefaultTemplate()`. On loading, `rehydrateExtImports()` will reload these saved themes and populate the dropdown select. I will be preserving the built-in themes for immediate selection.


**Designing Theme UI**

I'm now designing the user interface for theme creation. A new panel will feature inputs for theme names and SVG file uploads for main, sub, and back titles, alongside four margin inputs (Top, Bottom, Right, Left) for each. I'm focusing on a clean layout, possibly with a tab or collapsible structure for the three title pages. I am also working on an `<optgroup>` element, and options for built-in and custom themes.


**Adding Theme Buttons**

I've just added a button labeled "הטמע ערכת נושא בקובץ" (`addNewCustomTheme()`) that validates input, updates the custom themes list, and refreshes the dropdown. Upon saving, it sets the new theme active and clears fields. The user gets notified about the embedding, and I am now considering a list with a "מחק" (delete) button to manage embedded themes. I'm also revising the title page rendering.


**Refining Element Positioning**

I'm now refining the positioning of the content container using absolute positioning based on margins, and using padding if the page fills. If `svgData` is present, I'm embedding the image with an `img` tag. The text will be constrained inside the defined margins, ensuring precise bounding boxes. I will also be applying these concepts to the back title page, if available.


**Defining Sub Shaar Behavior**

I'm now determining how to display the sub-shaar based on custom theme parameters. When `svgData` is available, I will use an `img` tag. The content container will have absolute positioning, using the top, bottom, right, and left margins. If a theme lacks a `subShaar` image, I will utilize a clean layout or existing background with margins. All prior features remain intact.

---

### 🤖 תגובה 13: Designing UI Panels My current focus is on designing the UI panels. Right now,…

**Designing UI Panels**

My current focus is on designing the UI panels. Right now, I'm concentrating on the first panel, which deals with selecting a theme for the book covers. I'm thinking a dropdown menu is the most intuitive approach for selecting the active theme.


**Refining Theme Selection**

I've been refining the active theme selection panel. I'm incorporating predefined themes (Damask & Marble, Lacy Scrolls, Vilna Horns) and customized themes loaded from a file, listed with their names. I've also added checkboxes to control the visibility of the front and back covers and text fields for book details and chapter decorations. A button will launch a panel for editing or managing themes.



**Defining Layout Specifications**

I am now delving into the precise layout specifications. I am working on the dimensions for the front and back cover, and the sub cover. I am defining margins in millimeters and percentages, which will apply to the front and back covers, as well as the sub cover. I've also incorporated a button that will add the theme specifications to a `customThemes` array, which will update the selection box.

---

### 🤖 תגובה 14: Analyzing SVG Input I'm currently focusing on how SVG files behave when…

**Analyzing SVG Input**

I'm currently focusing on how SVG files behave when selected through a file input. I've observed that `FileReader.readAsDataURL(file)` generates a `data:image/svg+xml;base64,...` or `data:image/svg+xml;utf8,...` string. My next step involves investigating how this data is then rendered, likely using an `img` tag or perhaps an `<object>` element.


**Evaluating SVG Handling**

I've been examining how SVG data is saved and reloaded within the application. Specifically, I'm noting the use of a `<script>` tag to store the `customThemes` array, which includes the SVG data. Rehydration correctly rebuilds the theme selector dropdown and selects the active theme. I've also checked how the system behaves if themes have missing SVG data in some slots, where either the default background or custom margins are applied. Finally, I've checked what happens when users select different themes.

---

### 🤖 תגובה 15: Constructing HTML File Okay, I'm currently focused on structuring the HTML…

**Constructing HTML File**

Okay, I'm currently focused on structuring the HTML file. I'm prioritizing a dedicated panel for theme selection. This panel will utilize a dropdown menu populated with built-in themes and any custom themes integrated by name. The goal is modularity and user-friendliness. I'm thinking of how to best represent the custom theme loading process.

---

### 🤖 תגובה 16: הנה הקובץ המלא והמעודכן. ### מה עודכן ונוסף בקובץ: 1. פאנל נפרד לבחירת ערכת…

הנה הקובץ המלא והמעודכן. 

### מה עודכן ונוסף בקובץ:
1. **פאנל נפרד לבחירת ערכת נושא פעילה:**
   * כולל רשימת דרופדאון (`active-theme-select`) המציגה את כל הערכות המובנות וכל הערכות שהוטמעו על פי שמן.
   * בחירת ערכה מחילה באופן מיידי את כל השערים שהוגדרו בה.

2. **פאנל נפרד ליצירת, הגדרת והטמעת ערכות נושא (SVG):**
   * **שדה אינפוט לשם הערכה.**
   * **בחירת 3 קובצי רקע (ראשי, אחורי, משנה)** – תמיכה מלאה בהעלאת קובצי SVG וקטוריים או תמונות, עם אפשרות מובנית להטמיע ערכה הכוללת רק חלק מהשערים.
   * **הגדרות שוליים נפרדות (4 שדות: עליון, תחתון, ימין, שמאל) לכל שער בנפרד (ראשי, משנה, אחורי)** – תוחם את הטקסט בדיוק בתוך האזור החלק של השער (שער אחורי בצד ימין, שער משנה בצד שמאל, שער ראשי במרכז/במסגרת).
   * **לחצן "➕ הטמע ערכת נושא בקובץ":** מטמיע את הערכה ישירות בזיכרון המערכת ובקובץ ה-HTML.

3. **שמירה קבועה בתבנית:**
   * בעת לחיצה על "💾 שמור תבנית", כל ערכות הנושא שהוטמעו נשמרות לצמיתות בתוך קובץ ה-HTML המיוצא, כך שבכל פתיחה עתידית הן תופענה אוטומטית ברשימת הבחירה.

4. **שמירה על הגדרות ההערות והסברים בעברית:**
   * הגדרות מזהי הערות השוליים והסיום (קידומות ותוחמים פותח/סוגר) נשמרו במלואן, לצד הערות הסבר מפורטות בעברית בכל חלקי הקוד.

---

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מערכת עימוד תורנית מקצועית לדפי A4</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

  /* ============================================================
     משתני CSS גלובליים: גדלי גופנים, רשת העמוד, צבעים.
     ============================================================ */
  :root {
    --fn-header-r: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-r: 13pt;
    --fn-header-c: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-c: 11pt;
    --fn-header-l: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-l: 13pt;

    --fn-h0: 'David Libre', 'David', serif;
    --sz-h0: 18pt;
    --fn-h0-body: 'Frank Ruhl Libre', serif;
    --sz-h0-body: 11.5pt;

    --fn-h1: 'Lia Sgula', 'Bellefair', serif;
    --sz-h1: 50pt;
    --fn-h1-sub: 'David Libre', 'David', serif;
    --sz-h1-sub: 28pt;

    --fn-h2: 'AAd_AlphaBlack', 'David Libre', 'David', serif;
    --sz-h2: 17pt;
    --fn-h3: 'AAd_AlphaLight', 'Noto Serif Hebrew', serif;
    --sz-h3: 13.5pt;
    --fn-h4: 'FrankRuehl', 'Frank Ruhl Libre', serif;
    --sz-h4: 12.5pt;
    --fn-h5: 'David Libre', 'David', serif;
    --sz-h5: 11.5pt;
    --fn-h6: 'Noto Serif Hebrew', serif;
    --sz-h6: 10.5pt;
    --fn-h7: 'Hadassah Friedlaender', 'Hadassah', 'Noto Serif Hebrew', serif;
    --sz-h7: 6pt;

    --fn-sh-title: 'Bellefair', serif;
    --sz-sh-title: 46pt;
    --fn-sh-sub: 'David Libre', serif;
    --sz-sh-sub: 21pt;
    --fn-sh-desc: 'Frank Ruhl Libre', serif;
    --sz-sh-desc: 12pt;
    --fn-sh-sec: 'David Libre', serif;
    --sz-sh-sec: 11.5pt;
    --fn-sh-author: 'David Libre', serif;
    --sz-sh-author: 15pt;
    --fn-sh-year: 'David Libre', serif;
    --sz-sh-year: 12pt;

    --fn-body: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-body: 11.2pt;
    --fn-first-word: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-first-word: 1.5em;

    --w-margin: 7.5%;
    --w-gap: 2%;
    --w-col: 40%;
    --w-gutter: 2%;
    --flow-mt: 20px;
    --flow-mb: 20px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ============================================================
     איפוס בסיסי ותצוגת שני-חלקים (סרגל צד + תצוגה מקדימה)
     ============================================================ */
  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background-color: #555555;
    font-family: var(--fn-body);
    color: #000000;
    display: flex;
    flex-direction: row;
  }

  #sidebar {
    width: 540px;
    min-width: 380px;
    max-width: 800px;
    height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    box-shadow: -3px 0 15px rgba(0,0,0,0.3);
    z-index: 100;
    font-family: 'David Libre', serif;
    flex-shrink: 0;
  }

  #resizer {
    width: 6px;
    height: 100vh;
    background: #333333;
    cursor: col-resize;
    flex-shrink: 0;
    z-index: 110;
    transition: background 0.2s;
  }
  #resizer:hover, #resizer.resizing { background: #b8860b; }

  .sidebar-top-half {
    height: 36vh;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding-bottom: 6px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .sidebar-title { font-size: 12.5pt; font-weight: 700; }

  .btn-load-fonts {
    background-color: #2c3e50;
    color: #fff;
    border: none;
    padding: 3px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }

  #raw-input {
    width: 100%;
    flex: 1;
    font-family: monospace;
    font-size: 9pt;
    padding: 6px;
    border: 1px solid #777;
    border-radius: 3px;
    direction: rtl;
    resize: none;
  }

  .sidebar-scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
    margin-top: 4px;
  }

  .panel-static {
    background: #fbfbfb;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 8px 10px;
  }

  .panel-header {
    font-size: 10pt;
    font-weight: 700;
    background: #eaeaea;
    padding: 4px 8px;
    border-radius: 3px;
    margin: -8px -10px 8px -10px;
    color: #111;
    border-bottom: 1px solid #ccc;
  }

  .inline-cfg-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 5px;
    font-size: 8.5pt;
  }
  .inline-cfg-row label { font-weight: 700; width: 105px; flex-shrink: 0; font-size: 8pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .inline-cfg-row input[type="text"] { flex: 1; min-width: 80px; padding: 2px 4px; font-size: 8.5pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select { padding: 2px 3px; font-size: 8pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select.font-picker { width: 100px; }
  .inline-cfg-row input.size-input { width: 38px; text-align: center; font-size: 8pt; padding: 2px; border: 1px solid #aaa; border-radius: 2px; }

  .toc-levels-table {
    width: 100%;
    font-size: 8pt;
    margin-top: 4px;
    border-collapse: collapse;
  }
  .toc-levels-table th, .toc-levels-table td {
    padding: 2px 4px;
    text-align: right;
  }
  .toc-levels-table th { background: #eee; font-weight: 700; }

  .btn-bar-bottom {
    display: flex;
    gap: 6px;
    padding-top: 8px;
    border-top: 1.5px solid #ccc;
    background: #fff;
    flex-shrink: 0;
  }
  .btn-primary {
    background-color: #000;
    color: #fff;
    border: none;
    padding: 8px 12px;
    font-size: 10pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    flex-grow: 1;
  }
  .btn-save-template {
    background-color: #1e3a8a;
    color: #fff;
    border: none;
    padding: 8px 10px;
    font-size: 9pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }
  .btn-secondary {
    background-color: #f0f0f0;
    color: #000;
    border: 1px solid #666;
    padding: 8px 10px;
    font-size: 9pt;
    cursor: pointer;
    border-radius: 3px;
  }

  #preview-pane {
    flex-grow: 1;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 20px;
    scroll-behavior: smooth;
    background-color: #555555;
  }

  /* ============================================================
     עמוד ה-A4 עצמו
     ============================================================ */
  .a4-page {
    background-color: #ffffff;
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    padding: 15mm 15mm 15mm 15mm;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    position: relative;
    margin-bottom: 30px;
    page-break-after: always;
    overflow: hidden;
    flex-shrink: 0;
  }

  .page-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    justify-content: space-between;
  }

  /* ============================================================
     עמודי השער: ראשי, אחורי, ומשנה
     ============================================================ */
  .main-shaar-page {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
  }

  .shaar-main-content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm 16mm 12mm;
    z-index: 20;
    position: relative;
  }

  .custom-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    z-index: 5;
    pointer-events: none;
  }

  .bsd-header { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-bottom: 40px; }
  .sefer-label { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-top: 4px; }
  
  .book-title-main { font-family: var(--fn-sh-title); font-size: var(--sz-sh-title); line-height: 1.1; margin: 10px 0 40px 0; }
  .book-subtitle { font-family: var(--fn-sh-sub); font-size: var(--sz-sh-sub); font-weight: 700; line-height: 1.25; }
  .book-description { font-family: var(--fn-sh-desc); font-size: var(--sz-sh-desc); line-height: 1.5; max-width: 65%; margin: 10px auto; }
  .book-sections-summary { font-family: var(--fn-sh-sec); font-size: var(--sz-sh-sec); line-height: 1.5; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 6px 12px; margin: 8px 0; font-weight: 700; }
  .author-block { font-family: var(--fn-sh-author); font-size: calc(var(--sz-sh-author) * 0.85); line-height: 1.3; }
  .author-name { font-size: var(--sz-sh-author); font-weight: 700; }
  .publication-footer { font-family: var(--fn-sh-year); font-size: var(--sz-sh-year); font-weight: 700; letter-spacing: 1px; }

  .m1-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-bottom: 1px solid #d0d0d0; }
  .m1-bg-middle { position: absolute; top: 20%; left: 0; right: 0; height: 60%; background: #ffffff; }
  .m1-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-top: 1px solid #d0d0d0; }
  .m1-panel { position: absolute; top: 0; bottom: 0; left: 12%; right: 12%; background: #ffffff; border-right: 1px solid #ccc; border-left: 1px solid #ccc; box-shadow: 0 0 20px rgba(0,0,0,0.1); display: flex; justify-content: space-between; z-index: 10; }
  .m1-damask { width: 30px; height: 100%; background: #fafafa url("data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.35'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }
  
  .m2-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-bg-middle { position: absolute; top: 18%; left: 0; right: 0; height: 64%; background: #ffffff; box-shadow: inset 0 2px 6px rgba(0,0,0,0.06), inset 0 -2px 6px rgba(0,0,0,0.06); }
  .m2-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-panel { position: absolute; top: 0; bottom: 0; left: 10%; right: 10%; background: #ffffff; box-shadow: 0 0 25px rgba(0,0,0,0.12); display: flex; justify-content: space-between; z-index: 10; }
  .m2-lace { width: 24px; height: 100%; background: #ffffff url("data:image/svg+xml,%3Csvg width='26' height='40' viewBox='0 0 26 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13,20 C4,16 2,8 2,2 C2,0 8,0 13,8 C18,0 24,0 24,2 C24,8 22,16 13,20 Z M13,20 C4,24 2,32 2,38 C2,40 8,40 13,32 C18,40 24,40 24,38 C24,32 22,24 13,20 Z M13,10 A3,3 0 1,0 13,16 A3,3 0 1,0 13,10 Z M13,30 A3,3 0 1,0 13,24 A3,3 0 1,0 13,30 Z' fill='%23888888' fill-opacity='0.45'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }

  .m3-wavy-band { position: absolute; top: 14%; left: 0; right: 0; height: 72%; background: #ffffff; border-top: 1.5px solid #d4d4d4; border-bottom: 1.5px solid #d4d4d4; }
  .m3-panel { position: absolute; top: 0; bottom: 0; left: 9%; right: 9%; background: #ffffff; border-right: 1.5px solid #ccc; border-left: 1.5px solid #ccc; box-shadow: 0 0 25px rgba(0,0,0,0.14); z-index: 10; }
  .m3-corner { position: absolute; width: 65px; height: 65px; fill: #111; z-index: 25; }
  .m3-corner.tr { top: 10mm; right: 10mm; }
  .m3-corner.tl { top: 10mm; left: 10mm; transform: scaleX(-1); }
  .m3-corner.br { bottom: 10mm; right: 10mm; transform: scaleY(-1); }
  .m3-corner.bl { bottom: 10mm; left: 10mm; transform: scale(-1, -1); }

  /* שער משנה (שמאל) ושער אחורי (ימין) */
  .sub-shaar-page { position: relative; padding: 0; }
  .sub-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    left: 0;
    right: auto;
    width: 55%;
    background: #ffffff;
    border-right: 1.5px solid #ccc;
    box-shadow: 5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .sub-shaar-bg-right {
    position: absolute;
    top: 0; bottom: 0;
    right: 0; left: 55%;
    background: #f4f4f4;
  }
  .sub-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm;
    z-index: 20;
  }

  .back-shaar-page { position: relative; padding: 0; }
  .back-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    right: 0;
    left: auto;
    width: 55%;
    background: #ffffff;
    border-left: 1.5px solid #ccc;
    box-shadow: -5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .back-shaar-bg-left {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 55%;
    background: #f4f4f4;
  }
  .back-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 22mm 12mm 18mm 12mm;
    z-index: 20;
  }

  /* קופסת תוכן גמישה המותאמת לערכות נושא לפי 4 שוליים */
  .theme-bounded-content {
    position: absolute;
    width: auto !important;
    height: auto !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    z-index: 20;
    box-sizing: border-box;
  }

  /* ============================================================
     תוכן העניינים
     ============================================================ */
  .toc-page { padding: 15mm 15mm 15mm 15mm; }
  .toc-grid-full {
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: space-between;
    flex-grow: 1;
    width: 100%;
    max-width: 175mm;
    margin: 0 auto;
  }
  .toc-entry-group { break-inside: avoid; margin-bottom: 3px; }
  .toc-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2px;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
  }
  .toc-title {
    flex-shrink: 1;
    max-width: 84%;
    font-weight: 600;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: right;
    line-height: 1.3;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 1px dotted #777;
    margin: 0 8px;
    height: 1px;
    min-width: 25px;
  }
  .toc-page-num {
    flex-shrink: 0;
    font-weight: 700;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
    min-width: 25px;
    text-align: left;
  }
  
  .toc-lvl-1 { font-size: 12pt; font-weight: 700; margin-top: 8px; margin-bottom: 3px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
  .toc-lvl-2 { font-size: 11pt; font-weight: 700; margin-top: 5px; padding-right: 8px; }
  .toc-lvl-3 { font-size: 10.5pt; font-weight: 700; padding-right: 16px; }
  .toc-lvl-4 { padding-right: 24px; font-size: 10pt; }
  .toc-lvl-5 { padding-right: 32px; font-size: 9.5pt; }
  .toc-lvl-6 { padding-right: 40px; font-size: 9pt; }
  .toc-lvl-7 { padding-right: 48px; font-size: 8.8pt; }

  .toc-grouped-block {
    padding-right: 30px;
    font-size: 9pt;
    color: #222;
    line-height: 1.5;
    margin: 2px 0 5px 0;
    text-align: right;
    font-family: 'David Libre', serif;
  }
  .grp-item { font-size: inherit; white-space: normal; }
  .grp-title { font-weight: 600; color: #111; }
  .grp-page { font-weight: 700; color: #4a5568 !important; font-family: 'David Libre', serif; }
  .grp-sep { color: #888; margin: 0 6px; font-weight: bold; white-space: nowrap; }

  /* ============================================================
     הכותרת העליונה
     ============================================================ */
  .top-header-grid {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    align-items: center;
    height: 24px;
    flex-shrink: 0;
  }

  .header-col-r {
    grid-column: 3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-r);
    font-size: var(--sz-header-r);
    font-weight: 700;
  }
  .header-col-c {
    grid-column: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: visible;
    font-family: var(--fn-header-c);
    font-size: var(--sz-header-c);
  }
  .header-col-l {
    grid-column: 5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-l);
    font-size: var(--sz-header-l);
    font-weight: 700;
  }

  /* ============================================================
     גוף הטקסט: כותרות, טורים, פסקאות
     ============================================================ */
  .title-level-2-standalone {
    font-family: var(--fn-h2);
    font-size: var(--sz-h2);
    font-weight: 700;
    text-align: center;
    margin-top: 0;
    margin-bottom: 40px;
    width: 100%;
    line-height: 1.25;
    flex-shrink: 0;
  }

  .h2-spacer { flex-basis: 33.33%; flex-shrink: 0; }

  .page-body-flow {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    flex-grow: 1;
    justify-content: flex-start;
    margin-top: var(--flow-mt);
    margin-bottom: var(--flow-mb);
    min-height: 0;
  }

  .block-2col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }

  .block-h3-span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 6px 0;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .block-h3-span .h3-title-text {
    font-family: var(--fn-h3);
    font-size: var(--sz-h3);
    font-weight: 900;
    text-align: center;
    width: 100%;
    line-height: 1.22;
  }

  .title-level-4 { font-family: var(--fn-h4); font-size: var(--sz-h4); font-weight: 900; text-align: center; margin: 9px 0 4px 0; line-height: 1.22; }
  .title-level-custom { margin: 9px 0 4px 0; line-height: 1.3; }
  
  .note-marker { line-height: 0; cursor: pointer; }
  .footnote-area { position: absolute; bottom: 15mm; right: 15mm; left: 15mm; }
  .note-rule-plain { border-top: 1px solid #555; width: 35%; margin-bottom: 5px; }
  .note-rule-decorative { display: flex; align-items: center; gap: 6px; width: 62%; margin-bottom: 8px; }
  .note-rule-decorative .rule-seg { flex: 1; height: 1px; background: #555; }
  .note-rule-decorative .rule-glyphs { font-size: 9px; letter-spacing: 3px; color: #555; white-space: nowrap; }
  .note-block { font-size: 8.5pt; line-height: 1.5; }
  .note-line { break-inside: avoid; margin-bottom: 3px; }
  .note-line-num { font-weight: 700; margin-left: 3px; text-decoration: none; color: inherit; cursor: pointer; }
  .endnote-page-block { margin-top: 10mm; padding: 0 10mm; }
  .title-level-5 { font-family: var(--fn-h5); font-size: var(--sz-h5); font-weight: 700; text-align: center; margin: 7px 0 3px 0; line-height: 1.22; }
  .title-level-6 { font-family: var(--fn-h6); font-size: var(--sz-h6); font-weight: 700; text-align: center; margin: 6px 0 3px 0; line-height: 1.22; }

  .block-single-col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) calc(var(--w-col)*2 + var(--w-gutter)) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }
  .block-single-col .single-wide-col {
    grid-column: 3;
    font-family: var(--fn-h0-body);
    font-size: var(--sz-h0-body);
    line-height: 1.45;
    text-align: justify;
    text-justify: inter-word;
  }

  .margin-notes-column {
    font-family: var(--fn-h7);
    font-size: var(--sz-h7);
    line-height: 1.18;
    text-align: center;
    text-align-last: center;
    font-weight: 400;
    color: #404040;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .right-margin { grid-column: 1; }
  .left-margin { grid-column: 7; }
  .side-note-anchor { position: absolute; width: 100%; }

  .main-column {
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
    text-align: justify;
    text-justify: inter-word;
    min-height: 0;
    height: auto;
    position: relative;
  }

  .right-col { grid-column: 3; }
  .left-col { grid-column: 5; }

  p { margin-bottom: 7px; text-align: justify; text-justify: inter-word; position: relative; }
  p.p-end { text-align-last: center; }
  p.p-cut { text-align-last: justify; }

  .first-word-window {
    float: right;
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 0.85;
    height: 1.25em;
    margin-left: 6px;
    margin-bottom: 1px;
    display: block;
  }

  .first-word-inline {
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 1;
  }

  .page-number-footer {
    text-align: center;
    font-family: var(--fn-header-r);
    font-size: 12pt;
    font-weight: 700;
    height: 24px;
    flex-shrink: 0;
  }

  #measuring-box {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    top: -9999px;
    left: -9999px;
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
  }

  @media print {
    @page { size: A4; margin: 0; }
    body { background: none; padding: 0; overflow: visible; display: block; }
    #sidebar, #resizer { display: none !important; }
    #preview-pane { height: auto !important; overflow: visible !important; padding: 0 !important; background: none !important; display: block !important; }
    .a4-page { box-shadow: none; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; max-height: 297mm !important; padding: 15mm !important; margin: 0 !important; page-break-after: always; break-after: page; position: relative; }
    .page-content-wrapper, .shaar-main-content, .sub-shaar-content-centered, .back-shaar-content-centered { height: 100% !important; }
  }
</style>
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">

      <!-- ============================================================
           פאנל 1: בחירת ערכת נושא פעילה לשערי הספר
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">👑 בחירת ערכת נושא לשערי הספר</div>
        
        <div class="inline-cfg-row" style="margin-bottom: 6px;">
          <label>ערכת נושא פעילה:</label>
          <select id="active-theme-select" style="flex:1;" onchange="typesetDocument()">
            <optgroup label="ערכות מובנות">
              <option value="builtin_1" selected="selected">1. דמסק ושיש מרכזי</option>
              <option value="builtin_2">2. תחרת סלסולים כפולה</option>
              <option value="builtin_3">3. קרנות וילנא וגיליושה</option>
            </optgroup>
            <optgroup id="custom-themes-optgroup" label="ערכות שהוטמעו בקובץ">
              <!-- מתמלא באופן דינמי מערכות מותאמות -->
            </optgroup>
          </select>
        </div>

        <div style="margin-bottom: 6px; display:flex; gap:12px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked" onchange="typesetDocument()"> שער ראשי</label>
          <label style="font-size: 8.5pt; font-weight: 700;" title="מציג שער אחורי בעמוד 2 (גב השער הראשי)"><input type="checkbox" id="show-back-shaar" onchange="typesetDocument()"> שער אחורי (גב השער)</label>
        </div>

        <div class="inline-cfg-row">
          <label>שם הספר:</label>
          <input type="text" id="inp-book-title" value="שם הספר" placeholder="שם הספר (כותרת ראשית)">
          <select id="f-sh-title" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-sh-title" class="size-input" value="46">
        </div>
        <div class="inline-cfg-row">
          <label>נושא / משנה:</label>
          <input type="text" id="inp-book-subtitle" value="נושא הספר מונסח בתמציות" placeholder="נושא / כותרת משנה">
          <select id="f-sh-sub" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-sub" class="size-input" value="21">
        </div>
        <div class="inline-cfg-row">
          <label>נושא מפורט:</label>
          <input type="text" id="inp-book-desc" value="נושא הספר בפרטות ובנוסח ארוך יותר" placeholder="נושא מפורט / תיאור החיבור">
          <select id="f-sh-desc" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-desc" class="size-input" value="12">
        </div>
        <div class="inline-cfg-row">
          <label>פרטי מהדורא:</label>
          <input type="text" id="inp-book-sections" value="פרטי מהדורה | פרטי מהדורה" placeholder="פרטי מהדורא / חלקים">
          <select id="f-sh-sec" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-sec" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>שם המחבר:</label>
          <input type="text" id="inp-book-author" value="שם המחבר" placeholder="שם המחבר">
          <select id="f-sh-author" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-author" class="size-input" value="15">
        </div>
        <div class="inline-cfg-row">
          <label>מקום ושנה:</label>
          <input type="text" id="inp-book-year" value="מקום ההוצאה | שנת ההוצאה" placeholder="מקום ושנת הוצאה">
          <select id="f-sh-year" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-year" class="size-input" value="12">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div class="inline-cfg-row">
            <label>עיטור סיום פרק:</label>
            <select id="section-divider-style" style="flex:1;" onchange="document.getElementById('row-sec-div-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'; typesetDocument();">
              <option value="pyramid">1. פירמידת וילנא (❖ ❖ ❖)</option>
              <option value="spear" selected="selected">2. רומח מחודד עם טבעת (SVG)</option>
              <option value="swash">3. שושנתא וילנאית (SVG)</option>
              <option value="flourish">4. סלסול תורני כפול (SVG)</option>
              <option value="custom_img">5. תמונת עיטור אישית</option>
              <option value="none">ללא עיטור</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sec-div-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ עיטור פרק:</label>
            <input type="file" id="file-sec-div-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>

      <!-- ============================================================
           פאנל 2: יצירת והטמעת ערכת נושא חדשה (ראשי / אחורי / משנה)
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header" style="cursor:pointer;" onclick="togglePanelBody('new-theme-panel-body')">
          🎨 יצירת והטמעת ערכת נושא חדשה (SVG) <span style="font-size:8pt; font-weight:normal; float:left;">▼ פתח/סגור</span>
        </div>
        <div id="new-theme-panel-body">
          <div class="inline-cfg-row" style="margin-bottom: 6px;">
            <label style="color:#1e3a8a;">שם הערכה:</label>
            <input type="text" id="builder-theme-name" placeholder="הזן שם לערכת הנושא החדשה...">
          </div>

          <!-- הגדרות שער ראשי -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">🏛️ 1. שער ראשי (מרכז הדף):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-main-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-main-svg')">
              <input type="hidden" id="data-builder-main-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-main-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-main-bottom" value="16" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-main-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-main-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <!-- הגדרות שער אחורי -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📖 2. שער אחורי (טור ימני / גב השער):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-back-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-back-svg')">
              <input type="hidden" id="data-builder-back-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-back-top" value="22" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-back-bottom" value="18" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-back-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים משמאל תוחמים את הטור הימני">שמאל (mm):</label><input type="number" id="builder-back-left" value="95" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <!-- הגדרות שער משנה -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📜 3. שער משנה (טור שמאלי / פותח חלק):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-sub-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-sub-svg')">
              <input type="hidden" id="data-builder-sub-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-sub-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-sub-bottom" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים מימין תוחמים את הטור השמאלי">ימין (mm):</label><input type="number" id="builder-sub-right" value="95" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-sub-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <button class="btn-load-fonts" style="width:100%; padding:6px; background:#1e3a8a; margin-top:4px;" onclick="addNewCustomTheme()">➕ הטמע ערכת נושא זו בקובץ</button>
          
          <div id="custom-themes-list" style="margin-top:8px;"></div>
        </div>
      </div>

      <!-- פאנל ייבוא תוספים -->
      <div class="panel-static">
        <div class="panel-header">🧩 ייבוא תוספים (סוגי עמוד / סגנונות טקסט)</div>
        <div class="inline-cfg-row">
          <label>סוג עמוד:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handlePageTypeImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>סגנון טקסט:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handleTextStyleImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>תמונה כעמוד:</label>
          <input type="file" accept="image/*" style="flex:1;font-size:8pt;" onchange="handleImagePageImportFile(event)">
        </div>
      </div>
      <div id="ext-imports-container"></div>

      <!-- ============================================================
           פאנל הגדרות הערות מורחב: שליטה בסימונים/מזהים לשני הסוגים
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">📝 הגדרות הערות (שוליים / סיום)</div>

        <!-- אזור הגדרות הערות שוליים (Footnotes) -->
        <div style="font-weight:700; font-size:8pt; margin: 2px 0 3px 0; color:#1e3a8a;">📌 הערות שוליים (בתחתית העמוד / בצד):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="fn-line-prefix" value="כותרת 7 -" placeholder="למשל: הערה - או כותרת 7 -" onchange="typesetDocument()">
        </div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="fn-delim-open" value="((" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" onchange="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="fn-delim-close" value="))" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" onchange="typesetDocument()">
          </div>
        </div>

        <!-- אזור הגדרות הערות סיום (Endnotes) -->
        <div style="font-weight:700; font-size:8pt; margin: 6px 0 3px 0; color:#1e3a8a; border-top:1px dashed #ddd; padding-top:4px;">📚 הערות סיום (מרוכזות בסוף חלק):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="en-line-prefix" value="הערת סיום -" placeholder="למשל: הערת סיום -" onchange="typesetDocument()">
        </div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="en-delim-open" value="[[" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" onchange="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="en-delim-close" value="]]" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" onchange="typesetDocument()">
          </div>
        </div>

        <div style="border-top:1px dashed #ddd; margin-top:6px; padding-top:4px;"></div>
        <div class="inline-cfg-row"><label>סוג סימון בטקסט:</label>
          <select id="note-marker-type" onchange="typesetDocument()">
            <option value="super" selected="selected">כתב עילי</option>
            <option value="normal">רגיל (על השורה)</option>
            <option value="sub">כתב תחתי</option>
            <option value="brackets">בסוגריים מרובעים [1]</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>גודל סימון בטקסט:</label><input type="number" id="note-marker-size" value="8" class="size-input" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>גודל מס' ברשימה:</label><input type="number" id="note-listing-num-size" value="8" class="size-input" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>מפריד אחרי מספר:</label><input type="text" id="note-num-separator" value="." style="flex:0 0 40px;" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>קו מפריד (שוליים):</label>
          <select id="note-rule-style" onchange="typesetDocument()">
            <option value="plain" selected="selected">קו רגיל</option>
            <option value="dots">קו + עיגולים ◦◦◦</option>
            <option value="sparkle">קו + ניצוץ ❖❖❖</option>
            <option value="star">קו + כוכבית ✧✧✧</option>
            <option value="diamond">קו + יהלום ♦♦♦</option>
            <option value="none">ללא קו</option>
          </select>
        </div>
      </div>

      <!-- פאנל איכות עימוד -->
      <div class="panel-static">
        <div class="panel-header">✍️ איכות עימוד אוטומטי</div>
        <div class="inline-cfg-row"><label>מניעת שורות בודדות:</label>
          <select id="avoid-widows-select" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>איזון סוף-פרק:</label>
          <select id="balance-chapter-end" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
      </div>

      <!-- פאנל רקעים -->
      <div class="panel-static">
        <div class="panel-header">🎨 רקע לעמודי תוכן</div>
        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד טקסט רגיל:</label>
          <select id="cbg-regular-mode" style="flex:1;" onchange="toggleCbgSubRows('regular', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-regular-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-regular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-regular-img')">
          <input type="hidden" id="data-cbg-regular-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-regular-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 0":</label>
          <select id="cbg-h0Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h0Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h0Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h0Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h0Open-img')">
          <input type="hidden" id="data-cbg-h0Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h0Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 2":</label>
          <select id="cbg-h2Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h2Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h2Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h2Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h2Open-img')">
          <input type="hidden" id="data-cbg-h2Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h2Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div style="font-size:8pt; font-weight:700; margin-bottom:6px;">תוכן העניינים</div>
          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד ראשון:</label>
            <select id="cbg-tocFirst-mode" style="flex:1;" onchange="toggleCbgSubRows('tocFirst', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocFirst-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocFirst-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocFirst-img')">
            <input type="hidden" id="data-cbg-tocFirst-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocFirst-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד רגיל (ביניים):</label>
            <select id="cbg-tocRegular-mode" style="flex:1;" onchange="toggleCbgSubRows('tocRegular', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocRegular-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocRegular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocRegular-img')">
            <input type="hidden" id="data-cbg-tocRegular-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocRegular-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד אחרון:</label>
            <select id="cbg-tocLast-mode" style="flex:1;" onchange="toggleCbgSubRows('tocLast', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocLast-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocLast-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocLast-img')">
            <input type="hidden" id="data-cbg-tocLast-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocLast-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>
        </div>
      </div>

      <!-- פאנל כותרות 0-7 -->
      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h0" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>טקסט כותרת 0:</label>
          <span style="font-size:7.5pt; color:#666; width:95px; flex-shrink:0;">(גוף ההקדמה)</span>
          <select id="f-h0-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Frank Ruhl Libre', serif" selected="selected">Frank Ruhl Libre</option></optgroup></select>
          <input type="number" id="s-h0-body" class="size-input" value="11.5" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 1 (שער משנה):</label>
          <select id="mode-h1"><option value="sub_shaar" selected="selected">שער משנה נפרד</option><option value="new_page_1col">טור 1 עמוד הבא</option></select>
          <select id="f-h1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-h1" class="size-input" value="50">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h1" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h2" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 3:</label>
          <select id="mode-h3"><option value="span_1col" selected="selected">טור 1 רציף (רוחב דף)</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h3" class="size-input" value="13.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 4:</label>
          <select id="mode-h4"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h4" class="size-input" value="12.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 5:</label>
          <select id="mode-h5"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaLight', serif" selected="selected">AlphaLight</option></optgroup></select>
          <input type="number" id="s-h5" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 6:</label>
          <select id="mode-h6"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Noto Serif Hebrew', serif" selected="selected">Noto Serif Hebrew</option></optgroup></select>
          <input type="number" id="s-h6" class="size-input" value="10.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 7 (צד):</label>
          <select id="mode-h7"><option value="side_note" selected="selected">כותרת צד בשוליים</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Hadassah Friedlaender', serif" selected="selected">Hadassah Friedlaender</option></optgroup></select>
          <input type="number" id="s-h7" class="size-input" value="6" step="0.2">
        </div>
      </div>

      <!-- פאנל כותרות עליונות -->
      <div class="panel-static">
        <div class="panel-header">📑 כותרות עליונות (3 אזורים)</div>
        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">1. מעל הטור הימני:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-r-type" style="flex:1;" onchange="document.getElementById('hdr-r-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1" selected="selected">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-r-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option><option value="left">שמאל</option></select>
          <select id="f-hdr-r" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-r" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-r-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">2. מעל הרווח המרכזי (Gutter):</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-c-type" style="flex:1;" onchange="
            document.getElementById('hdr-c-custom').style.display = this.value === 'custom' ? 'block' : 'none';
            document.getElementById('row-hdr-c-img').style.display = this.value === 'custom_img' ? 'flex' : 'none';
          ">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear" selected="selected">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="custom_img">תמונת עיטור (קובץ)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-c-align" style="width:65px;"><option value="center" selected="selected">מרכז</option></select>
          <select id="f-hdr-c" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-c" class="size-input" value="11">
        </div>
        <input type="text" id="hdr-c-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
        <div class="inline-cfg-row" id="row-hdr-c-img" style="display:none; margin-bottom:8px;">
          <label>קובץ עיטור מרכזי:</label>
          <input type="file" id="file-hdr-c-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
          <input type="hidden" id="data-hdr-c-img" value="">
        </div>

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">3. מעל הטור השמאלי:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-l-type" style="flex:1;" onchange="document.getElementById('hdr-l-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2" selected="selected">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-l-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option></select>
          <select id="f-hdr-l" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-l" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-l-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:4px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
      </div>

      <!-- פאנל תוכן העניינים -->
      <div class="panel-static">
        <div class="panel-header">📑 תוכן העניינים (כללי ומפורט)</div>
        <div style="margin-bottom:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-general-toc" checked="checked"> הצג תוכן עניינים כללי בראש הספר</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="gtoc-show" value="1" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="1"></td><td><select id="f-gtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="gtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="2"></td><td><select id="f-gtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="gtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="3" checked="checked"></td><td><select id="f-gtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="gtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="4"></td><td><select id="f-gtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="gtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="5"></td><td><select id="f-gtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="gtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="6"></td><td><select id="f-gtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="gtoc-show" value="7"></td><td><input type="checkbox" class="gtoc-grp" value="7"></td><td><select id="f-gtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>

        <div style="margin: 8px 0 4px 0; border-top:1px dashed #ccc; padding-top:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-detailed-toc" checked="checked"> הצג תוכן מפורט בראש שערי משנה</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="dtoc-show" value="1"></td><td><input type="checkbox" class="dtoc-grp" value="1"></td><td><select id="f-dtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="dtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="2"></td><td><select id="f-dtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="dtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="3"></td><td><select id="f-dtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="dtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="4" checked="checked"></td><td><select id="f-dtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="dtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="5" checked="checked"></td><td><select id="f-dtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="dtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="6" checked="checked"></td><td><select id="f-dtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="dtoc-show" value="7" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="7" checked="checked"></td><td><select id="f-dtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>
      </div>

      <!-- פאנל גריד וטיפוגרפיה -->
      <div class="panel-static">
        <div class="panel-header">📐 גריד וטיפוגרפיה כללית</div>
        <div class="inline-cfg-row">
          <label>גוף הטקסט:</label>
          <select id="font-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Guttman Rashi', serif" selected="selected">Guttman Rashi</option></optgroup></select>
          <input type="number" id="size-body" class="size-input" value="12" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>מילה ראשונה:</label>
          <select id="font-first-word" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'FrankReal', serif" selected="selected">FrankReal</option></optgroup></select>
          <input type="number" id="size-first-word" class="size-input" value="1.5" step="0.1">
        </div>
        <div class="proportions-grid" style="margin-top:6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div class="prop-item"><label>טור (%):</label><input type="number" id="prop-col" value="40" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח מרכזי (%):</label><input type="number" id="prop-gutter" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח ביניים (%):</label><input type="number" id="prop-gap" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>מרחק עליון (px):</label><input type="number" id="prop-mt" value="20" step="1" class="size-input"></div>
          <div class="prop-item"><label>מרחק תחתון (px):</label><input type="number" id="prop-mb" value="20" step="1" class="size-input"></div>
        </div>
      </div>

    </div>

    <div class="btn-bar-bottom">
      <button class="btn-save-template" onclick="saveAsDefaultTemplate()">💾 שמור תבנית</button>
      <button class="btn-primary" onclick="typesetDocument()">⚡ עדכן ועמד מחדש</button>
      <button class="btn-secondary" onclick="window.print()">🖨️ הדפסה / PDF</button>
    </div>
  </div>

  <div id="resizer"></div>

  <div id="preview-pane">
    <div id="book-container"></div>
  </div>

  <div id="measuring-box"></div>

  <script>
    const resizer = document.getElementById('resizer');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      resizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newWidth = document.body.clientWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 800) {
        sidebar.style.width = newWidth + 'px';
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });

    const CBG_TEXTURE_SVG = "data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.18'/%3E%3C/svg%3E";

    function getContentBgCSS(roleKey) {
      const modeEl = document.getElementById('cbg-' + roleKey + '-mode');
      if (!modeEl) return '';
      const mode = modeEl.value;
      if (mode === 'color') {
        const c = document.getElementById('cbg-' + roleKey + '-color');
        return c ? `background-color:${c.value};background-image:none;` : '';
      }
      if (mode === 'texture') {
        return `background-color:#fdfcf6;background-image:url("${CBG_TEXTURE_SVG}");background-repeat:repeat;`;
      }
      if (mode === 'image') {
        const imgEl = document.getElementById('data-cbg-' + roleKey + '-img');
        const opEl = document.getElementById('cbg-' + roleKey + '-opacity');
        const img = imgEl ? imgEl.value : '';
        if (!img) return '';
        const op = opEl ? (parseInt(opEl.value, 10) / 100) : 0.15;
        const fade = 1 - op;
        return `background-image:linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${img}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
      }
      return '';
    }

    function applyContentBg(pageEl, roleKey) {
      const css = getContentBgCSS(roleKey);
      if (css) pageEl.style.cssText += css;
    }

    function toggleCbgSubRows(role, mode) {
      const rowColor = document.getElementById('row-cbg-' + role + '-color');
      const rowImg = document.getElementById('row-cbg-' + role + '-img');
      const rowOp = document.getElementById('row-cbg-' + role + '-op');
      if (rowColor) rowColor.style.display = (mode === 'color') ? 'flex' : 'none';
      if (rowImg) rowImg.style.display = (mode === 'image') ? 'flex' : 'none';
      if (rowOp) rowOp.style.display = (mode === 'image') ? 'flex' : 'none';
    }

    function togglePanelBody(bodyId) {
      const body = document.getElementById(bodyId);
      if (body) {
        body.style.display = (body.style.display === 'none') ? 'block' : 'none';
      }
    }

    /* ============================================================
       מערך ערכות הנושא המותאמות (Custom Themes Data Storage)
       ============================================================ */
    let customThemes = [];

    // הוספת ערכת נושא חדשה למערכת והטמעתה ברשימת הבחירה
    function addNewCustomTheme() {
      const nameInput = document.getElementById('builder-theme-name');
      const name = nameInput.value.trim();
      if (!name) {
        alert('אנא הזן שם לערכת הנושא.');
        return;
      }

      const mainSvg = document.getElementById('data-builder-main-svg').value;
      const backSvg = document.getElementById('data-builder-back-svg').value;
      const subSvg = document.getElementById('data-builder-sub-svg').value;

      const themeObj = {
        id: 'theme_' + Date.now(),
        name: name,
        mainShaar: {
          svgData: mainSvg || '',
          top: parseFloat(document.getElementById('builder-main-top').value) || 20,
          bottom: parseFloat(document.getElementById('builder-main-bottom').value) || 16,
          right: parseFloat(document.getElementById('builder-main-right').value) || 15,
          left: parseFloat(document.getElementById('builder-main-left').value) || 15
        },
        backShaar: {
          svgData: backSvg || '',
          top: parseFloat(document.getElementById('builder-back-top').value) || 22,
          bottom: parseFloat(document.getElementById('builder-back-bottom').value) || 18,
          right: parseFloat(document.getElementById('builder-back-right').value) || 15,
          left: parseFloat(document.getElementById('builder-back-left').value) || 95
        },
        subShaar: {
          svgData: subSvg || '',
          top: parseFloat(document.getElementById('builder-sub-top').value) || 20,
          bottom: parseFloat(document.getElementById('builder-sub-bottom').value) || 20,
          right: parseFloat(document.getElementById('builder-sub-right').value) || 95,
          left: parseFloat(document.getElementById('builder-sub-left').value) || 15
        }
      };

      customThemes.push(themeObj);
      refreshCustomThemesUI();

      // בחירה אוטומטית בערכה שזה עתה הוטמעה
      const select = document.getElementById('active-theme-select');
      if (select) {
        select.value = themeObj.id;
      }

      alert(`ערכת הנושא "${name}" הוטמעה בהצלחה! היא זמינה לבחירה ברשימה ותישמר לצמיתות בלחיצה על "שמור תבנית".`);
      typesetDocument();
    }

    // מחיקת ערכת נושא שהוטמעה
    function deleteCustomTheme(themeId) {
      if (!confirm('האם ברצונך למחוק ערכת נושא זו?')) return;
      customThemes = customThemes.filter(t => t.id !== themeId);
      refreshCustomThemesUI();
      typesetDocument();
    }

    // רענון רשימת הערכות בדרופדאון ובפאנל הניהול
    function refreshCustomThemesUI() {
      const optgroup = document.getElementById('custom-themes-optgroup');
      const listContainer = document.getElementById('custom-themes-list');
      const select = document.getElementById('active-theme-select');
      const currentVal = select ? select.value : '';

      if (optgroup) {
        optgroup.innerHTML = '';
        customThemes.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = t.name;
          optgroup.appendChild(opt);
        });
      }

      if (listContainer) {
        if (customThemes.length === 0) {
          listContainer.innerHTML = '<div style="font-size:7.5pt; color:#888;">עדיין לא הוטמעו ערכות מותאמות אישית.</div>';
        } else {
          let html = '<div style="font-size:8pt; font-weight:700; margin-bottom:4px; color:#333;">ערכות שהוטמעו בקובץ:</div>';
          customThemes.forEach(t => {
            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #ddd; padding:3px 6px; border-radius:3px; margin-bottom:3px; font-size:8pt;">
                <span>🏷️ ${t.name}</span>
                <span style="color:#dc2626; cursor:pointer; font-weight:bold;" onclick="deleteCustomTheme('${t.id}')">🗑️ מחק</span>
              </div>
            `;
          });
          listContainer.innerHTML = html;
        }
      }

      if (select && currentVal) {
        select.value = currentVal;
      }
    }

    /* ===================== EXTENSIONS: imported page-types / text-styles / image-pages ===================== */
    let importedPageTypes = [];
    let importedTextStyles = [];
    let importedImagePages = [];
    let extImportCounter = 0;
    let nextSyntheticLevel = 8;

    function validateExtJSON(def, expectedKind) {
      if (!def || typeof def !== 'object') return 'קובץ לא תקין (לא JSON תקין).';
      if (def.kind !== expectedKind) return 'הקובץ אינו מסוג ' + (expectedKind === 'pageType' ? 'סוג עמוד' : 'סגנון טקסט') + ' (kind=' + def.kind + ').';
      if (!def.name) return 'להגדרה שיובאה אין שם (name).';
      return null;
    }

    function handlePageTypeImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'pageType');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-pt-' + (extImportCounter++);
        importedPageTypes.push({ instanceId, def, anchor: def.insertionAnchor || 'afterAll', repeatMode: def.repeatMode || 'once' });
        buildExtPanel('pageType', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleTextStyleImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'textStyle');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-ts-' + (extImportCounter++);
        const syntheticLevel = (def.trigger && def.trigger.type === 'linePrefix') ? (nextSyntheticLevel++) : null;
        importedTextStyles.push({ instanceId, def, syntheticLevel });
        buildExtPanel('textStyle', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleImagePageImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const instanceId = 'ext-img-' + (extImportCounter++);
        importedImagePages.push({ instanceId, name: file.name, dataUrl: e.target.result, anchor: 'afterAll' });
        buildExtPanel('imagePage', instanceId, 'תמונה: ' + file.name, null);
        typesetDocument();
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    const EXT_ANCHOR_OPTIONS = [
      ['beforeAll','לפני הכל'], ['afterMainShaar','אחרי השער הראשי'], ['afterGeneralToc','אחרי תוכן העניינים הכללי'],
      ['beforeEachPart','לפני כל שער-חלק'], ['afterEachPart','מיד אחרי כל שער-חלק'], ['endOfEachPart','בסוף כל חלק'], ['afterAll','אחרי הכל']
    ];

    function buildExtPanel(kind, instanceId, name, def) {
      const panel = document.createElement('div');
      panel.className = 'panel-static';
      panel.id = instanceId + '-panel';
      const icon = kind === 'pageType' ? '📄' : kind === 'textStyle' ? '🅰️' : '🖼️';
      let triggerInfo = '';
      if (kind === 'textStyle' && def && def.trigger) {
        triggerInfo = (def.trigger.type === 'delimiterPair')
          ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${def.trigger.open}" ל-"${def.trigger.close}"</div>`
          : `<div style="font-size:7.5pt;color:#888;">קידומת: "${def.trigger.prefix}"</div>`;
      }
      const anchorRow = (kind !== 'textStyle')
        ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${instanceId}-anchor" onchange="updateExtAnchor('${kind}','${instanceId}', this.value)">${EXT_ANCHOR_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>`
        : '';
      panel.innerHTML = `
        <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>${icon} ${name}</span>
          <span style="cursor:pointer;color:#a33;font-weight:700;" onclick="removeExtInstance('${kind}','${instanceId}')">✕ הסר</span>
        </div>
        ${triggerInfo}
        ${anchorRow}
      `;
      document.getElementById('ext-imports-container').appendChild(panel);
      if (kind !== 'textStyle') {
        const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
        const inst = store.find(x => x.instanceId === instanceId);
        const sel = document.getElementById(instanceId + '-anchor');
        if (sel && inst) sel.value = inst.anchor;
      }
    }

    function updateExtAnchor(kind, instanceId, val) {
      const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
      const inst = store.find(x => x.instanceId === instanceId);
      if (inst) inst.anchor = val;
      typesetDocument();
    }

    function removeExtInstance(kind, instanceId) {
      if (kind === 'pageType') importedPageTypes = importedPageTypes.filter(x => x.instanceId !== instanceId);
      else if (kind === 'textStyle') importedTextStyles = importedTextStyles.filter(x => x.instanceId !== instanceId);
      else importedImagePages = importedImagePages.filter(x => x.instanceId !== instanceId);
      const p = document.getElementById(instanceId + '-panel');
      if (p) p.remove();
      typesetDocument();
    }

    function findPrefixLineInSource(rawText, prefix) {
      if (!prefix) return null;
      const lines = rawText.split('\n');
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith(prefix)) return t.slice(prefix.length).replace(/^[:\-–—]\s*/, '').trim();
      }
      return null;
    }

    const EXT_V_MAP = { top:'14mm', upperMid:'25%', center:'50%', lowerMid:'75%' };

    function applyExtStyleToNode(node, style, hostFontSizePt) {
      if (!style) return;
      if (style.family) node.style.fontFamily = style.family;
      if (typeof style.size === 'number') node.style.fontSize = style.size + 'pt';
      if (typeof style.sizeDelta === 'number') node.style.fontSize = ((hostFontSizePt||12) + style.sizeDelta) + 'pt';
      if (style.weight) node.style.fontWeight = style.weight;
      if (style.color) node.style.color = style.color;
      if (style.align) node.style.textAlign = style.align;
      if (style.border) {
        node.style.border = style.border.width + 'px solid ' + style.border.color;
        node.style.borderRadius = style.border.radius + 'px';
        node.style.padding = '2px 8px';
      }
    }

    function renderImportedPage(container, inst, rawSourceText) {
      const def = inst.def;
      const page = document.createElement('div');
      page.className = 'a4-page';
      if (def.background && def.background.mode === 'fixed') {
        const bs = def.background.style;
        if (bs === 'color' && def.background.color) page.style.background = def.background.color;
        else if (bs === 'texture') { page.style.background = '#fdfcf6 url("'+CBG_TEXTURE_SVG+'") repeat'; }
        else if (bs === 'image' && def.background.image) {
          const fade = 1 - (def.background.opacity != null ? def.background.opacity : 0.15);
          page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${def.background.image}")`;
          page.style.backgroundSize = 'cover'; page.style.backgroundPosition = 'center';
        }
      } else {
        applyContentBg(page, 'regular');
      }
      (def.elements || []).forEach(elDef => {
        const matched = findPrefixLineInSource(rawSourceText, elDef.prefix);
        const text = matched || elDef.defaultText || '';
        if (!text) return;
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.textContent = text;
        const pos = elDef.position || {};
        const va = pos.vAnchor || 'center', ha = pos.hAlign || 'center', off = pos.offsetY || 0;
        if (va === 'bottom') { el.style.bottom = (18 - off) + 'mm'; }
        else {
          el.style.top = `calc(${EXT_V_MAP[va] || '50%'} + ${off}px)`;
          if (va === 'center' || va === 'upperMid' || va === 'lowerMid') el.style.transform = 'translateY(-50%)';
        }
        if (ha === 'right' || ha === 'rightMid') { el.style.right = (ha === 'right' ? '15mm' : '25%'); }
        else if (ha === 'left' || ha === 'leftMid') { el.style.left = (ha === 'left' ? '15mm' : '25%'); }
        else { el.style.right = '0'; el.style.left = '0'; el.style.textAlign = 'center'; }
        applyExtStyleToNode(el, elDef.style, 12);
        page.appendChild(el);
      });
      container.appendChild(page);
    }

    function renderImportedImagePage(container, inst) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      page.style.backgroundImage = `url("${inst.dataUrl}")`;
      page.style.backgroundSize = 'cover';
      page.style.backgroundPosition = 'center';
      container.appendChild(page);
    }

    function renderExtAnchor(container, anchorKey, rawSourceText) {
      importedPageTypes.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedPage(container, inst, rawSourceText));
      importedImagePages.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedImagePage(container, inst));
    }

    function appendMainSubParts(hostElem, mainText, subText, def) {
      const mainPart = document.createElement('div');
      mainPart.textContent = mainText.trim();
      applyExtStyleToNode(mainPart, def.style, 14);
      hostElem.appendChild(mainPart);
      if (subText && subText.trim()) {
        const subPart = document.createElement('div');
        subPart.textContent = subText.trim();
        subPart.style.fontSize = '0.68em'; subPart.style.opacity = '0.78'; subPart.style.marginTop = '3px';
        hostElem.appendChild(subPart);
      }
    }

    function renderCustomHeadingInto(hostElem, inst, text) {
      const def = inst.def;
      hostElem.innerHTML = '';

      if (def.parseMode === 'splitFirstDash' && /[-–—]/.test(text)) {
        appendMainSubParts(hostElem, text.split(/[-–—]/)[0], text.split(/[-–—]/).slice(1).join(' - '), def);
        return;
      }

      if (def.parseMode === 'splitCustomDelimiter' && def.parseDelimiter && text.indexOf(def.parseDelimiter) > -1) {
        const idx = text.indexOf(def.parseDelimiter);
        appendMainSubParts(hostElem, text.slice(0, idx), text.slice(idx + def.parseDelimiter.length), def);
        return;
      }

      if (def.parseMode === 'regexGroups' && def.parseRegex) {
        let match = null;
        try {
          match = text.match(new RegExp(def.parseRegex));
        } catch (e) {
          console.warn('סגנון "' + def.name + '": ביטוי רגולרי לא תקין (' + def.parseRegex + ') — ' + e.message);
        }
        if (match && match.groups && Object.keys(match.groups).length) {
          const vals = Object.values(match.groups).filter(v => v !== undefined);
          if (vals.length) {
            appendMainSubParts(hostElem, vals[0], vals.slice(1).join(' '), def);
            return;
          }
        }
      }

      hostElem.textContent = text;
      applyExtStyleToNode(hostElem, def.style, 12);
    }

    function findExtTextStyle(instanceId) {
      return importedTextStyles.find(x => x.instanceId === instanceId);
    }

    function finalizeNotePositions(notesList, columnBoundaryHeight) {
      const byMargin = new Map();
      notesList.forEach(item => {
        if (!item.elem || !item.pElem) return;
        const marg = item.elem.parentElement;
        if (!marg) return;
        if (!byMargin.has(marg)) byMargin.set(marg, []);
        byMargin.get(marg).push(item);
      });
      byMargin.forEach(group => {
        group.sort((a, b) => a.pElem.offsetTop - b.pElem.offsetTop);
        group.forEach((item, idx) => {
          const noteHeight = item.elem.getBoundingClientRect().height || item.elem.offsetHeight || 0;
          let top = item.pElem.offsetTop;
          if (top + noteHeight > columnBoundaryHeight) {
            const prev = idx > 0 ? group[idx - 1] : null;
            const prevBottom = prev ? (parseFloat(prev.elem.style.top || 0) + (prev.elem.getBoundingClientRect().height || 0)) : 0;
            const minTop = prev ? prevBottom + 6 : 0;
            const raisedTop = columnBoundaryHeight - noteHeight;
            if (raisedTop >= minTop) {
              top = raisedTop;
            } else {
              const tokenId = item.pElem.getAttribute('data-token-id');
              const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
              if (contElem && contElem !== item.pElem) {
                const page = contElem.closest('.a4-page');
                const isRightCol = !!contElem.closest('.right-col');
                const destMargin = page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null;
                if (destMargin) {
                  const next = idx < group.length - 1 ? group[idx + 1] : null;
                  const maxTop = next ? (parseFloat(next.elem.style.top || Infinity) - noteHeight - 6) : Infinity;
                  const contTop = contElem.offsetTop;
                  if (contTop <= maxTop) {
                    destMargin.appendChild(item.elem);
                    top = contTop;
                  }
                }
              }
            }
          }
          item.elem.style.top = top + 'px';
        });
      });
    }

    /* ============================================================
       סריקת והחלת תוחמי טקסט (הערות שוליים והערות סיום)
       ============================================================ */
    function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt) {
      const activeStyles = [];

      const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
      const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
      if (fnOpen && fnClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose }, target: 'footnote' },
          instanceId: 'builtin-footnote'
        });
      }

      const enOpen = document.getElementById('en-delim-open')?.value?.trim();
      const enClose = document.getElementById('en-delim-close')?.value?.trim();
      if (enOpen && enClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: enOpen, close: enClose }, target: 'endnote' },
          instanceId: 'builtin-endnote'
        });
      }

      importedTextStyles.forEach(inst => {
        const trig = inst.def && inst.def.trigger;
        if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
        const scope = trig.appliesWithin;
        if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
        activeStyles.push(inst);
      });

      if (!activeStyles.length) return;
      const effHostSize = hostSizePt || 12;

      const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let n;
      while (n = walker.nextNode()) textNodes.push(n);

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        let matches = [];
        activeStyles.forEach(inst => {
          const trig = inst.def.trigger;
          let searchFrom = 0;
          while (true) {
            const oIdx = text.indexOf(trig.open, searchFrom);
            if (oIdx === -1) break;
            const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
            if (cIdx === -1) break;
            matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
            searchFrom = cIdx + trig.close.length;
          }
        });
        if (!matches.length) return;
        matches.sort((a,b) => a.start - b.start);
        const dedup = [];
        let lastEnd = -1;
        matches.forEach(m => { if (m.start >= lastEnd) { dedup.push(m); lastEnd = m.end; } });

        const frag = document.createDocumentFragment();
        let cursor = 0;
        dedup.forEach(m => {
          if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
          if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
            const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
            const innerText = text.slice(m.start + openLen, m.end - closeLen);
            const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
            frag.appendChild(marker);
          } else {
            const span = document.createElement('span');
            span.textContent = text.slice(m.start, m.end);
            applyExtStyleToNode(span, m.inst.def.style, effHostSize);
            frag.appendChild(span);
          }
          cursor = m.end;
        });
        if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }

    function getHostSizePt(level, customStyleId) {
      if (customStyleId) {
        const inst = findExtTextStyle(customStyleId);
        if (inst && inst.def.style && typeof inst.def.style.size === 'number') return inst.def.style.size;
        return 12;
      }
      const el = document.getElementById('s-h' + level);
      return el ? parseFloat(el.value) : 12;
    }
    function getBodySizePt() {
      const el = document.getElementById('size-body');
      return el ? parseFloat(el.value) : 12;
    }

    /* ===================== NOTES: footnotes + endnotes ===================== */
    const HEBREW_ALEF_BET = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
    function toHebrewLetterSeq(n) {
      if (n <= 0) return '';
      let result = '', num = n;
      while (num > 0) { num--; result = HEBREW_ALEF_BET[num % 22] + result; num = Math.floor(num / 22); }
      return result;
    }
    let noteCounters = { footnote: 0, endnote: 0 };
    let noteUidCounter = 0;
    let footnoteQueueForPage = [];
    let endnoteQueueForPart = [];

    function getNoteConfig(styleId) {
      const inst = findExtTextStyle(styleId);
      return (inst && inst.def.noteConfig) || {};
    }
    function formatNoteMarker(n, styleId) {
      const cfg = getNoteConfig(styleId);
      return (cfg.numberingStyle === 'alphabetic') ? toHebrewLetterSeq(n) : String(n);
    }
    function resetNoteCounterIfNeeded(target, trigger) {
      importedTextStyles.forEach(inst => {
        if (inst.def.target === target) {
          const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt) || (target === 'footnote' ? 'page' : 'part');
          if (resetAt === trigger) noteCounters[target] = 0;
        }
      });
    }
    function applyNoteMarkerStyle(el, isBacklink) {
      const typeEl = document.getElementById('note-marker-type');
      const sizeEl = isBacklink ? document.getElementById('note-listing-num-size') : document.getElementById('note-marker-size');
      const type = (!isBacklink && typeEl) ? typeEl.value : 'normal';
      const size = sizeEl ? parseFloat(sizeEl.value) : 8;
      el.style.fontSize = size + 'pt';
      el.style.fontWeight = '700';
      el.style.textDecoration = 'none';
      el.style.color = 'inherit';
      el.style.cursor = 'pointer';
      if (type === 'super') { el.style.verticalAlign = 'super'; el.style.lineHeight = '0'; }
      else if (type === 'sub') { el.style.verticalAlign = 'sub'; el.style.lineHeight = '0'; }
      else { el.style.verticalAlign = 'baseline'; }
      if (!isBacklink && type === 'brackets') { el.textContent = '[' + el.textContent + ']'; }
    }
    function createNoteMarkerAndQueue(text, styleId, target) {
      noteCounters[target] = (noteCounters[target] || 0) + 1;
      const num = noteCounters[target];
      const markerText = formatNoteMarker(num, styleId);
      const uid = 'n' + (noteUidCounter++);
      const marker = document.createElement('a');
      marker.className = 'note-marker';
      marker.href = '#note-' + uid;
      marker.id = 'noteref-' + uid;
      marker.textContent = markerText;
      applyNoteMarkerStyle(marker, false);
      const item = { number: markerText, text: text, styleId: styleId, uid: uid };
      if (target === 'footnote') footnoteQueueForPage.push(item);
      else endnoteQueueForPart.push(item);
      return marker;
    }

    function buildNoteBlockElement(queue, columns) {
      const wrap = document.createElement('div');
      wrap.className = 'note-block';
      if (columns === 2) wrap.style.columnCount = '2';
      const sepEl = document.getElementById('note-num-separator');
      const globalSep = sepEl ? sepEl.value : '.';
      queue.forEach(item => {
        const line = document.createElement('div');
        line.className = 'note-line';
        line.id = 'note-' + item.uid;
        const num = document.createElement('a');
        num.className = 'note-line-num';
        num.href = '#noteref-' + item.uid;
        num.textContent = item.number + globalSep + ' ';
        applyNoteMarkerStyle(num, true);
        const body = document.createElement('span');
        body.textContent = item.text;
        const inst = findExtTextStyle(item.styleId);
        if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
        line.appendChild(num); line.appendChild(body);
        wrap.appendChild(line);
      });
      return wrap;
    }

    function buildNoteRuleElement() {
      const sel = document.getElementById('note-rule-style');
      const style = sel ? sel.value : 'plain';
      const rule = document.createElement('div');
      if (style === 'none') { rule.style.display = 'none'; return rule; }
      if (style === 'plain') { rule.className = 'note-rule-plain'; return rule; }
      const glyphs = { dots: '◦◦◦', sparkle: '❖❖❖', star: '✧✧✧', diamond: '♦♦♦' };
      rule.className = 'note-rule-decorative';
      const segR = document.createElement('span'); segR.className = 'rule-seg';
      const mid = document.createElement('span'); mid.className = 'rule-glyphs'; mid.textContent = glyphs[style] || '';
      const segL = document.createElement('span'); segL.className = 'rule-seg';
      rule.appendChild(segR); rule.appendChild(mid); rule.appendChild(segL);
      return rule;
    }

    function flushFootnotesInto(pageEl) {
      if (!footnoteQueueForPage.length) { resetNoteCounterIfNeeded('footnote', 'page'); return; }
      const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
      const rule = buildNoteRuleElement();
      const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
      const area = document.createElement('div');
      area.className = 'footnote-area';
      area.appendChild(rule);
      area.appendChild(block);
      pageEl.appendChild(area);
      footnoteQueueForPage = [];
      resetNoteCounterIfNeeded('footnote', 'page');
    }

    function flushEndnotesForPart(container, pIdx) {
      if (!endnoteQueueForPart.length) { resetNoteCounterIfNeeded('endnote', 'part'); return 0; }
      const cfg0 = getNoteConfig(endnoteQueueForPart[0].styleId);
      const columns = cfg0.columns || 1;
      let pagesUsed = 0;
      let remaining = endnoteQueueForPart.slice();
      while (remaining.length) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        applyContentBg(page, 'regular');
        const title = document.createElement('div');
        title.className = 'title-level-2-standalone';
        title.textContent = pagesUsed === 0 ? 'הערות' : 'הערות (המשך)';
        page.appendChild(title);
        const wrap = document.createElement('div');
        wrap.className = 'note-block endnote-page-block';
        if (columns === 2) wrap.style.columnCount = '2';
        page.appendChild(wrap);
        container.appendChild(page);
        let fit = 0;
        for (let i = 0; i < remaining.length; i++) {
          const testBlock = buildNoteBlockElement(remaining.slice(0, i + 1), columns);
          wrap.innerHTML = ''; wrap.appendChild(testBlock);
          if (wrap.scrollHeight > page.clientHeight - 60 && i > 0) { break; }
          fit = i + 1;
        }
        remaining = remaining.slice(fit);
        pagesUsed++;
        if (pagesUsed > 200) break;
      }
      endnoteQueueForPart = [];
      resetNoteCounterIfNeeded('endnote', 'part');
      return pagesUsed;
    }

    function handleImageUpload(event, targetInputId) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const targetInput = document.getElementById(targetInputId);
        if (targetInput) {
          targetInput.value = e.target.result;
          targetInput.setAttribute('value', e.target.result);
          typesetDocument();
        }
      };
      reader.readAsDataURL(file);
    }

    // שמירת כל התבנית לצמיתות כולל כל ערכות הנושא המותאמות
    function saveAsDefaultTemplate() {
      let dataIsland = document.getElementById('ext-imports-data');
      if (!dataIsland) {
        dataIsland = document.createElement('script');
        dataIsland.type = 'application/json';
        dataIsland.id = 'ext-imports-data';
        document.head.appendChild(dataIsland);
      }
      dataIsland.textContent = JSON.stringify({
        pageTypes: importedPageTypes,
        textStyles: importedTextStyles,
        imagePages: importedImagePages,
        customThemes: customThemes
      });

      document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"], input[type="color"], input[type="range"]').forEach(input => {
        input.setAttribute('value', input.value);
      });
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) cb.setAttribute('checked', 'checked');
        else cb.removeAttribute('checked');
      });
      document.querySelectorAll('select').forEach(sel => {
        Array.from(sel.options).forEach(opt => {
          if (opt.value === sel.value) opt.setAttribute('selected', 'selected');
          else opt.removeAttribute('selected');
        });
      });

      const rawInputElem = document.getElementById('raw-input');
      const prevVal = rawInputElem.value;
      rawInputElem.innerHTML = '';
      rawInputElem.value = '';

      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      rawInputElem.value = prevVal;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'torani-typesetting-template.html';
      a.click();
      URL.revokeObjectURL(a.href);
    }

    async function loadSystemFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const availableFonts = await window.queryLocalFonts();
          const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));
          
          if (fontFamilies.length > 0) {
            document.querySelectorAll('.font-picker').forEach(select => {
              const currentVal = select.value;
              select.innerHTML = '';
              
              const sysGroup = document.createElement('optgroup');
              sysGroup.label = `גופני מחשב (${fontFamilies.length} נמצאו)`;
              
              fontFamilies.forEach(family => {
                const opt = document.createElement('option');
                opt.value = `'${family}', serif`;
                opt.textContent = family;
                if (currentVal.includes(family)) opt.selected = true;
                sysGroup.appendChild(opt);
              });
              
              select.appendChild(sysGroup);
            });
            alert(`נטענו בהצלחה ${fontFamilies.length} גופנים מהמחשב!`);
          }
        } catch (err) {
          alert('לא ניתנה הרשאה לגישה לגופני המחשב.');
        }
      } else {
        alert('הדפדפן אינו תומך בגישה ישירה לגופני המערכת. מומלץ להשתמש ב-Chrome או Edge.');
      }
    }

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

    function updateGrid() {
      const root = document.documentElement;
      const rawCol = parseFloat(document.getElementById('prop-col').value) || 0;
      const rawMargin = parseFloat(document.getElementById('prop-margin').value) || 0;
      const rawGutter = parseFloat(document.getElementById('prop-gutter').value) || 0;
      const rawGap = parseFloat(document.getElementById('prop-gap').value) || 0;
      const total = 2 * rawCol + 2 * rawMargin + rawGutter + 2 * rawGap;
      const scale = total > 0 ? 100 / total : 1;
      root.style.setProperty('--w-col', (rawCol * scale) + '%');
      root.style.setProperty('--w-margin', (rawMargin * scale) + '%');
      root.style.setProperty('--w-gutter', (rawGutter * scale) + '%');
      root.style.setProperty('--w-gap', (rawGap * scale) + '%');
      root.style.setProperty('--flow-mt', document.getElementById('prop-mt').value + 'px');
      root.style.setProperty('--flow-mb', document.getElementById('prop-mb').value + 'px');
    }

    function updateStyles() {
      const root = document.documentElement;
      root.style.setProperty('--fn-header-r', document.getElementById('f-hdr-r').value);
      root.style.setProperty('--sz-header-r', document.getElementById('s-hdr-r').value + 'pt');
      root.style.setProperty('--fn-header-c', document.getElementById('f-hdr-c').value);
      root.style.setProperty('--sz-header-c', document.getElementById('s-hdr-c').value + 'pt');
      root.style.setProperty('--fn-header-l', document.getElementById('f-hdr-l').value);
      root.style.setProperty('--sz-header-l', document.getElementById('s-hdr-l').value + 'pt');

      root.style.setProperty('--fn-h0', document.getElementById('f-h0').value);
      root.style.setProperty('--sz-h0', document.getElementById('s-h0').value + 'pt');
      root.style.setProperty('--fn-h0-body', document.getElementById('f-h0-body').value);
      root.style.setProperty('--sz-h0-body', document.getElementById('s-h0-body').value + 'pt');

      root.style.setProperty('--fn-h1', document.getElementById('f-h1').value);
      root.style.setProperty('--sz-h1', document.getElementById('s-h1').value + 'pt');
      root.style.setProperty('--fn-h2', document.getElementById('f-h2').value);
      root.style.setProperty('--sz-h2', document.getElementById('s-h2').value + 'pt');
      root.style.setProperty('--fn-h3', document.getElementById('f-h3').value);
      root.style.setProperty('--sz-h3', document.getElementById('s-h3').value + 'pt');
      root.style.setProperty('--fn-h4', document.getElementById('f-h4').value);
      root.style.setProperty('--sz-h4', document.getElementById('s-h4').value + 'pt');
      root.style.setProperty('--fn-h5', document.getElementById('f-h5').value);
      root.style.setProperty('--sz-h5', document.getElementById('s-h5').value + 'pt');
      root.style.setProperty('--fn-h6', document.getElementById('f-h6').value);
      root.style.setProperty('--sz-h6', document.getElementById('s-h6').value + 'pt');
      root.style.setProperty('--fn-h7', document.getElementById('f-h7').value);
      root.style.setProperty('--sz-h7', document.getElementById('s-h7').value + 'pt');

      root.style.setProperty('--fn-sh-title', document.getElementById('f-sh-title').value);
      root.style.setProperty('--sz-sh-title', document.getElementById('s-sh-title').value + 'pt');
      root.style.setProperty('--fn-sh-sub', document.getElementById('f-sh-sub').value);
      root.style.setProperty('--sz-sh-sub', document.getElementById('s-sh-sub').value + 'pt');
      root.style.setProperty('--fn-sh-desc', document.getElementById('f-sh-desc').value);
      root.style.setProperty('--sz-sh-desc', document.getElementById('s-sh-desc').value + 'pt');
      root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec').value);
      root.style.setProperty('--sz-sh-sec', document.getElementById('s-sh-sec').value + 'pt');
      root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author').value);
      root.style.setProperty('--sz-sh-author', document.getElementById('s-sh-author').value + 'pt');
      root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year').value);
      root.style.setProperty('--sz-sh-year', document.getElementById('s-sh-year').value + 'pt');

      root.style.setProperty('--fn-first-word', document.getElementById('font-first-word').value);
      root.style.setProperty('--sz-first-word', document.getElementById('size-first-word').value + 'em');
      root.style.setProperty('--fn-body', document.getElementById('font-body').value);
      root.style.setProperty('--sz-body', document.getElementById('size-body').value + 'pt');
    }

    function createDropWord(text, isContinuation, isSingleLine) {
      if (isContinuation) return text;
      text = text.trim();
      const firstSpace = text.indexOf(' ');
      if (firstSpace === -1) {
        return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${text}</span>`;
      }
      const firstWord = text.substring(0, firstSpace);
      const rest = text.substring(firstSpace + 1);
      return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${firstWord}</span> ${rest}`;
    }

    function renderHeaderSectionHTML(type, customText, h1Title, h2Title, h3Title, bookTitle, tocFallback) {
      if (type === 'h1') return h1Title || tocFallback || '';
      if (type === 'h2') return h2Title || tocFallback || '';
      if (type === 'h3') return h3Title || '';
      if (type === 'book_title') return bookTitle || '';
      if (type === 'custom') return customText || '';
      if (type === 'diamonds') return '<span style="letter-spacing:3px;">◈ ❖ ◈</span>';
      if (type === 'spear') return '<svg style="height:9px; width:48px;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#444" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#444"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#444"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#444"/></svg>';
      if (type === 'swash') return '<svg style="height:12px; width:44px; fill:#444;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>';
      if (type === 'pen') return '<svg style="height:12px; width:44px;" viewBox="0 0 280 80"><g stroke="#444" fill="none" stroke-linecap="round"><path d="M30,55 C12,42 22,22 38,28 C50,32 55,48 45,58 C35,68 18,60 14,46 C10,32 25,18 42,22 C65,28 85,65 118,68 C128,69 135,62 135,50 C135,38 124,32 115,38" stroke-width="3"/><path d="M250,55 C268,42 258,22 242,28 C230,32 225,48 235,58 C245,68 262,60 266,46 C270,32 255,18 238,22 C215,28 195,65 162,68 C152,69 145,62 145,50 C145,38 156,32 165,38" stroke-width="3"/></g></svg>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-hdr-c-img') ? document.getElementById('data-hdr-c-img').value : '';
        return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 100%; object-fit: contain; vertical-align: middle;" />` : '';
      }
      return '';
    }

    function getSectionDividerHTML(type) {
      if (type === 'pyramid') return '<div style="grid-column: 3 / 6; text-align: center; line-height: 0.9; margin: 18px 0 6px 0;"><div style="font-size: 10pt; letter-spacing: 6px;">❖ ❖ ❖</div><div style="font-size: 9pt; letter-spacing: 5px; margin-top: 3px;">❖ ❖</div><div style="font-size: 8pt; margin-top: 3px;">❖</div></div>';
      if (type === 'spear') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 200px; height: 22px; margin: auto;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/><path d="M165,20 C165,22 150,24 130,24 C95,24 55,21 30,20 C55,19 95,16 130,16 C150,16 165,18 165,20 Z" fill="#fff"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/><path d="M235,20 C235,22 250,24 270,24 C305,24 345,21 370,20 C345,19 305,16 270,16 C250,16 235,18 235,20 Z" fill="#fff"/></svg></div>';
      if (type === 'swash') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 170px; height: 18px; fill: #111; margin: auto;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg></div>';
      if (type === 'flourish') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 140px; height: 45px; fill: #000; margin: auto;" viewBox="0 0 240 90"><path d="M110,48 C105,44 92,30 82,30 C68,30 55,42 42,42 C30,42 22,32 22,22 C22,12 32,5 45,5 C60,5 72,18 78,28 C82,20 88,10 100,10 C108,10 114,16 114,24 C114,35 102,44 88,44 C72,44 58,35 48,22 C42,28 35,35 25,48 C15,62 10,72 20,82 C30,90 48,85 62,72 C78,58 92,54 110,48 Z"/><path d="M130,48 C135,44 148,30 158,30 C172,30 185,42 198,42 C210,42 218,32 218,22 C218,12 208,5 195,5 C180,5 168,18 162,28 C158,20 152,10 140,10 C132,10 126,16 126,24 C126,35 138,44 152,44 C168,44 182,35 192,22 C198,28 205,35 215,48 C225,62 230,72 220,82 C210,90 192,85 178,72 C162,58 148,54 130,48 Z"/></svg></div>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-sec-div-img') ? document.getElementById('data-sec-div-img').value : '';
        return imgSrc ? `<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><img src="${imgSrc}" style="max-width: 260px; max-height: 45px; margin: auto; display: block; object-fit: contain;" /></div>` : '';
      }
      return '';
    }

    /* ============================================================
       רינדור שער ראשי (Main Shaar)
       ============================================================ */
    function renderMainShaar(container, themeId) {
      const page = document.createElement('div');
      page.className = `a4-page main-shaar-page`;

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const subtitle = document.getElementById('inp-book-subtitle').value || "";
      const desc = document.getElementById('inp-book-desc').value || "";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let frameHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.mainShaar && customTheme.mainShaar.svgData) {
          frameHTML = `<img class="custom-bg-img" src="${customTheme.mainShaar.svgData}" alt="שער ראשי">`;
        }
        const m = customTheme.mainShaar || { top: 20, bottom: 16, right: 15, left: 15 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else if (themeId === 'builtin_1') {
        frameHTML = `
          <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
          <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
        `;
      } else if (themeId === 'builtin_2') {
        frameHTML = `
          <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
          <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
        `;
      } else if (themeId === 'builtin_3') {
        frameHTML = `
          <div class="m3-wavy-band"></div>
          <div class="m3-panel">
            <svg class="m3-corner tr" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner tl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner br" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner bl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
          </div>
        `;
      }

      page.innerHTML = `
        ${frameHTML}
        <div class="shaar-main-content theme-bounded-content" style="${boxStyle}">
          <div>
            <div class="bsd-header">בס"ד</div>
            <div class="sefer-label"></div>
            <div class="book-title-main">${title}</div>
            <div class="book-subtitle">${subtitle}</div>
            <svg style="width: 180px; height: 24px; margin: 12px auto;" viewBox="0 0 400 40">
              <circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/>
              <path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/>
              <path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/>
            </svg>
          </div>
          <div class="book-description">${desc}</div>
          <div class="book-sections-summary">${sections}</div>
          <div class="author-block"><br><span class="author-name">${author}</span></div>
          <div class="publication-footer">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער אחורי (Back Shaar - טור ימני)
       ============================================================ */
    function renderBackShaar(container, themeId) {
      const page = document.createElement('div');
      page.className = 'a4-page back-shaar-page';

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let bgHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.backShaar && customTheme.backShaar.svgData) {
          bgHTML = `<img class="custom-bg-img" src="${customTheme.backShaar.svgData}" alt="שער אחורי">`;
        }
        const m = customTheme.backShaar || { top: 22, bottom: 18, right: 15, left: 95 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else {
        let innerLace = '';
        if (themeId === 'builtin_2') innerLace = '<div class="m2-lace" style="border-right: 1px solid #ddd;"></div>';
        bgHTML = `<div class="back-shaar-bg-left"></div>`;
        boxStyle = `position:absolute; top:0; bottom:0; right:0; left:45%;`;
      }

      page.innerHTML = `
        ${bgHTML}
        <div class="theme-bounded-content" style="${boxStyle}">
          <div>
            <div style="font-size: 13pt; font-weight: 700; margin-bottom: 8px;">כל הזכויות שמורות</div>
            <div style="font-size: 10.5pt; line-height: 1.6; max-width: 90%; margin: 10px auto; color: #333;">
              אין לשכפל, להעתיק, לצלם, לתרגם, לאחסן במאגר מידע, למסור או לקלוט בכל דרך או אמצעי אלקטרוני, אופטי או מכני אחר כל חלק שהוא מספר זה, ללא רשות מפורשת בכתב מבעל הזכויות.
            </div>
          </div>
          <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 12px 10px; width: 85%;">
            <div style="font-weight: 700; font-size: 11pt; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 10pt; color: #555;">${sections}</div>
            <div style="font-size: 10.5pt; font-weight: 700; margin-top: 6px;">${author}</div>
          </div>
          <div style="font-size: 10pt; color: #666;">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער משנה (Sub Shaar - טור שמאלי)
       ============================================================ */
    function renderSubShaar(container, token, themeId) {
      const page = document.createElement('div');
      page.className = 'a4-page sub-shaar-page';
      page.setAttribute('data-token-id', token.id);
      page.id = `heading-tok-${token.id}`;
      
      let titleMain = token.text;
      let titleSub = '';

      if (token.text.includes('-') || token.text.includes('–') || token.text.includes('—')) {
        const parts = token.text.split(/[-–—]/);
        titleMain = parts[0].trim();
        titleSub = parts.slice(1).join(' - ').trim();
      }

      let bgHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.subShaar && customTheme.subShaar.svgData) {
          bgHTML = `<img class="custom-bg-img" src="${customTheme.subShaar.svgData}" alt="שער משנה">`;
        }
        const m = customTheme.subShaar || { top: 20, bottom: 20, right: 95, left: 15 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else {
        let innerLace = '';
        if (themeId === 'builtin_2') innerLace = '<div class="m2-lace" style="border-left: 1px solid #ddd;"></div>';
        bgHTML = `<div class="sub-shaar-bg-right"></div>`;
        boxStyle = `position:absolute; top:0; bottom:0; right:45%; left:0;`;
      }

      // הטקסט נשאר תמיד תחום בטור השמאלי לפי השוליים שהוגדרו
      page.innerHTML = `
        ${bgHTML}
        <div class="theme-bounded-content" style="${boxStyle} justify-content:center;">
          <div class="sefer-label">חלק</div>
          <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
          ${titleSub ? `
            <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
              <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
            </svg>
            <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
        </div>
      `;
      container.appendChild(page);
    }

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      applyContentBg(page, pageRole || 'regular');

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, h1Title, h2Title, h3Title, bookTitle);

      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, h1Title, h2Title, h3Title, bookTitle);

      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, h1Title, h2Title, h3Title, bookTitle);

      page.innerHTML = `
        <div class="page-content-wrapper">
          <div class="top-header-grid">
            <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
            <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
            <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
          </div>
          <div class="page-body-flow">
		    ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${h2TokenId}" id="heading-tok-${h2TokenId}"` : ''}>${h2Text}</div>` : ''}
          </div>
          <div class="page-number-footer">${toGematria(pNum)}</div>
        </div>
      `;

      container.appendChild(page);
      const bodyFlow = page.querySelector('.page-body-flow');
      return { page, bodyFlow };
    }

    let lineToTokenMap = [];

    function parseMetadataFromText(rawText) {
      const lines = rawText.split('\n');
      const cleanLines = [];

      for (let line of lines) {
        const trimmed = line.trim();
        let match = false;

        if (/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-title').value = trimmed.replace(/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-subtitle').value = trimmed.replace(/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-desc').value = trimmed.replace(/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-sections').value = trimmed.replace(/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-author').value = trimmed.replace(/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-year').value = trimmed.replace(/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*/i, '').trim();
          match = true;
        }

        if (!match) {
          cleanLines.push(line);
        }
      }
      return cleanLines.join('\n');
    }

    function estimateSectionFillRatio(tokens) {
      const sampleFlow = document.querySelector('.page-body-flow');
      const perPageCapacity = (sampleFlow ? sampleFlow.clientHeight : 900) * 2;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;width:580px;';
      probe.className = 'page-body-flow';
      document.body.appendChild(probe);
      let totalHeight = 0;
      tokens.forEach(t => {
        if (t.type === 'p') {
          const p = document.createElement('p');
          p.innerHTML = createDropWord(t.text, false, true);
          probe.appendChild(p);
          totalHeight += p.getBoundingClientRect().height;
          probe.removeChild(p);
        } else if (t.type.startsWith('h')) {
          const h = document.createElement('div');
          h.className = t.customStyleId ? 'title-level-custom' : `title-level-${t.level}`;
          h.textContent = t.text;
          probe.appendChild(h);
          totalHeight += h.getBoundingClientRect().height;
          const hStyle = window.getComputedStyle(h);
          totalHeight += parseFloat(hStyle.marginTop) + parseFloat(hStyle.marginBottom);
          probe.removeChild(h);
        }
      });
      document.body.removeChild(probe);
      if (totalHeight <= 0) return 1;
      const naivePages = Math.ceil(totalHeight / perPageCapacity);
      if (naivePages <= 1) return 1;
      const ratio = totalHeight / (naivePages * perPageCapacity);
      return Math.max(0.3, Math.min(1, ratio));
    }

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
      
      const pMeasure = document.createElement('p');
      pMeasure.style.margin = '0';
      pMeasure.style.padding = '0';
      
      const words = text.trim().split(/\s+/);
      if (words.length === 0) return { lines: [], hasWindow: false };

      pMeasure.textContent = text;
      measureContainer.appendChild(pMeasure);
      const singleLineHeight = pMeasure.offsetHeight;
      pMeasure.textContent = "א";
      const oneLineH = pMeasure.offsetHeight;
      const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
      const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
      
      let html = '';
      if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${words[0]}</span> `;
        for (let i = 1; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      } else {
        for (let i = 0; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      }
      
      pMeasure.innerHTML = html;
      
      const lines = [];
      let currentLine = [];
      let currentTop = -1;
      
      for (let i = 0; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
          lines.push(currentLine.join(' '));
          currentLine = [words[i]];
          currentTop = top;
        } else {
          currentLine.push(words[i]);
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
      }
      
      measureContainer.innerHTML = '';
      return { lines, hasWindow: shouldApplyWindow };
    }

    function justifyColumnVertically(col, targetHeight, styleObj) {
      const currentH = col.scrollHeight;
      const diff = targetHeight - currentH;
      if (diff > 2 && diff <= 60) {
        let pElements = Array.from(col.querySelectorAll('p'));
        if (pElements.length > 1) {
           let extraSpacing = diff / (pElements.length - 1);
           pElements.slice(0, -1).forEach(p => {
             let currentMargin = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
             p.style.marginBottom = (currentMargin + extraSpacing) + 'px';
           });
        } else if (pElements.length === 1) {
           let p = pElements[0];
           let currentLineHeight = parseFloat(styleObj.lineHeight) || 1.34;
           let linesInfo = getLinesFromParagraph(p.getAttribute('data-raw-text') || p.textContent, col.offsetWidth, styleObj, false);
           let numLines = linesInfo.lines.length;
           if (numLines > 1) {
               let fontSizePx = parseFloat(styleObj.fontSize) * 1.333;
               let extraLh = (diff / numLines) / fontSizePx;
               p.style.lineHeight = (currentLineHeight + extraLh).toString();
           }
        }
      }
    }

    function balanceColumns(block, colWidth, styleObj) {
      const rCol = block.querySelector('.right-col');
      const lCol = block.querySelector('.left-col');
      const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
      if (allChildren.length === 0) return;

      let mergedItems = [];
      for (let child of allChildren) {
        if (child.tagName === 'P') {
          let id = child.getAttribute('data-token-id');
          let text = child.getAttribute('data-raw-text');
          let isCont = child.getAttribute('data-is-cont') === 'true';
          let sideNote = child.getAttribute('data-side-note');
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
          } else {
             mergedItems.push({ type: 'p', id: id, rawText: text, isCont: isCont, sideNote: sideNote });
          }
        } else {
          mergedItems.push({ type: 'h', id: child.getAttribute('data-token-id'), html: child.outerHTML, level: child.className.match(/title-level-(\d+)/)?.[1] });
        }
      }

      const items = mergedItems.map(item => {
        if (item.type === 'p') {
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
          return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow };
        }
        return item;
      });

      const splitPoints = [];
      for (let i = 0; i <= items.length; i++) {
        if (i < items.length && items[i].type === 'p') {
          let lines = items[i].lines;
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
          for (let l = 1; l < lines.length; l++) {
            splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines });
          }
        } else {
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
        }
      }

      const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) return true;
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        return true;
      });

      let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
      if (pointsToEvaluate.length === 0) return;

      function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = 'p-end';
          p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);
        }
      }

      let bestSplit = pointsToEvaluate[0];
      let minAbsDiff = Infinity;

      for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pRight = document.createElement('p');
          pRight.className = 'p-cut';
          let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
          pRight.innerHTML = createDropWord(rightText, item.isCont, false);
          rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pLeft = document.createElement('p');
          pLeft.className = 'p-end';
          let leftText = sp.lines.slice(sp.lineIndex).join(' ');
          pLeft.innerHTML = createDropWord(leftText, true, false);
          lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) renderSingleItemFast(lCol, items[i]);
        let lHeight = lCol.scrollHeight;
        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);
        
        if (absDiff < minAbsDiff || (absDiff === minAbsDiff && diff >= 0)) {
            minAbsDiff = absDiff;
            bestSplit = sp;
        }
      }

      rCol.innerHTML = '';
      lCol.innerHTML = '';
      const rMargin = block.querySelector('.right-margin');
      const lMargin = block.querySelector('.left-margin');
      rMargin.innerHTML = '';
      lMargin.innerHTML = '';
      const finalNotes = [];

      function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = isPartial && isRight ? 'p-cut' : 'p-end';
          p.setAttribute('data-token-id', item.id);
          
          let textToRender = isPartial ? partialText : item.rawText;
          p.setAttribute('data-raw-text', textToRender);
          p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
          if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);

          if (item.sideNote && !isCont) {
            if (item.noteTarget === 'footnote' || item.noteTarget === 'endnote') {
              const marker = createNoteMarkerAndQueue(item.sideNote, item.sideNoteStyleId, item.noteTarget);
              p.insertBefore(marker, p.firstChild);
            } else {
              const noteElem = document.createElement('div');
              noteElem.className = 'side-note-anchor';
              noteElem.textContent = item.sideNote;
              if (item.sideNoteStyleId) {
                const inst = findExtTextStyle(item.sideNoteStyleId);
                if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
              }
              margin.appendChild(noteElem);
              finalNotes.push({ elem: noteElem, pElem: p });
            }
          }
        }
      }

      for (let i = 0; i < bestSplit.itemIndex; i++) appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
      if (bestSplit.lineIndex > 0) {
        let item = items[bestSplit.itemIndex];
        let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
        appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont);
        let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
        appendItemFinal(lCol, lMargin, item, false, true, leftText, true);
      }
      for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
      }

      let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
      if (finalDiff > 2 && finalDiff <= 60) {
          justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
      } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
          justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
      }

      finalizeNotePositions(finalNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
    }

    /* ============================================================
       מנוע העימוד המרכזי
       ============================================================ */
    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      const fnLinePrefix = document.getElementById('fn-line-prefix')?.value?.trim() || 'כותרת 7 -';
      const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      let pendingSideNoteStyleId = null;
      let pendingNoteTarget = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        if (enLinePrefix && line.startsWith(enLinePrefix)) {
          pendingSideNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'endnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        if (fnLinePrefix && line.startsWith(fnLinePrefix)) {
          pendingSideNote = line.slice(fnLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'footnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            pendingSideNote = txt;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = 'footnote';
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          let customMatch = null;
          for (const inst of importedTextStyles) {
            const trig = inst.def && inst.def.trigger;
            if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
              customMatch = { inst, text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim() };
              break;
            }
          }
          if (customMatch) {
            if (customMatch.inst.def.target === 'footnote' || customMatch.inst.def.target === 'endnote') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = customMatch.inst.def.target;
              lineToTokenMap[lineIdx] = null;
            } else if (customMatch.inst.def.layoutMode === 'side_note') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = null;
              lineToTokenMap[lineIdx] = null;
            } else {
              const lvl = customMatch.inst.syntheticLevel;
              const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: customMatch.text, lineIdx: lineIdx, customStyleId: customMatch.inst.instanceId };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
            }
          } else {
            const tokenObj = { id: tokens.length, type: 'p', text: line, sideNote: pendingSideNote, sideNoteStyleId: pendingSideNoteStyleId, noteTarget: pendingNoteTarget, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
            pendingSideNote = null;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = null;
          }
        }
      }

      const headingModes = {
        0: document.getElementById('mode-h0').value,
        1: document.getElementById('mode-h1').value,
        2: document.getElementById('mode-h2').value,
        3: document.getElementById('mode-h3').value,
        4: document.getElementById('mode-h4').value,
        5: document.getElementById('mode-h5').value,
        6: document.getElementById('mode-h6').value,
        7: document.getElementById('mode-h7').value
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
      });

      const oddPageRequired = {
        0: document.getElementById('odd-h0').checked,
        1: document.getElementById('odd-h1').checked,
        2: document.getElementById('odd-h2').checked
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
      });

      function ensureOddPageStart(level) {
        if (!oddPageRequired[level]) return;
        if (pageIndex % 2 === 0) {
          const blank = document.createElement('div');
          blank.className = 'a4-page blank-page';
          container.appendChild(blank);
          pageIndex++;
        }
      }

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
        if (mode === 'sub_shaar') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          sections.push({ type: 'sub_shaar', token: t, tokens: [] });
          currentSection = { type: 'body', tokens: [] };
        } else if (mode === 'new_page_1col') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          currentSection = { type: 'body', isNewPage: true, hToken: t, tokens: [] };
        } else {
          currentSection.tokens.push(t);
        }
      });
      if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
        sections.push(currentSection);
      }

      const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
      const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
          gtocShows.push(inst.syntheticLevel);
          if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
        }
      });

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const showBackShaar = document.getElementById('show-back-shaar').checked;
      const activeThemeId = document.getElementById('active-theme-select').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // רינדור שער ראשי
      if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId);
        renderExtAnchor(container, 'afterMainShaar', rawText);
      } else {
        renderExtAnchor(container, 'beforeAll', rawText);
      }

      // רינדור שער אחורי (גב השער הראשי)
      if (showBackShaar) {
        renderBackShaar(container, activeThemeId);
      }

      // רינדור תוכן עניינים כללי
      if (enableGeneralTOC) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(
          container, 
          generalTocEntries, 
          "תוכן העניינים הכללי", 
          bookTitle, 
          "תוכן העניינים הכללי", 
          pageIndex,
          "תוכן העניינים הכללי", "תוכן העניינים הכללי",
          "gtoc"
        );
        pageIndex += pagesRendered;
      }
      renderExtAnchor(container, 'afterGeneralToc', rawText);

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      let hasOpenPart = false;
      let prevPageEl = null;

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
          if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
          renderExtAnchor(container, 'beforeEachPart', rawText);
          hasOpenPart = true;
          ensureOddPageStart(sec.token.level);
          renderSubShaar(container, sec.token, activeThemeId);
          if (sec.token.customStyleId) {
            const inst = findExtTextStyle(sec.token.customStyleId);
            const justRendered = container.lastElementChild;
            if (inst && justRendered) {
              const tEl = justRendered.querySelector('.book-title-main');
              const sEl = justRendered.querySelector('.book-subtitle');
              if (tEl) applyExtStyleToNode(tEl, inst.def.style, 36);
              if (sEl) applyExtStyleToNode(sEl, inst.def.style, 21);
            }
          }
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
            importedTextStyles.forEach(inst => {
              if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                dtocShows.push(inst.syntheticLevel);
                if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
              }
            });
            const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
            const dtocPages = renderPaginatedTOC(
              container, 
              detailedTocEntries, 
              "מפתח ולוח עניינים מפורט", 
              currentH1Title, 
              "תוכן העניינים המפורט", 
              pageIndex,
              currentH1Title, "תוכן העניינים המפורט",
              "dtoc"
            );
            pageIndex += dtocPages;
          }
          renderExtAnchor(container, 'afterEachPart', rawText);
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.level === 0;

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;
        const sectionFillRatio = (document.getElementById('balance-chapter-end').value === 'yes')
          ? estimateSectionFillRatio(secTokens) : 1;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
          if (prevPageEl) flushFootnotesInto(prevPageEl);
          if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);
          const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
          let pageLayout = createPageLayout(
            container, 
            isFirstPage ? h2Text : '', 
            isFirstPage ? h2Id : undefined, 
            pageIndex, 
            currentH1Title, 
            currentH2Title,
            currentH3Title,
            bookTitle,
            customR, customC, customL,
            pageRole
          );
          pageIndex++;
          prevPageEl = pageLayout.page;
		  
		      let remPageHeight = pageLayout.bodyFlow.clientHeight * sectionFillRatio;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
             if (title && sec.hToken.customStyleId) {
                const inst = findExtTextStyle(sec.hToken.customStyleId);
                if (inst) renderCustomHeadingInto(title, inst, h2Text);
             }
             let used = 0;
             if (spacer) used += spacer.getBoundingClientRect().height;
             if (title) {
                 used += title.getBoundingClientRect().height;
                 const titleStyle = window.getComputedStyle(title);
                 used += parseFloat(titleStyle.marginTop) + parseFloat(titleStyle.marginBottom);
             }
             remPageHeight -= used;
          }
          isFirstPage = false;

          if (isH0) {
            const singleBlock = document.createElement('div');
            singleBlock.className = 'block-single-col';
            singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
            pageLayout.bodyFlow.appendChild(singleBlock);
            const targetCol = singleBlock.querySelector('.single-wide-col');
            let pageHasContent = false;

            while (tokenIndex < secTokens.length || pendingWordTokens) {
              if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0) {
                break;
              }

              let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

              if (currentTok.type.startsWith('h')) {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                hElem.setAttribute('data-token-id', currentTok.id);
                if (currentTok.customStyleId) {
                  const inst = findExtTextStyle(currentTok.customStyleId);
                  if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                } else {
                  hElem.textContent = currentTok.text;
                }
                applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }

                if (document.getElementById('avoid-widows-select').value === 'yes'
                    && (tokenIndex + 1 < secTokens.length)
                    && (remPageHeight - targetCol.scrollHeight < 30)
                    && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p') {
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                  pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                  
                  if (targetCol.scrollHeight <= remPageHeight) {
                    bestFitLine = i;
                  } else {
                    break;
                  }
                }

                if (bestFitLine === 0) {
                  targetCol.removeChild(pElem);
                  if (targetCol.children.length > 0) {
                    let lastEl = targetCol.lastElementChild;
                    while (lastEl && lastEl.className.startsWith('title-level-')) {
                      targetCol.removeChild(lastEl);
                      tokenIndex--;
                      lastEl = targetCol.lastElementChild;
                    }
                    break;
                  } else {
                    if (!pageHasContent) {
                        bestFitLine = 1;
                    } else {
                        break;
                    }
                  }
                }

                if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                  const remainingAfterSplit = lines.length - bestFitLine;
                  if (bestFitLine === 1 && pageHasContent) {
                    targetCol.removeChild(pElem);
                    break;
                  } else if (remainingAfterSplit === 1) {
                    if (bestFitLine > 1) {
                      bestFitLine -= 1;
                    } else if (pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    }
                  }
                }

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                applyDelimiterStyles(pElem, 'body', getBodySizePt());

                if (isEndOfP) {
                  pendingWordTokens = null;
                  tokenIndex++;
                } else {
                  pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                  break;
                }
              }
            }
            continue;
          }

          let pagePendingNotes = [];

          while ((tokenIndex < secTokens.length || pendingWordTokens) && remPageHeight > 45) {
            let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
            const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              if (remPageHeight < 60) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              const spanTitle = document.createElement('div');
              spanTitle.className = 'h3-title-text';
              spanTitle.setAttribute('data-token-id', peekTok.id);
              spanTitle.id = `heading-tok-${peekTok.id}`;
              if (peekTok.customStyleId) {
                const inst = findExtTextStyle(peekTok.customStyleId);
                if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text); else spanTitle.textContent = peekTok.text;
              } else {
                spanTitle.textContent = peekTok.text;
              }
              applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId));
              spanBlock.appendChild(spanTitle);
              pageLayout.bodyFlow.appendChild(spanBlock);

              const spanHeight = spanBlock.getBoundingClientRect().height + 4;
              if (spanHeight > remPageHeight) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }
              if (document.getElementById('avoid-widows-select').value === 'yes'
                  && (tokenIndex + 1 < secTokens.length)
                  && (remPageHeight - spanHeight < 30)) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }

              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanHeight;
              tokenIndex++;
              continue;
            }

            const block2Col = document.createElement('div');
            block2Col.className = 'block-2col';
            block2Col.innerHTML = `
              <div class="margin-notes-column right-margin"></div>
              <div></div>
              <div class="main-column right-col"></div>
              <div></div>
              <div class="main-column left-col"></div>
              <div></div>
              <div class="margin-notes-column left-margin"></div>
            `;
            pageLayout.bodyFlow.appendChild(block2Col);

            const rCol = block2Col.querySelector('.right-col');
            const lCol = block2Col.querySelector('.left-col');
            const rMargin = block2Col.querySelector('.right-margin');
            const lMargin = block2Col.querySelector('.left-margin');
            const colWidth = rCol.offsetWidth || 272;
            let pageHasContent = false;

            ['right', 'left'].forEach((colName) => {
              let targetCol = colName === 'right' ? rCol : lCol;
              let targetMargin = colName === 'right' ? rMargin : lMargin;

              while (tokenIndex < secTokens.length || pendingWordTokens) {
                let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h')) {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                  hElem.setAttribute('data-token-id', currentTok.id);
				          hElem.id = `heading-tok-${currentTok.id}`;
                  if (currentTok.customStyleId) {
                    const inst = findExtTextStyle(currentTok.customStyleId);
                    if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                  } else {
                    hElem.textContent = currentTok.text;
                  }
                  applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                  targetCol.appendChild(hElem);

                  if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (document.getElementById('avoid-widows-select').value === 'yes'
                      && (tokenIndex + 1 < secTokens.length)
                      && (remPageHeight - targetCol.scrollHeight < 30)
                      && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p') {
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
                  let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                  let isContinuation = !!pendingWordTokens;
                  let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                  const pElem = document.createElement('p');
                  pElem.setAttribute('data-token-id', currentTok.id);
                  pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                  targetCol.appendChild(pElem);

                  if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  let bestFitLine = 0;
                  for (let i = 1; i <= lines.length; i++) {
                    let testText = lines.slice(0, i).join(' ');
                    pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                    pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                    
                    if (targetCol.scrollHeight <= remPageHeight) {
                      bestFitLine = i;
                    } else {
                      break;
                    }
                  }

                  if (bestFitLine === 0) {
                    targetCol.removeChild(pElem);
                    if (targetCol.children.length > 0) {
                      let lastEl = targetCol.lastElementChild;
                      while (lastEl && lastEl.className.startsWith('title-level-')) {
                        targetCol.removeChild(lastEl);
                        tokenIndex--;
                        lastEl = targetCol.lastElementChild;
                      }
                      break;
                    } else {
                      if (!pageHasContent) {
                          bestFitLine = 1;
                      } else {
                          break;
                      }
                    }
                  }

                  if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                    const remainingAfterSplit = lines.length - bestFitLine;
                    if (bestFitLine === 1 && pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    } else if (remainingAfterSplit === 1) {
                      if (bestFitLine > 1) {
                        bestFitLine -= 1;
                      } else if (pageHasContent) {
                        targetCol.removeChild(pElem);
                        break;
                      }
                    }
                  }

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                  applyDelimiterStyles(pElem, 'body', getBodySizePt());

                  if (!isContinuation && currentTok.sideNote) {
                    if (currentTok.noteTarget === 'footnote' || currentTok.noteTarget === 'endnote') {
                      const marker = createNoteMarkerAndQueue(currentTok.sideNote, currentTok.sideNoteStyleId, currentTok.noteTarget);
                      pElem.insertBefore(marker, pElem.firstChild);
                    } else {
                      pElem.setAttribute('data-side-note', currentTok.sideNote);
                      const noteElem = document.createElement('div');
                      noteElem.className = 'side-note-anchor';
                      noteElem.textContent = currentTok.sideNote;
                      if (currentTok.sideNoteStyleId) {
                        const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                        if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                      }
                      targetMargin.appendChild(noteElem);
                      pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                    }
                  }

                  if (isEndOfP) {
                    pendingWordTokens = null;
                    tokenIndex++;
                  } else {
                    pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                    break;
                  }
                }
              }
            });

            if (rCol.children.length === 0 && lCol.children.length === 0) {
                pageLayout.bodyFlow.removeChild(block2Col);
                let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                    pageLayout.bodyFlow.removeChild(lastFlowEl);
                    tokenIndex--;
                    lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                }
                break;
            }

            if (tokenIndex >= secTokens.length && !pendingWordTokens) {
              balanceColumns(block2Col, colWidth, styleObj);
              const divHTML = getSectionDividerHTML(secDivStyle);
              if (divHTML) {
                const divContainer = document.createElement('div');
                divContainer.innerHTML = divHTML;
                pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
              }
              break;
            } else {
              let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
              const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';
              if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                balanceColumns(block2Col, colWidth, styleObj);
              } else {
                let usedBlockH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
                let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
                if (finalDiff > 2 && finalDiff <= 60) {
                    justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
                } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                    justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
                }
              }
            }
            
            remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
            finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
          }
        }
      }

      if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
      if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
      else if (endnoteQueueForPart.length) { flushEndnotesForPart(container, pageIndex); }
      renderExtAnchor(container, 'afterAll', rawText);

      document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
        const targetId = span.getAttribute('data-target-id');
        if (targetId && headingPageMap[targetId]) {
          span.textContent = headingPageMap[targetId];
        }
      });
    }

    function buildStructuredTOC(tokenList, showLevels, groupLevels) {
      const entries = [];
      const minGroupLevel = groupLevels.length > 0 ? Math.min(...groupLevels) : 99;
      let currentGroupItems = [];

      function flushGroup() {
        if (currentGroupItems.length > 0) {
          entries.push({ isGroup: true, items: currentGroupItems.slice() });
          currentGroupItems = [];
        }
      }

      tokenList.forEach(t => {
        const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') ? t.text : t.sideNote;
        if (lvl === null || !txt) return;
        if (!showLevels.includes(lvl)) return;

        if (lvl >= minGroupLevel) {
          currentGroupItems.push({ id: t.id, level: lvl, text: txt });
        } else {
          flushGroup();
          entries.push({ id: t.id, level: lvl, text: txt, isGroup: false });
        }
      });

      flushGroup();
      return entries;
    }

    function renderPaginatedTOC(container, entries, titleText, bookTitle, h1Title, pageIndex, curH1, curH2, tocPrefix) {
      if (entries.length === 0) return 0;

      let pagesCount = 0;
      let currentEntryIdx = 0;
      let lastRenderedGrid = null;
      let lastRenderedPage = null;

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      
      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);

      function getTocStyle(level) {
        const f = document.getElementById(`f-${tocPrefix}-${level}`);
        const s = document.getElementById(`s-${tocPrefix}-${level}`);
        if(f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
        return '';
      }

      while (currentEntryIdx < entries.length) {
        const isFirstTOCPage = (pagesCount === 0);
        pagesCount++;

        const page = document.createElement('div');
        page.className = 'a4-page toc-page';
        applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
        lastRenderedPage = page;
        
        page.innerHTML = `
          <div class="page-content-wrapper">
            <div class="top-header-grid">
              <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
              <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
              <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
            </div>
            <div class="page-body-flow">
              ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
              <div class="toc-grid-full"></div>
            </div>
            <div class="page-number-footer">${toGematria(pageIndex + pagesCount - 1)}</div>
          </div>
        `;
        container.appendChild(page);

        const gridFull = page.querySelector('.toc-grid-full');
        lastRenderedGrid = gridFull;

        const bodyFlow = page.querySelector('.page-body-flow');
        const maxH = bodyFlow.clientHeight || 870;

        let pageStartIndex = currentEntryIdx;
        let lastSubjectIdx = currentEntryIdx; 

        while (currentEntryIdx < entries.length) {
          const it = entries[currentEntryIdx];
          
          if (!it.isGroup && (it.level === 1 || it.level === 2)) {
             lastSubjectIdx = currentEntryIdx;
          }

          let itemHTML = '';
          
          if (it.isGroup) {
            const inlineSpans = it.items.map(grp => 
              `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${grp.id}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${grp.text}</span> - <span class="grp-page" data-target-id="${grp.id}"></span></a></span>`
            ).join('<span class="grp-sep">|</span>');
            itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
          } else {
            itemHTML = `
              <div class="toc-entry-group" style="${getTocStyle(it.level)}">
                <a href="#heading-tok-${it.id}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
                  <span class="toc-title">${it.text}</span>
                  <span class="toc-dots"></span>
                  <span class="toc-page-num" data-target-id="${it.id}"></span>
                </a>
              </div>
            `;
          }

          gridFull.insertAdjacentHTML('beforeend', itemHTML);
          
          if (bodyFlow.scrollHeight > maxH) {
            gridFull.lastElementChild.remove();
            
            if (gridFull.children.length > 0) {
                if (lastSubjectIdx > pageStartIndex) {
                    const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                    for (let k = 0; k < itemsToRemove; k++) {
                        gridFull.lastElementChild.remove();
                    }
                    currentEntryIdx = lastSubjectIdx;
                }
                break;
            } else {
                gridFull.insertAdjacentHTML('beforeend', itemHTML);
                currentEntryIdx++;
                break;
            }
          }
          
          currentEntryIdx++;
        }
      }

      if (lastRenderedGrid) {
        lastRenderedGrid.style.justifyContent = 'flex-start';
      }
      if (lastRenderedPage) {
        applyContentBg(lastRenderedPage, 'tocLast');
      }

      return pagesCount;
    }

    const textarea = document.getElementById('raw-input');

    function syncCursorToPreview() {
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const currentLineIdx = textBefore.split('\n').length - 1;

      if (lineToTokenMap && lineToTokenMap[currentLineIdx] !== undefined) {
        let tokenId = lineToTokenMap[currentLineIdx];
        if (tokenId === null) {
          for (let k = currentLineIdx - 1; k >= 0; k--) {
            if (lineToTokenMap[k] !== null && lineToTokenMap[k] !== undefined) {
              tokenId = lineToTokenMap[k];
              break;
            }
          }
        }

        if (tokenId !== null && tokenId !== undefined) {
          const targetEl = document.querySelector(`[data-token-id="${tokenId}"]`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }

    textarea.addEventListener('click', syncCursorToPreview);
    textarea.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        syncCursorToPreview();
      }
    });

    function rehydrateExtImports() {
      const island = document.getElementById('ext-imports-data');
      if (!island || !island.textContent.trim()) return;
      let data;
      try { data = JSON.parse(island.textContent); } catch(e) { return; }
      (data.pageTypes || []).forEach(inst => {
        importedPageTypes.push(inst);
        buildExtPanel('pageType', inst.instanceId, inst.def.name, inst.def);
      });
      (data.textStyles || []).forEach(inst => {
        importedTextStyles.push(inst);
        buildExtPanel('textStyle', inst.instanceId, inst.def.name, inst.def);
      });
      (data.imagePages || []).forEach(inst => {
        importedImagePages.push(inst);
        buildExtPanel('imagePage', inst.instanceId, 'תמונה: ' + inst.name, null);
      });
      if (data.customThemes && Array.isArray(data.customThemes)) {
        customThemes = data.customThemes;
        refreshCustomThemesUI();
      }
      let maxCounter = 0;
      let maxSynth = 7;
      [...importedPageTypes, ...importedTextStyles, ...importedImagePages].forEach(inst => {
        const n = parseInt((inst.instanceId.match(/-(\d+)$/) || [0,0])[1], 10);
        if (n >= maxCounter) maxCounter = n + 1;
        if (typeof inst.syntheticLevel === 'number' && inst.syntheticLevel > maxSynth) maxSynth = inst.syntheticLevel;
      });
      extImportCounter = maxCounter;
      nextSyntheticLevel = maxSynth + 1;
    }

    window.onload = function() {
      refreshCustomThemesUI();
      rehydrateExtImports();
      
      if (document.getElementById('section-divider-style').value === 'custom_img') {
        document.getElementById('row-sec-div-img').style.display = 'flex';
      }
      if (document.getElementById('hdr-c-type').value === 'custom_img') {
        document.getElementById('row-hdr-c-img').style.display = 'flex';
      }

      textarea.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - סימן א - דיני תפילת השחר וזמנה
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום ((כאן הערת שוליים בתוך הטקסט הנלמדת מדברי הראשונים)).
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית [[כאן הערת סיום מורחבת המרוכזת בסוף החלק]].

כותרת 3 - ענף א: שיטת הרמב"ם בדין אונס ועבר זמן תפילה
גוף הטקסט בטורים המיושרים באופן מושלם. פסקאות אלו מדגימות את מנגנון האיזון המדויק המופעל בכל חיתוך.
כאשר טור אחד ימני מתמלא הוא מעביר שורות שלמות בלבד אל הטור השמאלי כדי שלא תיווצר מילה בודדת קטועה.
העימוד התורני מקפיד מאוד על שלמות הפסקאות והשורות כך שהקריאה תהיה רציפה ונעימה לעין הלומד.

כותרת 4 - סעיף א: בירור דעת בעל השאילתות
גוף הטקסט הבא תחת סעיף א מיועד לבאר את דברי הראשונים. כל פסקה מקבלת חלון מילה ראשונה רק אם היא מחזיקה שתי שורות ומעלה. פסקאות קצרות של שורה אחת אינן מקבלות חלון מילה ראשונה כדי למנוע שיבושים בעימוד הפסקאות הבאות אחריהן.
פיסקה קצרה.

כותרת 5 - סעיף ב: יישוב קושיית הנודע ביהודה
גוף הטקסט ממשיך לזרום בטורים שווים.

כותרת 7 - הערה נחוצה בדבר קריאת שמע של שחרית
גוף הטקסט המכיל הערות שוליים בצד הדף. ההערות ממוקמות בדיוק מול הפסקה אליה הן מתייחסות, ובכך מאפשרות ללומד לעיין במקורות תוך כדי לימודו הרציף בגוף הספר.`;
      typesetDocument();
    };
  </script>
</body></html>
```

---

## פנייה 5: יש בעיה קטנה, הרקע מקובץ הSVG לא נמתח על על הדך ויש רווחים למעלה ולמטה. תוכל…

יש בעיה קטנה, הרקע מקובץ הSVG לא נמתח על על הדך ויש רווחים למעלה ולמטה.
תוכל לתת הדרכה קצרה איך לתקן את זה?
לא צריך להחזיר את כל הקוד מחדש

---

### 🤖 תגובה 17: Investigating SVG Behavior Okay, I'm digging into why this SVG isn't stretching…

**Investigating SVG Behavior**

Okay, I'm digging into why this SVG isn't stretching properly. It looks like the default behavior of SVG backgrounds needs a deeper look. I'm focusing on how the SVG handles the viewport and the page's dimensions to fix these gaps.


**Analyzing Aspect Ratio Control**

I've discovered that embedding the SVG within an `<img>` tag enforces aspect ratio preservation via `preserveAspectRatio="xMidYMid meet"`. The page's padding and margins, especially `.a4-page` with its `padding: 15mm`, influence the SVG's behavior, potentially overriding `object-fit: fill`. The `.custom-bg-img` class, utilizing `position: absolute`, `object-fit: fill`, and `width/height: 100%`, is essential for handling background SVGs, but the intrinsic aspect ratio still has to be dealt with.


**Refining SVG Rendering**

I'm now zeroing in on browser aspect ratio defaults within `<img>` tags and how SVG handles it. I've realized that the `preserveAspectRatio` attribute is crucial; setting it to "none" allows complete stretching if CSS overrides aren't applied. Alternatively, I can use CSS `background-image` properties for full control. Data URLs change the game too. I am going to see how I can use JavaScript to modify the SVGs.

---

### 🤖 תגובה 18: הסיבה לרווחים היא שדפדפנים שומרים כברירת מחדל על יחס הפרופורציות המקורי של קובץ…

הסיבה לרווחים היא שדפדפנים שומרים כברירת מחדל על יחס הפרופורציות המקורי של קובץ ה-SVG (תכונת `preserveAspectRatio`), ולכן כשהפרופורציה המקורית לא זהה ב-100% ל-A4, הדפדפן מוסיף רווחים למעלה ולמטה.

כדי לתקן זאת ולמתוח את ה-SVG על כל הדף מקצה לקצה, נדרשים שני שינויים קטנים וממוקדים:

---

### 1. עדכון הגדרת ה-CSS של `.custom-bg-img`
בחלק ה-`<style>` שבראש הקובץ, מצא את המחלקה `.custom-bg-img` והחלף אותה בקוד הבא:

```css
.custom-bg-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  z-index: 5;
  pointer-events: none;
}
```

---

### 2. טיפול ב-SVG בעת העלאת הקובץ (ב-JavaScript)
כדי לבטל את יחס הגובה-רוחב הפנימי של ה-SVG בעת הטעינה, עדכן את הפונקציה `handleImageUpload` (בתוך תגית ה-`<script>`) כך שתכניס `preserveAspectRatio="none"` לקובצי SVG:

```javascript
function handleImageUpload(event, targetInputId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  // אם מדובר בקובץ SVG – נסיר את נעילת הפרופורציות
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    reader.onload = function(e) {
      let svgText = e.target.result;
      
      // הוספה או דריסה של preserveAspectRatio="none" בתגית ה-svg
      if (svgText.includes('preserveAspectRatio')) {
        svgText = svgText.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
      } else {
        svgText = svgText.replace(/<svg\b/, '<svg preserveAspectRatio="none"');
      }
      
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = dataUrl;
        targetInput.setAttribute('value', dataUrl);
        typesetDocument();
      }
    };
    reader.readAsText(file);
  } else {
    // תמונה רגילה (PNG/JPG)
    reader.onload = function(e) {
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = e.target.result;
        targetInput.setAttribute('value', e.target.result);
        typesetDocument();
      }
    };
    reader.readAsDataURL(file);
  }
}
```

שני השינויים הללו יגרמו לכל SVG שייטען להימתח בדיוק ובאופן מלא לכל ארבעת קצוות דף ה-A4.

---

## פנייה 6: מעולה! אבל יש בעיה.... החלק העליון של הערות השוליים עולה על תחתית הטקסט, והחלק…

מעולה! אבל יש בעיה.... החלק העליון של הערות השוליים עולה על תחתית הטקסט, והחלק התחתון פולש לאזור מספר העמוד

---

### 🤖 תגובה 19: Analyzing Footnote Layout I'm currently focused on the issues within Torani…

**Analyzing Footnote Layout**

I'm currently focused on the issues within Torani A4's footnote layout. The problem stems from the footnotes area, specifically `.footnote-area` or side margin notes (`.side-note-anchor` / `.footnote-area`). I'm trying to identify the root cause of the layout inconsistencies. My goal is a more reliable and predictable method of handling footnotes within the Torani A4 framework.


**Investigating Footnote Overlap**

I've identified a vertical overlap issue: the footnotes are encroaching on both the main text and the page number footer. My focus is now on the code. I'm examining how footnotes are positioned within the CSS, specifically `.footnote-area`, and comparing it to the positioning of `.page-number-footer` to understand the conflict. I'm also considering the `.a4-page` dimensions to ensure proper layout boundaries.


**Pinpointing Footnote Placement**

I'm now diving deeper into the JavaScript code, specifically the `flushFootnotesInto(pageEl)` function. My aim is to understand the exact location where the footnotes are injected onto the page. I'm focusing on the interplay of `buildNoteRuleElement`, `buildNoteBlockElement`, and the creation of the footnote area `area` using `document.createElement('div')` to see how the elements are assembled. I need to know where the footnotes are being sent relative to the a4-page.


**Clarifying Footnote Stacking**

I've made a crucial discovery regarding footnote placement! The JavaScript code appends the `.footnote-area` directly as a child to the `.a4-page` element, using `bottom: 15mm`. But, the `.page-number-footer` is also positioned at `bottom: 15mm` relative to the page. This means the footnotes are literally overlapping the footer! Further, the body text calculation doesn't account for the footnotes at all, which results in the text overflowing into the space reserved for footnotes.


**Refining Footnote Placement**

I've pinpointed the root causes, revealing the absolute positioning of the `.footnote-area` directly conflicts with both body text and the footer. Ideally, the footnote area should be part of the flow *above* the footer, placed between the main text and the page number. Furthermore, current calculations of available page height (`remPageHeight`) don't account for the footnotes at all during typesetting. This is where I plan to focus next.


**Implementing Footnote Positioning**

I'm now formulating a precise, user-friendly fix. I've broken it down into two parts, starting with CSS adjustments. I'm changing `.footnote-area` from absolute to relative positioning within `.page-content-wrapper`, to have it sit above the footer. Alternatively, I am considering absolute positioning, but calculating `bottom` to place it above the footer. This ensures footnotes respect the page boundaries and don't overlap.


**Adjusting Footnote Structure**

I'm now changing the JavaScript to make the footnote area part of the page content flow. I'm focusing on `flushFootnotesInto(pageEl)` function. I'll modify the `appendChild()` to insert the footnote area within the `.page-content-wrapper` element, before the `.page-number-footer`. This approach ensures the footnote area respects the page footer and margins seamlessly.


**Calculating Page Height**

I'm now focusing on dynamically adjusting the available body height (`remPageHeight`) to account for footnote height. I'm modifying the JavaScript, specifically when footnotes are added during paragraph processing. I'll subtract the measured footnote height (obtained via `measureNoteBlockHeight`) from `remPageHeight` to ensure accurate text layout on each page. This means accounting for footnote rules and margins as part of the page space calculation.

---

### 🤖 תגובה 20: הסיבה לכך כפולה: 1. מיקום קבוע: תיבת ההערות הוגדרה במיקום קבוע בתחתית הדף…

הסיבה לכך כפולה:
1. **מיקום קבוע:** תיבת ההערות הוגדרה במיקום קבוע בתחתית הדף (`bottom: 15mm`), בדיוק במקום שבו יושב מספר העמוד.
2. **חישוב גובה הדף:** גוף הטקסט מילא את כל גובה העמוד בלי לדעת כמה מקום תופסות ההערות שהצטברו באותו דף.

הנה 3 עדכונים ממוקדים שפותרים את שתי הבעיות לחלוטין:

---

### 1. עדכון ה-CSS של `.footnote-area`
בחלק ה-`<style>`, מצא את `.footnote-area` והחלף אותו כך שישב בתוך זרימת הדף ומעל מספר העמוד:

```css
.footnote-area {
  position: relative;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 4px;
  flex-shrink: 0;
  z-index: 25;
}
```

---

### 2. עדכון הפונקציה `flushFootnotesInto`
ב-JavaScript, החלף את הפונקציה `flushFootnotesInto` בקוד הבא (כך שההערות יישתלו **מעל** מספר העמוד ולא יידרסו עליו):

```javascript
function flushFootnotesInto(pageEl) {
  if (!footnoteQueueForPage.length) { resetNoteCounterIfNeeded('footnote', 'page'); return; }
  const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
  const rule = buildNoteRuleElement();
  const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
  const area = document.createElement('div');
  area.className = 'footnote-area';
  area.appendChild(rule);
  area.appendChild(block);

  const wrapper = pageEl.querySelector('.page-content-wrapper');
  const footer = pageEl.querySelector('.page-number-footer');
  if (wrapper && footer) {
    wrapper.insertBefore(area, footer);
  } else {
    pageEl.appendChild(area);
  }

  footnoteQueueForPage = [];
  resetNoteCounterIfNeeded('footnote', 'page');
}
```

---

### 3. ניכוי גובה ההערות מגובה הטורים (בתוך `typesetDocument`)
כדי שהטקסט בטורים יעצור בזמן ולא יגלוש אל תוך ההערות:

בלולאת מילוי העמודים ב-`typesetDocument`, מצא את תנאי בדיקת הגובה של הטור:
```javascript
if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0)
```
וכן בתנאי ה-`bestFitLine`:
```javascript
if (targetCol.scrollHeight <= remPageHeight)
```

הוסף שורת חישוב מקום פנוי שמתחשבת בהערות שהצטברו בעמוד הנוכחי. שים בראש לולאת העמוד (לפני מילוי הטורים) את החישוב הבא:

```javascript
// מדידת הגובה שהערות השוליים של העמוד הנוכחי יתפסו וניכויו מהגובה הפנוי לטורים
let notesHeight = 0;
if (footnoteQueueForPage.length > 0) {
  const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
  notesHeight = measureNoteBlockHeight(footnoteQueueForPage, cfg0.columns || 1) + 20; // 20px עבור קו מפריד ורווח
}
remPageHeight -= notesHeight;
```

---

**התוצאה:** הטורים יעצרו בדיוק לפני ההערות, וההערות יישבו בצורה מסודרת ומרווחת מעל מספר העמוד.

---

## פנייה 7: תוכל להחזיר פונקציות שלמות להחלפה

תוכל להחזיר פונקציות שלמות להחלפה

---

### 🤖 תגובה 21: Clarifying User Intent I'm now zeroing in on precisely what the user needs.…

**Clarifying User Intent**

I'm now zeroing in on precisely what the user needs. It's about delivering full, ready-to-use function blocks and the corresponding CSS, so that they can be directly copied and pasted without any guesswork. This is different than providing snippets or step-by-step instructions.


**Refining Function Implementation**

I'm now integrating footnote height deduction within `typesetDocument()`. I'm focusing on the `footnoteQueueForPage` accumulation and how `remPageHeight` is initialized and checked on each page iteration. My goal is to make the height deduction seamless within the column filling and pagination loop. I have verified that footnotes are correctly accumulated and now I am analyzing the available height to ensure the footnote will fit.


**Calculating Available Height**

I've integrated a helper function, `getFootnotesReservedHeight()`, that dynamically calculates the height needed for footnotes on the current page. I'm now implementing the calculation of available vertical space as `const currentAvailH = remPageHeight - getFootnotesReservedHeight();` for accurate column fitting. This variable is used to determine how much space remains for body text, ensuring footnotes don't cause overflow. I'm also updating the inner loops to use `currentAvailH` for more precise fit determination.

---

### 🤖 תגובה 22: הנה הפונקציות השלמות והמעודכנות, יחד עם קטע ה-CSS, מוכנות להחלפה ישירה…

הנה הפונקציות השלמות והמעודכנות, יחד עם קטע ה-CSS, מוכנות להחלפה ישירה ("העתק-הדבק") בקוד שלך:

---

### 1. קטע ה-CSS להחלפה (בתוך תגית `<style>` בראש הדף)

החלף את ההגדרה של `.footnote-area` בקוד הבא:

```css
  /* אזור הערות השוליים - יושב בזרימה הטבעית מעל מספר העמוד */
  .footnote-area {
    position: relative;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 4px;
    flex-shrink: 0;
    z-index: 25;
  }
```

---

### 2. הפונקציה `flushFootnotesInto` (בתוך תגית `<script>`)

החלף את הפונקציה הקיימת בקוד הבא (ההערות מוכנסות כעת בתוך ה-wrapper ישירות מעל ה-footer):

```javascript
    // מדפיסה בפועל את הערות השוליים מעל מספר העמוד ומאפסת את התור
    function flushFootnotesInto(pageEl) {
      if (!footnoteQueueForPage.length) { 
        resetNoteCounterIfNeeded('footnote', 'page'); 
        return; 
      }
      const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
      const rule = buildNoteRuleElement();
      const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
      const area = document.createElement('div');
      area.className = 'footnote-area';
      area.appendChild(rule);
      area.appendChild(block);

      const wrapper = pageEl.querySelector('.page-content-wrapper');
      const footer = pageEl.querySelector('.page-number-footer');
      if (wrapper && footer) {
        wrapper.insertBefore(area, footer);
      } else {
        pageEl.appendChild(area);
      }

      footnoteQueueForPage = [];
      resetNoteCounterIfNeeded('footnote', 'page');
    }
```

---

### 3. הפונקציה `typesetDocument` (בתוך תגית `<script>`)

החלף את כל הפונקציה `typesetDocument` בקוד המלא הבא (הפונקציה כוללת כעת חישוב דינמי שמנכה את גובה ההערות שהצטברו בעמוד מהגובה המותר לטורי הטקסט):

```javascript
    // מנוע העימוד המרכזי
    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      const fnLinePrefix = document.getElementById('fn-line-prefix')?.value?.trim() || 'כותרת 7 -';
      const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      let pendingSideNoteStyleId = null;
      let pendingNoteTarget = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת סיום
        if (enLinePrefix && line.startsWith(enLinePrefix)) {
          pendingSideNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'endnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת שוליים
        if (fnLinePrefix && line.startsWith(fnLinePrefix)) {
          pendingSideNote = line.slice(fnLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'footnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת כותרות מובנות (0-7)
        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            pendingSideNote = txt;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = 'footnote';
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          // בדיקת קידומות מתוספים מיובאים
          let customMatch = null;
          for (const inst of importedTextStyles) {
            const trig = inst.def && inst.def.trigger;
            if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
              customMatch = { inst, text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim() };
              break;
            }
          }
          if (customMatch) {
            if (customMatch.inst.def.target === 'footnote' || customMatch.inst.def.target === 'endnote') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = customMatch.inst.def.target;
              lineToTokenMap[lineIdx] = null;
            } else if (customMatch.inst.def.layoutMode === 'side_note') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = null;
              lineToTokenMap[lineIdx] = null;
            } else {
              const lvl = customMatch.inst.syntheticLevel;
              const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: customMatch.text, lineIdx: lineIdx, customStyleId: customMatch.inst.instanceId };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
            }
          } else {
            const tokenObj = { id: tokens.length, type: 'p', text: line, sideNote: pendingSideNote, sideNoteStyleId: pendingSideNoteStyleId, noteTarget: pendingNoteTarget, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
            pendingSideNote = null;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = null;
          }
        }
      }

      const headingModes = {
        0: document.getElementById('mode-h0').value,
        1: document.getElementById('mode-h1').value,
        2: document.getElementById('mode-h2').value,
        3: document.getElementById('mode-h3').value,
        4: document.getElementById('mode-h4').value,
        5: document.getElementById('mode-h5').value,
        6: document.getElementById('mode-h6').value,
        7: document.getElementById('mode-h7').value
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
      });

      const oddPageRequired = {
        0: document.getElementById('odd-h0').checked,
        1: document.getElementById('odd-h1').checked,
        2: document.getElementById('odd-h2').checked
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
      });

      function ensureOddPageStart(level) {
        if (!oddPageRequired[level]) return;
        if (pageIndex % 2 === 0) {
          const blank = document.createElement('div');
          blank.className = 'a4-page blank-page';
          container.appendChild(blank);
          pageIndex++;
        }
      }

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
        if (mode === 'sub_shaar') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          sections.push({ type: 'sub_shaar', token: t, tokens: [] });
          currentSection = { type: 'body', tokens: [] };
        } else if (mode === 'new_page_1col') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          currentSection = { type: 'body', isNewPage: true, hToken: t, tokens: [] };
        } else {
          currentSection.tokens.push(t);
        }
      });
      if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
        sections.push(currentSection);
      }

      const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
      const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
          gtocShows.push(inst.syntheticLevel);
          if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
        }
      });

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const showBackShaar = document.getElementById('show-back-shaar').checked;
      const activeThemeId = document.getElementById('active-theme-select').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // רינדור שער ראשי
      if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId);
        renderExtAnchor(container, 'afterMainShaar', rawText);
      } else {
        renderExtAnchor(container, 'beforeAll', rawText);
      }

      // רינדור שער אחורי (גב השער)
      if (showBackShaar) {
        renderBackShaar(container, activeThemeId);
      }

      // רינדור תוכן עניינים כללי
      if (enableGeneralTOC) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(
          container, 
          generalTocEntries, 
          "תוכן העניינים הכללי", 
          bookTitle, 
          "תוכן העניינים הכללי", 
          pageIndex,
          "תוכן העניינים הכללי", "תוכן העניינים הכללי",
          "gtoc"
        );
        pageIndex += pagesRendered;
      }
      renderExtAnchor(container, 'afterGeneralToc', rawText);

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      // פונקציית עזר: חישוב גובה הערות השוליים שהצטברו לעמוד הנוכחי
      function getFootnotesReservedHeight() {
        if (!footnoteQueueForPage.length) return 0;
        const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
        return measureNoteBlockHeight(footnoteQueueForPage, cfg0.columns || 1) + 24; // 24px עבור קו מפריד וריווח
      }

      let hasOpenPart = false;
      let prevPageEl = null;

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
          if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
          renderExtAnchor(container, 'beforeEachPart', rawText);
          hasOpenPart = true;
          ensureOddPageStart(sec.token.level);
          renderSubShaar(container, sec.token, activeThemeId);
          if (sec.token.customStyleId) {
            const inst = findExtTextStyle(sec.token.customStyleId);
            const justRendered = container.lastElementChild;
            if (inst && justRendered) {
              const tEl = justRendered.querySelector('.book-title-main');
              const sEl = justRendered.querySelector('.book-subtitle');
              if (tEl) applyExtStyleToNode(tEl, inst.def.style, 36);
              if (sEl) applyExtStyleToNode(sEl, inst.def.style, 21);
            }
          }
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
            importedTextStyles.forEach(inst => {
              if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                dtocShows.push(inst.syntheticLevel);
                if (inst.def.toc.grouping) dtocGroups.push(inst.syntheticLevel);
              }
            });
            const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
            const dtocPages = renderPaginatedTOC(
              container, 
              detailedTocEntries, 
              "מפתח ולוח עניינים מפורט", 
              currentH1Title, 
              "תוכן העניינים המפורט", 
              pageIndex,
              currentH1Title, "תוכן העניינים המפורט",
              "dtoc"
            );
            pageIndex += dtocPages;
          }
          renderExtAnchor(container, 'afterEachPart', rawText);
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.level === 0;

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;
        const sectionFillRatio = (document.getElementById('balance-chapter-end').value === 'yes')
          ? estimateSectionFillRatio(secTokens) : 1;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
          if (prevPageEl) flushFootnotesInto(prevPageEl);
          if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);
          const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
          let pageLayout = createPageLayout(
            container, 
            isFirstPage ? h2Text : '', 
            isFirstPage ? h2Id : undefined, 
            pageIndex, 
            currentH1Title, 
            currentH2Title,
            currentH3Title,
            bookTitle,
            customR, customC, customL,
            pageRole
          );
          pageIndex++;
          prevPageEl = pageLayout.page;
		  
          let remPageHeight = pageLayout.bodyFlow.clientHeight * sectionFillRatio;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
             if (title && sec.hToken.customStyleId) {
                const inst = findExtTextStyle(sec.hToken.customStyleId);
                if (inst) renderCustomHeadingInto(title, inst, h2Text);
             }
             let used = 0;
             if (spacer) used += spacer.getBoundingClientRect().height;
             if (title) {
                 used += title.getBoundingClientRect().height;
                 const titleStyle = window.getComputedStyle(title);
                 used += parseFloat(titleStyle.marginTop) + parseFloat(titleStyle.marginBottom);
             }
             remPageHeight -= used;
          }
          isFirstPage = false;

          if (isH0) {
            const singleBlock = document.createElement('div');
            singleBlock.className = 'block-single-col';
            singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
            pageLayout.bodyFlow.appendChild(singleBlock);
            const targetCol = singleBlock.querySelector('.single-wide-col');
            let pageHasContent = false;

            while (tokenIndex < secTokens.length || pendingWordTokens) {
              const currentAvailH = remPageHeight - getFootnotesReservedHeight();
              if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                break;
              }

              let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

              if (currentTok.type.startsWith('h')) {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                hElem.setAttribute('data-token-id', currentTok.id);
                if (currentTok.customStyleId) {
                  const inst = findExtTextStyle(currentTok.customStyleId);
                  if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                } else {
                  hElem.textContent = currentTok.text;
                }
                applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }

                if (document.getElementById('avoid-widows-select').value === 'yes'
                    && (tokenIndex + 1 < secTokens.length)
                    && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                    && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p') {
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                  pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                  
                  const availH = remPageHeight - getFootnotesReservedHeight();
                  if (targetCol.scrollHeight <= availH) {
                    bestFitLine = i;
                  } else {
                    break;
                  }
                }

                if (bestFitLine === 0) {
                  targetCol.removeChild(pElem);
                  if (targetCol.children.length > 0) {
                    let lastEl = targetCol.lastElementChild;
                    while (lastEl && lastEl.className.startsWith('title-level-')) {
                      targetCol.removeChild(lastEl);
                      tokenIndex--;
                      lastEl = targetCol.lastElementChild;
                    }
                    break;
                  } else {
                    if (!pageHasContent) {
                        bestFitLine = 1;
                    } else {
                        break;
                    }
                  }
                }

                if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                  const remainingAfterSplit = lines.length - bestFitLine;
                  if (bestFitLine === 1 && pageHasContent) {
                    targetCol.removeChild(pElem);
                    break;
                  } else if (remainingAfterSplit === 1) {
                    if (bestFitLine > 1) {
                      bestFitLine -= 1;
                    } else if (pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    }
                  }
                }

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                applyDelimiterStyles(pElem, 'body', getBodySizePt());

                if (isEndOfP) {
                  pendingWordTokens = null;
                  tokenIndex++;
                } else {
                  pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                  break;
                }
              }
            }
            continue;
          }

          let pagePendingNotes = [];

          while ((tokenIndex < secTokens.length || pendingWordTokens) && (remPageHeight - getFootnotesReservedHeight()) > 45) {
            let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
            const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              const currentAvailH = remPageHeight - getFootnotesReservedHeight();
              if (currentAvailH < 60) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              const spanTitle = document.createElement('div');
              spanTitle.className = 'h3-title-text';
              spanTitle.setAttribute('data-token-id', peekTok.id);
              spanTitle.id = `heading-tok-${peekTok.id}`;
              if (peekTok.customStyleId) {
                const inst = findExtTextStyle(peekTok.customStyleId);
                if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text); else spanTitle.textContent = peekTok.text;
              } else {
                spanTitle.textContent = peekTok.text;
              }
              applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId));
              spanBlock.appendChild(spanTitle);
              pageLayout.bodyFlow.appendChild(spanBlock);

              const spanHeight = spanBlock.getBoundingClientRect().height + 4;
              if (spanHeight > (remPageHeight - getFootnotesReservedHeight())) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }
              if (document.getElementById('avoid-widows-select').value === 'yes'
                  && (tokenIndex + 1 < secTokens.length)
                  && ((remPageHeight - getFootnotesReservedHeight()) - spanHeight < 30)) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }

              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanHeight;
              tokenIndex++;
              continue;
            }

            const block2Col = document.createElement('div');
            block2Col.className = 'block-2col';
            block2Col.innerHTML = `
              <div class="margin-notes-column right-margin"></div>
              <div></div>
              <div class="main-column right-col"></div>
              <div></div>
              <div class="main-column left-col"></div>
              <div></div>
              <div class="margin-notes-column left-margin"></div>
            `;
            pageLayout.bodyFlow.appendChild(block2Col);

            const rCol = block2Col.querySelector('.right-col');
            const lCol = block2Col.querySelector('.left-col');
            const rMargin = block2Col.querySelector('.right-margin');
            const lMargin = block2Col.querySelector('.left-margin');
            const colWidth = rCol.offsetWidth || 272;
            let pageHasContent = false;

            ['right', 'left'].forEach((colName) => {
              let targetCol = colName === 'right' ? rCol : lCol;
              let targetMargin = colName === 'right' ? rMargin : lMargin;

              while (tokenIndex < secTokens.length || pendingWordTokens) {
                let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                const currentAvailH = remPageHeight - getFootnotesReservedHeight();
                if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h')) {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                  hElem.setAttribute('data-token-id', currentTok.id);
				          hElem.id = `heading-tok-${currentTok.id}`;
                  if (currentTok.customStyleId) {
                    const inst = findExtTextStyle(currentTok.customStyleId);
                    if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                  } else {
                    hElem.textContent = currentTok.text;
                  }
                  applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                  targetCol.appendChild(hElem);

                  if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (document.getElementById('avoid-widows-select').value === 'yes'
                      && (tokenIndex + 1 < secTokens.length)
                      && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                      && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p') {
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
                  let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                  let isContinuation = !!pendingWordTokens;
                  let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                  const pElem = document.createElement('p');
                  pElem.setAttribute('data-token-id', currentTok.id);
                  pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                  targetCol.appendChild(pElem);

                  if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  let bestFitLine = 0;
                  for (let i = 1; i <= lines.length; i++) {
                    let testText = lines.slice(0, i).join(' ');
                    pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                    pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                    
                    const availH = remPageHeight - getFootnotesReservedHeight();
                    if (targetCol.scrollHeight <= availH) {
                      bestFitLine = i;
                    } else {
                      break;
                    }
                  }

                  if (bestFitLine === 0) {
                    targetCol.removeChild(pElem);
                    if (targetCol.children.length > 0) {
                      let lastEl = targetCol.lastElementChild;
                      while (lastEl && lastEl.className.startsWith('title-level-')) {
                        targetCol.removeChild(lastEl);
                        tokenIndex--;
                        lastEl = targetCol.lastElementChild;
                      }
                      break;
                    } else {
                      if (!pageHasContent) {
                          bestFitLine = 1;
                      } else {
                          break;
                      }
                    }
                  }

                  if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                    const remainingAfterSplit = lines.length - bestFitLine;
                    if (bestFitLine === 1 && pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    } else if (remainingAfterSplit === 1) {
                      if (bestFitLine > 1) {
                        bestFitLine -= 1;
                      } else if (pageHasContent) {
                        targetCol.removeChild(pElem);
                        break;
                      }
                    }
                  }

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                  applyDelimiterStyles(pElem, 'body', getBodySizePt());

                  if (!isContinuation && currentTok.sideNote) {
                    if (currentTok.noteTarget === 'footnote' || currentTok.noteTarget === 'endnote') {
                      const marker = createNoteMarkerAndQueue(currentTok.sideNote, currentTok.sideNoteStyleId, currentTok.noteTarget);
                      pElem.insertBefore(marker, pElem.firstChild);
                    } else {
                      pElem.setAttribute('data-side-note', currentTok.sideNote);
                      const noteElem = document.createElement('div');
                      noteElem.className = 'side-note-anchor';
                      noteElem.textContent = currentTok.sideNote;
                      if (currentTok.sideNoteStyleId) {
                        const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                        if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                      }
                      targetMargin.appendChild(noteElem);
                      pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                    }
                  }

                  if (isEndOfP) {
                    pendingWordTokens = null;
                    tokenIndex++;
                  } else {
                    pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                    break;
                  }
                }
              }
            });

            if (rCol.children.length === 0 && lCol.children.length === 0) {
                pageLayout.bodyFlow.removeChild(block2Col);
                let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                    pageLayout.bodyFlow.removeChild(lastFlowEl);
                    tokenIndex--;
                    lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                }
                break;
            }

            if (tokenIndex >= secTokens.length && !pendingWordTokens) {
              balanceColumns(block2Col, colWidth, styleObj);
              const divHTML = getSectionDividerHTML(secDivStyle);
              if (divHTML) {
                const divContainer = document.createElement('div');
                divContainer.innerHTML = divHTML;
                pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
              }
              break;
            } else {
              let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
              const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';
              if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                balanceColumns(block2Col, colWidth, styleObj);
              } else {
                let usedBlockH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
                let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
                if (finalDiff > 2 && finalDiff <= 60) {
                    justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
                } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                    justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
                }
              }
            }
            
            remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
            finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
          }
        }
      }

      if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
      if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
      else if (endnoteQueueForPart.length) { flushEndnotesForPart(container, pageIndex); }
      renderExtAnchor(container, 'afterAll', rawText);

      document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
        const targetId = span.getAttribute('data-target-id');
        if (targetId && headingPageMap[targetId]) {
          span.textContent = headingPageMap[targetId];
        }
      });
    }
```

---

## פנייה 8: תוכל להחזיר את קוד כל הקובץ מתוקן

תוכל להחזיר את קוד כל הקובץ מתוקן

---

### 🤖 תגובה 23: Integrating HTML Updates I'm focusing now on returning the fully integrated…

**Integrating HTML Updates**

I'm focusing now on returning the fully integrated HTML. It needs to reflect the discussion on note controls, including markers, prefixes, and delimiters for footnotes and endnotes. The Theme System implementation for Main, Back, and is also nearing completion and will be incorporated. The goal is a completely updated HTML output.

---

### 🤖 תגובה 24: Constructing HTML File Okay, I'm now meticulously assembling the HTML file.…

**Constructing HTML File**

Okay, I'm now meticulously assembling the HTML file. I've begun by carefully entering the root elements and structure of the document. I have just finished the head element, and have started to meticulously enter the necessary meta tags and the title tag.


**Defining Page Layouts**

I've just finalized the `<style>` section, which included font imports, root variables, and specific styles for the sidebar, preview pane, and A4 page structure. Notably, I established styles for Shaar pages and a `.custom-bg-img` class for full-stretch background images. I've also defined the theme-bounded content and footnote area styles, as well as a preliminary set of print styles. Now, I'm integrating these styles within the document's structure, focusing on the sidebar's content and design.


**Developing UI Controls**

I'm now deep in designing the user interface. I've broken it down into panels for creating custom themes using SVG inputs and controls for managing book details and various settings. Panels include detailed inputs for theme name, Shaar SVG customization, and a button to add new themes. I'm also planning import options for extensions and settings for footnotes and endnotes, including markers and delimiters. I'm also planning the auto-pagination.


**Organizing Control Panels**

I'm now methodically structuring the control panels. I'm focusing on panels for heading typography, table of contents (both general and detailed), and overall grid and typography. I've also added a bottom button bar for saving the template, re-typesetting, and printing. I'm defining the resizer, preview pane, measuring box, and book container elements within the HTML structure.

Furthermore, I'm integrating the JavaScript, including the sidebar resizer logic and functions for content background, theme management (with functions for adding, deleting, and refreshing custom themes), and extension handling (import validation, page rendering, text style application). I'm also implementing text styling helpers for headings and notes with delimiter styles.

---

### 🤖 תגובה 25: הנה הקוד המלא, המתוקן והשלם של כל הקובץ, כולל כל התוספות, התיקונים, תמיכת ה-SVG…

הנה הקוד המלא, המתוקן והשלם של כל הקובץ, כולל כל התוספות, התיקונים, תמיכת ה-SVG המלאה וההסברים בעברית:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מערכת עימוד תורנית מקצועית לדפי A4</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

  /* ============================================================
     משתני CSS גלובליים: גדלי גופנים, רשת העמוד, צבעים.
     ============================================================ */
  :root {
    --fn-header-r: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-r: 13pt;
    --fn-header-c: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-c: 11pt;
    --fn-header-l: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-l: 13pt;

    --fn-h0: 'David Libre', 'David', serif;
    --sz-h0: 18pt;
    --fn-h0-body: 'Frank Ruhl Libre', serif;
    --sz-h0-body: 11.5pt;

    --fn-h1: 'Lia Sgula', 'Bellefair', serif;
    --sz-h1: 50pt;
    --fn-h1-sub: 'David Libre', 'David', serif;
    --sz-h1-sub: 28pt;

    --fn-h2: 'AAd_AlphaBlack', 'David Libre', 'David', serif;
    --sz-h2: 17pt;
    --fn-h3: 'AAd_AlphaLight', 'Noto Serif Hebrew', serif;
    --sz-h3: 13.5pt;
    --fn-h4: 'FrankRuehl', 'Frank Ruhl Libre', serif;
    --sz-h4: 12.5pt;
    --fn-h5: 'David Libre', 'David', serif;
    --sz-h5: 11.5pt;
    --fn-h6: 'Noto Serif Hebrew', serif;
    --sz-h6: 10.5pt;
    --fn-h7: 'Hadassah Friedlaender', 'Hadassah', 'Noto Serif Hebrew', serif;
    --sz-h7: 6pt;

    --fn-sh-title: 'Bellefair', serif;
    --sz-sh-title: 46pt;
    --fn-sh-sub: 'David Libre', serif;
    --sz-sh-sub: 21pt;
    --fn-sh-desc: 'Frank Ruhl Libre', serif;
    --sz-sh-desc: 12pt;
    --fn-sh-sec: 'David Libre', serif;
    --sz-sh-sec: 11.5pt;
    --fn-sh-author: 'David Libre', serif;
    --sz-sh-author: 15pt;
    --fn-sh-year: 'David Libre', serif;
    --sz-sh-year: 12pt;

    --fn-body: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-body: 11.2pt;
    --fn-first-word: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-first-word: 1.5em;

    --w-margin: 7.5%;
    --w-gap: 2%;
    --w-col: 40%;
    --w-gutter: 2%;
    --flow-mt: 20px;
    --flow-mb: 20px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ============================================================
     איפוס בסיסי ותצוגת שני-חלקים (סרגל צד + תצוגה מקדימה)
     ============================================================ */
  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background-color: #555555;
    font-family: var(--fn-body);
    color: #000000;
    display: flex;
    flex-direction: row;
  }

  #sidebar {
    width: 540px;
    min-width: 380px;
    max-width: 800px;
    height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    box-shadow: -3px 0 15px rgba(0,0,0,0.3);
    z-index: 100;
    font-family: 'David Libre', serif;
    flex-shrink: 0;
  }

  #resizer {
    width: 6px;
    height: 100vh;
    background: #333333;
    cursor: col-resize;
    flex-shrink: 0;
    z-index: 110;
    transition: background 0.2s;
  }
  #resizer:hover, #resizer.resizing { background: #b8860b; }

  .sidebar-top-half {
    height: 36vh;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding-bottom: 6px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .sidebar-title { font-size: 12.5pt; font-weight: 700; }

  .btn-load-fonts {
    background-color: #2c3e50;
    color: #fff;
    border: none;
    padding: 3px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }

  #raw-input {
    width: 100%;
    flex: 1;
    font-family: monospace;
    font-size: 9pt;
    padding: 6px;
    border: 1px solid #777;
    border-radius: 3px;
    direction: rtl;
    resize: none;
  }

  .sidebar-scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
    margin-top: 4px;
  }

  .panel-static {
    background: #fbfbfb;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 8px 10px;
  }

  .panel-header {
    font-size: 10pt;
    font-weight: 700;
    background: #eaeaea;
    padding: 4px 8px;
    border-radius: 3px;
    margin: -8px -10px 8px -10px;
    color: #111;
    border-bottom: 1px solid #ccc;
  }

  .inline-cfg-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 5px;
    font-size: 8.5pt;
  }
  .inline-cfg-row label { font-weight: 700; width: 105px; flex-shrink: 0; font-size: 8pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .inline-cfg-row input[type="text"] { flex: 1; min-width: 80px; padding: 2px 4px; font-size: 8.5pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select { padding: 2px 3px; font-size: 8pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select.font-picker { width: 100px; }
  .inline-cfg-row input.size-input { width: 38px; text-align: center; font-size: 8pt; padding: 2px; border: 1px solid #aaa; border-radius: 2px; }

  .toc-levels-table {
    width: 100%;
    font-size: 8pt;
    margin-top: 4px;
    border-collapse: collapse;
  }
  .toc-levels-table th, .toc-levels-table td {
    padding: 2px 4px;
    text-align: right;
  }
  .toc-levels-table th { background: #eee; font-weight: 700; }

  .btn-bar-bottom {
    display: flex;
    gap: 6px;
    padding-top: 8px;
    border-top: 1.5px solid #ccc;
    background: #fff;
    flex-shrink: 0;
  }
  .btn-primary {
    background-color: #000;
    color: #fff;
    border: none;
    padding: 8px 12px;
    font-size: 10pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    flex-grow: 1;
  }
  .btn-save-template {
    background-color: #1e3a8a;
    color: #fff;
    border: none;
    padding: 8px 10px;
    font-size: 9pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }
  .btn-secondary {
    background-color: #f0f0f0;
    color: #000;
    border: 1px solid #666;
    padding: 8px 10px;
    font-size: 9pt;
    cursor: pointer;
    border-radius: 3px;
  }

  #preview-pane {
    flex-grow: 1;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 20px;
    scroll-behavior: smooth;
    background-color: #555555;
  }

  /* ============================================================
     עמוד ה-A4 עצמו
     ============================================================ */
  .a4-page {
    background-color: #ffffff;
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    padding: 15mm 15mm 15mm 15mm;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    position: relative;
    margin-bottom: 30px;
    page-break-after: always;
    overflow: hidden;
    flex-shrink: 0;
  }

  .page-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    justify-content: space-between;
  }

  /* ============================================================
     עמודי השער: ראשי, אחורי, ומשנה
     ============================================================ */
  .main-shaar-page {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
  }

  .shaar-main-content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm 16mm 12mm;
    z-index: 20;
    position: relative;
  }

  /* רקע נמתח מקצה לקצה - ללא שוליים מיותרים */
  .custom-bg-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100% !important;
    height: 100% !important;
    object-fit: fill !important;
    z-index: 5;
    pointer-events: none;
  }

  .bsd-header { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-bottom: 40px; }
  .sefer-label { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-top: 4px; }
  
  .book-title-main { font-family: var(--fn-sh-title); font-size: var(--sz-sh-title); line-height: 1.1; margin: 10px 0 40px 0; }
  .book-subtitle { font-family: var(--fn-sh-sub); font-size: var(--sz-sh-sub); font-weight: 700; line-height: 1.25; }
  .book-description { font-family: var(--fn-sh-desc); font-size: var(--sz-sh-desc); line-height: 1.5; max-width: 65%; margin: 10px auto; }
  .book-sections-summary { font-family: var(--fn-sh-sec); font-size: var(--sz-sh-sec); line-height: 1.5; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 6px 12px; margin: 8px 0; font-weight: 700; }
  .author-block { font-family: var(--fn-sh-author); font-size: calc(var(--sz-sh-author) * 0.85); line-height: 1.3; }
  .author-name { font-size: var(--sz-sh-author); font-weight: 700; }
  .publication-footer { font-family: var(--fn-sh-year); font-size: var(--sz-sh-year); font-weight: 700; letter-spacing: 1px; }

  .m1-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-bottom: 1px solid #d0d0d0; }
  .m1-bg-middle { position: absolute; top: 20%; left: 0; right: 0; height: 60%; background: #ffffff; }
  .m1-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-top: 1px solid #d0d0d0; }
  .m1-panel { position: absolute; top: 0; bottom: 0; left: 12%; right: 12%; background: #ffffff; border-right: 1px solid #ccc; border-left: 1px solid #ccc; box-shadow: 0 0 20px rgba(0,0,0,0.1); display: flex; justify-content: space-between; z-index: 10; }
  .m1-damask { width: 30px; height: 100%; background: #fafafa url("data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.35'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }
  
  .m2-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-bg-middle { position: absolute; top: 18%; left: 0; right: 0; height: 64%; background: #ffffff; box-shadow: inset 0 2px 6px rgba(0,0,0,0.06), inset 0 -2px 6px rgba(0,0,0,0.06); }
  .m2-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-panel { position: absolute; top: 0; bottom: 0; left: 10%; right: 10%; background: #ffffff; box-shadow: 0 0 25px rgba(0,0,0,0.12); display: flex; justify-content: space-between; z-index: 10; }
  .m2-lace { width: 24px; height: 100%; background: #ffffff url("data:image/svg+xml,%3Csvg width='26' height='40' viewBox='0 0 26 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13,20 C4,16 2,8 2,2 C2,0 8,0 13,8 C18,0 24,0 24,2 C24,8 22,16 13,20 Z M13,20 C4,24 2,32 2,38 C2,40 8,40 13,32 C18,40 24,40 24,38 C24,32 22,24 13,20 Z M13,10 A3,3 0 1,0 13,16 A3,3 0 1,0 13,10 Z M13,30 A3,3 0 1,0 13,24 A3,3 0 1,0 13,30 Z' fill='%23888888' fill-opacity='0.45'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }

  .m3-wavy-band { position: absolute; top: 14%; left: 0; right: 0; height: 72%; background: #ffffff; border-top: 1.5px solid #d4d4d4; border-bottom: 1.5px solid #d4d4d4; }
  .m3-panel { position: absolute; top: 0; bottom: 0; left: 9%; right: 9%; background: #ffffff; border-right: 1.5px solid #ccc; border-left: 1.5px solid #ccc; box-shadow: 0 0 25px rgba(0,0,0,0.14); z-index: 10; }
  .m3-corner { position: absolute; width: 65px; height: 65px; fill: #111; z-index: 25; }
  .m3-corner.tr { top: 10mm; right: 10mm; }
  .m3-corner.tl { top: 10mm; left: 10mm; transform: scaleX(-1); }
  .m3-corner.br { bottom: 10mm; right: 10mm; transform: scaleY(-1); }
  .m3-corner.bl { bottom: 10mm; left: 10mm; transform: scale(-1, -1); }

  /* שער משנה (שמאל) ושער אחורי (ימין) */
  .sub-shaar-page { position: relative; padding: 0; }
  .sub-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    left: 0;
    right: auto;
    width: 55%;
    background: #ffffff;
    border-right: 1.5px solid #ccc;
    box-shadow: 5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .sub-shaar-bg-right {
    position: absolute;
    top: 0; bottom: 0;
    right: 0; left: 55%;
    background: #f4f4f4;
  }
  .sub-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm;
    z-index: 20;
  }

  .back-shaar-page { position: relative; padding: 0; }
  .back-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    right: 0;
    left: auto;
    width: 55%;
    background: #ffffff;
    border-left: 1.5px solid #ccc;
    box-shadow: -5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .back-shaar-bg-left {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 55%;
    background: #f4f4f4;
  }
  .back-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 22mm 12mm 18mm 12mm;
    z-index: 20;
  }

  /* קופסת תוכן גמישה המותאמת לערכות נושא לפי 4 שוליים */
  .theme-bounded-content {
    position: absolute;
    width: auto !important;
    height: auto !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    z-index: 20;
    box-sizing: border-box;
  }

  /* ============================================================
     תוכן העניינים
     ============================================================ */
  .toc-page { padding: 15mm 15mm 15mm 15mm; }
  .toc-grid-full {
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: space-between;
    flex-grow: 1;
    width: 100%;
    max-width: 175mm;
    margin: 0 auto;
  }
  .toc-entry-group { break-inside: avoid; margin-bottom: 3px; }
  .toc-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2px;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
  }
  .toc-title {
    flex-shrink: 1;
    max-width: 84%;
    font-weight: 600;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: right;
    line-height: 1.3;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 1px dotted #777;
    margin: 0 8px;
    height: 1px;
    min-width: 25px;
  }
  .toc-page-num {
    flex-shrink: 0;
    font-weight: 700;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
    min-width: 25px;
    text-align: left;
  }
  
  .toc-lvl-1 { font-size: 12pt; font-weight: 700; margin-top: 8px; margin-bottom: 3px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
  .toc-lvl-2 { font-size: 11pt; font-weight: 700; margin-top: 5px; padding-right: 8px; }
  .toc-lvl-3 { font-size: 10.5pt; font-weight: 700; padding-right: 16px; }
  .toc-lvl-4 { padding-right: 24px; font-size: 10pt; }
  .toc-lvl-5 { padding-right: 32px; font-size: 9.5pt; }
  .toc-lvl-6 { padding-right: 40px; font-size: 9pt; }
  .toc-lvl-7 { padding-right: 48px; font-size: 8.8pt; }

  .toc-grouped-block {
    padding-right: 30px;
    font-size: 9pt;
    color: #222;
    line-height: 1.5;
    margin: 2px 0 5px 0;
    text-align: right;
    font-family: 'David Libre', serif;
  }
  .grp-item { font-size: inherit; white-space: normal; }
  .grp-title { font-weight: 600; color: #111; }
  .grp-page { font-weight: 700; color: #4a5568 !important; font-family: 'David Libre', serif; }
  .grp-sep { color: #888; margin: 0 6px; font-weight: bold; white-space: nowrap; }

  /* ============================================================
     הכותרת העליונה
     ============================================================ */
  .top-header-grid {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    align-items: center;
    height: 24px;
    flex-shrink: 0;
  }

  .header-col-r {
    grid-column: 3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-r);
    font-size: var(--sz-header-r);
    font-weight: 700;
  }
  .header-col-c {
    grid-column: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: visible;
    font-family: var(--fn-header-c);
    font-size: var(--sz-header-c);
  }
  .header-col-l {
    grid-column: 5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-l);
    font-size: var(--sz-header-l);
    font-weight: 700;
  }

  /* ============================================================
     גוף הטקסט: כותרות, טורים, פסקאות
     ============================================================ */
  .title-level-2-standalone {
    font-family: var(--fn-h2);
    font-size: var(--sz-h2);
    font-weight: 700;
    text-align: center;
    margin-top: 0;
    margin-bottom: 40px;
    width: 100%;
    line-height: 1.25;
    flex-shrink: 0;
  }

  .h2-spacer { flex-basis: 33.33%; flex-shrink: 0; }

  .page-body-flow {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    flex-grow: 1;
    justify-content: flex-start;
    margin-top: var(--flow-mt);
    margin-bottom: var(--flow-mb);
    min-height: 0;
  }

  .block-2col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }

  .block-h3-span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 6px 0;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .block-h3-span .h3-title-text {
    font-family: var(--fn-h3);
    font-size: var(--sz-h3);
    font-weight: 900;
    text-align: center;
    width: 100%;
    line-height: 1.22;
  }

  .title-level-4 { font-family: var(--fn-h4); font-size: var(--sz-h4); font-weight: 900; text-align: center; margin: 9px 0 4px 0; line-height: 1.22; }
  .title-level-custom { margin: 9px 0 4px 0; line-height: 1.3; }
  
  .note-marker { line-height: 0; cursor: pointer; }
  
  /* אזור הערות השוליים - יושב בזרימה הטבעית מעל מספר העמוד */
  .footnote-area {
    position: relative;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 4px;
    flex-shrink: 0;
    z-index: 25;
  }
  
  .note-rule-plain { border-top: 1px solid #555; width: 35%; margin-bottom: 5px; }
  .note-rule-decorative { display: flex; align-items: center; gap: 6px; width: 62%; margin-bottom: 8px; }
  .note-rule-decorative .rule-seg { flex: 1; height: 1px; background: #555; }
  .note-rule-decorative .rule-glyphs { font-size: 9px; letter-spacing: 3px; color: #555; white-space: nowrap; }
  .note-block { font-size: 8.5pt; line-height: 1.5; }
  .note-line { break-inside: avoid; margin-bottom: 3px; }
  .note-line-num { font-weight: 700; margin-left: 3px; text-decoration: none; color: inherit; cursor: pointer; }
  .endnote-page-block { margin-top: 10mm; padding: 0 10mm; }
  .title-level-5 { font-family: var(--fn-h5); font-size: var(--sz-h5); font-weight: 700; text-align: center; margin: 7px 0 3px 0; line-height: 1.22; }
  .title-level-6 { font-family: var(--fn-h6); font-size: var(--sz-h6); font-weight: 700; text-align: center; margin: 6px 0 3px 0; line-height: 1.22; }

  .block-single-col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) calc(var(--w-col)*2 + var(--w-gutter)) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }
  .block-single-col .single-wide-col {
    grid-column: 3;
    font-family: var(--fn-h0-body);
    font-size: var(--sz-h0-body);
    line-height: 1.45;
    text-align: justify;
    text-justify: inter-word;
  }

  .margin-notes-column {
    font-family: var(--fn-h7);
    font-size: var(--sz-h7);
    line-height: 1.18;
    text-align: center;
    text-align-last: center;
    font-weight: 400;
    color: #404040;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .right-margin { grid-column: 1; }
  .left-margin { grid-column: 7; }
  .side-note-anchor { position: absolute; width: 100%; }

  .main-column {
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
    text-align: justify;
    text-justify: inter-word;
    min-height: 0;
    height: auto;
    position: relative;
  }

  .right-col { grid-column: 3; }
  .left-col { grid-column: 5; }

  p { margin-bottom: 7px; text-align: justify; text-justify: inter-word; position: relative; }
  p.p-end { text-align-last: center; }
  p.p-cut { text-align-last: justify; }

  .first-word-window {
    float: right;
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 0.85;
    height: 1.25em;
    margin-left: 6px;
    margin-bottom: 1px;
    display: block;
  }

  .first-word-inline {
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 1;
  }

  .page-number-footer {
    text-align: center;
    font-family: var(--fn-header-r);
    font-size: 12pt;
    font-weight: 700;
    height: 24px;
    flex-shrink: 0;
  }

  #measuring-box {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    top: -9999px;
    left: -9999px;
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
  }

  @media print {
    @page { size: A4; margin: 0; }
    body { background: none; padding: 0; overflow: visible; display: block; }
    #sidebar, #resizer { display: none !important; }
    #preview-pane { height: auto !important; overflow: visible !important; padding: 0 !important; background: none !important; display: block !important; }
    .a4-page { box-shadow: none; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; max-height: 297mm !important; padding: 15mm !important; margin: 0 !important; page-break-after: always; break-after: page; position: relative; }
    .page-content-wrapper, .shaar-main-content, .sub-shaar-content-centered, .back-shaar-content-centered { height: 100% !important; }
  }
</style>
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">

      <!-- ============================================================
           פאנל 1: בחירת ערכת נושא פעילה לשערי הספר
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">👑 בחירת ערכת נושא לשערי הספר</div>
        
        <div class="inline-cfg-row" style="margin-bottom: 6px;">
          <label>ערכת נושא פעילה:</label>
          <select id="active-theme-select" style="flex:1;" onchange="typesetDocument()">
            <optgroup label="ערכות מובנות">
              <option value="builtin_1" selected="selected">1. דמסק ושיש מרכזי</option>
              <option value="builtin_2">2. תחרת סלסולים כפולה</option>
              <option value="builtin_3">3. קרנות וילנא וגיליושה</option>
            </optgroup>
            <optgroup id="custom-themes-optgroup" label="ערכות שהוטמעו בקובץ">
              <!-- מתמלא באופן דינמי מערכות מותאמות -->
            </optgroup>
          </select>
        </div>

        <div style="margin-bottom: 6px; display:flex; gap:12px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked" onchange="typesetDocument()"> שער ראשי</label>
          <label style="font-size: 8.5pt; font-weight: 700;" title="מציג שער אחורי בעמוד 2 (גב השער הראשי)"><input type="checkbox" id="show-back-shaar" onchange="typesetDocument()"> שער אחורי (גב השער)</label>
        </div>

        <div class="inline-cfg-row">
          <label>שם הספר:</label>
          <input type="text" id="inp-book-title" value="שם הספר" placeholder="שם הספר (כותרת ראשית)">
          <select id="f-sh-title" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-sh-title" class="size-input" value="46">
        </div>
        <div class="inline-cfg-row">
          <label>נושא / משנה:</label>
          <input type="text" id="inp-book-subtitle" value="נושא הספר מונסח בתמציות" placeholder="נושא / כותרת משנה">
          <select id="f-sh-sub" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-sub" class="size-input" value="21">
        </div>
        <div class="inline-cfg-row">
          <label>נושא מפורט:</label>
          <input type="text" id="inp-book-desc" value="נושא הספר בפרטות ובנוסח ארוך יותר" placeholder="נושא מפורט / תיאור החיבור">
          <select id="f-sh-desc" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-desc" class="size-input" value="12">
        </div>
        <div class="inline-cfg-row">
          <label>פרטי מהדורא:</label>
          <input type="text" id="inp-book-sections" value="פרטי מהדורה | פרטי מהדורה" placeholder="פרטי מהדורא / חלקים">
          <select id="f-sh-sec" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-sec" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>שם המחבר:</label>
          <input type="text" id="inp-book-author" value="שם המחבר" placeholder="שם המחבר">
          <select id="f-sh-author" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-author" class="size-input" value="15">
        </div>
        <div class="inline-cfg-row">
          <label>מקום ושנה:</label>
          <input type="text" id="inp-book-year" value="מקום ההוצאה | שנת ההוצאה" placeholder="מקום ושנת הוצאה">
          <select id="f-sh-year" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-year" class="size-input" value="12">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div class="inline-cfg-row">
            <label>עיטור סיום פרק:</label>
            <select id="section-divider-style" style="flex:1;" onchange="document.getElementById('row-sec-div-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'; typesetDocument();">
              <option value="pyramid">1. פירמידת וילנא (❖ ❖ ❖)</option>
              <option value="spear" selected="selected">2. רומח מחודד עם טבעת (SVG)</option>
              <option value="swash">3. שושנתא וילנאית (SVG)</option>
              <option value="flourish">4. סלסול תורני כפול (SVG)</option>
              <option value="custom_img">5. תמונת עיטור אישית</option>
              <option value="none">ללא עיטור</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sec-div-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ עיטור פרק:</label>
            <input type="file" id="file-sec-div-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>

      <!-- ============================================================
           פאנל 2: יצירת והטמעת ערכת נושא חדשה (ראשי / אחורי / משנה)
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header" style="cursor:pointer;" onclick="togglePanelBody('new-theme-panel-body')">
          🎨 יצירת והטמעת ערכת נושא חדשה (SVG) <span style="font-size:8pt; font-weight:normal; float:left;">▼ פתח/סגור</span>
        </div>
        <div id="new-theme-panel-body">
          <div class="inline-cfg-row" style="margin-bottom: 6px;">
            <label style="color:#1e3a8a;">שם הערכה:</label>
            <input type="text" id="builder-theme-name" placeholder="הזן שם לערכת הנושא החדשה...">
          </div>

          <!-- הגדרות שער ראשי -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">🏛️ 1. שער ראשי (מרכז הדף):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-main-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-main-svg')">
              <input type="hidden" id="data-builder-main-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-main-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-main-bottom" value="16" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-main-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-main-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <!-- הגדרות שער אחורי -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📖 2. שער אחורי (טור ימני / גב השער):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-back-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-back-svg')">
              <input type="hidden" id="data-builder-back-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-back-top" value="22" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-back-bottom" value="18" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-back-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים משמאל תוחמים את הטור הימני">שמאל (mm):</label><input type="number" id="builder-back-left" value="95" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <!-- הגדרות שער משנה -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📜 3. שער משנה (טור שמאלי / פותח חלק):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-sub-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-sub-svg')">
              <input type="hidden" id="data-builder-sub-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-sub-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-sub-bottom" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים מימין תוחמים את הטור השמאלי">ימין (mm):</label><input type="number" id="builder-sub-right" value="95" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-sub-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <button class="btn-load-fonts" style="width:100%; padding:6px; background:#1e3a8a; margin-top:4px;" onclick="addNewCustomTheme()">➕ הטמע ערכת נושא זו בקובץ</button>
          
          <div id="custom-themes-list" style="margin-top:8px;"></div>
        </div>
      </div>

      <!-- פאנל ייבוא תוספים -->
      <div class="panel-static">
        <div class="panel-header">🧩 ייבוא תוספים (סוגי עמוד / סגנונות טקסט)</div>
        <div class="inline-cfg-row">
          <label>סוג עמוד:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handlePageTypeImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>סגנון טקסט:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handleTextStyleImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>תמונה כעמוד:</label>
          <input type="file" accept="image/*" style="flex:1;font-size:8pt;" onchange="handleImagePageImportFile(event)">
        </div>
      </div>
      <div id="ext-imports-container"></div>

      <!-- ============================================================
           פאנל הגדרות הערות מורחב: שליטה בסימונים/מזהים לשני הסוגים
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">📝 הגדרות הערות (שוליים / סיום)</div>

        <!-- אזור הגדרות הערות שוליים (Footnotes) -->
        <div style="font-weight:700; font-size:8pt; margin: 2px 0 3px 0; color:#1e3a8a;">📌 הערות שוליים (בתחתית העמוד / בצד):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="fn-line-prefix" value="כותרת 7 -" placeholder="למשל: הערה - או כותרת 7 -" onchange="typesetDocument()">
        </div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="fn-delim-open" value="((" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" onchange="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="fn-delim-close" value="))" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" onchange="typesetDocument()">
          </div>
        </div>

        <!-- אזור הגדרות הערות סיום (Endnotes) -->
        <div style="font-weight:700; font-size:8pt; margin: 6px 0 3px 0; color:#1e3a8a; border-top:1px dashed #ddd; padding-top:4px;">📚 הערות סיום (מרוכזות בסוף חלק):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="en-line-prefix" value="הערת סיום -" placeholder="למשל: הערת סיום -" onchange="typesetDocument()">
        </div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="en-delim-open" value="[[" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" onchange="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="en-delim-close" value="]]" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" onchange="typesetDocument()">
          </div>
        </div>

        <div style="border-top:1px dashed #ddd; margin-top:6px; padding-top:4px;"></div>
        <div class="inline-cfg-row"><label>סוג סימון בטקסט:</label>
          <select id="note-marker-type" onchange="typesetDocument()">
            <option value="super" selected="selected">כתב עילי</option>
            <option value="normal">רגיל (על השורה)</option>
            <option value="sub">כתב תחתי</option>
            <option value="brackets">בסוגריים מרובעים [1]</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>גודל סימון בטקסט:</label><input type="number" id="note-marker-size" value="8" class="size-input" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>גודל מס' ברשימה:</label><input type="number" id="note-listing-num-size" value="8" class="size-input" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>מפריד אחרי מספר:</label><input type="text" id="note-num-separator" value="." style="flex:0 0 40px;" onchange="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>קו מפריד (שוליים):</label>
          <select id="note-rule-style" onchange="typesetDocument()">
            <option value="plain" selected="selected">קו רגיל</option>
            <option value="dots">קו + עיגולים ◦◦◦</option>
            <option value="sparkle">קו + ניצוץ ❖❖❖</option>
            <option value="star">קו + כוכבית ✧✧✧</option>
            <option value="diamond">קו + יהלום ♦♦♦</option>
            <option value="none">ללא קו</option>
          </select>
        </div>
      </div>

      <!-- פאנל איכות עימוד -->
      <div class="panel-static">
        <div class="panel-header">✍️ איכות עימוד אוטומטי</div>
        <div class="inline-cfg-row"><label>מניעת שורות בודדות:</label>
          <select id="avoid-widows-select" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>איזון סוף-פרק:</label>
          <select id="balance-chapter-end" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
      </div>

      <!-- פאנל רקעים -->
      <div class="panel-static">
        <div class="panel-header">🎨 רקע לעמודי תוכן</div>
        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד טקסט רגיל:</label>
          <select id="cbg-regular-mode" style="flex:1;" onchange="toggleCbgSubRows('regular', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-regular-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-regular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-regular-img')">
          <input type="hidden" id="data-cbg-regular-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-regular-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 0":</label>
          <select id="cbg-h0Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h0Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h0Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h0Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h0Open-img')">
          <input type="hidden" id="data-cbg-h0Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h0Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 2":</label>
          <select id="cbg-h2Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h2Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h2Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h2Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h2Open-img')">
          <input type="hidden" id="data-cbg-h2Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h2Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div style="font-size:8pt; font-weight:700; margin-bottom:6px;">תוכן העניינים</div>
          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד ראשון:</label>
            <select id="cbg-tocFirst-mode" style="flex:1;" onchange="toggleCbgSubRows('tocFirst', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocFirst-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocFirst-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocFirst-img')">
            <input type="hidden" id="data-cbg-tocFirst-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocFirst-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד רגיל (ביניים):</label>
            <select id="cbg-tocRegular-mode" style="flex:1;" onchange="toggleCbgSubRows('tocRegular', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocRegular-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocRegular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocRegular-img')">
            <input type="hidden" id="data-cbg-tocRegular-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocRegular-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד אחרון:</label>
            <select id="cbg-tocLast-mode" style="flex:1;" onchange="toggleCbgSubRows('tocLast', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocLast-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocLast-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocLast-img')">
            <input type="hidden" id="data-cbg-tocLast-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocLast-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>
        </div>
      </div>

      <!-- פאנל כותרות 0-7 -->
      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h0" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>טקסט כותרת 0:</label>
          <span style="font-size:7.5pt; color:#666; width:95px; flex-shrink:0;">(גוף ההקדמה)</span>
          <select id="f-h0-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Frank Ruhl Libre', serif" selected="selected">Frank Ruhl Libre</option></optgroup></select>
          <input type="number" id="s-h0-body" class="size-input" value="11.5" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 1 (שער משנה):</label>
          <select id="mode-h1"><option value="sub_shaar" selected="selected">שער משנה נפרד</option><option value="new_page_1col">טור 1 עמוד הבא</option></select>
          <select id="f-h1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-h1" class="size-input" value="50">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h1" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h2" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 3:</label>
          <select id="mode-h3"><option value="span_1col" selected="selected">טור 1 רציף (רוחב דף)</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h3" class="size-input" value="13.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 4:</label>
          <select id="mode-h4"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h4" class="size-input" value="12.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 5:</label>
          <select id="mode-h5"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaLight', serif" selected="selected">AlphaLight</option></optgroup></select>
          <input type="number" id="s-h5" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 6:</label>
          <select id="mode-h6"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Noto Serif Hebrew', serif" selected="selected">Noto Serif Hebrew</option></optgroup></select>
          <input type="number" id="s-h6" class="size-input" value="10.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 7 (צד):</label>
          <select id="mode-h7"><option value="side_note" selected="selected">כותרת צד בשוליים</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Hadassah Friedlaender', serif" selected="selected">Hadassah Friedlaender</option></optgroup></select>
          <input type="number" id="s-h7" class="size-input" value="6" step="0.2">
        </div>
      </div>

      <!-- פאנל כותרות עליונות -->
      <div class="panel-static">
        <div class="panel-header">📑 כותרות עליונות (3 אזורים)</div>
        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">1. מעל הטור הימני:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-r-type" style="flex:1;" onchange="document.getElementById('hdr-r-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1" selected="selected">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-r-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option><option value="left">שמאל</option></select>
          <select id="f-hdr-r" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-r" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-r-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">2. מעל הרווח המרכזי (Gutter):</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-c-type" style="flex:1;" onchange="
            document.getElementById('hdr-c-custom').style.display = this.value === 'custom' ? 'block' : 'none';
            document.getElementById('row-hdr-c-img').style.display = this.value === 'custom_img' ? 'flex' : 'none';
          ">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear" selected="selected">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="custom_img">תמונת עיטור (קובץ)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-c-align" style="width:65px;"><option value="center" selected="selected">מרכז</option></select>
          <select id="f-hdr-c" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-c" class="size-input" value="11">
        </div>
        <input type="text" id="hdr-c-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
        <div class="inline-cfg-row" id="row-hdr-c-img" style="display:none; margin-bottom:8px;">
          <label>קובץ עיטור מרכזי:</label>
          <input type="file" id="file-hdr-c-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
          <input type="hidden" id="data-hdr-c-img" value="">
        </div>

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">3. מעל הטור השמאלי:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-l-type" style="flex:1;" onchange="document.getElementById('hdr-l-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2" selected="selected">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-l-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option></select>
          <select id="f-hdr-l" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-l" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-l-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:4px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
      </div>

      <!-- פאנל תוכן העניינים -->
      <div class="panel-static">
        <div class="panel-header">📑 תוכן העניינים (כללי ומפורט)</div>
        <div style="margin-bottom:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-general-toc" checked="checked"> הצג תוכן עניינים כללי בראש הספר</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="gtoc-show" value="1" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="1"></td><td><select id="f-gtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="gtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="2"></td><td><select id="f-gtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="gtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="3" checked="checked"></td><td><select id="f-gtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="gtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="4"></td><td><select id="f-gtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="gtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="5"></td><td><select id="f-gtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="gtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="6"></td><td><select id="f-gtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="gtoc-show" value="7"></td><td><input type="checkbox" class="gtoc-grp" value="7"></td><td><select id="f-gtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>

        <div style="margin: 8px 0 4px 0; border-top:1px dashed #ccc; padding-top:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-detailed-toc" checked="checked"> הצג תוכן מפורט בראש שערי משנה</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="dtoc-show" value="1"></td><td><input type="checkbox" class="dtoc-grp" value="1"></td><td><select id="f-dtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="dtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="2"></td><td><select id="f-dtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="dtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="3"></td><td><select id="f-dtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="dtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="4" checked="checked"></td><td><select id="f-dtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="dtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="5"></td><td><select id="f-dtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="dtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="6"></td><td><select id="f-dtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="dtoc-show" value="7" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="7"></td><td><select id="f-dtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>
      </div>

      <!-- פאנל גריד וטיפוגרפיה -->
      <div class="panel-static">
        <div class="panel-header">📐 גריד וטיפוגרפיה כללית</div>
        <div class="inline-cfg-row">
          <label>גוף הטקסט:</label>
          <select id="font-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Guttman Rashi', serif" selected="selected">Guttman Rashi</option></optgroup></select>
          <input type="number" id="size-body" class="size-input" value="12" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>מילה ראשונה:</label>
          <select id="font-first-word" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'FrankReal', serif" selected="selected">FrankReal</option></optgroup></select>
          <input type="number" id="size-first-word" class="size-input" value="1.5" step="0.1">
        </div>
        <div class="proportions-grid" style="margin-top:6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div class="prop-item"><label>טור (%):</label><input type="number" id="prop-col" value="40" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח מרכזי (%):</label><input type="number" id="prop-gutter" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח ביניים (%):</label><input type="number" id="prop-gap" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>מרחק עליון (px):</label><input type="number" id="prop-mt" value="20" step="1" class="size-input"></div>
          <div class="prop-item"><label>מרחק תחתון (px):</label><input type="number" id="prop-mb" value="20" step="1" class="size-input"></div>
        </div>
      </div>

    </div>

    <div class="btn-bar-bottom">
      <button class="btn-save-template" onclick="saveAsDefaultTemplate()">💾 שמור תבנית</button>
      <button class="btn-primary" onclick="typesetDocument()">⚡ עדכן ועמד מחדש</button>
      <button class="btn-secondary" onclick="window.print()">🖨️ הדפסה / PDF</button>
    </div>
  </div>

  <div id="resizer"></div>

  <div id="preview-pane">
    <div id="book-container"></div>
  </div>

  <div id="measuring-box"></div>

  <script>
    const resizer = document.getElementById('resizer');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      resizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newWidth = document.body.clientWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 800) {
        sidebar.style.width = newWidth + 'px';
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });

    const CBG_TEXTURE_SVG = "data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.18'/%3E%3C/svg%3E";

    function getContentBgCSS(roleKey) {
      const modeEl = document.getElementById('cbg-' + roleKey + '-mode');
      if (!modeEl) return '';
      const mode = modeEl.value;
      if (mode === 'color') {
        const c = document.getElementById('cbg-' + roleKey + '-color');
        return c ? `background-color:${c.value};background-image:none;` : '';
      }
      if (mode === 'texture') {
        return `background-color:#fdfcf6;background-image:url("${CBG_TEXTURE_SVG}");background-repeat:repeat;`;
      }
      if (mode === 'image') {
        const imgEl = document.getElementById('data-cbg-' + roleKey + '-img');
        const opEl = document.getElementById('cbg-' + roleKey + '-opacity');
        const img = imgEl ? imgEl.value : '';
        if (!img) return '';
        const op = opEl ? (parseInt(opEl.value, 10) / 100) : 0.15;
        const fade = 1 - op;
        return `background-image:linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${img}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
      }
      return '';
    }

    function applyContentBg(pageEl, roleKey) {
      const css = getContentBgCSS(roleKey);
      if (css) pageEl.style.cssText += css;
    }

    function toggleCbgSubRows(role, mode) {
      const rowColor = document.getElementById('row-cbg-' + role + '-color');
      const rowImg = document.getElementById('row-cbg-' + role + '-img');
      const rowOp = document.getElementById('row-cbg-' + role + '-op');
      if (rowColor) rowColor.style.display = (mode === 'color') ? 'flex' : 'none';
      if (rowImg) rowImg.style.display = (mode === 'image') ? 'flex' : 'none';
      if (rowOp) rowOp.style.display = (mode === 'image') ? 'flex' : 'none';
    }

    function togglePanelBody(bodyId) {
      const body = document.getElementById(bodyId);
      if (body) {
        body.style.display = (body.style.display === 'none') ? 'block' : 'none';
      }
    }

    /* ============================================================
       מערך ערכות הנושא המותאמות (Custom Themes Data Storage)
       ============================================================ */
    let customThemes = [];

    // הוספת ערכת נושא חדשה למערכת והטמעתה ברשימת הבחירה
    function addNewCustomTheme() {
      const nameInput = document.getElementById('builder-theme-name');
      const name = nameInput.value.trim();
      if (!name) {
        alert('אנא הזן שם לערכת הנושא.');
        return;
      }

      const mainSvg = document.getElementById('data-builder-main-svg').value;
      const backSvg = document.getElementById('data-builder-back-svg').value;
      const subSvg = document.getElementById('data-builder-sub-svg').value;

      const themeObj = {
        id: 'theme_' + Date.now(),
        name: name,
        mainShaar: {
          svgData: mainSvg || '',
          top: parseFloat(document.getElementById('builder-main-top').value) || 20,
          bottom: parseFloat(document.getElementById('builder-main-bottom').value) || 16,
          right: parseFloat(document.getElementById('builder-main-right').value) || 15,
          left: parseFloat(document.getElementById('builder-main-left').value) || 15
        },
        backShaar: {
          svgData: backSvg || '',
          top: parseFloat(document.getElementById('builder-back-top').value) || 22,
          bottom: parseFloat(document.getElementById('builder-back-bottom').value) || 18,
          right: parseFloat(document.getElementById('builder-back-right').value) || 15,
          left: parseFloat(document.getElementById('builder-back-left').value) || 95
        },
        subShaar: {
          svgData: subSvg || '',
          top: parseFloat(document.getElementById('builder-sub-top').value) || 20,
          bottom: parseFloat(document.getElementById('builder-sub-bottom').value) || 20,
          right: parseFloat(document.getElementById('builder-sub-right').value) || 95,
          left: parseFloat(document.getElementById('builder-sub-left').value) || 15
        }
      };

      customThemes.push(themeObj);
      refreshCustomThemesUI();

      // בחירה אוטומטית בערכה שזה עתה הוטמעה
      const select = document.getElementById('active-theme-select');
      if (select) {
        select.value = themeObj.id;
      }

      alert(`ערכת הנושא "${name}" הוטמעה בהצלחה! היא זמינה לבחירה ברשימה ותישמר לצמיתות בלחיצה על "שמור תבנית".`);
      typesetDocument();
    }

    // מחיקת ערכת נושא שהוטמעה
    function deleteCustomTheme(themeId) {
      if (!confirm('האם ברצונך למחוק ערכת נושא זו?')) return;
      customThemes = customThemes.filter(t => t.id !== themeId);
      refreshCustomThemesUI();
      typesetDocument();
    }

    // רענון רשימת הערכות בדרופדאון ובפאנל הניהול
    function refreshCustomThemesUI() {
      const optgroup = document.getElementById('custom-themes-optgroup');
      const listContainer = document.getElementById('custom-themes-list');
      const select = document.getElementById('active-theme-select');
      const currentVal = select ? select.value : '';

      if (optgroup) {
        optgroup.innerHTML = '';
        customThemes.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = t.name;
          optgroup.appendChild(opt);
        });
      }

      if (listContainer) {
        if (customThemes.length === 0) {
          listContainer.innerHTML = '<div style="font-size:7.5pt; color:#888;">עדיין לא הוטמעו ערכות מותאמות אישית.</div>';
        } else {
          let html = '<div style="font-size:8pt; font-weight:700; margin-bottom:4px; color:#333;">ערכות שהוטמעו בקובץ:</div>';
          customThemes.forEach(t => {
            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #ddd; padding:3px 6px; border-radius:3px; margin-bottom:3px; font-size:8pt;">
                <span>🏷️ ${t.name}</span>
                <span style="color:#dc2626; cursor:pointer; font-weight:bold;" onclick="deleteCustomTheme('${t.id}')">🗑️ מחק</span>
              </div>
            `;
          });
          listContainer.innerHTML = html;
        }
      }

      if (select && currentVal) {
        select.value = currentVal;
      }
    }

    /* ===================== EXTENSIONS: imported page-types / text-styles / image-pages ===================== */
    let importedPageTypes = [];
    let importedTextStyles = [];
    let importedImagePages = [];
    let extImportCounter = 0;
    let nextSyntheticLevel = 8;

    function validateExtJSON(def, expectedKind) {
      if (!def || typeof def !== 'object') return 'קובץ לא תקין (לא JSON תקין).';
      if (def.kind !== expectedKind) return 'הקובץ אינו מסוג ' + (expectedKind === 'pageType' ? 'סוג עמוד' : 'סגנון טקסט') + ' (kind=' + def.kind + ').';
      if (!def.name) return 'להגדרה שיובאה אין שם (name).';
      return null;
    }

    function handlePageTypeImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'pageType');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-pt-' + (extImportCounter++);
        importedPageTypes.push({ instanceId, def, anchor: def.insertionAnchor || 'afterAll', repeatMode: def.repeatMode || 'once' });
        buildExtPanel('pageType', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleTextStyleImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'textStyle');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-ts-' + (extImportCounter++);
        const syntheticLevel = (def.trigger && def.trigger.type === 'linePrefix') ? (nextSyntheticLevel++) : null;
        importedTextStyles.push({ instanceId, def, syntheticLevel });
        buildExtPanel('textStyle', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleImagePageImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const instanceId = 'ext-img-' + (extImportCounter++);
        importedImagePages.push({ instanceId, name: file.name, dataUrl: e.target.result, anchor: 'afterAll' });
        buildExtPanel('imagePage', instanceId, 'תמונה: ' + file.name, null);
        typesetDocument();
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    const EXT_ANCHOR_OPTIONS = [
      ['beforeAll','לפני הכל'], ['afterMainShaar','אחרי השער הראשי'], ['afterGeneralToc','אחרי תוכן העניינים הכללי'],
      ['beforeEachPart','לפני כל שער-חלק'], ['afterEachPart','מיד אחרי כל שער-חלק'], ['endOfEachPart','בסוף כל חלק'], ['afterAll','אחרי הכל']
    ];

    function buildExtPanel(kind, instanceId, name, def) {
      const panel = document.createElement('div');
      panel.className = 'panel-static';
      panel.id = instanceId + '-panel';
      const icon = kind === 'pageType' ? '📄' : kind === 'textStyle' ? '🅰️' : '🖼️';
      let triggerInfo = '';
      if (kind === 'textStyle' && def && def.trigger) {
        triggerInfo = (def.trigger.type === 'delimiterPair')
          ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${def.trigger.open}" ל-"${def.trigger.close}"</div>`
          : `<div style="font-size:7.5pt;color:#888;">קידומת: "${def.trigger.prefix}"</div>`;
      }
      const anchorRow = (kind !== 'textStyle')
        ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${instanceId}-anchor" onchange="updateExtAnchor('${kind}','${instanceId}', this.value)">${EXT_ANCHOR_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>`
        : '';
      panel.innerHTML = `
        <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>${icon} ${name}</span>
          <span style="cursor:pointer;color:#a33;font-weight:700;" onclick="removeExtInstance('${kind}','${instanceId}')">✕ הסר</span>
        </div>
        ${triggerInfo}
        ${anchorRow}
      `;
      document.getElementById('ext-imports-container').appendChild(panel);
      if (kind !== 'textStyle') {
        const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
        const inst = store.find(x => x.instanceId === instanceId);
        const sel = document.getElementById(instanceId + '-anchor');
        if (sel && inst) sel.value = inst.anchor;
      }
    }

    function updateExtAnchor(kind, instanceId, val) {
      const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
      const inst = store.find(x => x.instanceId === instanceId);
      if (inst) inst.anchor = val;
      typesetDocument();
    }

    function removeExtInstance(kind, instanceId) {
      if (kind === 'pageType') importedPageTypes = importedPageTypes.filter(x => x.instanceId !== instanceId);
      else if (kind === 'textStyle') importedTextStyles = importedTextStyles.filter(x => x.instanceId !== instanceId);
      else importedImagePages = importedImagePages.filter(x => x.instanceId !== instanceId);
      const p = document.getElementById(instanceId + '-panel');
      if (p) p.remove();
      typesetDocument();
    }

    function findPrefixLineInSource(rawText, prefix) {
      if (!prefix) return null;
      const lines = rawText.split('\n');
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith(prefix)) return t.slice(prefix.length).replace(/^[:\-–—]\s*/, '').trim();
      }
      return null;
    }

    const EXT_V_MAP = { top:'14mm', upperMid:'25%', center:'50%', lowerMid:'75%' };

    function applyExtStyleToNode(node, style, hostFontSizePt) {
      if (!style) return;
      if (style.family) node.style.fontFamily = style.family;
      if (typeof style.size === 'number') node.style.fontSize = style.size + 'pt';
      if (typeof style.sizeDelta === 'number') node.style.fontSize = ((hostFontSizePt||12) + style.sizeDelta) + 'pt';
      if (style.weight) node.style.fontWeight = style.weight;
      if (style.color) node.style.color = style.color;
      if (style.align) node.style.textAlign = style.align;
      if (style.border) {
        node.style.border = style.border.width + 'px solid ' + style.border.color;
        node.style.borderRadius = style.border.radius + 'px';
        node.style.padding = '2px 8px';
      }
    }

    function renderImportedPage(container, inst, rawSourceText) {
      const def = inst.def;
      const page = document.createElement('div');
      page.className = 'a4-page';
      if (def.background && def.background.mode === 'fixed') {
        const bs = def.background.style;
        if (bs === 'color' && def.background.color) page.style.background = def.background.color;
        else if (bs === 'texture') { page.style.background = '#fdfcf6 url("'+CBG_TEXTURE_SVG+'") repeat'; }
        else if (bs === 'image' && def.background.image) {
          const fade = 1 - (def.background.opacity != null ? def.background.opacity : 0.15);
          page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${def.background.image}")`;
          page.style.backgroundSize = 'cover'; page.style.backgroundPosition = 'center';
        }
      } else {
        applyContentBg(page, 'regular');
      }
      (def.elements || []).forEach(elDef => {
        const matched = findPrefixLineInSource(rawSourceText, elDef.prefix);
        const text = matched || elDef.defaultText || '';
        if (!text) return;
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.textContent = text;
        const pos = elDef.position || {};
        const va = pos.vAnchor || 'center', ha = pos.hAlign || 'center', off = pos.offsetY || 0;
        if (va === 'bottom') { el.style.bottom = (18 - off) + 'mm'; }
        else {
          el.style.top = `calc(${EXT_V_MAP[va] || '50%'} + ${off}px)`;
          if (va === 'center' || va === 'upperMid' || va === 'lowerMid') el.style.transform = 'translateY(-50%)';
        }
        if (ha === 'right' || ha === 'rightMid') { el.style.right = (ha === 'right' ? '15mm' : '25%'); }
        else if (ha === 'left' || ha === 'leftMid') { el.style.left = (ha === 'left' ? '15mm' : '25%'); }
        else { el.style.right = '0'; el.style.left = '0'; el.style.textAlign = 'center'; }
        applyExtStyleToNode(el, elDef.style, 12);
        page.appendChild(el);
      });
      container.appendChild(page);
    }

    function renderImportedImagePage(container, inst) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      page.style.backgroundImage = `url("${inst.dataUrl}")`;
      page.style.backgroundSize = 'cover';
      page.style.backgroundPosition = 'center';
      container.appendChild(page);
    }

    function renderExtAnchor(container, anchorKey, rawSourceText) {
      importedPageTypes.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedPage(container, inst, rawSourceText));
      importedImagePages.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedImagePage(container, inst));
    }

    function appendMainSubParts(hostElem, mainText, subText, def) {
      const mainPart = document.createElement('div');
      mainPart.textContent = mainText.trim();
      applyExtStyleToNode(mainPart, def.style, 14);
      hostElem.appendChild(mainPart);
      if (subText && subText.trim()) {
        const subPart = document.createElement('div');
        subPart.textContent = subText.trim();
        subPart.style.fontSize = '0.68em'; subPart.style.opacity = '0.78'; subPart.style.marginTop = '3px';
        hostElem.appendChild(subPart);
      }
    }

    function renderCustomHeadingInto(hostElem, inst, text) {
      const def = inst.def;
      hostElem.innerHTML = '';

      if (def.parseMode === 'splitFirstDash' && /[-–—]/.test(text)) {
        appendMainSubParts(hostElem, text.split(/[-–—]/)[0], text.split(/[-–—]/).slice(1).join(' - '), def);
        return;
      }

      if (def.parseMode === 'splitCustomDelimiter' && def.parseDelimiter && text.indexOf(def.parseDelimiter) > -1) {
        const idx = text.indexOf(def.parseDelimiter);
        appendMainSubParts(hostElem, text.slice(0, idx), text.slice(idx + def.parseDelimiter.length), def);
        return;
      }

      if (def.parseMode === 'regexGroups' && def.parseRegex) {
        let match = null;
        try {
          match = text.match(new RegExp(def.parseRegex));
        } catch (e) {
          console.warn('סגנון "' + def.name + '": ביטוי רגולרי לא תקין (' + def.parseRegex + ') — ' + e.message);
        }
        if (match && match.groups && Object.keys(match.groups).length) {
          const vals = Object.values(match.groups).filter(v => v !== undefined);
          if (vals.length) {
            appendMainSubParts(hostElem, vals[0], vals.slice(1).join(' '), def);
            return;
          }
        }
      }

      hostElem.textContent = text;
      applyExtStyleToNode(hostElem, def.style, 12);
    }

    function findExtTextStyle(instanceId) {
      return importedTextStyles.find(x => x.instanceId === instanceId);
    }

    function finalizeNotePositions(notesList, columnBoundaryHeight) {
      const byMargin = new Map();
      notesList.forEach(item => {
        if (!item.elem || !item.pElem) return;
        const marg = item.elem.parentElement;
        if (!marg) return;
        if (!byMargin.has(marg)) byMargin.set(marg, []);
        byMargin.get(marg).push(item);
      });
      byMargin.forEach(group => {
        group.sort((a, b) => a.pElem.offsetTop - b.pElem.offsetTop);
        group.forEach((item, idx) => {
          const noteHeight = item.elem.getBoundingClientRect().height || item.elem.offsetHeight || 0;
          let top = item.pElem.offsetTop;
          if (top + noteHeight > columnBoundaryHeight) {
            const prev = idx > 0 ? group[idx - 1] : null;
            const prevBottom = prev ? (parseFloat(prev.elem.style.top || 0) + (prev.elem.getBoundingClientRect().height || 0)) : 0;
            const minTop = prev ? prevBottom + 6 : 0;
            const raisedTop = columnBoundaryHeight - noteHeight;
            if (raisedTop >= minTop) {
              top = raisedTop;
            } else {
              const tokenId = item.pElem.getAttribute('data-token-id');
              const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
              if (contElem && contElem !== item.pElem) {
                const page = contElem.closest('.a4-page');
                const isRightCol = !!contElem.closest('.right-col');
                const destMargin = page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null;
                if (destMargin) {
                  const next = idx < group.length - 1 ? group[idx + 1] : null;
                  const maxTop = next ? (parseFloat(next.elem.style.top || Infinity) - noteHeight - 6) : Infinity;
                  const contTop = contElem.offsetTop;
                  if (contTop <= maxTop) {
                    destMargin.appendChild(item.elem);
                    top = contTop;
                  }
                }
              }
            }
          }
          item.elem.style.top = top + 'px';
        });
      });
    }

    /* ============================================================
       סריקת והחלת תוחמי טקסט (הערות שוליים והערות סיום)
       ============================================================ */
    function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt) {
      const activeStyles = [];

      const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
      const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
      if (fnOpen && fnClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose }, target: 'footnote' },
          instanceId: 'builtin-footnote'
        });
      }

      const enOpen = document.getElementById('en-delim-open')?.value?.trim();
      const enClose = document.getElementById('en-delim-close')?.value?.trim();
      if (enOpen && enClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: enOpen, close: enClose }, target: 'endnote' },
          instanceId: 'builtin-endnote'
        });
      }

      importedTextStyles.forEach(inst => {
        const trig = inst.def && inst.def.trigger;
        if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
        const scope = trig.appliesWithin;
        if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
        activeStyles.push(inst);
      });

      if (!activeStyles.length) return;
      const effHostSize = hostSizePt || 12;

      const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let n;
      while (n = walker.nextNode()) textNodes.push(n);

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        let matches = [];
        activeStyles.forEach(inst => {
          const trig = inst.def.trigger;
          let searchFrom = 0;
          while (true) {
            const oIdx = text.indexOf(trig.open, searchFrom);
            if (oIdx === -1) break;
            const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
            if (cIdx === -1) break;
            matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
            searchFrom = cIdx + trig.close.length;
          }
        });
        if (!matches.length) return;
        matches.sort((a,b) => a.start - b.start);
        const dedup = [];
        let lastEnd = -1;
        matches.forEach(m => { if (m.start >= lastEnd) { dedup.push(m); lastEnd = m.end; } });

        const frag = document.createDocumentFragment();
        let cursor = 0;
        dedup.forEach(m => {
          if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
          if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
            const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
            const innerText = text.slice(m.start + openLen, m.end - closeLen);
            const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
            frag.appendChild(marker);
          } else {
            const span = document.createElement('span');
            span.textContent = text.slice(m.start, m.end);
            applyExtStyleToNode(span, m.inst.def.style, effHostSize);
            frag.appendChild(span);
          }
          cursor = m.end;
        });
        if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }

    function getHostSizePt(level, customStyleId) {
      if (customStyleId) {
        const inst = findExtTextStyle(customStyleId);
        if (inst && inst.def.style && typeof inst.def.style.size === 'number') return inst.def.style.size;
        return 12;
      }
      const el = document.getElementById('s-h' + level);
      return el ? parseFloat(el.value) : 12;
    }
    function getBodySizePt() {
      const el = document.getElementById('size-body');
      return el ? parseFloat(el.value) : 12;
    }

    /* ===================== NOTES: footnotes + endnotes ===================== */
    const HEBREW_ALEF_BET = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
    function toHebrewLetterSeq(n) {
      if (n <= 0) return '';
      let result = '', num = n;
      while (num > 0) { num--; result = HEBREW_ALEF_BET[num % 22] + result; num = Math.floor(num / 22); }
      return result;
    }
    let noteCounters = { footnote: 0, endnote: 0 };
    let noteUidCounter = 0;
    let footnoteQueueForPage = [];
    let endnoteQueueForPart = [];

    function getNoteConfig(styleId) {
      const inst = findExtTextStyle(styleId);
      return (inst && inst.def.noteConfig) || {};
    }
    function formatNoteMarker(n, styleId) {
      const cfg = getNoteConfig(styleId);
      return (cfg.numberingStyle === 'alphabetic') ? toHebrewLetterSeq(n) : String(n);
    }
    function resetNoteCounterIfNeeded(target, trigger) {
      importedTextStyles.forEach(inst => {
        if (inst.def.target === target) {
          const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt) || (target === 'footnote' ? 'page' : 'part');
          if (resetAt === trigger) noteCounters[target] = 0;
        }
      });
    }
    function applyNoteMarkerStyle(el, isBacklink) {
      const typeEl = document.getElementById('note-marker-type');
      const sizeEl = isBacklink ? document.getElementById('note-listing-num-size') : document.getElementById('note-marker-size');
      const type = (!isBacklink && typeEl) ? typeEl.value : 'normal';
      const size = sizeEl ? parseFloat(sizeEl.value) : 8;
      el.style.fontSize = size + 'pt';
      el.style.fontWeight = '700';
      el.style.textDecoration = 'none';
      el.style.color = 'inherit';
      el.style.cursor = 'pointer';
      if (type === 'super') { el.style.verticalAlign = 'super'; el.style.lineHeight = '0'; }
      else if (type === 'sub') { el.style.verticalAlign = 'sub'; el.style.lineHeight = '0'; }
      else { el.style.verticalAlign = 'baseline'; }
      if (!isBacklink && type === 'brackets') { el.textContent = '[' + el.textContent + ']'; }
    }
    function createNoteMarkerAndQueue(text, styleId, target) {
      noteCounters[target] = (noteCounters[target] || 0) + 1;
      const num = noteCounters[target];
      const markerText = formatNoteMarker(num, styleId);
      const uid = 'n' + (noteUidCounter++);
      const marker = document.createElement('a');
      marker.className = 'note-marker';
      marker.href = '#note-' + uid;
      marker.id = 'noteref-' + uid;
      marker.textContent = markerText;
      applyNoteMarkerStyle(marker, false);
      const item = { number: markerText, text: text, styleId: styleId, uid: uid };
      if (target === 'footnote') footnoteQueueForPage.push(item);
      else endnoteQueueForPart.push(item);
      return marker;
    }

    function buildNoteBlockElement(queue, columns) {
      const wrap = document.createElement('div');
      wrap.className = 'note-block';
      if (columns === 2) wrap.style.columnCount = '2';
      const sepEl = document.getElementById('note-num-separator');
      const globalSep = sepEl ? sepEl.value : '.';
      queue.forEach(item => {
        const line = document.createElement('div');
        line.className = 'note-line';
        line.id = 'note-' + item.uid;
        const num = document.createElement('a');
        num.className = 'note-line-num';
        num.href = '#noteref-' + item.uid;
        num.textContent = item.number + globalSep + ' ';
        applyNoteMarkerStyle(num, true);
        const body = document.createElement('span');
        body.textContent = item.text;
        const inst = findExtTextStyle(item.styleId);
        if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
        line.appendChild(num); line.appendChild(body);
        wrap.appendChild(line);
      });
      return wrap;
    }

    function buildNoteRuleElement() {
      const sel = document.getElementById('note-rule-style');
      const style = sel ? sel.value : 'plain';
      const rule = document.createElement('div');
      if (style === 'none') { rule.style.display = 'none'; return rule; }
      if (style === 'plain') { rule.className = 'note-rule-plain'; return rule; }
      const glyphs = { dots: '◦◦◦', sparkle: '❖❖❖', star: '✧✧✧', diamond: '♦♦♦' };
      rule.className = 'note-rule-decorative';
      const segR = document.createElement('span'); segR.className = 'rule-seg';
      const mid = document.createElement('span'); mid.className = 'rule-glyphs'; mid.textContent = glyphs[style] || '';
      const segL = document.createElement('span'); segL.className = 'rule-seg';
      rule.appendChild(segR); rule.appendChild(mid); rule.appendChild(segL);
      return rule;
    }

    // מדפיסה בפועל את הערות השוליים מעל מספר העמוד ומאפסת את התור
    function flushFootnotesInto(pageEl) {
      if (!footnoteQueueForPage.length) { 
        resetNoteCounterIfNeeded('footnote', 'page'); 
        return; 
      }
      const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
      const rule = buildNoteRuleElement();
      const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
      const area = document.createElement('div');
      area.className = 'footnote-area';
      area.appendChild(rule);
      area.appendChild(block);

      const wrapper = pageEl.querySelector('.page-content-wrapper');
      const footer = pageEl.querySelector('.page-number-footer');
      if (wrapper && footer) {
        wrapper.insertBefore(area, footer);
      } else {
        pageEl.appendChild(area);
      }

      footnoteQueueForPage = [];
      resetNoteCounterIfNeeded('footnote', 'page');
    }

    function flushEndnotesForPart(container, pIdx) {
      if (!endnoteQueueForPart.length) { resetNoteCounterIfNeeded('endnote', 'part'); return 0; }
      const cfg0 = getNoteConfig(endnoteQueueForPart[0].styleId);
      const columns = cfg0.columns || 1;
      let pagesUsed = 0;
      let remaining = endnoteQueueForPart.slice();
      while (remaining.length) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        applyContentBg(page, 'regular');
        const title = document.createElement('div');
        title.className = 'title-level-2-standalone';
        title.textContent = pagesUsed === 0 ? 'הערות' : 'הערות (המשך)';
        page.appendChild(title);
        const wrap = document.createElement('div');
        wrap.className = 'note-block endnote-page-block';
        if (columns === 2) wrap.style.columnCount = '2';
        page.appendChild(wrap);
        container.appendChild(page);
        let fit = 0;
        for (let i = 0; i < remaining.length; i++) {
          const testBlock = buildNoteBlockElement(remaining.slice(0, i + 1), columns);
          wrap.innerHTML = ''; wrap.appendChild(testBlock);
          if (wrap.scrollHeight > page.clientHeight - 60 && i > 0) { break; }
          fit = i + 1;
        }
        remaining = remaining.slice(fit);
        pagesUsed++;
        if (pagesUsed > 200) break;
      }
      endnoteQueueForPart = [];
      resetNoteCounterIfNeeded('endnote', 'part');
      return pagesUsed;
    }

    function measureNoteBlockHeight(queue, columns) {
      if (!queue.length) return 0;
      const probe = buildNoteBlockElement(queue, columns);
      probe.style.position = 'absolute'; probe.style.visibility = 'hidden'; probe.style.width = '160mm';
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      document.body.removeChild(probe);
      return h;
    }

    // קריאת קובץ SVG / תמונה והסרת נעילת פרופורציות
    function handleImageUpload(event, targetInputId) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        reader.onload = function(e) {
          let svgText = e.target.result;
          if (svgText.includes('preserveAspectRatio')) {
            svgText = svgText.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
          } else {
            svgText = svgText.replace(/<svg\b/, '<svg preserveAspectRatio="none"');
          }
          const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
          const targetInput = document.getElementById(targetInputId);
          if (targetInput) {
            targetInput.value = dataUrl;
            targetInput.setAttribute('value', dataUrl);
            typesetDocument();
          }
        };
        reader.readAsText(file);
      } else {
        reader.onload = function(e) {
          const targetInput = document.getElementById(targetInputId);
          if (targetInput) {
            targetInput.value = e.target.result;
            targetInput.setAttribute('value', e.target.result);
            typesetDocument();
          }
        };
        reader.readAsDataURL(file);
      }
    }

    // שמירת כל התבנית לצמיתות כולל כל ערכות הנושא המותאמות
    function saveAsDefaultTemplate() {
      let dataIsland = document.getElementById('ext-imports-data');
      if (!dataIsland) {
        dataIsland = document.createElement('script');
        dataIsland.type = 'application/json';
        dataIsland.id = 'ext-imports-data';
        document.head.appendChild(dataIsland);
      }
      dataIsland.textContent = JSON.stringify({
        pageTypes: importedPageTypes,
        textStyles: importedTextStyles,
        imagePages: importedImagePages,
        customThemes: customThemes
      });

      document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"], input[type="color"], input[type="range"]').forEach(input => {
        input.setAttribute('value', input.value);
      });
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) cb.setAttribute('checked', 'checked');
        else cb.removeAttribute('checked');
      });
      document.querySelectorAll('select').forEach(sel => {
        Array.from(sel.options).forEach(opt => {
          if (opt.value === sel.value) opt.setAttribute('selected', 'selected');
          else opt.removeAttribute('selected');
        });
      });

      const rawInputElem = document.getElementById('raw-input');
      const prevVal = rawInputElem.value;
      rawInputElem.innerHTML = '';
      rawInputElem.value = '';

      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      rawInputElem.value = prevVal;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'torani-typesetting-template.html';
      a.click();
      URL.revokeObjectURL(a.href);
    }

    async function loadSystemFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const availableFonts = await window.queryLocalFonts();
          const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));
          
          if (fontFamilies.length > 0) {
            document.querySelectorAll('.font-picker').forEach(select => {
              const currentVal = select.value;
              select.innerHTML = '';
              
              const sysGroup = document.createElement('optgroup');
              sysGroup.label = `גופני מחשב (${fontFamilies.length} נמצאו)`;
              
              fontFamilies.forEach(family => {
                const opt = document.createElement('option');
                opt.value = `'${family}', serif`;
                opt.textContent = family;
                if (currentVal.includes(family)) opt.selected = true;
                sysGroup.appendChild(opt);
              });
              
              select.appendChild(sysGroup);
            });
            alert(`נטענו בהצלחה ${fontFamilies.length} גופנים מהמחשב!`);
          }
        } catch (err) {
          alert('לא ניתנה הרשאה לגישה לגופני המחשב.');
        }
      } else {
        alert('הדפדפן אינו תומך בגישה ישירה לגופני המערכת. מומלץ להשתמש ב-Chrome או Edge.');
      }
    }

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

    function updateGrid() {
      const root = document.documentElement;
      const rawCol = parseFloat(document.getElementById('prop-col').value) || 0;
      const rawMargin = parseFloat(document.getElementById('prop-margin').value) || 0;
      const rawGutter = parseFloat(document.getElementById('prop-gutter').value) || 0;
      const rawGap = parseFloat(document.getElementById('prop-gap').value) || 0;
      const total = 2 * rawCol + 2 * rawMargin + rawGutter + 2 * rawGap;
      const scale = total > 0 ? 100 / total : 1;
      root.style.setProperty('--w-col', (rawCol * scale) + '%');
      root.style.setProperty('--w-margin', (rawMargin * scale) + '%');
      root.style.setProperty('--w-gutter', (rawGutter * scale) + '%');
      root.style.setProperty('--w-gap', (rawGap * scale) + '%');
      root.style.setProperty('--flow-mt', document.getElementById('prop-mt').value + 'px');
      root.style.setProperty('--flow-mb', document.getElementById('prop-mb').value + 'px');
    }

    function updateStyles() {
      const root = document.documentElement;
      root.style.setProperty('--fn-header-r', document.getElementById('f-hdr-r').value);
      root.style.setProperty('--sz-header-r', document.getElementById('s-hdr-r').value + 'pt');
      root.style.setProperty('--fn-header-c', document.getElementById('f-hdr-c').value);
      root.style.setProperty('--sz-header-c', document.getElementById('s-hdr-c').value + 'pt');
      root.style.setProperty('--fn-header-l', document.getElementById('f-hdr-l').value);
      root.style.setProperty('--sz-header-l', document.getElementById('s-hdr-l').value + 'pt');

      root.style.setProperty('--fn-h0', document.getElementById('f-h0').value);
      root.style.setProperty('--sz-h0', document.getElementById('s-h0').value + 'pt');
      root.style.setProperty('--fn-h0-body', document.getElementById('f-h0-body').value);
      root.style.setProperty('--sz-h0-body', document.getElementById('s-h0-body').value + 'pt');

      root.style.setProperty('--fn-h1', document.getElementById('f-h1').value);
      root.style.setProperty('--sz-h1', document.getElementById('s-h1').value + 'pt');
      root.style.setProperty('--fn-h2', document.getElementById('f-h2').value);
      root.style.setProperty('--sz-h2', document.getElementById('s-h2').value + 'pt');
      root.style.setProperty('--fn-h3', document.getElementById('f-h3').value);
      root.style.setProperty('--sz-h3', document.getElementById('s-h3').value + 'pt');
      root.style.setProperty('--fn-h4', document.getElementById('f-h4').value);
      root.style.setProperty('--sz-h4', document.getElementById('s-h4').value + 'pt');
      root.style.setProperty('--fn-h5', document.getElementById('f-h5').value);
      root.style.setProperty('--sz-h5', document.getElementById('s-h5').value + 'pt');
      root.style.setProperty('--fn-h6', document.getElementById('f-h6').value);
      root.style.setProperty('--sz-h6', document.getElementById('s-h6').value + 'pt');
      root.style.setProperty('--fn-h7', document.getElementById('f-h7').value);
      root.style.setProperty('--sz-h7', document.getElementById('s-h7').value + 'pt');

      root.style.setProperty('--fn-sh-title', document.getElementById('f-sh-title').value);
      root.style.setProperty('--sz-sh-title', document.getElementById('s-sh-title').value + 'pt');
      root.style.setProperty('--fn-sh-sub', document.getElementById('f-sh-sub').value);
      root.style.setProperty('--sz-sh-sub', document.getElementById('s-sh-sub').value + 'pt');
      root.style.setProperty('--fn-sh-desc', document.getElementById('f-sh-desc').value);
      root.style.setProperty('--sz-sh-desc', document.getElementById('s-sh-desc').value + 'pt');
      root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec').value);
      root.style.setProperty('--sz-sh-sec', document.getElementById('s-sh-sec').value + 'pt');
      root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author').value);
      root.style.setProperty('--sz-sh-author', document.getElementById('s-sh-author').value + 'pt');
      root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year').value);
      root.style.setProperty('--sz-sh-year', document.getElementById('s-sh-year').value + 'pt');

      root.style.setProperty('--fn-first-word', document.getElementById('font-first-word').value);
      root.style.setProperty('--sz-first-word', document.getElementById('size-first-word').value + 'em');
      root.style.setProperty('--fn-body', document.getElementById('font-body').value);
      root.style.setProperty('--sz-body', document.getElementById('size-body').value + 'pt');
    }

    function createDropWord(text, isContinuation, isSingleLine) {
      if (isContinuation) return text;
      text = text.trim();
      const firstSpace = text.indexOf(' ');
      if (firstSpace === -1) {
        return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${text}</span>`;
      }
      const firstWord = text.substring(0, firstSpace);
      const rest = text.substring(firstSpace + 1);
      return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${firstWord}</span> ${rest}`;
    }

    function renderHeaderSectionHTML(type, customText, h1Title, h2Title, h3Title, bookTitle, tocFallback) {
      if (type === 'h1') return h1Title || tocFallback || '';
      if (type === 'h2') return h2Title || tocFallback || '';
      if (type === 'h3') return h3Title || '';
      if (type === 'book_title') return bookTitle || '';
      if (type === 'custom') return customText || '';
      if (type === 'diamonds') return '<span style="letter-spacing:3px;">◈ ❖ ◈</span>';
      if (type === 'spear') return '<svg style="height:9px; width:48px;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#444" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#444"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#444"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#444"/></svg>';
      if (type === 'swash') return '<svg style="height:12px; width:44px; fill:#444;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>';
      if (type === 'pen') return '<svg style="height:12px; width:44px;" viewBox="0 0 280 80"><g stroke="#444" fill="none" stroke-linecap="round"><path d="M30,55 C12,42 22,22 38,28 C50,32 55,48 45,58 C35,68 18,60 14,46 C10,32 25,18 42,22 C65,28 85,65 118,68 C128,69 135,62 135,50 C135,38 124,32 115,38" stroke-width="3"/><path d="M250,55 C268,42 258,22 242,28 C230,32 225,48 235,58 C245,68 262,60 266,46 C270,32 255,18 238,22 C215,28 195,65 162,68 C152,69 145,62 145,50 C145,38 156,32 165,38" stroke-width="3"/></g></svg>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-hdr-c-img') ? document.getElementById('data-hdr-c-img').value : '';
        return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 100%; object-fit: contain; vertical-align: middle;" />` : '';
      }
      return '';
    }

    function getSectionDividerHTML(type) {
      if (type === 'pyramid') return '<div style="grid-column: 3 / 6; text-align: center; line-height: 0.9; margin: 18px 0 6px 0;"><div style="font-size: 10pt; letter-spacing: 6px;">❖ ❖ ❖</div><div style="font-size: 9pt; letter-spacing: 5px; margin-top: 3px;">❖ ❖</div><div style="font-size: 8pt; margin-top: 3px;">❖</div></div>';
      if (type === 'spear') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 200px; height: 22px; margin: auto;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/><path d="M165,20 C165,22 150,24 130,24 C95,24 55,21 30,20 C55,19 95,16 130,16 C150,16 165,18 165,20 Z" fill="#fff"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/><path d="M235,20 C235,22 250,24 270,24 C305,24 345,21 370,20 C345,19 305,16 270,16 C250,16 235,18 235,20 Z" fill="#fff"/></svg></div>';
      if (type === 'swash') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 170px; height: 18px; fill: #111; margin: auto;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg></div>';
      if (type === 'flourish') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 140px; height: 45px; fill: #000; margin: auto;" viewBox="0 0 240 90"><path d="M110,48 C105,44 92,30 82,30 C68,30 55,42 42,42 C30,42 22,32 22,22 C22,12 32,5 45,5 C60,5 72,18 78,28 C82,20 88,10 100,10 C108,10 114,16 114,24 C114,35 102,44 88,44 C72,44 58,35 48,22 C42,28 35,35 25,48 C15,62 10,72 20,82 C30,90 48,85 62,72 C78,58 92,54 110,48 Z"/><path d="M130,48 C135,44 148,30 158,30 C172,30 185,42 198,42 C210,42 218,32 218,22 C218,12 208,5 195,5 C180,5 168,18 162,28 C158,20 152,10 140,10 C132,10 126,16 126,24 C126,35 138,44 152,44 C168,44 182,35 192,22 C198,28 205,35 215,48 C225,62 230,72 220,82 C210,90 192,85 178,72 C162,58 148,54 130,48 Z"/></svg></div>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-sec-div-img') ? document.getElementById('data-sec-div-img').value : '';
        return imgSrc ? `<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><img src="${imgSrc}" style="max-width: 260px; max-height: 45px; margin: auto; display: block; object-fit: contain;" /></div>` : '';
      }
      return '';
    }

    /* ============================================================
       רינדור שער ראשי (Main Shaar)
       ============================================================ */
    function renderMainShaar(container, themeId) {
      const page = document.createElement('div');
      page.className = `a4-page main-shaar-page`;

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const subtitle = document.getElementById('inp-book-subtitle').value || "";
      const desc = document.getElementById('inp-book-desc').value || "";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let frameHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.mainShaar && customTheme.mainShaar.svgData) {
          frameHTML = `<img class="custom-bg-img" src="${customTheme.mainShaar.svgData}" alt="שער ראשי">`;
        }
        const m = customTheme.mainShaar || { top: 20, bottom: 16, right: 15, left: 15 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else if (themeId === 'builtin_1') {
        frameHTML = `
          <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
          <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
        `;
      } else if (themeId === 'builtin_2') {
        frameHTML = `
          <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
          <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
        `;
      } else if (themeId === 'builtin_3') {
        frameHTML = `
          <div class="m3-wavy-band"></div>
          <div class="m3-panel">
            <svg class="m3-corner tr" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner tl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner br" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner bl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
          </div>
        `;
      }

      page.innerHTML = `
        ${frameHTML}
        <div class="shaar-main-content theme-bounded-content" style="${boxStyle}">
          <div>
            <div class="bsd-header">בס"ד</div>
            <div class="sefer-label"></div>
            <div class="book-title-main">${title}</div>
            <div class="book-subtitle">${subtitle}</div>
            <svg style="width: 180px; height: 24px; margin: 12px auto;" viewBox="0 0 400 40">
              <circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/>
              <path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/>
              <path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/>
            </svg>
          </div>
          <div class="book-description">${desc}</div>
          <div class="book-sections-summary">${sections}</div>
          <div class="author-block"><br><span class="author-name">${author}</span></div>
          <div class="publication-footer">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער אחורי (Back Shaar - טור ימני)
       ============================================================ */
    function renderBackShaar(container, themeId) {
      const page = document.createElement('div');
      page.className = 'a4-page back-shaar-page';

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let bgHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.backShaar && customTheme.backShaar.svgData) {
          bgHTML = `<img class="custom-bg-img" src="${customTheme.backShaar.svgData}" alt="שער אחורי">`;
        }
        const m = customTheme.backShaar || { top: 22, bottom: 18, right: 15, left: 95 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else {
        let innerLace = '';
        if (themeId === 'builtin_2') innerLace = '<div class="m2-lace" style="border-right: 1px solid #ddd;"></div>';
        bgHTML = `<div class="back-shaar-bg-left"></div>`;
        boxStyle = `position:absolute; top:0; bottom:0; right:0; left:45%;`;
      }

      page.innerHTML = `
        ${bgHTML}
        <div class="theme-bounded-content" style="${boxStyle}">
          <div>
            <div style="font-size: 13pt; font-weight: 700; margin-bottom: 8px;">כל הזכויות שמורות</div>
            <div style="font-size: 10.5pt; line-height: 1.6; max-width: 90%; margin: 10px auto; color: #333;">
              אין לשכפל, להעתיק, לצלם, לתרגם, לאחסן במאגר מידע, למסור או לקלוט בכל דרך או אמצעי אלקטרוני, אופטי או מכני אחר כל חלק שהוא מספר זה, ללא רשות מפורשת בכתב מבעל הזכויות.
            </div>
          </div>
          <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 12px 10px; width: 85%;">
            <div style="font-weight: 700; font-size: 11pt; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 10pt; color: #555;">${sections}</div>
            <div style="font-size: 10.5pt; font-weight: 700; margin-top: 6px;">${author}</div>
          </div>
          <div style="font-size: 10pt; color: #666;">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער משנה (Sub Shaar - טור שמאלי)
       ============================================================ */
    function renderSubShaar(container, token, themeId) {
      const page = document.createElement('div');
      page.className = 'a4-page sub-shaar-page';
      page.setAttribute('data-token-id', token.id);
      page.id = `heading-tok-${token.id}`;
      
      let titleMain = token.text;
      let titleSub = '';

      if (token.text.includes('-') || token.text.includes('–') || token.text.includes('—')) {
        const parts = token.text.split(/[-–—]/);
        titleMain = parts[0].trim();
        titleSub = parts.slice(1).join(' - ').trim();
      }

      let bgHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.subShaar && customTheme.subShaar.svgData) {
          bgHTML = `<img class="custom-bg-img" src="${customTheme.subShaar.svgData}" alt="שער משנה">`;
        }
        const m = customTheme.subShaar || { top: 20, bottom: 20, right: 95, left: 15 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else {
        let innerLace = '';
        if (themeId === 'builtin_2') innerLace = '<div class="m2-lace" style="border-left: 1px solid #ddd;"></div>';
        bgHTML = `<div class="sub-shaar-bg-right"></div>`;
        boxStyle = `position:absolute; top:0; bottom:0; right:45%; left:0;`;
      }

      page.innerHTML = `
        ${bgHTML}
        <div class="theme-bounded-content" style="${boxStyle} justify-content:center;">
          <div class="sefer-label">חלק</div>
          <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
          ${titleSub ? `
            <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
              <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
            </svg>
            <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
        </div>
      `;
      container.appendChild(page);
    }

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      applyContentBg(page, pageRole || 'regular');

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, h1Title, h2Title, h3Title, bookTitle);

      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, h1Title, h2Title, h3Title, bookTitle);

      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, h1Title, h2Title, h3Title, bookTitle);

      page.innerHTML = `
        <div class="page-content-wrapper">
          <div class="top-header-grid">
            <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
            <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
            <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
          </div>
          <div class="page-body-flow">
		    ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${h2TokenId}" id="heading-tok-${h2TokenId}"` : ''}>${h2Text}</div>` : ''}
          </div>
          <div class="page-number-footer">${toGematria(pNum)}</div>
        </div>
      `;

      container.appendChild(page);
      const bodyFlow = page.querySelector('.page-body-flow');
      return { page, bodyFlow };
    }

    let lineToTokenMap = [];

    function parseMetadataFromText(rawText) {
      const lines = rawText.split('\n');
      const cleanLines = [];

      for (let line of lines) {
        const trimmed = line.trim();
        let match = false;

        if (/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-title').value = trimmed.replace(/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-subtitle').value = trimmed.replace(/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-desc').value = trimmed.replace(/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-sections').value = trimmed.replace(/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-author').value = trimmed.replace(/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-year').value = trimmed.replace(/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*/i, '').trim();
          match = true;
        }

        if (!match) {
          cleanLines.push(line);
        }
      }
      return cleanLines.join('\n');
    }

    function estimateSectionFillRatio(tokens) {
      const sampleFlow = document.querySelector('.page-body-flow');
      const perPageCapacity = (sampleFlow ? sampleFlow.clientHeight : 900) * 2;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;width:580px;';
      probe.className = 'page-body-flow';
      document.body.appendChild(probe);
      let totalHeight = 0;
      tokens.forEach(t => {
        if (t.type === 'p') {
          const p = document.createElement('p');
          p.innerHTML = createDropWord(t.text, false, true);
          probe.appendChild(p);
          totalHeight += p.getBoundingClientRect().height;
          probe.removeChild(p);
        } else if (t.type.startsWith('h')) {
          const h = document.createElement('div');
          h.className = t.customStyleId ? 'title-level-custom' : `title-level-${t.level}`;
          h.textContent = t.text;
          probe.appendChild(h);
          totalHeight += h.getBoundingClientRect().height;
          const hStyle = window.getComputedStyle(h);
          totalHeight += parseFloat(hStyle.marginTop) + parseFloat(hStyle.marginBottom);
          probe.removeChild(h);
        }
      });
      document.body.removeChild(probe);
      if (totalHeight <= 0) return 1;
      const naivePages = Math.ceil(totalHeight / perPageCapacity);
      if (naivePages <= 1) return 1;
      const ratio = totalHeight / (naivePages * perPageCapacity);
      return Math.max(0.3, Math.min(1, ratio));
    }

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
      
      const pMeasure = document.createElement('p');
      pMeasure.style.margin = '0';
      pMeasure.style.padding = '0';
      
      const words = text.trim().split(/\s+/);
      if (words.length === 0) return { lines: [], hasWindow: false };

      pMeasure.textContent = text;
      measureContainer.appendChild(pMeasure);
      const singleLineHeight = pMeasure.offsetHeight;
      pMeasure.textContent = "א";
      const oneLineH = pMeasure.offsetHeight;
      const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
      const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
      
      let html = '';
      if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${words[0]}</span> `;
        for (let i = 1; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      } else {
        for (let i = 0; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      }
      
      pMeasure.innerHTML = html;
      
      const lines = [];
      let currentLine = [];
      let currentTop = -1;
      
      for (let i = 0; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
          lines.push(currentLine.join(' '));
          currentLine = [words[i]];
          currentTop = top;
        } else {
          currentLine.push(words[i]);
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
      }
      
      measureContainer.innerHTML = '';
      return { lines, hasWindow: shouldApplyWindow };
    }

    function justifyColumnVertically(col, targetHeight, styleObj) {
      const currentH = col.scrollHeight;
      const diff = targetHeight - currentH;
      if (diff > 2 && diff <= 60) {
        let pElements = Array.from(col.querySelectorAll('p'));
        if (pElements.length > 1) {
           let extraSpacing = diff / (pElements.length - 1);
           pElements.slice(0, -1).forEach(p => {
             let currentMargin = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
             p.style.marginBottom = (currentMargin + extraSpacing) + 'px';
           });
        } else if (pElements.length === 1) {
           let p = pElements[0];
           let currentLineHeight = parseFloat(styleObj.lineHeight) || 1.34;
           let linesInfo = getLinesFromParagraph(p.getAttribute('data-raw-text') || p.textContent, col.offsetWidth, styleObj, false);
           let numLines = linesInfo.lines.length;
           if (numLines > 1) {
               let fontSizePx = parseFloat(styleObj.fontSize) * 1.333;
               let extraLh = (diff / numLines) / fontSizePx;
               p.style.lineHeight = (currentLineHeight + extraLh).toString();
           }
        }
      }
    }

    function balanceColumns(block, colWidth, styleObj) {
      const rCol = block.querySelector('.right-col');
      const lCol = block.querySelector('.left-col');
      const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
      if (allChildren.length === 0) return;

      let mergedItems = [];
      for (let child of allChildren) {
        if (child.tagName === 'P') {
          let id = child.getAttribute('data-token-id');
          let text = child.getAttribute('data-raw-text');
          let isCont = child.getAttribute('data-is-cont') === 'true';
          let sideNote = child.getAttribute('data-side-note');
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
          } else {
             mergedItems.push({ type: 'p', id: id, rawText: text, isCont: isCont, sideNote: sideNote });
          }
        } else {
          mergedItems.push({ type: 'h', id: child.getAttribute('data-token-id'), html: child.outerHTML, level: child.className.match(/title-level-(\d+)/)?.[1] });
        }
      }

      const items = mergedItems.map(item => {
        if (item.type === 'p') {
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
          return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow };
        }
        return item;
      });

      const splitPoints = [];
      for (let i = 0; i <= items.length; i++) {
        if (i < items.length && items[i].type === 'p') {
          let lines = items[i].lines;
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
          for (let l = 1; l < lines.length; l++) {
            splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines });
          }
        } else {
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
        }
      }

      const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) return true;
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        return true;
      });

      let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
      if (pointsToEvaluate.length === 0) return;

      function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = 'p-end';
          p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);
        }
      }

      let bestSplit = pointsToEvaluate[0];
      let minAbsDiff = Infinity;

      for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pRight = document.createElement('p');
          pRight.className = 'p-cut';
          let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
          pRight.innerHTML = createDropWord(rightText, item.isCont, false);
          rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pLeft = document.createElement('p');
          pLeft.className = 'p-end';
          let leftText = sp.lines.slice(sp.lineIndex).join(' ');
          pLeft.innerHTML = createDropWord(leftText, true, false);
          lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) renderSingleItemFast(lCol, items[i]);
        let lHeight = lCol.scrollHeight;
        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);
        
        if (absDiff < minAbsDiff || (absDiff === minAbsDiff && diff >= 0)) {
            minAbsDiff = absDiff;
            bestSplit = sp;
        }
      }

      rCol.innerHTML = '';
      lCol.innerHTML = '';
      const rMargin = block.querySelector('.right-margin');
      const lMargin = block.querySelector('.left-margin');
      rMargin.innerHTML = '';
      lMargin.innerHTML = '';
      const finalNotes = [];

      function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = isPartial && isRight ? 'p-cut' : 'p-end';
          p.setAttribute('data-token-id', item.id);
          
          let textToRender = isPartial ? partialText : item.rawText;
          p.setAttribute('data-raw-text', textToRender);
          p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
          if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);

          if (item.sideNote && !isCont) {
            if (item.noteTarget === 'footnote' || item.noteTarget === 'endnote') {
              const marker = createNoteMarkerAndQueue(item.sideNote, item.sideNoteStyleId, item.noteTarget);
              p.insertBefore(marker, p.firstChild);
            } else {
              const noteElem = document.createElement('div');
              noteElem.className = 'side-note-anchor';
              noteElem.textContent = item.sideNote;
              if (item.sideNoteStyleId) {
                const inst = findExtTextStyle(item.sideNoteStyleId);
                if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
              }
              margin.appendChild(noteElem);
              finalNotes.push({ elem: noteElem, pElem: p });
            }
          }
        }
      }

      for (let i = 0; i < bestSplit.itemIndex; i++) appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
      if (bestSplit.lineIndex > 0) {
        let item = items[bestSplit.itemIndex];
        let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
        appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont);
        let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
        appendItemFinal(lCol, lMargin, item, false, true, leftText, true);
      }
      for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
      }

      let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
      if (finalDiff > 2 && finalDiff <= 60) {
          justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
      } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
          justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
      }

      finalizeNotePositions(finalNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
    }

    /* ============================================================
       מנוע העימוד המרכזי
       ============================================================ */
    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      const fnLinePrefix = document.getElementById('fn-line-prefix')?.value?.trim() || 'כותרת 7 -';
      const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      let pendingSideNoteStyleId = null;
      let pendingNoteTarget = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת סיום
        if (enLinePrefix && line.startsWith(enLinePrefix)) {
          pendingSideNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'endnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת שוליים
        if (fnLinePrefix && line.startsWith(fnLinePrefix)) {
          pendingSideNote = line.slice(fnLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          pendingSideNoteStyleId = null;
          pendingNoteTarget = 'footnote';
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת כותרות מובנות (0-7)
        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            pendingSideNote = txt;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = 'footnote';
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          // בדיקת קידומות מתוספים מיובאים
          let customMatch = null;
          for (const inst of importedTextStyles) {
            const trig = inst.def && inst.def.trigger;
            if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
              customMatch = { inst, text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim() };
              break;
            }
          }
          if (customMatch) {
            if (customMatch.inst.def.target === 'footnote' || customMatch.inst.def.target === 'endnote') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = customMatch.inst.def.target;
              lineToTokenMap[lineIdx] = null;
            } else if (customMatch.inst.def.layoutMode === 'side_note') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              pendingNoteTarget = null;
              lineToTokenMap[lineIdx] = null;
            } else {
              const lvl = customMatch.inst.syntheticLevel;
              const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: customMatch.text, lineIdx: lineIdx, customStyleId: customMatch.inst.instanceId };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
            }
          } else {
            const tokenObj = { id: tokens.length, type: 'p', text: line, sideNote: pendingSideNote, sideNoteStyleId: pendingSideNoteStyleId, noteTarget: pendingNoteTarget, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
            pendingSideNote = null;
            pendingSideNoteStyleId = null;
            pendingNoteTarget = null;
          }
        }
      }

      const headingModes = {
        0: document.getElementById('mode-h0').value,
        1: document.getElementById('mode-h1').value,
        2: document.getElementById('mode-h2').value,
        3: document.getElementById('mode-h3').value,
        4: document.getElementById('mode-h4').value,
        5: document.getElementById('mode-h5').value,
        6: document.getElementById('mode-h6').value,
        7: document.getElementById('mode-h7').value
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
      });

      const oddPageRequired = {
        0: document.getElementById('odd-h0').checked,
        1: document.getElementById('odd-h1').checked,
        2: document.getElementById('odd-h2').checked
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
      });

      function ensureOddPageStart(level) {
        if (!oddPageRequired[level]) return;
        if (pageIndex % 2 === 0) {
          const blank = document.createElement('div');
          blank.className = 'a4-page blank-page';
          container.appendChild(blank);
          pageIndex++;
        }
      }

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
        if (mode === 'sub_shaar') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          sections.push({ type: 'sub_shaar', token: t, tokens: [] });
          currentSection = { type: 'body', tokens: [] };
        } else if (mode === 'new_page_1col') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          currentSection = { type: 'body', isNewPage: true, hToken: t, tokens: [] };
        } else {
          currentSection.tokens.push(t);
        }
      });
      if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
        sections.push(currentSection);
      }

      const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
      const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
          gtocShows.push(inst.syntheticLevel);
          if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
        }
      });

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const showBackShaar = document.getElementById('show-back-shaar').checked;
      const activeThemeId = document.getElementById('active-theme-select').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // רינדור שער ראשי
      if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId);
        renderExtAnchor(container, 'afterMainShaar', rawText);
      } else {
        renderExtAnchor(container, 'beforeAll', rawText);
      }

      // רינדור שער אחורי (גב השער)
      if (showBackShaar) {
        renderBackShaar(container, activeThemeId);
      }

      // רינדור תוכן עניינים כללי
      if (enableGeneralTOC) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(
          container, 
          generalTocEntries, 
          "תוכן העניינים הכללי", 
          bookTitle, 
          "תוכן העניינים הכללי", 
          pageIndex,
          "תוכן העניינים הכללי", "תוכן העניינים הכללי",
          "gtoc"
        );
        pageIndex += pagesRendered;
      }
      renderExtAnchor(container, 'afterGeneralToc', rawText);

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      // פונקציית עזר: חישוב גובה הערות השוליים שהצטברו לעמוד הנוכחי
      function getFootnotesReservedHeight() {
        if (!footnoteQueueForPage.length) return 0;
        const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
        return measureNoteBlockHeight(footnoteQueueForPage, cfg0.columns || 1) + 24;
      }

      let hasOpenPart = false;
      let prevPageEl = null;

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
          if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
          renderExtAnchor(container, 'beforeEachPart', rawText);
          hasOpenPart = true;
          ensureOddPageStart(sec.token.level);
          renderSubShaar(container, sec.token, activeThemeId);
          if (sec.token.customStyleId) {
            const inst = findExtTextStyle(sec.token.customStyleId);
            const justRendered = container.lastElementChild;
            if (inst && justRendered) {
              const tEl = justRendered.querySelector('.book-title-main');
              const sEl = justRendered.querySelector('.book-subtitle');
              if (tEl) applyExtStyleToNode(tEl, inst.def.style, 36);
              if (sEl) applyExtStyleToNode(sEl, inst.def.style, 21);
            }
          }
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
            importedTextStyles.forEach(inst => {
              if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                dtocShows.push(inst.syntheticLevel);
                if (inst.def.toc.grouping) dtocGroups.push(inst.syntheticLevel);
              }
            });
            const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
            const dtocPages = renderPaginatedTOC(
              container, 
              detailedTocEntries, 
              "מפתח ולוח עניינים מפורט", 
              currentH1Title, 
              "תוכן העניינים המפורט", 
              pageIndex,
              currentH1Title, "תוכן העניינים המפורט",
              "dtoc"
            );
            pageIndex += dtocPages;
          }
          renderExtAnchor(container, 'afterEachPart', rawText);
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.level === 0;

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;
        const sectionFillRatio = (document.getElementById('balance-chapter-end').value === 'yes')
          ? estimateSectionFillRatio(secTokens) : 1;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
          if (prevPageEl) flushFootnotesInto(prevPageEl);
          if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);
          const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
          let pageLayout = createPageLayout(
            container, 
            isFirstPage ? h2Text : '', 
            isFirstPage ? h2Id : undefined, 
            pageIndex, 
            currentH1Title, 
            currentH2Title,
            currentH3Title,
            bookTitle,
            customR, customC, customL,
            pageRole
          );
          pageIndex++;
          prevPageEl = pageLayout.page;
		  
          let remPageHeight = pageLayout.bodyFlow.clientHeight * sectionFillRatio;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
             if (title && sec.hToken.customStyleId) {
                const inst = findExtTextStyle(sec.hToken.customStyleId);
                if (inst) renderCustomHeadingInto(title, inst, h2Text);
             }
             let used = 0;
             if (spacer) used += spacer.getBoundingClientRect().height;
             if (title) {
                 used += title.getBoundingClientRect().height;
                 const titleStyle = window.getComputedStyle(title);
                 used += parseFloat(titleStyle.marginTop) + parseFloat(titleStyle.marginBottom);
             }
             remPageHeight -= used;
          }
          isFirstPage = false;

          if (isH0) {
            const singleBlock = document.createElement('div');
            singleBlock.className = 'block-single-col';
            singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
            pageLayout.bodyFlow.appendChild(singleBlock);
            const targetCol = singleBlock.querySelector('.single-wide-col');
            let pageHasContent = false;

            while (tokenIndex < secTokens.length || pendingWordTokens) {
              const currentAvailH = remPageHeight - getFootnotesReservedHeight();
              if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                break;
              }

              let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

              if (currentTok.type.startsWith('h')) {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                hElem.setAttribute('data-token-id', currentTok.id);
                if (currentTok.customStyleId) {
                  const inst = findExtTextStyle(currentTok.customStyleId);
                  if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                } else {
                  hElem.textContent = currentTok.text;
                }
                applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }

                if (document.getElementById('avoid-widows-select').value === 'yes'
                    && (tokenIndex + 1 < secTokens.length)
                    && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                    && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p') {
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                  pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                  
                  const availH = remPageHeight - getFootnotesReservedHeight();
                  if (targetCol.scrollHeight <= availH) {
                    bestFitLine = i;
                  } else {
                    break;
                  }
                }

                if (bestFitLine === 0) {
                  targetCol.removeChild(pElem);
                  if (targetCol.children.length > 0) {
                    let lastEl = targetCol.lastElementChild;
                    while (lastEl && lastEl.className.startsWith('title-level-')) {
                      targetCol.removeChild(lastEl);
                      tokenIndex--;
                      lastEl = targetCol.lastElementChild;
                    }
                    break;
                  } else {
                    if (!pageHasContent) {
                        bestFitLine = 1;
                    } else {
                        break;
                    }
                  }
                }

                if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                  const remainingAfterSplit = lines.length - bestFitLine;
                  if (bestFitLine === 1 && pageHasContent) {
                    targetCol.removeChild(pElem);
                    break;
                  } else if (remainingAfterSplit === 1) {
                    if (bestFitLine > 1) {
                      bestFitLine -= 1;
                    } else if (pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    }
                  }
                }

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                applyDelimiterStyles(pElem, 'body', getBodySizePt());

                if (isEndOfP) {
                  pendingWordTokens = null;
                  tokenIndex++;
                } else {
                  pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                  break;
                }
              }
            }
            continue;
          }

          let pagePendingNotes = [];

          while ((tokenIndex < secTokens.length || pendingWordTokens) && (remPageHeight - getFootnotesReservedHeight()) > 45) {
            let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
            const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              const currentAvailH = remPageHeight - getFootnotesReservedHeight();
              if (currentAvailH < 60) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              const spanTitle = document.createElement('div');
              spanTitle.className = 'h3-title-text';
              spanTitle.setAttribute('data-token-id', peekTok.id);
              spanTitle.id = `heading-tok-${peekTok.id}`;
              if (peekTok.customStyleId) {
                const inst = findExtTextStyle(peekTok.customStyleId);
                if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text); else spanTitle.textContent = peekTok.text;
              } else {
                spanTitle.textContent = peekTok.text;
              }
              applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId));
              spanBlock.appendChild(spanTitle);
              pageLayout.bodyFlow.appendChild(spanBlock);

              const spanHeight = spanBlock.getBoundingClientRect().height + 4;
              if (spanHeight > (remPageHeight - getFootnotesReservedHeight())) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }
              if (document.getElementById('avoid-widows-select').value === 'yes'
                  && (tokenIndex + 1 < secTokens.length)
                  && ((remPageHeight - getFootnotesReservedHeight()) - spanHeight < 30)) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }

              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanHeight;
              tokenIndex++;
              continue;
            }

            const block2Col = document.createElement('div');
            block2Col.className = 'block-2col';
            block2Col.innerHTML = `
              <div class="margin-notes-column right-margin"></div>
              <div></div>
              <div class="main-column right-col"></div>
              <div></div>
              <div class="main-column left-col"></div>
              <div></div>
              <div class="margin-notes-column left-margin"></div>
            `;
            pageLayout.bodyFlow.appendChild(block2Col);

            const rCol = block2Col.querySelector('.right-col');
            const lCol = block2Col.querySelector('.left-col');
            const rMargin = block2Col.querySelector('.right-margin');
            const lMargin = block2Col.querySelector('.left-margin');
            const colWidth = rCol.offsetWidth || 272;
            let pageHasContent = false;

            ['right', 'left'].forEach((colName) => {
              let targetCol = colName === 'right' ? rCol : lCol;
              let targetMargin = colName === 'right' ? rMargin : lMargin;

              while (tokenIndex < secTokens.length || pendingWordTokens) {
                let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                const currentAvailH = remPageHeight - getFootnotesReservedHeight();
                if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h')) {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                  hElem.setAttribute('data-token-id', currentTok.id);
				          hElem.id = `heading-tok-${currentTok.id}`;
                  if (currentTok.customStyleId) {
                    const inst = findExtTextStyle(currentTok.customStyleId);
                    if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                  } else {
                    hElem.textContent = currentTok.text;
                  }
                  applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                  targetCol.appendChild(hElem);

                  if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (document.getElementById('avoid-widows-select').value === 'yes'
                      && (tokenIndex + 1 < secTokens.length)
                      && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                      && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p') {
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
                  let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                  let isContinuation = !!pendingWordTokens;
                  let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                  const pElem = document.createElement('p');
                  pElem.setAttribute('data-token-id', currentTok.id);
                  pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                  targetCol.appendChild(pElem);

                  if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  let bestFitLine = 0;
                  for (let i = 1; i <= lines.length; i++) {
                    let testText = lines.slice(0, i).join(' ');
                    pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                    pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                    
                    const availH = remPageHeight - getFootnotesReservedHeight();
                    if (targetCol.scrollHeight <= availH) {
                      bestFitLine = i;
                    } else {
                      break;
                    }
                  }

                  if (bestFitLine === 0) {
                    targetCol.removeChild(pElem);
                    if (targetCol.children.length > 0) {
                      let lastEl = targetCol.lastElementChild;
                      while (lastEl && lastEl.className.startsWith('title-level-')) {
                        targetCol.removeChild(lastEl);
                        tokenIndex--;
                        lastEl = targetCol.lastElementChild;
                      }
                      break;
                    } else {
                      if (!pageHasContent) {
                          bestFitLine = 1;
                      } else {
                          break;
                      }
                    }
                  }

                  if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                    const remainingAfterSplit = lines.length - bestFitLine;
                    if (bestFitLine === 1 && pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    } else if (remainingAfterSplit === 1) {
                      if (bestFitLine > 1) {
                        bestFitLine -= 1;
                      } else if (pageHasContent) {
                        targetCol.removeChild(pElem);
                        break;
                      }
                    }
                  }

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                  applyDelimiterStyles(pElem, 'body', getBodySizePt());

                  if (!isContinuation && currentTok.sideNote) {
                    if (currentTok.noteTarget === 'footnote' || currentTok.noteTarget === 'endnote') {
                      const marker = createNoteMarkerAndQueue(currentTok.sideNote, currentTok.sideNoteStyleId, currentTok.noteTarget);
                      pElem.insertBefore(marker, pElem.firstChild);
                    } else {
                      pElem.setAttribute('data-side-note', currentTok.sideNote);
                      const noteElem = document.createElement('div');
                      noteElem.className = 'side-note-anchor';
                      noteElem.textContent = currentTok.sideNote;
                      if (currentTok.sideNoteStyleId) {
                        const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                        if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                      }
                      targetMargin.appendChild(noteElem);
                      pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                    }
                  }

                  if (isEndOfP) {
                    pendingWordTokens = null;
                    tokenIndex++;
                  } else {
                    pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                    break;
                  }
                }
              }
            });

            if (rCol.children.length === 0 && lCol.children.length === 0) {
                pageLayout.bodyFlow.removeChild(block2Col);
                let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                    pageLayout.bodyFlow.removeChild(lastFlowEl);
                    tokenIndex--;
                    lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                }
                break;
            }

            if (tokenIndex >= secTokens.length && !pendingWordTokens) {
              balanceColumns(block2Col, colWidth, styleObj);
              const divHTML = getSectionDividerHTML(secDivStyle);
              if (divHTML) {
                const divContainer = document.createElement('div');
                divContainer.innerHTML = divHTML;
                pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
              }
              break;
            } else {
              let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
              const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';
              if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                balanceColumns(block2Col, colWidth, styleObj);
              } else {
                let usedBlockH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
                let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
                if (finalDiff > 2 && finalDiff <= 60) {
                    justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
                } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                    justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
                }
              }
            }
            
            remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
            finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
          }
        }
      }

      if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
      if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
      else if (endnoteQueueForPart.length) { flushEndnotesForPart(container, pageIndex); }
      renderExtAnchor(container, 'afterAll', rawText);

      document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
        const targetId = span.getAttribute('data-target-id');
        if (targetId && headingPageMap[targetId]) {
          span.textContent = headingPageMap[targetId];
        }
      });
    }

    function buildStructuredTOC(tokenList, showLevels, groupLevels) {
      const entries = [];
      const minGroupLevel = groupLevels.length > 0 ? Math.min(...groupLevels) : 99;
      let currentGroupItems = [];

      function flushGroup() {
        if (currentGroupItems.length > 0) {
          entries.push({ isGroup: true, items: currentGroupItems.slice() });
          currentGroupItems = [];
        }
      }

      tokenList.forEach(t => {
        const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') ? t.text : t.sideNote;
        if (lvl === null || !txt) return;
        if (!showLevels.includes(lvl)) return;

        if (lvl >= minGroupLevel) {
          currentGroupItems.push({ id: t.id, level: lvl, text: txt });
        } else {
          flushGroup();
          entries.push({ id: t.id, level: lvl, text: txt, isGroup: false });
        }
      });

      flushGroup();
      return entries;
    }

    function renderPaginatedTOC(container, entries, titleText, bookTitle, h1Title, pageIndex, curH1, curH2, tocPrefix) {
      if (entries.length === 0) return 0;

      let pagesCount = 0;
      let currentEntryIdx = 0;
      let lastRenderedGrid = null;
      let lastRenderedPage = null;

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      
      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);

      function getTocStyle(level) {
        const f = document.getElementById(`f-${tocPrefix}-${level}`);
        const s = document.getElementById(`s-${tocPrefix}-${level}`);
        if(f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
        return '';
      }

      while (currentEntryIdx < entries.length) {
        const isFirstTOCPage = (pagesCount === 0);
        pagesCount++;

        const page = document.createElement('div');
        page.className = 'a4-page toc-page';
        applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
        lastRenderedPage = page;
        
        page.innerHTML = `
          <div class="page-content-wrapper">
            <div class="top-header-grid">
              <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
              <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
              <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
            </div>
            <div class="page-body-flow">
              ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
              <div class="toc-grid-full"></div>
            </div>
            <div class="page-number-footer">${toGematria(pageIndex + pagesCount - 1)}</div>
          </div>
        `;
        container.appendChild(page);

        const gridFull = page.querySelector('.toc-grid-full');
        lastRenderedGrid = gridFull;

        const bodyFlow = page.querySelector('.page-body-flow');
        const maxH = bodyFlow.clientHeight || 870;

        let pageStartIndex = currentEntryIdx;
        let lastSubjectIdx = currentEntryIdx; 

        while (currentEntryIdx < entries.length) {
          const it = entries[currentEntryIdx];
          
          if (!it.isGroup && (it.level === 1 || it.level === 2)) {
             lastSubjectIdx = currentEntryIdx;
          }

          let itemHTML = '';
          
          if (it.isGroup) {
            const inlineSpans = it.items.map(grp => 
              `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${grp.id}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${grp.text}</span> - <span class="grp-page" data-target-id="${grp.id}"></span></a></span>`
            ).join('<span class="grp-sep">|</span>');
            itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
          } else {
            itemHTML = `
              <div class="toc-entry-group" style="${getTocStyle(it.level)}">
                <a href="#heading-tok-${it.id}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
                  <span class="toc-title">${it.text}</span>
                  <span class="toc-dots"></span>
                  <span class="toc-page-num" data-target-id="${it.id}"></span>
                </a>
              </div>
            `;
          }

          gridFull.insertAdjacentHTML('beforeend', itemHTML);
          
          if (bodyFlow.scrollHeight > maxH) {
            gridFull.lastElementChild.remove();
            
            if (gridFull.children.length > 0) {
                if (lastSubjectIdx > pageStartIndex) {
                    const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                    for (let k = 0; k < itemsToRemove; k++) {
                        gridFull.lastElementChild.remove();
                    }
                    currentEntryIdx = lastSubjectIdx;
                }
                break;
            } else {
                gridFull.insertAdjacentHTML('beforeend', itemHTML);
                currentEntryIdx++;
                break;
            }
          }
          
          currentEntryIdx++;
        }
      }

      if (lastRenderedGrid) {
        lastRenderedGrid.style.justifyContent = 'flex-start';
      }
      if (lastRenderedPage) {
        applyContentBg(lastRenderedPage, 'tocLast');
      }

      return pagesCount;
    }

    const textarea = document.getElementById('raw-input');

    function syncCursorToPreview() {
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const currentLineIdx = textBefore.split('\n').length - 1;

      if (lineToTokenMap && lineToTokenMap[currentLineIdx] !== undefined) {
        let tokenId = lineToTokenMap[currentLineIdx];
        if (tokenId === null) {
          for (let k = currentLineIdx - 1; k >= 0; k--) {
            if (lineToTokenMap[k] !== null && lineToTokenMap[k] !== undefined) {
              tokenId = lineToTokenMap[k];
              break;
            }
          }
        }

        if (tokenId !== null && tokenId !== undefined) {
          const targetEl = document.querySelector(`[data-token-id="${tokenId}"]`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }

    textarea.addEventListener('click', syncCursorToPreview);
    textarea.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        syncCursorToPreview();
      }
    });

    function rehydrateExtImports() {
      const island = document.getElementById('ext-imports-data');
      if (!island || !island.textContent.trim()) return;
      let data;
      try { data = JSON.parse(island.textContent); } catch(e) { return; }
      (data.pageTypes || []).forEach(inst => {
        importedPageTypes.push(inst);
        buildExtPanel('pageType', inst.instanceId, inst.def.name, inst.def);
      });
      (data.textStyles || []).forEach(inst => {
        importedTextStyles.push(inst);
        buildExtPanel('textStyle', inst.instanceId, inst.def.name, inst.def);
      });
      (data.imagePages || []).forEach(inst => {
        importedImagePages.push(inst);
        buildExtPanel('imagePage', inst.instanceId, 'תמונה: ' + inst.name, null);
      });
      if (data.customThemes && Array.isArray(data.customThemes)) {
        customThemes = data.customThemes;
        refreshCustomThemesUI();
      }
      let maxCounter = 0;
      let maxSynth = 7;
      [...importedPageTypes, ...importedTextStyles, ...importedImagePages].forEach(inst => {
        const n = parseInt((inst.instanceId.match(/-(\d+)$/) || [0,0])[1], 10);
        if (n >= maxCounter) maxCounter = n + 1;
        if (typeof inst.syntheticLevel === 'number' && inst.syntheticLevel > maxSynth) maxSynth = inst.syntheticLevel;
      });
      extImportCounter = maxCounter;
      nextSyntheticLevel = maxSynth + 1;
    }

    window.onload = function() {
      refreshCustomThemesUI();
      rehydrateExtImports();
      
      if (document.getElementById('section-divider-style').value === 'custom_img') {
        document.getElementById('row-sec-div-img').style.display = 'flex';
      }
      if (document.getElementById('hdr-c-type').value === 'custom_img') {
        document.getElementById('row-hdr-c-img').style.display = 'flex';
      }

      textarea.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - סימן א - דיני תפילת השחר וזמנה
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום ((כאן הערת שוליים בתוך הטקסט הנלמדת מדברי הראשונים)).
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית [[כאן הערת סיום מורחבת המרוכזת בסוף החלק]].

כותרת 3 - ענף א: שיטת הרמב"ם בדין אונס ועבר זמן תפילה
גוף הטקסט בטורים המיושרים באופן מושלם. פסקאות אלו מדגימות את מנגנון האיזון המדויק המופעל בכל חיתוך.
כאשר טור אחד ימני מתמלא הוא מעביר שורות שלמות בלבד אל הטור השמאלי כדי שלא תיווצר מילה בודדת קטועה.
העימוד התורני מקפיד מאוד על שלמות הפסקאות והשורות כך שהקריאה תהיה רציפה ונעימה לעין הלומד.

כותרת 4 - סעיף א: בירור דעת בעל השאילתות
גוף הטקסט הבא תחת סעיף א מיועד לבאר את דברי הראשונים. כל פסקה מקבלת חלון מילה ראשונה רק אם היא מחזיקה שתי שורות ומעלה. פסקאות קצרות של שורה אחת אינן מקבלות חלון מילה ראשונה כדי למנוע שיבושים בעימוד הפסקאות הבאות אחריהן.
פיסקה קצרה.

כותרת 5 - סעיף ב: יישוב קושיית הנודע ביהודה
גוף הטקסט ממשיך לזרום בטורים שווים.

כותרת 7 - הערה נחוצה בדבר קריאת שמע של שחרית
גוף הטקסט המכיל הערות שוליים בצד הדף. ההערות ממוקמות בדיוק מול הפסקה אליה הן מתייחסות, ובכך מאפשרות ללומד לעיין במקורות תוך כדי לימודו הרציף בגוף הספר.`;
      typesetDocument();
    };
  </script>
</body></html>
```

---

## פנייה 9: משהו לא בסדר... כל כותרות 7 הפכו להערות שוליים.. וגם הפאנל לא מוגדר נכון הערת…

משהו לא בסדר...
כל כותרות 7 הפכו להערות שוליים..
וגם הפאנל לא מוגדר נכון
הערת שוליים מוגדרת ע"י סימונים כמו "[" "]" ולא ע"י קידומת
הערות סיום מוגדרות ע"י קידומת כמו "הערת סיום - " ולא ע"י סימונים
וחוץ מזה גם כניסתי לשנות את הקידומת הדף נשאר כשהיה

---

### 🤖 תגובה 26: Reviewing Feedback Received I'm currently digesting the feedback regarding the…

**Reviewing Feedback Received**

I'm currently digesting the feedback regarding the Level 7 headings, specifically the issue where they've morphed into footnotes. I need to pinpoint why this change occurred, and how to reinstate their original formatting as side notes. I'm investigating the codebase to trace the origin of this alteration and restore the intended presentation. The focus is now on identifying the precise code snippet responsible for this change.


**Analyzing Code's Intent**

I've been re-examining the original code, specifically the intention behind how level 7 headings were handled. It's clear that "כותרת 7" was always intended as a side note placed within the margins, but the current code diverges from this. I'm focusing on the matching logic and rendering to pinpoint where this side-note functionality was lost. Specifically, I'm examining how the `hMatch` and the rendering logic using `side-note-anchor` were originally supposed to work in harmony.


**Tracing the Footnote Deviation**

I've pinpointed the code alteration! My previous adjustments, where I assigned `pendingNoteTarget = 'footnote'` for "כותרת 7" or matched the "fn-line-prefix" with a default of "כותרת 7 -", rerouted the side note into the `footnoteQueueForPage`. This means "כותרת 7," which is meant as a side note in the margin, erroneously ended up as a footnote at the bottom. This is a critical distinction, as footnotes are defined by inline delimiters (like `((...))` or `[...]`) and endnotes by line prefixes, not "כותרת 7".


**Clarifying Note Types**

I now understand the critical distinction between note types. Footnotes at the bottom should ONLY be triggered by inline delimiters. Endnotes, conversely, MUST use only a line prefix, no inline delimiters are allowed. The system needs to ensure these two types do not overlap. I'm investigating why changes to the endnote line prefix didn't update the display. My analysis indicates the use of `oninput` for all prefixes may be a better approach than `onchange`. I also need to verify that the prefix is properly incorporated during tokenization.


**Verifying Tokenization and Rendering**

I'm now focusing on ensuring that the `typesetDocument` function is correctly re-tokenizing and re-rendering based on live delimiter input values. I'm also tracing the rendering process for endnotes, created using prefixes, and their proper queuing. The goal is to ensure a clear separation between the two note types. I also want to verify that Level 7 headings are still being attached correctly as side notes and not routed to bottom footnotes.


**Reconciling Endnote Attachments**

I'm now grappling with how an endnote line relates to surrounding text. I've realized that when a line begins with the `enLinePrefix` (defaulting to `הערת סיום -`), it should either attach to the previous paragraph or mark a location within the text for the endnote's reference. The tricky part is ensuring that the endnote marker correctly links to the correct part of the text, either before or after. I'm focusing on modifying the parser to correctly insert markers based on the endnote prefix.


**Refining Paragraph Attachments**

I'm now clarifying how endnotes attach to paragraphs. If an endnote line (`enLinePrefix`) is found, I'm verifying the tokenizer's logic. I need to make sure the endnote text attaches either to the preceding or succeeding paragraph correctly, and that the endnote marker links to the correct location in the text. I'm focusing on the implementation of a pending mechanism for attaching an endnote to a paragraph, and handling both preceding and succeeding paragraph cases.


**Defining Endnote Placement**

I'm now determining the correct placement logic for endnotes relative to paragraphs. I've realized that notes before paragraphs should attach to the next paragraph, aligning with the existing "כותרת 7" style. This aligns with the template example. I'll test this behavior and also consider whether the note should attach to the previous paragraph, as well.


**Implementing Pending Endnote Logic**

I'm now implementing the `pendingSideNote` / `pendingEndnote` pattern. If a line with the endnote prefix follows a paragraph, I need to insert the endnote marker into the preceding text when the paragraph is rendered or queued. I'm focusing on ensuring this happens correctly when the paragraph is rendered, correctly linking to a proper reference and queueing the endnote. I am also checking why `onchange` does not trigger the display to update, but `oninput` does.


**Separating Note Types**

I am now completely separating side notes, endnotes, and footnotes, as it should be. The code should now handle `pendingSideNote` exclusively for level 7 headings (`כותרת 7`) and side-note styles, and `pendingEndNote` exclusively for lines with the `enLinePrefix`. Footnotes will rely only on inline delimiters. This should clarify placement and behavior for each type.


**Verifying Attachment Logic**

I am now verifying the logic for attaching both endnotes and side notes to paragraphs. I'm focusing on ensuring the correct endnote marker is inserted into the text, and that the endnote text is correctly queued. I'm confirming that level 7 headings (`כותרת 7`) are correctly handled as side notes, separate from endnotes, and also checking that footnotes are rendered independently based on delimiters. The focus is on robust attachment mechanisms.


**Restoring Side-Note Placement**

I've successfully restored "כותרת 7" headings to their intended role as side notes within the margin. The updated code now correctly places the side note within the target margin, ensuring its visibility. I am now focused on the proper handling of the associated endnotes, created using the prefix, making sure that they are correctly queued and displayed.


**Confirming Footnote Functionality**

I am now confirming the functionality of inline footnotes. With `[` and `]` or `((` and `))` delimiters defined, the system correctly extracts footnote text and inserts the proper marker. I have verified that plain `indexOf` in `applyDelimiterStyles` accurately handles these delimiters without regex issues. This ensures the correct parsing of inline footnotes, like `[הערה זו תופיע בתחתית הדף]`.

---

### 🤖 תגובה 27: Observing Proper Roles Okay, so I've successfully reinstated "כותרת 7" as a…

**Observing Proper Roles**

Okay, so I've successfully reinstated "כותרת 7" as a true side note, anchoring it in the margin as intended. I've also begun to configure the "הערות שוליים" (footnotes) section, focusing on its bottom-of-page placement.


**Refining Placement Logic**

I'm now refining the placement logic for endnote markers within paragraphs defined by line prefixes. I've successfully implemented appending the marker to the paragraph element (`pElem`) before it closes. Now, I'm tackling the column-split scenario, ensuring the marker correctly attaches to the final part of the paragraph or the text before line splitting. This requires careful consideration of `isEndOfP` flags and split line measurements.

---

### 🤖 תגובה 28: הבנתי בדיוק את ההפרדה הנדרשת: 1. כותרת 7 (הערת צד / שוליים חיצוניים): חוזרת…

הבנתי בדיוק את ההפרדה הנדרשת:
1. **כותרת 7 (הערת צד / שוליים חיצוניים):** חוזרת לייעודה המקורי ככותרת צד בשולי העמוד (`margin-notes-column`), ולא יורדת לתחתית הדף.
2. **הערות שוליים (בתחתית הדף):** מוגדרות **אך ורק באמצעות תוחמים בתוך הטקסט** (כגון `[` ו-`]` או `((` ו-`))`), ללא שדה קידומת שורה.
3. **הערות סיום (בסוף החלק):** מוגדרות **אך ורק באמצעות קידומת שורה** (כגון `הערת סיום -`), ללא תוחמים בתוך הטקסט.
4. **עדכון מיידי בזמן אמת:** כל שדות הקלט עודכנו ל-`oninput="typesetDocument()"`, כך שכל שינוי בקידומת או בתוחמים מעדכן את התצוגה המקדימה מיידית תוך כדי הקלדה.

הנה הקוד המלא, המתוקן והשלם של כל הקובץ:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מערכת עימוד תורנית מקצועית לדפי A4</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

  /* ============================================================
     משתני CSS גלובליים: גדלי גופנים, רשת העמוד, צבעים.
     ============================================================ */
  :root {
    --fn-header-r: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-r: 13pt;
    --fn-header-c: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-c: 11pt;
    --fn-header-l: 'AAd_Livorna4', 'David Libre', 'David', serif;
    --sz-header-l: 13pt;

    --fn-h0: 'David Libre', 'David', serif;
    --sz-h0: 18pt;
    --fn-h0-body: 'Frank Ruhl Libre', serif;
    --sz-h0-body: 11.5pt;

    --fn-h1: 'Lia Sgula', 'Bellefair', serif;
    --sz-h1: 50pt;
    --fn-h1-sub: 'David Libre', 'David', serif;
    --sz-h1-sub: 28pt;

    --fn-h2: 'AAd_AlphaBlack', 'David Libre', 'David', serif;
    --sz-h2: 17pt;
    --fn-h3: 'AAd_AlphaLight', 'Noto Serif Hebrew', serif;
    --sz-h3: 13.5pt;
    --fn-h4: 'FrankRuehl', 'Frank Ruhl Libre', serif;
    --sz-h4: 12.5pt;
    --fn-h5: 'David Libre', 'David', serif;
    --sz-h5: 11.5pt;
    --fn-h6: 'Noto Serif Hebrew', serif;
    --sz-h6: 10.5pt;
    --fn-h7: 'Hadassah Friedlaender', 'Hadassah', 'Noto Serif Hebrew', serif;
    --sz-h7: 6pt;

    --fn-sh-title: 'Bellefair', serif;
    --sz-sh-title: 46pt;
    --fn-sh-sub: 'David Libre', serif;
    --sz-sh-sub: 21pt;
    --fn-sh-desc: 'Frank Ruhl Libre', serif;
    --sz-sh-desc: 12pt;
    --fn-sh-sec: 'David Libre', serif;
    --sz-sh-sec: 11.5pt;
    --fn-sh-author: 'David Libre', serif;
    --sz-sh-author: 15pt;
    --fn-sh-year: 'David Libre', serif;
    --sz-sh-year: 12pt;

    --fn-body: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-body: 11.2pt;
    --fn-first-word: 'Rashi DP', 'Frank Ruhl Libre', serif;
    --sz-first-word: 1.5em;

    --w-margin: 7.5%;
    --w-gap: 2%;
    --w-col: 40%;
    --w-gutter: 2%;
    --flow-mt: 20px;
    --flow-mb: 20px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ============================================================
     איפוס בסיסי ותצוגת שני-חלקים (סרגל צד + תצוגה מקדימה)
     ============================================================ */
  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background-color: #555555;
    font-family: var(--fn-body);
    color: #000000;
    display: flex;
    flex-direction: row;
  }

  #sidebar {
    width: 540px;
    min-width: 380px;
    max-width: 800px;
    height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    box-shadow: -3px 0 15px rgba(0,0,0,0.3);
    z-index: 100;
    font-family: 'David Libre', serif;
    flex-shrink: 0;
  }

  #resizer {
    width: 6px;
    height: 100vh;
    background: #333333;
    cursor: col-resize;
    flex-shrink: 0;
    z-index: 110;
    transition: background 0.2s;
  }
  #resizer:hover, #resizer.resizing { background: #b8860b; }

  .sidebar-top-half {
    height: 36vh;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding-bottom: 6px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .sidebar-title { font-size: 12.5pt; font-weight: 700; }

  .btn-load-fonts {
    background-color: #2c3e50;
    color: #fff;
    border: none;
    padding: 3px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }

  #raw-input {
    width: 100%;
    flex: 1;
    font-family: monospace;
    font-size: 9pt;
    padding: 6px;
    border: 1px solid #777;
    border-radius: 3px;
    direction: rtl;
    resize: none;
  }

  .sidebar-scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
    margin-top: 4px;
  }

  .panel-static {
    background: #fbfbfb;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 8px 10px;
  }

  .panel-header {
    font-size: 10pt;
    font-weight: 700;
    background: #eaeaea;
    padding: 4px 8px;
    border-radius: 3px;
    margin: -8px -10px 8px -10px;
    color: #111;
    border-bottom: 1px solid #ccc;
  }

  .inline-cfg-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 5px;
    font-size: 8.5pt;
  }
  .inline-cfg-row label { font-weight: 700; width: 105px; flex-shrink: 0; font-size: 8pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .inline-cfg-row input[type="text"] { flex: 1; min-width: 80px; padding: 2px 4px; font-size: 8.5pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select { padding: 2px 3px; font-size: 8pt; border: 1px solid #aaa; border-radius: 2px; }
  .inline-cfg-row select.font-picker { width: 100px; }
  .inline-cfg-row input.size-input { width: 38px; text-align: center; font-size: 8pt; padding: 2px; border: 1px solid #aaa; border-radius: 2px; }

  .toc-levels-table {
    width: 100%;
    font-size: 8pt;
    margin-top: 4px;
    border-collapse: collapse;
  }
  .toc-levels-table th, .toc-levels-table td {
    padding: 2px 4px;
    text-align: right;
  }
  .toc-levels-table th { background: #eee; font-weight: 700; }

  .btn-bar-bottom {
    display: flex;
    gap: 6px;
    padding-top: 8px;
    border-top: 1.5px solid #ccc;
    background: #fff;
    flex-shrink: 0;
  }
  .btn-primary {
    background-color: #000;
    color: #fff;
    border: none;
    padding: 8px 12px;
    font-size: 10pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    flex-grow: 1;
  }
  .btn-save-template {
    background-color: #1e3a8a;
    color: #fff;
    border: none;
    padding: 8px 10px;
    font-size: 9pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
  }
  .btn-secondary {
    background-color: #f0f0f0;
    color: #000;
    border: 1px solid #666;
    padding: 8px 10px;
    font-size: 9pt;
    cursor: pointer;
    border-radius: 3px;
  }

  #preview-pane {
    flex-grow: 1;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 20px;
    scroll-behavior: smooth;
    background-color: #555555;
  }

  /* ============================================================
     עמוד ה-A4 עצמו
     ============================================================ */
  .a4-page {
    background-color: #ffffff;
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    padding: 15mm 15mm 15mm 15mm;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    position: relative;
    margin-bottom: 30px;
    page-break-after: always;
    overflow: hidden;
    flex-shrink: 0;
  }

  .page-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    justify-content: space-between;
  }

  /* ============================================================
     עמודי השער: ראשי, אחורי, ומשנה
     ============================================================ */
  .main-shaar-page {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
  }

  .shaar-main-content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm 16mm 12mm;
    z-index: 20;
    position: relative;
  }

  /* רקע נמתח מקצה לקצה - ללא שוליים מיותרים */
  .custom-bg-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100% !important;
    height: 100% !important;
    object-fit: fill !important;
    z-index: 5;
    pointer-events: none;
  }

  .bsd-header { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-bottom: 40px; }
  .sefer-label { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-top: 4px; }
  
  .book-title-main { font-family: var(--fn-sh-title); font-size: var(--sz-sh-title); line-height: 1.1; margin: 10px 0 40px 0; }
  .book-subtitle { font-family: var(--fn-sh-sub); font-size: var(--sz-sh-sub); font-weight: 700; line-height: 1.25; }
  .book-description { font-family: var(--fn-sh-desc); font-size: var(--sz-sh-desc); line-height: 1.5; max-width: 65%; margin: 10px auto; }
  .book-sections-summary { font-family: var(--fn-sh-sec); font-size: var(--sz-sh-sec); line-height: 1.5; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 6px 12px; margin: 8px 0; font-weight: 700; }
  .author-block { font-family: var(--fn-sh-author); font-size: calc(var(--sz-sh-author) * 0.85); line-height: 1.3; }
  .author-name { font-size: var(--sz-sh-author); font-weight: 700; }
  .publication-footer { font-family: var(--fn-sh-year); font-size: var(--sz-sh-year); font-weight: 700; letter-spacing: 1px; }

  .m1-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-bottom: 1px solid #d0d0d0; }
  .m1-bg-middle { position: absolute; top: 20%; left: 0; right: 0; height: 60%; background: #ffffff; }
  .m1-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 20%; background: linear-gradient(135deg, #f2f2f2 0%, #e2e2e2 100%); border-top: 1px solid #d0d0d0; }
  .m1-panel { position: absolute; top: 0; bottom: 0; left: 12%; right: 12%; background: #ffffff; border-right: 1px solid #ccc; border-left: 1px solid #ccc; box-shadow: 0 0 20px rgba(0,0,0,0.1); display: flex; justify-content: space-between; z-index: 10; }
  .m1-damask { width: 30px; height: 100%; background: #fafafa url("data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.35'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }
  
  .m2-bg-top { position: absolute; top: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-bg-middle { position: absolute; top: 18%; left: 0; right: 0; height: 64%; background: #ffffff; box-shadow: inset 0 2px 6px rgba(0,0,0,0.06), inset 0 -2px 6px rgba(0,0,0,0.06); }
  .m2-bg-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 18%; background: #eaeaea; }
  .m2-panel { position: absolute; top: 0; bottom: 0; left: 10%; right: 10%; background: #ffffff; box-shadow: 0 0 25px rgba(0,0,0,0.12); display: flex; justify-content: space-between; z-index: 10; }
  .m2-lace { width: 24px; height: 100%; background: #ffffff url("data:image/svg+xml,%3Csvg width='26' height='40' viewBox='0 0 26 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13,20 C4,16 2,8 2,2 C2,0 8,0 13,8 C18,0 24,0 24,2 C24,8 22,16 13,20 Z M13,20 C4,24 2,32 2,38 C2,40 8,40 13,32 C18,40 24,40 24,38 C24,32 22,24 13,20 Z M13,10 A3,3 0 1,0 13,16 A3,3 0 1,0 13,10 Z M13,30 A3,3 0 1,0 13,24 A3,3 0 1,0 13,30 Z' fill='%23888888' fill-opacity='0.45'/%3E%3C/svg%3E") repeat-y; flex-shrink: 0; }

  .m3-wavy-band { position: absolute; top: 14%; left: 0; right: 0; height: 72%; background: #ffffff; border-top: 1.5px solid #d4d4d4; border-bottom: 1.5px solid #d4d4d4; }
  .m3-panel { position: absolute; top: 0; bottom: 0; left: 9%; right: 9%; background: #ffffff; border-right: 1.5px solid #ccc; border-left: 1.5px solid #ccc; box-shadow: 0 0 25px rgba(0,0,0,0.14); z-index: 10; }
  .m3-corner { position: absolute; width: 65px; height: 65px; fill: #111; z-index: 25; }
  .m3-corner.tr { top: 10mm; right: 10mm; }
  .m3-corner.tl { top: 10mm; left: 10mm; transform: scaleX(-1); }
  .m3-corner.br { bottom: 10mm; right: 10mm; transform: scaleY(-1); }
  .m3-corner.bl { bottom: 10mm; left: 10mm; transform: scale(-1, -1); }

  /* שער משנה (שמאל) ושער אחורי (ימין) */
  .sub-shaar-page { position: relative; padding: 0; }
  .sub-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    left: 0;
    right: auto;
    width: 55%;
    background: #ffffff;
    border-right: 1.5px solid #ccc;
    box-shadow: 5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .sub-shaar-bg-right {
    position: absolute;
    top: 0; bottom: 0;
    right: 0; left: 55%;
    background: #f4f4f4;
  }
  .sub-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20mm 12mm;
    z-index: 20;
  }

  .back-shaar-page { position: relative; padding: 0; }
  .back-shaar-col {
    position: absolute;
    top: 0; bottom: 0;
    right: 0;
    left: auto;
    width: 55%;
    background: #ffffff;
    border-left: 1.5px solid #ccc;
    box-shadow: -5px 0 18px rgba(0,0,0,0.08);
    display: flex;
    z-index: 10;
  }
  .back-shaar-bg-left {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 55%;
    background: #f4f4f4;
  }
  .back-shaar-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 22mm 12mm 18mm 12mm;
    z-index: 20;
  }

  /* קופסת תוכן גמישה המותאמת לערכות נושא לפי 4 שוליים */
  .theme-bounded-content {
    position: absolute;
    width: auto !important;
    height: auto !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    z-index: 20;
    box-sizing: border-box;
  }

  /* ============================================================
     תוכן העניינים
     ============================================================ */
  .toc-page { padding: 15mm 15mm 15mm 15mm; }
  .toc-grid-full {
    display: flex;
    flex-direction: column;
    gap: 3px;
    justify-content: space-between;
    flex-grow: 1;
    width: 100%;
    max-width: 175mm;
    margin: 0 auto;
  }
  .toc-entry-group { break-inside: avoid; margin-bottom: 3px; }
  .toc-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2px;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
  }
  .toc-title {
    flex-shrink: 1;
    max-width: 84%;
    font-weight: 600;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: right;
    line-height: 1.3;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 1px dotted #777;
    margin: 0 8px;
    height: 1px;
    min-width: 25px;
  }
  .toc-page-num {
    flex-shrink: 0;
    font-weight: 700;
    font-family: 'David Libre', serif;
    font-size: 10.5pt;
    min-width: 25px;
    text-align: left;
  }
  
  .toc-lvl-1 { font-size: 12pt; font-weight: 700; margin-top: 8px; margin-bottom: 3px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
  .toc-lvl-2 { font-size: 11pt; font-weight: 700; margin-top: 5px; padding-right: 8px; }
  .toc-lvl-3 { font-size: 10.5pt; font-weight: 700; padding-right: 16px; }
  .toc-lvl-4 { padding-right: 24px; font-size: 10pt; }
  .toc-lvl-5 { padding-right: 32px; font-size: 9.5pt; }
  .toc-lvl-6 { padding-right: 40px; font-size: 9pt; }
  .toc-lvl-7 { padding-right: 48px; font-size: 8.8pt; }

  .toc-grouped-block {
    padding-right: 30px;
    font-size: 9pt;
    color: #222;
    line-height: 1.5;
    margin: 2px 0 5px 0;
    text-align: right;
    font-family: 'David Libre', serif;
  }
  .grp-item { font-size: inherit; white-space: normal; }
  .grp-title { font-weight: 600; color: #111; }
  .grp-page { font-weight: 700; color: #4a5568 !important; font-family: 'David Libre', serif; }
  .grp-sep { color: #888; margin: 0 6px; font-weight: bold; white-space: nowrap; }

  /* ============================================================
     הכותרת העליונה
     ============================================================ */
  .top-header-grid {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    align-items: center;
    height: 24px;
    flex-shrink: 0;
  }

  .header-col-r {
    grid-column: 3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-r);
    font-size: var(--sz-header-r);
    font-weight: 700;
  }
  .header-col-c {
    grid-column: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: visible;
    font-family: var(--fn-header-c);
    font-size: var(--sz-header-c);
  }
  .header-col-l {
    grid-column: 5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--fn-header-l);
    font-size: var(--sz-header-l);
    font-weight: 700;
  }

  /* ============================================================
     גוף הטקסט: כותרות, טורים, פסקאות
     ============================================================ */
  .title-level-2-standalone {
    font-family: var(--fn-h2);
    font-size: var(--sz-h2);
    font-weight: 700;
    text-align: center;
    margin-top: 0;
    margin-bottom: 40px;
    width: 100%;
    line-height: 1.25;
    flex-shrink: 0;
  }

  .h2-spacer { flex-basis: 33.33%; flex-shrink: 0; }

  .page-body-flow {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    flex-grow: 1;
    justify-content: flex-start;
    margin-top: var(--flow-mt);
    margin-bottom: var(--flow-mb);
    min-height: 0;
  }

  .block-2col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }

  .block-h3-span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 6px 0;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .block-h3-span .h3-title-text {
    font-family: var(--fn-h3);
    font-size: var(--sz-h3);
    font-weight: 900;
    text-align: center;
    width: 100%;
    line-height: 1.22;
  }

  .title-level-4 { font-family: var(--fn-h4); font-size: var(--sz-h4); font-weight: 900; text-align: center; margin: 9px 0 4px 0; line-height: 1.22; }
  .title-level-custom { margin: 9px 0 4px 0; line-height: 1.3; }
  
  .note-marker { line-height: 0; cursor: pointer; }
  
  /* אזור הערות השוליים - יושב בזרימה הטבעית מעל מספר העמוד */
  .footnote-area {
    position: relative;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 4px;
    flex-shrink: 0;
    z-index: 25;
  }
  
  .note-rule-plain { border-top: 1px solid #555; width: 35%; margin-bottom: 5px; }
  .note-rule-decorative { display: flex; align-items: center; gap: 6px; width: 62%; margin-bottom: 8px; }
  .note-rule-decorative .rule-seg { flex: 1; height: 1px; background: #555; }
  .note-rule-decorative .rule-glyphs { font-size: 9px; letter-spacing: 3px; color: #555; white-space: nowrap; }
  .note-block { font-size: 8.5pt; line-height: 1.5; }
  .note-line { break-inside: avoid; margin-bottom: 3px; }
  .note-line-num { font-weight: 700; margin-left: 3px; text-decoration: none; color: inherit; cursor: pointer; }
  .endnote-page-block { margin-top: 10mm; padding: 0 10mm; }
  .title-level-5 { font-family: var(--fn-h5); font-size: var(--sz-h5); font-weight: 700; text-align: center; margin: 7px 0 3px 0; line-height: 1.22; }
  .title-level-6 { font-family: var(--fn-h6); font-size: var(--sz-h6); font-weight: 700; text-align: center; margin: 6px 0 3px 0; line-height: 1.22; }

  .block-single-col {
    display: grid;
    grid-template-columns: var(--w-margin) var(--w-gap) calc(var(--w-col)*2 + var(--w-gutter)) var(--w-gap) var(--w-margin);
    width: 100%;
    position: relative;
    align-items: start;
  }
  .block-single-col .single-wide-col {
    grid-column: 3;
    font-family: var(--fn-h0-body);
    font-size: var(--sz-h0-body);
    line-height: 1.45;
    text-align: justify;
    text-justify: inter-word;
  }

  /* טורי הערות צד (כותרת 7) בשוליים */
  .margin-notes-column {
    font-family: var(--fn-h7);
    font-size: var(--sz-h7);
    line-height: 1.18;
    text-align: center;
    text-align-last: center;
    font-weight: 400;
    color: #404040;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .right-margin { grid-column: 1; }
  .left-margin { grid-column: 7; }
  .side-note-anchor { position: absolute; width: 100%; }

  .main-column {
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
    text-align: justify;
    text-justify: inter-word;
    min-height: 0;
    height: auto;
    position: relative;
  }

  .right-col { grid-column: 3; }
  .left-col { grid-column: 5; }

  p { margin-bottom: 7px; text-align: justify; text-justify: inter-word; position: relative; }
  p.p-end { text-align-last: center; }
  p.p-cut { text-align-last: justify; }

  .first-word-window {
    float: right;
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 0.85;
    height: 1.25em;
    margin-left: 6px;
    margin-bottom: 1px;
    display: block;
  }

  .first-word-inline {
    font-family: var(--fn-first-word);
    font-size: var(--sz-first-word);
    font-weight: 900;
    line-height: 1;
  }

  .page-number-footer {
    text-align: center;
    font-family: var(--fn-header-r);
    font-size: 12pt;
    font-weight: 700;
    height: 24px;
    flex-shrink: 0;
  }

  #measuring-box {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    top: -9999px;
    left: -9999px;
    font-family: var(--fn-body);
    font-size: var(--sz-body);
    line-height: 1.34;
  }

  @media print {
    @page { size: A4; margin: 0; }
    body { background: none; padding: 0; overflow: visible; display: block; }
    #sidebar, #resizer { display: none !important; }
    #preview-pane { height: auto !important; overflow: visible !important; padding: 0 !important; background: none !important; display: block !important; }
    .a4-page { box-shadow: none; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; max-height: 297mm !important; padding: 15mm !important; margin: 0 !important; page-break-after: always; break-after: page; position: relative; }
    .page-content-wrapper, .shaar-main-content, .sub-shaar-content-centered, .back-shaar-content-centered { height: 100% !important; }
  }
</style>
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">

      <!-- ============================================================
           פאנל 1: בחירת ערכת נושא פעילה לשערי הספר
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">👑 בחירת ערכת נושא לשערי הספר</div>
        
        <div class="inline-cfg-row" style="margin-bottom: 6px;">
          <label>ערכת נושא פעילה:</label>
          <select id="active-theme-select" style="flex:1;" onchange="typesetDocument()">
            <optgroup label="ערכות מובנות">
              <option value="builtin_1" selected="selected">1. דמסק ושיש מרכזי</option>
              <option value="builtin_2">2. תחרת סלסולים כפולה</option>
              <option value="builtin_3">3. קרנות וילנא וגיליושה</option>
            </optgroup>
            <optgroup id="custom-themes-optgroup" label="ערכות שהוטמעו בקובץ">
              <!-- מתמלא באופן דינמי מערכות מותאמות -->
            </optgroup>
          </select>
        </div>

        <div style="margin-bottom: 6px; display:flex; gap:12px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked" onchange="typesetDocument()"> שער ראשי</label>
          <label style="font-size: 8.5pt; font-weight: 700;" title="מציג שער אחורי בעמוד 2 (גב השער הראשי)"><input type="checkbox" id="show-back-shaar" onchange="typesetDocument()"> שער אחורי (גב השער)</label>
        </div>

        <div class="inline-cfg-row">
          <label>שם הספר:</label>
          <input type="text" id="inp-book-title" value="שם הספר" placeholder="שם הספר (כותרת ראשית)">
          <select id="f-sh-title" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-sh-title" class="size-input" value="46">
        </div>
        <div class="inline-cfg-row">
          <label>נושא / משנה:</label>
          <input type="text" id="inp-book-subtitle" value="נושא הספר מונסח בתמציות" placeholder="נושא / כותרת משנה">
          <select id="f-sh-sub" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-sub" class="size-input" value="21">
        </div>
        <div class="inline-cfg-row">
          <label>נושא מפורט:</label>
          <input type="text" id="inp-book-desc" value="נושא הספר בפרטות ובנוסח ארוך יותר" placeholder="נושא מפורט / תיאור החיבור">
          <select id="f-sh-desc" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-sh-desc" class="size-input" value="12">
        </div>
        <div class="inline-cfg-row">
          <label>פרטי מהדורא:</label>
          <input type="text" id="inp-book-sections" value="פרטי מהדורה | פרטי מהדורה" placeholder="פרטי מהדורא / חלקים">
          <select id="f-sh-sec" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-sec" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>שם המחבר:</label>
          <input type="text" id="inp-book-author" value="שם המחבר" placeholder="שם המחבר">
          <select id="f-sh-author" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-author" class="size-input" value="15">
        </div>
        <div class="inline-cfg-row">
          <label>מקום ושנה:</label>
          <input type="text" id="inp-book-year" value="מקום ההוצאה | שנת ההוצאה" placeholder="מקום ושנת הוצאה">
          <select id="f-sh-year" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select>
          <input type="number" id="s-sh-year" class="size-input" value="12">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div class="inline-cfg-row">
            <label>עיטור סיום פרק:</label>
            <select id="section-divider-style" style="flex:1;" onchange="document.getElementById('row-sec-div-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'; typesetDocument();">
              <option value="pyramid">1. פירמידת וילנא (❖ ❖ ❖)</option>
              <option value="spear" selected="selected">2. רומח מחודד עם טבעת (SVG)</option>
              <option value="swash">3. שושנתא וילנאית (SVG)</option>
              <option value="flourish">4. סלסול תורני כפול (SVG)</option>
              <option value="custom_img">5. תמונת עיטור אישית</option>
              <option value="none">ללא עיטור</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sec-div-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ עיטור פרק:</label>
            <input type="file" id="file-sec-div-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>

      <!-- ============================================================
           פאנל 2: יצירת והטמעת ערכת נושא חדשה (ראשי / אחורי / משנה)
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header" style="cursor:pointer;" onclick="togglePanelBody('new-theme-panel-body')">
          🎨 יצירת והטמעת ערכת נושא חדשה (SVG) <span style="font-size:8pt; font-weight:normal; float:left;">▼ פתח/סגור</span>
        </div>
        <div id="new-theme-panel-body">
          <div class="inline-cfg-row" style="margin-bottom: 6px;">
            <label style="color:#1e3a8a;">שם הערכה:</label>
            <input type="text" id="builder-theme-name" placeholder="הזן שם לערכת הנושא החדשה...">
          </div>

          <!-- הגדרות שער ראשי -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">🏛️ 1. שער ראשי (מרכז הדף):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-main-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-main-svg')">
              <input type="hidden" id="data-builder-main-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-main-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-main-bottom" value="16" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-main-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-main-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <!-- הגדרות שער אחורי -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📖 2. שער אחורי (טור ימני / גב השער):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-back-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-back-svg')">
              <input type="hidden" id="data-builder-back-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-back-top" value="22" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-back-bottom" value="18" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">ימין (mm):</label><input type="number" id="builder-back-right" value="15" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים משמאל תוחמים את הטור הימני">שמאל (mm):</label><input type="number" id="builder-back-left" value="95" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <!-- הגדרות שער משנה -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:3px; padding:6px; margin-bottom:6px;">
            <div style="font-weight:700; font-size:8pt; color:#1e3a8a; margin-bottom:4px;">📜 3. שער משנה (טור שמאלי / פותח חלק):</div>
            <div class="inline-cfg-row">
              <label>קובץ SVG:</label>
              <input type="file" id="file-builder-sub-svg" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-builder-sub-svg')">
              <input type="hidden" id="data-builder-sub-svg" value="">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px; margin-top:4px;">
              <div><label style="font-size:7pt; display:block;">עליון (mm):</label><input type="number" id="builder-sub-top" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">תחתון (mm):</label><input type="number" id="builder-sub-bottom" value="20" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;" title="השוליים מימין תוחמים את הטור השמאלי">ימין (mm):</label><input type="number" id="builder-sub-right" value="95" class="size-input" style="width:100%;"></div>
              <div><label style="font-size:7pt; display:block;">שמאל (mm):</label><input type="number" id="builder-sub-left" value="15" class="size-input" style="width:100%;"></div>
            </div>
          </div>

          <button class="btn-load-fonts" style="width:100%; padding:6px; background:#1e3a8a; margin-top:4px;" onclick="addNewCustomTheme()">➕ הטמע ערכת נושא זו בקובץ</button>
          
          <div id="custom-themes-list" style="margin-top:8px;"></div>
        </div>
      </div>

      <!-- פאנל ייבוא תוספים -->
      <div class="panel-static">
        <div class="panel-header">🧩 ייבוא תוספים (סוגי עמוד / סגנונות טקסט)</div>
        <div class="inline-cfg-row">
          <label>סוג עמוד:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handlePageTypeImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>סגנון טקסט:</label>
          <input type="file" accept=".json" style="flex:1;font-size:8pt;" onchange="handleTextStyleImportFile(event)">
        </div>
        <div class="inline-cfg-row">
          <label>תמונה כעמוד:</label>
          <input type="file" accept="image/*" style="flex:1;font-size:8pt;" onchange="handleImagePageImportFile(event)">
        </div>
      </div>
      <div id="ext-imports-container"></div>

      <!-- ============================================================
           פאנל הגדרות הערות מורחב ומדויק
           ============================================================ -->
      <div class="panel-static">
        <div class="panel-header">📝 הגדרות הערות (שוליים / סיום)</div>

        <!-- אזור הערות שוליים בתחתית הדף: מוגדר ע"י תוחמים בטקסט בלבד -->
        <div style="font-weight:700; font-size:8pt; margin: 2px 0 3px 0; color:#1e3a8a;">📌 הערות שוליים (בתחתית העמוד):</div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="fn-delim-open" value="[" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" oninput="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="fn-delim-close" value="]" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" oninput="typesetDocument()">
          </div>
        </div>

        <!-- אזור הערות סיום: מוגדר ע"י קידומת שורה בלבד -->
        <div style="font-weight:700; font-size:8pt; margin: 6px 0 3px 0; color:#1e3a8a; border-top:1px dashed #ddd; padding-top:4px;">📚 הערות סיום (מרוכזות בסוף חלק):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="en-line-prefix" value="הערת סיום -" placeholder="למשל: הערת סיום -" oninput="typesetDocument()">
        </div>

        <div style="border-top:1px dashed #ddd; margin-top:6px; padding-top:4px;"></div>
        <div class="inline-cfg-row"><label>סוג סימון בטקסט:</label>
          <select id="note-marker-type" onchange="typesetDocument()">
            <option value="super" selected="selected">כתב עילי</option>
            <option value="normal">רגיל (על השורה)</option>
            <option value="sub">כתב תחתי</option>
            <option value="brackets">בסוגריים מרובעים [1]</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>גודל סימון בטקסט:</label><input type="number" id="note-marker-size" value="8" class="size-input" oninput="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>גודל מס' ברשימה:</label><input type="number" id="note-listing-num-size" value="8" class="size-input" oninput="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>מפריד אחרי מספר:</label><input type="text" id="note-num-separator" value="." style="flex:0 0 40px;" oninput="typesetDocument()"></div>
        <div class="inline-cfg-row"><label>קו מפריד (שוליים):</label>
          <select id="note-rule-style" onchange="typesetDocument()">
            <option value="plain" selected="selected">קו רגיל</option>
            <option value="dots">קו + עיגולים ◦◦◦</option>
            <option value="sparkle">קו + ניצוץ ❖❖❖</option>
            <option value="star">קו + כוכבית ✧✧✧</option>
            <option value="diamond">קו + יהלום ♦♦♦</option>
            <option value="none">ללא קו</option>
          </select>
        </div>
      </div>

      <!-- פאנל איכות עימוד -->
      <div class="panel-static">
        <div class="panel-header">✍️ איכות עימוד אוטומטי</div>
        <div class="inline-cfg-row"><label>מניעת שורות בודדות:</label>
          <select id="avoid-widows-select" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
        <div class="inline-cfg-row"><label>איזון סוף-פרק:</label>
          <select id="balance-chapter-end" onchange="typesetDocument()">
            <option value="yes" selected="selected">כן</option>
            <option value="no">לא</option>
          </select>
        </div>
      </div>

      <!-- פאנל רקעים -->
      <div class="panel-static">
        <div class="panel-header">🎨 רקע לעמודי תוכן</div>
        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד טקסט רגיל:</label>
          <select id="cbg-regular-mode" style="flex:1;" onchange="toggleCbgSubRows('regular', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-regular-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-regular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-regular-img')">
          <input type="hidden" id="data-cbg-regular-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-regular-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-regular-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 0":</label>
          <select id="cbg-h0Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h0Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h0Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h0Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h0Open-img')">
          <input type="hidden" id="data-cbg-h0Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h0Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h0Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div class="inline-cfg-row" style="margin-bottom: 4px;">
          <label>עמוד "כותרת 2":</label>
          <select id="cbg-h2Open-mode" style="flex:1;" onchange="toggleCbgSubRows('h2Open', this.value)">
            <option value="none" selected="selected">ללא (ברירת מחדל)</option>
            <option value="color">צבע רקע אחיד</option>
            <option value="texture">מרקם עדין (דמשק דהוי)</option>
            <option value="image">תמונה מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-color" style="display:none; margin-bottom: 6px;">
          <label>צבע:</label><input type="color" id="cbg-h2Open-color" value="#f4f1e8">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-img" style="display:none; margin-bottom: 6px;">
          <label>קובץ:</label>
          <input type="file" id="file-cbg-h2Open-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-h2Open-img')">
          <input type="hidden" id="data-cbg-h2Open-img" value="">
        </div>
        <div class="inline-cfg-row" id="row-cbg-h2Open-op" style="display:none; margin-bottom: 8px;">
          <label>שקיפות תמונה:</label><input type="range" id="cbg-h2Open-opacity" min="0" max="100" value="15" style="flex:1;">
        </div>

        <div style="border-top: 1px dashed #ccc; margin: 8px 0 6px 0; padding-top: 6px;">
          <div style="font-size:8pt; font-weight:700; margin-bottom:6px;">תוכן העניינים</div>
          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד ראשון:</label>
            <select id="cbg-tocFirst-mode" style="flex:1;" onchange="toggleCbgSubRows('tocFirst', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocFirst-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocFirst-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocFirst-img')">
            <input type="hidden" id="data-cbg-tocFirst-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocFirst-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocFirst-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד רגיל (ביניים):</label>
            <select id="cbg-tocRegular-mode" style="flex:1;" onchange="toggleCbgSubRows('tocRegular', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocRegular-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocRegular-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocRegular-img')">
            <input type="hidden" id="data-cbg-tocRegular-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocRegular-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocRegular-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>

          <div class="inline-cfg-row" style="margin-bottom: 4px;">
            <label>עמוד אחרון:</label>
            <select id="cbg-tocLast-mode" style="flex:1;" onchange="toggleCbgSubRows('tocLast', this.value)">
              <option value="none" selected="selected">ללא (ברירת מחדל)</option>
              <option value="color">צבע רקע אחיד</option>
              <option value="texture">מרקם עדין (דמשק דהוי)</option>
              <option value="image">תמונה מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-color" style="display:none; margin-bottom: 6px;">
            <label>צבע:</label><input type="color" id="cbg-tocLast-color" value="#f4f1e8">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ:</label>
            <input type="file" id="file-cbg-tocLast-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-cbg-tocLast-img')">
            <input type="hidden" id="data-cbg-tocLast-img" value="">
          </div>
          <div class="inline-cfg-row" id="row-cbg-tocLast-op" style="display:none; margin-bottom: 8px;">
            <label>שקיפות תמונה:</label><input type="range" id="cbg-tocLast-opacity" min="0" max="100" value="15" style="flex:1;">
          </div>
        </div>
      </div>

      <!-- פאנל כותרות 0-7 -->
      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h0" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>טקסט כותרת 0:</label>
          <span style="font-size:7.5pt; color:#666; width:95px; flex-shrink:0;">(גוף ההקדמה)</span>
          <select id="f-h0-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Frank Ruhl Libre', serif" selected="selected">Frank Ruhl Libre</option></optgroup></select>
          <input type="number" id="s-h0-body" class="size-input" value="11.5" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 1 (שער משנה):</label>
          <select id="mode-h1"><option value="sub_shaar" selected="selected">שער משנה נפרד</option><option value="new_page_1col">טור 1 עמוד הבא</option></select>
          <select id="f-h1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Lia Sgula', serif" selected="selected">Lia Sgula</option></optgroup></select>
          <input type="number" id="s-h1" class="size-input" value="50">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h1" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
          <label style="font-size:6.8pt; display:flex; align-items:center; gap:2px; flex:0 0 auto;"><input type="checkbox" id="odd-h2" style="margin:0;">אי-זוגי</label>
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 3:</label>
          <select id="mode-h3"><option value="span_1col" selected="selected">טור 1 רציף (רוחב דף)</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h3" class="size-input" value="13.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 4:</label>
          <select id="mode-h4"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Alpha', serif" selected="selected">Alpha</option></optgroup></select>
          <input type="number" id="s-h4" class="size-input" value="12.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 5:</label>
          <select id="mode-h5"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaLight', serif" selected="selected">AlphaLight</option></optgroup></select>
          <input type="number" id="s-h5" class="size-input" value="11.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 6:</label>
          <select id="mode-h6"><option value="inline_2col" selected="selected">רציף 2 טורים</option><option value="side_note">כותרת צד</option></select>
          <select id="f-h6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Noto Serif Hebrew', serif" selected="selected">Noto Serif Hebrew</option></optgroup></select>
          <input type="number" id="s-h6" class="size-input" value="10.5" step="0.5">
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 7 (צד):</label>
          <select id="mode-h7"><option value="side_note" selected="selected">כותרת צד בשוליים</option><option value="inline_2col">רציף 2 טורים</option></select>
          <select id="f-h7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Hadassah Friedlaender', serif" selected="selected">Hadassah Friedlaender</option></optgroup></select>
          <input type="number" id="s-h7" class="size-input" value="6" step="0.2">
        </div>
      </div>

      <!-- פאנל כותרות עליונות -->
      <div class="panel-static">
        <div class="panel-header">📑 כותרות עליונות (3 אזורים)</div>
        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">1. מעל הטור הימני:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-r-type" style="flex:1;" onchange="document.getElementById('hdr-r-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1" selected="selected">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-r-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option><option value="left">שמאל</option></select>
          <select id="f-hdr-r" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-r" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-r-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">2. מעל הרווח המרכזי (Gutter):</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-c-type" style="flex:1;" onchange="
            document.getElementById('hdr-c-custom').style.display = this.value === 'custom' ? 'block' : 'none';
            document.getElementById('row-hdr-c-img').style.display = this.value === 'custom_img' ? 'flex' : 'none';
          ">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear" selected="selected">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="custom_img">תמונת עיטור (קובץ)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-c-align" style="width:65px;"><option value="center" selected="selected">מרכז</option></select>
          <select id="f-hdr-c" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-c" class="size-input" value="11">
        </div>
        <input type="text" id="hdr-c-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:8px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
        <div class="inline-cfg-row" id="row-hdr-c-img" style="display:none; margin-bottom:8px;">
          <label>קובץ עיטור מרכזי:</label>
          <input type="file" id="file-hdr-c-img" accept=".svg,image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
          <input type="hidden" id="data-hdr-c-img" value="">
        </div>

        <div style="font-weight:700; font-size:8pt; margin-bottom:2px;">3. מעל הטור השמאלי:</div>
        <div class="inline-cfg-row" style="margin-bottom: 2px;">
          <select id="hdr-l-type" style="flex:1;" onchange="document.getElementById('hdr-l-custom').style.display = this.value === 'custom' ? 'block' : 'none'">
            <option value="h1">כותרת 1 (שם החלק)</option>
            <option value="book_title">שם הספר</option>
            <option value="h2" selected="selected">כותרת 2</option>
            <option value="h3">כותרת 3</option>
            <option value="custom">מותאם אישית</option>
            <option value="diamonds">מעויינים (◈ ❖ ◈)</option>
            <option value="spear">רומח (SVG)</option>
            <option value="swash">שושנתא (SVG)</option>
            <option value="pen">סלסול (SVG)</option>
            <option value="empty">ריק</option>
          </select>
          <select id="hdr-l-align" style="width:65px;"><option value="center" selected="selected">מרכז</option><option value="right">ימין</option></select>
          <select id="f-hdr-l" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Livorna', serif" selected="selected">Livorna</option></optgroup></select>
          <input type="number" id="s-hdr-l" class="size-input" value="15">
        </div>
        <input type="text" id="hdr-l-custom" placeholder="הזן טקסט מותאם אישית..." style="display:none; width:100%; margin-bottom:4px; font-size:8.5pt; padding:3px; border:1px solid #aaa; border-radius:2px;">
      </div>

      <!-- פאנל תוכן העניינים -->
      <div class="panel-static">
        <div class="panel-header">📑 תוכן העניינים (כללי ומפורט)</div>
        <div style="margin-bottom:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-general-toc" checked="checked"> הצג תוכן עניינים כללי בראש הספר</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="gtoc-show" value="1" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="1"></td><td><select id="f-gtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="gtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="2"></td><td><select id="f-gtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="gtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="3" checked="checked"></td><td><select id="f-gtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="gtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="4"></td><td><select id="f-gtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="gtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="5"></td><td><select id="f-gtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="gtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="gtoc-grp" value="6"></td><td><select id="f-gtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="gtoc-show" value="7"></td><td><input type="checkbox" class="gtoc-grp" value="7"></td><td><select id="f-gtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-gtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>

        <div style="margin: 8px 0 4px 0; border-top:1px dashed #ccc; padding-top:4px;">
          <label style="font-size:8.5pt; font-weight:700;"><input type="checkbox" id="enable-detailed-toc" checked="checked"> הצג תוכן מפורט בראש שערי משנה</label>
        </div>
        <table class="toc-levels-table">
          <thead><tr><th>רמה</th><th>הצג</th><th>קיבוץ</th><th>גופן</th><th>גודל</th></tr></thead>
          <tbody>
            <tr><td>כותרת 1</td><td><input type="checkbox" class="dtoc-show" value="1"></td><td><input type="checkbox" class="dtoc-grp" value="1"></td><td><select id="f-dtoc-1" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-1" class="size-input" value="12"></td></tr>
            <tr><td>כותרת 2</td><td><input type="checkbox" class="dtoc-show" value="2" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="2"></td><td><select id="f-dtoc-2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-2" class="size-input" value="11"></td></tr>
            <tr><td>כותרת 3</td><td><input type="checkbox" class="dtoc-show" value="3" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="3"></td><td><select id="f-dtoc-3" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-3" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 4</td><td><input type="checkbox" class="dtoc-show" value="4" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="4"></td><td><select id="f-dtoc-4" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-4" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 5</td><td><input type="checkbox" class="dtoc-show" value="5" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="5"></td><td><select id="f-dtoc-5" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-5" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 6</td><td><input type="checkbox" class="dtoc-show" value="6" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="6"></td><td><select id="f-dtoc-6" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-6" class="size-input" value="10.5"></td></tr>
            <tr><td>כותרת 7</td><td><input type="checkbox" class="dtoc-show" value="7" checked="checked"></td><td><input type="checkbox" class="dtoc-grp" value="7"></td><td><select id="f-dtoc-7" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'David Libre', serif" selected="selected">David Libre</option></optgroup></select></td><td><input type="number" id="s-dtoc-7" class="size-input" value="8.8"></td></tr>
          </tbody>
        </table>
      </div>

      <!-- פאנל גריד וטיפוגרפיה -->
      <div class="panel-static">
        <div class="panel-header">📐 גריד וטיפוגרפיה כללית</div>
        <div class="inline-cfg-row">
          <label>גוף הטקסט:</label>
          <select id="font-body" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'Guttman Rashi', serif" selected="selected">Guttman Rashi</option></optgroup></select>
          <input type="number" id="size-body" class="size-input" value="12" step="0.2">
        </div>
        <div class="inline-cfg-row">
          <label>מילה ראשונה:</label>
          <select id="font-first-word" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'FrankReal', serif" selected="selected">FrankReal</option></optgroup></select>
          <input type="number" id="size-first-word" class="size-input" value="1.5" step="0.1">
        </div>
        <div class="proportions-grid" style="margin-top:6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div class="prop-item"><label>טור (%):</label><input type="number" id="prop-col" value="40" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח מרכזי (%):</label><input type="number" id="prop-gutter" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>רווח ביניים (%):</label><input type="number" id="prop-gap" value="2" step="0.5" class="size-input"></div>
          <div class="prop-item"><label>מרחק עליון (px):</label><input type="number" id="prop-mt" value="20" step="1" class="size-input"></div>
          <div class="prop-item"><label>מרחק תחתון (px):</label><input type="number" id="prop-mb" value="20" step="1" class="size-input"></div>
        </div>
      </div>

    </div>

    <div class="btn-bar-bottom">
      <button class="btn-save-template" onclick="saveAsDefaultTemplate()">💾 שמור תבנית</button>
      <button class="btn-primary" onclick="typesetDocument()">⚡ עדכן ועמד מחדש</button>
      <button class="btn-secondary" onclick="window.print()">🖨️ הדפסה / PDF</button>
    </div>
  </div>

  <div id="resizer"></div>

  <div id="preview-pane">
    <div id="book-container"></div>
  </div>

  <div id="measuring-box"></div>

  <script>
    const resizer = document.getElementById('resizer');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      resizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newWidth = document.body.clientWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 800) {
        sidebar.style.width = newWidth + 'px';
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });

    const CBG_TEXTURE_SVG = "data:image/svg+xml,%3Csvg width='32' height='55' viewBox='0 0 32 55' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16,27 C10,22 5,14 5,5 C5,0 10,0 16,5 C22,0 27,0 27,5 C27,14 22,22 16,27 Z M16,27 C10,32 5,40 5,49 C5,55 10,55 16,49 C22,55 27,55 27,49 C27,40 22,32 16,27 Z M16,14 A3.5,3.5 0 1,0 16,21 A3.5,3.5 0 1,0 16,14 Z' fill='%239e9e9e' fill-opacity='0.18'/%3E%3C/svg%3E";

    function getContentBgCSS(roleKey) {
      const modeEl = document.getElementById('cbg-' + roleKey + '-mode');
      if (!modeEl) return '';
      const mode = modeEl.value;
      if (mode === 'color') {
        const c = document.getElementById('cbg-' + roleKey + '-color');
        return c ? `background-color:${c.value};background-image:none;` : '';
      }
      if (mode === 'texture') {
        return `background-color:#fdfcf6;background-image:url("${CBG_TEXTURE_SVG}");background-repeat:repeat;`;
      }
      if (mode === 'image') {
        const imgEl = document.getElementById('data-cbg-' + roleKey + '-img');
        const opEl = document.getElementById('cbg-' + roleKey + '-opacity');
        const img = imgEl ? imgEl.value : '';
        if (!img) return '';
        const op = opEl ? (parseInt(opEl.value, 10) / 100) : 0.15;
        const fade = 1 - op;
        return `background-image:linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${img}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
      }
      return '';
    }

    function applyContentBg(pageEl, roleKey) {
      const css = getContentBgCSS(roleKey);
      if (css) pageEl.style.cssText += css;
    }

    function toggleCbgSubRows(role, mode) {
      const rowColor = document.getElementById('row-cbg-' + role + '-color');
      const rowImg = document.getElementById('row-cbg-' + role + '-img');
      const rowOp = document.getElementById('row-cbg-' + role + '-op');
      if (rowColor) rowColor.style.display = (mode === 'color') ? 'flex' : 'none';
      if (rowImg) rowImg.style.display = (mode === 'image') ? 'flex' : 'none';
      if (rowOp) rowOp.style.display = (mode === 'image') ? 'flex' : 'none';
    }

    function togglePanelBody(bodyId) {
      const body = document.getElementById(bodyId);
      if (body) {
        body.style.display = (body.style.display === 'none') ? 'block' : 'none';
      }
    }

    /* ============================================================
       מערך ערכות הנושא המותאמות (Custom Themes Data Storage)
       ============================================================ */
    let customThemes = [];

    function addNewCustomTheme() {
      const nameInput = document.getElementById('builder-theme-name');
      const name = nameInput.value.trim();
      if (!name) {
        alert('אנא הזן שם לערכת הנושא.');
        return;
      }

      const mainSvg = document.getElementById('data-builder-main-svg').value;
      const backSvg = document.getElementById('data-builder-back-svg').value;
      const subSvg = document.getElementById('data-builder-sub-svg').value;

      const themeObj = {
        id: 'theme_' + Date.now(),
        name: name,
        mainShaar: {
          svgData: mainSvg || '',
          top: parseFloat(document.getElementById('builder-main-top').value) || 20,
          bottom: parseFloat(document.getElementById('builder-main-bottom').value) || 16,
          right: parseFloat(document.getElementById('builder-main-right').value) || 15,
          left: parseFloat(document.getElementById('builder-main-left').value) || 15
        },
        backShaar: {
          svgData: backSvg || '',
          top: parseFloat(document.getElementById('builder-back-top').value) || 22,
          bottom: parseFloat(document.getElementById('builder-back-bottom').value) || 18,
          right: parseFloat(document.getElementById('builder-back-right').value) || 15,
          left: parseFloat(document.getElementById('builder-back-left').value) || 95
        },
        subShaar: {
          svgData: subSvg || '',
          top: parseFloat(document.getElementById('builder-sub-top').value) || 20,
          bottom: parseFloat(document.getElementById('builder-sub-bottom').value) || 20,
          right: parseFloat(document.getElementById('builder-sub-right').value) || 95,
          left: parseFloat(document.getElementById('builder-sub-left').value) || 15
        }
      };

      customThemes.push(themeObj);
      refreshCustomThemesUI();

      const select = document.getElementById('active-theme-select');
      if (select) {
        select.value = themeObj.id;
      }

      alert(`ערכת הנושא "${name}" הוטמעה בהצלחה! היא זמינה לבחירה ברשימה ותישמר לצמיתות בלחיצה על "שמור תבנית".`);
      typesetDocument();
    }

    function deleteCustomTheme(themeId) {
      if (!confirm('האם ברצונך למחוק ערכת נושא זו?')) return;
      customThemes = customThemes.filter(t => t.id !== themeId);
      refreshCustomThemesUI();
      typesetDocument();
    }

    function refreshCustomThemesUI() {
      const optgroup = document.getElementById('custom-themes-optgroup');
      const listContainer = document.getElementById('custom-themes-list');
      const select = document.getElementById('active-theme-select');
      const currentVal = select ? select.value : '';

      if (optgroup) {
        optgroup.innerHTML = '';
        customThemes.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = t.name;
          optgroup.appendChild(opt);
        });
      }

      if (listContainer) {
        if (customThemes.length === 0) {
          listContainer.innerHTML = '<div style="font-size:7.5pt; color:#888;">עדיין לא הוטמעו ערכות מותאמות אישית.</div>';
        } else {
          let html = '<div style="font-size:8pt; font-weight:700; margin-bottom:4px; color:#333;">ערכות שהוטמעו בקובץ:</div>';
          customThemes.forEach(t => {
            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #ddd; padding:3px 6px; border-radius:3px; margin-bottom:3px; font-size:8pt;">
                <span>🏷️ ${t.name}</span>
                <span style="color:#dc2626; cursor:pointer; font-weight:bold;" onclick="deleteCustomTheme('${t.id}')">🗑️ מחק</span>
              </div>
            `;
          });
          listContainer.innerHTML = html;
        }
      }

      if (select && currentVal) {
        select.value = currentVal;
      }
    }

    /* ===================== EXTENSIONS ===================== */
    let importedPageTypes = [];
    let importedTextStyles = [];
    let importedImagePages = [];
    let extImportCounter = 0;
    let nextSyntheticLevel = 8;

    function validateExtJSON(def, expectedKind) {
      if (!def || typeof def !== 'object') return 'קובץ לא תקין (לא JSON תקין).';
      if (def.kind !== expectedKind) return 'הקובץ אינו מסוג ' + (expectedKind === 'pageType' ? 'סוג עמוד' : 'סגנון טקסט') + ' (kind=' + def.kind + ').';
      if (!def.name) return 'להגדרה שיובאה אין שם (name).';
      return null;
    }

    function handlePageTypeImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'pageType');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-pt-' + (extImportCounter++);
        importedPageTypes.push({ instanceId, def, anchor: def.insertionAnchor || 'afterAll', repeatMode: def.repeatMode || 'once' });
        buildExtPanel('pageType', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleTextStyleImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        let def;
        try { def = JSON.parse(e.target.result); } catch(err) { alert('קובץ JSON לא תקין.'); return; }
        const errMsg = validateExtJSON(def, 'textStyle');
        if (errMsg) { alert(errMsg); return; }
        const instanceId = 'ext-ts-' + (extImportCounter++);
        const syntheticLevel = (def.trigger && def.trigger.type === 'linePrefix') ? (nextSyntheticLevel++) : null;
        importedTextStyles.push({ instanceId, def, syntheticLevel });
        buildExtPanel('textStyle', instanceId, def.name, def);
        typesetDocument();
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function handleImagePageImportFile(event) {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const instanceId = 'ext-img-' + (extImportCounter++);
        importedImagePages.push({ instanceId, name: file.name, dataUrl: e.target.result, anchor: 'afterAll' });
        buildExtPanel('imagePage', instanceId, 'תמונה: ' + file.name, null);
        typesetDocument();
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    const EXT_ANCHOR_OPTIONS = [
      ['beforeAll','לפני הכל'], ['afterMainShaar','אחרי השער הראשי'], ['afterGeneralToc','אחרי תוכן העניינים הכללי'],
      ['beforeEachPart','לפני כל שער-חלק'], ['afterEachPart','מיד אחרי כל שער-חלק'], ['endOfEachPart','בסוף כל חלק'], ['afterAll','אחרי הכל']
    ];

    function buildExtPanel(kind, instanceId, name, def) {
      const panel = document.createElement('div');
      panel.className = 'panel-static';
      panel.id = instanceId + '-panel';
      const icon = kind === 'pageType' ? '📄' : kind === 'textStyle' ? '🅰️' : '🖼️';
      let triggerInfo = '';
      if (kind === 'textStyle' && def && def.trigger) {
        triggerInfo = (def.trigger.type === 'delimiterPair')
          ? `<div style="font-size:7.5pt;color:#888;">טריגר: בין "${def.trigger.open}" ל-"${def.trigger.close}"</div>`
          : `<div style="font-size:7.5pt;color:#888;">קידומת: "${def.trigger.prefix}"</div>`;
      }
      const anchorRow = (kind !== 'textStyle')
        ? `<div class="inline-cfg-row"><label>מיקום:</label><select id="${instanceId}-anchor" onchange="updateExtAnchor('${kind}','${instanceId}', this.value)">${EXT_ANCHOR_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>`
        : '';
      panel.innerHTML = `
        <div class="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>${icon} ${name}</span>
          <span style="cursor:pointer;color:#a33;font-weight:700;" onclick="removeExtInstance('${kind}','${instanceId}')">✕ הסר</span>
        </div>
        ${triggerInfo}
        ${anchorRow}
      `;
      document.getElementById('ext-imports-container').appendChild(panel);
      if (kind !== 'textStyle') {
        const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
        const inst = store.find(x => x.instanceId === instanceId);
        const sel = document.getElementById(instanceId + '-anchor');
        if (sel && inst) sel.value = inst.anchor;
      }
    }

    function updateExtAnchor(kind, instanceId, val) {
      const store = kind === 'pageType' ? importedPageTypes : importedImagePages;
      const inst = store.find(x => x.instanceId === instanceId);
      if (inst) inst.anchor = val;
      typesetDocument();
    }

    function removeExtInstance(kind, instanceId) {
      if (kind === 'pageType') importedPageTypes = importedPageTypes.filter(x => x.instanceId !== instanceId);
      else if (kind === 'textStyle') importedTextStyles = importedTextStyles.filter(x => x.instanceId !== instanceId);
      else importedImagePages = importedImagePages.filter(x => x.instanceId !== instanceId);
      const p = document.getElementById(instanceId + '-panel');
      if (p) p.remove();
      typesetDocument();
    }

    function findPrefixLineInSource(rawText, prefix) {
      if (!prefix) return null;
      const lines = rawText.split('\n');
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith(prefix)) return t.slice(prefix.length).replace(/^[:\-–—]\s*/, '').trim();
      }
      return null;
    }

    const EXT_V_MAP = { top:'14mm', upperMid:'25%', center:'50%', lowerMid:'75%' };

    function applyExtStyleToNode(node, style, hostFontSizePt) {
      if (!style) return;
      if (style.family) node.style.fontFamily = style.family;
      if (typeof style.size === 'number') node.style.fontSize = style.size + 'pt';
      if (typeof style.sizeDelta === 'number') node.style.fontSize = ((hostFontSizePt||12) + style.sizeDelta) + 'pt';
      if (style.weight) node.style.fontWeight = style.weight;
      if (style.color) node.style.color = style.color;
      if (style.align) node.style.textAlign = style.align;
      if (style.border) {
        node.style.border = style.border.width + 'px solid ' + style.border.color;
        node.style.borderRadius = style.border.radius + 'px';
        node.style.padding = '2px 8px';
      }
    }

    function renderImportedPage(container, inst, rawSourceText) {
      const def = inst.def;
      const page = document.createElement('div');
      page.className = 'a4-page';
      if (def.background && def.background.mode === 'fixed') {
        const bs = def.background.style;
        if (bs === 'color' && def.background.color) page.style.background = def.background.color;
        else if (bs === 'texture') { page.style.background = '#fdfcf6 url("'+CBG_TEXTURE_SVG+'") repeat'; }
        else if (bs === 'image' && def.background.image) {
          const fade = 1 - (def.background.opacity != null ? def.background.opacity : 0.15);
          page.style.backgroundImage = `linear-gradient(rgba(244,241,232,${fade}),rgba(244,241,232,${fade})),url("${def.background.image}")`;
          page.style.backgroundSize = 'cover'; page.style.backgroundPosition = 'center';
        }
      } else {
        applyContentBg(page, 'regular');
      }
      (def.elements || []).forEach(elDef => {
        const matched = findPrefixLineInSource(rawSourceText, elDef.prefix);
        const text = matched || elDef.defaultText || '';
        if (!text) return;
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.textContent = text;
        const pos = elDef.position || {};
        const va = pos.vAnchor || 'center', ha = pos.hAlign || 'center', off = pos.offsetY || 0;
        if (va === 'bottom') { el.style.bottom = (18 - off) + 'mm'; }
        else {
          el.style.top = `calc(${EXT_V_MAP[va] || '50%'} + ${off}px)`;
          if (va === 'center' || va === 'upperMid' || va === 'lowerMid') el.style.transform = 'translateY(-50%)';
        }
        if (ha === 'right' || ha === 'rightMid') { el.style.right = (ha === 'right' ? '15mm' : '25%'); }
        else if (ha === 'left' || ha === 'leftMid') { el.style.left = (ha === 'left' ? '15mm' : '25%'); }
        else { el.style.right = '0'; el.style.left = '0'; el.style.textAlign = 'center'; }
        applyExtStyleToNode(el, elDef.style, 12);
        page.appendChild(el);
      });
      container.appendChild(page);
    }

    function renderImportedImagePage(container, inst) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      page.style.backgroundImage = `url("${inst.dataUrl}")`;
      page.style.backgroundSize = 'cover';
      page.style.backgroundPosition = 'center';
      container.appendChild(page);
    }

    function renderExtAnchor(container, anchorKey, rawSourceText) {
      importedPageTypes.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedPage(container, inst, rawSourceText));
      importedImagePages.filter(p => p.anchor === anchorKey).forEach(inst => renderImportedImagePage(container, inst));
    }

    function appendMainSubParts(hostElem, mainText, subText, def) {
      const mainPart = document.createElement('div');
      mainPart.textContent = mainText.trim();
      applyExtStyleToNode(mainPart, def.style, 14);
      hostElem.appendChild(mainPart);
      if (subText && subText.trim()) {
        const subPart = document.createElement('div');
        subPart.textContent = subText.trim();
        subPart.style.fontSize = '0.68em'; subPart.style.opacity = '0.78'; subPart.style.marginTop = '3px';
        hostElem.appendChild(subPart);
      }
    }

    function renderCustomHeadingInto(hostElem, inst, text) {
      const def = inst.def;
      hostElem.innerHTML = '';

      if (def.parseMode === 'splitFirstDash' && /[-–—]/.test(text)) {
        appendMainSubParts(hostElem, text.split(/[-–—]/)[0], text.split(/[-–—]/).slice(1).join(' - '), def);
        return;
      }

      if (def.parseMode === 'splitCustomDelimiter' && def.parseDelimiter && text.indexOf(def.parseDelimiter) > -1) {
        const idx = text.indexOf(def.parseDelimiter);
        appendMainSubParts(hostElem, text.slice(0, idx), text.slice(idx + def.parseDelimiter.length), def);
        return;
      }

      if (def.parseMode === 'regexGroups' && def.parseRegex) {
        let match = null;
        try {
          match = text.match(new RegExp(def.parseRegex));
        } catch (e) {
          console.warn('סגנון "' + def.name + '": ביטוי רגולרי לא תקין (' + def.parseRegex + ') — ' + e.message);
        }
        if (match && match.groups && Object.keys(match.groups).length) {
          const vals = Object.values(match.groups).filter(v => v !== undefined);
          if (vals.length) {
            appendMainSubParts(hostElem, vals[0], vals.slice(1).join(' '), def);
            return;
          }
        }
      }

      hostElem.textContent = text;
      applyExtStyleToNode(hostElem, def.style, 12);
    }

    function findExtTextStyle(instanceId) {
      return importedTextStyles.find(x => x.instanceId === instanceId);
    }

    function finalizeNotePositions(notesList, columnBoundaryHeight) {
      const byMargin = new Map();
      notesList.forEach(item => {
        if (!item.elem || !item.pElem) return;
        const marg = item.elem.parentElement;
        if (!marg) return;
        if (!byMargin.has(marg)) byMargin.set(marg, []);
        byMargin.get(marg).push(item);
      });
      byMargin.forEach(group => {
        group.sort((a, b) => a.pElem.offsetTop - b.pElem.offsetTop);
        group.forEach((item, idx) => {
          const noteHeight = item.elem.getBoundingClientRect().height || item.elem.offsetHeight || 0;
          let top = item.pElem.offsetTop;
          if (top + noteHeight > columnBoundaryHeight) {
            const prev = idx > 0 ? group[idx - 1] : null;
            const prevBottom = prev ? (parseFloat(prev.elem.style.top || 0) + (prev.elem.getBoundingClientRect().height || 0)) : 0;
            const minTop = prev ? prevBottom + 6 : 0;
            const raisedTop = columnBoundaryHeight - noteHeight;
            if (raisedTop >= minTop) {
              top = raisedTop;
            } else {
              const tokenId = item.pElem.getAttribute('data-token-id');
              const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
              if (contElem && contElem !== item.pElem) {
                const page = contElem.closest('.a4-page');
                const isRightCol = !!contElem.closest('.right-col');
                const destMargin = page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null;
                if (destMargin) {
                  const next = idx < group.length - 1 ? group[idx + 1] : null;
                  const maxTop = next ? (parseFloat(next.elem.style.top || Infinity) - noteHeight - 6) : Infinity;
                  const contTop = contElem.offsetTop;
                  if (contTop <= maxTop) {
                    destMargin.appendChild(item.elem);
                    top = contTop;
                  }
                }
              }
            }
          }
          item.elem.style.top = top + 'px';
        });
      });
    }

    /* ============================================================
       סריקת והחלת תוחמי טקסט (הערות שוליים בתחתית הדף)
       ============================================================ */
    function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt) {
      const activeStyles = [];

      // הערות שוליים גלובליות בתחתית הדף (מוגדרות ע"י תוחמים בטקסט בלבד)
      const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
      const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
      if (fnOpen && fnClose) {
        activeStyles.push({
          def: { trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose }, target: 'footnote' },
          instanceId: 'builtin-footnote'
        });
      }

      importedTextStyles.forEach(inst => {
        const trig = inst.def && inst.def.trigger;
        if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
        const scope = trig.appliesWithin;
        if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
        activeStyles.push(inst);
      });

      if (!activeStyles.length) return;
      const effHostSize = hostSizePt || 12;

      const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let n;
      while (n = walker.nextNode()) textNodes.push(n);

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        let matches = [];
        activeStyles.forEach(inst => {
          const trig = inst.def.trigger;
          let searchFrom = 0;
          while (true) {
            const oIdx = text.indexOf(trig.open, searchFrom);
            if (oIdx === -1) break;
            const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
            if (cIdx === -1) break;
            matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
            searchFrom = cIdx + trig.close.length;
          }
        });
        if (!matches.length) return;
        matches.sort((a,b) => a.start - b.start);
        const dedup = [];
        let lastEnd = -1;
        matches.forEach(m => { if (m.start >= lastEnd) { dedup.push(m); lastEnd = m.end; } });

        const frag = document.createDocumentFragment();
        let cursor = 0;
        dedup.forEach(m => {
          if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
          if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
            const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
            const innerText = text.slice(m.start + openLen, m.end - closeLen);
            const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
            frag.appendChild(marker);
          } else {
            const span = document.createElement('span');
            span.textContent = text.slice(m.start, m.end);
            applyExtStyleToNode(span, m.inst.def.style, effHostSize);
            frag.appendChild(span);
          }
          cursor = m.end;
        });
        if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }

    function getHostSizePt(level, customStyleId) {
      if (customStyleId) {
        const inst = findExtTextStyle(customStyleId);
        if (inst && inst.def.style && typeof inst.def.style.size === 'number') return inst.def.style.size;
        return 12;
      }
      const el = document.getElementById('s-h' + level);
      return el ? parseFloat(el.value) : 12;
    }
    function getBodySizePt() {
      const el = document.getElementById('size-body');
      return el ? parseFloat(el.value) : 12;
    }

    /* ===================== NOTES: footnotes + endnotes ===================== */
    const HEBREW_ALEF_BET = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];
    function toHebrewLetterSeq(n) {
      if (n <= 0) return '';
      let result = '', num = n;
      while (num > 0) { num--; result = HEBREW_ALEF_BET[num % 22] + result; num = Math.floor(num / 22); }
      return result;
    }
    let noteCounters = { footnote: 0, endnote: 0 };
    let noteUidCounter = 0;
    let footnoteQueueForPage = [];
    let endnoteQueueForPart = [];

    function getNoteConfig(styleId) {
      const inst = findExtTextStyle(styleId);
      return (inst && inst.def.noteConfig) || {};
    }
    function formatNoteMarker(n, styleId) {
      const cfg = getNoteConfig(styleId);
      return (cfg.numberingStyle === 'alphabetic') ? toHebrewLetterSeq(n) : String(n);
    }
    function resetNoteCounterIfNeeded(target, trigger) {
      importedTextStyles.forEach(inst => {
        if (inst.def.target === target) {
          const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt) || (target === 'footnote' ? 'page' : 'part');
          if (resetAt === trigger) noteCounters[target] = 0;
        }
      });
    }
    function applyNoteMarkerStyle(el, isBacklink) {
      const typeEl = document.getElementById('note-marker-type');
      const sizeEl = isBacklink ? document.getElementById('note-listing-num-size') : document.getElementById('note-marker-size');
      const type = (!isBacklink && typeEl) ? typeEl.value : 'normal';
      const size = sizeEl ? parseFloat(sizeEl.value) : 8;
      el.style.fontSize = size + 'pt';
      el.style.fontWeight = '700';
      el.style.textDecoration = 'none';
      el.style.color = 'inherit';
      el.style.cursor = 'pointer';
      if (type === 'super') { el.style.verticalAlign = 'super'; el.style.lineHeight = '0'; }
      else if (type === 'sub') { el.style.verticalAlign = 'sub'; el.style.lineHeight = '0'; }
      else { el.style.verticalAlign = 'baseline'; }
      if (!isBacklink && type === 'brackets') { el.textContent = '[' + el.textContent + ']'; }
    }
    function createNoteMarkerAndQueue(text, styleId, target) {
      noteCounters[target] = (noteCounters[target] || 0) + 1;
      const num = noteCounters[target];
      const markerText = formatNoteMarker(num, styleId);
      const uid = 'n' + (noteUidCounter++);
      const marker = document.createElement('a');
      marker.className = 'note-marker';
      marker.href = '#note-' + uid;
      marker.id = 'noteref-' + uid;
      marker.textContent = markerText;
      applyNoteMarkerStyle(marker, false);
      const item = { number: markerText, text: text, styleId: styleId, uid: uid };
      if (target === 'footnote') footnoteQueueForPage.push(item);
      else endnoteQueueForPart.push(item);
      return marker;
    }

    function buildNoteBlockElement(queue, columns) {
      const wrap = document.createElement('div');
      wrap.className = 'note-block';
      if (columns === 2) wrap.style.columnCount = '2';
      const sepEl = document.getElementById('note-num-separator');
      const globalSep = sepEl ? sepEl.value : '.';
      queue.forEach(item => {
        const line = document.createElement('div');
        line.className = 'note-line';
        line.id = 'note-' + item.uid;
        const num = document.createElement('a');
        num.className = 'note-line-num';
        num.href = '#noteref-' + item.uid;
        num.textContent = item.number + globalSep + ' ';
        applyNoteMarkerStyle(num, true);
        const body = document.createElement('span');
        body.textContent = item.text;
        const inst = findExtTextStyle(item.styleId);
        if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
        line.appendChild(num); line.appendChild(body);
        wrap.appendChild(line);
      });
      return wrap;
    }

    function buildNoteRuleElement() {
      const sel = document.getElementById('note-rule-style');
      const style = sel ? sel.value : 'plain';
      const rule = document.createElement('div');
      if (style === 'none') { rule.style.display = 'none'; return rule; }
      if (style === 'plain') { rule.className = 'note-rule-plain'; return rule; }
      const glyphs = { dots: '◦◦◦', sparkle: '❖❖❖', star: '✧✧✧', diamond: '♦♦♦' };
      rule.className = 'note-rule-decorative';
      const segR = document.createElement('span'); segR.className = 'rule-seg';
      const mid = document.createElement('span'); mid.className = 'rule-glyphs'; mid.textContent = glyphs[style] || '';
      const segL = document.createElement('span'); segL.className = 'rule-seg';
      rule.appendChild(segR); rule.appendChild(mid); rule.appendChild(segL);
      return rule;
    }

    // מדפיסה בפועל את הערות השוליים מעל מספר העמוד ומאפסת את התור
    function flushFootnotesInto(pageEl) {
      if (!footnoteQueueForPage.length) { 
        resetNoteCounterIfNeeded('footnote', 'page'); 
        return; 
      }
      const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
      const rule = buildNoteRuleElement();
      const block = buildNoteBlockElement(footnoteQueueForPage, cfg0.columns || 1);
      const area = document.createElement('div');
      area.className = 'footnote-area';
      area.appendChild(rule);
      area.appendChild(block);

      const wrapper = pageEl.querySelector('.page-content-wrapper');
      const footer = pageEl.querySelector('.page-number-footer');
      if (wrapper && footer) {
        wrapper.insertBefore(area, footer);
      } else {
        pageEl.appendChild(area);
      }

      footnoteQueueForPage = [];
      resetNoteCounterIfNeeded('footnote', 'page');
    }

    function flushEndnotesForPart(container, pIdx) {
      if (!endnoteQueueForPart.length) { resetNoteCounterIfNeeded('endnote', 'part'); return 0; }
      const cfg0 = getNoteConfig(endnoteQueueForPart[0].styleId);
      const columns = cfg0.columns || 1;
      let pagesUsed = 0;
      let remaining = endnoteQueueForPart.slice();
      while (remaining.length) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        applyContentBg(page, 'regular');
        const title = document.createElement('div');
        title.className = 'title-level-2-standalone';
        title.textContent = pagesUsed === 0 ? 'הערות' : 'הערות (המשך)';
        page.appendChild(title);
        const wrap = document.createElement('div');
        wrap.className = 'note-block endnote-page-block';
        if (columns === 2) wrap.style.columnCount = '2';
        page.appendChild(wrap);
        container.appendChild(page);
        let fit = 0;
        for (let i = 0; i < remaining.length; i++) {
          const testBlock = buildNoteBlockElement(remaining.slice(0, i + 1), columns);
          wrap.innerHTML = ''; wrap.appendChild(testBlock);
          if (wrap.scrollHeight > page.clientHeight - 60 && i > 0) { break; }
          fit = i + 1;
        }
        remaining = remaining.slice(fit);
        pagesUsed++;
        if (pagesUsed > 200) break;
      }
      endnoteQueueForPart = [];
      resetNoteCounterIfNeeded('endnote', 'part');
      return pagesUsed;
    }

    function measureNoteBlockHeight(queue, columns) {
      if (!queue.length) return 0;
      const probe = buildNoteBlockElement(queue, columns);
      probe.style.position = 'absolute'; probe.style.visibility = 'hidden'; probe.style.width = '160mm';
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      document.body.removeChild(probe);
      return h;
    }

    // קריאת קובץ SVG / תמונה והסרת נעילת פרופורציות
    function handleImageUpload(event, targetInputId) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        reader.onload = function(e) {
          let svgText = e.target.result;
          if (svgText.includes('preserveAspectRatio')) {
            svgText = svgText.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
          } else {
            svgText = svgText.replace(/<svg\b/, '<svg preserveAspectRatio="none"');
          }
          const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
          const targetInput = document.getElementById(targetInputId);
          if (targetInput) {
            targetInput.value = dataUrl;
            targetInput.setAttribute('value', dataUrl);
            typesetDocument();
          }
        };
        reader.readAsText(file);
      } else {
        reader.onload = function(e) {
          const targetInput = document.getElementById(targetInputId);
          if (targetInput) {
            targetInput.value = e.target.result;
            targetInput.setAttribute('value', e.target.result);
            typesetDocument();
          }
        };
        reader.readAsDataURL(file);
      }
    }

    // שמירת כל התבנית לצמיתות כולל כל ערכות הנושא המותאמות
    function saveAsDefaultTemplate() {
      let dataIsland = document.getElementById('ext-imports-data');
      if (!dataIsland) {
        dataIsland = document.createElement('script');
        dataIsland.type = 'application/json';
        dataIsland.id = 'ext-imports-data';
        document.head.appendChild(dataIsland);
      }
      dataIsland.textContent = JSON.stringify({
        pageTypes: importedPageTypes,
        textStyles: importedTextStyles,
        imagePages: importedImagePages,
        customThemes: customThemes
      });

      document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"], input[type="color"], input[type="range"]').forEach(input => {
        input.setAttribute('value', input.value);
      });
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) cb.setAttribute('checked', 'checked');
        else cb.removeAttribute('checked');
      });
      document.querySelectorAll('select').forEach(sel => {
        Array.from(sel.options).forEach(opt => {
          if (opt.value === sel.value) opt.setAttribute('selected', 'selected');
          else opt.removeAttribute('selected');
        });
      });

      const rawInputElem = document.getElementById('raw-input');
      const prevVal = rawInputElem.value;
      rawInputElem.innerHTML = '';
      rawInputElem.value = '';

      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      rawInputElem.value = prevVal;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'torani-typesetting-template.html';
      a.click();
      URL.revokeObjectURL(a.href);
    }

    async function loadSystemFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const availableFonts = await window.queryLocalFonts();
          const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));
          
          if (fontFamilies.length > 0) {
            document.querySelectorAll('.font-picker').forEach(select => {
              const currentVal = select.value;
              select.innerHTML = '';
              
              const sysGroup = document.createElement('optgroup');
              sysGroup.label = `גופני מחשב (${fontFamilies.length} נמצאו)`;
              
              fontFamilies.forEach(family => {
                const opt = document.createElement('option');
                opt.value = `'${family}', serif`;
                opt.textContent = family;
                if (currentVal.includes(family)) opt.selected = true;
                sysGroup.appendChild(opt);
              });
              
              select.appendChild(sysGroup);
            });
            alert(`נטענו בהצלחה ${fontFamilies.length} גופנים מהמחשב!`);
          }
        } catch (err) {
          alert('לא ניתנה הרשאה לגישה לגופני המחשב.');
        }
      } else {
        alert('הדפדפן אינו תומך בגישה ישירה לגופני המערכת. מומלץ להשתמש ב-Chrome או Edge.');
      }
    }

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

    function updateGrid() {
      const root = document.documentElement;
      const rawCol = parseFloat(document.getElementById('prop-col').value) || 0;
      const rawMargin = parseFloat(document.getElementById('prop-margin').value) || 0;
      const rawGutter = parseFloat(document.getElementById('prop-gutter').value) || 0;
      const rawGap = parseFloat(document.getElementById('prop-gap').value) || 0;
      const total = 2 * rawCol + 2 * rawMargin + rawGutter + 2 * rawGap;
      const scale = total > 0 ? 100 / total : 1;
      root.style.setProperty('--w-col', (rawCol * scale) + '%');
      root.style.setProperty('--w-margin', (rawMargin * scale) + '%');
      root.style.setProperty('--w-gutter', (rawGutter * scale) + '%');
      root.style.setProperty('--w-gap', (rawGap * scale) + '%');
      root.style.setProperty('--flow-mt', document.getElementById('prop-mt').value + 'px');
      root.style.setProperty('--flow-mb', document.getElementById('prop-mb').value + 'px');
    }

    function updateStyles() {
      const root = document.documentElement;
      root.style.setProperty('--fn-header-r', document.getElementById('f-hdr-r').value);
      root.style.setProperty('--sz-header-r', document.getElementById('s-hdr-r').value + 'pt');
      root.style.setProperty('--fn-header-c', document.getElementById('f-hdr-c').value);
      root.style.setProperty('--sz-header-c', document.getElementById('s-hdr-c').value + 'pt');
      root.style.setProperty('--fn-header-l', document.getElementById('f-hdr-l').value);
      root.style.setProperty('--sz-header-l', document.getElementById('s-hdr-l').value + 'pt');

      root.style.setProperty('--fn-h0', document.getElementById('f-h0').value);
      root.style.setProperty('--sz-h0', document.getElementById('s-h0').value + 'pt');
      root.style.setProperty('--fn-h0-body', document.getElementById('f-h0-body').value);
      root.style.setProperty('--sz-h0-body', document.getElementById('s-h0-body').value + 'pt');

      root.style.setProperty('--fn-h1', document.getElementById('f-h1').value);
      root.style.setProperty('--sz-h1', document.getElementById('s-h1').value + 'pt');
      root.style.setProperty('--fn-h2', document.getElementById('f-h2').value);
      root.style.setProperty('--sz-h2', document.getElementById('s-h2').value + 'pt');
      root.style.setProperty('--fn-h3', document.getElementById('f-h3').value);
      root.style.setProperty('--sz-h3', document.getElementById('s-h3').value + 'pt');
      root.style.setProperty('--fn-h4', document.getElementById('f-h4').value);
      root.style.setProperty('--sz-h4', document.getElementById('s-h4').value + 'pt');
      root.style.setProperty('--fn-h5', document.getElementById('f-h5').value);
      root.style.setProperty('--sz-h5', document.getElementById('s-h5').value + 'pt');
      root.style.setProperty('--fn-h6', document.getElementById('f-h6').value);
      root.style.setProperty('--sz-h6', document.getElementById('s-h6').value + 'pt');
      root.style.setProperty('--fn-h7', document.getElementById('f-h7').value);
      root.style.setProperty('--sz-h7', document.getElementById('s-h7').value + 'pt');

      root.style.setProperty('--fn-sh-title', document.getElementById('f-sh-title').value);
      root.style.setProperty('--sz-sh-title', document.getElementById('s-sh-title').value + 'pt');
      root.style.setProperty('--fn-sh-sub', document.getElementById('f-sh-sub').value);
      root.style.setProperty('--sz-sh-sub', document.getElementById('s-sh-sub').value + 'pt');
      root.style.setProperty('--fn-sh-desc', document.getElementById('f-sh-desc').value);
      root.style.setProperty('--sz-sh-desc', document.getElementById('s-sh-desc').value + 'pt');
      root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec').value);
      root.style.setProperty('--sz-sh-sec', document.getElementById('s-sh-sec').value + 'pt');
      root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author').value);
      root.style.setProperty('--sz-sh-author', document.getElementById('s-sh-author').value + 'pt');
      root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year').value);
      root.style.setProperty('--sz-sh-year', document.getElementById('s-sh-year').value + 'pt');

      root.style.setProperty('--fn-first-word', document.getElementById('font-first-word').value);
      root.style.setProperty('--sz-first-word', document.getElementById('size-first-word').value + 'em');
      root.style.setProperty('--fn-body', document.getElementById('font-body').value);
      root.style.setProperty('--sz-body', document.getElementById('size-body').value + 'pt');
    }

    function createDropWord(text, isContinuation, isSingleLine) {
      if (isContinuation) return text;
      text = text.trim();
      const firstSpace = text.indexOf(' ');
      if (firstSpace === -1) {
        return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${text}</span>`;
      }
      const firstWord = text.substring(0, firstSpace);
      const rest = text.substring(firstSpace + 1);
      return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${firstWord}</span> ${rest}`;
    }

    function renderHeaderSectionHTML(type, customText, h1Title, h2Title, h3Title, bookTitle, tocFallback) {
      if (type === 'h1') return h1Title || tocFallback || '';
      if (type === 'h2') return h2Title || tocFallback || '';
      if (type === 'h3') return h3Title || '';
      if (type === 'book_title') return bookTitle || '';
      if (type === 'custom') return customText || '';
      if (type === 'diamonds') return '<span style="letter-spacing:3px;">◈ ❖ ◈</span>';
      if (type === 'spear') return '<svg style="height:9px; width:48px;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#444" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#444"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#444"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#444"/></svg>';
      if (type === 'swash') return '<svg style="height:12px; width:44px; fill:#444;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg>';
      if (type === 'pen') return '<svg style="height:12px; width:44px;" viewBox="0 0 280 80"><g stroke="#444" fill="none" stroke-linecap="round"><path d="M30,55 C12,42 22,22 38,28 C50,32 55,48 45,58 C35,68 18,60 14,46 C10,32 25,18 42,22 C65,28 85,65 118,68 C128,69 135,62 135,50 C135,38 124,32 115,38" stroke-width="3"/><path d="M250,55 C268,42 258,22 242,28 C230,32 225,48 235,58 C245,68 262,60 266,46 C270,32 255,18 238,22 C215,28 195,65 162,68 C152,69 145,62 145,50 C145,38 156,32 165,38" stroke-width="3"/></g></svg>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-hdr-c-img') ? document.getElementById('data-hdr-c-img').value : '';
        return imgSrc ? `<img src="${imgSrc}" style="max-height: 18px; max-width: 100%; object-fit: contain; vertical-align: middle;" />` : '';
      }
      return '';
    }

    function getSectionDividerHTML(type) {
      if (type === 'pyramid') return '<div style="grid-column: 3 / 6; text-align: center; line-height: 0.9; margin: 18px 0 6px 0;"><div style="font-size: 10pt; letter-spacing: 6px;">❖ ❖ ❖</div><div style="font-size: 9pt; letter-spacing: 5px; margin-top: 3px;">❖ ❖</div><div style="font-size: 8pt; margin-top: 3px;">❖</div></div>';
      if (type === 'spear') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 200px; height: 22px; margin: auto;" viewBox="0 0 400 40"><circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/><path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/><path d="M165,20 C165,22 150,24 130,24 C95,24 55,21 30,20 C55,19 95,16 130,16 C150,16 165,18 165,20 Z" fill="#fff"/><path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/><path d="M235,20 C235,22 250,24 270,24 C305,24 345,21 370,20 C345,19 305,16 270,16 C250,16 235,18 235,20 Z" fill="#fff"/></svg></div>';
      if (type === 'swash') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 170px; height: 18px; fill: #111; margin: auto;" viewBox="0 0 320 28"><path d="M10,14 C60,14 85,4 125,4 C145,4 152,11 160,17 C168,11 175,4 195,4 C235,4 260,14 310,14 C260,14 235,24 195,24 C175,24 168,17 160,11 C152,17 145,24 125,24 C85,24 60,14 10,14 Z M160,7 A5,5 0 1,0 160,21 A5,5 0 1,0 160,7 Z"/></svg></div>';
      if (type === 'flourish') return '<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><svg style="width: 140px; height: 45px; fill: #000; margin: auto;" viewBox="0 0 240 90"><path d="M110,48 C105,44 92,30 82,30 C68,30 55,42 42,42 C30,42 22,32 22,22 C22,12 32,5 45,5 C60,5 72,18 78,28 C82,20 88,10 100,10 C108,10 114,16 114,24 C114,35 102,44 88,44 C72,44 58,35 48,22 C42,28 35,35 25,48 C15,62 10,72 20,82 C30,90 48,85 62,72 C78,58 92,54 110,48 Z"/><path d="M130,48 C135,44 148,30 158,30 C172,30 185,42 198,42 C210,42 218,32 218,22 C218,12 208,5 195,5 C180,5 168,18 162,28 C158,20 152,10 140,10 C132,10 126,16 126,24 C126,35 138,44 152,44 C168,44 182,35 192,22 C198,28 205,35 215,48 C225,62 230,72 220,82 C210,90 192,85 178,72 C162,58 148,54 130,48 Z"/></svg></div>';
      if (type === 'custom_img') {
        const imgSrc = document.getElementById('data-sec-div-img') ? document.getElementById('data-sec-div-img').value : '';
        return imgSrc ? `<div style="grid-column: 3 / 6; text-align: center; margin: 16px 0 6px 0;"><img src="${imgSrc}" style="max-width: 260px; max-height: 45px; margin: auto; display: block; object-fit: contain;" /></div>` : '';
      }
      return '';
    }

    /* ============================================================
       רינדור שער ראשי (Main Shaar)
       ============================================================ */
    function renderMainShaar(container, themeId) {
      const page = document.createElement('div');
      page.className = `a4-page main-shaar-page`;

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const subtitle = document.getElementById('inp-book-subtitle').value || "";
      const desc = document.getElementById('inp-book-desc').value || "";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let frameHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.mainShaar && customTheme.mainShaar.svgData) {
          frameHTML = `<img class="custom-bg-img" src="${customTheme.mainShaar.svgData}" alt="שער ראשי">`;
        }
        const m = customTheme.mainShaar || { top: 20, bottom: 16, right: 15, left: 15 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else if (themeId === 'builtin_1') {
        frameHTML = `
          <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
          <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
        `;
      } else if (themeId === 'builtin_2') {
        frameHTML = `
          <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
          <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
        `;
      } else if (themeId === 'builtin_3') {
        frameHTML = `
          <div class="m3-wavy-band"></div>
          <div class="m3-panel">
            <svg class="m3-corner tr" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner tl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner br" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
            <svg class="m3-corner bl" viewBox="0 0 100 100"><path d="M90,10 L30,10 C15,10 10,25 25,35 C35,42 45,35 40,25 C36,18 25,20 22,16 C30,14 60,14 75,14 C78,30 78,60 76,78 C72,75 74,64 67,60 C57,55 50,65 57,75 C67,90 82,85 82,70 L82,10 Z"/></svg>
          </div>
        `;
      }

      page.innerHTML = `
        ${frameHTML}
        <div class="shaar-main-content theme-bounded-content" style="${boxStyle}">
          <div>
            <div class="bsd-header">בס"ד</div>
            <div class="sefer-label"></div>
            <div class="book-title-main">${title}</div>
            <div class="book-subtitle">${subtitle}</div>
            <svg style="width: 180px; height: 24px; margin: 12px auto;" viewBox="0 0 400 40">
              <circle cx="200" cy="20" r="10" fill="none" stroke="#000" stroke-width="4.5"/><circle cx="200" cy="20" r="4.5" fill="#000"/>
              <path d="M182,20 C182,24 165,27 140,27 C90,27 40,22 5,20 C40,18 90,13 140,13 C165,13 182,16 182,20 Z" fill="#000"/>
              <path d="M218,20 C218,24 235,27 260,27 C310,27 360,22 395,20 C360,18 310,13 260,13 C235,13 218,16 218,20 Z" fill="#000"/>
            </svg>
          </div>
          <div class="book-description">${desc}</div>
          <div class="book-sections-summary">${sections}</div>
          <div class="author-block"><br><span class="author-name">${author}</span></div>
          <div class="publication-footer">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער אחורי (Back Shaar - טור ימני)
       ============================================================ */
    function renderBackShaar(container, themeId) {
      const page = document.createElement('div');
      page.className = 'a4-page back-shaar-page';

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let bgHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.backShaar && customTheme.backShaar.svgData) {
          bgHTML = `<img class="custom-bg-img" src="${customTheme.backShaar.svgData}" alt="שער אחורי">`;
        }
        const m = customTheme.backShaar || { top: 22, bottom: 18, right: 15, left: 95 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else {
        let innerLace = '';
        if (themeId === 'builtin_2') innerLace = '<div class="m2-lace" style="border-right: 1px solid #ddd;"></div>';
        bgHTML = `<div class="back-shaar-bg-left"></div>`;
        boxStyle = `position:absolute; top:0; bottom:0; right:0; left:45%;`;
      }

      page.innerHTML = `
        ${bgHTML}
        <div class="theme-bounded-content" style="${boxStyle}">
          <div>
            <div style="font-size: 13pt; font-weight: 700; margin-bottom: 8px;">כל הזכויות שמורות</div>
            <div style="font-size: 10.5pt; line-height: 1.6; max-width: 90%; margin: 10px auto; color: #333;">
              אין לשכפל, להעתיק, לצלם, לתרגם, לאחסן במאגר מידע, למסור או לקלוט בכל דרך או אמצעי אלקטרוני, אופטי או מכני אחר כל חלק שהוא מספר זה, ללא רשות מפורשת בכתב מבעל הזכויות.
            </div>
          </div>
          <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 12px 10px; width: 85%;">
            <div style="font-weight: 700; font-size: 11pt; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 10pt; color: #555;">${sections}</div>
            <div style="font-size: 10.5pt; font-weight: 700; margin-top: 6px;">${author}</div>
          </div>
          <div style="font-size: 10pt; color: #666;">${year}</div>
        </div>
      `;
      container.appendChild(page);
    }

    /* ============================================================
       רינדור שער משנה (Sub Shaar - טור שמאלי)
       ============================================================ */
    function renderSubShaar(container, token, themeId) {
      const page = document.createElement('div');
      page.className = 'a4-page sub-shaar-page';
      page.setAttribute('data-token-id', token.id);
      page.id = `heading-tok-${token.id}`;
      
      let titleMain = token.text;
      let titleSub = '';

      if (token.text.includes('-') || token.text.includes('–') || token.text.includes('—')) {
        const parts = token.text.split(/[-–—]/);
        titleMain = parts[0].trim();
        titleSub = parts.slice(1).join(' - ').trim();
      }

      let bgHTML = '';
      let boxStyle = '';
      const customTheme = customThemes.find(t => t.id === themeId);

      if (customTheme) {
        if (customTheme.subShaar && customTheme.subShaar.svgData) {
          bgHTML = `<img class="custom-bg-img" src="${customTheme.subShaar.svgData}" alt="שער משנה">`;
        }
        const m = customTheme.subShaar || { top: 20, bottom: 20, right: 95, left: 15 };
        boxStyle = `position:absolute; top:${m.top}mm; bottom:${m.bottom}mm; right:${m.right}mm; left:${m.left}mm;`;
      } else {
        let innerLace = '';
        if (themeId === 'builtin_2') innerLace = '<div class="m2-lace" style="border-left: 1px solid #ddd;"></div>';
        bgHTML = `<div class="sub-shaar-bg-right"></div>`;
        boxStyle = `position:absolute; top:0; bottom:0; right:45%; left:0;`;
      }

      page.innerHTML = `
        ${bgHTML}
        <div class="theme-bounded-content" style="${boxStyle} justify-content:center;">
          <div class="sefer-label">חלק</div>
          <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
          ${titleSub ? `
            <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
              <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
            </svg>
            <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
        </div>
      `;
      container.appendChild(page);
    }

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole) {
      const page = document.createElement('div');
      page.className = 'a4-page';
      applyContentBg(page, pageRole || 'regular');

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, h1Title, h2Title, h3Title, bookTitle);

      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, h1Title, h2Title, h3Title, bookTitle);

      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, h1Title, h2Title, h3Title, bookTitle);

      page.innerHTML = `
        <div class="page-content-wrapper">
          <div class="top-header-grid">
            <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
            <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
            <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
          </div>
          <div class="page-body-flow">
		    ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${h2TokenId}" id="heading-tok-${h2TokenId}"` : ''}>${h2Text}</div>` : ''}
          </div>
          <div class="page-number-footer">${toGematria(pNum)}</div>
        </div>
      `;

      container.appendChild(page);
      const bodyFlow = page.querySelector('.page-body-flow');
      return { page, bodyFlow };
    }

    let lineToTokenMap = [];

    function parseMetadataFromText(rawText) {
      const lines = rawText.split('\n');
      const cleanLines = [];

      for (let line of lines) {
        const trimmed = line.trim();
        let match = false;

        if (/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-title').value = trimmed.replace(/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-subtitle').value = trimmed.replace(/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-desc').value = trimmed.replace(/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-sections').value = trimmed.replace(/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-author').value = trimmed.replace(/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*/i, '').trim();
          match = true;
        } else if (/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
          document.getElementById('inp-book-year').value = trimmed.replace(/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*/i, '').trim();
          match = true;
        }

        if (!match) {
          cleanLines.push(line);
        }
      }
      return cleanLines.join('\n');
    }

    function estimateSectionFillRatio(tokens) {
      const sampleFlow = document.querySelector('.page-body-flow');
      const perPageCapacity = (sampleFlow ? sampleFlow.clientHeight : 900) * 2;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;width:580px;';
      probe.className = 'page-body-flow';
      document.body.appendChild(probe);
      let totalHeight = 0;
      tokens.forEach(t => {
        if (t.type === 'p') {
          const p = document.createElement('p');
          p.innerHTML = createDropWord(t.text, false, true);
          probe.appendChild(p);
          totalHeight += p.getBoundingClientRect().height;
          probe.removeChild(p);
        } else if (t.type.startsWith('h')) {
          const h = document.createElement('div');
          h.className = t.customStyleId ? 'title-level-custom' : `title-level-${t.level}`;
          h.textContent = t.text;
          probe.appendChild(h);
          totalHeight += h.getBoundingClientRect().height;
          const hStyle = window.getComputedStyle(h);
          totalHeight += parseFloat(hStyle.marginTop) + parseFloat(hStyle.marginBottom);
          probe.removeChild(h);
        }
      });
      document.body.removeChild(probe);
      if (totalHeight <= 0) return 1;
      const naivePages = Math.ceil(totalHeight / perPageCapacity);
      if (naivePages <= 1) return 1;
      const ratio = totalHeight / (naivePages * perPageCapacity);
      return Math.max(0.3, Math.min(1, ratio));
    }

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
      
      const pMeasure = document.createElement('p');
      pMeasure.style.margin = '0';
      pMeasure.style.padding = '0';
      
      const words = text.trim().split(/\s+/);
      if (words.length === 0) return { lines: [], hasWindow: false };

      pMeasure.textContent = text;
      measureContainer.appendChild(pMeasure);
      const singleLineHeight = pMeasure.offsetHeight;
      pMeasure.textContent = "א";
      const oneLineH = pMeasure.offsetHeight;
      const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
      const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
      
      let html = '';
      if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${words[0]}</span> `;
        for (let i = 1; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      } else {
        for (let i = 0; i < words.length; i++) {
          html += `<span id="mw-${i}">${words[i]}</span> `;
        }
      }
      
      pMeasure.innerHTML = html;
      
      const lines = [];
      let currentLine = [];
      let currentTop = -1;
      
      for (let i = 0; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
          lines.push(currentLine.join(' '));
          currentLine = [words[i]];
          currentTop = top;
        } else {
          currentLine.push(words[i]);
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
      }
      
      measureContainer.innerHTML = '';
      return { lines, hasWindow: shouldApplyWindow };
    }

    function justifyColumnVertically(col, targetHeight, styleObj) {
      const currentH = col.scrollHeight;
      const diff = targetHeight - currentH;
      if (diff > 2 && diff <= 60) {
        let pElements = Array.from(col.querySelectorAll('p'));
        if (pElements.length > 1) {
           let extraSpacing = diff / (pElements.length - 1);
           pElements.slice(0, -1).forEach(p => {
             let currentMargin = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
             p.style.marginBottom = (currentMargin + extraSpacing) + 'px';
           });
        } else if (pElements.length === 1) {
           let p = pElements[0];
           let currentLineHeight = parseFloat(styleObj.lineHeight) || 1.34;
           let linesInfo = getLinesFromParagraph(p.getAttribute('data-raw-text') || p.textContent, col.offsetWidth, styleObj, false);
           let numLines = linesInfo.lines.length;
           if (numLines > 1) {
               let fontSizePx = parseFloat(styleObj.fontSize) * 1.333;
               let extraLh = (diff / numLines) / fontSizePx;
               p.style.lineHeight = (currentLineHeight + extraLh).toString();
           }
        }
      }
    }

    function balanceColumns(block, colWidth, styleObj) {
      const rCol = block.querySelector('.right-col');
      const lCol = block.querySelector('.left-col');
      const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
      if (allChildren.length === 0) return;

      let mergedItems = [];
      for (let child of allChildren) {
        if (child.tagName === 'P') {
          let id = child.getAttribute('data-token-id');
          let text = child.getAttribute('data-raw-text');
          let isCont = child.getAttribute('data-is-cont') === 'true';
          let sideNote = child.getAttribute('data-side-note');
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
          } else {
             mergedItems.push({ type: 'p', id: id, rawText: text, isCont: isCont, sideNote: sideNote });
          }
        } else {
          mergedItems.push({ type: 'h', id: child.getAttribute('data-token-id'), html: child.outerHTML, level: child.className.match(/title-level-(\d+)/)?.[1] });
        }
      }

      const items = mergedItems.map(item => {
        if (item.type === 'p') {
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
          return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow };
        }
        return item;
      });

      const splitPoints = [];
      for (let i = 0; i <= items.length; i++) {
        if (i < items.length && items[i].type === 'p') {
          let lines = items[i].lines;
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
          for (let l = 1; l < lines.length; l++) {
            splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines });
          }
        } else {
          splitPoints.push({ itemIndex: i, lineIndex: 0 });
        }
      }

      const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) return true;
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        return true;
      });

      let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
      if (pointsToEvaluate.length === 0) return;

      function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = 'p-end';
          p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());
          col.appendChild(p);
        }
      }

      let bestSplit = pointsToEvaluate[0];
      let minAbsDiff = Infinity;

      for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pRight = document.createElement('p');
          pRight.className = 'p-cut';
          let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
          pRight.innerHTML = createDropWord(rightText, item.isCont, false);
          rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pLeft = document.createElement('p');
          pLeft.className = 'p-end';
          let leftText = sp.lines.slice(sp.lineIndex).join(' ');
          pLeft.innerHTML = createDropWord(leftText, true, false);
          lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) renderSingleItemFast(lCol, items[i]);
        let lHeight = lCol.scrollHeight;
        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);
        
        if (absDiff < minAbsDiff || (absDiff === minAbsDiff && diff >= 0)) {
            minAbsDiff = absDiff;
            bestSplit = sp;
        }
      }

      rCol.innerHTML = '';
      lCol.innerHTML = '';
      const rMargin = block.querySelector('.right-margin');
      const lMargin = block.querySelector('.left-margin');
      rMargin.innerHTML = '';
      lMargin.innerHTML = '';
      const finalNotes = [];

      function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = isPartial && isRight ? 'p-cut' : 'p-end';
          p.setAttribute('data-token-id', item.id);
          
          let textToRender = isPartial ? partialText : item.rawText;
          p.setAttribute('data-raw-text', textToRender);
          p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
          if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt());

          // הוספת סימון הערת סיום שהוגדרה בקידומת שורה
          if (item.endNote && !isCont) {
            const marker = createNoteMarkerAndQueue(item.endNote, null, 'endnote');
            p.appendChild(marker);
          }

          col.appendChild(p);

          // כותרת 7 - הערת צד בשוליים
          if (item.sideNote && !isCont) {
            const noteElem = document.createElement('div');
            noteElem.className = 'side-note-anchor';
            noteElem.textContent = item.sideNote;
            if (item.sideNoteStyleId) {
              const inst = findExtTextStyle(item.sideNoteStyleId);
              if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
            }
            margin.appendChild(noteElem);
            finalNotes.push({ elem: noteElem, pElem: p });
          }
        }
      }

      for (let i = 0; i < bestSplit.itemIndex; i++) appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
      if (bestSplit.lineIndex > 0) {
        let item = items[bestSplit.itemIndex];
        let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
        appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont);
        let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
        appendItemFinal(lCol, lMargin, item, false, true, leftText, true);
      }
      for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
      }

      let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
      if (finalDiff > 2 && finalDiff <= 60) {
          justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
      } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
          justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
      }

      finalizeNotePositions(finalNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
    }

    /* ============================================================
       מנוע העימוד המרכזי
       ============================================================ */
    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      // קידומת הערת סיום בלבד
      const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      let pendingSideNoteStyleId = null;
      let pendingEndNote = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת קידומת הערת סיום
        if (enLinePrefix && line.startsWith(enLinePrefix)) {
          pendingEndNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // בדיקת כותרות מובנות (0-7)
        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            // כותרת 7: הערת צד בשוליים (Side note) - לא יורדת לתחתית הדף!
            pendingSideNote = txt;
            pendingSideNoteStyleId = null;
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          // בדיקת קידומות מתוספים מיובאים
          let customMatch = null;
          for (const inst of importedTextStyles) {
            const trig = inst.def && inst.def.trigger;
            if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
              customMatch = { inst, text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim() };
              break;
            }
          }
          if (customMatch) {
            if (customMatch.inst.def.target === 'endnote') {
              pendingEndNote = customMatch.text;
              lineToTokenMap[lineIdx] = null;
            } else if (customMatch.inst.def.layoutMode === 'side_note') {
              pendingSideNote = customMatch.text;
              pendingSideNoteStyleId = customMatch.inst.instanceId;
              lineToTokenMap[lineIdx] = null;
            } else {
              const lvl = customMatch.inst.syntheticLevel;
              const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: customMatch.text, lineIdx: lineIdx, customStyleId: customMatch.inst.instanceId };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
            }
          } else {
            const tokenObj = {
              id: tokens.length,
              type: 'p',
              text: line,
              sideNote: pendingSideNote,
              sideNoteStyleId: pendingSideNoteStyleId,
              endNote: pendingEndNote,
              lineIdx: lineIdx
            };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
            pendingSideNote = null;
            pendingSideNoteStyleId = null;
            pendingEndNote = null;
          }
        }
      }

      const headingModes = {
        0: document.getElementById('mode-h0').value,
        1: document.getElementById('mode-h1').value,
        2: document.getElementById('mode-h2').value,
        3: document.getElementById('mode-h3').value,
        4: document.getElementById('mode-h4').value,
        5: document.getElementById('mode-h5').value,
        6: document.getElementById('mode-h6').value,
        7: document.getElementById('mode-h7').value
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
      });

      const oddPageRequired = {
        0: document.getElementById('odd-h0').checked,
        1: document.getElementById('odd-h1').checked,
        2: document.getElementById('odd-h2').checked
      };
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
      });

      function ensureOddPageStart(level) {
        if (!oddPageRequired[level]) return;
        if (pageIndex % 2 === 0) {
          const blank = document.createElement('div');
          blank.className = 'a4-page blank-page';
          container.appendChild(blank);
          pageIndex++;
        }
      }

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
        if (mode === 'sub_shaar') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          sections.push({ type: 'sub_shaar', token: t, tokens: [] });
          currentSection = { type: 'body', tokens: [] };
        } else if (mode === 'new_page_1col') {
          if (currentSection.tokens.length > 0) sections.push(currentSection);
          currentSection = { type: 'body', isNewPage: true, hToken: t, tokens: [] };
        } else {
          currentSection.tokens.push(t);
        }
      });
      if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
        sections.push(currentSection);
      }

      const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
      const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
      importedTextStyles.forEach(inst => {
        if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
          gtocShows.push(inst.syntheticLevel);
          if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
        }
      });

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const showBackShaar = document.getElementById('show-back-shaar').checked;
      const activeThemeId = document.getElementById('active-theme-select').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // רינדור שער ראשי
      if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId);
        renderExtAnchor(container, 'afterMainShaar', rawText);
      } else {
        renderExtAnchor(container, 'beforeAll', rawText);
      }

      // רינדור שער אחורי (גב השער)
      if (showBackShaar) {
        renderBackShaar(container, activeThemeId);
      }

      // רינדור תוכן עניינים כללי
      if (enableGeneralTOC) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(
          container, 
          generalTocEntries, 
          "תוכן העניינים הכללי", 
          bookTitle, 
          "תוכן העניינים הכללי", 
          pageIndex,
          "תוכן העניינים הכללי", "תוכן העניינים הכללי",
          "gtoc"
        );
        pageIndex += pagesRendered;
      }
      renderExtAnchor(container, 'afterGeneralToc', rawText);

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      // חישוב גובה הערות השוליים (בתחתית הדף) שהצטברו לעמוד הנוכחי
      function getFootnotesReservedHeight() {
        if (!footnoteQueueForPage.length) return 0;
        const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
        return measureNoteBlockHeight(footnoteQueueForPage, cfg0.columns || 1) + 24;
      }

      let hasOpenPart = false;
      let prevPageEl = null;

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
          if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
          renderExtAnchor(container, 'beforeEachPart', rawText);
          hasOpenPart = true;
          ensureOddPageStart(sec.token.level);
          renderSubShaar(container, sec.token, activeThemeId);
          if (sec.token.customStyleId) {
            const inst = findExtTextStyle(sec.token.customStyleId);
            const justRendered = container.lastElementChild;
            if (inst && justRendered) {
              const tEl = justRendered.querySelector('.book-title-main');
              const sEl = justRendered.querySelector('.book-subtitle');
              if (tEl) applyExtStyleToNode(tEl, inst.def.style, 36);
              if (sEl) applyExtStyleToNode(sEl, inst.def.style, 21);
            }
          }
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
            importedTextStyles.forEach(inst => {
              if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                dtocShows.push(inst.syntheticLevel);
                if (inst.def.toc.grouping) dtocGroups.push(inst.syntheticLevel);
              }
            });
            const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
            const dtocPages = renderPaginatedTOC(
              container, 
              detailedTocEntries, 
              "מפתח ולוח עניינים מפורט", 
              currentH1Title, 
              "תוכן העניינים המפורט", 
              pageIndex,
              currentH1Title, "תוכן העניינים המפורט",
              "dtoc"
            );
            pageIndex += dtocPages;
          }
          renderExtAnchor(container, 'afterEachPart', rawText);
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.level === 0;

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;
        const sectionFillRatio = (document.getElementById('balance-chapter-end').value === 'yes')
          ? estimateSectionFillRatio(secTokens) : 1;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
          if (prevPageEl) flushFootnotesInto(prevPageEl);
          if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);
          const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
          let pageLayout = createPageLayout(
            container, 
            isFirstPage ? h2Text : '', 
            isFirstPage ? h2Id : undefined, 
            pageIndex, 
            currentH1Title, 
            currentH2Title,
            currentH3Title,
            bookTitle,
            customR, customC, customL,
            pageRole
          );
          pageIndex++;
          prevPageEl = pageLayout.page;
		  
          let remPageHeight = pageLayout.bodyFlow.clientHeight * sectionFillRatio;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
             if (title && sec.hToken.customStyleId) {
                const inst = findExtTextStyle(sec.hToken.customStyleId);
                if (inst) renderCustomHeadingInto(title, inst, h2Text);
             }
             let used = 0;
             if (spacer) used += spacer.getBoundingClientRect().height;
             if (title) {
                 used += title.getBoundingClientRect().height;
                 const titleStyle = window.getComputedStyle(title);
                 used += parseFloat(titleStyle.marginTop) + parseFloat(titleStyle.marginBottom);
             }
             remPageHeight -= used;
          }
          isFirstPage = false;

          if (isH0) {
            const singleBlock = document.createElement('div');
            singleBlock.className = 'block-single-col';
            singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
            pageLayout.bodyFlow.appendChild(singleBlock);
            const targetCol = singleBlock.querySelector('.single-wide-col');
            let pageHasContent = false;

            while (tokenIndex < secTokens.length || pendingWordTokens) {
              const currentAvailH = remPageHeight - getFootnotesReservedHeight();
              if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                break;
              }

              let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

              if (currentTok.type.startsWith('h')) {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                hElem.setAttribute('data-token-id', currentTok.id);
                if (currentTok.customStyleId) {
                  const inst = findExtTextStyle(currentTok.customStyleId);
                  if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                } else {
                  hElem.textContent = currentTok.text;
                }
                applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }

                if (document.getElementById('avoid-widows-select').value === 'yes'
                    && (tokenIndex + 1 < secTokens.length)
                    && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                    && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p') {
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                  pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                  
                  const availH = remPageHeight - getFootnotesReservedHeight();
                  if (targetCol.scrollHeight <= availH) {
                    bestFitLine = i;
                  } else {
                    break;
                  }
                }

                if (bestFitLine === 0) {
                  targetCol.removeChild(pElem);
                  if (targetCol.children.length > 0) {
                    let lastEl = targetCol.lastElementChild;
                    while (lastEl && lastEl.className.startsWith('title-level-')) {
                      targetCol.removeChild(lastEl);
                      tokenIndex--;
                      lastEl = targetCol.lastElementChild;
                    }
                    break;
                  } else {
                    if (!pageHasContent) {
                        bestFitLine = 1;
                    } else {
                        break;
                    }
                  }
                }

                if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                  const remainingAfterSplit = lines.length - bestFitLine;
                  if (bestFitLine === 1 && pageHasContent) {
                    targetCol.removeChild(pElem);
                    break;
                  } else if (remainingAfterSplit === 1) {
                    if (bestFitLine > 1) {
                      bestFitLine -= 1;
                    } else if (pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    }
                  }
                }

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                applyDelimiterStyles(pElem, 'body', getBodySizePt());

                if (isEndOfP) {
                  pendingWordTokens = null;
                  tokenIndex++;
                } else {
                  pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                  break;
                }
              }
            }
            continue;
          }

          let pagePendingNotes = [];

          while ((tokenIndex < secTokens.length || pendingWordTokens) && (remPageHeight - getFootnotesReservedHeight()) > 45) {
            let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
            const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              const currentAvailH = remPageHeight - getFootnotesReservedHeight();
              if (currentAvailH < 60) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              const spanTitle = document.createElement('div');
              spanTitle.className = 'h3-title-text';
              spanTitle.setAttribute('data-token-id', peekTok.id);
              spanTitle.id = `heading-tok-${peekTok.id}`;
              if (peekTok.customStyleId) {
                const inst = findExtTextStyle(peekTok.customStyleId);
                if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text); else spanTitle.textContent = peekTok.text;
              } else {
                spanTitle.textContent = peekTok.text;
              }
              applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId));
              spanBlock.appendChild(spanTitle);
              pageLayout.bodyFlow.appendChild(spanBlock);

              const spanHeight = spanBlock.getBoundingClientRect().height + 4;
              if (spanHeight > (remPageHeight - getFootnotesReservedHeight())) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }
              if (document.getElementById('avoid-widows-select').value === 'yes'
                  && (tokenIndex + 1 < secTokens.length)
                  && ((remPageHeight - getFootnotesReservedHeight()) - spanHeight < 30)) {
                pageLayout.bodyFlow.removeChild(spanBlock);
                break;
              }

              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanHeight;
              tokenIndex++;
              continue;
            }

            const block2Col = document.createElement('div');
            block2Col.className = 'block-2col';
            block2Col.innerHTML = `
              <div class="margin-notes-column right-margin"></div>
              <div></div>
              <div class="main-column right-col"></div>
              <div></div>
              <div class="main-column left-col"></div>
              <div></div>
              <div class="margin-notes-column left-margin"></div>
            `;
            pageLayout.bodyFlow.appendChild(block2Col);

            const rCol = block2Col.querySelector('.right-col');
            const lCol = block2Col.querySelector('.left-col');
            const rMargin = block2Col.querySelector('.right-margin');
            const lMargin = block2Col.querySelector('.left-margin');
            const colWidth = rCol.offsetWidth || 272;
            let pageHasContent = false;

            ['right', 'left'].forEach((colName) => {
              let targetCol = colName === 'right' ? rCol : lCol;
              let targetMargin = colName === 'right' ? rMargin : lMargin;

              while (tokenIndex < secTokens.length || pendingWordTokens) {
                let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                const currentAvailH = remPageHeight - getFootnotesReservedHeight();
                if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h')) {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                  hElem.setAttribute('data-token-id', currentTok.id);
				          hElem.id = `heading-tok-${currentTok.id}`;
                  if (currentTok.customStyleId) {
                    const inst = findExtTextStyle(currentTok.customStyleId);
                    if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text); else hElem.textContent = currentTok.text;
                  } else {
                    hElem.textContent = currentTok.text;
                  }
                  applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId));
                  targetCol.appendChild(hElem);

                  if (targetCol.scrollHeight > (remPageHeight - getFootnotesReservedHeight()) && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (document.getElementById('avoid-widows-select').value === 'yes'
                      && (tokenIndex + 1 < secTokens.length)
                      && ((remPageHeight - getFootnotesReservedHeight()) - targetCol.scrollHeight < 30)
                      && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p') {
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
                  let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                  let isContinuation = !!pendingWordTokens;
                  let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                  const pElem = document.createElement('p');
                  pElem.setAttribute('data-token-id', currentTok.id);
                  pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                  targetCol.appendChild(pElem);

                  if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  let bestFitLine = 0;
                  for (let i = 1; i <= lines.length; i++) {
                    let testText = lines.slice(0, i).join(' ');
                    pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
                    pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow);
                    
                    const availH = remPageHeight - getFootnotesReservedHeight();
                    if (targetCol.scrollHeight <= availH) {
                      bestFitLine = i;
                    } else {
                      break;
                    }
                  }

                  if (bestFitLine === 0) {
                    targetCol.removeChild(pElem);
                    if (targetCol.children.length > 0) {
                      let lastEl = targetCol.lastElementChild;
                      while (lastEl && lastEl.className.startsWith('title-level-')) {
                        targetCol.removeChild(lastEl);
                        tokenIndex--;
                        lastEl = targetCol.lastElementChild;
                      }
                      break;
                    } else {
                      if (!pageHasContent) {
                          bestFitLine = 1;
                      } else {
                          break;
                      }
                    }
                  }

                  if (bestFitLine > 0 && bestFitLine < lines.length && document.getElementById('avoid-widows-select').value === 'yes') {
                    const remainingAfterSplit = lines.length - bestFitLine;
                    if (bestFitLine === 1 && pageHasContent) {
                      targetCol.removeChild(pElem);
                      break;
                    } else if (remainingAfterSplit === 1) {
                      if (bestFitLine > 1) {
                        bestFitLine -= 1;
                      } else if (pageHasContent) {
                        targetCol.removeChild(pElem);
                        break;
                      }
                    }
                  }

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);
                  applyDelimiterStyles(pElem, 'body', getBodySizePt());

                  // הערת סיום (שמוגדרת בשורה) - מוסיפה סימון לסוף הפסקה
                  if (currentTok.endNote && isEndOfP) {
                    const marker = createNoteMarkerAndQueue(currentTok.endNote, null, 'endnote');
                    pElem.appendChild(marker);
                  }

                  // כותרת 7 - הערת צד בשוליים
                  if (!isContinuation && currentTok.sideNote) {
                    pElem.setAttribute('data-side-note', currentTok.sideNote);
                    const noteElem = document.createElement('div');
                    noteElem.className = 'side-note-anchor';
                    noteElem.textContent = currentTok.sideNote;
                    if (currentTok.sideNoteStyleId) {
                      const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                      if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                    }
                    targetMargin.appendChild(noteElem);
                    pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                  }

                  if (isEndOfP) {
                    pendingWordTokens = null;
                    tokenIndex++;
                  } else {
                    pendingWordTokens = { token: currentTok, remainingLines: lines.slice(bestFitLine) };
                    break;
                  }
                }
              }
            });

            if (rCol.children.length === 0 && lCol.children.length === 0) {
                pageLayout.bodyFlow.removeChild(block2Col);
                let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                    pageLayout.bodyFlow.removeChild(lastFlowEl);
                    tokenIndex--;
                    lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                }
                break;
            }

            if (tokenIndex >= secTokens.length && !pendingWordTokens) {
              balanceColumns(block2Col, colWidth, styleObj);
              const divHTML = getSectionDividerHTML(secDivStyle);
              if (divHTML) {
                const divContainer = document.createElement('div');
                divContainer.innerHTML = divHTML;
                pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
              }
              break;
            } else {
              let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
              const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';
              if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                balanceColumns(block2Col, colWidth, styleObj);
              } else {
                let usedBlockH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
                let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
                if (finalDiff > 2 && finalDiff <= 60) {
                    justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
                } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                    justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
                }
              }
            }
            
            remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
            finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
          }
        }
      }

      if (prevPageEl) { flushFootnotesInto(prevPageEl); prevPageEl = null; }
      if (hasOpenPart) { flushEndnotesForPart(container, pageIndex); renderExtAnchor(container, 'endOfEachPart', rawText); }
      else if (endnoteQueueForPart.length) { flushEndnotesForPart(container, pageIndex); }
      renderExtAnchor(container, 'afterAll', rawText);

      document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
        const targetId = span.getAttribute('data-target-id');
        if (targetId && headingPageMap[targetId]) {
          span.textContent = headingPageMap[targetId];
        }
      });
    }

    function buildStructuredTOC(tokenList, showLevels, groupLevels) {
      const entries = [];
      const minGroupLevel = groupLevels.length > 0 ? Math.min(...groupLevels) : 99;
      let currentGroupItems = [];

      function flushGroup() {
        if (currentGroupItems.length > 0) {
          entries.push({ isGroup: true, items: currentGroupItems.slice() });
          currentGroupItems = [];
        }
      }

      tokenList.forEach(t => {
        const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') ? t.text : t.sideNote;
        if (lvl === null || !txt) return;
        if (!showLevels.includes(lvl)) return;

        if (lvl >= minGroupLevel) {
          currentGroupItems.push({ id: t.id, level: lvl, text: txt });
        } else {
          flushGroup();
          entries.push({ id: t.id, level: lvl, text: txt, isGroup: false });
        }
      });

      flushGroup();
      return entries;
    }

    function renderPaginatedTOC(container, entries, titleText, bookTitle, h1Title, pageIndex, curH1, curH2, tocPrefix) {
      if (entries.length === 0) return 0;

      let pagesCount = 0;
      let currentEntryIdx = 0;
      let lastRenderedGrid = null;
      let lastRenderedPage = null;

      const hdrRType = document.getElementById('hdr-r-type').value;
      const hdrCType = document.getElementById('hdr-c-type').value;
      const hdrLType = document.getElementById('hdr-l-type').value;
      const hdrRAlign = document.getElementById('hdr-r-align').value;
      const hdrCAlign = document.getElementById('hdr-c-align').value;
      const hdrLAlign = document.getElementById('hdr-l-align').value;
      
      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
      const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);

      function getTocStyle(level) {
        const f = document.getElementById(`f-${tocPrefix}-${level}`);
        const s = document.getElementById(`s-${tocPrefix}-${level}`);
        if(f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
        return '';
      }

      while (currentEntryIdx < entries.length) {
        const isFirstTOCPage = (pagesCount === 0);
        pagesCount++;

        const page = document.createElement('div');
        page.className = 'a4-page toc-page';
        applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
        lastRenderedPage = page;
        
        page.innerHTML = `
          <div class="page-content-wrapper">
            <div class="top-header-grid">
              <div class="header-col-r" style="text-align:${hdrRAlign};">${hdrRHTML}</div>
              <div class="header-col-c" style="text-align:${hdrCAlign};">${hdrCHTML}</div>
              <div class="header-col-l" style="text-align:${hdrLAlign};">${hdrLHTML}</div>
            </div>
            <div class="page-body-flow">
              ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
              <div class="toc-grid-full"></div>
            </div>
            <div class="page-number-footer">${toGematria(pageIndex + pagesCount - 1)}</div>
          </div>
        `;
        container.appendChild(page);

        const gridFull = page.querySelector('.toc-grid-full');
        lastRenderedGrid = gridFull;

        const bodyFlow = page.querySelector('.page-body-flow');
        const maxH = bodyFlow.clientHeight || 870;

        let pageStartIndex = currentEntryIdx;
        let lastSubjectIdx = currentEntryIdx; 

        while (currentEntryIdx < entries.length) {
          const it = entries[currentEntryIdx];
          
          if (!it.isGroup && (it.level === 1 || it.level === 2)) {
             lastSubjectIdx = currentEntryIdx;
          }

          let itemHTML = '';
          
          if (it.isGroup) {
            const inlineSpans = it.items.map(grp => 
              `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${grp.id}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${grp.text}</span> - <span class="grp-page" data-target-id="${grp.id}"></span></a></span>`
            ).join('<span class="grp-sep">|</span>');
            itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
          } else {
            itemHTML = `
              <div class="toc-entry-group" style="${getTocStyle(it.level)}">
                <a href="#heading-tok-${it.id}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
                  <span class="toc-title">${it.text}</span>
                  <span class="toc-dots"></span>
                  <span class="toc-page-num" data-target-id="${it.id}"></span>
                </a>
              </div>
            `;
          }

          gridFull.insertAdjacentHTML('beforeend', itemHTML);
          
          if (bodyFlow.scrollHeight > maxH) {
            gridFull.lastElementChild.remove();
            
            if (gridFull.children.length > 0) {
                if (lastSubjectIdx > pageStartIndex) {
                    const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                    for (let k = 0; k < itemsToRemove; k++) {
                        gridFull.lastElementChild.remove();
                    }
                    currentEntryIdx = lastSubjectIdx;
                }
                break;
            } else {
                gridFull.insertAdjacentHTML('beforeend', itemHTML);
                currentEntryIdx++;
                break;
            }
          }
          
          currentEntryIdx++;
        }
      }

      if (lastRenderedGrid) {
        lastRenderedGrid.style.justifyContent = 'flex-start';
      }
      if (lastRenderedPage) {
        applyContentBg(lastRenderedPage, 'tocLast');
      }

      return pagesCount;
    }

    const textarea = document.getElementById('raw-input');

    function syncCursorToPreview() {
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const currentLineIdx = textBefore.split('\n').length - 1;

      if (lineToTokenMap && lineToTokenMap[currentLineIdx] !== undefined) {
        let tokenId = lineToTokenMap[currentLineIdx];
        if (tokenId === null) {
          for (let k = currentLineIdx - 1; k >= 0; k--) {
            if (lineToTokenMap[k] !== null && lineToTokenMap[k] !== undefined) {
              tokenId = lineToTokenMap[k];
              break;
            }
          }
        }

        if (tokenId !== null && tokenId !== undefined) {
          const targetEl = document.querySelector(`[data-token-id="${tokenId}"]`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }

    textarea.addEventListener('click', syncCursorToPreview);
    textarea.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        syncCursorToPreview();
      }
    });

    function rehydrateExtImports() {
      const island = document.getElementById('ext-imports-data');
      if (!island || !island.textContent.trim()) return;
      let data;
      try { data = JSON.parse(island.textContent); } catch(e) { return; }
      (data.pageTypes || []).forEach(inst => {
        importedPageTypes.push(inst);
        buildExtPanel('pageType', inst.instanceId, inst.def.name, inst.def);
      });
      (data.textStyles || []).forEach(inst => {
        importedTextStyles.push(inst);
        buildExtPanel('textStyle', inst.instanceId, inst.def.name, inst.def);
      });
      (data.imagePages || []).forEach(inst => {
        importedImagePages.push(inst);
        buildExtPanel('imagePage', inst.instanceId, 'תמונה: ' + inst.name, null);
      });
      if (data.customThemes && Array.isArray(data.customThemes)) {
        customThemes = data.customThemes;
        refreshCustomThemesUI();
      }
      let maxCounter = 0;
      let maxSynth = 7;
      [...importedPageTypes, ...importedTextStyles, ...importedImagePages].forEach(inst => {
        const n = parseInt((inst.instanceId.match(/-(\d+)$/) || [0,0])[1], 10);
        if (n >= maxCounter) maxCounter = n + 1;
        if (typeof inst.syntheticLevel === 'number' && inst.syntheticLevel > maxSynth) maxSynth = inst.syntheticLevel;
      });
      extImportCounter = maxCounter;
      nextSyntheticLevel = maxSynth + 1;
    }

    window.onload = function() {
      refreshCustomThemesUI();
      rehydrateExtImports();
      
      if (document.getElementById('section-divider-style').value === 'custom_img') {
        document.getElementById('row-sec-div-img').style.display = 'flex';
      }
      if (document.getElementById('hdr-c-type').value === 'custom_img') {
        document.getElementById('row-hdr-c-img').style.display = 'flex';
      }

      textarea.value = `שם הספר - ספר מלכי המלוכה
נושא - ביאורים וחידושים עמוקים על מסכתות הש"ס
נושא מפורט - בירור שיטות הראשונים והאחרונים ובירורי הלכות למעשה
פרטי מהדורא - מהדורה שניה ומורחבת בסייעתא דשמיא
שם המחבר - הצעיר ידידיה בר אבא הלוי
מקום ושנת הוצאה - ירושלים עיה"ק תובב"א שנת ה'תשפ"ו

כותרת 0 - הקדמת המחבר
גוף הטקסט בעימוד של טור אחד נרחב, המשתרע לרוחב כל עמוד ההקדמה. עימוד זה מיועד בדרך כלל להקדמות ופתיחות, שבהן הסגנון הספרותי מורחב ומשתרע כרציף.

כותרת 1 - חלק ראשון - ענייני תפילה וקריאת שמע
כותרת 2 - סימן א - דיני תפילת השחר וזמנה
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום [כאן הערת שוליים בתחתית העמוד הנלמדת מדברי הראשונים].
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית.
הערת סיום - כאן הערת סיום מורחבת המרוכזת בסוף החלק.

כותרת 3 - ענף א: שיטת הרמב"ם בדין אונס ועבר זמן תפילה
גוף הטקסט בטורים המיושרים באופן מושלם. פסקאות אלו מדגימות את מנגנון האיזון המדויק המופעל בכל חיתוך.
כאשר טור אחד ימני מתמלא הוא מעביר שורות שלמות בלבד אל הטור השמאלי כדי שלא תיווצר מילה בודדת קטועה.
העימוד התורני מקפיד מאוד על שלמות הפסקאות והשורות כך שהקריאה תהיה רציפה ונעימה לעין הלומד.

כותרת 4 - סעיף א: בירור דעת בעל השאילתות
גוף הטקסט הבא תחת סעיף א מיועד לבאר את דברי הראשונים. כל פסקה מקבלת חלון מילה ראשונה רק אם היא מחזיקה שתי שורות ומעלה. פסקאות קצרות של שורה אחת אינן מקבלות חלון מילה ראשונה כדי למנוע שיבושים בעימוד הפסקאות הבאות אחריהן.
פיסקה קצרה.

כותרת 5 - סעיף ב: יישוב קושיית הנודע ביהודה
גוף הטקסט ממשיך לזרום בטורים שווים.

כותרת 7 - הערה נחוצה בצד העמוד
גוף הטקסט המכיל הערות צד בשולי הדף. הערות אלו ממוקמות בדיוק מול הפסקה אליה הן מתייחסות, ובכך מאפשרות ללומד לעיין במקורות תוך כדי לימודו הרציף בגוף הספר.`;
      typesetDocument();
    };
  </script>
</body></html>
```

---

## פנייה 10: משהו מוזר קורה.... כל הערת שוליים (המוסגרת בסוגריים מרובעים) מופיעה כמה פעמים,…

משהו מוזר קורה....
כל הערת שוליים (המוסגרת בסוגריים מרובעים) מופיעה כמה פעמים, וגם המספור של ההערות אינו מתחיל מהתחלה (התחיל ב14).
וגם ברירת המחדל של המספור צריך להיות בא,ב,ג,ד,ה,ו,ז,ח,ט,י,יא,יב,יג,יד,טו,טז, וכו' וכו'.

---

### 🤖 תגובה 29: Analyzing the Problem I've zeroed in on the user's core issue: footnotes…

**Analyzing the Problem**

I've zeroed in on the user's core issue: footnotes enclosed in square brackets are repeating. I'm focusing specifically on how the user presented the problem. I'm still gathering information, but this seems like a solid starting point for a solution. I'm trying to see if there is any other context to the problem.


**Addressing Numbering and Format**

I've got more information. The user wants the footnote numbering to start from one, and use the Hebrew Gematria format. The root cause analysis led me to a few instances where `applyDelimiterStyles` is called, potentially contributing to the numbering issue, and the numbering format issue.


**Pinpointing the Counter Reset**

I've uncovered a crucial detail regarding the footnote counters. The `noteCounters` object, responsible for footnote numbering, isn't reset at the start of `typesetDocument()`. This leads to the counter incrementing unnecessarily during trial fits and balance column operations. If a footnote is processed multiple times during layout, the same note could be numbered more than once. This seems to confirm that this is the main cause of the issue. I am working on the next steps to address this.


**Clarifying the Footnote Logic**

I've made a breakthrough. Footnotes are being duplicated because of multiple calls during `balanceColumns`. This increases the counter unnecessarily. In the final append, the counter increments again, leading to the reported behavior. It explains both the duplication and incorrect numbering.

I now understand that the issue lies in the `formatNoteMarker` function. Its incorrect usage of a base-22 sequence rather than Gematria for the Hebrew letters, along with the default of numeric values instead of Hebrew letters, causes the format problem.

To resolve it, I'll reset `noteCounters` at the start of `typesetDocument()`. Critically, I will also prevent footnotes from being queued during trial measurements by adding a flag to `applyDelimiterStyles` or deferring the queuing to the final rendering. I will study when `applyDelimiterStyles` is called.


**Isolating the Root Cause**

I've made a crucial observation. During `balanceColumns`, the function `renderSingleItemFast` is used solely for temporary height probing. Crucially, the function should NOT be adding to the `footnoteQueueForPage` or incrementing the `noteCounters` at this stage. I am now focused on how `applyDelimiterStyles` is incorrectly being called during this trial rendering process, leading to the duplication and incrementing problems, even before the final layout. My focus is on the `applyDelimiterStyles` function being called and handled in two different stages.


**Refining the Queue Process**

Now I have a clearer picture of the optimal footnote queuing. I'm thinking of a `dryRun` flag for `applyDelimiterStyles`. If it's `true`, the footnote marker is just a placeholder, the counter isn't incremented, and the footnote isn't queued. This works for measuring during processes such as `balanceColumns`. If `dryRun` is `false`, which is the default, the footnote is handled normally. I've also re-confirmed that I will reset the `noteCounters`, `noteUidCounter`, and `footnoteQueueForPage` at the start of `typesetDocument()`.


**Defining the Configuration**

I'm now integrating the user's continuous or per-page numbering preference into the logic. I need to ensure that regardless, the first footnote always starts with "א" (1 in Gematria) at the beginning of the book. I'm focusing on the interaction between the existing `toGematria(num)` function and the footnote marker formatting.



**Implementing the Dry Run**

I'm now implementing the `dryRun` flag for `applyDelimiterStyles` to prevent unintended footnote increments during trial fits, specifically within `balanceColumns`. This will ensure the counter isn't increased and that footnotes are not unnecessarily queued during these preliminary calculations. The `dryRun` flag is set to true during the trial runs.

I need to confirm the impact on a split paragraph within `balanceColumns`.


**Examining Delimiter Handling**

I'm now diving into the specifics of how the splitting and processing of text with footnotes works. I've considered that `applyDelimiterStyles` only queues the footnote marker once, even when the split happens right in the middle of a text, like with `rightText` and `leftText`, because of how words are split into lines. I'm focusing on validating this split implementation.

\n\n

**Adding Numbering Style Selector**

I'm moving on to consider the user interface. I'm suggesting a selector for the footnote numbering style within the panel, offering a switch between Hebrew letters (the default) and numbers. Now I'll be exploring the existing Note Panel HTML to see how to implement this selector.

---

## פנייה 11: עכשיו צור מסמך מסודר, מפורט ומעמיק בפורמט Markdown הכולל את כל הפרטים הטכניים,…

עכשיו צור מסמך מסודר, מפורט ומעמיק בפורמט Markdown הכולל את כל הפרטים הטכניים, האלגוריתמים, מקרי הקצה והניסיונות שבוצעו בשיחה זו. 

שים לב: התוכנה היא מערכת מורכבת לעימוד ספרים תורניים. חשוב לתעד לא רק מה עובד, אלא גם מה שנכשל ואיך גילינו זאת.

אנא חלק את המסמך למבנה הבא:

### 1. סקירת המערכת והארכיטקטורה (High-Level Overview)
- ייעוד התוכנה, הטכנולוגיות שבשימוש (שפות, ספריות, Architectural Patterns).
- עקרונות תכנון מרכזיים והפרדת אחריות במערכת (MVC/MVVM, Threading, Rendering Engine).

### 2. מכלול האלגוריתמים והבעיות שפתרנו (Deep Dive Implementation)
עבור כל אחד מהנושאים הבאים (ועבור כל נושא נוסף שעלה בשיחה), פרט את הלוגיקה, המבנים הנתונים, והחישובים שנבחרו:
- עימוד ויישור שני טורים (Two-Column Layout & Balancing).
- מניעת שורות וכותרות יתומות/אלמנות (Orphan & Widow control).
- עימוד וניהול כותרות צד (Side Headings / Marginalia).
- מנגנון הערות שוליים בתחתית העמוד (Footnotes Positioning).
- גלישת טקסט בין הטורים ולאזור הערות השוליים (Text Flow & Area Overflow Handling).
- איזון סוף פרק / סוף מודול (Chapter Balancing).
- נושאים נוספים שנידונו בשיחה (חטיפות טקסט, גופנים, שילוב עיטורים, Layout Engine, Performance וכו').

### 3. יומן כישלונות, טעויות וניסיונות שנפסלו (Mistakes & Failed Approaches)
זהו חלק קריטי! מנה את כל הניסיונות, המנגנונים או האלגוריתמים שהוצעו במהלך השיחה והתבררו כבלתי מתאימים:
- מה הייתה ההצעה/הגישה הראשונית?
- באיזה תרחיש או מקרה קצה (Edge Case) היא נכשלה?
- כיצד הטיעון/המבחן הוכיח שהיא מוטעית?
- מה המסקנה הנלמדת מניסיון זה ולמה אסור לחזור אליו?

### 4. סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase & Implementation State)
- מפה של המחלקות (Classes), הפונקציות והמנגנונים שנכתבו והוסכמו.
- קטעי הקוד המרכזיים והסופיים שנבנו (Complete Production-Ready Code Snippets), כולל הסבר על טיפול בשגיאות ומקרי קצה.

### 5. מקרי קצה שנבדקו ותורגמו לבדיקות (Edge Cases & Validation)
- רשימה של מקרי הקצה המיוחדים לעימוד תורני שנלקחו בחשבון (כגון: הערת שוליים ארוכה מעמוד كامل, כותרת בתחתית טור, חוסר מקום בטור ב', טקסט קודש מול פירושים וכו').
- כיצד המערכת מטפלת בהם כעת?

### 6. מפת דרכים והצעדים הבאים (Roadmap & Pending Tasks)
- מה מתוכנן לשלב הבא?
- איזה בעיות נותרו פתוחות או דורשות אופטימיזציה נוספת?
- הנחיות ספציפיות ל-AI הבא שימשיך את הפיתוח מנקודה זו.

כתובי את המסמך בצורה טכנית, מדויקת ומפורטת ככל האפשר, ללא שיווק או מילות קישור מיותרות.

---

### 🤖 תגובה 30: Defining the Objective I'm currently focused on fully grasping the ultimate…

**Defining the Objective**

I'm currently focused on fully grasping the ultimate goal: creating an exhaustive Markdown specification of the Torani A4 Typesetting Web Application. My aim is to include every detail, drawing from past conversations and implementations. I want this specification to be incredibly technical and all-encompassing, suitable for experts.


**Analyzing the Document Structure**

I've decided on a definitive 6-part structure for the specification, meticulously detailing the system's architecture, algorithms, and past errors. I will go into detail on the current codebase, edge cases, and future plans. I plan on following the prescribed format: High-Level Overview, Deep Dive Implementation, Mistakes & Failed Approaches, Current Codebase & Implementation State, Edge Cases & Validation, and Roadmap & Pending Tasks.


**Detailing the Algorithms**

I'm now diving deep into the core algorithms, focusing on the two-column layout. I'm scrutinizing the brute-force method for split-point evaluation, including headless DOM probing and vertical justification. I'm also examining the specifics of orphan and widow control, especially the detection of single-line fits and residual lines, and how they trigger back-tracking.


**Elaborating Note Mechanics**

I'm now deep in the intricacies of note placement. Specifically, I'm focusing on collision detection for adjacent side notes, clamping to column boundaries, and spillover handling for continuation across paragraphs. I'm also addressing footnote mechanics, including inline delimiter extraction and dynamic reserve height calculation to prevent collisions. Finally, I'm incorporating Gematria numbering and endnote handling via queueing and multi-page pagination.


**Optimizing Page Distribution**

I'm now focusing on calculating the target fill ratio, ensuring an even distribution of content across pages. I'm aiming to prevent any single-line spillover on the final page. I'm also looking at the three-page theme, four-margin bounding box geometry, SVG vector injections, and data island persistence. Finally, I've had to address failures, especially those regarding footnote queue pollution and counter explosions.


**Addressing Recent Errors**

I've been fixing some significant bugs. Notably, counters weren't resetting, causing footnotes to multiply and counters to start incorrectly. The base-22 letter sequence for Gematria was wrong, generating spreadsheet columns instead of traditional Gematria values. I also had problems with DOM collisions between footnotes and page footers. Furthermore, Level 7 side notes were conflated with footnotes, and a custom background was causing alignment issues.


**Refining SVG and Layout**

I'm now focusing on two key problems. First, SVG elements were not rendered as separate Z-layers, which caused overlaps. Second, the default `preserveAspectRatio` for SVGs on the A4 canvas created white gaps. I resolved this by injecting `preserveAspectRatio="none"`. Also, an over-aggressive chapter fill ratio floor of 0.85 was causing uneven distribution. I have adjusted this to a mathematical target, clamping at 0.30 for safety. Now, the emphasis is on drafting a highly technical Hebrew document with complete code examples.

---

### 🤖 תגובה 31: # תיעוד ארכיטקטוני ומפרט טכני: מערכת עימוד תורנית מקצועית לדפי A4 --- ## 1.…

# תיעוד ארכיטקטוני ומפרט טכני: מערכת עימוד תורנית מקצועית לדפי A4

---

## 1. סקירת המערכת והארכיטקטורה (High-Level Overview)

### 1.1 ייעוד התוכנה
המערכת היא מנוע עימוד (Typesetting Engine) מבוסס Web, ייעודי לספרות תורנית ועיונית בפורמט A4. המערכת מקבלת טקסט גולמי ומבצעת פריסה (Layout), שבירת שורות מדויקת, עימוד דו-טורי מאוזן, חלוקת עמודים (Pagination), ניהול הערות שוליים (Footnotes) והערות סיום (Endnotes), מיקום כותרות צד (Marginalia), יצירת תוכן עניינים מדורג והטמעת שערי ספר וקטוריים (SVG).

### 1.2 סטאק טכנולוגי
* **סביבת ריצה:** Client-Side Single-Page Application (SPA) ללא תלות בשרת (Zero-Backend).
* **שפות וטכנולוגיות:** HTML5, CSS3 (CSS Grid, Flexbox, Custom Properties), JavaScript (ES6+ Vanilla).
* **ממשקי דפדפן מתקדמים:**
  * **Local Font Access API (`window.queryLocalFonts`):** לטעינה ישירה של גופני מערכת ההפעלה (Windows/Mac) ללא צורך בהתקנת שרת גופנים.
  * **FileReader & Data URLs:** להטמעת תמונות וקובצי SVG כ-Base64 בתוך ה-DOM.
  * **CSS Paged Media (`@page`, `@media print`):** להפקת PDF ברמת דפוס בגודל 210mm × 297mm.

### 1.3 עקרונות תכנון וארכיטקטורה
המערכת פועלת על פי תבנית **Pipeline Rendering Engine**:

```
[Raw Text Input] 
       │
       ▼
[Metadata & Syntax Parsing (Tokenization)]
       │
       ▼
[Section & Page Role Splitter]
       │
       ▼
[Pagination & Layout Assembly]
       ├── [Headings & Spans]
       ├── [Two-Column Micro-Balancing (DOM Probing)]
       ├── [Marginalia (Side Notes) Collision Resolver]
       └── [Footnotes Reserve Height & Flush]
       │
       ▼
[Post-Processing: TOC Gematria Back-Filling & Note Linking]
       │
       ▼
[DOM Preview / Print Target]
```

* **הפרדת תצוגה ושליטה (Sidebar / Preview Pane):**
  הממשק מופרד לסרגל שליטה אינטראקטיבי (Control Sidebar) הניתן לשינוי גודל (Drag Resizer) ולפאנל תצוגה מקדימה (Preview Pane) המרנדר דפי A4 עצמאיים.
* **מנגנון תבניות מוטמע (JSON Data Island Persistence):**
  המערכת כוללת שמירה ושחזור מלאים של ערכות נושא (Themes) ותוספים (Extensions) באמצעות תגית `<script type="application/json" id="ext-imports-data">` המוטמעת ב-HTML, מה שמאפשר לייצא קובץ יחיד שהוא בעת ובעונה אחת תוכנה, תבנית ומסמך מעומד.

---

## 2. מכלול האלגוריתמים והבעיות שפתרנו (Deep Dive Implementation)

### 2.1 עימוד ויישור שני טורים (Two-Column Layout & Balancing)

#### הבעיה
שבירת פסקאות בין שני טורים אינה ליניארית: הדפדפן מחשב יישור לשני הצדדים (Justify) ומבצע שבירת שורות לפי רוחב הטור. חלוקה שרירותית של פסקאות מובילה להפרשי גובה משמעותיים בין טור ימין לטור שמאל בסוף פרק או לפני כותרת רוחבית (`block-h3-span`).

#### הפתרון האלגוריתמי
המערכת מיישמת אלגוריתם **Brute-Force Discrete Split-Point Search**:

1. **מדידת שבירת שורות אמיתית (`getLinesFromParagraph`):**
   * הפסקה מוזרקת לקונטיינר מדידה מוסתר (`#measuring-box`) בעל רוחב טור מדויק, גופן, גודל וגובה שורה תואמים.
   * כל מילה נעטפת ב-`<span>`. המערכת דוגמת את ה-`offsetTop` של כל מילה.
   * שינוי ב-`offsetTop` מעל סף שגיאה (8px) מגדיר שבירת שורה אותנטית של מנוע הרנדור של הדפדפן.
2. **איסוף כל נקודות החיתוך האפשריות:**
   * נבנה מערך של כל נקודות הפיצול האפשריות ברמת השורה הבודדת (למשל: פסקה 1 שורה 3 בטור ימין, והשאר בטור שמאל).
   * נפסלות נקודות חיתוך שמותירות כותרת בסוף טור ימין.
3. **הערכת גבהים וחלוקה אופטימלית (`balanceColumns`):**
   * עבור כל נקודת פיצול, מרונדר מודל זמני מהיר (`renderSingleItemFast` במצב `dryRun = true`).
   * מחושב ההפרש: $\Delta H = |H_{\text{right}} - H_{\text{left}}|$.
   * נקודת הפיצול שממזערת את $\Delta H$ נבחרת לרינדור הסופי.
4. **יישור תחתון (Vertical Justification):**
   * במידה ונותר פער של $2\text{px} < \Delta H \le 60\text{px}$, המערכת מפעילה את `justifyColumnVertically`:
     * אם יש יותר מפסקה אחת בטור הקצר: הפער מחולק שווה בשווה כתוספת `margin-bottom` בין הפסקאות.
     * אם יש פסקה בודדת: מחושב תוסף מזערי ל-`line-height` פר שורה:
       $$\Delta \text{LH} = \frac{\Delta H}{\text{numLines} \times \text{fontSizePx}}$$

---

### 2.2 מניעת שורות וכותרות יתומות/אלמנות (Orphan & Widow Control)

#### הבעיה
חיתוך פסקה בין טורים או בין עמודים עלול להותיר שורה ראשונה בודדת בתחתית הטור הקודם (Orphan / יתומה) או שורה אחרונה בודדת בראש הטור הבא (Widow / אלמנה). בנוסף, כותרת עלולה להופיע בתחתית עמוד ללא טקסט אחריה.

#### הלוגיקה האלגוריתמית
בעת מילוי טור או עמוד (`isH0` / `block-2col`):
1. **מניעת כותרת יתומה בתחתית עמוד:**
   * אם נותר גובה נמוך מסף קריטי (30px) לאחר הוספת כותרת, הכותרת נמחקת מהטור ומועברת לראש הטור/עמוד הבא.
2. **מניעת שורות יתומות ואלמנות בפסקאות חתוכות:**
   * אם נקבע חיתוך בפסקה (`bestFitLine` מתוך `lines.length`):
     * **בדיקת שורה יתומה:** אם $\text{bestFitLine} = 1$ (רק שורה אחת נכנסת בטור הנוכחי) והעמוד אינו ריק – הפסקה כולה נדחית לטור הבא.
     * **בדיקת שורה אלמנה:** אם $\text{lines.length} - \text{bestFitLine} = 1$ (רק שורה אחת תישאר לטור הבא):
       * אם $\text{bestFitLine} > 1$: מקטינים את `bestFitLine` ב-1, כך ששתי שורות יעברו יחד לטור הבא.
       * אם $\text{bestFitLine} = 1$: הפסקה כולה מועברת לטור הבא.

---

### 2.3 עימוד וניהול כותרות צד (Side Headings / Marginalia)

#### המבנה הגיאומטרי
הגריד הראשי של העמוד מורכב מ-7 עמודות סימטריות המוגדרות במשתני CSS:
```css
grid-template-columns: var(--w-margin) var(--w-gap) var(--w-col) var(--w-gutter) var(--w-col) var(--w-gap) var(--w-margin);
```
* עמודה 1: שוליים ימניים (`.right-margin`) עבור כותרות צד של הטור הימני.
* עמודה 3: טור טקסט ימני (`.right-col`).
* עמודה 4: רווח מרכזי (`.header-col-c` / gutter).
* עמודה 5: טור טקסט שמאלי (`.left-col`).
* עמודה 7: שוליים שמאליים (`.left-margin`) עבור כותרות צד של הטור השמאלי.

#### אלגוריתם מניעת התנגשויות וגלישת כותרות צד (`finalizeNotePositions`)
1. **ייחוס ראשוני:** כל כותרת צד מקבלת `top` התחלתי השווה ל-`offsetTop` של הפסקה אליה היא שייכת.
2. **זיהוי חריגה תחתית (Bottom Boundary Overflow):**
   * אם $\text{top} + H_{\text{note}} > H_{\text{column}}$, נבדקת אפשרות **הגבהה (Elevation)**:
     $$\text{raisedTop} = H_{\text{column}} - H_{\text{note}}$$
   * אם $\text{raisedTop} \ge \text{prevNoteBottom} + 6\text{px}$, הכותרת מוגבהת למיקום זה.
3. **העברה להמשך הפסקה (Spillover to Continuation):**
   * אם אין מקום להגביה עקב כותרת צד קודמת, המערכת מאתרת את המשך הפסקה באותו עמוד (אלמנט בעל `data-token-id` זהה עם `data-is-cont="true"` בטור המקביל).
   * כותרת הצד מועברת פיזית ל-DOM של טור השוליים הנגדי ומיושרת מול תחילת מקטע ההמשך.

---

### 2.4 מנגנון הערות שוליים (Footnotes) בתחתית העמוד

#### הבעיה
הערות שוליים מוכרזות בתוך הטקסט הרץ באמצעות תוחמים (Delimiters כגון `[...]`). נוצרת תלות מעגלית: הוספת טקסט לטור יוצרת הערת שוליים, שמקטינה את השטח הפנוי לטקסט באותו עמוד.

#### הפתרון האלגוריתמי
1. **חילוץ והמרת תוחמים (`applyDelimiterStyles`):**
   * הטקסט של הפסקה נסרק באמצעות `TreeWalker`.
   * מופעים של תוחמי פתיחה וסגירה מאותרים, הטקסט הפנימי נשלף, והתוחמים מוחלפים בתגית קישור עוגן `<a class="note-marker">` עם אות עברית (גימטריה).
   * תוכן ההערה נדחף לתור עמוד נוכחי (`footnoteQueueForPage`).
2. **ניכוי שטח דינמי בזמן מילוי הטורים (`getFootnotesReservedHeight`):**
   * בכל איטרציה של הוספת פסקה/שורה, מחושב הגובה שההערות הקיימות בתור יתפסו:
     $$H_{\text{reserved}} = \text{measureNoteBlockHeight}(\text{queue}, \text{columns}) + 24\text{px}$$
   * הגובה הזמין למילוי טורים מוגדר דינמית:
     $$H_{\text{avail}} = H_{\text{pageFlow}} - H_{\text{reserved}}$$
3. **מיקום והפרדה מבנית ב-DOM:**
   * אלמנט `.footnote-area` מוזרק ב-`flushFootnotesInto` לתוך `.page-content-wrapper` **לפני** `.page-number-footer`.
   * ה-CSS מוגדר כ-`position: relative` ולא `absolute`, מה שמבטיח אי-התנגשות פיזית עם מספרי העמודים.

---

### 2.5 איזון סוף פרק (Chapter End Balancing & Fill Ratio)

#### הבעיה
פרק המכיל תוכן של 2.1 עמודים ייצור שני עמודים מלאים ועמוד שלישי המכיל 2 שורות בלבד.

#### הפתרון האלגוריתמי (`estimateSectionFillRatio`)
1. מודדים את סך הגובה של כל הטוקנים הנותרים בפרק ($H_{\text{total}}$) באמצעות אלמנט מדידה מוסתר.
2. מחשבים את קיבולת העמוד ($C_{\text{page}} \approx H_{\text{flow}} \times 2$).
3. מחשבים את מספר העמודים הנאיבי: $N = \lceil H_{\text{total}} / C_{\text{page}} \rceil$.
4. אם $N > 1$, מחושב יחס מילוי אחיד לכל עמודי הפרק:
   $$R = \text{clamp}\left(0.30,\, \frac{H_{\text{total}}}{N \times C_{\text{page}}},\, 1.0\right)$$
5. בכל עמוד בפרק, גובה המילוי האפקטיבי מוגבל ל-$H_{\text{flow}} \times R$, מה שמביא לפיזור אחיד לחלוטין של השורות על פני $N$ העמודים ולסיומת מאוזנת.

---

### 2.6 מנוע ערכות נושא לשערים ועיבוד SVG וקטורי

#### ארכיטקטורת השערים
ערכת נושא כוללת שלישיית שערים:
1. **שער ראשי (Main Shaar):** תוכן ממורכז בתוך מסגרת מלאה.
2. **שער אחורי (Back Shaar / Verso):** גב השער הראשי, תוכן מיושר בטור הימני (שוליים שמאליים מוגדלים).
3. **שער משנה (Sub Shaar):** פותח חלק, תוכן מיושר בטור השמאלי (שוליים ימניים מוגדלים).

#### גיאומטריית 4 שוליים עצמאיים
לכל שער מוגדרת תיבת תוכן מוחלטת (`.theme-bounded-content`):
```css
position: absolute;
top: var(--theme-top);
bottom: var(--theme-bottom);
right: var(--theme-right);
left: var(--theme-left);
```

#### מתיחה וקטורית מדויקת (SVG Lossless Stretch)
קובצי SVG מכילים ברירת מחדל של `preserveAspectRatio="xMidYMid meet"`, הגורמת לפסים ריקים (Letterboxing) ב-A4.
בעת טעינה ב-`handleImageUpload`:
1. הקובץ נקרא כטקסט.
2. תגית ה-`<svg>` מעובדת באמצעות Regex להזרקת `preserveAspectRatio="none"`.
3. ה-SVG מקודד מחדש ל-Data URL (`data:image/svg+xml;charset=utf-8,...`).
4. מוצג ב-CSS עם `width: 100% !important; height: 100% !important; object-fit: fill !important;`.

---

## 3. יומן כישלונות, טעויות וניסיונות שנפסלו (Mistakes & Failed Approaches)

### 3.1 כפילות הערות שוליים וזינוק מונה המספור

#### ההצעה הראשונית
קריאה ישירה ל-`applyDelimiterStyles` מתוך כל פונקציית עזר שמרנדרת פסקה (`renderSingleItemFast`, `pElem.innerHTML = ...`).

#### תרחיש הכישלון
1. אלגוריתם איזון הטורים (`balanceColumns`) בודק עשרות נקודות פיצול אפשריות בלולאה.
2. בכל בדיקה, `renderSingleItemFast` קרא ל-`applyDelimiterStyles`.
3. כל קריאה הגדילה את המונה הגלובלי `noteCounters.footnote` ודחפה מופע נוסף של ההערה לתוך `footnoteQueueForPage`.
4. **תוצאה:** הערת שוליים בודדת הוכפלה 10–20 פעמים בתחתית העמוד, והמספור שלה התחיל ממספרים גבוהים (14, 28 וכו').

#### המסקנה והכלל הנלמד
* **איסור מוחלט על Side-Effects (מוטציות בתורים ובמונים) בתוך פונקציות מדידה ובדיקה!**
* פונקציית `applyDelimiterStyles` פוצלה לקבלת פרמטר `dryRun`. כאשר `dryRun === true`, נוצר סימון דמה (`*`) ללא פגיעה במונים וללא דחיפה לתור ההערות.
* מוני ההערות מאופסים באופן מפורש בתחילת כל מחזור עימוד (`typesetDocument`).

---

### 3.2 שיבוש מספור אותיות עבריות (Gematria vs Base-22)

#### ההצעה הראשונית
שימוש באלגוריתם מרה נומרי מבוסס מודולו 22 (`toHebrewLetterSeq`):
`num % 22 -> ['א','ב'...'ת']`

#### תרחיש הכישלון
עבור הערה מספר 11 התקבל התוצאה: `יא` כצירוף מודולרי, אך עבור הערה 15 התקבל `יה` (איסור תורני-מסורתי), עבור הערה 16 התקבל `יו`, ועבור מספרים מעל 22 התקבלו רצפים בסגנון טבלאות אקסל (`אא`, `אב` במקום `כג`, `כד`).

#### המסקנה והכלל הנלמד
* מספור תורני מחייב שימוש בפונקציית גימטריה תקנית (`toGematria`) הכוללת פירוק למאות, עשרות ויחידות, עם טיפול בחריגי `טו` ו-`טז`.

---

### 3.3 התנגשות הערות שוליים עם מספר העמוד וגוף הטקסט

#### ההצעה הראשונית
מיקום `.footnote-area` באמצעות CSS קשיח: `position: absolute; bottom: 15mm;`.

#### תרחיש הכישלון
1. מספר העמוד (`.page-number-footer`) ממוקם ב-15mm מתחתית הדף. תיבת ההערות דרסה פיזית את מספר העמוד.
2. גוף הטקסט (`page-body-flow`) מילא את הדף עד סופו, ולאחר מכן תיבת ההערות כיסתה את השורות התחתונות של הטקסט.

#### המסקנה והכלל הנלמד
* תיבת ההערות חייבת להיות חלק מ-DOM Flow הטבעי מעל ה-Footer.
* מנוע העימוד חייב לנכות את גובה תיבת ההערות **מראש** מקיבולת העמוד הזמינה לטורים.

---

### 3.4 ערבוב בין כותרת 7 (הערת צד) להערות שוליים תחתונות

#### ההצעה הראשונית
איחוד כל מנגנוני ההערות תחת טבלה אחת שבה `כותרת 7 -` נותבה להערת שוליים תחתונה.

#### תרחיש הכישלון
ביטול מוחלט של מוסכמת העימוד התורני שבה `כותרת 7` מהווה "הערת צד" (כדוגמת מסורת הש"ס / הגהות הב"ח) המוצגת בשוליים החיצוניים של הדף במקביל לפסקה.

#### המסקנה והכלל הנלמד
* הפרדה סמנטית ומבנית מוחלטת:
  * **כותרת 7:** כותרת צד בשוליים (`margin-notes-column`).
  * **הערות שוליים:** מוגדרות בתוחמי טקסט בלבד (`[...]`) ומוצגות בתחתית.
  * **הערות סיום:** מוגדרות בקידומת שורה (`הערת סיום -`) ומרוכזות בסוף החלק.

---

### 3.5 עיוות עמוד שער משנה בעת טעינת רקע מותאם

#### ההצעה הראשונית
החלפת מבנה ה-HTML של שער המשנה לקונטיינר ממורכז כללי (`sub-shaar-content-centered` ברוחב 100%) כאשר נבחר רקע מותאם.

#### תרחיש הכישלון
הטקסט של שער המשנה קפץ ממיקומו המסורתי (טור שמאלי) למרכז הדף, תוך דריסת העיטורים הימניים של קובץ ה-SVG.

#### המסקנה והכלל הנלמד
* הפרדת שכבת ה-Background (שכבת Z-Index 5) משכבת ה-Content Layout (שכבת Z-Index 20).
* מיקום הטקסט בשער המשנה חייב להישאר נעול בטור השמאלי לפי 4 השוליים של ערכת הנושא.

---

## 4. סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase & Implementation State)

### 4.1 מפת פונקציות מרכזיות

| שם הפונקציה | תפקיד ארכיטקטוני | קלטים מרכזיים | פלטים / תוצאה |
| :--- | :--- | :--- | :--- |
| `typesetDocument()` | המנוע המרכזי (Orchestrator) של תהליך העימוד | קלט טקסט, הגדרות UI | בנייה מלאה של ה-DOM ב-`#book-container` |
| `balanceColumns()` | איזון מיקרו-טיפוגרפי של 2 טורים | אלמנט בלוק, רוחב טור, אובייקט סגנון | חלוקת שורות אופטימלית ויישור תחתון |
| `getLinesFromParagraph()` | פירוק פסקה לשורות אותנטיות של הדפדפן | טקסט, רוחב טור, סגנון, דגל חלון מילה | מערך שורות טקסט (`lines[]`), דגל חלון |
| `applyDelimiterStyles()` | איתור תוחמים והמרת הערות/סגנונות | אלמנט מארח, הקשר, גודל, דגל `dryRun` | החלפת טקסט בעוגני הערות ודחיפה לתורים |
| `flushFootnotesInto()` | ריקון תור הערות שוליים לעמוד | אלמנט עמוד (`.a4-page`) | יצירת DOM מעל הפוטר ואיפוס המונה |
| `finalizeNotePositions()` | פתרון התנגשויות והגבהת כותרות צד | מערך הערות צד, גובה גבול הטור | קביעת ערכי `style.top` תקינים ללא גלישה |
| `estimateSectionFillRatio()`| חישוב מקדם פיזור לסוף פרק | מערך טוקנים של הפרק | ערך מספרי בין 0.30 ל-1.0 |
| `renderMainShaar()` | רינדור שער ראשי וקטורי | קונטיינר יעד, מזהה ערכה | יצירת דף שער ראשי תחום בשוליים |
| `renderBackShaar()` | רינדור שער אחורי (טור ימני) | קונטיינר יעד, מזהה ערכה | יצירת דף גב שער תחום בשוליים |
| `renderSubShaar()` | רינדור שער משנה (טור שמאלי) | קונטיינר יעד, טוקן כותרת, מזהה ערכה | יצירת שער חלק תחום בשוליים |
| `toGematria()` | המרת מספר לגימטריה עברית מדויקת | מספר שלם ($1..999$) | מחרוזת אותיות (כולל `טו`, `טז`) |

---

### 4.2 קטעי קוד ליבה (Production-Ready Code Snippets)

#### מנגנון הגימטריה התורנית
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
```

#### טיפול בקובצי SVG וקטוריים
```javascript
function handleImageUpload(event, targetInputId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    reader.onload = function(e) {
      let svgText = e.target.result;
      // ביטול נעילת פרופורציות פנימית של ה-SVG למתיחה מושלמת ב-A4
      if (svgText.includes('preserveAspectRatio')) {
        svgText = svgText.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"');
      } else {
        svgText = svgText.replace(/<svg\b/, '<svg preserveAspectRatio="none"');
      }
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = dataUrl;
        targetInput.setAttribute('value', dataUrl);
        typesetDocument();
      }
    };
    reader.readAsText(file);
  } else {
    reader.onload = function(e) {
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        targetInput.value = e.target.result;
        targetInput.setAttribute('value', e.target.result);
        typesetDocument();
      }
    };
    reader.readAsDataURL(file);
  }
}
```

#### חילוץ ועיבוד תוחמי הערות שוליים
```javascript
function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt, dryRun = false) {
  const activeStyles = [];

  const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
  const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
  if (fnOpen && fnClose) {
    activeStyles.push({
      def: { trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose }, target: 'footnote' },
      instanceId: 'builtin-footnote'
    });
  }

  importedTextStyles.forEach(inst => {
    const trig = inst.def && inst.def.trigger;
    if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
    const scope = trig.appliesWithin;
    if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
    activeStyles.push(inst);
  });

  if (!activeStyles.length) return;
  const effHostSize = hostSizePt || 12;

  const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let n;
  while (n = walker.nextNode()) textNodes.push(n);

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    let matches = [];
    activeStyles.forEach(inst => {
      const trig = inst.def.trigger;
      let searchFrom = 0;
      while (true) {
        const oIdx = text.indexOf(trig.open, searchFrom);
        if (oIdx === -1) break;
        const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
        if (cIdx === -1) break;
        matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
        searchFrom = cIdx + trig.close.length;
      }
    });
    if (!matches.length) return;
    matches.sort((a, b) => a.start - b.start);
    const dedup = [];
    let lastEnd = -1;
    matches.forEach(m => { if (m.start >= lastEnd) { dedup.push(m); lastEnd = m.end; } });

    const frag = document.createDocumentFragment();
    let cursor = 0;
    dedup.forEach(m => {
      if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
      if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
        const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
        const innerText = text.slice(m.start + openLen, m.end - closeLen);
        if (dryRun) {
          const dummy = document.createElement('span');
          dummy.className = 'note-marker';
          dummy.textContent = '*';
          frag.appendChild(dummy);
        } else {
          const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
          frag.appendChild(marker);
        }
      } else {
        const span = document.createElement('span');
        span.textContent = text.slice(m.start, m.end);
        applyExtStyleToNode(span, m.inst.def.style, effHostSize);
        frag.appendChild(span);
      }
      cursor = m.end;
    });
    if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
}
```

---

## 5. מקרי קצה שנבדקו ותורגמו לבדיקות (Edge Cases & Validation)

1. **הערת שוליים ארוכה התופסת חלק ניכר מהעמוד:**
   * **תרחיש:** הערת שוליים של 8 שורות מוכרזת בפסקה הראשונה.
   * **טיפול:** `getFootnotesReservedHeight` מודד את גובה ההערה מראש ומקטין את קיבולת הטורים באותו עמוד. הטקסט בטורים נעצר מוקדם ומעביר פסקאות לעמוד הבא.
2. **התנגשות בין שתי כותרות צד עוקבות:**
   * **תרחיש:** שתי פסקאות קצרות בנות שורה אחת, כל אחת עם כותרת צד (`כותרת 7`).
   * **טיפול:** `finalizeNotePositions` מזהה ש-`top` של הכותרת השנייה מתנגש בראשונה, ודוחף את הכותרת השנייה למטה תוך שמירה על רווח של 6px.
3. **חריגת כותרת צד מתחתית הטור:**
   * **תרחיש:** כותרת צד מוצמדת לפסקה האחרונה בטור ימין, וגובהה חורג מגובה הטור.
   * **טיפול:** המערכת מנסה תחילה להגביה את הכותרת (`raisedTop`). אם אין מקום, היא מאתרת את המשך הפסקה בטור שמאל ומעבירה את אלמנט הכותרת לשוליים השמאליים.
4. **פרק המסתים בעמוד זוגי וכותרת הדורשת עמוד אי-זוגי:**
   * **תרחיש:** כותרת 1 מוגדרת עם דגל `אי-זוגי`, אך הפרק הקודם הסתיים בעמוד 4.
   * **טיפול:** הפונקציה `ensureOddPageStart` מזהה שהעמוד הבא זוגי ומזריקה אוטומטית עמוד ריק (`.blank-page`), ומקדמת את המונה לעמוד 5.
5. **פסקה קצרה בת שורה אחת (חלון מילה ראשונה):**
   * **תרחיש:** פסקה בת 3 מילים בלבד.
   * **טיפול:** `getLinesFromParagraph` מזהה $\text{lines.length} \le 1$, מחזיר `hasWindow: false`, והמילה הראשונה מקבלת מחלקה של שורה בודדת (`.first-word-inline`) ללא הזחת שורות (`float: right`).

---

## 6. מפת דרכים והצעדים הבאים (Roadmap & Pending Tasks)

### 6.1 משימות פתוחות לאופטימיזציה
1. **שבירת הערות שוליים בין עמודים (Footnote Splitting):**
   * במצב הנוכחי, הערת שוליים שאינה נכנסת במלואה בעמוד נדחית בשלמותה או תופסת את כל העמוד. נדרש מנגנון לחיתוך טקסט ההערה והמשכו בעמוד הבא תחת קו מפריד עם כיתוב "(המשך)".
2. **תמיכה בטקסט קודש ומפרשים מרובי שכבות (סגנון "צורת הדף"):**
   * הוספת מצב פריסה שבו במרכז מוצב טקסט ראשי (טור רחב), ומשני צדדיו או תחתיו מוצגים 2 פירושים בגדלי גופן שונים תוך שיווי משקל מתמטי דינמי ביניהם.
3. **ייצוא ל-EPUB / InDesign ICML:**
   * הוספת מודול ייצוא המתרגם את ה-DOM והסגנונות המותאמים לקובץ ICML לצורך פתיחה ישירה ב-Adobe InDesign.

### 6.2 הנחיות טכניות למפתח / מודל ה-AI הבא
* **חוק שימור ה-DOM הטהור:** אין להוסיף ספריות חיצוניות (כמו jQuery, React או Paged.js). כל הלוגיקה חייבת להישאר ב-Vanilla JavaScript תקני, מהיר ועצמאי בתוך קובץ HTML בודד.
* **זהירות מ-Reflow בלולאות מדידה:** בעת הרחבת אלגוריתם `balanceColumns` או `finalizeNotePositions`, יש להימנע מקריאות חוזרות ונשנות ל-`getBoundingClientRect()` ללא שימוש באלמנט המדידה המוסתר (`#measuring-box`), כדי למנוע Layout Thrashing בקבצים ארוכים בני מאות עמודים.
* **שמירה על Data Islands:** כל שדה הגדרה חדש שמתווסף לסרגל הצד חייב להירשם בפונקציות `saveAsDefaultTemplate()` ו-`rehydrateExtImports()`, כדי להבטיח עקביות בשמירה וטעינה של תבניות.

---

## 📊 סיכום שיחה

- **סה"כ הודעות:** 55
- **פניות משתמש:** 11
- **תגובות AI:** 31
- **מודל:** `models/gemini-3.7-flash`
- **תאריך:** 2026-09-06
