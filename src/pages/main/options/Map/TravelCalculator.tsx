import { useMemo, useState } from "react";
import { NumberInput, Select, Text } from "@mantine/core";
import {
	humanizeDistance,
	estimateTravelTime,
} from "../../../../utils/distance";

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
	const [selectedMode, setSelectedMode] = useState<string>("foot");
	const [distance, setDistance] = useState<number>(0);

	const distanceLabel = useMemo(() => humanizeDistance(distance), [distance]);

	// By foot is a reasonable default.

	const speed =
		travelModes.find((travelMode) => travelMode.value === selectedMode)
			?.speed ?? 5;
	const estimate = distance > 0 ? estimateTravelTime(distance, speed) : "";

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
				value={selectedMode}
				onChange={(value) => value && setSelectedMode(value)}
				mt="xs"
			/>
			<NumberInput
				size="xs"
				label={`Distance (${distanceLabel})`}
				description="In metres"
				mt={4}
				onChange={(value) => {
					if (typeof value === "number" && !Number.isNaN(value)) {
						setDistance(value);
					} else if (value === "" || value === null) {
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
