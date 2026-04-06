import { Box, Textarea, Button } from "@mantine/core";
import { useEffect, useState, type RefObject } from "react";
import { BiLock, BiSend } from "react-icons/bi";
import useLlmContext from "../../../../context/hooks/useLlmContext";
import useGameContext from "../../../../context/hooks/useGameContext";

interface MessageInputProps {
	ref: RefObject<HTMLTextAreaElement | null>;

	submit: () => void;
}

export default function MessageInput({ ref, submit }: MessageInputProps) {
	const [isDisabled, setIsDisabled] = useState(true);

	const { playerState } = useGameContext();
	const { isStreaming } = useLlmContext();

	useEffect(() => {
		setIsDisabled(isStreaming || !playerState || !playerState.isInitialized);
	}, [isStreaming, playerState]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isDisabled) {
				return;
			}

			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				submit();
			}
		};

		const textarea = ref.current;
		textarea?.addEventListener("keydown", handleKeyDown);

		return () => {
			textarea?.removeEventListener("keydown", handleKeyDown);
		};
	}, [submit, isDisabled]);

	const description = isDisabled
		? "You cannot send messages right now."
		: "Press ENTER to send. Press SHIFT + ENTER to add a new line.";

	return (
		<Box id="message-input" pos="relative" mt={4} mb="xl">
			<Textarea
				description={description}
				ref={ref}
				placeholder="What do you want to say or do?"
				minRows={5}
				maxRows={16}
				mx="md"
				autosize
			/>
			<Button
				pos="absolute"
				right={24}
				bottom={12}
				variant="light"
				size="xs"
				onClick={(e) => {
					e.preventDefault();

					submit();
				}}
				disabled={isDisabled}
			>
				{isDisabled ? <BiLock /> : <BiSend />}
			</Button>
		</Box>
	);
}
