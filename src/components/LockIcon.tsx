import { ActionIcon } from "@mantine/core";
import { FaLock, FaLockOpen } from "react-icons/fa";

interface LockIconProps {
	isLocked: boolean;
	toggle: () => void;
}

export default function LockIcon({ isLocked, toggle }: LockIconProps) {
	return (
		<ActionIcon
			variant="subtle"
			color={isLocked ? "red" : "gray"}
			title={isLocked ? "Unlock" : "Lock"}
			mt="lg"
			onClick={(event) => {
				event.preventDefault();
				toggle();
			}}
		>
			{isLocked ? <FaLock /> : <FaLockOpen />}
		</ActionIcon>
	);
}
