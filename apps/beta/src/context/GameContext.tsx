import { createContext } from "react";

interface GameContextType {}

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);
