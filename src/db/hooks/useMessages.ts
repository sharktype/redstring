import { useLiveQuery } from "dexie-react-hooks";
import type Message from "../../models/Message.ts";
import { db } from "../database.ts";

export function useMessages() {
	const rawMessages = useLiveQuery(
		() => db.messages.orderBy("sentAt").toArray(),
		[],
	);

	const isLoading = rawMessages === undefined;
	const messages = rawMessages ?? [];

	const addMessage = async (message: Omit<Message, "id">) => {
		return db.messages.add(message);
	};

	const updateMessage = async (id: number, updates: Partial<Message>) => {
		return db.messages.update(id, updates);
	};

	const deleteMessage = async (id: number) => {
		return db.messages.delete(id);
	};

	const clearMessages = async () => {
		return db.messages.clear();
	};

	return {
		messages,
		isLoading,
		addMessage,
		updateMessage,
		deleteMessage,
		clearMessages,
	};
}
