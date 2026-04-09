export default interface GameState {
	// Active game state:

	secrets: Record<string, string>;

	// Options:

	detailer: "inventory" | "profile" | "map" | "journal";
	scale: number;
}

export type StoredGameState = GameState & {
	id?: number;
};
