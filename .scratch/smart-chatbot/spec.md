# Specification: Smart Client-Side Portfolio Assistant

## Problem Statement

Recruiters, engineering managers, and visitors browsing Nguyen Cong Hau's personal portfolio often want immediate answers regarding his technical stack, GitHub repositories, educational background, and contact details without needing to manually hunt through sections. However, integrating an external AI chatbot (such as an LLM API) onto a static GitHub Pages site risks leaking secret API tokens, incurring ongoing usage costs, suffering network latency or service outages, and hallucinating details outside the developer's actual background.

## Solution

A zero-latency, 100% client-side interactive Chatbot Widget embedded directly into the portfolio. The widget matches visitor questions against a curated Knowledge Base of Intents trained on Nguyen Cong Hau's genuine profile, technical skills, and public GitHub projects. It operates with zero backend dependencies, zero API costs, supports Vietnamese with and without diacritics, provides Quick Reply Chips for frictionless exploration, animates typing states for a natural conversational feel, and smoothly navigates the page to relevant sections while seamlessly respecting dark and light themes.

## User Stories

1. As a visiting tech recruiter, I want to see a recognizable chat floating action button at the bottom-right of the portfolio, so that I can immediately tell an interactive assistant is available to help me navigate.
2. As a visitor, I want to click the floating action button to open the chat window, so that I can begin conversing with the assistant.
3. As a visitor, I want to close or minimize the chat window by clicking the close button or outside the widget, so that the chat does not obstruct my view of the portfolio when I am done.
4. As a first-time visitor, I want the assistant to greet me immediately upon opening the chat window and display initial Quick Reply Chips, so that I know what topics the bot can answer without having to type.
5. As a visitor, I want to type questions in Vietnamese without diacritics (e.g. "ky nang cong nghe", "du an github"), so that the assistant still accurately understands and answers my questions.
6. As a visitor, I want to type questions in standard Vietnamese with accents (e.g. "kỹ năng của bạn", "thông tin liên hệ"), so that the assistant correctly recognizes my intent.
7. As an engineering manager, I want to ask about backend or frontend technical skills, so that I receive a structured summary of Java Spring Boot, ReactJS, Supabase, AWS, Docker, Terraform, and CI/CD competencies.
8. As a recruiter, I want the assistant to automatically scroll the page to the Skills section when discussing technical skills, so that I can visually verify the deployment pipeline architecture and skill badges.
9. As a visitor, I want to inquire about projects and receive a curated overview of genuine GitHub repositories (SmartSalon, The-Booking-Site, POS_QUAN_LY_BAN_HANG, My-profile), so that I can see concrete code evidence.
10. As a visitor, I want direct external links to GitHub project repositories inside the assistant's response, so that I can open and inspect source code in a new tab with one click.
11. As a recruiter, I want to ask for contact information, so that I receive Nguyen Cong Hau's social channels (Facebook, Instagram, GitHub) and have the page scroll to the Info section.
12. As a visitor, I want to ask about educational background and qualifications, so that I learn about his studies at University of Transport and Communications (UTC), GPA > 3.0, and teaching assistant experience.
13. As a visitor, I want to click any Quick Reply Chip suggestion, so that the corresponding query is automatically dispatched without manual typing.
14. As a visitor, I want to see a natural typing indicator (400ms–600ms delay) before the bot answers, so that the interaction feels responsive and conversational rather than jarringly instantaneous.
15. As a visitor, I want bold text, line breaks, bullet points, and hyperlinks properly formatted in the bot's messages, so that long technical descriptions remain readable and pleasant to scan.
16. As a visitor typing an unsupported or ambiguous query, I want the assistant to trigger a courteous Fallback Intent with helpful Quick Reply Chips, so that the conversation never hits a dead end.
17. As a desktop user scrolling through long pages, I want the chat floating button and the scroll-to-top button (.onTop) to be neatly stacked vertically without visual overlap, so that both actions remain comfortably accessible.
18. As a mobile phone visitor, I want the chat window to open as an ergonomic floating card with touch-friendly controls and avoid overlapping or interfering with page navigation, so that I enjoy a first-class mobile experience.
19. As a mobile phone visitor, I want in-message navigation links ("👉 Xem trên trang") for scrolled sections, so that I can deliberately choose when to dismiss the chat and view the underlying section.
20. As a visitor toggling between Dark Mode and Light Mode, I want the chat window and floating button colors to immediately adapt to the active theme palette, so that the visual presentation remains consistent.
21. As a keyboard-centric visitor, I want to press the Enter key inside the chat input field to submit my message, so that I don't have to reach for my mouse.
22. As a visitor reloading the page, I want the chat session to reset cleanly in-memory, so that obsolete or stale conversations don't clutter my future visits.

