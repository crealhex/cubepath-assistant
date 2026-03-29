import type { Database } from "bun:sqlite";
import type { Project, Chat, Message } from "../types";

export function createQueries(db: Database) {
  return {
    // Projects
    listProjects(): Project[] {
      return db.query("SELECT * FROM projects ORDER BY created_at DESC").all() as Project[];
    },

    createProject(id: string, name: string): Project {
      db.run("INSERT INTO projects (id, name) VALUES (?, ?)", [id, name]);
      return db.query("SELECT * FROM projects WHERE id = ?").get(id) as Project;
    },

    deleteProject(id: string) {
      db.run("DELETE FROM projects WHERE id = ?", [id]);
    },

    // Chats
    listChats(projectId: string): Chat[] {
      return db.query(
        "SELECT * FROM chats WHERE project_id = ? ORDER BY updated_at DESC"
      ).all(projectId) as Chat[];
    },

    createChat(id: string, projectId: string, title?: string): Chat {
      db.run(
        "INSERT INTO chats (id, project_id, title) VALUES (?, ?, ?)",
        [id, projectId, title ?? "New Chat"],
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

    // Settings
    getSettings(): Record<string, string> {
      const rows = db.query("SELECT key, value FROM settings").all() as { key: string; value: string }[];
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    },

    setSetting(key: string, value: string) {
      db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    },

    setSettings(entries: Record<string, string>) {
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      for (const [key, value] of Object.entries(entries)) {
        stmt.run(key, value);
      }
    },
  };
}

export type Queries = ReturnType<typeof createQueries>;
