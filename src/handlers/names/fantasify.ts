import { pick } from "../../utils/random";
import {
	hasTripleConsonant,
	levenshtein,
	stripDiacritics,
} from "../../utils/strings";
import type { Name } from "./models";

const EUROPEAN_VOWEL_SHIFT = makeVowelShift({
	a: ["ah", "â", "ae"],
	e: ["eh", "ë", "ei"],
	i: ["ï", "y", "ih"],
	o: ["ö", "ow", "oa"],
	u: ["ü", "û", "uh"],
});

const EUROPEAN_CONSONANT_DOUBLE = makeConsonantDouble(
	new Set(["t", "s", "n", "l", "r", "b", "d", "f", "m", "p"]),
);

const EUROPEAN_ARCHAIC_ENDING = makeEnding([
	["eld", ["eldt", "ëld"]],
	["er", ["ir", "ér", "eir"]],
	["en", ["enn", "enne", "ehn"]],
	["an", ["ahn", "ann"]],
	["on", ["onn", "ön"]],
	["by", ["brey", "bry"]],
	["ny", ["gne", "nié"]],
	["da", ["dra", "dah"]],
	["ka", ["kah", "ka"]],
	["na", ["nah", "nae"]],
	["li", ["lï", "lei"]],
	["ng", ["nne", "nng"]],
]);

const EUROPEAN_SYLLABLE_EXTEND = makeSyllableExtend([
	"an",
	"is",
	"en",
	"or",
	"ra",
	"th",
]);

const EUROPEAN_TRANSFORMS = [
	EUROPEAN_VOWEL_SHIFT,
	EUROPEAN_CONSONANT_DOUBLE,
	EUROPEAN_ARCHAIC_ENDING,
	EUROPEAN_SYLLABLE_EXTEND,
];

const ARABIC_VOWEL_SHIFT = makeVowelShift({
	a: ["aa", "'a", "ah"],
	e: ["ei", "ee", "eh"],
	i: ["ii", "iy", "ee"],
	o: ["ou", "oo", "aw"],
	u: ["uu", "uw", "ou"],
});

const ARABIC_CONSONANT_DOUBLE = makeConsonantDouble(
	new Set(["d", "l", "m", "n", "r", "s", "t", "b", "f", "k"]),
);

const ARABIC_ENDING = makeEnding([
	["iah", ["iyyah", "iyah"]],
	["ah", ["a", "iyyah"]],
	["ad", ["aad", "adi"]],
	["id", ["iid", "idi"]],
	["im", ["iim", "eem"]],
	["ir", ["iir", "eer"]],
	["am", ["aam", "ami"]],
	["in", ["iin", "een"]],
	["ud", ["uud", "udi"]],
	["ar", ["aar", "ari"]],
	["al", ["aal", "ali"]],
	["an", ["aan", "ani"]],
	["il", ["iil", "eel"]],
]);

const ARABIC_SYLLABLE_EXTEND = makeSyllableExtend([
	"i",
	"iya",
	"din",
	"a",
	"ah",
	"ud",
]);

const ARABIC_TRANSFORMS = [
	ARABIC_VOWEL_SHIFT,
	ARABIC_CONSONANT_DOUBLE,
	ARABIC_ENDING,
	ARABIC_SYLLABLE_EXTEND,
];

const EUROPEAN_PARTICLES: Particle[] = [
	{ text: "d'", join: "" },
	{ text: "vel'", join: "" },
	{ text: "ter", join: " " },
	{ text: "al", join: "-" },
	{ text: "von", join: " " },
	{ text: "na", join: " " },
];

const ARABIC_PARTICLES: Particle[] = [
	{ text: "ibn", join: " " },
	{ text: "bin", join: " " },
	{ text: "abu", join: " " },
	{ text: "al-", join: "" },
	{ text: "abd al-", join: "" },
];

const IRL_CULTURE_TO_TRANSFORMS: Record<string, string> = {
	Afghan: "arabic",
	"Arabic (Gulf)": "arabic",
	"Arabic (Levantine)": "arabic",
	"Arabic (Maghrebi)": "arabic",
	Iranian: "arabic",
};

