import { Box, Textarea, Title } from "@mantine/core";
import { usePlayerState } from "../../db/hooks/usePlayerState";

/**
 * The Profile is a detailer and form component containing the core details about the player character.
 *
 * Some of this information is so critical that it appears on the sidebar, so it does not need to appear here again.
 *
 * This includes:
 *
 * - Name.
 * - Level/XP.
 * - Major stats (hitpoints, stealth, etc.)
 * - Status effects.
 *
 * In this detailer, we look at:
 *
 * - Titles.
 * - Minor/other stats.
 * - Relationships with factions.
 * - Freeform status (can be written by the Storyteller and player).
 */
export default function Profile() {
	const { playerState, updatePlayerState } = usePlayerState();

	return (
		<Box h="100%">
			<Title order={2} mb="md">
				Profile
			</Title>

			<Textarea
				label="Character Notes"
				description="Note: Also writable by the Storyteller."
				value={playerState?.stats?.textual ?? ""}
				onChange={(event) =>
					updatePlayerState({ stats: { textual: event.currentTarget.value } })
				}
				placeholder="Freeform character notes..."
				minRows={8}
				autosize
			/>
		</Box>
	);
}
