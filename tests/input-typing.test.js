const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

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
