import { FEMALE, MALE, type GenderIdentity } from "../../models/PlayerState";
import { pick } from "../../utils/random";
import { lines } from "../../utils/strings";

import afghanGivenFemaleRaw from "./data/afghan_given_female.txt?raw";
import afghanGivenMaleRaw from "./data/afghan_given_male.txt?raw";
import afghanSurnamesRaw from "./data/afghan_surnames.txt?raw";
import africanCentralGivenFemaleRaw from "./data/african-central_given_female.txt?raw";
import africanCentralGivenMaleRaw from "./data/african-central_given_male.txt?raw";
import africanCentralSurnamesRaw from "./data/african-central_surnames.txt?raw";
import africanSouthernGivenFemaleRaw from "./data/african-southern_given_female.txt?raw";
import africanSouthernGivenMaleRaw from "./data/african-southern_given_male.txt?raw";
import africanSouthernSurnamesRaw from "./data/african-southern_surnames.txt?raw";
import africanWestGivenFemaleRaw from "./data/african-west_given_female.txt?raw";
import africanWestGivenMaleRaw from "./data/african-west_given_male.txt?raw";
import africanWestSurnamesRaw from "./data/african-west_surnames.txt?raw";
import americanIberoGivenFemaleRaw from "./data/american-ibero_given_female.txt?raw";
import americanIberoGivenMaleRaw from "./data/american-ibero_given_male.txt?raw";
import americanIberoSurnamesRaw from "./data/american-ibero_surnames.txt?raw";
import anglophoneGivenFemaleRaw from "./data/anglophone_given_female.txt?raw";
import anglophoneGivenMaleRaw from "./data/anglophone_given_male.txt?raw";
import anglophoneSurnamesRaw from "./data/anglophone_surnames.txt?raw";
import asianSouthGivenFemaleRaw from "./data/asian-south_given_female.txt?raw";
import asianSouthGivenMaleRaw from "./data/asian-south_given_male.txt?raw";
import asianSouthSurnamesRaw from "./data/asian-south_surnames.txt?raw";
import asianSoutheastGivenFemaleRaw from "./data/asian-southeast_given_female.txt?raw";
import asianSoutheastGivenMaleRaw from "./data/asian-southeast_given_male.txt?raw";
import asianSoutheastSurnamesRaw from "./data/asian-southeast_surnames.txt?raw";
import chineseGivenFemaleRaw from "./data/chinese_given_female.txt?raw";
import chineseGivenMaleRaw from "./data/chinese_given_male.txt?raw";
import chineseSurnamesRaw from "./data/chinese_surnames.txt?raw";
import ethiopianGivenFemaleRaw from "./data/ethiopian_given_female.txt?raw";
import ethiopianGivenMaleRaw from "./data/ethiopian_given_male.txt?raw";
import ethiopianSurnamesRaw from "./data/ethiopian_surnames.txt?raw";
import europeanCentralGivenFemaleRaw from "./data/european-central_given_female.txt?raw";
import europeanCentralGivenMaleRaw from "./data/european-central_given_male.txt?raw";
import europeanCentralSurnamesRaw from "./data/european-central_surnames.txt?raw";
import europeanSouthernGivenFemaleRaw from "./data/european-southern_given_female.txt?raw";
import europeanSouthernGivenMaleRaw from "./data/european-southern_given_male.txt?raw";
import europeanSouthernSurnamesRaw from "./data/european-southern_surnames.txt?raw";
import fijianGivenFemaleRaw from "./data/fijian_given_female.txt?raw";
import fijianGivenMaleRaw from "./data/fijian_given_male.txt?raw";
import fijianSurnamesRaw from "./data/fijian_surnames.txt?raw";
import frenchGivenFemaleRaw from "./data/french_given_female.txt?raw";
import frenchGivenMaleRaw from "./data/french_given_male.txt?raw";
import frenchSurnamesRaw from "./data/french_surnames.txt?raw";
import georgianGivenFemaleRaw from "./data/georgian_given_female.txt?raw";
import georgianGivenMaleRaw from "./data/georgian_given_male.txt?raw";
import georgianSurnamesRaw from "./data/georgian_surnames.txt?raw";
import germanicGivenFemaleRaw from "./data/germanic_given_female.txt?raw";
import germanicGivenMaleRaw from "./data/germanic_given_male.txt?raw";
import germanicSurnamesRaw from "./data/germanic_surnames.txt?raw";
import greekGivenFemaleRaw from "./data/greek_given_female.txt?raw";
import greekGivenMaleRaw from "./data/greek_given_male.txt?raw";
import greekSurnamesRaw from "./data/greek_surnames.txt?raw";
import gulfGivenFemaleRaw from "./data/gulf_given_female.txt?raw";
import gulfGivenMaleRaw from "./data/gulf_given_male.txt?raw";
import gulfSurnamesRaw from "./data/gulf_surnames.txt?raw";
import iranianGivenFemaleRaw from "./data/iranian_given_female.txt?raw";
import iranianGivenMaleRaw from "./data/iranian_given_male.txt?raw";
import iranianSurnamesRaw from "./data/iranian_surnames.txt?raw";
import irishGivenFemaleRaw from "./data/irish_given_female.txt?raw";
import irishGivenMaleRaw from "./data/irish_given_male.txt?raw";
import irishSurnamesRaw from "./data/irish_surnames.txt?raw";
import japaneseGivenFemaleRaw from "./data/japanese_given_female.txt?raw";
import japaneseGivenMaleRaw from "./data/japanese_given_male.txt?raw";
import japaneseSurnamesRaw from "./data/japanese_surnames.txt?raw";
import koreanGivenFemaleRaw from "./data/korean_given_female.txt?raw";
import koreanGivenMaleRaw from "./data/korean_given_male.txt?raw";
import koreanSurnamesRaw from "./data/korean_surnames.txt?raw";
import levantineGivenFemaleRaw from "./data/levantine_given_female.txt?raw";
import levantineGivenMaleRaw from "./data/levantine_given_male.txt?raw";
import levantineSurnamesRaw from "./data/levantine_surnames.txt?raw";
import maghrebiGivenFemaleRaw from "./data/maghrebi_given_female.txt?raw";
import maghrebiGivenMaleRaw from "./data/maghrebi_given_male.txt?raw";
import maghrebiSurnamesRaw from "./data/maghrebi_surnames.txt?raw";
import nordicGivenFemaleRaw from "./data/nordic_given_female.txt?raw";
import nordicGivenMaleRaw from "./data/nordic_given_male.txt?raw";
import nordicSurnamesRaw from "./data/nordic_surnames.txt?raw";
import russianGivenFemaleRaw from "./data/russian_given_female.txt?raw";
import russianGivenMaleRaw from "./data/russian_given_male.txt?raw";
import russianSurnamesRaw from "./data/russian_surnames.txt?raw";
import slavicSouthGivenFemaleRaw from "./data/slavic-south_given_female.txt?raw";
import slavicSouthGivenMaleRaw from "./data/slavic-south_given_male.txt?raw";
import slavicSouthSurnamesRaw from "./data/slavic-south_surnames.txt?raw";
import turkicGivenFemaleRaw from "./data/turkic_given_female.txt?raw";
import turkicGivenMaleRaw from "./data/turkic_given_male.txt?raw";
import turkicSurnamesRaw from "./data/turkic_surnames.txt?raw";
import type { Name } from "./models";

