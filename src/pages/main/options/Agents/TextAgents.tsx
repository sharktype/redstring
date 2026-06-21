import {
	Alert,
	Anchor,
	Button,
	Container,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { CgInfo } from "react-icons/cg";
import { MdSaveAlt } from "react-icons/md";
import { useNavigate } from "react-router";
import { useAgentConfig } from "../../../../db/hooks/useAgentConfigs";
import AgentInput, { type AgentInputHandle } from "./AgentInput.tsx";

export default function TextAgents() {
	const navigate = useNavigate();

	const storyteller = useAgentConfig("storyteller");
	const planner = useAgentConfig("planner");
	const dialogue = useAgentConfig("dialogue");

	const storytellerRef = useRef<AgentInputHandle>(null);
	const plannerRef = useRef<AgentInputHandle>(null);
	const dialogueRef = useRef<AgentInputHandle>(null);

	const [dirtyAgents, setDirtyAgents] = useState<Set<string>>(new Set());
	const [isSavingAll, setIsSavingAll] = useState(false);

	const setAgentDirty = useCallback((agentType: string, dirty: boolean) => {
		setDirtyAgents((prev) => {
			const alreadyDirty = prev.has(agentType);

			if (dirty === alreadyDirty) {
				return prev;
			}

			const next = new Set(prev);

			if (dirty) {
				next.add(agentType);
			} else {
				next.delete(agentType);
			}

			return next;
		});
	}, []);

	const handleStorytellerDirty = useCallback(
		(dirty: boolean) => setAgentDirty("storyteller", dirty),
		[setAgentDirty],
	);
	const handlePlannerDirty = useCallback(
		(dirty: boolean) => setAgentDirty("planner", dirty),
		[setAgentDirty],
	);
	const handleDialogueDirty = useCallback(
		(dirty: boolean) => setAgentDirty("dialogue", dirty),
		[setAgentDirty],
	);

	useEffect(() => {
		const msg = "You have unsaved changes!";
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = msg;

			return msg;
		};
		if (dirtyAgents.size > 0) {
			window.addEventListener("beforeunload", handler);

			return () => window.removeEventListener("beforeunload", handler);
		}
	}, [dirtyAgents]);

	const handleSaveAll = useCallback(async () => {
		setIsSavingAll(true);

		const refs = [storytellerRef, plannerRef, dialogueRef];
		await Promise.all(refs.map((ref) => ref.current?.save()));

		setIsSavingAll(false);
	}, []);

	const isAnyDirty = dirtyAgents.size > 0;

	const providersLink = (
		<Anchor onClick={() => navigate("/options/providers")}>
			Text Providers
		</Anchor>
	);

	return (
		<Container pt="xl">
			<Title mb="md">Text Agents</Title>
			<Alert
				title="Define your text generation agents"
				icon={<CgInfo />}
				pb="lg"
				mb="xl"
			>
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
			{isAnyDirty && (
				<Alert
					color="yellow"
					title="You have unsaved changes!"
					icon={<CgInfo />}
					mb="lg"
					variant="filled"
				/>
			)}
			<Stack gap="xl">
				<AgentInput
					ref={storytellerRef}
					agentConfig={storyteller}
					onDirtyChange={handleStorytellerDirty}
					providerOutput="text"
					description={
						<>
							<Text>
								This LLM does the bulk of the storytelling and is called every
								single message with full context.
							</Text>
							<Text>
								It is strongly recommended to use as powerful of an LLM as
								budget allows for this agent. Reasoning is recommended for
								prompts with a lot of rules or complexity.
							</Text>
						</>
					}
				/>
				<AgentInput
					ref={plannerRef}
					agentConfig={planner}
					onDirtyChange={handlePlannerDirty}
					providerOutput="text"
					description={
						<>
							<Text>
								This agent plans the story direction before the storyteller
								writes narrative. Its plans are persistent. It also creates the
								context window for dialogue mode to be given to the Dialogue
								agent.
							</Text>
							<Text>
								A moderate/cheap agent works well for this role. Reasoning is
								strongly recommended.
							</Text>
						</>
					}
				/>
				<AgentInput
					ref={dialogueRef}
					agentConfig={dialogue}
					onDirtyChange={handleDialogueDirty}
					providerOutput="text"
					description={
						<>
							<Text>
								This agent writes character dialogue and conversations with far
								less context than the other agents.
							</Text>
							<Text>
								Regardless of cheap or expensive, a <i>fast</i> agent works best
								for this role. Reasoning is not recommended.
							</Text>
						</>
					}
				/>
			</Stack>
			<Button
				mt="xl"
				fullWidth
				color="yellow"
				leftSection={<MdSaveAlt />}
				onClick={handleSaveAll}
				loading={isSavingAll}
				disabled={!isAnyDirty}
				size="md"
			>
				Save All
			</Button>
		</Container>
	);
}
