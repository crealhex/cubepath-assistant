import { Database } from "bun:sqlite";

export function initDb(path = "launcher.db"): Database {
  const db = new Database(path, { create: true });

  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'New Chat',
      model TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default project if none exists
  const count = db.query("SELECT COUNT(*) as c FROM projects").get() as { c: number };
  if (count.c === 0) {
    const id = crypto.randomUUID();
    db.run("INSERT INTO projects (id, name) VALUES (?, ?)", [id, "Default"]);
  }

  // Seed default settings
  const upsert = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  upsert.run("ai_provider", "mock");
  upsert.run("ai_model", "gpt-4o");
  upsert.run("openai_api_key", "");
  upsert.run("openai_base_url", "https://api.openai.com/v1");
  upsert.run("claude_cli_path", "claude");
  upsert.run("cubepath_token", "");

  return db;
}
