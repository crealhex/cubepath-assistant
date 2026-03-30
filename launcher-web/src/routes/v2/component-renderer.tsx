import {
  InstanceCard,
  DeployProgress,
  ErrorCard,
  ProjectCard,
  PricingTable,
  LocationPicker,
  TemplatePicker,
  SshKeyPicker,
  BaremetalCard,
  BaremetalTable,
  CdnPlanCard,
  CdnTable,
  LbPlanCard,
  LbTable,
} from "cubepath-ui";
import type { ComponentBlock } from "./message-list";

// Dynamic lookup by string key — each component validates its own props at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  "instance-card": InstanceCard,
  "deploy-progress": DeployProgress,
  "error-card": ErrorCard,
  "project-card": ProjectCard,
  "pricing-table": PricingTable,
  "location-picker": LocationPicker,
  "template-picker": TemplatePicker,
  "ssh-key-picker": SshKeyPicker,
  "baremetal-card": BaremetalCard,
  "baremetal-table": BaremetalTable,
  "cdn-plan-card": CdnPlanCard,
  "cdn-table": CdnTable,
  "lb-plan-card": LbPlanCard,
  "lb-table": LbTable,
};

/** Group consecutive same-type blocks */
function groupBlocks(blocks: ComponentBlock[]): ComponentBlock[][] {
  const groups: ComponentBlock[][] = [];
  for (const block of blocks) {
    const last = groups[groups.length - 1];
    if (last && last[0].component === block.component) {
      last.push(block);
    } else {
      groups.push([block]);
    }
  }
  return groups;
}

function gridClass(count: number): string {
  if (count === 1) return "";
  if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 gap-3";
  return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3";
}

export function ComponentRenderer({ blocks }: { blocks: ComponentBlock[] }) {
  if (blocks.length === 0) return null;

  const groups = groupBlocks(blocks);

  return (
    <div className="flex flex-col gap-3 my-2">
      {groups.map((group, gi) => {
        const Component = componentMap[group[0].component];
        if (!Component) return null;

        if (group.length === 1) {
          return <Component key={gi} {...group[0].props} />;
        }

        return (
          <div key={gi} className={gridClass(group.length)}>
            {group.map((block, bi) => (
              <Component key={bi} {...block.props} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
