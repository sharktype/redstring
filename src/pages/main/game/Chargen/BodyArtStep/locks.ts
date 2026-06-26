import type { BodyArt } from "../../../../../models/PlayerState";

export type BodyArtLockKey =
	| "tattoos.face"
	| "tattoos.body"
	| "piercings.ears"
	| "piercings.septum"
	| "piercings.face"
	| "piercings.navel"
	| "piercings.nipples"
	| "piercings.hood"
	| "piercings.cock"
	| "makeup.eyes"
	| "makeup.lips"
	| "makeup.cheeks";

export type Locks = Record<BodyArtLockKey, boolean>;

export const ALL_LOCK_KEYS: BodyArtLockKey[] = [
	"tattoos.face",
	"tattoos.body",
	"piercings.ears",
	"piercings.septum",
	"piercings.face",
	"piercings.navel",
	"piercings.nipples",
	"piercings.hood",
	"piercings.cock",
	"makeup.eyes",
	"makeup.lips",
	"makeup.cheeks",
];

export interface LockProps {
	locks: Locks;
	toggleLock: (key: BodyArtLockKey) => void;
}

export function defaultLocks(): Locks {
	const locks = {} as Locks;

	for (const key of ALL_LOCK_KEYS) {
		locks[key] = false;
	}

	return locks;
}

/**
 * Sets a nested field on a BodyArt object using a dotted lock key path.
 */
export function setBodyArtField(
	bodyArt: BodyArt | undefined,
	key: BodyArtLockKey,
	value: string,
): BodyArt {
	const [group, field] = key.split(".") as [
		"tattoos" | "piercings" | "makeup",
		string,
	];
	const next: BodyArt = {
		tattoos: { ...bodyArt?.tattoos },
		piercings: { ...bodyArt?.piercings },
		makeup: { ...bodyArt?.makeup },
	};

	(next[group] as Record<string, string | undefined>)[field] = value;

	return next;
}
