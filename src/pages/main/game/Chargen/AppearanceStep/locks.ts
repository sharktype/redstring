import type { Appearance } from "../../../../../models/PlayerState";

export type Locks = Record<keyof Appearance, boolean>;

export const ALL_LOCK_KEYS: (keyof Appearance)[] = [
	"age",
	"species",
	"genderExpression",
	"weight",
	"build",
	"height",
	"shoulders",
	"facialHair",
	"bust",
	"hips",
	"skinColour",
	"complexion",
	"hairStyle",
	"hairColour",
	"genitals",
	"cockSize",
	"clothingStyle",
	"generateExtra",
];

export interface LockProps {
	locks: Locks;
	toggleLock: (key: keyof Appearance) => void;
}

export function defaultLocks(): Locks {
	const locks = {} as Locks;

	for (const key of ALL_LOCK_KEYS) {
		locks[key] = false;
	}

	return locks;
}
