import {
	ActionIcon,
	Button,
	Group,
	NativeSelect,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useRef, useState } from "react";
import { BiHide, BiShow, BiTrash } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";
import { useProviderConfigs } from "../../../../db/hooks/useProviderConfigs";
import type ProviderConfig from "../../../../models/ProviderConfig";
import {
	AVAILABLE_IMAGE_PROVIDER_TYPES,
	AVAILABLE_TEXT_PROVIDER_TYPES,
	type ProviderOutput,
	type ProviderType,
} from "../../../../models/ProviderConfig";

export default function KeyInput(props: {
	providerConfig?: ProviderConfig;
	providerOutput: ProviderOutput;
}) {
	const { providerConfig, providerOutput } = props;

	const providerTypes =
		providerOutput === "image"
			? [...AVAILABLE_IMAGE_PROVIDER_TYPES]
			: [...AVAILABLE_TEXT_PROVIDER_TYPES];

	const MODEL_PLACEHOLDERS: Record<string, string> = {
		openrouter: "e.g., deepseek/deepseek-v3.2",
		novelai: "nai-diffusion",
	};

	const [isDirtyNaive, setIsDirtyNaive] = useState(false);
	const [isTesting, setIsTesting] = useState(false);
	const [showApiKey, setShowApiKey] = useState(false);
	const [selectedType, setSelectedType] = useState<string>(
		providerConfig?.type ?? providerTypes[0] ?? "",
	);

	const modelPlaceholder = MODEL_PLACEHOLDERS[selectedType] ?? "";

	const nicknameRef = useRef<HTMLInputElement>(null);
	const modelRef = useRef<HTMLInputElement>(null);
	const apiKeyRef = useRef<HTMLInputElement>(null);

	const { addProviderConfig, updateProviderConfig, deleteProviderConfig } =
		useProviderConfigs();

	const saveAction = () => {
		const name = nicknameRef.current?.value || "";
		const type = selectedType as ProviderType;
		const model = modelRef.current?.value || "";
		const apiKey = apiKeyRef.current?.value || "";

		if (!type) {
			return;
		}

		if (providerConfig && providerConfig.id !== undefined) {
			void updateProviderConfig(providerConfig.id, {
				name,
				type,
				model,
				apiKey,
			});
		} else {
			void addProviderConfig({
				name,
				type,
				model,
				apiKey,
				providerOutput,
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

			setSelectedType(providerTypes[0] ?? "");
		}
	};

	const handleTest = async () => {
		setIsTesting(true);

		const result = await providerConfig!.test();
		if (result) {
			alert(`Provider test successful! LLM said:\n\n${result}`);
		} else {
			alert(
				"Provider test failed. Please check your API key and configuration.",
			);
		}

		setIsTesting(false);
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
				label="Type"
				data={providerTypes}
				value={selectedType}
				onChange={(e) => {
					setSelectedType(e.currentTarget.value);
					setIsDirtyNaive(true);
				}}
				disabled={isTesting}
			/>
			<TextInput
				ref={modelRef}
				label="Model"
				placeholder={modelPlaceholder}
				defaultValue={providerConfig?.model}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<TextInput
				ref={apiKeyRef}
				type={showApiKey ? "text" : "password"}
				label="API Key"
				placeholder="e.g., sk-xxx..."
				defaultValue={providerConfig?.apiKey}
				disabled={isTesting}
				onChange={() => setIsDirtyNaive(true)}
				rightSection={
					<ActionIcon variant="subtle" onClick={() => setShowApiKey((v) => !v)}>
						{showApiKey ? <BiHide /> : <BiShow />}
					</ActionIcon>
				}
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
				{providerConfig && providerOutput === "text" && (
					<Button
						variant="default"
						flex={1}
						disabled={isTesting || isDirtyNaive}
						onClick={handleTest}
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
