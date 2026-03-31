import type { MockResponse } from "./types";
import * as pricing from "./pricing";
import * as deploy from "./deploy";
import * as instances from "./instances";
import * as projects from "./projects";
import * as error from "./error";
import { response as defaultResponse } from "./default";

export type { MockResponse };

const matchers = [pricing, deploy, instances, projects, error];

export function matchResponse(input: string): MockResponse {
  const lower = input.toLowerCase();
  for (const m of matchers) {
    if (m.match(lower)) return m.response;
  }
  return defaultResponse;
}
