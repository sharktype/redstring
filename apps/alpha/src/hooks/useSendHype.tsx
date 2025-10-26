import useCreateHype from "./useCreateHype.tsx";
import { useLocalStorage } from "@mantine/hooks";
import type MessageData from "../models/Message.ts";
import { useLlmContext } from "../context/LlmContext.tsx";
import { useCallback } from "react";
import useCreateOpenAiClient from "./useCreateOpenAiClient.tsx";

export default function useSendHype() {
  const [openAiModel] = useLocalStorage({ key: "open-ai-model", defaultValue: "" });
  const [hypebotPrompt] = useLocalStorage({ key: "hypebot-prompt", defaultValue: "" });
  const [hypebotResponse, setHypebotResponse] = useLocalStorage({ key: "hypebot-response", defaultValue: "" });

  const { openAiClient, setOpenAiClient, setIsHypebotThinking } = useLlmContext();

  const createOpenAiClient = useCreateOpenAiClient();
  const createHype = useCreateHype();

  return useCallback(
    async (messages: MessageData[]) => {
      setIsHypebotThinking(true);

      let actualOpenAiClient = openAiClient;

      if (!openAiClient) {
        console.info("INFO - OpenAI client is not initialized when sending message; attempting to instantiate");

        const newOpenAiClient = createOpenAiClient();
        if (!newOpenAiClient) {
          console.warn("WARN - failed to create OpenAI client when sending message");

          return;
        }

        setOpenAiClient(newOpenAiClient);
        actualOpenAiClient = newOpenAiClient;

        console.log("INFO - OpenAI client created successfully when sending message");
      }

      if (!actualOpenAiClient) {
        console.error("ERROR - OpenAI client is still undefined after creation attempt");

        return;
      }

      console.log("INFO - sending message via OpenAI client");

      const hypebotMessage = createHype(messages, hypebotResponse);

      const result = await actualOpenAiClient.chat.completions.create({
        model: openAiModel,
        messages: [
          { role: "system", content: hypebotPrompt },
          { role: "user", content: hypebotMessage },
        ],
        stream: false,
      });

      const fullResponse = result.choices[0].message?.content?.replaceAll("—", " - ") || "";

      if (!fullResponse) {
        console.warn("WARN - received empty response from Hypebot");
      }

      console.log("INFO - received Hypebot response from OpenAI client");

      setHypebotResponse(fullResponse);
      setIsHypebotThinking(false);
    },
    [
      openAiClient,
      openAiModel,
      createOpenAiClient,
      setOpenAiClient,
      createHype,
      hypebotPrompt,
      setHypebotResponse,
      setIsHypebotThinking,
      hypebotResponse,
    ],
  );
}
