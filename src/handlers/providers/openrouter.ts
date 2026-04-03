import type Message from "../../models/Message.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type { AVAILABLE_PROVIDER_TYPES } from "../../models/ProviderConfig.ts";

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

	async submit(messages: Message[]): Promise<ReadableStream<string>> {
		// Code largely lifted and adapted from docs. See: https://openrouter.ai/docs/api/reference/streaming

		const response = await this.call({
			messages: this.mapMessages(messages),
			stream: true,
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

		const decoder = new TextDecoder("utf-8");

		return new ReadableStream<string>({
			async start(controller) {
				let buffer = "";
				let finished = false;

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
								const content = parsed?.choices?.[0]?.delta?.content;
								if (typeof content === "string" && content.length > 0) {
									controller.enqueue(content);
								}
							} catch {
								// Ignore malformed partial chunks from the SSE stream.
							}
						}
					}

					controller.close();
				} catch (error) {
					controller.error(error);
				} finally {
					if (!finished) {
						await reader.cancel().catch(() => {
							return undefined;
						});
					}
				}
			},
			async cancel() {
				await reader.cancel();
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

	private mapMessages(
		messages: Message[],
	): { role: "user" | "assistant" | "system"; content: string }[] {
		return messages.map((message) => {
			const sentAtSystemString = `<system>Sent at: ${message.sentAt.toISOString()}</system>`;
			const rerollCountSystemString =
				message.rerollCount !== undefined
					? `<system>Reroll count: ${message.rerollCount}</system>`
					: "";

			const content = [message.content];

			if (message.role === "system") {
				// System messages only get the content.
			} else if (message.role === "user") {
				content.push(sentAtSystemString);
			} else if (message.role === "assistant") {
				if (rerollCountSystemString) {
					content.push(rerollCountSystemString);
				}
			}

			return {
				role: message.role,
				content: content.filter((part) => part !== "").join("\n"),
			};
		});
	}
}
