import type {
	Appearance,
	BodyArt,
	GenderExpression,
} from "../../../../../models/PlayerState";
import { pick } from "../../../../../utils/random";

const DEFAULT_FACE_TATTOOS = [
	"",
	"",
	"",
	"small tribal mark on cheek",
	"tear drop under eye",
	"delicate floral vine along temple",
	"script across brow",
	"star beside eye",
];

const DEFAULT_BODY_TATTOOS = [
	"",
	"",
	"",
	"rose on shoulder",
	"dragon coiling arm",
	"tribal band on bicep",
	"phoenix across back",
	"constellation on ribs",
	"serpent winding torso",
	"mandala on lower back",
];

const DEFAULT_EAR_PIERCINGS = ["studs", "hoops", "small rings", ""];
const DEFAULT_SEPTUM_PIERCINGS = ["small ring", "horseshoe", "retainer", ""];
const DEFAULT_FACE_PIERCINGS = ["eyebrow stud", "lip ring", "bridge bar", ""];
const DEFAULT_NAVEL_PIERCINGS = ["barbell", "ring", "dangling charm", ""];

const DEFAULT_NIPPLE_PIERCINGS = ["barbells", "rings", ""];
const DEFAULT_HOOD_PIERCINGS = ["small curved barbell", "ring", ""];
const DEFAULT_COCK_PIERCINGS = ["prince albert ring", "frenum barbell", ""];

const DEFAULT_EYE_MAKEUP = [
	"smoky eyeshadow",
	"winged eyeliner",
	"natural eyeshadow",
	"bold eyeliner with red eyeshadow",
	"shimmering gold eyeshadow",
	"dark eyeshadow with thick eyeliner",
	"subtle mascara",
	"cat-eye liner",
	"cut-crease eyeshadow",
	"glitter eyeshadow",
	"",
];

const DEFAULT_LIP_MAKEUP = [
	"red lipstick",
	"dark lipstick",
	"glossy pink lips",
	"matte nude lipstick",
	"berry lipstick",
	"black lipstick",
	"natural lip gloss",
	"wine-coloured lipstick",
	"",
];

const DEFAULT_CHEEK_MAKEUP = [
	"subtle blush",
	"rosy blush",
	"contoured cheekbones",
	"soft pink blush",
	"highlighter on cheekbones",
	"dramatic contour",
	"",
];

export function randomiseBodyArt(
	genderExpression: GenderExpression | undefined,
	existingAppearance?: Appearance,
	isNsfw?: boolean,
): BodyArt {
	const hasPenis =
		existingAppearance?.genitals === "penisCircumcised" ||
		existingAppearance?.genitals === "penisUncircumcised";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	const bodyArt: BodyArt = {
		tattoos: {
			face: pick(DEFAULT_FACE_TATTOOS),
			body: pick(DEFAULT_BODY_TATTOOS),
		},
		piercings: {
			ears: pick(DEFAULT_EAR_PIERCINGS),
			septum: pick(DEFAULT_SEPTUM_PIERCINGS),
			face: pick(DEFAULT_FACE_PIERCINGS),
			navel: pick(DEFAULT_NAVEL_PIERCINGS),
		},
		makeup: {
			eyes: pick(DEFAULT_EYE_MAKEUP),
			lips: pick(DEFAULT_LIP_MAKEUP),
			cheeks: pick(DEFAULT_CHEEK_MAKEUP),
		},
	};

	if (isNsfw) {
		bodyArt.piercings!.nipples = pick(DEFAULT_NIPPLE_PIERCINGS);

		if (isFeminine) {
			bodyArt.piercings!.hood = pick(DEFAULT_HOOD_PIERCINGS);
		}

		if (hasPenis) {
			bodyArt.piercings!.cock = pick(DEFAULT_COCK_PIERCINGS);
		}
	}

	return bodyArt;
}
