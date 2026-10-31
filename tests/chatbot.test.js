const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeText, CHATBOT_KNOWLEDGE_BASE, scoreIntent, matchIntent } = require('../chatbot.js');

describe('normalizeText', () => {
  it('strips Vietnamese accents, converts to lowercase, and removes punctuation', () => {
    assert.strictEqual(normalizeText('Kỹ Năng Lập Trình!'), 'ky nang lap trinh');
    assert.strictEqual(normalizeText('Dự Án Spring Boot?'), 'du an spring boot');
    assert.strictEqual(normalizeText('Đại Học Giao Thông Vận Tải'), 'dai hoc giao thong van tai');
    assert.strictEqual(normalizeText('Xin chào...'), 'xin chao');
    assert.strictEqual(normalizeText('   liên   hệ   '), 'lien he');
    assert.strictEqual(normalizeText(''), '');
    assert.strictEqual(normalizeText(null), '');
    assert.strictEqual(normalizeText(undefined), '');
  });

  it('converts unaccented Telex dd into d for typing tolerance', () => {
    assert.strictEqual(normalizeText('ddai hoc'), 'dai hoc');
    assert.strictEqual(normalizeText('ddu an'), 'du an');
    assert.strictEqual(normalizeText('kĩ năng'), 'ki nang');
  });
});

