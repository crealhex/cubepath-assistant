const dir = new URL(".", import.meta.url).pathname;

const personality = await Bun.file(`${dir}personality.md`).text();
const componentProtocol = await Bun.file(`${dir}component-protocol.md`).text();
const rules = await Bun.file(`${dir}rules.md`).text();
const guardrails = await Bun.file(`${dir}guardrails.md`).text();

export const basePrompt = [personality, componentProtocol, rules, guardrails].join("\n\n");
