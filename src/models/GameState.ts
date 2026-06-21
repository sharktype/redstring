export default interface GameState {
	// Active game state:

	secrets: Record<string, string>;

	// Options:

	detailer: "inventory" | "profile" | "journal";
	isNsfw: boolean;
}

export type StoredGameState = GameState & {
	id?: number;
};
