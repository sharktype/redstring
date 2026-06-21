import {
	ActionIcon,
	Box,
	Flex,
	Group,
	NumberInput,
	Select,
	Stack,
	Switch,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { useState } from "react";
import { FaDice, FaEraser } from "react-icons/fa";
import useGameContext from "../../../../../context/hooks/useGameContext";
import type { GenderExpression } from "../../../../../models/PlayerState";
import type { ChargenStepProps } from "..";
import AppearanceForm from "./AppearanceForm";
import PortraitUploader from "./PortraitUploader";

export default function AppearanceStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState } = useGameContext();
	const [isNsfw, setIsNsfw] = useState(false);

	const appearance = playerState?.appearance ?? {};
	const genderExpr = playerState?.genderExpression;

	const setAppearance = (updates: Partial<NonNullable<typeof appearance>>) => {
		updatePlayerState({
			appearance: { ...playerState?.appearance, ...updates },
		});
	};

	const handleGenderExpressionChange = (expression: string | null) => {
		const next = (expression as GenderExpression) ?? undefined;

		updatePlayerState({ genderExpression: next });

		if (next !== "masculine" && next !== "androgynous") {
			setAppearance({ shoulders: undefined, facialHair: undefined });
		}

		if (next !== "feminine" && next !== "androgynous") {
			setAppearance({ bust: undefined, hips: undefined });
		}
	};

	const hasPenis =
		appearance.genitals === "penisCircumcised" ||
		appearance.genitals === "penisUncircumcised";

	return (
		<Box
			p="lg"
			style={{
				borderRadius: "var(--mantine-radius-md)",
				border: "1px solid var(--mantine-color-default-border)",
			}}
		>
			<Stack gap="sm">
				<Group justify="space-between">
					<Title order={4}>Appearance</Title>
					<Group gap="xs">
						<ActionIcon variant="subtle" color="gray" title="Clear">
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon variant="subtle" color="gray" title="Randomise">
							<FaDice size={16} />
						</ActionIcon>
					</Group>
				</Group>

				<Flex gap="lg" wrap="wrap">
					<Stack
						gap="xs"
						style={{
							flex: 1,
							minWidth: 230,
							maxWidth: 320,
						}}
					>
						<PortraitUploader isNsfwMode={isNsfw} />
					</Stack>

					<Stack gap="xs" style={{ flex: 2.5, minWidth: 300 }}>
						<Group grow align="start" gap="xs">
							<NumberInput
								label="Age"
								placeholder="Age"
								min={18}
								value={appearance.age ?? ""}
								onChange={(val) =>
									setAppearance({
										age: typeof val === "number" ? val : undefined,
									})
								}
							/>
							<TextInput
								label="Species"
								placeholder="Human"
								value={appearance.species ?? ""}
								onChange={(e) =>
									setAppearance({
										species: e.currentTarget.value,
									})
								}
							/>
							<Select
								label="Expression"
								placeholder="Select"
								clearable
								data={[
									{
										value: "feminine",
										label: "Feminine",
									},
									{
										value: "masculine",
										label: "Masculine",
									},
									{
										value: "androgynous",
										label: "Androgynous",
									},
								]}
								value={genderExpr ?? null}
								onChange={handleGenderExpressionChange}
							/>
						</Group>

						<AppearanceForm />

						<Switch
							label="NSFW Mode"
							checked={isNsfw}
							onChange={(e) => setIsNsfw(e.currentTarget.checked)}
							size="sm"
							mt="xs"
						/>

						{isNsfw && (
							<>
								<Select
									label="Genitals"
									placeholder="Select"
									clearable
									data={[
										{
											value: "vulva",
											label: "Vulva",
										},
										{
											value: "penisCircumcised",
											label: "Penis (circumcised)",
										},
										{
											value: "penisUncircumcised",
											label: "Penis (uncircumcised)",
										},
										{
											value: "none",
											label: "None",
										},
									]}
									value={appearance.genitals ?? null}
									onChange={(value) => {
										const next = value as NonNullable<
											typeof appearance
										>["genitals"];
										const reset: Partial<NonNullable<typeof appearance>> = {
											genitals: next,
										};
										if (
											next !== "penisCircumcised" &&
											next !== "penisUncircumcised"
										) {
											reset.cockSize = undefined;
										}
										setAppearance(reset);
									}}
								/>

								{hasPenis && (
									<Select
										label="Cock Size"
										placeholder="Select"
										clearable
										data={[
											{
												value: "verySmall",
												label: "Very Small",
											},
											{
												value: "small",
												label: "Small",
											},
											{
												value: "average",
												label: "Average",
											},
											{
												value: "large",
												label: "Large",
											},
											{
												value: "veryLarge",
												label: "Very Large",
											},
										]}
										value={appearance.cockSize ?? null}
										onChange={(value) =>
											setAppearance({
												cockSize: value as NonNullable<
													typeof appearance
												>["cockSize"],
											})
										}
									/>
								)}
							</>
						)}

						<Textarea
							label="Base Portrait Clothing Style"
							description="For the generator/yourself, the default style in which your character dresses."
							placeholder="e.g. white tee for comfort, button down for travel, plate metal for battle"
							minRows={2}
							autosize
							value={appearance.clothingStyle ?? ""}
							onChange={(e) =>
								setAppearance({
									clothingStyle: e.currentTarget.value,
								})
							}
						/>

						<Textarea
							label="Custom"
							description="Optional freeform notes about your character's appearance."
							placeholder="e.g., anything you like"
							minRows={2}
							autosize
							value={appearance.custom ?? ""}
							onChange={(event) =>
								setAppearance({
									custom: event.currentTarget.value,
								})
							}
						/>
					</Stack>
				</Flex>
			</Stack>
		</Box>
	);
}
