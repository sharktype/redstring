# staircase

FOSS LLM-powered opinionated story/scenario player based on a specific RPG philosophy.

## Next Version

- Make the location and character data structures more structured than just text blobs.
- Make the interface more game-like, with stats displayed at all times on the sidebar.
- Move "permanent content" to a less permanent spot as it's not that important to see at all times.
- Summarisation of older messages every N messages to keep context window usage down.
- Gamify location and time mechanics to be less LLM-dependent.
- Allow modifying characters mid-game using LLM tool calls.
- Allow specifying multiple LLMs for different tasks.
- Add ability to retain/export all messages even after summarisation.
- Replace native dropdowns with comboboxes.
- Implement something to replace the stock browser alerts.
- "Save slots" for storylines and worlds.
  - Best to implement this early for a data model that supports any number of stories/worlds.
- Implement "password" blocking with eye icon to hide/show text for API key inputs.
- "Question answering bot" for the LLM: the LLM might directly ask you questions to clarify and build your world as you
  go along, rather than upfront massive walls of text.
- A "module" is a collection of default injections into either the system prompt, the pre-prompt, and so on.
