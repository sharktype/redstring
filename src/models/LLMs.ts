/**
 * These definitions are strategically defined, for now, as OpenRouter-first.
 *
 * This means they will work directly with OpenRouter and need to be mapped to work with other providers in the future.
 * This is not problematic as the usual alternative is a provider-agnostic definition that needs to be mapped anyway,
 * plus the loading of tools happens at the provider config level anyway, which does not have a performance impact.
 *
 * If the providers are too different from each other, this approach might be revisited.
 */

// TOOLS

export const TOOLS = [
	{
		type: "function",
		function: {
			name: "roll_d20",
			description: "Roll one or more d20 dice with an optional modifier.",
			parameters: {
				type: "object",
				properties: {
					die_count: {
						type: "number",
						description: "The number of d20 dice to roll. Defaults to 1.",
					},
					modifier: {
						type: "number",
						description:
							"A fixed modifier to add to the total roll. Defaults to 0.",
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "do_arithmetic",
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
					decimal_places: {
						type: "number",
						description:
							"The number of decimal places to round the result to. Defaults to 2.",
					},
				},
				required: ["expression"],
			},
		},
	},
] as const satisfies ToolDefinition[];

export type ToolName = (typeof TOOLS)[number]["function"]["name"];

/**
 * A message which can be passed directly to the API.
 *
 * All such messages must take this form.
 */
export type ApiMessage =
	| RegularMessage
	| AssistantToolCallMessage
	| ToolMessage;

/**
 * A raw message that {@link Message}s need to be mapped to.
 */
type RegularMessage = {
	role: "user" | "assistant" | "system";
	content: string;
};

/**
 * A message the assistant sends which includes tool calls.
 */
type AssistantToolCallMessage = {
	role: "assistant";
	content: string;
	tool_calls: ToolCall[];
};

/**
 * A message that represents the result of a tool call.
 */
type ToolMessage = { role: "tool"; tool_call_id: string; content: string };

/**
 * A tool call to be passed to a provider's executor.
 */
export type ToolCall = {
	id: string;
	type: "function";
	function: {
		name: string;
		arguments: string;
	};
};

/**
 * A definition of a tool's capabilities.
 */
export type ToolDefinition = {
	type: "function";
	function: {
		name: string;
		description: string;
		parameters: ToolParameters;
	};
};

type ToolParameters = {
	type: "object";
	properties: Record<string, ToolProperties>;
	required?: string[];
};

type ToolProperties = {
	type: "string" | "number" | "boolean";
	description: string;
};
