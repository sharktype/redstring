// TODO: Show different screens based on state, which we do not currently track.

import { Flex } from "@mantine/core";
import Messages from "./Messages";
import Detailer from "../../detailer";
import useGameContext from "../../../context/hooks/useGameContext";
import Chargen from "./Chargen";

export default function Game() {
	const { playerState } = useGameContext();

	let mainComponent = <Messages />;

	if (!playerState || !playerState.isInitialized) {
		mainComponent = <Chargen />;
	}

	return (
		<Flex h="100vh">
			{mainComponent}

			<Detailer />
		</Flex>
	);
}
