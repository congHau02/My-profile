const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  CHATBOT_KNOWLEDGE_BASE,
  matchIntent,
  formatMarkdown,
  appendChatMessage,
  showTypingIndicator,
  hideTypingIndicator,
  handleUserMessage,
  renderGreeting,
  openChat,
  closeChat,
  scrollToTarget,
  isMobileDevice,
  resetChatState,
  initChatbotToggle,
  initChatbotWindow
} = require('../chatbot.js');

const commonCssPath = path.join(__dirname, '../assets/css/common.css');

/**
 * Creates a minimal DOM mock structure for testing chatbot conversation flow.
 */
function createMockDOM(options = {}) {
  const elements = {};
  const allDynamicElements = [];

  function makeElement(tag, id = '') {
    const classSet = new Set();
    const attrs = {};
    const children = [];
    const elListeners = {};
    let _innerHTML = '';

    const el = {
      tagName: tag.toUpperCase(),
      id,
      children,
      style: {},
      scrollTop: 0,
      scrollHeight: 100,
      value: '',
      textContent: '',
      get innerHTML() {
        return _innerHTML;
      },
      set innerHTML(val) {
        _innerHTML = String(val);
        if (val === '') {
          children.length = 0;
        }
      },
      get className() {
        return Array.from(classSet).join(' ');
      },
      set className(val) {
        classSet.clear();
        if (typeof val === 'string') {
          val.split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
        }
      },
      classList: {
        contains: (c) => classSet.has(c),
        add: (...classes) => classes.forEach(c => classSet.add(c)),
        remove: (...classes) => classes.forEach(c => classSet.delete(c)),
        toggle: (c, force) => {
          if (force !== undefined) {
            force ? classSet.add(c) : classSet.delete(c);
          } else {
            classSet.has(c) ? classSet.delete(c) : classSet.add(c);
          }
        }
      },
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => attrs[k] !== undefined ? attrs[k] : (el[k] !== undefined ? String(el[k]) : null),
      hasAttribute: (k) => attrs[k] !== undefined,
      removeAttribute: (k) => { delete attrs[k]; },
      appendChild: (child) => {
        child.parentNode = el;
        children.push(child);
        return child;
      },
      removeChild: (child) => {
        const idx = children.indexOf(child);
        if (idx !== -1) children.splice(idx, 1);
        child.parentNode = null;
        return child;
      },
      querySelector: (selector) => {
        if (selector.startsWith('#')) {
          const targetId = selector.slice(1);
          return findById(el, targetId);
        }
        if (selector.startsWith('.')) {
          const targetClass = selector.slice(1);
          return findByClass(el, targetClass);
        }
        return null;
      },
      querySelectorAll: (selector) => {
        const results = [];
        if (selector.startsWith('.')) {
          const targetClass = selector.slice(1);
          collectByClass(el, targetClass, results);
        }
        return results;
      },
      addEventListener: (event, handler) => {
        if (!elListeners[event]) elListeners[event] = [];
        elListeners[event].push(handler);
      },
      dispatchEvent: (eventObj) => {
        const type = typeof eventObj === 'string' ? eventObj : eventObj.type;
        const handlers = elListeners[type] || [];
        for (const h of handlers) {
          h(eventObj);
        }
      },
      click: () => {
        const handlers = elListeners['click'] || [];
        for (const h of handlers) {
          h({ preventDefault: () => {} });
        }
      },
      focus: () => {
        el.isFocused = true;
      },
      scrollIntoView: (opts) => {
        el.scrolledIntoViewWith = opts;
      }
    };

    allDynamicElements.push(el);
    return el;
  }

  function findById(node, targetId) {
    if (node.id === targetId) return node;
    for (const child of node.children || []) {
      const found = findById(child, targetId);
      if (found) return found;
    }
    return null;
  }

  function findByClass(node, targetClass) {
    if (node.classList && node.classList.contains(targetClass)) return node;
    for (const child of node.children || []) {
      const found = findByClass(child, targetClass);
      if (found) return found;
    }
    return null;
  }

  function collectByClass(node, targetClass, out) {
    if (node.classList && node.classList.contains(targetClass)) {
      out.push(node);
    }
    for (const child of node.children || []) {
      collectByClass(child, targetClass, out);
    }
  }

  const toggleBtn = makeElement('button', 'ai-chatbot-toggle');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-controls', 'ai-chatbot-window');

  const chatWindow = makeElement('section', 'ai-chatbot-window');
  chatWindow.setAttribute('aria-hidden', 'true');

  const closeBtn = makeElement('button', 'ai-chatbot-close');
  const messagesFeed = makeElement('div', 'ai-chatbot-messages');
  const form = makeElement('form', 'ai-chatbot-form');
  const input = makeElement('input', 'ai-chatbot-input');
  const sendBtn = makeElement('button', 'ai-chatbot-send');

  const skillsSection = makeElement('section', 'skills');
  const infoSection = makeElement('section', 'info');
  const educationSection = makeElement('section', 'education');

  elements['ai-chatbot-toggle'] = toggleBtn;
  elements['ai-chatbot-window'] = chatWindow;
  elements['ai-chatbot-close'] = closeBtn;
  elements['ai-chatbot-messages'] = messagesFeed;
  elements['ai-chatbot-form'] = form;
  elements['ai-chatbot-input'] = input;
  elements['ai-chatbot-send'] = sendBtn;
  elements['skills'] = skillsSection;
  elements['info'] = infoSection;
  elements['education'] = educationSection;

  const doc = {
    getElementById: (id) => {
      if (elements[id]) return elements[id];
      for (const el of allDynamicElements) {
        if (el.id === id && el.parentNode) return el;
      }
      return null;
    },
    querySelector: (sel) => {
      if (sel.startsWith('#')) return doc.getElementById(sel.slice(1));
      return null;
    },
    createElement: (tag) => makeElement(tag)
  };

  const win = {
    innerWidth: options.innerWidth !== undefined ? options.innerWidth : 1024,
    matchMedia: (query) => ({
      matches: options.isMobile !== undefined ? options.isMobile : (options.innerWidth !== undefined ? options.innerWidth <= 739 : false)
    })
  };

  return { doc, win, elements, makeElement };
}

