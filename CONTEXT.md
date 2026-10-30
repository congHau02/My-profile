# Portfolio Personal Assistant

Domain model and ubiquitous language for the personal portfolio website and its client-side interactive assistant.

## Language

**Chatbot Widget**:
A client-side interactive floating interface allowing visitors to converse with an automated assistant about the portfolio owner's profile, skills, projects, and contact info.
_Avoid_: External bot, iframe widget, third-party chat plugin

**Intent**:
A distinct conversational topic defined by a canonical identifier, trigger keyword patterns, a pre-compiled response template, optional auto-scroll target, and quick reply suggestions.
_Avoid_: Prompt, model completion, user intent entity

**Knowledge Base**:
The static in-memory catalog of all supported intents pre-trained on the portfolio owner's genuine background, skills, and GitHub repositories.
_Avoid_: Vector database, RAG store, database table

**Quick Reply Chip**:
A clickable button rendered alongside or below a bot message that injects a predefined user inquiry without typing.
_Avoid_: Suggestion pill, autocomplete button

**Fallback Intent**:
The safety net intent triggered when the user's input does not match any recognized intent patterns with sufficient confidence.
_Avoid_: Error handler, 404 response
