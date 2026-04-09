export default function modifyMoney(
	currentMoney: number,
	amount: number,
	isDry: boolean,
): { canAfford: boolean; remaining: number } {
	const remaining = currentMoney + amount;
	const canAfford = remaining >= 0;

	if (isDry) {
		return { canAfford, remaining };
	}

	// The caller will use this information plus tool caller context to perform the actual work.

	return { canAfford, remaining };
}
