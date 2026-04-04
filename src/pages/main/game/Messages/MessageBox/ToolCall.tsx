import { Badge } from "@mantine/core";
import type { PropsWithChildren, ReactNode } from "react";
import type { ToolName } from "../../../../../models/LLMs";

/**
 * The props for a displayed tool call result in the message content.
 *
 * Note that the result is always the children as a string, and the arguments cannot be more safely typed since they
 * must be passed as a string on the XML parameter.
 */
export interface ToolCallProps extends PropsWithChildren {
	callable: ToolName;
	args: string;
}

export default function ToolCall({ children, callable, args }: ToolCallProps) {
	let parsedResult: string = children as string;
	try {
		parsedResult = JSON.parse(parsedResult);
	} catch {
		// If parsing fails, we'll just use the raw string.
	}

	const { icon, color, content } = mapToolCallResultToDisplay(
		callable,
		args,
		JSON.stringify(parsedResult),
	);

	return (
		<span style={{ display: "block", margin: "12px 0" }}>
			<Badge color={color} leftSection={icon} component="span">
				{content}
			</Badge>
		</span>
	);
}

type ToolDisplayResult = { icon: ReactNode; color: string; content: string };

const TOOL_DISPLAY: Record<
	ToolName,
	(args: Record<string, unknown>, result: unknown) => ToolDisplayResult
> = {
	roll_d20: (args, result) => {
		const castResult = result as { total: number };
		const modifierText = args.modifier
			? `${(args.modifier as number) > 0 ? "+" : ""}${args.modifier}`
			: "";
		return {
			icon: "🎲",
			color: "grape",
			content: `Rolled ${args.die_count || ""}d20${modifierText} = ${castResult.total}`,
		};
	},
	do_arithmetic: (args, result) => ({
		icon: "🧮",
		color: "blue",
		content: `${args.expression} = ${result}`,
	}),
};

function mapToolCallResultToDisplay(
	callable: ToolName,
	args: string,
	result: string,
): ToolDisplayResult {
	try {
		const parsedArgs = JSON.parse(args);
		const parsedResult = JSON.parse(result).result;

		return TOOL_DISPLAY[callable](parsedArgs, parsedResult);
	} catch (e) {
		return {
			icon: null,
			color: "red",
			content: `Error parsing result of tool "${callable}": ${e}.`,
		};
	}
}
