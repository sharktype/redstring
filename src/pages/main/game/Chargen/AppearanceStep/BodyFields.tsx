import { Group, Select } from "@mantine/core";
import type PlayerState from "../../../../../models/PlayerState";

interface BodyFieldsProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function BodyFields({
	appearance,
	setAppearance,
}: BodyFieldsProps) {
	return (
		<Group grow align="start" gap="xs">
			<Select
				label="Size"
				placeholder="Select"
				clearable
				data={[
					{ value: "slight", label: "Slight" },
					{ value: "average", label: "Average" },
					{ value: "large", label: "Large" },
				]}
				value={appearance.size ?? null}
				onChange={(value) =>
					setAppearance({
						size: value as NonNullable<typeof appearance>["size"],
					})
				}
			/>
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
				value={appearance.build ?? null}
				onChange={(value) =>
					setAppearance({
						build: value as NonNullable<typeof appearance>["build"],
					})
				}
			/>
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
				value={appearance.height ?? null}
				onChange={(value) =>
					setAppearance({
						height: value as NonNullable<typeof appearance>["height"],
					})
				}
			/>
		</Group>
	);
}
