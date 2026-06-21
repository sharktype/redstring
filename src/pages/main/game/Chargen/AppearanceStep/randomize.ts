import type {
	Appearance,
	GenderExpression,
} from "../../../../../models/PlayerState";
import { pick, randomInt } from "../../../../../utils/random";

const DEFAULT_SKIN_TONES = [
	"pale",
	"fair",
	"light",
	"light tan",
	"tan",
	"olive",
	"caramel",
	"bronze",
	"golden brown",
	"warm brown",
	"medium brown",
	"deep brown",
	"dark brown",
	"ebony",
	"porcelain",
	"ivory",
	"peach",
	"beige",
	"honey",
	"copper",
	"mahogany",
	"almond",
	"sand",
	"warm beige",
	"rich brown",
	"cocoa",
];

const DEFAULT_COMPLEXIONS = [
	"clear",
	"freckled",
	"scarred",
	"weathered",
	"flawless",
	"blemished",
	"smooth",
	"ruddy",
	"rosy",
	"sun-kissed",
	"pockmarked",
	"spotty",
	"mottled",
	"wrinkled",
	"birthmarked",
];

const DEFAULT_MASCULINE_HAIRSTYLES = [
	"short and neat",
	"buzz cut",
	"crew cut",
	"slicked back",
	"side-parted",
	"messy",
	"shoulder-length",
	"tied back",
	"shaved",
	"undercut",
	"long and flowing",
	"bald",
	"military cut",
	"wavy medium",
	"curly short",
];

const DEFAULT_FEMININE_HAIRSTYLES = [
	"long and straight",
	"long and wavy",
	"long and curly",
	"braided",
	"pinned up",
	"ponytail",
	"bob cut",
	"pixie cut",
	"shoulder-length",
	"half-up",
	"elaborate updo",
	"twin braids",
	"loose curls",
	"crown braid",
	"messy bun",
];

const DEFAULT_HAIR_COLOURS = [
	"black",
	"dark brown",
	"brown",
	"light brown",
	"chestnut",
	"auburn",
	"red",
	"strawberry blonde",
	"dark blonde",
	"blonde",
	"dirty blonde",
	"platinum blonde",
	"grey",
	"salt and pepper",
	"white",
	"silver",
	"ginger",
];

const DEFAULT_MASCULINE_CLOTHING = [
	"simple tunic and leather breeches",
	"well-fitted doublet with dark trousers",
	"traveler's cloak over sturdy woolens",
	"military-style jacket with riding boots",
	"loose linen shirt and patched trousers",
	"silk vest over a high-collared shirt",
	"rough-spun work clothes with heavy boots",
	"formal coat with silver buttons and polished shoes",
];

const DEFAULT_FEMININE_CLOTHING = [
	"simple linen dress with a leather bodice",
	"flowing silk gown with embroidered sleeves",
	"traveler's skirt and practical blouse",
	"elegant evening dress with lace trim",
	"woolen kirtle with a fitted corset",
	"peasant blouse and long practical skirt",
	"fine cotton dress with floral patterns",
	"riding dress with a tailored jacket",
];

const DEFAULT_GENITALS: Appearance["genitals"][] = [
	"vulva",
	"penisCircumcised",
	"penisUncircumcised",
	"none",
];

const DEFAULT_COCK_SIZES: Appearance["cockSize"][] = [
	"verySmall",
	"small",
	"average",
	"large",
	"veryLarge",
];

const DEFAULT_SIZES: Appearance["size"][] = ["small", "average", "large"];

const DEFAULT_BUILDS: Appearance["build"][] = [
	"soft",
	"average",
	"toned",
	"muscular",
];

const DEFAULT_HEIGHTS: Appearance["height"][] = [
	"veryShort",
	"short",
	"belowAverage",
	"average",
	"aboveAverage",
	"tall",
	"veryTall",
];

const DEFAULT_EXPRESSIONS: GenderExpression[] = [
	"feminine",
	"masculine",
	"androgynous",
];

const SHOULDER_VALUES = ["narrow", "average", "broad"];

const DEFAULT_FACIAL_HAIR = [
	"clean-shaven",
	"stubble",
	"short beard",
	"full beard",
	"goatee",
	"moustache",
	"mutton chops",
	"designer stubble",
];

const BUST_VALUES = ["flat", "small", "medium", "large", "veryLarge"];

const HIP_VALUES = ["narrow", "average", "wide"];

export function randomiseAppearance(
	genderExpression: GenderExpression | undefined,
	existingSpecies?: string,
	isNsfw?: boolean,
): Partial<Appearance> {
	const expression = genderExpression ?? pick(DEFAULT_EXPRESSIONS);
	const isMasculine =
		expression === "masculine" || expression === "androgynous";
	const isFeminine = expression === "feminine" || expression === "androgynous";

	const species = "Human";

	const appearance: Partial<Appearance> = {
		age: ageForSpecies(existingSpecies ?? species),
		species,
		genderExpression: expression,
		size: pick(DEFAULT_SIZES),
		build: pick(DEFAULT_BUILDS),
		height: pick(DEFAULT_HEIGHTS),
		skinColour: pick(DEFAULT_SKIN_TONES),
		complexion: pick(DEFAULT_COMPLEXIONS),
		hairStyle: pickHairStyle(expression),
		hairColour: pick(DEFAULT_HAIR_COLOURS),
		clothingStyle: pickClothingStyle(expression),
		custom: undefined,
	};

	if (isMasculine) {
		appearance.shoulders = pick(SHOULDER_VALUES) as Appearance["shoulders"];
		appearance.facialHair = pick(DEFAULT_FACIAL_HAIR);
	} else {
		appearance.shoulders = undefined;
		appearance.facialHair = undefined;
	}

	if (isFeminine) {
		appearance.bust = pick(BUST_VALUES) as Appearance["bust"];
		appearance.hips = pick(HIP_VALUES) as Appearance["hips"];
	} else {
		appearance.bust = undefined;
		appearance.hips = undefined;
	}

	if (isNsfw) {
		const genitals = pick(DEFAULT_GENITALS);
		appearance.genitals = genitals;

		if (genitals === "penisCircumcised" || genitals === "penisUncircumcised") {
			appearance.cockSize = pick(DEFAULT_COCK_SIZES);
		} else {
			appearance.cockSize = undefined;
		}
	}

	return appearance;
}

function ageForSpecies(species: string | undefined): number {
	const lower = species?.toLowerCase();

	if (lower === "dwarf") {
		return randomInt(18, 200);
	}

	if (lower === "elf") {
		return randomInt(18, 3000);
	}

	return randomInt(18, 80);
}

function pickHairStyle(genderExpression: GenderExpression | undefined): string {
	if (genderExpression === "masculine") {
		return pick(DEFAULT_MASCULINE_HAIRSTYLES);
	}

	if (genderExpression === "feminine") {
		return pick(DEFAULT_FEMININE_HAIRSTYLES);
	}

	return pick([
		...DEFAULT_MASCULINE_HAIRSTYLES,
		...DEFAULT_FEMININE_HAIRSTYLES,
	]);
}

function pickClothingStyle(
	genderExpression: GenderExpression | undefined,
): string {
	if (genderExpression === "masculine") {
		return pick(DEFAULT_MASCULINE_CLOTHING);
	}

	if (genderExpression === "feminine") {
		return pick(DEFAULT_FEMININE_CLOTHING);
	}

	return pick([...DEFAULT_MASCULINE_CLOTHING, ...DEFAULT_FEMININE_CLOTHING]);
}
