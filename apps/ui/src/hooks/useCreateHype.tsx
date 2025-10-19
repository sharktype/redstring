import type MessageData from "../models/Message";
import { useCallback } from "react";

export default function useCreateHype() {
  return useCallback((messages: MessageData[]) => {
    return createHype(messages);
  }, []);
}

function createHype(messages: MessageData[]) {
  const flattenedMessages = messages.map((msg) => `${msg.role.toUpperCase()}:\n${msg.content}`).join("\n\n");

  const fullMessage = `----\nMOST RECENT 50 MESSAGES:\n----\n\n${flattenedMessages}`;

  console.log(`LOG - created debug message with parts of length ${fullMessage.length}`);

  return fullMessage;
}
