import { Modal, Textarea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

interface InstructionsProps {
	isOpened: boolean;
	close: () => void;
}

export default function Instructions(props: InstructionsProps) {
	const [value, setValue] = useLocalStorage({
		key: "instructions",
		defaultValue: "",
	});
	return (
		<Modal
			title="Instructions"
			opened={props.isOpened}
			onClose={() => props.close()}
			size="xl"
			centered
		>
			<Textarea
				description="This input is saved to your browser's local storage."
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				resize="vertical"
				minRows={32}
				maxRows={48}
				mb="xs"
				autosize
			/>
		</Modal>
	);
}
