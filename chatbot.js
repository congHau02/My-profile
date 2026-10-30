/**
 * Portfolio Personal Assistant - Core Knowledge Base & Intent Matching Engine
 * 100% Client-side, zero latency, zero backend dependencies.
 */

/**
 * Static catalog of supported conversational intents.
 * Grounded strictly in Nguyen Cong Hau's verified background, skills, and projects.
 */
const CHATBOT_KNOWLEDGE_BASE = {
  greeting: {
    id: 'greeting',
    patterns: [
      'xin chao', 'chao', 'chao ban', 'hello', 'hi', 'hey', 'alo', 'halo',
      'good morning', 'good afternoon', 'chao em', 'chao anh', 'hi bot', 'chao bot'
    ],
    response: 'Xin chào! Mình là **Trợ lý ảo của Nguyễn Công Hậu** 👋\n\nMình có thể hỗ trợ bạn tìm hiểu về **kỹ năng công nghệ**, các **dự án nổi bật**, **học vấn** hoặc **thông tin liên hệ** của Hậu. Bạn muốn khám phá phần nào?',
    scrollTo: null,
    suggestions: ['Kỹ năng công nghệ', 'Dự án tiêu biểu', 'Thông tin liên hệ']
  },
  skills: {
    id: 'skills',
    patterns: [
      'ky nang', 'skills', 'skill', 'cong nghe', 'tech stack', 'stack',
      'frontend', 'backend', 'fullstack', 'cloud', 'devops', 'aws', 'docker',
      'terraform', 'java', 'spring', 'spring boot', 'react', 'reactjs',
      'tailwindcss', 'supabase', 'mysql', 'co so du lieu', 'database',
      'ci cd', 'pipeline', 'kien truc', 'rest api', 'api', 'ecs', 'ecr'
    ],
    response: 'Kỹ năng chuyên môn của **Nguyễn Công Hậu** bao gồm:\n\n• **Frontend**: React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS\n• **Backend**: Java, Spring Boot, Node.js, RESTful APIs, MySQL, Supabase\n• **Cloud & DevOps**: AWS (ECR, ECS Fargate, S3), Docker, Terraform (IaC), GitHub Actions CI/CD với OIDC Auth\n• **Khác**: AI Agents, tư duy thiết kế hệ thống phân tán & triển khai tự động hóa.',
    scrollTo: '#skills',
    suggestions: ['Dự án tiêu biểu', 'Kiến trúc CI/CD AWS', 'Thông tin liên hệ']
  },
  projects: {
    id: 'projects',
    patterns: [
      'du an', 'project', 'projects', 'san pham', 'ma nguon', 'github', 'repo',
      'repository', 'repositories', 'smartsalon', 'the booking site', 'booking site',
      'pos quan ly ban hang', 'pos', 'my profile', 'du an spring boot', 'du an java',
      'du an react', 'du an tieu bieu', 'cac du an', 'kho ma nguon'
    ],
    response: 'Dưới đây là **4 dự án mã nguồn mở tiêu biểu** trên GitHub của Nguyễn Công Hậu:\n\n• **[SmartSalon](https://github.com/congHau02/SmartSalon)**: Hệ thống quản lý salon và đặt lịch hẹn thông minh với kiến trúc Full-Stack hiện đại.\n• **[The-Booking-Site](https://github.com/congHau02/The-Booking-Site)**: Nền tảng đặt phòng trực tuyến tối ưu trải nghiệm người dùng và luồng đặt chỗ.\n• **[POS_QUAN_LY_BAN_HANG](https://github.com/congHau02/POS_QUAN_LY_BAN_HANG)**: Hệ thống quản lý bán hàng tại điểm bán (Point of Sale) hoàn chỉnh (quản lý sản phẩm, đơn hàng, hóa đơn).\n• **[My-profile](https://github.com/congHau02/My-profile)**: Portfolio cá nhân tương tác cao, mã nguồn mở triển khai CI/CD trên GitHub Pages.',
    scrollTo: '#skills',
    suggestions: ['Kỹ năng công nghệ', 'Học vấn & Kinh nghiệm', 'Thông tin liên hệ']
  },
  about: {
    id: 'about',
    patterns: [
      'about', 'gioi thieu', 'ban la ai', 'nguyen cong hau', 'thong tin',
      'profile', 'ly lich', 'la ai', 'tac gia', 'chu nhan', 'ban than', 'ai day'
    ],
    response: '**Nguyễn Công Hậu** - Full-Stack Software Engineer & Cloud DevOps Enthusiast 🚀\n\n• Sinh viên ngành Công nghệ thông tin tại **Trường Đại học Giao thông Vận tải (UTC)**.\n• Định hướng phát triển phần mềm Full-stack (React, Java Spring Boot) và kiến trúc hạ tầng Cloud CI/CD trên nền tảng AWS.\n• Duy trì kết quả học tập tốt (GPA > 3.0), nền tảng tư duy logic vững vàng từ kinh nghiệm làm trợ giảng môn Toán cấp 2.',
    scrollTo: '#info',
    suggestions: ['Kỹ năng công nghệ', 'Dự án tiêu biểu', 'Học vấn & Bằng cấp', 'Thông tin liên hệ']
  },
  education: {
    id: 'education',
    patterns: [
      'hoc van', 'education', 'truong hoc', 'dai hoc', 'utc', 'gpa',
      'kinh nghiem', 'tro giang', 'bang cap', 'nganh hoc', 'giao thong van tai',
      'hoc tap', 'sinh vien'
    ],
    response: 'Hành trình **Học vấn & Trải nghiệm** của Nguyễn Công Hậu:\n\n• **Học vấn**: Trường Đại học Giao thông Vận tải (UTC)\n• **Chuyên ngành**: Công nghệ thông tin (IT) | GPA > 3.0 / 4.0\n• **Kinh nghiệm**: Trợ giảng (Teaching Assistant) môn Toán cấp 2 - rèn luyện khả năng tư duy logic, giải quyết vấn đề và truyền đạt kỹ thuật mạch lạc.',
    scrollTo: '#education',
    suggestions: ['Kỹ năng công nghệ', 'Dự án tiêu biểu', 'Thông tin liên hệ']
  },
  contact: {
    id: 'contact',
    patterns: [
      'lien he', 'contact', 'email', 'so dien thoai', 'facebook', 'instagram',
      'github', 'trao doi', 'ket noi', 'social', 'phone', 'nhan tin'
    ],
    response: 'Bạn có thể liên hệ và kết nối với **Nguyễn Công Hậu** qua các kênh:\n\n• **GitHub**: [github.com/congHau02](https://github.com/congHau02)\n• **Facebook**: [Nguyễn Công Hậu](https://www.facebook.com/yangqi.28)\n• **Instagram**: [@cong.hau05](https://www.instagram.com/cong.hau05/)',
    scrollTo: '#info',
    suggestions: ['Dự án tiêu biểu', 'Kỹ năng công nghệ', 'Giới thiệu bản thân']
  },
  fallback: {
    id: 'fallback',
    patterns: [],
    response: 'Xin lỗi, mình chưa hiểu rõ câu hỏi này hoặc thông tin nằm ngoài phạm vi portfolio của Nguyễn Công Hậu 😅\n\nBạn có thể thử chọn các gợi ý bên dưới hoặc hỏi về **kỹ năng**, **dự án**, **học vấn** hoặc **thông tin liên hệ** nhé!',
    scrollTo: null,
    suggestions: ['Kỹ năng công nghệ', 'Dự án tiêu biểu', 'Thông tin liên hệ']
  }
};

