import type { ProfileExpressions } from "../../../../../models/PlayerState";
import { pick } from "../../../../../utils/random";

const DEFAULT_NEUTRAL_EXPRESSIONS = [
	"serious",
	"calm",
	"stoic",
	"composed",
	"pensive",
];

const DEFAULT_INJURED_EXPRESSIONS = [
	"furious",
	"pained",
	"grimacing",
	"defiant",
	"rage",
];

const DEFAULT_CUM_EXPRESSIONS = [
	"slutty",
	"dazed",
	"blissful",
	"lewd",
	"ecstatic",
];

/**
 * Randomises any unlocked expression fields, preserving locked ones.
 */
export function randomiseExpressions(
	current: ProfileExpressions | undefined,
	locked: Record<"neutral" | "injured" | "cum", boolean>,
): ProfileExpressions {
	return {
		neutral: locked.neutral
			? current?.neutral
			: pick(DEFAULT_NEUTRAL_EXPRESSIONS),
		injured: locked.injured
			? current?.injured
			: pick(DEFAULT_INJURED_EXPRESSIONS),
		cum: locked.cum ? current?.cum : pick(DEFAULT_CUM_EXPRESSIONS),
	};
}
