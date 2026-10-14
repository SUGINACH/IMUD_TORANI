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
 * @returns {Object}
 */
function collectCurrentSettings() {
    var settings = {};
    document.querySelectorAll('#settings-pane select[id], #settings-pane input[id], #settings-pane textarea[id]').forEach(function(el) {
        if (!el.id || el.type === 'file') return;
        if (el.type === 'checkbox') {
            settings[el.id] = el.checked;
        } else {
            settings[el.id] = el.value;
        }
    });
    // הגדרות נוספות שאינן ב-settings-pane
    ['font-body', 'font-first-word', 'size-body', 'size-first-word', 'line-height-body'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) settings[id] = el.value;
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

    var settingsTopBar = settingsPane.querySelector('.settings-top-bar');
    if (!settingsTopBar) return;

    var styleBar = document.createElement('div');
    styleBar.id = 'style-set-bar';
    styleBar.style.cssText = 'display:flex;gap:6px;padding:8px 10px;background:#e2e8f0;border-bottom:1px solid #cbd5e1;align-items:center;flex-wrap:wrap;';
    styleBar.innerHTML =
        '<label style="font-size:9pt;font-weight:bold;color:#1e293b;white-space:nowrap;">סגנון:</label>' +
        '<select id="style-set-select" style="flex:1;min-width:120px;padding:4px 6px;border:1px solid #cbd5e1;border-radius:4px;font-size:9pt;">' +
        '<option value="">— ברירת מחדל —</option></select>' +
        '<button id="btn-export-settings" class="btn-tool btn-secondary" style="flex:0.5;font-size:8pt;" title="ייצוא הגדרות לקובץ JSON">📤 ייצוא הגדרות</button>' +
        '<button id="btn-import-settings" class="btn-tool btn-secondary" style="flex:0.5;font-size:8pt;" title="ייבוא הגדרות מקובץ JSON">📥 ייבוא הגדרות</button>' +
        '<input type="file" id="file-import-settings" accept=".json" style="display:none;">';
    // הכנס את הסרגל לפני settings-top-bar, או בתחילת settings-pane אם לא נמצא
    if (settingsTopBar && settingsTopBar.parentNode === settingsPane) {
        settingsPane.insertBefore(styleBar, settingsTopBar);
    } else {
        // Fallback: הכנס בתחילת settings-pane
        settingsPane.insertBefore(styleBar, settingsPane.firstChild);
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
    fetch('https://api.github.com/repos/SUGINACH/IMUD_TORANI/contents/setting_sets')
        .then(function(res) { return res.json(); })
        .then(function(files) {
            if (!Array.isArray(files)) return;
            files.forEach(function(file) {
                if (file.name.endsWith('.json')) {
                    var opt = document.createElement('option');
                    opt.value = file.name;
                    opt.textContent = file.name.replace('.json', '');
                    select.appendChild(opt);
                }
            });
        })
        .catch(function() {
            // Fallback: שמות ידועים
            ['קונטרס.json', 'פרשנות.json', 'תלמוד.json'].forEach(function(name) {
                var opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name.replace('.json', '');
                select.appendChild(opt);
            });
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
