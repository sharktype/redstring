# staircase

FOSS LLM-powered opinionated story/scenario player based on a specific RPG philosophy.

## Future Versions

### Up Next

- Chat between the player and the storyteller AI. Clearly the most important feature.
- Ability to set style, rules, economy, setting, plot, and characters.
  - This needs a lot of thought. A lot of the time I rarely even use these in roleplays. Many of them could be
    condensed into one thing - maybe just the system prompt of the Storyteller AI which already exists?
  - My thought is that it should be condensed. In the beta, it's currently: rules, reinforcement (delete?), modules,
    chargen (definitely keep), and the more structured other stuff: map, item, characters. Plus in the future, "codex"
    will allow linking in the actual story.
- Equipped, inventory, stats, and memory that is given to the AI on every response.
  - Memory in the alpha is not correctly given to the agent; it should be given right before the current message. More
    thought should be given to where the supplementary information is given to the Storyteller.
- Implement time, date, and weather via non-LLM "game setting" forms.
- A non-map node based location editor that allows selecting the current location.
- Allow selecting the current location from the map as well.
- Implement "password" blocking with eye icon to hide/show text for API key inputs.

### Future Goals

- Implement summarisation.
- Implement allowing Storyteller or some other agent to modify characters, locations, etc. as needed.
- Add ability to retain/export all messages even after summarisation.
- Implement something to replace the stock browser alerts.
- "Save slots" for storylines and worlds (both text and browser).

### Stretch Goals

- The map feature could be improved: rather than needing a separate map generator and manually creating, the whole
  worldgen feature could be built into the engine entirely.
- Character generator: a separate LLM that can be called as a tool call to generate a random character, which itself
  uses tool calls to generate names and personalities, etc. and these get saved in Characters.
- Consider the need for Plot and Timeline features.
- Replace native dropdowns with comboboxes.
- "Question answering bot" for the LLM: the LLM might directly ask you questions to clarify and build your world as you
  go along, rather than upfront massive walls of text.
- Modules: a "module" is a collection of default injections into either the system prompt, the pre-prompt, and so on.
- "Add as quest?" agent that scans just the last few messages and small context (fast, cheap LLM) that gives the user
  some buttons like "add to quest" or "add to notebook" and so on.
