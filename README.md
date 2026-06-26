# staircase

FOSS LLM-powered opinionated story/scenario player based on a specific RPG philosophy.

- [Philosophies](./docs/PHILOSOPHIES.md)

## Direction

From the current direction, we have found things that work and do not work. So in the future:

- Locations are tracked as "facts" that are improvised and added to the facts tree as we go rather than determined at
  the start.
- Items are effectively either clothing/armour, weapons, directly impacting stats, consumable, or quest items in reality
  and a system for tracking them outside of Profile is likely unnecessary. Put focus onto a proper character profile
  system.
- Time tracking must be done by the storyteller and should be done more consistently than it has been done.
- The name generator is good, and tool calls should use it more effectively.
- Inventory is likely to be very brittle and not work very well. It is better to handwave such things in most roleplays
  anyway. More important is the state of the character, gold/money, and armour/weapons/clothing.
- Secrets and planning is half-baked. It works, yes, but we can do much better.

The main new feature that I think will have value is calling agents to do thinking for the short and long-term plan of
the story, and next the ability to store context for things in a vector database rather than summarisations which
necessarily lose resolution over time.

The secondary improvement would be the "dialogue mode" that allows much quicker communication. The idea I have for this
at the moment is one agent call to provide a dialogue context that can be exited at any time, and subsequent calls have
a much smaller window of knowledge about the world and what has gone on.

### Agent Order

- Agent may ask "can the user do this?" and ask for rolls.
- Agent might plan the scene.
- Agent might then generate a draft iteratively until the result is good enough.
- Post-agent might determine if the scene is worth generating an image for, what it needs to change via tool calls, etc.

This needs a lot of serious consideration and is by no means set in stone.

## Future Versions

### Up Next

This version removes the placeholders off the interface so everything that is clickable actually does something.

- Easy Bug: Differentiate between when to use use- hooks directly versus the `GameContext` provided functions.
- Easy: Add deploy script to Cloudflare Pages.
- Moderate: Add skills and flags.
  - Including a new tool call that does skill checks instead of a straight up d20 roll.
- Moderate: Implement "create shop with items" tool call.
- Easy: Appearances should have beauty scales and types (e.g., "cute", "handsome" etc.)
- Easy: Add a more detailed section for image generation: styles (with examples that work well, e.g., "2020s (style)",
  as well as ways to quickly generate example scenes that do not get saved.
- Moderate: Move all blobs to their own dedicated IndexedDB store rather than storing them directly on the player state.
- Easy: Move time from player state to game state.
- Easy: Add body hair and other physical characteristics to the appearance formlet.

### Before Beta

- Use virtualized lists for rendering messages.
- "Save slots" for storylines and worlds (both text and browser).
- Implement something to replace the stock browser alerts.
- Add ability to retain/export all messages even after summarisation.
- Consider the need for Plot and Timeline features.
- Register a domain and deploy.

### Stretch Goals

- Implement allowing Storyteller or some other agent to modify characters etc. as needed.
- The map feature could be improved: rather than needing a separate map generator and manually creating, the whole
  world-gen feature could be built into the engine entirely.
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
