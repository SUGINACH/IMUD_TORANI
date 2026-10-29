---
title: "GitHub Actions Workflows"
date: 2026-10-27
version: shared
type: plans
source: shared
---
# GitHub Actions Workflows

> תאריך: 2026-10-27
> סטטוס: 6 workflows פעילים

## סקירה כללית

מערכת ה-CI/CD מכילה 6 workflows המאפשרים הרצת פעולות ארוכות וכבדות ברקע, עם התראה אוטומטית בסיום.

| Workflow | תיאור | טריגר | זמן ריצה |
|----------|-------|-------|----------|
| `regression-test.yml` | בדיקות נגרסיה על 79 פרקים + determinism | push / manual | ~30min |
| `step-by-step-audit.yml` | בדיקה גיאוממטרית שלב-אחר-שלב + causality | manual only | ~5-15min |
| `full-baseline-audit.yml` | baseline מלא על כל 79 פרקים עם causality | manual only | ~30-60min |
| `test-triggers-runner.yml` | הרצת קבצי trigger לאימות זיהוי בעיות | push (paths) / manual | ~15min |
| `issue-investigation.yml` | חקירה עמוקה של בעיה ספציפית עם המלצות | manual only | ~10-20min |
| `issues-screenshot-pdf.yml` | יצירת PDF עם צילומי מסך של עמודים עם בעיות | manual only | ~10-90min |

---

## 1. Regression Test (`regression-test.yml`)

**מטרה:** הרצת בדיקות נגרסיה על כל 79 הפרקים עם 3 קונפיגורציות שונות.

**טריגר:**
- אוטומטי: push ל-`V21`
- ידני: Actions → Regression Test → Run workflow
- inputs: `start_chapter` (1-79), `end_chapter` (1-79)

**Matrix:**
- `baseline` — הגדרות ברירת מחדל (page-height כבוי)
- `page-height-max15` — page-height מופעל, max=15
- `page-height-max70` — page-height מופעל, max=70 (ניסיוני)

**Artifacts:**
- `chapter-results-{mode}` — JSON + לוגים לכל פרק
- retention: 30 days

---

## 2. Step-by-Step Audit (`step-by-step-audit.yml`)

**מטרה:** בדיקה גיאוממטרית שלב-אחר-שלב עם 4 checkpoints גלובליים + per-page checkpoints + causality classification (7 קטגוריות).

**טריגר:** ידני בלבד
- inputs: `chapter` (1-79), `per_page_checkpoints`, `verbose`, `deltas_only`

**מתי להשתמש:**
- כדי להבין באיזה שלב של ה-engine בעיה נוצרת
- כדי לסווג את הסיבתיות (created-by-stage / fixed-by-stage / unresolved / ...)
- כדי לקבל JSON מלא עם כל ה-checkpoints לניתוח

**Artifacts:**
- `step-by-step-audit-ch{chapter}` — JSON מלא + לוג
- retention: 30 days

---

## 3. Full Baseline Audit (`full-baseline-audit.yml`)

**מטרה:** בניית baseline מלא של כל הבעיות ב-79 פרקים — שימושי להשוואה עתידית.

**טריגר:** ידני בלבד (כי איטי ~30-60min)
- inputs: `start_chapter`, `end_chapter`, `concurrency` (1-5 parallel)

**מתי להשתמש:**
- לפני שינוי גדול ב-engine — צלם את המצב הנוכחי
- אחרי שינוי — השווה מול baseline הקודם
- כדי למצוא פרקים עם בעיות לא מוכרות

**Artifacts:**
- `audit-ch{chapter}` — JSON + log + summary לכל פרק
- `full-baseline-summary` — סיכום מצטבר של כל הפרקים
- retention: 60-90 days

---

## 4. Test Triggers Runner (`test-triggers-runner.yml`)

**מטרה:** הרצת כל קבצי ה-triggers מ-`test-triggers/` דרך ה-engine ודיווח אילו סוגי בעיות זוהו.

**טריגר:**
- אוטומטי: push ל-V21 רק כאשר נעשו שינויים ב:
  - `audit-expansion.js`
  - `audit-text-integrity.js`
  - `geometry-audit.js`
  - `typesetter.js`
  - `test-triggers/**`
- ידני: Actions → Test Triggers Runner → Run workflow
- inputs: `specific_file` (לבדיקת קובץ בודד)

