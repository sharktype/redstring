import { Box, Button, Stack, Text, Flex } from "@mantine/core";
import type { ReactNode } from "react";
import { GiBackpack, GiSkills } from "react-icons/gi";
import { FaScroll, FaMap } from "react-icons/fa";
import { BsBook } from "react-icons/bs";

export default function Status() {
	return (
		<Flex direction="column" h="100%">
			<Stack flex={1}>
				<Box>
					<Text>
						<b>Character Name</b>
					</Text>
					<Text size="xs">Level N Race Class (Current/Next XP)</Text>
				</Box>
				<Box>Character Major Stats</Box>
				<Box>Equipped Items</Box>
			</Stack>
			<Stack gap="xs">
				<StatusItem label="Inventory" icon={<GiBackpack />} />
				<StatusItem label="Quests" icon={<FaScroll />} />
				<StatusItem label="Map" icon={<FaMap />} />
				<StatusItem label="Skills" icon={<GiSkills />} />
				<StatusItem label="Codex" icon={<BsBook />} />
			</Stack>
		</Flex>
	);
}

function StatusItem(props: { label: string; icon: ReactNode }) {
	return (
		<Button
			variant="default"
			size="xs"
			leftSection={props.icon}
			justify="flex-start"
			onClick={() => null}
		>
			{props.label}
		</Button>
	);
}
