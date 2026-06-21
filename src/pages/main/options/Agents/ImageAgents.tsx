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

export default function ImageAgents() {
	const navigate = useNavigate();

	const profiler = useAgentConfig("profiler");
	const illustrator = useAgentConfig("illustrator");

	const profilerRef = useRef<AgentInputHandle>(null);
	const illustratorRef = useRef<AgentInputHandle>(null);

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

	const handleProfilerDirty = useCallback(
		(dirty: boolean) => setAgentDirty("profiler", dirty),
		[setAgentDirty],
	);
	const handleIllustratorDirty = useCallback(
		(dirty: boolean) => setAgentDirty("illustrator", dirty),
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

		const refs = [profilerRef, illustratorRef];
		await Promise.all(refs.map((ref) => ref.current?.save()));

		setIsSavingAll(false);
	}, []);

	const isAnyDirty = dirtyAgents.size > 0;

	const providersLink = (
		<Anchor onClick={() => navigate("/options/image-providers")}>
			Image Providers
		</Anchor>
	);

	return (
		<Container pt="xl">
			<Title mb="md">Image Agents</Title>
			<Alert
				title="Define your image generation agents"
				icon={<CgInfo />}
				pb="lg"
				mb="xl"
			>
				<Stack>
					<Text>
						Image agents determine which configurations are used for image
						generation purposes.
					</Text>
					<Text>
						Configure image provider keys in the {providersLink} page first.
					</Text>
					<Text>
						If you want to add a system prompt info into image agents, make them
						"booru-style", comma separated.
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
					ref={profilerRef}
					agentConfig={profiler}
					onDirtyChange={handleProfilerDirty}
					providerOutput="image"
					description={
						<>
							<Text>
								The Profiler generates character portraits based on limited
								character descriptions.
							</Text>
							<Text>
								A fast provider works well here since portraits should
								regenerate quickly as the character evolves.
							</Text>
						</>
					}
				/>
				<AgentInput
					ref={illustratorRef}
					agentConfig={illustrator}
					onDirtyChange={handleIllustratorDirty}
					providerOutput="image"
					description={
						<>
							<Text>
								The Illustrator generates full scene illustrations based on a
								lot of narrative context.
							</Text>
							<Text>
								A high quality provider is recommended since these are full
								scenes. They will be rendered asynchronously so the speed
								matters less if you're concerned about it slowing down the
								roleplay.
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
