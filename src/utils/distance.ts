import type { Region } from "../models/Location.ts";

export function getDistance(a?: Region, b?: Region): number {
	if (!a || !b) {
		return -1;
	}

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

export function estimateTravelTime(
	distanceMeters: number,
	speedKmh: number,
): string {
	const distanceKm = distanceMeters / 1000;

	const hours = speedKmh > 0 ? distanceKm / speedKmh : 0;
	const hoursPart = Math.floor(hours);
	const minutesPart = Math.floor((hours - hoursPart) * 60);

	if (hoursPart > 0 && minutesPart > 0) {
		return `~${hoursPart}h ${minutesPart}m`;
	}

	if (hoursPart > 0) {
		return `~${hoursPart}h`;
	}

	if (minutesPart > 0) {
		return `~${minutesPart}m`;
	}

	return "<1m";
}
