import type MessageData from "../../../models/Message.ts";
import { Badge, Card, type DefaultMantineColor, Flex } from "@mantine/core";
import { useLlmContext } from "../../../context/LlmContext.tsx";

interface MessageProps {
  message: MessageData;
}

export default function Message(props: MessageProps) {
  const { isStreaming } = useLlmContext();

  let speakerText = "";
  let speakerColor: DefaultMantineColor = "gray";
  if (props.message.role === "user") {
    speakerText = "You";
    speakerColor = "yellow";
  } else if (props.message.role === "assistant") {
    speakerText = "Storyteller";
    speakerColor = "lime";
  } else if (props.message.role === "system") {
    speakerText = "System";
    speakerColor = "red";
  }

  const isUser = props.message.role === "user";

  return (
    <Flex mb="md" justify={isUser ? "flex-end" : "flex-start"}>
      <Card miw={isUser ? 0 : "100%"} bg={isUser ? "blue" : "gray"} shadow="sm" p="md">
        <Flex mb="xs">
          <Badge color={speakerColor}>{speakerText}</Badge>
        </Flex>
        <Flex>{isStreaming ? "" : props.message.content}</Flex>
      </Card>
    </Flex>
  );
}
