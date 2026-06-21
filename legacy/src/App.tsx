import { AppShell, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import type { OpenAI } from "openai";
import { useEffect, useState } from "react";
import LlmContext from "./context/LlmContext.tsx";
import useCreateOpenAiClient from "./hooks/useCreateOpenAiClient.tsx";
import Main from "./partials/Main";
import Sidebar from "./partials/Sidebar";

function App() {
	const [isLlmStreaming, setIsLlmStreaming] = useState(false);
	const [streamingMessage, setStreamingMessage] = useState("");

	const [openAiClient, setOpenAiClient] = useState<OpenAI | undefined>(
		undefined,
	);

	const [openAiApiKey] = useLocalStorage({
		key: "open-ai-api-key",
		defaultValue: "",
	});
	const [openAiBaseUrl] = useLocalStorage({
		key: "open-ai-base-url",
		defaultValue: "",
	});

	const createOpenAiClient = useCreateOpenAiClient();

	useEffect(() => {
		if (!openAiClient && openAiApiKey && openAiBaseUrl) {
			const client = createOpenAiClient();
			if (client) {
				setOpenAiClient(client);

				console.log("INFO - OpenAI client created successfully on app init");
			} else {
				console.warn("WARN - failed to create OpenAI client on app init");
			}
		}
	}, [createOpenAiClient, openAiBaseUrl, openAiClient, openAiApiKey]);

	return (
		<MantineProvider>
			<LlmContext.Provider
				value={{
					isStreaming: isLlmStreaming,
					setIsStreaming: setIsLlmStreaming,
					streamingMessage: streamingMessage,
					setStreamingMessage: setStreamingMessage,
					openAiClient: openAiClient,
					setOpenAiClient: setOpenAiClient,
				}}
			>
				<AppShell
					navbar={{
						width: 256,
						breakpoint: "sm",
					}}
				>
					<AppShell.Navbar>
						<Sidebar />
					</AppShell.Navbar>
					<AppShell.Main>
						<Main />
					</AppShell.Main>
				</AppShell>
			</LlmContext.Provider>
		</MantineProvider>
	);
}

export default App;
