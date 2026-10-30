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

  it('correctly matches queries for all 4 public github repositories', () => {
    assert.strictEqual(matchIntent('SmartSalon').id, 'projects');
    assert.strictEqual(matchIntent('The-Booking-Site').id, 'projects');
    assert.strictEqual(matchIntent('POS_QUAN_LY_BAN_HANG').id, 'projects');
    assert.strictEqual(matchIntent('My-profile').id, 'projects');
  });

  it('matches intent variations with punctuation and extra whitespace', () => {
    assert.strictEqual(matchIntent('  Cho mình hỏi về kỹ năng của bạn nhé!  ').id, 'skills');
    assert.strictEqual(matchIntent('Bạn học trường nào? UTC?').id, 'education');
    assert.strictEqual(matchIntent('Thông tin liên hệ facebook github').id, 'contact');
    assert.strictEqual(matchIntent('Bạn là ai? Giới thiệu bản thân').id, 'about');
    assert.strictEqual(matchIntent('Hello bot!').id, 'greeting');
  });
});


