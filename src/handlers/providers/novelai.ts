import type { ToolCall, ToolContext } from "../../models/LLMs.ts";
import type Message from "../../models/Message.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type {
	AVAILABLE_IMAGE_PROVIDER_TYPES,
	ProviderOutput,
} from "../../models/ProviderConfig.ts";

export const NOVELAI_GENERATE_URL =
	"https://image.novelai.net/ai/generate-image-stream";

const NEGATIVE_PROMPT =
	"lowres, artistic error, film grain, scan artifacts, worst quality, bad " +
	"quality, jpeg artifacts, very displeasing, chromatic aberration, " +
	"dithering, halftone, screentone, multiple views, logo, too many " +
	"watermarks, negative space, blank page, multiple views, character sheet, " +
	"reference sheet, turnaround, front and back, back view, from behind, " +
	"multiple angles, split screen, dual view, text";

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

	async call(options: Record<string, unknown>): Promise<Response> {
		return fetch(NOVELAI_GENERATE_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(options),
		});
	}

	async submit(
		_messages: Message[],
		_toolContext?: ToolContext,
	): Promise<ReadableStream<string>> {
		throw new Error("NovelAI does not support message submit mode.");
	}

	/**
	 * Generate an image from a prompt and optional parameters.
	 *
	 * Returns a `ReadableStream<string>` that yields exactly one value: a
	 * base64-encoded `data:image/png;base64,...` data URL containing the
	 * generated PNG image.
	 *
	 * The returned stream is compatible with `Agent.submit()`'s contract,
	 * allowing it to be consumed through `useSubmit`-style reading logic.
	 */
	async generate(
		input: string,
		parameters: Record<string, unknown> = {},
		allowNsfw?: boolean,
	): Promise<ReadableStream<string>> {
		const { width = 512, height = 512, scale = 5, steps = 23 } = parameters;

		const negativePrompt = allowNsfw
			? NEGATIVE_PROMPT
			: `${NEGATIVE_PROMPT}, nsfw`;

		const response = await this.call({
			input,
			model: this.model,
			action: "generate",
			parameters: {
				// These params we don't need to think much about. Set and forget.

				params_version: 3,
				sampler: "k_euler_ancestral",
				seed: Math.floor(Math.random() * (0xffffffff + 1)),
				n_samples: 1,
				noise_schedule: "karras",
				image_format: "png",
				stream: "msgpack",
				ucPreset: 0,
				qualityToggle: true,
				autoSmea: false,
				dynamic_thresholding: false,
				controlnet_strength: 1,
				legacy: false,
				add_original_image: true,
				cfg_rescale: 0,
				legacy_v3_extend: false,
				skip_cfg_above_sigma: null,
				use_coords: false,
				legacy_uc: false,
				normalize_reference_strength_multiple: true,
				inpaintImg2ImgStrength: 1,
				deliberate_euler_ancestral_bug: false,
				prefer_brownian: true,
				characterPrompts: [],

				// These ones might be desired to be configurable.

				width,
				height,
				scale,
				steps,

				// These are the meat of the request:

				v4_prompt: {
					caption: {
						base_caption: input,
						char_captions: [],
					},
					use_coords: false,
					use_order: true,
				},
				v4_negative_prompt: {
					caption: {
						base_caption: negativePrompt,
						char_captions: [],
					},
					legacy_uc: false,
				},
				negative_prompt: negativePrompt,
			},
			url: NOVELAI_GENERATE_URL,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`NovelAI request failed (${response.status}): ${errorText || response.statusText}`,
			);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("NovelAI response body is not readable");
		}

		return new ReadableStream<string>({
			async start(controller) {
				try {
					// Collect all response chunks into a single buffer.

					const chunks: Uint8Array[] = [];
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						chunks.push(value);
					}

					const merged = new Uint8Array(
						chunks.reduce((sum, c) => sum + c.length, 0),
					);
					let off = 0;
					for (const c of chunks) {
						merged.set(c, off);
						off += c.length;
					}

					const { decode: msgDecode } = await import("@msgpack/msgpack");

					// Stream is a sequence of length-prefixed msgpack messages: 4-byte big-endian length followed by payload.

					let pos = 0;
					while (pos + 4 <= merged.length) {
						const msgLen = new DataView(
							merged.buffer,
							merged.byteOffset + pos,
							4,
						).getUint32(0, false);

						pos += 4;

						if (pos + msgLen > merged.length) {
							break;
						}

						const payload = merged.slice(pos, pos + msgLen);

						pos += msgLen;

						const obj = msgDecode(payload) as Record<string, unknown>;
						if (!obj || typeof obj !== "object") {
							continue;
						}

						if (obj.event_type === "final") {
							let base64: string;

							if (obj.image instanceof Uint8Array) {
								base64 = btoa(
									Array.from(obj.image)
										.map((b) => String.fromCharCode(b))
										.join(""),
								);
							} else if (typeof obj.image === "string") {
								base64 = obj.image;
							} else {
								continue;
							}

							controller.enqueue(`data:image/png;base64,${base64}`);
							controller.close();

							return;
						}
					}

					throw new Error("NovelAI stream ended without producing an image.");
				} catch (error) {
					controller.error(error);
				} finally {
					await reader.cancel().catch(() => undefined);
				}
			},
			async cancel() {
				await reader.cancel().catch(() => undefined);
			},
		});
	}

	execute(_toolCall: ToolCall, _toolContext?: ToolContext): string {
		return JSON.stringify({
			error: "NovelAI does not support tool execution.",
		});
	}

	async test(): Promise<string | null> {
		throw new Error("NovelAI does not support testing.");
	}
}
