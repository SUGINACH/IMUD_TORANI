# **מחקר מקיף: ארכיטקטורה, אלגוריתמיקה ושיטות מתקדמות לפתרון בעיות עימוד בספרות תורנית דו-טורית**

## **1\. מבוא: האנטומיה המורכבת של העימוד התורני בסביבת הדפדפן**

מלאכת עימוד הספרים היא דיסציפלינה המשלבת אסתטיקה חזותית, חוקיות הנדסית ואופטימיזציה אלגוריתמית. בעוד שעימוד ספרות כללית מסתמך על חוקים טיפוגרפיים אוניברסליים וגמישים יחסית (כגון חלוקת הברות ומיקוף), תחום עימוד הספרים התורניים מציג מערכת אילוצים ארכיטקטונית נוקשה בהרבה1. עימוד זה, הנטוע עמוק במסורת דפוסי ונציה, וילנא וליוורנו, מקדש את רציפות הטקסט, אוסר על עיוותו או חיתוכו השרירותי, ומחייב סנכרון הרמוני בין מספר זרמי טקסט (Streams) כגון גוף, מפרשים והערות שוליים באותו עמוד1.  
המעבר מפיתוח מערכות עימוד שולחניות עתירות משאבים (Desktop Publishing) דוגמת "תג" או Adobe InDesign למערכות מבוססות רשת (Client-side JavaScript) הפועלות בדפדפן, מציב אתגרי תוכנה חסרי תקדים. מנועי הרינדור המובנים של דפדפנים מודרניים תוכננו עבור זרימת תוכן דינמית (Reflowable content) ולא עבור פריסה נוקשה של עמודים מודפסים (Paged Media) התובעת רזולוציה מיקרו-טיפוגרפית4. לפיכך, בניית מנוע עימוד חישובי מבוסס DOM מחייבת תכנון מחדש של אלגוריתמים קלאסיים, התמודדות עם מגבלות ביצועים של ממשקי דפדפן (כגון Layout Thrashing), ופתרון פערי רינדור תת-פיקסליים הנגזרים ממערכות הפעלה שונות5.  
מחקר זה סוקר בצורה מקיפה וביקורתית את השיטות המקובלות באקדמיה ובתעשייה לפתרון בעיות עימוד הליבה: איזון טורים, שליטה ביתומים ואלמנות, כיווץ שורות דלילות, ומציאת נקודות חיתוך אופטימליות, תוך ביצוע התאמה ייעודית לשפות הנכתבות מימין לשמאל (RTL) ותחת אילוצי הטקסט ההלכתי.

## **2\. סקירת ספרות: מנועי פריסה קלאסיים ומודרניים**

ההתמודדות עם שבירת פסקאות לשורות וחלוקתן לעמודים העסיקה חוקרי מדעי המחשב מראשית ימי הדפוס הדיגיטלי. הגישות השונות מציגות ספקטרום של פתרונות, החל מאופטימיזציה מתמטית גלובלית ועד למעקפי CSS חדישים.

### **2.1 אלגוריתם Knuth-Plass (מערכת TeX)**

נקודת הציון החשובה ביותר בטיפוגרפיה החישובית היא האלגוריתם שפותח על ידי דונלד קנות' ומייקל פלאס בשנת 1981 עבור מערכת TeX2. המודל מגדיר את הפסקה כרצף של אובייקטים מתמטיים:

* **תיבות (Boxes):** אלמנטים קשיחים (מילים או תווים) בעלי רוחב קבוע.  
* **דבק (Glue):** רווחים בעלי ערכי התרחבות (Stretchability) והתכווצות (Shrinkability) מוגדרים.  
* **קנסות (Penalties):** נקודות בהן ניתן לחתוך את השורה, המלוות ב"עלות" מסוימת (למשל, קנס על חלוקת מילה או קנס על יצירת אלמנה)2.

האלגוריתם מחשב עבור כל שורה פוטנציאלית מדד "גריעות" (Badness) — פונקציה המעריכה כמה נדרש למתוח או לכווץ את ה"דבק" כדי ליישר את השורה לרוחב הטור. פונקציית העלות הכוללת (Demerits) משקללת את ה-Badness, את הקנס הנקודתי של נקודת החיתוך, וקנסות נוספים על חוסר אחידות בין שורות עוקבות8. הנוסחה הבסיסית להערכת דמריטס לשורה היא לרוב: ![][image1], כאשר ![][image2] הוא ה-Badness ו\-![][image3] הוא ה-Penalty8. בשונה מאלגוריתמים "חמדנים" (Greedy) הממלאים כל שורה עד אפס מקום, Knuth-Plass מבצע סריקת תכנון דינמי (Dynamic Programming) על פני גרף מכוון חסר מעגלים (DAG) כדי למצוא את המסלול בעל העלות הכוללת המינימלית עבור הפסקה כולה9. מודל זה מונע את תופעת ה"נהרות" (Rivers of white) ומבטיח פיזור אחיד של רווחים10.

### **2.2 Adobe InDesign ומנועי הקומפוזיציה**

בתעשיית ה-DTP המסחרית, תוכנת InDesign נחשבת לסטנדרט דה-פקטו. המערכת כוללת שני מנועי פריסה עיקריים: Single-line Composer (המקביל לאלגוריתם חמדן) ו-Paragraph Composer, המהווה יישום קנייני המזכיר את עקרונות Knuth-Plass, הבוחן ריבוי שורות לפני קביעת נקודות השבירה11. עבור טקסטים עבריים, InDesign עושה שימוש ב-World-Ready Paragraph Composer, התומך בכיווניות מורכבת ומיקום ניקוד13. המערכת מטפלת בבעיות פריסה בעזרת מערך כללים נוקשה: תפריט ה-Keep Options מגדיר מניעת אלמנות ויתומים (Keep with next N lines, Keep lines together), אשר כופה על מנוע העימוד להעביר בלוקים שלמים של טקסט לטור או לעמוד הבא גם במחיר של השארת חלל ריק (Feathering space) בתחתית העמוד הקודם14. פתרון החלל הריק נעשה לעתים על ידי מנגנון Vertical Justification המשחק מעט עם הרווח הבין-שורתי (Leading)9.

### **2.3 תקני הרשת: CSS Multi-column Layout ו-Paged Media**

תקני ה-W3C פיתחו כלים לטיפול בטקסט במרחב הווירטואלי, כגון מודול ה-CSS Multi-column המציע את המאפיין column-fill: balance16. כאשר מאפיין זה מופעל, הדפדפן מחשב אלגוריתמית את חלוקת התוכן כך שגבהי הטורים יהיו שווים ככל האפשר4. אף שפתרון זה קל ליישום, הוא כושל במקרים של הקשרים מקוטעים (Fragmented Contexts) המאפיינים ספר מודפס4. למשל, בסוף עמוד (כאשר פסקה ממשיכה לעמוד הבא) הדפדפן אינו מאזן את הטורים בעמוד הנוכחי כראוי, אלא רק בפרגמנט האחרון של הבלוק4. נוסף על כך, תקן זה אינו מציע פתרונות מובנים לקונפליקטים מורכבים כמו כותרת החוצה טורים בשילוב הערות שוליים בתחתית כל טור בנפרד1.  
ספריות כגון Paged.js משמשות כ-Polyfill פתוח לתקן ה-CSS Paged Media, ומאפשרות יצירת PDF מתוך HTML18. בעוד Paged.js מספק מעטפת טובה לניהול שוליים וכותרות עליונות (Running headers), מנגנוני איזון הטורים והמנעות מיתומים ואלמנות בו מוגבלים לחוקי ה-CSS הבסיסיים (widows: 2, orphans: 2), ולעתים קרובות נכנסים ללולאות אינסופיות או קורסים כאשר הם מתמודדים עם ריבוי אילוצים (כמו הזרמת הערות צד במקביל לטקסט ראשי)18.

