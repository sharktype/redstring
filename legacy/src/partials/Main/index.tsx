import { Flex } from "@mantine/core";
import Stats from "./Stats.tsx";
import Memory from "./Memory.tsx";
import Chat from "./Chat";

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
