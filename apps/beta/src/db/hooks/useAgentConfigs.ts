import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database.ts";
import type AgentConfig from "../../models/AgentConfig.ts";
import { AVAILABLE_AGENT_TYPES } from "../../models/AgentConfig.ts";

export function useAgentConfigs() {
	const agentConfigs = useLiveQuery(() => db.agentConfigs.toArray(), []) ?? [];

	const addAgentConfig = async (config: Omit<AgentConfig, "id">) => {
		return db.agentConfigs.add(config);
	};

	const updateAgentConfig = async (
		id: number,
		updates: Partial<AgentConfig>,
	) => {
		return db.agentConfigs.update(id, updates);
	};

	const deleteAgentConfig = async (id: number) => {
		return db.agentConfigs.delete(id);
	};

	return {
		agentConfigs,
		addAgentConfig,
		updateAgentConfig,
		deleteAgentConfig,
	};
}

export function useAgentConfig(type: (typeof AVAILABLE_AGENT_TYPES)[number]) {
	const config = useLiveQuery(
		() => db.agentConfigs.where({ type }).first(),
		[type],
	);

	useEffect(() => {
		if (config !== undefined) {
			return;
		}

		db.transaction("rw", db.agentConfigs, async () => {
			const count = await db.agentConfigs.where({ type }).count();
			if (count === 0) {
				console.debug("no config found for type", type, "creating default");
				await db.agentConfigs.add({
					type,
					prompt: { base: "", current: "", default: "" },
					parameters: { numerical: {} },
				});
			}
		});
	}, [config, type]);

	return config;
}
