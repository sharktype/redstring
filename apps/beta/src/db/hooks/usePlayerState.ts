import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database.ts";
import type { StoredPlayerState } from "../../models/PlayerState.ts";

// Player state is special in that it can only be mutated through its augmented
// methods. It does not need to be mutated directly.

const DEFAULT_PLAYER_STATE: Omit<StoredPlayerState, "id"> = {
	date: { day: 1, month: 1, year: 1 },
	time: { hour: 0, minute: 0 },
	location: {
		region: {
			name: "",
			type: "other",
			description: "",
			buildings: {},
			position: { x: 0, y: 0 },
			connectedRegionIds: [],
		},
		building: null,
	},
};

export function usePlayerState() {
	const playerState = useLiveQuery(
		() => db.playerState.toCollection().first(),
		[],
	);

	useEffect(() => {
		if (playerState !== undefined) {
			return;
		}

		db.transaction("rw", db.playerState, async () => {
			const count = await db.playerState.count();
			if (count === 0) {
				await db.playerState.add({ ...DEFAULT_PLAYER_STATE });
			}
		});
	}, [playerState]);

	return {
		playerState: playerState ?? null,
	};
}
