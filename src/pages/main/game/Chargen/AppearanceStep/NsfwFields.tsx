import { Group, Select, Text } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { Appearance } from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface NsfwFieldsProps extends LockProps {
	setAppearance: (updates: Partial<Appearance>) => void;
}

export default function NsfwFields({
	setAppearance,
	locks,
	toggleLock,
}: NsfwFieldsProps) {
	const { playerState } = useGameContext();

	const appearance = playerState?.appearance;

	const hasPenis =
		appearance?.genitals === "penisCircumcised" ||
		appearance?.genitals === "penisUncircumcised";

	return (
		<>
			<Group grow align="start" gap="xs">
				<Group gap={4} wrap="nowrap">
					<Select
						label={
							<>
								Genitals{" "}
								<Text component="span" c="red" size="xs" fw={600}>
									18+
								</Text>
							</>
						}
						placeholder="Select"
						clearable
						data={[
							{ value: "vulva", label: "Vulva" },
							{
								value: "penisCircumcised",
								label: "Penis (circumcised)",
							},
							{
								value: "penisUncircumcised",
								label: "Penis (uncircumcised)",
							},
							{ value: "none", label: "None" },
						]}
						value={appearance?.genitals ?? null}
						onChange={(value) => {
							if (value) {
								const reset: Partial<typeof appearance> = {
									genitals: value,
								};

								if (
									value !== "penisCircumcised" &&
									value !== "penisUncircumcised"
								) {
									reset.cockSize = undefined;
								}

								setAppearance(reset);
							}
						}}
						disabled={locks.genitals}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.genitals}
						toggle={() => toggleLock("genitals")}
					/>
				</Group>

				{hasPenis && (
					<Group gap={4} wrap="nowrap">
						<Select
							label={
								<>
									Cock Size{" "}
									<Text component="span" c="red" size="xs" fw={600}>
										18+
									</Text>
								</>
							}
							placeholder="Select"
							clearable
							data={[
								{ value: "verySmall", label: "Very Small" },
								{ value: "small", label: "Small" },
								{ value: "average", label: "Average" },
								{ value: "large", label: "Large" },
								{ value: "veryLarge", label: "Very Large" },
							]}
							value={appearance.cockSize ?? null}
							onChange={(value) => {
								if (value) {
									setAppearance({
										cockSize: value,
									});
								}
							}}
							disabled={locks.cockSize}
							style={{ flex: 1 }}
						/>
						<LockIcon
							isLocked={locks.cockSize}
							toggle={() => toggleLock("cockSize")}
						/>
					</Group>
				)}
			</Group>

			<Group grow align="start" gap="xs">
				<Group gap={4} wrap="nowrap">
					<Select
						label={
							<>
								Body Hair{" "}
								<Text component="span" c="red" size="xs" fw={600}>
									18+
								</Text>
							</>
						}
						placeholder="Select"
						clearable
						data={[
							{ value: "none", label: "None" },
							{ value: "light", label: "Light" },
							{ value: "moderate", label: "Moderate" },
							{ value: "heavy", label: "Heavy" },
						]}
						value={appearance?.bodyHair ?? null}
						onChange={(value) => {
							if (value) {
								setAppearance({
									bodyHair: value,
								});
							}
						}}
						disabled={locks.bodyHair}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.bodyHair}
						toggle={() => toggleLock("bodyHair")}
					/>
				</Group>
				<Group gap={4} wrap="nowrap">
					<Select
						label={
							<>
								Genital Hair{" "}
								<Text component="span" c="red" size="xs" fw={600}>
									18+
								</Text>
							</>
						}
						placeholder="Select"
						clearable
						data={[
							{ value: "none", label: "None" },
							{ value: "light", label: "Light" },
							{ value: "moderate", label: "Moderate" },
							{ value: "heavy", label: "Heavy" },
						]}
						value={appearance?.genitalHair ?? null}
						onChange={(value) => {
							if (value) {
								setAppearance({
									genitalHair: value,
								});
							}
						}}
						disabled={locks.genitalHair}
						style={{ flex: 1 }}
					/>
					<LockIcon
						isLocked={locks.genitalHair}
						toggle={() => toggleLock("genitalHair")}
					/>
				</Group>
			</Group>
		</>
	);
}
