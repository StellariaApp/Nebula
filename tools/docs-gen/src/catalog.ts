import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const WEB = join(REPO, "packages/web");
const COMPONENTS = join(WEB, "src/components");
const INVENTORY = join(REPO, "docs/00-inventory.md");
const OUT = join(REPO, "apps/docs/generated/catalog.json");

const SUBPATHS = ["command", "charts", "datagrid", "dnd", "carousel", "media", "editor"];

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

function Dirs(root: string): string[] {
  return readdirSync(root)
    .filter((entry) => statSync(join(root, entry)).isDirectory())
    .sort();
}

function Tokens(cell: string): string[] {
  return cell
    .replace(/\([^)]*\)/g, " ")
    .split(/\s*(?:\/|\by\b|\+|,)\s*/)
    .map((token) => token.trim())
    .filter((token) => /^[A-Z][A-Za-z0-9.]*$/.test(token));
}

function Families(): Map<string, string> {
  const source = readFileSync(INVENTORY, "utf8");
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
    if (!existsSync(barrel)) continue;
    if (readFileSync(barrel, "utf8").includes(`/components/${name}/`)) return `/${subpath}`;
  }
  const root = readFileSync(join(WEB, "src/index.ts"), "utf8");
  return root.includes(`/components/${name}/`) ? "." : null;
}

function BoundaryOf(dir: string): Boundary {
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !f.includes(".test."));
  for (const file of files) {
    if (readFileSync(join(dir, file), "utf8").startsWith('"use client"')) return "client";
  }
  return files.length === 0 ? "server" : "server";
}

function Parts(dir: string, name: string): string[] {
  const index = join(dir, "index.ts");
  if (!existsSync(index)) return [];
  const source = readFileSync(index, "utf8");
  const block = /Object\.assign\(\s*[\w$]+,\s*\{([\s\S]*?)\}\s*\)/.exec(source);
  if (!block) return [];
  return [...(block[1] ?? "").matchAll(/^\s*([A-Z][\w$]*)\s*[,:]/gm)]
    .map((match) => `${name}.${String(match[1])}`)
    .sort();
}

function Budgets(): Map<string, string> {
  const source = readFileSync(join(WEB, ".size-limit.js"), "utf8");
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

function Build(): Catalog {
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
      notes: existsSync(join(dir, `${name}.md`)),
      contract: existsSync(join(dir, `${name}.types.ts`)),
    };
  });

  return { version: 1, count: components.length, gaps, components };
}

function Serialize(catalog: Catalog): string {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

const catalog = Build();
const text = Serialize(catalog);
const check = process.argv.includes("--check");

if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (current !== text) {
    console.error("El registro del catálogo no coincide con el código. Corre `pnpm gen:docs`.");
    process.exit(1);
  }
  console.log(`registro ok — ${String(catalog.count)} componentes`);
} else {
  writeFileSync(OUT, text);
  console.log(`registro escrito — ${String(catalog.count)} componentes`);
}

for (const [kind, list] of Object.entries(catalog.gaps)) {
  if (list.length > 0) console.log(`  hueco declarado (${kind}): ${String(list.length)}`);
}
