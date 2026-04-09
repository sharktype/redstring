import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
	ReactFlow,
	Panel,
	ConnectionLineType,
	ConnectionMode,
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
import MapNode from "./MapNode";
import MapEdge from "./MapEdge";
import TravelCalculator from "./TravelCalculator";
import { useGameState } from "../../../../db/hooks/useGameState";
import { useRegions } from "../../../../db/hooks/useRegions";
import type { Region, ConnectionSafety } from "../../../../models/Location";
import { humanizeDistance, getDistance } from "../../../../utils/distance";

type RegionSnapshot = {
	id: string;
	name: string;
	type: Region["type"];
	description: string;
	position: {
		x: number;
		y: number;
	};
	connectedRegionIds: string[];
	connectionSafety: Record<string, ConnectionSafety>;
};

type MapSnapshot = {
	scale: number;
	regions: RegionSnapshot[];
};

const sortIds = (ids: string[]) =>
	[...new Set(ids)].sort((a, b) => a.localeCompare(b));

const createSnapshotFromRegions = (
	regions: Region[],
	scale: number,
): MapSnapshot => {
	const regionsById = new globalThis.Map<string, RegionSnapshot>();

	regions.forEach((region) => {
		const id = String(region.id);
		const safetySnapshot: Record<string, ConnectionSafety> = {};

		if (region.connectionSafety) {
			Object.entries(region.connectionSafety).forEach(([targetId, safety]) => {
				safetySnapshot[String(targetId)] = safety;
			});
		}

		regionsById.set(id, {
			id,
			name: region.name,
			type: region.type,
			description: region.description,
			position: {
				x: Math.round(region.position.x),
				y: Math.round(region.position.y),
			},
			connectedRegionIds: sortIds(region.connectedRegionIds.map(String)),
			connectionSafety: safetySnapshot,
		});
	});

	return {
		scale,
		regions: [...regionsById.values()].sort((a, b) => a.id.localeCompare(b.id)),
	};
};

const createSnapshotFromFlow = (
	nodes: Node[],
	edges: Edge[],
	scale: number,
): MapSnapshot => {
	const connections: Record<string, string[]> = {};
	const safetyMap: Record<string, Record<string, ConnectionSafety>> = {};

	edges.forEach((edge) => {
		if (!connections[edge.source]) {
			connections[edge.source] = [];
		}

		if (!connections[edge.target]) {
			connections[edge.target] = [];
		}

		connections[edge.source].push(edge.target);
		connections[edge.target].push(edge.source);

		const safety = (edge.data?.safety as ConnectionSafety) ?? "safe";

		if (!safetyMap[edge.source]) {
			safetyMap[edge.source] = {};
		}

		if (!safetyMap[edge.target]) {
			safetyMap[edge.target] = {};
		}

		safetyMap[edge.source][edge.target] = safety;
		safetyMap[edge.target][edge.source] = safety;
	});

	const regions = nodes
		.map((node): RegionSnapshot => {
			const region = node.data as Partial<Region>;
			const regionPosition = region.position;

			const x = Math.round(regionPosition?.x ?? node.position.x);
			const y = Math.round(regionPosition?.y ?? node.position.y);

			return {
				id: String(node.id),
				name: region.name ?? "",
				type: (region.type as Region["type"]) ?? "other",
				description: region.description ?? "",
				position: { x, y },
				connectedRegionIds: sortIds(connections[node.id] ?? []),
				connectionSafety: safetyMap[node.id] ?? {},
			};
		})
		.sort((a, b) => a.id.localeCompare(b.id));

	return {
		scale,
		regions,
	};
};

