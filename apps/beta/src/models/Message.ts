export default interface Message {
	id?: number;
	role: "user" | "assistant" | "system";
	content: string;

	sentAt: Date;
	editedAt?: Date;
	rerolledAt?: Date;
	rerollCount?: number;

	locationId?: number;
}
