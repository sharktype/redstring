interface NumericalStat {
	name: string;

	value: number;
	maxValue: number;
}

type DerivedNumericalStat = (
	stats: GameData["player"]["stats"],
) => NumericalStat;

export default interface GameData {
	player: {
		name: string;
		level: number;
		stats: {
			// It's worth noting that all NPCs have a status and character. They do not have derived stats etc.

			status: EntityStatus;
			character: Record<string, number>; // Analogous to "ability scores" in D&D.
			derived: Record<
				string,
				{
					base?: number;
					derive: DerivedNumericalStat;
					proficient?: boolean;
				}
			>;
			standalone: Record<string, number>;
			categorical: Record<string, string>;
		};
		inventory: {
			money: number;
			equipped: {
				armor: Record<string, ArmorPiece | null>;
			};
		};
	};
	environment: {
		date: {
			day: {
				number: number;
				maximum: number;
			};
			month: {
				number: number;
				maximum: number;
			};
			year: number;
			era: number;
		};
		time: {
			hour: number;
			minute: number;
		};
	};
	options: {
		dates: {
			days: string[];
			months: string[];
			eras: Record<number, string>;
		};
		systems: {
			measurement: "metric" | "imperial";
			currency: CurrencySystem;
		};
	};
}

interface EntityStatus {
	health: NumericalStat | DerivedNumericalStat;
	speed: NumericalStat | DerivedNumericalStat;
	capacity: NumericalStat | DerivedNumericalStat;

	// Represents natural armour without any equipment.
	armor: NumericalStat | DerivedNumericalStat;

	user: Record<string, NumericalStat | DerivedNumericalStat>;
}

interface CurrencySystem {
	type: "decimal" | "coinage";

	toShorthand: (amount: number) => string;
	toLonghand: (amount: number) => string;
}

interface DecimalCurrencySystem extends CurrencySystem {
	type: "decimal";
	name: string;
	prefix?: string;
	suffix?: string;
}

interface CoinageCurrencySystem extends CurrencySystem {
	type: "coinage";

	// We deliberately reduce complexity by enforcing that all coin values must be base 10 or base 100, and the
	// currency values are always generic: it is always gold, silver, copper, and iron. Base 10 means that 1 gold = 10
	// silver, and so on. Base 100 means that 1 gold = 100 silver, and so on. In a coinage system, the "money" variable
	// always indicates the amount of iron pieces held, and the representation is always the "ideal" situation where
	// 10 or 100 silver pieces automatically convert to 1 gold piece, for example.
	base: 10 | 100;
}

interface InventoryItem {
	weight: number;

	// E.g., you might want to add a limit to water skins or potions of healing.
	limit?: number;

	commerce: {
		// If value is not set and yet the item is tradeable, the game will determine a value based on the item's stats
		// and quality.

		value?: number;
		isTradable?: boolean;
	};
}

// Equipment: armour or weapons - are more similar in this system than perhaps some others. A weapon can add armour
// or stat bonuses, and a piece of armour can add damage, too. However, weapons are special in that they can act as a
// source of damage of a specific type on an attack action.

/**
 * Each armour type appears twice in each category here.
 *
 *
 */

interface EquipmentPiece extends InventoryItem {
	name: string;
	description?: string;
	quality: "common" | "uncommon" | "rare" | "epic" | "legendary";

	bonuses: Partial<GameData["player"]["stats"]["status"]>;

	// Numbers are percentages here. A value of 1.0 means "immune"/full block. A value of -1.0 means the piece is
	// weak against that damage type for double damage. Values above 1.0 indicate that the damage should heal the
	// entity instead of damaging them.
	defense: {
		slash: number;
		pierce: number;
		blunt: number;
		fire: number;
		cold: number;
		occult: number;
	};

	resistances: {
		bleed: number; // damage with movement; zero damage if not moving
		puncture: number; // reduces armor values
		concussion: number; // reduces attack accuracy
		burn: number; // damage over time
		freeze: number; // reduces speed
		decay: number; // reduces attack damage
	};

	durability: {
		current: number;
		maximum: number;

		isIrreparable?: boolean;

		// Indestructible means that once the durability reaches 0, the piece is unusable but can be repaired. The
		// alternative is that the piece is destroyed and removed from the inventory.
		isIndestructible?: boolean;

		// Infinite durability means that the piece cannot be damaged at all.
		isInfinite?: boolean;
	};

	// Hidden details are given to the LLM but not the player.
	hidden?: string;
}

// The combat system is always this rock-paper-scissors style. However, if you wish to have a grounded system, simply
// set all of the damage types to "physical", maybe "fire" for incendiary weapons.

interface WeaponPiece extends EquipmentPiece {
	damage: {};
}

interface ArmorPiece extends EquipmentPiece {
	// Note that the game system allows the user to define what locations there are; "whole body" and "helmet" are a
	// simple way to represent armour, but it's possible that a user might want more complexity.
	location: string;

	type: "robes" | "light" | "plate" | "mail";
}

interface ConsumableItem extends InventoryItem {
	name: string;
	description?: string;
	quality: "common" | "uncommon" | "rare" | "epic" | "legendary";

	// If undefined, the item can only be used once and is deleted when used. Any number above 9999 will indicate as
	// infinite uses and the system will should reduce the number of uses when the item is used.
	uses?: number;

	use: (gameData: GameData) => GameData;

	hidden?: string;

	// In Souls-like games, some consumables are replenished after resting at a bonfire.

	replenishment?: {
		isEnabled: boolean;

		// If the player "upgrades" their "flask" or whatever, this number goes up. The way you handle this is either
		// to take the old flask and give them a new one, or to change this value.
		amount: number;
	};
}
