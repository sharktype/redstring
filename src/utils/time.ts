export function formatTime(hour: number, minute: number): string {
	const period = hour >= 12 ? "PM" : "AM";
	const h = hour % 12 || 12;
	const m = minute.toString().padStart(2, "0");
	return `${h}:${m} ${period}`;
}

export function formatElapsed(hours: number): string {
	const h = Math.floor(hours);
	const m = Math.round((hours - h) * 60);

	if (h > 0 && m > 0) {
		return `${h}h ${m}m`;
	}
	if (h > 0) {
		return `${h}h`;
	}
	if (m > 0) {
		return `${m}m`;
	}
	return "less than a minute";
}