export const IRL_CULTURES = [
	"Afghan",
	"African (Central)",
	"African (Southern)",
	"African (West)",
	"Anglophone",
	"Arabic (Gulf)",
	"Arabic (Levantine)",
	"Arabic (Maghrebi)",
	"Asian (South)",
	"Asian (Southeast)",
	"Chinese",
	"Ethiopian",
	"European (Central)",
	"European (Southern)",
	"Fijian",
	"French",
	"Georgian",
	"Germanic",
	"Greek",
	"Iberoamerican",
	"Iranian",
	"Irish",
	"Japanese",
	"Korean",
	"Nordic",
	"Russian",
	"Slavic (South)",
	"Turkic",
] as const;

export type IRLCulture = (typeof IRL_CULTURES)[number];

interface IRLNameData {
	givenMale: string[];
	givenFemale: string[];
	surnames: string[];
}

const IRL_CULTURE_TO_NAME: Record<IRLCulture, IRLNameData> = {
	Afghan: {
		givenMale: lines(afghanGivenMaleRaw),
		givenFemale: lines(afghanGivenFemaleRaw),
		surnames: lines(afghanSurnamesRaw),
	},
	"African (Central)": {
		givenMale: lines(africanCentralGivenMaleRaw),
		givenFemale: lines(africanCentralGivenFemaleRaw),
		surnames: lines(africanCentralSurnamesRaw),
	},
	"African (Southern)": {
		givenMale: lines(africanSouthernGivenMaleRaw),
		givenFemale: lines(africanSouthernGivenFemaleRaw),
		surnames: lines(africanSouthernSurnamesRaw),
	},
	"African (West)": {
		givenMale: lines(africanWestGivenMaleRaw),
		givenFemale: lines(africanWestGivenFemaleRaw),
		surnames: lines(africanWestSurnamesRaw),
	},
	Anglophone: {
		givenMale: lines(anglophoneGivenMaleRaw),
		givenFemale: lines(anglophoneGivenFemaleRaw),
		surnames: lines(anglophoneSurnamesRaw),
	},
	"Arabic (Gulf)": {
		givenMale: lines(gulfGivenMaleRaw),
		givenFemale: lines(gulfGivenFemaleRaw),
		surnames: lines(gulfSurnamesRaw),
	},
	"Arabic (Levantine)": {
		givenMale: lines(levantineGivenMaleRaw),
		givenFemale: lines(levantineGivenFemaleRaw),
		surnames: lines(levantineSurnamesRaw),
	},
	"Arabic (Maghrebi)": {
		givenMale: lines(maghrebiGivenMaleRaw),
		givenFemale: lines(maghrebiGivenFemaleRaw),
		surnames: lines(maghrebiSurnamesRaw),
	},
	"Asian (South)": {
		givenMale: lines(asianSouthGivenMaleRaw),
		givenFemale: lines(asianSouthGivenFemaleRaw),
		surnames: lines(asianSouthSurnamesRaw),
	},
	"Asian (Southeast)": {
		givenMale: lines(asianSoutheastGivenMaleRaw),
		givenFemale: lines(asianSoutheastGivenFemaleRaw),
		surnames: lines(asianSoutheastSurnamesRaw),
	},
	Chinese: {
		givenMale: lines(chineseGivenMaleRaw),
		givenFemale: lines(chineseGivenFemaleRaw),
		surnames: lines(chineseSurnamesRaw),
	},
	Ethiopian: {
		givenMale: lines(ethiopianGivenMaleRaw),
		givenFemale: lines(ethiopianGivenFemaleRaw),
		surnames: lines(ethiopianSurnamesRaw),
	},
	"European (Central)": {
		givenMale: lines(europeanCentralGivenMaleRaw),
		givenFemale: lines(europeanCentralGivenFemaleRaw),
		surnames: lines(europeanCentralSurnamesRaw),
	},
	"European (Southern)": {
		givenMale: lines(europeanSouthernGivenMaleRaw),
		givenFemale: lines(europeanSouthernGivenFemaleRaw),
		surnames: lines(europeanSouthernSurnamesRaw),
	},
	Fijian: {
		givenMale: lines(fijianGivenMaleRaw),
		givenFemale: lines(fijianGivenFemaleRaw),
		surnames: lines(fijianSurnamesRaw),
	},
	French: {
		givenMale: lines(frenchGivenMaleRaw),
		givenFemale: lines(frenchGivenFemaleRaw),
		surnames: lines(frenchSurnamesRaw),
	},
	Georgian: {
		givenMale: lines(georgianGivenMaleRaw),
		givenFemale: lines(georgianGivenFemaleRaw),
		surnames: lines(georgianSurnamesRaw),
	},
	Germanic: {
		givenMale: lines(germanicGivenMaleRaw),
		givenFemale: lines(germanicGivenFemaleRaw),
		surnames: lines(germanicSurnamesRaw),
	},
	Greek: {
		givenMale: lines(greekGivenMaleRaw),
		givenFemale: lines(greekGivenFemaleRaw),
		surnames: lines(greekSurnamesRaw),
	},
	Iberoamerican: {
		givenMale: lines(americanIberoGivenMaleRaw),
		givenFemale: lines(americanIberoGivenFemaleRaw),
		surnames: lines(americanIberoSurnamesRaw),
	},
	Iranian: {
		givenMale: lines(iranianGivenMaleRaw),
		givenFemale: lines(iranianGivenFemaleRaw),
		surnames: lines(iranianSurnamesRaw),
	},
	Irish: {
		givenMale: lines(irishGivenMaleRaw),
		givenFemale: lines(irishGivenFemaleRaw),
		surnames: lines(irishSurnamesRaw),
	},
	Japanese: {
		givenMale: lines(japaneseGivenMaleRaw),
		givenFemale: lines(japaneseGivenFemaleRaw),
		surnames: lines(japaneseSurnamesRaw),
	},
	Korean: {
		givenMale: lines(koreanGivenMaleRaw),
		givenFemale: lines(koreanGivenFemaleRaw),
		surnames: lines(koreanSurnamesRaw),
	},
	Nordic: {
		givenMale: lines(nordicGivenMaleRaw),
		givenFemale: lines(nordicGivenFemaleRaw),
		surnames: lines(nordicSurnamesRaw),
	},
	Russian: {
		givenMale: lines(russianGivenMaleRaw),
		givenFemale: lines(russianGivenFemaleRaw),
		surnames: lines(russianSurnamesRaw),
	},
	"Slavic (South)": {
		givenMale: lines(slavicSouthGivenMaleRaw),
		givenFemale: lines(slavicSouthGivenFemaleRaw),
		surnames: lines(slavicSouthSurnamesRaw),
	},
	Turkic: {
		givenMale: lines(turkicGivenMaleRaw),
		givenFemale: lines(turkicGivenFemaleRaw),
		surnames: lines(turkicSurnamesRaw),
	},
};

