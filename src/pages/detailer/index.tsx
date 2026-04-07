import { Box } from "@mantine/core";
import useGameContext from "../../context/hooks/useGameContext.tsx";
import Inventory from "./Inventory.tsx";
import Journal from "./Journal.tsx";
import LocationMap from "./LocationMap.tsx";
import Profile from "./Profile.tsx";
import ChargenDetailer from "./ChargenDetailer.tsx";

export default function Detailer() {
	const { gameState, playerState } = useGameContext();

	const playerNotReady = !playerState || !playerState.isInitialized;

	// Note that the "character creation" detailer is not an actual detailer state.

	let chosenComponent = null;
	switch (gameState?.detailer) {
		case "inventory":
			chosenComponent = <Inventory />;
			break;
		case "profile":
			chosenComponent = <Profile />;
			break;
		case "map":
			chosenComponent = <LocationMap />;
			break;
		case "journal":
			chosenComponent = <Journal />;
			break;
		default:
			break;
	}

	if (playerNotReady) {
		chosenComponent = <ChargenDetailer />;
	}

	return (
		<Box h="100%" w="calc(var(--app-shell-navbar-width) * 1.5)">
			<Box
				h="100%"
				bg="var(--mantine-color-body)"
				p="md"
				style={{
					borderLeft: "1px solid var(--app-shell-border-color)",
				}}
			>
				{chosenComponent}
			</Box>
		</Box>
	);
}
