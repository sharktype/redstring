import type { HTMLAttributes, PropsWithChildren } from "react";
import type { ToolCallProps } from "./pages/main/game/Messages/MessageBox/ToolCall";

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			spoiler: PropsWithChildren & HTMLAttributes<HTMLElement>;
			toolcall: ToolCallProps & HTMLAttributes<HTMLElement>;
		}
	}
}
