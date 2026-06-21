import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import type { StoredGameState } from "../../models/GameState.ts";
import { db } from "../database.ts";

const DEFAULT_GAME_STATE: Omit<StoredGameState, "id"> = {
	detailer: "profile",
	secrets: {},
};

export function useGameState() {
	const gameStateResult = useLiveQuery(
		() => db.gameState.toCollection().first(),
		[],
	);
	const gameState = gameStateResult;

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

	const updateGameState = async (
		updates: Partial<Omit<StoredGameState, "id">>,
	) => {
		if (gameState?.id != null) {
			await db.gameState.update(gameState.id, updates);
		}
	};

	return {
		gameState: gameState ?? null,
		updateGameState,
	};
}
