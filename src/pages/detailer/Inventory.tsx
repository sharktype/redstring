import { useState } from "react";
import {
	Box,
	Button,
	Card,
	Checkbox,
	Flex,
	Group,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title,
} from "@mantine/core";
import useGameContext from "../../context/hooks/useGameContext.tsx";
import Tier from "../../models/Tier.ts";
import type Item from "../../models/Item.ts";

export default function Inventory() {
	const { playerState, updatePlayerState, addMessage } = useGameContext();
	const [isEditMode, setIsEditMode] = useState(false);

	const inventory = playerState?.inventory ?? [];

	const updateEntry = (index: number, updates: Partial<Item>) => {
		const updated = inventory.map((entry, inventoryIndex) =>
			inventoryIndex === index
				? { ...entry, item: { ...entry.item, ...updates } }
				: entry,
		);

		updatePlayerState({ inventory: updated });
	};

	const updateQuantity = (index: number, quantity: number) => {
		const updated = inventory.map((entry, inventoryIndex) =>
			inventoryIndex === index ? { ...entry, quantity } : entry,
		);

		updatePlayerState({ inventory: updated });
	};

	const consumeItem = (index: number) => {
		const entry = inventory[index];

		addMessage({
			role: "system",
			content: `Player has consumed ${entry.item.name}`,
			sentAt: new Date(),
		});

		if (entry.quantity > 1) {
			const updated = inventory.map((e, inventoryIndex) =>
				inventoryIndex === index ? { ...e, quantity: e.quantity - 1 } : e,
			);

			updatePlayerState({ inventory: updated });
		} else {
			updatePlayerState({
				inventory: inventory.filter(
					(_, inventoryIndex) => inventoryIndex !== index,
				),
			});
		}
	};

	const discardItem = (index: number) => {
		const entry = inventory[index];

		addMessage({
			role: "system",
			content: `Player has discarded ${entry.item.name}`,
			sentAt: new Date(),
		});

		if (entry.quantity > 1) {
			const updated = inventory.map((item, inventoryIndex) =>
				inventoryIndex === index
					? { ...item, quantity: item.quantity - 1 }
					: item,
			);
			updatePlayerState({ inventory: updated });
		} else {
			updatePlayerState({
				inventory: inventory.filter(
					(_, inventoryIndex) => inventoryIndex !== index,
				),
			});
		}
	};

	const addDebugItem = () => {
		const item: Item = {
			name: "Debug Potion",
			category: "potion",
			tier: "common",
			valueMultiplier: 1,
			description: "A mysterious potion that appeared from nowhere.",
			isConsumable: true,
		};

		updatePlayerState({ inventory: [...inventory, { item, quantity: 1 }] });
	};

	return (
		<Box h="100%" style={{ display: "flex", flexDirection: "column" }}>
			<Title order={2} mb="md">
				Inventory
			</Title>
			<Box style={{ flex: 1, overflow: "auto" }}>
				<Stack gap="xs">
					{inventory.map(({ item, quantity }, inventoryIndex) => (
						<Card
							key={inventoryIndex}
							padding="xs"
							withBorder
							style={
								item.isQuestItem
									? { borderColor: "gold", borderWidth: 2 }
									: undefined
							}
						>
							{isEditMode ? (
								<Stack gap="xs">
									<TextInput
										label="Name"
										size="xs"
										value={item.name}
										onChange={(event) =>
											updateEntry(inventoryIndex, {
												name: event.currentTarget.value,
											})
										}
									/>
									<TextInput
										label="Category"
										size="xs"
										value={item.category}
										onChange={(event) =>
											updateEntry(inventoryIndex, {
												category: event.currentTarget.value,
											})
										}
									/>
									<Group grow gap="xs">
										<Select
											label="Tier"
											size="xs"
											data={Object.values(Tier)}
											value={item.tier}
											onChange={(value) =>
												value &&
												updateEntry(inventoryIndex, {
													tier: value as typeof item.tier,
												})
											}
										/>
										<NumberInput
											label="Value Multiplier"
											size="xs"
											value={item.valueMultiplier}
											onChange={(value) =>
												updateEntry(inventoryIndex, {
													valueMultiplier: Number(value),
												})
											}
										/>
									</Group>
									<NumberInput
										label="Quantity"
										size="xs"
										value={quantity}
										min={1}
										onChange={(value) =>
											updateQuantity(inventoryIndex, Number(value))
										}
									/>
									<Textarea
										label="Description"
										size="xs"
										value={item.description}
										onChange={(event) =>
											updateEntry(inventoryIndex, {
												description: event.currentTarget.value,
											})
										}
										minRows={2}
										autosize
									/>
									<Group gap="xs">
										<Checkbox
											label="Consumable"
											size="xs"
											checked={item.isConsumable ?? false}
											onChange={(event) =>
												updateEntry(inventoryIndex, {
													isConsumable: event.currentTarget.checked,
												})
											}
										/>
										<Checkbox
											label="Secret description"
											size="xs"
											checked={item.isDescriptionSecret ?? false}
											onChange={(event) =>
												updateEntry(inventoryIndex, {
													isDescriptionSecret: event.currentTarget.checked,
												})
											}
										/>
										<Checkbox
											label="Quest item"
											size="xs"
											checked={item.isQuestItem ?? false}
											onChange={(event) =>
												updateEntry(inventoryIndex, {
													isQuestItem: event.currentTarget.checked,
												})
											}
										/>
									</Group>
								</Stack>
							) : (
								<Group justify="space-between" align="flex-start" wrap="nowrap">
									<Stack gap={2} style={{ flex: 1 }}>
										<Flex>
											<Text size="sm" c="dimmed" mr="4">
												{quantity}x
											</Text>

											<Text size="sm" fw={600}>
												{item.name}
											</Text>
										</Flex>

										<Text size="xs" c="dimmed">
											{item.tier} {item.category}
										</Text>

										{!item.isDescriptionSecret && (
											<Text size="xs">{item.description}</Text>
										)}
									</Stack>
									<Group gap={4} wrap="nowrap">
										{item.isConsumable && (
											<Button
												size="xs"
												variant="light"
												onClick={() => consumeItem(inventoryIndex)}
											>
												Consume
											</Button>
										)}
										{!item.isQuestItem && (
											<Button
												size="xs"
												variant="light"
												color="red"
												onClick={() => discardItem(inventoryIndex)}
											>
												Discard
											</Button>
										)}
									</Group>
								</Group>
							)}
						</Card>
					))}

					{inventory.length === 0 && (
						<Text size="sm" c="dimmed">
							No items.
						</Text>
					)}
				</Stack>
			</Box>
			<Group mt="md" gap="xs" grow>
				<Button size="xs" variant="light" onClick={addDebugItem}>
					Add Item (Debug)
				</Button>

				<Button
					size="xs"
					variant={isEditMode ? "filled" : "light"}
					color="yellow"
					onClick={() => setIsEditMode((v) => !v)}
					disabled={inventory.length === 0}
				>
					Toggle Edit Mode
				</Button>
			</Group>
		</Box>
	);
}
