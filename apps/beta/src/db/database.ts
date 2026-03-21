import Dexie, { type Table } from "dexie";
import type ProviderConfig from "../models/ProviderConfig.ts";
import type AgentConfig from "../models/AgentConfig.ts";

class Database extends Dexie {
	providerConfigs!: Table<ProviderConfig>;
	agentConfigs!: Table<AgentConfig>;

	constructor() {
		super("staircase-db");
		this.version(1).stores({
			providerConfigs: "++id, type, name, apiKey, model",
			agentConfigs: "++id, type, providerConfigId, prompt, parameters",
		});
	}
}

export const db = new Database();