/**
 * Normalizes text:
 * - strips Vietnamese diacritics via Unicode NFD
 * - converts đ/Đ to d
 * - converts to lowercase
 * - strips punctuation and collapses whitespace
 *
 * @param {string} text - Raw input string
 * @returns {string} Normalized string
 */
function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Scores how well a normalized query matches an intent's patterns using token & phrase scoring.
 *
 * @param {string} normalizedQuery - Normalized query string
 * @param {Object} intent - An intent object containing a patterns array
 * @returns {number} Non-negative match score
 */
function scoreIntent(normalizedQuery, intent) {
  if (!normalizedQuery || !intent || !Array.isArray(intent.patterns) || intent.patterns.length === 0) {
    return 0;
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return 0;

  let bestPatternScore = 0;
  let secondaryScore = 0;

  for (const rawPattern of intent.patterns) {
    const pattern = normalizeText(rawPattern);
    if (!pattern) continue;

    const patternTokens = pattern.split(/\s+/).filter(Boolean);
    if (patternTokens.length === 0) continue;

    let score = 0;

    // 1. Exact query-to-pattern match
    if (normalizedQuery === pattern) {
      score = 30 + patternTokens.length * 5;
    } else {
      // 2. Contiguous phrase match with word boundaries
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const phraseRegex = new RegExp(`(^|\\s)${escapedPattern}(\\s|$)`);
      if (phraseRegex.test(normalizedQuery)) {
        score = 15 + patternTokens.length * 4;
      } else if (patternTokens.length === 1) {
        // Single token pattern: check if query contains this exact token
        if (queryTokens.includes(patternTokens[0])) {
          score = 10;
        }
      } else {
        // Multi-token pattern: avoid false positives on single incidental words
        let matchedCount = 0;
        for (const token of patternTokens) {
          if (queryTokens.includes(token)) {
            matchedCount++;
          }
        }

        // Require either all tokens to be present or at least 60% of tokens (min 2) for longer patterns
        if (matchedCount === patternTokens.length) {
          score = 10 + matchedCount * 3;
        } else if (patternTokens.length >= 3 && matchedCount >= 2 && matchedCount / patternTokens.length >= 0.6) {
          score = matchedCount * 2;
        }
      }
    }

    if (score > bestPatternScore) {
      secondaryScore += bestPatternScore * 0.1;
      bestPatternScore = score;
    } else if (score > 0) {
      secondaryScore += score * 0.1;
    }
  }

  return bestPatternScore + secondaryScore;
}

/**
 * Matches a raw user query to the best-fitting intent in the knowledge base.
 * Returns the fallback intent if no intent scores above zero.
 *
 * @param {string} rawQuery - The raw user input
 * @returns {Object} The matched intent object
 */
function matchIntent(rawQuery) {
  const normalizedQuery = normalizeText(rawQuery);
  if (!normalizedQuery) {
    return CHATBOT_KNOWLEDGE_BASE.fallback;
  }

  let highestScore = 0;
  let bestIntent = CHATBOT_KNOWLEDGE_BASE.fallback;

  for (const intentKey of Object.keys(CHATBOT_KNOWLEDGE_BASE)) {
    if (intentKey === 'fallback') continue;
    const intent = CHATBOT_KNOWLEDGE_BASE[intentKey];
    const score = scoreIntent(normalizedQuery, intent);
    if (score > highestScore) {
      highestScore = score;
      bestIntent = intent;
    }
  }

  return highestScore > 0 ? bestIntent : CHATBOT_KNOWLEDGE_BASE.fallback;
}

/**
 * Safe, zero-dependency micro-markdown parser.
 * Converts:
 * - HTML characters to safe entities (& < > ")
 * - **bold text** to <strong>bold text</strong>
 * - [link text](url) to <a href="url" target="_blank" rel="noopener noreferrer">link text</a>
 * - bullet points • to <span class="ai-chatbot-bullet">•</span>
 * - linebreaks \n to <br>
 *
 * @param {string} text - Raw markdown-formatted string
 * @returns {string} Safe HTML string
 */
function formatMarkdown(text) {
  if (typeof text !== 'string') return '';

  // 1. Sanitize HTML entities to prevent XSS injection
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // 2. Bold text: **text** -> <strong>text</strong>
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 3. Hyperlinks: [text](url) -> <a href="url" target="_blank" rel="noopener noreferrer">text</a>
  safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 4. Bullet points: • -> <span class="ai-chatbot-bullet">•</span>
  safe = safe.replace(/•/g, '<span class="ai-chatbot-bullet">•</span>');

  // 5. Line breaks: \n -> <br>
  safe = safe.replace(/\n/g, '<br>');

  return safe;
}

/**
 * In-memory conversation state.
 * Ephemeral: reloading resets the session cleanly.
 */
let hasGreeted = false;
let isBotTyping = false;

/**
 * Resets ephemeral conversation state.
 * Clears messages container and resets toggle/window states.
 */
function resetChatState() {
  hasGreeted = false;
  isBotTyping = false;
  closeChat();
  if (typeof document !== 'undefined') {
    const messagesFeed = document.getElementById('ai-chatbot-messages');
    if (messagesFeed) {
      messagesFeed.innerHTML = '';
      if (typeof messagesFeed.children === 'object' && Array.isArray(messagesFeed.children)) {
        messagesFeed.children.length = 0;
      }
    }
  }
}

/**
 * Detects whether the current viewport is mobile (width <= 739px).
 *
 * @returns {boolean}
 */
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(max-width: 739px)');
    if (mq && typeof mq.matches === 'boolean') {
      return mq.matches;
    }
  }
  if (typeof window.innerWidth === 'number') {
    return window.innerWidth <= 739;
  }
  return false;
}

