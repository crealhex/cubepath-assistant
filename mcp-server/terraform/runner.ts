import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const WORKSPACE_ROOT = join(import.meta.dir, "workspace");

export function getProjectDir(projectId: string): string {
  const dir = join(WORKSPACE_ROOT, projectId);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

async function runTerraform(projectDir: string, args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn(["terraform", ...args], {
    cwd: projectDir,
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env },
  });

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  return { stdout, stderr, exitCode };
}

export async function terraformInit(projectDir: string) {
  return runTerraform(projectDir, ["init", "-no-color"]);
}

export async function terraformPlan(projectDir: string) {
  return runTerraform(projectDir, ["plan", "-no-color"]);
}

export async function terraformApply(projectDir: string) {
  return runTerraform(projectDir, ["apply", "-auto-approve", "-no-color"]);
}

export async function terraformDestroy(projectDir: string, target?: string) {
  const args = ["destroy", "-auto-approve", "-no-color"];
  if (target) args.push(`-target=${target}`);
  return runTerraform(projectDir, args);
}

export async function terraformShow(projectDir: string) {
  return runTerraform(projectDir, ["show", "-json", "-no-color"]);
}
