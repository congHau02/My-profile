const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const commonCssPath = path.join(__dirname, '../assets/css/common.css');
const mainCssPath = path.join(__dirname, '../assets/css/main.css');
const responsiveCssPath = path.join(__dirname, '../assets/css/responsive.css');
const indexHtmlPath = path.join(__dirname, '../index.html');

describe('Layout & Floating UI Architecture Contract', () => {
  describe('Floating UI Stacking & Design Tokens', () => {
    it('declares central stacking tokens in common.css :root with correct hierarchy', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');

      // Verify token declarations exist
      assert.match(commonCss, /--z-bird-companion:\s*900/i);
      assert.match(commonCss, /--z-on-top:\s*998/i);
      assert.match(commonCss, /--z-chatbot-toggle:\s*999/i);
      assert.match(commonCss, /--z-chatbot-window:\s*1000/i);

      // Verify hierarchy: bird < onTop < toggle <= window
      const birdZ = 900;
      const onTopZ = 998;
      const toggleZ = 999;
      const windowZ = 1000;

      assert.ok(birdZ < onTopZ, 'Companion bird must sit below scroll-to-top button');
      assert.ok(onTopZ < toggleZ, 'Scroll-to-top must sit below chatbot toggle');
      assert.ok(toggleZ < windowZ, 'Chatbot toggle must sit below chatbot window');
    });

    it('positions .onTop and .ai-chatbot-toggle without collision on desktop', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');

      const onTopMatch = commonCss.match(/\.onTop\s*\{([^}]+)\}/);
      assert.ok(onTopMatch, '.onTop block must exist in common.css');
      assert.match(onTopMatch[1], /position:\s*fixed/i);
      assert.match(onTopMatch[1], /bottom:\s*88px/i);
      assert.match(onTopMatch[1], /right:\s*24px/i);
      assert.match(onTopMatch[1], /z-index:\s*998/i);

      const toggleMatch = commonCss.match(/\.ai-chatbot-toggle[^{]*\{([^}]+)\}/);
      assert.ok(toggleMatch, '.ai-chatbot-toggle block must exist in common.css');
      assert.match(toggleMatch[1], /position:\s*fixed/i);
      assert.match(toggleMatch[1], /bottom:\s*24px/i);
      assert.match(toggleMatch[1], /right:\s*24px/i);
      assert.match(toggleMatch[1], /z-index:\s*999/i);
    });

    it('ensures bird companion and speech bubbles stack below active chatbot window', () => {
      const mainCss = fs.readFileSync(mainCssPath, 'utf8');
      assert.match(mainCss, /\.bird-companion\s*\{[\s\S]*?z-index:\s*var\(--z-bird-companion/i);
      assert.match(mainCss, /\.bird-speech-bubble\s*\{[\s\S]*?z-index:\s*calc\(var\(--z-bird-companion/i);
    });
  });

  describe('Mobile Viewport & Media Query Invariants (<= 739px)', () => {
    it('hides .onTop and docks chatbot window to floating bottom card on mobile', () => {
      const responsiveCss = fs.readFileSync(responsiveCssPath, 'utf8');

      const mobileBlockMatch = responsiveCss.match(/@media\s*\([^)]*max-width:\s*739px[^)]*\)\s*\{([\s\S]*?)(?=@media|$)/i);
      assert.ok(mobileBlockMatch, 'Mobile @media (max-width: 739px) block must exist');

      const content = mobileBlockMatch[1];
      assert.match(content, /\.onTop\s*\{[^}]*display:\s*none/i);
      assert.match(content, /\.ai-chatbot-window\s*\{/i);
      assert.match(content, /width:\s*calc\(100%\s*-\s*32px\)/i);
      assert.match(content, /height:\s*75vh/i);
    });
  });

  describe('Accessibility Structure in index.html', () => {
    it('provides accessible toggle and semantic window container with close button', () => {
      const html = fs.readFileSync(indexHtmlPath, 'utf8');

      assert.match(html, /<button[^>]*id=["']ai-chatbot-toggle["'][^>]*aria-expanded=["']false["']/i);
      assert.match(html, /<section[^>]*id=["']ai-chatbot-window["'][^>]*aria-hidden=["']true["']/i);
      assert.match(html, /<button[^>]*id=["']ai-chatbot-close["'][^>]*aria-label=["'][^"']*đóng/i);
      assert.match(html, /<div[^>]*id=["']ai-chatbot-messages["']/i);
      assert.match(html, /<input[^>]*id=["']ai-chatbot-input["']/i);
      assert.match(html, /<button[^>]*id=["']ai-chatbot-send["']/i);
    });
  });
});
