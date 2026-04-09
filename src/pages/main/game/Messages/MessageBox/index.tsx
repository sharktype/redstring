import type Message from "../../../../../models/Message";
import AssistantMessageBox from "./AssistantMessageBox";
import SystemMessageBox from "./SystemMessageBox";
import UserMessageBox from "./UserMessageBox";

export default function MessageBox({ message }: { message: Message }) {
	switch (message.role) {
		case "user":
			return <UserMessageBox message={message} />;
		case "assistant":
			return <AssistantMessageBox message={message} />;
		case "system":
			return <SystemMessageBox message={message} />;
		default:
			return null;
	}
}
