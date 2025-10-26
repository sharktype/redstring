import { Modal, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

interface DebugProps {
  isOpened: boolean;
  close: () => void;
}

export default function Debug(props: DebugProps) {
  const [lastDebugPrompt] = useLocalStorage<string>({ key: "last-debug-prompt", defaultValue: "" });
  return (
    <Modal title="Debug Prompt" opened={props.isOpened} onClose={() => props.close()} size="xl" centered>
      <Text>
        <b>Note</b>: Does not include system prompts.
      </Text>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{lastDebugPrompt}</pre>
    </Modal>
  );
}
