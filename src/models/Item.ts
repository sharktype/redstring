import type Tier from "./Tier";

export default interface Item {
	name: string;

	// TODO: Set enum for categories for items.

	category: string;
	tier: Tier;

	/** The category, tier, and this value is used to determine the general value of the item. */
	valueMultiplier: number;

	description: string;

	isConsumable?: boolean;
	isDescriptionSecret?: boolean;
	isQuestItem?: boolean;
}
