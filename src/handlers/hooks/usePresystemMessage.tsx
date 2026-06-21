import { useCallback } from "react";
import useGameContext from "../../context/GameContext/useGameContext";
import type Message from "../../models/Message";

export default function usePresystemMessage() {
	const { playerState, gameState } = useGameContext();

	const buildPresystemMessage = useCallback((): Message | null => {
		if (!playerState || !gameState) {
			return null;
		}

		const parts: string[] = [];

		parts.push("## Current World State");

		if (playerState.name) {
			parts.push(
				`**Player Name:** ${playerState.name.given} ${playerState.name.surname}`,
			);
		}

		if (playerState.gender) {
			parts.push(
				`**Gender:** ${playerState.gender.identity} (${playerState.gender.pronouns.subject}/${playerState.gender.pronouns.object})`,
			);
		}

		if (playerState.time) {
			const hour = String(playerState.time.hour).padStart(2, "0");
			const minute = String(playerState.time.minute).padStart(2, "0");

			parts.push(`**Time:** ${hour}:${minute}`);
		}

		if (playerState.money !== undefined) {
			parts.push(`**Money:** ${playerState.money}`);
		}

		if (playerState.stats?.textual) {
			parts.push("\n");

			parts.push(`**Character notes:**\n${playerState.stats.textual}`);
		}

		if (gameState.secrets && Object.keys(gameState.secrets).length > 0) {
			const secrets = Object.entries(gameState.secrets)
				.map(([key, value]) => `- **${key}:** ${value}`)
				.join("\n");

			parts.push(`**Storyteller's secrets:**\n${secrets}`);
		}

		return {
			role: "system",
			content: parts.join("\n\n"),
			sentAt: new Date(),
		};
	}, [playerState, gameState]);

	return { buildPresystemMessage };
}
