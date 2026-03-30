const BASE = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3001`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

// --- Types matching backend ---

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
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ComponentBlock {
  component: string;
  props: Record<string, unknown>;
}

export type ChatChunk =
  | { type: "text"; content: string }
  | { type: "component"; block: ComponentBlock }
  | { type: "done" };

export type Settings = Record<string, string>;

// --- API ---

export const api = {
  // Projects
  listProjects: () => request<Project[]>("/api/projects"),
  createProject: (name: string) => request<Project>("/api/projects", { method: "POST", body: JSON.stringify({ name }) }),
  deleteProject: (id: string) => request<void>(`/api/projects/${id}`, { method: "DELETE" }),

  // Chats
  listChats: (projectId: string) => request<Chat[]>(`/api/projects/${projectId}/chats`),
  createChat: (projectId: string, title?: string) => request<Chat>(`/api/projects/${projectId}/chats`, { method: "POST", body: JSON.stringify({ title }) }),
  deleteChat: (id: string) => request<void>(`/api/chats/${id}`, { method: "DELETE" }),

  // Chat detail
  getChat: (chatId: string) => request<Chat>(`/api/chats/${chatId}`),

  // Messages
  listMessages: (chatId: string) => request<Message[]>(`/api/chats/${chatId}/messages`),

  // Streaming
  async *streamMessage(chatId: string, content: string): AsyncIterable<ChatChunk> {
    const res = await fetch(`${BASE}/api/chats/${chatId}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      yield { type: "text", content: `Error: ${res.status} ${await res.text()}` };
      yield { type: "done" };
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) { yield { type: "done" }; return; }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        try {
          const chunk = JSON.parse(trimmed.slice(6)) as ChatChunk;
          yield chunk;
        } catch { /* skip */ }
      }
    }

    yield { type: "done" };
  },

  // Settings
  getSettings: () => request<Settings>("/api/settings"),
  updateSettings: (settings: Settings) => request<{ ok: boolean }>("/api/settings", { method: "PUT", body: JSON.stringify(settings) }),
};
