import { Box, Textarea, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FaHeartbeat } from "react-icons/fa";

export default function Stats() {
	const [value, setValue] = useLocalStorage({ key: "stats", defaultValue: "" });
	return (
		<Box flex={1} c="red" m="xs">
			<Title order={3} mb="xs">
				<FaHeartbeat /> Stats
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
