const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  formatMarkdown,
  initChatbotWindow,
  initChatbotToggle,
  CHATBOT_KNOWLEDGE_BASE
} = require('../chatbot.js');

const commonCssPath = path.join(__dirname, '../assets/css/common.css');
const responsiveCssPath = path.join(__dirname, '../assets/css/responsive.css');
const indexHtmlPath = path.join(__dirname, '../index.html');

describe('03: Chat Window UI, Sora Theme Integration and Micro-Markdown Formatter', () => {
  describe('Micro-Markdown Formatter (formatMarkdown)', () => {
    it('returns empty string for null, undefined, or non-string inputs', () => {
      assert.strictEqual(formatMarkdown(null), '');
      assert.strictEqual(formatMarkdown(undefined), '');
      assert.strictEqual(formatMarkdown(123), '');
      assert.strictEqual(formatMarkdown({}), '');
    });

    it('sanitizes raw HTML to prevent XSS injection attacks', () => {
      const malicious = '<script>alert("xss")</script><img src="x" onerror="steal()">';
      const formatted = formatMarkdown(malicious);
      assert.ok(!formatted.includes('<script>'), 'Must not contain unescaped script tag');
      assert.ok(!formatted.includes('<img'), 'Must not contain unescaped img tag');
      assert.ok(formatted.includes('&lt;script&gt;'), 'Must encode < and >');
    });

    it('converts **bold text** into <strong>bold text</strong>', () => {
      const input = 'Xin chào **Nguyễn Công Hậu** và **kỹ năng**!';
      const formatted = formatMarkdown(input);
      assert.strictEqual(
        formatted,
        'Xin chào <strong>Nguyễn Công Hậu</strong> và <strong>kỹ năng</strong>!'
      );
    });

    it('converts markdown links [text](url) into safe <a> tags with target="_blank" and rel="noopener noreferrer"', () => {
      const input = 'Dự án: [SmartSalon](https://github.com/congHau02/SmartSalon)';
      const formatted = formatMarkdown(input);
      assert.ok(
        formatted.includes('<a href="https://github.com/congHau02/SmartSalon" target="_blank" rel="noopener noreferrer">SmartSalon</a>'),
        'Must format link with proper attributes'
      );
    });

    it('converts bullet points (•) into styled bullet elements', () => {
      const input = '• Item 1\n• Item 2';
      const formatted = formatMarkdown(input);
      assert.ok(formatted.includes('<span class="ai-chatbot-bullet">•</span> Item 1'), 'Bullet symbol must be wrapped in styled span');
      assert.ok(formatted.includes('<span class="ai-chatbot-bullet">•</span> Item 2'), 'Bullet symbol must be wrapped in styled span');
    });

    it('converts linebreaks (\\n) into <br> tags', () => {
      const input = 'Dòng 1\nDòng 2\n\nDòng 3';
      const formatted = formatMarkdown(input);
      assert.strictEqual(
        formatted,
        'Dòng 1<br>Dòng 2<br><br>Dòng 3'
      );
    });

    it('accurately parses complex Knowledge Base responses containing bold, links, bullets, and linebreaks', () => {
      const projectsResponse = CHATBOT_KNOWLEDGE_BASE.projects.response;
      const formatted = formatMarkdown(projectsResponse);

      // Check bold
      assert.ok(formatted.includes('<strong>4 dự án mã nguồn mở tiêu biểu</strong>'));
      // Check links
      assert.ok(formatted.includes('<a href="https://github.com/congHau02/SmartSalon" target="_blank" rel="noopener noreferrer">SmartSalon</a>'));
      assert.ok(formatted.includes('<a href="https://github.com/congHau02/The-Booking-Site" target="_blank" rel="noopener noreferrer">The-Booking-Site</a>'));
      // Check bullets
      assert.ok(formatted.includes('<span class="ai-chatbot-bullet">•</span>'));
      // Check linebreaks
      assert.ok(formatted.includes('<br>'));
    });
  });

  describe('HTML Markup & Accessibility Structure', () => {
    it('index.html contains #ai-chatbot-window structured with header, body, and footer', () => {
      const html = fs.readFileSync(indexHtmlPath, 'utf8');

      // Check container
      assert.match(html, /id=["']ai-chatbot-window["']/i, 'index.html must have #ai-chatbot-window');
      assert.match(html, /class=["'][^"']*ai-chatbot-window[^"']*["']/i, 'Must have class ai-chatbot-window');

      // Check header
      assert.match(html, /<header[^>]*class=["'][^"']*ai-chatbot-window__header[^"']*["']/i, 'Must contain header element');
      assert.match(html, /Trợ lý ảo Công Hậu/i, 'Header must display assistant name');
      assert.match(html, /id=["']ai-chatbot-close["']/i, 'Header must contain close button #ai-chatbot-close');
      assert.match(html, /aria-label=["'][^"']*đóng[^"']*["']/i, 'Close button must have aria-label');

      // Check body (messages)
      assert.match(html, /id=["']ai-chatbot-messages["']/i, 'Must have messages container #ai-chatbot-messages');
      assert.match(html, /class=["'][^"']*ai-chatbot-window__body[^"']*["']/i, 'Messages container must have body class');

      // Check footer (input bar)
      assert.match(html, /<footer[^>]*class=["'][^"']*ai-chatbot-window__footer[^"']*["']/i, 'Must contain footer element');
      assert.match(html, /id=["']ai-chatbot-input["']/i, 'Footer must contain input #ai-chatbot-input');
      assert.match(html, /id=["']ai-chatbot-send["']/i, 'Footer must contain send button #ai-chatbot-send');
    });
  });

  describe('CSS Styling, Sora Theme Integration & Responsive Layout', () => {
    it('applies Sora font family and standard CSS variables to chat window', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');

      assert.match(commonCss, /\.ai-chatbot-window\s*\{[^}]*font-family:\s*["']Sora["']/i, 'Must specify Sora font-family');
      assert.match(commonCss, /\.ai-chatbot-window/i, 'Must have .ai-chatbot-window styles');
      assert.match(commonCss, /--header-color/i, 'Must reference --header-color');
      assert.match(commonCss, /--blue-1/i, 'Must reference --blue-1');
      assert.match(commonCss, /--blue-2/i, 'Must reference --blue-2');
    });

    it('positions chat window on desktop floating above FAB with rounded corners and shadow', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');

      const windowMatch = commonCss.match(/\.ai-chatbot-window\s*\{([^}]+)\}/);
      assert.ok(windowMatch, '.ai-chatbot-window CSS rule must exist in common.css');

      const windowContent = windowMatch[1];
      assert.match(windowContent, /position:\s*fixed/i, 'Must be position: fixed');
      assert.match(windowContent, /bottom:\s*88px/i, 'Must float at bottom: 88px on desktop');
      assert.match(windowContent, /right:\s*24px/i, 'Must float at right: 24px on desktop');
      assert.match(windowContent, /border-radius:\s*(1[2-9]|2\d)px/i, 'Must have rounded corners (>=12px)');
      assert.match(windowContent, /box-shadow:/i, 'Must have box-shadow');
      assert.match(windowContent, /z-index:\s*(1000|999)/i, 'Must have appropriate z-index');
    });

    it('adapts styling when Light Mode (html.light) is active', () => {
      const commonCss = fs.readFileSync(commonCssPath, 'utf8');

      assert.match(
        commonCss,
        /html\.light\s+[\s\S]*?\.ai-chatbot-window/i,
        'common.css must define light mode overrides for .ai-chatbot-window'
      );
    });

    it('adjusts chat window to responsive floating card on mobile (width <= 739px)', () => {
      const responsiveCss = fs.readFileSync(responsiveCssPath, 'utf8');

      const mobileBlockMatch = responsiveCss.match(/@media\s*\([^)]*max-width:\s*739px[^)]*\)\s*\{([\s\S]*?)(?=@media|$)/i);
      assert.ok(mobileBlockMatch, 'Mobile @media block (max-width: 739px) must exist');

      const mobileContent = mobileBlockMatch[1];
      assert.match(mobileContent, /\.ai-chatbot-window\s*\{/i, 'Must style .ai-chatbot-window on mobile');
      assert.match(mobileContent, /width:\s*calc\(100%\s*-\s*32px\)/i, 'Mobile width must be calc(100% - 32px)');
      assert.match(mobileContent, /height:\s*75vh/i, 'Mobile height must be 75vh');
      assert.match(mobileContent, /right:\s*16px/i, 'Mobile right must be 16px');
      assert.match(mobileContent, /bottom:\s*16px/i, 'Mobile bottom must be 16px');
    });
  });

  describe('Chat Window Interactions: Toggle, Close & Input Bar', () => {
    it('close button hides window and synchronizes FAB toggle state', () => {
      // Mock DOM
      const listeners = {};
      const windowClassList = new Set(['active']);
      const toggleClassList = new Set(['active']);

      const mockWindow = {
        classList: {
          contains: (cls) => windowClassList.has(cls),
          add: (cls) => windowClassList.add(cls),
          remove: (cls) => windowClassList.delete(cls),
          toggle: (cls, force) => {
            if (force !== undefined) {
              if (force) windowClassList.add(cls);
              else windowClassList.delete(cls);
            } else {
              windowClassList.has(cls) ? windowClassList.delete(cls) : windowClassList.add(cls);
            }
          }
        },
        setAttribute: () => {},
        getAttribute: () => 'false'
      };

      const mockToggle = {
        classList: {
          contains: (cls) => toggleClassList.has(cls),
          add: (cls) => toggleClassList.add(cls),
          remove: (cls) => toggleClassList.delete(cls),
          toggle: (cls, force) => {
            if (force !== undefined) {
              if (force) toggleClassList.add(cls);
              else toggleClassList.delete(cls);
            } else {
              toggleClassList.has(cls) ? toggleClassList.delete(cls) : toggleClassList.add(cls);
            }
          }
        },
        setAttribute: (k, v) => { mockToggle[k] = v; },
        getAttribute: (k) => mockToggle[k] || 'true',
        focus: () => { mockToggle.focused = true; }
      };

      const mockCloseBtn = {
        addEventListener: (event, handler) => {
          listeners['close:' + event] = handler;
        }
      };

      const mockInput = {
        focus: () => {},
        addEventListener: () => {}
      };

      const mockForm = {
        addEventListener: () => {}
      };

      const mockSendBtn = {
        addEventListener: () => {}
      };

      const globalDoc = global.document;
      global.document = {
        getElementById: (id) => {
          if (id === 'ai-chatbot-window') return mockWindow;
          if (id === 'ai-chatbot-toggle') return mockToggle;
          if (id === 'ai-chatbot-close') return mockCloseBtn;
          if (id === 'ai-chatbot-input') return mockInput;
          if (id === 'ai-chatbot-send') return mockSendBtn;
          if (id === 'ai-chatbot-form') return mockForm;
          return null;
        }
      };

      try {
        initChatbotWindow();

        // Simulate click on close button
        assert.ok(listeners['close:click'], 'Close button must have click listener attached');
        listeners['close:click']();

        assert.ok(!windowClassList.has('active'), 'Chat window active class must be removed');
        assert.ok(!toggleClassList.has('active'), 'Toggle active class must be removed');
        assert.strictEqual(mockToggle['aria-expanded'], 'false', 'Toggle aria-expanded must be false');
      } finally {
        global.document = globalDoc;
      }
    });

    it('input bar handles message submission via button click or Enter key and clears field', () => {
      const listeners = {};
      let appendedContent = null;

      const mockInput = {
        value: '   Kỹ năng của bạn là gì?   ',
        focus: () => {},
        addEventListener: (event, handler) => {
          listeners['input:' + event] = handler;
        }
      };

      const mockMessages = {
        scrollTop: 0,
        scrollHeight: 500,
        appendChild: (el) => {
          appendedContent = el;
        }
      };

      const mockForm = {
        addEventListener: (event, handler) => {
          listeners['form:' + event] = handler;
        }
      };

      const mockSendBtn = {
        addEventListener: (event, handler) => {
          listeners['send:' + event] = handler;
        }
      };

      const globalDoc = global.document;
      global.document = {
        getElementById: (id) => {
          if (id === 'ai-chatbot-input') return mockInput;
          if (id === 'ai-chatbot-messages') return mockMessages;
          if (id === 'ai-chatbot-form') return mockForm;
          if (id === 'ai-chatbot-send') return mockSendBtn;
          if (id === 'ai-chatbot-window') return { classList: { contains: () => true, toggle: () => {} }, setAttribute: () => {} };
          if (id === 'ai-chatbot-toggle') return { classList: { toggle: () => {} }, setAttribute: () => {}, getAttribute: () => 'false' };
          if (id === 'ai-chatbot-close') return { addEventListener: () => {} };
          return null;
        },
        createElement: (tag) => {
          return {
            tagName: tag,
            classList: { add: () => {} },
            innerHTML: '',
            setAttribute: () => {},
            appendChild: () => {}
          };
        }
      };

      try {
        initChatbotWindow();

        // Submit through form submit event
        assert.ok(listeners['form:submit'] || listeners['send:click'], 'Must register submit or send click listener');
        const submitHandler = listeners['form:submit'] || listeners['send:click'];
        submitHandler({ preventDefault: () => {} });

        // Input value should be cleared
        assert.strictEqual(mockInput.value, '', 'Input field must be cleared after submission');
      } finally {
        global.document = globalDoc;
      }
    });
  });
});
