import type { HTMLAttributes } from "react";
import type { ToolCallProps } from "./pages/main/game/Messages/MessageBox/ToolCall";

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			toolcall: ToolCallProps & HTMLAttributes<HTMLElement>;
		}
	}
}
