import type { MockResponse } from "./types";

export const match = (s: string) => /project/.test(s);

export const response: MockResponse = {
  text: `Here's an overview of your projects. Each project acts as a container for your servers, networks, and other resources.

{{begin:project-card}}
{{project-card:0}}
{{project-card:1}}
{{end:project-card}}

Your **first-project** has 3 active instances, while **staging** is empty and ready for new deployments. Would you like to create a new project, or dive into one of these?`,
  componentData: {
    "project-card:0": { component: "project-card", props: { id: 3065, name: "first-project", description: "Default project", vpsCount: 3 } },
    "project-card:1": { component: "project-card", props: { id: 3066, name: "staging", description: "Staging environment", vpsCount: 0 } },
  },
};
