import {
	Box,
	Button,
	Group,
	Modal,
	Stack,
	Switch,
	Text,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";
import { FaImage, FaMap } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { GiWorld } from "react-icons/gi";
import { useNavigate } from "react-router";
import useGameContext from "../../context/GameContext/useGameContext.tsx";
import { useMessages } from "../../db/hooks/useMessages.ts";
import { usePlayerState } from "../../db/hooks/usePlayerState.ts";

export default function Options() {
	const [resetOpened, { open: openResetMessages, close: closeResetMessages }] =
		useDisclosure(false);
	const [
		unmakeOpened,
		{ open: openUnmakeCharacter, close: closeUnmakeCharacter },
	] = useDisclosure(false);
	const [nsfwOffOpened, { open: openNsfwOff, close: closeNsfwOff }] =
		useDisclosure(false);
	const { clearMessages } = useMessages();
	const { clearPlayerState } = usePlayerState();
	const { gameState, updateGameState, playerState, updatePlayerState } =
		useGameContext();

	const isNsfw = gameState?.isNsfw ?? false;

	const handleResetMessages = async () => {
		await clearMessages();
		closeResetMessages();
	};

	const handleUnmakeCharacter = async () => {
		await clearPlayerState();
		closeUnmakeCharacter();
	};

	const handleNsfwOff = async () => {
		await updateGameState({ isNsfw: false });
		await updatePlayerState({
			appearance: {
				...playerState?.appearance,
				genitals: undefined,
				cockSize: undefined,
			},
			portraits: {
				...playerState?.portraits,
				nude: undefined,
			},
		});
		closeNsfwOff();
	};

	return (
		<Box my="lg" h="90vh" style={{ overflowY: "auto" }}>
			<Title order={2} mb="lg">
				Options
			</Title>
			<Stack gap="xl">
				<Box>
					<Group align="center" gap="xs" mb="md">
						<Switch
							label="NSFW Mode"
							checked={isNsfw}
							onChange={(e) => {
								if (!e.currentTarget.checked) {
									openNsfwOff();
								} else {
									updateGameState({
										isNsfw: true,
									});
								}
							}}
							color="red"
							ml="xs"
						/>
					</Group>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Artificial Intelligence
					</Title>
					<Stack gap="xs">
						<OptionsItem
							label="Text Providers"
							href="/options/providers"
							icon={<FiKey />}
						/>
						<OptionsItem
							label="Text Agents"
							href="/options/agents"
							icon={<FaMap />}
						/>
						<OptionsItem
							label="Image Providers"
							href="/options/image-providers"
							icon={<FiKey />}
						/>
						<OptionsItem
							label="Image Agents"
							href="/options/image-agents"
							icon={<FaImage />}
						/>
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Import/Export
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Import" icon={<GiWorld />} />
						<OptionsItem label="Export" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Danger Zone
					</Title>
					<Stack gap="xs">
						<OptionsItem
							label="Unmake Character"
							onClick={openUnmakeCharacter}
							icon={<GiWorld />}
							isDanger
						/>
						<OptionsItem
							label="Reset Messages"
							onClick={openResetMessages}
							icon={<GiWorld />}
							isDanger
						/>
					</Stack>
					<Modal
						opened={unmakeOpened}
						onClose={closeUnmakeCharacter}
						title="Unmake Character"
						centered
					>
						<Text mb="lg">
							Are you sure you want to unmake your character? This will reset
							all character data and cannot be undone.
						</Text>
						<Group justify="flex-end">
							<Button variant="default" onClick={closeUnmakeCharacter}>
								No
							</Button>
							<Button color="red" onClick={handleUnmakeCharacter}>
								Yes
							</Button>
						</Group>
					</Modal>
					<Modal
						opened={nsfwOffOpened}
						onClose={closeNsfwOff}
						title="Disable NSFW Mode"
						centered
					>
						<Text mb="lg">
							Are you sure? Some character details may be lost.
						</Text>
						<Group justify="flex-end">
							<Button variant="default" onClick={closeNsfwOff}>
								No
							</Button>
							<Button color="red" onClick={handleNsfwOff}>
								Yes
							</Button>
						</Group>
					</Modal>
					<Modal
						opened={resetOpened}
						onClose={closeResetMessages}
						title="Reset Messages"
						centered
					>
						<Text mb="lg">
							Are you sure you want to reset all messages? This cannot be
							undone.
						</Text>
						<Group justify="flex-end">
							<Button variant="default" onClick={closeResetMessages}>
								No
							</Button>
							<Button color="red" onClick={handleResetMessages}>
								Yes
							</Button>
						</Group>
					</Modal>
				</Box>
			</Stack>
		</Box>
	);
}

function OptionsItem(props: {
	label: string;
	icon: ReactNode;
	href?: string;
	onClick?: () => void;
	isDanger?: boolean;
}) {
	const navigate = useNavigate();

	const isDisabled = !props.href && !props.onClick;

	return (
		<Button
			variant={props.isDanger ? "subtle" : "default"}
			color={props.isDanger ? "red" : undefined}
			size="xs"
			leftSection={props.icon}
			justify="flex-start"
			onClick={() => {
				if (props.href) {
					navigate(props.href);
				} else if (props.onClick) {
					props.onClick();
				}
			}}
			disabled={isDisabled}
			style={{ cursor: isDisabled ? "not-allowed" : undefined }}
		>
			{props.label}
		</Button>
	);
}
