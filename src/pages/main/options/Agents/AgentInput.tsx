import { ActionIcon, Alert, Group, Select, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	memo,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiEdit, BiPlay, BiSave } from "react-icons/bi";
import useGameContext from "../../../../context/hooks/useGameContext.tsx";
import { useAgentConfigs } from "../../../../db/hooks/useAgentConfigs.ts";
import {
	DEFAULT_DIALOGUE_PROMPT,
	DEFAULT_PLANNER_PROMPT,
	DEFAULT_STORYTELLER_PROMPT,
	type StoredAgentConfig,
} from "../../../../models/AgentConfig.ts";
import AgentEditModal from "./AgentEditModal.tsx";

const DEFAULT_PROMPTS: Record<string, string> = {
	storyteller: DEFAULT_STORYTELLER_PROMPT,
	planner: DEFAULT_PLANNER_PROMPT,
	dialogue: DEFAULT_DIALOGUE_PROMPT,
};

export interface AgentInputHandle {
	save: () => Promise<void>;
}

interface AgentInputProps {
	agentConfig?: StoredAgentConfig;
	description: React.ReactNode;
	onDirtyChange?: (dirty: boolean) => void;
	ref?: Ref<AgentInputHandle>;
}

function AgentInput({
	agentConfig,
	description,
	onDirtyChange,
	ref,
}: AgentInputProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [isTesting, setIsTesting] = useState(false);

	// PROMPT

	const [isPromptEditOpened, { open: openPromptEdit, close: closePromptEdit }] =
		useDisclosure(false);

	const defaultPrompt = DEFAULT_PROMPTS[agentConfig?.type ?? ""] ?? "";

	const savedPrompt = agentConfig?.prompt ?? defaultPrompt;
	const [prompt, setPrompt] = useState(savedPrompt);

	useEffect(() => {
		setPrompt(savedPrompt);
	}, [savedPrompt]);

	// PROVIDER

	const { providerConfigs, agentConfigs } = useGameContext();
	const providerOptions = providerConfigs.map((config) => ({
		value: config.id?.toString() ?? "",
		label: config.name,
	}));

	const savedProvider = agentConfig?.providerConfigId?.toString() ?? null;
	const [selectedProvider, setSelectedProvider] = useState<string | null>(
		savedProvider,
	);

	useEffect(() => {
		setSelectedProvider(savedProvider);
	}, [savedProvider]);

	// DIRTY CHECK

	const isProviderDirty = selectedProvider !== savedProvider;
	const isPromptDirty = prompt !== savedPrompt;
	const isDirty = isProviderDirty || isPromptDirty;

	useEffect(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);

	// SAVE HANDLER

	const { updateAgentConfig } = useAgentConfigs();

	const handleSave = useCallback(async () => {
		setIsSaving(true);

		if (!agentConfig?.id) {
			alert("Agent config not found. Please refresh the page and try again.");
			setIsSaving(false);

			return Promise.resolve();
		}

		await updateAgentConfig(agentConfig.id, {
			providerConfigId: selectedProvider
				? parseInt(selectedProvider)
				: undefined,
			prompt,
		});

		setIsSaving(false);
	}, [agentConfig?.id, prompt, selectedProvider, updateAgentConfig]);

	useImperativeHandle(ref, () => ({ save: handleSave }), [handleSave]);

	const savedAgentConfig = agentConfigs.find(
		(config) => config.id === agentConfig?.id,
	);

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
					label={
						<span
							style={
								isDirty ? { color: "var(--mantine-color-red-6)" } : undefined
							}
						>
							{label} {isDirty ? "*" : ""}
						</span>
					}
					data={providerOptions}
					value={selectedProvider}
					onChange={setSelectedProvider}
					flex={1}
					disabled={isSaving || providerOptions.length === 0}
					placeholder={
						providerOptions.length === 0
							? "No providers configured. Please configure them in the Providers form."
							: "Please select a provider configuration for this agent."
					}
					clearable
					searchable
				/>
				<Group gap={6} mt="lg" pt={2}>
					<ActionIcon
						variant="outline"
						size="sm"
						color="green"
						onClick={handleSave}
						disabled={!isDirty || isSaving || isTesting}
						loading={isSaving || isTesting}
					>
						<BiSave />
					</ActionIcon>
					<ActionIcon
						variant="outline"
						size="sm"
						onClick={openPromptEdit}
						disabled={isSaving || isTesting}
						loading={isSaving || isTesting}
					>
						<BiEdit />
					</ActionIcon>
					<ActionIcon
						variant="outline"
						size="sm"
						color="yellow"
						onClick={async () => {
							setIsTesting(true);

							if (!savedAgentConfig) {
								alert(
									"Agent config not found. Please save the agent before testing.",
								);
								setIsTesting(false);

								return;
							}

							const result = await savedAgentConfig.test();
							if (result) {
								alert(`Agent test successful! LLM said:\n\n${result}`);
							} else {
								alert(
									"Agent test failed. Please check your agent and provider configurations.",
								);
							}

							setIsTesting(false);
						}}
						disabled={
							isDirty ||
							isTesting ||
							isSaving ||
							!savedAgentConfig?.providerConfigId
						}
						loading={isTesting}
					>
						<BiPlay />
					</ActionIcon>
				</Group>
			</Group>
			<AgentEditModal
				title={label}
				value={prompt}
				opened={isPromptEditOpened}
				onClose={closePromptEdit}
				defaultPrompt={defaultPrompt}
				setPrompt={setPrompt}
			/>
		</Stack>
	);
}

export default memo(AgentInput);
