import { useState } from "react";

export default function Spoiler({ children }: { children: React.ReactNode }) {
	const [revealed, setRevealed] = useState(false);

	return (
		<span
			role="button"
			tabIndex={0}
			onClick={() => setRevealed((r) => !r)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") setRevealed((r) => !r);
			}}
			style={{
				backgroundColor: revealed
					? "var(--mantine-color-dark-5)"
					: "var(--mantine-color-dark-4)",
				color: revealed ? "inherit" : "transparent",
				borderRadius: 4,
				padding: "0 4px",
				cursor: "pointer",
				userSelect: revealed ? "auto" : "none",
				transition: "color 0.2s, background-color 0.2s",
			}}
		>
			{children}
		</span>
	);
}
