import { CubePath } from "@cubepath/sdk";

let instance: CubePath | null = null;

export function getCubePathClient(apiKey?: string): CubePath {
  const key = apiKey || process.env.CUBEPATH_API_KEY;
  if (!key) throw new Error("CUBEPATH_API_KEY is required");

  if (!instance) {
    instance = new CubePath({ apiKey: key });
  }
  return instance;
}

export function resetClient() {
  instance = null;
}
