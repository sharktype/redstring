import { Flex } from "@mantine/core";
import Equips from "./Equips.tsx";
import Inventory from "./Inventory.tsx";
import Stats from "./Stats.tsx";
import Memory from "./Memory.tsx";
import Chat from "./Chat";
import Hypebot from "./Hypebot.tsx";

export default function Main() {
  return (
    <Flex h="100vh">
      <Chat />
      <Flex w={620} miw={320} maw={620} direction="column" mr={64} mt={48}>
        <Flex>
          <Equips />
          <Inventory />
        </Flex>
        <Flex mb="md">
          <Stats />
          <Memory />
        </Flex>
        <Hypebot />
      </Flex>
    </Flex>
  );
}
