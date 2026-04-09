export default interface GameState {
	// Interface/meta:

	detailer: "inventory" | "profile" | "map" | "journal";

	// Locations:

	scale: number;

	// LLM context:

	secrets: Record<string, string>;
}

export type StoredGameState = GameState & {
	id?: number;
};
