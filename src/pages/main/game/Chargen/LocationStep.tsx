import { ActionIcon, Box, Group, Select, Stack, Title } from "@mantine/core";
import { useState } from "react";
import { FaDice, FaEraser, FaLock, FaLockOpen } from "react-icons/fa";
import type { ChargenStepProps } from ".";
import useGameContext from "../../../../context/hooks/useGameContext";
import { pick } from "../../../../utils/random";

export default function LocationStep({
	playerState,
	onChange,
}: ChargenStepProps) {
	const { regions } = useGameContext();
	const [isLocked, setIsLocked] = useState(false);

	const options = regions.map((region) => ({
		value: String(region.id),
		label: region.name,
	}));

	const currentRegionId = playerState.location?.region?.id;

	const randomize = () => {
		if (regions.length > 0) {
			onChange({ location: { region: pick(regions), building: null } });
		}
	};

	const clear = () => {
		onChange({ location: undefined });
	};

	return (
		<Box
			p="md"
			bg="var(--mantine-color-green-light)"
			style={{ borderRadius: "16px" }}
		>
			<Stack gap="xs">
				<Group justify="space-between">
					<Title order={4}>Location</Title>
					<Group gap="xs">
						<ActionIcon
							onClick={clear}
							disabled={isLocked}
							variant="subtle"
							color="gray"
							title="Clear"
						>
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon
							onClick={randomize}
							disabled={isLocked}
							variant="subtle"
							color="gray"
							title="Randomise"
						>
							<FaDice size={16} />
						</ActionIcon>
						<ActionIcon
							onClick={() => setIsLocked((v) => !v)}
							variant="subtle"
							color={isLocked ? "red" : "gray"}
							title={isLocked ? "Unlock" : "Lock"}
						>
							{isLocked ? <FaLock size={16} /> : <FaLockOpen size={16} />}
						</ActionIcon>
					</Group>
				</Group>
				<Select
					label="Starting region"
					description="Leaving this empty turns off the locations system."
					placeholder="Select a region..."
					data={options}
					value={currentRegionId != null ? String(currentRegionId) : null}
					onChange={(value) => {
						const region = regions.find((r) => String(r.id) === value);
						if (region) {
							onChange({ location: { region, building: null } });
						}
					}}
					disabled={isLocked}
				/>
			</Stack>
		</Box>
	);
}
