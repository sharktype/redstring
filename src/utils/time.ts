export function isNight(hour: number): boolean {
	return hour >= 18 || hour < 6;
}

export function timeEmoji(hour: number): string {
	if (hour >= 6 && hour < 12) {
		return "🌅";
	}

	if (hour >= 12 && hour < 18) {
		return "☀️";
	}

	if (hour >= 18 && hour < 21) {
		return "🌇";
	}

	return "🌙";
}

export function formatTime(
	hour: number,
	minute: number,
	withEmoji: boolean = false,
): string {
	const period = hour >= 12 ? "PM" : "AM";
	const timeString = `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${period}`;

	if (withEmoji) {
		return `${timeEmoji(hour)} ${timeString}`;
	}

	return timeString;
}

export function formatElapsed(hours: number): string {
	const hour = Math.floor(hours);
	const minute = Math.round((hours - hour) * 60);

	if (hour > 0 && minute > 0) {
		return `${hour}h ${minute}m`;
	}

	if (hour > 0) {
		return `${hour}h`;
	}

	if (minute > 0) {
		return `${minute}m`;
	}

	return "less than a minute";
}
