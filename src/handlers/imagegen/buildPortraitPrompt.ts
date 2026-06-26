import type {
	Appearance,
	BodyArt,
	ProfileVariant,
	Style,
} from "../../models/PlayerState";
import {
	buildBodyArtParts,
	buildCommonAppearanceParts,
	buildCommonParts,
} from "./common";

export default function buildPortraitPrompt(
	appearance: Appearance,
	nudity: keyof ProfileVariant,
	isNsfw = true,
	bodyArt?: BodyArt,
	style?: Style,
): string {
	const parts: string[] = buildCommonParts();

	parts.push("head to thigh", "no background");

	if (style?.portraitStyle) {
		parts.push(style.portraitStyle);
	}

	const genderExpression = appearance.genderExpression;
	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";

	if (genderExpression) {
		const isYoung = appearance.age != null && appearance.age < 50;

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

	if (isNsfw && nudity === "nude") {
		parts.push("nude, completely naked, nsfw");
	} else if (appearance.clothingStyle) {
		parts.push(`wearing ${appearance.clothingStyle}`);
	}

	parts.push(...buildCommonAppearanceParts(appearance, true, nudity, isNsfw));

	if (bodyArt) {
		parts.push(...buildBodyArtParts(appearance, bodyArt, nudity, true, isNsfw));
	}

	return parts.join(", ");
}
