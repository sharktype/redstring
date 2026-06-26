import { ActionIcon, Group, Stack, Text, TextInput } from "@mantine/core";
import { FaDice } from "react-icons/fa";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import { type LockProps, setExpressionField } from "./locks";
import { randomiseExpressions } from "./randomize";

export default function ExpressionsPanel({ locks, toggleLock }: LockProps) {
	const { playerState, updatePlayerState } = useGameContext();

	const expressions = playerState?.expressions ?? {};

	const setExpression = (key: "neutral" | "injured" | "cum", value: string) => {
		const next = setExpressionField(playerState?.expressions, key, value);

		updatePlayerState({ expressions: next });
	};

	const handleRandomise = () => {
		const next = randomiseExpressions(playerState?.expressions, locks);

		updatePlayerState({ expressions: next });
	};

	const isAllLocked = locks.neutral && locks.injured && locks.cum;

	return (
		<Stack gap="xs" miw={256}>
			<Group justify="space-between">
				<Text size="sm" fw={600}>
					Expressions
				</Text>
				<ActionIcon
					variant="subtle"
					color="gray"
					title="Randomise expressions"
					onClick={handleRandomise}
					disabled={isAllLocked}
				>
					<FaDice size={14} />
				</ActionIcon>
			</Group>

			<Group gap={4} wrap="nowrap">
				<TextInput
					label="Neutral Expression"
					placeholder="e.g. serious"
					value={expressions.neutral ?? ""}
					onChange={(event) =>
						setExpression("neutral", event.currentTarget.value)
					}
					disabled={locks.neutral}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.neutral}
					toggle={() => toggleLock("neutral")}
				/>
			</Group>

			<Group gap={4} wrap="nowrap">
				<TextInput
					label="Injured Expression"
					placeholder="e.g. furious"
					value={expressions.injured ?? ""}
					onChange={(event) =>
						setExpression("injured", event.currentTarget.value)
					}
					disabled={locks.injured}
					style={{ flex: 1 }}
				/>
				<LockIcon
					isLocked={locks.injured}
					toggle={() => toggleLock("injured")}
				/>
			</Group>

			<Group gap={4} wrap="nowrap">
				<TextInput
					label="Cum Expression"
					placeholder="e.g. slutty"
					value={expressions.cum ?? ""}
					onChange={(event) => setExpression("cum", event.currentTarget.value)}
					disabled={locks.cum}
					style={{ flex: 1 }}
				/>
				<LockIcon isLocked={locks.cum} toggle={() => toggleLock("cum")} />
			</Group>
		</Stack>
	);
}
