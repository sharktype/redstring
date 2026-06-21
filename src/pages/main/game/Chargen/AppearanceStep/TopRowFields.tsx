import { Group, NumberInput, Select, TextInput } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import type { GenderExpression } from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface TopRowFieldsProps extends LockProps {
	age: number | undefined;
	species: string | undefined;
	genderExpression: GenderExpression | undefined;
	onAgeChange: (age: number | undefined) => void;
	onSpeciesChange: (species: string) => void;
	onGenderExpressionChange: (expression: string | null) => void;
}

export default function TopRowFields({
	age,
	species,
	genderExpression,
	onAgeChange,
	onSpeciesChange,
	onGenderExpressionChange,
	locks,
	toggleLock,
}: TopRowFieldsProps) {
	return (
		<Group grow align="start" gap="xs">
			<Group gap={4} wrap="nowrap">
				<NumberInput
					label="Age"
					placeholder="Age"
					min={18}
					value={age ?? ""}
					onChange={(val) =>
						onAgeChange(typeof val === "number" ? val : undefined)
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
					onChange={(e) => onSpeciesChange(e.currentTarget.value)}
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
					onChange={onGenderExpressionChange}
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
