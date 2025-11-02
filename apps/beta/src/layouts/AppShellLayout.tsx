import { AppShell, Burger, Group } from "@mantine/core";
import Sidebar from "../components/partials/sidebar";
import { useDisclosure } from "@mantine/hooks";
import Header from "../components/partials/Header.tsx";
import { Outlet, useLocation } from "react-router";
import Options from "../components/partials/sidebar/Options.tsx";
import Status from "../components/partials/sidebar/Status.tsx";

export default function AppShellLayout() {
	const [opened, { toggle }] = useDisclosure();
	const location = useLocation();

	const isOptions = location.pathname.startsWith("/options");

	const sidebar = isOptions ? <Options /> : <Status />;

	return (
		<AppShell
			navbar={{ width: 256, breakpoint: "sm", collapsed: { mobile: !opened } }}
			padding="md"
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
			<AppShell.Main pb="xl">
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