/**
 * Smoothly scrolls the page to the target selector and shifts focus.
 *
 * @param {string} target - CSS selector (e.g. '#skills', '#info')
 */
function scrollToTarget(target) {
  if (!target || typeof document === 'undefined') return;
  try {
    const el = document.querySelector(target);
    if (el) {
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      if (typeof el.focus === 'function') {
        const hadTabIndex = el.hasAttribute && el.hasAttribute('tabindex');
        if (!hadTabIndex && typeof el.setAttribute === 'function') {
          el.setAttribute('tabindex', '-1');
        }
        el.focus({ preventScroll: true });
        if (!hadTabIndex && typeof el.addEventListener === 'function') {
          el.addEventListener('blur', () => {
            if (typeof el.removeAttribute === 'function') {
              el.removeAttribute('tabindex');
            }
          }, { once: true });
        }
      }
    }
  } catch (err) {
    // Gracefully ignore selector errors
  }
}

/**
 * Appends a 3-dot typing indicator bubble to the messages feed.
 *
 * @param {HTMLElement} [container] - Optional custom message container
 * @returns {HTMLElement|null} The typing indicator element
 */
function showTypingIndicator(container) {
  if (typeof document === 'undefined') return null;

  const messagesFeed = container || document.getElementById('ai-chatbot-messages');
  if (!messagesFeed) return null;

  let typingEl = document.getElementById('ai-chatbot-typing');
  if (!typingEl && typeof messagesFeed.querySelector === 'function') {
    typingEl = messagesFeed.querySelector('#ai-chatbot-typing');
  }
  if (typingEl) return typingEl;

  typingEl = document.createElement('div');
  typingEl.id = 'ai-chatbot-typing';
  typingEl.classList.add('ai-chatbot-message', 'ai-chatbot-message--bot', 'ai-chatbot-typing-message');
  typingEl.className = 'ai-chatbot-message ai-chatbot-message--bot ai-chatbot-typing-message';
  typingEl.setAttribute('aria-label', 'Đang nhập tin nhắn');
  typingEl.setAttribute('role', 'status');

  const bubbleEl = document.createElement('div');
  bubbleEl.classList.add('ai-chatbot-message__bubble', 'ai-chatbot-typing');
  bubbleEl.className = 'ai-chatbot-message__bubble ai-chatbot-typing';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.classList.add('ai-chatbot-typing-dot');
    dot.className = 'ai-chatbot-typing-dot';
    bubbleEl.appendChild(dot);
  }

  typingEl.appendChild(bubbleEl);
  messagesFeed.appendChild(typingEl);

  messagesFeed.scrollTop = messagesFeed.scrollHeight;
  return typingEl;
}

