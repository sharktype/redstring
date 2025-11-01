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
import { useEffect, useRef, useState } from "react";
import { BsLightbulb } from "react-icons/bs";
import { OpenRouterConfig } from "../../handlers/providers/openrouter.ts";

export default function Keys() {
	const navigate = useNavigate();

	const { rawProviderConfigs } = useProviderConfigs();

	const [providerConfigs, setProviderConfigs] =
		useState<ProviderConfig[]>(rawProviderConfigs);

	useEffect(() => {
		const augmentedProviderConfigs: ProviderConfig[] = rawProviderConfigs.map(
			(config) => {
				switch (config.type) {
					case "openrouter":
						return new OpenRouterConfig(
							config.name,
							config.apiKey,
							config.model,
							config.id,
						);
					default:
						// Unexpected provider config type.
						return config;
				}
			},
		);

		setProviderConfigs(augmentedProviderConfigs);
	}, [rawProviderConfigs]);

	const mappingsLink = (
		<Anchor onClick={() => navigate("/options/mappings")}>Mappings</Anchor>
	);

	return (
		<Container>
			<Title mb="md">LLM Keys</Title>
			<Alert title="Define your LLM clients" icon={<CgInfo />} pb="lg" mb="xl">
				<Stack>
					<Text>You can define an unlimited number of LLM keys here.</Text>
					<Text>
						Please note that in order to use these LLM configurations in the
						game engine, you will need to point functionality to the mappings in
						the {mappingsLink} page.
					</Text>
					<Text>
						Your LLM keys are stored locally in your browser's local database
						(IndexDB).
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

		let newConfig: ProviderConfig | null = null;
		switch (type) {
			case "openrouter":
				newConfig = new OpenRouterConfig(
					name,
					apiKey,
					model,
					providerConfig?.id,
				);
				break;
			default:
				// Unexpected provider config type.

				return;
		}

		if (newConfig) {
			if (providerConfig && providerConfig.id !== undefined) {
				void updateProviderConfig(providerConfig.id, newConfig);
			} else {
				void addProviderConfig(newConfig);
			}

			setIsTesting(true);
			void newConfig.test().then((result) => {
				if (result) {
					alert("Configuration saved and test successful!");
				} else {
					alert(
						"Configuration saved, but test failed. Please check your API key and configuration.",
					);
				}

				setIsTesting(false);
			});
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
				defaultValue={providerConfig?.model}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<TextInput
				ref={apiKeyRef}
				label="API Key"
				defaultValue={providerConfig?.apiKey}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<Group mt="md">
				<Button
					variant="outline"
					color={providerConfig ? "yellow" : "green"}
					disabled={(providerConfig && !isDirtyNaive) || isTesting}
					onClick={saveAction}
					flex={1}
				>
					{providerConfig ? "Update" : "Add"}
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
								alert("Test successful!");
							} else {
								alert(
									"Test failed. Please check your API key and configuration.",
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
