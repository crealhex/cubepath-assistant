import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Read tools (SDK-direct)
import { registerListInstances } from "./tools/read/list-instances";
import { registerGetStatus } from "./tools/read/get-status";
import { registerListTemplates } from "./tools/read/list-templates";
import { registerListPricing } from "./tools/read/list-pricing";
import { registerListLocations } from "./tools/read/list-locations";
import { registerListProjects } from "./tools/read/list-projects";

// Write tools (SDK-direct, simple mode)
import { registerDeployVps } from "./tools/write/deploy-vps";
import { registerDestroyInstance } from "./tools/write/destroy-instance";
import { registerPowerAction } from "./tools/write/power-action";

// Managed tools (Terraform-backed) — not yet tested
// import { registerManagedDeployVps } from "./tools/managed/deploy-vps";
// import { registerManagedDestroyInstance } from "./tools/managed/destroy-instance";
// import { registerManagedShowState } from "./tools/managed/show-state";

const server = new McpServer({
  name: "cubepath-mcp",
  version: "0.1.0",
});

// Register all tools
registerListInstances(server);
registerGetStatus(server);
registerListTemplates(server);
registerListPricing(server);
registerListLocations(server);

registerListProjects(server);

registerDeployVps(server);
registerDestroyInstance(server);
registerPowerAction(server);

// registerManagedDeployVps(server);
// registerManagedDestroyInstance(server);
// registerManagedShowState(server);

// Start via stdio transport (standard MCP protocol)
const transport = new StdioServerTransport();
await server.connect(transport);
