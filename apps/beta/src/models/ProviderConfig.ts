export default interface ProviderConfig {
	type: (typeof AVAILABLE_PROVIDER_TYPES)[number];

	id?: number;
	name: string;
	apiKey: string;
	model: string;

	call(options: Record<string, unknown>): Promise<Response>;
	test(): Promise<string | null>;
}

export type StoredProviderConfig = Omit<ProviderConfig, "call" | "test">;

export const AVAILABLE_PROVIDER_TYPES = ["openrouter"] as const;
