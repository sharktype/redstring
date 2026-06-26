import {
	ActionIcon,
	Flex,
	Image,
	Loader,
	Overlay,
	Stack,
	Text,
} from "@mantine/core";
import { FaRedo, FaTrash } from "react-icons/fa";
import type { ProfileState } from "../../../../../models/PlayerState";
import { PROFILE_STATE_EMOJIS, PROFILE_STATE_LABELS } from "./types";

interface ProfileSquareProps {
	state: ProfileState;
	imageUrl?: string;
	isGenerating?: boolean;
	onGenerate: (state: ProfileState) => void;
	onRemove: (state: ProfileState) => void;
}

export default function ProfileSquare({
	state,
	imageUrl,
	isGenerating,
	onGenerate,
	onRemove,
}: ProfileSquareProps) {
	const emoji = PROFILE_STATE_EMOJIS[state];
	const label = PROFILE_STATE_LABELS[state];
	const isShowingActions = imageUrl && !isGenerating;

	return (
		<Stack gap={4} align="center">
			<Flex
				align="center"
				justify="center"
				pos="relative"
				w="100%"
				className="profile-gallery-item"
				style={{
					aspectRatio: "1 / 1",
					border: "1px solid var(--mantine-color-default-border)",
					borderRadius: "var(--mantine-radius-md)",
					backgroundColor: "var(--mantine-color-default-hover)",
					overflow: "hidden",
				}}
			>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={`${label} profile`}
						w="100%"
						h="100%"
						fit="cover"
					/>
				) : (
					<Text size="xl" ta="center">
						{emoji}
					</Text>
				)}
				{isGenerating && (
					<Overlay blur={2} center zIndex={1}>
						<Loader size="lg" color="white" />
					</Overlay>
				)}
				{isShowingActions && (
					<>
						<ActionIcon
							variant="filled"
							color="dark"
							size="sm"
							pos="absolute"
							top={4}
							left={4}
							className="profile-gallery-remove"
							onClick={() => onRemove(state)}
						>
							<FaTrash size={12} />
						</ActionIcon>
						<ActionIcon
							variant="filled"
							color="dark"
							size="sm"
							pos="absolute"
							top={4}
							right={4}
							className="profile-gallery-regenerate"
							onClick={() => onGenerate(state)}
						>
							<FaRedo size={12} />
						</ActionIcon>
					</>
				)}
			</Flex>
			<Text size="xs" fw={500} ta="center" lh={1.1}>
				{label}
			</Text>
		</Stack>
	);
}
