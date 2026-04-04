# Philosophies/Decisions

## Date and Time

A single day has 24 hours, displayable as 12-hour, 24-hour, general ("early morning"), or naval formats, with possible
other formats added in the future. However, the internal time always operates with a 24-hour clock; this cannot be
changed.

A day is split into weeks and months. By default, a week is 7 days. A month is defined by the categorical name of the
month, by default our real-world months, to the number of days in that month.

A year is determined by the defined months.

While this sounds flexible, it does mean complex roleplaying scenarios (two suns, two moons, etc.) become harder to
implement.

## Currencies

I've done a lot of roleplay with gold, silver, bronze coinage in fantasy settings. I find it adds unnecessary
complexity and doesn't make a lot of sense (10 silver magically turning into 1 gold?).

Instead, we will have a single currency, either decimal or integer. Optionally, currency can have weight, meaning that
the player can only carry so much of it. This can be fun: needing to go to a bank location or spreading out money for
rich players, where one such bank might be geographically far from where you need to buy something.

## Inventory

This is probably the most controversial decision. Inventory and items are fixed and the LLM is not allowed to invent
items except through a tool call to be added in the future.

This means a lot of manual labour just to set these up if I didn't add a "default" set of item templates. However,
fixed item economies means that potions always cost the same and are predictable, bartering and economy actually means
something, and shops aren't just throwaway roleplay locations.

The tool calls to fetch items are things like "get_reward(value: number)" or even something like
"get_item(description: string") which uses an LLM to fetch an item based on the description or create one if it does
not exist. This is a stretch goal but something I want to implement with the items system as a whole, before v1.0.0.

## Skills and Flags

Some skills are fixed. Stealth, barter, etc. are not removable as they are used in core gameplay elements. This may go
against your vision of a game, but Staircase is _not_ meant to be a game engine. Think of it more like a tabletop RPG
to which you may sometimes bring homebrew rules.

It is strongly recommended to not confuse skills with Flags. Flags are facts about the player in a normalised flat
array format viewable from the options page. Flags are only used by the LLM, both to write and read from.

Custom skills can be added by the user but they do not get used by the engine. LLMs, when not reigned in, will not
understand when and how to modify the values of these skills. It is recommended to not use more than two at a time.

## Combat

Combat is a non-AI game system that a tool call creates from simple template variables. Combat will be discussed in a
future version of this README.

## Spells and Abilities

These can be used out of combat. Spells and abilities must be fixed as otherwise the player will either have a random
bullshit spell, forget about the ability to use them, or be overwhelmed by needing to remember what spells they have.

## Locations and Lorebook

Locations can be turned off so the map and regions are not used at all, like with traditional text adventures; the
theatre of the mind, in that case. However, I've found that rigidity in game systems leads to richer roleplaying based
on the idea of "constraints breed creativity".

This, however, does mean you need to do a degree of pre-planning when you do use the feature. Once importing is
implemented, you can use another person's world and just jump in, but for now, you need to do some pre-planning.

The Lorebook works similarly: selectively sending information to the LLM generally improves the context window.

## Summarisation

The LLM's context window is limited and gets worse over time. To combat this, by default, we aggressively summarise the
story and use those summaries instead of the full messages. This may result in detail loss depending on the
summarisation agent used, but the pros outweigh the cons in my view.

Exporting still exports the full messages since the messages are saved and never deleted over time. However, the
interface will show the summarised messages instead of the full ones and are lazy-loaded.

## Improvisation vs Planning

Planning trumps improvisation nearly every time. We apply this philosophy to locations, characters, and sometimes plot.
The agents will be given tools to generate characters at runtime, but the expectation is that the user will pre-plan
and create characters sometimes before the story starts. The character generator is mostly non-AI and presents a real
kind of stochastic element to character creation. This is experimental.

## The SillyTavern Community

The SillyTavern community is a great source of inspiration. The work that people do on presets, extensions, and even
lorebooks is fantastic. I want to support these users as much as possible as well as ~~stealing~~ borrowing from their
great ideas and implementing them as a first-class feature in this engine when I like them enough.

Eventually, I'd like to expand modularity through more than just pull requests.
