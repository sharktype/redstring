export default interface GameState {
	// Interface/meta:

	detailer: "inventory" | "profile" | "map" | "journal";

	// Locations:

	scale: number;
}

export type StoredGameState = GameState & {
	id?: number;
};
