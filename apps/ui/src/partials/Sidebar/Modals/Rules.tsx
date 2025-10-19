import { Modal, Textarea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

interface RulesProps {
  isOpened: boolean;
  close: () => void;
}

export default function Rules(props: RulesProps) {
  const [value, setValue] = useLocalStorage({ key: "rules", defaultValue: "" });
  return (
    <Modal title="Rules" opened={props.isOpened} onClose={() => props.close()} size="xl" centered>
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