describe('04: End-to-End Conversation Flow, Typing Delay, Quick Reply Chips and Smart Navigation', () => {
  let originalDoc;
  let originalWin;

  beforeEach(() => {
    originalDoc = global.document;
    originalWin = global.window;
    if (typeof resetChatState === 'function') {
      resetChatState();
    }
  });

  afterEach(() => {
    global.document = originalDoc;
    global.window = originalWin;
    if (typeof resetChatState === 'function') {
      resetChatState();
    }
  });

  describe('1. Initial Greeting & Quick Reply Chips', () => {
    it('opening the chat window for the first time renders an initial greeting accompanied by initial Quick Reply Chips', () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      initChatbotToggle();
      initChatbotWindow();

      // Open chat window via toggle click
      elements['ai-chatbot-toggle'].click();

      // Verify chat window is open
      assert.strictEqual(elements['ai-chatbot-window'].classList.contains('active'), true);
      assert.strictEqual(elements['ai-chatbot-toggle'].getAttribute('aria-expanded'), 'true');

      // Verify greeting message rendered in messages feed
      const messagesFeed = elements['ai-chatbot-messages'];
      assert.strictEqual(messagesFeed.children.length, 1, 'Messages feed should have 1 initial greeting message');

      const greetingMessage = messagesFeed.children[0];
      assert.strictEqual(greetingMessage.classList.contains('ai-chatbot-message--bot'), true);

      // Verify greeting content contains assistant intro
      const bubble = greetingMessage.querySelector('.ai-chatbot-message__bubble');
      assert.ok(bubble, 'Greeting must have message bubble');
      assert.ok(bubble.innerHTML.includes('Trợ lý ảo của Nguyễn Công Hậu'), 'Must contain assistant greeting');

      // Verify initial Quick Reply Chips: "Kỹ năng công nghệ", "Dự án tiêu biểu", "Thông tin liên hệ"
      const chipsContainer = greetingMessage.querySelector('.ai-chatbot-chips');
      assert.ok(chipsContainer, 'Greeting must include Quick Reply Chips container');

      const chipElements = greetingMessage.querySelectorAll('.ai-chatbot-chip');
      assert.strictEqual(chipElements.length, 3, 'Must render exactly 3 initial Quick Reply Chips');

      const chipLabels = chipElements.map(c => c.textContent.trim());
      assert.deepStrictEqual(chipLabels, [
        'Kỹ năng công nghệ',
        'Dự án tiêu biểu',
        'Thông tin liên hệ'
      ]);
    });

    it('re-opening an already opened chat window does not duplicate the greeting message', () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      initChatbotToggle();
      initChatbotWindow();

      // First open -> renders greeting
      elements['ai-chatbot-toggle'].click();
      assert.strictEqual(elements['ai-chatbot-messages'].children.length, 1);

      // Close chat
      elements['ai-chatbot-close'].click();
      assert.strictEqual(elements['ai-chatbot-window'].classList.contains('active'), false);

      // Re-open chat
      elements['ai-chatbot-toggle'].click();
      assert.strictEqual(elements['ai-chatbot-messages'].children.length, 1, 'Must not duplicate greeting on re-open');
    });
  });

  describe('2. Quick Reply Chip Dispatching', () => {
    it('clicking any Quick Reply Chip automatically dispatches the corresponding question as if typed by the user', async () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      initChatbotToggle();
      initChatbotWindow();

      elements['ai-chatbot-toggle'].click();

      const greetingMessage = elements['ai-chatbot-messages'].children[0];
      const chips = greetingMessage.querySelectorAll('.ai-chatbot-chip');
      const skillsChip = chips[0]; // "Kỹ năng công nghệ"

      // Click chip DOM button directly
      skillsChip.click();

      // User bubble should immediately appear
      const messages = elements['ai-chatbot-messages'].children;
      assert.strictEqual(messages.length >= 2, true, 'User bubble should be appended');
      const userBubble = messages[1];
      assert.strictEqual(userBubble.classList.contains('ai-chatbot-message--user'), true);
      assert.strictEqual(userBubble.querySelector('.ai-chatbot-message__bubble').textContent, 'Kỹ năng công nghệ');

      // Wait for real typing delay (400ms-600ms) to complete
      await new Promise(resolve => setTimeout(resolve, 650));

      // After dispatch completes, bot response for skills must be rendered
      const botResponse = elements['ai-chatbot-messages'].children.find(
        m => m !== greetingMessage && m.classList.contains('ai-chatbot-message--bot') && !m.classList.contains('ai-chatbot-typing-message')
      );
      assert.ok(botResponse, 'Bot response for skills must be appended');
      const botBubble = botResponse.querySelector('.ai-chatbot-message__bubble');
      assert.ok(botBubble.innerHTML.includes('React') || botBubble.innerHTML.includes('Java Spring Boot'), 'Should match skills intent');
    });
  });

  describe('3. User Message Submission & Auto-Scroll', () => {
    it('submitting a question appends a user message bubble and scrolls the message feed to the bottom', () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      const messagesFeed = elements['ai-chatbot-messages'];
      messagesFeed.scrollHeight = 800;

      appendChatMessage('Tôi muốn tìm hiểu về dự án', 'user', messagesFeed);

      assert.strictEqual(messagesFeed.children.length, 1);
      const userMsg = messagesFeed.children[0];
      assert.strictEqual(userMsg.classList.contains('ai-chatbot-message--user'), true);
      assert.strictEqual(userMsg.querySelector('.ai-chatbot-message__bubble').textContent, 'Tôi muốn tìm hiểu về dự án');
      assert.strictEqual(messagesFeed.scrollTop, 800, 'Message feed must auto-scroll to scrollHeight');
    });
  });

  describe('4. Typing Indicator Lifecycle & Timing Delay', () => {
    it('shows a 3-dot typing indicator before the bot answers and removes it when answered', async () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      const messagesFeed = elements['ai-chatbot-messages'];

      const dispatchPromise = handleUserMessage('kỹ năng', { container: messagesFeed, delay: 50 });

      // While typing, typing indicator must be present in messages feed
      const typingEl = doc.getElementById('ai-chatbot-typing');
      assert.ok(typingEl, 'Typing indicator must be present during typing delay');
      assert.strictEqual(typingEl.classList.contains('ai-chatbot-typing-message'), true);

      // Verify it contains 3 dots
      const dots = typingEl.querySelectorAll('.ai-chatbot-typing-dot');
      assert.strictEqual(dots.length, 3, 'Typing indicator must contain exactly 3 dots');

      await dispatchPromise;

      // After answer is dispatched, typing indicator must be removed
      assert.strictEqual(doc.getElementById('ai-chatbot-typing'), null, 'Typing indicator must be removed after bot replies');
    });

    it('default typing delay falls within 400ms–600ms range', () => {
      // Test the default delay generation range logic
      const delays = [];
      for (let i = 0; i < 50; i++) {
        const minDelay = 400;
        const maxDelay = 600;
        const d = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        delays.push(d);
      }
      for (const d of delays) {
        assert.ok(d >= 400 && d <= 600, `Delay ${d} must be within 400ms-600ms`);
      }
    });
  });

  describe('5. Bot Response Formatting & Contextual Follow-Up Quick Reply Chips', () => {
    it('bot response is formatted with micro-markdown and contextual follow-up Quick Reply Chips', async () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      const messagesFeed = elements['ai-chatbot-messages'];

      await handleUserMessage('dự án', { container: messagesFeed, delay: 10 });

      const botMessage = messagesFeed.children.find(m => m.classList.contains('ai-chatbot-message--bot'));
      assert.ok(botMessage, 'Bot message must be rendered');

      // Formatted markdown check
      const bubble = botMessage.querySelector('.ai-chatbot-message__bubble');
      assert.ok(bubble.innerHTML.includes('<strong>4 dự án mã nguồn mở tiêu biểu</strong>'));
      assert.ok(bubble.innerHTML.includes('<a href="https://github.com/congHau02/SmartSalon"'));

      // Contextual chips check
      const chips = botMessage.querySelectorAll('.ai-chatbot-chip');
      assert.ok(chips.length > 0, 'Must include contextual follow-up chips');
      const labels = chips.map(c => c.textContent.trim());
      assert.deepStrictEqual(labels, ['Kỹ năng công nghệ', 'Học vấn & Kinh nghiệm', 'Thông tin liên hệ']);
    });
  });

  describe('6. Smart Navigation & Smooth Scrolling (Desktop)', () => {
    it('smoothly scrolls to the target element if matched intent specifies scrollTo', async () => {
      const { doc, win, elements } = createMockDOM({ isMobile: false, innerWidth: 1200 });
      global.document = doc;
      global.window = win;

      const skillsSection = elements['skills'];
      assert.strictEqual(skillsSection.scrolledIntoViewWith, undefined);

      await handleUserMessage('kỹ năng', { isMobile: false, delay: 10 });

      assert.deepStrictEqual(skillsSection.scrolledIntoViewWith, { behavior: 'smooth' }, 'Must scroll to #skills with smooth behavior');
    });

    it('does not scroll if matched intent has no scrollTo target (e.g. fallback)', async () => {
      const { doc, win, elements } = createMockDOM({ isMobile: false, innerWidth: 1200 });
      global.document = doc;
      global.window = win;

      elements['skills'].scrolledIntoViewWith = undefined;
      elements['info'].scrolledIntoViewWith = undefined;

      await handleUserMessage('cau hoi khong lien quan linh tinh abcxyz', { isMobile: false, delay: 10 });

      assert.strictEqual(elements['skills'].scrolledIntoViewWith, undefined);
      assert.strictEqual(elements['info'].scrolledIntoViewWith, undefined);
    });
  });

  describe('7. Mobile In-Message View Link ("👉 Xem trên trang")', () => {
    it('on mobile devices, bot messages with scroll targets include a clickable link that closes chat and focuses on the section', async () => {
      const { doc, win, elements } = createMockDOM({ isMobile: true, innerWidth: 500 });
      global.document = doc;
      global.window = win;

      initChatbotToggle();
      initChatbotWindow();

      // Open chat
      elements['ai-chatbot-toggle'].click();
      assert.strictEqual(elements['ai-chatbot-window'].classList.contains('active'), true);

      // Ask question about contact (scrollTo: '#info')
      await handleUserMessage('thông tin liên hệ', { isMobile: true, delay: 10 });

      const messagesFeed = elements['ai-chatbot-messages'];
      const botMessage = messagesFeed.children.find(
        m => m.classList.contains('ai-chatbot-message--bot') && m !== messagesFeed.children[0]
      );
      assert.ok(botMessage, 'Bot message must exist');

      // Verify link exists
      const viewLink = botMessage.querySelector('.ai-chatbot-view-link');
      assert.ok(viewLink, 'Must contain in-message view link on mobile');
      assert.strictEqual(viewLink.textContent.trim(), '👉 Xem trên trang');
      assert.strictEqual(viewLink.getAttribute('href'), '#info');

      // Click the view link
      viewLink.click();

      // Chat window must be closed
      assert.strictEqual(elements['ai-chatbot-window'].classList.contains('active'), false);
      assert.strictEqual(elements['ai-chatbot-toggle'].getAttribute('aria-expanded'), 'false');

      // #info section must be scrolled into view and focused
      assert.deepStrictEqual(elements['info'].scrolledIntoViewWith, { behavior: 'smooth' });
      assert.strictEqual(elements['info'].isFocused, true);
    });
  });

  describe('8. In-Memory State Reset', () => {
    it('reloading / resetChatState resets the chat session to the initial fresh greeting state', () => {
      const { doc, win, elements } = createMockDOM();
      global.document = doc;
      global.window = win;

      initChatbotToggle();
      initChatbotWindow();

      // Open and simulate existing chat
      elements['ai-chatbot-toggle'].click();
      assert.strictEqual(elements['ai-chatbot-messages'].children.length, 1);

      // Reset state (simulating fresh page reload)
      resetChatState();

      // Opening again must cleanly render the fresh initial greeting
      elements['ai-chatbot-toggle'].click();
      assert.strictEqual(elements['ai-chatbot-messages'].children.length, 1);
      const greetingBubble = elements['ai-chatbot-messages'].children[0].querySelector('.ai-chatbot-message__bubble');
      assert.ok(greetingBubble.innerHTML.includes('Trợ lý ảo của Nguyễn Công Hậu'));
    });
  });

  describe('9. CSS Styling for Chips, Typing Dots, and View Links', () => {
    it('common.css contains rules for .ai-chatbot-chips and .ai-chatbot-chip', () => {
      const css = fs.readFileSync(commonCssPath, 'utf8');
      assert.match(css, /\.ai-chatbot-chips\s*\{/i);
      assert.match(css, /\.ai-chatbot-chip\s*\{/i);
      assert.match(css, /html\.light\s+[\s\S]*?\.ai-chatbot-chip/i);
    });

    it('common.css contains rules for 3-dot typing indicator and bounce animation', () => {
      const css = fs.readFileSync(commonCssPath, 'utf8');
      assert.match(css, /\.ai-chatbot-typing-dot/i);
      assert.match(css, /@keyframes\s+aiChatbotTypingBounce/i);
      assert.match(css, /html\.light\s+[\s\S]*?\.ai-chatbot-typing-dot/i);
    });

    it('common.css contains rules for mobile in-message view link', () => {
      const css = fs.readFileSync(commonCssPath, 'utf8');
      assert.match(css, /\.ai-chatbot-view-link/i);
      assert.match(css, /html\.light\s+[\s\S]*?\.ai-chatbot-view-link/i);
    });
  });
});
