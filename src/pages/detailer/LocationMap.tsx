import {
	Title,
	Stack,
	Button,
	Group,
	Text,
	Box,
	Center,
	Loader,
	Flex,
} from "@mantine/core";
import { getDistance, humanizeDistance } from "../../utils/distance";
import useGameContext from "../../context/hooks/useGameContext";
import { useRegions } from "../../db/hooks/useRegions";
import { getDirection } from "../../utils/direction";
import TravelCalculator from "../main/options/Map/TravelCalculator";

export default function LocationMap() {
	const { playerState, gameState } = useGameContext();
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
		<Box h="100%">
			<Flex direction="column" h="100%">
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
					<Stack flex={1}>
						<Text>
							You are in the <b>{regionType}</b> of:
						</Text>
						<Title order={3}>{playerState?.location?.region.name}</Title>
						<Text size="sm" c="dimmed">
							{playerState?.location?.region.description}
						</Text>

						{connectedRegions.length > 0 && (
							<Box>
								<Title order={4} mb="xs">
									From here, you can travel to:
								</Title>
								{[
									{ label: "Nearby (< 10 km)", min: 0, max: 10000 },
									{ label: "Mid-range (10 - 30 km)", min: 10000, max: 30000 },
									{ label: "Far (30 - 100 km)", min: 30000, max: 100000 },
									{
										label: "Distant (>= 100 km)",
										min: 100_000,
										max: Number.POSITIVE_INFINITY,
									},
								].map((bucket) => {
									const items = connectedRegions.filter(({ distance }) => {
										const meters = distance * (gameState?.scale ?? 1);

										return meters >= bucket.min && meters < bucket.max;
									});

									if (items.length === 0) {
										return null;
									}

									return (
										<Stack key={bucket.label} gap="xs" mt="xs">
											<Text size="sm" fw={600} c="dimmed">
												{bucket.label}
											</Text>

											{items.map(({ region, distance, direction }) => (
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
																{humanizeDistance(
																	distance * (gameState?.scale ?? 1),
																)}
															</Text>
															<Text size="xs" c="dimmed" component="span">
																|
															</Text>
															<Text size="xs" c="green" component="span">
																Safe
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
										</Stack>
									);
								})}
							</Box>
						)}
					</Stack>
				)}
				<TravelCalculator />
			</Flex>
		</Box>
	);
}
