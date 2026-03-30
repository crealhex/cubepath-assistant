import { createContext, useContext, useMemo } from "react";
import type { McpClient } from "@/services/mcp-client";
import { createMockClient } from "@/services/mcp-mock";

interface AppContextValue {
  mcpClient: McpClient;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useMcpClient() {
  return useApp().mcpClient;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AppContextValue>(
    () => ({
      mcpClient: createMockClient(),
    }),
    [],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
