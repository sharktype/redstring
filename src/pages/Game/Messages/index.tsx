import { Box, Button, Container, Flex, Textarea } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import { BiSend } from "react-icons/bi";
import { useMessages } from "../../../db/hooks/useMessages";
import MessageBox from "./MessageBox";
import type Message from "../../../models/Message";
import useSubmit from "../../../handlers/hooks/useSubmit";

const SCROLL_THRESHOLD_PIXELS = 88;

export default function Messages() {
	const { messages, addMessage } = useMessages();
	const submitToStoryteller = useSubmit();

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

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
		// Auto-scroll only if the user is at the bottom when messages change.

		if (!isUserScrolledUpRef.current) {
			scrollToBottom();
		}
	}, [messages, scrollToBottom]);

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

	return (
		<Container id="messages" size="lg" flex={1} h="100%">
			<Container h="100%">
				<Flex id="outer-messages-flex" direction="column" flex={1} h="100%">
					<Box
						id="message-history"
						ref={scrollContainerRef}
						flex={1}
						px="md"
						style={{ overflowY: "auto" }}
						mt="md"
					>
						{messages.length === 0 && <h1>Your story awaits...</h1>}

						{messages.map((message) => (
							<MessageBox
								key={`message-${message.role}-${message.id}-${message.sentAt.toISOString()}`}
								message={message}
							/>
						))}

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
							autosize
						/>
						<Button
							pos="absolute"
							right={12}
							bottom={12}
							variant="light"
							size="xs"
							onClick={(e) => {
								e.preventDefault();
								submit();
							}}
						>
							<BiSend />
						</Button>
					</Box>
				</Flex>
			</Container>
		</Container>
	);
}
