import { useState } from "react";
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
	Modal,
	List,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	getDistance,
	humanizeDistance,
	estimateTravelTime,
} from "../../utils/distance";
import useGameContext from "../../context/hooks/useGameContext";
import { useRegions } from "../../db/hooks/useRegions";
import type { ConnectionSafety, Region } from "../../models/Location";
import { getEffectiveSafety } from "../../models/Location";
import { getDirection } from "../../utils/direction";
import useTravel from "../../handlers/hooks/useTravel";
import useSubmit from "../../handlers/hooks/useSubmit";
import TravelCalculator from "../main/options/Map/TravelCalculator";

export default function LocationMap() {
	const { playerState, gameState, messages } = useGameContext();
	const { regions } = useRegions();
	const {
		beginTravel,
		advanceTravel,
		turnAround,
		sleepOnRoad,
		isInTransit,
		canSleep,
	} = useTravel();
	const { submit } = useSubmit();

	const submitAfterTravel = async () => {
		await submit([
			...messages,
			{ role: "user", content: "(Continue.)", sentAt: new Date() },
		]);
	};

	const [isTripModalOpened, { open: openTripModal, close: closeTripModal }] =
		useDisclosure(false);
	const [selectedTrip, setSelectedTrip] = useState<{
		region: Region;
		distance: number;
		direction: string;
		safety: ConnectionSafety;
	} | null>(null);

	const hasLocation = playerState?.location?.region.id;

	const safetyColors: Record<ConnectionSafety, string> = {
		safe: "green",
		cautious: "yellow",
		dangerous: "orange",
		perilous: "red",
		lethal: "grape",
	};

	const connectedRegions = hasLocation
		? regions
				.filter((region) =>
					playerState?.location?.region.connectedRegionIds.includes(region.id!),
				)
				.map((region) => {
					const safety: ConnectionSafety =
						playerState?.location?.region.connectionSafety?.[region.id!] ??
						"safe";
					return {
						region: region,
						distance: getDistance(playerState?.location?.region, region),
						direction: getDirection(playerState?.location?.region, region),
						safety,
					};
				})
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
						{!isInTransit && (
							<>
								<Text>
									You are in the <b>{regionType}</b> of:
								</Text>
								<Title order={3}>{playerState?.location?.region.name}</Title>
								<Text size="sm" c="dimmed">
									{playerState?.location?.region.description}
								</Text>
							</>
						)}

						{connectedRegions.length > 0 && !isInTransit && (
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

											{items.map(({ region, distance, direction, safety }) => (
												<Button
													key={region.id}
													variant="default"
													fullWidth
													justify="space-between"
													onClick={() => {
														setSelectedTrip({
															region,
															distance,
															direction,
															safety,
														});

														openTripModal();
													}}
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
															<Text
																size="xs"
																c={safetyColors[safety]}
																component="span"
															>
																{safety.charAt(0).toUpperCase() +
																	safety.slice(1)}
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

						{isInTransit &&
							playerState?.location &&
							(() => {
								const transit = playerState.location;
								const destination = transit.transitRegion!;
								const traveled = transit.transitDistance ?? 0;
								const total = transit.transitTotalDistance ?? 0;
								const remaining = total - traveled;
								const baseSafety: ConnectionSafety =
									transit.transitBaseSafety ??
									transit.region.connectionSafety?.[destination.id!] ??
									"safe";
								const safety = getEffectiveSafety(
									baseSafety,
									playerState.time?.hour ?? 12,
								);
								const walkingSpeed = 5;

								return (
									<Stack gap="sm">
										<Title order={3} mt="xl">
											In Transit
										</Title>
										<Text size="sm">
											Traveling to <b>{destination.name}</b>...
										</Text>

										<Text size="sm">
											<b>Road safety:</b>{" "}
											<Text component="span" size="sm" c={safetyColors[safety]}>
												{safety.charAt(0).toUpperCase() + safety.slice(1)}
											</Text>
											{safety !== baseSafety && (
												<Text component="span" size="xs" c="dimmed">
													{" "}
													(nightfall)
												</Text>
											)}
										</Text>

										<List size="sm" spacing={4}>
											<List.Item>
												<Text size="sm">
													<b>Time traveled:</b>{" "}
													{estimateTravelTime(traveled, walkingSpeed)}
												</Text>
											</List.Item>
											<List.Item>
												<Text size="sm">
													<b>Estimated time remaining:</b>{" "}
													{estimateTravelTime(remaining, walkingSpeed)}
												</Text>
											</List.Item>
											<List.Item>
												<Text size="sm">
													<b>Remaining to destination:</b>{" "}
													{humanizeDistance(remaining)}
												</Text>
											</List.Item>
											<List.Item>
												<Text size="sm">
													<b>Distance back to {transit.region.name}:</b>{" "}
													{humanizeDistance(traveled)}
												</Text>
											</List.Item>
										</List>

										<Group gap="sm" mt="xs">
											<Button variant="default" onClick={() => turnAround()}>
												Turn Around
											</Button>
											<Button
												onClick={() =>
													advanceTravel().then(async (result) => {
														if (result && result.type !== "uneventful") {
															await submitAfterTravel();
														}
													})
												}
											>
												Continue
											</Button>

											{canSleep && (
												<Button
													variant="light"
													onClick={() =>
														sleepOnRoad().then(async (result) => {
															if (
																result &&
																result.type !== "rested" &&
																result.type !== "no_sleep"
															) {
																await submitAfterTravel();
															}
														})
													}
												>
													Sleep
												</Button>
											)}
										</Group>
									</Stack>
								);
							})()}
					</Stack>
				)}
				<TravelCalculator />

				<Modal
					opened={isTripModalOpened}
					onClose={closeTripModal}
					title={<Text fw={700}>Travel Confirmation</Text>}
				>
					{selectedTrip &&
						(() => {
							const meters = selectedTrip.distance * (gameState?.scale ?? 1);
							const walkingSpeed = 5;
							const destType =
								selectedTrip.region.type && selectedTrip.region.type !== "other"
									? selectedTrip.region.type
									: "region";

							return (
								<Stack>
									<Text>
										Travel to the <b>{destType}</b> of{" "}
										<b>{selectedTrip.region.name}</b>?
									</Text>

									{selectedTrip.region.description && (
										<Text size="sm" c="dimmed">
											{selectedTrip.region.description}
										</Text>
									)}

									<List size="sm" spacing="xs">
										<List.Item>
											<Text size="sm">
												<b>Direction:</b> {selectedTrip.direction}
											</Text>
										</List.Item>
										<List.Item>
											<Text size="sm">
												<b>Distance:</b> {humanizeDistance(meters)}
											</Text>
										</List.Item>
										<List.Item>
											<Text size="sm">
												<b>Safety:</b>{" "}
												<Text
													component="span"
													size="sm"
													c={safetyColors[selectedTrip.safety]}
												>
													{selectedTrip.safety.charAt(0).toUpperCase() +
														selectedTrip.safety.slice(1)}
												</Text>
											</Text>
										</List.Item>
										<List.Item>
											<Text size="sm">
												<b>Estimated time on foot:</b>{" "}
												{estimateTravelTime(meters, walkingSpeed)}
											</Text>
										</List.Item>
									</List>

									<Group justify="flex-end" mt="md">
										<Button variant="default" onClick={closeTripModal}>
											Cancel
										</Button>
										<Button
											onClick={async () => {
												const result = await beginTravel(
													selectedTrip.region.id!,
												);

												closeTripModal();

												if (result && result.type !== "uneventful") {
													await submitAfterTravel();
												}
											}}
										>
											Travel
										</Button>
									</Group>
								</Stack>
							);
						})()}
				</Modal>
			</Flex>
		</Box>
	);
}
