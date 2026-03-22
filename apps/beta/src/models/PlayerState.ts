import type { Building, Region } from "./Location";

export default interface PlayerState {
	date: {
		day: number;
		month: number;
		year: number;
	};
	time: {
		hour: number;
		minute: number;
	};

	// The location is accessed very frequently but player state is only updated when the player moves. As a result,
	// we should denormalise here even though we store both the location and the total locations in the database.

	location: {
		region: Region;

		/** The building the player is in. If this is null, they are in an exterior cell. */
		building: Building | null;
	};

	move(locationId: number): boolean;
	enter(buildingSlug: string): boolean;
	exit(): boolean;
}

export type StoredPlayerState = Omit<PlayerState, "move" | "enter" | "exit"> & {
	id?: number;
};
