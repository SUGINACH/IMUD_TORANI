---
title: "תיקון באגים במערכת העימוד"
date: 2026-09-07
version: V21
type: transcripts
source: Gemini (Google AI Studio)
---


# תיקון באגים במערכת העימוד

> שיחת Google AI Studio (Gemini) — מודל: `models/gemini-3.7-flash`

---

## פנייה 1: [קובץ מצורף מ-Google Drive — מזהה: 1GvEtyV8seC524tzF5BCJhnhZZfBFFw]

[קובץ מצורף מ-Google Drive — מזהה: 1GvEtyV8se_C524tzF5BCJhnh_ZZfBFFw]

---

## פנייה 2: לפניך קובץ מערכת עימוד תורני בA4 יש לי בעיה.... משהו מוזר קורה.... כל הערת…

לפניך קובץ מערכת עימוד תורני בA4
יש לי בעיה....
משהו מוזר קורה....
כל הערת שוליים (המוסגרת בסוגריים מרובעים) מופיעה כמה פעמים, וגם המספור של ההערות אינו מתחיל מהתחלה (התחיל ב14).
וגם ברירת המחדל של המספור צריך להיות בא,ב,ג,ד,ה,ו,ז,ח,ט,י,יא,יב,יג,יד,טו,טז, וכו' וכו'.

---

### 🤖 תגובה 1: Analyzing Footnote Issues Okay, I've identified the core problems: duplicated…

**Analyzing Footnote Issues**

Okay, I've identified the core problems: duplicated footnotes and incorrect numbering. I'm focusing on why footnotes are being re-added, and why the numbering is off. I'm going to look into the code that processes footnotes, specifically where they are stored, and how that storage interacts with the insertion process. The goal is to determine the point of failure that causes the duplication, and restart footnote numbering from one.


**Investigating Hebrew Numbering**

My focus has shifted to the Hebrew alphabetic numbering style (gematria). I must make the default style (א, ב, ג...) and ensure that the numbering resets correctly. The root cause for both problems seems to be the column balancing function, where footnote style application happens. I'll focus on where `applyDelimiterStyles` or `createNoteMarkerAndQueue` gets called. Let's see how `typesetDocument` processes this.


**Uncovering Redundant Calls**

I've pinpointed the root cause! The culprit is `balanceColumns`, which repeatedly calls `applyDelimiterStyles` during its trial runs. Each call triggers `createNoteMarkerAndQueue`, leading to redundant additions to `footnoteQueueForPage` and increments of the `noteCounters['footnote']` counter. This explains the footnote duplication and inflated numbering.


**Fixing Counters and Numbering**

I've uncovered another critical issue: the `noteCounters` object and related variables are *never* reset at the beginning of `typesetDocument()`. This leads to perpetual incrementing of footnote numbers across editing and re-rendering, causing the problem to be persistent. I must ensure these counters are initialized at the start. I also see that `toHebrewLetterSeq` is incorrect, as it doesn't match standard Gematria numbering, which is the standard!


**Verifying Hebrew Numbering**

I've made progress! I re-examined the Hebrew numbering and verified that the existing `toGematria()` function *correctly* implements traditional Hebrew numerals, which is crucial. I must use this, now, for the default numbering. The user's specific request for that numbering system is a priority!


**Confirming Hebrew Defaults**

I'm now zeroing in on the default footnote numbering. I've examined `formatNoteMarker` and confirmed the need to default to `toGematria(n)`, which correctly implements Hebrew numerals. I'll verify the panel settings to ensure this is the default and then I'm checking the reset behavior and how that's handled. The reset should apply on a per-page basis as specified in the settings.


**Examining Page-Level Reset**

I'm now focusing on page-level footnote resets. It looks like the expected behavior is that footnotes reset per page, but I need to make sure this is actually how it works. I'm tracing the flow to see how these queues are handled by `balanceColumns` and `typesetDocument` to understand how the footnote duplication bug arose. The root cause appears to be the missed reset in `typesetDocument`. I'll analyze how the counters and queues are used during column balancing. Specifically, `applyDelimiterStyles` runs and triggers `createNoteMarkerAndQueue`, which adds to the page's footnote queue!


**Tracing Column Balancing**

I'm now tracing the control flow within `balanceColumns` to understand its interaction with footnote processing. I see that within the loop that evaluates split points, `renderSingleItemFast` is *always* called, which in turn *always* calls `applyDelimiterStyles`. This function call is what is causing the footnote duplication! I need to ensure that this routine is not repeatedly adding to the page's footnote queue on every trial run.


**Eliminating Redundant Calls**

I've got it! The problem is `balanceColumns` calling `applyDelimiterStyles` far too many times. Within `balanceColumns`, on each trial split point within the paragraph loop, `renderSingleItemFast` *always* runs and triggers `applyDelimiterStyles`. And after the loop, it happens a final time in `appendItemFinal`. This makes it worse than I first thought. Each run duplicates the footnote! Then, `balanceColumns` reads the children which still have `[...]`, so the initial footnote additions are still there, making the footnote queue much worse.


**Refining Code Execution**

I'm now identifying how to fix this architecture cleanly. I've pinpointed that `applyDelimiterStyles` should *not* mutate `footnoteQueueForPage` during trial runs in column balancing. Ideally, `renderSingleItemFast` shouldn't process footnotes at all, since it's just measuring scroll height. If it *must*, it shouldn't generate real footnotes or increment counters. The main goal here is to determine how to separate the measurement functionality from the side effect of footnote processing during the balancing stage.


**Clarifying Footnote Lifecycle**

I'm now clarifying the entire lifecycle of footnote collection and page flushing. I'm focusing on the interaction between `typesetDocument` and `balanceColumns` to understand when and where the footnote queue is modified. I'm going to trace the steps from the initialization within `typesetDocument` through the column balancing and rendering to identify how the redundant additions are occurring and how to prevent them. The goal is to separate the footnote addition process from the measurement phase.


**Isolating Measurement Effects**

I'm now separating the footnote addition process from the measurement phase, which will isolate any duplicate rendering issues. I've got to ensure the initial counter is initialized at 0 or 'א', and I am thinking about how to queue footnotes per page. I'm focusing on dry-run operations for measuring, which should *never* add to counters or push into `footnoteQueueForPage`. The goal is to determine the best method to make sure the process doesn't cause these side effects.



**Revising Footnote Timing**

I'm revisiting the timing of footnote processing to prevent duplication, especially within `balanceColumns`. It seems the initial placement within `typesetDocument` is harmless because there is no problem in single column contexts. I'm focusing on only queuing footnotes when a paragraph is *actually* committed to the DOM to ensure correct ordering and prevent redundant additions. My goal is to extract the footnote handling to be part of the final render process.


**Refining Loop Execution**

I'm now zeroing in on the loop execution in column balancing to identify where footnote processing is triggered. I've noted that `applyDelimiterStyles` is *only* called once outside the loop when `isH0`, but when two columns are present, `applyDelimiterStyles` is called within the inner loop when a chunk is decided. I'll need to figure out why the loops cause the problem with `balanceColumns`. It looks like the issue may be in how `applyDelimiterStyles` interacts with the paragraph chunking within those loops.


**Isolating Footnote Execution**

I'm isolating the footnote execution to occur only *after* column balancing to remove the duplication in footnote processing. `balanceColumns` should not trigger footnote processing during its trial runs. I'm focusing on ensuring the footnote queue isn't modified during height measurements in balancing, only when a paragraph is finalized. The current loop execution within `balanceColumns` is triggering `applyDelimiterStyles` and creating duplicate footnotes, a problem I'm working to solve.


**Separating Rendering Processes**

I'm now separating out the footnote creation from measurement processes. I'm modifying `applyDelimiterStyles` to allow a dry-run mode that replaces the text with placeholder markers. This prevents the redundant additions to the footnote queue during `balanceColumns`. It also prevents the `p` being created (and then `p.innerHTML` being updated later). I'll work on making `renderSingleItemFast` *not* call `applyDelimiterStyles` in this `isDryRun` mode. The core goal is avoiding side effects during measurement.



**Refining Measurement Logic**

