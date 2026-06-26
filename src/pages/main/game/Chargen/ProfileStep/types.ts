import type { ProfileState } from "../../../../../models/PlayerState";

export type VariantMode = "base" | "nude";

export const PROFILE_STATE_EMOJIS: Record<ProfileState, string> = {
	neutral: "😐",
	winded: "😮‍💨",
	injured: "🤕",
	horny: "😳",
	ahegao: "😈",
	cumFacial: "💦",
	cumInMouth: "💦",
	cumEverywhere: "💦",
};

export const PROFILE_STATE_LABELS: Record<ProfileState, string> = {
	neutral: "Neutral",
	winded: "Winded",
	injured: "Injured",
	horny: "Horny",
	ahegao: "Ahegao",
	cumFacial: "Cum Facial",
	cumInMouth: "Cum in Mouth",
	cumEverywhere: "Cum Everywhere",
};

export type SexRole =
	| "girl"
	| "boy"
	| "man"
	| "woman"
	| "futanari"
	| "cuntboy"
	| "person";

export const SEX_ROLES: ReadonlySet<SexRole> = new Set([
	"girl",
	"boy",
	"man",
	"woman",
	"futanari",
	"cuntboy",
	"person",
]);

export interface SceneActor {
	sexRole: SexRole;
	prompt: string;
}