/**
 * Removes the 3-dot typing indicator bubble from the messages feed.
 *
 * @param {HTMLElement} [container] - Optional custom message container
 */
function hideTypingIndicator(container) {
  if (typeof document === 'undefined') return;

  const messagesFeed = container || document.getElementById('ai-chatbot-messages');
  let typingEl = document.getElementById('ai-chatbot-typing');
  if (!typingEl && messagesFeed && typeof messagesFeed.querySelector === 'function') {
    typingEl = messagesFeed.querySelector('#ai-chatbot-typing');
  }

  if (typingEl && typingEl.parentNode && typeof typingEl.parentNode.removeChild === 'function') {
    typingEl.parentNode.removeChild(typingEl);
  }
}

/**
 * Appends a message bubble to the chatbot message feed.
 * Supports contextual follow-up Quick Reply Chips and mobile in-message view links.
 *
 * @param {string} text - Message text (markdown for bot, plain text for user)
 * @param {'bot'|'user'} [sender='bot'] - Message author
 * @param {HTMLElement} [container] - Optional custom message container element
 * @param {Object} [options] - Configuration options (suggestions, scrollTo, isMobile)
 * @returns {HTMLElement|null} The created message DOM node
 */
function appendChatMessage(text, sender = 'bot', container, options = {}) {
  if (typeof document === 'undefined') return null;

  const messagesFeed = container || document.getElementById('ai-chatbot-messages');
  if (!messagesFeed) return null;

  const messageEl = document.createElement('div');
  messageEl.classList.add('ai-chatbot-message', `ai-chatbot-message--${sender}`);

  const bubbleEl = document.createElement('div');
  bubbleEl.classList.add('ai-chatbot-message__bubble');

  if (sender === 'bot') {
    bubbleEl.innerHTML = formatMarkdown(text);

    // On mobile devices, bot messages with scroll targets include a clickable link
    const isMobile = (options && typeof options.isMobile === 'boolean')
      ? options.isMobile
      : isMobileDevice();

    if (options && options.scrollTo && isMobile) {
      const linkWrap = document.createElement('div');
      linkWrap.classList.add('ai-chatbot-view-link-wrap');
      linkWrap.className = 'ai-chatbot-view-link-wrap';

      const viewLink = document.createElement('a');
      viewLink.href = options.scrollTo;
      viewLink.setAttribute('href', options.scrollTo);
      viewLink.classList.add('ai-chatbot-view-link');
      viewLink.className = 'ai-chatbot-view-link';
      viewLink.textContent = '👉 Xem trên trang';
      viewLink.setAttribute('role', 'button');
      viewLink.setAttribute('aria-label', `Xem phần ${options.scrollTo} trên trang`);

      viewLink.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        closeChat();
        scrollToTarget(options.scrollTo);
      });

      linkWrap.appendChild(viewLink);
      bubbleEl.appendChild(linkWrap);
    }
  } else {
    // Sanitize user text by setting textContent
    bubbleEl.textContent = text;
  }

  messageEl.appendChild(bubbleEl);

  // Append contextual or initial Quick Reply Chips below bot answers
  if (sender === 'bot' && options && Array.isArray(options.suggestions) && options.suggestions.length > 0) {
    const chipsContainer = document.createElement('div');
    chipsContainer.classList.add('ai-chatbot-chips');
    chipsContainer.className = 'ai-chatbot-chips';
    chipsContainer.setAttribute('role', 'group');
    chipsContainer.setAttribute('aria-label', 'Gợi ý câu hỏi nhanh');

    options.suggestions.forEach(suggestionText => {
      const chipBtn = document.createElement('button');
      chipBtn.type = 'button';
      chipBtn.classList.add('ai-chatbot-chip');
      chipBtn.className = 'ai-chatbot-chip';
      chipBtn.textContent = suggestionText;
      chipBtn.setAttribute('data-query', suggestionText);

      chipBtn.addEventListener('click', () => {
        if (!isBotTyping) {
          handleUserMessage(suggestionText);
        }
      });

      chipsContainer.appendChild(chipBtn);
    });

    messageEl.appendChild(chipsContainer);
  }

  messagesFeed.appendChild(messageEl);

  // Auto-scroll to bottom of message feed
  messagesFeed.scrollTop = messagesFeed.scrollHeight;

  return messageEl;
}

