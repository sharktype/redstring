import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import LlmContext from "./index";

export default function LlmProvider({ children }: PropsWithChildren) {
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamingMessage, setStreamingMessage] = useState("");
	const [streamingPosition, setStreamingPosition] = useState<string | null>(
		null,
	);

	const startStreaming = useCallback(() => {
		setStreamingMessage("");
		setIsStreaming(true);
	}, []);

	const stopStreaming = useCallback(() => {
		setIsStreaming(false);
	}, []);

	const value = useMemo(
		() => ({
			isStreaming,
			streamingMessage,
			streamingPosition,
			setStreamingMessage,
			setStreamingPosition,
			startStreaming,
			stopStreaming,
		}),
		[
			isStreaming,
			streamingMessage,
			streamingPosition,
			setStreamingMessage,
			setStreamingPosition,
			startStreaming,
			stopStreaming,
		],
	);

	return <LlmContext.Provider value={value}>{children}</LlmContext.Provider>;
}
