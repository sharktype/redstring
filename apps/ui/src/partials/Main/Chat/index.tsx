import { useCallback, useEffect, useRef } from "react";
import { Box, Button, Container, Flex, Textarea } from "@mantine/core";
import { BiSend } from "react-icons/bi";
import { useLocalStorage } from "@mantine/hooks";
import type MessageData from "../../../models/Message.ts";
import Message, { Stream } from "./Message.tsx";
import { useLlmContext } from "../../../context/LlmContext.tsx";
import useSendMessage from "../../../hooks/useSendMessage.tsx";

const MAX_MESSAGES_IN_HISTORY = 50;

export default function Chat() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { isStreaming } = useLlmContext();

  const [messages, setMessages] = useLocalStorage<MessageData[]>({ key: "messages", defaultValue: [] });

  const sendMessage = useSendMessage();

  const submit = useCallback(() => {
    const value = textareaRef.current?.value;
    if (!value || value.trim() === "") {
      console.debug("DEBUG - submit called without value");

      return;
    }

    const currentUserMessage: MessageData = { content: value.trim(), role: "user" };

    console.debug("DEBUG - submitting user message:", JSON.stringify(currentUserMessage, null, 2));

    setMessages((prevMessages) => [...prevMessages.slice(-MAX_MESSAGES_IN_HISTORY + 1), currentUserMessage]);

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    // Now, start the LLM response process:

    console.log("DEBUG - calling sendMessage to process LLM response");

    void sendMessage([...messages, currentUserMessage]);
  }, [sendMessage, setMessages, messages]);

  useEffect(() => {
    textareaRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener("keydown", handleKeyDown);

    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown);
    };
  }, [submit]);

  return (
    <Flex direction="column" flex={1} h="100vh" miw={768}>
      <Container h="100%" miw={768}>
        <Flex direction="column" flex={1} h="100%" p="xl" style={{ whiteSpace: "pre-wrap" }}>
          <Box flex={1} style={{ overflowY: "auto" }} mt="xl">
            {messages.length === 0 && (
              <Box c="gray" ta="center" mt="lg">
                The story has not yet begun...
              </Box>
            )}
            {messages.map((message, idx) => {
              return <Message key={`message-${idx}`} message={message} />;
            })}
            {isStreaming ? <Stream /> : null}
          </Box>
          <Box pos="relative" mb="xl" pt={4}>
            <Textarea
              description="Press ENTER to send. Press SHIFT + ENTER to add a new line."
              ref={textareaRef}
              placeholder="Type your command here..."
              minRows={4}
              maxRows={16}
              autosize
            />
            <Button
              ref={submitButtonRef}
              pos="absolute"
              right={12}
              bottom={12}
              variant="light"
              size="xs"
              disabled={isStreaming}
              onClick={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <BiSend />
            </Button>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
