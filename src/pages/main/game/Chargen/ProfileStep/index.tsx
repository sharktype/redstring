import {
	Box,
	Button,
	Flex,
	Group,
	Modal,
	Notification,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { type RefObject, useCallback, useRef, useState } from "react";

import useGameContext from "../../../../../context/GameContext/useGameContext";
import type Agent from "../../../../../handlers/agents";

import buildProfilePrompt from "../../../../../handlers/imagegen/buildProfilePrompt";
import type {
	ProfileState,
	ProfileStates,
	ProfileVariant,
} from "../../../../../models/PlayerState";
import { PROFILE_STATES } from "../../../../../models/PlayerState";
import type { ChargenStepProps } from "..";
import ExpressionsPanel from "./ExpressionsPanel";
import { defaultLocks } from "./locks";
import ProfileGrid from "./ProfileGrid";
import { PROFILE_STATE_LABELS, type VariantMode } from "./types";

const PROFILE_SIDE_LENGTH = 256;

const GENERATE_ALL_PROFILES_BATCH_SIZE = 4;

export default function ProfileStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState, agentConfigs } = useGameContext();

	const profilerAgent = agentConfigs.find(
		(agent): agent is Agent => agent.type === "profiler",
	);

	const allStates: ProfileState[] = [...PROFILE_STATES];

	const profiles = playerState?.portraits?.profiles ?? {};

	// Needed here in parent to know when to disable the "generate all" button.

	const [generating, setGenerating] = useState<Set<string>>(new Set());

	const [variantMode, setVariantMode] = useState<VariantMode>("base");

	const [isRemoving, setIsRemoving] = useState<ProfileState | null>(null);
	const [isClearing, setIsClearing] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const [expressionLocks, setExpressionLocks] = useState(defaultLocks());

	// Ref to safely merge profile results across concurrent generations.

	const latestProfiles = useRef<ProfileStates>({
		...profiles,
	}) as RefObject<ProfileStates>;

	// Callback to generate variant should live here so we can bulk-update.

	const generateVariant = useCallback(
		async (profileState: ProfileState, variant: keyof ProfileVariant) => {
			const key = `${profileState}:${variant}`;

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
				const prompt = buildProfilePrompt(
					playerState.appearance,
					profileState,
					variant,
					playerState.bodyArt,
					playerState.expressions,
					playerState.style,
				);

				const stream = await profilerAgent.generate(prompt, {
					width: PROFILE_SIDE_LENGTH,
					height: PROFILE_SIDE_LENGTH,
				});

				const reader = stream.getReader();

				let imageDataUrl = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						break;
					}

					imageDataUrl += value;
				}

				if (!imageDataUrl) {
					throw new Error("Image agent returned no image.");
				}

				latestProfiles.current = {
					...latestProfiles.current,
					[profileState]: {
						...latestProfiles.current[profileState],
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
		[profilerAgent, playerState, updatePlayerState],
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
		const next: ProfileStates = {};

		Object.entries(latestProfiles.current).forEach(([state, variants]) => {
			const updated: ProfileVariant = { ...variants };
			delete updated[variantMode];

			if (Object.keys(updated).length > 0) {
				next[state as ProfileState] = updated;
			}
		});

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

	const toggleExpressionLock = (key: "neutral" | "injured" | "cum") => {
		setExpressionLocks((previous) => ({ ...previous, [key]: !previous[key] }));
	};

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
				</Group>

				<Flex>
					<Stack>
						<ProfileGrid
							variantMode={variantMode}
							setVariantMode={setVariantMode}
							generating={generating}
							onGenerate={(state) => generateVariant(state, variantMode)}
							onRemove={setIsRemoving}
						/>

						<Group grow>
							<Button
								variant="outline"
								color="yellow"
								onClick={generateAll}
								disabled={generating.size > 0}
							>
								Generate All
							</Button>
							<Button
								variant="outline"
								color="red"
								onClick={clearAll}
								disabled={generating.size > 0}
							>
								Clear All
							</Button>
						</Group>
					</Stack>

					<ExpressionsPanel
						locks={expressionLocks}
						toggleLock={toggleExpressionLock}
					/>
				</Flex>

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
						This will delete the {variantMode === "base" ? "clothed " : "nude "}
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
						{variantMode === "base" ? "clothed " : "nude "}
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
