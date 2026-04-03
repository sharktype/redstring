import {
	Box,
	Button,
	Center,
	Group,
	Loader,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import useGameContext from "../../../context/hooks/useGameContext.tsx";
import { useRegions } from "../../../db/hooks/useRegions.ts";
import { getDistance, humanizeDistance } from "../../../utils/distance.ts";
import { getDirection } from "../../../utils/direction.ts";

export default function Detailer() {
	const { player } = useGameContext();
	const { regions } = useRegions();

	const hasLocation = player?.location.region.id != null;

	const connectedRegions = hasLocation
		? regions
				.filter((r) =>
					player.location.region.connectedRegionIds.includes(r.id!),
				)
				.map((r) => ({
					region: r,
					distance: getDistance(player.location.region, r),
					direction: getDirection(player.location.region, r),
				}))
				.sort((a, b) => a.distance - b.distance)
		: [];

	if (player == null) {
		return (
			<Box h="100%" w="calc(var(--app-shell-navbar-width) * 2)">
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

	let regionType: string = player.location.region.type;
	if (!regionType || regionType === "other") {
		regionType = "region";
	}

	return (
		<Box h="100%" w="calc(var(--app-shell-navbar-width) * 2)">
			<Box
				h="100%"
				bg="var(--mantine-color-body)"
				p="md"
				style={{
					borderLeft: "1px solid var(--app-shell-border-color)",
				}}
			>
				<Title order={1}>Map</Title>

				{!hasLocation ? (
					<Stack>
						<Text>You are currently not in the world!</Text>

						<Title order={3}>Where are you?</Title>

						{regions.map((region) => (
							<Button
								key={region.id}
								variant="default"
								onClick={() => player.move(region.id!)}
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
						<Title order={3}>{player.location.region.name}</Title>
						<Text size="sm" c="dimmed">
							{player.location.region.description}
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
										onClick={() => player.move(region.id!)}
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
			</Box>
		</Box>
	);
}
