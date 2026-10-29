---
title: "ניתוח וסיכום מערכת העימוד"
date: 2026-08-27
version: V21
type: transcripts
source: Gemini (Google AI Studio)
---


# ניתוח וסיכום מערכת העימוד

> שיחת Google AI Studio (Gemini) — מודל: `models/gemini-3.1-pro-preview`

---

## פנייה 1: [קובץ מצורף מ-Google Drive — מזהה: 1jCjh5jyURzIt7uZwv0LF9BijXTju8kb]

[קובץ מצורף מ-Google Drive — מזהה: 1jCjh5jyURzIt7uZwv0LF9Bi_jXTju8kb]

---

## פנייה 2: עבור על הקובץ המצורף בעיון רב ואדיר, ובדוק אותו היטיב היטיב הדק הדק , עד שתהיה…

עבור על הקובץ המצורף בעיון רב ואדיר, ובדוק אותו היטיב היטיב הדק הדק , עד שתהיה בקי בכל פרטיו, דרכי פעולתו, השתלשלות הפונקציות, וסיבות הגדרותיו, והצג סיכום קצר של כולו בהודעה הבאה, ואז ארצה שתעזור לי בשיפורו.

---

### 🤖 תגובה 1: Analyzing the Code I'm focusing now on understanding the user's ultimate goal.…

**Analyzing the Code**

I'm focusing now on understanding the user's ultimate goal. I need to deeply analyze the HTML, CSS, and JavaScript. The aim is to build a thorough understanding of the specialized A4 Torah typesetting web application. I'm prioritizing grasping its functionality and purpose, before analyzing anything else.


**Reviewing the Project's Essence**

I've examined the code's structure now, and the application is a single-file wonder. My current understanding points toward a WYSIWYG/typesetting tool tailored for traditional Jewish texts, Seforim. It crafts formatted A4 layouts with unique typographical styles. It uses CSS variables extensively, which are used to define fonts, sizes, and proportions. Layout splits into a sidebar and A4 preview. "@media print" is crucial for print output. Specific classes handle intricate visuals.


**Dissecting the Application**

I'm now diving deep into the HTML structure, and the sidebar contains several settings panels for customization. I'm noting the raw text input and action buttons, such as font loading and saving templates, and how these affect the typesetting. The preview pane dynamically generates A4 pages, providing a live view of the layout. JavaScript handles UI interactions, and text parsing into paragraphs and headings. The typesetting engine itself is the next focal point.


**Deconstructing the Typesetting**

I'm now zeroing in on the `typesetDocument` function; it’s the heart of the process. I see it starts by updating CSS variables, parsing text, and then building sections. It generates the title page and table of contents before paginating content. Now I'm focusing on text measurement and column balancing using a hidden box and `getLinesFromParagraph`, which is key to handling text wrapping and balancing heights. I have to look into the intricacies of `justifyColumn` next.


**Refining the Typesetting**

I'm now honing in on the final typesetting stages. I am seeing the code employs vertical justification to perfectly align column bottoms, and extract margin notes using `h7` tokens. I'm also observing the drop cap implementation using `createDropWord`, which is a nice touch. I also need to note the Gematria page numbering and cursor syncing.


**Pinpointing the Key Mechanisms**

I've got a firm grasp on the core processes now, and have broken them down into parsing, measuring and pagination, the layout engine, and special elements, plus interactivity. Parsing employs regex and tokenization. Measurement and pagination use a hidden box. Layout includes two-column balancing and vertical justification. I'm noting the title pages, TOCs, drop caps, and SVG decorations. I'm keen on the cursor sync and font loading. I'm ready to assist further!

---

### 🤖 תגובה 2: קראתי ולמדתי את הקובץ לעומק. זוהי מערכת מרשימה, מורכבת ומתוחכמת מאוד לעימוד…

קראתי ולמדתי את הקובץ לעומק. זוהי מערכת מרשימה, מורכבת ומתוחכמת מאוד לעימוד צד-לקוח (Client-side Typesetting), המדמה התנהגות של תוכנות עימוד מקצועיות (כמו תג או אינדיזיין) ישירות בתוך הדפדפן. 

הנה סיכום ממוקד של מבנה המערכת, דרכי פעולתה וההיגיון שעומד מאחוריה:

### 1. ייעוד ומבנה כללי
*   **המטרה:** המרת טקסט גולמי לדפי A4 מעומדים ומוכנים להדפסה בסגנון "ספרי קודש" קלאסי, כולל שערים, תוכן עניינים, טורים מאוזנים, חלונות מילה ראשונה, והערות שוליים (כותרות צד).
*   **ממשק משתמש (UI):** מחולק לשניים – סרגל צד (Sidebar) להזנת הטקסט ושליטה מקיפה בהגדרות (גופנים, גדלים, עיטורים, שוליים), ותצוגה מקדימה (Preview) המציגה את הדפים בזמן אמת.
*   **CSS ועיצוב:** שימוש נרחב במשתני CSS (`:root`) המאפשרים עדכון מהיר של כל מדדי הטיפוגרפיה (רוחב טורים, גאטר, גדלי פונטים) מבלי לגעת בלוגיקה. שימוש חכם ב-`@media print` כדי להעלים את הממשק ולהדפיס רק את הדפים עצמם בגודל A4 מדויק.

### 2. זרימת הנתונים והפונקציות המרכזיות (Flow)
הפונקציה המרכזית המניעה את המערכת היא `typesetDocument()`. להלן שלבי הפעולה שלה:

