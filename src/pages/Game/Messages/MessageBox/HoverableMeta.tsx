import { Anchor, Text } from "@mantine/core";
import { useState } from "react";
import useSubmit from "../../../../handlers/hooks/useSubmit";
import type Message from "../../../../models/Message";

interface HoverableMetaProps {
	message: Message;

	align?: "left" | "right";

	isBeingStreamed?: boolean;

	// Editing:

	isEditMode: boolean;
	temporaryEditMessage: string;

	onToggleEditMode: () => void;
	onConfirmEdit: () => void;

	// Deleting:

	onDelete: () => void;
}

/**
 * A text strip with the ability to edit and delete the message, as well as showing time and other metadata.
 *
 * @param props {HoverableMetaProps} the props for the hoverable meta component
 */
export default function HoverableMeta({
	message,
	align = "right",
	isBeingStreamed,
	isEditMode,
	temporaryEditMessage,
	onToggleEditMode,
	onConfirmEdit,
	onDelete,
}: HoverableMetaProps) {
	const { regenerate } = useSubmit();

	const [confirmDelete, setConfirmDelete] = useState(false);

	const canConfirmEdit =
		isEditMode &&
		temporaryEditMessage.trim() !== "" &&
		temporaryEditMessage !== message.content;

	if (isBeingStreamed) {
		return (
			<Text
				size="xs"
				mb="lg"
				ta={align}
				c="dimmed"
				{...(align === "right" ? { mr: "xs" } : { ml: "xs" })}
			>
				Streaming...
			</Text>
		);
	}

	// data-edit-mode is used for the hover CSS.

	return (
		<Text
			size="xs"
			mb="lg"
			ta={align}
			c="dimmed"
			{...(align === "right" ? { mr: "xs" } : { ml: "xs" })}
			data-edit-mode={isEditMode}
			className="hoverable-meta"
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
					onToggleEditMode();
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
								onConfirmEdit();
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
						onDelete();
					} else {
						setConfirmDelete(true);
					}
				}}
			>
				{confirmDelete ? "Click again to confirm delete!" : "Delete"}
			</Anchor>
			{" | "}
			<Anchor size="xs" c="teal" onClick={() => void regenerate(message)}>
				Regenerate
			</Anchor>
		</Text>
	);
}
