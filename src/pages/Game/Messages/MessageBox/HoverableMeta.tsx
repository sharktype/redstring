import { Anchor, Text } from "@mantine/core";
import { useState } from "react";

interface HoverableMetaProps {
	isHovered: boolean;
	align?: "left" | "right";

	// Metadata information:

	sentAt: Date;
	editedAt?: Date;

	// Editing:

	isEditMode: boolean;
	originalMessage: string;
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
	isHovered,
	align = "right",
	sentAt,
	editedAt,
	isEditMode,
	originalMessage,
	temporaryEditMessage,
	onToggleEditMode,
	onConfirmEdit,
	onDelete,
}: HoverableMetaProps) {
	const [confirmDelete, setConfirmDelete] = useState(false);

	const canConfirmEdit =
		isEditMode &&
		temporaryEditMessage.trim() !== "" &&
		temporaryEditMessage !== originalMessage;

	return (
		<Text
			size="xs"
			mb="lg"
			ta={align}
			c="dimmed"
			opacity={isHovered || isEditMode ? 1 : 0}
			{...(align === "right" ? { mr: "xs" } : { ml: "xs" })}
		>
			{(editedAt || sentAt).toLocaleDateString(undefined, {
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
		</Text>
	);
}