1.  **עדכון הגדרות:** שאיבת הנתונים מהממשק ועדכון משתני ה-CSS (`updateGrid`, `updateStyles`).
2.  **עיבוד טקסט (Parsing):**
    *   `parseMetadataFromText`: חילוץ נתוני הספר (שם, מחבר, שנת הוצאה וכו') באמצעות ביטויים רגולריים (Regex) מראשית הטקסט.
    *   **טוקניזציה:** מעבר על הטקסט שורה-שורה וסיווגו ל"אסימונים" (Tokens): פסקאות (`p`), כותרות ברמות 0-7 (`h0-h7`), וזיהוי הערות צד (רמה 7). המערכת גם שומרת מיפוי (`lineToTokenMap`) כדי לסנכרן בין סמן העכבר בטקסט הגולמי לתצוגה המקדימה (`syncCursorToPreview`).
3.  **חלוקה למקטעים (Sections):** קיבוץ הטוקנים לפי התנהגות העימוד שלהם (שער משנה, עמוד חדש טור 1, או טקסט רציף ב-2 טורים).
4.  **יצירת עמודי פתיחה:** רינדור שער ראשי (`renderMainShaar`) ותוכן עניינים כללי (`renderPaginatedTOC`) אם הוגדרו.
5.  **מנוע העימוד (Pagination & Layout Engine):** זהו הלב הפועם והמורכב ביותר של הקוד. מעבר על המקטעים ויצירת דפים (`createPageLayout`):
    *   **מדידת טקסט:** מכיוון ש-HTML לא יודע מתי שורה נשברת, המערכת משתמשת ב-`#measuring-box` נסתר. הפונקציה `getLinesFromParagraph` שופכת לשם מילים, מודדת את גובהן, וכך מחשבת במדויק היכן נשברת כל שורה ברוחב הטור הנתון.
    *   **איזון טורים (`balanceColumns`):** כאשר מגיעים לסוף עמוד או לפני כותרת שדורשת רצף, המערכת מחשבת את כל נקודות החיתוך האפשריות של הפסקאות בין טור ימין לטור שמאל, ובוחרת את הפיצול שייצר את ההפרש המינימלי בגובה בין שני הטורים.
    *   **יישור אנכי (`justifyColumnVertically`):** כדי להגיע ל"בלוק" מושלם (שני הטורים מסתיימים בדיוק באותו קו), המערכת מוסיפה ריווח זעיר בין פסקאות או מגדילה מעט את ה-`line-height` בטור הקצר יותר.
    *   **הערות צד:** ממוקמות ב-`margin-notes-column` ומקבלות את מיקומן האנכי (`top`) בהתאם למיקום הפסקה שאליה הן משויכות.
    *   **מילה ראשונה (`createDropWord`):** עוטפת את המילה הראשונה בפסקה ב-`span` מיוחד (חלון או שורה בודדת) רק אם הפסקה ארוכה משורה אחת.

### 3. פיצ'רים מתקדמים נוספים
*   **תוכן עניינים אוטומטי:** פונקציית `buildStructuredTOC` אוספת את הכותרות (לפי הגדרות המשתמש), בונה היררכיה, וממספרת אותן בגימטריה (`toGematria`) לפי העמודים שנוצרו בפועל.
*   **עיטורים ושערים (SVG/Images):** תמיכה בעיטורי וילנא (דמסק, תחרה, רומח) מבוססי SVG המוטמעים בקוד, או העלאת תמונות אישיות (`handleImageUpload`) המומרות ל-Base64 כדי להישמר בתוך הקובץ.
*   **שמירת תבנית (`saveAsDefaultTemplate`):** "הקפאת" מצב ה-DOM הנוכחי (הגדרות ה-UI) והורדתו כקובץ HTML חדש שמהווה תבנית אישית.
*   **טעינת גופנים מקומיים (`loadSystemFonts`):** שימוש ב-API המודרני `queryLocalFonts` כדי לשאוב את פונטי ה-Windows של המשתמש ישירות לדפדפן.

---

**לסיכום:** זהו קוד מרשים מאוד שמתמודד בהצלחה עם בעיות קשות של עימוד (Pagination, Column Balancing, Text Measuring) בסביבת Web שאינה מיועדת לכך במקור.

אני מוכן! באילו היבטים של הקוד תרצה שנתמקד ונשפר? (למשל: ייעול ביצועים, הוספת פיצ'רים, שיפור אלגוריתם איזון הטורים, תיקון באגים ספציפיים, או שיפור עיצוב הממשק?)

---

## פנייה 3: מצויין! אז ככה, 1. בגלל שהצרכים לסוגי דפים שונים נוספים משתנים מספר לספר, אני…

מצויין!
אז ככה, 
1. בגלל שהצרכים לסוגי דפים שונים נוספים משתנים מספר לספר, 
אני רוצה שניצור קובץ עריכה ליצירת סוגי עמודים וסגנונות טקסט נוספים. 
1. סוגי עמודים נוספים: כולל יצירה של עמוד עם שם מסויים (לדוגמא "עמוד פרטי מחבר והוצאה לאור"), אפשרות לבחור רקע מיוחד (או להשאיר זאת לבחירה בקובץ העימוד המקורי), הוספת אלמנטים של טקסט (עם הגדרת קידומת (לדוגמא שאם בטקסט (הנצרך עימוד) שהודבק יש שורה שמתחילה בקידומת זו, האלמנט הטקסט יתמלא בטקסט זה (כמו "שם הספר" וכו')), והגדרת מיקום של טקסטים, ולבסוף לשמור את סוג העמוד כקובץ כלשהו (תציע אתה אם HTML או סוג אחר), ולהגדיר בקובץ המקורי אפשרות לייבא קובץ סוג עמוד (הקובץ הנ"ל שנשמר) עם בחירת מקומו בסדר העמודים (בצורה כזאת: לפני הכל, אחרי הכל, אחרי עמוד שער ראשי וכו' וכו', ), והוספת פאנל עם שדות אינפוט ורשימות בחירה בלוח ההגדרות שמיועדות להגדרת הדף (במידה ויובא אותו קובץ סוג עמוד יותר מפעם אחת יתווספו כמה פאנלים). באותו מקום בקובץ המקורי שיהיה ניתן לייבא קובץ סוג דף, יש להוסיף אפשרות לייבא תמונה שתשמש כעמוד (כמו האפשרות שיש כבר עכשיו ליבוא רקע שער מתמונה). 
2. סגנונות טקסט נוספים: כולל יצירה של סוג כותרת או טקסט שיהיו לו הגדרות שאין למצוא כרגע בכותרות הקיימות, וכן פיענוח שונה לטקסט (לדוגמא: כמו "כותרת 1" שמייצרת עמוד שער משנה שמחלק את הטקסט של הכותרת בסימון " - " (חלק ראשון למטה, חלק שני למטה), ולשמור את הסגנון כקובץ שיהיה אפשר לייבא באותה שיטה כנ"ל עם הוספת פאנל הגדרות. 
ובמידה ואחרי ייבוא סוג עמוד או סגנון טקסט (או כמה סוגי עמוד וכו') התבצעה שמירת תבנית, התבנית תכלול גם את התוספות שיובאו.
אתה צריך לאסוף את כל סוגי ההגדרות הקיימות עתה של של סוגי עמוד וסגנון טקסט (כמו מיקום והתחלת עמוד וכו' וכו'), ולהוסיף עוד הגדרות שאולי יש להעריך שאנשים ירצו להגדיר.
אם יש לך הצעות לאלמנטים נוספים חוץ משני אלה שהזכרתי (סגנון טקסט, וסוג עמוד), תציע. 
2. אני רוצה להוסיף אפשרות בחירה לרקע עמוד לשאר סוגי העמודים (כמו שיש לשער הראשי והמשני), הגדרת הרקע תופיע בפאנל ההגדרות ותחול על כל סוג עמוד בנפרד, סוגי העמודים: עמוד של טקסט רגיל, עמוד תוכן ראשון, עמוד תוכן אחרון, עמוד תוכן רגיל, עמוד "כותרת ס", עמוד "כותרת 2".
לפני שכותבים ועורכים את קוד הקבצים, אני רוצה שתיצור תכנית מסודרת ומפורטת ותציג אותה כדף HTML מסוגנן. תודה.

---

### 🤖 תגובה 3: Defining the Objective I'm currently focused on defining the project objective:…

**Defining the Objective**

I'm currently focused on defining the project objective: extending the typesetting system. I've broken down the user's request, identifying the core goal of supporting dynamic page types and text styles. Requirement 1 is next on my list.


**Expanding the System**

I've been working on a custom page type editor as a separate tool, likely an HTML file. The core elements include defining page names, backgrounds, and text elements with specific prefixes for parsing. I'm focusing on text element positioning and exporting the page definition as JSON. Integration with the main app includes import functionality, settings panel generation for imported pages, and allowing for image imports as stand-alone pages. I'm also planning to create custom headings and text styles with custom parsing logic.


**Refining Functionality**

I'm now diving into saving and importing templates, including custom pages and styles. I'm focusing on dynamic settings panel generation and brainstorming new user settings, from borders and drop caps to custom elements like headers and footers. I'm also planning to add background image options for existing page types, integrating these new settings into the main application. I'm not writing any code yet, just planning the functionalities.


**Structuring the Plan**

I'm now outlining the implementation, focusing on architecture and data formats, specifically JSON for saving custom entities. The editor (App 2) requires UI components for page building and text styles. Main app updates include an "Import Manager," dynamic UI, and parsing enhancements. I'm also further fleshing out text and page settings, including existing options and new additions.


**Defining New Elements**

I'm now focusing on specific positioning properties such as X, Y, width, height, and Z-index, along with per-box text formatting and dynamic data binding. I'm also brainstorming more custom block elements like "Quote Box," and "Haskama" blocks, plus custom headers and footers, potentially using SVG. I'm also figuring out how to map CSS classes or styles for backgrounds in the standard pages.


**Implementing the Details**

I'm now implementing the details, focusing on HTML and CSS for the UI. I'm using CSS Grid/Flexbox for layout and cards for sectioning. Code blocks or styled lists will showcase the JSON structure. The color palette will be elegant. I also have to ensure "Save Template" works, by saving imported JSONs within the HTML using `<script type="application/json">` tags. Parsing logic is being clarified, focusing on prefix triggers.

---

### 🤖 תגובה 4: איזה רעיון נפלא! שדרוג המערכת ממערכת סגורה (Hardcoded) למערכת מודולרית ופתוחה…

איזה רעיון נפלא! שדרוג המערכת ממערכת סגורה (Hardcoded) למערכת מודולרית ופתוחה (Extensible) יהפוך אותה לכלי מקצועי אמיתי, שיוכל להתחרות בתוכנות עימוד מסורתיות.

השימוש בקובץ עריכה נפרד (נקרא לו לצורך העניין **"TorahType Studio"**) הוא הגישה הנכונה ביותר. הוא ישמור על המערכת הראשית נקייה ומהירה, ויאפשר למשתמשים מתקדמים ליצור "נכסים" (Assets) ולייבא אותם.

הכנתי עבורך תוכנית אדריכלית מפורטת ומסודרת, הכוללת את כל הדרישות שלך, הצעות לפורמטים, רשימת הגדרות מורחבת, והצעות לאלמנטים נוספים. 

כפי שביקשת, התוכנית מוגשת כדף HTML מעוצב ומוכן לקריאה. שמור את הקוד הבא כקובץ HTML (למשל `plan.html`) ופתח אותו בדפדפן כדי לקרוא את התוכנית בנוחות:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>תוכנית שדרוג: מערכת עימוד תורנית מודולרית</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;800&family=Frank+Ruhl+Libre:wght@400;700;900&display=swap');

        :root {
            --primary: #1e3a8a;
            --secondary: #b8860b;
            --bg: #f4f4f9;
            --surface: #ffffff;
            --text: #333333;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Assistant', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        header {
            background-color: var(--primary);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-bottom: 5px solid var(--secondary);
        }

        header h1 {
            font-family: 'Frank Ruhl Libre', serif;
            margin: 0;
            font-size: 2.5rem;
        }

        header p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-top: 10px;
        }

        .container {
            max-width: 1000px;
            margin: 40px auto;
            padding: 0 20px;
        }

        .card {
            background: var(--surface);
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid var(--border);
        }

        .card h2 {
            font-family: 'Frank Ruhl Libre', serif;
            color: var(--primary);
            border-bottom: 2px solid var(--secondary);
            padding-bottom: 10px;
            margin-top: 0;
        }

        .card h3 {
            color: #2c5282;
            margin-top: 25px;
        }

        ul {
            padding-right: 20px;
        }

        li {
            margin-bottom: 10px;
        }

        .highlight {
            background-color: #fefcbf;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
        }

        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            font-family: monospace;
            direction: ltr;
            text-align: left;
            overflow-x: auto;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .grid-2 {
                grid-template-columns: 1fr;
            }
        }

        .badge {
            display: inline-block;
            background: var(--secondary);
            color: white;
            font-size: 0.8rem;
            padding: 3px 8px;
            border-radius: 12px;
            margin-right: 5px;
        }
    </style>
</head>
<body>

    <header>
        <h1>תוכנית שדרוג: מערכת עימוד תורנית מודולרית</h1>
        <p>הפיכת המערכת לפלטפורמה פתוחה עם עורך סגנונות, ייבוא דינמי והגדרות מתקדמות</p>
    </header>

    <div class="container">

        <!-- Section 1: Architecture -->
        <div class="card">
            <h2>1. ארכיטקטורה ופורמט נתונים (JSON)</h2>
            <p>כדי לאפשר שמירה, ייבוא וייצוא של סוגי עמודים וסגנונות טקסט, הפורמט האידיאלי הוא <strong>JSON</strong>. קובץ ה-JSON יכיל את כל ההגדרות (מיקומים, גופנים, חוקי פענוח). </p>
            <p><strong>איך זה יעבוד בשמירת התבנית?</strong> כאשר המשתמש ייבא סגנונות למערכת הראשית וישמור תבנית (HTML), המערכת תזריק את אובייקט ה-JSON לתוך תגית <code>&lt;script type="application/json" id="custom-assets"&gt;</code> בתוך ה-HTML. כך התבנית תישאר קובץ בודד ועצמאי לחלוטין שכולל בתוכו את כל ההרחבות!</p>
        </div>

        <!-- Section 2: The Studio -->
        <div class="card">
            <h2>2. אפליקציית העריכה: "TorahType Studio"</h2>
            <p>קובץ HTML נפרד שישמש כ"מעבדה" ליצירת נכסים. הממשק יחולק לשני אזורים עיקריים:</p>
            
            <div class="grid-2">
                <div>
                    <h3>א. בונה עמודים (Page Builder)</h3>
                    <ul>
                        <li><strong>הגדרת שם:</strong> למשל "עמוד הסכמה", "פרטי הוצאה".</li>
                        <li><strong>רקע:</strong> אפשרות להטמיע תמונת רקע (Base64) או להשאיר שקוף (כדי שהמשתמש יבחר במערכת הראשית).</li>
                        <li><strong>תיבות טקסט (Drag & Drop / קואורדינטות):</strong> הוספת תיבות טקסט על גבי העמוד (מיקום X, Y, רוחב, גובה).</li>
                        <li><strong>קישור לטקסט (Data Binding):</strong> לכל תיבה תוגדר "קידומת" (Prefix). לדוגמה: אם יוגדר <code>"הסכמת הרב: "</code>, המערכת הראשית תחפש שורה שמתחילה כך, ותשאב את הטקסט לתוך התיבה הספציפית הזו.</li>
                        <li><strong>עיצוב פנימי:</strong> הגדרת גופן, גודל, ויישור (ימין/אמצע/שמאל) לכל תיבה בנפרד.</li>
                    </ul>
                </div>
                <div>
                    <h3>ב. עורך סגנונות טקסט (Style Builder)</h3>
                    <ul>
                        <li><strong>הגדרת שם וזיהוי:</strong> למשל "כותרת 8" או "טקסט מודגש".</li>
                        <li><strong>חוקי פענוח (Parsing Rules):</strong> איך המערכת תזהה את הטקסט? (למשל: כל שורה שמתחילה ב-"הערת עורך -").</li>
                        <li><strong>חוקי פיצול (Split Logic):</strong> אפשרות להגדיר תו מפריד (כמו <code>-</code> או <code>|</code>). המערכת תפצל את הטקסט לחלקים, ולכל חלק יהיה ניתן להגדיר עיצוב שונה (כמו בשער משנה).</li>
                        <li><strong>הגדרות עימוד:</strong> האם זה מתחיל עמוד חדש? האם זה בטור אחד או שניים? האם זו הערת צד?</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Section 3: Main App Integration -->
        <div class="card">
            <h2>3. שילוב במערכת הראשית (Main App)</h2>
            <p>המערכת הראשית תעבור שדרוג כדי לקלוט את הנכסים החדשים בצורה חלקה:</p>
            <ul>
                <li><strong>מנהל ייבוא (Import Manager):</strong> כפתור חדש "ייבא סגנון/עמוד". המשתמש יעלה את קובץ ה-JSON (או תמונה רגילה שתוכרז כעמוד).</li>
                <li><strong>מיקום עמודים דינמי:</strong> בעת ייבוא עמוד, תיפתח חלונית לבחירת מיקומו:
                    <ul>
                        <li>לפני שער ראשי</li>
                        <li>אחרי שער ראשי</li>
                        <li>אחרי תוכן עניינים</li>
                        <li>בסוף הספר</li>
                        <li><em>אופציה מתקדמת:</em> "אחרי כותרת מסוג X" (למשל, עמוד שער מיוחד לפני כל כותרת 1).</li>
                    </ul>
                </li>
                <li><strong>פאנל הגדרות דינמי:</strong> המערכת תייצר אוטומטית פאנל הגדרות (Inputs, Selects) בסרגל הצד עבור כל נכס שיובא. אם יובא "עמוד פרטי מחבר", ייווצרו שדות הזנה עבור הקידומות שהוגדרו בו.</li>
            </ul>
        </div>

        <!-- Section 4: Expanded Settings -->
        <div class="card">
            <h2>4. בנק הגדרות מורחב (לסגנונות טקסט ועמודים)</h2>
            <p>אספתי את ההגדרות הקיימות והוספתי הגדרות מתקדמות שנדרשות בעימוד מקצועי:</p>
            
            <div class="grid-2">
                <div>
                    <h3>הגדרות קיימות (לשמר)</h3>
                    <ul>
                        <li>גופן וגודל (Font Family & Size)</li>
                        <li>התנהגות זרימה: טור 1, 2 טורים, כותרת צד.</li>
                        <li>שבירת עמוד (Page Break)</li>
                        <li>חלון מילה ראשונה (Drop word)</li>
                        <li>יישור טקסט (Justify, Center, Right)</li>
                    </ul>
                </div>
                <div>
                    <h3>הגדרות חדשות להוספה (New!)</h3>
                    <ul>
                        <li><strong>מרווחים (Margins):</strong> מרווח מעל ומתחת לכותרת/פסקה (Space Before/After).</li>
                        <li><strong>גובה שורה (Line Height):</strong> שליטה פרטנית לכל סגנון.</li>
                        <li><strong>מסגרות וקווים:</strong> קו תחתון/עליון מעוצב לכותרות (Border bottom/top), כולל עובי וסגנון (רציף, מקווקו, כפול).</li>
                        <li><strong>אות פתיח (Drop Cap):</strong> הגדרת גודל האות הראשונה לפי מספר שורות (למשל, אות בגובה 3 שורות).</li>
                        <li><strong>צללית (Text Shadow):</strong> לכותרות ראשיות.</li>
                        <li><strong>עיטור אוטומטי:</strong> בחירת עיטור (SVG) שיופיע אוטומטית מתחת לסגנון כותרת מסוים.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Section 5: Backgrounds for Standard Pages -->
        <div class="card">
            <h2>5. ניהול רקעים לעמודים סטנדרטיים</h2>
            <p>בפאנל ההגדרות יתווסף אזור חדש: <strong>"רקעים לעמודי הספר"</strong>. המשתמש יוכל להעלות תמונה (או לבחור מתוך תבניות) עבור כל אחד מסוגי העמודים הבאים:</p>
            <ul>
                <li><span class="badge">עמוד טקסט רגיל</span> (הרקע יחול על כל עמוד שאין לו הגדרה אחרת).</li>
                <li><span class="badge">עמוד תוכן עניינים - ראשון</span> (למשל, עם כותרת מעוצבת ברקע).</li>
                <li><span class="badge">עמוד תוכן עניינים - רגיל</span> (עמודי התוכן הבאים).</li>
                <li><span class="badge">עמוד תוכן עניינים - אחרון</span> (למשל, עם עיטור סיום ברקע).</li>
                <li><span class="badge">כותרת 0 (הקדמה)</span> (רקע ייעודי לעמודי הקדמות).</li>
                <li><span class="badge">כותרת 2 (תחילת פרק)</span> (רקע מיוחד לעמוד שבו מתחיל פרק חדש).</li>
            </ul>
            <p><em>מבחינה טכנית:</em> פונקציית העימוד (<code>createPageLayout</code>) תבדוק איזה תוכן יש בעמוד הנוכחי, ותצמיד לו את ה-CSS Class המתאים שמכיל את תמונת הרקע שהוגדרה.</p>
        </div>

        <!-- Section 6: Additional Elements Suggestions -->
        <div class="card">
            <h2>6. הצעות לאלמנטים נוספים (בונוס)</h2>
            <p>אם אנחנו כבר פותחים את המערכת, כדאי לשקול הוספת התמיכה באלמנטים הבאים בעורך (Studio):</p>
            <ul>
                <li><strong>בלוק טקסט מובדל (Quote / Box):</strong> סגנון טקסט שיוצר מסגרת סביב הפסקה עם צבע רקע שונה (מעולה לציטוטים, שאלות ותשובות, או "הלכה פסוקה" בתוך טקסט רגיל).</li>
                <li><strong>כותרות עליונות/תחתונות מותאמות אישית (Custom Headers/Footers):</strong> במקום 3 האזורים הקבועים כיום, אפשרות לייבא קובץ עיצוב שמגדיר כותרת עליונה מורכבת (למשל, טקסט שיושב בתוך מגילה מצוירת מ-SVG).</li>
                <li><strong>תמונות משולבות בטקסט (Inline Figures):</strong> סגנון טקסט מיוחד שאם כותבים בו קישור לתמונה, המערכת תשתול את התמונה בתוך הטורים (טקסט זורם מסביב לתמונה).</li>
            </ul>
        </div>

        <div class="card" style="background-color: #ebf8ff; border-color: #90cdf4;">
            <h2 style="color: #2b6cb0; border-bottom-color: #4299e1;">שלב הבא: ביצוע</h2>
            <p>התוכנית מוכנה. כדי להתחיל בקידוד, אני ממליץ שנחלק את העבודה לשני שלבים:</p>
            <ol>
                <li><strong>שלב א':</strong> בניית קובץ ה-<strong>Studio</strong> (העורך) שבו נוכל לייצר את קובצי ה-JSON של העמודים וסגנונות הטקסט.</li>
                <li><strong>שלב ב':</strong> עדכון קובץ ה-<strong>Main App</strong> (המערכת הראשית שהבאת לי) כדי שיידע לקרוא את ה-JSON, לייצר את ה-UI הדינמי, להחיל את הרקעים החדשים, ולשמור הכל בתבנית.</li>
            </ol>
            <p>האם תרצה שנתחיל לכתוב את הקוד של <strong>שלב א' (קובץ ה-Studio)</strong>?</p>
        </div>

    </div>
</body>
</html>
```

**מה דעתך על התוכנית?** האם היא קולעת בדיוק למה שדמיינת? אם תאשר, נתחיל לכתוב את קובץ ה-Studio (העורך) שייצר את פורמט ה-JSON!

---

## פנייה 4: מעולה! התחל עם בניית הסטודיו, אבל זכור שכל שינוי בקובץ המקורי הוא בעייתי, אז…

מעולה! התחל עם בניית הסטודיו, אבל זכור שכל שינוי בקובץ המקורי הוא בעייתי, אז השתדל להתאים את קובץ הסטודיו לקובץ העיקרי מאשר הפוך.

---

### 🤖 תגובה 5: Defining the Foundation I'm now zeroing in on defining the core goal: building…

**Defining the Foundation**

I'm now zeroing in on defining the core goal: building "TorahType Studio" while minimizing modifications to the primary code. I'm focusing on preserving the original main system integrity as the paramount constraint. I'm considering the implications of this approach.


**Refining the Integration**

I'm now zeroing in on the file output format from the studio. Minimizing disruption to the main system's single HTML structure is key. The studio's output must mesh with the existing regex parsing and rendering logic. A new `renderCustomPage` function might be the key to integrating custom content. I'm exploring HTML templates or highly structured JSON for seamless DOM creation.


**Designing the Studio Structure**

I'm now zeroing in on the architecture of the studio. I am planning on the UI being a standalone HTML file, split into a page builder and style builder. The page builder lets users specify page properties. The style builder is focused on creating CSS rules tied to triggers, which the main file will apply. The ultimate goal here is to easily and dynamically update the styles of the output to match the Studio configurations.


**Constructing the Studio**

I'm now drafting the studio code, starting with the HTML skeleton and CSS for the dashboard. I've set up `studioData` for state management, encompassing pages and styles. The Page Builder UI includes a page list, an add/edit form (with inputs for name and background image), and a simplified visual preview. For style, I've got the plan sketched out for the list and forms, defining the properties. I am working on how to export the configuration.


**Implementing the Export**

I've got the data export figured out: it's a `JSON.stringify` on `studioData`, creating a Blob for a download trigger. This is now implemented!

**Integrating the Custom Elements**

I'm now figuring out how to integrate custom elements into the main file. The main file will read JSON and add sidebar inputs for each Text Element's Prefix. I'll utilize `typesetDocument` to determine the need for page rendering based on a select box. It'll generate a `div.a4-page` with background and absolute-positioned text divs. This solution should be easy to integrate.

**Incorporating Custom Styles**

Now, I'm defining the implementation plan for custom styles. The main file will read the JSON, then inject a `<style>` tag with custom CSS classes (e.g., `.custom-style-1 { font-family: ... }`). The parser will check for the Trigger Prefix. If present, it creates a custom token.


**Defining the Elements**

I'm now detailing the studio's HTML structure and its dependencies. I'm focusing on the "סוגי עמודים" (Page Types), "סגנונות טקסט" (Text Styles), and "ייצוא" (Export) tabs. For Page Builder, I need a method for adding text fields, each with unique properties, including ID, Label, Top, Left, Width, Font, Size, and Align.


**Clarifying the Workflow**

I'm now detailing the user guide for "TorahType Studio" and how it interfaces with the main file. I need to briefly show how a user should set up the studio and then integrate it into the main file by adding the correct prefix. I also have an improved plan for the visual editor, incorporating a live preview. Finally, I've got a simplified plan for how fonts can be handled, keeping it easy.


**Parsing the Configuration**

I'm now focusing on parsing a streamlined JSON configuration in the main file. It includes page definitions and custom styles. The file appends a `<style>` tag, incorporates regex checks for prefixes within the tokenizer, and calls `renderCustomPage`, optimizing for efficiency. I'm satisfied that this is highly compatible.

---

### 🤖 תגובה 6: הבנתי לחלוטין. זו גישה חכמה ובטוחה מאוד – "להלביש" את התוספות על המנוע הקיים…

הבנתי לחלוטין. זו גישה חכמה ובטוחה מאוד – **"להלביש" את התוספות על המנוע הקיים מבלי לשבור את הלוגיקה שלו.**

כדי לעמוד בדרישה הזו, תכננתי את הסטודיו כך שייצר קובץ JSON במבנה מאוד ספציפי. המבנה הזה מתוכנן כך שבעתיד, כנעדכן את הקובץ הראשי, נצטרך להוסיף רק **פונקציית רינדור אחת לעמודים מותאמים** ו**כמה שורות של זיהוי טקסט (Regex) בטוקנייזר** – בלי לגעת באלגוריתם חלוקת הטורים או במדידת הטקסט!

הכנתי עבורך את **TorahType Studio**. זהו קובץ HTML עצמאי לחלוטין. 
שמור את הקוד הבא כקובץ `studio.html` ופתח אותו בדפדפן.

### מה יש בסטודיו הזה?
1. **ממשק יצירת עמודים (Page Builder):** מאפשר להעלות רקע, ולהוסיף תיבות טקסט עם מיקום מדוייק באחוזים (X, Y). לכל תיבה מגדירים "קידומת" (למשל `הסכמה:`). יש תצוגה מקדימה חיה של העמוד!
2. **ממשק יצירת סגנונות (Style Builder):** מאפשר להגדיר סגנון חדש (למשל "ציטוט"), עם קידומת לזיהוי, ואת כל הגדרות ה-CSS שלו (רווחים, גופנים, יישור).
3. **ייצוא ל-JSON:** כפתור שמייצר קובץ `.ttasset` (שזה בעצם JSON) שאותו נייבא בהמשך לקובץ הראשי.

הנה הקוד המלא של הסטודיו:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TorahType Studio - עורך נכסים</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700&display=swap');

  :root {
    --primary: #2c3e50;
    --secondary: #b8860b;
    --bg: #ecf0f1;
    --panel-bg: #ffffff;
    --border: #bdc3c7;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Assistant', sans-serif;
    background-color: var(--bg);
    color: #333;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    background-color: var(--primary);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 10;
  }

  header h1 { font-size: 1.5rem; margin: 0; }
  
  .btn {
    background: var(--secondary);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-family: inherit;
    transition: background 0.2s;
  }
  .btn:hover { background: #9a7009; }
  .btn-danger { background: #e74c3c; }
  .btn-danger:hover { background: #c0392b; }
  .btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); }

  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 350px;
    background: var(--panel-bg);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
  }
  .tab {
    flex: 1;
    text-align: center;
    padding: 12px;
    cursor: pointer;
    background: #f8f9fa;
    font-weight: bold;
    border-bottom: 3px solid transparent;
  }
  .tab.active {
    background: var(--panel-bg);
    border-bottom-color: var(--secondary);
    color: var(--primary);
  }

  .tab-content {
    display: none;
    padding: 20px;
  }
  .tab-content.active { display: block; }

  .form-group { margin-bottom: 15px; }
  .form-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; }
  .form-group input, .form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-family: inherit;
  }
  
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .item-list {
    list-style: none;
    margin-bottom: 20px;
  }
  .item-list li {
    background: #f8f9fa;
    border: 1px solid var(--border);
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  .item-list li:hover { border-color: var(--secondary); }

  .workspace {
    flex: 1;
    background: #7f8c8d;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: auto;
  }

  /* A4 Preview */
  .a4-preview {
    width: 210mm;
    height: 297mm;
    background-color: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    position: relative;
    transform-origin: top center;
    transform: scale(0.6); /* Scale down for view */
    overflow: hidden;
  }

  .preview-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    object-fit: fill;
    z-index: 1;
  }

  .preview-element {
    position: absolute;
    z-index: 2;
    border: 1px dashed #3498db;
    background: rgba(52, 152, 219, 0.1);
    display: flex;
    align-items: center;
    padding: 5px;
  }
  .preview-element::before {
    content: attr(data-label);
    position: absolute;
    top: -20px; right: 0;
    font-size: 12px;
    background: #3498db;
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
  }

  .section-title {
    font-size: 1.1rem;
    color: var(--primary);
    border-bottom: 2px solid var(--secondary);
    padding-bottom: 5px;
    margin: 20px 0 15px 0;
  }

</style>
</head>
<body>

  <header>
    <h1>TorahType Studio 🛠️</h1>
    <button class="btn" onclick="exportAssets()">💾 ייצא נכסים לקובץ (.ttasset)</button>
  </header>

  <div class="main-container">
    
    <div class="sidebar">
      <div class="tabs">
        <div class="tab active" onclick="switchTab('pages')">סוגי עמודים</div>
        <div class="tab" onclick="switchTab('styles')">סגנונות טקסט</div>
      </div>

      <!-- PAGE BUILDER TAB -->
      <div id="tab-pages" class="tab-content active">
        <button class="btn btn-outline" style="width:100%; margin-bottom:15px;" onclick="createNewPage()">+ צור עמוד חדש</button>
        <ul class="item-list" id="page-list"></ul>

        <div id="page-editor" style="display:none; border-top: 1px solid #ccc; padding-top: 15px;">
          <div class="form-group">
            <label>שם העמוד (למשל: עמוד הסכמה)</label>
            <input type="text" id="p-name" oninput="updateCurrentPage()">
          </div>
          <div class="form-group">
            <label>מיקום ברירת מחדל בספר</label>
            <select id="p-position" onchange="updateCurrentPage()">
              <option value="before_shaar">לפני שער ראשי</option>
              <option value="after_shaar">אחרי שער ראשי</option>
              <option value="end_of_book">בסוף הספר</option>
            </select>
          </div>
          <div class="form-group">
            <label>תמונת רקע (A4)</label>
            <input type="file" accept="image/*" onchange="handleBgUpload(event)">
          </div>

          <div class="section-title">תיבות טקסט בעמוד</div>
          <ul class="item-list" id="element-list"></ul>
          <button class="btn btn-outline" style="width:100%; font-size:0.9rem;" onclick="addElement()">+ הוסף תיבת טקסט</button>

          <div id="element-editor" style="display:none; background:#f1f2f6; padding:10px; margin-top:15px; border-radius:5px;">
            <div class="form-group">
              <label>קידומת לזיהוי בטקסט (למשל: "הסכמה:")</label>
              <input type="text" id="e-prefix" oninput="updateCurrentElement()">
            </div>
            <div class="grid-2">
              <div class="form-group"><label>מיקום מלמעלה (%)</label><input type="number" id="e-top" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>מיקום מימין (%)</label><input type="number" id="e-right" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>רוחב (%)</label><input type="number" id="e-width" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>גובה (%)</label><input type="number" id="e-height" oninput="updateCurrentElement()"></div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>גופן</label>
                <select id="e-font" onchange="updateCurrentElement()">
                  <option value="'David Libre', serif">David Libre</option>
                  <option value="'Frank Ruhl Libre', serif">Frank Ruhl Libre</option>
                  <option value="'Assistant', sans-serif">Assistant</option>
                </select>
              </div>
              <div class="form-group"><label>גודל (pt)</label><input type="number" id="e-size" oninput="updateCurrentElement()"></div>
            </div>
            <div class="form-group">
              <label>יישור טקסט</label>
              <select id="e-align" onchange="updateCurrentElement()">
                <option value="center">מרכז</option>
                <option value="right">ימין</option>
                <option value="left">שמאל</option>
                <option value="justify">מיושר לשוליים</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- STYLE BUILDER TAB -->
      <div id="tab-styles" class="tab-content">
        <button class="btn btn-outline" style="width:100%; margin-bottom:15px;" onclick="createNewStyle()">+ צור סגנון טקסט חדש</button>
        <ul class="item-list" id="style-list"></ul>

        <div id="style-editor" style="display:none; border-top: 1px solid #ccc; padding-top: 15px;">
          <div class="form-group">
            <label>שם הסגנון (למשל: ציטוט מודגש)</label>
            <input type="text" id="s-name" oninput="updateCurrentStyle()">
          </div>
          <div class="form-group">
            <label>קידומת לזיהוי בטקסט (למשל: "ציטוט - ")</label>
            <input type="text" id="s-prefix" oninput="updateCurrentStyle()">
          </div>
          <div class="form-group">
            <label>התנהגות עימוד (Layout Mode)</label>
            <select id="s-mode" onchange="updateCurrentStyle()">
              <option value="inline_2col">רציף בתוך הטורים (כמו פסקה)</option>
              <option value="span_1col">רציף על פני 2 הטורים (כמו כותרת 3)</option>
              <option value="new_page_1col">עמוד חדש טור 1 (כמו שער/פרק)</option>
              <option value="side_note">הערת שוליים בצד</option>
            </select>
          </div>
          
          <div class="section-title">עיצוב (CSS)</div>
          <div class="grid-2">
            <div class="form-group">
              <label>גופן</label>
              <select id="s-font" onchange="updateCurrentStyle()">
                <option value="'David Libre', serif">David Libre</option>
                <option value="'Frank Ruhl Libre', serif">Frank Ruhl Libre</option>
              </select>
            </div>
            <div class="form-group"><label>גודל (pt)</label><input type="number" id="s-size" oninput="updateCurrentStyle()"></div>
            <div class="form-group"><label>מרווח עליון (px)</label><input type="number" id="s-mt" oninput="updateCurrentStyle()"></div>
            <div class="form-group"><label>מרווח תחתון (px)</label><input type="number" id="s-mb" oninput="updateCurrentStyle()"></div>
          </div>
          <div class="form-group">
            <label>משקל (Bold)</label>
            <select id="s-weight" onchange="updateCurrentStyle()">
              <option value="normal">רגיל</option>
              <option value="bold">מודגש</option>
              <option value="900">מודגש מאוד (Black)</option>
            </select>
          </div>
          <div class="form-group">
            <label>יישור טקסט</label>
            <select id="s-align" onchange="updateCurrentStyle()">
              <option value="justify">מיושר לשוליים (Justify)</option>
              <option value="center">מרכז</option>
              <option value="right">ימין</option>
            </select>
          </div>
        </div>
      </div>

    </div>

    <div class="workspace">
      <!-- Preview only relevant for Page Builder -->
      <div class="a4-preview" id="preview-canvas" style="display:none;">
        <img id="preview-bg-img" class="preview-bg" style="display:none;">
        <div id="preview-elements-container"></div>
      </div>
      <div id="style-preview-msg" style="color:white; font-size:1.2rem; display:none;">
        התצוגה המקדימה לסגנונות טקסט תתבצע במערכת הראשית.
      </div>
    </div>

  </div>

  <script>
    // --- State Management ---
    let appData = {
      version: "1.0",
      customPages: [],
      customStyles: []
    };

    let currentPageId = null;
    let currentElementId = null;
    let currentStyleId = null;

    // --- UI Tabs ---
    function switchTab(tabName) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      event.target.classList.add('active');
      document.getElementById('tab-' + tabName).classList.add('active');

      if(tabName === 'pages') {
        document.getElementById('preview-canvas').style.display = 'block';
        document.getElementById('style-preview-msg').style.display = 'none';
        renderPageList();
      } else {
        document.getElementById('preview-canvas').style.display = 'none';
        document.getElementById('style-preview-msg').style.display = 'block';
        renderStyleList();
      }
    }

    // --- Page Builder Logic ---
    function createNewPage() {
      const newPage = {
        id: 'page_' + Date.now(),
        name: 'עמוד חדש',
        insertPosition: 'before_shaar',
        bgImage: '',
        elements: []
      };
      appData.customPages.push(newPage);
      selectPage(newPage.id);
      renderPageList();
    }

    function renderPageList() {
      const list = document.getElementById('page-list');
      list.innerHTML = '';
      appData.customPages.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.name;
        li.onclick = () => selectPage(p.id);
        if(p.id === currentPageId) li.style.borderColor = 'var(--secondary)';
        list.appendChild(li);
      });
    }

    function selectPage(id) {
      currentPageId = id;
      currentElementId = null;
      renderPageList();
      
      const page = appData.customPages.find(p => p.id === id);
      if(!page) return;

      document.getElementById('page-editor').style.display = 'block';
      document.getElementById('element-editor').style.display = 'none';
      
      document.getElementById('p-name').value = page.name;
      document.getElementById('p-position').value = page.insertPosition;
      
      renderPreview();
      renderElementList();
    }

    function updateCurrentPage() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      if(!page) return;
      page.name = document.getElementById('p-name').value;
      page.insertPosition = document.getElementById('p-position').value;
      renderPageList();
    }

    function handleBgUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const page = appData.customPages.find(p => p.id === currentPageId);
        if(page) {
          page.bgImage = e.target.result;
          renderPreview();
        }
      };
      reader.readAsDataURL(file);
    }

    // --- Element Builder Logic ---
    function addElement() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      if(!page) return;
      
      const newEl = {
        id: 'el_' + Date.now(),
        prefix: 'טקסט:',
        top: 20, right: 10, width: 80, height: 10,
        fontFamily: "'David Libre', serif",
        fontSize: 24,
        textAlign: 'center'
      };
      page.elements.push(newEl);
      selectElement(newEl.id);
      renderElementList();
      renderPreview();
    }

    function renderElementList() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      const list = document.getElementById('element-list');
      list.innerHTML = '';
      if(!page) return;

      page.elements.forEach(e => {
        const li = document.createElement('li');
        li.textContent = e.prefix || 'ללא קידומת';
        li.onclick = () => selectElement(e.id);
        if(e.id === currentElementId) li.style.borderColor = 'var(--secondary)';
        list.appendChild(li);
      });
    }

    function selectElement(id) {
      currentElementId = id;
      renderElementList();
      
      const page = appData.customPages.find(p => p.id === currentPageId);
      const el = page.elements.find(e => e.id === id);
      if(!el) return;

      document.getElementById('element-editor').style.display = 'block';
      document.getElementById('e-prefix').value = el.prefix;
      document.getElementById('e-top').value = el.top;
      document.getElementById('e-right').value = el.right;
      document.getElementById('e-width').value = el.width;
      document.getElementById('e-height').value = el.height;
      document.getElementById('e-font').value = el.fontFamily;
      document.getElementById('e-size').value = el.fontSize;
      document.getElementById('e-align').value = el.textAlign;
    }

    function updateCurrentElement() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      const el = page.elements.find(e => e.id === currentElementId);
      if(!el) return;

      el.prefix = document.getElementById('e-prefix').value;
      el.top = parseFloat(document.getElementById('e-top').value) || 0;
      el.right = parseFloat(document.getElementById('e-right').value) || 0;
      el.width = parseFloat(document.getElementById('e-width').value) || 0;
      el.height = parseFloat(document.getElementById('e-height').value) || 0;
      el.fontFamily = document.getElementById('e-font').value;
      el.fontSize = parseFloat(document.getElementById('e-size').value) || 12;
      el.textAlign = document.getElementById('e-align').value;

      renderElementList();
      renderPreview();
    }

    function renderPreview() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      if(!page) return;

      const bgImg = document.getElementById('preview-bg-img');
      if(page.bgImage) {
        bgImg.src = page.bgImage;
        bgImg.style.display = 'block';
      } else {
        bgImg.style.display = 'none';
      }

      const container = document.getElementById('preview-elements-container');
      container.innerHTML = '';

      page.elements.forEach(el => {
        const div = document.createElement('div');
        div.className = 'preview-element';
        div.setAttribute('data-label', el.prefix);
        
        // Apply styles
        div.style.top = el.top + '%';
        div.style.right = el.right + '%';
        div.style.width = el.width + '%';
        div.style.height = el.height + '%';
        div.style.fontFamily = el.fontFamily;
        div.style.fontSize = el.fontSize + 'pt';
        div.style.textAlign = el.textAlign;
        div.style.justifyContent = el.textAlign === 'center' ? 'center' : (el.textAlign === 'left' ? 'flex-end' : 'flex-start');
        
        div.textContent = "טקסט לדוגמה";
        
        if(el.id === currentElementId) {
          div.style.borderColor = '#e74c3c';
          div.style.background = 'rgba(231, 76, 60, 0.2)';
          div.style.zIndex = 10;
        }

        div.onclick = () => selectElement(el.id);
        container.appendChild(div);
      });
    }

    // --- Style Builder Logic ---
    function createNewStyle() {
      const newStyle = {
        id: 'style_' + Date.now(),
        name: 'סגנון חדש',
        prefix: 'סגנון מיוחד - ',
        layoutMode: 'inline_2col',
        css: {
          fontFamily: "'David Libre', serif",
          fontSize: 12,
          marginTop: 10,
          marginBottom: 10,
          fontWeight: 'bold',
          textAlign: 'justify'
        }
      };
      appData.customStyles.push(newStyle);
      selectStyle(newStyle.id);
      renderStyleList();
    }

    function renderStyleList() {
      const list = document.getElementById('style-list');
      list.innerHTML = '';
      appData.customStyles.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s.name;
        li.onclick = () => selectStyle(s.id);
        if(s.id === currentStyleId) li.style.borderColor = 'var(--secondary)';
        list.appendChild(li);
      });
    }

    function selectStyle(id) {
      currentStyleId = id;
      renderStyleList();
      
      const style = appData.customStyles.find(s => s.id === id);
      if(!style) return;

      document.getElementById('style-editor').style.display = 'block';
      document.getElementById('s-name').value = style.name;
      document.getElementById('s-prefix').value = style.prefix;
      document.getElementById('s-mode').value = style.layoutMode;
      
      document.getElementById('s-font').value = style.css.fontFamily;
      document.getElementById('s-size').value = style.css.fontSize;
      document.getElementById('s-mt').value = style.css.marginTop;
      document.getElementById('s-mb').value = style.css.marginBottom;
      document.getElementById('s-weight').value = style.css.fontWeight;
      document.getElementById('s-align').value = style.css.textAlign;
    }

    function updateCurrentStyle() {
      const style = appData.customStyles.find(s => s.id === currentStyleId);
      if(!style) return;

      style.name = document.getElementById('s-name').value;
      style.prefix = document.getElementById('s-prefix').value;
      style.layoutMode = document.getElementById('s-mode').value;
      
      style.css.fontFamily = document.getElementById('s-font').value;
      style.css.fontSize = parseFloat(document.getElementById('s-size').value) || 12;
      style.css.marginTop = parseFloat(document.getElementById('s-mt').value) || 0;
      style.css.marginBottom = parseFloat(document.getElementById('s-mb').value) || 0;
      style.css.fontWeight = document.getElementById('s-weight').value;
      style.css.textAlign = document.getElementById('s-align').value;
      
      renderStyleList();
    }

    // --- Export Logic ---
    function exportAssets() {
      // Clean up data before export (remove empty pages/styles if needed)
      const dataStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-torah-assets.ttasset';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Init
    switchTab('pages');
  </script>
</body>
</html>
```

### מה השלב הבא?
שחק עם הסטודיו! נסה ליצור עמוד חדש (למשל "עמוד הסכמה"), הוסף לו תמונת רקע, מקם תיבות טקסט, וצור סגנון טקסט חדש (למשל "ציטוט"). לאחר מכן, לחץ על **"ייצא נכסים לקובץ"**. יירד לך למחשב קובץ `.ttasset`.

ברגע שתאשר לי שהסטודיו עובד לשביעות רצונך והבנת את הקונספט, **נעבור לשלב ב'**: אני אכתוב לך את הקוד שיש להוסיף ל**מערכת הראשית** כדי שיהיה בה כפתור "טען נכסים", שיקרא את הקובץ הזה, ייצר את פאנל ההגדרות הדינמי, וישלב את העמודים והסגנונות החדשים בתוך מנוע העימוד בצורה חלקה!

---

## פנייה 5: אני מעדיף שקודם תכין את הקובץ הראשי, שאוכל לראות איך זה מיובא.

אני מעדיף שקודם תכין את הקובץ הראשי, שאוכל לראות איך זה מיובא.

---

### 🤖 תגובה 7: Initiating Updates I'm currently focused on the user's request: updating the…

**Initiating Updates**

I'm currently focused on the user's request: updating the typesetting application to import `.data` files. I've started by clearly understanding the parameters of this project. The initial HTML file from the first prompt will be my primary target for modifications.


**Defining Import Mechanism**

I am now delving into the nitty-gritty details of importing `.ttasset` JSON files. The goal is to create a seamless import process with a dedicated button/input. I'm considering using a hidden DOM element to store the imported assets, which should ensure persistence when the template is saved. My primary focus is on generating a dynamic UI for custom pages and styles, with input fields and panels that adapt to the imported data.


**Analyzing Custom Styles**

I'm now refining the text parsing logic. I'm focusing on "Custom Pages" and "Custom Styles," and updating the tokenization loop to handle custom style prefixes. The idea is for `parseMetadataFromText` to extract custom page text based on prefixes, just like it handles other metadata. For "Custom Styles," the loop should generate special tokens (`custom_style_ID`). Finally, I'm working on a function (`renderCustomPage`) to render custom pages with their elements.


**Implementing Backgrounds & Styles**

I'm now implementing the insertion logic for custom pages, targeting specific locations. I am also working on CSS generation/inline styles to manage custom styles using the `custom_style_ID`. The logic is now being updated to handle `custom_style_ID` and adjust the `layoutMode`. Concurrently, I've added a new panel for backgrounds for standard pages with file inputs to apply them during page layout creation. UI additions are also underway.


**Refining Asset Handling**

I'm now integrating asset management logic with custom pages and styles. I have defined the `customAssets` object to store imported assets and created `importAssets()` and `buildDynamicUI()` functions to handle import and UI generation. The plan involves serializing `customAssets` to a hidden script tag for saving and restoring them on load. Text parsing is also being updated. Specifically, `parseMetadataFromText` will iterate through `customAssets.pages` and `customAssets.styles`, and the tokenizer now accounts for custom style prefixes to create custom style tokens.


**Integrating Layout Mechanics**

I'm now integrating the layout engine to render custom pages and apply backgrounds. I'm focusing on `createPageLayout` which now accepts a `pageType` to apply background images. I've also constructed `renderCustomPage`, which can be placed at different positions in the document. Finally, the code is being updated to treat `custom_style` tokens based on their `layoutMode`, generating CSS classes in `<style id="custom-styles-css">` rather than using inline styles.


**Refining Data Entry**

I'm now focusing on user input for custom page elements and adding the import button and its logic. I've integrated text inputs within the UI for direct editing of custom page elements, with automatic population from the raw text using `parseMetadataFromText` where prefixes are found. Additionally, I've created styles for custom page rendering, as well as their backgrounds, and added HTML elements for file imports and button to display in the UI. A background panel has also been added. Finally, there's a dynamic assets panel to be developed.


**Implementing Asset Persistence**

I'm now focusing on ensuring that the imported assets persist. I've decided to use a hidden script tag, `<script type="application/json" id="embedded-assets">`, to store the `customAssets` data as JSON. I'm implementing `loadEmbeddedAssets` to read the data from this tag on page load and `handleAssetImport` to update it upon import. The UI is being updated to reflect the changes. I will also be working on handling file input and read the content.



**Finalizing Dynamic UI**

I'm now completing the dynamic UI for imported assets. I've updated `buildDynamicUI` to clearly display pages and their elements within the 'dynamic-assets-panel'. Each page includes its name, with a breakdown of its prefixes. Text inputs are used to display prefixes. The goal is a user-friendly way to manage and interact with these custom elements.


**Refining Style Implementation**

I'm now generating specific CSS for custom styles. I am generating CSS classes within `<style id="custom-styles-css">`, reflecting adjustments to font-family, size, margins and weight, via the `updateCustomStylesCSS()` function. The generated classes are applied dynamically via the element attributes and data. I'm focusing on ensuring accurate and responsive styles for custom elements.


**Optimizing Style Generation**

I'm now refining style generation to create more robust and adaptable CSS. I'm focusing on the `updateCustomStylesCSS()` function and improving the accuracy of the styles generated. I am also adjusting the font-family, size, margins, and weight of elements via attribute and data updates. The text parsing is being updated. In `parseMetadataFromText`, I'm iterating through `customAssets.pages`, checking if the line starts with the page prefix, extracting the text, and populating corresponding inputs. Finally, the tokenizer accounts for the `custom_style` prefix, creating style tokens.


**Improving Element Styles**

I'm now focusing on refining the style implementation, creating dynamic and responsive elements. Specifically, I'm adjusting the fallback mechanisms for different element types, like headings and paragraphs, to ensure that styles remain appropriate and don't affect existing assets. Also, I've updated the logic for sectioning to deal with custom style tokens based on their `layoutMode`.


**Refining Asset Rendering**

I'm now implementing the rendering of dynamic text elements within custom pages. I'm focusing on parsing the data and creating the appropriate DOM elements within the page. I've updated the logic to create a `div` element for each text input, setting the styles and positioning based on parsed data and input values. I'm dynamically creating the text elements, aligning them within their respective pages.


**Refining Placement Logic**

I am now focusing on refining the placement logic for custom pages within the document. I'm adding `renderCustomPages` to inject content before, after, and at the end of the main shaar section. Additionally, I'm updating the layout engine to correctly render custom styles. The logic for inline 2-column styles now considers correct styling objects for line measurements.


**Integrating Asset Components**

I'm now integrating the rendering of custom style tokens and custom page placement with existing typesetting features. I am ensuring that the original layout logic balances content and drop words correctly. I'm adding background panels and a dynamic assets placeholder, along with the import button. My focus is on robust integration of custom features and their interaction with the existing workflow.



**Finalizing Component Integration**

I'm now integrating the final pieces, focusing on the UI and persistence. I've added the new panels and styles, including `.custom-bg-img`, and am ensuring `loadEmbeddedAssets()` and `typesetDocument()` are correctly called on `window.onload`. I'm also ensuring that dynamic inputs are saved within the embedded script tag on save. The updated `parseMetadataFromText` function now includes comprehensive checks for custom pages, extracting and populating input values based on defined prefixes, and ensuring that matches are handled correctly.


**Refining Custom Style Handling**

I'm now integrating the custom style token logic with background handling in `createPageLayout`. My focus is on ensuring `custom_style` tokens correctly apply the `layoutMode` during sectioning, generating corresponding CSS in `<style id="custom-styles-css">`. I've added a new parameter, `bgType`, to the `createPageLayout` function for normal page backgrounds.


**Refining Background Integration**

I am now focusing on refining the background image integration. I've introduced the `bgType` parameter to `createPageLayout` which allows managing backgrounds for normal pages as well as table of contents. I am now updating `typesetDocument` to render the custom styles properly in `inline_2col`, ensuring the correct styling object for line measurements. I am focusing on making sure `custom_style` tokens render correctly.



**Abstracting Style Logic**

I'm now refining the style application within the text rendering loop. My approach involves abstracting the `styleObj` selection to handle custom styles seamlessly. Specifically, I'm updating the logic to determine `curStyleObj` based on whether the token is a custom style, ensuring that the appropriate style properties (fontFamily, fontSize, etc.) are applied correctly. I'm focusing on ensuring consistent style application for both standard and custom paragraphs, streamlining the logic and adding a class.



**Refining Span Style Integration**

I'm now integrating span style modifications for improved typesetting, particularly when dealing with `span_1col` custom styles. I'm ensuring that custom style definitions are correctly applied, using `sDef` to get the styles and generate the correct class, such as `custom-style-${sDef.id}`. The implementation handles custom tokens like `span_1col`, aligning them appropriately. I'm handling the case when `custom_style` is `new_page_1col`, treating it as an `h2` to start a new section.


**Integrating Custom Styles**

I'm now focusing on mapping `custom_style` with `new_page_1col` to trigger `h2` rendering at the top of a new section. I'm carefully integrating the new UI panels and import logic, alongside background updates and custom style handling. I'm updating the layout engine to respect backgrounds and new styles, with specific file input integration. I am simplifying the TOC background management by focusing on TOC 1 and normal pages.

---

### 🤖 תגובה 8: זוהי גישה מקצועית ונכונה מאוד. עדיף להכין את התשתית בקובץ הראשי כך שיוכל…

זוהי גישה מקצועית ונכונה מאוד. עדיף להכין את התשתית בקובץ הראשי כך שיוכל "לקלוט" את הנכסים שנייצר בסטודיו, מבלי לשבור את מנוע העימוד הקיים והמורכב.

ביצעתי שדרוג מקיף לקובץ המערכת הראשי. הוספתי לו את היכולות הבאות:
1. **מנגנון ייבוא נכסים:** כפתור חדש בראש הסרגל לייבוא קובצי `.ttasset` (שנייצר בסטודיו).
2. **פאנל נכסים דינמי:** ברגע שמייבאים עמודים מותאמים אישית, המערכת מייצרת אוטומטית שדות הזנה עבורם בסרגל הצד.
3. **זיהוי אוטומטי בטקסט:** מנוע הפענוח (`parseMetadataFromText` והטוקנייזר) עודכן כך שהוא מחפש את הקידומות של העמודים והסגנונות המותאמים אישית ושואב אותם אוטומטית.
4. **רינדור עמודים מותאמים:** פונקציה חדשה שותלת את העמודים המיוחדים (כמו "עמוד הסכמה") במיקום שהוגדר להם (לפני השער, אחרי השער, או בסוף הספר).
5. **פאנל רקעים לעמודי הספר:** הוספתי פאנל חדש המאפשר להעלות תמונות רקע נפרדות לעמוד רגיל, עמוד תוכן ראשון, עמוד תוכן רגיל, עמוד הקדמה (כותרת 0) ועמוד תחילת פרק (כותרת 2).

העתק את הקוד הבא ושמור אותו כקובץ ה-HTML הראשי שלך. לאחר מכן, תוכל לייבא אליו את קובץ ה-`.ttasset` שיצרת בסטודיו ולראות את הקסם קורה!

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מערכת עימוד תורנית מקצועית לדפי A4</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

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
    height: 44vh;
    min-height: 200px;
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
  
  .btn-import-assets {
    background-color: #b8860b;
    color: #fff;
    border: none;
    padding: 3px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 5px;
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
  
  .panel-dynamic {
    background: #f0f8ff;
    border: 1px solid #b0c4de;
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
  
  .panel-dynamic .panel-header {
    background: #dbeafe;
    border-bottom: 1px solid #bfdbfe;
    color: #1e3a8a;
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
  
  .custom-asset-page {
    padding: 0; /* Custom pages handle their own padding/positioning */
  }

  .page-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    justify-content: space-between;
    z-index: 10;
  }

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
  }

  .toc-page {
    padding: 15mm 15mm 15mm 15mm;
  }
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
  .toc-entry-group {
    break-inside: avoid;
    margin-bottom: 3px;
  }
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

  .h2-spacer {
    flex-basis: 33.33%;
    flex-shrink: 0;
  }

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
    z-index: 10;
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
    @page {
      size: A4;
      margin: 0;
    }

    body { 
      background: none; 
      padding: 0; 
      overflow: visible; 
      display: block; 
    }
    
    #sidebar, #resizer { 
      display: none !important; 
    }
    
    #preview-pane { 
      height: auto !important; 
      overflow: visible !important; 
      padding: 0 !important; 
      background: none !important; 
      display: block !important;
    }
    
    .a4-page {
      box-shadow: none;
      width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      max-height: 297mm !important;
      padding: 15mm !important;
      margin: 0 !important;
      page-break-after: always;
      break-after: page;
      position: relative;
    }
    
    .page-content-wrapper, .shaar-main-content {
      height: 100% !important; 
    }
  }
</style>
<!-- Embedded Custom Assets (JSON) -->
<script type="application/json" id="embedded-assets">{"pages":[],"styles":[]}</script>
<!-- Dynamic CSS for Custom Styles -->
<style id="custom-styles-css"></style>
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <div>
          <input type="file" id="import-assets-file" style="display:none" accept=".ttasset,application/json" onchange="handleAssetImport(event)">
          <button class="btn-import-assets" onclick="document.getElementById('import-assets-file').click()">📥 ייבא נכסים</button>
          <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
        </div>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">
    
      <!-- Dynamic Assets Panel (Injected via JS) -->
      <div id="dynamic-assets-panel"></div>

      <div class="panel-static">
        <div class="panel-header">👑 הגדרות שער ראשי ושערי משנה</div>
        
        <div style="margin-bottom: 6px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked"> הצג שער ראשי בראש הספר</label>
        </div>
        <div class="inline-cfg-row" style="margin-bottom: 8px;">
          <label>סגנון שער ראשי:</label>
          <select id="main-shaar-style" style="flex:1;" onchange="document.getElementById('row-main-shaar-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'">
            <option value="1" selected="selected">1. דמסק ושיש מרכזי</option>
            <option value="2">2. תחרת סלסולים כפולה</option>
            <option value="3">3. קרנות וילנא וגיליושה</option>
            <option value="custom_img">4. תמונת רקע A4 מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-main-shaar-img" style="display:none; margin-bottom: 8px;">
          <label>קובץ רקע שער:</label>
          <input type="file" id="file-main-shaar-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-main-shaar-img')">
          <input type="hidden" id="data-main-shaar-img" value="">
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
            <label>סגנון שערי משנה:</label>
            <select id="sub-shaar-style" style="flex:1;" onchange="document.getElementById('row-sub-shaar-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'">
              <option value="1" selected="selected">1. דמסק שמאלי</option>
              <option value="2">2. תחרה שמאלית</option>
              <option value="3">3. קרנות וילנא שמאליות</option>
              <option value="custom_img">4. תמונת רקע A4 מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sub-shaar-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ שער משנה:</label>
            <input type="file" id="file-sub-shaar-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sub-shaar-img')">
            <input type="hidden" id="data-sub-shaar-img" value="">
          </div>

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
            <input type="file" id="file-sec-div-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>
      
      <!-- New Panel: Backgrounds for standard pages -->
      <div class="panel-static">
        <div class="panel-header">🖼️ רקעים לעמודי הספר</div>
        <div class="inline-cfg-row">
          <label>עמוד טקסט רגיל:</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-normal')">
          <input type="hidden" id="data-bg-normal" value="">
        </div>
        <div class="inline-cfg-row">
          <label>עמוד תוכן (ראשון):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-toc1')">
          <input type="hidden" id="data-bg-toc1" value="">
        </div>
        <div class="inline-cfg-row">
          <label>עמוד תוכן (רגיל):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-toc')">
          <input type="hidden" id="data-bg-toc" value="">
        </div>
        <div class="inline-cfg-row">
          <label>הקדמה (כותרת 0):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-h0')">
          <input type="hidden" id="data-bg-h0" value="">
        </div>
        <div class="inline-cfg-row">
          <label>תחילת פרק (כותרת 2):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-h2')">
          <input type="hidden" id="data-bg-h2" value="">
        </div>
      </div>

      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
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
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
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
          <input type="file" id="file-hdr-c-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
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
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7.5" step="0.5" class="size-input"></div>
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
    // --- Asset Management ---
    let customAssets = { pages: [], styles: [] };

    function loadEmbeddedAssets() {
      const el = document.getElementById('embedded-assets');
      if (el && el.textContent) {
        try {
          const data = JSON.parse(el.textContent);
          if (data.customPages) customAssets.pages = data.customPages;
          if (data.customStyles) customAssets.styles = data.customStyles;
          buildDynamicUI();
        } catch(e) { console.error("Failed to load embedded assets", e); }
      }
    }

    function handleAssetImport(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (data.customPages) customAssets.pages = customAssets.pages.concat(data.customPages);
          if (data.customStyles) customAssets.styles = customAssets.styles.concat(data.customStyles);
          
          document.getElementById('embedded-assets').textContent = JSON.stringify({
            customPages: customAssets.pages,
            customStyles: customAssets.styles
          });
          
          buildDynamicUI();
          typesetDocument();
          alert("הנכסים יובאו בהצלחה!");
        } catch(err) {
          alert("שגיאה בטעינת הקובץ. ודא שזהו קובץ .ttasset תקין.");
        }
      };
      reader.readAsText(file);
    }

    function buildDynamicUI() {
      const container = document.getElementById('dynamic-assets-panel');
      container.innerHTML = '';
      if (customAssets.pages.length === 0 && customAssets.styles.length === 0) return;

      let html = '<div class="panel-static panel-dynamic"><div class="panel-header">🧩 נכסים מותאמים אישית (יובאו)</div>';
      
      if (customAssets.pages.length > 0) {
        customAssets.pages.forEach(page => {
          html += `<div style="font-weight:bold; font-size:9pt; margin-top:8px; border-bottom:1px solid #b0c4de; padding-bottom:2px; margin-bottom:4px;">📄 ${page.name}</div>`;
          page.elements.forEach(el => {
            html += `<div class="inline-cfg-row">
              <label title="${el.prefix}">${el.prefix}</label>
              <input type="text" id="cp_${page.id}_${el.id}" class="custom-page-input" placeholder="טקסט עבור ${el.prefix}">
            </div>`;
          });
        });
      }

      if (customAssets.styles.length > 0) {
        html += `<div style="font-weight:bold; font-size:9pt; margin-top:12px; border-bottom:1px solid #b0c4de; padding-bottom:2px; margin-bottom:4px;">🎨 סגנונות טקסט זמינים</div>`;
        customAssets.styles.forEach(s => {
          html += `<div style="font-size:8.5pt; color:#333; margin-bottom:2px;">• ${s.name} (קידומת: <code>${s.prefix}</code>)</div>`;
        });
      }

      html += '</div>';
      container.innerHTML = html;
      updateCustomStylesCSS();
    }

    function updateCustomStylesCSS() {
      let styleTag = document.getElementById('custom-styles-css');
      let css = '';
      customAssets.styles.forEach(s => {
        css += `.custom-style-${s.id} {
          font-family: ${s.css.fontFamily} !important;
          font-size: ${s.css.fontSize}pt !important;
          margin-top: ${s.css.marginTop}px !important;
          margin-bottom: ${s.css.marginBottom}px !important;
          font-weight: ${s.css.fontWeight} !important;
          text-align: ${s.css.textAlign} !important;
        }\n`;
      });
      styleTag.textContent = css;
    }

    function renderCustomPages(container, position) {
      customAssets.pages.forEach(page => {
        if (page.insertPosition === position) {
          const pageDiv = document.createElement('div');
          pageDiv.className = 'a4-page custom-asset-page';
          
          if (page.bgImage) {
            pageDiv.innerHTML += `<img class="custom-bg-img" src="${page.bgImage}">`;
          }
          
          page.elements.forEach(el => {
            const input = document.getElementById(`cp_${page.id}_${el.id}`);
            const text = input ? input.value : '';
            if (text) {
              const elDiv = document.createElement('div');
              elDiv.style.position = 'absolute';
              elDiv.style.top = el.top + '%';
              elDiv.style.right = el.right + '%';
              elDiv.style.width = el.width + '%';
              elDiv.style.height = el.height + '%';
              elDiv.style.fontFamily = el.fontFamily;
              elDiv.style.fontSize = el.fontSize + 'pt';
              elDiv.style.display = 'flex';
              elDiv.style.alignItems = 'center';
              elDiv.style.justifyContent = el.textAlign === 'center' ? 'center' : (el.textAlign === 'left' ? 'flex-end' : 'flex-start');
              elDiv.style.zIndex = '10';
              elDiv.textContent = text;
              pageDiv.appendChild(elDiv);
            }
          });
          container.appendChild(pageDiv);
        }
      });
    }

    // --- Core Logic ---
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
      document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"]').forEach(input => {
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
      root.style.setProperty('--w-col', document.getElementById('prop-col').value + '%');
      root.style.setProperty('--w-margin', document.getElementById('prop-margin').value + '%');
      root.style.setProperty('--w-gutter', document.getElementById('prop-gutter').value + '%');
      root.style.setProperty('--w-gap', document.getElementById('prop-gap').value + '%');
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

    function renderMainShaar(container, style) {
      const page = document.createElement('div');
      page.className = `a4-page main-shaar-page main-template-${style}`;

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const subtitle = document.getElementById('inp-book-subtitle').value || "";
      const desc = document.getElementById('inp-book-desc').value || "";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let frameHTML = '';
      if (style === 'custom_img') {
        const imgSrc = document.getElementById('data-main-shaar-img').value;
        if (imgSrc) {
          frameHTML = `<img class="custom-bg-img" src="${imgSrc}" alt="שער ראשי">`;
        }
      } else if (style === '1') {
        frameHTML = `
          <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
          <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
        `;
      } else if (style === '2') {
        frameHTML = `
          <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
          <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
        `;
      } else if (style === '3') {
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
        <div class="shaar-main-content">
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

    function renderSubShaar(container, token, style) {
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

      if (style === 'custom_img') {
        const imgSrc = document.getElementById('data-sub-shaar-img').value;
        page.innerHTML = `
          ${imgSrc ? `<img class="custom-bg-img" src="${imgSrc}" alt="שער משנה">` : ''}
          <div class="sub-shaar-content-centered" style="position: relative; z-index: 20; width: 100%; height: 100%;">
            <div class="sefer-label">חלק</div>
            <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
            ${titleSub ? `
              <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
                <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
              </svg>
              <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
          </div>
        `;
      } else {
        let innerLace = '';
        if (style === '2') {
          innerLace = '<div class="m2-lace" style="border-left: 1px solid #ddd;"></div>';
        }

        page.innerHTML = `
          <div class="sub-shaar-bg-right"></div>
          <div class="sub-shaar-col">
            <div class="sub-shaar-content-centered" style="flex-grow: 1;">
              <div class="sefer-label">חלק</div>
              <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
              ${titleSub ? `
                <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
                  <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
                </svg>
                <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
            </div>
            ${innerLace}
          </div>
        `;
      }
      container.appendChild(page);
    }

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, bgType = 'normal') {
      const page = document.createElement('div');
      page.className = 'a4-page';

      let bgSrc = '';
      if (bgType === 'normal') bgSrc = document.getElementById('data-bg-normal')?.value;
      else if (bgType === 'h0') bgSrc = document.getElementById('data-bg-h0')?.value;
      else if (bgType === 'h2') bgSrc = document.getElementById('data-bg-h2')?.value;
      
      let bgHtml = bgSrc ? `<img class="custom-bg-img" src="${bgSrc}">` : '';

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
        ${bgHtml}
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
        
        // Check Custom Pages Prefixes
        if (!match && customAssets.pages) {
          for (let page of customAssets.pages) {
            for (let el of page.elements) {
              if (el.prefix && trimmed.startsWith(el.prefix)) {
                const val = trimmed.substring(el.prefix.length).trim();
                const input = document.getElementById(`cp_${page.id}_${el.id}`);
                if (input) input.value = val;
                match = true;
                break;
              }
            }
            if (match) break;
          }
        }

        if (!match) {
          cleanLines.push(line);
        }
      }
      return cleanLines.join('\n');
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
      
      // If it's a custom style, we might need to apply bold/weight for accurate measurement
      if (styleObj.fontWeight) measureContainer.style.fontWeight = styleObj.fontWeight;
      else measureContainer.style.fontWeight = 'normal';

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
        
        if (currentTop === -1) {
          currentTop = top;
        }
        
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
          let customClass = child.className.match(/custom-style-[^\s]+/)?.[0];
          
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
          } else {
             mergedItems.push({
               type: 'p',
               id: id,
               rawText: text,
               isCont: isCont,
               sideNote: sideNote,
               customClass: customClass
             });
          }
        } else {
          mergedItems.push({
            type: 'h',
            id: child.getAttribute('data-token-id'),
            html: child.outerHTML,
            level: child.className.match(/title-level-(\d+)/)?.[1]
          });
        }
      }

      const items = mergedItems.map(item => {
        if (item.type === 'p') {
          let curStyleObj = styleObj;
          if (item.customClass) {
            const styleId = item.customClass.replace('custom-style-', '');
            const sDef = customAssets.styles.find(s => s.id === styleId);
            if (sDef) curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: sDef.css.fontSize + 'pt', lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
          }
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, curStyleObj, !item.isCont && !item.customClass);
          return {
            ...item,
            lines: linesInfo.lines,
            isSingleLine: linesInfo.lines.length <= 1,
            hasWindow: linesInfo.hasWindow
          };
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
        if (sp.itemIndex > 0) {
          const prevItem = items[sp.itemIndex - 1];
          if (prevItem.type === 'h') {
            return false;
          }
        }
        return true;
      });

      let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
      if (pointsToEvaluate.length === 0) return;

      function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = 'p-end' + (item.customClass ? ' ' + item.customClass : '');
          p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
          col.appendChild(p);
        }
      }

      let bestSplit = pointsToEvaluate[0];
      let minAbsDiff = Infinity;
      let bestDiff = Infinity;

      for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) {
          renderSingleItemFast(rCol, items[i]);
        }
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pRight = document.createElement('p');
          pRight.className = 'p-cut' + (item.customClass ? ' ' + item.customClass : '');
          let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
          pRight.innerHTML = createDropWord(rightText, item.isCont, false);
          rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pLeft = document.createElement('p');
          pLeft.className = 'p-end' + (item.customClass ? ' ' + item.customClass : '');
          let leftText = sp.lines.slice(sp.lineIndex).join(' ');
          pLeft.innerHTML = createDropWord(leftText, true, false);
          lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) {
          renderSingleItemFast(lCol, items[i]);
        }
        let lHeight = lCol.scrollHeight;

        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);
        
        if (absDiff < minAbsDiff) {
            minAbsDiff = absDiff;
            bestSplit = sp;
            bestDiff = diff;
        } else if (absDiff === minAbsDiff && diff >= 0) {
            bestSplit = sp;
            bestDiff = diff;
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
          p.className = (isPartial && isRight ? 'p-cut' : 'p-end') + (item.customClass ? ' ' + item.customClass : '');
          p.setAttribute('data-token-id', item.id);
          
          let textToRender = isPartial ? partialText : item.rawText;
          p.setAttribute('data-raw-text', textToRender);
          p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
          if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let curStyleObj = styleObj;
              if (item.customClass) {
                const styleId = item.customClass.replace('custom-style-', '');
                const sDef = customAssets.styles.find(s => s.id === styleId);
                if (sDef) curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: sDef.css.fontSize + 'pt', lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
              }
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, curStyleObj, !isCont && !item.customClass);
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          col.appendChild(p);

          if (item.sideNote && !isCont) {
            const noteElem = document.createElement('div');
            noteElem.className = 'side-note-anchor';
            noteElem.textContent = item.sideNote;
            margin.appendChild(noteElem);
            finalNotes.push({ elem: noteElem, pElem: p });
          }
        }
      }

      for (let i = 0; i < bestSplit.itemIndex; i++) {
        appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
      }
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

      finalNotes.forEach(item => {
        item.elem.style.top = item.pElem.offsetTop + 'px';
      });
    }

    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // Check for Custom Styles first
        let matchedCustomStyle = false;
        if (customAssets.styles) {
          for (let s of customAssets.styles) {
            if (s.prefix && line.startsWith(s.prefix)) {
              const txt = line.substring(s.prefix.length).trim();
              const tokenObj = { id: tokens.length, type: 'custom_style', styleId: s.id, text: txt, lineIdx: lineIdx, layoutMode: s.layoutMode };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
              matchedCustomStyle = true;
              break;
            }
          }
        }
        if (matchedCustomStyle) continue;

        const hMatch = line.match(/^כותרת\s*(\d+)\s*(?:מספר\s*\d+)?\s*[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            pendingSideNote = txt;
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          const tokenObj = { id: tokens.length, type: 'p', text: line, sideNote: pendingSideNote, lineIdx: lineIdx };
          tokens.push(tokenObj);
          lineToTokenMap[lineIdx] = tokenObj.id;
          pendingSideNote = null;
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

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type === 'custom_style' ? t.layoutMode : (t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col');
        
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

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const mainShaarStyle = document.getElementById('main-shaar-style').value;
      const subShaarStyle = document.getElementById('sub-shaar-style').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // Render Custom Pages (Before Shaar)
      renderCustomPages(container, 'before_shaar');

      if (showMainShaar) {
        renderMainShaar(container, mainShaarStyle);
      }
      
      // Render Custom Pages (After Shaar)
      renderCustomPages(container, 'after_shaar');

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

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          renderSubShaar(container, sec.token, subShaarStyle);
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              const tMode = t.type === 'custom_style' ? t.layoutMode : (t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col');
              if (inThisH1 && t.type.startsWith('h') && tMode === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
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
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.type === 'h0';
        
        let bgType = 'normal';
        if (isH0) bgType = 'h0';
        else if (sec.isNewPage && (sec.hToken.type === 'h2' || sec.hToken.type === 'custom_style')) bgType = 'h2';

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
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
            isFirstPage ? bgType : 'normal'
          );
          pageIndex++;
		  
		  let remPageHeight = pageLayout.bodyFlow.clientHeight;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
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

              if (currentTok.type.startsWith('h') && currentTok.type !== 'custom_style') {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = `title-level-${currentTok.level}`;
                hElem.textContent = currentTok.text;
                hElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p' || currentTok.type === 'custom_style') {
                let curStyleObj = styleObj;
                let pClassExtra = '';
                if (currentTok.type === 'custom_style') {
                    let sDef = customAssets.styles.find(s => s.id === currentTok.styleId);
                    if (sDef) {
                        curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: sDef.css.fontSize + 'pt', lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
                        pClassExtra = `custom-style-${sDef.id} `;
                    }
                }
                
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, curStyleObj, currentTok.type === 'p' ? true : false);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = pClassExtra + ((i === lines.length) ? 'p-end' : 'p-cut');
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

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = pClassExtra + (isEndOfP ? 'p-end' : 'p-cut');
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);

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
            const peekMode = peekTok && peekTok.type === 'custom_style' ? peekTok.layoutMode : (peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col');

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              if (remPageHeight < 100) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              
              let extraClass = 'h3-title-text';
              if (peekTok.type === 'custom_style') {
                  extraClass = `custom-style-${peekTok.styleId}`;
              }
              
              spanBlock.innerHTML = `<div class="${extraClass}" data-token-id="${peekTok.id}" id="heading-tok-${peekTok.id}">${peekTok.text}</div>`;
              pageLayout.bodyFlow.appendChild(spanBlock);
              
              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanBlock.getBoundingClientRect().height + 4;
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
                const curMode = currentTok.type === 'custom_style' ? currentTok.layoutMode : (currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col');

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h') && currentTok.type !== 'custom_style') {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = `title-level-${currentTok.level}`;
                  hElem.textContent = currentTok.text;
                  hElem.setAttribute('data-token-id', currentTok.id);
				  hElem.id = `heading-tok-${currentTok.id}`;
                  targetCol.appendChild(hElem);

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p' || currentTok.type === 'custom_style') {
                  let curStyleObj = styleObj;
                  let pClassExtra = '';
                  if (currentTok.type === 'custom_style') {
                      let sDef = customAssets.styles.find(s => s.id === currentTok.styleId);
                      if (sDef) {
                          curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: sDef.css.fontSize + 'pt', lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
                          pClassExtra = `custom-style-${sDef.id} `;
                      }
                  }
                  
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, curStyleObj, currentTok.type === 'p' ? true : false);
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
                    pElem.className = pClassExtra + ((i === lines.length) ? 'p-end' : 'p-cut');
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

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = pClassExtra + (isEndOfP ? 'p-end' : 'p-cut');
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);

                  if (!isContinuation && currentTok.sideNote) {
                    pElem.setAttribute('data-side-note', currentTok.sideNote);
                    const noteElem = document.createElement('div');
                    noteElem.className = 'side-note-anchor';
                    noteElem.textContent = currentTok.sideNote;
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
              const nextPeekMode = nextPeekTok && nextPeekTok.type === 'custom_style' ? nextPeekTok.layoutMode : (nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col');
              
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
            
            pagePendingNotes.forEach(item => {
              if (item.elem && item.pElem) {
                item.elem.style.top = item.pElem.offsetTop + 'px';
              }
            });
          }
        }
      }
      
      // Render Custom Pages (End of book)
      renderCustomPages(container, 'end_of_book');

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
        const lvl = t.type.startsWith('h') && t.type !== 'custom_style' ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') && t.type !== 'custom_style' ? t.text : t.sideNote;
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
        
        let bgSrc = isFirstTOCPage ? document.getElementById('data-bg-toc1')?.value : document.getElementById('data-bg-toc')?.value;
        let bgHtml = bgSrc ? `<img class="custom-bg-img" src="${bgSrc}">` : '';
        
        page.innerHTML = `
          ${bgHtml}
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

    window.onload = function() {
      loadEmbeddedAssets();
      
      if (document.getElementById('main-shaar-style').value === 'custom_img') {
        document.getElementById('row-main-shaar-img').style.display = 'flex';
      }
      if (document.getElementById('sub-shaar-style').value === 'custom_img') {
        document.getElementById('row-sub-shaar-img').style.display = 'flex';
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
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום.
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית.

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

### איך לבדוק את זה?
1. פתח את הקובץ החדש הזה בדפדפן.
2. פתח את קובץ הסטודיו (`studio.html` מההודעה הקודמת) בחלון נפרד.
3. בסטודיו, צור עמוד חדש (למשל "עמוד הסכמה"), הוסף לו תיבת טקסט עם הקידומת `הסכמה:`, ולחץ על "ייצא נכסים".
4. חזור לקובץ הראשי, לחץ על הכפתור החדש **"📥 ייבא נכסים"** ובחר את הקובץ שהורדת.
5. תראה שנוצר אוטומטית פאנל חדש בצד שמאל עם שדה "הסכמה:".
6. אם תוסיף לטקסט הגולמי שורה שמתחילה במילה `הסכמה: שלום רב...`, תראה שהיא אוטומטית נשאבת לעמוד המיוחד שיצרת! (וכמובן, העמוד יופיע במיקום שהגדרת לו בסטודיו).

בדוק שזה עובד כפי שציפית, ונוכל להמשיך לשכלל את הסטודיו!

---

## פנייה 6: צריך להוסיף לסטודיו טעינת ובחירת גופני מערכת, ולהוסיף בחירת צבע ואפשרות הוספת…

צריך להוסיף לסטודיו טעינת ובחירת גופני מערכת, 
ולהוסיף בחירת צבע ואפשרות הוספת מסגרת (עם הגדרת צבע, עובי, ועיגול קצוות) לכל הגדרת טקסט שבסטודיו (גם בעמוד וגם בסגנון טקסט), 
צריך להוסיף אפשרות נוספת חוץ מקידומת שעובדת רק בתחילת שורה, לצורך הגדרת סגנון לטקסט הנמצא בין שני סימונים כמו סוגרים, 
לאפשרות זו צריך להוסיף תיבות צ'קבוקס עם סוגי העמודים וסגנונות הטקסט הקיימים כבר (רמות הכותרות וכו'), לבחירת הגבלת\הרחבת החלת הסגנון על סוגים שונים של טקסט (לדוגמא שהסגנון יחלו רק על סוגריים שנמצאים בטקסט רגיל ולא על סוגריים שנמצאו בבכותרת).
וכן יש להוסיף אפשרות להגדרה חלקית, זאת אומרת: רק להדגיש או רק להקטין, ושאר ההגדרות ישארו כמו בשאר הטקסט (כך יהיה אפשרות להגדרת הקטנת טקסט מוסגר בכל סוגי בטקסט בלי לשנות את הגופן וכו').

---

### 🤖 תגובה 9: Defining the Enhancement Scope I'm now zeroing in on the core goal: expanding…

**Defining the Enhancement Scope**

I'm now zeroing in on the core goal: expanding `studio.html` and the main app to empower custom pages and style controls. This initial step is critical. I must ensure the scope remains manageable while achieving the desired flexibility. I'm focusing on defining the boundaries of this enhancement now, as the basis for further progress.


**Refining the Features**

I've been drilling down on the specific features. Adding system font selection and comprehensive color/border controls for all text definitions are at the top of my list. Introducing a new parsing rule for inline styling, triggered by markers, is also key. I'm especially focused on implementing scope limitation via checkboxes to enhance user control over where these inline styles apply. Finally, I'm thinking through how to implement partial styling and inheritance of styles.


**Planning Studio Updates**

I'm now focusing on `studio.html` updates. I've broken the work into tasks. I'll add a system fonts loader and update the font dropdowns. I'll add color pickers and border controls to both the page element and style editors. Finally, I'll modify the style builder to handle inline styles with markers, scopes, and partial inheritance flags.


**Updating Inheritance Structures**

I'm now refining the inheritance mechanisms for font properties. I've decided to include an "Inherit" option in the font family and size dropdowns for clarity. The size control might benefit from a relative size option, though I'm keeping it simple initially with a checkbox to manage the change. Empty values will denote inheritance for font family and size. I've also added toggle switches for property application or blank values to denote inheritance. These adjustments aim for a cleaner, more intuitive approach.



**Implementing UI Elements**

I'm currently focused on the `studio.html` user interface. I'm adding fields for border radius, padding, and refining font inheritance options, allowing `fontFamily`, `fontSize`, and `fontWeight` to inherit from parent elements. In the page builder element editor, I'm integrating text color, border width, color and radius, and padding controls. The style builder is also getting an update, with options for style levels and inline style markers. I'm incorporating scopes and new CSS settings, including font and size inherit options.


**Implementing Core Functions**

I'm now implementing the core functions. I'm updating `createNewPage`, `addElement`, and `createNewStyle` with the new default properties. I'm updating `selectElement`, `updateCurrentElement`, `selectStyle`, and `updateCurrentStyle` to map the new fields and toggle visibility based on Block/Inline styles. I'm also updating `renderPreview` to correctly show borders and colors. I'm building out the system font logic, and I've added color and border fields to the page elements and added the inline style type (Block/Inline).


**Integrating Style Updates**

I'm now incorporating color and border fields into styles, including inheritance options for font properties. The preview rendering is also being updated to correctly display these changes. I'm focusing on the studio, ensuring the main app integration is addressed subsequently, per user request.

I'm refining the user interface to manage scopes effectively. I'm introducing checkboxes for various HTML elements (`p`, `h1` through `h7`) to control inline style application and considering "Select All/Deselect All" functionality.

Finally, I'm drafting the studio code and have self-corrected an issue regarding relative font sizes, which are implemented via text input to support absolute and relative size notations, along with an "inherit" option.


**Refining Font Size Controls**

I'm now revising the font size controls. I've opted for a text input with a placeholder for clarity, enabling flexibility with options like "12pt" or "0.9em" or "inherit." I'll also add a small help text to guide users. This approach is simpler than a combined dropdown and input.

I'm now shifting focus to updating the `studio.html` file. The goal is to integrate the new font size controls, and expand the functionality to accurately preview changes. I'll be adding the `loadSystemFonts` to studio and updating the `appData` structure in `createNewPage` and `createNewStyle`.


**Implementing Style Toggles**

I'm now implementing style toggles. I've updated the style editor HTML to include a type selector (block/inline) with settings sections and CSS. I'm focusing on scope checkboxes for inline styles, aiming for a cleaner block and inline style editor design. The system also supports relative font size input.



**Implementing UI Features**

I've integrated the HTML code for the scope checkboxes, the system font API, color inputs, and the "inherit" and text inputs for font size and partial styles in the editor. I've also double-checked that all required UI elements and features have been included and properly reflected in the updated JSON structure.

---

### 🤖 תגובה 10: אלו דרישות מקצועיות ומדויקות מאוד! היכולת להגדיר סגנון חלקי (Inline Style) שחל…

אלו דרישות מקצועיות ומדויקות מאוד! היכולת להגדיר **סגנון חלקי (Inline Style)** שחל רק על טקסט שבין סוגריים, ולהגביל אותו רק לגוף הטקסט (ולא לכותרות) – היא בדיוק מה שמבדיל בין מעבד תמלילים פשוט למערכת עימוד תורנית אמיתית. 

הוספת האפשרות ל"הורשה" (Inheritance) – כלומר לשנות רק את הגודל (למשל `0.8em`) או רק את המשקל, מבלי לדרוס את הגופן המקורי של הפסקה – היא חכמה מאוד ותחסוך המון עבודה.

שדרגתי את **TorahType Studio** עם כל הבקשות שלך:
1. **טעינת גופני מערכת:** נוסף כפתור בסרגל העליון שמושך את כל הגופנים מהמחשב.
2. **צבע ומסגרות:** לכל אלמנט (בעמוד או בסגנון טקסט) יש כעת הגדרות צבע טקסט, עובי מסגרת, צבע מסגרת, עיגול פינות (Radius) וריווח פנימי (Padding).
3. **סוג סגנון (Block לעומת Inline):** כשיוצרים סגנון טקסט, ניתן לבחור אם זה "בלוק" (פסקה שלמה שמתחילה בקידומת) או "טקסט מוסגר" (Inline).
4. **סמנים ותחולה (Scopes):** בסגנון Inline מגדירים סמן התחלה (למשל `(`) וסמן סיום (למשל `)`), ויש רשימת צ'קבוקסים שמאפשרת לבחור באילו סוגי טקסט הסגנון הזה יופעל.
5. **עיצוב חלקי (Inherit):** בגופנים, במשקל ובגודל נוספה האפשרות `inherit` (לרשת מהטקסט המקורי). בגודל הטקסט אפשר להזין ערך יחסי כמו `0.8em` (80% מהגודל המקורי) או `inherit`.

הנה הקוד המעודכן ל-`studio.html`. שמור אותו ופתח בדפדפן:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TorahType Studio - עורך נכסים מתקדם</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700&display=swap');

  :root {
    --primary: #2c3e50;
    --secondary: #b8860b;
    --bg: #ecf0f1;
    --panel-bg: #ffffff;
    --border: #bdc3c7;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Assistant', sans-serif;
    background-color: var(--bg);
    color: #333;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    background-color: var(--primary);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 10;
  }

  header h1 { font-size: 1.5rem; margin: 0; }
  
  .header-actions { display: flex; gap: 10px; }

  .btn {
    background: var(--secondary);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-family: inherit;
    transition: background 0.2s;
  }
  .btn:hover { background: #9a7009; }
  .btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); }
  .btn-sys-fonts { background: #34495e; border: 1px solid #7f8c8d; }
  .btn-sys-fonts:hover { background: #2c3e50; }

  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 400px;
    background: var(--panel-bg);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .tab {
    flex: 1;
    text-align: center;
    padding: 12px;
    cursor: pointer;
    background: #f8f9fa;
    font-weight: bold;
    border-bottom: 3px solid transparent;
  }
  .tab.active {
    background: var(--panel-bg);
    border-bottom-color: var(--secondary);
    color: var(--primary);
  }

  .tab-content {
    display: none;
    padding: 20px;
  }
  .tab-content.active { display: block; }

  .form-group { margin-bottom: 15px; }
  .form-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; }
  .form-group input[type="text"], .form-group input[type="number"], .form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-family: inherit;
  }
  .form-group input[type="color"] {
    width: 100%;
    height: 35px;
    padding: 2px;
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
  }
  
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  .item-list {
    list-style: none;
    margin-bottom: 20px;
  }
  .item-list li {
    background: #f8f9fa;
    border: 1px solid var(--border);
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  .item-list li:hover { border-color: var(--secondary); }

  .workspace {
    flex: 1;
    background: #7f8c8d;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: auto;
  }

  /* A4 Preview */
  .a4-preview {
    width: 210mm;
    height: 297mm;
    background-color: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    position: relative;
    transform-origin: top center;
    transform: scale(0.6);
    overflow: hidden;
  }

  .preview-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    object-fit: fill;
    z-index: 1;
  }

  .preview-element {
    position: absolute;
    z-index: 2;
    border: 1px dashed #3498db;
    background: rgba(52, 152, 219, 0.1);
    display: flex;
    align-items: center;
    padding: 5px;
    box-sizing: border-box;
  }
  .preview-element::before {
    content: attr(data-label);
    position: absolute;
    top: -20px; right: 0;
    font-size: 12px;
    background: #3498db;
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
  }

  .section-title {
    font-size: 1.1rem;
    color: var(--primary);
    border-bottom: 2px solid var(--secondary);
    padding-bottom: 5px;
    margin: 20px 0 15px 0;
  }

  .scopes-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    background: #f1f2f6;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .scopes-grid label {
    font-weight: normal;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0;
  }

  .help-text {
    font-size: 0.75rem;
    color: #7f8c8d;
    margin-top: 3px;
    display: block;
  }
</style>
</head>
<body>

  <header>
    <h1>TorahType Studio 🛠️</h1>
    <div class="header-actions">
      <button class="btn btn-sys-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
      <button class="btn" onclick="exportAssets()">💾 ייצא נכסים לקובץ (.ttasset)</button>
    </div>
  </header>

  <div class="main-container">
    
    <div class="sidebar">
      <div class="tabs">
        <div class="tab active" onclick="switchTab('pages')">סוגי עמודים</div>
        <div class="tab" onclick="switchTab('styles')">סגנונות טקסט</div>
      </div>

      <!-- PAGE BUILDER TAB -->
      <div id="tab-pages" class="tab-content active">
        <button class="btn btn-outline" style="width:100%; margin-bottom:15px;" onclick="createNewPage()">+ צור עמוד חדש</button>
        <ul class="item-list" id="page-list"></ul>

        <div id="page-editor" style="display:none; border-top: 1px solid #ccc; padding-top: 15px;">
          <div class="form-group">
            <label>שם העמוד (למשל: עמוד הסכמה)</label>
            <input type="text" id="p-name" oninput="updateCurrentPage()">
          </div>
          <div class="form-group">
            <label>מיקום ברירת מחדל בספר</label>
            <select id="p-position" onchange="updateCurrentPage()">
              <option value="before_shaar">לפני שער ראשי</option>
              <option value="after_shaar">אחרי שער ראשי</option>
              <option value="end_of_book">בסוף הספר</option>
            </select>
          </div>
          <div class="form-group">
            <label>תמונת רקע (A4)</label>
            <input type="file" accept="image/*" onchange="handleBgUpload(event)">
          </div>

          <div class="section-title">תיבות טקסט בעמוד</div>
          <ul class="item-list" id="element-list"></ul>
          <button class="btn btn-outline" style="width:100%; font-size:0.9rem;" onclick="addElement()">+ הוסף תיבת טקסט</button>

          <div id="element-editor" style="display:none; background:#f1f2f6; padding:10px; margin-top:15px; border-radius:5px;">
            <div class="form-group">
              <label>קידומת לזיהוי בטקסט (למשל: "הסכמה:")</label>
              <input type="text" id="e-prefix" oninput="updateCurrentElement()">
            </div>
            <div class="grid-2">
              <div class="form-group"><label>מיקום מלמעלה (%)</label><input type="number" id="e-top" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>מיקום מימין (%)</label><input type="number" id="e-right" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>רוחב (%)</label><input type="number" id="e-width" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>גובה (%)</label><input type="number" id="e-height" oninput="updateCurrentElement()"></div>
            </div>
            
            <div class="section-title" style="font-size: 1rem; margin-top:10px;">עיצוב טקסט ומסגרת</div>
            <div class="grid-2">
              <div class="form-group">
                <label>גופן</label>
                <select id="e-font" class="font-picker" onchange="updateCurrentElement()">
                  <optgroup label="ברירת מחדל">
                    <option value="'David Libre', serif">David Libre</option>
                    <option value="'Frank Ruhl Libre', serif">Frank Ruhl Libre</option>
                    <option value="'Assistant', sans-serif">Assistant</option>
                  </optgroup>
                </select>
              </div>
              <div class="form-group"><label>גודל (pt)</label><input type="number" id="e-size" oninput="updateCurrentElement()"></div>
            </div>
            <div class="grid-2">
              <div class="form-group"><label>צבע טקסט</label><input type="color" id="e-color" oninput="updateCurrentElement()"></div>
              <div class="form-group">
                <label>יישור טקסט</label>
                <select id="e-align" onchange="updateCurrentElement()">
                  <option value="center">מרכז</option>
                  <option value="right">ימין</option>
                  <option value="left">שמאל</option>
                  <option value="justify">מיושר לשוליים</option>
                </select>
              </div>
            </div>
            <div class="grid-3">
              <div class="form-group"><label>עובי מסגרת (px)</label><input type="number" id="e-border-w" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>צבע מסגרת</label><input type="color" id="e-border-c" oninput="updateCurrentElement()"></div>
              <div class="form-group"><label>עיגול פינות (px)</label><input type="number" id="e-border-r" oninput="updateCurrentElement()"></div>
            </div>
            <div class="form-group"><label>ריווח פנימי - Padding (px)</label><input type="number" id="e-padding" oninput="updateCurrentElement()"></div>
          </div>
        </div>
      </div>

      <!-- STYLE BUILDER TAB -->
      <div id="tab-styles" class="tab-content">
        <button class="btn btn-outline" style="width:100%; margin-bottom:15px;" onclick="createNewStyle()">+ צור סגנון טקסט חדש</button>
        <ul class="item-list" id="style-list"></ul>

        <div id="style-editor" style="display:none; border-top: 1px solid #ccc; padding-top: 15px;">
          <div class="form-group">
            <label>שם הסגנון</label>
            <input type="text" id="s-name" oninput="updateCurrentStyle()">
          </div>
          
          <div class="form-group">
            <label>סוג הסגנון</label>
            <select id="s-type" onchange="toggleStyleType(); updateCurrentStyle();">
              <option value="block">פסקה / כותרת שלמה (Block)</option>
              <option value="inline">טקסט חלקי / מוסגר (Inline)</option>
            </select>
          </div>

          <!-- BLOCK SETTINGS -->
          <div id="s-block-settings">
            <div class="form-group">
              <label>קידומת לזיהוי בתחילת שורה</label>
              <input type="text" id="s-prefix" placeholder='למשל: "הערה - "' oninput="updateCurrentStyle()">
            </div>
            <div class="form-group">
              <label>התנהגות עימוד (Layout Mode)</label>
              <select id="s-mode" onchange="updateCurrentStyle()">
                <option value="inline_2col">רציף בתוך הטורים (כמו פסקה)</option>
                <option value="span_1col">רציף על פני 2 הטורים (כמו כותרת 3)</option>
                <option value="new_page_1col">עמוד חדש טור 1 (כמו שער/פרק)</option>
                <option value="side_note">הערת שוליים בצד</option>
              </select>
            </div>
          </div>

          <!-- INLINE SETTINGS -->
          <div id="s-inline-settings" style="display:none;">
            <div class="grid-2">
              <div class="form-group"><label>סמן התחלה</label><input type="text" id="s-start-marker" placeholder="למשל: (" oninput="updateCurrentStyle()"></div>
              <div class="form-group"><label>סמן סיום</label><input type="text" id="s-end-marker" placeholder="למשל: )" oninput="updateCurrentStyle()"></div>
            </div>
            <div class="form-group">
              <label>החל על סוגי הטקסט הבאים:</label>
              <div class="scopes-grid" id="s-scopes" onchange="updateCurrentStyle()">
                <label><input type="checkbox" value="p" checked> גוף הטקסט (p)</label>
                <label><input type="checkbox" value="h1"> כותרת 1</label>
                <label><input type="checkbox" value="h2"> כותרת 2</label>
                <label><input type="checkbox" value="h3"> כותרת 3</label>
                <label><input type="checkbox" value="h4"> כותרת 4</label>
                <label><input type="checkbox" value="h5"> כותרת 5</label>
                <label><input type="checkbox" value="h6"> כותרת 6</label>
                <label><input type="checkbox" value="h7"> כותרת צד (7)</label>
              </div>
            </div>
          </div>
          
          <div class="section-title">עיצוב חלקי / מלא (CSS)</div>
          <div class="form-group">
            <label>גופן</label>
            <select id="s-font" class="font-picker" onchange="updateCurrentStyle()">
              <option value="inherit">-- ללא שינוי (הורשה) --</option>
              <optgroup label="ברירת מחדל">
                <option value="'David Libre', serif">David Libre</option>
                <option value="'Frank Ruhl Libre', serif">Frank Ruhl Libre</option>
              </optgroup>
            </select>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>גודל טקסט</label>
              <input type="text" id="s-size" oninput="updateCurrentStyle()" placeholder="inherit / 12pt / 0.8em">
              <span class="help-text">הכנס 'inherit' כדי לא לשנות, או ערך יחסי כמו '0.8em' להקטנה.</span>
            </div>
            <div class="form-group">
              <label>משקל (Bold)</label>
              <select id="s-weight" onchange="updateCurrentStyle()">
                <option value="inherit">-- ללא שינוי --</option>
                <option value="normal">רגיל</option>
                <option value="bold">מודגש</option>
                <option value="900">מודגש מאוד (Black)</option>
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>צבע טקסט</label>
              <input type="color" id="s-color" oninput="updateCurrentStyle()">
            </div>
            <div class="form-group">
              <label>יישור (רלוונטי רק ל-Block)</label>
              <select id="s-align" onchange="updateCurrentStyle()">
                <option value="inherit">-- ללא שינוי --</option>
                <option value="justify">מיושר לשוליים</option>
                <option value="center">מרכז</option>
                <option value="right">ימין</option>
              </select>
            </div>
          </div>
          
          <div class="section-title" style="font-size: 1rem;">מסגרת וריווח</div>
          <div class="grid-3">
            <div class="form-group"><label>עובי (px)</label><input type="number" id="s-border-w" oninput="updateCurrentStyle()"></div>
            <div class="form-group"><label>צבע</label><input type="color" id="s-border-c" oninput="updateCurrentStyle()"></div>
            <div class="form-group"><label>עיגול (px)</label><input type="number" id="s-border-r" oninput="updateCurrentStyle()"></div>
          </div>
          <div class="grid-2">
            <div class="form-group"><label>ריווח פנימי (Padding)</label><input type="number" id="s-padding" oninput="updateCurrentStyle()"></div>
            <div class="form-group"><label>מרווח עליון/תחתון (Block)</label><input type="number" id="s-margin" oninput="updateCurrentStyle()" placeholder="למשל: 10"></div>
          </div>
        </div>
      </div>

    </div>

    <div class="workspace">
      <!-- Preview only relevant for Page Builder -->
      <div class="a4-preview" id="preview-canvas" style="display:none;">
        <img id="preview-bg-img" class="preview-bg" style="display:none;">
        <div id="preview-elements-container"></div>
      </div>
      <div id="style-preview-msg" style="color:white; font-size:1.2rem; display:none; text-align:center;">
        התצוגה המקדימה לסגנונות טקסט תתבצע במערכת הראשית.<br>
        <span style="font-size:0.9rem; opacity:0.8;">(הגדרות Inline יחולו אוטומטית על הטקסט שבין הסמנים)</span>
      </div>
    </div>

  </div>

  <script>
    // --- State Management ---
    let appData = {
      version: "1.1",
      customPages: [],
      customStyles: []
    };

    let currentPageId = null;
    let currentElementId = null;
    let currentStyleId = null;

    // --- System Fonts ---
    async function loadSystemFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const availableFonts = await window.queryLocalFonts();
          const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort((a, b) => a.localeCompare(b, 'he'));
          
          if (fontFamilies.length > 0) {
            document.querySelectorAll('.font-picker').forEach(select => {
              const currentVal = select.value;
              
              // Keep the inherit option if it exists
              let inheritOpt = '';
              if (select.querySelector('option[value="inherit"]')) {
                inheritOpt = '<option value="inherit">-- ללא שינוי (הורשה) --</option>';
              }

              select.innerHTML = inheritOpt;
              
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

    // --- UI Tabs ---
    function switchTab(tabName) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      event.target.classList.add('active');
      document.getElementById('tab-' + tabName).classList.add('active');

      if(tabName === 'pages') {
        document.getElementById('preview-canvas').style.display = 'block';
        document.getElementById('style-preview-msg').style.display = 'none';
        renderPageList();
      } else {
        document.getElementById('preview-canvas').style.display = 'none';
        document.getElementById('style-preview-msg').style.display = 'block';
        renderStyleList();
      }
    }

    function toggleStyleType() {
      const type = document.getElementById('s-type').value;
      if (type === 'block') {
        document.getElementById('s-block-settings').style.display = 'block';
        document.getElementById('s-inline-settings').style.display = 'none';
      } else {
        document.getElementById('s-block-settings').style.display = 'none';
        document.getElementById('s-inline-settings').style.display = 'block';
      }
    }

    // --- Page Builder Logic ---
    function createNewPage() {
      const newPage = {
        id: 'page_' + Date.now(),
        name: 'עמוד חדש',
        insertPosition: 'before_shaar',
        bgImage: '',
        elements: []
      };
      appData.customPages.push(newPage);
      selectPage(newPage.id);
      renderPageList();
    }

    function renderPageList() {
      const list = document.getElementById('page-list');
      list.innerHTML = '';
      appData.customPages.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.name;
        li.onclick = () => selectPage(p.id);
        if(p.id === currentPageId) li.style.borderColor = 'var(--secondary)';
        list.appendChild(li);
      });
    }

    function selectPage(id) {
      currentPageId = id;
      currentElementId = null;
      renderPageList();
      
      const page = appData.customPages.find(p => p.id === id);
      if(!page) return;

      document.getElementById('page-editor').style.display = 'block';
      document.getElementById('element-editor').style.display = 'none';
      
      document.getElementById('p-name').value = page.name;
      document.getElementById('p-position').value = page.insertPosition;
      
      renderPreview();
      renderElementList();
    }

    function updateCurrentPage() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      if(!page) return;
      page.name = document.getElementById('p-name').value;
      page.insertPosition = document.getElementById('p-position').value;
      renderPageList();
    }

    function handleBgUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const page = appData.customPages.find(p => p.id === currentPageId);
        if(page) {
          page.bgImage = e.target.result;
          renderPreview();
        }
      };
      reader.readAsDataURL(file);
    }

    // --- Element Builder Logic ---
    function addElement() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      if(!page) return;
      
      const newEl = {
        id: 'el_' + Date.now(),
        prefix: 'טקסט:',
        top: 20, right: 10, width: 80, height: 10,
        fontFamily: "'David Libre', serif",
        fontSize: 24,
        color: '#000000',
        textAlign: 'center',
        borderWidth: 0,
        borderColor: '#000000',
        borderRadius: 0,
        padding: 0
      };
      page.elements.push(newEl);
      selectElement(newEl.id);
      renderElementList();
      renderPreview();
    }

    function renderElementList() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      const list = document.getElementById('element-list');
      list.innerHTML = '';
      if(!page) return;

      page.elements.forEach(e => {
        const li = document.createElement('li');
        li.textContent = e.prefix || 'ללא קידומת';
        li.onclick = () => selectElement(e.id);
        if(e.id === currentElementId) li.style.borderColor = 'var(--secondary)';
        list.appendChild(li);
      });
    }

    function selectElement(id) {
      currentElementId = id;
      renderElementList();
      
      const page = appData.customPages.find(p => p.id === currentPageId);
      const el = page.elements.find(e => e.id === id);
      if(!el) return;

      document.getElementById('element-editor').style.display = 'block';
      document.getElementById('e-prefix').value = el.prefix;
      document.getElementById('e-top').value = el.top;
      document.getElementById('e-right').value = el.right;
      document.getElementById('e-width').value = el.width;
      document.getElementById('e-height').value = el.height;
      document.getElementById('e-font').value = el.fontFamily;
      document.getElementById('e-size').value = el.fontSize;
      document.getElementById('e-color').value = el.color || '#000000';
      document.getElementById('e-align').value = el.textAlign;
      document.getElementById('e-border-w').value = el.borderWidth || 0;
      document.getElementById('e-border-c').value = el.borderColor || '#000000';
      document.getElementById('e-border-r').value = el.borderRadius || 0;
      document.getElementById('e-padding').value = el.padding || 0;
    }

    function updateCurrentElement() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      const el = page.elements.find(e => e.id === currentElementId);
      if(!el) return;

      el.prefix = document.getElementById('e-prefix').value;
      el.top = parseFloat(document.getElementById('e-top').value) || 0;
      el.right = parseFloat(document.getElementById('e-right').value) || 0;
      el.width = parseFloat(document.getElementById('e-width').value) || 0;
      el.height = parseFloat(document.getElementById('e-height').value) || 0;
      el.fontFamily = document.getElementById('e-font').value;
      el.fontSize = parseFloat(document.getElementById('e-size').value) || 12;
      el.color = document.getElementById('e-color').value;
      el.textAlign = document.getElementById('e-align').value;
      el.borderWidth = parseFloat(document.getElementById('e-border-w').value) || 0;
      el.borderColor = document.getElementById('e-border-c').value;
      el.borderRadius = parseFloat(document.getElementById('e-border-r').value) || 0;
      el.padding = parseFloat(document.getElementById('e-padding').value) || 0;

      renderElementList();
      renderPreview();
    }

    function renderPreview() {
      const page = appData.customPages.find(p => p.id === currentPageId);
      if(!page) return;

      const bgImg = document.getElementById('preview-bg-img');
      if(page.bgImage) {
        bgImg.src = page.bgImage;
        bgImg.style.display = 'block';
      } else {
        bgImg.style.display = 'none';
      }

      const container = document.getElementById('preview-elements-container');
      container.innerHTML = '';

      page.elements.forEach(el => {
        const div = document.createElement('div');
        div.className = 'preview-element';
        div.setAttribute('data-label', el.prefix);
        
        // Apply styles
        div.style.top = el.top + '%';
        div.style.right = el.right + '%';
        div.style.width = el.width + '%';
        div.style.height = el.height + '%';
        div.style.fontFamily = el.fontFamily;
        div.style.fontSize = el.fontSize + 'pt';
        div.style.color = el.color;
        div.style.textAlign = el.textAlign;
        div.style.justifyContent = el.textAlign === 'center' ? 'center' : (el.textAlign === 'left' ? 'flex-end' : 'flex-start');
        
        if (el.borderWidth > 0) {
          div.style.border = `${el.borderWidth}px solid ${el.borderColor}`;
          div.style.borderRadius = `${el.borderRadius}px`;
        } else {
          div.style.border = '1px dashed #3498db'; // fallback for preview
        }
        div.style.padding = `${el.padding}px`;
        
        div.textContent = "טקסט לדוגמה";
        
        if(el.id === currentElementId) {
          div.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.5)';
          div.style.zIndex = 10;
        }

        div.onclick = () => selectElement(el.id);
        container.appendChild(div);
      });
    }

    // --- Style Builder Logic ---
    function createNewStyle() {
      const newStyle = {
        id: 'style_' + Date.now(),
        name: 'סגנון חדש',
        type: 'block', // 'block' or 'inline'
        prefix: 'סגנון מיוחד - ',
        layoutMode: 'inline_2col',
        startMarker: '(',
        endMarker: ')',
        scopes: ['p'],
        css: {
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "#000000",
          textAlign: "inherit",
          margin: 0,
          borderWidth: 0,
          borderColor: "#000000",
          borderRadius: 0,
          padding: 0
        }
      };
      appData.customStyles.push(newStyle);
      selectStyle(newStyle.id);
      renderStyleList();
    }

    function renderStyleList() {
      const list = document.getElementById('style-list');
      list.innerHTML = '';
      appData.customStyles.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s.name + (s.type === 'inline' ? ' (מוסגר)' : ' (בלוק)');
        li.onclick = () => selectStyle(s.id);
        if(s.id === currentStyleId) li.style.borderColor = 'var(--secondary)';
        list.appendChild(li);
      });
    }

    function selectStyle(id) {
      currentStyleId = id;
      renderStyleList();
      
      const style = appData.customStyles.find(s => s.id === id);
      if(!style) return;

      document.getElementById('style-editor').style.display = 'block';
      document.getElementById('s-name').value = style.name;
      document.getElementById('s-type').value = style.type || 'block';
      
      toggleStyleType();

      // Block settings
      document.getElementById('s-prefix').value = style.prefix || '';
      document.getElementById('s-mode').value = style.layoutMode || 'inline_2col';
      
      // Inline settings
      document.getElementById('s-start-marker').value = style.startMarker || '';
      document.getElementById('s-end-marker').value = style.endMarker || '';
      
      // Checkboxes for scopes
      const scopes = style.scopes || [];
      document.querySelectorAll('#s-scopes input[type="checkbox"]').forEach(cb => {
        cb.checked = scopes.includes(cb.value);
      });
      
      // CSS settings
      document.getElementById('s-font').value = style.css.fontFamily || 'inherit';
      document.getElementById('s-size').value = style.css.fontSize || 'inherit';
      document.getElementById('s-weight').value = style.css.fontWeight || 'inherit';
      document.getElementById('s-color').value = style.css.color || '#000000';
      document.getElementById('s-align').value = style.css.textAlign || 'inherit';
      
      document.getElementById('s-border-w').value = style.css.borderWidth || 0;
      document.getElementById('s-border-c').value = style.css.borderColor || '#000000';
      document.getElementById('s-border-r').value = style.css.borderRadius || 0;
      document.getElementById('s-padding').value = style.css.padding || 0;
      document.getElementById('s-margin').value = style.css.margin || 0;
    }

    function updateCurrentStyle() {
      const style = appData.customStyles.find(s => s.id === currentStyleId);
      if(!style) return;

      style.name = document.getElementById('s-name').value;
      style.type = document.getElementById('s-type').value;
      
      style.prefix = document.getElementById('s-prefix').value;
      style.layoutMode = document.getElementById('s-mode').value;
      
      style.startMarker = document.getElementById('s-start-marker').value;
      style.endMarker = document.getElementById('s-end-marker').value;
      
      const checkedScopes = [];
      document.querySelectorAll('#s-scopes input[type="checkbox"]:checked').forEach(cb => {
        checkedScopes.push(cb.value);
      });
      style.scopes = checkedScopes;
      
      style.css.fontFamily = document.getElementById('s-font').value;
      style.css.fontSize = document.getElementById('s-size').value;
      style.css.fontWeight = document.getElementById('s-weight').value;
      style.css.color = document.getElementById('s-color').value;
      style.css.textAlign = document.getElementById('s-align').value;
      
      style.css.borderWidth = parseFloat(document.getElementById('s-border-w').value) || 0;
      style.css.borderColor = document.getElementById('s-border-c').value;
      style.css.borderRadius = parseFloat(document.getElementById('s-border-r').value) || 0;
      style.css.padding = parseFloat(document.getElementById('s-padding').value) || 0;
      style.css.margin = parseFloat(document.getElementById('s-margin').value) || 0;
      
      renderStyleList();
    }

    // --- Export Logic ---
    function exportAssets() {
      const dataStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-torah-assets.ttasset';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Init
    switchTab('pages');
  </script>
</body>
</html>
```

### מה התחדש בסטודיו?
* **צבעים ומסגרות:** כעת לכל תיבת טקסט בעמוד ולכל סגנון טקסט יש הגדרות של עובי מסגרת, צבע מסגרת, עיגול פינות (Radius) וריווח פנימי (Padding) כדי שהטקסט לא יידבק למסגרת.
* **סגנון Inline (מוסגר):** בעת יצירת סגנון טקסט, יש תפריט בחירה "סוג הסגנון". אם תבחר "טקסט חלקי / מוסגר (Inline)", יפתחו לך שדות להזנת "סמן התחלה" ו"סמן סיום" (למשל `[` ו-`]`).
* **הגבלת תחולה (Scopes):** מתחת לסמנים, תראה רשימת צ'קבוקסים. תוכל להגדיר שהסגנון המוסגר יחול רק על "גוף הטקסט (p)" ולא על "כותרת 1".
* **הורשה (Inheritance):** בהגדרות העיצוב של הסגנונות, בגופן, במשקל וביישור יש אפשרות `-- ללא שינוי (הורשה) --`. בשדה "גודל טקסט" אתה יכול לכתוב `inherit` כדי לא לשנות, או `0.8em` כדי שהטקסט יהיה קטן ב-20% מהטקסט שסביבו.

בדוק את הסטודיו וצור קובץ `.ttasset` חדש שיכיל גם עמוד מעוצב וגם סגנון Inline (למשל טקסט מוקטן בסוגריים). 

ברגע שתאשר, נעדכן את **המערכת הראשית** כדי שתדע לפענח את סמני ה-Inline ולרנדר את המסגרות והצבעים!

---

## פנייה 7: עדכן את המערכת הראשית!

עדכן את המערכת הראשית!

---

### 🤖 תגובה 11: Defining the Objective I'm currently focused on the overarching goal:…

**Defining the Objective**

I'm currently focused on the overarching goal: integrating new TorahType Studio features into the Main App. This involves understanding the specific functionalities to be incorporated. Right now, I'm working on documenting the core features.


**Analyzing Style Implementation**

Now I'm diving into the specifics of implementing custom styles. I'm focusing on font loading and ensuring compatibility across the system. I'm also carefully considering how to handle colors, borders (width, color, radius), padding, and inline styling with inheritance, including scoping for specific text types.


**Refining Inline Style Handling**

I've hit a snag with inline styles and how the existing word splitting function, `getLinesFromParagraph`, interacts with potential HTML. It appears the `split(/\s+/)` method breaks inline HTML tags, rendering the styling inaccurate if applied to the raw text content. Thus, I need to look into parsing inline styles before we measure anything, making sure we deal with nested HTML. I'm considering injecting HTML `<span>` tags to ensure proper inheritance.


**Refining Word Splitting**

I'm now focusing on a robust word-splitting solution. I need to avoid DOM breakage when handling inline styles, especially concerning HTML-like tags. I'm moving away from `text.split(/\s+/)` and towards parsing the text into a DOM structure. This will allow for extracting words while preserving their applied inline styles and ensuring correct inheritance.


**Implementing Word Tokenization**

I'm now implementing the `tokenizeTextIntoWords` function. My focus is on robustly processing text to handle inline styles and maintain inheritance. I'm using regex to identify and wrap styled text within span tags, as suggested previously. Currently, I'm working out how to pre-process the text, taking into account `tokenType`, custom inline styles, and scope. The goal is to build an array of words, each with a `className` property reflecting its styling.


**Refining Regex Implementation**

I'm now refining the inline style application using regular expressions and considering how to manage overlapping styles. I'm focusing on parsing text into an array of objects, with each object containing "text" and "classes" properties. I'm experimenting with using regex to wrap styled content within `<span>` tags, aiming to avoid breaking word splitting. I'm also ensuring that these styles are applied sequentially to the text segments, and the styles are applicable to the correct `tokenType`. The next step is processing the text by first splitting it into segments with spaces, and *then* applying the inline styles.


**Implementing Style Application**

I've got a new approach for applying inline styles. I am now refining a word-by-word state machine to manage active styles. I'm focusing on handling start and end markers for inline styles, ensuring correct application across multiple words. It seems fine to include the markers within the styled word, and that seems to be the preferred style in practice. I'm building `wordObjects` to contain both text and styling information, ensuring each word receives the appropriate inline styles. I need to make sure I am handling `applicableStyles` effectively.


**Refining Marker Application**

I'm now integrating style marker logic. I'm focusing on filtering inline styles based on token type. I'm using sets to manage active styles during the word-by-word iteration, addressing start and end markers. I'm ensuring both the start *and* end words receive the style by checking markers in `applicableStyles`. I'm building `wordObjects` for display, now with updated `classes` for each word.


**Handling Toggle Cases**

I'm now focusing on toggle cases, especially when start and end markers are the same (like bold, using `*`). If a word contains the marker, I check the count of its occurrences, and toggle the style if the count is odd, applying it if not already active or removing it if it is. The `Set` correctly handles markers that aren't properly closed, and this solution seems robust.


**Integrating Word Objects**

I'm now integrating the generated `wordObjects` into the line-breaking function. I'm focusing on replacing the direct HTML string concatenation with a word object iteration. Instead of constructing HTML directly, I'm adapting `getLinesFromParagraph` to use the properties of each `wordObject` (text and classes) to generate the HTML. This involves iterating through the `wordObjects` array and constructing HTML spans based on the existing classes.


**Refining Line Construction**

I'm now refining line construction, integrating word objects into HTML generation. The current approach outputs HTML spans, which may cause `createDropWord` to fail when it tries to split on spaces. I'm adapting `getLinesFromParagraph` to handle `wordObjects` and generate HTML. This involves iterating through `wordObjects` and building HTML spans using `wordObjects[i].text` and `wordObjects[i].classes`.


**Adjusting Drop Word Handling**

I'm now overhauling the drop-word feature. I've realized `indexOf(' ')` breaks when inline HTML spans exist within the text string. My solution is to handle drop word logic while constructing the line HTML, applying the class directly to the first word object. I'm also ensuring compatibility with `balanceColumns`.


**Adapting Drop Word Logic**

I'm now integrating the drop-word adjustment to work with generated HTML from `wordObjects`. The `getLinesFromParagraph` function now produces an array of line objects, each composed of styled words within `<span>` tags. To make this work, I am adapting `createDropWord` to accurately parse the first word, even when it is wrapped in HTML. I will extract the drop word's text, which is the text content of the first styled word in the first line.


**Refactoring Drop Word Handling**

I'm now rewriting the `createDropWord` function to accept HTML strings representing lines, generated from the word objects. Instead of working with a single string, I'm adapting it to take an array of fully formed HTML lines. Drop-cap logic will be applied to the first word of the first line, before or while building the lines.


**Refining Drop Word Application**

I'm now implementing `applyDropWordToHtml`, focusing on applying the drop-word class to the first word directly during HTML generation. I'm also ensuring this works correctly with dynamically cut paragraphs, correctly accounting for continuation lines. The drop-word span now wraps the first "word entity", correctly capturing the first word whether it is styled or not. The implementation ensures that `createDropWord` is correctly identifying the first word, no matter the surrounding HTML.


**Optimizing Line HTML**

I'm now integrating improvements. I'm focusing on directly applying the drop-word class to the word object during HTML line generation within the word object logic. This involves generating the HTML, and the class is added correctly in all cases.


**Implementing Custom Styles**

I'm now focused on generating the CSS needed for custom styles, integrating border, padding, and color properties from the `.ttasset` JSON. I'm updating `updateCustomStylesCSS` to handle these. The Main App's UI only requests the text, so the rendering uses properties from the JSON. I'm planning updates to `renderCustomPages` to ensure correct application.


**Updating Style Inheritance**

I'm now focusing on the handling of style inheritance, including border, padding, and color properties from the `.ttasset` JSON in CSS generation. I am updating `updateCustomStylesCSS` to ensure correct application of these styles. It's crucial to correctly handle `inherit` for properties like `fontSize`. The existing checks appear robust.

```
I'm now focused on the handling of style inheritance, including border, padding, and color properties from the `.ttasset` JSON in CSS generation. I am updating `updateCustomStylesCSS` to ensure correct application of these styles. It's crucial to correctly handle `inherit` for properties like `fontSize`. The existing checks appear robust.
```

**Refining CSS Generation**

I'm now refining the CSS generation, specifically for the custom styles. I'm focusing on incorporating the `updateCustomStylesCSS` function to handle new CSS properties, including `border`, `padding`, and `color` from the `.ttasset` JSON file. I'm taking care to correctly handle inheritance, particularly for properties such as `fontSize`, which relies on the `inherit` keyword.


**Optimizing CSS Application**

I'm now integrating new CSS properties, generated using the provided code snippet, to render the custom pages. I'm focusing on the `renderCustomPages` function to ensure these styles, including margins, borders, padding and radii, are correctly applied for block elements and inline elements. I am adding a new function, `updateCustomStylesCSS`, to dynamically generate the CSS based on new .ttasset JSON, updating `styleTag.textContent` accordingly.


**Integrating New CSS**

I'm now integrating new CSS properties. Specifically, I am focusing on implementing padding and color from the `.ttasset` JSON and incorporating the provided code snippet for the `updateCustomStylesCSS` function. This involves ensuring these properties are correctly reflected when rendering the custom pages, using dynamic CSS generation and ensuring correct application for block and inline elements. I am also working on adding the new function for `styleTag.textContent` to reflect the new dynamic CSS.


**Refining Marker Application**

I'm now refining style marker integration within the word object context. Specifically, I'm focusing on ensuring proper toggle behavior when start and end markers are identical (like `*` for bold). The code now correctly checks marker occurrence counts to determine style application, accurately handling both adding and removing styles for each word and using Sets to track active styles.


**Validating Style Logic**

I'm now diving deeper into the style application logic. My current focus is validating the correct toggle behavior of styles, especially when using identical start and end markers (like `*` for bold). The word-object context now correctly determines style application using marker counts and manages active styles with Sets, ensuring styles are added or removed accurately for each word.


**Addressing Drop Word Logic**

I'm now back to the drop word integration, and I'm updating line generation to accommodate the existing code snippet. Specifically, I'm modifying the `getLinesFromParagraph` method. The snippet demonstrates the need to handle `first-word-window`, a class needed for proper measurement. This includes inline styles. Now the existing HTML is being correctly included, with the `classStr` property.


**Integrating Line Breaking**

I'm now integrating the line-breaking algorithm with styled word objects. I'm focusing on ensuring it handles inline styles correctly during line measurement. The goal is to generate HTML lines directly from `wordObjects`, accurately accounting for styles in each span, while also maintaining the drop word functionality.


**Refining Window Measurement**

I'm now integrating window measurement and refinement. I've adapted to ensure measurement for the window logic. I'm focusing on accurately assessing multi-line conditions using the HTML-aware approach for the `first-word-window` class and applying it. Specifically, the adapted logic addresses scenarios where text wraps onto multiple lines. This is a crucial step towards the drop word implementation.


**Refining Drop Word Logic**

I'm now integrating the provided line splitting logic for drop-word implementation, with a focus on HTML handling. I've integrated checks for HTML tags and whitespace, ensuring the `first-word-window` class is applied to the first word correctly, even when styling is applied. This involves handling single-line and multi-line scenarios, which affects measurements. I am ensuring that the word is split into two spans, so that it will apply the drop-word style appropriately.


**Clarifying Custom Block Scope**

I'm now clarifying the scope for custom block styles, specifically how inline styles should interact with them. If `item.type` is 'p', I now set the `tokenType` as 'p'. I am passing 'p', instead of over-complicating. My focus is on correctly scoping inline styles within the context of these custom blocks.


**Clarifying Custom Style Scope**

I'm now clarifying the scope for custom block styles, specifically focusing on interactions with inline styles. I'm reviewing how item types affect token types during line processing. I've confirmed that 'custom_style' tokens, while technically of that type in the tokenization stage, are effectively treated as 'p' within `balanceColumns`. Consequently, I'm considering the best way to determine the correct inline scope for each custom block, looking closely at how `getLinesFromParagraph` handles differing token types.


**Integrating Custom Block Scope**

I'm now integrating custom block scope logic with line-breaking. I'm focusing on passing the correct `tokenType` to `getLinesFromParagraph` to manage custom block-level styling, ensuring correct handling of inline styles within these blocks. I'm leveraging `custom_style` for `tokenType` to apply the scope and maintain proper text formatting, refining HTML generation by incorporating relevant custom tags.


**Addressing Dropcap Overrides**

I'm now focusing on a critical drop-cap override scenario, and have updated the CSS. Specifically, the concern is that inline styles applied to the first word might override the drop-cap's desired size. I've considered that the `.first-word-window` class has to take precedence, so I am introducing `first-word-window` and `first-word-inline` CSS, which makes sure that the drop-cap will have the desired size.


**Finalizing CSS and App Integration**

I'm now integrating the `.first-word-window` CSS fix and updating Main App functions. I've updated `updateCustomStylesCSS`, `renderCustomPages`, `getLinesFromParagraph`, `createDropWord`, `typesetDocument`, and `balanceColumns` to properly handle the new code and  `tokenType` passing. I'm double-checking the `getLinesFromParagraph` logic to ensure multiple spaces are handled correctly, and that empty `classStr` instances use `word`.


**Validating Text Rendering**

I'm now deep-diving into the text rendering logic, focusing on the handling of spaces in `getLinesFromParagraph`. I'm verifying the re-parsing of `item.rawText` in `balanceColumns` is correct, and that `lastItem.rawText` accumulates the appropriate raw text and marker data. Everything seems consistent.


**Refining Block Style Application**

I'm now revising the block prefix logic to ensure only actual blocks are matched, and inline styles are excluded. I've updated conditional checks to reflect this, avoiding potential conflicts. I'm also reviewing `renderCustomPages` and `updateCustomStylesCSS` for accuracy in applying new properties such as color, border, and padding.


**Validating CSS Implementation**

I've been validating the CSS generation for custom styles. The `isNaN()` function works to handle `fontSize` correctly, returning inherit and em values as desired. I'm now verifying the CSS output, including font properties, color, borders, and padding, particularly how they're applied within the updated `updateCustomStylesCSS` function, making sure it functions correctly with the `!` operator.


**Analyzing Block Style Handling**

I'm now clarifying block style handling within inline contexts, given that `balanceColumns` already sets the `<p>` tag's class. I've updated the `updateCustomStylesCSS` function to handle new CSS properties and block properties on inline elements, and now need to review `getLinesFromParagraph` inline marker logic again. I need to handle `first-word-window` correctly, and also to ensure the `getLinesFromParagraph` function accurately handles the inline markers.


**Validating Toggle Cases**

I'm now completely satisfied with the marker application and toggle logic. After testing multiple scenarios, I've confirmed that the logic now reliably manages style toggling. The logic is robust, correctly handling nested markers and open tags.


**Validating Robustness & Scope**

I'm now completely satisfied that style toggling via markers is solid. I've re-reviewed the scope of `tokenType` and confirmed it's working as intended, and that it's correctly applied within `balanceColumns`.


**Refining Scope Handling**

I'm now clarifying scope handling, particularly how `tokenType` integrates with the paragraph element, and how `getLinesFromParagraph` can manage default types. It's clear `balanceColumns` uses `<p>` tags, and the drop word functionality should work for all blocks. I am working on how this fits into the existing code.

---

### 🤖 תגובה 12: העדכון הגדול למערכת הראשית מוכן! הטמעתי במנוע העימוד את כל הלוגיקה הנדרשת כדי…

העדכון הגדול למערכת הראשית מוכן! 

הטמעתי במנוע העימוד את כל הלוגיקה הנדרשת כדי לקרוא את קובצי ה-`.ttasset` החדשים מהסטודיו, כולל **מנוע חכם לזיהוי סגנונות Inline (טקסט מוסגר)** שפועל מילה-במילה מבלי לשבור את מדידת השורות, ותמיכה מלאה בהורשה (`inherit`), צבעים, מסגרות, וריווחים.

העתק את הקוד הבא ושמור אותו כקובץ ה-HTML הראשי שלך.

```html
<!DOCTYPE html>
<html lang="he" dir="rtl" style="--w-col: 40%; --w-margin: 7.5%; --w-gutter: 2%; --w-gap: 2%; --flow-mt: 20px; --flow-mb: 20px; --fn-header-r: 'Livorna', serif; --sz-header-r: 15pt; --fn-header-c: 'Livorna', serif; --sz-header-c: 11pt; --fn-header-l: 'Livorna', serif; --sz-header-l: 15pt; --fn-h0: 'AlphaBlack', serif; --sz-h0: 26pt; --fn-h0-body: 'Frank Ruhl Libre', serif; --sz-h0-body: 11.5pt; --fn-h1: 'Lia Sgula', serif; --sz-h1: 50pt; --fn-h2: 'AlphaBlack', serif; --sz-h2: 17pt; --fn-h3: 'Alpha', serif; --sz-h3: 13.5pt; --fn-h4: 'Alpha', serif; --sz-h4: 12.5pt; --fn-h5: 'AlphaLight', serif; --sz-h5: 11.5pt; --fn-h6: 'Noto Serif Hebrew', serif; --sz-h6: 10.5pt; --fn-h7: 'Hadassah Friedlaender', serif; --sz-h7: 6pt; --fn-sh-title: 'Lia Sgula', serif; --sz-sh-title: 46pt; --fn-sh-sub: 'Livorna', serif; --sz-sh-sub: 21pt; --fn-sh-desc: 'Livorna', serif; --sz-sh-desc: 12pt; --fn-sh-sec: 'David Libre', serif; --sz-sh-sec: 11.5pt; --fn-sh-author: 'David Libre', serif; --sz-sh-author: 15pt; --fn-sh-year: 'David Libre', serif; --sz-sh-year: 12pt; --fn-first-word: 'FrankReal', serif; --sz-first-word: 1.5em; --fn-body: 'Guttman Rashi', serif; --sz-body: 12pt;"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מערכת עימוד תורנית מקצועית לדפי A4</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bellefair&family=David+Libre:wght@400;700&family=Frank+Ruhl+Libre:wght@400;700;900&family=Noto+Serif+Hebrew:wght@400;700;900&family=Assistant:wght@400;600;700&display=swap');

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
    height: 44vh;
    min-height: 200px;
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
  
  .btn-import-assets {
    background-color: #b8860b;
    color: #fff;
    border: none;
    padding: 3px 8px;
    font-size: 8.5pt;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 5px;
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
  
  .panel-dynamic {
    background: #f0f8ff;
    border: 1px solid #b0c4de;
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
  
  .panel-dynamic .panel-header {
    background: #dbeafe;
    border-bottom: 1px solid #bfdbfe;
    color: #1e3a8a;
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
  
  .custom-asset-page {
    padding: 0;
  }

  .page-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    justify-content: space-between;
    z-index: 10;
  }

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
  }

  .toc-page {
    padding: 15mm 15mm 15mm 15mm;
  }
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
  .toc-entry-group {
    break-inside: avoid;
    margin-bottom: 3px;
  }
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

  .h2-spacer {
    flex-basis: 33.33%;
    flex-shrink: 0;
  }

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
  
  /* Prevent inline styles from overriding the drop-cap size/font */
  .first-word-window *, .first-word-inline * {
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
  }

  .page-number-footer {
    text-align: center;
    font-family: var(--fn-header-r);
    font-size: 12pt;
    font-weight: 700;
    height: 24px;
    flex-shrink: 0;
    z-index: 10;
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
    @page {
      size: A4;
      margin: 0;
    }

    body { 
      background: none; 
      padding: 0; 
      overflow: visible; 
      display: block; 
    }
    
    #sidebar, #resizer { 
      display: none !important; 
    }
    
    #preview-pane { 
      height: auto !important; 
      overflow: visible !important; 
      padding: 0 !important; 
      background: none !important; 
      display: block !important;
    }
    
    .a4-page {
      box-shadow: none;
      width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      max-height: 297mm !important;
      padding: 15mm !important;
      margin: 0 !important;
      page-break-after: always;
      break-after: page;
      position: relative;
    }
    
    .page-content-wrapper, .shaar-main-content {
      height: 100% !important; 
    }
  }
</style>
<!-- Embedded Custom Assets (JSON) -->
<script type="application/json" id="embedded-assets">{"pages":[],"styles":[]}</script>
<!-- Dynamic CSS for Custom Styles -->
<style id="custom-styles-css"></style>
</head>
<body>

  <div id="sidebar">
    <div class="sidebar-top-half">
      <div class="sidebar-header">
        <div class="sidebar-title">מערכת עימוד תורנית A4</div>
        <div>
          <input type="file" id="import-assets-file" style="display:none" accept=".ttasset,application/json" onchange="handleAssetImport(event)">
          <button class="btn-import-assets" onclick="document.getElementById('import-assets-file').click()">📥 ייבא נכסים</button>
          <button class="btn-load-fonts" onclick="loadSystemFonts()">📂 טען גופני Windows</button>
        </div>
      </div>
      <textarea id="raw-input" placeholder="הדבק כאן את הטקסט המלא..."></textarea>
    </div>

    <div class="sidebar-scrollable-content">
    
      <!-- Dynamic Assets Panel (Injected via JS) -->
      <div id="dynamic-assets-panel"></div>

      <div class="panel-static">
        <div class="panel-header">👑 הגדרות שער ראשי ושערי משנה</div>
        
        <div style="margin-bottom: 6px;">
          <label style="font-size: 8.5pt; font-weight: 700;"><input type="checkbox" id="show-main-shaar" checked="checked"> הצג שער ראשי בראש הספר</label>
        </div>
        <div class="inline-cfg-row" style="margin-bottom: 8px;">
          <label>סגנון שער ראשי:</label>
          <select id="main-shaar-style" style="flex:1;" onchange="document.getElementById('row-main-shaar-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'">
            <option value="1" selected="selected">1. דמסק ושיש מרכזי</option>
            <option value="2">2. תחרת סלסולים כפולה</option>
            <option value="3">3. קרנות וילנא וגיליושה</option>
            <option value="custom_img">4. תמונת רקע A4 מותאמת אישית</option>
          </select>
        </div>
        <div class="inline-cfg-row" id="row-main-shaar-img" style="display:none; margin-bottom: 8px;">
          <label>קובץ רקע שער:</label>
          <input type="file" id="file-main-shaar-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-main-shaar-img')">
          <input type="hidden" id="data-main-shaar-img" value="">
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
            <label>סגנון שערי משנה:</label>
            <select id="sub-shaar-style" style="flex:1;" onchange="document.getElementById('row-sub-shaar-img').style.display = this.value === 'custom_img' ? 'flex' : 'none'">
              <option value="1" selected="selected">1. דמסק שמאלי</option>
              <option value="2">2. תחרה שמאלית</option>
              <option value="3">3. קרנות וילנא שמאליות</option>
              <option value="custom_img">4. תמונת רקע A4 מותאמת אישית</option>
            </select>
          </div>
          <div class="inline-cfg-row" id="row-sub-shaar-img" style="display:none; margin-bottom: 6px;">
            <label>קובץ שער משנה:</label>
            <input type="file" id="file-sub-shaar-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sub-shaar-img')">
            <input type="hidden" id="data-sub-shaar-img" value="">
          </div>

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
            <input type="file" id="file-sec-div-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-sec-div-img')">
            <input type="hidden" id="data-sec-div-img" value="">
          </div>
        </div>
      </div>
      
      <!-- New Panel: Backgrounds for standard pages -->
      <div class="panel-static">
        <div class="panel-header">🖼️ רקעים לעמודי הספר</div>
        <div class="inline-cfg-row">
          <label>עמוד טקסט רגיל:</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-normal')">
          <input type="hidden" id="data-bg-normal" value="">
        </div>
        <div class="inline-cfg-row">
          <label>עמוד תוכן (ראשון):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-toc1')">
          <input type="hidden" id="data-bg-toc1" value="">
        </div>
        <div class="inline-cfg-row">
          <label>עמוד תוכן (רגיל):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-toc')">
          <input type="hidden" id="data-bg-toc" value="">
        </div>
        <div class="inline-cfg-row">
          <label>הקדמה (כותרת 0):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-h0')">
          <input type="hidden" id="data-bg-h0" value="">
        </div>
        <div class="inline-cfg-row">
          <label>תחילת פרק (כותרת 2):</label>
          <input type="file" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-bg-h2')">
          <input type="hidden" id="data-bg-h2" value="">
        </div>
      </div>

      <div class="panel-static">
        <div class="panel-header">📐 אופן עימוד וגופנים לכל כותרת (0-7)</div>
        
        <div class="inline-cfg-row">
          <label>כותרת 0 (הקדמה):</label>
          <select id="mode-h0"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option><option value="span_1col">טור 1 רציף</option></select>
          <select id="f-h0" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h0" class="size-input" value="26">
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
        </div>
        <div class="inline-cfg-row">
          <label>כותרת 2 (פרק):</label>
          <select id="mode-h2"><option value="new_page_1col" selected="selected">טור 1 עמוד הבא</option></select>
          <select id="f-h2" class="font-picker"><optgroup label="גופני מחשב (411 נמצאו)"><option value="'AlphaBlack', serif" selected="selected">AlphaBlack</option></optgroup></select>
          <input type="number" id="s-h2" class="size-input" value="17">
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
          <input type="file" id="file-hdr-c-img" accept="image/*" style="flex:1; font-size:8pt;" onchange="handleImageUpload(event, 'data-hdr-c-img')">
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
          <div class="prop-item"><label>שוליים (%):</label><input type="number" id="prop-margin" value="7.5" step="0.5" class="size-input"></div>
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
    // --- Asset Management ---
    let customAssets = { pages: [], styles: [] };

    function loadEmbeddedAssets() {
      const el = document.getElementById('embedded-assets');
      if (el && el.textContent) {
        try {
          const data = JSON.parse(el.textContent);
          if (data.customPages) customAssets.pages = data.customPages;
          if (data.customStyles) customAssets.styles = data.customStyles;
          buildDynamicUI();
        } catch(e) { console.error("Failed to load embedded assets", e); }
      }
    }

    function handleAssetImport(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (data.customPages) customAssets.pages = customAssets.pages.concat(data.customPages);
          if (data.customStyles) customAssets.styles = customAssets.styles.concat(data.customStyles);
          
          document.getElementById('embedded-assets').textContent = JSON.stringify({
            customPages: customAssets.pages,
            customStyles: customAssets.styles
          });
          
          buildDynamicUI();
          typesetDocument();
          alert("הנכסים יובאו בהצלחה!");
        } catch(err) {
          alert("שגיאה בטעינת הקובץ. ודא שזהו קובץ .ttasset תקין.");
        }
      };
      reader.readAsText(file);
    }

    function buildDynamicUI() {
      const container = document.getElementById('dynamic-assets-panel');
      container.innerHTML = '';
      if (customAssets.pages.length === 0 && customAssets.styles.length === 0) return;

      let html = '<div class="panel-static panel-dynamic"><div class="panel-header">🧩 נכסים מותאמים אישית (יובאו)</div>';
      
      if (customAssets.pages.length > 0) {
        customAssets.pages.forEach(page => {
          html += `<div style="font-weight:bold; font-size:9pt; margin-top:8px; border-bottom:1px solid #b0c4de; padding-bottom:2px; margin-bottom:4px;">📄 ${page.name}</div>`;
          page.elements.forEach(el => {
            html += `<div class="inline-cfg-row">
              <label title="${el.prefix}">${el.prefix}</label>
              <input type="text" id="cp_${page.id}_${el.id}" class="custom-page-input" placeholder="טקסט עבור ${el.prefix}">
            </div>`;
          });
        });
      }

      if (customAssets.styles.length > 0) {
        html += `<div style="font-weight:bold; font-size:9pt; margin-top:12px; border-bottom:1px solid #b0c4de; padding-bottom:2px; margin-bottom:4px;">🎨 סגנונות טקסט זמינים</div>`;
        customAssets.styles.forEach(s => {
          let typeLabel = s.type === 'inline' ? '(מוסגר)' : '(בלוק)';
          let prefixLabel = s.type === 'inline' ? `${s.startMarker} ... ${s.endMarker}` : s.prefix;
          html += `<div style="font-size:8.5pt; color:#333; margin-bottom:2px;">• ${s.name} ${typeLabel}: <code>${prefixLabel}</code></div>`;
        });
      }

      html += '</div>';
      container.innerHTML = html;
      updateCustomStylesCSS();
    }

    function updateCustomStylesCSS() {
      let styleTag = document.getElementById('custom-styles-css');
      let css = '';
      customAssets.styles.forEach(s => {
        let fs = s.css.fontSize;
        let fsRule = (fs === 'inherit' || isNaN(fs)) ? fs : fs + 'pt';
        
        css += `.custom-style-${s.id} {
          font-family: ${s.css.fontFamily} !important;
          font-size: ${fsRule} !important;
          font-weight: ${s.css.fontWeight} !important;
          color: ${s.css.color || 'inherit'} !important;
          text-align: ${s.css.textAlign} !important;
        `;
        
        if (s.css.borderWidth > 0) {
            css += `  border: ${s.css.borderWidth}px solid ${s.css.borderColor || '#000'} !important;
                      border-radius: ${s.css.borderRadius || 0}px !important;
            `;
        }
        if (s.css.padding > 0) {
            css += `  padding: ${s.css.padding}px !important; `;
        }
        
        if (s.type === 'block') {
            css += `  margin-top: ${s.css.marginTop || s.css.margin || 0}px !important;
                      margin-bottom: ${s.css.marginBottom || s.css.margin || 0}px !important;
            `;
        }
        css += `}\n`;
      });
      styleTag.textContent = css;
    }

    function renderCustomPages(container, position) {
      customAssets.pages.forEach(page => {
        if (page.insertPosition === position) {
          const pageDiv = document.createElement('div');
          pageDiv.className = 'a4-page custom-asset-page';
          
          if (page.bgImage) {
            pageDiv.innerHTML += `<img class="custom-bg-img" src="${page.bgImage}">`;
          }
          
          page.elements.forEach(el => {
            const input = document.getElementById(`cp_${page.id}_${el.id}`);
            const text = input ? input.value : '';
            if (text) {
              const elDiv = document.createElement('div');
              elDiv.style.position = 'absolute';
              elDiv.style.top = el.top + '%';
              elDiv.style.right = el.right + '%';
              elDiv.style.width = el.width + '%';
              elDiv.style.height = el.height + '%';
              elDiv.style.fontFamily = el.fontFamily;
              elDiv.style.fontSize = el.fontSize + 'pt';
              elDiv.style.display = 'flex';
              elDiv.style.alignItems = 'center';
              elDiv.style.justifyContent = el.textAlign === 'center' ? 'center' : (el.textAlign === 'left' ? 'flex-end' : 'flex-start');
              elDiv.style.zIndex = '10';
              elDiv.style.color = el.color || '#000000';
              if (el.borderWidth > 0) {
                elDiv.style.border = `${el.borderWidth}px solid ${el.borderColor || '#000'}`;
                elDiv.style.borderRadius = `${el.borderRadius || 0}px`;
              }
              elDiv.style.padding = `${el.padding || 0}px`;
              elDiv.style.boxSizing = 'border-box';
              elDiv.textContent = text;
              pageDiv.appendChild(elDiv);
            }
          });
          container.appendChild(pageDiv);
        }
      });
    }

    // --- Core Logic ---
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
      document.querySelectorAll('input[type="text"], input[type="number"], input[type="hidden"]').forEach(input => {
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
      root.style.setProperty('--w-col', document.getElementById('prop-col').value + '%');
      root.style.setProperty('--w-margin', document.getElementById('prop-margin').value + '%');
      root.style.setProperty('--w-gutter', document.getElementById('prop-gutter').value + '%');
      root.style.setProperty('--w-gap', document.getElementById('prop-gap').value + '%');
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

    function createDropWord(htmlText, isContinuation, isSingleLine) {
      if (isContinuation) return htmlText;
      htmlText = htmlText.trim();
      
      let inTag = false;
      let splitIndex = -1;
      for (let i = 0; i < htmlText.length; i++) {
          if (htmlText[i] === '<') inTag = true;
          else if (htmlText[i] === '>') inTag = false;
          else if (htmlText[i] === ' ' && !inTag) {
              splitIndex = i;
              break;
          }
      }
      
      if (splitIndex === -1) {
        return `<span class="${isSingleLine ? 'first-word-inline' : 'first-word-window'}">${htmlText}</span>`;
      }
      
      const firstWord = htmlText.substring(0, splitIndex);
      const rest = htmlText.substring(splitIndex + 1);
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

    function renderMainShaar(container, style) {
      const page = document.createElement('div');
      page.className = `a4-page main-shaar-page main-template-${style}`;

      const title = document.getElementById('inp-book-title').value || "שם הספר";
      const subtitle = document.getElementById('inp-book-subtitle').value || "";
      const desc = document.getElementById('inp-book-desc').value || "";
      const sections = document.getElementById('inp-book-sections').value || "";
      const author = document.getElementById('inp-book-author').value || "";
      const year = document.getElementById('inp-book-year').value || "";

      let frameHTML = '';
      if (style === 'custom_img') {
        const imgSrc = document.getElementById('data-main-shaar-img').value;
        if (imgSrc) {
          frameHTML = `<img class="custom-bg-img" src="${imgSrc}" alt="שער ראשי">`;
        }
      } else if (style === '1') {
        frameHTML = `
          <div class="m1-bg-top"></div><div class="m1-bg-middle"></div><div class="m1-bg-bottom"></div>
          <div class="m1-panel"><div class="m1-damask right"></div><div style="flex-grow:1;"></div><div class="m1-damask left"></div></div>
        `;
      } else if (style === '2') {
        frameHTML = `
          <div class="m2-bg-top"></div><div class="m2-bg-middle"></div><div class="m2-bg-bottom"></div>
          <div class="m2-panel"><div class="m2-lace right"></div><div style="flex-grow:1;"></div><div class="m2-lace left"></div></div>
        `;
      } else if (style === '3') {
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
        <div class="shaar-main-content">
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

    function renderSubShaar(container, token, style) {
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

      if (style === 'custom_img') {
        const imgSrc = document.getElementById('data-sub-shaar-img').value;
        page.innerHTML = `
          ${imgSrc ? `<img class="custom-bg-img" src="${imgSrc}" alt="שער משנה">` : ''}
          <div class="sub-shaar-content-centered" style="position: relative; z-index: 20; width: 100%; height: 100%;">
            <div class="sefer-label">חלק</div>
            <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
            ${titleSub ? `
              <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
                <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
              </svg>
              <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
          </div>
        `;
      } else {
        let innerLace = '';
        if (style === '2') {
          innerLace = '<div class="m2-lace" style="border-left: 1px solid #ddd;"></div>';
        }

        page.innerHTML = `
          <div class="sub-shaar-bg-right"></div>
          <div class="sub-shaar-col">
            <div class="sub-shaar-content-centered" style="flex-grow: 1;">
              <div class="sefer-label">חלק</div>
              <div class="book-title-main" style="font-size: 36pt;">${titleMain}</div>
              ${titleSub ? `
                <svg style="width: 140px; height: 25px; margin: 15px auto;" viewBox="0 0 300 30">
                  <path d="M10,15 Q75,5 140,15 Q145,10 150,5 Q155,10 160,15 Q225,5 290,15 Q225,25 160,15 Q155,20 150,25 Q145,20 140,15 Q75,25 10,15 Z" fill="#222"/>
                </svg>
                <div class="book-subtitle" style="font-size: 21pt;">${titleSub}</div>` : ''}
            </div>
            ${innerLace}
          </div>
        `;
      }
      container.appendChild(page);
    }

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, bgType = 'normal') {
      const page = document.createElement('div');
      page.className = 'a4-page';

      let bgSrc = '';
      if (bgType === 'normal') bgSrc = document.getElementById('data-bg-normal')?.value;
      else if (bgType === 'h0') bgSrc = document.getElementById('data-bg-h0')?.value;
      else if (bgType === 'h2') bgSrc = document.getElementById('data-bg-h2')?.value;
      
      let bgHtml = bgSrc ? `<img class="custom-bg-img" src="${bgSrc}">` : '';

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
        ${bgHtml}
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
        
        // Check Custom Pages Prefixes
        if (!match && customAssets.pages) {
          for (let page of customAssets.pages) {
            for (let el of page.elements) {
              if (el.prefix && trimmed.startsWith(el.prefix)) {
                const val = trimmed.substring(el.prefix.length).trim();
                const input = document.getElementById(`cp_${page.id}_${el.id}`);
                if (input) input.value = val;
                match = true;
                break;
              }
            }
            if (match) break;
          }
        }

        if (!match) {
          cleanLines.push(line);
        }
      }
      return cleanLines.join('\n');
    }

    function getLinesFromParagraph(text, colWidth, styleObj, useWindowIfMultipleLines, tokenType = 'p') {
      const measureContainer = document.getElementById('measuring-box');
      measureContainer.style.width = colWidth + 'px';
      measureContainer.style.fontFamily = styleObj.fontFamily;
      measureContainer.style.fontSize = styleObj.fontSize;
      measureContainer.style.lineHeight = styleObj.lineHeight;
      measureContainer.style.textAlign = 'justify';
      measureContainer.style.textJustify = 'inter-word';
      measureContainer.style.direction = 'rtl';
      if (styleObj.fontWeight) measureContainer.style.fontWeight = styleObj.fontWeight;
      else measureContainer.style.fontWeight = 'normal';

      measureContainer.innerHTML = '';
      
      const pMeasure = document.createElement('p');
      pMeasure.style.margin = '0';
      pMeasure.style.padding = '0';
      
      let words = text.trim().split(/\s+/);
      if (words.length === 0) return { lines: [], hasWindow: false };

      // --- Inline Styles Parser ---
      let applicableStyles = customAssets.styles.filter(s => s.type === 'inline' && s.scopes && s.scopes.includes(tokenType));
      let activeStyles = new Set();
      let wordObjects = [];
      
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      
      for (let i = 0; i < words.length; i++) {
          let word = words[i];
          let classesToAdd = new Set(activeStyles);
          
          applicableStyles.forEach(s => {
              let startMarker = s.startMarker || '';
              let endMarker = s.endMarker || '';
              if (!startMarker || !endMarker) return;
              
              if (startMarker === endMarker) {
                  let count = (word.match(new RegExp(escapeRegExp(startMarker), 'g')) || []).length;
                  if (count % 2 !== 0) {
                      if (activeStyles.has(s.id)) {
                          classesToAdd.add(s.id);
                          activeStyles.delete(s.id);
                      } else {
                          classesToAdd.add(s.id);
                          activeStyles.add(s.id);
                      }
                  } else if (count > 0) {
                      classesToAdd.add(s.id);
                  }
              } else {
                  if (word.includes(startMarker)) {
                      classesToAdd.add(s.id);
                      activeStyles.add(s.id);
                  }
                  if (word.includes(endMarker)) {
                      classesToAdd.add(s.id);
                      activeStyles.delete(s.id);
                  }
              }
          });
          
          let classStr = Array.from(classesToAdd).map(id => 'custom-style-' + id).join(' ');
          wordObjects.push({
              word: word,
              classStr: classStr
          });
      }
      
      let html = '';
      if (useWindowIfMultipleLines) {
          let firstWordHtml = wordObjects[0].classStr ? `<span class="${wordObjects[0].classStr}">${wordObjects[0].word}</span>` : wordObjects[0].word;
          html += `<span class="first-word-window" id="mw-0">${firstWordHtml}</span> `;
          for (let i = 1; i < wordObjects.length; i++) {
              let wHtml = wordObjects[i].classStr ? `<span class="${wordObjects[i].classStr}">${wordObjects[i].word}</span>` : wordObjects[i].word;
              html += `<span id="mw-${i}">${wHtml}</span> `;
          }
      } else {
          for (let i = 0; i < wordObjects.length; i++) {
              let wHtml = wordObjects[i].classStr ? `<span class="${wordObjects[i].classStr}">${wordObjects[i].word}</span>` : wordObjects[i].word;
              html += `<span id="mw-${i}">${wHtml}</span> `;
          }
      }
      
      pMeasure.innerHTML = html;
      measureContainer.appendChild(pMeasure);
      
      const lines = [];
      let currentLine = [];
      let currentTop = -1;
      
      for (let i = 0; i < wordObjects.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        
        let wHtml = wordObjects[i].classStr ? `<span class="${wordObjects[i].classStr}">${wordObjects[i].word}</span>` : wordObjects[i].word;
        
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
          lines.push(currentLine.join(' '));
          currentLine = [wHtml];
          currentTop = top;
        } else {
          currentLine.push(wHtml);
        }
      }
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
      }
      
      // Re-measure for window logic
      pMeasure.innerHTML = html;
      const singleLineHeight = pMeasure.offsetHeight;
      pMeasure.textContent = "א";
      const oneLineH = pMeasure.offsetHeight;
      const hasMultipleLines = (singleLineHeight / oneLineH) > 1.5;
      const shouldApplyWindow = useWindowIfMultipleLines && hasMultipleLines;
      
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
           let linesInfo = getLinesFromParagraph(p.getAttribute('data-raw-text') || p.textContent, col.offsetWidth, styleObj, false, 'p');
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
          let customClass = child.className.match(/custom-style-[^\s]+/)?.[0];
          
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
          } else {
             mergedItems.push({
               type: 'p',
               id: id,
               rawText: text,
               isCont: isCont,
               sideNote: sideNote,
               customClass: customClass
             });
          }
        } else {
          mergedItems.push({
            type: 'h',
            id: child.getAttribute('data-token-id'),
            html: child.outerHTML,
            level: child.className.match(/title-level-(\d+)/)?.[1]
          });
        }
      }

      const items = mergedItems.map(item => {
        if (item.type === 'p') {
          let curStyleObj = styleObj;
          let tokenType = 'p';
          if (item.customClass) {
            const styleId = item.customClass.replace('custom-style-', '');
            const sDef = customAssets.styles.find(s => s.id === styleId);
            if (sDef) {
                let fs = sDef.css.fontSize;
                let fsRule = (fs === 'inherit' || isNaN(fs)) ? fs : fs + 'pt';
                curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: fsRule, lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
            }
          }
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, curStyleObj, !item.isCont && !item.customClass, tokenType);
          return {
            ...item,
            lines: linesInfo.lines,
            isSingleLine: linesInfo.lines.length <= 1,
            hasWindow: linesInfo.hasWindow
          };
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
        if (sp.itemIndex > 0) {
          const prevItem = items[sp.itemIndex - 1];
          if (prevItem.type === 'h') {
            return false;
          }
        }
        return true;
      });

      let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
      if (pointsToEvaluate.length === 0) return;

      function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
          col.insertAdjacentHTML('beforeend', item.html);
        } else {
          const p = document.createElement('p');
          p.className = (item.customClass ? item.customClass + ' ' : '') + 'p-end';
          p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine);
          col.appendChild(p);
        }
      }

      let bestSplit = pointsToEvaluate[0];
      let minAbsDiff = Infinity;
      let bestDiff = Infinity;

      for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) {
          renderSingleItemFast(rCol, items[i]);
        }
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pRight = document.createElement('p');
          pRight.className = (item.customClass ? item.customClass + ' ' : '') + 'p-cut';
          let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
          pRight.innerHTML = createDropWord(rightText, item.isCont, false);
          rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
          let item = items[sp.itemIndex];
          let pLeft = document.createElement('p');
          pLeft.className = (item.customClass ? item.customClass + ' ' : '') + 'p-end';
          let leftText = sp.lines.slice(sp.lineIndex).join(' ');
          pLeft.innerHTML = createDropWord(leftText, true, false);
          lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) {
          renderSingleItemFast(lCol, items[i]);
        }
        let lHeight = lCol.scrollHeight;

        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);
        
        if (absDiff < minAbsDiff) {
            minAbsDiff = absDiff;
            bestSplit = sp;
            bestDiff = diff;
        } else if (absDiff === minAbsDiff && diff >= 0) {
            bestSplit = sp;
            bestDiff = diff;
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
          p.className = (item.customClass ? item.customClass + ' ' : '') + (isPartial && isRight ? 'p-cut' : 'p-end');
          p.setAttribute('data-token-id', item.id);
          
          let textToRender = isPartial ? partialText : item.rawText;
          p.setAttribute('data-raw-text', textToRender);
          p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
          if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let curStyleObj = styleObj;
              if (item.customClass) {
                const styleId = item.customClass.replace('custom-style-', '');
                const sDef = customAssets.styles.find(s => s.id === styleId);
                if (sDef) {
                    let fs = sDef.css.fontSize;
                    let fsRule = (fs === 'inherit' || isNaN(fs)) ? fs : fs + 'pt';
                    curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: fsRule, lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
                }
              }
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, curStyleObj, !isCont && !item.customClass, 'p');
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          col.appendChild(p);

          if (item.sideNote && !isCont) {
            const noteElem = document.createElement('div');
            noteElem.className = 'side-note-anchor';
            noteElem.textContent = item.sideNote;
            margin.appendChild(noteElem);
            finalNotes.push({ elem: noteElem, pElem: p });
          }
        }
      }

      for (let i = 0; i < bestSplit.itemIndex; i++) {
        appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
      }
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

      finalNotes.forEach(item => {
        item.elem.style.top = item.pElem.offsetTop + 'px';
      });
    }

    function typesetDocument() {
      updateGrid();
      updateStyles();

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

      const lines = rawText.split('\n');
      const tokens = [];
      let pendingSideNote = null;
      lineToTokenMap = [];

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
          lineToTokenMap[lineIdx] = null;
          continue;
        }

        // Check for Custom Block Styles
        let matchedCustomStyle = false;
        if (customAssets.styles) {
          for (let s of customAssets.styles) {
            if (s.type === 'block' && s.prefix && line.startsWith(s.prefix)) {
              const txt = line.substring(s.prefix.length).trim();
              const tokenObj = { id: tokens.length, type: 'custom_style', styleId: s.id, text: txt, lineIdx: lineIdx, layoutMode: s.layoutMode };
              tokens.push(tokenObj);
              lineToTokenMap[lineIdx] = tokenObj.id;
              matchedCustomStyle = true;
              break;
            }
          }
        }
        if (matchedCustomStyle) continue;

        const hMatch = line.match(/^כותרת\s*(\d+)\s*(?:מספר\s*\d+)?\s*[-–—]\s*(.*)$/);
        if (hMatch) {
          const lvl = parseInt(hMatch[1], 10);
          const txt = hMatch[2].trim();
          if (lvl === 7) {
            pendingSideNote = txt;
            lineToTokenMap[lineIdx] = null;
          } else {
            const tokenObj = { id: tokens.length, type: 'h' + lvl, level: lvl, text: txt, lineIdx: lineIdx };
            tokens.push(tokenObj);
            lineToTokenMap[lineIdx] = tokenObj.id;
          }
        } else {
          const tokenObj = { id: tokens.length, type: 'p', text: line, sideNote: pendingSideNote, lineIdx: lineIdx };
          tokens.push(tokenObj);
          lineToTokenMap[lineIdx] = tokenObj.id;
          pendingSideNote = null;
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

      const sections = [];
      let currentSection = { type: 'body', tokens: [] };

      tokens.forEach(t => {
        const mode = t.type === 'custom_style' ? t.layoutMode : (t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col');
        
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

      const headingPageMap = {};
      let pageIndex = 1;
      let currentH1Title = '';
      let currentH2Title = '';
      let currentH3Title = '';

      const bookTitle = document.getElementById('inp-book-title').value || "ספר";
      const showMainShaar = document.getElementById('show-main-shaar').checked;
      const mainShaarStyle = document.getElementById('main-shaar-style').value;
      const subShaarStyle = document.getElementById('sub-shaar-style').value;
      const secDivStyle = document.getElementById('section-divider-style').value;
      const enableGeneralTOC = document.getElementById('enable-general-toc').checked;
      const enableDetailedTOC = document.getElementById('enable-detailed-toc').checked;

      const customR = document.getElementById('hdr-r-custom') ? document.getElementById('hdr-r-custom').value : '';
      const customC = document.getElementById('hdr-c-custom') ? document.getElementById('hdr-c-custom').value : '';
      const customL = document.getElementById('hdr-l-custom') ? document.getElementById('hdr-l-custom').value : '';

      // Render Custom Pages (Before Shaar)
      renderCustomPages(container, 'before_shaar');

      if (showMainShaar) {
        renderMainShaar(container, mainShaarStyle);
      }
      
      // Render Custom Pages (After Shaar)
      renderCustomPages(container, 'after_shaar');

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

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        if (sec.type === 'sub_shaar') {
          renderSubShaar(container, sec.token, subShaarStyle);
          currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
          headingPageMap[sec.token.id] = toGematria(pageIndex);

          if (enableDetailedTOC) {
            let inThisH1 = false;
            const thisH1Tokens = [];

            for (let t of tokens) {
              if (t.id === sec.token.id) { inThisH1 = true; continue; }
              const tMode = t.type === 'custom_style' ? t.layoutMode : (t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col');
              if (inThisH1 && t.type.startsWith('h') && tMode === 'sub_shaar') break;
              if (inThisH1) thisH1Tokens.push(t);
            }

            const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
            const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
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
          continue;
        }

        let isFirstPage = true;
        let h2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.type === 'h0';
        
        let bgType = 'normal';
        if (isH0) bgType = 'h0';
        else if (sec.isNewPage && (sec.hToken.type === 'h2' || sec.hToken.type === 'custom_style')) bgType = 'h2';

        if (h2Text) {
          currentH2Title = h2Text;
          headingPageMap[h2Id] = toGematria(pageIndex);
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
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
            isFirstPage ? bgType : 'normal'
          );
          pageIndex++;
		  
		  let remPageHeight = pageLayout.bodyFlow.clientHeight;
          if (isFirstPage && h2Text) {
             const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
             const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
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

              if (currentTok.type.startsWith('h') && currentTok.type !== 'custom_style') {
                if (currentTok.level === 3) currentH3Title = currentTok.text;
                const hElem = document.createElement('div');
                hElem.className = `title-level-${currentTok.level}`;
                hElem.textContent = currentTok.text;
                hElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(hElem);
                
                if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                  targetCol.removeChild(hElem);
                  break;
                }
                
                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                tokenIndex++;
                continue;
              }

              if (currentTok.type === 'p' || currentTok.type === 'custom_style') {
                let curStyleObj = styleObj;
                let pClassExtra = '';
                let tokenType = currentTok.type === 'custom_style' ? 'p' : currentTok.type;
                
                if (currentTok.type === 'custom_style') {
                    let sDef = customAssets.styles.find(s => s.id === currentTok.styleId);
                    if (sDef) {
                        let fs = sDef.css.fontSize;
                        let fsRule = (fs === 'inherit' || isNaN(fs)) ? fs : fs + 'pt';
                        curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: fsRule, lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
                        pClassExtra = `custom-style-${sDef.id} `;
                    }
                }
                
                let linesInfo = getLinesFromParagraph(currentTok.text, 580, curStyleObj, currentTok.type === 'p' ? true : false, tokenType);
                let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                let isContinuation = !!pendingWordTokens;
                let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                const pElem = document.createElement('p');
                pElem.setAttribute('data-token-id', currentTok.id);
                targetCol.appendChild(pElem);

                let bestFitLine = 0;
                for (let i = 1; i <= lines.length; i++) {
                  let testText = lines.slice(0, i).join(' ');
                  pElem.className = pClassExtra + ((i === lines.length) ? 'p-end' : 'p-cut');
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

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = pClassExtra + (isEndOfP ? 'p-end' : 'p-cut');
                pElem.setAttribute('data-raw-text', chunk);
                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);

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
            const peekMode = peekTok && peekTok.type === 'custom_style' ? peekTok.layoutMode : (peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col');

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              if (remPageHeight < 100) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              
              let extraClass = 'h3-title-text';
              if (peekTok.type === 'custom_style') {
                  extraClass = `custom-style-${peekTok.styleId}`;
              }
              
              spanBlock.innerHTML = `<div class="${extraClass}" data-token-id="${peekTok.id}" id="heading-tok-${peekTok.id}">${peekTok.text}</div>`;
              pageLayout.bodyFlow.appendChild(spanBlock);
              
              headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
              remPageHeight -= spanBlock.getBoundingClientRect().height + 4;
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
                const curMode = currentTok.type === 'custom_style' ? currentTok.layoutMode : (currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col');

                if (curMode === 'span_1col' && !pendingWordTokens) {
                  break;
                }

                if (targetCol.scrollHeight >= remPageHeight - 10 && targetCol.children.length > 0) {
                  break;
                }

                if (currentTok.type.startsWith('h') && currentTok.type !== 'custom_style') {
                  if (currentTok.level === 3) currentH3Title = currentTok.text;
                  const hElem = document.createElement('div');
                  hElem.className = `title-level-${currentTok.level}`;
                  hElem.textContent = currentTok.text;
                  hElem.setAttribute('data-token-id', currentTok.id);
				  hElem.id = `heading-tok-${currentTok.id}`;
                  targetCol.appendChild(hElem);

                  if (!headingPageMap[currentTok.id]) {
                    headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                  }

                  if (targetCol.scrollHeight > remPageHeight && targetCol.children.length > 1) {
                    targetCol.removeChild(hElem);
                    break;
                  }

                  tokenIndex++;
                  continue;
                }

                if (currentTok.type === 'p' || currentTok.type === 'custom_style') {
                  let curStyleObj = styleObj;
                  let pClassExtra = '';
                  let tokenType = currentTok.type === 'custom_style' ? 'p' : currentTok.type;
                  
                  if (currentTok.type === 'custom_style') {
                      let sDef = customAssets.styles.find(s => s.id === currentTok.styleId);
                      if (sDef) {
                          let fs = sDef.css.fontSize;
                          let fsRule = (fs === 'inherit' || isNaN(fs)) ? fs : fs + 'pt';
                          curStyleObj = { fontFamily: sDef.css.fontFamily, fontSize: fsRule, lineHeight: '1.34', fontWeight: sDef.css.fontWeight };
                          pClassExtra = `custom-style-${sDef.id} `;
                      }
                  }
                  
                  let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, curStyleObj, currentTok.type === 'p' ? true : false, tokenType);
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
                    pElem.className = pClassExtra + ((i === lines.length) ? 'p-end' : 'p-cut');
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

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = pClassExtra + (isEndOfP ? 'p-end' : 'p-cut');
                  pElem.setAttribute('data-raw-text', chunk);
                  pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow);

                  if (!isContinuation && currentTok.sideNote) {
                    pElem.setAttribute('data-side-note', currentTok.sideNote);
                    const noteElem = document.createElement('div');
                    noteElem.className = 'side-note-anchor';
                    noteElem.textContent = currentTok.sideNote;
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
              const nextPeekMode = nextPeekTok && nextPeekTok.type === 'custom_style' ? nextPeekTok.layoutMode : (nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col');
              
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
            
            pagePendingNotes.forEach(item => {
              if (item.elem && item.pElem) {
                item.elem.style.top = item.pElem.offsetTop + 'px';
              }
            });
          }
        }
      }
      
      // Render Custom Pages (End of book)
      renderCustomPages(container, 'end_of_book');

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
        const lvl = t.type.startsWith('h') && t.type !== 'custom_style' ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') && t.type !== 'custom_style' ? t.text : t.sideNote;
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
        
        let bgSrc = isFirstTOCPage ? document.getElementById('data-bg-toc1')?.value : document.getElementById('data-bg-toc')?.value;
        let bgHtml = bgSrc ? `<img class="custom-bg-img" src="${bgSrc}">` : '';
        
        page.innerHTML = `
          ${bgHtml}
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

    window.onload = function() {
      loadEmbeddedAssets();
      
      if (document.getElementById('main-shaar-style').value === 'custom_img') {
        document.getElementById('row-main-shaar-img').style.display = 'flex';
      }
      if (document.getElementById('sub-shaar-style').value === 'custom_img') {
        document.getElementById('row-sub-shaar-img').style.display = 'flex';
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
גוף הטקסט בעימוד שני טורים מסודרים ומפולסים כהלכתם. כאן יבוא הביאור השלם בבירור גבולות הזמן של תפילת השחר עד חצות היום או עד ארבע שעות של היום.
דין זה של קביעת זמן ארבע שעות נלמד בעיקרו מדברי חז"ל והוא הבסיס לכל דיני תפילה של שחרית.

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

### איך לבדוק את סגנונות ה-Inline המוסגרים?
1. פתח את הסטודיו (הקובץ הקודם).
2. הוסף "סגנון טקסט חדש".
3. בחר בסוג: **"טקסט חלקי / מוסגר (Inline)"**.
4. תן סמן התחלה `(` וסמן סיום `)`.
5. סמן ב-V את "גוף הטקסט (p)".
6. בהגדרות העיצוב, בגודל הטקסט כתוב `0.8em` (כדי להקטין) או בחר צבע שונה.
7. לחץ "ייצא נכסים".
8. פתח את המערכת הראשית (הקובץ החדש ששלחתי עכשיו), לחץ על "ייבא נכסים" ובחר את הקובץ.
9. בתיבת הטקסט, הוסף פסקה עם סוגריים, למשל: `כאן מתחיל הטקסט (וכאן יש הערה מוסגרת שתוקטן אוטומטית) וכאן הטקסט ממשיך כרגיל.`
10. תראה שהטקסט שבתוך הסוגריים (כולל הסוגריים עצמם) מקבל את העיצוב המדויק שהגדרת, והכל נחתך ומתאזן בצורה מושלמת בין הטורים!

---

## 📊 סיכום שיחה

- **סה"כ הודעות:** 19
- **פניות משתמש:** 7
- **תגובות AI:** 12
- **מודל:** `models/gemini-3.1-pro-preview`
- **תאריך:** 2026-08-27
