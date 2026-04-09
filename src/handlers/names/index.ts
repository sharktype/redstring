import { FEMALE, MALE, type GenderIdentity } from "../../models/PlayerState";
import { pick } from "../../utils/random";
import { generateFantasyName } from "./fantasify";
import { generateIRLName, IRL_CULTURES, type IRLCulture } from "./irl";
import type { Name } from "./models";
import {
	generateRandomPhonemeName,
	PHONEME_CULTURES,
	PHONEME_SETS,
	type PhonemeCulture,
} from "./phonemes";

export const SUPPORTED_CULTURES = [
	...IRL_CULTURES,
	...PHONEME_CULTURES,
] as const;

export type Culture = (typeof SUPPORTED_CULTURES)[number];

export function generateRandomName(
	gender?: GenderIdentity,
	culture?: Culture | null,
	doFantasify = true,
): Name {
	const resolvedCulture =
		culture === undefined ? pick([...SUPPORTED_CULTURES]) : culture;
	const resolvedGender = gender ?? pick([FEMALE, MALE]);

	if (resolvedCulture !== null && resolvedCulture in PHONEME_SETS) {
		const randomPhonemeName = generateRandomPhonemeName(
			resolvedGender,
			resolvedCulture as PhonemeCulture,
		);

		if (doFantasify) {
			return generateFantasyName(randomPhonemeName, resolvedCulture);
		}
	}

	const randomRealName = generateIRLName(
		resolvedCulture as IRLCulture | null,
		resolvedGender,
	);

	if (doFantasify) {
		return generateFantasyName(randomRealName, resolvedCulture);
	}

	return randomRealName;
}
