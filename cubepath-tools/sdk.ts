import { CubePath } from "@cubepath/sdk";

export function getCubePathClient(apiKey: string): CubePath {
  return new CubePath({ apiKey });
}
