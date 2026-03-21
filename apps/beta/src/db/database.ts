import Dexie, { type Table } from "dexie";
import type { StoredProviderConfig } from "../models/ProviderConfig.ts";
import type { StoredAgentConfig } from "../models/AgentConfig.ts";

class Database extends Dexie {
	providerConfigs!: Table<StoredProviderConfig>;
	agentConfigs!: Table<StoredAgentConfig>;

	constructor() {
		super("staircase-db");
		this.version(1).stores({
			providerConfigs: "++id, type, name, apiKey, model",
			agentConfigs: "++id, type, providerConfigId, prompt, parameters",
		});
	}
}

export const db = new Database();
