import { register, getDefinitions, execute } from "./registry";
import { tool as calculate } from "./calculate";
import { tool as listLocations } from "./list-locations";

register(calculate);
register(listLocations);

export { getDefinitions, execute };
