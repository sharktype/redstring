import type MessageData from "../models/Message";
import { useCallback } from "react";

export default function useCreateHype() {
  return useCallback((messages: MessageData[], mostRecentHype: string) => {
    return createHype(messages, mostRecentHype);
  }, []);
}

function createHype(messages: MessageData[], mostRecentHype: string) {
  const limitedMessages = messages.slice(-3);
  const flattenedMessages = limitedMessages.map((msg) => `${msg.role.toUpperCase()}:\n${msg.content}`).join("\n\n");

  const stats = localStorage.getItem("stats") || "";
  const setting = localStorage.getItem("setting") || "";
  const style = localStorage.getItem("style") || "";
  const rules = localStorage.getItem("rules") || "";

  const parts = [
    `----\nYOUR MOST RECENT HYPE OUTPUT WAS:\n----\n\n${mostRecentHype}`,
    `----\nPARTIAL SUPPORTING PROMPT GIVEN TO SEPARATE STORYTELLER LLM:\n----`,
    `STATS:\n${stats}`,
    `SETTING:\n${setting}`,
    `STYLE:\n${style}`,
    `RULES:\n${rules}`,
    `----\nMOST RECENT 3 MESSAGES:\n----\n\n${flattenedMessages}`,
  ];

  const fullMessage = parts.join("\n\n");

  console.log(`LOG - created debug message with parts of length ${fullMessage.length}`);

  return fullMessage;
}