## **3\. ניתוח בעיות פריסה ופתרונות אלגוריתמיים**

כתיבת מנוע JS ייעודי מחייבת פירוק של בעיות הפריסה המסורתיות לפונקציות מתמטיות ולוגיות הניתנות ליישום על עץ ה-DOM, או מוטב מכך, על עץ וירטואלי מנותק מה-DOM (Virtual Layout Tree).

### **3.1 איזון טורים (Column Balancing)**

הדרישה המרכזית בעימוד תורני היא יצירת קו סיום אופקי מדויק בתחתית הטורים לפני סוף פרק, או לפני כותרת מרכזית רחבה (H3-span) החוצה את הטורים1.

#### **אלגוריתמיקה ושיטות מעשיות בסביבת JS**

במקום להישען על column-fill: balance הדפדפני הפגיע, מנוע יעיל יבנה אסטרטגיה תלת-שלבית (Three-Tier Column Balancing Engine) המסתמכת על יחידות אטומיות. טקסט הפסקה נמדד ומומר לרשימה שטוחה של "שורות פיזיות" וכותרות, שכל אחת מהן מהווה "יחידה אטומית" בעלת נתון גובה (![][image4]) קבוע1.

* **שלב 1: חיפוש חיתוך טבעי מושלם (Macro-Balancing).** המנוע סורק את מערך היחידות ומחשב בכל נקודת פיצול פוטנציאלית (בין פסקאות) את הגובה המצטבר בטור ימין (![][image5]) לעומת טור שמאל (![][image6]). המטרה היא למצוא נקודה ![][image7] בה ההפרש עונה לתנאי: ![][image8] (כאשר הסף מוגדר לרוב כ-24 פיקסלים, אזור גובהה של שורה אחת). אם נמצאה נקודה כזו, הפסקאות מועברות במלואן ללא צורך בחיתוך1.  
* **שלב 2: חיתוך פסקה על התפר (Micro-Balancing).** במידה ולא נמצא פיצול טבעי, המערכת בוחרת את הפסקה שחצתה את הגבול ומבצעת בה שבירת פסקה (p-cut). היא בוחנת העברת שורה אחר שורה אל טור שמאל, עד שהפרש הגבהים ימוזער. החלק שנותר בימין מקבל עיצוב מאולץ של יישור דו-צדדי בשורה האחרונה (text-align-last: justify) כדי למנוע חלל ריק בסוף הטור, בעוד החלק השמאלי שומר על מראה טבעי ממורכז (text-align-last: center)1.  
* **שלב 3: מיקרו-כוונון אנכי (Vertical Justification / Feathering).** לעתים נותר פער של 3-15 פיקסלים כתוצאה ממספר אי-זוגי של שורות. המערכת מחילה מערכת עדיפויות היררכית (P1-P5) לפיזור הפער:  
  * **P1:** שוליים עליונים מעל כותרות משנה.  
  * **P2:** שוליים תחתונים מתחת לכותרות משנה.  
  * **P3:** התרווחות בין פסקאות.  
  * **P4:** התערבות זעירה בגובה השורה (line-height) \- הוספת חלקי אחוז כדי למתוח את הטור הקצר1.  
  * **P5:** ריווח אותיות או מילים (המוצא האחרון).

#### **מקרי קצה באיזון**

* **פסקה אחת ענקית (Giant Paragraph):** מקרה בו פרק שלם מכיל פסקה אחת שזולגת על פני עמודים. האיזון כאן מתרחש אך ורק בשלב ה-Micro-Balancing. המערכת חייבת לוודא שהחיתוך אינו יוצר אלמנה או יתום, ובמידת הצורך לוותר על שורת איזון אחת (הפרש של שורה שלמה בין הטורים) כדי לשמור על תקינות המבנה1.  
* **טור שמאל ריק לחלוטין:** מתרחש לרוב בסוף פרק המכיל תוכן מועט. המערכת תבצע איטרציה (Reflow) ותאלץ משיכה של מחצית השורות לטור השמאלי, תוך יצירת מכולת גבול וירטואלית בגובה ![][image9]1.  
* **Overflow: Hidden תחת מסגרת A4:** כאשר כותרת ארוכה תופסת חלל רב, הטקסט תחתיה מתאזן, אך עלול לחרוג מהגובה הפיזי של מלבן ההדפסה. הפתרון דורש Look-ahead: גילוי החריגה טרם הפריסה, וזריקת הפסקה האחרונה לעמוד הבא טרם ביצוע האיזון מחדש.

### **3.2 מניעת יתומים ואלמנות (Widow/Orphan Control)**

המונחים המוכרים מטיפוגרפיה לועזית דורשים הבהרה אופרטיבית בתצורת RTL (ימין-לשמאל) בספרות הקודש הדו-טורית.

* **יתום (Orphan):** שורת פתיחה של פסקה חדשה, המוצגת לבדה בתחתית הטור הימני, בעוד המשך הפסקה עובר לטור השמאלי (או לעמוד הבא)1.  
* **אלמנה (Widow):** שורת סיום של פסקה, הגולשת לבדה לראש הטור השמאלי (או לעמוד הבא), כאשר תחילת הפסקה נותרה מאחור בטור ימין1.

קיומן של שורות אלו שובר את הבלוק החזותי ומקשה על הקריאה השוטפת. מערכת InDesign פותרת זאת בגישה קשיחה של "Keep with Next N lines", הכופה העברת בלוקים14. ב-TeX, מנגנון הקנסות משנה את פונקציית העלות כך שנקודת השבירה תזוז אחורנית7.

#### **פרקטיקות למערכת מבוססת DOM**

המנוע נדרש להריץ פונקציית תיקון (Curative function) על הטורים המלאים:

1. **זיהוי (Detection):** המערכת מזהה אובייקט חתוך (p-cut) וסורקת את מספר השורות שלו בכל טור.  
2. **מניעת יתום באמצעות נסיגה (Rollback):** אם בטור ימין יש רק שורה אחת מתוך הפסקה המפוצלת, המערכת מוחקת את השורה מתחתית טור ימין, ודוחפת את כל הפסקה לראש טור שמאל. פעולה זו משאירה מרווח של שורה בטור הימני, שיטופל בהמשך על ידי מנגנון האיזון האנכי (Feathering)1.  
3. **מניעת אלמנה באמצעות "גניבת שורות" (Push-forward):** אם בטור שמאל מופיעה שורה בודדת (שארית של הפסקה), המערכת חוזרת לטור הימני, מסירה את השורה האחרונה משם, ומעבירה אותה לשמאל. כעת הטור השמאלי מחזיק 2 שורות מינימום.

#### **מקרי קצה משולבים ושרשראות**

