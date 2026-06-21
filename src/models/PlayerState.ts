export default interface PlayerState {
	isInitialized?: boolean;

	name?: {
		given: string;
		surname: string;
	};

	gender?: GenderIdentity;
	appearance?: Appearance;
	portraits?: Portraits;

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
}

export type StoredPlayerState = PlayerState & {
	id?: number;
};

/** Base64 data URLs for each portrait variant. */
export interface Portraits {
	nude?: string;
	base?: string;
}

export interface Appearance {
	age?: number;
	species?: string;
	genderExpression?: GenderExpression;

	size?: "small" | "average" | "large";
	build?: "soft" | "average" | "toned" | "muscular";
	height?:
		| "veryShort"
		| "short"
		| "belowAverage"
		| "average"
		| "aboveAverage"
		| "tall"
		| "veryTall";
	skinColour?: string;
	complexion?: string;
	hairStyle?: string;
	hairColour?: string;
	clothingStyle?: string;

	shoulders?: "narrow" | "average" | "broad";
	facialHair?: string;

	bust?: "flat" | "small" | "medium" | "large" | "veryLarge";
	hips?: "narrow" | "average" | "wide";

	custom?: string;
	generateExtra?: string;

	// NSFW:

	genitals?: "vulva" | "penisCircumcised" | "penisUncircumcised" | "none";
	cockSize?: "verySmall" | "small" | "average" | "large" | "veryLarge";
}

/**
 * The appearance of gender based on physical characteristics rather than identity.
 */
export type GenderExpression = "feminine" | "masculine" | "androgynous";

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
