import type Item from "./Item";

export default interface PlayerState {
	isInitialized?: boolean;

	name?: {
		given: string;
		surname: string;
	};

	// TODO: Support custom gender identities.

	gender?: GenderIdentity;

	genderExpression?: GenderExpression;

	/** Base64 data URLs for each portrait variant. */
	portraits?: {
		nude?: string;
		base?: string;
	};

	appearance?: {
		age?: number;
		species?: string;
		size?: "slight" | "average" | "large";
		build?: "soft" | "average" | "toned" | "muscular";
		height?:
			| "veryShort"
			| "short"
			| "belowAverage"
			| "average"
			| "aboveAverage"
			| "tall"
			| "veryTall";
		shoulders?: "narrow" | "average" | "broad";
		bust?: "flat" | "small" | "medium" | "large" | "veryLarge";
		hips?: "narrow" | "average" | "wide";
		skinColour?: string;
		complexion?: string;
		hairStyle?: string;
		hairColour?: string;
		facialHair?: string;
		clothingStyle?: string;
		custom?: string;
		generateExtra?: string;

		// NSFW:

		genitals?: "vulva" | "penisCircumcised" | "penisUncircumcised" | "none";
		cockSize?: "verySmall" | "small" | "average" | "large" | "veryLarge";
	};

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

	money?: number;
	inventory?: { item: Item; quantity: number }[];
}

export type StoredPlayerState = PlayerState & {
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

/**
 * The appearance of gender based on physical characteristics rather than identity.
 */
export type GenderExpression = "feminine" | "masculine" | "androgynous";

export type PortraitType = keyof NonNullable<PlayerState["portraits"]>;
