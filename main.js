/**
 * ====================================================================
 * Interactive Companion Bird & Catch Mini-Game Engine
 * ====================================================================
 */
const MOBILE_BREAKPOINT = 739;

const STATE = {
  IDLE_HERO: 'IDLE_HERO',
  ROAMING: 'ROAMING',
  PERCHING: 'PERCHING',
  FLEEING: 'FLEEING',
  RETURNING: 'RETURNING',
  SLEEPING: 'SLEEPING'
};

const BIRD_W = 140;
const BIRD_H = 130;
const HALF_W = 70;
const HALF_H = 65;

function initCompanionBird(env = {}) {
  const doc = env.document || (typeof document !== 'undefined' ? document : null);
  const win = env.window || (typeof window !== 'undefined' ? window : null);
  if (!doc || !win) return null;

  const heroClip = doc.querySelector('.home__clip');
  const boxBird = doc.querySelector('.box__img');

  let sleepContainer = heroClip ? heroClip.querySelector('.bird-sleep-container') : null;
  if (heroClip && !sleepContainer) {
    sleepContainer = doc.createElement('div');
    sleepContainer.className = 'bird-sleep-container';
    sleepContainer.style.display = 'none';
    sleepContainer.innerHTML = `
        <span class="bird-sleep-z">z</span>
        <span class="bird-sleep-z">Z</span>
        <span class="bird-sleep-z">z</span>
    `;
    heroClip.appendChild(sleepContainer);
  }

  let currentState = STATE.IDLE_HERO;
  let companionEl = null;
  let posX = 0;
  let posY = 0;
  let roamTimer = null;

  // Pure visual particle burst: 10 colorful feathers
  function createFeatherBurst(clientX, clientY) {
    if (!doc.body) return;
    const colors = ['#ffffff', '#e0f2fe', '#bae6fd', '#38bdf8', '#0284c7'];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const feather = doc.createElement('div');
      feather.className = 'bird-feather';
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 70 + Math.random() * 80;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist + 35; // natural gravity
      const rot = -180 + Math.random() * 360;
      const color = colors[Math.floor(Math.random() * colors.length)];

      feather.style.left = `${clientX - 6}px`;
      feather.style.top = `${clientY - 11}px`;
      feather.style.backgroundColor = color;
      if (typeof feather.style.setProperty === 'function') {
        feather.style.setProperty('--dx', `${dx}px`);
        feather.style.setProperty('--dy', `${dy}px`);
        feather.style.setProperty('--rot', `${rot}deg`);
      }

      doc.body.appendChild(feather);
      feather.addEventListener('animationend', () => feather.remove());
    }
  }

  // Comic speech bubble
  function showSpeechBubble(parentEl, text, duration = 1400) {
    if (!parentEl) return;
    let bubble = parentEl.querySelector('.bird-speech-bubble');
    if (!bubble) {
      bubble = doc.createElement('div');
      bubble.className = 'bird-speech-bubble';
      parentEl.appendChild(bubble);
    }
    bubble.textContent = text;
    void bubble.offsetWidth; // trigger reflow
    bubble.classList.add('active');

    clearTimeout(bubble._timer);
    bubble._timer = setTimeout(() => {
      bubble.classList.remove('active');
    }, duration);
  }

  // Lazily create or retrieve roaming companion element
  function ensureCompanionElement() {
    if (companionEl) return companionEl;

    companionEl = doc.createElement('div');
    companionEl.id = 'birdCompanion';
    companionEl.className = 'bird-companion';
    companionEl.setAttribute('aria-label', 'Interactive Companion Bird');
    companionEl.innerHTML = `
        <div class="bird-companion__sprite-wrap">
            <div class="bird-companion__sprite"></div>
        </div>
    `;
    if (doc.body) doc.body.appendChild(companionEl);

    // Catch click on companion
    companionEl.addEventListener('click', catchBird);

    return companionEl;
  }

  // Move companion with smooth transform
  function moveCompanion(x, y, durationSec = 1.8, facingRight = true) {
    posX = x;
    posY = y;
    if (!companionEl) return;
    companionEl.style.transition = `transform ${durationSec}s cubic-bezier(0.25, 1, 0.5, 1)`;
    companionEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const spriteWrap = companionEl.querySelector('.bird-companion__sprite-wrap');
    if (spriteWrap) {
      spriteWrap.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
    }
  }

  // Find a visible element on screen to perch on
  function getPerchTarget() {
    const selectors = ['.heading', '.sub-heading', '.btn', '.btn-blue', '.btn-2', '.btn-github', '.skill--item', '.project--item'];
    const candidates = [];
    selectors.forEach(sel => {
      doc.querySelectorAll(sel).forEach(el => {
        if (typeof el.getBoundingClientRect !== 'function') return;
        const r = el.getBoundingClientRect();
        if (r.width > 20 && r.height > 20 && r.top >= 70 && r.bottom <= (win.innerHeight || 800) - 70 && r.left >= 40 && r.right <= (win.innerWidth || 1024) - 80) {
          candidates.push(r);
        }
      });
    });
    if (candidates.length === 0) return null;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    return {
      x: Math.max(20, Math.min((win.innerWidth || 1024) - (BIRD_W + 20), chosen.left + chosen.width / 2 - HALF_W)),
      y: Math.max(40, Math.min((win.innerHeight || 800) - (BIRD_H + 20), chosen.top - 100))
    };
  }

  // Step planner for roaming & perching
  function stepRoaming() {
    if (currentState !== STATE.ROAMING && currentState !== STATE.PERCHING) return;

    if (win.innerWidth <= MOBILE_BREAKPOINT) {
      dockToHeroImmediately();
      return;
    }

    const perch = Math.random() < 0.45 ? getPerchTarget() : null;
    let targetX, targetY;
    let willPerch = false;

    if (perch) {
      targetX = perch.x;
      targetY = perch.y;
      willPerch = true;
    } else {
      targetX = 40 + Math.random() * ((win.innerWidth || 1024) - 220);
      targetY = 60 + Math.random() * ((win.innerHeight || 800) - 240);
    }

    const facingRight = targetX >= posX;
    const flightTime = willPerch ? 1.6 : (1.8 + Math.random() * 0.7);

    if (companionEl) companionEl.classList.remove('is-perched');
    moveCompanion(targetX, targetY, flightTime, facingRight);

    clearTimeout(roamTimer);
    roamTimer = setTimeout(() => {
      if (currentState === STATE.ROAMING) {
        if (willPerch) {
          currentState = STATE.PERCHING;
          if (companionEl) companionEl.classList.add('is-perched');
          // Stay perched for 4 to 7 seconds
          roamTimer = setTimeout(() => {
            if (currentState === STATE.PERCHING) {
              currentState = STATE.ROAMING;
              stepRoaming();
            }
          }, 4000 + Math.random() * 3000);
        } else {
          stepRoaming();
        }
      }
    }, flightTime * 1000 + 400);
  }

  function fleeFromCursor(cursorX, cursorY) {
    currentState = STATE.FLEEING;
    clearTimeout(roamTimer);
    if (!companionEl) return;
    companionEl.classList.remove('is-perched');
    companionEl.classList.add('is-fleeing');

    const centerX = posX + HALF_W;
    const centerY = posY + HALF_H;
    const angle = Math.atan2(centerY - cursorY, centerX - cursorX);
    const fleeDistance = 180 + Math.random() * 120;

    let nx = centerX + Math.cos(angle) * fleeDistance - HALF_W;
    let ny = centerY + Math.sin(angle) * fleeDistance - HALF_H;

    nx = Math.max(30, Math.min((win.innerWidth || 1024) - (BIRD_W + 30), nx));
    ny = Math.max(50, Math.min((win.innerHeight || 800) - (BIRD_H + 40), ny));

    const facingRight = nx >= posX;
    moveCompanion(nx, ny, 0.55, facingRight);

    setTimeout(() => {
      if (companionEl) companionEl.classList.remove('is-fleeing');
      if (currentState === STATE.FLEEING) {
        currentState = STATE.ROAMING;
        stepRoaming();
      }
    }, 600);
  }

  // Catch the bird mini-game trigger
  function catchBird(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (currentState === STATE.RETURNING) return;

    const clickX = (e && e.clientX) || (posX + HALF_W);
    const clickY = (e && e.clientY) || (posY + HALF_H);

    createFeatherBurst(clickX, clickY);
    showSpeechBubble(companionEl, 'Ouch!');

    currentState = STATE.RETURNING;
    clearTimeout(roamTimer);
    if (companionEl) {
      companionEl.classList.remove('is-perched', 'is-fleeing');
      companionEl.classList.add('is-returning');
    }

    if (!boxBird || typeof boxBird.getBoundingClientRect !== 'function') {
      dockToHeroImmediately();
      return;
    }

    const heroRect = boxBird.getBoundingClientRect();
    const isHeroVisible = heroRect.bottom > -100 && heroRect.top < (win.innerHeight || 800) + 100;

    if (isHeroVisible) {
      const targetX = heroRect.left + (heroRect.width - BIRD_W) / 2;
      const targetY = heroRect.top + (heroRect.height - BIRD_H) / 2;
      const facingRight = targetX >= posX;
      moveCompanion(targetX, targetY, 1.2, facingRight);

      setTimeout(() => {
        dockAndSleep();
      }, 1250);
    } else {
      // Fly swiftly upward offscreen toward Hero
      moveCompanion(posX, -180, 0.75, posX < (win.innerWidth || 1024) / 2);
      if (companionEl) companionEl.style.opacity = '0';
      setTimeout(() => {
        dockAndSleep();
      }, 750);
    }
  }

  // Dock into Hero nest and sleep
  function dockAndSleep() {
    if (companionEl) {
      companionEl.style.display = 'none';
      companionEl.classList.remove('is-returning');
      companionEl.style.opacity = '1';
    }
    currentState = STATE.SLEEPING;
    if (boxBird) {
      boxBird.classList.remove('is-flying-away');
      boxBird.classList.add('is-sleeping');
      boxBird.title = 'Click để đánh thức chim 🕊️';
    }
    if (sleepContainer) {
      sleepContainer.style.display = 'block';
    }
  }

  function dockToHeroImmediately() {
    if (companionEl) {
      companionEl.style.display = 'none';
    }
    if (boxBird) {
      boxBird.classList.remove('is-flying-away');
    }
    currentState = STATE.IDLE_HERO;
  }

  // Flee when cursor gets near (< 65px roaming, < 40px perched)
  win.addEventListener('mousemove', function(e) {
    if (currentState !== STATE.ROAMING && currentState !== STATE.PERCHING) return;
    if (!companionEl || companionEl.style.display === 'none') return;

    const centerX = posX + HALF_W;
    const centerY = posY + HALF_H;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    const threshold = currentState === STATE.PERCHING ? 40 : 65;
    if (dist < threshold) {
      fleeFromCursor(e.clientX, e.clientY);
    }
  });

  // Hero nest bird interaction (Wake up / Sleep toggle / Mobile)
  if (boxBird) {
    boxBird.addEventListener('click', function(e) {
      const rect = typeof boxBird.getBoundingClientRect === 'function' ? boxBird.getBoundingClientRect() : { left: 0, top: 0, width: 140, height: 130 };
      const clickX = (e && e.clientX) || (rect.left + rect.width / 2);
      const clickY = (e && e.clientY) || (rect.top + rect.height / 2);

      if (currentState === STATE.SLEEPING) {
        // Wake up!
        createFeatherBurst(clickX, clickY);
        showSpeechBubble(boxBird, '!');
        currentState = STATE.IDLE_HERO;
        boxBird.classList.remove('is-sleeping');
        boxBird.title = '';
        if (sleepContainer) sleepContainer.style.display = 'none';

        if (win.innerWidth > MOBILE_BREAKPOINT) {
          setTimeout(() => {
            if (currentState === STATE.IDLE_HERO) {
              launchCompanion();
            }
          }, 1500);
        }
      } else {
        // Put to sleep!
        createFeatherBurst(clickX, clickY);
        showSpeechBubble(boxBird, 'Ouch!');
        dockAndSleep();
      }
    });
  }

  // Launch companion to roam the screen (Desktop only)
  function launchCompanion() {
    if (win.innerWidth <= MOBILE_BREAKPOINT || currentState === STATE.SLEEPING || !boxBird) return;

    const heroRect = typeof boxBird.getBoundingClientRect === 'function' ? boxBird.getBoundingClientRect() : { left: 100, top: 100, width: 140, height: 130 };
    posX = heroRect.left + (heroRect.width - BIRD_W) / 2;
    posY = heroRect.top + (heroRect.height - BIRD_H) / 2;

    ensureCompanionElement();
    companionEl.style.display = 'block';
    companionEl.style.transition = 'none';
    companionEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    companionEl.style.opacity = '1';

    boxBird.classList.add('is-flying-away');
    currentState = STATE.ROAMING;

    setTimeout(() => {
      if (currentState === STATE.ROAMING) {
        stepRoaming();
      }
    }, 400);
  }

  // Initial start on page load
  if (win.innerWidth > MOBILE_BREAKPOINT) {
    setTimeout(() => {
      if (currentState === STATE.IDLE_HERO) {
        launchCompanion();
      }
    }, 2800);
  }

  // Handle window resize
  win.addEventListener('resize', function() {
    if (win.innerWidth <= MOBILE_BREAKPOINT && currentState === STATE.ROAMING) {
      dockToHeroImmediately();
    }
  });

  return {
    getState: () => currentState,
    dockToHeroImmediately,
    dockAndSleep,
    launchCompanion
  };
}

