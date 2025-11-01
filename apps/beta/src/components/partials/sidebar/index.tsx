import type { PropsWithChildren } from "react";
import { AppShell, Flex } from "@mantine/core";
import Header from "../Header.tsx";

export default function Sidebar(props: PropsWithChildren) {
	return (
		<AppShell.Navbar p="md" style={{ overflowY: "hidden" }}>
			<Flex>
				<Header />
			</Flex>
			<Flex direction="column" mt="xl" flex={1}>
				{props.children}
			</Flex>
		</AppShell.Navbar>
	);
}
