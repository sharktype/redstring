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
import {
	NSFW_STATES,
	PROFILE_STATE_EMOJIS,
	PROFILE_STATE_LABELS,
} from "../../../../../handlers/imagegen/buildImageGenPrompt";
import type { ProfileState } from "../../../../../models/PlayerState";

interface ProfileSquareProps {
	state: ProfileState;
	imageUrl?: string;
	isGenerating?: boolean;
	onRegenerate: (state: ProfileState) => void;
	onRemove: (state: ProfileState) => void;
}

export default function ProfileSquare({
	state,
	imageUrl,
	isGenerating,
	onRegenerate,
	onRemove,
}: ProfileSquareProps) {
	const emoji = PROFILE_STATE_EMOJIS[state];
	const label = PROFILE_STATE_LABELS[state];

	const isNsfwState = NSFW_STATES.has(state);
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
							onClick={() => onRegenerate(state)}
						>
							<FaRedo size={12} />
						</ActionIcon>
					</>
				)}
			</Flex>
			<Text size="xs" fw={500} ta="center" lh={1.1}>
				{label}
				{isNsfwState && (
					<Text component="span" c="red" size="xs" fw={600}>
						{" "}
						18+
					</Text>
				)}
			</Text>
		</Stack>
	);
}