* **פסקה בת שורה אחת:** אינה יכולה להיות אלמנה או יתום בהגדרה, ואינה ניתנת לפיצול. המערכת תתייחס אליה כיחידה אטומית אחת.  
* **שרשרת אלמנות (Ripple Effect):** פעולת Push-forward מעבירה שורה מטור אחד לשני. טור שמאל כעת ארוך יותר ועלול לדחוק את הפסקה האחרונה בו לעמוד הבא, ובכך ליצור יתום חדש בתחתיתו. הפתרון האלגוריתמי מחייב בדיקת רקורסיה: ביצוע סימולציית העברה בעץ וירטואלי (Shadow DOM או מערך נתונים) כדי לבחון אם התיקון יצר שגיאה חמורה יותר. אם כן, האלגוריתם יאמץ אסטרטגיה של שבירת עמוד מוקדמת ופריסה מחדש של הבלוק כולו (Page Re-composition).  
* **אלמנה \+ הערת שוליים:** משיכת שורה מטור ימין לטור שמאל גוררת לעתים עוגן (Anchor) של הערת שוליים. הפעולה מעבירה גם את טקסט ההערה אל המכולה של הטור השמאלי, מה שמשנה את מאזן הגבהים הכללי בצורה דרסטית, ומחייב את הפעלת שלב האיזון מתחילתו.

### **3.3 שורות דלילות (Sparse Lines / Runts)**

השורה האחרונה בפסקה מקבלת בדרך כלל יישור טבעי. אולם, כאשר השורה האחרונה בפסקה חתוכה (p-cut) בסוף טור מורכבת ממילה אחת או שתיים, נוצר חלל פתוח המכונה "Runt". כאשר ה-p-cut מתרחש בסוף טור ימין (כאשר הפסקה ממשיכה משמאל), הכלל הטיפוגרפי מחייב הפעלת text-align-last: justify למניעת חלל. אם השורה מכילה מילה בודדת, ה-Justify ימתח אותה מילה לאורך כל רוחב הטור – תוצאה הרסנית מבחינה ויזואלית1.  
בטיפוגרפיה הלועזית, Runts מטופלים לרוב על ידי מיקוף מילים בשורות שמעל כדי לשנות את זרימת הטקסט. במסורת התורנית חל איסור על מיקוף, והפתרון חייב להישען על ריווח ו-Tracking.

#### **שיטות מעשיות (tightenRunts)**

הספרייה המחקרית postext הציגה מנגנון ריפוי הנקרא tightenRunts. המנגנון מזהה פסקאות בעלות מילה בודדת בשורתן האחרונה, ומפעיל לולאה המקטינה את מרווח האותיות (Negative Tracking, לדוגמה letter-spacing: \-0.15px) באופן הדרגתי על פני כל השורות בפסקה. המטרה היא "לשאוב" מילה מהשורה הקודמת אל השורה הדלילה (מה שיעבה אותה לשתי מילים או יותר) או לכווץ את הפסקה כולה כך שהמילה תעלה שורה אחת מעלה וה-Runt ייעלם1.  
בעולם מבוסס DOM, פעולה זו יכולה להתבצע כך:

1. זיהוי באמצעות סריקת רוחב השורה האחרונה (אם רוחבה קטן מ-30% מרוחב הטור).  
2. החלת מחלקה מסוימת של CSS המכווצת letter-spacing למינוס קל ו-word-spacing מצומצם.  
3. בדיקה מחודשת של גובה הפסקה. במקרים מסוימים (פסקה קצרה מאוד של 2-3 שורות), לרוב ה-Tracking לא יספיק לשאיבת מילה ללא יצירת צפיפות חריגה שקורא יבחין בה.  
4. **עדיפות נסיגה:** במקרה של כישלון ה-tighten, המערכת תעבור לגישת Word-spacing חיובי (הרחבת רווחים מזערית) כדי *לדחוף* מילה מהשורה שמעל מטה אל ה-Runt, ובכך לעבות את השורה האחרונה.

### **3.4 כותרות בתחתית טור והיררכיה מבנית**

שמירה על זיקה בין כותרת לפסקה העוקבת אחריה היא יסוד בהבנת הנקרא. כותרת המופיעה בתחתית הטור ללא טקסט עוקב ("כותרת אחרונה") או עם שורה אחת בלבד ("כותרת תלויה") היא כשל מערכתי1. אלגוריתמים דוגמת \\needspace במערכות מבוססות TeX מחשבים מראש את גובה הכותרת \+ גובה שתי השורות הבאות17. אם הסכום עולה על החלל הנותר בטור, מוכנס מעבר עמוד/טור מאולץ.  
בסביבת JS, יישום הפתרון דורש טיפול מקומי (Rollback): לאחר סידור הטור, המערכת בודקת את האובייקט האחרון בטור. אם מדובר באובייקט מסוג Heading (H4-H6), או אם אחרי הכותרת יש רק אובייקט line יחיד, המערכת מושכת את הכותרת לראש הטור הבא. הפעולה משאירה חלל בתחתית הטור הימני, מה ששוב מפנה אותנו למנגנון האיזון (Feathering) כדי לפזר מרווחים אנכיים בין הפסקאות בעמוד, או למרכז את הטקסט בעמוד כולו בצורה הרמונית.

### **3.5 ארכיטקטורה למציאת נקודות חיתוך אופטימליות (Look-ahead Break Points)**

בעת קטיעת פסקה ארוכה בין שני עמודים או טורים, אלגוריתם חמדן (Greedy) יחתוך אותה במקום הראשון שממלא את הטור במלואו10. גישה זו עיוורת לחלוטין למה שיקרה להמשך הפסקה בעמוד הבא (אשר עלול להיות Runt בודד או אלמנה).  
אלגוריתם אופטימלי, בהשראת Knuth-Plass, חייב ליישם פונקציית Look-ahead.**פסאודו-קוד קונספטואלי לקבלת החלטת חיתוך:**

JavaScript  
function findOptimalBreakPoint(paragraphLines, availableSpace) {  
    let bestBreak \= \-1;  
    let minDemerits \= Infinity;

    // סרוק את כל אפשרויות החיתוך השומרות על הטור במסגרת המקום הפנוי  
    for (let i \= 0; i \< paragraphLines.length; i++) {  
        let currentHeight \= calculateHeight(paragraphLines.slice(0, i));  
          
        if (currentHeight \> availableSpace) {  
            break; // חרגנו מגבולות הטור  
        }

        let demerits \= 0;  
        let linesInLeft \= i;  
        let linesInRight \= paragraphLines.length \- i;

        // קנס על יתום  
        if (linesInLeft \=== 1) demerits \+= 10000;  
        // קנס על אלמנה בטור העוקב  
        if (linesInRight \=== 1) demerits \+= 10000;  
        // קנס על דלילות (Runt) בשורת התפר (במידה וזה הטור הראשון)  
        if (isRunt(paragraphLines\[i \- 1\])) demerits \+= 5000;  
        // קנס על חלל ריק בתחתית הטור (Badness)  
        let spaceLeft \= availableSpace \- currentHeight;  
        demerits \+= Math.pow(spaceLeft, 2); 

        if (demerits \< minDemerits) {  
            minDemerits \= demerits;  
            bestBreak \= i;  
        }  
    }  
      
    // במידה ולא נמצאה שבירה חוקית, הפעל מנגנוני נסיגה או דחיפה מאולצים  
    return bestBreak;  
}

יישום לוגיקה זו כמעט ומעלים את הצורך בתיקונים רטרואקטיביים (Rollbacks), שכן נקודת החיתוך נבחרת מלכתחילה כדי למזער את הבעיות.

## **4\. מקרים משולבים: תרחישי התנגשות קונפליקטים (Whack-a-Mole)**

האתגר האינטלקטואלי והטכני הגדול ביותר בעימוד ממוחשב הוא ההתמודדות עם התנגשויות אילוצים. במקרים אלו, תיקון של שגיאה טיפוגרפית אחת יוצר שגיאה אחרת, מצב הידוע כ"הכאת בעיות" (Whack-a-Mole).

### **4.1 קונפליקט: אלמנה מול דלילות ואיזון**

