import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database.ts";
import type Message from "../../models/Message.ts";

export function useMessages() {
	const messages =
		useLiveQuery(() => db.messages.orderBy("sentAt").toArray(), []) ?? [];

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
		addMessage,
		updateMessage,
		deleteMessage,
		clearMessages,
	};
}
