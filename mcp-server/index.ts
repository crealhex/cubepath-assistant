import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Read tools (SDK-direct)
import { registerListInstances } from "./tools/read/list-instances";
import { registerGetStatus } from "./tools/read/get-status";
import { registerListTemplates } from "./tools/read/list-templates";
import { registerListVpsPlans } from "./tools/read/list-vps-plans";
import { registerListBaremetalModels } from "./tools/read/list-baremetal-models";
import { registerListCdnPlans } from "./tools/read/list-cdn-plans";
import { registerListLbPlans } from "./tools/read/list-lb-plans";
import { registerListLocations } from "./tools/read/list-locations";
import { registerListProjects } from "./tools/read/list-projects";
import { registerListSshKeys } from "./tools/read/list-ssh-keys";

// Utility tools
import { registerCalculate } from "./tools/utility/calculate";

// Write tools (SDK-direct, simple mode)
import { registerDeployVps } from "./tools/write/deploy-vps";
import { registerDestroyInstance } from "./tools/write/destroy-instance";
import { registerPowerAction } from "./tools/write/power-action";

// Managed tools (Terraform-backed) — not yet tested
// import { registerManagedDeployVps } from "./tools/managed/deploy-vps";
// import { registerManagedDestroyInstance } from "./tools/managed/destroy-instance";
// import { registerManagedShowState } from "./tools/managed/show-state";

// Startup validation — crash immediately if API key is missing
const CUBEPATH_API_KEY = process.env.CUBEPATH_API_KEY;
if (!CUBEPATH_API_KEY) {
  throw new Error("CUBEPATH_API_KEY environment variable is required");
}

const server = new McpServer({
  name: "cubepath-mcp",
  version: "0.1.0",
});

// Register all tools
registerListInstances(server);
registerGetStatus(server);
registerListTemplates(server);
registerListVpsPlans(server);
registerListBaremetalModels(server);
registerListCdnPlans(server);
registerListLbPlans(server);
registerListLocations(server);

registerListProjects(server);
registerListSshKeys(server);

registerCalculate(server);

registerDeployVps(server);
registerDestroyInstance(server);
registerPowerAction(server);

// registerManagedDeployVps(server);
// registerManagedDestroyInstance(server);
// registerManagedShowState(server);

// Start via stdio transport (standard MCP protocol)
const transport = new StdioServerTransport();
await server.connect(transport);
