import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import LlmContext from "./index";

export default function LlmProvider({ children }: PropsWithChildren) {
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamingMessage, setStreamingMessage] = useState("");

	const startStreaming = useCallback(() => {
		setStreamingMessage("");
		setIsStreaming(true);
	}, []);

	const stopStreaming = useCallback(() => {
		setIsStreaming(false);
		setStreamingMessage("");
	}, []);

	const value = useMemo(
		() => ({
			isStreaming,
			streamingMessage,
			setStreamingMessage,
			startStreaming,
			stopStreaming,
		}),
		[
			isStreaming,
			streamingMessage,
			setStreamingMessage,
			startStreaming,
			stopStreaming,
		],
	);

	return <LlmContext.Provider value={value}>{children}</LlmContext.Provider>;
}
