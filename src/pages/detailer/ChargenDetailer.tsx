import {
	Button,
	Flex,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import type { IconType } from "react-icons";
import { BiBook } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { GiArmorVest, GiBodySwapping } from "react-icons/gi";
import { MdQueryStats } from "react-icons/md";
import useGameContext from "../../context/hooks/useGameContext";
import {
	CHARGEN_PAGES,
	type ChargenPage,
	PAGE_STEPS,
	type Step,
} from "../../models/Chargen";
import type PlayerState from "../../models/PlayerState";

interface StepMeta {
	label: string;
	color: string;

	isComplete: (ps: PlayerState | null) => boolean;
	isMandatory?: boolean;
}

interface ChargenPageMeta {
	label: string;
	description: string;
	icon: IconType;
	color: string;
}

const PAGE_META: Record<ChargenPage, ChargenPageMeta> = {
	identity: {
		label: "Identity",
		description: "Name, personality & background",
		icon: CgProfile,
		color: "blue",
	},
	appearance: {
		label: "Appearance",
		description: "Hair, body & features",
		icon: GiBodySwapping,
		color: "pink",
	},
	stats: {
		label: "Stats",
		description: "Attributes & abilities",
		icon: MdQueryStats,
		color: "violet",
	},
	inventory: {
		label: "Inventory",
		description: "Starting equipment & wealth",
		icon: GiArmorVest,
		color: "orange",
	},
	scenario: {
		label: "Scenario",
		description: "Time, place & world",
		icon: BiBook,
		color: "teal",
	},
};

const STEP_META: Record<Step, StepMeta> = {
	name: {
		label: "Name",
		color: "blue",
		isComplete: (ps) => !!ps?.name?.given && !!ps?.name?.surname,
	},
	extraStats: {
		label: "Extra stats",
		color: "yellow",
		isComplete: (ps) => !!ps?.stats?.textual,
	},
	time: {
		label: "Starting time",
		color: "grape",
		isComplete: (ps) => ps?.time != null,
		isMandatory: true,
	},
	wealth: {
		label: "Starting wealth",
		color: "orange",
		isComplete: (ps) => ps?.money != null,
	},
};

export default function ChargenDetailer() {
	const { playerState, updatePlayerState, chargenPage, setChargenPage } =
		useGameContext();

	return (
		<Stack h="100%" justify="space-between" p="md" gap="md">
			<Stack gap="md" style={{ flex: 1 }}>
				<Title order={2}>How do we begin?</Title>

				<Stack gap="sm">
					{CHARGEN_PAGES.map((availablePage) => {
						const {
							label,
							description,
							icon: Icon,
							color,
						} = PAGE_META[availablePage];
						const steps = PAGE_STEPS[availablePage];
						const isSelected = availablePage === chargenPage;

						const completedCount = steps.filter((step) =>
							STEP_META[step].isComplete(playerState),
						).length;
						const mandatorySteps = steps.filter(
							(step) => STEP_META[step].isMandatory,
						);
						const mandatoryDone = mandatorySteps.every((step) =>
							STEP_META[step].isComplete(playerState),
						);

						return (
							<UnstyledButton
								key={availablePage}
								onClick={() => setChargenPage(availablePage)}
								py="sm"
								pl="var(--mantine-spacing-md)"
								mr="md"
								style={{
									borderLeft: isSelected
										? `3px solid var(--mantine-color-${color}-filled)`
										: "3px solid transparent",
									transition: "border-color 120ms ease",
								}}
							>
								<Flex gap="md" align="center" h="100%">
									<Icon
										size={24}
										color={`var(--mantine-color-${color}-filled)`}
										style={{ flexShrink: 0 }}
									/>
									<Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
										<Text fw={600} size="sm" lh={1.2}>
											{label}
										</Text>
										<Text size="xs" c="dimmed" lh={1.3}>
											{description}
										</Text>
									</Stack>
									{steps.length > 0 && (
										<Text
											size="xs"
											c={
												mandatoryDone && completedCount === steps.length
													? "green"
													: mandatoryDone
														? "dimmed"
														: "red"
											}
											style={{ flexShrink: 0 }}
										>
											{completedCount}/{steps.length}
										</Text>
									)}
									{steps.length === 0 && (
										<Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
											WIP
										</Text>
									)}
								</Flex>
							</UnstyledButton>
						);
					})}
				</Stack>
			</Stack>

			<Button
				fullWidth
				size="lg"
				color="green"
				disabled={
					!playerState || !playerState.name?.given || playerState.time == null
				}
				onClick={() => {
					updatePlayerState({ isInitialized: true });
				}}
			>
				Set Out
			</Button>
		</Stack>
	);
}
