import {
	Title,
	Stack,
	Button,
	Group,
	Text,
	Box,
	Center,
	Loader,
} from "@mantine/core";
import { getDistance, humanizeDistance } from "../../utils/distance";
import useGameContext from "../../context/hooks/useGameContext";
import { useRegions } from "../../db/hooks/useRegions";
import { getDirection } from "../../utils/direction";

export default function LocationMap() {
	const { playerState } = useGameContext();
	const { regions } = useRegions();

	const hasLocation = playerState?.location?.region.id;

	const connectedRegions = hasLocation
		? regions
				.filter((region) =>
					playerState?.location?.region.connectedRegionIds.includes(region.id!),
				)
				.map((region) => ({
					region: region,
					distance: getDistance(playerState?.location?.region, region),
					direction: getDirection(playerState?.location?.region, region),
				}))
				.sort((a, b) => a.distance - b.distance)
		: [];

	if (playerState == null) {
		return (
			<Box h="100%" w="calc(var(--app-shell-navbar-width) * 1.5)">
				<Center
					h="100%"
					bg="var(--mantine-color-body)"
					style={{
						borderLeft: "1px solid var(--app-shell-border-color)",
					}}
				>
					<Loader color="gray" />
				</Center>
			</Box>
		);
	}

	let regionType: string = playerState?.location?.region?.type || "other";
	if (!regionType || regionType === "other") {
		regionType = "region";
	}

	return (
		<>
			<Title order={1}>Map</Title>

			{!hasLocation ? (
				<Stack>
					<Text>You are currently not in the world!</Text>

					<Title order={3}>Where are you?</Title>

					{regions.map((region) => (
						<Button
							key={region.id}
							variant="default"
							onClick={() => playerState.move(region.id!)}
						>
							{region.name}
						</Button>
					))}
				</Stack>
			) : (
				<Stack>
					<Text>
						You are in the <b>{regionType}</b> of:
					</Text>
					<Title order={3}>{playerState?.location?.region.name}</Title>
					<Text size="sm" c="dimmed">
						{playerState?.location?.region.description}
					</Text>
					{connectedRegions.length > 0 && (
						<>
							<Title order={4}>From here, you can travel to:</Title>
							{connectedRegions.map(({ region, distance, direction }) => (
								<Button
									key={region.id}
									variant="default"
									fullWidth
									justify="space-between"
									onClick={() => playerState.move(region.id!)}
									rightSection={
										<Group gap="xs" wrap="nowrap">
											<Text size="xs" fw={500} component="span">
												{direction}
											</Text>
											<Text size="xs" c="dimmed" component="span">
												|
											</Text>
											<Text size="xs" component="span">
												{humanizeDistance(distance)}
											</Text>
											<Text size="xs" c="dimmed" component="span">
												|
											</Text>
											<Text size="xs" c="green" component="span">
												Safe road
											</Text>
										</Group>
									}
								>
									the{" "}
									{region.type && region.type !== "other"
										? region.type
										: "region"}{" "}
									of {region.name}
								</Button>
							))}
						</>
					)}
				</Stack>
			)}
		</>
	);
}
