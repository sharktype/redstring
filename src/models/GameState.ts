export default interface GameState {
	// Active game state:

	secrets: Record<string, string>;

	// Options:

	isNsfw: boolean;
	detailer: "profile" | "journal";
}

export type StoredGameState = GameState & {
	id?: number;
};
