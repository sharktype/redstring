import { Group, TextInput } from "@mantine/core";
import type { ReactNode } from "react";
import LockIcon from "../../../../../components/LockIcon";
import type { BodyArtLockKey, LockProps } from "./locks";

interface BodyArtFieldProps extends LockProps {
	label: ReactNode;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	lockKey: BodyArtLockKey;
}

export default function BodyArtField({
	label,
	placeholder,
	value,
	onChange,
	locks,
	toggleLock,
	lockKey,
}: BodyArtFieldProps) {
	return (
		<Group gap={4} wrap="nowrap">
			<TextInput
				label={label}
				placeholder={placeholder}
				value={value}
				onChange={(event) => onChange(event.currentTarget.value)}
				disabled={locks[lockKey]}
				style={{ flex: 1 }}
			/>
			<LockIcon isLocked={locks[lockKey]} toggle={() => toggleLock(lockKey)} />
		</Group>
	);
}
