import { registerQuery, registerCommand, registerDestructive, getDefinitions, execute, getQueryTool } from "./registry";
export type { PermissionTier } from "./registry";

// Queries — safe for frontend exposure
import { tool as calculate } from "./queries/calculate";
import { tool as listLocations } from "./queries/list-locations";
import { tool as listProjects } from "./queries/list-projects";
import { tool as listTemplates } from "./queries/list-templates";
import { tool as listVpsPlans } from "./queries/list-vps-plans";
import { tool as listInstances } from "./queries/list-instances";
import { tool as getInstanceStatus } from "./queries/get-instance-status";
import { tool as listSshKeys } from "./queries/list-ssh-keys";

registerQuery(calculate);
registerQuery(listLocations);
registerQuery(listProjects);
registerQuery(listTemplates);
registerQuery(listVpsPlans);
registerQuery(listInstances);
registerQuery(getInstanceStatus);
registerQuery(listSshKeys);

// Commands — AI-only, behind approval flow
import { tool as deployVps } from "./commands/deploy-vps";
// import { tool as display } from "./commands/display";

registerCommand(deployVps);
// registerCommand(display);

export { getDefinitions, execute, getQueryTool };
