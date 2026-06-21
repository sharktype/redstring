import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./App.css";

import { MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router";
import GameProvider from "./context/GameContext/GameProvider.tsx";
import LlmProvider from "./context/LlmContext/LlmProvider.tsx";
import AppShellLayout from "./layouts/AppShellLayout.tsx";
import Game from "./pages/main/game/index.tsx";
import ImageAgents from "./pages/main/options/Agents/ImageAgents.tsx";
import TextAgents from "./pages/main/options/Agents/TextAgents.tsx";
import ImageProviders from "./pages/main/options/Providers/ImageProviders.tsx";
import TextProviders from "./pages/main/options/Providers/TextProviders.tsx";

function App() {
	return (
		<MantineProvider defaultColorScheme="dark">
			<LlmProvider>
				<GameProvider>
					<Routes>
						<Route element={<AppShellLayout />}>
							<Route index element={<Game />} />
							<Route path="/options">
								<Route index element={<TextProviders />} />
								<Route path="/options/providers" element={<TextProviders />} />
								<Route
									path="/options/image-providers"
									element={<ImageProviders />}
								/>
								<Route path="/options/agents" element={<TextAgents />} />
								<Route path="/options/image-agents" element={<ImageAgents />} />
							</Route>
						</Route>
					</Routes>
				</GameProvider>
			</LlmProvider>
		</MantineProvider>
	);
}

export default App;
