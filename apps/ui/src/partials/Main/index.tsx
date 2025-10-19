import { Flex } from "@mantine/core";
import Equips from "./Equips.tsx";
import Inventory from "./Inventory.tsx";
import Stats from "./Stats.tsx";
import Memory from "./Memory.tsx";
import Chat from "./Chat.tsx";
import Hypebot from "./Hypebot.tsx";

export default function Main() {
  return (
    <Flex h="100vh">
      <Chat />
      <Flex w={768} miw={512} maw={768} direction="column" mr={96} my="auto">
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
