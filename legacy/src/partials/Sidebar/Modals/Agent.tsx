import { Button, Flex, Modal, Text, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLlmContext } from "../../../context/LlmContext.tsx";
import useCreateOpenAiClient from "../../../hooks/useCreateOpenAiClient.tsx";
import { FcBrokenLink, FcLink } from "react-icons/fc";

interface AgentProps {
	isOpened: boolean;
	close: () => void;
}

export default function Agent(props: AgentProps) {
	const [openAiApiKey, setOpenAiApiKey] = useLocalStorage({
		key: "open-ai-api-key",
		defaultValue: "",
	});
	const [openAiBaseUrl, setOpenAiBaseUrl] = useLocalStorage({
		key: "open-ai-base-url",
		defaultValue: "",
	});
	const [openAiModel, setOpenAiModel] = useLocalStorage({
		key: "open-ai-model",
		defaultValue: "",
	});

	const { openAiClient, setOpenAiClient } = useLlmContext();
	const createOpenAiClient = useCreateOpenAiClient();

	return (
		<Modal
			title="Agent"
			opened={props.isOpened}
			onClose={() => props.close()}
			centered
		>
			<Title order={2} mb="md">
				OpenAI Credentials
			</Title>
			<Flex direction="column" gap="md" mb="xl">
				<TextInput
					label="OpenAI API Key"
					placeholder="sk-************************************"
					value={openAiApiKey}
					onChange={(e) => {
						setOpenAiApiKey(e.currentTarget.value);
					}}
				/>
				<TextInput
					label="OpenAI Base URL"
					placeholder="https://..."
					value={openAiBaseUrl}
					onChange={(e) => {
						setOpenAiBaseUrl(e.currentTarget.value);
					}}
				/>
				<TextInput
					label="OpenAI Model"
					placeholder="e.g., openai/gpt-4o"
					value={openAiModel}
					onChange={(e) => {
						setOpenAiModel(e.currentTarget.value);
					}}
				/>
			</Flex>
			<Flex gap="md" align="center">
				<Button
					color="green"
					onClick={() => {
						const newClient = createOpenAiClient();
						if (newClient) {
							setOpenAiClient(newClient);

							console.log("INFO - OpenAI client created successfully");
						} else {
							setOpenAiClient(undefined);

							console.warn("WARN - failed to create OpenAI client");
						}
					}}
				>
					Reconnect
				</Button>
				<Flex gap="xs" align="center">
					{openAiClient ? <FcLink /> : <FcBrokenLink />}
					<Text size="sm">{`${openAiClient ? "Connected" : "Disconnected"}`}</Text>
				</Flex>
			</Flex>
		</Modal>
	);
}
