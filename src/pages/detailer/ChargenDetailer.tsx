import { Box, Button, Checkbox, Flex, Stack, Title } from "@mantine/core";
import type { IconType } from "react-icons";
import { GiPerson, GiQuillInk } from "react-icons/gi";
import { type Step, STEPS } from "../../models/Chargen";
import { BsClock } from "react-icons/bs";
import { BiMap } from "react-icons/bi";
import useGameContext from "../../context/hooks/useGameContext";
import type PlayerState from "../../models/PlayerState";

interface DetailerStep {
	label: string;
	color: string;
	icon: IconType;
	isComplete: (ps: PlayerState | null) => boolean;
}

const STEP_TO_DETAILER_STEP: Record<Step, DetailerStep> = {
	name: {
		label: "Choose a name",
		color: "blue",
		icon: GiPerson,
		isComplete: (ps) => !!ps?.name?.given && !!ps?.name?.surname,
	},
	extraStats: {
		label: "Write any initial stats",
		color: "yellow",
		icon: GiQuillInk,
		isComplete: (ps) => !!ps?.stats?.textual,
	},
	datetime: {
		label: "Set starting date & time",
		color: "grape",
		icon: BsClock,
		isComplete: (ps) => ps?.date != null && ps?.time != null,
	},
	location: {
		label: "Set starting location",
		color: "green",
		icon: BiMap,
		isComplete: (ps) => ps?.location != null,
	},
};

export default function ChargenDetailer() {
	const { playerState, updatePlayerState } = useGameContext();
	return (
		<Stack p="md" h="100%" justify="space-between">
			<Stack>
				<Title order={2}>How do we begin?</Title>
				{STEPS.map((step) => {
					const {
						label,
						color,
						icon: Icon,
						isComplete,
					} = STEP_TO_DETAILER_STEP[step];
					return (
						<Box
							key={step}
							p="md"
							bg={`var(--mantine-color-${color}-light)`}
							style={{ borderRadius: "16px" }}
						>
							<Flex align="center" gap="sm">
								<Icon
									size={24}
									color={`var(--mantine-color-${color}-filled)`}
								/>
								<Checkbox
									label={label}
									size="xl"
									color={color}
									checked={isComplete(playerState)}
									readOnly
									style={{ pointerEvents: "none" }}
								/>
							</Flex>
						</Box>
					);
				})}
			</Stack>
			<Button
				size="lg"
				color="green"
				onClick={() => updatePlayerState({ isInitialized: true })}
			>
				Set Out
			</Button>
		</Stack>
	);
}
