import { Box, Textarea, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FaShield } from "react-icons/fa6";

export default function Equips() {
  const [value, setValue] = useLocalStorage({ key: "equips", defaultValue: "" });
  return (
    <Box flex={1} m="xs">
      <Title order={3} c="yellow" mb="xs">
        <FaShield /> Equipped
      </Title>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        flex={1}
        minRows={16}
        maxRows={24}
        autosize
      />
    </Box>
  );
}
