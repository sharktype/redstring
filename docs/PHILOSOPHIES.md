# Philosophies/Decisions

## Date and Time

**TL;DR**: A day has 24 hours. There are no dates.

A single day has 24 hours, displayable as 12-hour, 24-hour, general ("early morning"), or naval formats, with possible
other formats added in the future. However, the internal time always operates with a 24-hour clock; this cannot be
changed.

I've played a number of roleplays with "date" as a concept and it has never really come up. Deadlines for quests and
such are deliberately absent from games such as Skyrim; even though that game _has_ date, do you ever remember what it
was when you played it?

## Currencies

**TL;DR**: A single integer currency called "knocks" is used, priced similarly to yen in real life.

I've done a lot of roleplay with gold, silver, bronze coinage in fantasy settings. I find it adds unnecessary
complexity and doesn't make a lot of sense (10 silver magically turning into 1 gold?).

Instead, we will have a single integer currency. Optionally, currency can have weight, meaning that the player can only
carry so much of it. This can be fun: needing to go to a bank location or spreading out money for rich players, where
one such bank might be geographically far from where you need to buy something.

The name of this currency is "knocks." It is priced similarly to yen in real life, with 100 knocks roughly equating to
a dollar in real life, keeping in mind lower cost of goods.

## Inventory

**TL;DR**: Items are invented over time and are categorized into equipment, consumables, and key items.

Items are invented over time. There are three types of inventory: equipment, consumables, and key items.

All items are in the Profile detailer. Equipment is equipped or unequipped, consumables are in a list and follow a
Souls-like approach (few consumables, replenished on rest). Key items are purely quest items and you are not expected
to have many of them. "Tent" and travel items (mounts, for instance) are also equipment.

### Consumables? So, there are needs?

No. Keeping track of the need to eat and drink is not that fun. The only need that is tracked is the need to sleep.
Food and water are an attention tax that can kill pace and are "just another thing" to remember. Sleep is thematically
more interesting as it interacts with money, exhaustion/player stats, and the time of day.

## Skills

**TL;DR**: Skills are totally player-determined, except the combat-related ones.

Skills are totally player-determined, except the combat-related ones in the section below.

I played around with flags as single facts about the player or other characters. This is important, but we want to
replace this system with a vector store so we can store facts about anything, any place, and anyone. For now, we just
rely on the context window.

### Combat

Combat is a non-AI tool call that does not have narrative elements. It is automatically resolved based on the player's
stats and equipment, and those of the enemy.

It performs all turns of a turn-based RNG combat system that simulates the fight. All combatants take turns in
initiative order based on their Speed stat. Heavy, Light, and/or Special attack stats are rolled against the target's
corresponding Defence stats with a chance to miss completely based on Speed.

- Speed determines turn order and the chance of attacks completely missing.
- Skill determines the damage dealt by physical attacks if they hit.
- Health determines the health of the combatant, who is downed at HP 0.
- Stamina determines stamina, going down by 1 each turn. Stamina comparisons can determine rolls with advantage or
  disadvantage. Stamina recovers to what it was before the fight started, win or lose, and is only recovered with rest.

There are no skills and spells. These are flavour. Keep track of them yourself.

## Lorebook

The lorebook is in-progress but is intended to be powered by a browser-based vector store over time.

This stores information about things that have happened, lore information, as well as historical context that is better
than summarisation.

## The SillyTavern Community

The SillyTavern community is a great source of inspiration. The work that people do on presets, extensions, and even
lorebooks is fantastic. I want to support these users as much as possible as well as ~~stealing~~ borrowing from their
great ideas and implementing them as a first-class feature in this engine when I like them enough.

Eventually, I'd like to expand modularity through more than just pull requests.
