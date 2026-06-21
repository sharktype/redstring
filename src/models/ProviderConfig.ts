import type { ToolCall, ToolContext } from "./LLMs";
import type Message from "./Message";

export type ProviderOutput = "text" | "image";

export type ProviderType =
	| (typeof AVAILABLE_TEXT_PROVIDER_TYPES)[number]
	| (typeof AVAILABLE_IMAGE_PROVIDER_TYPES)[number];

export default interface ProviderConfig {
	type: ProviderType;

	id?: number;
	name: string;
	apiKey: string;
	model: string;

	providerOutput: ProviderOutput;

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

export const AVAILABLE_TEXT_PROVIDER_TYPES = ["openrouter"] as const;

export const AVAILABLE_IMAGE_PROVIDER_TYPES = [
	"openrouter",
	"novelai",
] as const;
