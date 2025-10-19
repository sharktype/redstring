import { Box, Button, type DefaultMantineColor, Flex, Text, Title } from "@mantine/core";
import { type ReactNode } from "react";
import { FaPerson } from "react-icons/fa6";
import { GiBookshelf, GiFlowers, GiPartyHat, GiRuleBook, GiVillage } from "react-icons/gi";
import { PiCoins } from "react-icons/pi";
import { FaRobot } from "react-icons/fa";
import Characters from "./Modals/Characters.tsx";
import { useDisclosure } from "@mantine/hooks";
import Setting from "./Modals/Setting.tsx";
import Economy from "./Modals/Economy.tsx";
import Plot from "./Modals/Plot.tsx";
import Style from "./Modals/Style.tsx";
import Rules from "./Modals/Rules.tsx";
import Agent from "./Modals/Agent.tsx";
import Hypebot from "./Modals/Hypebot.tsx";

export default function Sidebar() {
  const [isCharacterModalOpened, { open: openCharacterModal, close: closeCharacterModal }] = useDisclosure(false);
  const [isSettingModalOpened, { open: openSettingModal, close: closeSettingModal }] = useDisclosure(false);
  const [isEconomyModalOpened, { open: openEconomyModal, close: closeEconomyModal }] = useDisclosure(false);
  const [isPlotModalOpened, { open: openPlotModal, close: closePlotModal }] = useDisclosure(false);
  const [isStyleModalOpened, { open: openStyleModal, close: closeStyleModal }] = useDisclosure(false);
  const [isRulesModalOpened, { open: openRulesModal, close: closeRulesModal }] = useDisclosure(false);
  const [isAgentModalOpened, { open: openAgentModal, close: closeAgentModal }] = useDisclosure(false);
  const [isHypebotModalOpened, { open: openHypebotModal, close: closeHypebotModal }] = useDisclosure(false);
  return (
    <Flex direction="column" py="md" pl="md" pr="lg">
      <Flex direction="column" mb="xl">
        <Title mb="xs">❤️ྀི redstring</Title>
        <Text>by sharktype</Text>
      </Flex>
      <Box flex={1}>
        <Flex direction="column" mb="xl" gap="sm">
          <ModalButton
            label="Characters"
            icon={<FaPerson />}
            modal={<Characters isOpened={isCharacterModalOpened} close={() => closeCharacterModal()} />}
            open={openCharacterModal}
          />
          <ModalButton
            label="Setting"
            icon={<GiVillage />}
            modal={<Setting isOpened={isSettingModalOpened} close={closeSettingModal} />}
            open={openSettingModal}
          />
          <ModalButton
            label="Economy"
            icon={<PiCoins />}
            modal={<Economy isOpened={isEconomyModalOpened} close={closeEconomyModal} />}
            open={openEconomyModal}
          />
          <ModalButton
            label="Plot"
            icon={<GiBookshelf />}
            modal={<Plot isOpened={isPlotModalOpened} close={closePlotModal} />}
            open={openPlotModal}
          />
        </Flex>
        <Flex direction="column" mb="xl" gap="sm">
          <ModalButton
            label="Style"
            icon={<GiFlowers />}
            color="yellow"
            modal={<Style isOpened={isStyleModalOpened} close={closeStyleModal} />}
            open={openStyleModal}
          />
          <ModalButton
            label="Rules"
            icon={<GiRuleBook />}
            color="yellow"
            modal={<Rules isOpened={isRulesModalOpened} close={closeRulesModal} />}
            open={openRulesModal}
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
          <ModalButton
            label="Hypebot"
            icon={<GiPartyHat />}
            color="grape"
            modal={<Hypebot isOpened={isHypebotModalOpened} close={closeHypebotModal} />}
            open={openHypebotModal}
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
