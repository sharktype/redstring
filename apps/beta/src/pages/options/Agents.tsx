// Types of LLMs for this engine:

// Final LLMs to add to this:

// - Worldbuilding generator LLM - standalone and optional LLM to generate worldbuilding content.
//   - Called manually via UI.
// - Character generator LLM - as above but with characters.
//   - Called manually via UI.

import { useState } from "react";
import {
	ActionIcon,
	Alert,
	Anchor,
	Container,
	Group,
	NumberInput,
	Select,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { CgInfo } from "react-icons/cg";
import { AiFillWarning } from "react-icons/ai";
import { BiEdit, BiSave } from "react-icons/bi";
import { useNavigate } from "react-router";
import { useProviderConfigs } from "../../db/hooks/useProviderConfigs.ts";
import {
	useAgentConfigs,
	useAgentConfig,
} from "../../db/hooks/useAgentConfigs.ts";
import type AgentConfig from "../../models/AgentConfig.ts";

export default function Agents() {
	const navigate = useNavigate();

	const storyteller = useAgentConfig("storyteller");
	const summarizer = useAgentConfig("summarizer");
	const hypebot = useAgentConfig("hypebot");

	const providersLink = (
		<Anchor onClick={() => navigate("/options/providers")}>Providers</Anchor>
	);

	return (
		<Container>
			<Title mb="md">Agents</Title>
			<Alert title="Set your agent configs" icon={<CgInfo />} pb="lg" mb="xl">
				<Stack>
					<Text>
						LLM agent mappings determine which configurations are used for which
						purposes.
					</Text>
					<Text>
						Configure LLM provider keys in the {providersLink} page first, and
						make sure to test them before coming here!
					</Text>
				</Stack>
			</Alert>
			<Stack gap="xl">
				<AgentInput
					agentConfig={storyteller}
					description={
						<>
							<Text>
								This LLM does the bulk of the storytelling and is called every
								single message with full context.
							</Text>
							<Text>
								It is strongly recommended to use as powerful of an LLM as
								budget allows for this agent.
							</Text>
						</>
					}
				/>
				<AgentInput
					agentConfig={summarizer}
					description={
						<>
							<Text>This agent summarises M messages every N messages.</Text>
							<Text>
								You should set N &gt;= M; anything else is done at your own
								risk.
							</Text>
							<Text>
								The quality of summaries greatly affects the storytelling LLM's
								ability to maintain context over long stories.
							</Text>
							<Text>
								It is recommended to use as capable of an LLM as budget allows
								for this agent.
							</Text>
						</>
					}
					additionalParams={
						<>
							<NumberInput label="N" defaultValue={48} miw="64px" maw="128px" />
							<NumberInput label="M" defaultValue={24} miw="64px" maw="128px" />
						</>
					}
				/>
				<AgentInput
					agentConfig={hypebot}
					description={
						<>
							<Text>
								Hypebot is just a fun extra bot, but it makes a call every
								message.
							</Text>
							<Text>The storyteller never sees Hypebot's output.</Text>
							<Text>
								It is recommended to use a cheap and fast LLM for this agent.
							</Text>
						</>
					}
				/>
			</Stack>
		</Container>
	);
}

interface AgentInputProps {
	agentConfig?: AgentConfig;
	description: React.ReactNode;
	additionalParams?: React.ReactNode;
}

function AgentInput({
	agentConfig,
	description,
	additionalParams,
}: AgentInputProps) {
	const [isSaving, setIsSaving] = useState(false);

	const { providerConfigs } = useProviderConfigs();
	const providerOptions = providerConfigs.map((config) => ({
		value: config.id?.toString() ?? "",
		label: config.name,
	}));

	const [selectedProvider, setSelectedProvider] = useState<string | null>(
		agentConfig?.providerConfigId?.toString() ?? null,
	);

	const { updateAgentConfig } = useAgentConfigs();

	const handleSave = () => {
		setIsSaving(true);
		if (agentConfig?.id) {
			updateAgentConfig(agentConfig.id, {
				providerConfigId: selectedProvider
					? parseInt(selectedProvider)
					: undefined,
			}).then(() => {
				setIsSaving(false);
			});
		}
	};

	const label =
		(agentConfig?.type.charAt(0).toUpperCase() ?? "") +
		(agentConfig?.type.slice(1) ?? "");

	return (
		<Stack gap="sm">
			<Alert color="green" icon={<AiFillWarning />} mb="md">
				<Stack gap="xs">{description}</Stack>
			</Alert>
			<Group>
				<Select
					label={label}
					data={providerOptions}
					value={selectedProvider}
					onChange={setSelectedProvider}
					flex={1}
					disabled={isSaving}
					clearable
					searchable
				/>
				{additionalParams}
				<Group gap="xs" mt="lg" pt={2}>
					<ActionIcon
						variant="outline"
						size="sm"
						color="green"
						onClick={handleSave}
						disabled={isSaving}
						loading={isSaving}
					>
						<BiSave />
					</ActionIcon>
					<ActionIcon variant="outline" size="sm" disabled={isSaving}>
						<BiEdit />
					</ActionIcon>
				</Group>
			</Group>
		</Stack>
	);
}
