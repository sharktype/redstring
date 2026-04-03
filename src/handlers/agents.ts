import type AgentConfig from "../models/AgentConfig.ts";
import type {
	AVAILABLE_AGENT_TYPES,
	StoredAgentConfig,
} from "../models/AgentConfig.ts";
import type ProviderConfig from "../models/ProviderConfig.ts";

export default class Agent implements AgentConfig {
	type: (typeof AVAILABLE_AGENT_TYPES)[number];

	id?: number;
	providerConfigId?: number;
	provider?: ProviderConfig;
	prompt: string;
	parameters: {
		numerical: Record<string, { value: number; default: number }>;
	};

	constructor(config: StoredAgentConfig, provider?: ProviderConfig) {
		this.type = config.type;
		this.prompt = config.prompt;
		this.parameters = config.parameters;

		if (config.id !== undefined) {
			this.id = config.id;
		}

		if (config.providerConfigId !== undefined) {
			this.providerConfigId = config.providerConfigId;
		}

		if (provider) {
			this.provider = provider;
		}
	}

	async call(options: Record<string, unknown>) {
		if (!this.provider) {
			throw new Error("no provider configured for agent type " + this.type);
		}

		const messages =
			(options.messages as Array<{ role: string; content: string }>) ?? [];

		return this.provider.call({
			...options,
			messages: [{ role: "system", content: this.prompt }, ...messages],
		});
	}

	async test() {
		const response = await this.call({
			messages: [
				{
					role: "user",
					content:
						"This is a test. Reply with anything, but keep it short, and try to hint you're following the system prompt.",
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
