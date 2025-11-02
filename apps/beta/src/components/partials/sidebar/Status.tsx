import { Box, Stack } from "@mantine/core";

export default function Status() {
	return (
		<Stack>
			<Box>
				Character Portrait (not a real portrait, of course, since this is a text
				game)
			</Box>
			<Box>Character Ephemeral Stats</Box>
			<Box>Equipped Items</Box>
			<Box>
				Buttons to open panels (inventory, quests, transport/map, skills, codex)
			</Box>
		</Stack>
	);
}
