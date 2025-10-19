import { Box, Button, Flex, Modal, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import type MessageData from "../../../models/Message.ts";

interface ClearProps {
  isOpened: boolean;
  close: () => void;
}

export default function Clear(props: ClearProps) {
  const [_, setMessages] = useLocalStorage<MessageData[]>({ key: "messages", defaultValue: [] });
  return (
    <Modal opened={props.isOpened} onClose={() => props.close()} withCloseButton={false} centered>
      <Box mb="lg">
        <Title order={2} mb="md">
          Are you sure?
        </Title>
        <Text>Once you clear your chat history, you can't recover it.</Text>
      </Box>
      <Flex gap="sm">
        <Button
          color="red"
          onClick={() => {
            setMessages([]);
            props.close();
          }}
        >
          Yes, I'm sure!
        </Button>
        <Button
          variant="subtle"
          onClick={() => {
            props.close();
          }}
        >
          No thanks.
        </Button>
      </Flex>
    </Modal>
  );
}
