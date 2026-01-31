import type MessageData from "../../../models/Message.ts";
import { Badge, Box, Button, Card, type DefaultMantineColor, Flex, Textarea } from "@mantine/core";
import { useLlmContext } from "../../../context/LlmContext.tsx";
import Markdown from "react-markdown";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";

interface MessageProps {
  message: MessageData;
}

export default function Message(props: MessageProps) {
  const [messages, setMessages] = useLocalStorage<MessageData[]>({ key: "messages", defaultValue: [] });

  const [temporaryEditMessage, setTemporaryEditMessage] = useState(props.message.content);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isRegenerateConfirm, setIsRegenerateConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
  const message = isEditMode ? (
    <Textarea
      value={temporaryEditMessage}
      onChange={(e) => setTemporaryEditMessage(e.currentTarget.value)}
      flex={1}
      autosize
    />
  ) : (
    <Box maw={780} style={{ overflowX: "auto" }}>
      <Markdown>{props.message.content}</Markdown>
    </Box>
  );

  return (
    <Flex mb="md" justify={isUser ? "flex-end" : "flex-start"}>
      <Card miw={isUser ? 0 : "100%"} bg={isUser ? "blue" : "gray"} shadow="sm" p="md">
        <Flex mb="xs">
          <Badge color={speakerColor}>{speakerText}</Badge>
        </Flex>
        {message}
        <Box>
          {isEditMode ? (
            <Button
              size="xs"
              mt="md"
              color="green"
              variant="subtle"
              onClick={() => {
                const updatedMessages: MessageData[] = messages.map((m) => {
                  if (m.content === props.message.content) {
                    return { ...m, content: temporaryEditMessage.trim() };
                  }

                  return m;
                });

                setMessages(updatedMessages);
                setIsEditMode(false);
              }}
            >
              Save
            </Button>
          ) : null}
          {isEditMode ? (
            <Button
              size="xs"
              mt="md"
              color="red"
              variant="subtle"
              onClick={() => {
                setIsEditMode(false);
                setTemporaryEditMessage(props.message.content);
              }}
            >
              Close Edit
            </Button>
          ) : (
            <Button
              size="xs"
              mt="md"
              color="green"
              variant="subtle"
              onClick={() => {
                setIsEditMode(true);
                setTemporaryEditMessage(props.message.content);
              }}
            >
              Edit
            </Button>
          )}
          {props.message.role !== "user" && (
            <Button
              size="xs"
              mt="md"
              color="yellow"
              variant="subtle"
              onClick={() => {
                if (isRegenerateConfirm) {
                  // Regenerate logic
                } else {
                  setIsRegenerateConfirm(true);
                }
              }}
            >
              {isRegenerateConfirm ? "Confirm Regenerate?" : "Regenerate"}
            </Button>
          )}
          {isEditMode ? null : (
            <Button
              size="xs"
              mt="md"
              color="red"
              variant="subtle"
              onClick={() => {
                // this sucks but whatever

                if (isDeleteConfirm) {
                  setMessages(messages.filter((m) => m.content !== props.message.content));
                } else {
                  setIsDeleteConfirm(true);
                }
              }}
            >
              {isDeleteConfirm ? "Confirm Delete?" : "Delete"}
            </Button>
          )}
        </Box>
      </Card>
    </Flex>
  );
}

export function Stream() {
  const { streamingMessage } = useLlmContext();
  return (
    <Flex mb="md" justify="flex-start">
      <Card miw="100%" bg="gray" shadow="sm" p="md">
        <Flex mb="xs">
          <Badge color="lime">Storyteller</Badge>
        </Flex>
        <Box maw={780} style={{ overflowX: "auto" }}>
          <Markdown>{streamingMessage.trim() || "_The Storyteller is thinking..._"}</Markdown>
        </Box>
      </Card>
    </Flex>
  );
}
