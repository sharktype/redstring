# staircase

FOSS LLM-powered opinionated story/scenario player based on a specific RPG philosophy.

- [Philosophies](./docs/PHILOSOPHIES.md)

## Future Versions

### Up Next

This version has feature parity with the legacy Staircase version with a few extra goodies.

- Easy (as described): Equipped, inventory, stats, and memory that is given to the AI on every response.
  - Memory in the alpha is not correctly given to the agent; it should be given right before the current message. More
    thought should be given to where the supplementary information is given to the Storyteller.
  - Really the equipped shouldn't be part of this (not fun to manage), nor is inventory. So it's just stats and memory.
    Stats should exist by itself as something more consolidated. Memory should exist as a "are you sure you want to
    edit this?" thing on the Journal, plus some tool calls to be able to read and write from it.

### After That

This version removes the placeholders off the interface so everything that is clickable actually does something.

- Easy Bug: Differentiate between when to use use- hooks directly versus the `GameContext` provided functions.
- Easy: Add deploy script to Cloudflare Pages.
- Moderate: Implement time, date, and weather via non-LLM "game setting" forms.
- Moderate: A non-map node based location editor that allows selecting the current location.
- Moderate: Implement possibility of random encounters when moving, and system messages of moving happening.
  - This includes adding functionality to the "cycle" button on the map form.
- Moderate: Implement rudimentary character creation.
- Moderate: Implement summarisation.
- Moderate: Add skills and flags.
  - Including a new tool call that does skill checks instead of a straight up d20 roll.
- Moderate: Implement spells and abilities.
- Moderate: Actually integrate locations and the map.
- Moderate: Implement Buildings in Locations.

After this version, we have a public alpha.

### Before Beta

- Use virtualized lists for rendering messages.
- "Save slots" for storylines and worlds (both text and browser).
- Implement something to replace the stock browser alerts.
- Add ability to retain/export all messages even after summarisation.
- Consider the need for Plot and Timeline features.
- Register a domain and deploy.

### Stretch Goals

- Implement allowing Storyteller or some other agent to modify characters, locations, etc. as needed.
- The map feature could be improved: rather than needing a separate map generator and manually creating, the whole
  worldgen feature could be built into the engine entirely.
- Character generator: a separate LLM that can be called as a tool call to generate a random character, which itself
  uses tool calls to generate names and personalities, etc. and these get saved in Characters.
- Modules: a "module" is a collection of default injections into either the system prompt, the pre-prompt, and so on.
- "Add as quest?" agent that scans just the last few messages and small context (fast, cheap LLM) that gives the user
  some buttons like "add to quest" or "add to notebook" and so on.
- Add a "codex" that will automatically link things mentioned in the story.
  - Maybe with an autocomplete for the user as well?
- Date and time gets a calendar. This also allows adding holidays and events depending on the day and might be a
  prerequisite for the timeline suggestion.
- Scene planning tool call and related agent that the storyteller can optionally call for complex scenes.
- Visuals: using AIs to generate images for characters, items, and so on.
  - Could be controversial. I am on the fence about this.
- Swipes: instead of regenerate deleting the message, we could save the old versions and allow swiping through them.
  - Might not be implemented; depends on how well the existing regenerate works.
- Non-English support: This means two things:
  - The LLM both takes in and responds in a non-English language. This supports non-English speakers. It might already
    support this, but more testing is needed.
- Internationalisation of the interface - all strings to be localised, including my British English to American English
  if in the US, and so on.
- Indexer/embeddings for lorebook entries.

### Questions/Challenges

- LLM storytellers love to waffle on without letting the player get any input. We need to curb this in some way,
  balancing the fact that each call to the LLM is token-expensive for such a short response.
