const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { initInputGuard, initThemeController, initPortfolio } = require('../main.js');
const { createMockDOM } = require('./helpers/dom-fixture.js');

const mainJsPath = path.join(__dirname, '../main.js');
const chatbotJsPath = path.join(__dirname, '../chatbot.js');
const commonCssPath = path.join(__dirname, '../assets/css/common.css');

describe('05: Chatbot Input Typing & Font Standardization', () => {
  describe('main.js Keydown & Contextmenu Filtering', () => {
    it('does not unconditionally block keys i, c, u, j without DevTools modifiers', () => {
      const mainJs = fs.readFileSync(mainJsPath, 'utf8');

      // The faulty pattern blocked keyCode 73 or 67 directly without checking ctrl/shift modifiers:
      // if (event.keyCode === 123 || event.keyCode === 85 || event.keyCode === 73 || ...)
      const faultyBlockPattern = /if\s*\(\s*event\.keyCode\s*===\s*123\s*\|\|\s*event\.keyCode\s*===\s*85\s*\|\|\s*event\.keyCode\s*===\s*73/;
      assert.strictEqual(
        faultyBlockPattern.test(mainJs),
        false,
        'main.js must not block keyCodes 85, 73, 74, 67 without checking modifier keys'
      );
    });

    it('bypasses devtools/inspect blocking when typing in input, textarea, or contentEditable', () => {
      const mainJs = fs.readFileSync(mainJsPath, 'utf8');

      assert.match(
        mainJs,
        /tagName\s*===\s*['"]INPUT['"]|tagName\s*===\s*['"]TEXTAREA['"]|isContentEditable/i,
        'main.js keydown listener must bypass checks when target is an editable input'
      );
    });

    it('allows context menu inside input and textarea elements', () => {
      const mainJs = fs.readFileSync(mainJsPath, 'utf8');

      assert.match(
        mainJs,
        /contextmenu[\s\S]*?(tagName\s*===\s*['"]INPUT['"]|tagName\s*===\s*['"]TEXTAREA['"])/i,
        'main.js contextmenu listener must allow right-clicking inside inputs and textareas'
      );
    });

    it('behaviorally blocks DevTools shortcuts on page while allowing input typing', () => {
      const { doc, win, makeElement, pressKey } = createMockDOM();
      initInputGuard({ document: doc, window: win });

      const input = makeElement('input', 'test-input');
      doc.body.appendChild(input);

      // 1. Regular typing in input: key 'i' (keyCode 73) without Ctrl must NOT be prevented
      const typeI = pressKey(input, { keyCode: 73, key: 'i', ctrlKey: false, shiftKey: false });
      assert.strictEqual(typeI.defaultPrevented, false, 'Typing letter "i" in input must not be blocked');

      // 2. Typing 'c', 'u', 'j' in input must not be prevented
      const typeC = pressKey(input, { keyCode: 67, key: 'c', ctrlKey: false, shiftKey: false });
      assert.strictEqual(typeC.defaultPrevented, false, 'Typing letter "c" in input must not be blocked');

      // 3. F12 on page body must be blocked
      const f12 = pressKey(doc.body, { keyCode: 123, key: 'F12' });
      assert.strictEqual(f12.defaultPrevented, true, 'F12 on page body must be prevented');

      // 4. Ctrl+Shift+I on page body must be blocked
      const ctrlShiftI = pressKey(doc.body, { keyCode: 73, ctrlKey: true, shiftKey: true });
      assert.strictEqual(ctrlShiftI.defaultPrevented, true, 'Ctrl+Shift+I on page body must be prevented');

      // 5. Ctrl+U on page body must be blocked
      const ctrlU = pressKey(doc.body, { keyCode: 85, ctrlKey: true, shiftKey: false });
      assert.strictEqual(ctrlU.defaultPrevented, true, 'Ctrl+U on page body must be prevented');

      // 6. Context menu inside input is allowed (not prevented)
      let inputContextMenuPrevented = false;
      doc.dispatchEvent({
        type: 'contextmenu',
        target: input,
        preventDefault() { inputContextMenuPrevented = true; }
      });
      assert.strictEqual(inputContextMenuPrevented, false, 'Right click inside input must not be prevented');

      // 7. Context menu on page body is blocked
      let bodyContextMenuPrevented = false;
      doc.dispatchEvent({
        type: 'contextmenu',
        target: doc.body,
        preventDefault() { bodyContextMenuPrevented = true; }
      });
      assert.strictEqual(bodyContextMenuPrevented, true, 'Right click on page body must be prevented');
    });

    it('behaviorally controls theme switching and persists in storage', () => {
      const { doc, storage, makeElement } = createMockDOM();
      const lightIcon = makeElement('div');
      lightIcon.className = 'icon-light';
      const darkIcon = makeElement('div');
      darkIcon.className = 'icon-dark';
      doc.body.appendChild(lightIcon);
      doc.body.appendChild(darkIcon);

      const controller = initThemeController({ document: doc, storage });

      // Initial state
      assert.strictEqual(doc.documentElement.classList.contains('light'), false);

      // Switch to light via controller
      controller.switchTheme('light');
      assert.strictEqual(doc.documentElement.classList.contains('light'), true);
      assert.strictEqual(storage.getItem('portfolio-theme'), 'light');

      // Switch to dark via controller
      controller.switchTheme('dark');
      assert.strictEqual(doc.documentElement.classList.contains('light'), false);
      assert.strictEqual(storage.getItem('portfolio-theme'), 'dark');
    });
  });

  describe('chatbot.js Event Isolation', () => {
    it('stops event propagation on chatbot input keydown to isolate from global listeners', () => {
      const chatbotJs = fs.readFileSync(chatbotJsPath, 'utf8');

      assert.match(
        chatbotJs,
        /inputField\.addEventListener\(['"]keydown['"],\s*\(e\)\s*=>\s*\{[\s\S]*?e\.stopPropagation\(\)/,
        'chatbot.js input keydown handler must call e.stopPropagation() for defense-in-depth'
      );
    });
  });

  describe('common.css Font Standardization', () => {
    it('explicitly applies Sora font to chatbot input, buttons, and placeholder', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');

      assert.match(
        commonCss,
        /\.ai-chatbot-window\s*input[\s\S]*?font-family:\s*["']Sora["']/i,
        'Chatbot input must explicitly specify Sora font-family'
      );

      assert.match(
        commonCss,
        /::placeholder[\s\S]*?font-family/i,
        'Chatbot placeholder must explicitly specify font-family'
      );

      assert.match(
        commonCss,
        /\.ai-chatbot-window\s*button[\s\S]*?font-family:\s*["']Sora["']/i,
        'Chatbot buttons must explicitly specify Sora font-family'
      );
    });
  });
});
