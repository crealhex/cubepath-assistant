const dir = new URL(".", import.meta.url).pathname;

const overview = await Bun.file(`${dir}overview.md`).text();
const components = await Bun.file(`${dir}components.md`).text();

export const safePrompt = [overview, components].join("\n\n");
