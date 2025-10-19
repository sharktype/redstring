import type MessageData from "../../../models/Message.ts";
import { Badge, Card, type DefaultMantineColor, Flex } from "@mantine/core";
import { useLlmContext } from "../../../context/LlmContext.tsx";
import Markdown from "react-markdown";

interface MessageProps {
  message: MessageData;
}

export default function Message(props: MessageProps) {
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
        <Markdown>{props.message.content}</Markdown>
      </Card>
    </Flex>
  );
}

export function Stream() {
  const { streamingMessage } = useLlmContext();
  return (
    <Flex mb="md" justify="flex-start">
      <Card miw="100%" bg="gray" shadow="sm" p="xs">
        <Flex mb="xs">
          <Badge color="lime">Storyteller</Badge>
        </Flex>
        <Markdown>{streamingMessage.trim() || "_The Storyteller is thinking..._"}</Markdown>
      </Card>
    </Flex>
  );
}
