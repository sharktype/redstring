const Tier = {
	Common: "common",
	Uncommon: "uncommon",
	Rare: "rare",
	Epic: "epic",
	Legendary: "legendary",
} as const;

type Tier = (typeof Tier)[keyof typeof Tier];

export default Tier;
