export default function spendMoney(
	currentMoney: number,
	cost: number,
	isDry: boolean,
): { canAfford: boolean; remaining: number } {
	const canAfford = currentMoney >= cost;
	const remaining = currentMoney - cost;

	if (isDry || !canAfford) {
		return { canAfford, remaining };
	}

	// The caller will use this information plus tool caller context to perform the actual work.

	return { canAfford: !(isDry || !canAfford) ? true : canAfford, remaining };
}
