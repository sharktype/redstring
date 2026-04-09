import {
	Card,
	Text,
	List,
	Code,
	Title,
	Stack,
	Divider,
	ListItem,
} from "@mantine/core";
import type Message from "../../../../../models/Message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Spoiler from "./Spoiler";
import ToolCall, { type ToolCallProps } from "./ToolCall";

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
		>
			<Stack gap="md">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw]}
					components={{
						h1: ({ node: _, ...props }) => <Title order={1} {...props} />,
						h2: ({ node: _, ...props }) => <Title order={2} {...props} />,
						h3: ({ node: _, ...props }) => <Title order={3} {...props} />,
						h4: ({ node: _, ...props }) => <Title order={4} {...props} />,
						h5: ({ node: _, ...props }) => <Title order={5} {...props} />,
						h6: ({ node: _, ...props }) => <Title order={6} {...props} />,
						p: ({ node: _, ...props }) => <Text {...props} />,
						ul: ({ node: _, ...props }) => (
							<List withPadding {...{ props, type: "unordered" }}>
								{props.children}
							</List>
						),
						ol: ({ node: _, ...props }) => (
							<List withPadding {...{ props, type: "ordered" }}>
								{props.children}
							</List>
						),
						li: ({ node: _, ...props }) => <ListItem {...props} />,
						hr: ({ node: _, ...props }) => <Divider {...props} />,
						code: ({ node: _, ...props }) => <Code {...props} />,

						// Custom:

						spoiler: ({ node: _, ...props }) => <Spoiler {...props} />,
						toolcall: ({ ...props }: ToolCallProps) => <ToolCall {...props} />,
					}}
				>
					{message.content.trim() || "..."}
				</ReactMarkdown>
			</Stack>
		</Card>
	);
}