const GENDERED_SURNAME_CULTURES = new Set<string>(["Russian"]);

export function generateIRLName(
	culture: IRLCulture | null,
	gender: GenderIdentity,
): Name {
	const nameData = determineNameData(culture);

	const isMaleOrFemale =
		gender.identity === MALE.identity || gender.identity === FEMALE.identity;
	const givenPool = !isMaleOrFemale
		? [...nameData.givenMale, ...nameData.givenFemale]
		: gender.identity === FEMALE.identity
			? nameData.givenFemale
			: nameData.givenMale;

	const givenName = pick(givenPool);
	let surname = pick(nameData.surnames);

	if (culture !== null && GENDERED_SURNAME_CULTURES.has(culture)) {
		surname = genderizeSurname(surname, gender);
	}

	return {
		givenName,
		surname,
		gender,
	};
}

function determineNameData(culture: IRLCulture | null) {
	// Allow culture mixing in the pool if culture is explicitly null and not undefined.

	return culture !== null
		? IRL_CULTURE_TO_NAME[culture]
		: {
				givenMale: Object.values(IRL_CULTURE_TO_NAME).flatMap(
					(datum) => datum.givenMale,
				),
				givenFemale: Object.values(IRL_CULTURE_TO_NAME).flatMap(
					(datum) => datum.givenFemale,
				),
				surnames: Object.values(IRL_CULTURE_TO_NAME).flatMap(
					(datum) => datum.surnames,
				),
			};
}

