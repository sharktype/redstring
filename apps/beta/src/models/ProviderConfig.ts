export default interface ProviderConfig {
	type: (typeof AVAILABLE_PROVIDER_TYPES)[number];

	id?: number;
	name: string;
	apiKey: string;
	model: string;
}

export const AVAILABLE_PROVIDER_TYPES = ["openrouter"] as const;
