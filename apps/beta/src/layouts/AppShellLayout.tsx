import { AppShell, Burger, Group, useMantineColorScheme } from "@mantine/core";
import Sidebar from "../components/partials/sidebar";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/partials/Header.tsx";
import { Outlet, useLocation } from "react-router";
import Options from "../components/partials/sidebar/Options.tsx";
import Status from "../components/partials/sidebar/Status.tsx";

export default function AppShellLayout() {
	const [opened, { toggle }] = useDisclosure();
	const { colorScheme } = useMantineColorScheme();

	const location = useLocation();
	const isOptions = location.pathname.startsWith("/options");

	const isDarkMode = colorScheme === "dark";
	const backgroundColor = isDarkMode
		? "var(--mantine-color-dark-8)"
		: "var(--mantine-color-gray-1)";

	const sidebar = isOptions ? <Options /> : <Status />;

	return (
		<AppShell
			navbar={{ width: 288, breakpoint: "sm", collapsed: { mobile: !opened } }}
		>
			<Group p="md" hiddenFrom="sm">
				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom="sm"
					size="sm"
					style={{ zIndex: 102 }}
				/>
				<Header isShownOnMobile />
			</Group>
			<Sidebar>{sidebar}</Sidebar>
			<AppShell.Main bg={backgroundColor}>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
