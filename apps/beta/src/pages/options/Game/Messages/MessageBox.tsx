import { Anchor, Badge, Text, Card, Flex, Textarea } from "@mantine/core";
import type Message from "../../../../models/Message";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useMessages } from "../../../../db/hooks/useMessages";

export default function MessageBox({ message }: { message: Message }) {
	switch (message.role) {
		case "user":
			return <UserMessageBox message={message} />;
		case "assistant":
			return <AssistantMessageBox message={message} />;
		case "system":
			return <SystemMessageBox message={message} />;
		default:
			return null;
	}
}

function UserMessageBox({ message }: { message: Message }) {
	const { updateMessage, deleteMessage } = useMessages();

	const [isEditMode, setIsEditMode] = useState(false);
	const [temporaryEditMessage, setTemporaryEditMessage] = useState(
		message.content,
	);
	const [hovered, { open, close }] = useDisclosure(false);
	const [confirmDelete, setConfirmDelete] = useState(false);

	const canConfirmEdit =
		isEditMode &&
		temporaryEditMessage.trim() !== "" &&
		temporaryEditMessage !== message.content;

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
			onMouseEnter={open}
			onMouseLeave={close}
		>
			<Text
				size="xs"
				mr="xs"
				mb="lg"
				ta="right"
				c="dimmed"
				opacity={hovered || isEditMode ? 1 : 0}
			>
				{(message.editedAt || message.sentAt).toLocaleDateString(undefined, {
					hour: "2-digit",
					minute: "2-digit",
				})}
				{", "}
				<Anchor
					size="xs"
					c="blue"
					onClick={() => {
						setConfirmDelete(false);
						setIsEditMode((prev) => !prev);
					}}
				>
					{isEditMode ? "Cancel" : "Edit"}
				</Anchor>
				{isEditMode && (
					<>
						{" | "}
						<Anchor
							size="xs"
							c={canConfirmEdit ? "green" : "dimmed"}
							style={{
								cursor: canConfirmEdit ? "pointer" : "not-allowed",
								textDecoration: canConfirmEdit ? undefined : "none",
							}}
							onClick={() => {
								if (canConfirmEdit) {
									setConfirmDelete(false);
									updateMessage(messageId, {
										content: temporaryEditMessage,
										editedAt: new Date(),
									});
									setIsEditMode(false);
								}
							}}
						>
							Confirm Edit
						</Anchor>
					</>
				)}
				{" | "}
				<Anchor
					size="xs"
					c="red"
					onClick={() => {
						if (confirmDelete) {
							deleteMessage(messageId);
						} else {
							setConfirmDelete(true);
						}
					}}
				>
					{confirmDelete ? "Click again to confirm delete!" : "Delete"}
				</Anchor>
			</Text>
			<Flex pos="relative" justify="flex-end" w="100%">
				<Flex pos="absolute" top={-12} right={4} style={{ zIndex: 1 }}>
					<Badge color="orange">You</Badge>
				</Flex>
				{isEditMode ? (
					<Textarea
						w="100%"
						minRows={3}
						autosize
						value={temporaryEditMessage}
						onChange={(e) => setTemporaryEditMessage(e.currentTarget.value)}
					/>
				) : (
					<Card bg="blue" shadow="sm" p="md">
						{message.content}
					</Card>
				)}
			</Flex>
		</Flex>
	);
}

function AssistantMessageBox({ message }: { message: Message }) {
	return null;
}

function SystemMessageBox({ message }: { message: Message }) {
	return null;
}