const CULTURE_TRANSFORMS: Record<string, CultureTransforms> = {
	arabic: {
		transforms: ARABIC_TRANSFORMS,
		particles: ARABIC_PARTICLES,
		fallbackVowelShift: ARABIC_VOWEL_SHIFT,
	},
	european: {
		transforms: EUROPEAN_TRANSFORMS,
		particles: EUROPEAN_PARTICLES,
		fallbackVowelShift: EUROPEAN_VOWEL_SHIFT,
	},
};

const SYLLABLE_EXTEND_MAX_LENGTH = 8;

const FANTASIFY_MAX_ATTEMPTS = 8;

interface Particle {
	text: string;
	join: string;
}

interface CultureTransforms {
	particles: Particle[];

	transforms: ((word: string) => string)[];
	fallbackVowelShift: (word: string) => string;
}

/**
 * @param vowelsToReplacements {string: string[]} a mapping of lowercase vowel characters to possible replacements
 * @returns a transform that randomly replaces one vowel with a culture-flavored variant
 */
function makeVowelShift(vowelsToReplacements: Record<string, string[]>) {
	return (word: string): string => {
		const positions: number[] = [];

		for (let i = 0; i < word.length; i++) {
			if (word[i].toLowerCase() in vowelsToReplacements) {
				positions.push(i);
			}
		}

		if (positions.length === 0) {
			return word;
		}

		const position = pick(positions);
		const original = word[position].toLowerCase();
		const replacement = pick(vowelsToReplacements[original]);

		return word.slice(0, position) + replacement + word.slice(position + 1);
	};
}

/**
 * @param doubleable {Set<string>} the set of lowercase consonant characters that are eligible for doubling
 * @returns a transform that randomly doubles an eligible consonant.
 */
function makeConsonantDouble(doubleable: Set<string>) {
	return (word: string): string => {
		const positions: number[] = [];
		for (let i = 1; i < word.length; i++) {
			const ch = word[i].toLowerCase();
			if (!doubleable.has(ch)) {
				continue;
			}
			if (word[i - 1].toLowerCase() === ch) {
				continue;
			}
			if (i + 1 < word.length && word[i + 1].toLowerCase() === ch) {
				continue;
			}
			positions.push(i);
		}

		if (positions.length === 0) {
			return word;
		}

		const position = pick(positions);

		return word.slice(0, position) + word[position] + word.slice(position);
	};
}

/**
 * @param endingMap {[string, string[]][]} a mapping of word endings to possible replacements
 * @returns a transform that replaces word endings with fantasy-style variants
 */
function makeEnding(endingMap: [string, string[]][]) {
	const sortedEndingMap = [...endingMap].sort(
		(a, b) => b[0].length - a[0].length,
	);

	return (word: string): string => {
		const wordLower = word.toLowerCase();

		for (const [ending, replacements] of sortedEndingMap) {
			if (wordLower.endsWith(ending)) {
				const replacement = pick(replacements);

				return word.slice(0, word.length - ending.length) + replacement;
			}
		}

		return word;
	};
}

/**
 * @param extensions {string[]} a list of syllables that can be appended to the end of short words to fantasify them
 * @returns a transform that appends a syllable to short words
 */
function makeSyllableExtend(extensions: string[]) {
	return (word: string): string => {
		if (word.length > SYLLABLE_EXTEND_MAX_LENGTH) {
			return word;
		}

		const suffix = pick(extensions);

		if (word[word.length - 1].toLowerCase() === suffix[0].toLowerCase()) {
			return word + suffix.slice(1);
		}

		return word + suffix;
	};
}

/**
 * @param parts {string[]} the name parts to modify
 * @returns {string[]} the modified name parts in a combined form if any were merged
 */
function mergeDouble(parts: string[]): string[] {
	const result = [...parts];

	for (let i = 0; i < result.length - 1; i++) {
		if (result[i].toLowerCase() !== result[i + 1].toLowerCase()) {
			continue;
		}

		let merged = result[i] + result[i + 1].toLowerCase();

		if (Math.random() < 0.5) {
			const mergePos = result[i].length;

			merged = merged.slice(0, mergePos - 1) + "ï" + merged.slice(mergePos);
		}

		result.splice(i, 2, merged);

		break;
	}

	return result;
}

/**
 * Inserts a cultural name particle (e.g. "von", "al-") before the surname.
 *
 * @param parts {string[]} the name parts to modify
 * @param particles {Particle[]} the particles to choose from
 * @returns {string[]} the modified name parts
 */