I'm now refining the measurement logic. My key insight: I can ensure `applyDelimiterStyles` runs in a dry-run mode within `renderSingleItemFast`, which prevents incrementing counters or adding to queues during the balancing calculations. I'm focusing on ensuring this dry-run mode correctly handles footnote placeholders and only renders actual footnotes during the final rendering stage. I will also make sure that `balanceColumns` either removes/rollsback notes from the initial placement, or re-queues them.


**Refining Balance Interactions**

I'm now zeroing in on interactions with `balanceColumns`. It looks like `balanceColumns` is only *sometimes* called: at the end of a section, or before a single-column span. I must account for both scenarios! If called, it causes a *second* round of `applyDelimiterStyles` on already-processed paragraphs, and a third during trial runs. This confirms the duplication. The goal is to ensure footnote calls only happen once per actual render.


**Implementing Footnote Cleanup**

I'm now implementing the suggested fix! At the start of `typesetDocument()`, I'm initializing `noteCounters`, `noteUidCounter`, `footnoteQueueForPage`, and `endnoteQueueForPart`. Then, I will default `formatNoteMarker` to use `toGematria(n)` for footnote numbering. I am re-examining how to handle the different cases. I think that ensures a clean start and corrects the numbering style.


**Verifying Gematria Numbering**

I'm verifying that Gematria numbering is implemented correctly. My testing confirms that `toGematria()` function produces the correct Hebrew numerals, including edge cases like 15 and 16. It handles the mapping of ones, tens, and hundreds properly. I've re-integrated the function into the default formatting process.


**Validating Gematria Functionality**

I've rigorously tested the `toGematria()` function, ensuring it accurately generates Hebrew numerals, including tricky cases like 15, 16, and larger numbers. The testing validates the logic, including how the hundreds, tens, and ones are handled, as well as the special handling of "טו" and "טז". I've confirmed that these cases integrate well with the digit mapping.


**Adding UI Preferences**

I'm now integrating UI controls to allow the user to select the note numbering style. I've added a new dropdown menu in the settings panel for "סגנון מספור" (numbering style), with options for numbers and Hebrew letters (ספרות / אותיות עבריות). I'm confident that this will allow the user to control the Gematria option directly. The next step is to ensure this new selector updates `typesetDocument()` correctly.


**Implementing UI Updates**

I've successfully integrated the UI changes! I've added the new numbering style dropdown with Hebrew and numeric options. The UI now defaults to Hebrew numerals, which can be changed with the new UI preference. This includes the UI for the Hebrew Gematria letters and number system. I'm verifying the new selector updates `typesetDocument()` correctly, and will ensure this option directly affects footnote numbering during rendering.


**Finalizing Measurement Adjustments**

I'm now implementing the logic to handle footnote processing and measurement correctly within column balancing and dry-run scenarios. My current efforts involve ensuring that when isDryRun is true, during trial runs, the footnote-related functions are *never* triggered. This should prevent the repeated queue additions. Then, ensure footnote queues are properly handled at the end of the final render.


**Implementing Snapshot Logic**

I'm now creating and restoring snapshots of note-related data *before* and *after* `balanceColumns` is run on a `block2Col`. This allows me to isolate note processing for two-column layouts. The plan is to capture the footnote queue, endnote queue, and counters *before* balancing. Then, I'll restore them *after* the balancing loop is completed. I'm aiming to prevent the redundant footnote additions caused by the trial runs.



**Confirming Balance Logic**

I've got it working! The core fix involved snapshots and `dryRun`. Inside `balanceColumns`, `renderSingleItemFast` *now* avoids the queue. `appendItemFinal` correctly queues notes, only once! Outside, single-column fills are correct. I'm verifying the edge cases where balance columns isn't triggered, like at the end of a section; the snapshot correctly restores the counter and queue!


**Confirming Balance Logic**

I'm now verifying edge cases where column balancing isn't triggered, like at the end of a section. The snapshot logic I implemented appears to correctly restore the counters and queue in these situations, too. The dry-run method is effective inside the `balanceColumns` method. The goal is to fully eliminate redundant calls.


**Validating Page Flushing**

Now, I'm validating the page flushing process, ensuring correct handling with multiple `block2Col` blocks on the same page, while considering existing endnotes. I'm confirming `flushFootnotesInto` renders notes correctly, with my fixes in place, and that the order is also correct. I must verify the logic involving the snapshots and dry-run approach. I will ensure that the footnotes are flushed correctly!


**Refining Endnote Integration**

I'm now focusing on endnotes, specifically their handling within the `blockNoteSnapshot`. I need to ensure endnotes are also preserved and restored correctly, which is currently the case. The snapshot logic I implemented affects the counters and queues for both footnotes and endnotes! I'll re-verify that the footnote and endnote functionality is consistent throughout the entire process.


**Addressing Endnote Handling**

I'm now identifying how endnotes are handled during the paragraph merge within `balanceColumns`. It appears that `endNote` data isn't being extracted from the `child` element correctly in the initial phase. Therefore, the `item.endNote` property remains undefined! I'm adding `endNote` to `mergedItems`, and ensuring `endNote` attributes are properly propagated.


**Refining Styles Application**

I am now focusing on refining the application of delimiter styles. I'm carefully reviewing the logic within `applyDelimiterStyles`, specifically how it handles footnote delimiters and imported text styles. I'll need to double-check that this function is working as intended, and correctly handles both the creation of footnote delimiters and the parsing of text styles. The goal is to make sure it handles the footnote delimiters correctly.


**Refining Delimiter Parsing**

I'm now implementing the text-node processing to handle active styles. I'm focusing on the logic to find and de-duplicate style matches within text nodes. I'm working with the iterator, the search indexes, and how `matches` are organized. My priority is getting all styles applied correctly.


**Optimizing Text Delimiter Processing**

I'm working on how `applyDelimiterStyles` handles different text fragments and their styles. Now, I'm focusing on text node processing and refining the logic for identifying and de-duplicating style matches. I'm focusing on the iterator and index search to make sure styles are handled correctly.

---

### 🤖 תגובה 2: Verifying Gematria Encoding Okay, I've confirmed the togematria function is…

**Verifying Gematria Encoding**

Okay, I've confirmed the `to_gematria` function is handling numbers like 15 and 16 correctly, producing "טו" and "טז," respectively. I also confirmed 25 gives "כה." I'm currently testing other simple numbers to ensure consistent behaviour with all values. I need to make sure simple cases are working before increasing the numbers being tested.


**Refining Gematria Implementation**

I've determined that the original `toHebrewLetterSeq` function was not a proper gematria implementation at all, it was base 22. Replacing it with my `toGematria` function resolves the Hebrew letter numbering issue universally. The numbers such as 15 and 16 now correctly translate to "טו" and "טז." I have also looked at `formatNoteMarker` and the `note-numbering-style` value.


**Analyzing Note Numbering**

I am now focusing on how the note numbers are being rendered within the HTML. The goal is to ensure `formatNoteMarker` uses Gematria when the note-numbering-style is set to Gematria. I am checking the logic that determines how note numbers are displayed, specifically looking at how the `fn-delim-open` input value affects the `formatNoteMarker` function, and how the style is selected.


**Examining Style Selection**

I'm now diving deep into how the note-numbering-style is implemented in the HTML. Specifically, I am analyzing the logic and elements associated with the `note-numbering-style` select element. I'm focusing on how the selected value ("gematria" or "decimal") influences the `formatNoteMarker` function, and how the values are used to display the number. I need to understand how the user's choice actually translates into gematria rendering.


**Investigating Marker Customization**

I'm now focusing on how the note markers themselves are customized within the HTML. The goal is to understand how the user can change the appearance of the note marker, independent of the number system. This includes the various options within the HTML like the marker type (superscript, normal, subscript), marker size, the number separator, and the rule style, and their effect on how the note looks.


**Tracking Page-Specific Reset**

I've determined `noteCounters` and `footnoteQueueForPage` are reset at the beginning of document processing and again with each new page creation. This means the note numbering is reset on a per-page basis. I'm investigating how this behavior interacts with the display of gematria-numbered footnotes across page boundaries, and how `flushFootnotesInto` affects this process. I am examining how `flushFootnotesInto` interacts with these resets.


**Clarifying Counter Reset**

