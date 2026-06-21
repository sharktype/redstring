import type { Appearance, Portraits } from "../../../../../models/PlayerState";

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

export function buildImageGenPrompt(
	appearance: Appearance,
	portraitType: keyof Portraits = "base",
	isNsfw = true,
): string {
	const parts: string[] = [
		"no text",
		"portrait",
		"very aesthetic",
		"masterpiece",
	];

	const genderExpression = appearance.genderExpression;
	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";

	const species = appearance.species?.toLowerCase() || "human";
	if (species != "human") {
		parts.push(species);
	}

	if (genderExpression) {
		const isYoung = appearance.age != null && appearance.age < 25;

		if (genderExpression === "feminine") {
			if (hasPenis) {
				parts.push("1futanari");
			} else {
				parts.push(isYoung ? "1girl" : "1woman");
			}
		} else if (genderExpression === "masculine") {
			if (!hasPenis) {
				parts.push("1cuntboy");
			} else {
				parts.push(isYoung ? "1boy" : "1man");
			}
		} else {
			parts.push("1person");
		}
	}

	if (appearance.size && appearance.size !== "average") {
		parts.push(`${appearance.size} body size`);
	}

	if (appearance.build && appearance.build !== "average") {
		parts.push(`${appearance.build} body build`);
	}

	if (appearance.height && appearance.height !== "average") {
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

	if (appearance.bust && isFeminine) {
		parts.push(BUST_LABELS[appearance.bust] ?? appearance.bust);
	}

	if (appearance.hips && appearance.hips !== "average" && isFeminine) {
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

	if (isNsfw && hasPenis && appearance.cockSize) {
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

	return parts.join(", ");
}
