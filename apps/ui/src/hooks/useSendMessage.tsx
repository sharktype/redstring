import useCreateMessage from "./useCreateMessage.tsx";
import { useLocalStorage } from "@mantine/hooks";
import type MessageData from "../models/Message.ts";
import { useLlmContext } from "../context/LlmContext.tsx";
import { useCallback } from "react";
import systemPrompt from "../text/prompt-world-system.txt?raw";

export default function useSendMessage() {
  const [messages, setMessages] = useLocalStorage<MessageData[]>({ key: "messages", defaultValue: [] });
  const [openAiModel] = useLocalStorage({ key: "open-ai-model", defaultValue: "" });

  const { setIsStreaming, setStreamingMessage, openAiClient } = useLlmContext();

  const createMessage = useCreateMessage(messages);

  return useCallback(async () => {
    if (!openAiClient) {
      console.warn("WARN - OpenAI client is not initialized when sending message");

      return;
    }

    console.log("INFO - sending message via OpenAI client");

    const userMessage = createMessage();

    const stream = await openAiClient.chat.completions.create({
      model: openAiModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    console.log("INFO - OpenAI streaming response started");

    setIsStreaming(true);

    let fullResponse = "";
    for await (const part of stream) {
      fullResponse += part.choices[0]?.delta?.content || "";

      setStreamingMessage(fullResponse);
    }

    // Once completed, we push the message to the history stack.

    // TODO: handle cancelling a prompt and persisting partial responses.

    setIsStreaming(false);
    setStreamingMessage("");
    setMessages((currentMessages) => {
      return [...currentMessages, { role: "assistant", content: fullResponse }];
    });
  }, [openAiClient, setStreamingMessage, setIsStreaming, setMessages, openAiModel, createMessage]);
}
