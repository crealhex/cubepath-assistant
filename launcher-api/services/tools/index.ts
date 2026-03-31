import { register, getDefinitions, execute } from "./registry";
import { tool as calculate } from "./calculate";

register(calculate);

export { getDefinitions, execute };
