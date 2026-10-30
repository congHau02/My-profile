# 04: End-to-End Conversation Flow, Typing Delay, Quick Reply Chips and Smart Navigation

**What to build:** The complete interactive conversational loop: displaying a warm greeting with initial Quick Reply Chips upon opening, rendering user messages, showing a 400ms–600ms animated typing indicator before bot replies, displaying follow-up Quick Reply Chips below answers, executing smooth page scrolling (`#skills`, `#info`), and offering an in-message view link for mobile devices.

**Blocked by:** 01: Core Knowledge Base and Intent Matching Engine, 03: Chat Window UI, Sora Theme Integration and Micro-Markdown Formatter

**Status:** completed

- [x] Opening the chat window for the first time renders an initial greeting message accompanied by initial Quick Reply Chips ("Kỹ năng công nghệ", "Dự án tiêu biểu", "Thông tin liên hệ").
- [x] Clicking any Quick Reply Chip automatically dispatches the corresponding question as if typed by the user.
- [x] Submitting a question appends a user message bubble and scrolls the message feed to the bottom.
- [x] Before the bot answers, a 3-dot typing indicator animates for 400ms–600ms to simulate natural interaction.
- [x] The bot response is formatted via the micro-markdown parser and appended with contextual follow-up Quick Reply Chips.
- [x] If the matched intent specifies a `scrollTo` target (e.g. `#skills`, `#info`), the page smoothly scrolls to that element.
- [x] On mobile devices, bot messages with scroll targets include a clickable link ("👉 Xem trên trang") that closes the chat and focuses on the section.
- [x] State remains in-memory: reloading the page resets the chat to the initial fresh greeting state.
