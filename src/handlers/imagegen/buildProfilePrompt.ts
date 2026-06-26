import type {
	Appearance,
	BodyArt,
	ProfileExpressions,
	ProfileState,
	Style,
} from "../../models/PlayerState";
import {
	buildBodyArtParts,
	buildCommonAppearanceParts,
	buildCommonParts,
} from "./common";
import { PROFILE_EXPRESSIONS } from "./mappers/profile";

export default function buildProfilePrompt(
	appearance: Appearance,
	state: ProfileState,
	nudity: "base" | "nude" = "base",
	bodyArt?: BodyArt,
	expressions?: ProfileExpressions,
	style?: Style,
): string {
	const parts: string[] = buildCommonParts();

	parts.push("1headshot", "head-only", "closeup", "no background");
	parts.push(PROFILE_EXPRESSIONS[state]);

	const expressionOverride = expressionForState(state, expressions);
	if (expressionOverride) {
		parts.push(expressionOverride);
	}

	if (style?.portraitStyle) {
		parts.push(style.portraitStyle);
	}

	const genderExpression = appearance.genderExpression;
	if (genderExpression) {
		const isYoung = appearance.age != null && appearance.age < 50;

		if (genderExpression === "feminine") {
			parts.push(isYoung ? "1girl" : "1woman");
		} else if (genderExpression === "masculine") {
			parts.push(isYoung ? "1boy" : "1man");
		} else {
			parts.push("1person");
		}
	}

	parts.push(...buildCommonAppearanceParts(appearance, false, nudity));

	if (bodyArt) {
		parts.push(...buildBodyArtParts(appearance, bodyArt, nudity, false));
	}

	return parts.join(", ");
}

function expressionForState(
	state: ProfileState,
	expressions?: ProfileExpressions,
): string | undefined {
	if (!expressions) {
		return undefined;
	}

	if (state === "neutral") {
		return expressions.neutral || undefined;
	}

	if (state === "injured") {
		return expressions.injured || undefined;
	}

	if (
		state === "cumFacial" ||
		state === "cumInMouth" ||
		state === "cumEverywhere"
	) {
		return expressions.cum || undefined;
	}

	return undefined;
}
