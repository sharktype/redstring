import { useState } from "react";
import {
	Box,
	Button,
	Collapse,
	Divider,
	Flex,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title,
} from "@mantine/core";
import useGameContext from "../../context/hooks/useGameContext.tsx";

export default function Journal() {
	const { gameState, updateGameState } = useGameContext();
	const [spoilersOpen, setSpoilersOpen] = useState(false);
	const [slugError, setSlugError] = useState<string | null>(null);

	const secrets = gameState?.secrets ?? {};
	const entries = Object.entries(secrets);

	const updateSecretSlug = (oldSlug: string, newSlug: string) => {
		const updated = { ...secrets };
		const value = updated[oldSlug];

		delete updated[oldSlug];

		if (newSlug in updated) {
			let deduped = `${newSlug}-1`;
			let i = 2;

			while (deduped in updated) {
				deduped = `${newSlug}-${i++}`;
			}

			setSlugError(`"${newSlug}" already exists, renamed to "${deduped}"`);

			updated[deduped] = value;
		} else {
			setSlugError(null);
			updated[newSlug] = value;
		}

		updateGameState({ secrets: updated });
	};

	const updateSecretContent = (slug: string, value: string) => {
		updateGameState({ secrets: { ...secrets, [slug]: value } });
	};

	const addSecret = () => {
		let slug = "new-secret";
		let i = 1;

		while (slug in secrets) {
			slug = `new-secret-${i++}`;
		}

		updateGameState({ secrets: { ...secrets, [slug]: "" } });
	};

	const removeSecret = (slug: string) => {
		const updated = { ...secrets };

		delete updated[slug];

		updateGameState({ secrets: updated });
	};

	return (
		<Flex h="100%" direction="column">
			<Title order={2} mb="md">
				Journal
			</Title>
			<Box flex={1}>
				<Text c="dimmed">Coming in a later version...</Text>
			</Box>
			<Button
				variant="outline"
				color="yellow"
				size="xs"
				onClick={() => setSpoilersOpen((o) => !o)}
			>
				{spoilersOpen ? "Hide" : "Show"} Secrets (Spoilers)
			</Button>
			<Collapse expanded={spoilersOpen}>
				<Stack mt="sm" gap="xs">
					{slugError && (
						<Text c="red" size="sm">
							{slugError}
						</Text>
					)}

					<Box style={{ overflowY: "auto", maxHeight: "512px" }}>
						{entries.map(([slug, content], i) => (
							<Stack key={i} gap="xs">
								{i > 0 && <Divider />}
								<TextInput
									label="Slug"
									size="xs"
									value={slug}
									onChange={(e) =>
										updateSecretSlug(slug, e.currentTarget.value)
									}
								/>
								<Textarea
									label="Content"
									size="xs"
									value={content}
									onChange={(e) =>
										updateSecretContent(slug, e.currentTarget.value)
									}
									minRows={3}
									autosize
								/>
								<Button
									color="red"
									variant="light"
									size="xs"
									onClick={() => removeSecret(slug)}
								>
									Remove
								</Button>
							</Stack>
						))}
					</Box>

					<Button onClick={addSecret} variant="light" size="xs">
						Add Secret
					</Button>
				</Stack>
			</Collapse>
		</Flex>
	);
}
