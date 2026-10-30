const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { initChatbotToggle } = require('../chatbot.js');

const commonCssPath = path.join(__dirname, '../assets/css/common.css');
const responsiveCssPath = path.join(__dirname, '../assets/css/responsive.css');
const indexHtmlPath = path.join(__dirname, '../index.html');

describe('02: Floating Action Button & onTop Stacking Refactor', () => {
  describe('CSS Stacking & Viewport Rules', () => {
    it('.onTop is refactored from sticky to fixed positioning at bottom: 88px, right: 24px, z-index: 998', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');
      
      // Match the .onTop block
      const onTopMatch = commonCss.match(/\.onTop\s*\{([^}]+)\}/);
      assert.ok(onTopMatch, '.onTop rule block must exist in common.css');
      
      const onTopContent = onTopMatch[1];
      assert.match(onTopContent, /position:\s*fixed/i, '.onTop must be position: fixed');
      assert.match(onTopContent, /bottom:\s*88px/i, '.onTop must have bottom: 88px');
      assert.match(onTopContent, /right:\s*24px/i, '.onTop must have right: 24px');
      assert.match(onTopContent, /z-index:\s*998/i, '.onTop must have z-index: 998');
      assert.doesNotMatch(onTopContent, /position:\s*sticky/i, '.onTop must no longer be sticky');
      assert.doesNotMatch(onTopContent, /margin-top:\s*100vh/i, '.onTop must no longer have margin-top: 100vh');
    });

    it('.ai-chatbot-toggle is positioned at bottom: 24px, right: 24px, z-index: 999 with glowing transitions', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');
      
      // Match .ai-chatbot-toggle rule
      assert.match(commonCss, /\.ai-chatbot-toggle[^{]*\{[^}]*position:\s*fixed/i, 'chatbot toggle must be position: fixed');
      assert.match(commonCss, /\.ai-chatbot-toggle[^{]*\{[^}]*bottom:\s*24px/i, 'chatbot toggle must have bottom: 24px');
      assert.match(commonCss, /\.ai-chatbot-toggle[^{]*\{[^}]*right:\s*24px/i, 'chatbot toggle must have right: 24px');
      assert.match(commonCss, /\.ai-chatbot-toggle[^{]*\{[^}]*z-index:\s*999/i, 'chatbot toggle must have z-index: 999');
      
      // Ensure class specificity is used (not ID selector) so mobile and hover rules aren't blocked
      assert.doesNotMatch(commonCss, /#ai-chatbot-toggle\s*,/i, 'Should use class selector to maintain consistent specificity');

      // Check for hover and active glow effects
      assert.match(commonCss, /\.ai-chatbot-toggle:hover/i, 'Must have hover state styling');
      assert.match(commonCss, /\.ai-chatbot-toggle:active/i, 'Must have active state styling');
    });

    it('on mobile viewports (<= 739px), .onTop remains hidden while chatbot toggle has responsive margins', () => {
      const responsiveCss = fs.readFileSync(responsiveCssPath, 'utf8');
      
      // Find mobile media query
      const mobileBlockMatch = responsiveCss.match(/@media\s*\([^)]*max-width:\s*739px[^)]*\)\s*\{([\s\S]*?)(?=@media|$)/i);
      assert.ok(mobileBlockMatch, 'Mobile @media block (max-width: 739px) must exist');
      
      const mobileContent = mobileBlockMatch[1];
      assert.match(mobileContent, /\.onTop\s*\{[^}]*display:\s*none/i, '.onTop must be hidden on mobile');
      assert.match(mobileContent, /(\.ai-chatbot-toggle|#ai-chatbot-toggle)\s*\{/i, 'chatbot toggle must have responsive styling in mobile media query');
    });
  });

  describe('HTML Markup & Accessibility', () => {
    it('index.html contains #ai-chatbot-toggle with accessible labels and crisp SVG icon', () => {
      const html = fs.readFileSync(indexHtmlPath, 'utf8');
      
      assert.match(html, /id=["']ai-chatbot-toggle["']/i, 'index.html must have an element with id="ai-chatbot-toggle"');
      assert.match(html, /aria-label=["'][^"']*trợ lý[^"']*["']/i, '#ai-chatbot-toggle must have a descriptive aria-label');
      assert.match(html, /aria-expanded=["']false["']/i, '#ai-chatbot-toggle must initialize with aria-expanded="false"');
      
      // Must contain SVG icon with sparkles and bubble
      const toggleMatch = html.match(/<button[^>]*id=["']ai-chatbot-toggle["'][\s\S]*?<\/button>/i);
      assert.ok(toggleMatch, '#ai-chatbot-toggle should be a <button> element');
      const toggleInner = toggleMatch[0];
      assert.match(toggleInner, /<svg/i, 'Toggle button must contain an SVG icon');
    });
  });

  describe('JavaScript Toggle Functionality', () => {
    it('initChatbotToggle attaches click handler to toggle aria-expanded and active class', () => {
      // Mock DOM environment for unit testing
      const eventListeners = {};
      const classList = new Set();
      const attributes = {
        'aria-expanded': 'false',
        'id': 'ai-chatbot-toggle'
      };

      const mockToggleBtn = {
        id: 'ai-chatbot-toggle',
        getAttribute: (attr) => attributes[attr] || null,
        setAttribute: (attr, val) => { attributes[attr] = String(val); },
        classList: {
          contains: (cls) => classList.has(cls),
          add: (cls) => classList.add(cls),
          remove: (cls) => classList.delete(cls),
          toggle: (cls, force) => {
            const add = force !== undefined ? force : !classList.has(cls);
            if (add) classList.add(cls);
            else classList.delete(cls);
            return add;
          }
        },
        addEventListener: (event, handler) => {
          eventListeners[event] = handler;
        }
      };

      const windowClassList = new Set();
      const mockChatWindow = {
        id: 'ai-chatbot-window',
        classList: {
          contains: (cls) => windowClassList.has(cls),
          toggle: (cls, force) => {
            const add = force !== undefined ? force : !windowClassList.has(cls);
            if (add) windowClassList.add(cls);
            else windowClassList.delete(cls);
            return add;
          }
        },
        querySelector: () => null
      };

      const originalDocument = global.document;
      global.document = {
        getElementById: (id) => {
          if (id === 'ai-chatbot-toggle') return mockToggleBtn;
          if (id === 'ai-chatbot-window') return mockChatWindow;
          return null;
        }
      };

      try {
        assert.strictEqual(typeof initChatbotToggle, 'function', 'initChatbotToggle must be exported function');
        initChatbotToggle();

        assert.ok(eventListeners['click'], 'Click listener must be registered on toggle button');

        // Initial state
        assert.strictEqual(mockToggleBtn.getAttribute('aria-expanded'), 'false');
        assert.strictEqual(mockToggleBtn.getAttribute('aria-label'), null);
        assert.strictEqual(mockToggleBtn.classList.contains('active'), false);
        assert.strictEqual(mockChatWindow.classList.contains('active'), false);

        // First click -> open
        eventListeners['click']();
        assert.strictEqual(mockToggleBtn.getAttribute('aria-expanded'), 'true');
        assert.strictEqual(mockToggleBtn.getAttribute('aria-label'), 'Đóng trợ lý ảo Công Hậu');
        assert.strictEqual(mockToggleBtn.classList.contains('active'), true);
        assert.strictEqual(mockChatWindow.classList.contains('active'), true);

        // Second click -> close
        eventListeners['click']();
        assert.strictEqual(mockToggleBtn.getAttribute('aria-expanded'), 'false');
        assert.strictEqual(mockToggleBtn.getAttribute('aria-label'), 'Mở trợ lý ảo Công Hậu');
        assert.strictEqual(mockToggleBtn.classList.contains('active'), false);
        assert.strictEqual(mockChatWindow.classList.contains('active'), false);
      } finally {
        global.document = originalDocument;
      }
    });
  });
});
