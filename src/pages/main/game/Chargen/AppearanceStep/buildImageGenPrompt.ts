import type PlayerState from "../../../../../models/PlayerState";
import type { GenderExpression } from "../../../../../models/PlayerState";

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
	flat: "flat chest",
	small: "small bust",
	large: "large bust",
	veryLarge: "very large bust",
};

const HIPS_LABELS: Record<string, string> = {
	narrow: "narrow hips",
	wide: "wide hips",
};

const GENITALS_LABELS: Record<string, string> = {
	vulva: "vulva",
	penisCircumcised: "circumcised penis",
	penisUncircumcised: "uncircumcised penis",
	none: "no genitals",
};

const COCK_SIZE_LABELS: Record<string, string> = {
	verySmall: "very small",
	small: "small",
	large: "large",
	veryLarge: "very large",
};

export function buildImageGenPrompt(
	appearance: NonNullable<PlayerState["appearance"]>,
	genderExpression: GenderExpression | undefined,
): string {
	const parts: string[] = [];

	const species = appearance.species?.toLowerCase() || "human";
	if (species != "human") {
		parts.push(species);
	}

	if (genderExpression) {
		parts.push(genderExpression);
	}

	if (appearance.age != null) {
		parts.push(`${appearance.age} years old`);
	}

	if (appearance.size && appearance.size !== "average") {
		parts.push(`${appearance.size} size`);
	}

	if (appearance.build && appearance.build !== "average") {
		parts.push(`${appearance.build} build`);
	}

	if (appearance.height && appearance.height !== "average") {
		parts.push(HEIGHT_LABELS[appearance.height] ?? appearance.height);
	}

	if (appearance.shoulders && appearance.shoulders !== "average") {
		parts.push(SHOULDER_LABELS[appearance.shoulders] ?? appearance.shoulders);
	}

	if (appearance.facialHair) {
		parts.push(`${appearance.facialHair} facial hair`);
	}

	if (appearance.bust && appearance.bust !== "medium") {
		parts.push(BUST_LABELS[appearance.bust] ?? appearance.bust);
	}

	if (appearance.hips && appearance.hips !== "average") {
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

	if (appearance.genitals) {
		parts.push(GENITALS_LABELS[appearance.genitals] ?? appearance.genitals);
	}

	if (appearance.cockSize && appearance.cockSize !== "average") {
		parts.push(
			`${COCK_SIZE_LABELS[appearance.cockSize] ?? appearance.cockSize} penis`,
		);
	}

	if (appearance.clothingStyle) {
		parts.push(`wearing ${appearance.clothingStyle}`);
	}

	if (appearance.custom) {
		parts.push(appearance.custom);
	}

	return parts.join(", ");
}
