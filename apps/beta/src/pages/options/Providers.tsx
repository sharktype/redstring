import {
	ActionIcon,
	Alert,
	Anchor,
	Button,
	Container,
	Grid,
	GridCol,
	Group,
	NativeSelect,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { CgInfo } from "react-icons/cg";
import { useNavigate } from "react-router";
import { useProviderConfigs } from "../../db/hooks/useProviderConfigs.ts";
import type ProviderConfig from "../../models/ProviderConfig.ts";
import { AVAILABLE_PROVIDER_TYPES } from "../../models/ProviderConfig.ts";
import { BiTrash } from "react-icons/bi";
import { useRef, useState } from "react";
import { BsLightbulb } from "react-icons/bs";
import useGameContext from "../../context/hooks/useGameContext.tsx";

export default function Providers() {
	const navigate = useNavigate();

	const { providerConfigs } = useGameContext();

	const agentsLink = (
		<Anchor onClick={() => navigate("/options/agents")}>Agents</Anchor>
	);

	return (
		<Container>
			<Title mb="md">LLM Providers</Title>
			<Alert
				title="Define your LLM providers"
				icon={<CgInfo />}
				pb="lg"
				mb="xl"
			>
				<Stack>
					<Text>You can define an unlimited number of LLM providers here.</Text>
					<Text>
						Please note that in order to use these LLM configurations in the
						game engine, you will need to point functionality to the agent
						mappings in the {agentsLink} page.
					</Text>
					<Text>
						Your LLM API keys are stored locally in your browser's local
						database (IndexDB).
					</Text>
				</Stack>
			</Alert>
			<Grid gutter="xl">
				{providerConfigs.map((config) => (
					<GridCol
						key={`provider-config-input-${config.id || "error"}`}
						span={{
							base: 12,
							md: 6,
							lg: 4,
						}}
					>
						<KeyInput providerConfig={config} />
					</GridCol>
				))}
				<GridCol
					span={{
						base: 12,
						md: 6,
						lg: 4,
					}}
				>
					<KeyInput />
				</GridCol>
			</Grid>
		</Container>
	);
}

function KeyInput(props: { providerConfig?: ProviderConfig }) {
	const { providerConfig } = props;

	const [isDirtyNaive, setIsDirtyNaive] = useState(false);
	const [isTesting, setIsTesting] = useState(false);

	const nicknameRef = useRef<HTMLInputElement>(null);
	const typeRef = useRef<HTMLSelectElement>(null);
	const modelRef = useRef<HTMLInputElement>(null);
	const apiKeyRef = useRef<HTMLInputElement>(null);

	const { addProviderConfig, updateProviderConfig, deleteProviderConfig } =
		useProviderConfigs();

	const saveAction = () => {
		const name = nicknameRef.current?.value || "";
		const type = typeRef.current
			?.value as (typeof AVAILABLE_PROVIDER_TYPES)[number];
		const model = modelRef.current?.value || "";
		const apiKey = apiKeyRef.current?.value || "";

		if (providerConfig && providerConfig.id !== undefined) {
			// This update will also re-augment the values in context which we use for testing.

			void updateProviderConfig(providerConfig.id, {
				name,
				type,
				model,
				apiKey,
			});
		} else {
			void addProviderConfig({ name, type, model, apiKey });
		}

		setIsDirtyNaive(false);

		if (!providerConfig) {
			if (nicknameRef.current) {
				nicknameRef.current.value = "";
			}

			if (modelRef.current) {
				modelRef.current.value = "";
			}

			if (apiKeyRef.current) {
				apiKeyRef.current.value = "";
			}
		}
	};

	return (
		<Stack gap="xs">
			<Group>
				{!providerConfig && (
					<Text size="xs" pt="lg">
						<BsLightbulb />
					</Text>
				)}
				<TextInput
					ref={nicknameRef}
					label="Nickname"
					placeholder="e.g., deepseek-v3.2"
					defaultValue={providerConfig?.name}
					disabled={isTesting}
					onChange={() => setIsDirtyNaive(true)}
					flex={1}
				/>
			</Group>
			<NativeSelect
				ref={typeRef}
				label="Type"
				data={AVAILABLE_PROVIDER_TYPES}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<TextInput
				ref={modelRef}
				label="Model"
				placeholder="e.g., deepseek/deepseek-v3.2"
				defaultValue={providerConfig?.model}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<TextInput
				ref={apiKeyRef}
				label="API Key"
				placeholder="e.g., sk-xxx..."
				defaultValue={providerConfig?.apiKey}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<Group mt="md">
				<Button
					variant="outline"
					color={providerConfig ? "yellow" : "green"}
					disabled={!isDirtyNaive || isTesting}
					onClick={saveAction}
					flex={1}
				>
					{providerConfig
						? "Update"
						: isDirtyNaive
							? "Add (changes unsaved)"
							: "Edit above to add a new provider"}
				</Button>
				{providerConfig && (
					<Button
						variant="default"
						flex={1}
						disabled={isTesting || isDirtyNaive}
						onClick={async () => {
							setIsTesting(true);

							const result = await providerConfig.test();
							if (result) {
								alert(`Provider test successful! LLM said:\n\n${result}`);
							} else {
								alert(
									"Provider test failed. Please check your API key and configuration.",
								);
							}

							setIsTesting(false);
						}}
					>
						{isTesting ? "Testing..." : "Test"}
					</Button>
				)}
				{providerConfig && (
					<ActionIcon
						variant="subtle"
						color="red"
						size="lg"
						onClick={() => {
							const id = providerConfig?.id;
							if (id) {
								deleteProviderConfig(id);
							}
						}}
					>
						<BiTrash />
					</ActionIcon>
				)}
			</Group>
		</Stack>
	);
}