function insertParticle(parts: string[], particles: Particle[]): string[] {
	if (parts.length < 2) {
		return parts;
	}

	const particle = pick(particles);
	const result = [...parts];
	const surname = result[result.length - 1];

	if (particle.join === "") {
		result[result.length - 1] = particle.text + surname;
	} else if (particle.join === "-") {
		result.splice(result.length - 1, 0, particle.text);
		result[result.length - 2] = result[result.length - 2] + "-";
	} else {
		result.splice(result.length - 1, 0, particle.text);
	}

	return result;
}

function isValidFantasyName(original: string, fantasy: string): boolean {
	if (hasTripleConsonant(fantasy)) {
		return false;
	}

	const normalizedOriginal = stripDiacritics(original).toLowerCase();
	const normalizedFantasy = stripDiacritics(fantasy).toLowerCase();

	if (normalizedOriginal === normalizedFantasy) {
		return false;
	}

	const maxDist = Math.max(3, Math.floor(original.length * 0.35));
	if (levenshtein(normalizedOriginal, normalizedFantasy) > maxDist) {
		return false;
	}

	for (const part of fantasy.split(/[\s\-']+/)) {
		if (stripDiacritics(part).length > 10) {
			return false;
		}
	}

	return true;
}

function getCultureTransforms(culture?: string | null): CultureTransforms {
	if (culture) {
		const key = IRL_CULTURE_TO_TRANSFORMS[culture] ?? culture;

		if (key in CULTURE_TRANSFORMS) {
			return CULTURE_TRANSFORMS[key]!;
		}
	}

	// For better or for worse, the default is European-style transforms since they're more familiar to most players.

	return CULTURE_TRANSFORMS["european"];
}

/**
 * The main fantasification function, which applies 1-2 random transforms to random name parts, optionally adding a
 * cultural particle.
 *
 * @param name {string} the original name to fantasify
 * @param config {CultureTransforms} the cultural transformation configuration
 * @returns {string} the fantasified name
 */
function fantasify(name: string, config: CultureTransforms): string {
	const parts = name.split(" ");

	const numberToModify = Math.max(
		1,
		Math.floor(Math.random() * Math.max(1, parts.length - 1)) + 1,
	);
	const indices = [...Array(parts.length).keys()];
	const toModify = new Set<number>();

	while (toModify.size < numberToModify && indices.length > 0) {
		const index = Math.floor(Math.random() * indices.length);

		toModify.add(indices[index]);
		indices.splice(index, 1);
	}

	toModify.forEach((index) => {
		const numTransforms = Math.random() < 0.5 ? 1 : 2;
		const shuffled = [...config.transforms].sort(() => Math.random() - 0.5);
		const transforms = shuffled.slice(0, numTransforms);

		transforms.forEach((transform) => {
			parts[index] = transform(parts[index]);
		});
	});

	if (Math.random() < 0.25) {
		const withParticle = insertParticle(parts, config.particles);

		return withParticle.join(" ");
	}

	return parts.join(" ");
}

export function generateFantasyName(name: Name, culture?: string | null): Name {
	const config = getCultureTransforms(culture);

	let parts = `${name.givenName} ${name.surname}`.split(" ");

	parts = mergeDouble(parts);

	const merged = parts.join(" ");

	for (let attempt = 0; attempt < FANTASIFY_MAX_ATTEMPTS; attempt++) {
		const result = fantasify(merged, config);

		if (isValidFantasyName(`${name.givenName} ${name.surname}`, result)) {
			return {
				givenName: result.split(" ")[0],
				surname: result.split(" ").slice(1).join(" "),
				gender: name.gender,
			};
		}
	}

	// Fallback: one vowel shift on the surname.

	parts[parts.length - 1] = config.fallbackVowelShift(parts[parts.length - 1]);

	return {
		givenName: parts[0],
		surname: parts.slice(1).join(" "),
		gender: name.gender,
	};
}

export function generatePartialFantasyName(
	namePart: string,
	culture?: string | null,
): string {
	const config = getCultureTransforms(culture);

	for (let attempt = 0; attempt < FANTASIFY_MAX_ATTEMPTS; attempt++) {
		const result = fantasify(namePart, config);

		if (isValidFantasyName(namePart, result)) {
			return result;
		}
	}

	return config.fallbackVowelShift(namePart);
}
