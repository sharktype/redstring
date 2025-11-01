import Dexie, { type Table } from "dexie";
import type ProviderConfig from "../models/ProviderConfig.ts";

class Database extends Dexie {
	providerConfigs!: Table<ProviderConfig>;

	constructor() {
		super("staircase-db");
		this.version(1).stores({
			providerConfigs: "++id, type, name, apiKey, model",
		});
	}
}

export const db = new Database();
