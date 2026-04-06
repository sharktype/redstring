import { FEMALE, MALE, type GenderIdentity } from "../../models/PlayerState";
import { pick } from "../../utils/random";

import angloGivenFemaleRaw from "./data/anglo_given_female.txt?raw";
import angloGivenMaleRaw from "./data/anglo_given_male.txt?raw";
import angloSurnamesRaw from "./data/anglo_surnames.txt?raw";
import frenchGivenFemaleRaw from "./data/french_given_female.txt?raw";
import frenchGivenMaleRaw from "./data/french_given_male.txt?raw";
import frenchSurnamesRaw from "./data/french_surnames.txt?raw";
import germanGivenFemaleRaw from "./data/german_given_female.txt?raw";
import germanGivenMaleRaw from "./data/german_given_male.txt?raw";
import germanSurnamesRaw from "./data/german_surnames.txt?raw";
import hanGivenFemaleRaw from "./data/han_given_female.txt?raw";
import hanGivenMaleRaw from "./data/han_given_male.txt?raw";
import hanSurnamesRaw from "./data/han_surnames.txt?raw";
import japaneseGivenFemaleRaw from "./data/japanese_given_female.txt?raw";
import japaneseGivenMaleRaw from "./data/japanese_given_male.txt?raw";
import japaneseSurnamesRaw from "./data/japanese_surnames.txt?raw";

function lines(raw: string): string[] {
	return raw
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export const SUPPORTED_CULTURES = [
	"anglo",
	"franco",
	"germanic",
	"yamato",
	"han",
] as const;

export type Culture = (typeof SUPPORTED_CULTURES)[number];

const NAME_DATA: Record<
	Culture,
	{ givenMale: string[]; givenFemale: string[]; surnames: string[] }
> = {
	anglo: {
		givenMale: lines(angloGivenMaleRaw),
		givenFemale: lines(angloGivenFemaleRaw),
		surnames: lines(angloSurnamesRaw),
	},
	franco: {
		givenMale: lines(frenchGivenMaleRaw),
		givenFemale: lines(frenchGivenFemaleRaw),
		surnames: lines(frenchSurnamesRaw),
	},
	germanic: {
		givenMale: lines(germanGivenMaleRaw),
		givenFemale: lines(germanGivenFemaleRaw),
		surnames: lines(germanSurnamesRaw),
	},
	yamato: {
		givenMale: lines(japaneseGivenMaleRaw),
		givenFemale: lines(japaneseGivenFemaleRaw),
		surnames: lines(japaneseSurnamesRaw),
	},
	han: {
		givenMale: lines(hanGivenMaleRaw),
		givenFemale: lines(hanGivenFemaleRaw),
		surnames: lines(hanSurnamesRaw),
	},
};

// TODO: Russian surnames are gendered. The algorithm won't work for Russian names until we implement that.
// TODO: Other difficult ones are Burmese, Khmer, Thai, Tibetan, Amharic, Ghanaian, and many more. For now, we will
//       stick to a small group. In the process of doing this, data looks weird for Arabic and Hindi - we'll need
//       to do some work for those to source a more accurate list of names (with vowels and no junk data).

export function generateRandomName(
	gender?: GenderIdentity,
	culture?: Culture | null,
): {
	givenName: string;
	surname: string;
	gender: GenderIdentity;
} {
	const chosenCulture =
		culture === undefined ? pick([...SUPPORTED_CULTURES]) : culture;

	// Allow culture mixing in the pool if culture is explicitly null and not undefined.

	const nameData =
		chosenCulture !== null
			? NAME_DATA[chosenCulture]
			: {
					givenMale: Object.values(NAME_DATA).flatMap((d) => d.givenMale),
					givenFemale: Object.values(NAME_DATA).flatMap((d) => d.givenFemale),
					surnames: Object.values(NAME_DATA).flatMap((d) => d.surnames),
				};

	const resolvedGender = gender ?? pick([FEMALE, MALE]);

	const isMaleOrFemale =
		resolvedGender.identity === MALE.identity ||
		resolvedGender.identity === FEMALE.identity;
	const givenPool = !isMaleOrFemale
		? [...nameData.givenMale, ...nameData.givenFemale]
		: resolvedGender.identity === FEMALE.identity
			? nameData.givenFemale
			: nameData.givenMale;

	const givenName = pick(givenPool);
	const surname = pick(nameData.surnames);

	return { givenName, surname, gender: resolvedGender };
}
