import type { Appearance, BodyArt } from "../../models/PlayerState";
import {
	BUST_LABELS,
	COCK_SIZE_LABELS,
	HEIGHT_LABELS,
	HIPS_LABELS,
	SHOULDER_LABELS,
} from "./mappers/body";

export function buildCommonParts() {
	return ["no text", "portrait", "very aesthetic", "masterpiece"];
}

export function buildCommonAppearanceParts(
	appearance: Appearance,
	hasBody: boolean,
	nudity: "base" | "nude" = "base",
	isNsfw: boolean,
) {
	const parts: string[] = [];

	const species = appearance.species?.toLowerCase() || "human";
	if (species !== "human") {
		parts.push(species);
	}

	if (appearance.weight) {
		parts.push(`${appearance.weight} body weight`);
	}

	if (appearance.build && hasBody) {
		parts.push(`${appearance.build} body build`);
	}

	if (appearance.height && appearance.height !== "average" && hasBody) {
		parts.push(HEIGHT_LABELS[appearance.height] ?? appearance.height);
	}

	const genderExpression = appearance.genderExpression;
	const isMasculine =
		genderExpression === "masculine" || genderExpression === "androgynous";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	if (
		appearance.shoulders &&
		appearance.shoulders !== "average" &&
		isMasculine &&
		hasBody
	) {
		parts.push(SHOULDER_LABELS[appearance.shoulders] ?? appearance.shoulders);
	}

	if (appearance.bust && isFeminine && hasBody) {
		parts.push(BUST_LABELS[appearance.bust] ?? appearance.bust);
	}

	if (
		appearance.hips &&
		appearance.hips !== "average" &&
		isFeminine &&
		hasBody
	) {
		parts.push(HIPS_LABELS[appearance.hips] ?? appearance.hips);
	}

	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";

	if (isNsfw && hasPenis && appearance.cockSize && hasBody) {
		const penisType =
			appearance.genitals === "penisCircumcised" ? "circumcized" : "foreskin";

		parts.push(
			`has ${COCK_SIZE_LABELS[appearance.cockSize] ?? appearance.cockSize} ${penisType} penis`,
		);
	}

	if (
		isNsfw &&
		appearance.bodyHair &&
		appearance.bodyHair !== "none" &&
		hasBody
	) {
		parts.push(`${appearance.bodyHair} body hair`);
	}

	if (
		isNsfw &&
		appearance.genitalHair &&
		appearance.genitalHair !== "none" &&
		hasBody
	) {
		parts.push(`${appearance.genitalHair} pubic hair`);
	}

	if (appearance.eyeShape) {
		parts.push(`${appearance.eyeShape} eyes`);
	}

	if (appearance.eyeColour) {
		parts.push(`${appearance.eyeColour} eyes`);
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

	if (appearance.facialHair) {
		parts.push(`${appearance.facialHair} facial hair`);
	}

	if (isNsfw && nudity === "nude") {
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

	return parts;
}

export function buildBodyArtParts(
	appearance: Appearance,
	bodyArt: BodyArt,
	nudity?: string,
	isBody?: boolean,
	isNsfw?: boolean,
): string[] {
	const parts: string[] = [];

	const { tattoos, piercings } = bodyArt;

	if (tattoos?.face) {
		parts.push(`face tattoo: ${tattoos.face}`);
	}

	if (tattoos?.body && !isBody) {
		parts.push(`body tattoo: ${tattoos.body}`);
	}

	if (piercings) {
		if (piercings.ears) {
			parts.push(`ear piercings: ${piercings.ears}`);
		}

		if (piercings.septum) {
			parts.push(`septum piercing: ${piercings.septum}`);
		}

		if (piercings.face) {
			parts.push(`face piercing: ${piercings.face}`);
		}

		if (piercings.navel && nudity === "nude" && !isBody) {
			parts.push(`navel piercing: ${piercings.navel}`);
		}

		if (isNsfw && piercings.nipples && !isBody) {
			parts.push(`nipple piercings: ${piercings.nipples}`);
		}

		if (isNsfw && piercings.hood && nudity === "nude" && !isBody) {
			parts.push(`clitoral hood piercing: ${piercings.hood}`);
		}

		const hasPenis =
			appearance.genitals === "penisCircumcised" ||
			appearance.genitals === "penisUncircumcised";

		if (isNsfw && piercings.cock && nudity === "nude" && hasPenis && !isBody) {
			parts.push(`cock piercing: ${piercings.cock}`);
		}
	}

	return parts;
}
