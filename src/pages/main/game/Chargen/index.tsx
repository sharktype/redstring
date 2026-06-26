import { Box, Flex, Stack, Title } from "@mantine/core";
import {
	type ComponentType,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import useGameContext from "../../../../context/GameContext/useGameContext";
import {
	type ChargenPage,
	PAGE_STEPS,
	type Step,
} from "../../../../models/Chargen";
import type { StoredPlayerState } from "../../../../models/PlayerState";
import AppearanceStep from "./AppearanceStep";
import BodyArtStep from "./BodyArtStep/index.tsx";
import ExtraStatsStep from "./ExtraStatsStep";
import NameStep from "./NameStep";
import ProfileStep from "./ProfileStep/index.tsx";
import StyleStep from "./StyleStep/index.tsx";
import TimeStep from "./TimeStep";
import WealthStep from "./WealthStep";

const VIGNETTE_HEIGHT = 64;

const PAGE_LABELS: Record<ChargenPage, string> = {
	identity: "Identity",
	background: "Background",
	stats: "Stats",
	inventory: "Inventory",
	scenario: "Scenario",
};

export interface ChargenStepProps {
	playerState: StoredPlayerState;
	onChange: (updates: Partial<Omit<StoredPlayerState, "id">>) => void;
}

const STEP_TO_COMPONENT: Record<Step, ComponentType<ChargenStepProps>> = {
	name: NameStep,
	appearance: AppearanceStep,
	bodyArt: BodyArtStep,
	style: StyleStep,
	profile: ProfileStep,
	extraStats: ExtraStatsStep,
	time: TimeStep,
	wealth: WealthStep,
};

export default function Chargen() {
	const { playerState, updatePlayerState, chargenPage } = useGameContext();

	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollState, setScrollState] = useState({ top: 0, bottom: 0 });
	const requestAnimationFrameRef = useRef<number>(0);

	// We need to update the scroll state to handle the vignette of overflowing pages.

	const updateScroll = useCallback(() => {
		const containerElement = containerRef.current;
		if (!containerElement) {
			return;
		}

		const maxScroll =
			containerElement.scrollHeight - containerElement.clientHeight;

		if (maxScroll <= 0) {
			setScrollState({ top: 0, bottom: 0 });

			return;
		}

		const top = Math.min(containerElement.scrollTop / VIGNETTE_HEIGHT, 1);
		const bottom = Math.min(
			(maxScroll - containerElement.scrollTop) / VIGNETTE_HEIGHT,
			1,
		);

		setScrollState({ top, bottom });
	}, []);

	const handleScroll = useCallback(() => {
		cancelAnimationFrame(requestAnimationFrameRef.current);
		requestAnimationFrameRef.current = requestAnimationFrame(updateScroll);
	}, [updateScroll]);

	useEffect(() => {
		const containerElement = containerRef.current;
		if (!containerElement) {
			return;
		}

		updateScroll();

		containerElement.addEventListener("scroll", handleScroll, {
			passive: true,
		});

		const observer = new ResizeObserver(updateScroll);

		observer.observe(containerElement);

		return () => {
			containerElement.removeEventListener("scroll", handleScroll);

			observer.disconnect();

			cancelAnimationFrame(requestAnimationFrameRef.current);
		};
	}, [handleScroll, updateScroll]);

	if (!playerState) {
		return null;
	}

	const handleChange = (updates: Partial<Omit<StoredPlayerState, "id">>) => {
		updatePlayerState(updates);
	};

	const steps = PAGE_STEPS[chargenPage];

	return (
		<Box pos="relative" flex={1} h="100%">
			<Flex
				ref={containerRef}
				flex={1}
				h="100%"
				justify="center"
				p="md"
				style={{ overflowY: "auto" }}
			>
				<Stack gap="lg" w="100%" mt="xl" maw={980}>
					<Title order={2}>{PAGE_LABELS[chargenPage]}</Title>
					{steps.map((step) => {
						const Component = STEP_TO_COMPONENT[step];
						return (
							<Component
								key={step}
								playerState={playerState}
								onChange={handleChange}
							/>
						);
					})}
					<Box style={{ minHeight: "var(--mantine-spacing-xl)" }} />
				</Stack>
			</Flex>
			<Box
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: VIGNETTE_HEIGHT,
					background:
						"linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
					opacity: scrollState.top,
					pointerEvents: "none",
					transition: "opacity 250ms ease",
					zIndex: 1,
				}}
			/>
			<Box
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: VIGNETTE_HEIGHT,
					background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
					opacity: scrollState.bottom,
					pointerEvents: "none",
					transition: "opacity 250ms ease",
					zIndex: 1,
				}}
			/>
		</Box>
	);
}
