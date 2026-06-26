import { Flex } from "@mantine/core";
import useGameContext from "../../../context/GameContext/useGameContext";
import Detailer from "../../detailer";
import Chargen from "./Chargen";
import Messages from "./Messages/index.tsx";

export default function Game() {
	const { playerState } = useGameContext();

	const isChargen = !playerState || !playerState.isInitialized;

	return (
		<Flex h="100vh">
			{isChargen ? <Chargen /> : <Messages />}

			<Detailer />
		</Flex>
	);
}
