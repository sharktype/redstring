import { Flex } from "@mantine/core";
import Chat from "./Chat";
import Memory from "./Memory.tsx";
import Stats from "./Stats.tsx";

export default function Main() {
	return (
		<Flex h="100vh">
			<Chat />
			<Flex
				w={620}
				miw={320}
				maw={620}
				direction="column"
				mr={64}
				justify="center"
			>
				<Flex>
					<Stats />
					<Memory />
				</Flex>
			</Flex>
		</Flex>
	);
}
