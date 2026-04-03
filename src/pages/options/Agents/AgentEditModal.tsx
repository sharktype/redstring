import { useState } from "react";
import { Button, Modal, Stack, Textarea } from "@mantine/core";

interface AgentEditModalProps {
	opened: boolean;
	onClose: () => void;
	title: string;
	value: string;
	setPrompt: (value: string) => void;
	defaultPrompt: string;
}

export default function AgentEditModal({
	opened,
	onClose,
	title,
	value,
	setPrompt,
	defaultPrompt,
}: AgentEditModalProps) {
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleReset = () => {
		if (showConfirmation) {
			setPrompt(defaultPrompt);
			setShowConfirmation(false);
		} else {
			setShowConfirmation(true);
		}
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Edit ${title} Prompt`}
			size="lg"
		>
			<Stack>
				<Textarea
					autosize
					minRows={4}
					value={value}
					placeholder={`Prompt given to the ${title.toLowerCase()} agent.`}
					onChange={(e) => setPrompt(e.currentTarget.value)}
				/>
				<Button
					variant="outline"
					color={showConfirmation ? "red" : undefined}
					onClick={handleReset}
				>
					{showConfirmation
						? "Click again if you're sure you want to reset to the default prompt!"
						: "Reset to default prompt"}
				</Button>
			</Stack>
		</Modal>
	);
}
