import { Group, TextInput } from "@mantine/core";
import type PlayerState from "../../../../../models/PlayerState";

interface DetailFieldsProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function DetailFields({
	appearance,
	setAppearance,
}: DetailFieldsProps) {
	return (
		<>
			<Group grow align="start" gap="xs">
				<TextInput
					label="Skin Tone"
					placeholder="e.g. pale, dark brown, olive"
					value={appearance.skinColour ?? ""}
					onChange={(event) =>
						setAppearance({
							skinColour: event.currentTarget.value,
						})
					}
				/>
				<TextInput
					label="Complexion"
					placeholder="e.g. clear, freckled, scarred"
					value={appearance.complexion ?? ""}
					onChange={(event) =>
						setAppearance({
							complexion: event.currentTarget.value,
						})
					}
				/>
			</Group>

			<Group grow align="start" gap="xs">
				<TextInput
					label="Hair Style"
					placeholder="e.g. long, braided, bald"
					value={appearance.hairStyle ?? ""}
					onChange={(event) =>
						setAppearance({
							hairStyle: event.currentTarget.value,
						})
					}
				/>
				<TextInput
					label="Hair Colour"
					placeholder="e.g. black, auburn, silver"
					value={appearance.hairColour ?? ""}
					onChange={(event) =>
						setAppearance({
							hairColour: event.currentTarget.value,
						})
					}
				/>
			</Group>
		</>
	);
}
