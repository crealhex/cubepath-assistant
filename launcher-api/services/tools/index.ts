import { register, getDefinitions, execute } from "./registry";
import { tool as calculate } from "./calculate";
// import { tool as display } from "./display";
import { tool as listLocations } from "./list-locations";

register(calculate);
// register(display);
register(listLocations);

export { getDefinitions, execute };
