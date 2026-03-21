import { createContext } from "react";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import type AgentConfig from "../../models/AgentConfig.ts";

export interface GameContextType {
	providerConfigs: ProviderConfig[];
	agentConfigs: AgentConfig[];
}

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);

export default GameContext;
