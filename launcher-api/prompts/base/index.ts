const dir = new URL(".", import.meta.url).pathname;

const personality = await Bun.file(`${dir}personality.md`).text();
const componentProtocol = await Bun.file(`${dir}component-protocol.md`).text();
const rules = await Bun.file(`${dir}rules.md`).text();
const antiInjection = await Bun.file(`${dir}anti-injection.md`).text();

export const basePrompt = [personality, componentProtocol, rules, antiInjection].join("\n\n");
