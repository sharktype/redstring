import type { ProfileState } from "../../../models/PlayerState";

export const PROFILE_EXPRESSIONS: Record<ProfileState, string> = {
	neutral: "normal (expression), neutral (emotion)",
	winded: "exhausted (expression), out of breath (emotion)",
	injured: "injured (expression), in pain, bruised, bloodied",
	horny: "horny (expression), aroused, blushing, lewd",
	ahegao: "ahegao (expression), horny, lewd, tongue out, rolled eyes, blushing",
	cumFacial: "cum on face, bukkake, facial",
	cumInMouth: "cum pool in mouth",
	cumEverywhere: "cum on face, cum pool in mouth, cum in hair, excessive cum",
};
