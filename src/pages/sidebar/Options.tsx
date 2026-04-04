import { Box, Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FiKey } from "react-icons/fi";
import { FaMap } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useMessages } from "../../db/hooks/useMessages.ts";

export default function Options() {
	const [resetOpened, { open: openResetMessages, close: closeResetMessages }] =
		useDisclosure(false);
	const { clearMessages } = useMessages();

	const handleResetMessages = async () => {
		await clearMessages();
		closeResetMessages();
	};

	return (
		<Box my="lg" h="90vh" style={{ overflowY: "auto" }}>
			<Title order={2} mb="lg">
				Options
			</Title>
			<Stack gap="xl">
				<Box>
					<Title order={4} mb="md">
						LLM(s)
					</Title>
					<Stack gap="xs">
						<OptionsItem
							label="Providers"
							href="/options/providers"
							icon={<FiKey />}
						/>
						<OptionsItem
							label="Agents"
							href="/options/agents"
							icon={<FaMap />}
						/>
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						World
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Map" href="/options/map" icon={<GiWorld />} />
						<OptionsItem label="Items" icon={<GiWorld />} />
						<OptionsItem label="Characters" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Gameplay
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Modules" icon={<GiWorld />} />
						<OptionsItem label="Feature Flags" icon={<GiWorld />} />
						<OptionsItem label="Chargen" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Import/Export
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Import Options" icon={<GiWorld />} />
						<OptionsItem label="Import Game" icon={<GiWorld />} />
						<OptionsItem label="Export Options" icon={<GiWorld />} />
						<OptionsItem label="Export Game" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Danger Zone
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Reset Options" icon={<GiWorld />} isDanger />
						<OptionsItem
							label="Reset Messages"
							onClick={openResetMessages}
							icon={<GiWorld />}
							isDanger
						/>
					</Stack>
					<Modal
						opened={resetOpened}
						onClose={closeResetMessages}
						title="Reset Messages"
						centered
					>
						<Text mb="lg">
							Are you sure you want to reset all messages? This cannot be
							undone.
						</Text>
						<Group justify="flex-end">
							<Button variant="default" onClick={closeResetMessages}>
								No
							</Button>
							<Button color="red" onClick={handleResetMessages}>
								Yes
							</Button>
						</Group>
					</Modal>
				</Box>
			</Stack>
		</Box>
	);
}

function OptionsItem(props: {
	label: string;
	icon: ReactNode;
	href?: string;
	onClick?: () => void;
	isDanger?: boolean;
}) {
	const navigate = useNavigate();

	const isDisabled = !props.href && !props.onClick;

	return (
		<Button
			variant={props.isDanger ? "subtle" : "default"}
			color={props.isDanger ? "red" : undefined}
			size="xs"
			leftSection={props.icon}
			justify="flex-start"
			onClick={() => {
				if (props.href) {
					navigate(props.href);
				} else if (props.onClick) {
					props.onClick();
				}
			}}
			disabled={isDisabled}
			style={{ cursor: isDisabled ? "not-allowed" : undefined }}
		>
			{props.label}
		</Button>
	);
}
