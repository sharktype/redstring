export default interface Message {
	role: "user" | "assistant" | "system";
	content: string;

	sentAt: Date;
	editedAt?: Date;
	rerolledAt?: Date;

	rerollCount?: number;
}
