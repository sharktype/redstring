import Dexie, { type Table } from "dexie";
import type { StoredProviderConfig } from "../models/ProviderConfig.ts";
import type { StoredAgentConfig } from "../models/AgentConfig.ts";
import type Message from "../models/Message.ts";

class Database extends Dexie {
	providerConfigs!: Table<StoredProviderConfig>;
	agentConfigs!: Table<StoredAgentConfig>;
	messages!: Table<Message>;

	constructor() {
		super("staircase-db");
		this.version(1).stores({
			providerConfigs: "++id, type, name, apiKey, model",
			agentConfigs: "++id, type, providerConfigId, prompt, parameters",
			messages:
				"++id, role, content, sentAt, editedAt, rerolledAt, rerollCount",
		});
	}
}

export const db = new Database();
