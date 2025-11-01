// Types of LLMs for this engine:

// Final LLMs to add to this:

// - Worldbuilding generator LLM - standalone and optional LLM to generate worldbuilding content.
//   - Called manually via UI.
// - Character generator LLM - as above but with characters.
//   - Called manually via UI.

import {
	ActionIcon,
	Alert,
	Anchor,
	Box,
	Container,
	Group,
	NativeSelect,
	NumberInput,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { CgInfo } from "react-icons/cg";
import { useNavigate } from "react-router";
import { AiFillWarning } from "react-icons/ai";
import { BiEdit, BiSave } from "react-icons/bi";

export default function Mappings() {
	const navigate = useNavigate();

	const keysLink = (
		<Anchor onClick={() => navigate("/options/keys")}>Mappings</Anchor>
	);

	return (
		<Container>
			<Title mb="md">LLM Mappings</Title>
			<Alert title="Set your mappings" icon={<CgInfo />} pb="lg" mb="xl">
				<Stack>
					<Text>
						LLM mappings determine which configurations are used for which
						purposes.
					</Text>
					<Text>
						Configure LLM keys in the {keysLink} page first, and make sure to
						test them before coming here!
					</Text>
				</Stack>
			</Alert>
			<Stack gap="xl">
				<Box>
					<Alert color="green" icon={<AiFillWarning />} mb="md">
						<Stack>
							<Text>
								This LLM does the bulk of the storytelling and is called every
								single message with full context.
							</Text>
							<Text>
								It is strongly recommended to use as powerful of an LLM as
								budget allows for this agent.
							</Text>
						</Stack>
					</Alert>
					<Group justify="center">
						<NativeSelect
							label="Storyteller"
							data={["Not implemented yet"]}
							flex={1}
							disabled
						/>
						<Group gap="xs" mt="lg" pt={2}>
							<ActionIcon variant="outline" size="sm" color="green">
								<BiSave />
							</ActionIcon>
							<ActionIcon variant="outline" size="sm">
								<BiEdit />
							</ActionIcon>
						</Group>
					</Group>
				</Box>
				<Box>
					<Alert color="green" icon={<AiFillWarning />} mb="md">
						<Stack>
							<Text>This agent summarises M messages ever N messages.</Text>
							<Text>
								The quality of summaries greatly affects the storytelling LLM's
								ability to maintain context over long stories.
							</Text>
							<Text>
								It is recommended to use as capable of an LLM as budget allows
								for this agent.
							</Text>
						</Stack>
					</Alert>
					<Group>
						<NativeSelect
							label="Summariser"
							data={["Not implemented yet"]}
							flex={1}
							disabled
						/>
						<NumberInput label="N" defaultValue={48} miw="64px" maw="128px" />
						<NumberInput label="M" defaultValue={24} miw="64px" maw="128px" />
						<Group gap="xs" mt="lg" pt={2}>
							<ActionIcon variant="outline" size="sm" color="green">
								<BiSave />
							</ActionIcon>
							<ActionIcon variant="outline" size="sm">
								<BiEdit />
							</ActionIcon>
						</Group>
					</Group>
				</Box>
				<Box>
					<Alert color="green" icon={<AiFillWarning />} mb="md">
						<Stack>
							<Text>
								Hypebot is just a fun extra bot, but it makes a call every
								message.
							</Text>
							<Text>
								It is recommended to use a cheap and fast LLM for this agent.
							</Text>
						</Stack>
					</Alert>
					<Group align="center">
						<NativeSelect
							label="Hypebot"
							data={["Not implemented yet"]}
							flex={1}
							disabled
						/>
						<NativeSelect
							label="Mode"
							data={[
								"disabled",
								"simple",
								"with world",
								"with storyline",
								"with everything",
							]}
						/>
						<Group gap="xs" mt="lg" pt={2}>
							<ActionIcon variant="outline" size="sm" color="green">
								<BiSave />
							</ActionIcon>
							<ActionIcon variant="outline" size="sm">
								<BiEdit />
							</ActionIcon>
						</Group>
					</Group>
				</Box>
			</Stack>
		</Container>
	);
}
