import { registerQuery, registerCommand, getDefinitions, execute, getQueryTool } from "./registry";

// Queries — safe for frontend exposure
import { tool as calculate } from "./queries/calculate";
import { tool as listLocations } from "./queries/list-locations";
import { tool as listTemplates } from "./queries/list-templates";
import { tool as listVpsPlans } from "./queries/list-vps-plans";

registerQuery(calculate);
registerQuery(listLocations);
registerQuery(listTemplates);
registerQuery(listVpsPlans);

// Commands — AI-only, behind approval flow
// import { tool as display } from "./commands/display";
// registerCommand(display);

export { getDefinitions, execute, getQueryTool };
