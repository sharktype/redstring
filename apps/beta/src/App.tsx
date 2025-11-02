import "@mantine/core/styles.css";
import "./App.css";

import { Route, Routes } from "react-router";
import Game from "./pages/Game.tsx";
import AppShellLayout from "./layouts/AppShellLayout.tsx";
import Providers from "./pages/options/Providers.tsx";
import Agents from "./pages/options/Agents.tsx";
import { MantineProvider } from "@mantine/core";

function App() {
	return (
		<MantineProvider defaultColorScheme="dark">
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
		</MantineProvider>
	);
}

export default App;
