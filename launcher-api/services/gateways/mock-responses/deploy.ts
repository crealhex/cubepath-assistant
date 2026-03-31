import type { MockResponse } from "./types";

export const match = (s: string) => /deploy|create|new/.test(s);

export const response: MockResponse = {
  text: `Alright, let's spin up a new server! I'm setting up a **gp.nano** instance in Barcelona for you. This should only take a minute or so.

{{deploy-progress:0}}

I'll keep an eye on this for you. Once it's ready, you'll be able to SSH in right away. Want me to add any SSH keys to it, or would you prefer a root password?`,
  componentData: {
    "deploy-progress:0": { component: "deploy-progress", props: { name: "hackathon-test", plan: "gp.nano", location: "eu-bcn-1", currentStep: "deploying" } },
  },
};