I've just examined the `flushFootnotesInto` function, and now I'm clarifying how `resetNoteCounterIfNeeded` operates. It appears that it resets the `noteCounters['footnote']` to 0 when the `target` is 'footnote' and the `trigger` is 'page'. I'm also observing that it iterates through `importedTextStyles` and I am trying to figure out how this applies to my gematria implementation.


**Fixing Counter Logic**

I've pinpointed a crucial flaw in `resetNoteCounterIfNeeded`. The function depends on `importedTextStyles`, and if this array is empty (no custom styles), the note counter isn't reset per page. This oversight means footnote numbering isn't resetting as intended across pages without user input. I need to ensure the reset happens correctly regardless of imported text styles.


**Examining Counter Resetting**

I see now that the footnote counter does indeed reset at the end of each page, meaning page one does start with Aleph. The issue is fixed! After a thorough look into the code, I can now move forward, I am checking how this counter resets in the `typesetDocument` function.


**Restoring Note State**

I'm now analyzing `balanceColumns`. I see that it takes a snapshot of the note state *before* `block2col` is filled. Then, when the balancing happens, this snapshot is used to restore the footnote and endnote queues and counters, essentially reverting the note-numbering state to what it was before the balancing started. This means changes to the footnote counter during column balancing are discarded, and need to be handled carefully.


**Analyzing Column Rendering**

I'm now examining how individual items are rendered within columns, specifically within `balanceColumns`. I'm comparing the rendering process of headings (`item.type === 'h'`) versus regular paragraphs. I see two methods: `renderSingleItemFast` and `appendItemFinal`, and I am trying to understand their implications for note rendering, especially since there's a snapshot/restore mechanism. I am checking the function calls.


**Examining Endnote Rendering**

I'm now focusing on how endnotes are rendered within the column balancing process. I'm examining how `createNoteMarkerAndQueue` is used in the `balanceColumns` process, specifically in relation to `isCont` and `item.endNote`. I need to ensure endnote numbering is handled correctly during column balancing, especially considering the snapshot/restore mechanism, as well as situations where the footnote queue might not have any content. I am testing what happens with empty content.


**Verifying Empty Block Handling**

I'm now investigating how the snapshot of `blockNoteSnapshot` is handled within `balanceColumns` if the `block2Col` is empty and thus discarded, restoring the previous note state. I've also examined two other points where `balanceColumns` is called and how the snapshot is passed into the process. The code appears to be functioning correctly, as I've reviewed the calls to `balanceColumns` and `getFootnotesReservedHeight()`, confirming that it doesn't mutate anything.


**Confirming Data Integrity**

I've confirmed that the `buildNoteBlockElement` function does not mutate the `queue` or `noteCounters`, making `getFootnotesReservedHeight()` safe and pure, as it only generates DOM nodes, measures their height, and removes them. I am now checking how the `endnote` handling interacts with this within `appendItemFinal` and `balanceColumns`.


**Tracking Endnote Sequencing**

I'm now examining how the `endNote` property, derived from the merged items, behaves in the context of column balancing and page rendering. I see that the `endNote` is appended only once to the non-continuation paragraph within `appendItemFinal`. Also, I am verifying that the footnote queue is not mutated. I also see that at the end of each page, the footnote queue for page is flushed into the current page element.

---

### 🤖 תגובה 3: הבעיות שנבעו בעימוד ההערות נגרמו מכמה סיבות עיקריות במנוע העימוד: ### הגורמים…

הבעיות שנבעו בעימוד ההערות נגרמו מכמה סיבות עיקריות במנוע העימוד:

### הגורמים לבעיה:
1. **שכפול ההערות והקפצת המספור (ל-14 ומעלה):** 
   בזמן איזון שני הטורים בסוף פרק (`balanceColumns`), המערכת בוחנת מספר נקודות חיתוך אפשריות (`renderSingleItemFast`) כדי למצוא את האיזון המדויק ביותר בגובה הטורים. בכל אחת מריצות המדידה הללו, הפונקציה `applyDelimiterStyles` הופעלה שוב ושוב, הוסיפה את אותה הערת שוליים שוב ושוב לתור הדף (`footnoteQueueForPage`), וקידמה את מונה ההערות בכל בדיקה.
2. **אי-איפוס המונים בין רינדורים ובין עמודים:**
   משתני התורים והמונים (`noteCounters`, `footnoteQueueForPage`) לא אופסו מחדש בתחילת כל עימוד (`typesetDocument`), ופונקציית האיפוס בין עמודים לא טיפלה בהערות מובנות אלא רק בתוספים חיצוניים.
3. **סגנון מספור עברי (גימטריה):**
   פונקציית ברירת המחדל השתמשה במספור ספרתי או באלגוריתם בסיס-22 שגוי, במקום בפונקציית הגימטריה המסורתית (א, ב, ג... י, יא, יב, יג, יד, **טו**, **טז**, יז...).

---

