import { createContext, useContext } from "react";

interface LlmData {
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
}

const LlmContext = createContext<LlmData>({
  isStreaming: false,
  setIsStreaming: () => {},
});

export function useLlmContext() {
  const { isStreaming, setIsStreaming } = useContext(LlmContext);

  if (!LlmContext) {
    throw new Error("useLlmContext must be used within a LlmProvider");
  }

  return { isStreaming, setIsStreaming };
}

export const LlmProvider = LlmContext.Provider;
