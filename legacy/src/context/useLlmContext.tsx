import { useContext } from "react";
import LlmContext from "./LlmContext";

export default function useLlmContext() {
	const context = useContext(LlmContext);

	if (!LlmContext) {
		throw new Error("useLlmContext must be used within a LlmProvider");
	}

	return context;
}
