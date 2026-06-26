import type { Appearance, Style } from "../../../../../models/PlayerState";
import { pick } from "../../../../../utils/random";
import type { SceneActor } from "../ProfileStep/types";

const DEFAULT_PORTRAIT_STYLES = [
	"2020s anime (style)",
	"2010s anime (style)",
	"2000s anime (style)",
	"1990s anime (style)",
	"1980s anime (style)",
	"vintage cel anime (style)",
	"modern anime key visual (style)",
	"anime illustration (style)",
	"light novel illustration (style)",
	"anime visual novel CG (style)",
	"anime movie (style)",
	"shounen anime (style)",
	"shoujo anime (style)",
	"seinen anime (style)",
	"studio ghibli anime (style)",
	"kyoto animation anime (style)",
	"ufotable anime (style)",
	"trigger anime (style)",
	"mappa anime (style)",
	"anime screencap (style)",
	"anime sketch (style)",
	"anime concept art (style)",
	"chibi anime (style)",
	"anime manga cover (style)",

	// Hentai

	"pink pineapple (studio)",
	"queen bee (studio)",
	"PoRO (studio)",
	"mary jane (studio)",
	"bunnywalker (studio)",
	"collaboration works (studio)",
	"majin (studio)",
	"t-rex (studio)",
	"lune pictures (studio)",
	"suzuki mirano (studio)",
	"takeda hiromitsu (artist)",
	"asanagi (artist)",
	"ishikei (artist)",
	"mizuryu kei (artist)",
	"fue (artist)",
	"shiwasu no okina (artist)",
	"homunculus (artist)",
	"seto yuuki (artist)",
	"kisaragi gunma (artist)",
	"oda non (artist)",
	"shindol (artist)",
	"henreader (artist)",
	"alp (artist)",
	"kakao (artist)",
	"hisasi (artist)",
];

const DEFAULT_SCENE_STYLES = [
	"2020s anime (style)",
	"2010s anime (style)",
	"2000s anime (style)",
	"1990s anime (style)",
	"anime background art (style)",
	"anime scenery (style)",
	"studio ghibli anime (style)",
	"kyoto animation anime (style)",
	"makoto shinkai anime (style)",
	"anime movie (style)",
	"anime key visual (style)",
	"anime illustration (style)",
	"shounen anime (style)",
	"seinen anime (style)",
	"trigger anime (style)",
	"ufotable anime (style)",
	"anime concept art (style)",
	"anime visual novel CG (style)",
	"anime light novel illustration (style)",
	"anime screencap (style)",

	// Hentai

	// Hentai studios
	"pink pineapple (studio)",
	"queen bee (studio)",
	"PoRO (studio)",
	"mary jane (studio)",
	"bunnywalker (studio)",
	"collaboration works (studio)",
	"t-rex (studio)",
	"majin (studio)",
	// Hentai artists
	"takeda hiromitsu (artist)",
	"asanagi (artist)",
	"ishikei (artist)",
	"mizuryu kei (artist)",
	"fue (artist)",
	"shiwasu no okina (artist)",
	"homunculus (artist)",
	"oda non (artist)",
	"shindol (artist)",
];

const DEFAULT_SCENE_PROMPTS = [
	"standing in a bustling marketplace, full body, scenery",
	"sitting by a campfire at night, gazing at stars, full body, scenery",
	"leaning against a tavern bar, full body, scenery",
	"walking through a misty forest path, full body, scenery",
	"standing atop a castle wall at dawn, full body, scenery",
	"kneeling in a field of wildflowers, full body, scenery",
	"standing on a harbour dock watching ships, full body, scenery",
	"sitting on a rooftop at sunset, full body, scenery",
	"standing in a grand cathedral, shafts of light, full body, scenery",
	"walking down a rain-slicked city street, full body, scenery",
	"standing in a snowy mountain pass, full body, scenery",
	"sitting at a desk in a candlelit study, full body, scenery",
	"standing in a desert oasis, full body, scenery",
	"perched on a cliff overlooking the sea, full body, scenery",
	"standing in a throne room, full body, scenery",
	"walking through a cherry blossom grove, full body, scenery",
	"standing in a blacksmith's forge, sparks flying, full body, scenery",
	"sitting on a fallen log in a clearing, full body, scenery",
	"standing at a crossroads sign, full body, scenery",
	"standing in a library with towering bookshelves, full body, scenery",
	"walking along a beach at golden hour, full body, scenery",
	"standing in a moonlit graveyard, full body, scenery",
	"sitting at an outdoor café, full body, scenery",
	"standing on a bridge over a canal, full body, scenery",
	"standing in a festival with lanterns, full body, scenery",
];

