/**
 * Portfolio Personal Assistant - Core Knowledge Base & Intent Matching Engine
 * 100% Client-side, zero latency, zero backend dependencies.
 */

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
    .replace(/[^\w\s]/g, ' ')
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

// Module export for Node.js / testing & browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHATBOT_KNOWLEDGE_BASE,
    normalizeText,
    scoreIntent,
    matchIntent
  };
}

if (typeof window !== 'undefined') {
  window.CHATBOT_KNOWLEDGE_BASE = CHATBOT_KNOWLEDGE_BASE;
  window.normalizeText = normalizeText;
  window.scoreIntent = scoreIntent;
  window.matchIntent = matchIntent;
}


