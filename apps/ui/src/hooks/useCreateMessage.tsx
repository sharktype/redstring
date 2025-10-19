import type MessageData from "../models/Message";
import { useCallback } from "react";

export default function useCreateMessage() {
  return useCallback((messages: MessageData[]) => {
    return createMessage(messages);
  }, []);
}

function createMessage(messages: MessageData[]) {
  // More transient.

  const equips = localStorage.getItem("equips") || "";
  const inventory = localStorage.getItem("inventory") || "";
  const stats = localStorage.getItem("stats") || "";
  const memory = localStorage.getItem("memory") || "";

  // More permanent.

  const characters = localStorage.getItem("characters") || "";
  const setting = localStorage.getItem("setting") || "";
  const economy = localStorage.getItem("economy") || "";
  const plot = localStorage.getItem("plot") || "";
  const style = localStorage.getItem("style") || "";
  const rules = localStorage.getItem("rules") || "";

  const flattenedMessages = messages.map((msg) => `${msg.role.toUpperCase()}:\n${msg.content}`).join("\n\n");

  const parts = [
    `CHARACTERS:\n${characters}`,
    `SETTING:\n${setting}`,
    `ECONOMY:\n${economy}`,
    `PLOT:\n${plot}`,
    `RULES:\n${rules}`,
    `STYLE:\n${style}`,
    `EQUIPS:\n${equips}`,
    `INVENTORY:\n${inventory}`,
    `STATS:\n${stats}`,
    `MEMORY:\n${memory}`,
    `----\nMOST RECENT 50 MESSAGES:\n----\n\n${flattenedMessages}`,
  ];

  const fullMessage = parts.join("\n\n");

  console.log(`LOG - created debug message with parts of length ${fullMessage.length}`);

  return fullMessage;
}