/**
 * Renders initial greeting message with initial Quick Reply Chips.
 *
 * @param {HTMLElement} [container] - Optional custom message container
 * @returns {HTMLElement|null} The created greeting message element
 */
function renderGreeting(container) {
  if (typeof document === 'undefined') return null;

  const messagesFeed = container || document.getElementById('ai-chatbot-messages');
  if (!messagesFeed) return null;

  hasGreeted = true;
  const greetingIntent = CHATBOT_KNOWLEDGE_BASE.greeting;

  return appendChatMessage(
    greetingIntent.response,
    'bot',
    messagesFeed,
    {
      suggestions: greetingIntent.suggestions,
      scrollTo: greetingIntent.scrollTo
    }
  );
}

/**
 * Handles full conversational user message dispatch:
 * 1. Appends user message bubble and auto-scrolls feed
 * 2. Displays 3-dot typing indicator
 * 3. Waits 400ms-600ms typing delay to simulate natural interaction
 * 4. Hides typing indicator and matches intent
 * 5. Appends formatted bot reply with contextual Quick Reply Chips
 * 6. Smoothly scrolls to section (desktop) or attaches in-message view link (mobile)
 *
 * @param {string} rawQuery - Question text
 * @param {Object} [options] - Optional settings (container, delay, isMobile)
 * @returns {Promise<Object|null>}
 */
