import { Box, Button, Stack, Title } from "@mantine/core";
import { FiKey } from "react-icons/fi";
import { FaMap } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

export default function Options() {
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
						<OptionsItem label="Locations" icon={<GiWorld />} />
						<OptionsItem label="Items" icon={<GiWorld />} />
						<OptionsItem label="Characters" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Gameplay
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Rules" icon={<GiWorld />} />
						<OptionsItem label="Reinforcement" icon={<GiWorld />} />
						<OptionsItem label="Modules" icon={<GiWorld />} />
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
						<OptionsItem label="Reset Messages" icon={<GiWorld />} isDanger />
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
}

function OptionsItem(props: {
	label: string;
	icon: ReactNode;
	href?: string;
	isDanger?: boolean;
}) {
	const navigate = useNavigate();
	return (
		<Button
			variant={props.isDanger ? "subtle" : "default"}
			color={props.isDanger ? "red" : undefined}
			size="xs"
			leftSection={props.icon}
			justify="flex-start"
			onClick={() => props.href && navigate(props.href)}
			disabled={!props.href}
			style={{ cursor: props.href ? undefined : "not-allowed" }}
		>
			{props.label}
		</Button>
	);
}
