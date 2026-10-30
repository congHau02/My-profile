# 03: Chat Window UI, Sora Theme Integration and Micro-Markdown Formatter

**What to build:** The floating chat window interface styled consistently with the portfolio's typography, spacing, and dynamic dark/light theme tokens, complete with an accessible header (assistant name, online status, close button), a scrollable message list, a message input field with Send button and Enter key handler, and a micro-markdown parser to safely format rich text in bot responses.

**Blocked by:** 02: Floating Action Button and Scroll-To-Top Stacking Refactor

**Status:** completed

- [x] Chat window container (`#ai-chatbot-window`) is structured with header, body (messages), and footer (input area).
- [x] Visual styling uses the project's font family (`Sora`) and standard CSS variables (`--header-color`, `--blue-1`, `--blue-2`, `--sub-heading-color`, etc.).
- [x] Theme transitions adapt automatically when toggling between Dark Mode and Light Mode (`html.light`).
- [x] On desktop, the chat window floats above the FAB as a clean modern card with rounded corners and subtle shadow.
- [x] On mobile viewports (width <= 739px), the chat window adjusts to a responsive floating card (`width: calc(100% - 32px); height: 75vh; right: 16px; bottom: 16px;`).
- [x] A safe micro-markdown parser converts `**bold text**`, bullet points `•`, linebreaks `\n`, and hyperlinks `<a>` into HTML without external dependencies.
- [x] An input bar allows visitors to type queries, supporting both the Send button click and pressing the Enter key.