export function randomiseStyle(): Style {
	return {
		portraitStyle: pick(DEFAULT_PORTRAIT_STYLES),
		sceneStyle: pick(DEFAULT_SCENE_STYLES),
	};
}

export function randomScenePrompt(): string {
	return pick(DEFAULT_SCENE_PROMPTS);
}

/**
 * A scene prompt entry pairing a descriptive prompt with the additional
 * actors (partners) involved in the scene. The main character is handled
 * separately by `buildScenePrompt`.
 */
export interface ScenePromptEntry {
	prompt: string;
	actors: SceneActor[];
}

const PARTNER_ACTORS: SceneActor[] = [
	{ sexRole: "boy", prompt: "masculine, short hair, muscular" },
	{ sexRole: "boy", prompt: "masculine, tall, broad shoulders" },
	{ sexRole: "boy", prompt: "masculine, dark hair, stubble" },
	{ sexRole: "boy", prompt: "masculine, blonde, athletic" },
	{ sexRole: "girl", prompt: "feminine, long hair, curvy" },
	{ sexRole: "girl", prompt: "feminine, petite, small breasts" },
	{ sexRole: "girl", prompt: "feminine, silver hair, slender" },
	{ sexRole: "girl", prompt: "feminine, red hair, voluptuous" },
	{ sexRole: "man", prompt: "masculine, mature, beard, burly" },
	{ sexRole: "woman", prompt: "feminine, mature, elegant, voluptuous" },
	{ sexRole: "futanari", prompt: "feminine, long hair, well-endowed" },
];

/** Picks a random partner actor from the pool. */
function randomPartner(): SceneActor {
	return pick(PARTNER_ACTORS);
}

/** Picks N random partners (with replacement) from the pool. */
function randomPartners(n: number): SceneActor[] {
	return Array.from({ length: n }, randomPartner);
}

