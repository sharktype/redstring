import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import type { StoredAgentConfig } from "../../models/AgentConfig.ts";
import {
	AVAILABLE_AGENT_TYPES,
	DEFAULT_DIALOGUE_PROMPT,
	DEFAULT_PLANNER_PROMPT,
	DEFAULT_STORYTELLER_PROMPT,
} from "../../models/AgentConfig.ts";
import { db } from "../database.ts";

const DEFAULT_PROMPTS: Record<string, string> = {
	storyteller: DEFAULT_STORYTELLER_PROMPT,
	planner: DEFAULT_PLANNER_PROMPT,
	dialogue: DEFAULT_DIALOGUE_PROMPT,
};

export function useAgentConfigs() {
	const agentConfigs = useLiveQuery(() => db.agentConfigs.toArray(), []) ?? [];

	const addAgentConfig = async (config: Omit<StoredAgentConfig, "id">) => {
		return db.agentConfigs.add(config);
	};

	const updateAgentConfig = async (
		id: number,
		updates: Partial<StoredAgentConfig>,
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
				await db.agentConfigs.add({
					type,
					prompt: DEFAULT_PROMPTS[type] ?? "",
				});
			}
		});
	}, [config, type]);

	return config;
}
