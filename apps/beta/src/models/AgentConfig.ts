export default interface AgentConfig {
	type: (typeof AVAILABLE_AGENT_TYPES)[number];

	id?: number;
	providerConfigId?: number;
	prompt: string;
	parameters: {
		numerical: Record<string, { value: number; default: number }>;
	};
}

export const AVAILABLE_AGENT_TYPES = [
	"storyteller",
	"summarizer",
	"hypebot",
] as const;

// TODO: These are placeholders for now. They should read from files.

export const DEFAULT_STORYTELLER_PROMPT = "You are a creative storyteller.";

export const DEFAULT_SUMMARIZER_PROMPT = "You are a summarization agent.";

export const DEFAULT_HYPEBOT_PROMPT = "You are Hypebot, a commentator.";
