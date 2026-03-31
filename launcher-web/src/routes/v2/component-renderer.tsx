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
  ApprovalCard,
} from "cubepath-ui";
import type { ComponentData } from "./message-list";

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
  "approval-card": ApprovalCard,
};

function renderBlock(block: ComponentData, key: number) {
  const Component = componentMap[block.component];
  if (!Component) return null;
  return <Component key={key} {...block.props} />;
}

/**
 * Layout breakpoints:
 * - 1 block: centered, max-width constrained
 * - 2-3 blocks: horizontal row (desktop), stacked (mobile)
 * - 4+ blocks: horizontal carousel
 */
export function ComponentRenderer({ blocks }: { blocks: ComponentData[] }) {
  if (blocks.length === 0) return null;

  // Single component — centered
  if (blocks.length === 1) {
    return (
      <div className="flex justify-center">
        {renderBlock(blocks[0], 0)}
      </div>
    );
  }

  // 2-3 components — responsive row
  if (blocks.length <= 3) {
    const cols = blocks.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3";

    return (
      <div className={cols}>
        {blocks.map((block, i) => renderBlock(block, i))}
      </div>
    );
  }

  // 4+ components — horizontal carousel
  return (
    <div className="relative group/carousel">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {blocks.map((block, i) => (
          <div key={i} className="snap-start shrink-0 w-[280px]">
            {renderBlock(block, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
