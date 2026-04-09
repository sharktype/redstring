import type Message from "../../models/Message.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type { AVAILABLE_PROVIDER_TYPES } from "../../models/ProviderConfig.ts";
import {
	TOOLS,
	type ApiMessage,
	type ToolCall,
	type ToolContext,
	type ToolName,
} from "../../models/LLMs.ts";
import rollD20 from "../tools/rollD20.ts";
import doArithmetic from "../tools/doArithmetic.ts";
import spendMoney from "../tools/spendMoney.ts";

export const OPENROUTER_API_URL =
	"https://openrouter.ai/api/v1/chat/completions";

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

	async submit(
		messages: Message[],
		toolContext?: ToolContext,
	): Promise<ReadableStream<string>> {
		// Code largely lifted and adapted from docs. See: https://openrouter.ai/docs/api/reference/streaming

		const apiMessages: ApiMessage[] =
			this.mapInternalMessagesForAgent(messages);

		let activeReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

		const callProvider = (options: Record<string, unknown>) =>
			this.call(options);
		const executeTool = (toolCall: ToolCall) =>
			this.execute(toolCall, toolContext);

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
							const rawResult = executeTool(tc);

							let resultContent = "<toolcall ";

							resultContent += `callable="${tc.function.name}" `;
							resultContent += `args="${tc.function.arguments.replaceAll('"', "&quot;")}"`;
							resultContent += `>${rawResult}</toolcall>\n`;

							controller.enqueue(resultContent);

							apiMessages.push({
								role: "tool",
								tool_call_id: tc.id,
								content: rawResult,
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

	execute(toolCall: ToolCall, toolContext?: ToolContext): string {
		const callArguments: Record<string, unknown> = JSON.parse(
			toolCall.function.arguments || "{}",
		);

		const executor =
			OpenRouterConfig.TOOL_EXECUTORS[toolCall.function.name as ToolName];
		if (!executor) {
			return JSON.stringify({
				error: `unknown tool: ${toolCall.function.name}`,
			});
		}

		return executor(callArguments, toolContext);
	}

	// This ensures that tools are exhaustively implemented:

	private static readonly TOOL_EXECUTORS: Record<
		ToolName,
		(args: Record<string, unknown>, toolContext?: ToolContext) => string
	> = {
		roll_d20: (args) => {
			const count = (args.die_count ?? 1) as number;
			const modifier = (args.modifier ?? 0) as number;
			return JSON.stringify({ result: rollD20(count, modifier) });
		},
		do_arithmetic: (args) => {
			try {
				const expression = args.expression as string;
				const decimalPlaces = (args.decimal_places ?? 2) as number;
				return JSON.stringify({
					result: doArithmetic(expression, decimalPlaces),
				});
			} catch (e) {
				return JSON.stringify({ error: `cannot do arithmetic: ${e}` });
			}
		},
		spend_money: (args, toolContext) => {
			if (!toolContext) {
				return JSON.stringify({ error: "no player context available" });
			}

			const cost = args.cost as number;
			const isDry = (args.is_dry ?? false) as boolean;
			const result = spendMoney(toolContext.playerMoney, cost, isDry);

			if (!isDry && result.canAfford) {
				toolContext.playerMoney = result.remaining;
				toolContext.updatePlayerMoney(result.remaining);
			}

			return JSON.stringify({ result });
		},
		write_notes: (args, toolContext) => {
			if (!toolContext) {
				return JSON.stringify({ error: "no player context available" });
			}

			const content = args.content as string;
			toolContext.updatePlayerNotes(content);

			return JSON.stringify({ result: "ok" });
		},
	};

	private mapInternalMessagesForAgent(messages: Message[]): ApiMessage[] {
		return messages.map((message) => {
			return {
				role: message.role,
				content: message.content
					.replace(/<toolcall>[\s\S]*?<\/toolcall>/g, "")
					.trim(),
			};
		});
	}
}
