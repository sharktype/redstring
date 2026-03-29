import type { Region } from "../models/Location.ts";

export function getDistance(a: Region, b: Region): number {
	const dx = b.position.x - a.position.x;
	const dy = b.position.y - a.position.y;

	return Math.sqrt(dx * dx + dy * dy);
}

export function humanizeDistance(meters: number): string {
	if (meters < 1000) {
		return `${Math.round(meters)}m`;
	}

	return `${(meters / 1000).toFixed(1)}km`;
}
