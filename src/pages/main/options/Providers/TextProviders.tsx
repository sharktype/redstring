import {
	Alert,
	Anchor,
	Container,
	Grid,
	GridCol,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { CgInfo } from "react-icons/cg";
import { useNavigate } from "react-router";
import useGameContext from "../../../../context/GameContext/useGameContext.tsx";
import KeyInput from "./KeyInput.tsx";

export default function TextProviders() {
	const navigate = useNavigate();

	const { providerConfigs } = useGameContext();

	const textConfigs = providerConfigs.filter(
		(config) => config.providerOutput === "text",
	);

	const agentsLink = (
		<Anchor onClick={() => navigate("/options/agents")}>Agents</Anchor>
	);

	return (
		<Container pt="xl">
			<Title mb="md">Text Providers</Title>
			<Alert
				title="Define your text LLM providers"
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
						database (IndexedDB).
					</Text>
				</Stack>
			</Alert>
			<Grid gap="xl">
				{textConfigs.map((config) => (
					<GridCol
						key={`provider-config-input-${config.id || "error"}`}
						span={{
							base: 12,
							md: 6,
							lg: 4,
						}}
					>
						<KeyInput providerConfig={config} providerOutput="text" />
					</GridCol>
				))}
				<GridCol
					span={{
						base: 12,
						md: 6,
						lg: 4,
					}}
				>
					<KeyInput providerOutput="text" />
				</GridCol>
			</Grid>
		</Container>
	);
}
