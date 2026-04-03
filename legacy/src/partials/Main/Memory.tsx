import { Box, Textarea, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FaBook } from "react-icons/fa";

export default function Memory() {
	const [value, setValue] = useLocalStorage({
		key: "memory",
		defaultValue: "",
	});
	return (
		<Box flex={1} m="xs">
			<Title order={3} c="blue" mb="xs">
				<FaBook /> Memory
			</Title>
			<Textarea
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				flex={1}
				minRows={48}
				maxRows={48}
				autosize
			/>
		</Box>
	);
}
