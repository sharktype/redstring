import { Anchor, Alert, Container, Stack, Text, Title } from "@mantine/core";
import { CgInfo } from "react-icons/cg";
import { useNavigate } from "react-router";
import AgentInput from "./AgentInput";
import { useAgentConfig } from "../../../../db/hooks/useAgentConfigs";

export default function Agents() {
	const navigate = useNavigate();

	const storyteller = useAgentConfig("storyteller");
	const summarizer = useAgentConfig("summarizer");

	const providersLink = (
		<Anchor onClick={() => navigate("/options/providers")}>Providers</Anchor>
	);

	return (
		<Container pt="xl">
			<Title mb="md">Agents</Title>
			<Alert title="Set your agent configs" icon={<CgInfo />} pb="lg" mb="xl">
				<Stack>
					<Text>
						LLM agent mappings determine which configurations are used for which
						purposes.
					</Text>
					<Text>
						Configure LLM provider keys in the {providersLink} page first, and
						make sure to test them before coming here!
					</Text>
				</Stack>
			</Alert>
			<Stack gap="xl">
				<AgentInput
					agentConfig={storyteller}
					description={
						<>
							<Text>
								This LLM does the bulk of the storytelling and is called every
								single message with full context.
							</Text>
							<Text>
								It is strongly recommended to use as powerful of an LLM as
								budget allows for this agent.
							</Text>
						</>
					}
				/>
				<AgentInput
					agentConfig={summarizer}
					description={
						<>
							<Text>This agent summarises M messages every N messages.</Text>
							<Text>
								You should set N &gt;= M; anything else is done at your own
								risk. A setting of <code>M=24</code> and <code>N=48</code> is a
								solid default.
							</Text>
							<Text>
								The quality of summaries greatly affects the storytelling LLM's
								ability to maintain context over long stories.
							</Text>
							<Text>
								It is recommended to use as capable of an LLM as budget allows
								for this agent.
							</Text>
						</>
					}
					numericalFields={{
						N: 48,
						M: 24,
					}}
				/>
			</Stack>
		</Container>
	);
}
