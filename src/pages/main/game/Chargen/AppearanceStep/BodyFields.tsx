import { Group, Select } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { Appearance } from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface BodyFieldsProps extends LockProps {
	setAppearance: (updates: Partial<Appearance>) => void;
}

export default function BodyFields({
	setAppearance,
	locks,
	toggleLock,
}: BodyFieldsProps) {
	const { playerState } = useGameContext();

	const appearance = playerState?.appearance;

	return (
		<Group grow align="start" gap="xs">
			<Group gap={4} wrap="nowrap">
				<Select
					label="Size"
					placeholder="Select"
					clearable
					data={[
						{ value: "small", label: "Small" },
						{ value: "average", label: "Average" },
						{ value: "large", label: "Large" },
					]}
					value={appearance?.size ?? null}
					onChange={(value) => {
						if (value) {
							setAppearance({
								size: value,
							});
						}
					}}
					disabled={locks.size}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.size} toggle={() => toggleLock("size")} />
			</Group>
			<Group gap={4} wrap="nowrap">
				<Select
					label="Build"
					placeholder="Select"
					clearable
					data={[
						{ value: "soft", label: "Soft" },
						{ value: "average", label: "Average" },
						{ value: "toned", label: "Toned" },
						{ value: "muscular", label: "Muscular" },
					]}
					value={appearance?.build ?? null}
					onChange={(value) => {
						if (value) {
							setAppearance({
								build: value,
							});
						}
					}}
					disabled={locks.build}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.build} toggle={() => toggleLock("build")} />
			</Group>
			<Group gap={4} wrap="nowrap">
				<Select
					label="Height"
					placeholder="Select"
					clearable
					data={[
						{ value: "veryShort", label: "Very Short" },
						{ value: "short", label: "Short" },
						{ value: "belowAverage", label: "Below Average" },
						{ value: "average", label: "Average" },
						{ value: "aboveAverage", label: "Above Average" },
						{ value: "tall", label: "Tall" },
						{ value: "veryTall", label: "Very Tall" },
					]}
					value={appearance?.height ?? null}
					onChange={(value) => {
						if (value) {
							setAppearance({
								height: value,
							});
						}
					}}
					disabled={locks.height}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.height} toggle={() => toggleLock("height")} />
			</Group>
		</Group>
	);
}
