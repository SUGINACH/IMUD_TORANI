# מסמך נגישות (Accessibility) — מערכת עימוד תורנית

מסמך זה מתעד את סטטוס הנגישות של המערכת, בעיות שזוהו, והתיקונים שהוחלו.

---

## 1. סטנדרט היעד

- **WCAG 2.1 AA** — רמת היעד הבינלאומית לנגישות.
- **WAI-ARIA 1.2** — לרכיבים אינטראקטיביים מותאמים.
- **כיווניות:** `dir="rtl"` `lang="he"` (כבר מוגדר ב-`<html>`).

---

## 2. סטטוס התחלתי (לפני הרפקטורינג)

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

---

## 3. תיקונים שהוחלו

### 3.1 החלפת `<div onclick>` ב-`<button type="button">` (P2-1)

11 אלמנטים הומרו:

1. `.collapse-strip` (כותרת לוח הגדרות ראשי) — `data-action="toggle-settings-pane"`
2. 10 כותרות אקורדיון של פאנלים — `data-action="toggle-panel-body" data-target="panel-id"`

כל הכפתורים כוללים:
- `type="button"` (מונע submit בלתי-רצוי).
- `aria-expanded="false"` (מצב התחלתי).
- `aria-controls="panel-id"` (קישור לפאנל המופעל).
- סגנון `focus-visible` ב-CSS.

### 3.2 הוספת `for=` לתוויות `<label>`

- סקריפט אוטומטי (`scripts/apply_a11y_html.py`) סרק את ה-HTML והוסיף `for="ID"` לכל תווית שלא עוטפת את הקלט שלה ואינה כוללת כבר `for=`.
- תוויות שעוטפות את הקלט (implicit labels) נותרו כמו שהן — הן תקינות נגישותית.

### 3.3 Event Delegation (P2-4)

- `app.js` כולל 3 מאזינים גלובליים ל-`click` ו-`change` שמטפלים בכל הכפתורים שהוסרו מ-`onclick` inline:
  - `.page-debug-btn[data-debug-page]` — פתיחת דוח דיבאג.
  - `.visual-card[data-val]` — בחירת פריט מבורר ויזואלי.
  - `.ext-remove-btn` — הסרת תוסף חיצוני.
  - `.delete-theme-btn` — מחיקת ערכת נושא מותאמת.
  - `[data-action="toggle-settings-pane"]` — פתיחת/סגירת לוח הגדרות.
  - `[data-action="toggle-panel-body"]` — פתיחת/סגירת פאנל אקורדיון.
  - `.ext-anchor-select` (change) — עדכון anchor של תוסף.

### 3.4 `MutationObserver` לעדכון `aria-expanded`

`app.js` מאזין לשינויים ב-`style.display` של פאנלים מתקפלים ומעדכן אוטומטית את `aria-expanded` של הכפתור השולט.

### 3.5 עיצוב `focus-visible` גלובלי (P2-3c)

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

### 3.6 `prefers-reduced-motion` (P2-3b)

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

### 3.7 Breakpoints רספונסיביים (P2-3)

- `max-width: 1024px` — ה-sidebar הופך ל-drawer נשלף (transform: translateX(100%) → 0).
- `max-width: 640px` — תצוגה מקדימה מוקטנת ל-`scale(0.5)`.

### 3.8 `skip-link` וכיתת עזר `sr-only`

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
    /* ... */
}
.skip-link:focus { inset-inline-start: 8px; }
```

> **שימוש עתידי:** הוספת `<a href="#preview-pane" class="skip-link">דלג לתצוגה מקדימה</a>` בתחילת `<body>`.

### 3.9 החלפת `window.onload` ב-`addEventListener` (P1-2)

מונע דריסה של מאזיני `load` אחרים (קונפליקט שקט עם analytics/tracking).

---

## 4. בעיות פתוחות (Roadmap)

### 4.1 אלמנטים סמנטיים חסרים (High)

- `<main id="preview-pane" aria-label="תצוגה מקדימה של הספר">`
- `<aside id="sidebar" aria-label="כלי עריכה והגדרות עימוד">`
- `<nav>` לניווט בין פאנלים.

### 4.2 תגי meta חסרים (Medium)

- `<meta name="description">`
- `<meta name="theme-color">`
- Open Graph tags לשיתוף.

### 4.3 `contenteditable` ללא ARIA (High)

`<div id="raw-input" contenteditable>` — חסר:
- `role="textbox"`
- `aria-multiline="true"`
- `aria-label="תוכן הטקסט לעימוד"`
- `<label class="sr-only" for="raw-input">` מקושר.

### 4.4 כפתורים עם emoji בלבד (Medium)

כפתורים כמו `✍️`, `⚡`, `📄`, `🖨️` חסרים `aria-label` טקסטואלי.

### 4.5 Color Contrast

לא נבדק — יש להריץ Lighthouse / axe DevTools לאימות ניגודיות צבעים לפי WCAG 1.4.3.

### 4.6 בדיקות מקלדת יזומות

יש להוסיף סקריפט Puppeteer שמדמה ניווט ב-Tab ומוודא שכל הפקדים נגישים.

### 4.7 קורא מסך

לא נבדק — יש להריץ NVDA (Windows) או VoiceOver (macOS) לאימות הכרזות נכונות.

---

## 5. כלים מומלצים לבדיקה

- **Lighthouse** (Chrome DevTools) — ניקוד אבטחה/נגישות/ביצועים.
- **axe DevTools** — תוסף Chrome לבדיקות נגישות מעמיקות.
- **WAVE** (wave.webaim.org) — בודק נגישות אונליין.
- **NVDA / VoiceOver** — קוראי מסך לבדיקת הכרזות.
- **keyboardnavigation.com** — אימון ניווט מקלדת.

---

## 6. תאריך עדכון

- **2026-10-06** — P2-1 עד P2-4 + P3-1 הושלמו (a11y בסיסית).
- **פתוח** — סעיפים 4.1–4.7 דורשים עבודה נוספת.

---

**תקן יעד:** WCAG 2.1 AA.
**אחריות:** כל שינוי ב-HTML חייב לעבור בדיקת axe DevTools.
