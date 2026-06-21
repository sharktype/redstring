export type LockKey =
	| "age"
	| "species"
	| "genderExpression"
	| "size"
	| "build"
	| "height"
	| "shoulders"
	| "facialHair"
	| "bust"
	| "hips"
	| "skinColour"
	| "complexion"
	| "hairStyle"
	| "hairColour"
	| "genitals"
	| "cockSize"
	| "clothingStyle";

export type Locks = Record<LockKey, boolean>;

export interface LockProps {
	locks: Locks;
	toggleLock: (key: LockKey) => void;
}

export const ALL_LOCK_KEYS: LockKey[] = [
	"age",
	"species",
	"genderExpression",
	"size",
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
];

export function defaultLocks(): Locks {
	const locks = {} as Locks;

	for (const key of ALL_LOCK_KEYS) {
		locks[key] = false;
	}

	return locks;
}
