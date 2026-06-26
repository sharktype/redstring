import type { ProfileExpressions } from "../../../../../models/PlayerState";

export type ExpressionLockKey = "neutral" | "injured" | "cum";

export type Locks = Record<ExpressionLockKey, boolean>;

export const ALL_LOCK_KEYS: ExpressionLockKey[] = ["neutral", "injured", "cum"];

export interface LockProps {
	locks: Locks;
	toggleLock: (key: ExpressionLockKey) => void;
}

export function defaultLocks(): Locks {
	const locks = {} as Locks;

	ALL_LOCK_KEYS.forEach((key) => {
		locks[key] = false;
	});

	return locks;
}

export function setExpressionField(
	expressions: ProfileExpressions | undefined,
	key: ExpressionLockKey,
	value: string,
): ProfileExpressions {
	return {
		neutral: expressions?.neutral,
		injured: expressions?.injured,
		cum: expressions?.cum,
		[key]: value,
	};
}
