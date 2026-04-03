import { useEffect, useState } from "react";
import {
	ActionIcon,
	Alert,
	Group,
	NumberInput,
	Select,
	Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AiFillWarning } from "react-icons/ai";
import { BiEdit, BiPlay, BiSave } from "react-icons/bi";
import useGameContext from "../../../context/hooks/useGameContext.tsx";
import { useAgentConfigs } from "../../../db/hooks/useAgentConfigs.ts";
import type { StoredAgentConfig } from "../../../models/AgentConfig.ts";
import {
	DEFAULT_STORYTELLER_PROMPT,
	DEFAULT_SUMMARIZER_PROMPT,
} from "../../../models/AgentConfig.ts";
import AgentEditModal from "./AgentEditModal.tsx";

const DEFAULT_PROMPTS: Record<string, string> = {
	storyteller: DEFAULT_STORYTELLER_PROMPT,
	summarizer: DEFAULT_SUMMARIZER_PROMPT,
};

interface AgentInputProps {
	agentConfig?: StoredAgentConfig;
	description: React.ReactNode;
	numericalFields?: Record<string, number>;
}

export default function AgentInput({
	agentConfig,
	description,
	numericalFields,
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

	// NUMERICAL PARAMETERS

	const savedNumerical = agentConfig?.parameters?.numerical ?? {};
	const [numericalParameters, setNumericalParameters] = useState<
		Record<string, number>
	>(() => {
		if (!numericalFields) {
			return {};
		}

		return Object.fromEntries(
			Object.entries(numericalFields).map(([k, defaultVal]) => [
				k,
				savedNumerical[k]?.value ?? defaultVal,
			]),
		);
	});

	useEffect(() => {
		if (numericalFields) {
			const numerical = agentConfig?.parameters?.numerical ?? {};
			setNumericalParameters(
				Object.fromEntries(
					Object.entries(numericalFields).map(([k, defaultVal]) => [
						k,
						numerical[k]?.value ?? defaultVal,
					]),
				),
			);
		}
	}, [agentConfig?.parameters?.numerical, numericalFields]);

	// DIRTY CHECK

	const isProviderDirty = selectedProvider !== savedProvider;
	const isNumericalDirty = Object.entries(numericalParameters).some(
		([key, value]) =>
			value !== (savedNumerical[key]?.value ?? numericalFields?.[key]),
	);
	const isPromptDirty = prompt !== savedPrompt;
	const isDirty = isProviderDirty || isNumericalDirty || isPromptDirty;

	// SAVE HANDLER

	const { updateAgentConfig } = useAgentConfigs();

	const handleSave = () => {
		setIsSaving(true);

		if (!agentConfig?.id) {
			alert("Agent config not found. Please refresh the page and try again.");
			setIsSaving(false);

			return;
		}

		const updatedNumerical: Record<string, { value: number; default: number }> =
			{};
		Object.entries(numericalParameters).forEach(([key, value]) => {
			updatedNumerical[key] = {
				value,
				default: numericalFields?.[key] ?? value,
			};
		});

		updateAgentConfig(agentConfig.id, {
			providerConfigId: selectedProvider
				? parseInt(selectedProvider)
				: undefined,
			prompt,
			parameters: {
				...agentConfig.parameters,
				numerical: updatedNumerical,
			},
		}).then(() => {
			setIsSaving(false);
		});
	};

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
					label={label + (isDirty ? "*" : "")}
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
				{numericalFields &&
					Object.entries(numericalFields).map(([key, defaultValue]) => (
						<NumberInput
							key={key}
							label={key}
							value={numericalParameters[key] ?? defaultValue}
							onChange={(val) => {
								if (typeof val === "number") {
									setNumericalParameters((previous) => ({
										...previous,
										[key]: val,
									}));
								}
							}}
							maw="64px"
							disabled={isSaving}
						/>
					))}
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
