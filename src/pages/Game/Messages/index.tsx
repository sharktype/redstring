import { Box, Button, Container, Flex, Textarea } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import { BiSend } from "react-icons/bi";
import { useMessages } from "../../../db/hooks/useMessages";
import MessageBox from "./MessageBox";
import type Message from "../../../models/Message";
import useSubmit from "../../../handlers/hooks/useSubmit";
import useLlmContext from "../../../context/hooks/useLlmContext";

// A balance needs to be struck with this number. If this number is too low and the agent streaming is too fast, the
// scrolling behaviour might not actually work. If the number is too high, then the user cannot scroll up during
// streaming without the auto-scroll kicking in.

const SCROLL_THRESHOLD_PIXELS = 128;

export default function Messages() {
	const { isStreaming, streamingMessage, streamingPosition } = useLlmContext();
	const { messages, addMessage } = useMessages();
	const { submit: submitToStoryteller } = useSubmit();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Refs to manage complex scrolling behaviour:

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isUserScrolledUpRef = useRef(false);

	// Logic for message list behaviour:

	const isAtBottom = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container) {
			return true;
		}

		return (
			container.scrollHeight - container.scrollTop - container.clientHeight <
			SCROLL_THRESHOLD_PIXELS
		);
	}, []);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
		messagesEndRef.current?.scrollIntoView({ behavior });
	}, []);

	useEffect(() => {
		// Track user scroll position.

		const container = scrollContainerRef.current;
		if (!container) {
			return;
		}

		const handleScroll = () => {
			isUserScrolledUpRef.current = !isAtBottom();
		};

		container.addEventListener("scroll", handleScroll);

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [isAtBottom]);

	useEffect(() => {
		// Auto-scroll when messages change.

		if (!isUserScrolledUpRef.current) {
			scrollToBottom();
		}
	}, [messages, scrollToBottom]);

	useEffect(() => {
		// Complex auto-scroll for quick streaming messages.

		if (!isStreaming) {
			return;
		}

		const container = scrollContainerRef.current;
		if (!container) {
			return;
		}

		const observer = new MutationObserver(() => {
			if (!isUserScrolledUpRef.current) {
				scrollToBottom("instant");
			}
		});

		observer.observe(container, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return () => {
			observer.disconnect();
		};
	}, [isStreaming, scrollToBottom]);

	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	// Logic to handle submission of messages:

	const submit = useCallback(() => {
		const value = textareaRef.current?.value;
		if (!value || value.trim() === "") {
			return;
		}

		const newMessage: Message = {
			content: value.trim(),
			role: "user",
			sentAt: new Date(),
		};

		addMessage(newMessage);
		void submitToStoryteller([...messages, newMessage]);

		if (textareaRef.current) {
			textareaRef.current.value = "";
		}

		isUserScrolledUpRef.current = false;
	}, [addMessage, messages, submitToStoryteller]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				submit();
			}
		};

		const textarea = textareaRef.current;
		textarea?.addEventListener("keydown", handleKeyDown);

		return () => {
			textarea?.removeEventListener("keydown", handleKeyDown);
		};
	}, [submit]);

	// Messages are already sorted. Insert the streaming message at its sorted position by scanning from the end.

	const messagesWithStreaming: Message[] = (() => {
		if (!isStreaming) {
			return messages;
		}

		const sentAt = streamingPosition ? new Date(streamingPosition) : undefined;

		const streaming = {
			role: "assistant" as const,
			content: streamingMessage || "_Generating..._",
			sentAt: sentAt || new Date(),
		};

		const streamingTime = sentAt?.getTime() ?? Number.POSITIVE_INFINITY;

		// When regenerating, filter out the old assistant message at the streaming position so both don't appear
		// simultaneously.

		const baseMessages = streamingPosition
			? messages.filter(
					(m) =>
						!(m.role === "assistant" && m.sentAt?.getTime() === streamingTime),
				)
			: messages;

		let index = baseMessages.length;
		while (
			index > 0 &&
			(baseMessages[index - 1].sentAt?.getTime() ?? Number.POSITIVE_INFINITY) >
				streamingTime
		) {
			index--;
		}

		return [
			...baseMessages.slice(0, index),
			streaming,
			...baseMessages.slice(index),
		];
	})();

	return (
		<Container id="messages" size="lg" flex={1} h="100%">
			<Container h="100%">
				<Flex id="outer-messages-flex" direction="column" flex={1} h="100%">
					<Box
						id="message-history"
						ref={scrollContainerRef}
						flex={1}
						px="md"
						pt="xl"
						style={{ overflowY: "auto" }}
					>
						{messagesWithStreaming.length === 0 && (
							<h1>Your story awaits...</h1>
						)}

						{messagesWithStreaming.map((message) => {
							return (
								<MessageBox
									key={`message-${message.role}-${message.id}-${message.sentAt.toISOString()}`}
									message={message}
								/>
							);
						})}

						<Box ref={messagesEndRef} />
					</Box>
					<Box id="message-input" pos="relative" mt={4} mb="xl">
						<Textarea
							description="Press ENTER to send. Press SHIFT + ENTER to add a new line."
							ref={textareaRef}
							placeholder="Type your command here..."
							minRows={5}
							maxRows={16}
							mx="md"
							disabled={isStreaming}
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
							disabled={isStreaming}
						>
							<BiSend />
						</Button>
					</Box>
				</Flex>
			</Container>
		</Container>
	);
}
