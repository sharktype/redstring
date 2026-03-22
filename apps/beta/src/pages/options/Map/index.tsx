import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
	ReactFlow,
	Panel,
	ConnectionLineType,
	MarkerType,
	applyNodeChanges,
	applyEdgeChanges,
	addEdge,
	type Node,
	type Edge,
	type NodeChange,
	type EdgeChange,
	type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button, Flex, Group, NumberInput } from "@mantine/core";
import { useRegions } from "../../../db/hooks/useRegions";
import { useGameState } from "../../../db/hooks/useGameState";
import type { Region } from "../../../models/Location";
import MapNode from "./MapNode";
import MapEdge from "./MapEdge";
import humanizeDistance from "./humanizeDistance";

export default function Map() {
	const { regions, bulkSaveRegions } = useRegions();
	const { gameState, updateGameState } = useGameState();
	const scale = gameState?.scale ?? 10;

	const [scaleInput, setScaleInput] = useState<number>(scale);

	useEffect(() => {
		setScaleInput(scale);
	}, [scale]);

	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const [isDirty, setIsDirty] = useState(false);

	const initialized = useRef(false);
	const nodeTypes = useMemo(() => ({ location: MapNode }), []);
	const edgeTypes = useMemo(() => ({ map: MapEdge }), []);

	// Initialise nodes and edges from saved regions.

	useEffect(() => {
		if (!initialized.current && regions.length !== 0) {
			initialized.current = true;

			setNodes(
				regions.map((region) => ({
					id: String(region.id),
					type: "location",
					position: { x: region.position.x, y: region.position.y },
					data: {
						...region,
					},
				})),
			);

			const initEdges: Edge[] = [];
			const seen = new Set<string>();

			for (const region of regions) {
				for (const targetId of region.connectedRegionIds) {
					const key = [
						Math.min(region.id!, targetId),
						Math.max(region.id!, targetId),
					].join("-");

					if (!seen.has(key)) {
						seen.add(key);
						initEdges.push({
							id: `e${key}`,
							type: "map",
							source: String(region.id),
							target: String(targetId),
							markerStart: {
								type: MarkerType.ArrowClosed,
								color: "var(--mantine-color-default-border)",
							},
							markerEnd: {
								type: MarkerType.ArrowClosed,
								color: "var(--mantine-color-default-border)",
							},
						});
					}
				}
			}

			setEdges(initEdges);
		}
	}, [regions]);

	// Label edges with distances.

	const labeledEdges = useMemo(
		() =>
			edges.map((edge) => {
				const source = nodes.find((n) => n.id === edge.source);
				const target = nodes.find((n) => n.id === edge.target);

				if (!source || !target) {
					return { ...edge, data: { distance: "" } };
				}

				const dx = source.position.x - target.position.x;
				const dy = source.position.y - target.position.y;
				const dist = humanizeDistance(
					Math.round(Math.sqrt(dx * dx + dy * dy) * scale),
				);

				return {
					...edge,
					data: { distance: dist },
				};
			}),
		[nodes, edges, scale],
	);

	// Define behaviour when nodes or edges are changed.

	const onNodesChange = useCallback((changes: NodeChange[]) => {
		setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));

		setIsDirty(true);
	}, []);
	const onEdgesChange = useCallback((changes: EdgeChange[]) => {
		setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));

		setIsDirty(true);
	}, []);
	const onConnect = useCallback((params: Connection) => {
		setEdges((prev) => {
			const exists = prev.some(
				(e) =>
					(e.source === params.source && e.target === params.target) ||
					(e.source === params.target && e.target === params.source),
			);
			if (exists) return prev;

			return addEdge(
				{
					...params,
					type: "map",
					markerStart: {
						type: MarkerType.ArrowClosed,
						color: "var(--mantine-color-default-border)",
					},
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: "var(--mantine-color-default-border)",
					},
				},
				prev,
			);
		});

		setIsDirty(true);
	}, []);

	const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
		setNodes((prev) =>
			prev.map((n) =>
				n.id === node.id
					? {
							...n,
							data: {
								...n.data,
								position: {
									x: Math.round(node.position.x),
									y: Math.round(node.position.y),
								},
							},
						}
					: n,
			),
		);
	}, []);

	const addNode = useCallback(() => {
		const name = `region ${nodes.length + 1}`;

		const x = Math.random() * 400;
		const y = Math.random() * 400;

		setNodes((prev) => [
			...prev,
			{
				id: String(Date.now()),
				type: "location",
				position: { x, y },
				data: {
					name,
					type: "other" as const,
					description: "",
					buildings: {},
					position: { x: Math.round(x), y: Math.round(y) },
					connectedRegionIds: [],
				},
			},
		]);
		setIsDirty(true);
	}, [nodes.length]);

	const saveMap = useCallback(async () => {
		// Start by collecting the connections since we need to put them onto the regions.

		const connections: Record<string, number[]> = {};
		for (const edge of edges) {
			if (!connections[edge.source]) {
				connections[edge.source] = [];
			}
			if (!connections[edge.target]) {
				connections[edge.target] = [];
			}

			connections[edge.source].push(Number(edge.target));
			connections[edge.target].push(Number(edge.source));
		}

		const updatedRegions: Region[] = nodes.map((node) => {
			const region = node.data as unknown as Region;

			return {
				...region,
				id: Number(node.id),
				position: {
					x: Math.round(node.position.x),
					y: Math.round(node.position.y),
				},
				connectedRegionIds: connections[node.id] ?? [],
			};
		});

		await bulkSaveRegions(updatedRegions);
		await updateGameState({ scale: scaleInput });

		// Stamp nodes with updated positions and a saveVersion so LocationNode resets dirty state.
		const version = Date.now();
		setNodes((prev) =>
			prev.map((n) => ({
				...n,
				data: {
					...n.data,
					position: {
						x: Math.round(n.position.x),
						y: Math.round(n.position.y),
					},
					saveVersion: version,
				},
			})),
		);

		setIsDirty(false);
	}, [nodes, edges, scaleInput, bulkSaveRegions, updateGameState]);

	return (
		<Flex w="calc(100vw - var(--app-shell-width))" h="100vh">
			<ReactFlow
				nodes={nodes}
				edges={labeledEdges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				defaultEdgeOptions={{ type: "map" }}
				connectionLineType={ConnectionLineType.Straight}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeDragStop={onNodeDragStop}
				proOptions={{ hideAttribution: true }}
				fitView
			>
				<Panel position="top-left">
					<Group gap="xs">
						<Button variant="default" size="xs" onClick={addNode}>
							Add Node
						</Button>
						<Button
							variant="outline"
							color="green"
							size="xs"
							onClick={saveMap}
							disabled={!isDirty}
						>
							Save Map
						</Button>
					</Group>
					<NumberInput
						label={`Scale (current is 1:${humanizeDistance(scale)})`}
						size="xs"
						mt="xs"
						min={1}
						value={scaleInput}
						onChange={(val) => {
							setScaleInput(Number(val));
							setIsDirty(true);
						}}
					/>
				</Panel>
			</ReactFlow>
		</Flex>
	);
}
