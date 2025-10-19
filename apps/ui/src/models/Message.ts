export default interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}
