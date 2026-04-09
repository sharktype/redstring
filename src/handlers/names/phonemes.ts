import { FEMALE, MALE, type GenderIdentity } from "../../models/PlayerState";
import { pick } from "../../utils/random";
import type { Name } from "./models";

export const PHONEME_CULTURES = [
	"phonemes",
	"elvish",
	"khuzdul",
	"orkind",
	"fae",
] as const;

export type PhonemeCulture = (typeof PHONEME_CULTURES)[number];

interface PhonemeSet {
	onsets: string[];
	nuclei: string[];
	medialCodas: string[];

	maleEndings: string[];
	femaleEndings: string[];
	neutralEndings: string[];
}

export const PHONEME_SETS: Record<PhonemeCulture, PhonemeSet> = {
	phonemes: {
		onsets: [
			"",
			"",
			"b",
			"d",
			"f",
			"g",
			"h",
			"j",
			"k",
			"l",
			"m",
			"n",
			"p",
			"r",
			"s",
			"sh",
			"t",
			"th",
			"v",
			"w",
			"br",
			"ch",
			"cr",
			"dr",
			"fl",
			"fr",
			"gr",
			"pr",
			"st",
			"tr",
		],
		nuclei: ["a", "e", "i", "o", "u", "ai", "ei", "ou"],
		medialCodas: ["", "", "", "", "l", "n", "r", "s"],
		maleEndings: [
			"d",
			"k",
			"l",
			"m",
			"n",
			"nd",
			"r",
			"rd",
			"rn",
			"s",
			"st",
			"t",
			"th",
			"x",
		],
		femaleEndings: [
			"a",
			"e",
			"i",
			"ia",
			"ra",
			"na",
			"la",
			"ne",
			"le",
			"sa",
			"ya",
		],
		neutralEndings: ["l", "n", "r", "a", "e", "i", "o"],
	},
	elvish: {
		onsets: [
			"",
			"",
			"l",
			"n",
			"r",
			"s",
			"th",
			"f",
			"v",
			"m",
			"gl",
			"al",
			"el",
			"an",
			"w",
			"y",
			"sh",
			"si",
		],
		nuclei: ["a", "e", "i", "o", "ae", "ai", "ei", "ia", "ie", "ea", "ue"],
		medialCodas: ["", "", "l", "n", "r", "nd", "th"],
		maleEndings: ["l", "n", "r", "s", "nd", "las", "ren", "mir", "ion", "or"],
		femaleEndings: [
			"a",
			"e",
			"ia",
			"iel",
			"wen",
			"ara",
			"ala",
			"na",
			"riel",
			"ya",
		],
		neutralEndings: ["el", "en", "il", "al", "ar", "an"],
	},
	fae: {
		onsets: [
			"",
			"",
			"",
			"f",
			"l",
			"n",
			"p",
			"t",
			"w",
			"y",
			"fl",
			"tw",
			"ph",
			"br",
			"sp",
		],
		nuclei: ["a", "e", "i", "o", "u", "ee", "ie", "ay", "oo", "ae"],
		medialCodas: ["", "", "", "l", "n"],
		maleEndings: ["n", "l", "x", "p", "s", "ck", "ll"],
		femaleEndings: ["a", "e", "i", "ie", "ia", "ey", "li", "ny"],
		neutralEndings: ["l", "n", "a", "i", "e"],
	},
	khuzdul: {
		onsets: [
			"",
			"b",
			"d",
			"g",
			"k",
			"t",
			"z",
			"th",
			"kh",
			"gr",
			"dr",
			"br",
			"kr",
			"dz",
			"gl",
			"gm",
			"n",
		],
		nuclei: ["a", "u", "o", "i", "e", "ur", "ul", "az", "un"],
		medialCodas: ["", "r", "l", "z", "n", "m", "rk", "lk"],
		maleEndings: [
			"k",
			"r",
			"d",
			"m",
			"n",
			"rk",
			"rd",
			"grim",
			"dur",
			"rik",
			"mund",
		],
		femaleEndings: ["a", "i", "ra", "da", "ka", "ri", "di", "na"],
		neutralEndings: ["r", "k", "n", "m", "ul", "az"],
	},
	orkind: {
		onsets: [
			"",
			"g",
			"gr",
			"kr",
			"k",
			"z",
			"zh",
			"b",
			"d",
			"dr",
			"n",
			"r",
			"sk",
			"sh",
			"t",
			"thr",
			"m",
			"gn",
		],
		nuclei: ["a", "u", "o", "ug", "ur", "ag", "og", "uk", "ash"],
		medialCodas: ["", "g", "k", "r", "z", "rg", "rk"],
		maleEndings: [
			"g",
			"k",
			"rg",
			"zg",
			"th",
			"rk",
			"gul",
			"bur",
			"nash",
			"rok",
		],
		femaleEndings: ["a", "ga", "ra", "sha", "ka", "za", "gra"],
		neutralEndings: ["g", "k", "r", "z", "uk", "og"],
	},
};

export function generatePhonemes(
	length: number,
	ending: "male" | "female" | "neutral",
	set: PhonemeSet,
): string {
	const parts: string[] = [];

	for (let i = 0; i < length; i++) {
		const onset = pick(set.onsets);
		const nucleus = pick(set.nuclei);
		const coda = i < length - 1 ? pick(set.medialCodas) : "";

		parts.push(onset + nucleus + coda);
	}

	const endings =
		ending === "female"
			? set.femaleEndings
			: ending === "male"
				? set.maleEndings
				: set.neutralEndings;

	parts.push(pick(endings));

	const name = parts.join("");

	return name.charAt(0).toUpperCase() + name.slice(1);
}

export function generateRandomPhonemeName(
	gender: GenderIdentity,
	culture: PhonemeCulture,
): Name {
	const phonemeSet = PHONEME_SETS[culture];

	const givenLength = pick([1, 1, 2, 2, 2, 3]);
	const surnameLength = pick([1, 1, 2, 2, 3, 3]);

	const isFemale = gender.identity === FEMALE.identity;
	const isMale = gender.identity === MALE.identity;
	const givenEnding = isFemale ? "female" : isMale ? "male" : "neutral";

	return {
		givenName: generatePhonemes(givenLength, givenEnding, phonemeSet),
		surname: generatePhonemes(surnameLength, "neutral", phonemeSet),
		gender,
	};
}
