import {
	Alert,
	Container,
	Grid,
	GridCol,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { CgInfo } from "react-icons/cg";
import useGameContext from "../../../../context/GameContext/useGameContext.tsx";
import KeyInput from "./KeyInput.tsx";

export default function ImageProviders() {
	const { providerConfigs } = useGameContext();

	const imageConfigs = providerConfigs.filter(
		(config) => config.providerOutput === "image",
	);

	return (
		<Container pt="xl">
			<Title mb="md">Image Providers</Title>
			<Alert
				title="Define your image generation providers"
				icon={<CgInfo />}
				pb="lg"
				mb="xl"
			>
				<Stack>
					<Text>
						You can define an unlimited number of image generation providers
						here.
					</Text>
					<Text>
						Your image generation API keys are stored locally in your browser's
						local database (IndexedDB).
					</Text>
				</Stack>
			</Alert>
			<Grid gap="xl">
				{imageConfigs.map((config) => (
					<GridCol
						key={`image-provider-config-input-${config.id || "error"}`}
						span={{
							base: 12,
							md: 6,
							lg: 4,
						}}
					>
						<KeyInput providerConfig={config} providerOutput="image" />
					</GridCol>
				))}
				<GridCol
					span={{
						base: 12,
						md: 6,
						lg: 4,
					}}
				>
					<KeyInput providerOutput="image" />
				</GridCol>
			</Grid>
		</Container>
	);
}
