# 02: Floating Action Button and Scroll-To-Top Stacking Refactor

**What to build:** A floating action button (FAB) at the bottom-right corner of the screen to open and close the chat assistant, paired with a refactoring of the existing `.onTop` scroll-to-top button so that both controls stack cleanly without visual or functional collision on any screen size.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Chatbot floating trigger button (`#ai-chatbot-toggle`) is rendered at the bottom-right corner (`bottom: 24px; right: 24px; z-index: 999;`).
- [ ] Chatbot trigger button contains an accessible label (`aria-label`, `aria-expanded`) and a crisp SVG icon featuring chat bubble and sparkles.
- [ ] The `.onTop` scroll-to-top button is refactored from sticky to `position: fixed; bottom: 88px; right: 24px; z-index: 998;`.
- [ ] On desktop and tablet viewports, both buttons stack vertically with comfortable spacing and never overlap.
- [ ] On mobile viewports (width <= 739px), `.onTop` remains hidden while the chatbot trigger button stays visible with responsive margins.
- [ ] Hover and active transitions on the toggle button match the site's accent colors and glowing effects.