/**
 * Responsive text heading helper
 */
function initHeadingResponsive(env = {}) {
  const doc = env.document || (typeof document !== 'undefined' ? document : null);
  const win = env.window || (typeof window !== 'undefined' ? window : null);
  if (!doc || !win) return;

  const textStrong = doc.querySelector('.strong-primary');
  function checkScreenSize() {
    if (!textStrong) return;
    if (win.innerWidth < 739) {
      textStrong.innerHTML = "Nguyen&nbsp;Cong Hau's";
    }
  }
  checkScreenSize();
  win.addEventListener('resize', checkScreenSize);
}

/**
 * Developer tools and keyboard shortcut filter module.
 * Protects DevTools shortcuts on page body while strictly bypassing
 * editable inputs, textareas, and contentEditable nodes.
 */
function initInputGuard(env = {}) {
  const doc = env.document || (typeof document !== 'undefined' ? document : null);
  const win = env.window || (typeof window !== 'undefined' ? window : null);
  if (!doc) return null;

  function isEditable(target) {
    return Boolean(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable));
  }

  function handleContextMenu(event) {
    const target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return; // Cho phép chuột phải trong ô nhập liệu để paste / copy
    }
    if (typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  }

  function handleKeyDown(event) {
    const target = event.target;
    // Bỏ qua nếu người dùng đang nhập văn bản trong input, textarea hoặc contentEditable
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    // F12 (123)
    if (event.keyCode === 123) {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      return;
    }

    // Ctrl+Shift+I (73), Ctrl+Shift+J (74), Ctrl+Shift+C (67)
    if (isCtrlOrCmd && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)) {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      return;
    }

    // Ctrl+U (85) - Xem mã nguồn trang
    if (isCtrlOrCmd && !event.shiftKey && event.keyCode === 85) {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      return;
    }
  }

  doc.addEventListener('contextmenu', handleContextMenu);
  if (win) {
    win.addEventListener('keydown', handleKeyDown);
  }

  return {
    isEditable,
    handleContextMenu,
    handleKeyDown
  };
}