export default function Map() {
	const { regions, areRegionsLoaded, bulkSaveRegions } = useRegions();
	const { gameState, isGameStateLoaded, updateGameState } = useGameState();
	const scale = gameState?.scale ?? 10;

	const [scaleInput, setScaleInput] = useState<number>(scale);

	useEffect(() => {
		setScaleInput(scale);
	}, [scale]);

	// For now, we use the base Node and Edge types from xyflow.

	const [nodes, setNodes, onNodesChangeBase] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChangeBase] = useEdgesState<Edge>([]);

	const [isMapHydrated, setIsMapHydrated] = useState(false);

	// "initialized" is used to ensure hydration only happens once. We use a ref since hydration deps. on regions.

	const initialized = useRef(false);
	const nodeTypes = useMemo(() => ({ location: MapNode }), []);
	const edgeTypes = useMemo(() => ({ map: MapEdge }), []);

	// Initialise nodes and edges from saved regions.

	useEffect(() => {
		if (!areRegionsLoaded || initialized.current) {
			return;
		}

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

		const initialEdges: Edge[] = [];
		const seenEdgeKeys = new Set<string>();

		regions.forEach((region) => {
			region.connectedRegionIds.forEach((targetId) => {
				const key = [
					Math.min(region.id!, targetId),
					Math.max(region.id!, targetId),
				].join("-");

				if (!seenEdgeKeys.has(key)) {
					seenEdgeKeys.add(key);

					const safety = region.connectionSafety?.[targetId] ?? "safe";

					initialEdges.push({
						id: `e${key}`,
						type: "map",
						source: String(region.id),
						target: String(targetId),
						data: { safety },
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
			});
		});

		setEdges(initialEdges);
		setIsMapHydrated(true);
	}, [regions, areRegionsLoaded, setEdges, setNodes]);

	// Comparing IndexedDB state to local state is tricky; we can really only do this with this complex snapshot
	// serialisation approach.

	const persistedSnapshot = useMemo(
		() => createSnapshotFromRegions(regions, scale),
		[regions, scale],
	);
	const localSnapshot = useMemo(
		() => createSnapshotFromFlow(nodes, edges, scaleInput),
		[nodes, edges, scaleInput],
	);
	const isDirty =
		isMapHydrated &&
		areRegionsLoaded &&
		isGameStateLoaded &&
		JSON.stringify(localSnapshot) !== JSON.stringify(persistedSnapshot);

	// Label edges with distances.

	const labeledEdges = useMemo(
		() =>
			edges.map((edge) => {
				const source = nodes.find((node) => node.id === edge.source);
				const target = nodes.find((node) => node.id === edge.target);

				if (!source || !target) {
					return { ...edge, data: { ...edge.data, distance: "" } };
				}

				const sourceRegion = regions.find((r) => String(r.id) === edge.source);
				const targetRegion = regions.find((r) => String(r.id) === edge.target);

				if (!sourceRegion || !targetRegion) {
					return { ...edge, data: { ...edge.data, distance: "" } };
				}

				const dist = humanizeDistance(
					Math.round(getDistance(sourceRegion, targetRegion) * scale),
				);

				return {
					...edge,
					data: { ...edge.data, distance: dist },
				};
			}),
		[nodes, edges, scale, regions],
	);

	const onConnect = useCallback(
		(params: Connection) => {
			const isDirectionless = !params.source || !params.target;
			const isSelfLoop = params.source === params.target;
			const isExists = edges.some(
				(edge) =>
					(edge.source === params.source && edge.target === params.target) ||
					(edge.source === params.target && edge.target === params.source),
			);

			if (isDirectionless || isSelfLoop || isExists) {
				return;
			}

			setEdges((prev) =>
				addEdge(
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
				),
			);
		},
		[edges, setEdges],
	);

	const onNodeDragStop = useCallback(
		(node: Node) => {
			setNodes((previous) =>
				previous.map((previousNode) =>
					previousNode.id === node.id
						? {
								...previousNode,
								data: {
									...previousNode.data,
									position: {
										x: Math.round(node.position.x),
										y: Math.round(node.position.y),
									},
								},
							}
						: previousNode,
				),
			);
		},
		[setNodes],
	);

	const addNode = useCallback(() => {
		const name = `region ${nodes.length + 1}`;

		const x = Math.random() * 400;
		const y = Math.random() * 400;

		setNodes((previous) => [
			...previous,
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
	}, [nodes.length, setNodes]);

	const saveMap = useCallback(async () => {
		const connections: Record<string, number[]> = {};
		const safetyByNode: Record<string, Record<number, ConnectionSafety>> = {};

		edges.forEach((edge) => {
			if (!connections[edge.source]) {
				connections[edge.source] = [];
			}

			if (!connections[edge.target]) {
				connections[edge.target] = [];
			}

			connections[edge.source].push(Number(edge.target));
			connections[edge.target].push(Number(edge.source));

			const safety = (edge.data?.safety as ConnectionSafety) ?? "safe";

			if (!safetyByNode[edge.source]) {
				safetyByNode[edge.source] = {};
			}

			if (!safetyByNode[edge.target]) {
				safetyByNode[edge.target] = {};
			}

			safetyByNode[edge.source][Number(edge.target)] = safety;
			safetyByNode[edge.target][Number(edge.source)] = safety;
		});

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
				connectionSafety: safetyByNode[node.id] ?? {},
			};
		});

		await bulkSaveRegions(updatedRegions);
		await updateGameState({ scale: scaleInput });

		const version = Date.now();

		setNodes((prev) =>
			prev.map((n) => ({
				...n,
				data: {
					...n.data,
					id: Number(n.id),
					position: {
						x: Math.round(n.position.x),
						y: Math.round(n.position.y),
					},
					saveVersion: version,
				},
			})),
		);
	}, [nodes, bulkSaveRegions, updateGameState, scaleInput, setNodes, edges]);

	return (
		<Flex w="calc(100vw - var(--app-shell-width))" h="100vh">
			<ReactFlow
				nodes={nodes}
				edges={labeledEdges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				defaultEdgeOptions={{ type: "map" }}
				connectionMode={ConnectionMode.Loose}
				connectionLineType={ConnectionLineType.Straight}
				onNodesChange={onNodesChangeBase}
				onEdgesChange={onEdgesChangeBase}
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
