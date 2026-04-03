import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
import type { OpenAI } from "openai";

interface LlmData {
  isStreaming: boolean;
  setIsStreaming: Dispatch<SetStateAction<boolean>>;
  streamingMessage: string;
  setStreamingMessage: Dispatch<SetStateAction<string>>;

  openAiClient?: OpenAI;
  setOpenAiClient: Dispatch<SetStateAction<OpenAI | undefined>>;
}

const LlmContext = createContext<LlmData>({
  isStreaming: false,
  setIsStreaming: () => {},
  streamingMessage: "",
  setStreamingMessage: () => {},
  openAiClient: undefined,
  setOpenAiClient: () => {},
});

export function useLlmContext() {
  const context = useContext(LlmContext);

  if (!LlmContext) {
    throw new Error("useLlmContext must be used within a LlmProvider");
  }

  return context;
}

export const LlmProvider = LlmContext.Provider;
