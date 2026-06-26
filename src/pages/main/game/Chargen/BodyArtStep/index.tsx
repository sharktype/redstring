import { ActionIcon, Box, Group, Stack, Text, Title } from "@mantine/core";
import { type ReactNode, useState } from "react";
import { FaDice, FaEraser } from "react-icons/fa";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { BodyArt } from "../../../../../models/PlayerState";
import type { ChargenStepProps } from "..";
import BodyArtField from "./BodyArtField";
import {
	ALL_LOCK_KEYS,
	type BodyArtLockKey,
	defaultLocks,
	setBodyArtField,
} from "./locks";
import { randomiseBodyArt } from "./randomize";

export default function BodyArtStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState } = useGameContext();
	const [locks, setLocks] = useState(defaultLocks());

	const bodyArt = playerState?.bodyArt ?? {};
	const appearance = playerState?.appearance;
	const genderExpression = appearance?.genderExpression;

	const hasPenis =
		appearance?.genitals === "penisCircumcised" ||
		appearance?.genitals === "penisUncircumcised";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	const isAllLocked = ALL_LOCK_KEYS.every((key) => locks[key]);

	const toggleLock = (key: BodyArtLockKey) => {
		setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const setField = (key: BodyArtLockKey, value: string) => {
		const next = setBodyArtField(playerState?.bodyArt, key, value);
		updatePlayerState({ bodyArt: next });
	};

	const randomize = () => {
		const generated = randomiseBodyArt(genderExpression, appearance);

		const merged: BodyArt = {
			tattoos: {},
			piercings: {},
			makeup: {},
		};

		ALL_LOCK_KEYS.forEach((key) => {
			const [group, field] = key.split(".") as [
				"tattoos" | "piercings" | "makeup",
				string,
			];
			const isLocked = locks[key];
			const source = isLocked
				? (
						playerState?.bodyArt?.[group] as
							| Record<string, string | undefined>
							| undefined
					)?.[field]
				: (generated[group] as Record<string, string | undefined>)[field];

			(merged[group] as Record<string, string | undefined>)[field] = source;
		});

		updatePlayerState({ bodyArt: merged });
	};

	const clear = () => {
		setLocks(defaultLocks());
		updatePlayerState({ bodyArt: undefined });
	};

	const tattoos = bodyArt.tattoos ?? {};
	const piercings = bodyArt.piercings ?? {};
	const makeup = bodyArt.makeup ?? {};

	const nsfwLabel = (label: string): ReactNode => (
		<>
			{label}{" "}
			<Text component="span" c="red" size="xs" fw={600}>
				18+
			</Text>
		</>
	);

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
					<Title order={4}>Body Details</Title>
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

				<Group grow align="start" gap="lg">
					{/* Column 1: Tattoos */}
					<Stack gap="xs">
						<Text size="sm" fw={600} c="dimmed">
							Tattoos
						</Text>
						<BodyArtField
							label="Face"
							placeholder="e.g. small tribal mark on cheek"
							value={tattoos.face ?? ""}
							onChange={(value) => setField("tattoos.face", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="tattoos.face"
						/>
						<BodyArtField
							label="Body"
							placeholder="e.g. rose on shoulder, dragon on back"
							value={tattoos.body ?? ""}
							onChange={(value) => setField("tattoos.body", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="tattoos.body"
						/>
					</Stack>

					{/* Column 2: Piercings */}
					<Stack gap="xs">
						<Text size="sm" fw={600} c="dimmed">
							Piercings
						</Text>
						<BodyArtField
							label="Ears"
							placeholder="e.g. studs, hoops"
							value={piercings.ears ?? ""}
							onChange={(value) => setField("piercings.ears", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="piercings.ears"
						/>
						<BodyArtField
							label="Septum"
							placeholder="e.g. small ring"
							value={piercings.septum ?? ""}
							onChange={(value) => setField("piercings.septum", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="piercings.septum"
						/>
						<BodyArtField
							label="Face (other)"
							placeholder="e.g. eyebrow stud, lip ring"
							value={piercings.face ?? ""}
							onChange={(value) => setField("piercings.face", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="piercings.face"
						/>
						<BodyArtField
							label="Navel"
							placeholder="e.g. barbell, ring"
							value={piercings.navel ?? ""}
							onChange={(value) => setField("piercings.navel", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="piercings.navel"
						/>
						<BodyArtField
							label={nsfwLabel("Nipples")}
							placeholder="e.g. barbells, rings"
							value={piercings.nipples ?? ""}
							onChange={(value) => setField("piercings.nipples", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="piercings.nipples"
						/>
						{isFeminine && (
							<BodyArtField
								label={nsfwLabel("Hood")}
								placeholder="e.g. small curved barbell"
								value={piercings.hood ?? ""}
								onChange={(value) => setField("piercings.hood", value)}
								locks={locks}
								toggleLock={toggleLock}
								lockKey="piercings.hood"
							/>
						)}
						{hasPenis && (
							<BodyArtField
								label={nsfwLabel("Cock")}
								placeholder="e.g. prince albert ring"
								value={piercings.cock ?? ""}
								onChange={(value) => setField("piercings.cock", value)}
								locks={locks}
								toggleLock={toggleLock}
								lockKey="piercings.cock"
							/>
						)}
					</Stack>

					{/* Column 3: Facial Makeup */}
					<Stack gap="xs">
						<Text size="sm" fw={600} c="dimmed">
							Facial Makeup
						</Text>
						<BodyArtField
							label="Eyes"
							placeholder="e.g. smoky eyeshadow, winged eyeliner"
							value={makeup.eyes ?? ""}
							onChange={(value) => setField("makeup.eyes", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="makeup.eyes"
						/>
						<BodyArtField
							label="Lips"
							placeholder="e.g. red lipstick, matte nude"
							value={makeup.lips ?? ""}
							onChange={(value) => setField("makeup.lips", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="makeup.lips"
						/>
						<BodyArtField
							label="Cheeks"
							placeholder="e.g. subtle blush, contoured cheekbones"
							value={makeup.cheeks ?? ""}
							onChange={(value) => setField("makeup.cheeks", value)}
							locks={locks}
							toggleLock={toggleLock}
							lockKey="makeup.cheeks"
						/>
					</Stack>
				</Group>
			</Stack>
		</Box>
	);
}