**מתי להשתמש:**
- אחרי שינוי ב-audit functions — ודא שה-bugs שאמורים להיווצר אכן מזוהים
- אחרי הוספת trigger חדש — ודא שהוא יוצר את הבעיה המצופה

**Artifacts:**
- `trigger-results` — לוג + summary
- retention: 30 days

---

## 5. Issue Investigation (`issue-investigation.yml`)

**מטרה:** חקירה עמוקה של בעיה ספציפית — מציאת שלב הופעתה, גורמיה, והמלצות לפתרון.

**טריגר:** ידני בלבד
- inputs:
  - `issue_kind` (dropdown: 18 סוגים מ-`GEOM_KIND_NAMES`)
  - `chapter` (1-79, default 9)
  - `run_test_trigger` (true/false)

**מה ה-workflow עושה:**
1. ממפה את ה-issue_kind לקובץ trigger מתאים
2. (אופציונלי) מריץ את ה-trigger ובודק שהבעיה אכן מתגלה
3. מריץ step-by-step-audit עם `--causality --per-page-checkpoints --verbose`
4. מנתח את הופעת הבעיה בכל checkpoint
5. מדפיס סיווג סיבתיות מפורט
6. **ממליץ על הצעדים הבאים** בהתבסס על הסיווג:
   - `created-at-first-checkpoint` → בדוק פרסור טקסט
   - `created-by-stage` → מצא את השלב שיצר את הבעיה
   - `fixed-by-stage` → התיקון יציב? בדוק
   - `correction-reverted` → חפש את השלב שהחזיר את הבעיה
   - `never-appeared` → בדוק ריצה סופית מול אחרון checkpoint
   - `unresolved` → מועמד ישיר לפתרון — שלב 5-9

**Artifacts:**
- `investigation-{issue_kind}-ch{chapter}` — JSON מלא + לוג + trigger results
- retention: 60 days

---

## איך להשתמש — מדריך למשתמש

### זרימת עבודה מומלצת (לפי סדר ה-9-step של המשתמש)

1. **שלב 1-2 (הגדרה + זיהוי):** הפעל את `Issue Investigation` עם `issue_kind=candidate-vs-final` ו-`chapter=9`.
   - ה-workflow יחזיר דוח עם סיבתיות מפורטת.

2. **שלב 3 (הוספה לבדיקה):** אם נדרש, הוסף trigger חדש ל-`test-triggers/` והפעל את `Test Triggers Runner`.

3. **שלב 4 (מציאת שלב):** ה-`Issue Investigation` כבר מספק את זה דרך ה-causality classification.

4. **שלב 5-6 (פתרון + החלה):** ערוך את `typesetter.js`, בצע commit & push.

5. **שלב 7-8 (בדיקת הצלחה + השלכות):**
   - הפעל שוב את `Issue Investigation` — ודא ש-0 issues מסוג זה.
   - הפעל את `Full Baseline Audit` — ודא שלא נוצרו בעיות חדשות בפרקים אחרים.

6. **שלב 9 (הצלחה חלקית):** אם הבעיה נשארה, ה-causality יראה את זה. הרץ שוב עם `--verbose`.

### התראות בסיום

GitHub Actions שולח התראה אוטומטית לאימייל / GitHub Notifications כאשר:
- workflow מסתיים (success/failure)
- workflow נכשל

כדי לקבל התראה מהירה יותר, הגדר Slack/Discord webhook ב-Settings → Webhooks.

### צפייה בתוצאות

1. עבור ל-Actions tab ב-GitHub
2. בחר את ה-workflow run
3. גלול ל-Annotations / Artifacts
4. הורד את ה-artifact (zip) ופתח את ה-JSON בעורך

---

## טבלת מעבר בין workflows

| שלב ב-9-step | workflow להפעלה |
|---------------|------------------|
| 1. הגדרה | (ידני — עיון ב-ISSUES_TABLE.md / WORKING_RULES.md) |
| 2. זיהוי ואי | `Issue Investigation` |
| 3. הוספה לבדיקה | `Test Triggers Runner` |
| 4. שלב הופעת הבעיה | `Issue Investigation` (מספק causality) |
| 5. מציאת פתרון | (ידני — קריאת קוד + ניתוח) |
| 6. החלת הפתרון | (commit & push) |
| 7. בדיקת הצלחה | `Issue Investigation` (שוב, על אותו chapter) |
| 8. השלכות | `Full Baseline Audit` (על כל 79 פרקים) |
| 9. הצלחה חלקית | `Issue Investigation` עם `--verbose` על הבעיה שנשארה |

