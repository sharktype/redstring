import {
	Box,
	Button,
	Group,
	Modal,
	Notification,
	SegmentedControl,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { type RefObject, useCallback, useRef, useState } from "react";

import useGameContext from "../../../../../context/GameContext/useGameContext";
import type Agent from "../../../../../handlers/agents";

import {
	buildImageGenPrompt,
	PROFILE_STATE_LABELS,
} from "../../../../../handlers/imagegen/buildImageGenPrompt";
import type {
	ProfileState,
	ProfileVariant,
} from "../../../../../models/PlayerState";
import {
	NSFW_PROFILE_STATES,
	PROFILE_STATES,
} from "../../../../../models/PlayerState";

import type { ChargenStepProps } from "..";
import ProfileSquare from "./ProfileSquare";

const PROFILE_SIDE_LENGTH = 256;

const GENERATE_ALL_PROFILES_BATCH_SIZE = 4;

type VariantMode = "base" | "nude";

export default function ProfileStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState, agentConfigs, gameState } =
		useGameContext();

	const profilerAgent = agentConfigs.find(
		(agent): agent is Agent => agent.type === "profiler",
	);

	const isNsfw = gameState?.isNsfw ?? false;
	const allStates: ProfileState[] = isNsfw
		? [...PROFILE_STATES, ...NSFW_PROFILE_STATES]
		: [...PROFILE_STATES];

	const profiles = playerState?.portraits?.profiles ?? {};

	const [variantMode, setVariantMode] = useState<VariantMode>("base");
	const [generating, setGenerating] = useState<Set<string>>(new Set());
	const [error, setError] = useState<string | null>(null);
	const [removing, setRemoving] = useState<ProfileState | null>(null);

	// Ref to safely merge profile results across concurrent generations.
	const latestProfiles = useRef<Record<string, ProfileVariant>>({
		...profiles,
	}) as RefObject<Record<string, ProfileVariant>>;

	const generateVariant = useCallback(
		async (state: ProfileState, variant: keyof ProfileVariant) => {
			const key = `${state}:${variant}`;

			if (!profilerAgent?.providerConfigId) {
				setError("No profiler agent configured. Add one in settings.");

				return;
			}

			if (!playerState?.appearance) {
				setError("Please fill in appearance details first.");

				return;
			}

			setGenerating((previous) => new Set(previous).add(key));
			setError(null);

			try {
				const prompt = buildImageGenPrompt(
					playerState.appearance,
					variant === "nude" ? "nude" : "base",
					isNsfw,
					state,
				);

				const stream = await profilerAgent.generate(prompt, {
					width: PROFILE_SIDE_LENGTH,
					height: PROFILE_SIDE_LENGTH,
				});

				const reader = stream.getReader();
				let imageDataUrl = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					imageDataUrl += value;
				}

				if (!imageDataUrl) {
					throw new Error("Image agent returned no image.");
				}

				latestProfiles.current = {
					...latestProfiles.current,
					[state]: {
						...latestProfiles.current[state],
						[variant]: imageDataUrl,
					},
				};

				await updatePlayerState({
					portraits: {
						...playerState?.portraits,
						profiles: { ...latestProfiles.current },
					},
				});
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "Generation failed for an unknown reason.",
				);
			} finally {
				setGenerating((previous) => {
					const next = new Set(previous);

					next.delete(key);

					return next;
				});
			}
		},
		[profilerAgent, playerState, updatePlayerState, isNsfw],
	);

	const generateAll = useCallback(async () => {
		for (
			let i = 0;
			i < allStates.length;
			i += GENERATE_ALL_PROFILES_BATCH_SIZE
		) {
			const batch = allStates.slice(i, i + GENERATE_ALL_PROFILES_BATCH_SIZE);
			await Promise.all(
				batch.map((state) => generateVariant(state, variantMode)),
			);
		}
	}, [allStates, variantMode, generateVariant]);

	const removeVariant = useCallback(
		async (state: ProfileState) => {
			const current = latestProfiles.current[state];
			if (!current) {
				return;
			}

			const updated = { ...current };

			delete updated[variantMode];

			setRemoving(null);

			latestProfiles.current = {
				...latestProfiles.current,
				[state]: updated,
			};

			await updatePlayerState({
				portraits: {
					...playerState?.portraits,
					profiles: { ...latestProfiles.current },
				},
			});
		},
		[variantMode, playerState, updatePlayerState],
	);

	return (
		<Box
			p="lg"
			style={{
				borderRadius: "var(--mantine-radius-md)",
				border: "1px solid var(--mantine-color-default-border)",
			}}
		>
			<Stack gap="sm">
				<Group justify="space-between" align="center">
					<Title order={4}>Profiles</Title>
					{isNsfw && (
						<SegmentedControl
							size="xs"
							value={variantMode}
							onChange={(variant) => setVariantMode(variant as VariantMode)}
							data={[
								{ label: "Clothed", value: "base" },
								{ label: "Nude", value: "nude" },
							]}
						/>
					)}
				</Group>

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
								onRegenerate={(state) => generateVariant(state, variantMode)}
								onRemove={setRemoving}
							/>
						);
					})}
				</SimpleGrid>

				<Button
					variant="outline"
					color="yellow"
					fullWidth
					onClick={generateAll}
					disabled={generating.size > 0 || !profilerAgent?.providerConfigId}
				>
					Generate All
				</Button>

				{error && (
					<Notification
						color="red"
						title="Generation failed"
						onClose={() => setError(null)}
					>
						{error}
					</Notification>
				)}

				<Modal
					opened={removing !== null}
					onClose={() => setRemoving(null)}
					title={`Remove ${removing ? PROFILE_STATE_LABELS[removing] : ""} variant?`}
					size="sm"
					centered
				>
					<Text size="sm" mb="md">
						This will delete the {variantMode === "base" ? "clothed" : "nude"}{" "}
						profile image. You can regenerate it later.
					</Text>
					<Group justify="flex-end">
						<Button variant="default" onClick={() => setRemoving(null)}>
							Cancel
						</Button>
						<Button
							color="red"
							onClick={() => removing && removeVariant(removing)}
						>
							Remove
						</Button>
					</Group>
				</Modal>
			</Stack>
		</Box>
	);
}
