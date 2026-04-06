import {
	ActionIcon,
	Box,
	Flex,
	Group,
	Select,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { useState } from "react";
import { FaDice, FaEraser, FaLock, FaLockOpen } from "react-icons/fa";
import type { ChargenStepProps } from ".";
import { DEFAULT_GENDER_IDENTITIES } from "../../../../models/PlayerState";
import { generateRandomName } from "../../../../handlers/names";

export default function NameStep({ playerState, onChange }: ChargenStepProps) {
	const [isGivenNameLocked, setIsGivenNameLocked] = useState(false);
	const [isSurnameLocked, setIsSurnameLocked] = useState(false);
	const [isGenderLocked, setIsGenderLocked] = useState(false);

	const allLocked = isGivenNameLocked && isSurnameLocked && isGenderLocked;

	const genderOptions = DEFAULT_GENDER_IDENTITIES.map((g) => ({
		value: g.identity,
		label: g.identity.charAt(0).toUpperCase() + g.identity.slice(1),
	}));

	const randomize = () => {
		const updates: Parameters<typeof onChange>[0] = {};
		const { givenName, surname, gender } = generateRandomName(
			isGenderLocked ? playerState.gender : undefined,
		);

		// Ignore parts of the newly-generated name if those fields are locked.

		if (!isGivenNameLocked || !isSurnameLocked) {
			updates.name = {
				given: isGivenNameLocked ? (playerState.name?.given ?? "") : givenName,
				surname: isSurnameLocked ? (playerState.name?.surname ?? "") : surname,
			};
		}

		if (!isGenderLocked && !isGivenNameLocked) {
			updates.gender = gender;
		}

		onChange(updates);
	};

	const clear = () => {
		setIsGivenNameLocked(false);
		setIsSurnameLocked(false);
		setIsGenderLocked(false);

		onChange({ name: undefined, gender: undefined });
	};

	const lockIcon = (isLocked: boolean, toggleLock: () => void) => (
		<ActionIcon
			variant="subtle"
			color={isLocked ? "red" : "gray"}
			title={isLocked ? "Unlock" : "Lock"}
			mt="lg"
			onClick={(e) => {
				e.preventDefault();
				toggleLock();
			}}
		>
			{isLocked ? <FaLock /> : <FaLockOpen />}
		</ActionIcon>
	);

	return (
		<Box
			p="md"
			bg="var(--mantine-color-blue-light)"
			style={{ borderRadius: "16px" }}
		>
			<Stack gap="xs">
				<Group justify="space-between">
					<Title order={4}>Name</Title>
					<Group gap="xs">
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Clear"
							onClick={clear}
							disabled={allLocked}
						>
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Randomise"
							onClick={randomize}
							disabled={allLocked}
						>
							<FaDice size={16} />
						</ActionIcon>
					</Group>
				</Group>
				<Flex gap="sm" wrap="wrap" align="flex-end">
					<Group gap={4} wrap="nowrap">
						<TextInput
							label="Given name"
							placeholder="Given name"
							value={playerState.name?.given ?? ""}
							onChange={(e) =>
								onChange({
									name: {
										given: e.currentTarget.value,
										surname: playerState.name?.surname ?? "",
									},
								})
							}
							style={{ flex: 1 }}
							disabled={isGivenNameLocked}
						/>
						{lockIcon(isGivenNameLocked, () => {
							const next = !isGivenNameLocked;

							setIsGivenNameLocked(next);
							setIsGenderLocked(next);
						})}
					</Group>
					<Group gap={4} wrap="nowrap">
						<TextInput
							label="Surname"
							placeholder="Surname"
							value={playerState.name?.surname ?? ""}
							onChange={(e) =>
								onChange({
									name: {
										given: playerState.name?.given ?? "",
										surname: e.currentTarget.value,
									},
								})
							}
							style={{ flex: 1 }}
							disabled={isSurnameLocked}
						/>
						{lockIcon(isSurnameLocked, () => setIsSurnameLocked((v) => !v))}
					</Group>
					<Group gap={4} wrap="nowrap">
						<Select
							label="Gender"
							placeholder="Gender"
							data={genderOptions}
							value={playerState.gender?.identity ?? null}
							onChange={(val) => {
								const gender = DEFAULT_GENDER_IDENTITIES.find(
									(gender) => gender.identity === val,
								);

								if (gender) {
									onChange({ gender });
								}
							}}
							disabled={isGivenNameLocked || isGenderLocked}
						/>
						{lockIcon(isGenderLocked, () =>
							setIsGenderLocked((value) => !value),
						)}
					</Group>
				</Flex>
			</Stack>
		</Box>
	);
}
