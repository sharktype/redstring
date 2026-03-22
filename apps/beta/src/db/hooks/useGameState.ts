import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database.ts";
import type { StoredGameState } from "../../models/GameState.ts";

const DEFAULT_GAME_STATE: Omit<StoredGameState, "id"> = {
	scale: 10,
};

export function useGameState() {
	const gameState = useLiveQuery(() => db.gameState.toCollection().first(), []);

	useEffect(() => {
		if (gameState !== undefined) {
			return;
		}

		db.transaction("rw", db.gameState, async () => {
			const count = await db.gameState.count();
			if (count === 0) {
				await db.gameState.add({ ...DEFAULT_GAME_STATE });
			}
		});
	}, [gameState]);

	const updateGameState = async (updates: Omit<StoredGameState, "id">) => {
		if (gameState?.id != null) {
			await db.gameState.update(gameState.id, updates);
		}
	};

	return {
		gameState: gameState ?? null,
		updateGameState,
	};
}
