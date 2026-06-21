import { Flex, Stack } from "@mantine/core";
import type { ComponentType } from "react";
import useGameContext from "../../../../context/hooks/useGameContext";
import { PAGE_STEPS, type Step } from "../../../../models/Chargen";
import type { StoredPlayerState } from "../../../../models/PlayerState";
import AppearanceStep from "./AppearanceStep";
import ExtraStatsStep from "./ExtraStatsStep";
import NameStep from "./NameStep";
import TimeStep from "./TimeStep";
import WealthStep from "./WealthStep";

export interface ChargenStepProps {
	playerState: StoredPlayerState;
	onChange: (updates: Partial<Omit<StoredPlayerState, "id">>) => void;
}

const STEP_TO_COMPONENT: Record<Step, ComponentType<ChargenStepProps>> = {
	name: NameStep,
	appearance: AppearanceStep,
	extraStats: ExtraStatsStep,
	time: TimeStep,
	wealth: WealthStep,
};

export default function Chargen() {
	const { playerState, updatePlayerState, chargenPage } = useGameContext();

	if (!playerState) {
		return null;
	}

	const handleChange = (updates: Partial<Omit<StoredPlayerState, "id">>) => {
		updatePlayerState(updates);
	};

	const steps = PAGE_STEPS[chargenPage];

	return (
		<Flex flex={1} h="100%" align="center" justify="center" p="md">
			<Stack gap="lg" w="100%" maw={800}>
				{steps.map((step) => {
					const Component = STEP_TO_COMPONENT[step];
					return (
						<Component
							key={step}
							playerState={playerState}
							onChange={handleChange}
						/>
					);
				})}
			</Stack>
		</Flex>
	);
}
