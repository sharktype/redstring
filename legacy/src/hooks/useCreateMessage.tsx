import type MessageData from "../models/Message";
import { useCallback } from "react";

export default function useCreateMessage() {
  return useCallback((messages: MessageData[]) => {
    return createMessage(messages);
  }, []);
}

function createMessage(messages: MessageData[]): MessageData[] {
  const stats = localStorage.getItem("stats") || "";
  const memory = localStorage.getItem("memory") || "";
  const instructions = localStorage.getItem("instructions") || "";

  const parts = [`INSTRUCTIONS:\n${instructions}`, `STATS:\n${stats}`, `MEMORY:\n${memory}`];

  return [
    {
      role: "system",
      content: parts.join("\n\n"),
    },
    ...messages,
  ];
}
