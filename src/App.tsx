import "@mantine/core/styles.css";
import "./App.css";

import { Route, Routes } from "react-router";
import Game from "./pages/main/game/index.tsx";
import AppShellLayout from "./layouts/AppShellLayout.tsx";
import Providers from "./pages/main/options/Providers/index.tsx";
import Agents from "./pages/main/options/Agents/index.tsx";
import { MantineProvider } from "@mantine/core";
import GameProvider from "./context/GameContext/GameProvider.tsx";
import Locations from "./pages/main/options/Map/index.tsx";
import LlmProvider from "./context/LlmContext/LlmProvider.tsx";

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
								<Route path="/options/map" element={<Locations />} />
							</Route>
						</Route>
					</Routes>
				</GameProvider>
			</LlmProvider>
		</MantineProvider>
	);
}

export default App;
