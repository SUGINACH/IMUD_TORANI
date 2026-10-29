---
title: "הוספת תמיכה בתמונות למערכת העימוד"
date: 2026-08-26
version: V21
type: transcripts
source: Gemini (Google AI Studio)
---


# הוספת תמיכה בתמונות למערכת העימוד

> שיחת Google AI Studio (Gemini) — מודל: `models/gemini-3.7-flash`

---

## פנייה 1: [קובץ מצורף מ-Google Drive — מזהה: 1nF-4Uotl3Djayf9Njdfb7XRKLLurRuk]

[קובץ מצורף מ-Google Drive — מזהה: 1nF-4Uotl3Djayf9Njdfb7X_RKLLurRuk]

---

## פנייה 2: לפניך קובץ מערכת עימוד תורני. תוכל להוסיף אפשרות לייבא תמונה ברשימת הדרופדאון…

לפניך קובץ מערכת עימוד תורני.
תוכל להוסיף אפשרות לייבא תמונה ברשימת הדרופדאון של שער ראשי (כרקע, נמתח לA4), שער משנה(כרקע, נמתח לA4), עיטור סיום פרק ועיטור מרכזי בכותרת העליונה.
היזהר מאוד לא לשנות שום דבר אחר!!!

---

### 🤖 תגובה 1: Defining the Enhancement I'm currently focused on precisely defining the…

**Defining the Enhancement**

I'm currently focused on precisely defining the requested enhancement to the Torani typesetting application. The core requirement is to add a specific new capability. I'm carefully analyzing the context to ensure a comprehensive understanding of the user's intent and how it will integrate with the current application.


**Analyzing the Locations**

I've made progress in breaking down the specifics. Now, I'm analyzing the four distinct locations for custom image integration within the application. I'm noting the existing styles and identifying how to cleanly introduce the new "custom_img" option without disrupting the application. I'm focusing on location 1 and defining the required logic.


**Implementing the Feature**

I'm now implementing the first feature - custom A4 background images. I've designed the UI; a file input trigger will appear when the new option, "תמונה מותאמת אישית", is selected. The application will store images as Base64 data URLs. For rendering, I plan to cover the A4 page with the image, using specific CSS properties to ensure the text elements are displayed on top. I'm moving on to Location 2, looking at sub-shaar style options.


**Defining New Implementations**

I'm now focusing on implementing the custom image functionality for Locations 3 and 4, which represent the section divider and the header, respectively. For the section divider, I'm defining a new option: `custom_img`, which will use the `<img src>` tag in a `<div>` element, with CSS to control the image size and centering. For the header, I'll need to define how to handle this implementation, too.


**Refining the Header Implementation**

I'm now zeroing in on the header image implementation, specifically `#hdr-c-type`, but I'll make it seamless for `#hdr-r-type` and `#hdr-l-type`. The existing options are clear, and I've added `custom_img` / `תמונה (העלאת קובץ)`. I'm working to render the header image using an `img` tag with styling to control size and fit. I'll need to use the `renderHeaderSectionHTML` function. I'm focusing on the UX of the file upload as well.


**Integrating the Solution**

I've been thinking about the file upload process and how to make the best user experience. I'm focusing on the implementation. A file input button will trigger reading an image as a base64 string, so the new image data becomes a data URL. We'll store the base64 string, using hidden inputs or dataset attributes. I'm excited about `saveAsDefaultTemplate()` saving the embedded images! That's a great feature.


**Refining the Input Fields**

I'm now focusing on refining the HTML structure for custom image integration in the sub-shaar style. I've got the logic set up to toggle the visibility of the image upload field when the "custom_img" option is chosen in the dropdown. The structure mirrors the main shaar implementation, using similar `select` and `input` elements to handle the file upload. I am checking the `handleImageUpload` function to store the data URL properly.


**Defining the Sub-Shaar**

I'm working on the sub-shaar style now, specifically the HTML implementation for the image upload. I'm focusing on the sub-shaar image option, and have added the custom image option. I've got the image upload logic implemented, which is triggered when the "תמונת רקע A4 מותאמת אישית" option is selected. I am confident I'll get this completed soon.



**Defining the Ornament Implementation**

I'm now implementing the ornament image functionality, specifically for the header center. I've integrated the HTML, adding a file input for custom images triggered by the new `custom_img` option in the select field. The goal is to allow users to upload and preview images for the header ornaments. The image will be stored as base64 and rendered.



**Refining the Shaar Implementation**

I'm currently focused on the CSS and HTML implementations for custom background images on Shaar pages. I've defined the `.custom-bg-img` CSS class, which uses `position: absolute` and `object-fit: fill` to cover the entire page. Now, I'm working to make sure this is functional in the `.sub-shaar-page` implementation. I'm focusing on ensuring it renders correctly over the other elements.


**Finalizing the Shaar Implementation**

I'm wrapping up the implementation of custom background images for both the main and sub-shaar pages. I've integrated the HTML, CSS, and JavaScript, including the `handleImageUpload` function for file handling. I am now working on ensuring proper rendering. I've updated both the `renderMainShaar` and `renderSubShaar` functions to handle image data URLs, and the CSS correctly applies the image as a background. I'm checking the final result now.


**Refining the Rendering**