פסקה ארוכה נחצית בין טורים. האלגוריתם מזהה בטור השמאלי "אלמנה" (שורה בודדת מראשית הפסקה). מנגנון ה-Push-forward מופעל, חוזר לטור הימני (הקודם), שואב את השורה האחרונה ומעביר אותה לטור השמאלי כדי לתקן את האלמנה. אך כעת, השורה שהפכה להיות השורה האחרונה בטור הימני היא שורה דלילה בת מילה אחת (Sparse p-cut). איסור הדלילות ב-p-cut מחייב מתיחה מלאה (justify), אשר תיצור רווחים מפלצתיים בין אותיות המילה הבודדת לבין עצמה. יתר על כן, העברת השורה לטור שמאל שינתה את גובה הטורים (ימין התקצר, שמאל התארך), מה שמחריב לחלוטין את פעולת ה-Column Balancing שבוצעה קודם לכן.

### **4.2 מנגנון הרזולוציה ומטריצת העדיפויות**

כדי לפתור לולאות אינסופיות אלו, המערכת דורשת מודל אקסקיוטיבי מובהק. פתרון מתקדם בסביבת תכנות אסינכרונית יבצע בנייה וירטואלית ויעריך את התרחיש כולו תוך שימוש במטריצת עדיפויות נוקשה:

1. **הפרדה מבנית קריטית (No Content Loss):** אין לדרוס טקסט תחת שום תנאי.  
2. **מניעת יתום/אלמנה:** מקבלת את הקנס העליון (דירוג אסתטי עליון בעולם התורני).  
3. **מניעת כותרת תלויה:** חובה להפריד כותרת לטור הבא.  
4. **איזון טורים:** גובה זהה בתחתית העמוד.  
5. **מניעת שורות דלילות:** טיפול ב-Tracking עד גבול מסוים.

**סדר הפעולות (Execution Pipeline) להתמודדות עם הקונפליקט:**

1. המערכת תעריך מראש את החיתוך (Look-ahead). אם זיהתה שהחיתוך יוצר אלמנה, היא תעביר שורה.  
2. היא תבדוק את ה-Runt בימין. אם אכן נוצר Runt, היא תנסה להפעיל עליו Tracking (ריווח) על כל המחצית הימנית של הפסקה. אם זה כשל, היא לא תעביר שורה אלא *תמשוך את האלמנה חזרה לימין* תוך צמצום הפסקה כולה בטכניקת tightenRunts, בתקווה להעלים את שורת האלמנה לחלוטין22.  
3. אם הכל נכשל – וזהו המקרה הקיצוני – המערכת "תשבור את הכלים": היא תעביר את כל החצי הימני של הפסקה לטור השמאל (או לעמוד הבא), ותשאיר את הטור הימני קצר באופן חריג. על הפער היא תפצה בהרחבת line-height על כל העמוד כדי להסוות את קוצרו של הטור, במחיר טיפוגרפי קל.

### **4.3 שילוב עם הערות שוליים**

בטקסט תורני, כל מילה עשויה לכלול ציוני מקור (כותרת 7 / Marginalia). משיכת מילה לפתרון בעיות מעבירה יחד איתה את הערת השוליים אל הטור הבא1. מעבר זה יכול להקטין את מקום הטקסט בטור השני ולדחוק פסקאות שלמות החוצה. ניהול זה דורש מעגל מדידה כפול: כל שורת טקסט המועברת נבדקת תחילה האם היא מכילה הפניות. אם כן, מחשבים את גובה הפניות (Notes height) ומוודאים שהטור היעד יכול להכיל את שתיהן.

## **5\. אתגרים ייחודיים לטקסט תורני, כיווניות (RTL) וטיפוגרפיה מסחרית**

התאמת המערכת לשפה העברית ובמיוחד לספרות הקודש אינה מסתכמת בשינוי כיוון הטקסט (Direction: rtl). היא דורשת כיול עדין של מנגנוני הליבה מול מאפייני המחשב הלקוח.

### **5.1 איסור שינוי התוכן ואילוצים תורניים**

בשונה מפרקטיקות לועזיות שבהן מניפולציית טקסט מקובלת (הוספת מקפים, פיצול מילים בסוף שורה), טקסט קודש נחשב לישות שאין לשנותה1. משיכת מילים מלאכותית בין טורים או קיצורים נחשבים לפגם משמעותי. חוסר יכולת המיקוף בעברית משמעו שיישורים דו-צדדיים (text-align: justify) נוטים ליצור "נהרות של לובן" בקלות רבה יותר מאשר באנגלית10. הפתרון האפשרי היחיד ברמת הגליפים, כאשר קיימת תמיכת גופן מורחבת (OpenType Features), הוא שימוש בחלופות של "אותיות מתארכות" או רחבות (Swash variants), המאפשרות למלא את השורה באופן טיפוגרפי טבעי ולא באמצעות ריווח מאולץ של תווי הרווח1.

### **5.2 הבדלי פלטפורמות, מסך מול הדפסה ורינדור תת-פיקסלי (Subpixel Rendering)**

אתגר הנדסי אדיר במערכות Client-Side הוא חוסר האחידות ברינדור הגופנים בין מחשבים ודפדפנים6. מדידת רוחב של מילה או שורה תלויה במנוע הקומפוזיציה של מערכת ההפעלה (DirectWrite ב-Windows, CoreText ב-Mac)6. גופנים מסחריים (woff2) מכלכלים מדדי Ascender, Descender ו-Line-gap שונים לעתים קרובות מאלו של גופני חינם ב-Google Fonts, ומנועי מערכת ההפעלה עשויים לעגל חישובי שברים (Subpixels) בצורה שונה6.  
לדוגמה, שורה שרוחבה חושב כ-268.75 פיקסלים עשויה להיות מעוגלת למעלה במערכת אחת (ולהישבר מילה אחת קדימה, מה שיהרוס לחלוטין את איזון הטורים שנבנה בקפידה) ולמטה במערכת אחרת6. בנוסף, קיים פער ממשי בפירוש היחידות בין מסך למדפסת (@media print). מסכים משתמשים ביחס של 96 DPI, בעוד הגדרות הדפסה יכולות להסתמך על 72 DPI (כאשר 1 פיקסל \= 1 נקודה)26. פערי ה-DPI גורמים לשבירות שורות שונות בתכלית בעת לחיצה על "הדפס ל-PDF".

#### **פתרון ה-Off-DOM Canvas Measurement**

כדי לנטרל את אי-היציבות ולהאיץ ביצועים, גישות מודרניות כגון אלו המיושמות בספריות מתקדמות (דוגמת Pretext) נוטשות את השימוש בפונקציות DOM יקרות כגון getBoundingClientRect או קריאת offsetWidth המאלצות את הדפדפן להריץ חישובי Layout חוזרים ונשנים5. במקום זאת, מבוצע שימוש אגרסיבי בפונקציה canvas.measureText(). ממשק זה פונה ישירות למנוע הפונטים (Font Engine) ומחזיר רוחב שבר אבסולוטי ומדויק של כל מחרוזת, מבלי לייצר Reflow בדפדפן5.  
**פסאודו-קוד למדידה מנותקת מ-DOM להאצת ביצועים:**

JavaScript  
const canvas \= document.createElement("canvas");  
const context \= canvas.getContext("2d");  
context.font \= "16px 'Vilna', serif"; // גופן מסחרי רשום

function measureTextWidthFast(textSegment) {  
    // הפונקציה מודדת בדיוק עילאי את מחרוזת הטקסט מחוץ לעץ המסמך  
    // ומונעת לחלוטין Layout Thrashing שקורה בשימוש ב-DOM  
    const metrics \= context.measureText(textSegment);  
    return metrics.width;   
}

