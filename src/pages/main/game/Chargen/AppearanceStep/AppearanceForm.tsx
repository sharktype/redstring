import { Group, Select, TextInput } from "@mantine/core";
import useGameContext from "../../../../../context/hooks/useGameContext";

export default function AppearanceForm() {
	const { playerState, updatePlayerState } = useGameContext();

	const genderExpression = playerState?.genderExpression;
	const appearance = playerState?.appearance ?? {};

	const isMasculine =
		genderExpression === "masculine" || genderExpression === "androgynous";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	const setAppearance = (updates: Partial<NonNullable<typeof appearance>>) => {
		updatePlayerState({
			appearance: { ...playerState?.appearance, ...updates },
		});
	};

	return (
		<>
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
					onChange={(val) =>
						setAppearance({
							size: val as NonNullable<typeof appearance>["size"],
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
						{
							value: "muscular",
							label: "Muscular",
						},
					]}
					value={appearance.build ?? null}
					onChange={(val) =>
						setAppearance({
							build: val as NonNullable<typeof appearance>["build"],
						})
					}
				/>
				<Select
					label="Height"
					placeholder="Select"
					clearable
					data={[
						{
							value: "veryShort",
							label: "Very Short",
						},
						{ value: "short", label: "Short" },
						{
							value: "belowAverage",
							label: "Below Average",
						},
						{ value: "average", label: "Average" },
						{
							value: "aboveAverage",
							label: "Above Average",
						},
						{ value: "tall", label: "Tall" },
						{
							value: "veryTall",
							label: "Very Tall",
						},
					]}
					value={appearance.height ?? null}
					onChange={(val) =>
						setAppearance({
							height: val as NonNullable<typeof appearance>["height"],
						})
					}
				/>
			</Group>

			{isMasculine && (
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
					onChange={(val) =>
						setAppearance({
							shoulders: val as NonNullable<typeof appearance>["shoulders"],
						})
					}
				/>
			)}

			{isFeminine && (
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
							{
								value: "veryLarge",
								label: "Very Large",
							},
						]}
						value={appearance.bust ?? null}
						onChange={(val) =>
							setAppearance({
								bust: val as NonNullable<typeof appearance>["bust"],
							})
						}
					/>
					<Select
						label="Hips"
						placeholder="Select"
						clearable
						data={[
							{ value: "narrow", label: "Narrow" },
							{
								value: "average",
								label: "Average",
							},
							{ value: "wide", label: "Wide" },
						]}
						value={appearance.hips ?? null}
						onChange={(val) =>
							setAppearance({
								hips: val as NonNullable<typeof appearance>["hips"],
							})
						}
					/>
				</Group>
			)}

			<Group grow align="start" gap="xs">
				<TextInput
					label="Skin Tone"
					placeholder="e.g. pale, dark brown, olive"
					value={appearance.skinColour ?? ""}
					onChange={(e) =>
						setAppearance({
							skinColour: e.currentTarget.value,
						})
					}
				/>
				<TextInput
					label="Complexion"
					placeholder="e.g. clear, freckled, scarred"
					value={appearance.complexion ?? ""}
					onChange={(e) =>
						setAppearance({
							complexion: e.currentTarget.value,
						})
					}
				/>
			</Group>

			<Group grow align="start" gap="xs">
				<TextInput
					label="Hair Style"
					placeholder="e.g. long, braided, bald"
					value={appearance.hairStyle ?? ""}
					onChange={(e) =>
						setAppearance({
							hairStyle: e.currentTarget.value,
						})
					}
				/>
				<TextInput
					label="Hair Colour"
					placeholder="e.g. black, auburn, silver"
					value={appearance.hairColour ?? ""}
					onChange={(e) =>
						setAppearance({
							hairColour: e.currentTarget.value,
						})
					}
				/>
			</Group>

			{isMasculine && (
				<TextInput
					label="Facial Hair (optional)"
					placeholder="e.g. clean-shaven, stubble, full beard"
					value={appearance.facialHair ?? ""}
					onChange={(e) =>
						setAppearance({
							facialHair: e.currentTarget.value,
						})
					}
				/>
			)}
		</>
	);
}
