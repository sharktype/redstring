import "@mantine/core/styles.css";
import "./App.css";

import { Route, Routes } from "react-router";
import Game from "./pages/Game/index.tsx";
import AppShellLayout from "./layouts/AppShellLayout.tsx";
import Providers from "./pages/options/Providers";
import Agents from "./pages/options/Agents";
import { MantineProvider } from "@mantine/core";
import GameProvider from "./context/GameContext/GameProvider.tsx";
import Locations from "./pages/options/Locations/index.tsx";

function App() {
	return (
		<MantineProvider defaultColorScheme="dark">
			<GameProvider>
				<Routes>
					<Route element={<AppShellLayout />}>
						<Route index element={<Game />} />
						<Route path="/options">
							<Route index element={<Providers />} />
							<Route path="/options/providers" element={<Providers />} />
							<Route path="/options/agents" element={<Agents />} />
							<Route path="/options/locations" element={<Locations />} />
						</Route>
					</Route>
				</Routes>
			</GameProvider>
		</MantineProvider>
	);
}

export default App;
