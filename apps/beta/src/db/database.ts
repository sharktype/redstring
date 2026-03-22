import Dexie, { type Table } from "dexie";
import type { StoredProviderConfig } from "../models/ProviderConfig.ts";
import type { StoredAgentConfig } from "../models/AgentConfig.ts";
import type Message from "../models/Message.ts";
import type { StoredPlayerState } from "../models/PlayerState.ts";

class Database extends Dexie {
	providerConfigs!: Table<StoredProviderConfig>;
	agentConfigs!: Table<StoredAgentConfig>;
	messages!: Table<Message>;
	playerState!: Table<StoredPlayerState>;

	constructor() {
		super("staircase-db");
		this.version(1).stores({
			providerConfigs: "++id, type, name, apiKey, model",
			agentConfigs: "++id, type, providerConfigId, prompt, parameters",
			messages:
				"++id, role, content, sentAt, editedAt, rerolledAt, rerollCount, locationId",
			playerState: "++id, date, time, location",
		});
	}
}

export const db = new Database();
