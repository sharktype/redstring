import { SegmentedControl, SimpleGrid, Stack } from "@mantine/core";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import {
	PROFILE_STATES,
	type ProfileState,
} from "../../../../../models/PlayerState";
import ProfileSquare from "./ProfileSquare";
import type { VariantMode } from "./types";

interface ProfileGridProps {
	variantMode: VariantMode;
	setVariantMode: (variant: VariantMode) => void;
	generating: Set<string>;
	onGenerate: (state: ProfileState) => void;
	onRemove: (state: ProfileState) => void;
}

export default function ProfileGrid({
	variantMode,
	setVariantMode,
	generating,
	onGenerate,
	onRemove,
}: ProfileGridProps) {
	const { playerState } = useGameContext();

	const allStates: ProfileState[] = [...PROFILE_STATES];

	const profiles = playerState?.portraits?.profiles ?? {};

	return (
		<Stack gap="xs" flex={1} pr="md">
			<SegmentedControl
				size="xs"
				value={variantMode}
				onChange={(variant) => setVariantMode(variant as VariantMode)}
				data={[
					{ label: "Clothed", value: "base" },
					{ label: "Nude", value: "nude" },
				]}
			/>
			<SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xs">
				{allStates.map((state) => {
					const prof = profiles[state];
					const imageUrl = prof?.[variantMode];
					const hasVariant = !!imageUrl;

					return (
						<ProfileSquare
							key={state}
							state={state}
							imageUrl={imageUrl}
							isGenerating={
								generating.has(`${state}:${variantMode}`) ||
								(hasVariant ? false : generating.has(`${state}:base`))
							}
							onGenerate={onGenerate}
							onRemove={onRemove}
						/>
					);
				})}
			</SimpleGrid>
		</Stack>
	);
}
