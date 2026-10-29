/* ==========================================================================
   settings-manager.js — ניהול הגדרות המערכת
   ==========================================================================
   תפקידים:
   1. טעינת הגדרות ברירת מחדל מ-default_settings.json
   2. החלת הגדרות על ה-DOM
   3. דרופדאון סגנונות (setting_sets/)
   4. ייבוא/ייצוא הגדרות
   ========================================================================== */
(function() {
'use strict';

let _defaultSettings = null;

/**
 * loadDefaultSettings — טוען את default_settings.json ומחיל על ה-DOM.
 * אחרי ההחלה, בודק אם יש סט הגדרות שמור ב-localStorage וטוען אותו.
 * נקרא אוטומטית בטעינת הדף.
 */
async function loadDefaultSettings() {
    try {
        const res = await fetch('default_settings.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        _defaultSettings = await res.json();
        applySettingsToDOM(_defaultSettings, false); // false = אל תפעיל typeset עדיין
        console.log('✓ הגדרות ברירת מחדל נטענו (' + Object.keys(_defaultSettings).length + ' ערכים)');

        // בדוק אם יש סט הגדרות שמור — גם סט ידני וגם הגדרות מיובאות
        var savedStyleSet = localStorage.getItem('selected_style_set');
        var importedSettings = localStorage.getItem('imported_settings');
        if (savedStyleSet) {
            console.log('✓ סט הגדרות שמור נמצא: ' + savedStyleSet + ' — טוען...');
            await loadSettingsFromFile('setting_sets/' + savedStyleSet);
            // עדכן את הדרופדאון אם כבר קיים
            var select = document.getElementById('style-set-select');
            if (select) select.value = savedStyleSet;
        } else if (importedSettings) {
            console.log('✓ הגדרות מיובאות שמורות — טוען...');
            try {
                var settings = JSON.parse(importedSettings);
                applySettingsToDOM(settings, false);
            } catch (e) { console.warn('שגיאת טעינת הגדרות מיובאות:', e); }
        }
    } catch (e) {
        console.warn('שגיאת טעינת default_settings.json:', e);
        // אם הקובץ לא זמין, השתמש בערכי ה-HTML המקוריים (הם עדיין שם כ-fallback)
    }
}

/**
 * applySettingsToDOM — מחיל אובייקט הגדרות על כל האלמנטים ב-DOM.
 * @param {Object} settings
 * @param {boolean} triggerTypeset — האם להפעיל typesetDocument אחרי ההחלה
 */
function applySettingsToDOM(settings, triggerTypeset) {
    if (typeof triggerTypeset === 'undefined') triggerTypeset = true;
    Object.keys(settings).forEach(function(key) {
        var el = document.getElementById(key);
        if (!el) return;
        var val = settings[key];
        if (el.type === 'checkbox') {
            el.checked = !!val;
        } else if (el.tagName === 'SELECT') {
            el.value = val;
        } else {
            el.value = val;
        }
        // עורר אירוע change כדי שהמערכת תגיב
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    if (triggerTypeset) {
        if (typeof updateGrid === 'function') updateGrid();
        if (typeof updateStyles === 'function') updateStyles();
        if (typeof typesetDocument === 'function') typesetDocument();
    }
}

/**
 * collectCurrentSettings — אוסף את כל ערכי ההגדרות הנוכחיים מה-DOM.
 * אוסף מכל האלמנטים עם id במסמך (לא רק מ-settings-pane), כי בארכיטקטורת ה-iframe
 * ההגדרות נמצאות ב-#settings-hidden, ובדף הראשי הן ב-#settings-pane.
 * מתעלם מ: file inputs, כפתורים, ואלמנטים ללא id.
 * @returns {Object}
 */
function collectCurrentSettings() {
    var settings = {};
    // אסוף מכל המסמך — תומך גם ב-#settings-pane (דף ראשי) וגם ב-#settings-hidden (iframe)
    document.querySelectorAll('input[id], select[id], textarea[id]').forEach(function(el) {
        if (!el.id || el.type === 'file' || el.type === 'button' || el.tagName === 'BUTTON') return;
        // דלג על אלמנטים שאינם הגדרות
        if (el.id === 'raw-input' || el.id === 'file-txt-import' || el.id === 'file-import-settings' ||
            el.id === 'file-cbg-regular-img' || el.id === 'file-cbg-h0Open-img' || el.id === 'file-cbg-h2Open-img' ||
            el.id === 'file-builder-main-svg' || el.id === 'file-builder-back-svg' || el.id === 'file-builder-sub-svg' ||
            el.id === 'assets-folder-input' || el.id === 'file-sec-div-img' || el.id === 'file-hdr-c-img' ||
            el.id === 'file-import-debug' || el.id === 'style-set-select') return;
        if (el.type === 'checkbox') {
            settings[el.id] = el.checked;
        } else {
            settings[el.id] = el.value;
        }
    });
    // [חדש] אסוף תיבות סימון של תוכן עניינים (class-based, לא ID-based)
    // בדף הראשי: אוספים מה-checkboxים המסומנים
    // ב-iframe: אין checkboxים, אז קוראים מה-hidden input שמכיל את הערך המופרד בפסיקים
    ['gtoc-show', 'gtoc-grp', 'dtoc-show', 'dtoc-grp'].forEach(function(cls) {
        var checked = Array.from(document.querySelectorAll('.' + cls + ':checked')).map(function(cb) { return cb.value; });
        if (checked.length > 0) {
            settings[cls + 's'] = checked.join(',');
        } else {
            // ב-iframe — קרא מה-hidden input
            var hidden = document.getElementById(cls + 's');
            if (hidden) {
                settings[cls + 's'] = hidden.value;
            }
        }
    });
    return settings;
}

/**
 * loadSettingsFromFile — טוען הגדרות מקובץ JSON ומחיל.
 */
function loadSettingsFromFile(path) {
    return fetch(path)
        .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function(settings) {
            applySettingsToDOM(settings, true);
            console.log('✓ הגדרות נטענו מ-' + path);
        })
        .catch(function(e) {
            console.error('שגיאת טעינת הגדרות:', e);
            alert('שגיאת טעינת הגדרות: ' + e.message);
        });
}

/**
 * initStyleSetDropdown — מוסיף דרופדאון סגנונות + ייבוא/ייצוא לראש טאב ההגדרות.
 * נקרא ע"י debug-panel.js אחרי יצירת הטאבים.
 */
function initStyleSetDropdown() {
    var settingsPane = document.getElementById('settings-pane');
    if (!settingsPane || document.getElementById('style-set-bar')) return;

    // הסרגל צריך להיכנס בתוך settings-content (שהוא flex column),
    // לא כילד ישיר של settings-pane (שהוא flex row).
    var settingsContent = settingsPane.querySelector('.settings-content');
    if (!settingsContent) return;

    var settingsTopBar = settingsContent.querySelector('.settings-top-bar');

    var styleBar = document.createElement('div');
    styleBar.id = 'style-set-bar';
    styleBar.style.cssText = 'display:flex;gap:6px;padding:8px 10px;background:#e2e8f0;border-bottom:1px solid #cbd5e1;align-items:center;flex-wrap:wrap;flex-shrink:0;';
    styleBar.innerHTML =
        '<label style="font-size:9pt;font-weight:bold;color:#1e293b;white-space:nowrap;">סגנון:</label>' +
        '<select id="style-set-select" style="flex:1;min-width:100px;padding:4px 6px;border:1px solid #cbd5e1;border-radius:4px;font-size:9pt;">' +
        '<option value="">— ברירת מחדל —</option></select>' +
        '<button id="btn-export-settings" class="btn-tool btn-secondary" style="flex:0.5;font-size:8pt;" title="ייצוא הגדרות לקובץ JSON">📤 ייצוא</button>' +
        '<button id="btn-import-settings" class="btn-tool btn-secondary" style="flex:0.5;font-size:8pt;" title="ייבוא הגדרות מקובץ JSON">📥 ייבוא</button>' +
        '<input type="file" id="file-import-settings" accept=".json" style="display:none;">';
    // הכנס בתוך settings-content, לפני settings-top-bar
    if (settingsTopBar && settingsTopBar.parentNode === settingsContent) {
        settingsContent.insertBefore(styleBar, settingsTopBar);
    } else {
        settingsContent.insertBefore(styleBar, settingsContent.firstChild);
    }

    // טען רשימת סגנונות
    loadStyleSetsList();

    // חבר לחצנים
    document.getElementById('style-set-select').addEventListener('change', function() {
        if (this.value) {
            // שמור את הבחירה ב-localStorage, נקה הגדרות מיובאות
            localStorage.setItem('selected_style_set', this.value);
            localStorage.removeItem('imported_settings');
            loadSettingsFromFile('setting_sets/' + this.value);
        } else {
            // איפוס — מחק הכל וטען ברירת מחדל
            localStorage.removeItem('selected_style_set');
            localStorage.removeItem('imported_settings');
            if (_defaultSettings) applySettingsToDOM(_defaultSettings, true);
        }
    });
    document.getElementById('btn-export-settings').addEventListener('click', exportSettings);
    document.getElementById('btn-import-settings').addEventListener('click', function() {
        document.getElementById('file-import-settings').click();
    });
    document.getElementById('file-import-settings').addEventListener('change', importSettings);
}

function loadStyleSetsList() {
    var select = document.getElementById('style-set-select');
    if (!select) return;
    // נסה קודם לטעון מקומית מ-setting_sets/ (דרך fetch של directory listing לא זמין,
    // אז משתמשים ברשימה ידנית של קבצים ידועים).
    // ניסיון GitHub API נכשל לעתים קרובות (rate limit, CORS), לכן נשתמש ברשימה ידנית.
    var knownSets = ['קונטרס.json', 'פרשנות.json', 'תלמוד.json'];
    knownSets.forEach(function(name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name.replace('.json', '');
        select.appendChild(opt);
    });
}

function exportSettings() {
    var settings = collectCurrentSettings();
    var json = JSON.stringify(settings, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'settings.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
    console.log('✓ הגדרות יוצאו (' + Object.keys(settings).length + ' ערכים)');
}

function importSettings(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var settings = JSON.parse(e.target.result);
            applySettingsToDOM(settings, true);
            // שמור את ההגדרות המיובאות ב-localStorage כדי שלא יאופסו בריענון
            localStorage.setItem('imported_settings', JSON.stringify(settings));
            localStorage.removeItem('selected_style_set'); // נקה סט ידני
            console.log('✓ הגדרות יובאו (' + Object.keys(settings).length + ' ערכים)');
        } catch (err) {
            alert('שגיאת ייבוא: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// חשיפה ל-window
window.loadDefaultSettings = loadDefaultSettings;
window.applySettingsToDOM = applySettingsToDOM;
window.collectCurrentSettings = collectCurrentSettings;
window.loadSettingsFromFile = loadSettingsFromFile;
window.exportSettings = exportSettings;
window.importSettings = importSettings;
window.initStyleSetDropdown = initStyleSetDropdown;
window.getDefaultSettings = function() { return _defaultSettings; };

})();
