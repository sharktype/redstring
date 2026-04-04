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
import KeyInput from "./KeyInput.tsx";
import useGameContext from "../../../../context/hooks/useGameContext.tsx";

export default function Providers() {
	const navigate = useNavigate();

	const { providerConfigs } = useGameContext();

	const agentsLink = (
		<Anchor onClick={() => navigate("/options/agents")}>Agents</Anchor>
	);

	return (
		<Container pt="xl">
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
						database (IndexedDB).
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