### התיקונים שבוצעו:
1. **מצב מדידה יבש (`isDryRun`):** פונקציית סריקת ההערות תומכת כעת במצב מדידה שאינו מוסיף הערות לתור ואינו מקדם מונים בזמן בדיקות איזון טורים.
2. **תמונת מצב ושחזור (`Snapshot & Rollback`):** בעת הפעלת איזון טורים, המערכת משחזרת את מצב התור והמונים לנקודה שלפני הבלוק, ורושמת את ההערות הסופיות **פעם אחת בלבד** (`appendItemFinal`).
3. **איפוס מלא ומדויק:** המונים והתורים מתאפסים בתחילת כל עימוד של המסמך, והערות שוליים מתאפסות אוטומטית בכל מעבר עמוד (העמוד הבא יתחיל שוב מ-א').
4. **מספור גימטרי תקני כברירת מחדל:** הוטמע מספור באותיות עבריות תקניות (כולל ט"ו וט"ז), ונוספה שליטה בסרגל הצד לבחירה בין אותיות עבריות לספרות.

---

### הקובץ המלא והמתוקן (מוכן לשימוש והעתקה):

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

      <!-- פאנל 1: שערים -->
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

      <!-- פאנל 2: ערכת נושא חדשה -->
      <div class="panel-static">
        <div class="panel-header" style="cursor:pointer;" onclick="togglePanelBody('new-theme-panel-body')">
          🎨 יצירת והטמעת ערכת נושא חדשה (SVG) <span style="font-size:8pt; font-weight:normal; float:left;">▼ פתח/סגור</span>
        </div>
        <div id="new-theme-panel-body">
          <div class="inline-cfg-row" style="margin-bottom: 6px;">
            <label style="color:#1e3a8a;">שם הערכה:</label>
            <input type="text" id="builder-theme-name" placeholder="הזן שם לערכת הנושא החדשה...">
          </div>

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

        <div style="font-weight:700; font-size:8pt; margin: 2px 0 3px 0; color:#1e3a8a;">📌 הערות שוליים (בתחתית העמוד):</div>
        <div class="inline-cfg-row">
          <label>תוחמי טקסט (פ/ס):</label>
          <div style="display:flex; gap:4px; flex:1; align-items:center;">
            <input type="text" id="fn-delim-open" value="[" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="פתיחה" oninput="typesetDocument()">
            <span style="font-size:8pt; color:#666;">עד</span>
            <input type="text" id="fn-delim-close" value="]" style="width:45px; text-align:center; font-size:8pt; padding:2px; border:1px solid #aaa; border-radius:2px;" placeholder="סגירה" oninput="typesetDocument()">
          </div>
        </div>

        <div style="font-weight:700; font-size:8pt; margin: 6px 0 3px 0; color:#1e3a8a; border-top:1px dashed #ddd; padding-top:4px;">📚 הערות סיום (מרוכזות בסוף חלק):</div>
        <div class="inline-cfg-row">
          <label>קידומת שורה:</label>
          <input type="text" id="en-line-prefix" value="הערת סיום -" placeholder="למשל: הערת סיום -" oninput="typesetDocument()">
        </div>

        <div style="border-top:1px dashed #ddd; margin-top:6px; padding-top:4px;"></div>
        <div class="inline-cfg-row"><label>סגנון מספור:</label>
          <select id="note-numbering-style" onchange="typesetDocument()">
            <option value="gematria" selected="selected">אותיות עבריות (א, ב, ג...)</option>
            <option value="decimal">ספרות (1, 2, 3...)</option>
          </select>
        </div>
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
       ערכות נושא מותאמות
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

      alert(`ערכת הנושא "${name}" הוטמעה בהצלחה!`);
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
       סריקת והחלת תוחמי טקסט (הערות שוליים וסגנונות)
       ============================================================ */
    function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt, isDryRun = false) {
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
            
            if (isDryRun) {
              // בריצת מדידה זמנית - סימון דמה שאינו מגדיל מונים ואינו נכנס לתור
              const dummyMarker = document.createElement('a');
              dummyMarker.className = 'note-marker';
              dummyMarker.textContent = 'א';
              applyNoteMarkerStyle(dummyMarker, false);
              frag.appendChild(dummyMarker);
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
      const globalNumStyle = document.getElementById('note-numbering-style')?.value || 'gematria';
      const numStyle = cfg.numberingStyle || globalNumStyle;
      if (numStyle === 'decimal' || numStyle === 'numeric') {
        return String(n);
      }
      return toGematria(n) || String(n);
    }

    function resetNoteCounterIfNeeded(target, trigger) {
      let shouldReset = false;
      if (target === 'footnote' && trigger === 'page') shouldReset = true;
      if (target === 'endnote' && trigger === 'part') shouldReset = true;

      importedTextStyles.forEach(inst => {
        if (inst.def && inst.def.target === target) {
          const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt) || (target === 'footnote' ? 'page' : 'part');
          if (resetAt === trigger) shouldReset = true;
        }
      });

      if (shouldReset) {
        noteCounters[target] = 0;
      }
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
       שער ראשי
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
       שער אחורי (טור ימני)
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
       שער משנה (טור שמאלי)
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

    function balanceColumns(block, colWidth, styleObj, snapshot) {
      // שחזור תור ההערות והמונים למצב המדויק שהיה לפני הבלוק כדי למנוע כפילויות
      if (snapshot) {
        footnoteQueueForPage.length = snapshot.footnoteQueueLen;
        endnoteQueueForPart.length = snapshot.endnoteQueueLen;
        noteCounters.footnote = snapshot.footnoteCounter;
        noteCounters.endnote = snapshot.endnoteCounter;
        noteUidCounter = snapshot.noteUid;
      }

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
          let endNote = child.getAttribute('data-end-note');
          let lastItem = mergedItems[mergedItems.length - 1];
          if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
             lastItem.rawText += ' ' + text;
             if (sideNote && !lastItem.sideNote) lastItem.sideNote = sideNote;
             if (endNote && !lastItem.endNote) lastItem.endNote = endNote;
          } else {
             mergedItems.push({ type: 'p', id: id, rawText: text, isCont: isCont, sideNote: sideNote, endNote: endNote });
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
          applyDelimiterStyles(p, 'body', getBodySizePt(), true); // ריצת מדידה בלבד - ללא תוספת הערות
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
          if (item.endNote) p.setAttribute('data-end-note', item.endNote);
          
          let isSingleLine = false;
          if (!isPartial) {
              isSingleLine = item.isSingleLine;
          } else {
              let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
              isSingleLine = linesInfo.lines.length <= 1;
          }
          
          p.innerHTML = createDropWord(textToRender, isCont, isSingleLine);
          applyDelimiterStyles(p, 'body', getBodySizePt(), false); // החלה סופית ואמיתית

          if (item.endNote && !isCont) {
            const marker = createNoteMarkerAndQueue(item.endNote, null, 'endnote');
            p.appendChild(marker);
          }

          col.appendChild(p);

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

      // איפוס מוחלט של כל מוני ותורי ההערות בתחילת העימוד
      noteCounters = { footnote: 0, endnote: 0 };
      noteUidCounter = 0;
      footnoteQueueForPage = [];
      endnoteQueueForPart = [];

      let rawText = document.getElementById('raw-input').value;
      if (!rawText.trim()) return;

      rawText = parseMetadataFromText(rawText);

      const container = document.getElementById('book-container');
      container.innerHTML = '';

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

        if (enLinePrefix && line.startsWith(enLinePrefix)) {
          pendingEndNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
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

      if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId);
        renderExtAnchor(container, 'afterMainShaar', rawText);
      } else {
        renderExtAnchor(container, 'beforeAll', rawText);
      }

      if (showBackShaar) {
        renderBackShaar(container, activeThemeId);
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
      renderExtAnchor(container, 'afterGeneralToc', rawText);

      const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: '1.34'
      };

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
                applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId), false);
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
                applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

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
              applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId), false);
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

            // תמונת מצב מדויקת לשחזור אם יופעל איזון טורים
            const blockNoteSnapshot = {
              footnoteQueueLen: footnoteQueueForPage.length,
              endnoteQueueLen: endnoteQueueForPart.length,
              footnoteCounter: noteCounters.footnote || 0,
              endnoteCounter: noteCounters.endnote || 0,
              noteUid: noteUidCounter
            };

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
                  applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId), false);
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
                  if (currentTok.endNote) pElem.setAttribute('data-end-note', currentTok.endNote);
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
                  applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

                  if (currentTok.endNote && isEndOfP) {
                    const marker = createNoteMarkerAndQueue(currentTok.endNote, null, 'endnote');
                    pElem.appendChild(marker);
                  }

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
                if (blockNoteSnapshot) {
                  footnoteQueueForPage.length = blockNoteSnapshot.footnoteQueueLen;
                  endnoteQueueForPart.length = blockNoteSnapshot.endnoteQueueLen;
                  noteCounters.footnote = blockNoteSnapshot.footnoteCounter;
                  noteCounters.endnote = blockNoteSnapshot.endnoteCounter;
                  noteUidCounter = blockNoteSnapshot.noteUid;
                }
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
              balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot);
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
                balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot);
              } else {
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

---

## פנייה 3: בגלל גודל הקובץ נקטע באמצע: function renderPaginatedTOC(container, entries,…

בגלל גודל הקובץ נקטע באמצע:
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
המשך מכאן!

---

### 🤖 תגובה 4: Continue the Process I've picked up where I left off in the JavaScript code,…

**Continue the Process**

I've picked up where I left off in the JavaScript code, specifically after the `lastRenderedGrid.style.justifyContent` line. I'm now examining the logic flow immediately following that point, attempting to understand the overall function's behavior. I am focusing on what comes next, to fully grasp its intended outcome. I'm working to avoid repeating code, or previous ideas, to provide efficient and concise updates.


**Analyze the Conclusion**

I've moved on to examine the function's concluding lines within the JavaScript code block, specifically focusing on the conditional statements dealing with `lastRenderedGrid` and `lastRenderedPage`. I am now understanding the context of `applyContentBg` in terms of how `tocLast` is applied, and how these elements are styled or modified at the function's end.


**Examine the Event Listeners**

I am now looking at the event listeners added to the textarea element, particularly the 'click' and 'keyup' events. I'm focusing on the 'syncCursorToPreview' function and its role in coordinating cursor position between the textarea and preview. I am trying to determine the conditions under which the `syncCursorToPreview` is called and how its behavior depends on these conditions. I am examining the impact of key presses on cursor synchronization.


**Assess the Integration**

I'm now integrating the understanding of imported items, custom themes, and counters within the JavaScript code. I am focusing on how `importedImagePages`, `importedTextStyles`, and `importedPageTypes` are handled in combination. I'm taking the `maxCounter` and `maxSynth` into account, specifically how they are determined.


**Evaluate the Condition**

I'm now focusing on the initial conditional statement within the JavaScript. I am examining how the value of `document.getElementById('hdr-c-type').value` affects the display property of the `row-hdr-c-img` element. I'm taking the effect that this has on the following lines of text, focusing on the content and its formatting.


**Decipher the Structure**

I'm now deciphering the structure of the Hebrew text provided. I am focusing on identifying the headers, sub-headers, and body text to understand the layout and the flow of the information. I am paying close attention to the way the text is divided into columns and paragraphs, and how they relate to the structure of the ideas presented. I am also identifying the footnotes and extended comments.

---

### 🤖 תגובה 5: הנה המשך הקוד במדויק מנקודת החיתוך ועד לסגירת הקובץ: javascript if…

הנה המשך הקוד במדויק מנקודת החיתוך ועד לסגירת הקובץ:

```javascript
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
</body>
</html>
```

---

## פנייה 4: עכשיו צור מסמך מסודר, מפורט ומעמיק בפורמט Markdown הכולל את כל הפרטים הטכניים,…

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

### 🤖 תגובה 6: Defining the Scope I'm currently focused on defining the exact scope of this…

**Defining the Scope**

I'm currently focused on defining the exact scope of this project. It seems I must create a thorough technical document. The user needs the document to detail the architecture, algorithms, implementation aspects, including those for edge cases, and even lessons learned from failures. I'm taking all aspects of the user's needs into account.


**Refining the Architectural Overview**

I'm now diving deeper into the required sections. I've broken down the "High-Level Overview" (סקירת המערכת והארכיטקטורה) to include the system's purpose, tech stack (emphasizing the zero-dependency single-page architecture), and architectural patterns, such as the reactive token pipeline. Separation of concerns is central. This document will comprehensively address the interplay of these parts.


**Detailing the Implementation**

Now I'm deep in the implementation details. I'm focusing on the core algorithmic challenges. Specifically, I'm documenting the screen measurement engine, layout flow engine, balancing and post-processing engine, and the serialization/print engine. I'm breaking down the two-column layout and balancing, orphan and widow control, handling side headings/marginalia, and the footnotes mechanism. I'm also addressing text flow and area overflow, including offscreen line-breaking and Hebrew justification. Finally, I'm noting chapter/end-of-section balancing.


**Analyzing Failed Approaches**

I'm now documenting the lessons learned from past mistakes. The most recent focus is on specific failures I encountered. For example, I have documented the footnote duplication due to state explosion in balancing iterations, and my solution, the `isDryRun` mode. I'm also addressing the challenges of global state persistence across typesetting runs and how I overcame them. The analysis is nearly complete.


**Addressing Recent Failures**

I'm now documenting and analyzing the remaining failures. I realize I failed to re-initialize `footnoteQueueForPage` and `endnoteQueueForPart` in the `typesetDocument()` function, causing state leakage and inflated IDs. My solution involves a strict lifecycle reset. I also had flawed Hebrew letter sequencing, using a base-22 cycle instead of Gematria. I've now unified a `toGematria` algorithm. A third failure involved a footnote counter reset error, solved by handling native targets. Finally, endnote attributes were lost during the balance phase, which required explicit propagation.


**Documenting Remaining Failures**

I've just documented two more failure cases. The first involves SVG scaling distortions on cover pages caused by aspect ratio preservation; I've addressed this with a RegEx replacement. I am now providing a mapping of the major functions and core, production-ready code snippets with detailed comments on invariants and error handling. I'm also including all edge cases that have been tested.


**Outlining Future Steps**

I'm now outlining future steps, specifically multi-page footnotes, layered commentaries, a web worker for offscreen layout, OpenType feature activation, and instructions for future developers. I'm focusing on providing clear, actionable details for each task to ensure comprehensiveness.

---

### 🤖 תגובה 7: # תיעוד ארכיטקטוני, אלגוריתמי והנדסי: מנוע עימוד תורני לספרי A4 --- ## 1. סקירת…

# תיעוד ארכיטקטוני, אלגוריתמי והנדסי: מנוע עימוד תורני לספרי A4

---

## 1. סקירת המערכת והארכיטקטורה (High-Level Overview)

### 1.1. ייעוד המערכת
המערכת היא מנוע עימוד (Layout & Typesetting Engine) מקצועי לספרים תורניים בפורמט A4, הפועל במלואו בצד הלקוח (Zero-Dependency Single-Page Architecture). המערכת מקבלת טקסט גולמי מתויג (Markup ייעודי), מבצעת ניתוח לקסיקלי, חישוב גריד גמיש, מדידות טיפוגרפיות מדויקות ברמת הפיקסל/נקודה (pt/px), חלוקה לטורים, טיפול בכותרות צד, הערות שוליים והערות סיום, איזון שורות, הפקת תוכן עניינים מקושר והרצת מודל דפוס תואם תקן ISO 216 (A4 Print Engine).

### 1.2. טכנולוגיות
* **Core Runtime:** Vanilla JavaScript (ES6+) ללא ספריות צד-שלישי.
* **Layout & Geometry:** CSS Grid System, Flexbox, CSS Custom Properties (`:root` variables), Dynamic DOM Measuring Box.
* **Print Engine:** CSS3 Paged Media Module (`@page { size: A4; margin: 0; }`), Print Media Queries, CSS Fragmentation Rules (`break-inside: avoid`, `page-break-after: always`).
* **Vector Graphics:** SVG 1.1 עם שינוי יחסי היטל בזמן אמת (`preserveAspectRatio="none"`).
* **Typography:** Local Font Access API (`window.queryLocalFonts`), Google Web Fonts API, Fallback Glyph Cascading.
* **State & Persistence:** Self-Hydrating HTML Data Island (`<script type="application/json" id="ext-imports-data">`) המאפשר שמירת התבנית המלאה כקובץ HTML בודד ועצמאי לחלוטין.

### 1.3. עקרונות תכנון וארכיטקטורת רכיבים
המערכת בנויה לפי תבנית **Pipeline-Driven Declarative Architecture**:

```
[ Raw Text Input ] 
       │
       ▼
[ Metadata & Extension Parsing ] ── (Extract book properties & prefix tokens)
       │
       ▼
[ Tokenization & AST Construction ] ── (Build token tree: h0-h7, p, sideNote, endNote)
       │
       ▼
[ Structural Sectioning ] ── (Split into Pages/Sub-Shaar/Main-Content chunks)
       │
       ▼
[ Virtual Layout & Offscreen Measurement ] ── (#measuring-box: Line Breaking & Height Calc)
       │
       ▼
[ Flow & Pagination Engine ] ── (Greedy block filling with reserved footnote space)
       │
       ▼
[ Post-Processing & Balancing ] ── (Trial line-splitting, Column balancing & Vertical Justification)
       │
       ▼
[ Footnote & Margin Realization ] ── (Anchor positioning, Rule rendering, Footnote commit)
       │
       ▼
[ DOM Finalization & TOC Linking ] ── (Gematria indexing, Page Map backlinking)
```

#### הפרדת אחריות (Separation of Concerns):
1. **Sidebar State Controller:** ניהול הגדרות טיפוגרפיות (גדלים, גופנים, גריד, סגנונות הערות) וסנכרון מיידי למשתני ה-CSS ב-`:root`.
2. **Text Parser & Lexer:** המרת הטקסט הגולמי למערך אובייקטי `Token`, זיהוי מטא-דאטה, תוחמי הערות וסגנונות מותאמים.
3. **Offscreen Measurement Unit (`#measuring-box`):** אלמנט מבודד מה-DOM המשמש למדידת שבירת שורות, גובה מילים ראשונות (Drop-words) וגובה הערות ללא גרימת Reflow בעמוד הראשי.
4. **Column Flow & Balancing Engine:** מנגנון מרובה-מעברים (Multi-pass) האחראי על חלוקה לטורים, חיתוך פסקאות (`p-cut` מול `p-end`), ואיזון גובה הטורים בסוף קטע.
5. **Footnote/Endnote Subsystem:** ניהול תורים מבודדים, חישוב שריון גובה דינמי (Dynamic Height Reservation), ומספור גימטרי.
6. **Serializer:** הזרקת נתוני המערכת חזרה לתוך ה-DOM לצורך שמירה כקובץ מקור חדש.

---

## 2. מכלול האלגוריתמים והמימושים (Deep Dive Implementation)

### 2.1. עימוד ויישור שני טורים (Two-Column Layout & Balancing)

#### מבנה הגריד הראשי:
גריד העמוד מבוסס על 7 עמודות דינמיות המחושבות באחוזים מתוך רוחב ה-A4 (`210mm` פחות שולי ה-Padding):
$$\text{Total} = 2 \times W_{\text{margin}} + 2 \times W_{\text{gap}} + 2 \times W_{\text{col}} + W_{\text{gutter}}$$
כל גודל מנורמל ביחס של $100\%$ באמצעות פונקציית `updateGrid()`.

```
┌──────┬─────┬──────────┬────────┬──────────┬─────┬──────┐
│Margin│ Gap │ RightCol │ Gutter │ LeftCol  │ Gap │Margin│
│(Col1)│(Col2│  (Col3)  │ (Col4) │  (Col5)  │(Col6│(Col7)│
└──────┴─────┴──────────┴────────┴──────────┴─────┴──────┘
```

#### אלגוריתם חלוקת שורות ואיזון טורים בסוף פרק (`balanceColumns`):
במקום שבירה נאיבית של אלמנטים שלמים, המנוע מבצע שבירה ברמת השורה הבודדת:

1. **שלב המיזוג (Merge Phase):** איסוף כלל הפסקאות והכותרות מתוך הטור הימני והשמאלי, ומיזוג פסקאות שנחתכו בעבר חזרה לטקסט גולמי רציף (`rawText`).
2. **שלב חילוץ שורות (Line Extraction):** העברת כל פסקה ב-`#measuring-box` וחילוץ מערך מחרוזות שורות מדויק לפי רוחב הטור (`colWidth`).
3. **שלב יצירת נקודות פיצול אפשריות (Split Points Generation):** יצירת רשימת זוגות סדורים `(itemIndex, lineIndex)`. נקודות פיצול שאינן חוקיות (כגון שבירה מיד לאחר כותרת ללא טקסט) מסוננות החוצה.
4. **שלב הדמיית חלוקה ומציאת מינימום שגיאה (Evaluation Loop):**
   עבור כל נקודת פיצול:
   * טור ימין מקבל את הפריטים $0 \dots (\text{itemIndex}-1)$ ואת השורות $0 \dots (\text{lineIndex}-1)$ של פריט הפיצול.
   * טור שמאל מקבל את השורות $\text{lineIndex} \dots N$ של פריט הפיצול ואת הפריטים $(\text{itemIndex}+1) \dots M$.
   * רינדור במצב מדידה יבש (`isDryRun = true`).
   * חישוב הפרש הגבהים: $\Delta H = H_{\text{right}} - H_{\text{left}}$.
   * בחירת הנקודה הממזערת את $|\Delta H|$ כאשר עדיפות ניתנת ל-$\Delta H \ge 0$ (טור ימין מלא או שווה לטור שמאל).
5. **יישור אנכי (Vertical Justification):**
   אם קיים פער קטן שנותר ($2\text{px} < \Delta H \le 60\text{px}$):
   * הפער מחולק שווה בשווה בין מרווחי הפסקאות (`marginBottom` נוסף לכל פסקה).
   * אם ישנה פסקה בודדת, הפער מפוצה באמצעות הגדלת ה-`lineHeight` המחושב ביחס למספר השורות.

$$\text{ExtraSpacing} = \frac{\Delta H}{N_{\text{paragraphs}} - 1}$$

---

### 2.2. מניעת שורות וכותרות יתומות/אלמנות (Orphan & Widow Control)

המערכת מפעילה שני מנגנוני הגנה:

1. **מניעת כותרת יתומה (Orphan Heading Prevention):**
   לפני הצבת כותרת בטור, המערכת מחשבת את הגובה הפנוי הנותר:
   $$\text{AvailHeight} = H_{\text{remPage}} - H_{\text{footnotesReserved}}$$
   אם $\text{AvailHeight} - H_{\text{heading}} < 30\text{px}$ וקיימים כבר אלמנטים בטור, הכותרת נדחית לראש הטור/העמוד הבא.
2. **מניעת שורת יתומה/אלמנה בפסקה (Paragraph Widow/Orphan Heuristics):**
   בעת חיתוך פסקה על פני מעבר עמוד/טור:
   * אם נבחרה חלוקה שבה נשארת שורה אחת בלבד בטור הנוכחי ($\text{bestFitLine} = 1$), הפסקה כולה מועברת לטור הבא.
   * אם בטור הבא תישאר שורה בודדת ($\text{lines.length} - \text{bestFitLine} = 1$), החיתוך נסוג שורה אחת אחורה ($\text{bestFitLine} = \text{bestFitLine} - 1$) כדי להעביר שתי שורות לטור הבא.

---

### 2.3. עימוד וניהול כותרות צד (Side Headings / Marginalia)

* **הגדרה:** כותרות מרמה 7 (`כותרת 7 - ...`) או תוספי סגנון צדדיים מוגדרים כ-Marginalia.
* **מיקום פיזי:** הכותרות מוצבות בעמודות השוליים החיצוניות (`.right-margin` בעמודה 1, ו-`.left-margin` בעמודה 7) במקביל לפסקה המארחת.
* **אלגוריתם מניעת התנגשויות אנכיות (`finalizeNotePositions`):**
  1. מיפוי כל הערות הצד בעמוד לפי עמודת השוליים שלהן.
  2. מיון לפי מיקום הפסקה המארחת: $\text{Top}_{\text{target}} = P_{\text{elem}}.\text{offsetTop}$.
  3. בדיקת גלישה מתחתית הטור ($\text{Top} + H_{\text{note}} > H_{\text{column}}$):
     * ניסיון הרמה כלפי מעלה עד לרווח מינימלי של $6\text{px}$ מתחתית ההערה הקודמת.
     * אם אין מקום למעלה, והפסקה נמשכת בעמוד/טור הבא, ההערה מועברת לעמודת השוליים של המשך הפסקה.

---

### 2.4. מנגנון הערות שוליים בתחתית העמוד (Footnotes Subsystem)

#### ארכיטקטורת ניהול התורים:
הערות שוליים מוגדרות בטקסט באמצעות תוחמים (ברירת מחדל: `[...]`). המנוע מפעיל תור זמני ייעודי לעמוד (`footnoteQueueForPage`).

```
[ Text Processing: applyDelimiterStyles ]
         │ (Token contains "[...]")
         ├── Is DryRun? 
         │      ├── YES ──► Output dummy <a>א</a> (No counter change, No queue push)
         │      └── NO  ──► Generate UID, push to footnoteQueueForPage, increment noteCounters.footnote
         │
[ Column Flow Loop ]
         ├── Calculate: getFootnotesReservedHeight()
         │      └── probe DOM width=160mm ──► return (H_block + 24px)
         ├── Fill Columns (ensuring ColHeight <= PageCapacity - FootnotesReservedHeight)
         │
[ Page Finalization: flushFootnotesInto ]
         ├── Render Note Separator Rule (Plain / Decorative SVGs)
         ├── Render Multi-Column Note Block
         ├── Insert into page-content-wrapper before footer
         ├── Reset footnoteQueueForPage = []
         └── Reset noteCounters.footnote = 0 (Page-level reset)
```

#### אלגוריתם המספור הגימטרי התורני (`toGematria`):
המערכת ממירה ערכים מספריים לאותיות עבריות לפי כללי הדקדוק והמסורת התורנית:
* טיפול ייעודי במספרים 15 ו-16: המרה ל-**ט"ו** ו-**ט"ז** (במקום י"ה, י"ו).
* אלגוריתם פירוק רב-דרגתי: מאות ($100-900$), עשרות ($10-90$), אחדות ($1-9$).
* תמיכה במאות מורכבות: מעל 400 (תק, תר, תש, תת, תתק).

$$\text{Gematria}(N) = \text{Hundreds}\left[\left\lfloor\frac{N \bmod 1000}{100}\right\rfloor\right] + \text{Tens}\left[\left\lfloor\frac{N \bmod 100}{10}\right\rfloor\right] + \text{Ones}[N \bmod 10]$$
*(עם התניה: אם $N \bmod 100 \in \{15, 16\}$, החלף את העשרות והאחדות במחרוזת הייעודית).*

---

### 2.5. גלישת טקסט ושריון מקום דינמי (Dynamic Area Overflow Budgeting)

בכל איטרציה של לולאת העימוד הראשית:
1. המערכת מחשבת את הגובה האפקטיבי הפנוי לטקסט:
   $$H_{\text{avail}} = H_{\text{bodyFlow}} \times \text{sectionFillRatio} - \text{getFootnotesReservedHeight}()$$
2. הפסקה נמדדת ב-`#measuring-box`. שורות מתווספות עד ש-$H_{\text{col}} \le H_{\text{avail}}$.
3. החלק שנכנס מקבל מחלקת `p-cut` (יישור שורה אחרונה לשני הצדדים `text-align-last: justify`).
4. החלק העודף מועבר למשתנה `pendingWordTokens` ונכנס לראש הטור הבא עם מחלקת `p-end` (יישור שורה אחרונה למרכז `text-align-last: center` כמקובל בספרות תורנית).

---

### 2.6. טיפוגרפיה תורנית: חלון מילה ראשונה (Drop-Word / "פתיחתא")

* **מטרה:** הבלטת המילה הראשונה של הפסקה בגופן מוגדל (`--sz-first-word`) ובמשקל כבד.
* **לוגיקת הגנה:** 
  * פסקה המחזיקה מעל שורה אחת: המילה הראשונה נעטפת ב-`<span class="first-word-window">` עם `float: right` ומרווח תחתון/שמאלי.
  * פסקה קצרה (שורה אחת בלבד): שימוש ב-`float` ישבור את גובה השורה ויגרום לפסקה הבאה להישאב לתוך החלון. לכן המערכת מזהה זאת אוטומטית ומחליפה ל-`<span class="first-word-inline">` ללא `float`.
  * פסקאות המשך (`isContinuation = true`): חלון המילה הראשונה מבוטל לחלוטין.

---

## 3. יומן כישלונות, טעויות וניסיונות שנפסלו (Mistakes & Failed Approaches)

### 3.1. שכפול מרובה של הערות שוליים וזינוק מונה המספור

#### הגישה הראשונית:
הפונקציה `applyDelimiterStyles(containerEl)` נקראה בכל פעם שנוצר אלמנט פסקה חדש (`<p>`), וחילצה הערות מתוך הטקסט ישירות לתוך `footnoteQueueForPage` תוך קידום המונה הגלובלי `noteCounters.footnote++`.

#### התרחיש שבו היא נכשלה:
בסוף כל פרק, פונקציית האיזון `balanceColumns` מריצה לולאת בדיקה על עשרות נקודות פיצול אפשריות (`pointsToEvaluate`). בכל איטרציה, הפונקציה קראה ל-`renderSingleItemFast`, אשר יצרה אלמנטי `<p>` זמניים וקראה ל-`applyDelimiterStyles`.

#### תוצאת הכישלון:
אם היו 12 נקודות פיצול שנבדקו, אותה הערת שוליים בודדת הוכנסה **13 פעמים** לתור ההערות של העמוד. מונה ההערות זינק מ-1 ישירות ל-14, וההערה שוכפלה 13 פעמים בתחתית העמוד.

#### המסקנה והתיקון:
חל איסור מוחלט על פונקציות מדידה ואיזון לשנות את מצב המערכת (State Mutation). 
* נוסף פרמטר `isDryRun = false` לפונקציה `applyDelimiterStyles`. במצב `isDryRun = true`, נוצר סימון ויזואלי דמה לצורכי מדידת גובה בלבד, ללא גישה למונים ולתור.
* נוסף מנגנון **Snapshot & Rollback** ב-`balanceColumns`: לפני ביצוע בדיקות האיזון נשמר מצב התורים והמונים, ומשוחזר במדויק לפני הרינדור הסופי (`appendItemFinal`).

---

### 3.2. דליפת מצב בין רינדורים עוקבים (Lack of Global State Reset)

#### הגישה הראשונית:
המונים `noteCounters = { footnote: 0, endnote: 0 }` ותורי ההערות אותחלו רק בעת טעינת הקובץ (`window.onload`).

#### התרחיש שבו היא נכשלה:
בכל פעם שהמשתמש הקליד תו בתיבת הטקסט, שינה גודל גופן בסרגל הצד, או לחץ על "עדכן ועמד מחדש", הופעלה הפונקציה `typesetDocument()`. המונים המשיכו מהערך האחרון של הרינדור הקודם.

#### תוצאת הכישלון:
הערת השוליים הראשונה בספר קיבלה את המספר 1 בעימוד הראשון, 2 בעימוד השני, ו-150 לאחר מספר שינויי הגדרות.

#### המסקנה והתיקון:
`typesetDocument()` חייבת להיות פונקציה אטומית טהורה ביחס למצב הרינדור. בתחילת הפונקציה מתבצע איפוס מוחלט:
```javascript
noteCounters = { footnote: 0, endnote: 0 };
noteUidCounter = 0;
footnoteQueueForPage = [];
endnoteQueueForPart = [];
```

---

### 3.3. אלגוריתם מספור עברי מבוסס מודולו 22 שגוי (`toHebrewLetterSeq`)

#### הגישה הראשונית:
מימוש פונקציית אותיות באמצעות חלוקה ומודולו של מערך 22 אותיות האלפבית:
```javascript
function toHebrewLetterSeq(n) {
  let result = '', num = n;
  while (num > 0) { num--; result = HEBREW_ALEF_BET[num % 22] + result; num = Math.floor(num / 22); }
  return result;
}
```

#### התרחיש שבו היא נכשלה:
* ערך 15 הומר לאות ס' (האות ה-15 באלפבית) במקום **טו**.
* ערך 16 הומר לאות ע' במקום **טז**.
* ערך 23 הומר ל-"בא" במקום **כג**.

#### המסקנה והתיקון:
מספור עברי אינו מערכת ספירה פוליאדית בבסיס 22, אלא מערכת חיבורית אדיטיבית (Additive System / Gematria) בעלת כללים דקדוקיים ותרבותיים קשיחים. הפונקציה נמחקה והוחלפה ב-`toGematria(num)` התקנית.

---

### 3.4. כשל איפוס הערות שוליים בין עמודים (Builtin Footnote Reset Failure)

#### הגישה הראשונית:
הפונקציה `resetNoteCounterIfNeeded` רצה בלולאה אך ורק על מערך התוספים `importedTextStyles`:
```javascript
function resetNoteCounterIfNeeded(target, trigger) {
  importedTextStyles.forEach(inst => {
    if (inst.def.target === target) { ... }
  });
}
```

#### התרחיש שבו היא נכשלה:
כאשר המשתמש עבד עם הגדרות הבסיס של המערכת (ללא ייבוא תוסף JSON חיצוני), המערך `importedTextStyles` היה ריק (`[]`). כתוצאה מכך, הלולאה לא רצה מעולם.

#### תוצאת הכישלון:
הערות השוליים המשיכו להיספר ברצף לאורך כל הספר (א, ב, ג... בעמוד 1; ד, ה, ו... בעמוד 2) במקום להתאפס ל-א' בכל תחתית עמוד חדש כמקובל.

#### המסקנה והתיקון:
הגדרות הליבה (Core Defaults) של המערכת אינן תלויות בתוספים. נוספה התניה מפורשת המאפסת הערות מובנות לפי הגדרתן:
```javascript
if (target === 'footnote' && trigger === 'page') shouldReset = true;
if (target === 'endnote' && trigger === 'part') shouldReset = true;
```

---

### 3.5. איבוד מטא-דאטה של הערות סיום בעת איזון טורים

#### הגישה הראשונית:
בעת חילוץ אלמנטים ב-`balanceColumns`, הקוד קרא תכונות מה-DOM:
```javascript
let sideNote = child.getAttribute('data-side-note');
```
אך לא שמר את `data-end-note`.

#### התרחיש שבו היא נכשלה:
כאשר פסקה הכילה הערת סיום והייתה ממוקמת בסוף קטע שעבר איזון טורים, האלמנטים נבנו מחדש, ה-`endNote` נמחק, וסימון ההערה נעלם מגוף הטקסט.

#### המסקנה והתיקון:
כל מאפיין המוצמד לפסקה חייב לעבור סריאליזציה מלאה ל-DOM Data Attributes (`data-end-note`), ולהיקרא מחדש בעת פירוק והרכבה.

---

## 4. סטטוס קוד נוכחי ורכיבים מוכנים (Current Codebase State)

### 4.1. מפת פונקציות ומודולים מרכזיים

| שם פונקציה | תפקיד ואחריות | מנגנוני הגנה ומקרי קצה |
| :--- | :--- | :--- |
| `typesetDocument()` | מנהל העימוד הראשי (Controller) | איפוס מונים מוחלט, ניתוח טקסט, ניהול פאג'ינציה, רינדור שערים ותוכן. |
| `balanceColumns()` | אלגוריתם איזון שני טורים בסוף פרק | שימוש ב-Snapshot & Rollback, רינדור מדידה ב-`isDryRun`, יישור אנכי משלים. |
| `applyDelimiterStyles()` | מנוע סריקת תוחמים והזרקת סגנונות/הערות | הבחנה בין מצב ריצה יבש לאמיתי, טיפול בתוחמים חופפים, תמיכה ב-HTML Entities. |
| `getLinesFromParagraph()` | פירוק פסקה לשורות לפי גריד ב-`#measuring-box` | זיהוי פסקאות שורה אחת למניעת חלון מילה ראשונה שבור, שמירת מילים רציפה. |
| `toGematria()` | ממיר מספר שלם לאותיות עבריות תקניות | טיפול ייעודי ב-ט"ו/ט"ז, מאות מורכבות מעל 400. |
| `flushFootnotesInto()` | רינדור אזור הערות השוליים בתחתית עמוד | חישוב גובה דינמי, חלוקה לטורים בהערות, איפוס מונה העמוד. |
| `finalizeNotePositions()` | מניעת התנגשות אנכית של כותרות צד בשוליים | דחיקה אנכית למטה, העברת הערות צד לעמוד הבא במקרה של חוסר מקום. |
| `saveAsDefaultTemplate()` | סריאליזציה עצמית של המסמך לקובץ HTML | הזרקת State ל-Data Island, שימור כל שדות ה-Input וה-SVG שהוטמעו. |

---

### 4.2. קטעי קוד קריטיים ומוכנים לייצור (Production Snippets)

#### מנגנון הטיפול בתוחמי טקסט והערות שוליים (`applyDelimiterStyles`):
```javascript
function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt, isDryRun = false) {
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
        
        if (isDryRun) {
          // סימון דמה לצורכי מדידה בלבד - אינו משנה מונים ואינו מעדכן תורים
          const dummyMarker = document.createElement('a');
          dummyMarker.className = 'note-marker';
          dummyMarker.textContent = 'א';
          applyNoteMarkerStyle(dummyMarker, false);
          frag.appendChild(dummyMarker);
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

#### אלגוריתם המרת גימטריה מדויק (`toGematria`):
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

---

## 5. מקרי קצה שנבדקו ותורגמו לבדיקות (Edge Cases & Validation)

| מקרה קצה | התנהגות שגויה ללא טיפול | מנגנון הטיפול והפתרון שנבנה |
| :--- | :--- | :--- |
| **פסקה של שורה אחת עם מילה ראשונה מודגשת** | אלמנט ה-`float: right` שובר את גובה השורה והפסקה הבאה נשאבת לתוכו. | הפונקציה `getLinesFromParagraph` מודדת את מספר השורות; אם הוא $\le 1$, המחלקה משתנה מ-`first-word-window` ל-`first-word-inline`. |
| **הערת שוליים ארוכה התופסת את רוב שטח העמוד** | הטקסט של הטורים גולש מעבר למספר העמוד ולתחתית ה-A4. | פונקציית `getFootnotesReservedHeight()` דוגמת מראש את שטח ההערות ומפחיתה אותו ישירות מגובה הקיבולת של הטורים (`remPageHeight`). |
| **פסקה הנחתכת באמצע משפט במעבר טור** | השורה האחרונה נמתחת באופן מוזר או מתמרכזת בטעות. | החלק שנשאר בטור הימני מקבל מחלקת `p-cut` (`text-align-last: justify`), וההמשך בטור השמאלי מקבל `p-end` (`text-align-last: center`). |
| **כותרת הממוקמת בשורה האחרונה של הטור** | נוצרת כותרת יתומה (Orphan Heading) ללא טקסט מתחתיה. | מנגנון ה-Lookahead מזהה שנותרו פחות מ-$30\text{px}$ בטור ודוחה את הכותרת לראש הטור הבא. |
| **הערות צד רבות במקביל לפסקאות צפופות** | הערות הצד עולות זו על גבי זו בשוליים ויוצרות טקסט בלתי קריא. | `finalizeNotePositions` סורקת את ההערות מלמעלה למטה ודוחפת הערות חופפות מטה עם מרווח בטיחות של $6\text{px}$. |
| **שער משנה / פרק שנדרש להתחיל בעמוד אי-זוגי** | פתיחת פרק בעמוד שמאלי במקום ימני בדפוס דו-צדדי. | פונקציית `ensureOddPageStart(level)` בודקת האם `pageIndex % 2 === 0`, ומזריקה עמוד ריק (`blank-page`) במידת הצורך. |
| **ספר שלם ללא תוספי JSON חיצוניים** | מונים לא מתאפסים בין עמודים עקב הסתמכות על מערך תוספים ריק. | הוספת תנאי איפוס קשיח עבור מטרות ברירת מחדל (`target === 'footnote'`). |

---

## 6. מפת דרכים והצעדים הבאים (Roadmap & Pending Tasks)

### 6.1. משימות לפיתוח עתידי
1. **הערות שוליים רב-עמודיות (Multi-Page Footnote Splitting):**
   * *המצב כיום:* הערת שוליים חייבת להסתיים בעמוד שבו הופיע הסימון שלה.
   * *היעד:* כאשר הערת שוליים ארוכה מנפח העמוד, יש לפצל את גוף ההערה ולהעביר את המשכה לעמוד הבא תוך הוספת כותרת "(המשך)".
2. **עימוד מדורג מרובה-שכבות ("צורת הדף" / שולחן ערוך):**
   * *היעד:* מנוע המסוגל לחשב 3 מסגרות טקסט בעמוד בודד: טקסט ראשי במרכז (טור רחב/שני טורים), שני פירושים משני צדדיו, והערות ליקוטים בתחתית.
3. **ביצועים ומדידה ב-WebWorker / OffscreenCanvas:**
   * *המצב כיום:* מדידות הטקסט מתבצעות ב-DOM ב-`#measuring-box`. במסמכים מעל 100 עמודים נוצר עומס Reflow.
   * *היעד:* העברת אלגוריתם מדידת רוחב המחרוזות ל-`OffscreenCanvas.measureText()` ברקע באמצעות Web Worker.
4. **תמיכה מתקדמת ב-OpenType ובניקוד:**
   * *היעד:* הפעלת תכונות `font-feature-settings: "kern", "mark", "mkmk"` והבטחת מיקום מדויק של טעמי מקרא וניקוד בעת יישור אותיות רחבות (Rashi / Meruba).

---

### 6.2. הנחיות טכניות למפתח/AI הממשיך מכאן:
1. **שמירה על טהרת ה-State:** אסור בשום אופן לפונקציות עזר (`renderSingleItemFast`, `getLinesFromParagraph`, `measureNoteBlockHeight`) לקדם מונים גלובליים או לעדכן תורים פעילים. כל פעולת מדידה חייבת להתבצע ב-`isDryRun = true` או בסביבת Sandbox מבודדת.
2. **שינויים באיזון טורים:** בעת שינוי הלוגיקה ב-`balanceColumns`, יש לוודא תמיד ש-`blockNoteSnapshot` מופעל בתחילת הפונקציה כדי לשחזר את ה-State של העמוד למצבו המקורי לפני בדיקת נקודות הפיצול.
3. **הוספת סגנונות הערות חדשים:** כל סגנון סימון חדש (למשל כוכבית, אותיות סופיות, סוגריים עגולים) חייב להתווסף ישירות ב-`formatNoteMarker` ולקבל ייצוג מקביל ב-`applyDelimiterStyles` ובפאנל ההגדרות ב-HTML.
4. **תאימות הדפסה:** כל אלמנט חדש שמתווסף לגריד חייב לכלול מידות מוחלטות (`mm` / `pt`) או משתני CSS מנורמלים, תוך בדיקה תחת `@media print` כדי למנוע גלישת עמודים או שבירת שוליים.

---

## 📊 סיכום שיחה

- **סה"כ הודעות:** 13
- **פניות משתמש:** 4
- **תגובות AI:** 7
- **מודל:** `models/gemini-3.7-flash`
- **תאריך:** 2026-09-07
