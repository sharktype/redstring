import { Group, Select, TextInput } from "@mantine/core";
import LockIcon from "../../../../../components/LockIcon";
import type PlayerState from "../../../../../models/PlayerState";
import type { LockProps } from "./locks";

interface MasculineFieldsProps extends LockProps {
	appearance: NonNullable<PlayerState["appearance"]>;
	setAppearance: (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => void;
}

export default function MasculineFields({
	appearance,
	setAppearance,
	locks,
	toggleLock,
}: MasculineFieldsProps) {
	return (
		<>
			<Group gap={4} wrap="nowrap">
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
					disabled={locks.shoulders}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.shoulders}
					toggle={() => toggleLock("shoulders")}
				/>
			</Group>
			<Group gap={4} wrap="nowrap">
				<TextInput
					label="Facial Hair"
					placeholder="e.g. clean-shaven, stubble, full beard"
					value={appearance.facialHair ?? ""}
					onChange={(event) =>
						setAppearance({
							facialHair: event.currentTarget.value,
						})
					}
					disabled={locks.facialHair}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.facialHair}
					toggle={() => toggleLock("facialHair")}
				/>
			</Group>
		</>
	);
}
