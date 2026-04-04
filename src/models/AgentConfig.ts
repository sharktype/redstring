import type Message from "./Message";

export default interface AgentConfig {
	/**
	 * The type of the agent.
	 *
	 * Note that while there are multiple types of agents, they all use the
	 * same handler, unlike providers which have different handlers for each
	 * type, e.g., the Openrouter provider.
	 */
	type: (typeof AVAILABLE_AGENT_TYPES)[number];

	id?: number;
	providerConfigId?: number;
	prompt: string;
	parameters: {
		numerical: Record<string, { value: number; default: number }>;
	};

	submit(messages: Message[]): Promise<ReadableStream<string>>;
	call(options: Record<string, unknown>): Promise<Response>;
	test(): Promise<string | null>;
}

export type StoredAgentConfig = Omit<AgentConfig, "call" | "test" | "submit">;

export const AVAILABLE_AGENT_TYPES = ["storyteller", "summarizer"] as const;

// TODO: These are placeholders for now. They should read from files.

export const DEFAULT_STORYTELLER_PROMPT = "You are a creative storyteller.";

export const DEFAULT_SUMMARIZER_PROMPT = "You are a summarization agent.";
