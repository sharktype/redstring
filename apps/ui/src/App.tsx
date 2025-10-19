import "./App.css";
import { AppShell, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Sidebar from "./partials/Sidebar";
import Main from "./partials/Main";

function App() {
  return (
    <MantineProvider>
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
    </MantineProvider>
  );
}

export default App;
