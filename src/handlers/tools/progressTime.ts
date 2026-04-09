export default function progressTime(
	currentHour: number,
	currentMinute: number,
	hours: number,
	minutes: number,
): { hour: number; minute: number } {
	const totalMinutes =
		(currentHour * 60 + currentMinute + hours * 60 + (minutes % 1440) + 1440) %
		1440;

	return {
		hour: Math.floor(totalMinutes / 60),
		minute: totalMinutes % 60,
	};
}
