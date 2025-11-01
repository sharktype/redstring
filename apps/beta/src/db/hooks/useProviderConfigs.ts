import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";

export function useProviderConfigs() {
	const providerConfigs =
		useLiveQuery(() => db.providerConfigs.toArray(), []) ?? [];

	const addProviderConfig = async (config: Omit<ProviderConfig, "id">) => {
		return db.providerConfigs.add(config);
	};

	const updateProviderConfig = async (
		id: number,
		updates: Partial<ProviderConfig>,
	) => {
		return db.providerConfigs.update(id, updates);
	};

	const deleteProviderConfig = async (id: number) => {
		return db.providerConfigs.delete(id);
	};

	return {
		providerConfigs,
		addProviderConfig,
		updateProviderConfig,
		deleteProviderConfig,
	};
}

export function useProviderConfig(id?: number) {
	return useLiveQuery(
		() => (id !== undefined ? db.providerConfigs.get(id) : undefined),
		[id],
	);
}
