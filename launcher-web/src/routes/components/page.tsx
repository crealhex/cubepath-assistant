import { useState } from "react";
import {
  InstanceCard,
  DeployProgress,
  ErrorCard,
  LocationPicker,
  PricingTable,
  ProjectCard,
  TemplatePicker,
  SshKeyPicker,
  type DeployStep,
  type LocationOption,
  type PlanRow,
  type TemplateOption,
  type SshKeyOption,
} from "cubepath-ui";
import { getTemplateIcon } from "@/assets/icons";
import { useLatency, type LatencyTarget } from "@/hooks/use-latency";

const locations: LocationOption[] = [
  { location_name: "eu-bcn-1", code: "BCN", city: "Barcelona", country: "Spain", region: "Europe", services: ["vps", "baremetal"], test_ipv4: "194.26.100.2" },
  { location_name: "eu-ams-1", code: "AMS", city: "Amsterdam", country: "Netherlands", region: "Europe", services: ["network"], test_ipv4: "92.60.253.90" },
  { location_name: "us-mia-1", code: "MIA", city: "Miami", country: "United States", region: "North America", services: ["vps", "baremetal"], test_ipv4: "157.254.174.2" },
  { location_name: "us-hou-1", code: "HOU", city: "Houston", country: "United States", region: "North America", services: ["vps", "baremetal"], test_ipv4: "108.165.47.2" },
  { location_name: "us-va-1", code: "VA", city: "Ashburn", country: "United States", region: "North America", services: ["network"], test_ipv4: "198.47.110.18" },
];

const plans: PlanRow[] = [
  { plan: "gp.nano", vcpu: 1, ram_gb: 2, storage_gb: 40, bandwidth_tb: 3, price_monthly: 5.56, price_hourly: 0.0076 },
  { plan: "gp.micro", vcpu: 2, ram_gb: 4, storage_gb: 80, bandwidth_tb: 5, price_monthly: 9.61, price_hourly: 0.0132 },
  { plan: "gp.starter", vcpu: 4, ram_gb: 8, storage_gb: 100, bandwidth_tb: 10, price_monthly: 16.71, price_hourly: 0.0229 },
  { plan: "gp.small", vcpu: 8, ram_gb: 16, storage_gb: 200, bandwidth_tb: 20, price_monthly: 30.90, price_hourly: 0.0423 },
  { plan: "gp.medium", vcpu: 12, ram_gb: 32, storage_gb: 300, bandwidth_tb: 40, price_monthly: 57.26, price_hourly: 0.0784 },
];

const templates: TemplateOption[] = [
  { name: "ubuntu-24", os: "Ubuntu 24", version: "24", icon: getTemplateIcon("ubuntu-24") },
  { name: "ubuntu-22", os: "Ubuntu 22", version: "22", icon: getTemplateIcon("ubuntu-22") },
  { name: "debian-12", os: "Debian 12", version: "12", icon: getTemplateIcon("debian-12") },
  { name: "almalinux-9", os: "Alma Linux 9", version: "9", icon: getTemplateIcon("almalinux-9") },
  { name: "rockylinux-9", os: "Rocky Linux 9", version: "9", icon: getTemplateIcon("rockylinux-9") },
  { name: "fedora-39", os: "Fedora 39", version: "39", icon: getTemplateIcon("fedora-39") },
  { name: "centos-9-stream", os: "Centos 9 Stream", version: "9", icon: getTemplateIcon("centos-9-stream") },
  { name: "windowsserver-2022", os: "Windows Server 2022", version: "22", icon: getTemplateIcon("windowsserver-2022") },
];

const sshKeys: SshKeyOption[] = [
  { id: 1, name: "work-laptop", fingerprint: "SHA256:xR3j8...k9Lm" },
  { id: 2, name: "deploy-key", fingerprint: "SHA256:pQ7w2...nB4x" },
];

