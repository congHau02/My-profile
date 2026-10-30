# 01: Core Knowledge Base and Intent Matching Engine

**What to build:** An in-memory Knowledge Base and intent matching engine that recognizes user questions in Vietnamese (both with and without accents) and returns the corresponding response, scroll target, and follow-up suggestions based on Nguyen Cong Hau's actual profile, skills, education, contact info, and 4 public GitHub repositories (SmartSalon, The-Booking-Site, POS_QUAN_LY_BAN_HANG, My-profile). When a query has no matching pattern, the engine returns a courteous Fallback Intent with default suggestions.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] `CHATBOT_KNOWLEDGE_BASE` contains complete, accurate information for `greeting`, `skills`, `projects`, `about`, `education`, and `contact` intents.
- [x] The `projects` intent includes verified descriptions and GitHub repository links for `SmartSalon`, `The-Booking-Site`, `POS_QUAN_LY_BAN_HANG`, and `My-profile`.
- [x] A string normalization function strips Vietnamese diacritics using Unicode NFD normalization, converts text to lowercase, and removes punctuation.
- [x] A scoring function matches user queries against intent patterns using token scoring, selecting the highest-scoring intent.
- [x] Any query scoring zero matches reliably routes to the `fallback` intent with helpful guidance and suggestions.
- [x] Standalone test queries ("kỹ năng", "ky nang", "du an", "dự án spring boot", "học vấn", "lien he", "xin chào", "thời tiết") return their expected intent objects.
