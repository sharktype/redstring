import { Select, TextInput } from "@mantine/core";
import type PlayerState from "../../../../../models/PlayerState";

interface MasculineFieldsProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function MasculineFields({
	appearance,
	setAppearance,
}: MasculineFieldsProps) {
	return (
		<>
			<Select
				label="Shoulders"
				placeholder="Select"
				clearable
				data={[
					{ value: "narrow", label: "Narrow" },
					{ value: "average", label: "Average" },
					{ value: "broad", label: "Broad" },
				]}
				value={appearance.shoulders ?? null}
				onChange={(value) =>
					setAppearance({
						shoulders: value as NonNullable<typeof appearance>["shoulders"],
					})
				}
			/>
			<TextInput
				label="Facial Hair"
				placeholder="e.g. clean-shaven, stubble, full beard"
				value={appearance.facialHair ?? ""}
				onChange={(event) =>
					setAppearance({
						facialHair: event.currentTarget.value,
					})
				}
			/>
		</>
	);
}
