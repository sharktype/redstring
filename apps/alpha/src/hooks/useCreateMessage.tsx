import type MessageData from "../models/Message";
import { useCallback } from "react";

export default function useCreateMessage() {
  return useCallback((messages: MessageData[]) => {
    return createMessage(messages);
  }, []);
}

function createMessage(messages: MessageData[]): MessageData[] {
  // More transient.

  const stats = localStorage.getItem("stats") || "";
  const memory = localStorage.getItem("memory") || "";

  // More permanent.

  const instructions = localStorage.getItem("instructions") || "";

  // RNG is a random number from 0 to 100 that the LLM might use.

  const rng01 = Math.floor(Math.random() * 101);
  const rng02 = Math.floor(Math.random() * 101);
  const rng03 = Math.floor(Math.random() * 101);
  const rng04 = Math.floor(Math.random() * 101);
  const rng05 = Math.floor(Math.random() * 101);
  const rng06 = Math.floor(Math.random() * 101);
  const rng07 = Math.floor(Math.random() * 101);
  const rng08 = Math.floor(Math.random() * 101);

  const parts = [
    `RNG 1/8\n${rng01}/100.0`,
    `RNG 2/8\n${rng02}/100.0`,
    `RNG 3/8\n${rng03}/100.0`,
    `RNG 4/8\n${rng04}/100.0`,
    `RNG 5/8\n${rng05}/100.0`,
    `RNG 6/8\n${rng06}/100.0`,
    `RNG 7/8\n${rng07}/100.0`,
    `RNG 8/8\n${rng08}/100.0`,
    `INSTRUCTIONS:\n${instructions}`,
    `STATS:\n${stats}`,
    `MEMORY:\n${memory}`,
  ];

  const fullSystemMessage = parts.join("\n\n");

  console.log(`LOG - created debug message with parts of length ${fullSystemMessage.length}`);

  return [
    {
      role: "system",
      content: fullSystemMessage,
    },
    ...messages,
  ];
}
