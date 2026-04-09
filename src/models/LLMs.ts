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
	{
		type: "function",
		function: {
			name: "modify_money",
			description:
				"Modify the player's gold. Positive amounts add gold (earning/receiving), negative amounts deduct gold (spending). Use is_dry to check affordability without actually modifying.",
			parameters: {
				type: "object",
				properties: {
					amount: {
						type: "number",
						description:
							"The amount of gold to modify. Positive to give, negative to spend.",
					},
					is_dry: {
						type: "boolean",
						description:
							"If true, only checks the result without actually modifying. Defaults to false.",
					},
				},
				required: ["amount"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "write_notes",
			description:
				"Overwrite the player's character notes with new content. This replaces the entire notes field.",
			parameters: {
				type: "object",
				properties: {
					content: {
						type: "string",
						description:
							"The new content to write to the player's character notes.",
					},
				},
				required: ["content"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "write_secret",
			description:
				"Write or update a secret in the player's journal. Creates a new secret if the slug does not exist, or overwrites the existing one.",
			parameters: {
				type: "object",
				properties: {
					slug: {
						type: "string",
						description: "The slug identifier for the secret.",
					},
					content: {
						type: "string",
						description: "The content of the secret.",
					},
				},
				required: ["slug", "content"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "progress_time",
			description:
				"Advance the in-game clock by a given number of hours and/or minutes. The clock wraps around at 24 hours.",
			parameters: {
				type: "object",
				properties: {
					hours: {
						type: "number",
						description: "The number of hours to advance. Defaults to 0.",
					},
					minutes: {
						type: "number",
						description: "The number of minutes to advance. Defaults to 0.",
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "generate_name",
			description:
				"Generate three random fantasy character names. Each name comes with a gender. You must pick one of the three.",
			parameters: {
				type: "object",
				properties: {
					gender: {
						type: "string",
						enum: ["male", "female"],
						description:
							"The gender of names to generate. If omitted, each name is randomly male or female.",
					},
				},
			},
		},
	},
] as const satisfies ToolDefinition[];

export type ToolName = (typeof TOOLS)[number]["function"]["name"];

/**
 * Context provided to tools when they are executed where they need to cause React-specific side effects.
 */
export interface ToolContext {
	playerMoney: number;
	playerTime: { hour: number; minute: number };

	updatePlayerMoney: (newAmount: number) => void;
	updatePlayerNotes: (content: string) => void;
	updateSecret: (slug: string, content: string) => void;
	updatePlayerTime: (hour: number, minute: number) => void;
}

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
	enum?: readonly string[];
};
