/**
 * Shared minimal DOM stand-in for behavioural tests.
 *
 * Replaces the ad-hoc `global.document` mocks that used to be duplicated
 * across the chat-window, fab-stacking and conversation-flow test files.
 * Supports the subset of the DOM the Chatbot Widget and the Portfolio page
 * module use: ids/classes, attributes, children, bubbling click events,
 * document/window event listeners and a localStorage-like storage.
 */
function createMockDOM(options = {}) {
  const elements = {};
  const dynamicElements = [];
  const docListeners = {};
  const winListeners = {};

  function normalizeEvent(eventObj, target) {
    const type = typeof eventObj === 'string' ? eventObj : eventObj.type;
    const base = typeof eventObj === 'string' ? { type } : eventObj;
    return Object.assign({ type, target, preventDefault() {}, stopPropagation() {} }, base);
  }

  function fire(listeners, type, event) {
    for (const handler of (listeners[type] || []).slice()) handler(event);
  }

  function makeElement(tag, id = '') {
    const classSet = new Set();
    const attrs = {};
    const children = [];
    const listeners = {};
    let innerHTMLValue = '';

    const el = {
      tagName: tag.toUpperCase(),
      id,
      children,
      parentNode: null,
      style: { setProperty() {} },
      scrollTop: 0,
      scrollHeight: 100,
      value: '',
      textContent: '',
      get innerHTML() {
        if (innerHTMLValue) return innerHTMLValue;
        return children.map((c) => c.innerHTML || c.textContent || '').join('');
      },
      set innerHTML(val) {
        innerHTMLValue = String(val);
        if (val === '') children.length = 0;
      },
      get className() { return Array.from(classSet).join(' '); },
      set className(val) {
        classSet.clear();
        if (typeof val === 'string') val.split(/\s+/).filter(Boolean).forEach((c) => classSet.add(c));
      },
      classList: {
        contains: (c) => classSet.has(c),
        add: (...classes) => classes.forEach((c) => classSet.add(c)),
        remove: (...classes) => classes.forEach((c) => classSet.delete(c)),
        toggle: (c, force) => {
          const add = force !== undefined ? force : !classSet.has(c);
          if (add) classSet.add(c);
          else classSet.delete(c);
          return add;
        }
      },
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => (attrs[k] !== undefined ? attrs[k] : null),
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
      contains: (node) => {
        if (node === el) return true;
        return children.some((child) => child.contains && child.contains(node));
      },
      querySelector: (selector) => queryAll(el, selector)[0] || null,
      querySelectorAll: (selector) => queryAll(el, selector),
      addEventListener: (type, handler) => {
        (listeners[type] = listeners[type] || []).push(handler);
      },
      removeEventListener: (type, handler) => {
        listeners[type] = (listeners[type] || []).filter((h) => h !== handler);
      },
      /** Dispatches an event on this element, then bubbles it up to the document. */
      dispatchEvent: (eventObj) => {
        const event = normalizeEvent(eventObj, el);
        let stopped = false;
        const originalStop = event.stopPropagation;
        event.stopPropagation = () => { stopped = true; originalStop.call(event); };
        let node = el;
        while (node && !stopped) {
          fire(node._listeners, event.type, event);
          node = node.parentNode;
        }
        if (!stopped) fire(docListeners, event.type, event);
        return true;
      },
      click: () => el.dispatchEvent({ type: 'click' }),
      focus: () => { el.isFocused = true; },
      scrollIntoView: (opts) => { el.scrolledIntoViewWith = opts; },
      _listeners: listeners
    };

    dynamicElements.push(el);
    return el;
  }

  function matches(node, selector) {
    if (selector.startsWith('#')) return node.id === selector.slice(1);
    if (selector.startsWith('.')) return node.classList.contains(selector.slice(1));
    return node.tagName === selector.toUpperCase();
  }

  function queryAll(root, selector, out = []) {
    for (const child of root.children || []) {
      if (matches(child, selector)) out.push(child);
      queryAll(child, selector, out);
    }
    return out;
  }

  function register(id, el) {
    el.id = id;
    elements[id] = el;
    return el;
  }

  // Page structure: toggle + chat window (with its controls) + scroll targets
  const body = makeElement('body');
  const toggleBtn = register('ai-chatbot-toggle', makeElement('button'));
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-controls', 'ai-chatbot-window');

  const chatWindow = register('ai-chatbot-window', makeElement('section'));
  chatWindow.setAttribute('aria-hidden', 'true');
  const closeBtn = register('ai-chatbot-close', makeElement('button'));
  const messagesFeed = register('ai-chatbot-messages', makeElement('div'));
  const form = register('ai-chatbot-form', makeElement('form'));
  const input = register('ai-chatbot-input', makeElement('input'));
  const sendBtn = register('ai-chatbot-send', makeElement('button'));
  [closeBtn, messagesFeed, form].forEach((c) => chatWindow.appendChild(c));
  [input, sendBtn].forEach((c) => form.appendChild(c));

  const skills = register('skills', makeElement('section'));
  const info = register('info', makeElement('section'));
  const education = register('education', makeElement('section'));

  [toggleBtn, chatWindow, skills, info, education].forEach((c) => body.appendChild(c));

  const documentElement = makeElement('html');

  const doc = {
    body,
    documentElement,
    getElementById: (id) => {
      if (elements[id]) return elements[id];
      return dynamicElements.find((el) => el.id === id && el.parentNode) || null;
    },
    querySelector: (selector) => queryAll(body, selector)[0] || null,
    querySelectorAll: (selector) => queryAll(body, selector),
    createElement: (tag) => makeElement(tag),
    addEventListener: (type, handler) => {
      (docListeners[type] = docListeners[type] || []).push(handler);
    },
    removeEventListener: (type, handler) => {
      docListeners[type] = (docListeners[type] || []).filter((h) => h !== handler);
    },
    dispatchEvent: (eventObj) => fire(docListeners, normalizeEvent(eventObj, doc).type, normalizeEvent(eventObj, doc))
  };

  const storageData = {};
  const storage = {
    getItem: (k) => (k in storageData ? storageData[k] : null),
    setItem: (k, v) => { storageData[k] = String(v); },
    removeItem: (k) => { delete storageData[k]; }
  };

  const isMobile = options.isMobile !== undefined
    ? options.isMobile
    : (options.innerWidth !== undefined ? options.innerWidth <= 739 : false);

  const win = {
    innerWidth: options.innerWidth !== undefined ? options.innerWidth : 1024,
    innerHeight: 800,
    matchMedia: () => ({ matches: isMobile }),
    addEventListener: (type, handler) => {
      (winListeners[type] = winListeners[type] || []).push(handler);
    },
    removeEventListener: (type, handler) => {
      winListeners[type] = (winListeners[type] || []).filter((h) => h !== handler);
    },
    /** Window-level dispatch (e.g. `resize`). Keydown reaches window via `pressKey`. */
    dispatchEvent: (eventObj) => {
      const event = normalizeEvent(eventObj, win);
      fire(winListeners, event.type, event);
    }
  };

  /**
   * Simulates a keydown the way a browser delivers it: target -> ... -> document -> window.
   * Returns the event so callers can inspect `defaultPrevented`.
   */
  function pressKey(target, props = {}) {
    let defaultPrevented = false;
    let stopped = false;
    const event = Object.assign({
      type: 'keydown',
      target,
      preventDefault() { defaultPrevented = true; },
      stopPropagation() { stopped = true; }
    }, props);
    let node = target;
    while (node && !stopped) {
      fire(node._listeners || {}, 'keydown', event);
      node = node.parentNode;
    }
    if (!stopped) {
      fire(docListeners, 'keydown', event);
      fire(winListeners, 'keydown', event);
    }
    return { get defaultPrevented() { return defaultPrevented; } };
  }

  return { doc, win, storage, elements, makeElement, register, pressKey, body };
}

/** Resolves after the given milliseconds (used to outlast typing delays). */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { createMockDOM, wait };
