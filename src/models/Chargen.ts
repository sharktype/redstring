// TODO: De-hardcode character generation.

export const STEPS = ["name", "extraStats", "datetime", "location"] as const;

export type Step = (typeof STEPS)[number];
