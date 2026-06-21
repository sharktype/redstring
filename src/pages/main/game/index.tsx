// TODO: Show different screens based on state, which we do not currently track.

import { Flex } from "@mantine/core";
import useGameContext from "../../../context/hooks/useGameContext";
import Detailer from "../../detailer";
import Chargen from "./Chargen";
import Messages from "./Messages";

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
