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

export default function Keys() {
	const navigate = useNavigate();

	const { providerConfigs } = useProviderConfigs();

	const mappingsLink = (
		<Anchor onClick={() => navigate("/options/mappings")}>Mappings</Anchor>
	);

	return (
		<Container>
			<Title mb="md">LLM Keys</Title>
			<Alert title="Set your mappings" icon={<CgInfo />} mb="xl">
				<Stack>
					<Text>You can define an unlimited number of LLM keys here.</Text>
					<Text>
						Please note that in order to use these LLM configurations in the
						game engine, you will need to point functionality to the mappings in
						the {mappingsLink} page.
					</Text>
					<Text>
						Your LLM keys are stored locally in your browser's local storage.
					</Text>
				</Stack>
			</Alert>
			<form>
				<Grid gutter="xl">
					{providerConfigs.map((config) => (
						<GridCol
							key={`provider-config-input-${config.id || "error"}`}
							span={4}
						>
							<KeyInput providerConfig={config} />
						</GridCol>
					))}
					<GridCol span={4}>
						<KeyInput />
					</GridCol>
				</Grid>
			</form>
		</Container>
	);
}

function KeyInput(props: { providerConfig?: ProviderConfig }) {
	const { providerConfig } = props;

	const [isDirtyNaive, setIsDirtyNaive] = useState(false);

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
					onChange={() => setIsDirtyNaive(true)}
					flex={1}
				/>
			</Group>
			<NativeSelect
				ref={typeRef}
				label="Type"
				data={AVAILABLE_PROVIDER_TYPES}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<TextInput
				ref={modelRef}
				label="Model"
				defaultValue={providerConfig?.model}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<TextInput
				ref={apiKeyRef}
				label="API Key"
				defaultValue={providerConfig?.apiKey}
				onChange={() => setIsDirtyNaive(true)}
			/>
			<Group mt="md">
				<Button
					variant="outline"
					color={providerConfig ? "yellow" : "green"}
					disabled={providerConfig && !isDirtyNaive}
					onClick={saveAction}
					flex={1}
				>
					{providerConfig ? "Update" : "Add"}
				</Button>
				<Button variant="default" flex={1}>
					Test
				</Button>
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
