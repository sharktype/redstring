import { Group, Select } from "@mantine/core";
import type PlayerState from "../../../../../models/PlayerState";

interface FeminineFieldsProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function FeminineFields({
	appearance,
	setAppearance,
}: FeminineFieldsProps) {
	return (
		<Group grow align="start" gap="xs">
			<Select
				label="Bust"
				placeholder="Select"
				clearable
				data={[
					{ value: "flat", label: "Flat" },
					{ value: "small", label: "Small" },
					{ value: "medium", label: "Medium" },
					{ value: "large", label: "Large" },
					{ value: "veryLarge", label: "Very Large" },
				]}
				value={appearance.bust ?? null}
				onChange={(value) =>
					setAppearance({
						bust: value as NonNullable<typeof appearance>["bust"],
					})
				}
			/>
			<Select
				label="Hips"
				placeholder="Select"
				clearable
				data={[
					{ value: "narrow", label: "Narrow" },
					{ value: "average", label: "Average" },
					{ value: "wide", label: "Wide" },
				]}
				value={appearance.hips ?? null}
				onChange={(value) =>
					setAppearance({
						hips: value as NonNullable<typeof appearance>["hips"],
					})
				}
			/>
		</Group>
	);
}
