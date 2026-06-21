export const CHARGEN_PAGES = [
	"identity",
	"background",
	"stats",
	"inventory",
	"scenario",
] as const;
export type ChargenPage = (typeof CHARGEN_PAGES)[number];

export const STEPS = [
	"name",
	"appearance",
	"extraStats",
	"time",
	"wealth",
] as const;
export type Step = (typeof STEPS)[number];

export const PAGE_STEPS: Record<ChargenPage, readonly Step[]> = {
	identity: ["name", "appearance"],
	background: [],
	stats: ["extraStats"],
	inventory: ["wealth"],
	scenario: ["time"],
};
