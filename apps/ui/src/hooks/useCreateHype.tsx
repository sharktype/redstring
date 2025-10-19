import type MessageData from "../models/Message";
import { useCallback } from "react";

export default function useCreateHype() {
  return useCallback((messages: MessageData[]) => {
    return createHype(messages);
  }, []);
}

function createHype(messages: MessageData[]) {
  const flattenedMessages = messages.map((msg) => `${msg.role.toUpperCase()}:\n${msg.content}`).join("\n\n");

  const stats = localStorage.getItem("stats") || "";
  const setting = localStorage.getItem("setting") || "";
  const style = localStorage.getItem("style") || "";
  const rules = localStorage.getItem("rules") || "";

  const parts = [
    `----\nPARTIAL SUPPORTING PROMPT GIVEN TO SEPARATE STORYTELLER LLM:\n----`,
    `STATS:\n${stats}`,
    `SETTING:\n${setting}`,
    `STYLE:\n${style}`,
    `RULES:\n${rules}`,
    `----\nMOST RECENT 50 MESSAGES:\n----\n\n${flattenedMessages}`,
  ];

  const fullMessage = parts.join("\n\n");

  console.log(`LOG - created debug message with parts of length ${fullMessage.length}`);

  return fullMessage;
}
