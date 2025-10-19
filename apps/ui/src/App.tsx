import "./App.css";
import { AppShell, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Sidebar from "./partials/Sidebar";
import Main from "./partials/Main";
import { LlmProvider } from "./context/LlmContext.tsx";
import { useState } from "react";

function App() {
  const [isLlmStreaming, setIsLlmStreaming] = useState(false);

  return (
    <MantineProvider>
      <LlmProvider value={{ isStreaming: isLlmStreaming, setIsStreaming: setIsLlmStreaming }}>
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
