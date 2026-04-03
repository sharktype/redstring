import { Card, Box, Badge } from "@mantine/core";
import type Message from "../../../../models/Message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { ReactNode } from "react";
import { LiaDiceD20Solid } from "react-icons/lia";
import { BiCalculator } from "react-icons/bi";

interface MessageCardProps {
	message: Message;
	bg?: string;
}

export default function MessageCard({ message, bg }: MessageCardProps) {
	return (
		<Card
			bg={bg}
			shadow="sm"
			p="md"
			w={message.role === "assistant" ? "100%" : "auto"}
			style={{ whiteSpace: "pre-wrap" }}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					system: ({ children, callable, args }) => {
						let parsedResult: string = children as string;
						try {
							parsedResult = JSON.parse(parsedResult);
							console.log(parsedResult);
						} catch {
							// If parsing fails, we'll just use the raw string.
						}

						const { icon, color, content } = mapToolCallResultToDisplay(
							callable as string,
							args as string,
							JSON.stringify(parsedResult),
						);

						return (
							<span style={{ display: "block" }}>
								<Badge color={color} leftSection={icon}>
									{content}
								</Badge>
							</span>
						);
					},
				}}
			>
				{message.content.trim() || "..."}
			</ReactMarkdown>
		</Card>
	);
}

function mapToolCallResultToDisplay(
	callable: string,
	args: string,
	result: string,
): {
	icon: ReactNode;
	color: string;
	content: string;
} {
	// TODO: This should not rely on hardcoded tool names.

	console.log(callable, args, result);

	try {
		if (callable === "roll_d20") {
			const parsed = JSON.parse(result).result;
			const rolls: number[] = parsed.rolls;
			const modifier: number = parsed.modifier;
			const total: number = parsed.total;
			const rollsStr =
				rolls.length > 1 ? `[${rolls.join(", ")}]` : `${rolls[0]}`;
			const modStr =
				modifier !== 0 ? ` ${modifier > 0 ? "+" : ""}${modifier}` : "";

			return {
				icon: <LiaDiceD20Solid />,
				color: "grape",
				content: `Rolled ${rolls.length}d20${modStr}: ${rollsStr}${modStr} = ${total}`,
			};
		}

		if (callable === "arithmetic") {
			const parsedArgs = JSON.parse(args);
			return {
				icon: <BiCalculator />,
				color: "blue",
				content: `${parsedArgs.expression} = ${result}`,
			};
		}
	} catch (e) {
		return {
			icon: null,
			color: "red",
			content: `Error parsing result of tool "${callable}": ${e}.`,
		};
	}

	return {
		icon: null,
		color: "gray",
		content: `The tool "${callable}" is not recognized.`,
	};
}
