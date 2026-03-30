import { join } from "path";
import { writeFileSync, existsSync } from "fs";
import { getProjectDir } from "./runner";

const PROVIDER_BLOCK = `
terraform {
  required_providers {
    cubepath = {
      source = "CubePathInc/cubepath"
    }
  }
}

provider "cubepath" {}
`;

function ensureProvider(projectDir: string) {
  const providerFile = join(projectDir, "provider.tf");
  if (!existsSync(providerFile)) {
    writeFileSync(providerFile, PROVIDER_BLOCK.trim() + "\n");
  }
}

export function generateVpsResource(
  projectId: string,
  resourceName: string,
  config: {
    name: string;
    plan: string;
    template: string;
    location: string;
    projectId: string;
    sshKeyNames?: string[];
  },
): string {
  const dir = getProjectDir(projectId);
  ensureProvider(dir);

  const sshBlock = config.sshKeyNames?.length
    ? `\n  ssh_key_names = ${JSON.stringify(config.sshKeyNames)}`
    : "";

  const hcl = `
resource "cubepath_vps" "${resourceName}" {
  name          = "${config.name}"
  plan_name     = "${config.plan}"
  template_name = "${config.template}"
  location_name = "${config.location}"
  project_id    = "${config.projectId}"${sshBlock}
}
`;

  const filename = `${resourceName}.tf`;
  const filepath = join(dir, filename);
  writeFileSync(filepath, hcl.trim() + "\n");

  return filepath;
}

export function removeResource(projectId: string, resourceName: string) {
  const dir = getProjectDir(projectId);
  const filepath = join(dir, `${resourceName}.tf`);
  if (existsSync(filepath)) {
    const { unlinkSync } = require("fs");
    unlinkSync(filepath);
  }
}
