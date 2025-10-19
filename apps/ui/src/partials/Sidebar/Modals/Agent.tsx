import { Modal } from "@mantine/core";

interface AgentProps {
  isOpened: boolean;
  close: () => void;
}

export default function Agent(props: AgentProps) {
  return (
    <Modal title="Agent" opened={props.isOpened} onClose={() => props.close()} size="xl" centered>
      WIP
    </Modal>
  );
}
