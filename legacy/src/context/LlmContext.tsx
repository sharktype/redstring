import type { OpenAI } from "openai";
import { createContext, type Dispatch, type SetStateAction } from "react";

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
	setIsStreaming: () => null,
	streamingMessage: "",
	setStreamingMessage: () => null,
	openAiClient: undefined,
	setOpenAiClient: () => null,
});

export default LlmContext;
