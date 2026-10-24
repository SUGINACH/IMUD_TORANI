/* engine-inputs.js — קלטי מנוע העימוד כנתונים מפורשים ושקופים (שלבים 1-2 בתכנית:
   Reports_Summaries_Studies/תכנית_ארגון_מנוע_העימוד.md).

   העיקרון: פריסה = פונקציה של (טקסט, הגדרות, גופנים טעונים, משתני CSS). כל קלט כזה מוצהר ומחושב לו hash,
   כך שכשתי הרצות נותנות פריסות שונות אפשר לדעת מיד אם הקלט השתנה (הסבר בקלט) או שלא (באג בקוד/מצב נסתר).

   שלב 1 (כאן): גופנים. גופן שנטען באמצע עימוד משנה את המדידות (נמדד: 127 מתוך 141 עמודים שונים בין הרצה
   ראשונה ליציבה). runUntilFontsStable מריץ את העימוד עד שקבוצת הגופנים הטעונים לא משתנה, ומחזיר דוח. */
(function (root) {
    'use strict';

    /* FNV-1a 32 ביט — hash דטרמיניסטי וקל לקלטים (לא קריפטוגרפי) */
    function fnv(s) {
        let h = 0x811c9dc5;
        for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
        return (h >>> 0).toString(16).padStart(8, '0');
    }

    const fontKey = f => `${f.family}|${f.weight}|${f.style}`;
    const loadedFonts = () => new Set([...document.fonts].filter(f => f.status === 'loaded').map(fontKey));
    const erroredFonts = () => [...document.fonts].filter(f => f.status === 'error').map(fontKey);
    /* document.fonts.ready עלול לא להגיע כשיש מאות הגדרות גופן (ראו הערה ב-app.js:ensureBuiltinFontsLoaded) — לכן timeout */
    const settled = ms => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, ms))]);

    /* מריץ runFn (עימוד סינכרוני) עד שקבוצת הגופנים הטעונים יציבה.
       מחזיר: passes (כמה הרצות), lateFonts (גופנים שנטענו בזמן עימוד), fontErrors, unstable (לא התייצב ב-maxPasses),
       fontsHash+fontCount (טביעת אצבע של קבוצת הגופנים הטעונים בסוף). */
    async function runUntilFontsStable(runFn, opts) {
        const max = (opts && opts.maxPasses) || 3;
        const waitMs = (opts && opts.waitMs) || 3000;
        const late = [];
        let passes = 0, unstable = false;
        for (;;) {
            const before = loadedFonts();
            runFn();
            passes++;
            await settled(waitMs);
            const newly = [...loadedFonts()].filter(k => !before.has(k));
            if (!newly.length) break;
            late.push(...newly);
            if (passes >= max) { unstable = true; break; }
        }
        const now = [...loadedFonts()].sort();
        return { passes, lateFonts: late, fontErrors: erroredFonts(), unstable, fontsHash: fnv(now.join('\n')), fontCount: now.length };
    }

    root.EngineInputs = Object.assign(root.EngineInputs || {}, { fnv, runUntilFontsStable });
})(typeof window !== 'undefined' ? window : globalThis);
