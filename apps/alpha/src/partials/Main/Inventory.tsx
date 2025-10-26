import { Box, Textarea, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FaBagShopping } from "react-icons/fa6";

export default function Inventory() {
  const [value, setValue] = useLocalStorage({ key: "inventory", defaultValue: "" });
  return (
    <Box flex={1} m="xs">
      <Title order={3} c="green" mb="xs">
        <FaBagShopping /> Inventory
      </Title>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        flex={1}
        minRows={16}
        maxRows={16}
        autosize
      />
    </Box>
  );
}
