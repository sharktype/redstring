import type Tier from "./Tier";

export interface Region {
	id?: number;

	name: string;
	description: string;

	buildings: Record<string, Building>;

	position: {
		// x and y are in metres.

		x: number;
		y: number;
	};
	connectedRegionIds: number[];
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