const deploySteps: DeployStep[] = ["initiated", "provisioning", "configuring", "ready", "error"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  const [selectedLocation, setSelectedLocation] = useState("eu-bcn-1");
  const [selectedPlan, setSelectedPlan] = useState("gp.nano");
  const [selectedTemplate, setSelectedTemplate] = useState("ubuntu-24");
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["work-laptop"]);
  const [deployStep, setDeployStep] = useState<DeployStep>("provisioning");

  const pingTargets: LatencyTarget[] = [
    { location_name: "eu-bcn-1", strategy: "api", ping_code: "bcn" },
    { location_name: "eu-ams-1", strategy: "ip", ip: "92.60.253.90" },
    { location_name: "us-mia-1", strategy: "api", ping_code: "mia" },
    { location_name: "us-hou-1", strategy: "api", ping_code: "hou" },
    { location_name: "us-va-1", strategy: "ip", ip: "198.47.110.18" },
  ];
  const latencies = useLatency(pingTargets);
  const locationsWithPing = locations.map((l) => ({
    ...l,
    latency: latencies[l.location_name] ?? null,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        <div>
          <h1 className="text-xl font-bold">Chat Components</h1>
          <p className="text-sm text-muted-foreground mt-1">
            These spawn inline in assistant messages during chat.
          </p>
        </div>

        <Section title="Instance Card">
          <InstanceCard
            id={23706}
            name="hackathon-test"
            status="running"
            project="first-project"
            ip="194.26.100.42"
            plan={{ plan_name: "gp.nano", cpu: 1, ram: 2048, storage: 40, bandwidth: 3, price_per_hour: "0.00556" }}
            location="Barcelona, Spain"
            template="Ubuntu 24"
            onPowerAction={(id, action) => console.log("power", id, action)}
            onDestroy={(id) => console.log("destroy", id)}
          />
          <InstanceCard
            id={23707}
            name="api-server"
            status="deploying"
            project="first-project"
            plan={{ plan_name: "gp.starter", cpu: 4, ram: 8192, storage: 100, bandwidth: 10, price_per_hour: "0.02290" }}
            location="Miami, FL"
            template="Debian 12"
          />
          <InstanceCard
            id={23708}
            name="db-replica"
            status="stopped"
            project="first-project"
            ip="157.254.174.88"
            plan={{ plan_name: "gp.small", cpu: 8, ram: 16384, storage: 200, bandwidth: 20, price_per_hour: "0.04230" }}
            location="Houston, TX"
            template="Ubuntu 24"
            onPowerAction={(id, action) => console.log("power", id, action)}
            onDestroy={(id) => console.log("destroy", id)}
          />
        </Section>

        <Section title="Deploy Progress">
          <div className="flex flex-wrap gap-2 mb-2">
            {deploySteps.map((step) => (
              <button
                key={step}
                onClick={() => setDeployStep(step)}
                className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                  deployStep === step
                    ? "border-primary text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          <DeployProgress
            name="hackathon-test"
            plan="gp.nano"
            location="eu-bcn-1"
            currentStep={deployStep}
          />
        </Section>

        <Section title="Error Card">
          <ErrorCard
            message="Location not found. The specified region 'eu-barcelona' does not exist."
            suggestion="Try using 'eu-bcn-1' instead."
            onRetry={() => console.log("retry")}
          />
          <ErrorCard
            title="Permission denied"
            message="Your API key does not have access to destroy instances."
          />
        </Section>

        <Section title="Project Card">
          <ProjectCard
            id={3065}
            name="first-project"
            description="Default project"
            vpsCount={3}
          />
          <ProjectCard
            id={3066}
            name="staging"
            description="Staging environment for QA"
            vpsCount={0}
          />
        </Section>

        <Section title="Location Picker">
          <LocationPicker
            locations={locationsWithPing}
            selected={selectedLocation}
            onSelect={setSelectedLocation}
          />
        </Section>

        <Section title="Pricing Table">
          <PricingTable
            plans={plans}
            recommended="gp.starter"
            selected={selectedPlan}
            onSelect={setSelectedPlan}
          />
        </Section>

        <Section title="Template Picker">
          <TemplatePicker
            templates={templates}
            selected={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        </Section>

        <Section title="SSH Key Picker">
          <SshKeyPicker
            keys={sshKeys}
            selected={selectedKeys}
            onToggle={(name) =>
              setSelectedKeys((prev) =>
                prev.includes(name) ? prev.filter((k) => k !== name) : [...prev, name],
              )
            }
          />
        </Section>
      </div>
    </div>
  );
}
