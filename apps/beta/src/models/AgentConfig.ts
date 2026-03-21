export default interface AgentConfig {
	type: (typeof AVAILABLE_AGENT_TYPES)[number];

	id?: number;
	providerConfigId?: number;
	prompt: {
		base: string;
		current: string;
		default: string;
	};
	parameters: {
		numerical: Record<string, { value: number; default: number }>;
	};
}

export const AVAILABLE_AGENT_TYPES = [
	"storyteller",
	"summarizer",
	"hypebot",
] as const;

export const BASE_STORYTELLER_PROMPT = "";

export const BASE_SUMMARIZER_PROMPT = "";

export const BASE_HYPEBOT_PROMPT = "";

export const DEFAULT_STORYTELLER_PROMPT = "";

export const DEFAULT_SUMMARIZER_PROMPT = "";

export const DEFAULT_HYPEBOT_PROMPT = "";
