import { Group, Select } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import type PlayerState from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface FeminineFieldsProps extends LockProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function FeminineFields({
	appearance,
	setAppearance,
	locks,
	toggleLock,
}: FeminineFieldsProps) {
	return (
		<Group grow align="start" gap="xs">
			<Group gap={4} wrap="nowrap">
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
					disabled={locks.bust}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.bust} toggle={() => toggleLock("bust")} />
			</Group>
			<Group gap={4} wrap="nowrap">
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
					disabled={locks.hips}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.hips} toggle={() => toggleLock("hips")} />
			</Group>
		</Group>
	);
}
