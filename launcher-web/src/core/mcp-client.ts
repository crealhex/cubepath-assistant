export type ChatChunk =
  | { type: "text"; content: string }
  | { type: "done" };

export type ResourceStatus =
  | "operational"
  | "degraded"
  | "maintenance"
  | "outage";

export interface Resource {
  id: string;
  type: string;
  name: string;
  status: ResourceStatus;
  region: string;
  meta: Record<string, string>;
}

export interface McpClient {
  sendMessage(content: string): AsyncIterable<ChatChunk>;
  getResources(): Promise<Resource[]>;
  isConnected(): boolean;
}
