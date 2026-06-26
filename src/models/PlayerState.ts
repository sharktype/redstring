export default interface PlayerState {
	isInitialized?: boolean;

	name?: {
		given: string;
		surname: string;
	};

	gender?: GenderIdentity;
	appearance?: Appearance;
	expressions?: ProfileExpressions;
	portraits?: Portraits;
	bodyArt?: BodyArt;

	// TODO: Style should be in game state.

	style?: Style;

	stats?: {
		/**
		 * Free-form text describing any stats the user wants to track.
		 *
		 * Can be changed by tool calls.
		 */
		textual: string;
	};

	// TODO: Time is very much a world/game state, not player state.

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

// Portrait information uses base64 data URLs.

export interface Portraits {
	nude?: string;
	base?: string;

	profiles?: ProfileStates;
}

export interface ProfileVariant {
	base?: string;
	nude?: string;
}

export interface ProfileStates {
	neutral?: ProfileVariant;
	winded?: ProfileVariant;
	injured?: ProfileVariant;

	// NSFW only:

	horny?: ProfileVariant;
	ahegao?: ProfileVariant;
	cumFacial?: ProfileVariant;
	cumInMouth?: ProfileVariant;
	cumEverywhere?: ProfileVariant;
}

export const PROFILE_STATES = ["neutral", "winded", "injured"] as const;
export const NSFW_PROFILE_STATES = [
	"horny",
	"ahegao",
	"cumFacial",
	"cumInMouth",
	"cumEverywhere",
] as const;
export type ProfileState =
	| (typeof PROFILE_STATES)[number]
	| (typeof NSFW_PROFILE_STATES)[number];

export interface Appearance {
	age?: number;
	species?: string;
	genderExpression?: GenderExpression;

	weight?: "skinny" | "average" | "heavy";
	build?: "soft" | "average" | "toned" | "muscular";
	height?:
		| "veryShort"
		| "short"
		| "belowAverage"
		| "average"
		| "aboveAverage"
		| "tall"
		| "veryTall";
	eyeShape?: string;
	eyeColour?: string;
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
	bodyHair?: "none" | "light" | "moderate" | "heavy";
	genitalHair?: "none" | "light" | "moderate" | "heavy";
}

export interface Style {
	portraitStyle?: string;
	sceneStyle?: string;
}

export interface ProfileExpressions {
	neutral?: string;
	injured?: string;
	cum?: string;
}

/**
 * The appearance of gender based on physical characteristics rather than identity.
 */
export type GenderExpression = "feminine" | "masculine" | "androgynous";

export interface BodyArt {
	tattoos?: {
		face?: string;
		body?: string;
	};
	piercings?: {
		// SFW
		ears?: string;
		septum?: string;
		face?: string;
		navel?: string;
		// NSFW
		nipples?: string;
		hood?: string;
		cock?: string;
	};
	makeup?: {
		eyes?: string;
		lips?: string;
		cheeks?: string;
	};
}

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
