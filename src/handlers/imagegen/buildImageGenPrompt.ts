import type { Appearance, ProfileState } from "../../models/PlayerState";

const HEIGHT_LABELS: Record<string, string> = {
	veryShort: "very short",
	short: "short",
	belowAverage: "below average height",
	aboveAverage: "above average height",
	tall: "tall",
	veryTall: "very tall",
};

const SHOULDER_LABELS: Record<string, string> = {
	narrow: "narrow shoulders",
	broad: "broad shoulders",
};

const BUST_LABELS: Record<string, string> = {
	flat: "tiny flat chest",
	small: "small A-cup breasts",
	medium: "modest B-cup breasts",
	large: "big D-cup breasts",
	veryLarge: "huge F-cup breasts",
};

const HIPS_LABELS: Record<string, string> = {
	narrow: "narrow hips",
	wide: "wide hips",
};

const COCK_SIZE_LABELS: Record<string, string> = {
	verySmall: "very small",
	small: "small",
	large: "large",
	veryLarge: "very large",
};

export const PROFILE_EXPRESSIONS: Record<ProfileState, string> = {
	neutral: "normal (expression), neutral (emotion)",
	winded: "exhausted (expression), out of breath (emotion)",
	injured: "injured (expression), in pain, bruised, bloodied",
	horny: "horny (expression), aroused, blushing, lewd",
	ahegao: "ahegao (expression), horny, lewd, tongue out, rolled eyes, blushing",
	cumFacial: "cum on face, bukkake, facial",
	cumInMouth: "cum in mouth",
	cumEverywhere: "cum on face, cum in mouth, cum in hair, excessive cum",
};

export const PROFILE_STATE_LABELS: Record<ProfileState, string> = {
	neutral: "Neutral",
	winded: "Winded",
	injured: "Injured",
	horny: "Horny",
	ahegao: "Ahegao",
	cumFacial: "Cum Facial",
	cumInMouth: "Cum in Mouth",
	cumEverywhere: "Cum Everywhere",
};

export const PROFILE_STATE_EMOJIS: Record<ProfileState, string> = {
	neutral: "😐",
	winded: "😮‍💨",
	injured: "🤕",
	horny: "😳",
	ahegao: "😈",
	cumFacial: "💦",
	cumInMouth: "💦",
	cumEverywhere: "💦",
};

export const NSFW_STATES: ReadonlySet<ProfileState> = new Set([
	"horny",
	"ahegao",
	"cumFacial",
	"cumInMouth",
	"cumEverywhere",
]);

export function buildImageGenPrompt(
	appearance: Appearance,
	portraitType: "base" | "nude" = "base",
	isNsfw = true,
	state?: ProfileState,
): string {
	const parts: string[] = [
		"no text",
		"portrait",
		"very aesthetic",
		"masterpiece",
	];

	if (state) {
		parts.push("1headshot", "head-only", "closeup", "no background");
	}

	const genderExpression = appearance.genderExpression;
	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";

	const species = appearance.species?.toLowerCase() || "human";
	if (species !== "human") {
		parts.push(species);
	}

	if (genderExpression) {
		const isYoung = appearance.age != null && appearance.age < 50;

		if (genderExpression === "feminine") {
			if (!state && hasPenis) {
				parts.push("1futanari");
			} else {
				parts.push(isYoung ? "1girl" : "1woman");
			}
		} else if (genderExpression === "masculine") {
			if (!state && !hasPenis) {
				parts.push("1cuntboy");
			} else {
				parts.push(isYoung ? "1boy" : "1man");
			}
		} else {
			parts.push("1person");
		}
	}

	if (appearance.weight) {
		parts.push(`${appearance.weight} body weight`);
	}

	if (!state && appearance.build) {
		parts.push(`${appearance.build} body build`);
	}

	if (!state && appearance.height && appearance.height !== "average") {
		parts.push(HEIGHT_LABELS[appearance.height] ?? appearance.height);
	}

	const isMasculine =
		genderExpression === "masculine" || genderExpression === "androgynous";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	if (
		appearance.shoulders &&
		appearance.shoulders !== "average" &&
		isMasculine
	) {
		parts.push(SHOULDER_LABELS[appearance.shoulders] ?? appearance.shoulders);
	}

	if (appearance.facialHair && isMasculine) {
		parts.push(`${appearance.facialHair} facial hair`);
	}

	if (!state && appearance.bust && isFeminine) {
		parts.push(BUST_LABELS[appearance.bust] ?? appearance.bust);
	}

	if (
		!state &&
		appearance.hips &&
		appearance.hips !== "average" &&
		isFeminine
	) {
		parts.push(HIPS_LABELS[appearance.hips] ?? appearance.hips);
	}

	if (appearance.skinColour) {
		parts.push(`${appearance.skinColour} skin`);
	}

	if (appearance.complexion) {
		parts.push(`${appearance.complexion} complexion`);
	}

	if (appearance.hairStyle) {
		parts.push(`${appearance.hairStyle} hair`);
	}

	if (appearance.hairColour) {
		parts.push(`${appearance.hairColour} hair colour`);
	}

	if (isNsfw && !state && hasPenis && appearance.cockSize) {
		const penisType =
			appearance.genitals === "penisCircumcised" ? "circumcized" : "foreskin";

		parts.push(
			`has ${COCK_SIZE_LABELS[appearance.cockSize] ?? appearance.cockSize} ${penisType} penis`,
		);
	}

	if (isNsfw && portraitType === "nude") {
		parts.push("nude, completely naked, nsfw");
	} else if (appearance.clothingStyle) {
		parts.push(`wearing ${appearance.clothingStyle}`);
	}

	if (appearance.custom) {
		parts.push(appearance.custom);
	}

	if (appearance.generateExtra) {
		parts.push(appearance.generateExtra);
	}

	if (state) {
		parts.push(PROFILE_EXPRESSIONS[state]);
	}

	return parts.join(", ");
}
