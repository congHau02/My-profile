# 100% Client-Side Rule-Based Chatbot Engine

Status: accepted

We decided to implement the portfolio chatbot using a pure client-side pattern matching engine in vanilla JavaScript instead of calling external LLM APIs (OpenAI/Gemini) or a backend server. This ensures 0ms latency, 100% uptime, zero hosting or token costs, eliminates API secret exposure on GitHub Pages, and guarantees deterministic responses strictly grounded in the owner's actual profile.

## Context

The portfolio is hosted statically on GitHub Pages with zero server infrastructure. Visitors frequently want immediate answers about Nguyễn Công Hậu's background, tech stack, open-source projects, and contact information. Introducing an external backend or LLM API would introduce operational complexity, latency, monthly token costs, risk of API key leakage in client-side code, and potential AI hallucinations regarding personal credentials or project scopes.

## Considered Options

1. **External LLM API (OpenAI / Gemini API direct or via serverless proxy):**
   - *Pros:* Handles open-ended natural language questions and freeform chit-chat.
   - *Cons:* Exposes API keys on client or requires third-party serverless hosting; adds 500ms–2000ms latency; incurs continuous token costs; risk of hallucinations contradicting verified resume data.
2. **Third-party Chatbot Widget (Tawk.to, Crisp, Intercom):**
   - *Pros:* Fast integration, rich UI out-of-the-box.
   - *Cons:* Heavy third-party tracking scripts, cookie compliance overhead, slower initial page load, branding mismatch with custom Sora dark/light theme.
3. **Pure Client-Side Rule-Based Engine (Selected):**
   - *Pros:* Zero runtime dependencies, 0ms network latency, 100% uptime, 0 token costs, total privacy, deterministic responses, seamless integration with custom CSS variables and UI theme.
   - *Cons:* Knowledge base is bounded to predefined intents (greeting, skills, projects, about, education, contact, fallback).

## Consequences

- The chatbot responds instantly without network requests or external failure modes.
- Answers are 100% truthful and strictly grounded in verified facts from the developer's resume and GitHub repositories.
- Unrecognized or complex conversational queries gracefully trigger the `fallback` intent with helpful Quick Reply Chips to guide visitors.
- Any future updates to personal projects or skills require updating `CHATBOT_KNOWLEDGE_BASE` in `chatbot.js`.
