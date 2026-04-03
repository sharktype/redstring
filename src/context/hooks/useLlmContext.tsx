import { useContext } from "react";
import { LlmContext } from "../LlmContext/index.ts";

export default function useLlmContext() {
	const context = useContext(LlmContext);

	if (context === undefined) {
		throw new Error("useLlmContext must be used within a LlmProvider");
	}

	return context;
}
