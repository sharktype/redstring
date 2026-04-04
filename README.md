# staircase

FOSS LLM-powered opinionated story/scenario player based on a specific RPG philosophy.

## Philosophies/Decisions

### Date and Time

A single day has 24 hours, displayable as 12-hour, 24-hour, general ("early morning"), or naval formats, with possible
other formats added in the future. However, the internal time always operates with a 24-hour clock; this cannot be
changed.

A day is split into weeks and months. By default, a week is 7 days. A month is defined by the categorical name of the
month, by default our real-world months, to the number of days in that month.

A year is determined by the defined months.

While this sounds flexible, it does mean complex roleplaying scenarios (two suns, two moons, etc.) become harder to
implement.

### Currencies

I've done a lot of roleplay with gold, silver, bronze coinage in fantasy settings. I find it adds unnecessary
complexity and doesn't make a lot of sense (10 silver magically turning into 1 gold?).

Instead, we will have a single currency, either decimal or integer. Optionally, currency can have weight, meaning that
the player can only carry so much of it. This can be fun: needing to go to a bank location or spreading out money for
rich players, where one such bank might be geographically far from where you need to buy something.

### Inventory

This is probably the most controversial decision. Inventory and items are fixed and the LLM is not allowed to invent
items except through a tool call to be added in the future.

This means a lot of manual labour just to set these up if I didn't add a "default" set of item templates. However,
fixed item economies means that potions always cost the same and are predictable, bartering and economy actually means
something, and shops aren't just throwaway roleplay locations.

The tool calls to fetch items are things like "get_reward(value: number)" or even something like
"get_item(description: string") which uses an LLM to fetch an item based on the description or create one if it does
not exist. This is a stretch goal but something I want to implement with the items system as a whole, before v1.0.0.

### Skills and Flags

Some skills are fixed. Stealth, barter, etc. are not removable as they are used in core gameplay elements. This may go
against your vision of a game, but Staircase is _not_ meant to be a game engine. Think of it more like a tabletop RPG
to which you may sometimes bring homebrew rules.

It is strongly recommended to not confuse skills with Flags. Flags are facts about the player in a normalised flat
array format viewable from the options page. Flags are only used by the LLM, both to write and read from.

Custom skills can be added by the user but they do not get used by the engine. LLMs, when not reigned in, will not
understand when and how to modify the values of these skills. It is recommended to not use more than two at a time.

### Combat

Combat is a non-AI game system that a tool call creates from simple template variables. Combat will be discussed in a
future version of this README.

### Spells and Abilities

These can be used out of combat. Spells and abilities must be fixed as otherwise the player will either have a random
bullshit spell, forget about the ability to use them, or be overwhelmed by needing to remember what spells they have.

### Locations and Lorebook

Locations can be turned off so the map and regions are not used at all, like with traditional text adventures; the
theatre of the mind, in that case. However, I've found that rigidity in game systems leads to richer roleplaying based
on the idea of "constraints breed creativity".

This, however, does mean you need to do a degree of pre-planning when you do use the feature. Once importing is
implemented, you can use another person's world and just jump in, but for now, you need to do some pre-planning.

The Lorebook works similarly: selectively sending information to the LLM generally improves the context window.

### Summarisation

The LLM's context window is limited and gets worse over time. To combat this, by default, we aggressively summarise the
story and use those summaries instead of the full messages. This may result in detail loss depending on the
summarisation agent used, but the pros outweigh the cons in my view.

Exporting still exports the full messages since the messages are saved and never deleted over time. However, the
interface will show the summarised messages instead of the full ones and are lazy-loaded.

### Improvisation vs Planning

Planning trumps improvisation nearly every time. We apply this philosophy to locations, characters, and sometimes plot.
The agents will be given tools to generate characters at runtime, but the expectation is that the user will pre-plan
and create characters sometimes before the story starts. The character generator is mostly non-AI and presents a real
kind of stochastic element to character creation. This is experimental.

### The SillyTavern Community

The SillyTavern community is a great source of inspiration. The work that people do on presets, extensions, and even
lorebooks is fantastic. I want to support these users as much as possible as well as ~~stealing~~ borrowing from their
great ideas and implementing them as a first-class feature in this engine when I like them enough.

Eventually, I'd like to expand modularity through more than just pull requests.

## Future Versions

### Up Next

This version has feature parity with the legacy Staircase version with a few extra goodies.

- Easy (Bugfix): Regenerate button has weird behaviour with editing.
- Easy: Ability to set style, rules, economy, setting, plot, and characters.
  - Condensed: this is permanent stuff but not in the system prompt. So, Rules or something like that should be present
    by the System as one of the first messages before the messages.
- Easy (as described): Equipped, inventory, stats, and memory that is given to the AI on every response.
  - Memory in the alpha is not correctly given to the agent; it should be given right before the current message. More
    thought should be given to where the supplementary information is given to the Storyteller.
- Easy: Move the lengthy content in this README to its own doc file in `docs/` and link to it from here.
- Easy: Implement a "luck die" that gets a categorical luck result that the LLM can use for roleplay.

### After That

This version removes the placeholders off the interface so everything that is clickable actually does something.

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

- Difficult: Implement allowing Storyteller or some other agent to modify characters, locations, etc. as needed.
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

### Questions/Challenges

- LLM storytellers love to waffle on without letting the player get any input. We need to curb this in some way,
  balancing the fact that each call to the LLM is token-expensive for such a short response.