---

## 6. Issues Screenshot PDF (`issues-screenshot-pdf.yml`)

**מטרה:** יצירת PDF עם צילומי מסך של עמודים שדווחו עליהם בעיות. ה-PDF כולל:
- **עמוד שער** עם סטטיסטיקות (מספר פרקים נסרקו, HIGH/MEDIUM/LOW counts, סוגי בעיות בדוח)
- **מפריד פרק** עבור כל פרק (כולל מספר העמודים עם בעיות)
- **בלוק בעיה** לכל בעיה עם:
  - **כותרת:** שם עברי, חומרה (HIGH/MEDIUM/LOW), סוג (kind), מספר פרק, מספר עמוד
  - **סיבה:** הסבר על מקור הבעיה
  - **צילום מסך מלא של העמוד**
  - **הודעת ה-audit** המלאה
  - **מיקום הבעיה** (childRect: x, y, w, h)

**טריגר:** ידני בלבד
- inputs:
  - `start_chapter` (1-79, default 1)
  - `end_chapter` (1-79, default 79)
  - `kind_filter` (ריק = כל הסוגים, או רשימה מופרדת בפסיקים: "footnote-overflow,imbalance")
  - `push_to_branch` (true/false — האם לשמור את ה-PDF ב-repo; **default: true** מ-2026-10-28)

**מתי להשתמש:**
- לסקירה ויזואלית של הבעיות שה-audit מדווח
- לאימות דיוק הגדרת הבעיות (האם האזור המסומן אכן בעייתי?)
- לאימות דיווח ה-audit (האם הבעיה המדווחת אמיתית?)
- להצגה למשתמש/לקוח

**שם הקובץ ב-artifacts:** כולל את סוגי הבעיות שצולמו + timestamp
- דוגמה: `issues-candidate-vs-final-2026-10-27T13-01-42.pdf`
- דוגמה: `issues-footnote-overflow+imbalance-2026-10-27T14-30-00.pdf`

**Artifacts:**
- `issues-pdf-{filename}` — ה-PDF + לוג
- retention: 90 days

**[2026-10-28] שמירה ב-repo (ברירת מחדל):** אם `push_to_branch=true` (ברירת מחדל), ה-PDF נשמר גם ב-repo בשם קבוע:
- `issue-reports-archive/issues-latest.pdf` — ה-PDF האחרון
- `issue-reports-archive/issues-latest.html` — גרסת HTML ל-debug
- `issue-reports-archive/.latest-meta.txt` — מטא-נתונים (תאריך, טווח פרקים, סינון)
- ה-PDF נגיש ישירות מה-repo בכתובת:
  `https://github.com/SUGINACH/Tora_Book_Typesetter_Gold/blob/V21/issue-reports-archive/issues-latest.pdf`
- **לא צריך להוריד artifact zip** — פשוט פתח את הקישור ולחץ "Download".
- שם קבוע מונע צבירת קבצים; ריצה חוזרת מחליפה את הקובץ הקודם.
- workflow עושה `git pull --rebase` לפני push כדי למנוע conflicts.
- אם ה-PDF זהה לקודם (אין שינוי), ה-workflow מדלג על ה-commit.

**הערה חשובה:** הסקריפט מרענן browser כל 5 פרקים כדי למנוע דליפות זיכרון. עבור 79 פרקים מלאים, הריצה לוקחת ~30-90 דקות.

**שימוש למטרת אימות דיווח (כפי שהמשתמש ביקש):**
1. הפעל את ה-workflow עם ברירת מחדל (כל 79 הפרקים, כל הסוגים)
2. אחרי סיום, פתח את `issue-reports-archive/issues-latest.pdf` ב-repo (או הורד artifact)
3. עבור על כל צילום מסך וודא:
   - שהבעיה המדווחת אכן נראית לעין בעמוד
   - שהסיבה המצוינת תואמת את מה שנראה
   - שהחומרה מתאימה לחומרת הבעיה הנראית
4. אם נמצאו false positives — דווח עליהם כדי לעדכן את הספים (כלל 5 ב-WORKING_RULES.md)
