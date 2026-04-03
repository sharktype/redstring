export default interface GameState {
	scale: number;
}

export type StoredGameState = GameState & {
	id?: number;
};
