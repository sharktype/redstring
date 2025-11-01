import "@mantine/core/styles.css";
import "./App.css";

import { Route, Routes } from "react-router";
import Game from "./pages/Game.tsx";
import AppShellLayout from "./layouts/AppShellLayout.tsx";
import Keys from "./pages/options/Keys.tsx";
import Mappings from "./pages/options/Mappings.tsx";

function App() {
	return (
		<Routes>
			<Route element={<AppShellLayout />}>
				<Route index element={<Game />} />
				<Route path="/options">
					<Route index element={<Keys />} />
					<Route path="/options/keys" element={<Keys />} />
					<Route path="/options/mappings" element={<Mappings />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
