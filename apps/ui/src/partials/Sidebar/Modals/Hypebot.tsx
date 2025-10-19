import { Modal } from "@mantine/core";

interface HypebotProps {
  isOpened: boolean;
  close: () => void;
}

export default function Hypebot(props: HypebotProps) {
  return (
    <Modal title="Hypebot" opened={props.isOpened} onClose={() => props.close()} size="xl" centered>
      WIP
    </Modal>
  );
}
