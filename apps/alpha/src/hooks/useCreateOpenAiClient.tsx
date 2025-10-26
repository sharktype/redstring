import { useLocalStorage } from "@mantine/hooks";
import { OpenAI } from "openai";
import { useCallback } from "react";

export default function useCreateOpenAiClient() {
  const [openAiApiKey] = useLocalStorage({ key: "open-ai-api-key", defaultValue: "" });
  const [openAiBaseUrl] = useLocalStorage({ key: "open-ai-base-url", defaultValue: "" });
  return useCallback(() => {
    return createOpenAiClient(openAiApiKey, openAiBaseUrl);
  }, [openAiApiKey, openAiBaseUrl]);
}

function createOpenAiClient(openAiApiKey: string, openAiBaseUrl: string) {
  if (!openAiApiKey || !openAiBaseUrl) {
    return;
  }

  const client = new OpenAI({
    apiKey: openAiApiKey,
    baseURL: openAiBaseUrl,
    defaultHeaders: {},

    // Enable if you used OAuth to fetch a user-scoped `apiKey` above. See https://openrouter.ai/docs#oauth to learn how.
    dangerouslyAllowBrowser: true,
  });

  console.log("LOG - OpenAI client created:", client);

  return client;
}
