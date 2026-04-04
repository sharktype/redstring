import {
	BaseEdge,
	EdgeLabelRenderer,
	getStraightPath,
	type EdgeProps,
} from "@xyflow/react";
import { Anchor, Text } from "@mantine/core";

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
	const [edgePath, labelX, labelY] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	const distance = (data?.distance as string) ?? "";

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
						{distance} (Safe),{" "}
					</Text>
					<Anchor component="button" type="button" size="xs" onClick={() => {}}>
						Cycle?
					</Anchor>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