/**
 * Theme switcher with LocalStorage persistence.
 */
function initThemeController(env = {}) {
  const doc = env.document || (typeof document !== 'undefined' ? document : null);
  const storage = env.storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!doc) return { switchTheme() {} };

  const htmlWeb = doc.documentElement;

  function switchTheme(theme) {
    if (!htmlWeb) return;
    if (theme === 'light') {
      htmlWeb.classList.add('light');
      try {
        if (storage) storage.setItem('portfolio-theme', 'light');
      } catch (e) {}
    } else {
      htmlWeb.classList.remove('light');
      try {
        if (storage) storage.setItem('portfolio-theme', 'dark');
      } catch (e) {}
    }
  }

  doc.querySelectorAll('.icon-light').forEach(function(lightElem) {
    lightElem.addEventListener('click', function(e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      switchTheme('light');
    });
  });

  doc.querySelectorAll('.icon-dark').forEach(function(darkElem) {
    darkElem.addEventListener('click', function(e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      switchTheme('dark');
    });
  });

  doc.querySelectorAll('.light--mode').forEach(function(wrapper) {
    wrapper.addEventListener('click', function() {
      if (htmlWeb.classList.contains('light')) {
        switchTheme('dark');
      } else {
        switchTheme('light');
      }
    });
  });

  return { switchTheme };
}

/**
 * Main Portfolio entrypoint coordinating theme, shortcut guard, and companion bird.
 */
function initPortfolio(env = {}) {
  const doc = env.document || (typeof document !== 'undefined' ? document : null);
  const win = env.window || (typeof window !== 'undefined' ? window : null);
  const storage = env.storage || (typeof localStorage !== 'undefined' ? localStorage : null);

  const themeController = initThemeController({ document: doc, storage });
  const inputGuard = initInputGuard({ document: doc, window: win });
  const companionBird = initCompanionBird({ document: doc, window: win });
  initHeadingResponsive({ document: doc, window: win });

  return {
    themeController,
    inputGuard,
    companionBird,
    switchTheme: themeController ? themeController.switchTheme : () => {}
  };
}

// Auto-initialize when running in a browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initPortfolio());
  } else {
    initPortfolio();
  }
}

// Module export for Node.js / testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPortfolio,
    initThemeController,
    initInputGuard,
    initCompanionBird,
    initHeadingResponsive,
    STATE,
    MOBILE_BREAKPOINT
  };
}
