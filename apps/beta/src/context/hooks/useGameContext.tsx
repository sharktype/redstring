import { useContext } from "react";
import { GameContext } from "../GameContext";

export default function useGameContext() {
	const context = useContext(GameContext);

	if (context === undefined) {
		throw new Error("useGameContext must be used within a GameProvider");
	}

	return context;
}
