import { Badge, Card, Flex, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import { useMessages } from "../../../../db/hooks/useMessages";
import type Message from "../../../../models/Message";
import EditModeForm from "./EditModeForm";
import HoverableMeta from "./HoverableMeta";

export default function AssistantMessageBox({ message }: { message: Message }) {
	const { updateMessage, deleteMessage } = useMessages();
	const { colorScheme } = useMantineColorScheme();

	const [isEditMode, setIsEditMode] = useState(false);
	const [temporaryEditMessage, setTemporaryEditMessage] = useState(
		message.content,
	);

	if (!message.id) {
		throw new Error("message must have an id to be editable or deletable");
	}

	const messageId = message.id;

	return (
		<Flex
			direction="column"
			justify="flex-start"
			mb="md"
			w="100%"
			className="message-box"
		>
			<HoverableMeta
				align="left"
				sentAt={message.sentAt}
				editedAt={message.editedAt}
				isEditMode={isEditMode}
				originalMessage={message.content}
				temporaryEditMessage={temporaryEditMessage}
				onToggleEditMode={() => setIsEditMode((prev) => !prev)}
				onConfirmEdit={() => {
					updateMessage(messageId, {
						content: temporaryEditMessage,
						editedAt: new Date(),
					});
					setIsEditMode(false);
				}}
				onDelete={() => deleteMessage(messageId)}
			/>
			<Flex pos="relative" justify="flex-start" w="100%">
				<Flex pos="absolute" top={-12} left={4} style={{ zIndex: 1 }}>
					<Badge
						color={colorScheme === "light" ? "black" : "white"}
						style={{ color: colorScheme === "light" ? "white" : "black" }}
					>
						Assistant
					</Badge>
				</Flex>

				{isEditMode ? (
					<EditModeForm
						value={temporaryEditMessage}
						onChange={setTemporaryEditMessage}
					/>
				) : (
					<Card
						bg={colorScheme === "light" ? "white" : "black"}
						shadow="sm"
						p="md"
					>
						{message.content}
					</Card>
				)}
			</Flex>
		</Flex>
	);
}
