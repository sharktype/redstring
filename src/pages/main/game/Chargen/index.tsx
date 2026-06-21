import { Container, Flex, Stack } from "@mantine/core";
import type { ComponentType } from "react";
import useGameContext from "../../../../context/hooks/useGameContext";
import { PAGE_STEPS, type Step } from "../../../../models/Chargen";
import type { StoredPlayerState } from "../../../../models/PlayerState";
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
		<Container h="100%">
			<Flex h="100%" align="center" justify="center">
				<Stack p="md" gap="lg">
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
		</Container>
	);
}
