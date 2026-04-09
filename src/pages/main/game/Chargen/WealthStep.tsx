import {
	ActionIcon,
	Box,
	Group,
	NumberInput,
	Stack,
	Title,
} from "@mantine/core";
import { FaDice, FaEraser } from "react-icons/fa";
import type { ChargenStepProps } from ".";

export default function WealthStep({
	playerState,
	onChange,
}: ChargenStepProps) {
	const randomize = () => {
		onChange({ money: Math.floor(Math.random() * 1000) + 1 });
	};

	const clear = () => {
		onChange({ money: undefined });
	};

	return (
		<Box
			p="md"
			bg="var(--mantine-color-orange-light)"
			style={{ borderRadius: "16px" }}
		>
			<Stack gap="xs">
				<Group justify="space-between">
					<Title order={4}>Starting Wealth</Title>
					<Group gap="xs">
						<ActionIcon
							onClick={clear}
							variant="subtle"
							color="gray"
							title="Clear"
						>
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon
							onClick={randomize}
							variant="subtle"
							color="gray"
							title="Randomise"
						>
							<FaDice size={16} />
						</ActionIcon>
					</Group>
				</Group>
				<NumberInput
					label="Gold"
					description="A decimal currency approximately equal to current-day Euros."
					placeholder="0"
					min={0}
					value={playerState.money ?? ""}
					onChange={(value) =>
						onChange({ money: typeof value === "number" ? value : undefined })
					}
				/>
			</Stack>
		</Box>
	);
}
