import { Group, TextInput } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { Appearance } from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface DetailFieldsProps extends LockProps {
	setAppearance: (updates: Partial<Appearance>) => void;
}

export default function DetailFields({
	setAppearance,
	locks,
	toggleLock,
}: DetailFieldsProps) {
	const { playerState } = useGameContext();

	const appearance = playerState?.appearance;

	return (
		<>
			<Group grow align="start" gap="xs">
				<Group gap={4} wrap="nowrap">
					<TextInput
						label="Skin Tone"
						placeholder="e.g. pale, dark brown, olive"
						value={appearance?.skinColour ?? ""}
						onChange={(e) =>
							setAppearance({
								skinColour: e.currentTarget.value,
							})
						}
						disabled={locks.skinColour}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.skinColour}
						toggle={() => toggleLock("skinColour")}
					/>
				</Group>
				<Group gap={4} wrap="nowrap">
					<TextInput
						label="Complexion"
						placeholder="e.g. clear, freckled, scarred"
						value={appearance?.complexion ?? ""}
						onChange={(e) =>
							setAppearance({
								complexion: e.currentTarget.value,
							})
						}
						disabled={locks.complexion}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.complexion}
						toggle={() => toggleLock("complexion")}
					/>
				</Group>
			</Group>

			<Group grow align="start" gap="xs">
				<Group gap={4} wrap="nowrap">
					<TextInput
						label="Hair Style"
						placeholder="e.g. long, braided, bald"
						value={appearance?.hairStyle ?? ""}
						onChange={(e) =>
							setAppearance({
								hairStyle: e.currentTarget.value,
							})
						}
						disabled={locks.hairStyle}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.hairStyle}
						toggle={() => toggleLock("hairStyle")}
					/>
				</Group>
				<Group gap={4} wrap="nowrap">
					<TextInput
						label="Hair Colour"
						placeholder="e.g. black, auburn, silver"
						value={appearance?.hairColour ?? ""}
						onChange={(event) =>
							setAppearance({
								hairColour: event.currentTarget.value,
							})
						}
						disabled={locks.hairColour}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.hairColour}
						toggle={() => toggleLock("hairColour")}
					/>
				</Group>
			</Group>
		</>
	);
}
