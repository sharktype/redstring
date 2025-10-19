import useCreateMessage from "./useCreateMessage.tsx";
import { useLocalStorage } from "@mantine/hooks";
import type MessageData from "../models/Message.ts";
import { useLlmContext } from "../context/LlmContext.tsx";
import { useCallback } from "react";
import systemPrompt from "../text/prompt-world-system.txt?raw";
import useCreateOpenAiClient from "./useCreateOpenAiClient.tsx";
import useSendHype from "./useSendHype.tsx";

export default function useSendMessage() {
  const [_, setMessages] = useLocalStorage<MessageData[]>({ key: "messages", defaultValue: [] });
  const [openAiModel] = useLocalStorage({ key: "open-ai-model", defaultValue: "" });

  const { setIsStreaming, setStreamingMessage, openAiClient, setOpenAiClient } = useLlmContext();

  const createOpenAiClient = useCreateOpenAiClient();
  const createMessage = useCreateMessage();

  const sendHype = useSendHype();

  return useCallback(
    async (messages: MessageData[]) => {
      setIsStreaming(true);

      let actualOpenAiClient = openAiClient;

      if (!openAiClient) {
        console.info("INFO - OpenAI client is not initialized when sending message; attempting to instantiate");

        const newOpenAiClient = createOpenAiClient();
        if (!newOpenAiClient) {
          console.warn("WARN - failed to create OpenAI client when sending message");

          setIsStreaming(false);

          return;
        }

        setOpenAiClient(newOpenAiClient);
        actualOpenAiClient = newOpenAiClient;

        console.log("INFO - OpenAI client created successfully when sending message");
      }

      if (!actualOpenAiClient) {
        console.error("ERROR - OpenAI client is still undefined after creation attempt");

        setIsStreaming(false);

        return;
      }

      console.log("INFO - sending message via OpenAI client");

      const userMessage = createMessage(messages);

      const stream = await actualOpenAiClient.chat.completions.create({
        model: openAiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: true,
      });

      console.log("INFO - OpenAI streaming response started");

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

      // Then we evoke Hypebot.

      console.log("INFO - invoking Hypebot after LLM response");

      void sendHype([...messages, { role: "assistant", content: fullResponse }]);
    },
    [
      openAiClient,
      setStreamingMessage,
      setIsStreaming,
      setMessages,
      openAiModel,
      createMessage,
      createOpenAiClient,
      setOpenAiClient,
      sendHype,
    ],
  );
}
