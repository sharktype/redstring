export const CHARGEN_PAGES = [
	"identity",
	"appearance",
	"stats",
	"inventory",
	"scenario",
] as const;
export type ChargenPage = (typeof CHARGEN_PAGES)[number];

export const STEPS = ["name", "extraStats", "time", "wealth"] as const;
export type Step = (typeof STEPS)[number];

export const PAGE_STEPS: Record<ChargenPage, readonly Step[]> = {
	identity: ["name", "extraStats"],
	appearance: [],
	stats: [],
	inventory: ["wealth"],
	scenario: ["time"],
};
