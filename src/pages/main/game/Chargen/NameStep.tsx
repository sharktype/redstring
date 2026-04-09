import {
	ActionIcon,
	Box,
	Checkbox,
	Flex,
	Group,
	Modal,
	Select,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { useState } from "react";
import { FaDice, FaEraser, FaLock, FaLockOpen, FaMagic } from "react-icons/fa";
import type { ChargenStepProps } from ".";
import { DEFAULT_GENDER_IDENTITIES } from "../../../../models/PlayerState";
import {
	type Culture,
	SUPPORTED_CULTURES,
	generateRandomName,
} from "../../../../handlers/names";
import { generatePartialFantasyName } from "../../../../handlers/names/fantasify";

export default function NameStep({ playerState, onChange }: ChargenStepProps) {
	const [isGivenNameLocked, setIsGivenNameLocked] = useState(false);
	const [isSurnameLocked, setIsSurnameLocked] = useState(false);
	const [isGenderLocked, setIsGenderLocked] = useState(false);
	const [willFantasify, setWillFantasify] = useState(true);
	const [isEasterEggModalOpen, setIsEasterEggModalOpen] = useState(false);
	const [selectedCulture, setSelectedCulture] = useState<
		Culture | "mixed" | null
	>(null);

	// We disable the buttons if everything is locked, as nothing can happen.

	const isFullyLocked = isGivenNameLocked && isSurnameLocked && isGenderLocked;

	const genderOptions = DEFAULT_GENDER_IDENTITIES.map((gender) => ({
		value: gender.identity,
		label: gender.identity.charAt(0).toUpperCase() + gender.identity.slice(1),
	}));

	const cultureOptions = [
		...SUPPORTED_CULTURES.map((culture) => ({
			value: culture,
			label: culture.includes(": ")
				? culture
				: culture.charAt(0).toUpperCase() + culture.slice(1),
		})),
		{ value: "mixed", label: "Mixed" },
	];

	const randomize = () => {
		const updates: Parameters<typeof onChange>[0] = {};
		const cultureArg: Culture | null | undefined =
			selectedCulture === "mixed" ? null : (selectedCulture ?? undefined);
		const { givenName, surname, gender } = generateRandomName(
			isGenderLocked ? playerState.gender : undefined,
			cultureArg,
			willFantasify,
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
						<Checkbox
							label="Fantasify?"
							checked={willFantasify}
							onChange={(event) =>
								setWillFantasify(event.currentTarget.checked)
							}
							size="xs"
							mr="xs"
						/>
						<Select
							placeholder="Culture"
							data={cultureOptions}
							value={selectedCulture}
							onChange={(val) =>
								setSelectedCulture(val as Culture | "mixed" | null)
							}
							size="xs"
							clearable
						/>
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Clear"
							onClick={clear}
							disabled={isFullyLocked}
						>
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Fantasify current name"
							onClick={() => {
								const given = playerState.name?.given ?? "";
								const surname = playerState.name?.surname ?? "";

								if (!given && !surname) {
									return;
								}

								if (given.length > 32 || surname.length > 32) {
									// Don't allow extremely long names in a funny way.

									setIsEasterEggModalOpen(true);

									return;
								}

								onChange({
									name: {
										given:
											isGivenNameLocked || !given
												? given
												: generatePartialFantasyName(given, selectedCulture),
										surname:
											isSurnameLocked || !surname
												? surname
												: generatePartialFantasyName(surname, selectedCulture),
									},
								});
							}}
							disabled={!playerState.name?.given && !playerState.name?.surname}
						>
							<FaMagic size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Randomise"
							onClick={randomize}
							disabled={isFullyLocked}
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
			<Modal
				title={<b>Stop, Please</b>}
				opened={isEasterEggModalOpen}
				onClose={() => setIsEasterEggModalOpen(false)}
				centered
			>
				Okay,
				<b>
					{playerState.name?.given} {playerState.name?.surname}
				</b>
				, I think you've had enough.
			</Modal>
		</Box>
	);
}
