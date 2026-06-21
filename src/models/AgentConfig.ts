import type { ToolContext } from "./LLMs";
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

	submit(
		messages: Message[],
		toolContext?: ToolContext,
	): Promise<ReadableStream<string>>;
	call(options: Record<string, unknown>): Promise<Response>;
	test(): Promise<string | null>;
}

export type StoredAgentConfig = Omit<AgentConfig, "call" | "test" | "submit">;

export const AVAILABLE_AGENT_TYPES = [
	"storyteller",
	"planner",
	"dialogue",
] as const;

// TODO: These are placeholders for now. They should read from files.

export const DEFAULT_STORYTELLER_PROMPT = "You are a creative storyteller.";

export const DEFAULT_PLANNER_PROMPT = "You are a planning agent.";

export const DEFAULT_DIALOGUE_PROMPT = "You are a dialogue writing agent.";
