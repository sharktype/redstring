// TODO: Show different screens based on state, which we do not currently track.

import { Flex } from "@mantine/core";
import Messages from "./Messages";
import Detailer from "../../components/partials/detailer";

export default function Game() {
	return (
		<Flex h="100vh">
			<Messages />
			<Detailer />
		</Flex>
	);
}
