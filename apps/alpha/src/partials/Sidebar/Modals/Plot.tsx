import { Modal, Textarea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

interface PlotProps {
  isOpened: boolean;
  close: () => void;
}

export default function Plot(props: PlotProps) {
  const [value, setValue] = useLocalStorage({ key: "plot", defaultValue: "" });
  return (
    <Modal title="Plot" opened={props.isOpened} onClose={() => props.close()} size="xl" centered>
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
