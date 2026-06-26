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

	const isNsfwMode = gameState?.isNsfw ?? false;
	const allStates: ProfileState[] = isNsfwMode
		? [...PROFILE_STATES, ...NSFW_PROFILE_STATES]
		: [...PROFILE_STATES];

	const profiles = playerState?.portraits?.profiles ?? {};

	const [variantMode, setVariantMode] = useState<VariantMode>("base");
	const [generating, setGenerating] = useState<Set<string>>(new Set());

	const [error, setError] = useState<string | null>(null);

	const [isRemoving, setIsRemoving] = useState<ProfileState | null>(null);
	const [isClearing, setIsClearing] = useState(false);

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
					isNsfwMode,
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
		[profilerAgent, playerState, updatePlayerState, isNsfwMode],
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

	const clearAll = useCallback(async () => {
		const next: Record<string, ProfileVariant> = {};

		for (const [state, variants] of Object.entries(latestProfiles.current)) {
			const updated: ProfileVariant = { ...variants };
			delete updated[variantMode];

			if (Object.keys(updated).length > 0) {
				next[state] = updated;
			}
		}

		latestProfiles.current = next;

		await updatePlayerState({
			portraits: {
				...playerState?.portraits,
				profiles: next,
			},
		});

		setIsClearing(false);
	}, [variantMode, playerState, updatePlayerState]);

	const removeVariant = useCallback(
		async (state: ProfileState) => {
			const current = latestProfiles.current[state];
			if (!current) {
				return;
			}

			const updated = { ...current };

			delete updated[variantMode];

			setIsRemoving(null);

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
					{isNsfwMode && (
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
								onRemove={setIsRemoving}
							/>
						);
					})}
				</SimpleGrid>

				<Group grow>
					<Button
						variant="outline"
						color="yellow"
						onClick={generateAll}
						disabled={generating.size > 0 || !profilerAgent?.providerConfigId}
					>
						Generate All
					</Button>
					<Button
						variant="outline"
						color="red"
						onClick={() => setIsClearing(true)}
						disabled={generating.size > 0 || Object.keys(profiles).length === 0}
					>
						Clear All
					</Button>
				</Group>

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
					opened={isRemoving !== null}
					onClose={() => setIsRemoving(null)}
					title={`Remove ${isRemoving ? PROFILE_STATE_LABELS[isRemoving] : ""} variant?`}
					size="sm"
					centered
				>
					<Text size="sm" mb="md">
						This will delete the{" "}
						{isNsfwMode ? (variantMode === "base" ? "clothed " : "nude ") : ""}
						profile image.
					</Text>
					<Group justify="flex-end">
						<Button variant="default" onClick={() => setIsRemoving(null)}>
							Cancel
						</Button>
						<Button
							color="red"
							onClick={() => isRemoving && removeVariant(isRemoving)}
						>
							Remove
						</Button>
					</Group>
				</Modal>

				<Modal
					opened={isClearing}
					onClose={() => setIsClearing(false)}
					title="Clear all profiles?"
					size="sm"
					centered
				>
					<Text size="sm" mb="md">
						This will delete all generated{" "}
						{isNsfwMode ? (variantMode === "base" ? "clothed " : "nude ") : ""}
						profile images.
					</Text>
					<Group justify="flex-end">
						<Button variant="default" onClick={() => setIsClearing(false)}>
							Cancel
						</Button>
						<Button color="red" onClick={clearAll}>
							Clear All
						</Button>
					</Group>
				</Modal>
			</Stack>
		</Box>
	);
}
