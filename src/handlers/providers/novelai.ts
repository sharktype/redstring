import type { ToolCall, ToolContext } from "../../models/LLMs.ts";
import type Message from "../../models/Message.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type {
	AVAILABLE_IMAGE_PROVIDER_TYPES,
	ProviderOutput,
} from "../../models/ProviderConfig.ts";

export class NovelAIConfig implements ProviderConfig {
	type: (typeof AVAILABLE_IMAGE_PROVIDER_TYPES)[number] = "novelai";
	providerOutput: ProviderOutput = "image";

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

	async call(_options: Record<string, unknown>): Promise<Response> {
		throw new Error("NovelAI image generation not yet implemented.");
	}

	async submit(
		_messages: Message[],
		_toolContext?: ToolContext,
	): Promise<ReadableStream<string>> {
		throw new Error("NovelAI does not support text generation.");
	}

	execute(_toolCall: ToolCall, _toolContext?: ToolContext): string {
		return JSON.stringify({
			error: "NovelAI does not support tool execution.",
		});
	}

	async test(): Promise<string | null> {
		// TODO: Implement.

		return null;
	}
}
