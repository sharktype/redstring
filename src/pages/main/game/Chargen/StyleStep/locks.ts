import type { Style } from "../../../../../models/PlayerState";

export type StyleLockKey = "portraitStyle" | "sceneStyle";

export type Locks = Record<StyleLockKey, boolean>;

export const ALL_LOCK_KEYS: StyleLockKey[] = ["portraitStyle", "sceneStyle"];

export interface LockProps {
	locks: Locks;
	toggleLock: (key: StyleLockKey) => void;
}

export function defaultLocks(): Locks {
	const locks = {} as Locks;

	for (const key of ALL_LOCK_KEYS) {
		locks[key] = false;
	}

	return locks;
}

export function setStyleField(
	style: Style | undefined,
	key: StyleLockKey,
	value: string,
): Style {
	return {
		portraitStyle: style?.portraitStyle,
		sceneStyle: style?.sceneStyle,
		[key]: value,
	};
}
