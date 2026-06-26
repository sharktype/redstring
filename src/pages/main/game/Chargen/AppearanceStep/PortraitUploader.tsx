import {
	Box,
	Button,
	FileInput,
	Group,
	Image,
	Loader,
	Modal,
	Notification,
	SegmentedControl,
	Stack,
	Text,
	Textarea,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import useGameContext from "../../../../../context/GameContext/useGameContext";
import { usePlayerState } from "../../../../../db/hooks/usePlayerState";
import type Agent from "../../../../../handlers/agents";
import buildPortraitPrompt from "../../../../../handlers/imagegen/buildPortraitPrompt";

type PortraitTab = "base" | "nude";

const PORTRAIT_META: Record<PortraitTab, { emoji: string; label: string }> = {
	base: { emoji: "🧍", label: "Clothed" },
	nude: { emoji: "🔞", label: "Nude" },
};

export default function PortraitUploader() {
	const { gameState, playerState, updatePlayerState, agentConfigs } =
		useGameContext();

	const isNsfwMode = gameState?.isNsfw;

	const profilerAgent = agentConfigs.find(
		(agent): agent is Agent => agent.type === "profiler",
	);

	const [portraitTab, setPortraitTab] = useState<PortraitTab>("base");
	const [portraitFiles, setPortraitFiles] = useState<
		Record<PortraitTab, File | null>
	>({
		base: null,
		nude: null,
	});
	const [promptModalOpen, setPromptModalOpen] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [generateError, setGenerateError] = useState<string | null>(null);
	const [clearConfirm, setClearConfirm] = useState(false);

	useEffect(() => {
		if (!isNsfwMode) {
			setPortraitTab("base");
		}
	}, [isNsfwMode]);

	const portraits = playerState?.portraits;

	const handleChange = (tab: PortraitTab, file: File | null) => {
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

	const handleClear = () => {
		updatePlayerState({
			portraits: { ...portraits, [portraitTab]: undefined },
		});

		setClearConfirm(false);
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
			const tab = isNsfwMode ? portraitTab : "base";
			const prompt = buildPortraitPrompt(
				playerState.appearance,
				tab,
				isNsfwMode,
				playerState.bodyArt,
				playerState.style,
			);

			const stream = await profilerAgent.generate(
				prompt,
				{ width: 832, height: 1216 },
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

	const showPortrait = portraits?.[portraitTab];

	return (
		<Stack gap="xs">
			{isNsfwMode && (
				<SegmentedControl
					size="xs"
					fullWidth
					value={portraitTab}
					onChange={(v) => setPortraitTab(v as PortraitTab)}
					data={[
						{ label: "Clothed", value: "base" },
						{ label: "Nude", value: "nude" },
					]}
				/>
			)}

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
				{showPortrait ? (
					<Image
						src={showPortrait}
						alt={`${PORTRAIT_META[portraitTab].label} portrait`}
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
				value={portraitFiles[portraitTab]}
				onChange={(file) => handleChange(portraitTab, file)}
			/>

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

			<Button
				variant="outline"
				fullWidth
				leftSection={"🧹"}
				justify="start"
				size="sm"
				color="red"
				onClick={() => setClearConfirm(true)}
				disabled={!showPortrait}
			>
				Clear
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

			<Modal
				opened={clearConfirm}
				onClose={() => setClearConfirm(false)}
				title="Clear portrait?"
				size="sm"
				centered
			>
				<Text size="sm" mb="md">
					This will delete the current{" "}
					{isNsfwMode
						? `${PORTRAIT_META[portraitTab].label.toLowerCase()} `
						: ""}
					portrait. You can regenerate it later.
				</Text>
				<Group justify="flex-end">
					<Button variant="default" onClick={() => setClearConfirm(false)}>
						Cancel
					</Button>
					<Button color="red" onClick={handleClear}>
						Clear
					</Button>
				</Group>
			</Modal>
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
		return buildPortraitPrompt(
			{ ...appearance },
			"base",
			isNsfwMode,
			playerState?.bodyArt,
			playerState?.style,
		);
	}, [appearance, isNsfwMode, playerState?.bodyArt, playerState?.style]);

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
