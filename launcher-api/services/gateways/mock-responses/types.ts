export interface MockResponse {
  text: string;
  componentData?: Record<string, { component: string; props: Record<string, unknown> }>;
}
