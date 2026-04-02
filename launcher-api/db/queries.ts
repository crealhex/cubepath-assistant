import type { Database } from "bun:sqlite";
import type { Project, Chat, Message } from "../types";

const DEFAULT_SETTINGS: Record<string, string> = {
  ai_provider: "cubepath",
  ai_model: "deepseek/deepseek-reasoner",
  cubepath_api_key: "",
  cubepath_gateway_url: "https://ai-gateway.cubepath.com",
  claude_cli_path: "claude",
  permission_tier: "safe",
};

export function createQueries(db: Database) {
  return {
    // Projects
    listProjects(userId: string): Project[] {
      return db.query("SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC").all(userId) as Project[];
    },

    createProject(id: string, userId: string, name: string): Project {
      db.run("INSERT INTO projects (id, user_id, name) VALUES (?, ?, ?)", [id, userId, name]);
      return db.query("SELECT * FROM projects WHERE id = ?").get(id) as Project;
    },

    deleteProject(id: string) {
      db.run("DELETE FROM projects WHERE id = ?", [id]);
    },

    // Chats
    listChats(projectId: string, userId: string): Chat[] {
      return db.query(
        "SELECT * FROM chats WHERE project_id = ? AND user_id = ? ORDER BY updated_at DESC"
      ).all(projectId, userId) as Chat[];
    },

    createChat(id: string, userId: string, projectId: string, title?: string): Chat {
      db.run(
        "INSERT INTO chats (id, user_id, project_id, title) VALUES (?, ?, ?, ?)",
        [id, userId, projectId, title ?? "New Chat"],
      );
      return db.query("SELECT * FROM chats WHERE id = ?").get(id) as Chat;
    },

    getChat(id: string): Chat | null {
      return (db.query("SELECT * FROM chats WHERE id = ?").get(id) as Chat) ?? null;
    },

    updateChatTitle(id: string, title: string) {
      db.run("UPDATE chats SET title = ?, updated_at = datetime('now') WHERE id = ?", [title, id]);
    },

    deleteChat(id: string) {
      db.run("DELETE FROM chats WHERE id = ?", [id]);
    },

    // Messages
    listMessages(chatId: string): Message[] {
      return db.query(
        "SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC"
      ).all(chatId) as Message[];
    },

    createMessage(id: string, chatId: string, role: "user" | "assistant", content: string): Message {
      db.run(
        "INSERT INTO messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)",
        [id, chatId, role, content],
      );
      db.run("UPDATE chats SET updated_at = datetime('now') WHERE id = ?", [chatId]);
      return db.query("SELECT * FROM messages WHERE id = ?").get(id) as Message;
    },

    // Settings (per user, with defaults)
    getSettings(userId: string): Record<string, string> {
      const rows = db.query("SELECT key, value FROM settings WHERE user_id = ?").all(userId) as { key: string; value: string }[];
      const saved = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return { ...DEFAULT_SETTINGS, ...saved };
    },

    setSetting(userId: string, key: string, value: string) {
      db.run("INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)", [userId, key, value]);
    },

    setSettings(userId: string, entries: Record<string, string>) {
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)");
      for (const [key, value] of Object.entries(entries)) {
        stmt.run(userId, key, value);
      }
    },

    // Bootstrap — ensure default project for new users
    ensureUser(userId: string) {
      const count = db.query("SELECT COUNT(*) as c FROM projects WHERE user_id = ?").get(userId) as { c: number };
      if (count.c === 0) {
        const id = crypto.randomUUID();
        db.run("INSERT INTO projects (id, user_id, name) VALUES (?, ?, ?)", [id, userId, "Default"]);
      }
    },
  };
}

export type Queries = ReturnType<typeof createQueries>;
