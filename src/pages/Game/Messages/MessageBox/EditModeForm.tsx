import { Textarea } from "@mantine/core";

export default function EditModeForm({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<Textarea
			w="100%"
			minRows={3}
			autosize
			value={value}
			onChange={(e) => onChange(e.currentTarget.value)}
		/>
	);
}
