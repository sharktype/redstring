import { useMemo, type PropsWithChildren } from "react";
import { useProviderConfigs } from "../../db/hooks/useProviderConfigs.ts";
import { useAgentConfigs } from "../../db/hooks/useAgentConfigs.ts";
import { useMessages } from "../../db/hooks/useMessages.ts";
import { usePlayerState } from "../../db/hooks/usePlayerState.ts";
import { useGameState } from "../../db/hooks/useGameState.ts";
import GameContext from "./index";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import Agent from "../../handlers/agents.ts";
import { OpenRouterConfig } from "../../handlers/providers/openrouter.ts";
import type PlayerState from "../../models/PlayerState.ts";

export default function GameProvider({ children }: PropsWithChildren) {
	const { messages } = useMessages();
	const { playerState } = usePlayerState();
	const { gameState } = useGameState();
	const { providerConfigs } = useProviderConfigs();
	const { agentConfigs } = useAgentConfigs();

	const augmentedPlayerState: PlayerState | null = useMemo(() => {
		if (!playerState) {
			return null;
		}

		// TODO: These aren't used yet.

		return {
			...playerState,
			move: (locationId: number) => true,
			enter: (buildingSlug: string) => true,
			exit: () => true,
		};
	}, [playerState]);

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
				player: augmentedPlayerState,
				gameState,
				messages,
				providerConfigs: augmentedProviderConfigs,
				agentConfigs: augmentedAgentConfigs,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
