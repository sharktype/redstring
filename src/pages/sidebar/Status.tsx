import {
	Box,
	Button,
	Center,
	Divider,
	Stack,
	Text,
	Flex,
	Badge,
} from "@mantine/core";
import type { ReactNode } from "react";
import { GiBackpack, GiSkills } from "react-icons/gi";
import {
	FaClock,
	FaLock,
	FaMap,
	FaMapMarkerAlt,
	FaScroll,
	FaUser,
} from "react-icons/fa";
import useGameContext from "../../context/hooks/useGameContext.tsx";
import { formatTime } from "../../utils/time.ts";

export default function Status() {
	return (
		<Flex direction="column" h="100%">
			<Box flex={1}>
				<PlayerOverview />
			</Box>
			<DetailerSelector />
		</Flex>
	);
}

function PlayerOverview() {
	const { playerState } = useGameContext();

	if (!playerState || !playerState.isInitialized) {
		return (
			<Center h="100%">
				<Flex direction="column" align="center" gap="md">
					<FaLock size={24} opacity={0.3} />
					<Box>
						<Badge size="lg" color="gray">
							...?
						</Badge>
					</Box>
				</Flex>
			</Center>
		);
	}

	return (
		<Stack gap="sm" p="xs">
			<Box>
				<Flex align="center" gap={6} mb={4}>
					<FaUser size={10} opacity={0.5} />
					<Text size="xs" tt="uppercase" c="dimmed">
						<b>Name</b>
					</Text>
				</Flex>
				<Flex align="baseline" gap={6}>
					<Text size="sm">
						<b>
							{playerState.name?.given} {playerState.name?.surname}
						</b>
					</Text>
					{playerState.gender && (
						<Text size="xs" c="dimmed">
							({playerState.gender.pronouns.subject}/
							{playerState.gender.pronouns.object})
						</Text>
					)}
				</Flex>
			</Box>

			{playerState.time && (
				<>
					<Divider />
					<Box>
						<Flex align="center" gap={6} mb={4}>
							<FaClock size={10} opacity={0.5} />
							<Text size="xs" tt="uppercase" c="dimmed">
								<b>Time</b>
							</Text>
						</Flex>
						<Text size="sm">
							{formatTime(playerState.time.hour, playerState.time.minute, true)}
						</Text>
					</Box>
				</>
			)}

			{playerState.money !== undefined && (
				<>
					<Divider />
					<Box>
						<Flex align="center" gap={6} mb={4}>
							<FaClock size={10} opacity={0.5} />
							<Text size="xs" tt="uppercase" c="dimmed">
								<b>Money</b>
							</Text>
						</Flex>
						<Text size="sm" ff="monospace">
							{playerState.money} gold
						</Text>
					</Box>
				</>
			)}

			{playerState.location && playerState.location?.region?.name && (
				<>
					<Divider />
					<Box>
						<Flex align="center" gap={6} mb={4}>
							<FaMapMarkerAlt size={10} opacity={0.5} />
							<Text size="xs" tt="uppercase" c="dimmed">
								<b>Location</b>
							</Text>
						</Flex>
						{playerState.location.transitRegion ? (
							<Text size="sm">
								On the road from the {playerState.location.region.type} of{" "}
								<b>{playerState.location.region.name}</b> to the{" "}
								{playerState.location.transitRegion.type} of{" "}
								<b>{playerState.location.transitRegion.name}</b>...
							</Text>
						) : (
							<>
								<Text size="sm">{playerState.location.region.name}</Text>
								{playerState.location.building && (
									<Text size="xs" c="dimmed">
										{playerState.location.building.name}
									</Text>
								)}
							</>
						)}
					</Box>
				</>
			)}
		</Stack>
	);
}

function DetailerSelector() {
	const { gameState, updateGameState, playerState } = useGameContext();

	if (!playerState || !playerState.isInitialized) {
		// Character creation needs to happen before anything else.

		return (
			<StatusItem
				label="Character Creation"
				icon={<GiSkills />}
				isHighlighted
			/>
		);
	}

	return (
		<Stack gap="xs">
			<StatusItem
				label="Profile"
				icon={<GiSkills />}
				isHighlighted={gameState?.detailer === "profile"}
				onClick={() => {
					updateGameState({
						detailer: "profile",
					});
				}}
			/>
			{playerState.location && playerState.location?.region?.name && (
				<StatusItem
					label="Map"
					icon={<FaMap />}
					isHighlighted={gameState?.detailer === "map"}
					onClick={() =>
						updateGameState({
							detailer: "map",
						})
					}
				/>
			)}
			<StatusItem
				label="Inventory"
				icon={<GiBackpack />}
				isHighlighted={gameState?.detailer === "inventory"}
				onClick={() =>
					updateGameState({
						detailer: "inventory",
					})
				}
			/>
			<StatusItem
				label="Journal"
				icon={<FaScroll />}
				isHighlighted={gameState?.detailer === "journal"}
				onClick={() =>
					updateGameState({
						detailer: "journal",
					})
				}
			/>
		</Stack>
	);
}

function StatusItem(props: {
	label: string;
	icon: ReactNode;
	onClick?: () => void;
	isHighlighted?: boolean;
	isDisabled?: boolean;
}) {
	return (
		<Button
			variant={props.isHighlighted ? "light" : "default"}
			size="xs"
			leftSection={props.icon}
			justify="flex-start"
			onClick={props.onClick}
			disabled={props.isDisabled}
		>
			{props.label}
		</Button>
	);
}
