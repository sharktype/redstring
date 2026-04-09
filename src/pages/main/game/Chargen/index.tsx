import { Container, Flex, Stack } from "@mantine/core";
import type { ComponentType } from "react";
import { type Step, STEPS } from "../../../../models/Chargen";
import type { StoredPlayerState } from "../../../../models/PlayerState";
import useGameContext from "../../../../context/hooks/useGameContext";
import NameStep from "./NameStep";
import ExtraStatsStep from "./ExtraStatsStep";
import DateTimeStep from "./DateTimeStep";
import LocationStep from "./LocationStep";

export interface ChargenStepProps {
	playerState: StoredPlayerState;
	onChange: (updates: Partial<Omit<StoredPlayerState, "id">>) => void;
}

const STEP_TO_COMPONENT: Record<Step, ComponentType<ChargenStepProps>> = {
	name: NameStep,
	extraStats: ExtraStatsStep,
	datetime: DateTimeStep,
	location: LocationStep,
};

export default function Chargen() {
	const { playerState, updatePlayerState } = useGameContext();

	if (!playerState) {
		return null;
	}

	const handleChange = (updates: Partial<Omit<StoredPlayerState, "id">>) => {
		updatePlayerState(updates);
	};

	return (
		<Container h="100%">
			<Flex h="100%" align="center" justify="center">
				<Stack p="md" gap="lg">
					{STEPS.map((step) => {
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
