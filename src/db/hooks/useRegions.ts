import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database.ts";
import type { Region } from "../../models/Location.ts";

export function useRegions() {
	const regions = useLiveQuery(() => db.regions.toArray(), []) ?? [];

	const bulkSaveRegions = async (updatedRegions: Region[]) => {
		await db.transaction("rw", db.regions, async () => {
			await db.regions.clear();
			await db.regions.bulkAdd(updatedRegions);
		});
	};

	const saveRegion = async (region: Region) => {
		if (region.id != null) {
			await db.regions.put(region);
		}
	};

	return {
		regions,
		bulkSaveRegions,
		saveRegion,
	};
}
