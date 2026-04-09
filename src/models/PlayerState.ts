import type Item from "./Item";
import type { Building, Region } from "./Location";

export default interface PlayerState {
	isInitialized?: boolean;

	name?: {
		given: string;
		surname: string;
	};

	// TODO: Support custom gender identities.

	gender?: GenderIdentity;

	stats?: {
		/**
		 * Free-form text describing any stats the user wants to track.
		 *
		 * Can be changed by tool calls.
		 */
		textual: string;
	};

	time?: {
		// Hour and minute are always maximum 24 and 60 regardless of the setting.

		hour: number;
		minute: number;
	};

	// The location is accessed very frequently but player state is only updated when the player moves. As a result,
	// we should denormalise here even though we store both the location and the total locations in the database.

	location?: {
		region: Region;

		/**
		 * If the player is in transit, this will be the region to which they are going.
		 */
		transitRegion?: Region;

		/**
		 * The distance the player has traveled towards the transit region.
		 */
		transitDistance?: number;

		/**
		 * In metres, but will be multiplied by the game state's scale.
		 */
		transitTotalDistance?: number;

		/** The building the player is in. If this is null, they are in an exterior cell. */
		building: Building | null;
	};

	money?: number;
	inventory?: { item: Item; quantity: number }[];

	move(locationId: number): boolean;
	enter(buildingSlug: string): boolean;
	exit(): boolean;
}

export type StoredPlayerState = Omit<PlayerState, "move" | "enter" | "exit"> & {
	id?: number;
};

export interface GenderIdentity {
	/**
	 * E.g., "non-binary"
	 */
	identity: string;
	pronouns: {
		/**
		 * E.g., "they"
		 */
		subject: string;
		/**
		 * E.g., "them"
		 */
		object: string;
		/**
		 * E.g., "their"
		 */
		possessiveAdjective: string;
		/**
		 * E.g., "theirs"
		 */
		possessivePronoun: string;
		/**
		 * E.g., "themself" or "themselves"
		 */
		reflexive: string;
	};
}

export const FEMALE: GenderIdentity = {
	identity: "female",
	pronouns: {
		subject: "she",
		object: "her",
		possessiveAdjective: "her",
		possessivePronoun: "hers",
		reflexive: "herself",
	},
};

export const MALE: GenderIdentity = {
	identity: "male",
	pronouns: {
		subject: "he",
		object: "him",
		possessiveAdjective: "his",
		possessivePronoun: "his",
		reflexive: "himself",
	},
};

export const DEFAULT_GENDER_IDENTITIES: GenderIdentity[] = [
	FEMALE,
	MALE,
	{
		identity: "non-binary",
		pronouns: {
			subject: "they",
			object: "them",
			possessiveAdjective: "their",
			possessivePronoun: "theirs",
			reflexive: "themself",
		},
	},
];
