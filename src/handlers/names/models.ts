import type { GenderIdentity } from "../../models/PlayerState";

export interface Name {
	givenName: string;
	surname: string;
	gender: GenderIdentity;
}
