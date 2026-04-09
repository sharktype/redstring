import type Tier from "./Tier";

export type ConnectionSafety =
	| "safe"
	| "cautious"
	| "dangerous"
	| "perilous"
	| "lethal";

export const CONNECTION_SAFETY_LEVELS: ConnectionSafety[] = [
	"safe",
	"cautious",
	"dangerous",
	"perilous",
	"lethal",
];

export interface Region {
	id?: number;

	// Dungeons and complex interiors are an upcoming feature. For now, to mark them as places that can be visited
	// that might have buildings, we add them as an option of type here.

	position: {
		// x and y are in metres but get multiplied by whatever is in the game state's scale variable.

		x: number;
		y: number;
	};

	name: string;
	type:
		| "city"
		| "town"
		| "village"
		| "watchtower"
		| "dungeon"
		| "landmark"
		| "crossroads"
		| "castle"
		| "other";
	description: string;

	buildings: Record<string, Building>;

	connectedRegionIds: number[];
	connectionSafety?: Record<number, ConnectionSafety>;
}

// A shop is just an example of a building for now.

export interface Shop extends Building {
	tier: Tier;
}

export interface Building {
	slug: string;

	name: string;
	description: string;
}
