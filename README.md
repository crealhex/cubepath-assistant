# CubePath Assistant

Chat-first infrastructure management for CubePath Cloud. Deploy servers, manage resources, and plan architecture through natural conversation with AI-powered interactive components.

## What is this?

CubePath Assistant is an AI-powered chat interface that lets you manage your CubePath cloud infrastructure through natural language. Instead of clicking through dashboards, you talk to an assistant that understands your intent, shows interactive components inline, and executes operations with your approval.

**Ask it anything:**
- "Where are your datacenters?" → Interactive location picker with live latency pings
- "What plans do you have in Barcelona?" → Clustered pricing table with tabbed navigation
- "Deploy a WordPress site" → Step-by-step questionnaire + approval card, executes on confirmation
- "Show me my servers" → Instance cards with full plan details and status badges
- "What SSH keys do I have?" → SSH key list with fingerprints

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│ launcher-web │────▶│ launcher-api │────▶│ CubePath AI      │
│ React + Vite │     │ Bun.serve    │     │ Gateway (26 models)
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────┴───────┐
                    │cubepath-tools│
                    │ Typed tools  │
                    │ + SDK        │
                    └──────┬───────┐
                           │       │
                    ┌──────┴──┐ ┌──┴──────────┐
                    │@cubepath│ │  mcp-server  │
                    │  /sdk   │ │ 12+ tools    │
                    └─────────┘ └──────────────┘
```

### Packages

| Package | Purpose |
|---------|---------|
| **cubepath-ui** | Design system matching CubePath's visual identity. Tailwind v4, Radix UI, CVA. 20+ components. |
| **cubepath-tools** | Type-safe tool definitions with 4 discriminated kinds (ComputationTool, ReadTool, AuthReadTool, AuthWriteTool). Shared by MCP server and launcher-api. |
| **launcher-web** | React frontend with feature-based architecture, inline component rendering, rendering port/adapter pattern, and above-input questionnaire. |
| **launcher-api** | Bun.serve backend with type-safe tool dispatcher, three-tier permission system (safe/write/destructive), SSE streaming, and per-user isolation. |
| **mcp-server** | MCP server with 12+ tools for CubePath infrastructure management. Works with Claude Desktop, VS Code, and any MCP client. |

## Key Features

### Inline Component Rendering
The AI writes tagged blocks in its responses (`{{component:count}}...{{/component}}`). A rendering port dispatches to adapters — currently an inline chat adapter that hydrates components via tool references or inline props. The architecture supports future adapters (popups, sidebars, input stacks).

### Type-Safe Tool System
Tools declare their kind via discriminated unions — `ComputationTool`, `ReadTool`, `AuthReadTool`, `AuthWriteTool`. The compiler enforces correct execute signatures: computation/read tools take `(args)`, auth tools take `(args, { apiKey })`. A centralized dispatcher with exhaustive switch ensures every kind is handled.

### Three-Tier Permission System
Users choose their permission level in settings: **Safe** (read-only), **Write** (create resources with approval), or **Full** (includes destructive operations). Tools above the user's tier are invisible to the AI — it can't call what it can't see.

### Interactive Questionnaire
The AI triggers a step-by-step questionnaire that renders above the chat input. Users click through options, and answers are collected and sent as context with the next message. Supports custom text input and skip.

### Reference Hydration
For data-heavy components, the AI writes a lightweight tool reference instead of dumping raw data. The frontend fetches from the backend and renders. The AI stays fast, the data stays complete.

### Approval Flow
Write operations (deploy, destroy, power actions) require user confirmation. The permission tier gate + confirmed flag ensures the AI cannot execute mutations without explicit user approval.

### Live Latency Pings
The location picker pings CubePath datacenters in real-time using burst-median measurement (5 pings, take the median). Color-coded latency badges per region.

### Per-User Isolation
Anonymous UUID stored in localStorage. Each user gets their own projects, chats, settings, and API key (BYOK). No login required.

### Onboarding
First-time visitors see a full-screen onboarding page with animated CubePath logo (scatter-assemble entrance + typewriter titles), API key input, and theme toggle.

### Multi-Model Support
Settings modal lets users choose from 26 AI models across DeepSeek, OpenAI, Anthropic, Google, and xAI — all through CubePath's AI Gateway with one API key.

## Tech Stack

- **Runtime**: Bun
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Radix UI
- **Backend**: Bun.serve, SQLite, SSE streaming
- **AI**: CubePath AI Gateway (OpenAI-compatible), 26 models
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
DEBUG=launcher:* bun --watch index.ts

# Terminal 2 — Frontend
cd launcher-web
bun run dev -- --host
```

Open the app, enter your CubePath API key in the onboarding screen, and start chatting.

### Run (MCP Server)

```bash
cd mcp-server
CUBEPATH_API_KEY=your_key bun run index.ts
```

Add to your Claude Desktop or VS Code MCP config to use CubePath tools directly.

## Tool Inventory

| Tool | Kind | Description |
|------|------|-------------|
| `calculate` | Computation | Safe math evaluation via mathjs |
| `display` | Computation | UI component hydration signal |
| `list-locations` | Read | Datacenter locations from static data |
| `list-vps-plans` | Read | VPS pricing from static data |
| `list-instances` | AuthRead | All VPS instances across projects |
| `get-instance-status` | AuthRead | Single instance detail |
| `list-projects` | AuthRead | CubePath projects |
| `list-templates` | AuthRead | OS and 1-click app templates |
| `list-ssh-keys` | AuthRead | SSH keys in account |
| `deploy-vps` | AuthWrite | Deploy a new VPS instance |
| `destroy-instance` | AuthWrite | Permanently destroy a VPS |
| `power-action` | AuthWrite | Start/stop/restart a VPS |

## CubePath Services Used

- **CubePath VPS** — Server deployment, management, and monitoring
- **CubePath AI Gateway** — Multi-model AI proxy (DeepSeek, GPT-4, Claude, Gemini, Grok)
- **@cubepath/sdk** — Official SDK for infrastructure operations
- **CubePath Ping Endpoints** — Real-time datacenter latency measurement

## License

MIT
