import { createContext, type Dispatch, type SetStateAction } from "react";

export interface LlmContextType {
	isStreaming: boolean;
	streamingMessage: string;
	streamingPosition: string | null;
	setStreamingMessage: Dispatch<SetStateAction<string>>;
	setStreamingPosition: Dispatch<SetStateAction<string | null>>;
	startStreaming: () => void;
	stopStreaming: () => void;
}

export const LlmContext = createContext<LlmContextType>({
	isStreaming: false,
	streamingMessage: "",
	streamingPosition: null,
	setStreamingMessage: () => undefined,
	setStreamingPosition: () => undefined,
	startStreaming: () => undefined,
	stopStreaming: () => undefined,
});

export default LlmContext;
