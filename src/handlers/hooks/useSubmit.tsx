import { useCallback } from "react";
import useGameContext from "../../context/hooks/useGameContext";
import useLlmContext from "../../context/hooks/useLlmContext";
import type Message from "../../models/Message";

export default function useSubmit() {
	const { agentConfigs, addMessage } = useGameContext();
	const { isStreaming, startStreaming, stopStreaming, setStreamingMessage } =
		useLlmContext();

	const submit = useCallback(
		async (messages: Message[]) => {
			if (messages.length === 0 || isStreaming) {
				return;
			}

			const storytellerAgent = agentConfigs.find(
				(agent) => agent.type === "storyteller",
			);
			if (!storytellerAgent || !storytellerAgent.providerConfigId) {
				return;
			}

			startStreaming();

			// Note to devs: this needs to be totally agnostic to the provider.

			const readableStream = await storytellerAgent.submit(messages);
			const reader = readableStream.getReader();
			let fullResponse = "";

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						break;
					}

					fullResponse += value.replaceAll("—", " - ").replaceAll("–", " - ");
					setStreamingMessage(fullResponse);
				}
			} catch (error) {
				console.error("error reading from stream:", error);
			} finally {
				if (fullResponse.trim() !== "") {
					await addMessage({
						content: fullResponse,
						role: "assistant",
						sentAt: new Date(),
					});
				}

				stopStreaming();
			}
		},
		[
			addMessage,
			agentConfigs,
			isStreaming,
			setStreamingMessage,
			startStreaming,
			stopStreaming,
		],
	);

	return submit;
}
