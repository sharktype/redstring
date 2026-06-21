import Dexie, { type Table } from "dexie";
import type { StoredAgentConfig } from "../models/AgentConfig.ts";
import type { StoredGameState } from "../models/GameState.ts";
import type Message from "../models/Message.ts";
import type { StoredPlayerState } from "../models/PlayerState.ts";
import type { StoredProviderConfig } from "../models/ProviderConfig.ts";

class Database extends Dexie {
	providerConfigs!: Table<StoredProviderConfig>;
	agentConfigs!: Table<StoredAgentConfig>;
	messages!: Table<Message>;
	playerState!: Table<StoredPlayerState>;
	gameState!: Table<StoredGameState>;

	constructor() {
		super("staircase-db");
		this.version(1).stores({
			providerConfigs: "++id",
			agentConfigs: "++id, type",
			messages: "++id, sentAt",
			playerState: "++id",
			gameState: "++id",
		});
	}
}

export const db = new Database();