function genderizeSurname(surname: string, gender: GenderIdentity): string {
	const isFemale = gender.identity === FEMALE.identity;
	const isMale = gender.identity === MALE.identity;

	const surnameLower = surname.toLowerCase();

	if (isFemale) {
		if (surnameLower.endsWith("skiy") || surnameLower.endsWith("skij")) {
			return surname.slice(0, -4) + "skaya";
		}

		if (surnameLower.endsWith("sky")) {
			return surname.slice(0, -3) + "skaya";
		}

		if (surnameLower.endsWith("oy")) {
			return surname.slice(0, -2) + "aya";
		}

		if (
			surnameLower.endsWith("ev") ||
			surnameLower.endsWith("ov") ||
			surnameLower.endsWith("in")
		) {
			return surname + "a";
		}

		return surname;
	}

	if (isMale) {
		if (surnameLower.endsWith("skaya")) {
			return surname.slice(0, -5) + "sky";
		}

		if (surnameLower.endsWith("aya")) {
			return surname.slice(0, -3) + "oy";
		}

		if (
			surnameLower.endsWith("ova") ||
			surnameLower.endsWith("eva") ||
			surnameLower.endsWith("ina")
		) {
			return surname.slice(0, -1);
		}

		return surname;
	}

	return surname;
}