describe('CHATBOT_KNOWLEDGE_BASE', () => {
  it('contains complete, accurate information for all required intents', () => {
    assert.ok(CHATBOT_KNOWLEDGE_BASE, 'CHATBOT_KNOWLEDGE_BASE must exist');
    const requiredIntents = ['greeting', 'skills', 'projects', 'about', 'education', 'contact', 'fallback'];
    
    for (const intentId of requiredIntents) {
      const intent = CHATBOT_KNOWLEDGE_BASE[intentId];
      assert.ok(intent, `Intent "${intentId}" must exist in CHATBOT_KNOWLEDGE_BASE`);
      assert.strictEqual(intent.id, intentId);
      assert.ok(typeof intent.response === 'string' && intent.response.trim().length > 0, `Intent "${intentId}" must have a non-empty response`);
      assert.ok(Array.isArray(intent.suggestions) && intent.suggestions.length > 0, `Intent "${intentId}" must have suggestions array`);
      if (intentId !== 'fallback') {
        assert.ok(Array.isArray(intent.patterns) && intent.patterns.length > 0, `Intent "${intentId}" must have patterns array`);
      }
    }
  });

  it('projects intent includes verified descriptions and repository links for 4 public repos', () => {
    const projects = CHATBOT_KNOWLEDGE_BASE.projects;
    assert.ok(projects);
    const resp = projects.response;
    assert.ok(resp.includes('SmartSalon'), 'Must mention SmartSalon');
    assert.ok(resp.includes('https://github.com/congHau02/SmartSalon'), 'Must link SmartSalon repo');
    assert.ok(resp.includes('The-Booking-Site'), 'Must mention The-Booking-Site');
    assert.ok(resp.includes('https://github.com/congHau02/The-Booking-Site'), 'Must link The-Booking-Site repo');
    assert.ok(resp.includes('POS_QUAN_LY_BAN_HANG'), 'Must mention POS_QUAN_LY_BAN_HANG');
    assert.ok(resp.includes('https://github.com/congHau02/POS_QUAN_LY_BAN_HANG'), 'Must link POS_QUAN_LY_BAN_HANG repo');
    assert.ok(resp.includes('My-profile'), 'Must mention My-profile');
    assert.ok(resp.includes('https://github.com/congHau02/My-profile'), 'Must link My-profile repo');
  });

  it('intents have appropriate scrollTo targets matching page anchors', () => {
    assert.strictEqual(CHATBOT_KNOWLEDGE_BASE.about.scrollTo, '#info');
    assert.strictEqual(CHATBOT_KNOWLEDGE_BASE.skills.scrollTo, '#skills');
    assert.strictEqual(CHATBOT_KNOWLEDGE_BASE.education.scrollTo, '#education');
    assert.strictEqual(CHATBOT_KNOWLEDGE_BASE.contact.scrollTo, '#info');
    assert.strictEqual(CHATBOT_KNOWLEDGE_BASE.projects.scrollTo, null);
  });

  it('cv intent includes download link and accurate highlights from verified resume', () => {
    const cvIntent = CHATBOT_KNOWLEDGE_BASE.cv;
    assert.ok(cvIntent, 'cv intent must exist');
    assert.strictEqual(cvIntent.id, 'cv');
    assert.ok(cvIntent.response.includes('./assets/cv/CV-Nguyen-Cong-Hau.pdf'), 'Must link to CV PDF file');
    assert.ok(cvIntent.response.includes('Fullstack Developer'), 'Must mention Fullstack Developer');
    assert.ok(cvIntent.response.includes('3.1'), 'Must mention GPA > 3.1');
    assert.ok(Array.isArray(cvIntent.patterns) && cvIntent.patterns.length > 0);
    assert.ok(Array.isArray(cvIntent.suggestions) && cvIntent.suggestions.length > 0);
  });

  it('detailed project intents contain rich technical specs and GitHub links', () => {
    const smartsalon = CHATBOT_KNOWLEDGE_BASE.project_smartsalon;
    assert.ok(smartsalon, 'project_smartsalon must exist');
    assert.ok(smartsalon.response.includes('https://github.com/congHau02/SmartSalon'));
    assert.ok(smartsalon.response.includes('Redis'));
    assert.ok(smartsalon.response.includes('WebSocket') || smartsalon.response.includes('STOMP'));
    assert.ok(smartsalon.response.includes('PayOS'));

    const pos = CHATBOT_KNOWLEDGE_BASE.project_pos;
    assert.ok(pos, 'project_pos must exist');
    assert.ok(pos.response.includes('https://github.com/congHau02/POS_QUAN_LY_BAN_HANG'));
    assert.ok(pos.response.includes('Spring Boot'));
    assert.ok(pos.response.includes('EC2'));
    assert.ok(pos.response.includes('PayOS'));

    const booking = CHATBOT_KNOWLEDGE_BASE.project_booking;
    assert.ok(booking, 'project_booking must exist');
    assert.ok(booking.response.includes('https://github.com/congHau02/The-Booking-Site'));

    const myprofile = CHATBOT_KNOWLEDGE_BASE.project_myprofile;
    assert.ok(myprofile, 'project_myprofile must exist');
    assert.ok(myprofile.response.includes('https://github.com/congHau02/My-profile'));
  });

  it('maintains strict profile facts and anchor integrity with index.html', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

    // Reconciled GPA fact check
    assert.ok(
      indexHtml.includes('GPA > 3.1 / 4.0'),
      'index.html must accurately reflect GPA > 3.1 / 4.0 matching CHATBOT_KNOWLEDGE_BASE'
    );
    assert.doesNotMatch(
      indexHtml,
      /GPA\s*>\s*3\.0/i,
      'index.html must not contain outdated GPA > 3.0'
    );

    // Every non-null scrollTo target in knowledge base must resolve to an element id in index.html
    for (const intent of Object.values(CHATBOT_KNOWLEDGE_BASE)) {
      if (intent.scrollTo) {
        const targetId = intent.scrollTo.replace(/^#/, '');
        const idRegex = new RegExp(`id=["']${targetId}["']`, 'i');
        assert.ok(
          idRegex.test(indexHtml),
          `scrollTo target "${intent.scrollTo}" in intent "${intent.id}" must exist as an id in index.html`
        );
      }
    }
  });
});

describe('scoreIntent', () => {
  it('returns 0 when normalized query is empty or intent has no patterns', () => {
    assert.strictEqual(scoreIntent('', CHATBOT_KNOWLEDGE_BASE.skills), 0);
    assert.strictEqual(scoreIntent('ky nang', CHATBOT_KNOWLEDGE_BASE.fallback), 0);
    assert.strictEqual(scoreIntent('thoi tiet', CHATBOT_KNOWLEDGE_BASE.skills), 0);
  });

  it('calculates higher score for multi-word phrase and exact matches', () => {
    const scoreExact = scoreIntent('ky nang', CHATBOT_KNOWLEDGE_BASE.skills);
    const scorePartial = scoreIntent('hoc ky', CHATBOT_KNOWLEDGE_BASE.skills);
    assert.ok(scoreExact > scorePartial, 'Exact match should score higher than single accidental token');
  });
});

