import { useMemo, useState } from "react";
import { NumberInput, Select, Text } from "@mantine/core";
import { humanizeDistance } from "../../../../utils/distance";

// Measured in: km/h.

const travelModes = [
	{ value: "foot", label: "Walking", speed: 5 },
	{ value: "jog", label: "Jogging", speed: 8 },
	{ value: "run", label: "Running", speed: 12 },
	{ value: "carriage", label: "Carriage", speed: 10 },
	{ value: "horse", label: "Horse", speed: 15 },
	{ value: "ship", label: "Galley", speed: 7 },
] as const;

export default function TravelCalculator() {
	const [mode, setMode] = useState<string>("foot");
	const [distance, setDistance] = useState<number>(0);

	const distanceLabel = useMemo(() => humanizeDistance(distance), [distance]);

	// By foot is a reasonable default.

	const speed = travelModes.find((m) => m.value === mode)?.speed ?? 5;

	const distanceKm = distance / 1000;
	const hoursForDistance = speed > 0 ? distanceKm / speed : 0;

	const hoursPart = Math.floor(hoursForDistance);
	const minutesPart = Math.floor((hoursForDistance - hoursPart) * 60);

	let estimate = "";
	if (distance > 0) {
		if (hoursPart > 0 && minutesPart > 0) {
			estimate = `~${hoursPart}h ${minutesPart}m`;
		} else if (hoursPart > 0) {
			estimate = `~${hoursPart}h`;
		} else if (minutesPart > 0) {
			estimate = `~${minutesPart}m`;
		} else {
			estimate = "<1m";
		}
	}

	return (
		<>
			<Text>
				<b>Travel Time Estimator</b>
			</Text>
			<Select
				size="xs"
				label="Mode"
				data={travelModes.map((mode) => ({
					value: mode.value,
					label: mode.label,
				}))}
				value={mode}
				onChange={(value) => value && setMode(value)}
				mt="xs"
			/>
			<NumberInput
				size="xs"
				label={`Distance (${distanceLabel})`}
				description="In metres"
				mt={4}
				onChange={(val) => {
					if (typeof val === "number" && !Number.isNaN(val)) {
						setDistance(val);
					} else if (val === "" || val === null) {
						setDistance(0);
					}
				}}
				value={distance}
			/>
			<Text size="xs" c="dimmed" mt={4}>
				Rough travel time: {estimate || "N/A"}
			</Text>
		</>
	);
}
