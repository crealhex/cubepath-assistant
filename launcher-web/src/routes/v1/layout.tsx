import { Outlet } from "react-router";
import { Badge, Button } from "cubepath-ui";
import { Settings } from "lucide-react";
import { useMcpClient } from "@/providers/app-provider";

export function AppLayout() {
  const mcpClient = useMcpClient();
  const connected = mcpClient.isConnected();

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">CubePath</span>
          <Badge variant={connected ? "operational" : "outage"}>
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="size-4" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
