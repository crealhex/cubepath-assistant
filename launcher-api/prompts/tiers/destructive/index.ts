const dir = new URL(".", import.meta.url).pathname;

const overview = await Bun.file(`${dir}overview.md`).text();

export const destructivePrompt = [overview].join("\n\n");
