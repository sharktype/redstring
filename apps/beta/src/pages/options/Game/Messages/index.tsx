import { Box, Button, Container, Flex, Textarea } from "@mantine/core";
import { useRef } from "react";
import { BiSend } from "react-icons/bi";

export default function Messages() {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<Flex h="100vh">
			<Container id="messages" size="lg" flex={1} h="100%">
				<Container h="100%">
					<Flex
						id="outer-messages-flex"
						direction="column"
						flex={1}
						h="100%"
						mx="md"
						px="lg"
					>
						<Box
							id="message-history"
							ref={scrollContainerRef}
							flex={1}
							style={{ overflowY: "auto" }}
							mt="md"
						>
							<h1>Your story awaits...</h1>
						</Box>
						<Box id="message-input" pos="relative" mt={4} mb="xl">
							<Textarea
								description="Press ENTER to send. Press SHIFT + ENTER to add a new line."
								ref={textareaRef}
								placeholder="Type your command here..."
								minRows={5}
								maxRows={16}
								autosize
							/>
							<Button
								pos="absolute"
								right={12}
								bottom={12}
								variant="light"
								size="xs"

								onClick={(e) => {
									e.preventDefault();
								}}
							>
								<BiSend />
							</Button>
						</Box>
					</Flex>
				</Container>
			</Container>
			<Box h="100%" w="calc(var(--app-shell-navbar-width) * 3)">
				<Box
					h="100%"
					bg="var(--mantine-color-body)"
					p="md"
					style={{
						borderLeft: "1px solid var(--app-shell-border-color)",
					}}
				>
					<p>Current Location</p>
					<p>Location 1: Distance (North West)</p>
					<p>Location 2: Distance (South East)</p>
					<p>...and so on</p>
				</Box>
			</Box>
		</Flex>
	);
}
