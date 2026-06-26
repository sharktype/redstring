import type {
	Appearance,
	BodyArt,
	ProfileVariant,
	Style,
} from "../../models/PlayerState";
import {
	type SceneActor,
	SEX_ROLES,
	type SexRole,
} from "../../pages/main/game/Chargen/ProfileStep/types";
import {
	buildBodyArtParts,
	buildCommonAppearanceParts,
	buildCommonParts,
} from "./common";

export default function buildScenePrompt(
	appearance: Appearance,
	nudity: keyof ProfileVariant,
	scenePrompt: string,
	actors?: SceneActor[],
	isNsfw = true,
	bodyArt?: BodyArt,
	style?: Style,
): string {
	const parts: string[] = buildCommonParts();

	parts.push(scenePrompt);

	if (style?.sceneStyle) {
		parts.push(`${style.sceneStyle}`);
	}

	const genderExpression = appearance.genderExpression;
	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";

	const actorSexRoleCounts: Record<SexRole, number> = {
		girl: 0,
		boy: 0,
		woman: 0,
		man: 0,
		futanari: 0,
		cuntboy: 0,
		person: 0,
	};

	// Begin with default actor:

	if (genderExpression) {
		const isYoung = appearance.age != null && appearance.age < 50;

		if (genderExpression === "feminine") {
			if (hasPenis) {
				actorSexRoleCounts.futanari++;
			} else if (isYoung) {
				actorSexRoleCounts.girl++;
			} else {
				actorSexRoleCounts.woman++;
			}
		} else if (genderExpression === "masculine") {
			if (!hasPenis) {
				actorSexRoleCounts.cuntboy++;
			} else if (isYoung) {
				actorSexRoleCounts.boy++;
			} else {
				actorSexRoleCounts.man++;
			}
		} else {
			actorSexRoleCounts.person++;
		}
	}

	actors?.forEach((actor) => {
		actorSexRoleCounts[actor.sexRole]++;
	});

	SEX_ROLES.forEach((role) => {
		if (actorSexRoleCounts[role]) {
			parts.push(
				`${actorSexRoleCounts[role]}${role}${actorSexRoleCounts[role] > 1 ? "s" : ""}`,
			);
		}
	});

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
