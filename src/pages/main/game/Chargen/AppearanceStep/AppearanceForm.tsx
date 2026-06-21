import useGameContext from "../../../../../context/GameContext/useGameContext";
import type { Appearance } from "../../../../../models/PlayerState";
import BodyFields from "./BodyFields";
import DetailFields from "./DetailFields";
import FeminineFields from "./FeminineFields";
import type { LockProps } from "./locks";
import MasculineFields from "./MasculineFields";

interface AppearanceFormProps extends LockProps {}

export default function AppearanceForm({
	locks,
	toggleLock,
}: AppearanceFormProps) {
	const { playerState, updatePlayerState } = useGameContext();

	const appearance = playerState?.appearance;
	const genderExpression = appearance?.genderExpression;

	const isMasculine =
		genderExpression === "masculine" || genderExpression === "androgynous";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	const setAppearance = (updates: Partial<Appearance>) => {
		updatePlayerState({
			appearance: { ...playerState?.appearance, ...updates },
		});
	};

	return (
		<>
			<BodyFields
				setAppearance={setAppearance}
				locks={locks}
				toggleLock={toggleLock}
			/>

			{isMasculine && (
				<MasculineFields
					setAppearance={setAppearance}
					locks={locks}
					toggleLock={toggleLock}
				/>
			)}

			{isFeminine && (
				<FeminineFields
					setAppearance={setAppearance}
					locks={locks}
					toggleLock={toggleLock}
				/>
			)}

			<DetailFields
				setAppearance={setAppearance}
				locks={locks}
				toggleLock={toggleLock}
			/>
		</>
	);
}
