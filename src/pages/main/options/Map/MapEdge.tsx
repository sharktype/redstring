import {
	BaseEdge,
	EdgeLabelRenderer,
	getStraightPath,
	useReactFlow,
	type EdgeProps,
} from "@xyflow/react";
import { Anchor, Text } from "@mantine/core";
import {
	CONNECTION_SAFETY_LEVELS,
	type ConnectionSafety,
} from "../../../../models/Location";

const safetyColors: Record<ConnectionSafety, string> = {
	safe: "green",
	cautious: "yellow",
	dangerous: "orange",
	perilous: "red",
	lethal: "grape",
};

export default function MapEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	markerStart,
	markerEnd,
	data,
}: EdgeProps) {
	const { setEdges } = useReactFlow();

	const [edgePath, labelX, labelY] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	const distance = (data?.distance as string) ?? "";
	const safety = (data?.safety as ConnectionSafety) ?? "safe";

	const cycleSafety = () => {
		const currentIndex = CONNECTION_SAFETY_LEVELS.indexOf(safety);
		const nextIndex = (currentIndex + 1) % CONNECTION_SAFETY_LEVELS.length;
		const nextSafety = CONNECTION_SAFETY_LEVELS[nextIndex];

		setEdges((prev) =>
			prev.map((edge) =>
				edge.id === id
					? { ...edge, data: { ...edge.data, safety: nextSafety } }
					: edge,
			),
		);
	};

	const safetyLabel = safety.charAt(0).toUpperCase() + safety.slice(1);

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				markerStart={markerStart}
				markerEnd={markerEnd}
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						pointerEvents: "all",
						background: "var(--mantine-color-body)",
						border: "1px solid var(--mantine-color-default-border)",
						borderRadius: 4,
						padding: "2px 6px",
						fontSize: 10,
						lineHeight: 1.4,
						whiteSpace: "nowrap",
						zIndex: 1001,
					}}
					className="nodrag nopan"
				>
					<Text component="span" size="xs">
						{distance} (
					</Text>
					<Anchor
						component="button"
						type="button"
						size="xs"
						c={safetyColors[safety]}
						onClick={cycleSafety}
					>
						{safetyLabel}
					</Anchor>
					<Text component="span" size="xs">
						)
					</Text>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
