import { useRef, useState } from "react";
import {
	ActionIcon,
	Button,
	Group,
	NativeSelect,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";
import { useProviderConfigs } from "../../../db/hooks/useProviderConfigs.ts";
import type ProviderConfig from "../../../models/ProviderConfig.ts";
import { AVAILABLE_PROVIDER_TYPES } from "../../../models/ProviderConfig.ts";

export default function KeyInput(props: { providerConfig?: ProviderConfig }) {
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
