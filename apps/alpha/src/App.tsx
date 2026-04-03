import "./App.css";
import { AppShell, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Sidebar from "./partials/Sidebar";
import Main from "./partials/Main";
import { LlmProvider } from "./context/LlmContext.tsx";
import { useEffect, useState } from "react";
import type { OpenAI } from "openai";
import useCreateOpenAiClient from "./hooks/useCreateOpenAiClient.tsx";
import { useLocalStorage } from "@mantine/hooks";

function App() {
  const [isLlmStreaming, setIsLlmStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  const [openAiClient, setOpenAiClient] = useState<OpenAI | undefined>(undefined);

  const [openAiApiKey] = useLocalStorage({ key: "open-ai-api-key", defaultValue: "" });
  const [openAiBaseUrl] = useLocalStorage({ key: "open-ai-base-url", defaultValue: "" });

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
  }, []);

  return (
    <MantineProvider>
      <LlmProvider
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
      </LlmProvider>
    </MantineProvider>
  );
}

export default App;
