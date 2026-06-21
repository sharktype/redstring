import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./App.css";

import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router";
import GameProvider from "./context/GameContext/GameProvider.tsx";
import LlmProvider from "./context/LlmContext/LlmProvider.tsx";
import AppShellLayout from "./layouts/AppShellLayout.tsx";
import Game from "./pages/main/game/index.tsx";
import Agents from "./pages/main/options/Agents/index.tsx";
import Providers from "./pages/main/options/Providers/index.tsx";

function App() {
	return (
		<MantineProvider defaultColorScheme="dark">
			<LlmProvider>
				<GameProvider>
					<Routes>
						<Route element={<AppShellLayout />}>
							<Route index element={<Game />} />
							<Route path="/options">
								<Route index element={<Providers />} />
								<Route path="/options/providers" element={<Providers />} />
								<Route path="/options/agents" element={<Agents />} />
							</Route>
						</Route>
					</Routes>
				</GameProvider>
			</LlmProvider>
		</MantineProvider>
	);
}

export default App;
