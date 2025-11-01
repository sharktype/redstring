import { useLocation, useNavigate } from "react-router";
import { ActionIcon, Box, Flex, Group, Text } from "@mantine/core";
import { CgOptions } from "react-icons/cg";
import { IoMdArrowBack } from "react-icons/io";

export default function Header(props: { isShownOnMobile?: boolean }) {
	const navigate = useNavigate();
	const location = useLocation();

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
					<b>❤️ྀི redstring</b>
				</Text>
				<Text size="xs">by sharktype</Text>
			</Box>
			<Group gap="xs">
				<ActionIcon
					variant="default"
					onClick={() => {
						navigate(isOptions ? "/" : "/options");
					}}
					mr="xs"
				>
					{isOptions ? <IoMdArrowBack /> : <CgOptions />}
				</ActionIcon>
			</Group>
		</Flex>
	);
}