באמצעות שמירת ערכי הרוחב במטמון (Width Caching), מנוע העימוד יכול להריץ את אלגוריתם Knuth-Plass כולו באופן חישובי טהור וסינכרוני, להרכיב את הטורים בזכרון הווירטואלי, ורק בסוף להזרים אותם במכה אחת (Batch Render) אל ה-DOM5.

## **6\. השוואת ארכיטקטורות ומנועים לגיבוש פתרון אופטימלי**

בבואנו לתכנן את הפתרון האולטימטיבי למערכת רשת עברית, יש לסקור את היתרונות והחסרונות של המערכות הקיימות אל מול אלטרנטיבות ב-JS.

| טכנולוגיה / ארכיטקטורה | מניעת יתומים ואלמנות (Widow/Orphan) | כותרות החוצות טורים (Span) | טיפול בהערות שוליים ו-RTL | רלוונטיות למנוע JS מבוסס דפדפן |
| ----: | ----: | ----: | ----: | ----: |
| **מערכת "תג" המסורתית** | שליטה מלאה באמצעות לולאות תיקון ואלגוריתמי עזר. קנסות מדויקים להפליא. | טיפול מובנה וחזק במיוחד במערכת רב-טקסט. מתמודד היטב מול פריסות מורכבות1. | תמיכה אבסולוטית ב-RTL ובהערות רצות (CheckEnd). | מנוע בינארי סגור. מהווה קו אופק ומודל השראה לוגי למערכת שתפותח. |
| **Adobe InDesign** | מנגנון Keep Options איכותי. שימוש מבוקר ברווחים (Feathering)14. | נתמך (Span Columns), אך לעתים משבש איזון דפים עם הערות1. | בעל באגים ידועים עם טקסט RTL ושבירות אולצוֹת (Forced line breaks)13. דורש סקריפטים כבדים1. | מהווה תבנית לעקרונות עדיפויות (P1-P5) אך אינו מבוסס דפדפן. |
| **W3C CSS Multicol / Paged.js** | תמיכה בסיסית של הצהרות CSS. קורס תחת קונפליקטים מורכבים (כותרת+איזון+אלמנה)4. | תומך ב-column-span: all, אך מפר לעתים את איזון השוליים בסופי עמוד4. | יכולת ההערות מוגבלת ולא מאפשרת הזרמת טורים א-סימטרית. | מספק פוליפיל טוב להדפסה, אך כושל במיקרו-טיפוגרפיה ובאיזון דו-טורי חכם. |
| **מנוע חלוקה מבוסס JavaScript טהור** | ניתן ליישום באמצעות Look-ahead ו-Rollback על עץ וירטואלי (Canvas/Math metrics)5. | שליטה ידנית מלאה בעץ ה-DOM, מאפשר סגירת טורים ופתיחתם מחדש מתחת לכותרת כרצון המפתח1. | שליטה גמורה. מיקום אבסולוטי של הערות לצד שורות הטקסט הרלוונטיות. | **הפתרון הנבחר.** דורש בניית מנוע לוגי עצמאי כדוגמת "Pretext", ומציע מהירות ושליטה חסרת תקדים5. |

## **7\. פשרות תכנוניות: איכות עימוד לעומת מהירות עיבוד (Trade-offs)**

ביצוע אופטימיזציה גלובלית נוסח Knuth-Plass ב-JavaScript דורש משאבי חישוב. אלגוריתם קנות'-פלאס הבסיסי מוגדר כ\-![][image10] ועלול לרוץ לאט במיוחד על פרקים ענקיים הנמדדים בעשרות אלפי מילים.  
לפיכך, יש להגדיר פשרות וכללי חיתוך. **1\. אופטימיזציה מקומית (Windowing):** החלת אלגוריתם כבד רק ברמת הפסקה (Paragraph-level) עבור חלוקת שורות, ולא ברמת המסמך כולו. שבירת העמודים והטורים תיעשה באופן חמדן יחסית, עם חלונות הסתכלות (Look-ahead) צרים של 2-3 פסקאות קדימה, במקום לחשב מסלול עבור הספר כולו. זה מבטיח כי זמן הרינדור (במנוע דפדפן סינכרוני או דרך requestAnimationFrame) לא יעלה על עשרות מילי-שניות בודדות לעמוד1. **2\. שימוש במטמון רוחבים (Width Caching):** כל מילה או הברה המחושבת ב-measureText נשמרת בזיכרון המטמון. כאשר הדפדפן מחשב שוב את הטקסט בעת שינוי גודל חלון או שוליים, המערכת שולפת נתונים ממערך (Float32Array) ופועלת במהירויות שיא של פחות ממילי-שנייה אחת5. **3\. מניעת MutationObserver לדריסות:** ניטור שינויי DOM שגורם לעימוד אוטומטי (rebalance) עלול להיכנס ללולאת אינסוף עם פונקציית העימוד עצמה המעדכנת את ה-DOM1. שימוש בטכניקת Debounce (השהייה) מבטיח שהעימוד ייכנס לפעולה רק לאחר שהמשתמש סיים אינטראקציה, ושומר על ממשק חלק.

## **8\. מסקנות ומפת דרכים לפיתוח (Roadmap)**

ניתוח מורכב זה מדגים כי פיתוח מנוע עימוד תורני בסביבת הדפדפן הוא אתגר פתיר, בתנאי שנוטשים את ההישענות העיוורת על מנועי הפריסה של ה-HTML/CSS ועוברים לתהליך הרכבה (Composition) אלגוריתמי טהור.  
**תשובות ממוקדות לשאלות המחקר:**

1. **אלגוריתם מקובל:** Knuth-Plass הוא אכן הסטנדרט המדעי באקדמיה, אולם InDesign ביסס גישות מסחריות כגון Adobe Composer המתאימות את הרעיונות לביצועים מהירים על מעבדים גרפיים ותצוגה ווקטורית. בפיתוח הדפדפן שלנו, שימוש בעקרונות ה-Penalties של Knuth-Plass על מערך מדידות מנותק-DOM הוא הפתרון האולטימטיבי5.  
2. **InDesign מול TeX:** אינדיזיין מעדיף אילוצי חלוקת שורות נוקשים (Keep Options) המעבירים בלוקים שלמים ומתקנים באמצעות מרווחי שורות ופסקאות. TeX מחשב מחדש את שבירת השורות של כל הפסקה באמצעות \\widowpenalty כדי למנוע את המצב מלכתחילה8.  
3. **שורות דלילות:** הדרך הטובה ביותר מבלי לשנות תוכן בעברית היא אלגוריתם ה-tightenRunts (צמצום Tracking) ובמידת הצורך loosenRunts לדחיפת תוכן, בטולרנס מחושב מראש1.  
4. **אופטימיזציה גלובלית:** תאורטית אפשרית, אך דורשת כוח עיבוד. הגישה המעשית היא שילוב: אופטימיזציה של שבירת שורות ברמת הפסקה מול אסטרטגיה חמדנית מבוקרת (Look-ahead) ברמת העמודים לחסכון ב-CPU10.

**מפת דרכים מעשית להמשך הפיתוח:**

