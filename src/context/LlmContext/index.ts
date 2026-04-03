import { createContext, type Dispatch, type SetStateAction } from "react";

export interface LlmContextType {
	isStreaming: boolean;
	streamingMessage: string;
	setStreamingMessage: Dispatch<SetStateAction<string>>;
	startStreaming: () => void;
	stopStreaming: () => void;
}

export const LlmContext = createContext<LlmContextType>({
	isStreaming: false,
	streamingMessage: "",
	setStreamingMessage: () => undefined,
	startStreaming: () => undefined,
	stopStreaming: () => undefined,
});

export default LlmContext;
