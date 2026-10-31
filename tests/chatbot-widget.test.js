const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { initChatbot, resetChatState } = require('../chatbot.js');
const { createMockDOM } = require('./helpers/dom-fixture.js');

describe('Chatbot Widget Deep Module Controller (initChatbot)', () => {
  let originalDoc;
  let originalWin;

  beforeEach(() => {
    originalDoc = global.document;
    originalWin = global.window;
    resetChatState();
  });

  afterEach(() => {
    resetChatState();
    global.document = originalDoc;
    global.window = originalWin;
  });

  it('initializes and returns a complete widget controller interface', () => {
    const { doc, win } = createMockDOM();
    global.document = doc;
    global.window = win;

    const widget = initChatbot({ document: doc, window: win, typingDelayMs: 20 });

    assert.ok(widget, 'initChatbot must return widget controller');
    assert.strictEqual(typeof widget.openChat, 'function');
    assert.strictEqual(typeof widget.closeChat, 'function');
    assert.strictEqual(typeof widget.reset, 'function');
    assert.strictEqual(typeof widget.destroy, 'function');
    assert.strictEqual(typeof widget.handleUserMessage, 'function');
  });

  it('openChat and closeChat manage active classes, aria attributes and greeting rendering', () => {
    const { doc, win, elements } = createMockDOM();
    global.document = doc;
    global.window = win;

    const widget = initChatbot({ document: doc, window: win, typingDelayMs: 20 });

    const toggleBtn = elements['ai-chatbot-toggle'];
    const chatWindow = elements['ai-chatbot-window'];
    const messagesFeed = elements['ai-chatbot-messages'];

    // 1. Initial state
    assert.strictEqual(toggleBtn.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(chatWindow.classList.contains('active'), false);
    assert.strictEqual(messagesFeed.children.length, 0);

    // 2. Open chat via controller
    widget.openChat();
    assert.strictEqual(toggleBtn.getAttribute('aria-expanded'), 'true');
    assert.strictEqual(chatWindow.classList.contains('active'), true);
    assert.strictEqual(chatWindow.getAttribute('aria-hidden'), 'false');

    // Greeting must be rendered
    assert.strictEqual(messagesFeed.children.length, 1);
    const greetingMsg = messagesFeed.children[0];
    assert.strictEqual(greetingMsg.classList.contains('ai-chatbot-message--bot'), true);

    // 3. Close chat via controller
    widget.closeChat();
    assert.strictEqual(toggleBtn.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(chatWindow.classList.contains('active'), false);
    assert.strictEqual(chatWindow.getAttribute('aria-hidden'), 'true');
  });

  it('handles message dispatch and typing delay lifecycle through controller', async () => {
    const { doc, win, elements } = createMockDOM();
    global.document = doc;
    global.window = win;

    const widget = initChatbot({ document: doc, window: win, typingDelayMs: 25 });
    widget.openChat();

    const messagesFeed = elements['ai-chatbot-messages'];
    assert.strictEqual(messagesFeed.children.length, 1); // greeting

    const result = await widget.handleUserMessage('kỹ năng', { delay: 25 });

    assert.ok(result, 'handleUserMessage must resolve with matched intent and element');
    assert.strictEqual(result.intent.id, 'skills');

    // Bot message for skills should be in messages
    const botMsg = messagesFeed.children.find(m => m !== messagesFeed.children[0] && m.classList.contains('ai-chatbot-message--bot'));
    assert.ok(botMsg, 'Bot skills message must exist');
    const bubble = botMsg.querySelector('.ai-chatbot-message__bubble');
    assert.ok(bubble, 'Bot message must contain a bubble');
    assert.ok(bubble.innerHTML.includes('React') || bubble.innerHTML.includes('Spring Boot'));
  });

  it('resets conversation state and clears messages when widget.reset() is called', () => {
    const { doc, win, elements } = createMockDOM();
    global.document = doc;
    global.window = win;

    const widget = initChatbot({ document: doc, window: win });
    widget.openChat();

    const messagesFeed = elements['ai-chatbot-messages'];
    assert.strictEqual(messagesFeed.children.length, 1);

    widget.reset();
    assert.strictEqual(messagesFeed.children.length, 0, 'Messages must be cleared on reset');
    assert.strictEqual(elements['ai-chatbot-window'].classList.contains('active'), false);
  });
});
