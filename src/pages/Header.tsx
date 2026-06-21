import {
	ActionIcon,
	Box,
	Flex,
	Group,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import { BiHome } from "react-icons/bi";
import { CgDarkMode, CgOptions } from "react-icons/cg";
import { MdOutlineLightMode } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";

export default function Header(props: { isShownOnMobile?: boolean }) {
	const navigate = useNavigate();
	const location = useLocation();

	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	const isOptions = location.pathname.startsWith("/options");

	return (
		<Flex
			direction="row"
			align="center"
			visibleFrom={props.isShownOnMobile ? undefined : "sm"}
			flex={1}
		>
			<Box flex={1}>
				<Text>
					<b>staircase</b>
				</Text>
				<Text size="xs">by sharktype</Text>
			</Box>
			<Group gap="xs">
				<ActionIcon variant="default" onClick={() => toggleColorScheme()}>
					{colorScheme === "dark" ? <CgDarkMode /> : <MdOutlineLightMode />}
				</ActionIcon>
				<ActionIcon
					variant="default"
					onClick={() => {
						navigate(isOptions ? "/" : "/options");
					}}
					mr="xs"
				>
					{isOptions ? <BiHome /> : <CgOptions />}
				</ActionIcon>
			</Group>
		</Flex>
	);
}
