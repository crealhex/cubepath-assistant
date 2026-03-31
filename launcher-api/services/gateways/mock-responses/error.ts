import type { MockResponse } from "./types";

export const match = (s: string) => /error|fail/.test(s);

export const response: MockResponse = {
  text: `Hmm, looks like something didn't go as planned. Here's what happened:

{{error-card:0}}

The location name was slightly off — CubePath uses short codes like \`eu-bcn-1\` for Barcelona. Want me to retry with the correct location?`,
  componentData: {
    "error-card:0": { component: "error-card", props: { title: "Deployment failed", message: "Location 'eu-barcelona' does not exist.", suggestion: "Try using 'eu-bcn-1' instead." } },
  },
};
