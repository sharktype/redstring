import type { Region } from "../models/Location.ts";

export function getDirection(from: Region, to: Region): string {
	const dx = to.position.x - from.position.x;
	const dy = to.position.y - from.position.y;

	if (dx === 0 && dy === 0) {
		return "Here";
	}

	const angle = Math.atan2(dy, dx) * (180 / Math.PI);

	const bearing = (90 - angle + 360) % 360;

	if (bearing < 22.5 || bearing >= 337.5) {
		return "North ↑";
	}
	if (bearing < 67.5) {
		return "Northeast ↗";
	}
	if (bearing < 112.5) {
		return "East →";
	}
	if (bearing < 157.5) {
		return "Southeast ↘";
	}
	if (bearing < 202.5) {
		return "South ↓";
	}
	if (bearing < 247.5) {
		return "Southwest ↙";
	}
	if (bearing < 292.5) {
		return "West ←";
	}

	return "Northwest ↖";
}
