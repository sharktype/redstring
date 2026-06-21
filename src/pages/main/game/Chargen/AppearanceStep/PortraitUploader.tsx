import {
	Box,
	Button,
	FileInput,
	Image,
	Loader,
	Modal,
	Notification,
	Stack,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
	Textarea,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import { usePlayerState } from "../../../../../db/hooks/usePlayerState";
import type Agent from "../../../../../handlers/agents";
import type { Appearance, Portraits } from "../../../../../models/PlayerState";
import { buildImageGenPrompt } from "./buildImageGenPrompt";

const PORTRAIT_META: Record<keyof Portraits, { emoji: string; label: string }> =
	{
		nude: { emoji: "🔞", label: "Nude" },
		base: { emoji: "🧍", label: "Base" },
	};

export default function PortraitUploader() {
	const { gameState, playerState, updatePlayerState, agentConfigs } =
		useGameContext();

	const isNsfwMode = gameState?.isNsfw;

	const profilerAgent = agentConfigs.find(
		(agent): agent is Agent => agent.type === "profiler",
	);

	const [portraitTab, setPortraitTab] = useState<keyof Portraits>("base");
	const [portraitFiles, setPortraitFiles] = useState<
		Record<keyof Portraits, File | null>
	>({
		nude: null,
		base: null,
	});
	const [promptModalOpen, setPromptModalOpen] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [generateError, setGenerateError] = useState<string | null>(null);

	useEffect(() => {
		if (!isNsfwMode) {
			setPortraitTab("base");
		}
	}, [isNsfwMode]);

	const portraits = playerState?.portraits;

	const tabOptions = isNsfwMode ? ["nude", "base"] : ["base"];

	const handleChange = (tab: keyof Portraits, file: File | null) => {
		setPortraitFiles((prev) => ({ ...prev, [tab]: file }));

		if (!file) {
			updatePlayerState({
				portraits: { ...portraits, [tab]: undefined },
			});

			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			updatePlayerState({
				portraits: { ...portraits, [tab]: reader.result as string },
			});
		};

		reader.readAsDataURL(file);
	};

	const handleGenerate = async () => {
		if (!profilerAgent?.providerConfigId) {
			setGenerateError("No profiler agent configured. Add one in settings.");

			return;
		}

		if (!playerState?.appearance) {
			setGenerateError("Please fill in appearance details first.");

			return;
		}

		setGenerating(true);
		setGenerateError(null);

		try {
			const merged: Appearance = {
				...playerState.appearance,
			};
			const tab = isNsfwMode ? portraitTab : "base";
			const prompt = buildImageGenPrompt(merged, tab, isNsfwMode);

			const stream = await profilerAgent.generate(prompt, {
				width: 832,
				height: 1216,
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

			updatePlayerState({
				portraits: { ...playerState.portraits, [tab]: imageDataUrl },
			});
		} catch (error) {
			setGenerateError(
				error instanceof Error
					? error.message
					: "Generation failed for an unknown reason.",
			);
		} finally {
			setGenerating(false);
		}
	};

	return (
		<Stack gap="xs">
			{isNsfwMode ? (
				<Tabs
					value={portraitTab}
					onChange={(value) => setPortraitTab(value as keyof Portraits)}
				>
					<TabsList grow>
						{tabOptions.map((tab) => (
							<TabsTab key={tab} value={tab}>
								{PORTRAIT_META[tab as keyof Portraits].emoji}{" "}
								{PORTRAIT_META[tab as keyof Portraits].label}
							</TabsTab>
						))}
					</TabsList>

					{tabOptions.map((tab) => {
						const tabPortrait = portraits?.[tab as keyof Portraits];
						return (
							<TabsPanel key={tab} value={tab} pt="xs">
								<Stack gap="xs">
									<Box
										style={{
											aspectRatio: "9 / 16",
											border: "1px solid var(--mantine-color-default-border)",
											borderRadius: "var(--mantine-radius-md)",
											overflow: "hidden",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: "var(--mantine-color-default-hover)",
										}}
									>
										{tabPortrait ? (
											<Image
												src={tabPortrait}
												alt={`${PORTRAIT_META[tab as keyof Portraits].label} portrait`}
												w="100%"
												h="100%"
												fit="cover"
											/>
										) : (
											<Text size="xs" c="dimmed" ta="center">
												No portrait
											</Text>
										)}
									</Box>

									<FileInput
										placeholder="Upload"
										clearable
										accept="image/png,image/jpeg,image/webp,image/gif"
										value={portraitFiles[tab as keyof Portraits]}
										onChange={(file) =>
											handleChange(tab as keyof Portraits, file)
										}
									/>
								</Stack>
							</TabsPanel>
						);
					})}
				</Tabs>
			) : (
				<Stack gap="xs">
					<Box
						style={{
							aspectRatio: "9 / 16",
							border: "1px solid var(--mantine-color-default-border)",
							borderRadius: "var(--mantine-radius-md)",
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "var(--mantine-color-default-hover)",
						}}
					>
						{portraits?.base ? (
							<Image
								src={portraits.base}
								alt="Base portrait"
								w="100%"
								h="100%"
								fit="cover"
							/>
						) : (
							<Text size="xs" c="dimmed" ta="center">
								No portrait
							</Text>
						)}
					</Box>

					<FileInput
						placeholder="Upload"
						clearable
						accept="image/png,image/jpeg,image/webp,image/gif"
						value={portraitFiles.base}
						onChange={(file) => handleChange("base", file)}
					/>
				</Stack>
			)}

			<Button
				variant="outline"
				fullWidth
				leftSection={generating ? <Loader size="xs" /> : "✨"}
				justify="start"
				size="sm"
				color="yellow"
				onClick={handleGenerate}
				disabled={generating || !profilerAgent?.providerConfigId}
			>
				{generating ? "Generating…" : "Generate"}
			</Button>

			{generateError && (
				<Notification
					color="red"
					title="Generation failed"
					onClose={() => setGenerateError(null)}
				>
					{generateError}
				</Notification>
			)}
			<Button
				variant="outline"
				fullWidth
				leftSection={"📋"}
				justify="start"
				size="sm"
				color="grey"
				onClick={() => setPromptModalOpen(true)}
			>
				Preview instructions
			</Button>

			<PromptModal
				opened={promptModalOpen}
				onClose={() => setPromptModalOpen(false)}
			/>
		</Stack>
	);
}

interface PromptModalProps {
	opened: boolean;
	onClose: () => void;
}

function PromptModal({ opened, onClose }: PromptModalProps) {
	const { gameState } = useGameContext();
	const { playerState } = usePlayerState();

	const isNsfwMode = gameState?.isNsfw;
	const appearance = playerState?.appearance;

	const prompt = useMemo(() => {
		const merged: Appearance = {
			...appearance,
		};

		return buildImageGenPrompt(merged, "base", isNsfwMode);
	}, [appearance, isNsfwMode]);

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Image Generation Prompt"
			size="lg"
		>
			<Stack gap="xs">
				<Text size="sm" c="dimmed">
					This is the description that would be sent to the image generation
					provider.
				</Text>
				<Textarea
					value={prompt}
					readOnly
					minRows={2}
					autosize
					aria-label="Generated prompt"
				/>
			</Stack>
		</Modal>
	);
}
