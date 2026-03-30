import ubuntu from "./ubuntu.svg";
import debian from "./debian.svg";
import windows from "./windows.svg";
import fedora from "./fedora.svg";
import centos from "./centos.svg";
import almaLinux from "./alma-linux.svg";
import rockyLinux from "./rocky-linux.svg";
import opensuse from "./opensuse.svg";
import kubernetes from "./kubernetes.svg";
import wordpress from "./wordpress.svg";
import bookstack from "./bookstack.svg";
import coolify from "./coolify.svg";
import gitlab from "./gitlab.svg";
import wireguard from "./wireguard.svg";
import cpanel from "./cpanel.svg";
import nextcloud from "./nextcloud.svg";
import proxmox from "./proxmox.svg";
import n8n from "./n8n.svg";
import hestia from "./hestia.svg";
import nocodb from "./nocodb.svg";
import portainer from "./portainer.svg";
import easypanel from "./easypanel.svg";
import ollama from "./ollama.svg";
import supabase from "./supabase.svg";
import mautic from "./mautic.svg";
import immich from "./immich.svg";
import minecraft from "./minecraft.svg";
import uptimeKuma from "./uptime-kuma.svg";
import jellyfin from "./jellyfin.svg";
import adguardHome from "./adguard-home.svg";
import minio from "./minio.svg";
import grafana from "./grafana.svg";
import dokploy from "./dokploy.svg";
import openclaw from "./openclaw.svg";
import pulse from "./pulse.svg";

const templateIcons: Record<string, string> = {
  // OS templates
  "ubuntu-20": ubuntu,
  "ubuntu-22": ubuntu,
  "ubuntu-24": ubuntu,
  "ubuntu-25": ubuntu,
  "debian-11": debian,
  "debian-12": debian,
  "debian-13": debian,
  "windowsserver-2022": windows,
  "fedora-39": fedora,
  "centos-8-stream": centos,
  "centos-9-stream": centos,
  "almalinux-8": almaLinux,
  "almalinux-9": almaLinux,
  "almalinux-10": almaLinux,
  "rockylinux-8": rockyLinux,
  "rockylinux-9": rockyLinux,
  "rockylinux-10": rockyLinux,
  "k8s-worker": kubernetes,

  // App templates (lowercase display name as key)
  wordpress,
  bookstack,
  coolify,
  gitlab,
  "wireguard vpn": wireguard,
  cpanel,
  nextcloud,
  "proxmox backup server": proxmox,
  "proxmox datacenter manager": proxmox,
  "proxmox mail gateway": proxmox,
  n8n,
  hestiacp: hestia,
  nocodb,
  portainer,
  easypanel,
  ollama,
  supabase,
  mautic,
  immich,
  minecraft,
  uptimekuma: uptimeKuma,
  minikube: kubernetes,
  jellyfin,
  adguard: adguardHome,
  minio,
  grafana,
  dokploy,
  openclaw,
  pulse,
  opensuse,
};

export function getTemplateIcon(name: string): string | undefined {
  return templateIcons[name.toLowerCase()] ?? templateIcons[name];
}
