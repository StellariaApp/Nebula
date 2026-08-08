import { readdirSync } from "node:fs";
import { join } from "node:path";

import { COMPONENTS, Dirs, Exists, REPO, Read, SUBPATHS, WEB } from "./shared.ts";

const INVENTORY = join(REPO, "docs/00-inventory.md");

type Boundary = "client" | "server";

interface Entry {
  name: string;
  family: string | null;
  subpath: string | null;
  compound: boolean;
  parts: string[];
  boundary: Boundary;
  budget: string | null;
  notes: boolean;
  contract: boolean;
}

interface Gaps {
  family: string[];
  subpath: string[];
  budget: string[];
}

interface Catalog {
  version: number;
  count: number;
  gaps: Gaps;
  components: Entry[];
}

const FAMILY_OVERRIDES: Record<string, string> = {
  ButtonGroup: "Buttons & Actions",
  Charts: "Charts",
  DragDrop: "Drag & Drop",
  Kanban: "Drag & Drop",
  MeshGradientBg: "Effects / Glass / Shaders",
  Footer: "Foundation / Layout",
  FieldError: "Inputs & Forms",
};

const FAMILY_ALIASES: Record<string, string[]> = {
  "AppShell (+Header/Navbar/Aside/Footer/Main)": ["AppShell"],
  "Grid / Grid.Col": ["Grid"],
  "Header (screen/TopBar)": ["Header"],
  "Row / Column": [],
  "DatePicker / DateRangePicker / DateTimePicker": [
    "DatePicker",
    "DateRangePicker",
    "DateTimePicker",
  ],
};

function Tokens(cell: string): string[] {
  return cell
    .replace(/\([^)]*\)/g, " ")
    .split(/\s*(?:\/|\by\b|\+|,)\s*/)
    .map((token) => token.trim())
    .filter((token) => /^[A-Z][A-Za-z0-9.]*$/.test(token));
}

function Families(): Map<string, string> {
  const source = Read(INVENTORY);
  const by_component = new Map<string, string>();
  let family: string | undefined;

  for (const raw of source.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const heading = /^### 1\.\d+ (.+)$/.exec(line);
    if (heading) {
      family = (heading[1] ?? "")
        .replace(/\s*\(.*$/, "")
        .replace(/\s*—.*$/, "")
        .trim();
      continue;
    }
    if (family === undefined || !line.startsWith("|")) continue;

    const first = line.split("|")[1]?.trim();
    if (!first || /^-+$/.test(first) || first === "Componente") continue;

    const names = FAMILY_ALIASES[first] ?? Tokens(first);
    for (const name of names) {
      if (!by_component.has(name)) by_component.set(name, family);
    }
  }
  return by_component;
}

function SubpathOf(name: string): string | null {
  for (const subpath of SUBPATHS) {
    const barrel = join(WEB, "src", subpath, "index.ts");
    if (!Exists(barrel)) continue;
    if (Read(barrel).includes(`/components/${name}/`)) return `/${subpath}`;
  }
  const root = Read(join(WEB, "src/index.ts"));
  return root.includes(`/components/${name}/`) ? "." : null;
}

function BoundaryOf(dir: string): Boundary {
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !f.includes(".test."));
  for (const file of files) {
    if (Read(join(dir, file)).startsWith('"use client"')) return "client";
  }
  return files.length === 0 ? "server" : "server";
}

function Parts(dir: string, name: string): string[] {
  const index = join(dir, "index.ts");
  if (!Exists(index)) return [];
  const source = Read(index);
  const block = /Object\.assign\(\s*[\w$]+,\s*\{([\s\S]*?)\}\s*\)/.exec(source);
  if (!block) return [];
  return [...(block[1] ?? "").matchAll(/^\s*([A-Z][\w$]*)\s*[,:]/gm)]
    .map((match) => `${name}.${String(match[1])}`)
    .sort();
}

function Budgets(): Map<string, string> {
  const source = Read(join(WEB, ".size-limit.js"));
  const by_component = new Map<string, string>();
  const entries = source.matchAll(
    /path:\s*"dist\/components\/([A-Za-z0-9]+)\/[^"]*",[\s\S]*?limit:\s*"([^"]+)"/g,
  );
  for (const [, name, limit] of entries) {
    if (name !== undefined && limit !== undefined && !by_component.has(name)) {
      by_component.set(name, limit);
    }
  }
  return by_component;
}

export function BuildCatalog(): Catalog {
  const families = Families();
  const budgets = Budgets();
  const gaps: Gaps = { family: [], subpath: [], budget: [] };

  const components = Dirs(COMPONENTS).map((name) => {
    const dir = join(COMPONENTS, name);
    const parts = Parts(dir, name);
    const family = families.get(name) ?? FAMILY_OVERRIDES[name] ?? null;
    const subpath = SubpathOf(name);
    const budget = budgets.get(name) ?? null;

    if (family === null) gaps.family.push(name);
    if (subpath === null) gaps.subpath.push(name);
    if (budget === null) gaps.budget.push(name);

    return {
      name,
      family,
      subpath,
      compound: parts.length > 0,
      parts,
      boundary: BoundaryOf(dir),
      budget,
      notes: Exists(join(dir, `${name}.md`)),
      contract: Exists(join(dir, `${name}.types.ts`)),
    };
  });

  return { version: 1, count: components.length, gaps, components };
}
