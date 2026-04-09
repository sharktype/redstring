import { FEMALE, MALE, type GenderIdentity } from "../../models/PlayerState";
import { generateRandomName } from "../names";

export default function generateName(gender?: "male" | "female") {
	const resolvedGender: GenderIdentity | undefined =
		gender === "male" ? MALE : gender === "female" ? FEMALE : undefined;

	return Array.from({ length: 3 }, () => {
		const name = generateRandomName(resolvedGender, undefined, true);

		return {
			givenName: name.givenName,
			surname: name.surname,
			gender: name.gender.identity,
		};
	});
}
