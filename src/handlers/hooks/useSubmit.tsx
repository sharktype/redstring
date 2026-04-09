import { useCallback } from "react";
import useGameContext from "../../context/hooks/useGameContext";
import useLlmContext from "../../context/hooks/useLlmContext";
import { useMessages } from "../../db/hooks/useMessages";
import type { ToolContext } from "../../models/LLMs";
import type Message from "../../models/Message";
import usePresystemMessage from "./usePresystemMessage";

export default function useSubmit() {
	const {
		agentConfigs,
		messages,
		addMessage,
		playerState,
		updatePlayerState,
		gameState,
		updateGameState,
	} = useGameContext();
	const {
		isStreaming,
		startStreaming,
		stopStreaming,
		setStreamingMessage,
		setStreamingPosition,
	} = useLlmContext();
	const { deleteMessage } = useMessages();
	const { buildPresystemMessage } = usePresystemMessage();

	const streamResponse = useCallback(
		async (
			historyToSubmit: Message[],
			responseMeta: Omit<Message, "id" | "content">,
			streamingPosition: string | null = null,
		) => {
			const storytellerAgent = agentConfigs.find(
				(agent) => agent.type === "storyteller",
			);
			if (!storytellerAgent || !storytellerAgent.providerConfigId) {
				return;
			}

			// null means to place the streaming message at the end.

			setStreamingPosition(streamingPosition);
			startStreaming();

			// Note to devs: this needs to be totally agnostic to the provider.

			const toolContext: ToolContext = {
				playerMoney: playerState?.money ?? 0,
				playerTime: playerState?.time ?? { hour: 0, minute: 0 },
				updatePlayerMoney: (newAmount: number) => {
					updatePlayerState({ money: newAmount });
				},
				updatePlayerNotes: (content: string) => {
					updatePlayerState({ stats: { textual: content } });
				},
				updateSecret: (slug: string, content: string) => {
					updateGameState({
						secrets: { ...gameState?.secrets, [slug]: content },
					});
				},
				updatePlayerTime: (hour: number, minute: number) => {
					updatePlayerState({ time: { hour, minute } });
				},
			};

			const presystemMessage = buildPresystemMessage();
			const messagesWithPresystem = presystemMessage
				? [...historyToSubmit, presystemMessage]
				: historyToSubmit;

			const readableStream = await storytellerAgent.submit(
				messagesWithPresystem,
				toolContext,
			);
			const reader = readableStream.getReader();
			let fullResponse = "";

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						break;
					}

					fullResponse += value.replaceAll("—", " - ").replaceAll("–", " - ");
					setStreamingMessage(fullResponse.trim());
				}
			} catch (error) {
				console.error("error reading from stream:", error);
			} finally {
				if (fullResponse.trim() !== "") {
					await addMessage({
						content: fullResponse.trim(),
						...responseMeta,
					});
				}

				stopStreaming();
			}
		},
		[
			addMessage,
			agentConfigs,
			buildPresystemMessage,
			playerState,
			updatePlayerState,
			setStreamingMessage,
			setStreamingPosition,
			startStreaming,
			stopStreaming,
		],
	);

	const submit = useCallback(
		async (messagesToSubmit: Message[]) => {
			if (messagesToSubmit.length === 0 || isStreaming) {
				return;
			}

			await streamResponse(messagesToSubmit, {
				role: "assistant",
				sentAt: new Date(),
			});
		},
		[isStreaming, streamResponse],
	);

	const regenerate = useCallback(
		async (targetMessage: Message) => {
			if (isStreaming || !targetMessage.id) {
				return;
			}

			const allMessages = [...messages];

			// This target is the message that was used to regenerate, not necessarily the message to be regenerated.

			const targetIndex = allMessages.findIndex(
				(m) => m.id === targetMessage.id,
			);
			if (targetIndex === -1) {
				return;
			}

			let historyToSubmit: Message[];
			let originalSentAt: Date;
			let originalRerollCount: number;
			let streamingPosition: string | null;

			// Regenerate on a user message regenerates the next message, not the user message itself.

			if (targetMessage.role === "user") {
				// If the next message isn't an assistant message, that means a message was deleted.

				const nextMessage = allMessages[targetIndex + 1];
				if (nextMessage?.role === "assistant" && nextMessage.id) {
					originalSentAt = nextMessage.sentAt;
					originalRerollCount = nextMessage.rerollCount ?? 0;

					// We do not give the old message to the agent.

					streamingPosition = nextMessage.sentAt.toISOString();

					setStreamingPosition(streamingPosition);
					startStreaming();

					await deleteMessage(nextMessage.id);
				} else {
					originalSentAt = new Date(targetMessage.sentAt.getTime() + 1);
					originalRerollCount = 0;

					// If the old message was deleted, we need to set the send at of the new message to be just after
					// the previous message. We'll just assume that no message could be sent within the same
					// millisecond as the original message.

					streamingPosition = new Date(
						targetMessage.sentAt.getTime() + 1,
					).toISOString();
				}

				historyToSubmit = allMessages.slice(0, targetIndex + 1);
			} else {
				originalSentAt = targetMessage.sentAt;
				originalRerollCount = targetMessage.rerollCount ?? 0;

				streamingPosition = targetMessage.sentAt.toISOString();

				setStreamingPosition(streamingPosition);
				startStreaming();

				await deleteMessage(targetMessage.id);

				historyToSubmit = allMessages.slice(0, targetIndex);
			}

			// Note streaming can and should start before this call for cases where messages needed to be deleted.

			await streamResponse(
				historyToSubmit,
				{
					role: "assistant",
					sentAt: originalSentAt,
					rerolledAt: new Date(),
					rerollCount: originalRerollCount + 1,
				},
				streamingPosition,
			);
		},
		[
			isStreaming,
			messages,
			deleteMessage,
			streamResponse,
			setStreamingPosition,
			startStreaming,
		],
	);

	return { submit, regenerate };
}
