import { Box, Button, Stack, Text, Flex, Title } from "@mantine/core";
import type { ReactNode } from "react";
import { GiBackpack, GiSkills } from "react-icons/gi";
import { FaMap, FaScroll } from "react-icons/fa";
import useGameContext from "../../context/hooks/useGameContext.tsx";
import { GrDisabledOutline } from "react-icons/gr";

export default function Status() {
	const { gameState, updateGameState, regions } = useGameContext();

	return (
		<Flex direction="column" h="100%">
			<Stack flex={1}>
				<Box>
					<Text>
						<b>Character Name</b>
					</Text>
					<Text size="xs">Level N Race Class (Current/Next XP)</Text>
				</Box>
				<Box>Character Major Stats</Box>
				<Box>Equipped Items</Box>
			</Stack>
			<Title order={3} mb="xs">
				Detailer
			</Title>
			<Stack gap="xs">
				<StatusItem
					label="None"
					icon={<GrDisabledOutline />}
					isHighlighted={gameState?.detailer === null}
					onClick={() =>
						updateGameState({
							detailer: null,
						})
					}
				/>
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
				{regions.length > 1 && (
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
		</Flex>
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
