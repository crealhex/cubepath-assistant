export interface Project {
  id: string;
  name: string;
  created_at: string;
}

export interface Chat {
  id: string;
  project_id: string;
  title: string;
  model: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface ComponentBlock {
  id: string;
  component: string;
  props: Record<string, unknown>;
}

export type ChatChunk =
  | { type: "text"; content: string }
  | { type: "component"; block: ComponentBlock }
  | { type: "done" };

export interface AiGateway {
  stream(messages: Message[], tools?: unknown[]): AsyncIterable<ChatChunk>;
}

export type AiProvider = "cubepath" | "claude-cli" | "mock";
