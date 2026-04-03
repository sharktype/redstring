import { createContext } from "react";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type AgentConfig from "../../models/AgentConfig.ts";
import type Message from "../../models/Message.ts";
import type PlayerState from "../../models/PlayerState.ts";
import type GameState from "../../models/GameState.ts";

export interface GameContextType {
	player: PlayerState | null;
	gameState: GameState | null;

	messages: Message[];
	addMessage: (message: Omit<Message, "id">) => Promise<void>;

	providerConfigs: ProviderConfig[];
	agentConfigs: AgentConfig[];
}

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);

export default GameContext;
