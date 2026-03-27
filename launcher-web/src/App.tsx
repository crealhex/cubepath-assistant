import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  ChatBubble,
  LoadingSpinner,
  Avatar,
  AvatarImage,
  AvatarFallback,
  PricingCard,
  CodeBlock,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "cubepath-ui";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setDark(!dark);
        document.documentElement.classList.toggle("dark");
      }}
    >
      {dark ? "☀ Light" : "● Dark"}
    </Button>
  );
}

export default function App() {
  const [inputVal, setInputVal] = useState("");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              CubePath UI Showcase
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
          {/* Buttons */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button variant="brand">Brand CTA</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">✦</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Badges</h2>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="brand">Brand</Badge>
              <Badge variant="operational">Operational</Badge>
              <Badge variant="degraded">Degraded</Badge>
              <Badge variant="outage">Outage</Badge>
              <Badge variant="maintenance">Maintenance</Badge>
            </div>
          </section>

          {/* Input */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Input</h2>
            <div className="flex flex-wrap gap-3 max-w-md">
              <Input
                placeholder="Type something..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <Input placeholder="Disabled" disabled />
              <Input
                placeholder="Error state"
                aria-invalid="true"
              />
            </div>
          </section>

          {/* Select */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Select</h2>
            <div className="flex flex-wrap gap-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="barcelona">Barcelona, Spain</SelectItem>
                  <SelectItem value="miami">Miami, Florida</SelectItem>
                  <SelectItem value="houston">Houston, Texas</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All CPUs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ryzen7">AMD Ryzen 7</SelectItem>
                  <SelectItem value="ryzen9">AMD Ryzen 9</SelectItem>
                  <SelectItem value="epyc">AMD EPYC</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="RAM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="64">64 GB</SelectItem>
                  <SelectItem value="128">128 GB</SelectItem>
                  <SelectItem value="256">256 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Cards */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>VPS Instance</CardTitle>
                  <CardDescription>Frankfurt, DE — Running</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="operational">Operational</Badge>
                    <span className="text-sm text-muted-foreground">
                      99.9% uptime
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dedicated Server</CardTitle>
                  <CardDescription>Amsterdam, NL — Provisioning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="maintenance">Maintenance</Badge>
                    <span className="text-sm text-muted-foreground">
                      ETA: 15 min
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database</CardTitle>
                  <CardDescription>London, UK — Degraded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="degraded">Degraded</Badge>
                    <span className="text-sm text-muted-foreground">
                      High latency
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" size="sm">
                    Investigate
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Tooltip */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Tooltip</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                This is a tooltip from CubePath UI
              </TooltipContent>
            </Tooltip>
          </section>

          {/* Dialog */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Dialog</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deploy New Instance</DialogTitle>
                  <DialogDescription>
                    Configure your new VPS instance. This will be deployed to the
                    nearest datacenter.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <Input placeholder="Instance name" />
                  <Input placeholder="Region (e.g., eu-west-1)" />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="brand">Deploy</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          {/* Avatar */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Avatar</h2>
            <div className="flex items-center gap-4">
              <Avatar size="sm">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar size="md">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </div>
          </section>

          {/* Chat Bubbles */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Chat Bubbles
            </h2>
            <div className="max-w-2xl space-y-3 rounded-xl border border-border bg-card p-6">
              <ChatBubble variant="user" timestamp="10:32 AM">
                Deploy a new VPS in Frankfurt with 4 vCPU and 8GB RAM
              </ChatBubble>
              <ChatBubble variant="assistant" timestamp="10:32 AM">
                I'll create a VPS instance with the following specs:
                <br />
                <strong>Region:</strong> Frankfurt, DE
                <br />
                <strong>CPU:</strong> 4 vCPU
                <br />
                <strong>RAM:</strong> 8 GB
                <br />
                <br />
                Deploying now via Terraform...
              </ChatBubble>
              <ChatBubble variant="assistant" isLoading />
            </div>
          </section>

          {/* Code Block */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Code Block
            </h2>
            <CodeBlock
              language="hcl"
              code={`resource "cubepath_vps" "main" {
  name   = "web-server-01"
  region = "eu-frankfurt"
  plan   = "vps-4cpu-8gb"

  tags = ["production", "web"]
}`}
            />
          </section>

          {/* Loading Spinner */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Loading Spinner
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-xs text-muted-foreground">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="md" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="lg" />
                <span className="text-xs text-muted-foreground">Large</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="lg" className="text-brand" />
                <span className="text-xs text-muted-foreground">Brand</span>
              </div>
            </div>
          </section>

          {/* Skeleton */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Skeleton</h2>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </section>

          {/* Pricing Cards */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Pricing Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PricingCard
                name="Starter"
                price="$5.99"
                features={[
                  "1 vCPU",
                  "1 GB RAM",
                  "25 GB SSD",
                  "1 TB Transfer",
                ]}
                ctaText="Get Started"
              />
              <PricingCard
                name="Pro"
                price="$19.99"
                featured
                badge="Most Popular"
                features={[
                  "4 vCPU",
                  "8 GB RAM",
                  "100 GB NVMe",
                  "5 TB Transfer",
                  "DDoS Protection",
                ]}
                ctaText="Deploy Now"
              />
              <PricingCard
                name="Enterprise"
                price="$49.99"
                features={[
                  "8 vCPU",
                  "32 GB RAM",
                  "500 GB NVMe",
                  "Unlimited Transfer",
                  "DDoS Protection",
                  "Priority Support",
                ]}
                ctaText="Contact Sales"
              />
            </div>
          </section>
        </main>

        {/* Cookie Consent Banner */}
        <CookieBanner />
      </div>
    </TooltipProvider>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[280px] rounded-xl border border-border bg-card py-6 px-5 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🍪</span>
        <h3 className="text-lg font-semibold text-foreground">We use cookies</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        We use cookies to improve your experience on our website. By continuing
        to browse, you accept our use of cookies.{" "}
        <a href="#" className="text-foreground underline underline-offset-2">
          Learn more
        </a>
      </p>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => setVisible(false)}>Accept</Button>
        <Button size="sm" variant="outline" onClick={() => setVisible(false)}>
          Decline
        </Button>
      </div>
    </div>
  );
}
