import { Group, Select } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import type PlayerState from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface BodyFieldsProps extends LockProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function BodyFields({
	appearance,
	setAppearance,
	locks,
	toggleLock,
}: BodyFieldsProps) {
	return (
		<Group grow align="start" gap="xs">
			<Group gap={4} wrap="nowrap">
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
					disabled={locks.size}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.size} toggle={() => toggleLock("size")} />
			</Group>
			<Group gap={4} wrap="nowrap">
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
					disabled={locks.build}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.build} toggle={() => toggleLock("build")} />
			</Group>
			<Group gap={4} wrap="nowrap">
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
					disabled={locks.height}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.height} toggle={() => toggleLock("height")} />
			</Group>
		</Group>
	);
}
