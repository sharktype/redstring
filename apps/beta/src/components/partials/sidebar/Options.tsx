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
						<OptionsItem label="Lorebooks" icon={<GiWorld />} />
						<OptionsItem label="Economy" icon={<GiWorld />} />
						<OptionsItem label="Items" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Storyline
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Characters" icon={<GiWorld />} />
						<OptionsItem label="Questlines" icon={<GiWorld />} />
						<OptionsItem label="Timeline" icon={<GiWorld />} />
						<OptionsItem label="Entities" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Style
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Rules" icon={<GiWorld />} />
					</Stack>
				</Box>
				<Box>
					<Title order={4} mb="md">
						Import/Export
					</Title>
					<Stack gap="xs">
						<OptionsItem label="Import Options" icon={<GiWorld />} />
						<OptionsItem label="Import Messages" icon={<GiWorld />} />
						<OptionsItem label="Export Options" icon={<GiWorld />} />
						<OptionsItem label="Export Messages" icon={<GiWorld />} />
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
		<Box>
			<Button
				variant={props.isDanger ? "subtle" : "default"}
				color={props.isDanger ? "red" : undefined}
				size="xs"
				leftSection={props.icon}
				onClick={() => props.href && navigate(props.href)}
				disabled={!props.href}
				style={{ cursor: props.href ? undefined : "not-allowed" }}
			>
				{props.label}
			</Button>
		</Box>
	);
}
