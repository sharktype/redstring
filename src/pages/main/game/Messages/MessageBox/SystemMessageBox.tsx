import { Badge, Flex, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import { useMessages } from "../../../../../db/hooks/useMessages";
import type Message from "../../../../../models/Message";
import EditModeForm from "./EditModeForm";
import HoverableMeta from "./HoverableMeta";
import MessageCard from "./MessageCard";

export default function SystemMessageBox({ message }: { message: Message }) {
	const { updateMessage, deleteMessage } = useMessages();
	const { colorScheme } = useMantineColorScheme();

	const [isEditMode, setIsEditMode] = useState(false);
	const [temporaryEditMessage, setTemporaryEditMessage] = useState(
		message.content,
	);

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
				message={message}
				align="left"
				showRegenerate={false}
				isEditMode={isEditMode}
				temporaryEditMessage={temporaryEditMessage}
				onToggleEditMode={() => setIsEditMode((prev) => !prev)}
				onConfirmEdit={() => {
					if (messageId) {
						updateMessage(messageId, {
							content: temporaryEditMessage,
							editedAt: new Date(),
						});
						setIsEditMode(false);
					}
				}}
				onDelete={() => {
					if (messageId) {
						deleteMessage(messageId);
					}
				}}
			/>
			<Flex pos="relative" justify="flex-start" w="100%">
				<Flex pos="absolute" top={-12} left={4} style={{ zIndex: 1 }}>
					<Badge color="yellow">System</Badge>
				</Flex>

				{isEditMode ? (
					<EditModeForm
						value={temporaryEditMessage}
						onChange={setTemporaryEditMessage}
					/>
				) : (
					<MessageCard
						message={message}
						bg={colorScheme === "light" ? "gray.2" : "dark.6"}
					/>
				)}
			</Flex>
		</Flex>
	);
}
