const dir = new URL(".", import.meta.url).pathname;

const overview = await Bun.file(`${dir}overview.md`).text();
const approvalFlow = await Bun.file(`${dir}approval-flow.md`).text();
const components = await Bun.file(`${dir}components.md`).text();

export const writePrompt = [overview, approvalFlow, components].join("\n\n");
