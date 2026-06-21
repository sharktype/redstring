import {
	ActionIcon,
	Box,
	Flex,
	Group,
	Stack,
	Textarea,
	Title,
} from "@mantine/core";
import { useState } from "react";
import { FaDice, FaEraser } from "react-icons/fa";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { Appearance } from "../../../../../models/PlayerState";
import type { ChargenStepProps } from "..";
import AppearanceForm from "./AppearanceForm";
import type { Locks } from "./locks";
import { ALL_LOCK_KEYS, defaultLocks } from "./locks";
import NsfwFields from "./NsfwFields";
import PortraitUploader from "./PortraitUploader";
import { randomiseAppearance } from "./randomize";
import TopRowFields from "./TopRowFields";

export default function AppearanceStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState, gameState } = useGameContext();
	const [locks, setLocks] = useState<Locks>(defaultLocks);

	const isNsfw = gameState?.isNsfw ?? false;

	const appearance = playerState?.appearance ?? {};
	const genderExpression = appearance.genderExpression;

	const isAllLocked = ALL_LOCK_KEYS.every((key) => locks[key]);

	const toggleLock = (key: keyof Appearance) => {
		setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const setAppearance = (updates: Partial<Appearance>) => {
		updatePlayerState({
			appearance: { ...playerState?.appearance, ...updates },
		});
	};

	const randomize = () => {
		const expressionForRandomization = locks.genderExpression
			? genderExpression
			: undefined;

		const generated = randomiseAppearance(
			expressionForRandomization,
			appearance.species,
			isNsfw,
		);

		const merged = mergeIntoLocked(appearance, generated, locks);

		if (Object.keys(merged).length > 0) {
			updatePlayerState({ appearance: merged });
		}
	};

	const clear = () => {
		setLocks(defaultLocks());
		updatePlayerState({ appearance: undefined });
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
					<Title order={4}>Appearance</Title>
					<Group gap="xs">
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Clear"
							onClick={clear}
							disabled={isAllLocked}
						>
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Randomise"
							onClick={randomize}
							disabled={isAllLocked}
						>
							<FaDice size={16} />
						</ActionIcon>
					</Group>
				</Group>

				<Flex gap="lg" wrap="wrap">
					<Stack
						gap="xs"
						style={{
							flex: 1,
							minWidth: 230,
							maxWidth: 320,
						}}
					>
						<PortraitUploader isNsfwMode={isNsfw} />
					</Stack>

					<Stack gap="xs" style={{ flex: 2.5, minWidth: 300 }}>
						<TopRowFields
							setAppearance={setAppearance}
							locks={locks}
							toggleLock={toggleLock}
						/>

						<AppearanceForm locks={locks} toggleLock={toggleLock} />

						{isNsfw && (
							<NsfwFields
								setAppearance={setAppearance}
								locks={locks}
								toggleLock={toggleLock}
							/>
						)}

						<Group gap={4} wrap="nowrap">
							<Textarea
								label="Clothing Style"
								description="The default style in which your character dresses."
								placeholder="e.g. white fine blouse and thin leather cloak"
								minRows={2}
								autosize
								key={appearance.clothingStyle}
								defaultValue={appearance.clothingStyle ?? ""}
								onBlur={(event) =>
									setAppearance({
										clothingStyle: event.currentTarget.value,
									})
								}
								disabled={locks.clothingStyle}
								style={{ flex: 1 }}
							/>
							<LockIcon
								isLocked={locks.clothingStyle}
								toggle={() => toggleLock("clothingStyle")}
							/>
						</Group>

						<Textarea
							label="Custom"
							description="Optional freeform notes about your character's appearance."
							placeholder="e.g., anything you like"
							minRows={2}
							autosize
							key={appearance.custom}
							defaultValue={appearance.custom ?? ""}
							onBlur={(event) =>
								setAppearance({
									custom: event.currentTarget.value,
								})
							}
						/>

						<Textarea
							label="Generate Instructions"
							description="Extra instructions appended to the image prompt. Use comma-separated values."
							placeholder="e.g., anime screenshot, 1990s (style), smiling (expression)"
							minRows={2}
							autosize
							key={appearance.generateExtra}
							defaultValue={appearance.generateExtra ?? ""}
							onBlur={(event) =>
								setAppearance({
									generateExtra: event.currentTarget.value,
								})
							}
						/>
					</Stack>
				</Flex>
			</Stack>
		</Box>
	);
}

function mergeIntoLocked(
	current: Appearance,
	generated: Partial<Appearance>,
	locks: Locks,
): Partial<Appearance> {
	const merged: Appearance = {};

	ALL_LOCK_KEYS.forEach((key) => {
		const isLocked = locks[key];
		if (!isLocked && generated[key]) {
			(merged as Record<string, unknown>)[key] = generated[key];
		} else {
			(merged as Record<string, unknown>)[key] = current[key];
		}
	});

	return merged;
}
