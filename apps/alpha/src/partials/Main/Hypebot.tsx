import { Box, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLlmContext } from "../../context/LlmContext.tsx";

export default function Hypebot() {
  const [hypebotResponse] = useLocalStorage({ key: "hypebot-response", defaultValue: "" });

  const { isHypebotThinking } = useLlmContext();

  let message = hypebotResponse.trim();
  if (isHypebotThinking) {
    message = "Hypebot is thinking...";
  } else if (!hypebotResponse.trim()) {
    message = "Hypebot is waiting excitedly to start!";
  }

  return (
    <Box>
      <Title order={6} mb="xs">
        Hypebot Says
      </Title>
      <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
        <i>{message}</i>
      </Text>
    </Box>
  );
}
