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
			p="lg"
			style={{
				borderRadius: "var(--mantine-radius-md)",
				border: "1px solid var(--mantine-color-default-border)",
			}}
		>
			<Stack gap="sm">
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
					description="A decimal currency approximately equal to current-day dollars."
					suffix=" g"
					thousandsGroupStyle="thousand"
					thousandSeparator=","
					allowNegative={false}
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
