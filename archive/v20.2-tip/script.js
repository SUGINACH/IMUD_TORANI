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
    async function saveAsDefaultTemplate() {
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

      let docHtml = document.documentElement.outerHTML;
      rawInputElem.value = prevVal;

      // הקובץ המקורי היה עצמאי לחלוטין (CSS+JS מוטמעים בפנים). מאז שהקוד פוצל
      // ל-3 קבצים, ננסה למזג בחזרה את styles.css ו-script.js לתוך הקובץ הנשמר,
      // כך שהתבנית שנשמרת תמשיך להיות קובץ בודד ועצמאי בדיוק כמו קודם. אם הדפדפן
      // חוסם קריאת קבצים מקומיים (fetch מ-file://, נפוץ בכרום), הקובץ עדיין יישמר
      // ויעבוד - רק יפנה ל-styles.css/script.js הנלווים במקום להכיל אותם.
      try {
        const [cssText, jsText] = await Promise.all([
          fetch('styles.css').then(r => { if (!r.ok) throw new Error('styles.css: ' + r.status); return r.text(); }),
          fetch('script.js').then(r => { if (!r.ok) throw new Error('script.js: ' + r.status); return r.text(); })
        ]);
        // הגנה חיונית: אם תוכן ה-CSS/JS עצמו מכיל תג סגירה של style/script בתוכו
        // (למשל כאן, בהערה הזו עצמה, שמתארת את עצמה), חובה לנטרל אותו - אחרת
        // הדפדפן שיפתח את הקובץ שנשמר יפרש את זה כסגירת התגית מוקדם מדי ויקטע
        // את שאר הקוד.
        const safeCssText = cssText.replace(/<\/style/gi, '<\\/style');
        const safeJsText = jsText.replace(/<\/script/gi, '<\\/script');
        docHtml = docHtml
          .replace(/<link[^>]*href=["']styles\.css["'][^>]*>/i, '<style>\n' + safeCssText + '\n</style>')
          .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, '<script>\n' + safeJsText + '\n</script>');
      } catch (err) {
        console.warn('לא ניתן היה למזג את styles.css/script.js לקובץ אחד (כנראה חסימת דפדפן על קריאת קבצים מקומיים דרך fetch).', err);
        alert('הקובץ נשמר, אך בשל מגבלת דפדפן הוא מפנה ל-styles.css ו-script.js במקום להכיל אותם בתוכו. שמרו את שלושת הקבצים יחד באותה תיקייה כדי שהתבנית תיפתח כראוי.');
      }

      const fullHtml = '<!DOCTYPE html>\n' + docHtml;

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
