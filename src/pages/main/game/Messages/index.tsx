import { Box, Center, Container, Flex, Loader } from "@mantine/core";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import useLlmContext from "../../../../context/LlmContext/useLlmContext";
import { useMessages } from "../../../../db/hooks/useMessages";
import useSubmit from "../../../../handlers/hooks/useSubmit";
import type Message from "../../../../models/Message";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";

// A balance needs to be struck with this number. If this number is too low and the agent streaming is too fast, the
// scrolling behaviour might not actually work. If the number is too high, then the user cannot scroll up during
// streaming without the auto-scroll kicking in.

const SCROLL_THRESHOLD_PIXELS = 128;

export default function Messages() {
	const { isStreaming, streamingMessage, streamingPosition } = useLlmContext();
	const { messages, isLoading, addMessage } = useMessages();
	const { submit: submitToStoryteller } = useSubmit();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Refs to manage complex scrolling behaviour:

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isUserScrolledUpRef = useRef(false);
	const isFirstLoadRef = useRef(true);
	const wasStreamingRef = useRef(false);

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

	useLayoutEffect(() => {
		// Auto-scroll when messages change. Use useLayoutEffect so this runs
		// synchronously after DOM mutations but before paint — otherwise removing
		// the oldest message from the DOM causes a visible scroll jump upward
		// before the auto-scroll can correct it.

		if (!isUserScrolledUpRef.current) {
			const useInstant = isFirstLoadRef.current || wasStreamingRef.current;
			scrollToBottom(useInstant ? "instant" : "smooth");

			if (isFirstLoadRef.current && messages.length > 0) {
				isFirstLoadRef.current = false;
			}
		}

		wasStreamingRef.current = false;
	}, [messages, scrollToBottom]);

	useEffect(() => {
		// Track when streaming ends so the next message update scrolls instantly.

		if (!isStreaming) {
			wasStreamingRef.current = true;
		}
	}, [isStreaming]);

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
		const textarea = textareaRef.current;
		if (!textarea) {
			return;
		}

		const saved = localStorage.getItem("draft-message");
		if (saved) {
			textarea.value = saved;
		}

		textarea.focus();

		const handleInput = () => {
			const value = textarea.value;
			if (value) {
				localStorage.setItem("draft-message", value);
			} else {
				localStorage.removeItem("draft-message");
			}
		};

		textarea.addEventListener("input", handleInput);

		return () => {
			textarea.removeEventListener("input", handleInput);
		};
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

		localStorage.removeItem("draft-message");

		isUserScrolledUpRef.current = false;
	}, [addMessage, messages, submitToStoryteller]);

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
						{isLoading && (
							<Center h="100%">
								<Loader />
							</Center>
						)}

						{!isLoading && messagesWithStreaming.length === 0 && (
							<h1>Your story awaits...</h1>
						)}

						{messagesWithStreaming.slice(-10).map((message) => {
							return (
								<MessageBox
									key={`message-${message.role}-${message.id}-${message.sentAt.toISOString()}`}
									message={message}
								/>
							);
						})}

						<Box ref={messagesEndRef} />
					</Box>
					<MessageInput ref={textareaRef} submit={submit} />
				</Flex>
			</Container>
		</Container>
	);
}
