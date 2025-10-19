import { Modal } from "@mantine/core";

interface ClearProps {
  isOpened: boolean;
  close: () => void;
}

export default function Clear(props: ClearProps) {
  return (
    <Modal title="Clear History?" opened={props.isOpened} onClose={() => props.close()} size="xl" centered>
      WIP
    </Modal>
  );
}
