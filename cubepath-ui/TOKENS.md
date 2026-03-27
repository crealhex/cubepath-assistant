# CubePath UI Design Tokens

Design token reference for the `cubepath-ui` component library. All tokens were extracted from CubePath's public website and mapped to Tailwind CSS utilities.

---

## Table of Contents

- [Semantic Colors](#semantic-colors)
- [Brand Color](#brand-color)
- [Status Colors](#status-colors)
- [Chart Colors](#chart-colors)
- [Typography](#typography)
- [Shadows](#shadows)
- [Border Radius](#border-radius)
- [Spacing](#spacing)
- [Animations](#animations)
- [Sources](#sources)
- [Phase 2 Notes](#phase-2-notes)

---

## Semantic Colors

All semantic colors support light and dark mode via CSS custom properties. Tailwind classes use the `bg-`, `text-`, and `border-` prefixes with the token name (e.g., `bg-background`, `text-foreground`, `border-border`).

| Token | CSS Variable | Light | Dark | Tailwind Class | Description |
|-------|-------------|-------|------|----------------|-------------|
| background | `--background` | `#ffffff` | `#0a0a0a` | `bg-background` | Page background |
| foreground | `--foreground` | `#0a0a0a` | `#fafafa` | `text-foreground` | Primary text color |
| card | `--card` | `#ffffff` | `#171717` | `bg-card` | Card surface |
| card-foreground | `--card-foreground` | `#0a0a0a` | `#fafafa` | `text-card-foreground` | Card text color |
| popover | `--popover` | `#ffffff` | `#171717` | `bg-popover` | Popover and dropdown surface |
| popover-foreground | `--popover-foreground` | `#0a0a0a` | `#fafafa` | `text-popover-foreground` | Popover text color |
| primary | `--primary` | `#171717` | `#e5e5e5` | `bg-primary`, `text-primary` | Primary actions and buttons |
| primary-foreground | `--primary-foreground` | `#fafafa` | `#171717` | `text-primary-foreground` | Text on primary background |
| secondary | `--secondary` | `#f5f5f5` | `#262626` | `bg-secondary` | Secondary surfaces |
| secondary-foreground | `--secondary-foreground` | `#171717` | `#fafafa` | `text-secondary-foreground` | Text on secondary surfaces |
| muted | `--muted` | `#f5f5f5` | `#262626` | `bg-muted` | Muted backgrounds |
| muted-foreground | `--muted-foreground` | `#737373` | `#a1a1a1` | `text-muted-foreground` | Muted/helper text |
| accent | `--accent` | `#f5f5f5` | `#262626` | `bg-accent` | Accent surfaces (hover states, highlights) |
| accent-foreground | `--accent-foreground` | `#171717` | `#fafafa` | `text-accent-foreground` | Text on accent surfaces |
| destructive | `--destructive` | `#e40014` | `#ff6568` | `bg-destructive`, `text-destructive` | Error and danger states |
| border | `--border` | `#e5e5e5` | `#ffffff1a` | `border-border` | Default border color |
| input | `--input` | `#e5e5e5` | `#ffffff26` | `border-input` | Input field borders |
| ring | `--ring` | `#a1a1a1` | `#737373` | `ring-ring` | Focus ring color |

---

## Brand Color

| Value | Name | Tailwind Class | Description | Source |
|-------|------|----------------|-------------|--------|
| `#00D957` | CubePath Green | `text-brand`, `bg-brand` | Primary brand color used for CTAs, status indicators, and brand accents | All pages |

This is the single most important color in the system. It appears on every page as the primary call-to-action color and brand identifier.

---

## Status Colors

Used for service health indicators across the status page and dashboard components.

| Token | CSS Variable | Light | Dark | Tailwind Class | Description |
|-------|-------------|-------|------|----------------|-------------|
| status-operational | `--status-operational` | `#50c249` | `#5ecf67` | `text-status-operational` | Service is operational |
| status-operational-bg | `--status-operational-bg` | `#50c2491a` | `#5ecf671f` | `bg-status-operational` | Operational badge background |
| status-degraded | `--status-degraded` | `#edb200` | `#fac800` | `text-status-degraded` | Degraded performance |
| status-degraded-bg | `--status-degraded-bg` | `#edb2001a` | `#fac8001f` | `bg-status-degraded` | Degraded badge background |
| status-outage | `--status-outage` | `#e40014` | `#ff6568` | `text-status-outage` | Service outage |
| status-outage-bg | `--status-outage-bg` | `#e400141a` | `#ff65681f` | `bg-status-outage` | Outage badge background |
| status-maintenance | `--status-maintenance` | `#1578ef` | `#54a2ff` | `text-status-maintenance` | Scheduled maintenance |
| status-maintenance-bg | `--status-maintenance-bg` | `#1578ef1a` | `#54a2ff1f` | `bg-status-maintenance` | Maintenance badge background |

**Note:** The `-bg` variants use alpha transparency (roughly 10-12% opacity) over the base status color, which allows them to blend naturally with both light and dark backgrounds.

---

## Chart Colors

Used in data visualization components. Each slot is assigned a semantically distinct hue to maximize readability.

| Token | CSS Variable | Light | Dark | Tailwind Class |
|-------|-------------|-------|------|----------------|
| chart-1 | `--chart-1` | `#f05100` | `#1447e6` | `fill-chart-1`, `stroke-chart-1` |
| chart-2 | `--chart-2` | `#009588` | `#00bb7f` | `fill-chart-2`, `stroke-chart-2` |
| chart-3 | `--chart-3` | `#104e64` | `#f99c00` | `fill-chart-3`, `stroke-chart-3` |
| chart-4 | `--chart-4` | `#fcbb00` | `#ac4bff` | `fill-chart-4`, `stroke-chart-4` |
| chart-5 | `--chart-5` | `#f99c00` | `#ff2357` | `fill-chart-5`, `stroke-chart-5` |

**Note:** Light and dark palettes are intentionally different, not simple inversions. The dark palette shifts toward cooler and more saturated hues to maintain contrast on dark backgrounds.

---

## Typography

### Font Families

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Sans (default) | `Geist, ui-sans-serif, system-ui, sans-serif` | `font-sans` |
| Mono | `Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` | `font-mono` |

### Type Scale

| Name | Size | Tailwind Class |
|------|------|----------------|
| xs | 12px (0.75rem) | `text-xs` |
| sm | 14px (0.875rem) | `text-sm` |
| base | 16px (1rem) | `text-base` |
| lg | 18px (1.125rem) | `text-lg` |
| xl | 20px (1.25rem) | `text-xl` |
| 2xl | 24px (1.5rem) | `text-2xl` |
| 3xl | 30px (1.875rem) | `text-3xl` |
| 4xl | 36px (2.25rem) | `text-4xl` |
| 5xl | 48px (3rem) | `text-5xl` |
| 6xl | 60px (3.75rem) | `text-6xl` |

### Font Weights

| Weight | Value | Tailwind Class |
|--------|-------|----------------|
| Light | 300 | `font-light` |
| Regular | 400 | `font-normal` |
| Medium | 500 | `font-medium` |
| Semibold | 600 | `font-semibold` |
| Bold | 700 | `font-bold` |
| Black | 900 | `font-black` |

---

## Shadows

Standard elevation system following Tailwind's naming convention.

| Name | Value | Tailwind Class |
|------|-------|----------------|
| xs | `0 1px 2px 0 #0000000d` | `shadow-xs` |
| sm | `0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a` | `shadow-sm` |
| md | `0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a` | `shadow-md` |
| lg | `0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a` | `shadow-lg` |
| xl | `0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a` | `shadow-xl` |
| 2xl | `0 25px 50px -12px #00000040` | `shadow-2xl` |

**Opacity reference:** `0d` = ~5%, `1a` = ~10%, `40` = ~25%.

---

## Border Radius

Base radius is defined via `--radius: 0.5rem` (8px) and all other values derive from it.

| Name | Value | Tailwind Class |
|------|-------|----------------|
| sm | 4px (0.25rem) | `rounded-sm` |
| md | 6px (0.375rem) | `rounded-md` |
| lg | 8px (0.5rem) — base | `rounded-lg` |
| xl | 12px (0.75rem) | `rounded-xl` |
| 2xl | 16px (1rem) | `rounded-2xl` |
| full | 9999px | `rounded-full` |

---

## Spacing

Uses the standard Tailwind 4px base multiplier system.

| Multiplier | Value | Example Classes |
|------------|-------|-----------------|
| 1 | 4px (0.25rem) | `p-1`, `m-1`, `gap-1` |
| 2 | 8px (0.5rem) | `p-2`, `m-2`, `gap-2` |
| 3 | 12px (0.75rem) | `p-3`, `m-3`, `gap-3` |
| 4 | 16px (1rem) | `p-4`, `m-4`, `gap-4` |
| 5 | 20px (1.25rem) | `p-5`, `m-5`, `gap-5` |
| 6 | 24px (1.5rem) | `p-6`, `m-6`, `gap-6` |
| 8 | 32px (2rem) | `p-8`, `m-8`, `gap-8` |
| 10 | 40px (2.5rem) | `p-10`, `m-10`, `gap-10` |
| 12 | 48px (3rem) | `p-12`, `m-12`, `gap-12` |
| 16 | 64px (4rem) | `p-16`, `m-16`, `gap-16` |

---

## Animations

### Standard Tailwind Animations

| Name | Tailwind Class | Description |
|------|----------------|-------------|
| spin | `animate-spin` | Continuous 360-degree rotation (loading spinners) |
| ping | `animate-ping` | Scale-up with fade-out (notification dots) |
| pulse | `animate-pulse` | Opacity pulse (skeleton loaders) |

### Custom Animations

| Name | Tailwind Class | Description |
|------|----------------|-------------|
| accordion-down | `animate-accordion-down` | Radix accordion expand — slides content down |
| accordion-up | `animate-accordion-up` | Radix accordion collapse — slides content up |
| float | `animate-float` | `translateY` bounce loop, used on hero section elements |
| enter | `animate-enter` | 0.15s ease-in mount transition |
| exit | `animate-exit` | 0.15s ease-out unmount transition |

**Note:** `accordion-down` and `accordion-up` integrate with Radix UI's `data-state` attributes for open/closed transitions. The `enter`/`exit` pair is designed for use with `AnimatePresence`-style mount/unmount patterns.

---

## Sources

All tokens were extracted from the following public pages:

| Page | URL | Notable Tokens |
|------|-----|----------------|
| Homepage | `cubepath.com` | Brand color, hero float animation, all semantic colors |
| VPS | `cubepath.com/vps` | Pricing cards, chart colors (embedded pricing) |
| Dedicated Servers | `cubepath.com/dedicated-servers` | Pricing cards (embedded pricing) |
| Marketplace | `cubepath.com/marketplace` | Card surfaces, secondary/muted colors |
| About | `cubepath.com/about` | Typography scale, font weights |
| Datacenter | `cubepath.com/datacenter` | Status colors, badge backgrounds |
| DDoS Protection | `cubepath.com/ddos-protection` | Destructive/warning color usage |
| Contact | `cubepath.com/contact` | Input borders, focus rings, form tokens |
| Blog | `cubepath.com/blog` | Muted foreground, typography hierarchy |

**Note:** `/pricing` returns a 404. All pricing content is embedded within `/vps` and `/dedicated-servers`.

---

## Phase 2 Notes

The following items require further investigation before tokens can be finalized:

- **Color space verification:** Some colors may use `lab()` or `oklch()` in the actual stylesheets. Exact values need browser DevTools verification against computed styles to confirm hex equivalents are accurate.
- **Dashboard tokens:** Sidebar, navigation, and data table tokens are behind authentication and were not captured in this extraction pass.
- **Radius base value:** The `--radius: 0.5rem` value should be verified via computed styles in DevTools. The cascading `calc()` derivations for `sm` and `md` depend on this base being correct.
