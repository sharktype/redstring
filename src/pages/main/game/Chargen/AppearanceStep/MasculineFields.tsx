import { Group, Select, TextInput } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { Appearance } from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface MasculineFieldsProps extends LockProps {
	setAppearance: (updates: Partial<Appearance>) => void;
}

export default function MasculineFields({
	setAppearance,
	locks,
	toggleLock,
}: MasculineFieldsProps) {
	const { playerState } = useGameContext();

	const appearance = playerState?.appearance;

	return (
		<Group grow align="start" gap="xs">
			<Group gap={4} wrap="nowrap">
				<Select
					label="Shoulders"
					placeholder="Select"
					clearable
					data={[
						{ value: "narrow", label: "Narrow" },
						{ value: "average", label: "Average" },
						{ value: "broad", label: "Broad" },
					]}
					value={appearance?.shoulders ?? null}
					onChange={(value) => {
						if (value) {
							setAppearance({
								shoulders: value,
							});
						}
					}}
					disabled={locks.shoulders}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.shoulders}
					toggle={() => toggleLock("shoulders")}
				/>
			</Group>
			<Group gap={4} wrap="nowrap">
				<TextInput
					label="Facial Hair"
					placeholder="e.g. clean-shaven, stubble, full beard"
					value={appearance?.facialHair ?? ""}
					onChange={(event) =>
						setAppearance({
							facialHair: event.currentTarget.value,
						})
					}
					disabled={locks.facialHair}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.facialHair}
					toggle={() => toggleLock("facialHair")}
				/>
			</Group>
		</Group>
	);
}
