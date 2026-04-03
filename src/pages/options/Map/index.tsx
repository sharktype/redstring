import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
	ReactFlow,
	Panel,
	ConnectionLineType,
	MarkerType,
	useNodesState,
	useEdgesState,
	addEdge,
	type Node,
	type Edge,
	type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
	Button,
	Center,
	Flex,
	Group,
	List,
	ListItem,
	NumberInput,
	Text,
} from "@mantine/core";
import { useRegions } from "../../../db/hooks/useRegions";
import { useGameState } from "../../../db/hooks/useGameState";
import type { Region } from "../../../models/Location";
import MapNode from "./MapNode";
import MapEdge from "./MapEdge";
import TravelCalculator from "./TravelCalculator";
import { getDistance, humanizeDistance } from "../../../utils/distance";

export default function Map() {
	const { regions, bulkSaveRegions } = useRegions();
	const { gameState, updateGameState } = useGameState();
	const scale = gameState?.scale ?? 10;

	const [scaleInput, setScaleInput] = useState<number>(scale);

	useEffect(() => {
		setScaleInput(scale);
	}, [scale]);

	// For now, we use the base Node and Edge types from xyflow.

	const [nodes, setNodes, onNodesChangeBase] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChangeBase] = useEdgesState<Edge>([]);

	const [isDirty, setIsDirty] = useState(false);

	const onNodesChange = useCallback(
		(...args: Parameters<typeof onNodesChangeBase>) => {
			onNodesChangeBase(...args);
			setIsDirty(true);
		},
		[onNodesChangeBase],
	);
	const onEdgesChange = useCallback(
		(...args: Parameters<typeof onEdgesChangeBase>) => {
			onEdgesChangeBase(...args);
			setIsDirty(true);
		},
		[onEdgesChangeBase],
	);

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
	}, [regions, setEdges, setNodes]);

	// Label edges with distances.

	const labeledEdges = useMemo(
		() =>
			edges.map((edge) => {
				const source = nodes.find((n) => n.id === edge.source);
				const target = nodes.find((n) => n.id === edge.target);

				if (!source || !target) {
					return { ...edge, data: { distance: "" } };
				}

				const sourceRegion = regions.find((r) => String(r.id) === edge.source);
				const targetRegion = regions.find((r) => String(r.id) === edge.target);

				if (!sourceRegion || !targetRegion) {
					return { ...edge, data: { distance: "" } };
				}

				const dist = humanizeDistance(
					Math.round(getDistance(sourceRegion, targetRegion) * scale),
				);

				return {
					...edge,
					data: { distance: dist },
				};
			}),
		[nodes, edges, scale, regions],
	);

	const onConnect = useCallback(
		(params: Connection) => {
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
		},
		[setEdges],
	);

	const onNodeDragStop = useCallback(
		(node: Node) => {
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
		},
		[setNodes],
	);

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
	}, [nodes.length, setNodes]);

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
	}, [nodes, bulkSaveRegions, updateGameState, scaleInput, setNodes, edges]);

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
				onNodeDragStop={(_event, node) => onNodeDragStop(node)}
				proOptions={{ hideAttribution: true }}
				fitView
			>
				{nodes.length === 0 && (
					<Center style={{ width: "100%", height: "100%" }}>
						<Text size="xl" c="dimmed">
							No nodes.
						</Text>
					</Center>
				)}
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
					<List size="xs" mt="md">
						<ListItem>
							Select and press Delete to remove nodes or connections.
						</ListItem>
						<ListItem>
							Disable the map feature by leaving one or zero nodes.
						</ListItem>
					</List>
				</Panel>
				<Panel position="bottom-left">
					<TravelCalculator />
				</Panel>
			</ReactFlow>
		</Flex>
	);
}