describe('matchIntent', () => {
  it('returns fallback intent for empty, null, or unknown queries', () => {
    assert.strictEqual(matchIntent('').id, 'fallback');
    assert.strictEqual(matchIntent(null).id, 'fallback');
    assert.strictEqual(matchIntent('???').id, 'fallback');
    assert.strictEqual(matchIntent('thời tiết').id, 'fallback');
    assert.strictEqual(matchIntent('giá vàng hôm nay').id, 'fallback');
  });

  it('correctly matches standalone test queries from ticket specification', () => {
    assert.strictEqual(matchIntent('kỹ năng').id, 'skills');
    assert.strictEqual(matchIntent('ky nang').id, 'skills');
    assert.strictEqual(matchIntent('du an').id, 'projects');
    assert.strictEqual(matchIntent('dự án spring boot').id, 'projects');
    assert.strictEqual(matchIntent('học vấn').id, 'education');
    assert.strictEqual(matchIntent('lien he').id, 'contact');
    assert.strictEqual(matchIntent('xin chào').id, 'greeting');
    assert.strictEqual(matchIntent('thời tiết').id, 'fallback');
  });

  it('correctly matches queries for all 4 public github repositories to their specific project intents', () => {
    assert.strictEqual(matchIntent('SmartSalon').id, 'project_smartsalon');
    assert.strictEqual(matchIntent('The-Booking-Site').id, 'project_booking');
    assert.strictEqual(matchIntent('POS_QUAN_LY_BAN_HANG').id, 'project_pos');
    assert.strictEqual(matchIntent('My-profile').id, 'project_myprofile');
  });

  it('correctly matches CV and resume queries to cv intent', () => {
    assert.strictEqual(matchIntent('xem cv').id, 'cv');
    assert.strictEqual(matchIntent('cho xem cv').id, 'cv');
    assert.strictEqual(matchIntent('tải cv').id, 'cv');
    assert.strictEqual(matchIntent('download resume').id, 'cv');
    assert.strictEqual(matchIntent('hồ sơ').id, 'cv');
    assert.strictEqual(matchIntent('cv').id, 'cv');
    assert.strictEqual(matchIntent('resume').id, 'cv');
  });

  it('correctly matches specific queries for SmartSalon, POS, and Booking site', () => {
    assert.strictEqual(matchIntent('dự án smartsalon').id, 'project_smartsalon');
    assert.strictEqual(matchIntent('đặt lịch salon').id, 'project_smartsalon');
    assert.strictEqual(matchIntent('hệ thống pos').id, 'project_pos');
    assert.strictEqual(matchIntent('pos quản lý bán hàng').id, 'project_pos');
    assert.strictEqual(matchIntent('dự án booking').id, 'project_booking');
    assert.strictEqual(matchIntent('đặt phòng').id, 'project_booking');
    assert.strictEqual(matchIntent('portfolio này').id, 'project_myprofile');
  });

  it('matches intent variations with punctuation and extra whitespace', () => {
    assert.strictEqual(matchIntent('  Cho mình hỏi về kỹ năng của bạn nhé!  ').id, 'skills');
    assert.strictEqual(matchIntent('Bạn học trường nào? UTC?').id, 'education');
    assert.strictEqual(matchIntent('Thông tin liên hệ facebook github').id, 'contact');
    assert.strictEqual(matchIntent('Bạn là ai? Giới thiệu bản thân').id, 'about');
    assert.strictEqual(matchIntent('Hello bot!').id, 'greeting');
  });

  it('correctly resolves intent collision: thông tin liên hệ matches contact, not about', () => {
    assert.strictEqual(matchIntent('thông tin liên hệ').id, 'contact');
    assert.strictEqual(matchIntent('thong tin lien he').id, 'contact');
    assert.strictEqual(matchIntent('thông tin liên lạc').id, 'contact');
    assert.strictEqual(matchIntent('thông tin').id, 'about');
  });

  it('correctly matches spelling variants and unaccented Telex input', () => {
    assert.strictEqual(matchIntent('kĩ năng').id, 'skills');
    assert.strictEqual(matchIntent('ki nang').id, 'skills');
    assert.strictEqual(matchIntent('ddai hoc').id, 'education');
    assert.strictEqual(matchIntent('ddu an').id, 'projects');
  });
});


