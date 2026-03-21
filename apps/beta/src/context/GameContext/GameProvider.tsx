import { useMemo } from "react";
import { useProviderConfigs } from "../../db/hooks/useProviderConfigs.ts";
import { useAgentConfigs } from "../../db/hooks/useAgentConfigs.ts";
import GameContext from "./index.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import Agent from "../../handlers/agents.ts";
import { OpenRouterConfig } from "../../handlers/providers/openrouter.ts";

export default function GameProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { providerConfigs } = useProviderConfigs();
	const { agentConfigs } = useAgentConfigs();

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
				providerConfigs: augmentedProviderConfigs,
				agentConfigs: augmentedAgentConfigs,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
