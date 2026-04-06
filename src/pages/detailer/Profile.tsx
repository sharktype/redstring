import { Text } from "@mantine/core";

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
	return <Text>Profile details coming soon...</Text>;
}
