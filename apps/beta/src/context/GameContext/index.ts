import { createContext } from "react";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type AgentConfig from "../../models/AgentConfig.ts";
import type Message from "../../models/Message.ts";

export interface GameContextType {
	messages: Message[];
	providerConfigs: ProviderConfig[];
	agentConfigs: AgentConfig[];
}

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);

export default GameContext;
