import { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Flex, Textarea } from "@mantine/core";
import { BiSend } from "react-icons/bi";
import { useLocalStorage } from "@mantine/hooks";
import type MessageData from "../../../models/Message.ts";
import Message from "./Message.tsx";

export default function Chat() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isLlmTyping] = useState(false);
  const [messages, setMessages] = useLocalStorage<MessageData[]>({ key: "messages", defaultValue: [] });

  const submit = () => {
    const value = textareaRef.current?.value;
    if (!value || value.trim() === "") {
      return;
    }

    setMessages((prevMessages) => [...prevMessages, { content: value.trim(), role: "user" }]);

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        submit();
      }
    });
  }, []);

  console.log(messages);

  return (
    <Flex direction="column" flex={1} h="100vh" miw={768}>
      <Container h="100%" miw={768}>
        <Flex direction="column" flex={1} h="100%" p="xl" style={{ whiteSpace: "pre-wrap" }}>
          <Box flex={1} style={{ overflowY: "auto" }} mt="xl">
            {messages.map((message, idx) => {
              return <Message key={`message-${idx}`} message={message} />;
            })}
          </Box>
          <Box pos="relative" mb="xl">
            <Textarea
              description="Press ENTER to send. Press SHIFT + ENTER to add a new line."
              ref={textareaRef}
              placeholder="Type your command here..."
              minRows={4}
              maxRows={16}
              autosize
            />
            <Button
              pos="absolute"
              right={12}
              bottom={12}
              variant="light"
              size="xs"
              disabled={isLlmTyping}
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
