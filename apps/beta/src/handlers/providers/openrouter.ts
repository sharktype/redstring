import type ProviderConfig from "../../models/ProviderConfig.ts";

export const OPENROUTER_API_URL =
	"https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterConfig extends ProviderConfig {
	type: "openrouter";
}
