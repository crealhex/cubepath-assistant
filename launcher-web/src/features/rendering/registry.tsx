import {
  InstanceCard,
  DeployProgress,
  ErrorCard,
  ProjectCard,
  VpsTable,
  LocationPicker,
  TemplatePicker,
  SshKeyPicker,
  BaremetalCard,
  BaremetalTable,
  CdnPlanCard,
  CdnTable,
  LbPlanCard,
  LbTable,
  ApprovalCard,
} from "cubepath-ui";

export interface ComponentData {
  component: string;
  props: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  "instance-card": InstanceCard,
  "deploy-progress": DeployProgress,
  "error-card": ErrorCard,
  "project-card": ProjectCard,
  "vps-table": VpsTable,
  "location-picker": LocationPicker,
  "template-picker": TemplatePicker,
  "ssh-key-picker": SshKeyPicker,
  "baremetal-card": BaremetalCard,
  "baremetal-table": BaremetalTable,
  "cdn-plan-card": CdnPlanCard,
  "cdn-table": CdnTable,
  "lb-plan-card": LbPlanCard,
  "lb-table": LbTable,
  "approval-card": ApprovalCard,
};

export function renderBlock(block: ComponentData, key: number) {
  const Component = componentMap[block.component];
  if (!Component) return null;
  return <Component key={key} {...block.props} />;
}