1. **הטמעת מנוע מדידה וירטואלי (Canvas API):** הסבת כל פעולות המדידה במערכת (רוחב הטורים, רוחב מילים) מ-getBoundingClientRect למערכת ניהול מטמון של שברי-פיקסלים באמצעות Canvas, מה שיבטיח אחידות בין מצב עריכה ליצוא להדפסה5.  
2. **בניית מטריצת העדיפויות:** מיסוד פונקציית פתרון ל-Whack-a-Mole אשר תדרג פעולות פותרות בסדר הבא: א. חלוקת מרווחי Margin כפיצוי גובה (Feathering), ב. הפעלת מניפולציית Tracking על Runts מורכבים, ג. נסיגת אלמנות מבוקרת תוך שבירת איזון חלקית באישור המשתמש.  
3. **גישור פערי ההדפסה:** יצירת פונקציית Normalization שממירה פיקסלים של המסך לנקודות DTP תקניות (72 או 96 DPI) על מנת להבטיח שבייצוא למדפסת ו-PDF הטורים יישמרו על האיזון הדקדקני שחושב על ידי JavaScript בסביבת המסך26.

מעבר לגישה חישובית ווירטואלית ומימוש לוגיקת קנסות יהפוך את כלי ה-JavaScript מכלי עזר פשוט למכונת עימוד (Desktop Publishing Engine) של ממש, המסוגלת להפיק ספרי קודש באיכות שוות ערך לתוכנות מסחריות, תוך שמירה על יתרונות הענן ונגישות ללא התקנה.

#### **רשימה ביבליוגרפית**

