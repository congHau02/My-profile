# 04: End-to-End Conversation Flow, Typing Delay, Quick Reply Chips and Smart Navigation

**What to build:** The complete interactive conversational loop: displaying a warm greeting with initial Quick Reply Chips upon opening, rendering user messages, showing a 400ms–600ms animated typing indicator before bot replies, displaying follow-up Quick Reply Chips below answers, executing smooth page scrolling (`#skills`, `#info`), and offering an in-message view link for mobile devices.

**Blocked by:** 01: Core Knowledge Base and Intent Matching Engine, 03: Chat Window UI, Sora Theme Integration and Micro-Markdown Formatter

**Status:** ready-for-agent

- [ ] Opening the chat window for the first time renders an initial greeting message accompanied by initial Quick Reply Chips ("Kỹ năng công nghệ", "Dự án tiêu biểu", "Thông tin liên hệ").
- [ ] Clicking any Quick Reply Chip automatically dispatches the corresponding question as if typed by the user.
- [ ] Submitting a question appends a user message bubble and scrolls the message feed to the bottom.
- [ ] Before the bot answers, a 3-dot typing indicator animates for 400ms–600ms to simulate natural interaction.
- [ ] The bot response is formatted via the micro-markdown parser and appended with contextual follow-up Quick Reply Chips.
- [ ] If the matched intent specifies a `scrollTo` target (e.g. `#skills`, `#info`), the page smoothly scrolls to that element.
- [ ] On mobile devices, bot messages with scroll targets include a clickable link ("👉 Xem trên trang") that closes the chat and focuses on the section.
- [ ] State remains in-memory: reloading the page resets the chat to the initial fresh greeting state.
