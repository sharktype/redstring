export default interface GameState {
	// Active game state:

	secrets: Record<string, string>;

	// Options:

	detailer: "profile" | "journal";
}

export type StoredGameState = GameState & {
	id?: number;
};