> 1. תכנית ליצירת מערכת עימוד תורני.md, [https\://drive.google.com/open?id=1PHYJkGW3WZxUbqsQvbdhRib6TX2I-sHi](https://drive.google.com/open?id=1PHYJkGW3WZxUbqsQvbdhRib6TX2I-sHi)  
> 2. Line Breaking \- Annon Inglorion, [https\://inglorion.net/documents/essays/line\_breaking/](https://inglorion.net/documents/essays/line_breaking/)  
> 3. תוכנות העימוד – תג / אינדיזיין \- עימוד ועיצוב המפואר, [https\://imud.co.il/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9E%D7%99%D7%95%D7%97%D7%93-%D7%9C%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%95%D7%9E%D7%95%D7%A6%D7%99%D7%90%D7%99-%D7%A1%D7%A4%D7%A8%D7%99%D7%9D/%D7%AA%D7%95%D7%9B%D7%A0%D7%95%D7%AA-%D7%94%D7%A2%D7%99%D7%9E%D7%95%D7%93-%D7%AA%D7%92-%D7%90%D7%99%D7%A0%D7%93%D7%99%D7%96%D7%99%D7%99%D7%9F/](https://imud.co.il/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9E%D7%99%D7%95%D7%97%D7%93-%D7%9C%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%95%D7%9E%D7%95%D7%A6%D7%99%D7%90%D7%99-%D7%A1%D7%A4%D7%A8%D7%99%D7%9D/%D7%AA%D7%95%D7%9B%D7%A0%D7%95%D7%AA-%D7%94%D7%A2%D7%99%D7%9E%D7%95%D7%93-%D7%AA%D7%92-%D7%90%D7%99%D7%A0%D7%93%D7%99%D7%96%D7%99%D7%99%D7%9F/)  
> 4. Spanning and balancing columns \- CSS \- MDN Web Docs, [https\://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol\_layout/Spanning\_balancing\_columns](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout/Spanning_balancing_columns)  
> 5. Pretext vs DOM Layout: Real-World Performance Benchmarks, [https\://www\.pretext.cool/blog/pretext-vs-dom-benchmarks/](https://www.pretext.cool/blog/pretext-vs-dom-benchmarks/)  
> 6. getClientRects Measures Text in Subpixels, and the ... \- scrapfly.dev, [https\://scrapfly.dev/posts/clientrects-freetype-os-fingerprint/](https://scrapfly.dev/posts/clientrects-freetype-os-fingerprint/)  
> 7. alex-panda/KnuthPlassLinebreak \- GitHub, [https\://github.com/alex-panda/KnuthPlassLinebreak](https://github.com/alex-panda/KnuthPlassLinebreak)  
> 8. Why exactly are badnesses squared in the calculation of demerits?, [https\://tex.stackexchange.com/questions/728790/why-exactly-are-badnesses-squared-in-the-calculation-of-demerits](https://tex.stackexchange.com/questions/728790/why-exactly-are-badnesses-squared-in-the-calculation-of-demerits)  
> 9. Line-breakings, directed acyclic graphs and matrix fun \- Medium, [https\://medium.com/code-and-coffee/line-breakings-directed-acyclic-graphs-and-matrix-fun-or-the-knuth-plass-algorithm-5c008b0b31bb](https://medium.com/code-and-coffee/line-breakings-directed-acyclic-graphs-and-matrix-fun-or-the-knuth-plass-algorithm-5c008b0b31bb)  
> 10. Line Breaking: Type and image with JavaScript Canvas, [https\://www\.emergentmind.com/visualizations/knuth-plass-justification](https://www.emergentmind.com/visualizations/knuth-plass-justification)  
> 11. Layout \- Online Documentation Portal, [https\://pubassist-docs.paratext.org/articles/pa-6-1-user-manual/jobspecs-layout/a/h2\_990526317](https://pubassist-docs.paratext.org/articles/pa-6-1-user-manual/jobspecs-layout/a/h2_990526317)  
> 12. What is the difference between InDesign Paragraph composer and, [https\://graphicdesign.stackexchange.com/questions/59050/what-is-the-difference-between-indesign-paragraph-composer-and-single-line-compo](https://graphicdesign.stackexchange.com/questions/59050/what-is-the-difference-between-indesign-paragraph-composer-and-single-line-compo)  
> 13. World-Ready Composer in InDesign \- Adobe Help Center, [https\://helpx.adobe.com/indesign/desktop/language-and-proofing/language-settings/adobe-world-ready-composer-overview.html](https://helpx.adobe.com/indesign/desktop/language-and-proofing/language-settings/adobe-world-ready-composer-overview.html)  
> 14. Keep with Next \- Certent CDM, [https\://docs.certentcdm.insightsoftware.com/hc/en-us/articles/30599565246349-Keep-with-Next](https://docs.certentcdm.insightsoftware.com/hc/en-us/articles/30599565246349-Keep-with-Next)  
> 15. Adobe InDesign 'The Next Paragraph Style' \- Greta Powell, [https\://www\.gretapowell.com/adobe-indesign-keep-with-next/](https://www.gretapowell.com/adobe-indesign-keep-with-next/)  
> 16. column-fill CSS property \- MDN Web Docs \- Mozilla, [https\://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/column-fill](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/column-fill)  
> 17. CSS Multi-column Layout Module Level 2 \- W3C, [https\://www\.w3.org/TR/css-multicol-2/](https://www.w3.org/TR/css-multicol-2/)  
> 18. GitHub \- fiduswriter/paged-with-floats: Applies CSS for paged medi, [https\://github.com/fiduswriter/paged-with-floats](https://github.com/fiduswriter/paged-with-floats)  
> 19. paragraf, [https\://kadetr.github.io/paragraf/](https://kadetr.github.io/paragraf/)  
> 20. Is there an automatic way to justify a text vertically? \- TeX, [https\://tex.stackexchange.com/questions/503631/is-there-an-automatic-way-to-justify-a-text-vertically](https://tex.stackexchange.com/questions/503631/is-there-an-automatic-way-to-justify-a-text-vertically)  
> 21. The ε-TEX manual, [https\://mirror.gutenberg-asso.fr/tex.loria.fr/moteurs/etex2\_man.pdf](https://mirror.gutenberg-asso.fr/tex.loria.fr/moteurs/etex2_man.pdf)  
> 22. تقسيم الكلمات وضبط الأسطر \- Postext, [https\://postext.dev/ar/docs/justification](https://postext.dev/ar/docs/justification)  
> 23. 断词与两端对齐— Postext, [https\://postext.dev/zh/docs/justification](https://postext.dev/zh/docs/justification)  
> 24. תוכנת תג \- מה עושים הקישורים בתוכנת תג \- YouTube, [https\://www\.youtube.com/watch?v=IA0kuSSW77c](https://www.youtube.com/watch?v=IA0kuSSW77c)  
> 25. OpenType \- Wikipedia, [https\://en.wikipedia.org/wiki/OpenType](https://en.wikipedia.org/wiki/OpenType)  
> 26. PX to PT Converter \- Design Your Way, [https\://www\.designyourway.net/blog/px-to-pt-converter/](https://www.designyourway.net/blog/px-to-pt-converter/)  
> 27. Element: getBoundingClientRect() method \- Web APIs | MDN, [https\://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)  
> 28. How Pretext Works: prepare() and layout() Explained, [https\://www\.pretext.cool/blog/how-pretext-works/](https://www.pretext.cool/blog/how-pretext-works/)  
> 29. InDesign Middle Eastern 2024 Bug: RTL paragraph becomes LTR, [https\://community.adobe.com/questions-671/indesign-middle-eastern-2024-bug-rtl-paragraph-becomes-ltr-after-inserting-forced-line-break-885895](https://community.adobe.com/questions-671/indesign-middle-eastern-2024-bug-rtl-paragraph-becomes-ltr-after-inserting-forced-line-break-885895)  
> 30. Basic concepts of grid layout \- CSS \- MDN Web Docs, [https\://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid\_layout/Basic\_concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAAAVCAYAAABCDNzQAAAFOklEQVR4Xu2aa6htUxiGX6GIXDpyCekcB7mU5FJySXLNJbnEQVJyCT+cowjJLgk5Se6JhPCDktz+iK0U5XR+HZFLHRL5gRIKuXzP/uawxhxrrLXnHGuui3P2W297rTnmWnvMb7zj+95v7C0tYQlL2CRxkPHBiryeRexlvMv4qPF44xb14f8/tjTurNl+sMXmeJjxBvl9xxi/Nh5bu2P6QEh3GLc17mf8zHhx7Y4OsJNxmQYHapzYWr5Tzk0HDNsbd5Uv0KRADIgFMUmv32hcXb1OcbPxS+Nuxq2MLxufrN0xfZxl/Nl4aPWeuL9t3O6/O0bAlca/jP9oeg/OAt2v+gJRIr6Qz+tj4y7R2Dhxu/EP+e8l0CkQ/rPG89IB+RyPkj/HNsY35OWuLU407pte7AiIhqzJcwDmxzyZbyc40vib8ZJ0YAI42PiRcXk6IC8pjD2vfCYYF06Sb7Cz04EKhxg/MO6dDkQ4XJ6lKH1tQYYjg4wbzH+DBj9nERDRr/IATBII5OGKObEcaPzBeHU60ABr1UvlbcFifmdckQ5UoIS9aJxLrgfsaHzBeHQ60BCTEBOZ6QHjBcrHvgh80dOabCkJ2FNuAMkEOSDyP1VmYh9S2eYI5Wle7tcGgbmRNcmeMRDSffKNgOgwuW0xbjEhpFvl5RQwR+ZaBL7sCOMpcndPUBBUZwptCEREKWAOOVDPS0VeKiYEvtF4t3F/4znGPeIbKpD1vpJbhADiSqdERuIz+Cc8aVuUimkH4+nqlV/8EWtMHEIDwxpfJ/9+5niA8Zbqemugxs/lpheymPiDklIyKgjavPIZIPglOqKSXVMqJgT+t1wodxqvkWfPtNNkIbgnvn6F3LjHTD/XBCViotV/RJ5xvjXeI48dGZSfT8jFfoJ6DVcgn2kNdsr3xgur96jxXi3ul1Ya18nPTZpy1cInh+MZDRbLKH4JlIqJhSTYcbfGPOdVFz2vucb9pThNvpnT2P1i/DFzfb08W+bAJrhNvbjRmSMwQPb8qbqnE1DLP6zIazBNvwRYJJhDU7+ExyFLpHzKeGrm+jINTunhbGhedeEwR7JQXO6CmHLHB6OiJDNdLk8WdGZshlg4xJBYromujYSQvuOHD6VkGn4JDBNTU790vjyFp/zU+ErmOuk/PYwMCH4pPhsKMQqHkQFBTOM4mysRUwDru1H+LAFk99KSmwUTREyxYikDlLjFSgnmjVPodJcPY84HpRgkplH9EigpcyEecdBD2eAoIJ5LF2VuEErFhOHmNDuOW8i2PAPP0gmYYHyMDiglHFZSU/FRsU+IwSTPkGeBpmwycXZR7ig/9kt0G3iBtigVE94k/tz1xt+Nx0XXQBB8Z6UjQqmYVsjPx2KBLzd+Y3xM5RuzD5g9TF0I1D7yLgUvQCtJ8JsIoEsgllwpo71lAan11xovqg83QomYCDzlMfg0YvSJ8Sb12wCOMyh9nZnaCKViwi9Rzuaq98yZjnSD/Fk6A23hWuP78tLymjwTsRPflP+1Ow3YuMFic0yRipiSSufyrvE59RqGNigRE8+PeOlcMfAIicyU+yMzgmMjxN6kLVapv2Mb1s0xr5ULn8yDTE/XRpP1kvE9eYnbPb6pS6T/HUA3FL+fJEKHSblNgfgRFT9LUCKmAGKC2R72u+fU76OmieDhOL3nSIA1beJbNylcKs+M4UykK5ypeivfJViod9Tvo6aJnF/a7MDued14cjoww2ADPK7hmWuSIIZXyf3SZRp89LFZAHP4avVz1oFneUuzNVf+jBOfpZU0LAv4F+j0Fk9BFb9cAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAVCAYAAACUhcTwAAAA00lEQVR4XsXRsQrBURTH8SOUgSiDgSJZLBaTMsroBbyFgdXiBbyBVVYsQnkFZbWZLMpgEN/jOtz//wH41af+nXO69/S/In9NAjnEww1NBXs8cEI52P5GT5lji2Sw9U0eR4xC9UBauKMTbvgZiNunhjaaiPoDts8NG3QxwRJpG7J9Vl6xjot41+vReoq/jw5dxa3xin6cUbWCuCv1v/WsoPfvkLICGYs7vWEFHVIWfZoDpuI90RAzxBBB/z1UtAFNAWtxgwtxT1Py+p/oCVlkwo0f5wlUvCOqH71xPQAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAWCAYAAAD5Jg1dAAAA60lEQVR4XmNgGAXUBIxArA/EdkDMCuWrAbEvEAsjqWNwBeI+IN4IxDuBeD4Q1wBxNhDfAmIzkCIOIJ4BxIpAPAmI3wOxFUiCAWLyUiDeSpJCMSCuA2JBID4AFQRpBgEWIF4DxHehfDBQAuLnQFyOJCYCxFeB+DCSGIMnEP8EYhskMRD7NwPESXDQCsQPgFgaSayBAeJmQ5gADwPEfU8YIJ4CARUgfgTExQwQT4EBzH2ngfgEEC8E4jtAHI6sCAT8gPgvELswQHwMCglmZAUwgM19GECZAWLlcSgbFNdYwUQgngXFvUAsiSoNAQCBhinyFdlknAAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAVCAYAAAByrA+0AAAA50lEQVR4XmNgGBKAGYjFgJgHXQIdcAHxaiD+D8WeqNK4QRUQPwdiJXQJbIADiLcC8QEGIpwEAtJA/ACIW9HEcQIXIP4LxAFArACljRkgAYEVlAPxNyDeB8TNQBwHxHeBeAIQMyKpAwOY+98DsRWS+EIGHH6Cub+TAWEaCxCvAeI9QMwNFYMDmPv9kMTwBgLI/ejhD9L8E4htkMTAAGb1AQaEW0Fiy4H4BBDzA3EqELtB5bBaLQnED6FiwkA8DUqDgSUQfwJiD5gAELAC8SwgPgPEG4DYBEkOHDGCDJhhDeKDTAUF+WAFAMJ+JheTIeIFAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAVCAYAAAC6wOViAAABdElEQVR4Xu2UvytFYRjHH0URKVEyKQOxUCZis1jsKCkDg0FJ/gKDxSAWkX9AmWyGWxZRMjDKJEVMlJIfn+997+Gcxz2Ge65SfOtT95zvc8773uf7vMfsX39FU/AAbzGuYBC64Mx597CSfzKjamEf7qDTedK0hQUXvZFFbXANOahLWlYB2/AMA87LpCF4hSVvoAY4hnNocl4maTG1b8QbqBceYQcqnVeyqmHPQp590OJYsLAh5Vo2RXmKLdiIoSxv7ZfkOQZHcAEHFgbwEGah6rMsXVGew96w7/Mct+S0N1rY4ExUkKbofKq1arOXXpyW5yasxq6jrhTrWEKlnk8toPZG067aUTiB1qgoTXpI/6TY7pShslRuzc7rtrDZdVizUDMHNfEiL/X9xpLf1Evoh3Y4hZeYp2/zcv7JIJ/npLsuu6K2x/PUJvyEl1U+T0lDlYN66LCvk55JOlY6Pk+wCz2F+/MWhkj+ROHej0st1zkV+v2hd6NFXdyQVrQzAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAVCAYAAABVAo5cAAABSUlEQVR4Xu2UvytGURjHH2VQLEpJWRgUqwzEJmXxDxgVJlmk7AaLwahkslktMlyzxcBCMkkRE4Pkx+f7nm6d9+nmfe9xi+Rbn+Geb6dzz/M9z2P2r7+qOXiCj4gbmIAhOHPeI2zWdn5D7XAEDzDoPGnBwmGr3khVP9xCBh31lrXALrzCuPOSNQnvsO4N1AkncA5dzkuWDlLJZryBhuEZ9qHVeUlqgwML+Y1Cj2PFws8ox0qU5yd2YDtC2d3bL8hvDU7hAo5hOfIaKs9v2hv2dX5bsGfhFTetvP9UTpXWa9aK81PrZAXrDZXafxoOlxYqUEpqA92gKD9lpuyuoNt52qeR13RfLsKd1c/IaxiDAQsP4i3yNGs3ajuDivLrg97ouzIV5aeDl6zEjctI+anMI9HalFU42HPpFvNwCC8WSqrhkFloHU2pn9UnusFUUihYkYAAAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAn0lEQVR4XmNgGAW0AhxA7ADEAUAsiyqFACZAfAmIs4A4AoiPALErigogkATih0C8C4j1gVgQiJ2BmBtZEQhwAvFmIP4Pxb+AOAZFBRIAKfYB4kUMEIV3gVgcWYELEP8A4jwksWggvgrEIkhiDEVA/BGIraF8ZiCeAcTNQMwIUwQC8gwQH64E4llAfACIJzBg8QgIgHQKM0DcxIomN5AAAGyKFhrnxKvoAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,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>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAVCAYAAADFEfeTAAABp0lEQVR4Xu2WSyhFURSGl6S85RGF8phgIEqUYoYoSRh4TKTkEROpm+dESskARUnJgJEyMFBGiijGhqaG5kz4/9bWebi6F/faZ+Crr3v2Wp32Ouvszroi4RmEd/ARXsFu462J8Zdra4yJFpbhivXAB5jniv05CfAAbvniXDPOvDXYGXaInfogG97DIVfMCnXwCR7BPeMpfDa535IMC2CSPxENX503do4dJLmwz0l/og2W+oOGVLgDy/2JSER73lrglJP2wM5si3YnHDw2uzDdn4hENOetCZ6LblAGK+EynIHDcBHewAHRQifgpOjD5YsejZB8ky7Rs/VqfmthBzyBL/AMtoq3M9zsUPQ1F4sW0ClOV8dFi+RD8540OCq6V1woghswBzaLbkra4QKcFu0ui92ENbAeLok+0JpZp+htsaUCrsARWGiuG+EszIJzot1h4Xyl/XAdzosWtWpicSnOCm+W/ScwJMJe0RHHA5/pTduFo46fDRbJj++16DfPOhw/l3DfrDkr+YeBH+5AUA1LzHWVaHGcu4GD8/JCfjDQ400DPBYdaTHhHZQzZJAwaxPdAAAAAElFTkSuQmCC>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAVCAYAAADmSqZGAAADIklEQVR4Xu2XXahNQRTHl1CEfBaKXEoSRflKPrqJ4oHko4Q3D5QihHjgvnjygsQLyYMHX1EiSRGSeCUSDySSpBSRfPx/d2bumT1nn3P23fe4Xvzr17l7ZvbsWWvWrDXX7L+6VaPEAXFMzBc9st3/Tv1Fn7SxgDBov+grxovnYm3UX3beKjHJTLFKtPrnepoqTomBaUcBLRWfxRT/zI7dFP388xhxwf+WEl5jcU/FFnNGHREf/XPPytAO8c4tMSntKCgWP0f09s9876plHTlPXLYSTlsi3outVr34leKH2JG0E/uHRFvSXlajxWOxLGnnO0fF7qS9rlaIb2KX5R9SvIb32MHhUftk8cz/dlXsFA5abflrmG3u+2PTjjwRNh/EFXOHtZaI9V9iYdSG59JQKSMM2isW+GcSRq9Kd7sGi0diXdJeJSY7Z26xi5O+VBj129zBRmH3WEwqPM3BJz2Hs8IO8+70qA0xdrPvGykmiD2+PdUJccby+zrEln435wE8UUt4jQwUG8UCXkXPsWg7KO6Ik2KfOC7WiPviolWiolX8NDd3IM9RiMi4KwakHbEYxCRknHoaJp6Ir2KGb5tmLrHMDYO8WOxhcztz2tyCSTRBfBNn4JTOCmc1fJePYtTGtCMR54gQfWCVtIpRr/1vLDLYNnPj8Ooly4YbDnxp2YRTVBj1ToxLO2IFo/JCKIjQI5YZtylqr2VU0ERz9S12GIbiGEI5TQRFlBbqXOG1RkbNEl/EDXNXlqBGRlEmqG1xeHKGCWHOVhkVCj8mxygyW57wLFcW7mPpNYUQeGuuaOcpL8zaxBtztWaRFUjPiRifzlklPM8OMLAl22UjzBlEZmzJdrUrJI+880h24jzFYca3bptLyVyNyIaFCmkksmKhujjEXK36JLabu+9R2fHoTqtdkKkV3BPzMie7yvsbojbGt4kX4rpYHvUVUSgrnboqheKIUdwy4oxVS4TvQ6uucRhAW3qHRIMsezaLil3lmsS5/KsaKu5Z49tIM7RenLVizu6yuFGft9ph2gzhvGvm/sfrFhFqnD3g72YrnEX+7ama/w+++o5n1qYV7gAAAABJRU5ErkJggg==>