const BREAST_ACTS: ScenePromptEntry[] = [
	{ prompt: "paizuri, penis between breasts, nsfw", actors: [randomPartner()] },
	{
		prompt: "breast play, groping, nipples pinched, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "breast focus, posing, hands on breasts, nsfw", actors: [] },
	{ prompt: "nipple stimulation, breast massage, nsfw", actors: [] },
	{ prompt: "nipple clamps, bound breasts, nsfw", actors: [] },
	{ prompt: "lactation, milking, nipple play, nsfw", actors: [] },
	{ prompt: "breast sucking, nipple licking, nsfw", actors: [randomPartner()] },
	{ prompt: "breast bondage, rope around breasts, nsfw", actors: [] },
];

const PENIS_RECEIVER_ACTS: ScenePromptEntry[] = [
	{
		prompt: "vaginal sex, penis, penetration, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "anal sex, penis, penetration, nsfw", actors: [randomPartner()] },
	{ prompt: "oral sex, penis, blowjob, nsfw", actors: [randomPartner()] },
	{
		prompt: "paizuri, penis, between breasts, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "doggy style, penis, from behind, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "cowgirl position, penis, riding, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "missionary, penis, legs wrapped, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "reverse cowgirl, penis, riding, nsfw", actors: [randomPartner()] },
	{ prompt: "spooning, penis, from behind, nsfw", actors: [randomPartner()] },
	{ prompt: "standing sex, penis, lifted, nsfw", actors: [randomPartner()] },
	{ prompt: "prone bone, penis, lying down, nsfw", actors: [randomPartner()] },
	{ prompt: "handjob, penis, stroking, nsfw", actors: [randomPartner()] },
	{ prompt: "footjob, penis, feet, nsfw", actors: [randomPartner()] },
	{
		prompt: "thighjob, penis, between thighs, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "frottage, penis rubbing, nsfw", actors: [randomPartner()] },
	{ prompt: "edge play, penis, teasing, nsfw", actors: [randomPartner()] },
];

const PENIS_TAKER_ACTS: ScenePromptEntry[] = [
	{ prompt: "anal sex, receiving, bent over, nsfw", actors: [randomPartner()] },
	{ prompt: "oral sex, giving, blowjob, nsfw", actors: [randomPartner()] },
	{
		prompt: "anal sex, receiving, on back, legs up, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "oral sex, deepthroat, giving, nsfw", actors: [randomPartner()] },
	{ prompt: "rimjob, giving, tongue, nsfw", actors: [randomPartner()] },
	{ prompt: "double penetration, anal, oral, nsfw", actors: randomPartners(2) },
];

const VULVA_TAKER_ACTS: ScenePromptEntry[] = [
	{
		prompt: "vaginal sex, penetrated, spread legs, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "anal sex, receiving, nsfw", actors: [randomPartner()] },
	{
		prompt: "oral sex, cunnilingus, legs spread, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "doggy style, penetrated, from behind, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "cowgirl position, riding, penetrated, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "missionary, penetrated, legs wrapped, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "reverse cowgirl, riding, penetrated, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "spooning, penetrated, from behind, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "standing sex, lifted, penetrated, nsfw",
		actors: [randomPartner()],
	},
	{
		prompt: "prone bone, penetrated, lying down, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "fingering, hand between legs, nsfw", actors: [randomPartner()] },
	{ prompt: "fisting, hand inside, nsfw", actors: [randomPartner()] },
	{
		prompt: "double penetration, vaginal, anal, nsfw",
		actors: randomPartners(2),
	},
	{
		prompt: "cunnilingus, oral, tongue on clitoris, nsfw",
		actors: [randomPartner()],
	},
	{ prompt: "rimjob, receiving, tongue, nsfw", actors: [randomPartner()] },
	{
		prompt: "tribadism, grinding, pussy rubbing, nsfw",
		actors: [randomPartner()],
	},
];

const FETISH_ACTS: ScenePromptEntry[] = [
	{ prompt: "restraints, bound, bondage, shibari, nsfw", actors: [] },
	{
		prompt: "cum bath, covered in cum, bukkake, nsfw",
		actors: randomPartners(3),
	},
	{ prompt: "torture devices, restrained, dungeon, nsfw", actors: [] },
	{
		prompt: "bukkake, multiple penises, cum on body, nsfw",
		actors: randomPartners(4),
	},
	{ prompt: "genital closeup, spread, detailed, nsfw", actors: [] },
	{ prompt: "wax play, dripping candle, nsfw", actors: [] },
	{ prompt: "blindfold, sensory deprivation, nsfw", actors: [] },
	{ prompt: "gag, ball gag, restrained, nsfw", actors: [] },
	{ prompt: "collar, leash, pet play, nsfw", actors: [randomPartner()] },
	{ prompt: "spanking, bent over, red marks, nsfw", actors: [randomPartner()] },
	{ prompt: "whip, marks on skin, bdsm, nsfw", actors: [randomPartner()] },
	{ prompt: "electric play, vibrator, nsfw", actors: [] },
	{ prompt: "enema, water, belly, nsfw", actors: [] },
	{ prompt: "catheter, medical play, nsfw", actors: [] },
	{ prompt: "sounding, urethral, nsfw", actors: [] },
	{ prompt: "vacuum bed, latex, encasement, nsfw", actors: [] },
];

export function randomSexScenePrompt(appearance: Appearance): ScenePromptEntry {
	const hasBreasts =
		appearance.bust !== undefined && appearance.bust !== "flat";
	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";
	const hasVulva = appearance.genitals === "vulva";

	if (hasBreasts && Math.random() < 0.1) {
		return pick(BREAST_ACTS);
	}

	if (hasPenis && Math.random() < 0.33) {
		return Math.random() < 0.5
			? pick(PENIS_RECEIVER_ACTS)
			: pick(PENIS_TAKER_ACTS);
	}

	if (hasVulva && Math.random() < 0.33) {
		return pick(VULVA_TAKER_ACTS);
	}

	return pick(FETISH_ACTS);
}
