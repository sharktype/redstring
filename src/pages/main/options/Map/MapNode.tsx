import { useEffect, useRef, useState } from "react";
import {
	Handle,
	Position,
	useEdges,
	useReactFlow,
	type NodeProps,
} from "@xyflow/react";
import {
	Box,
	Button,
	Group,
	Modal,
	Select,
	Text,
	TextInput,
	Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGameState } from "../../../../db/hooks/useGameState";
import { usePlayerState } from "../../../../db/hooks/usePlayerState";
import { useRegions } from "../../../../db/hooks/useRegions";
import type { Region } from "../../../../models/Location";

/**
 * Subset of region types that can be assigned to a node.
 */
const REGION_TYPES: Region["type"][] = [
	"city",
	"town",
	"village",
	"watchtower",
	"dungeon",
	"landmark",
	"crossroads",
	"castle",
	"other",
];

export default function MapNode({ id, data, selected }: NodeProps) {
	const region = data as unknown as Region;

	const { saveRegion } = useRegions();
	const { gameState } = useGameState();
	const { playerState, updatePlayerState } = usePlayerState();
	const { updateNodeData } = useReactFlow();

	const scale = gameState?.scale ?? 1;

	const edges = useEdges();
	const isOrphan = !edges.some((e) => e.source === id || e.target === id);

	const [name, setName] = useState(region.name);
	const [type, setType] = useState<Region["type"]>(region.type);
	const [description, setDescription] = useState(region.description);

	const savedSnapshot = useRef({
		name: region.name,
		type: region.type,
		description: region.description,
		position: { ...region.position },
	});

	// Keep node data in sync with local edits so saveMap can read them.

	useEffect(() => {
		updateNodeData(id, { name, type, description });
	}, [id, name, type, description, updateNodeData]);

	// When parent Save Map fires, it stamps a new saveVersion, so reset dirty state.

	const saveVersion = (data as Record<string, unknown>).saveVersion as
		| number
		| undefined;
	const lastSaveVersion = useRef(saveVersion);

	if (saveVersion !== undefined && saveVersion !== lastSaveVersion.current) {
		lastSaveVersion.current = saveVersion;
		savedSnapshot.current = {
			name,
			type,
			description,
			position: { ...region.position },
		};
	}

	const [editModalOpened, { open: openDescription, close: closeEditModal }] =
		useDisclosure(false);

	const isDirty =
		name !== savedSnapshot.current.name ||
		type !== savedSnapshot.current.type ||
		description !== savedSnapshot.current.description ||
		region.position.x !== savedSnapshot.current.position.x ||
		region.position.y !== savedSnapshot.current.position.y;

	const handleSave = async () => {
		const updated = { ...region, name, type, description };

		if (updated.id == null) {
			updated.id = Number(id);
		}

		await saveRegion(updated);

		updateNodeData(id, updated);
		savedSnapshot.current = {
			name,
			type,
			description,
			position: { ...region.position },
		};
	};

	return (
		<>
			<Box
				p="xs"
				bg="var(--mantine-color-body)"
				style={{
					borderRadius: "var(--mantine-radius-sm)",
					border: `1px solid ${selected ? "var(--mantine-color-blue-5)" : "var(--mantine-color-default-border)"}`,
					boxShadow: selected
						? "0 0 0 2px var(--mantine-color-blue-5)"
						: undefined,
					minWidth: 180,
					opacity: 0.9,
				}}
			>
				<Handle type="source" position={Position.Top} />
				<Box
					py={4}
					mb={4}
					style={{
						cursor: "grab",
						textAlign: "center",
						borderBottom: "1px solid var(--mantine-color-default-border)",
					}}
				>
					<Text size="xs" c="dimmed">
						⠿ {region.id == null && "🚧 "}
						{isOrphan && "🏝️ "}(x: {Math.round(region.position.x * scale)}m, y:{" "}
						{Math.round(region.position.y * scale)}m) ⠿
					</Text>
				</Box>
				<TextInput
					size="xs"
					label="Name"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					className="nodrag"
				/>
				<Select
					size="xs"
					label="Type"
					data={REGION_TYPES}
					value={type}
					onChange={(v) => v && setType(v as Region["type"])}
					className="nodrag"
					mt={4}
				/>
				<Group mt="xs" gap={4}>
					<Button
						size="compact-xs"
						variant="light"
						onClick={openDescription}
						className="nodrag"
						style={{ flex: 1 }}
					>
						Edit
					</Button>
					{region.id != null && (
						<Button
							size="compact-xs"
							variant="light"
							color="violet"
							onClick={() =>
								updatePlayerState({
									location: { region, building: null },
								})
							}
							className="nodrag"
							disabled={playerState?.location.region.id === region.id}
						>
							Move
						</Button>
					)}
					<Button
						size="compact-xs"
						variant="outline"
						color="green"
						disabled={!isDirty}
						onClick={handleSave}
						className="nodrag"
					>
						Save
					</Button>
				</Group>
			</Box>
			<Modal
				opened={editModalOpened}
				onClose={closeEditModal}
				title={`${name}'s Details`}
				size="lg"
			>
				<Textarea
					autosize
					minRows={4}
					value={description}
					placeholder="Describe this region."
					onChange={(e) => setDescription(e.currentTarget.value)}
				/>
				<Button
					variant="default"
					size="xs"
					mt="md"
					w="100%"
					onClick={closeEditModal}
				>
					Close
				</Button>
			</Modal>
		</>
	);
}
