import { registerSafe, registerWrite, registerDestructive, getDefinitions, execute, getQueryTool } from "./registry";
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

registerSafe(calculate);
registerSafe(listLocations);
registerSafe(listProjects);
registerSafe(listTemplates);
registerSafe(listVpsPlans);
registerSafe(listInstances);
registerSafe(getInstanceStatus);
registerSafe(listSshKeys);

// Commands — AI-only, behind approval flow
import { tool as deployVps } from "./commands/deploy-vps";
// import { tool as display } from "./commands/display";

registerWrite(deployVps);
import { tool as powerAction } from "./commands/power-action";
registerWrite(powerAction);
// registerWrite(display);

// Destructive — requires full mode + user confirmation
import { tool as destroyInstance } from "./commands/destroy-instance";

registerDestructive(destroyInstance);

export { getDefinitions, execute, getQueryTool };
