import { Parser } from "expr-eval";
import type Message from "../../models/Message.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type { AVAILABLE_PROVIDER_TYPES } from "../../models/ProviderConfig.ts";

export const OPENROUTER_API_URL =
	"https://openrouter.ai/api/v1/chat/completions";

// Note: each of these types are specific to this OpenRouter configuration.

type ToolDefinition = {
	type: "function";
	function: {
		name: string;
		description: string;
		parameters: Record<string, unknown>;
	};
};

type ToolCall = {
	id: string;
	type: "function";
	function: {
		name: string;
		arguments: string;
	};
};

type RegularMessage = {
	role: "user" | "assistant" | "system";
	content: string;
};

type AssistantToolCallMessage = {
	role: "assistant";
	content: string;
	tool_calls: ToolCall[];
};

type ToolMessage = { role: "tool"; tool_call_id: string; content: string };

type ApiMessage = RegularMessage | AssistantToolCallMessage | ToolMessage;

// Note that all providers should always have access to all tools. Since providers may have different requirements for
// defining how to call tools, there is currently no mechanism to define all tools once for use across providers.

const TOOLS: ToolDefinition[] = [
	{
		type: "function",
		function: {
			name: "roll_d20",
			description: "Generate a random number between 0 and 20.",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "arithmetic",
			description:
				"Evaluate a BODMAS arithmetic expression. Supports +, -, *, /, parentheses, and ^.",
			parameters: {
				type: "object",
				properties: {
					expression: {
						type: "string",
						description:
							"The arithmetic expression to evaluate, e.g. '(2 + 3) * 4'.",
					},
				},
				required: ["expression"],
			},
		},
	},
];

const exprParser = new Parser();

function executeToolCall(toolCall: ToolCall): string {
	switch (toolCall.function.name) {
		case "roll_d20":
			return JSON.stringify({ result: Math.floor(Math.random() * 21) });
		case "arithmetic": {
			try {
				const { expression } = JSON.parse(toolCall.function.arguments);
				const result = exprParser.evaluate(expression);
				return JSON.stringify({ result });
			} catch (e) {
				return JSON.stringify({ error: `invalid expression: ${e}` });
			}
		}
		default:
			return JSON.stringify({
				error: `unknown tool: ${toolCall.function.name}`,
			});
	}
}

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

	async submit(messages: Message[]): Promise<ReadableStream<string>> {
		// Code largely lifted and adapted from docs. See: https://openrouter.ai/docs/api/reference/streaming

		const apiMessages: ApiMessage[] =
			this.mapInternalMessagesForAgent(messages);

		let activeReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

		const callProvider = (opts: Record<string, unknown>) => this.call(opts);

		return new ReadableStream<string>({
			async start(controller) {
				try {
					while (true) {
						const response = await callProvider({
							messages: apiMessages,
							stream: true,
							tools: TOOLS,
							tool_choice: "auto",
						});

						if (!response.ok) {
							const errorText = await response.text();
							throw new Error(
								`OpenRouter request failed (${response.status}): ${errorText || response.statusText}`,
							);
						}

						const reader = response.body?.getReader();
						if (!reader) {
							throw new Error("response body is not readable");
						}
						activeReader = reader;

						const decoder = new TextDecoder("utf-8");

						let buffer = "";
						let finished = false;

						const toolCalls = new Map<number, ToolCall>();

						try {
							readLoop: while (true) {
								const { done, value } = await reader.read();
								if (done) {
									break;
								}

								buffer += decoder.decode(value, { stream: true });

								while (true) {
									const lineEnd = buffer.indexOf("\n");
									if (lineEnd === -1) {
										break;
									}

									const line = buffer.slice(0, lineEnd).trim();
									buffer = buffer.slice(lineEnd + 1);

									if (!line.startsWith("data: ")) {
										continue;
									}

									const data = line.slice(6);
									if (data === "[DONE]") {
										finished = true;

										break readLoop;
									}

									try {
										const parsed = JSON.parse(data);
										const delta = parsed?.choices?.[0]?.delta;

										const content = delta?.content;
										if (typeof content === "string" && content.length > 0) {
											controller.enqueue(content);
										}

										const deltaToolCalls = delta?.tool_calls;
										if (Array.isArray(deltaToolCalls)) {
											deltaToolCalls.forEach(
												(toolCall: Record<string, unknown>) => {
													const idx: number = (toolCall.index as number) ?? 0;
													const existing = toolCalls.get(idx);
													const toolCallable = toolCall.function as
														| { name?: string; arguments?: string }
														| undefined;
													if (!existing) {
														toolCalls.set(idx, {
															id: (toolCall.id as string) ?? "",
															type: "function",
															function: {
																name: toolCallable?.name ?? "",
																arguments: toolCallable?.arguments ?? "",
															},
														});
													} else {
														if (toolCall.id) {
															existing.id = toolCall.id as string;
														}

														if (toolCallable?.name) {
															existing.function.name = toolCallable.name;
														}

														if (toolCallable?.arguments) {
															existing.function.arguments +=
																toolCallable.arguments;
														}
													}
												},
											);
										}
									} catch {
										// Ignore malformed partial chunks from the SSE stream.
									}
								}
							}
						} finally {
							activeReader = null;
							if (!finished) {
								await reader.cancel().catch(() => undefined);
							}
						}

						if (toolCalls.size === 0) {
							break;
						}

						const toolCallsArray = Array.from(toolCalls.values());

						apiMessages.push({
							role: "assistant",
							content: "",
							tool_calls: toolCallsArray,
						});

						toolCallsArray.forEach((tc) => {
							const result = executeToolCall(tc);

							controller.enqueue(
								`<system>Tool call: ${tc.function.name} with args: ${tc.function.arguments} \nResult: ${result}</system>`,
							);

							apiMessages.push({
								role: "tool",
								tool_call_id: tc.id,
								content: result,
							});
						});
					}

					controller.close();
				} catch (error) {
					controller.error(error);
				}
			},
			async cancel() {
				if (activeReader) {
					await activeReader.cancel();
				}
			},
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

	private mapInternalMessagesForAgent(messages: Message[]): RegularMessage[] {
		return messages.map((message) => {
			return {
				role: message.role,
				content: message.content
					.replace(/<system>[\s\S]*?<\/system>/g, "")
					.trim(),
			};
		});
	}
}
