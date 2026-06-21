import {
	Box,
	Button,
	FileInput,
	Image,
	Stack,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useGameContext from "../../../../../context/hooks/useGameContext";
import type { PortraitType } from "../../../../../models/PlayerState";

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
			>
				Preview instructions
			</Button>
		</Stack>
	);
}
