# CubePath Assistant

Chat-first infrastructure management for CubePath Cloud. Deploy servers, manage resources, and plan architecture through natural conversation with AI-powered interactive components.

## What is this?

CubePath Assistant is an AI-powered chat interface that lets you manage your CubePath cloud infrastructure through natural language. Instead of clicking through dashboards, you talk to an assistant that understands your intent, shows interactive components inline, and executes operations with your approval.

**Ask it anything:**
- "Where are your datacenters?" → Interactive location picker with live latency pings
- "What plans do you have in Barcelona?" → Pricing table rendered inline
- "Deploy a WordPress site" → Approval card with full details, executes on confirmation

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│ launcher-web │────▶│ launcher-api │────▶│ CubePath AI      │
│ React + Vite │     │ Bun.serve    │     │ Gateway (DeepSeek)│
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────┴───────┐
                    │cubepath-tools│
                    │ Shared tools │
                    │ + SDK        │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │ @cubepath/sdk│
                    │ CubePath API │
                    └──────────────┘
```

### Packages

| Package | Purpose |
|---------|---------|
| **cubepath-ui** | Design system matching CubePath's visual identity. Tailwind v4, Radix UI, CVA. 20+ components. |
| **cubepath-tools** | Shared AI-ready tool definitions with Zod schemas and execution logic. Used by both MCP server and launcher-api. |
| **launcher-web** | React frontend with inline component rendering protocol. Components spawn in chat via tagged blocks. |
| **launcher-api** | Bun.serve backend with CubePath AI Gateway integration, tool registry (CQRS), SSE streaming, and per-user isolation. |
| **mcp-server** | MCP server with 15+ tools for CubePath infrastructure management. Works with Claude Desktop, VS Code, and any MCP client. |

## Key Features

### Inline Component Rendering
The AI writes tagged blocks in its responses. The frontend parses them and renders interactive React components inline in the chat — location pickers, pricing tables, instance cards, approval cards.

### Reference Hydration
For large datasets, the AI writes a lightweight tool reference instead of dumping raw data. The frontend fetches from the backend and renders. The AI stays fast, the data stays complete.

### Approval Flow
Write operations (deploy, destroy, resize) always show an approval card first. The user reviews the details and confirms before anything executes.

### Live Latency Pings
The location picker pings CubePath datacenters in real-time, showing color-coded latency for each region. Uses CubePath's ping endpoints with IP fallback.

### Per-User Isolation
Anonymous UUID stored in localStorage. Each user gets their own projects, chats, and settings. No login required.

### Dual-Mode Architecture
- **Local mode**: Claude Agent SDK + MCP server for developers using their Claude account
- **Hosted mode**: CubePath AI Gateway for multi-user deployment

## Tech Stack

- **Runtime**: Bun
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Radix UI
- **Backend**: Bun.serve, SQLite, SSE streaming
- **AI**: CubePath AI Gateway (OpenAI-compatible), DeepSeek
- **Infrastructure SDK**: @cubepath/sdk
- **Validation**: Zod v4
- **Component Protocol**: Custom tagged block parser with skeleton loading

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- A [CubePath](https://cubepath.com) account with API key

### Install

```bash
git clone https://github.com/crealhex/cubepath-assistant.git
cd cubepath-assistant
bun install
```

### Run (Development)

```bash
# Terminal 1 — API server
cd launcher-api
CUBEPATH_API_KEY=your_key bun --watch index.ts

# Terminal 2 — Frontend
cd launcher-web
bun run dev -- --host
```

Open the app, click the gear icon, paste your CubePath API key, and start chatting.

### Run (MCP Server)

```bash
cd mcp-server
CUBEPATH_API_KEY=your_key bun run index.ts
```

Add to your Claude Desktop or VS Code MCP config to use CubePath tools directly.

## CubePath Services Used

- **CubePath VPS** — Server deployment and management
- **CubePath AI Gateway** — Multi-model AI proxy (DeepSeek, GPT-4, Claude, Gemini)
- **@cubepath/sdk** — Official SDK for infrastructure operations
- **CubePath Ping Endpoints** — Real-time datacenter latency measurement

## License

MIT
