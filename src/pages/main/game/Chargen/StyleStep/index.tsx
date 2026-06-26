import {
	ActionIcon,
	Box,
	Button,
	Group,
	Image,
	Loader,
	Modal,
	Stack,
	Text,
	Textarea,
	Title,
} from "@mantine/core";
import { useState } from "react";
import { FaDice, FaEraser } from "react-icons/fa";
import LockIcon from "../../../../../components/LockIcon";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import type Agent from "../../../../../handlers/agents";
import buildScenePrompt from "../../../../../handlers/imagegen/buildScenePrompt";
import type { Style } from "../../../../../models/PlayerState";
import type { ChargenStepProps } from "..";
import type { SceneActor } from "../ProfileStep/types";
import {
	ALL_LOCK_KEYS,
	defaultLocks,
	type StyleLockKey,
	setStyleField,
} from "./locks";
import {
	randomiseStyle,
	randomScenePrompt,
	randomSexScenePrompt,
	type ScenePromptEntry,
} from "./randomize";

// TODO: These defaults should be stored elsewhere.

const SCENE_WIDTH = 1216;
const SCENE_HEIGHT = 832;

type SceneMode = "example" | "custom" | "sex";

export default function StyleStep(_props: ChargenStepProps) {
	const { playerState, updatePlayerState, agentConfigs, gameState } =
		useGameContext();
	const [locks, setLocks] = useState(defaultLocks());

	const isNsfwMode = gameState?.isNsfw ?? false;

	const style = playerState?.style ?? {};
	const appearance = playerState?.appearance;

	const illustratorAgent = agentConfigs.find(
		(agent): agent is Agent => agent.type === "illustrator",
	);

	const isAllLocked = ALL_LOCK_KEYS.every((key) => locks[key]);

	const [customScenePrompt, setCustomScenePrompt] = useState("");
	const [generatingScene, setGeneratingScene] = useState<SceneMode | null>(
		null,
	);
	const [sceneError, setSceneError] = useState<string | null>(null);
	const [sceneImage, setSceneImage] = useState<string | null>(null);
	const [promptModalOpen, setPromptModalOpen] = useState(false);
	const [previewPrompt, setPreviewPrompt] = useState<string>("");

	const toggleLock = (key: StyleLockKey) => {
		setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const setField = (key: StyleLockKey, value: string) => {
		const next = setStyleField(playerState?.style, key, value);

		updatePlayerState({ style: next });
	};

	const randomize = () => {
		const generated = randomiseStyle();
		const merged: Style = {
			portraitStyle: locks.portraitStyle
				? style.portraitStyle
				: generated.portraitStyle,
			sceneStyle: locks.sceneStyle ? style.sceneStyle : generated.sceneStyle,
		};

		updatePlayerState({ style: merged });
	};

	const clear = () => {
		setLocks(defaultLocks());
		updatePlayerState({ style: undefined });
	};

	const buildScenePromptGivenMode = (mode: SceneMode): string => {
		let scenePrompt = "";
		let actors: SceneActor[] | undefined;

		if (mode === "custom") {
			scenePrompt = customScenePrompt;
		} else if (mode === "sex") {
			const entry: ScenePromptEntry = randomSexScenePrompt(appearance!);
			scenePrompt = entry.prompt;
			actors = entry.actors;
		} else {
			scenePrompt = randomScenePrompt();
		}

		return buildScenePrompt(
			appearance!,
			"nude",
			scenePrompt,
			actors,
			isNsfwMode,
			playerState?.bodyArt,
			playerState?.style,
		);
	};

	const generateScene = async (mode: SceneMode) => {
		if (!illustratorAgent?.providerConfigId) {
			setSceneError("No illustrator agent configured. Add one in settings.");

			return;
		}

		if (!appearance) {
			setSceneError("Please fill in appearance details first.");

			return;
		}

		setGeneratingScene(mode);
		setSceneError(null);

		try {
			const scenePrompt = buildScenePromptGivenMode(mode);

			const stream = await illustratorAgent.generate(
				scenePrompt,
				{ width: SCENE_WIDTH, height: SCENE_HEIGHT },
				isNsfwMode || false,
			);

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

			setSceneImage(imageDataUrl);
		} catch (error) {
			setSceneError(
				error instanceof Error
					? error.message
					: "Generation failed for an unknown reason.",
			);
		} finally {
			setGeneratingScene(null);
		}
	};

	const previewRandomScene = () => {
		if (!appearance) {
			setSceneError("Please fill in appearance details first.");

			return;
		}

		setPreviewPrompt(buildScenePromptGivenMode("example"));
		setPromptModalOpen(true);
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
				<Group justify="space-between">
					<Title order={4}>Style</Title>
					<Group gap="xs">
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Clear"
							onClick={clear}
							disabled={isAllLocked}
						>
							<FaEraser size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="gray"
							title="Randomise"
							onClick={randomize}
							disabled={isAllLocked}
						>
							<FaDice size={16} />
						</ActionIcon>
					</Group>
				</Group>

				<Group grow align="start" gap="lg">
					<Stack gap="xs" style={{ flex: 1, minWidth: 260 }}>
						<Stack gap="xs">
							<Button
								variant="outline"
								color="yellow"
								onClick={() => generateScene("example")}
								disabled={generatingScene !== null}
								leftSection={
									generatingScene === "example" ? <Loader size="xs" /> : "✨"
								}
								justify="start"
							>
								{generatingScene === "example"
									? "Generating…"
									: "Example Random Scene"}
							</Button>

							{isNsfwMode && (
								<Button
									variant="outline"
									color="red"
									onClick={() => generateScene("sex")}
									disabled={generatingScene !== null}
									leftSection={
										generatingScene === "sex" ? <Loader size="xs" /> : "✨"
									}
									justify="start"
								>
									{generatingScene === "sex"
										? "Generating…"
										: "Random Sex Scene"}
								</Button>
							)}

							<Button
								variant="outline"
								color="gray"
								onClick={previewRandomScene}
								leftSection="📋"
								justify="start"
							>
								Preview Random Scene Instructions
							</Button>

							<Textarea
								label="Custom scene"
								description="Describe a scene to illustrate. Result is previewed only."
								placeholder="e.g. sitting by a campfire at night, gazing at stars"
								minRows={3}
								autosize
								value={customScenePrompt}
								onChange={(event) =>
									setCustomScenePrompt(event.currentTarget.value)
								}
								disabled={generatingScene !== null}
							/>

							<Button
								variant="outline"
								color="yellow"
								onClick={() => generateScene("custom")}
								disabled={
									generatingScene !== null ||
									customScenePrompt.trim().length === 0
								}
								leftSection={
									generatingScene === "custom" ? <Loader size="xs" /> : "✨"
								}
								justify="start"
							>
								{generatingScene === "custom"
									? "Generating…"
									: "Example Custom Scene"}
							</Button>

							{sceneError && (
								<Text size="xs" c="red">
									{sceneError}
								</Text>
							)}
						</Stack>
					</Stack>

					{/* Right: style fields */}
					<Stack gap="xs" style={{ flex: 1, minWidth: 260 }}>
						<Group gap={4} wrap="nowrap" align="flex-end">
							<Textarea
								label="Portrait Style"
								placeholder="e.g. 2020s anime (style)"
								value={style.portraitStyle ?? ""}
								onChange={(event) =>
									setField("portraitStyle", event.currentTarget.value)
								}
								disabled={locks.portraitStyle}
								minRows={2}
								autosize
								style={{ flex: 1 }}
							/>
							<LockIcon
								isLocked={locks.portraitStyle}
								toggle={() => toggleLock("portraitStyle")}
							/>
						</Group>

						<Group gap={4} wrap="nowrap" align="flex-end">
							<Textarea
								label="Scene Style"
								placeholder="e.g. 2020s anime (style)"
								value={style.sceneStyle ?? ""}
								onChange={(event) =>
									setField("sceneStyle", event.currentTarget.value)
								}
								disabled={locks.sceneStyle}
								minRows={2}
								autosize
								style={{ flex: 1 }}
							/>
							<LockIcon
								isLocked={locks.sceneStyle}
								toggle={() => toggleLock("sceneStyle")}
							/>
						</Group>
					</Stack>
				</Group>
			</Stack>

			<Modal
				opened={sceneImage !== null}
				onClose={() => setSceneImage(null)}
				title="Generated Scene"
				size="xl"
				centered
			>
				{sceneImage && (
					<Image
						src={sceneImage}
						alt="Generated scene preview"
						w="100%"
						fit="contain"
					/>
				)}
			</Modal>

			<Modal
				opened={promptModalOpen}
				onClose={() => setPromptModalOpen(false)}
				title="Scene Generation Prompt"
				size="lg"
			>
				<Stack gap="xs">
					<Text size="sm" c="dimmed">
						This is the description that would be sent to the image generation
						provider for a random scene.
					</Text>
					<Textarea
						value={previewPrompt}
						readOnly
						minRows={2}
						autosize
						aria-label="Generated scene prompt"
					/>
				</Stack>
			</Modal>
		</Box>
	);
}
