import {
	Box,
	Button,
	FileInput,
	Image,
	Modal,
	Stack,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
	Textarea,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import useGameContext from "../../../../../context/hooks/useGameContext";
import type PlayerState from "../../../../../models/PlayerState";
import type {
	GenderExpression,
	PortraitType,
} from "../../../../../models/PlayerState";
import { buildImageGenPrompt } from "./buildImageGenPrompt";

interface PortraitUploaderProps {
	isNsfwMode: boolean;
}

const PORTRAIT_META: Record<PortraitType, { emoji: string; label: string }> = {
	nude: { emoji: "🔞", label: "Nude" },
	base: { emoji: "🧍", label: "Base" },
};

export default function PortraitUploader({
	isNsfwMode: nsfw,
}: PortraitUploaderProps) {
	const { playerState, updatePlayerState } = useGameContext();

	const [portraitTab, setPortraitTab] = useState<PortraitType>("base");
	const [portraitFiles, setPortraitFiles] = useState<
		Record<PortraitType, File | null>
	>({
		nude: null,
		base: null,
	});
	const [promptModalOpen, setPromptModalOpen] = useState(false);

	useEffect(() => {
		if (!nsfw) {
			setPortraitTab("base");
		}
	}, [nsfw]);

	const portraits = playerState?.portraits;

	const tabOptions: PortraitType[] = nsfw ? ["nude", "base"] : ["base"];

	const handleChange = (tab: PortraitType, file: File | null) => {
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

	return (
		<Stack gap="xs">
			{nsfw ? (
				<Tabs
					value={portraitTab}
					onChange={(value) => setPortraitTab(value as PortraitType)}
				>
					<TabsList grow>
						{tabOptions.map((tab) => (
							<TabsTab key={tab} value={tab}>
								{PORTRAIT_META[tab].emoji} {PORTRAIT_META[tab].label}
							</TabsTab>
						))}
					</TabsList>

					{tabOptions.map((tab) => {
						const tabPortrait = portraits?.[tab];
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
												alt={`${PORTRAIT_META[tab].label} portrait`}
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
										value={portraitFiles[tab]}
										onChange={(file) => handleChange(tab, file)}
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
				leftSection={"✨"}
				justify="start"
				size="sm"
				color="yellow"
			>
				Generate
			</Button>
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
				appearance={playerState?.appearance}
				genderExpression={playerState?.genderExpression}
			/>
		</Stack>
	);
}

interface PromptModalProps {
	opened: boolean;
	onClose: () => void;
	appearance: PlayerState["appearance"];
	genderExpression: GenderExpression | undefined;
}

function PromptModal({
	opened,
	onClose,
	appearance,
	genderExpression,
}: PromptModalProps) {
	const prompt = useMemo(() => {
		const merged: NonNullable<PlayerState["appearance"]> = {
			...appearance,
		};
		return buildImageGenPrompt(merged, genderExpression);
	}, [appearance, genderExpression]);

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
