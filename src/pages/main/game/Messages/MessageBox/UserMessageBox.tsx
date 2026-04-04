import { Badge, Flex } from "@mantine/core";
import { useState } from "react";
import { useMessages } from "../../../../../db/hooks/useMessages";
import type Message from "../../../../../models/Message";
import EditModeForm from "./EditModeForm";
import HoverableMeta from "./HoverableMeta";
import MessageCard from "./MessageCard";

export default function UserMessageBox({ message }: { message: Message }) {
	const { updateMessage, deleteMessage } = useMessages();

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
			justify="flex-end"
			mb="md"
			w="100%"
			className="message-box"
		>
			<HoverableMeta
				message={message}
				isEditMode={isEditMode}
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
			<Flex pos="relative" justify="flex-end" w="100%">
				<Flex pos="absolute" top={-12} right={4} style={{ zIndex: 1 }}>
					<Badge color="orange">You</Badge>
				</Flex>

				{isEditMode ? (
					<EditModeForm
						value={temporaryEditMessage}
						onChange={setTemporaryEditMessage}
					/>
				) : (
					<MessageCard message={message} bg="blue" />
				)}
			</Flex>
		</Flex>
	);
}
