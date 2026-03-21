import type ProviderConfig from "../../models/ProviderConfig.ts";
import type { AVAILABLE_PROVIDER_TYPES } from "../../models/ProviderConfig.ts";

export const OPENROUTER_API_URL =
	"https://openrouter.ai/api/v1/chat/completions";

export class OpenRouterConfig implements ProviderConfig {
	type: (typeof AVAILABLE_PROVIDER_TYPES)[number] = "openrouter";

	id?: number;
	name: string;
	apiKey: string;
	model: string;

	constructor(name: string, apiKey: string, model: string, id?: number) {
		this.name = name;
		this.apiKey = apiKey;
		this.model = model;
		if (id !== undefined) {
			this.id = id;
		}
	}

	async call(options: Record<string, unknown>) {
		return fetch(OPENROUTER_API_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...options,
				model: this.model,
			}),
		});
	}

	async test() {
		const response = await this.call({
			messages: [
				{
					role: "user",
					content: "This is a test. Reply with anything, but keep it short.",
				},
			],
			stream: false,
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		return data.choices?.[0]?.message?.content || null;
	}
}
