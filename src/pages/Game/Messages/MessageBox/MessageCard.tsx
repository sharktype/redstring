import { Card, Text, Badge, List, Code, Title } from "@mantine/core";
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

// TODO: Not allowed to use a Badge here.

export default function MessageCard({ message, bg }: MessageCardProps) {
	return (
		<Card
			bg={bg}
			shadow="sm"
			p="md"
			w={message.role === "assistant" ? "100%" : "auto"}
		>
			<ReactMarkdown
				id={`message-content-${message.id}`}
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					h1: ({ node: _, ...props }) => <Title order={1} {...props} />,
					h2: ({ node: _, ...props }) => <Title order={2} {...props} />,
					p: ({ node: _, ...props }) => <Text mb="xs" {...props} />,
					ul: ({ node: _, ...props }) => (
						<List withPadding pt="xs" {...props} />
					),
					ol: ({ node: _, ...props }) => (
						<List withPadding {...{ props, type: "ordered" }} />
					),
					li: ({ node: _, ...props }) => <List.Item {...props} />,
					code: ({ node: _, ...props }) => <Code {...props} />,
					system: ({ children, callable, args }) => {
						let parsedResult: string = children as string;
						try {
							parsedResult = JSON.parse(parsedResult);
						} catch {
							// If parsing fails, we'll just use the raw string.
						}

						const { icon, color, content } = mapToolCallResultToDisplay(
							callable as string,
							args as string,
							JSON.stringify(parsedResult),
						);

						return (
							<span style={{ display: "block", margin: "12px 0" }}>
								<Badge color={color} leftSection={icon} component="span">
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

	const parsedArgs = JSON.parse(args);
	const parsedResult = JSON.parse(result).result;

	try {
		if (callable === "roll_d20") {
			const modifierText = parsedArgs.modifier
				? `${parsedArgs.modifier > 0 ? "+" : ""}${parsedArgs.modifier}`
				: "";

			return {
				icon: <LiaDiceD20Solid />,
				color: "grape",
				content: `Rolled ${parsedArgs.die_count || ""}d20${modifierText} = ${parsedResult.total}`,
			};
		}

		if (callable === "arithmetic") {
			return {
				icon: <BiCalculator />,
				color: "blue",
				content: `${parsedArgs.expression} = ${parsedResult}`,
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
