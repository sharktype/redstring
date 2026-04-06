export default interface GameState {
	// Interface/meta:

	detailer: "inventory" | "profile" | "map" | "journal" | null;

	// Locations:

	scale: number;
}

export type StoredGameState = GameState & {
	id?: number;
};
