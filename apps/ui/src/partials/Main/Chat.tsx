import { Box, Button, Container, Flex, Textarea } from "@mantine/core";
import { BiSend } from "react-icons/bi";

export default function Chat() {
  return (
    <Flex direction="column" flex={1} h="100vh" miw={768} p="xl">
      <Container h="100%">
        <Flex direction="column" flex={1} h="100%" miw={768} p="xl">
          <Box flex={1} />
          <Box pos="relative">
            <Textarea minRows={4} maxRows={16} autosize />
            <Button pos="absolute" right={12} bottom={12} variant="light" c="pink" size="xs">
              <BiSend />
            </Button>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
