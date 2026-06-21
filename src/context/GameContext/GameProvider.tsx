import { type PropsWithChildren, useMemo, useState } from "react";
import { useAgentConfigs } from "../../db/hooks/useAgentConfigs.ts";
import { useGameState } from "../../db/hooks/useGameState.ts";
import { useMessages } from "../../db/hooks/useMessages.ts";
import { usePlayerState } from "../../db/hooks/usePlayerState.ts";
import { useProviderConfigs } from "../../db/hooks/useProviderConfigs.ts";
import Agent from "../../handlers/agents.ts";
import { OpenRouterConfig } from "../../handlers/providers/openrouter.ts";
import type { ChargenPage } from "../../models/Chargen.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import GameContext from "./index";

// During the game, most of the interactions should happen through the game
// context. The only exception is for directly dealing with the database. Note,
// however, that changing the database will still trigger updates in the context
// so this is mostly for consistency.

export default function GameProvider({ children }: PropsWithChildren) {
	const { messages, addMessage } = useMessages();
	const { playerState, updatePlayerState } = usePlayerState();
	const { gameState, updateGameState } = useGameState();
	const { providerConfigs } = useProviderConfigs();
	const { agentConfigs } = useAgentConfigs();

	const [chargenPage, setChargenPage] = useState<ChargenPage>("identity");

	// Note: Augmented provider is rarely called versus the agents.

	const augmentedProviderConfigs = useMemo(
		() =>
			providerConfigs.map((config): ProviderConfig => {
				switch (config.type) {
					case "openrouter":
						return new OpenRouterConfig(
							config.name,
							config.apiKey,
							config.model,
							config.id,
						);
					default:
						throw new Error(`unsupported provider type: ${config.type}`);
				}
			}),
		[providerConfigs],
	);

	const augmentedAgentConfigs = useMemo(
		() =>
			agentConfigs.map((config) => {
				const provider = augmentedProviderConfigs.find(
					(p) => p.id === config.providerConfigId,
				);

				return new Agent(config, provider);
			}),
		[agentConfigs, augmentedProviderConfigs],
	);

	return (
		<GameContext.Provider
			value={{
				playerState,
				updatePlayerState,
				gameState,
				updateGameState,
				messages,
				addMessage,
				providerConfigs: augmentedProviderConfigs,
				agentConfigs: augmentedAgentConfigs,
				chargenPage,
				setChargenPage,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
