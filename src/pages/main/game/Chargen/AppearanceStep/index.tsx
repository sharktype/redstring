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
import useGameContext from "../../../../../context/hooks/useGameContext";
import type PlayerState from "../../../../../models/PlayerState";
import type { GenderExpression } from "../../../../../models/PlayerState";
import type { ChargenStepProps } from "..";
import AppearanceForm from "./AppearanceForm";
import type { LockKey, Locks } from "./locks";
import { ALL_LOCK_KEYS, defaultLocks } from "./locks";
import NsfwFields from "./NsfwFields";
import PortraitUploader from "./PortraitUploader";
import { randomiseAppearance } from "./randomize";
import TopRowFields from "./TopRowFields";

export default function AppearanceStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState, gameState } = useGameContext();
	const isNsfw = gameState?.isNsfw ?? false;
	const [locks, setLocks] = useState<Locks>(defaultLocks);

	const appearance = playerState?.appearance ?? {};
	const genderExpression = playerState?.genderExpression;

	const toggleLock = (key: LockKey) => {
		setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const isAllLocked = ALL_LOCK_KEYS.every((key) => locks[key]);

	const setAppearance = (updates: Partial<NonNullable<typeof appearance>>) => {
		updatePlayerState({
			appearance: { ...playerState?.appearance, ...updates },
		});
	};

	const handleGenderExpressionChange = (expression: string | null) => {
		const next = (expression as GenderExpression) ?? undefined;

		if (!locks.genderExpression) {
			updatePlayerState({ genderExpression: next });
		}

		const clear: Partial<NonNullable<typeof appearance>> = {};

		if (!locks.shoulders && next !== "masculine" && next !== "androgynous") {
			clear.shoulders = undefined;
			clear.facialHair = undefined;
		}

		if (!locks.bust && next !== "feminine" && next !== "androgynous") {
			clear.bust = undefined;
			clear.hips = undefined;
		}

		if (Object.keys(clear).length > 0) {
			setAppearance(clear);
		}
	};

	const randomize = () => {
		const expressionForRandomization = locks.genderExpression
			? genderExpression
			: undefined;

		const { appearance: generated, genderExpression: generatedExpression } =
			randomiseAppearance(
				expressionForRandomization,
				appearance.species,
				isNsfw,
			);

		const updates: {
			appearance?: Partial<NonNullable<PlayerState["appearance"]>>;
			genderExpression?: GenderExpression;
		} = {};

		const merged = mergeIntoLocked(
			appearance as NonNullable<PlayerState["appearance"]>,
			generated,
			locks,
		);

		if (Object.keys(merged).length > 0) {
			updates.appearance = merged;
		}

		if (!locks.genderExpression && generatedExpression) {
			updates.genderExpression = generatedExpression;
		}

		updatePlayerState(updates);
	};

	const clear = () => {
		setLocks(defaultLocks());
		updatePlayerState({
			appearance: undefined,
			genderExpression: undefined,
		});
	};

	const handleAgeChange = (age: number | undefined) => {
		setAppearance({ age });
	};

	const handleSpeciesChange = (species: string) => {
		setAppearance({ species });
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
							age={appearance.age}
							species={appearance.species}
							genderExpression={genderExpression}
							onAgeChange={handleAgeChange}
							onSpeciesChange={handleSpeciesChange}
							onGenderExpressionChange={handleGenderExpressionChange}
							locks={locks}
							toggleLock={toggleLock}
						/>

						<AppearanceForm locks={locks} toggleLock={toggleLock} />

						{isNsfw && (
							<NsfwFields
								appearance={
									appearance as NonNullable<PlayerState["appearance"]>
								}
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
								onBlur={(e) =>
									setAppearance({
										clothingStyle: e.currentTarget.value,
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
	current: NonNullable<PlayerState["appearance"]>,
	generated: Partial<NonNullable<PlayerState["appearance"]>>,
	locks: Locks,
): Partial<NonNullable<PlayerState["appearance"]>> {
	const merged: Partial<NonNullable<PlayerState["appearance"]>> = {};

	const copyField = <K extends keyof NonNullable<PlayerState["appearance"]>>(
		key: K,
	) => {
		if (locks[key as LockKey]) {
			merged[key] = current[key] as never;
		} else {
			merged[key] = (generated[key] ?? current[key]) as never;
		}
	};

	copyField("age");
	copyField("species");
	copyField("size");
	copyField("build");
	copyField("height");
	copyField("shoulders");
	copyField("facialHair");
	copyField("bust");
	copyField("hips");
	copyField("skinColour");
	copyField("complexion");
	copyField("hairStyle");
	copyField("hairColour");
	copyField("genitals");
	copyField("cockSize");
	copyField("clothingStyle");
	copyField("generateExtra");

	return merged;
}
