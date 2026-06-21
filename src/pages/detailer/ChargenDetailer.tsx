import { Box, Button, Checkbox, Flex, Stack, Title } from "@mantine/core";
import type { IconType } from "react-icons";
import { BsClock } from "react-icons/bs";
import { GiPerson, GiQuillInk, GiTwoCoins } from "react-icons/gi";
import useGameContext from "../../context/hooks/useGameContext";
import { STEPS, type Step } from "../../models/Chargen";
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
		isComplete: (playerState) =>
			!!playerState?.name?.given && !!playerState?.name?.surname,
	},
	extraStats: {
		label: "Write any initial stats",
		color: "yellow",
		icon: GiQuillInk,
		isComplete: (playerState) => !!playerState?.stats?.textual,
	},
	datetime: {
		label: "Set starting date & time",
		color: "grape",
		icon: BsClock,
		isComplete: (playerState) => playerState?.time != null,
	},
	wealth: {
		label: "Set starting wealth",
		color: "orange",
		icon: GiTwoCoins,
		isComplete: (playerState) => playerState?.money != null,
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
				disabled={!playerState || !playerState.name?.given}
				onClick={() => {
					updatePlayerState({ isInitialized: true });
				}}
			>
				Set Out
			</Button>
		</Stack>
	);
}