function handleUserMessage(rawQuery, options = {}) {
  if (typeof document === 'undefined') return Promise.resolve(null);
  if (isBotTyping) return Promise.resolve(null);

  const query = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  if (!query) return Promise.resolve(null);

  const messagesFeed = (options && options.container) || document.getElementById('ai-chatbot-messages');
  const inputField = document.getElementById('ai-chatbot-input');
  const sendBtn = document.getElementById('ai-chatbot-send');
  if (inputField) {
    inputField.value = '';
  }
  if (sendBtn) {
    sendBtn.disabled = true;
  }

  // 1. Append user message bubble & scroll
  appendChatMessage(query, 'user', messagesFeed);

  // 2. Set typing state & show typing indicator
  isBotTyping = true;
  showTypingIndicator(messagesFeed);

  const minDelay = 400;
  const maxDelay = 600;
  const delay = (options && typeof options.delay === 'number')
    ? options.delay
    : Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  return new Promise((resolve) => {
    setTimeout(() => {
      // 3. Remove typing indicator
      hideTypingIndicator(messagesFeed);
      isBotTyping = false;
      if (sendBtn) {
        sendBtn.disabled = false;
      }

      // 4. Match intent
      const matchedIntent = matchIntent(query);

      // 5. Append bot response with chips and mobile link
      const isMobile = (options && typeof options.isMobile === 'boolean')
        ? options.isMobile
        : isMobileDevice();

      const botMessageEl = appendChatMessage(
        matchedIntent.response,
        'bot',
        messagesFeed,
        {
          suggestions: matchedIntent.suggestions,
          scrollTo: matchedIntent.scrollTo,
          isMobile
        }
      );

      // 6. Smooth scroll on desktop
      if (matchedIntent.scrollTo && !isMobile) {
        scrollToTarget(matchedIntent.scrollTo);
      }

      // Re-focus input if on desktop
      if (inputField && typeof inputField.focus === 'function' && !isMobile) {
        inputField.focus();
      }

      resolve({
        intent: matchedIntent,
        messageElement: botMessageEl
      });
    }, delay);
  });
}

/**
 * Opens the chat window, updates toggle aria attributes,
 * and renders greeting message if opening for the first time.
 */
function openChat() {
  if (typeof document === 'undefined') return;

  const toggleBtn = document.getElementById('ai-chatbot-toggle');
  const chatWindow = document.getElementById('ai-chatbot-window');

  if (toggleBtn) {
    if (typeof toggleBtn.setAttribute === 'function') {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Đóng trợ lý ảo Công Hậu');
    }
    if (toggleBtn.classList) {
      if (typeof toggleBtn.classList.add === 'function') {
        toggleBtn.classList.add('active');
      } else if (typeof toggleBtn.classList.toggle === 'function') {
        toggleBtn.classList.toggle('active', true);
      }
    }
  }

  if (chatWindow) {
    if (chatWindow.classList) {
      if (typeof chatWindow.classList.add === 'function') {
        chatWindow.classList.add('active');
      } else if (typeof chatWindow.classList.toggle === 'function') {
        chatWindow.classList.toggle('active', true);
      }
    }
    if (typeof chatWindow.setAttribute === 'function') {
      chatWindow.setAttribute('aria-hidden', 'false');
    }
  }

  // First-time opening renders initial greeting accompanied by initial Quick Reply Chips
  if (!hasGreeted) {
    renderGreeting();
  }

  const inputField = document.getElementById('ai-chatbot-input');
  if (inputField && typeof inputField.focus === 'function') {
    setTimeout(() => inputField.focus(), 150);
  }
}

/**
 * Closes the chat window and resets toggle aria attributes.
 */
