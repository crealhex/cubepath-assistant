import type { ReactNode } from "react";
import type { RenderSegment } from "./parser";

type ComponentSegment = RenderSegment & { type: "component-block" };
type RenderAdapter = (props: { segment: ComponentSegment }) => ReactNode;

const adapters = new Map<string, RenderAdapter>();

export function registerAdapter(name: string, adapter: RenderAdapter) {
  adapters.set(name, adapter);
}

export function dispatch(segment: ComponentSegment, strategy = "inline-chat"): ReactNode {
  const adapter = adapters.get(strategy);
  if (!adapter) return null;
  return adapter({ segment });
}

export type { ComponentSegment, RenderAdapter };
