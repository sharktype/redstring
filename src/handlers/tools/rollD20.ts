export default function rollD20(
	n: number,
	modifier: number,
): { rolls: number[]; total: string } {
	const rolls = Array.from(
		{ length: n },
		() => Math.floor(Math.random() * 20) + 1,
	);
	const total = rolls.reduce((sum, r) => sum + r, 0) + modifier;

	return { rolls, total: new Intl.NumberFormat().format(total) };
}