I'm now focusing on refining the rendering of sub-shaar page images and ensuring the visual alignment. I'm taking the sub-shaar HTML structure and integrating it with the image logic, ensuring the sub-shaar layout renders correctly. I'm focusing on the `renderHeaderSectionHTML` function as it relates to the current header rendering. I'm thinking about image and text placement.


**Optimizing the Implementation**

I'm now implementing the ornament feature across multiple sections. I've updated `getSectionDividerHTML` with a conditional image insertion using a data URL, adding the `max-width` and `max-height` CSS properties. I've also implemented image persistence for saved templates by ensuring the hidden input values are correctly saved, and the values are properly populated in the document, ensuring images are included in saved templates. I'm checking it now.


**Reviewing the Implementation**

I'm now deep in a code review, ensuring that every edge case is addressed. My focus is on the fonts, margins, and gutters, and especially the dynamic column height calculation. I'm verifying the scroll sync and resize logic, and print styles. No existing functionality must be disrupted. I'm carefully double-checking the HTML and CSS for errors, duplicate IDs, and ensuring no broken tags. I am extremely careful and heed the warning.

---

### 🤖 תגובה 2: הנה הקובץ המלא והמעודכן. ### מה התווסף בקובץ: 1. שער ראשי: נוספה אפשרות…

הנה הקובץ המלא והמעודכן. 

### מה התווסף בקובץ:
1. **שער ראשי:** נוספה אפשרות בדרופדאון לבחירת **"תמונת רקע A4 מותאמת אישית"** עם כפתור העלאת קובץ תמונה (הנמתחת במדויק על כל שטח דף ה-A4 כרקע תחת הטקסט).
2. **שער משנה:** נוספה אפשרות בדרופדאון לבחירת **"תמונת רקע A4 מותאמת אישית"** עם כפתור העלאת קובץ תמונה (נמתחת על כל דף ה-A4).
3. **עיטור סיום פרק:** נוספה אפשרות בדרופדאון לבחירת **"תמונת עיטור אישית"** עם העלאת קובץ תמונה שמוצגת וממורכזת בין הטורים בסיום כל פרק.
4. **עיטור מרכזי בכותרת העליונה (Gutter):** נוספה אפשרות בדרופדאון לבחירת **"תמונת עיטור (קובץ)"** הממקמת את התמונה שהועלתה במרכז הכותרת העליונה.
5. **שמירת תבנית (Base64):** התמונות שמועלות מומרות אוטומטית למחרוזת Base64, כך שבלחיצה על **"שמור תבנית"** התמונות נשמרות ומוטמעות ישירות בתוך קובץ ה-HTML לשימוש חוזר.

כל שאר חלקי הקוד, החישובים הטיפוגרפיים, תוכן העניינים, הפילוס והגופנים נשמרו בדיוק כפי שהיו ללא כל שינוי.

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

  .main-shaar-page {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
  }

  .shaar-main-content {
    width: 100%;
    height: 100%;
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

  .bsd-header { font-family: 'David Libre', serif; font-size: 11pt; font-weight: 700; color: #444; }
  .sefer-label { font-family: 'David Libre', serif; font-size: 15pt; letter-spacing: 5px; font-weight: 700; margin-top: 4px; }
  
  .book-title-main { font-family: var(--fn-sh-title); font-size: var(--sz-sh-title); line-height: 1.1; margin: 10px 0 4px 0; }
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
            <div class="sefer-label">ספר</div>
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
          <div class="author-block">חובר ונערך בס"ד ע"י<br><span class="author-name">${author}</span></div>
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

    function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL) {
      const page = document.createElement('div');
      page.className = 'a4-page';

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
               sideNote: sideNote
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
          let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
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
          p.className = 'p-end';
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

      if (showMainShaar) {
        renderMainShaar(container, mainShaarStyle);
      }

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
              if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
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
        let isH0 = sec.isNewPage && sec.hToken.level === 0;

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
            customR, customC, customL
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

              if (currentTok.type.startsWith('h')) {
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

                if (bestFitLine > 0) pageHasContent = true;

                const chunk = lines.slice(0, bestFitLine).join(' ');
                const isEndOfP = (bestFitLine === lines.length);
                pElem.className = isEndOfP ? 'p-end' : 'p-cut';
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
            const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

            if (peekMode === 'span_1col' && !pendingWordTokens) {
              if (remPageHeight < 100) {
                break;
              }
              if (peekTok.level === 3) currentH3Title = peekTok.text;
              const spanBlock = document.createElement('div');
              spanBlock.className = 'block-h3-span';
              spanBlock.innerHTML = `<div class="h3-title-text" data-token-id="${peekTok.id}" id="heading-tok-${peekTok.id}">${peekTok.text}</div>`;
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

                  if (bestFitLine > 0) pageHasContent = true;

                  const chunk = lines.slice(0, bestFitLine).join(' ');
                  const isEndOfP = (bestFitLine === lines.length);
                  pElem.className = isEndOfP ? 'p-end' : 'p-cut';
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
            
            pagePendingNotes.forEach(item => {
              if (item.elem && item.pElem) {
                item.elem.style.top = item.pElem.offsetTop + 'px';
              }
            });
          }
        }
      }

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

---

## 📊 סיכום שיחה

- **סה"כ הודעות:** 4
- **פניות משתמש:** 2
- **תגובות AI:** 2
- **מודל:** `models/gemini-3.7-flash`
- **תאריך:** 2026-08-26
