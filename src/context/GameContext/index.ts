import { createContext } from "react";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type AgentConfig from "../../models/AgentConfig.ts";
import type Message from "../../models/Message.ts";
import type PlayerState from "../../models/PlayerState.ts";
import type GameState from "../../models/GameState.ts";
import type { Region } from "../../models/Location.ts";
import type { StoredGameState } from "../../models/GameState.ts";
import type { StoredPlayerState } from "../../models/PlayerState.ts";

export interface GameContextType {
	playerState: PlayerState | null;
	updatePlayerState: (
		updates: Partial<Omit<StoredPlayerState, "id">>,
	) => Promise<void>;
	gameState: GameState | null;
	updateGameState: (
		updates: Partial<Omit<StoredGameState, "id">>,
	) => Promise<void>;

	messages: Message[];
	addMessage: (message: Omit<Message, "id">) => Promise<void>;

	regions: Region[];

	providerConfigs: ProviderConfig[];
	agentConfigs: AgentConfig[];
}

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);

export default GameContext;