## Implementation Decisions

- **Architectural Pattern**: 100% Client-Side Rule-Based Chatbot Engine executing within the browser context. Zero backend endpoints, zero external LLM API keys, 0ms network latency, and deterministic output strictly conforming to ADR-0001.
- **Intent Normalization & Scoring**: User input is normalized via Unicode NFD diacritics stripping, case-folding to lowercase, and punctuation sanitization. A token-scoring algorithm tallies pattern matches against candidate Intents. The Intent with the highest token score is selected; an exact zero score routes to the Fallback Intent.
- **Data Integration & Knowledge Base**: Static catalog compiled directly from the portfolio owner's genuine profile data, verified UTC education, and real public GitHub repositories (`SmartSalon`, `The-Booking-Site`, `POS_QUAN_LY_BAN_HANG`, and `My-profile`).
- **Coexistence with Scroll-To-Top**: The existing scroll-to-top action element is migrated from sticky layout to fixed vertical stacking at the bottom-right (`bottom: 88px; right: 24px; z-index: 998;`). The Chatbot floating trigger button sits at `bottom: 24px; right: 24px; z-index: 999;`. On mobile viewports (<= 739px), the scroll-to-top button remains hidden while the chat trigger button stays visible with responsive touch margins.
- **Lightweight Markdown Micro-Renderer**: A minimal client-side parser safely converts `**bold text**`, bullet points `•`, linebreaks `\n`, and hyperlinks `<a>` without introducing heavy external Markdown dependencies.
- **Design System Fidelity**: The Chatbot Widget adopts the existing design variables: Sora typography, `--header-color`, `--blue-1`, `--blue-2`, `--sub-heading-color`, and background tokens for both default Dark and Light themes.
- **State Management**: Ephemeral in-memory state. Chat history begins with an initial greeting and default Quick Reply Chips upon page load, without persisting stale messages across sessions.

## Testing Decisions

- **Testing Principle**: Verify external observable behavior rather than internal implementation details. Tests should validate that given specific normalized input strings, the engine returns the expected Intent ID and recommendations, and that UI elements render and respond correctly.
- **Primary Testing Seams**:
  1. *Intent Matching & Knowledge Base Engine Seam*: Standalone execution of the normalization and scoring function against a comprehensive test suite of Vietnamese phrases (with accents, without accents, abbreviations, and out-of-scope garbage inputs).
  2. *DOM Integration & Interaction Seam*: Interactive browser verification of floating action button toggle, message bubble dispatch, typing indicator delay lifecycle, Quick Reply Chip click triggering, theme transition synchronization, and responsive mobile layout.
- **Prior Art**: The companion bird minigame state machine and the theme switching handler in the current codebase operate via pure vanilla DOM event listeners and CSS class manipulation.

## Out of Scope

- Generative AI prompt completion requiring third-party API credentials or backend proxies.
- Audio speech-to-text or voice synthesis playback.
- Persistent database synchronization or server-side message logging.
- Modifying or adding new top-level HTML sections to the portfolio outside the widget container.

## Further Notes

- The assistant's persona is established as "Trợ lý ảo Công Hậu" (Software Engineer Assistant), utilizing an SVG vector icon featuring modern sparkles and chat bubble elements styled with the primary cyan/blue gradient.
- Repository links provided by the assistant direct to active GitHub repositories under `https://github.com/congHau02/`.
