import { Group, NumberInput, Select, TextInput } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import { usePlayerState } from "../../../../../db/hooks/usePlayerState";
import type { Appearance } from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface TopRowFieldsProps extends LockProps {
	setAppearance: (appearance: Partial<Appearance>) => void;
}

export default function TopRowFields({
	setAppearance,
	locks,
	toggleLock,
}: TopRowFieldsProps) {
	const { playerState } = usePlayerState();
	const { age, species, genderExpression } = playerState?.appearance ?? {};

	return (
		<Group grow align="start" gap="xs">
			<Group gap={4} wrap="nowrap">
				<NumberInput
					label="Age"
					placeholder="Age"
					min={18}
					value={age ?? ""}
					onChange={(value) =>
						setAppearance({
							age: typeof value === "number" ? value : undefined,
						})
					}
					disabled={locks.age}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.age} toggle={() => toggleLock("age")} />
			</Group>
			<Group gap={4} wrap="nowrap">
				<TextInput
					label="Species"
					placeholder="Human"
					value={species ?? ""}
					onChange={(event) =>
						setAppearance({ species: event.currentTarget.value })
					}
					disabled={locks.species}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.species}
					toggle={() => toggleLock("species")}
				/>
			</Group>
			<Group gap={4} wrap="nowrap">
				<Select
					label="Expression"
					placeholder="Select"
					clearable
					data={[
						{ value: "feminine", label: "Feminine" },
						{ value: "masculine", label: "Masculine" },
						{ value: "androgynous", label: "Androgynous" },
					]}
					value={genderExpression ?? null}
					onChange={(value) => {
						const next = value ?? undefined;

						if (next === genderExpression) {
							return;
						}

						const updates: Partial<Appearance> = {
							genderExpression: next,
						};

						if (next === "feminine") {
							updates.cockSize = undefined;
							updates.shoulders = undefined;
							updates.facialHair = undefined;
						} else if (next === "masculine") {
							updates.bust = undefined;
							updates.hips = undefined;
						}

						setAppearance(updates);
					}}
					disabled={locks.genderExpression}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.genderExpression}
					toggle={() => toggleLock("genderExpression")}
				/>
			</Group>
		</Group>
	);
}