function closeChat() {
  if (typeof document === 'undefined') return;

  const toggleBtn = document.getElementById('ai-chatbot-toggle');
  const chatWindow = document.getElementById('ai-chatbot-window');

  if (chatWindow) {
    if (chatWindow.classList) {
      if (typeof chatWindow.classList.remove === 'function') {
        chatWindow.classList.remove('active');
      } else if (typeof chatWindow.classList.toggle === 'function') {
        chatWindow.classList.toggle('active', false);
      }
    }
    if (typeof chatWindow.setAttribute === 'function') {
      chatWindow.setAttribute('aria-hidden', 'true');
    }
  }

  if (toggleBtn) {
    if (toggleBtn.classList) {
      if (typeof toggleBtn.classList.remove === 'function') {
        toggleBtn.classList.remove('active');
      } else if (typeof toggleBtn.classList.toggle === 'function') {
        toggleBtn.classList.toggle('active', false);
      }
    }
    if (typeof toggleBtn.setAttribute === 'function') {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Mở trợ lý ảo Công Hậu');
    }
    if (typeof toggleBtn.focus === 'function') {
      toggleBtn.focus();
    }
  }
}

/**
 * Initializes the floating action button toggle behavior.
 */
function initChatbotToggle() {
  if (typeof document === 'undefined') return;

  const toggleBtn = document.getElementById('ai-chatbot-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeChat();
    } else {
      openChat();
    }
  });
}

/**
 * Initializes the chat window interface:
 * - Wire up close button to dismiss the window and sync FAB toggle
 * - Wire up form submit & input Enter key / Send button click
 * - Auto-scrolls and manages focus for accessibility
 */
function initChatbotWindow() {
  if (typeof document === 'undefined') return;

  const closeBtn = document.getElementById('ai-chatbot-close');
  const inputField = document.getElementById('ai-chatbot-input');
  const sendBtn = document.getElementById('ai-chatbot-send');
  const chatForm = document.getElementById('ai-chatbot-form');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  function handleMessageSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!inputField || isBotTyping) return;

    const query = inputField.value ? inputField.value.trim() : '';
    if (!query) return;

    // Clear input field immediately
    inputField.value = '';

    // Dispatch full conversational message handling
    handleUserMessage(query);

    if (typeof inputField.focus === 'function') {
      inputField.focus();
    }
  }

  if (chatForm) {
    chatForm.addEventListener('submit', handleMessageSubmit);
  }

  if (sendBtn && !chatForm) {
    sendBtn.addEventListener('click', handleMessageSubmit);
  }

  if (inputField && !chatForm) {
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleMessageSubmit(e);
      }
    });
  }
}

/**
 * Main initialization entrypoint.
 */
function initChatbot() {
  initChatbotToggle();
  initChatbotWindow();
}

// Auto-initialize when running in a browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
}

// Module export for Node.js / testing & browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHATBOT_KNOWLEDGE_BASE,
    normalizeText,
    scoreIntent,
    matchIntent,
    formatMarkdown,
    appendChatMessage,
    showTypingIndicator,
    hideTypingIndicator,
    renderGreeting,
    handleUserMessage,
    openChat,
    closeChat,
    scrollToTarget,
    isMobileDevice,
    resetChatState,
    initChatbotToggle,
    initChatbotWindow,
    initChatbot
  };
}

if (typeof window !== 'undefined') {
  window.CHATBOT_KNOWLEDGE_BASE = CHATBOT_KNOWLEDGE_BASE;
  window.normalizeText = normalizeText;
  window.scoreIntent = scoreIntent;
  window.matchIntent = matchIntent;
  window.formatMarkdown = formatMarkdown;
  window.appendChatMessage = appendChatMessage;
  window.showTypingIndicator = showTypingIndicator;
  window.hideTypingIndicator = hideTypingIndicator;
  window.renderGreeting = renderGreeting;
  window.handleUserMessage = handleUserMessage;
  window.openChat = openChat;
  window.closeChat = closeChat;
  window.scrollToTarget = scrollToTarget;
  window.isMobileDevice = isMobileDevice;
  window.resetChatState = resetChatState;
  window.initChatbotToggle = initChatbotToggle;
  window.initChatbotWindow = initChatbotWindow;
  window.initChatbot = initChatbot;
}



