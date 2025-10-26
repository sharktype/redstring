import { Flex, Modal, Textarea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

interface HypebotProps {
  isOpened: boolean;
  close: () => void;
}

export default function Hypebot(props: HypebotProps) {
  const [hypebotPrompt, setHypebotPrompt] = useLocalStorage({ key: "hypebot-prompt", defaultValue: "" });
  return (
    <Modal title="Hypebot Settings" opened={props.isOpened} onClose={() => props.close()} centered>
      <Flex direction="column" gap="md" mb="xl">
        <Textarea
          label="System Prompt"
          placeholder="You hype up the most recent scene in the story."
          minRows={4}
          maxRows={32}
          value={hypebotPrompt}
          onChange={(e) => {
            setHypebotPrompt(e.currentTarget.value);
          }}
          resize="vertical"
          autosize
        />
      </Flex>
    </Modal>
  );
}
