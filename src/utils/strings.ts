const VOWELS = new Set("aeiouäëïöüâûáéíóú");

export function lines(raw: string): string[] {
	return raw
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
}

export function hasTripleConsonant(text: string): boolean {
	let streak = 0;
	for (const ch of text.toLowerCase()) {
		if (ch === " " || ch === "-" || ch === "'") {
			streak = 0;
			continue;
		}
		streak = VOWELS.has(ch) ? 0 : streak + 1;
		if (streak >= 3) return true;
	}
	return false;
}

export function stripDiacritics(s: string): string {
	return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param a {string} the first string
 * @param b {string} the second string
 * @returns {number} the Levenshtein distance between the two strings
 */
export function levenshtein(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	const dp: number[][] = Array.from({ length: m + 1 }, () =>
		Array(n + 1).fill(0),
	);

	for (let i = 0; i <= m; i++) dp[i][0] = i;
	for (let j = 0; j <= n; j++) dp[0][j] = j;
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1,
				dp[i][j - 1] + 1,
				dp[i - 1][j - 1] + cost,
			);
		}
	}

	return dp[m][n];
}
