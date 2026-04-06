import { TimePicker } from "@mantine/dates";
import type { ChargenStepProps } from ".";
import { FaClock, FaDice, FaEraser, FaLock, FaLockOpen } from "react-icons/fa";
import { useState } from "react";
import { ActionIcon, Box, Group, Stack, Title } from "@mantine/core";

export default function DateTimeStep({
	playerState,
	onChange,
}: ChargenStepProps) {
	const [isDropdownOpened, setIsDropdownOpened] = useState(false);
	const [isLocked, setIsLocked] = useState(false);

	// This value allows for null time to exist.

	const value =
		playerState.time != null
			? `${String(playerState.time.hour).padStart(2, "0")}:${String(playerState.time.minute).padStart(2, "0")}`
			: "";

	const randomize = () => {
		onChange({
			time: {
				hour: Math.floor(Math.random() * 24),
				minute: Math.floor(Math.random() * 60),
			},
		});
	};

	const clear = () => {
		onChange({ time: undefined });
	};

	return (
		<Box
			p="md"
			bg="var(--mantine-color-grape-light)"
			style={{ borderRadius: "16px" }}
		>
			<Stack gap="xs">
				<Group justify="space-between">
					<Title order={4}>Date &amp; Time</Title>
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

				<TimePicker
					label="Time"
					description="Leaving this empty turns off the time system."
					rightSection={
						<ActionIcon
							onClick={() => setIsDropdownOpened(true)}
							variant="subtle"
							color="gray"
							disabled={isLocked}
						>
							<FaClock size={16} />
						</ActionIcon>
					}
					value={value}
					onChange={(value) => {
						const [h, m] = value.split(":").map(Number);

						onChange({
							time: { hour: h ?? 0, minute: m ?? 0 },
						});

						if (value === "") {
							setIsDropdownOpened(false);
						}
					}}
					popoverProps={{
						opened: isDropdownOpened,
						onChange: (isOpen) => !isOpen && setIsDropdownOpened(false),
					}}
					format="12h"
					withDropdown
					disabled={isLocked}
				/>
			</Stack>
		</Box>
	);
}
