import type { ToolCall, ToolContext } from "./LLMs";
import type Message from "./Message";

export default interface ProviderConfig {
	type: (typeof AVAILABLE_PROVIDER_TYPES)[number];

	id?: number;
	name: string;
	apiKey: string;
	model: string;

	submit(
		messages: Message[],
		toolContext?: ToolContext,
	): Promise<ReadableStream<string>>;
	call(options: Record<string, unknown>): Promise<Response>;
	execute(toolCall: ToolCall, toolContext?: ToolContext): string;
	test(): Promise<string | null>;
}

export type StoredProviderConfig = Omit<
	ProviderConfig,
	"call" | "test" | "execute" | "submit"
>;

export const AVAILABLE_PROVIDER_TYPES = ["openrouter"] as const;
