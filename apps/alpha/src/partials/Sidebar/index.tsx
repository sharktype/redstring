import { Box, Button, type DefaultMantineColor, Flex, Text, Title } from "@mantine/core";
import { type ReactNode } from "react";
import { GiExplosionRays, GiScrollUnfurled } from "react-icons/gi";
import { FaRobot } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import Instructions from "./Modals/Instructions.tsx";
import Agent from "./Modals/Agent.tsx";
import Clear from "./Modals/Clear.tsx";

export default function Sidebar() {
  const [isInstructionsModalOpened, { open: openInstructionsModal, close: closeInstructionsModal }] =
    useDisclosure(false);
  const [isAgentModalOpened, { open: openAgentModal, close: closeAgentModal }] = useDisclosure(false);
  const [isClearOpened, { open: openClearModal, close: closeClearModal }] = useDisclosure(false);

  return (
    <Flex direction="column" py="md" pl="md" pr="lg">
      <Flex direction="column" mb="xl">
        <Title mb="xs">staircase</Title>
        <Text>by sharktype</Text>
      </Flex>
      <Box flex={1}>
        <Flex direction="column" mb="xl" gap="sm">
          <ModalButton
            label="Instructions"
            icon={<GiScrollUnfurled />}
            modal={<Instructions isOpened={isInstructionsModalOpened} close={closeInstructionsModal} />}
            open={openInstructionsModal}
          />
        </Flex>
        <Flex direction="column" mb="xl" gap="sm">
          <ModalButton
            label="Agent"
            icon={<FaRobot />}
            color="grape"
            modal={<Agent isOpened={isAgentModalOpened} close={closeAgentModal} />}
            open={openAgentModal}
          />
        </Flex>
        <Flex direction="column" mb="xl" gap="sm">
          <ModalButton
            label="Clear History?"
            icon={<GiExplosionRays />}
            color="orange"
            modal={<Clear isOpened={isClearOpened} close={closeClearModal} />}
            open={openClearModal}
          />
        </Flex>
      </Box>
    </Flex>
  );
}

interface ModalButtonProps {
  label: string;
  icon?: ReactNode;

  color?: DefaultMantineColor;

  modal: ReactNode;
  open: () => void;
}

function ModalButton(props: ModalButtonProps) {
  return (
    <>
      {props.modal}

      <Button leftSection={props.icon} variant="light" color={props.color || "red"} radius="xl" onClick={props.open}>
        {props.label}
      </Button>
    </>
  );
}
