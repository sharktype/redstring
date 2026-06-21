import useGameContext from "../../../../../context/hooks/useGameContext";
import type PlayerState from "../../../../../models/PlayerState";
import BodyFields from "./BodyFields";
import DetailFields from "./DetailFields";
import FeminineFields from "./FeminineFields";
import MasculineFields from "./MasculineFields";

export default function AppearanceForm() {
	const { playerState, updatePlayerState } = useGameContext();

	const genderExpression = playerState?.genderExpression;
	const appearance = (playerState?.appearance ?? {}) as NonNullable<
		PlayerState["appearance"]
	>;

	const isMasculine =
		genderExpression === "masculine" || genderExpression === "androgynous";
	const isFeminine =
		genderExpression === "feminine" || genderExpression === "androgynous";

	const setAppearance = (
		updates: Partial<NonNullable<PlayerState["appearance"]>>,
	) => {
		updatePlayerState({
			appearance: { ...playerState?.appearance, ...updates },
		});
	};

	return (
		<>
			<BodyFields appearance={appearance} setAppearance={setAppearance} />

			{isMasculine && (
				<MasculineFields
					appearance={appearance}
					setAppearance={setAppearance}
				/>
			)}

			{isFeminine && (
				<FeminineFields appearance={appearance} setAppearance={setAppearance} />
			)}

			<DetailFields appearance={appearance} setAppearance={setAppearance} />
		</>
	);
}
