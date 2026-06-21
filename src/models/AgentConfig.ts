import type { ToolContext } from "./LLMs";
import type Message from "./Message";

export type AgentOutput = "text" | "image";

export default interface AgentConfig {
	/**
	 * The type of the agent.
	 *
	 * Note that while there are multiple types of agents, they all use the
	 * same handler, unlike providers which have different handlers for each
	 * type, e.g., the Openrouter provider.
	 */
	type: AgentType;

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

export type AgentType =
	| (typeof AVAILABLE_TEXT_AGENT_TYPES)[number]
	| (typeof AVAILABLE_IMAGE_AGENT_TYPES)[number];

export type StoredAgentConfig = Omit<AgentConfig, "call" | "test" | "submit">;

export const AVAILABLE_TEXT_AGENT_TYPES = [
	"storyteller",
	"planner",
	"dialogue",
] as const;

export const AVAILABLE_IMAGE_AGENT_TYPES = ["profiler", "illustrator"] as const;

// TODO: These are placeholders for now. They should read from files.

export const DEFAULT_STORYTELLER_PROMPT = "You are a creative storyteller.";

export const DEFAULT_PLANNER_PROMPT = "You are a planning agent.";

export const DEFAULT_DIALOGUE_PROMPT = "You are a dialogue writing agent.";

export const DEFAULT_PROFILER_PROMPT =
	"Generate a quick character portrait based on the provided description.";

export const DEFAULT_ILLUSTRATOR_PROMPT =
	"Generate a full scene illustration based on the provided description.";
