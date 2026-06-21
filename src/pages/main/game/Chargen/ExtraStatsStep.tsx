import { ActionIcon, Box, Group, Stack, Textarea, Title } from "@mantine/core";
import { FaEraser } from "react-icons/fa";
import type { ChargenStepProps } from ".";

export default function ExtraStatsStep({
	playerState,
	onChange,
}: ChargenStepProps) {
	const clear = () => {
		onChange({ stats: { textual: "" } });
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
					<Title order={4}>Extra Stats</Title>
					<Group gap="xs">
						<ActionIcon
							onClick={clear}
							variant="subtle"
							color="gray"
							title="Clear"
						>
							<FaEraser size={16} />
						</ActionIcon>
					</Group>
				</Group>
				<Textarea
					label="Free-form stats"
					description="This can be changed later!"
					placeholder="Describe any stats you want to track..."
					autosize
					minRows={8}
					value={playerState.stats?.textual ?? ""}
					onChange={(e) =>
						onChange({
							stats: { textual: e.currentTarget.value },
						})
					}
				/>
			</Stack>
		</Box>
	);
}
