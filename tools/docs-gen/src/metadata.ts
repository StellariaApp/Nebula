import { readdirSync } from "node:fs";
import { join } from "node:path";

import { COMPONENTS, Dirs, Exists, Read, WEB } from "./shared.ts";

export interface ComponentMeta {
  name: string;
  budget: string | null;
  boundary: "client" | "server";
  themeKeys: string[];
}

export interface MetaReport {
  version: number;
  count: number;
  gaps: { budget: string[]; themeKeys: string[] };
  components: ComponentMeta[];
}

const THEME_PATH = /\b(?:vars|theme)\.([A-Za-z][\w$]*(?:\.[A-Za-z][\w$]*)?)/g;

const NOT_THEME = new Set(["meta", "current", "className", "style", "css"]);

const IMPORT_LINE = /^\s*import\s.*$/gm;

function Budgets(): Map<string, string> {
  const source = Read(join(WEB, ".size-limit.js"));
  const out = new Map<string, string>();
  const entries = source.matchAll(
    /path:\s*"dist\/components\/([A-Za-z0-9]+)\/[^"]*",[\s\S]*?limit:\s*"([^"]+)"/g,
  );
  for (const [, name, limit] of entries) {
    if (name !== undefined && limit !== undefined && !out.has(name)) out.set(name, limit);
  }
  return out;
}

function SourceFiles(dir: string): string[] {
  return readdirSync(dir).filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));
}

function BoundaryOf(dir: string): "client" | "server" {
  for (const file of SourceFiles(dir)) {
    if (!file.endsWith(".tsx")) continue;
    if (Read(join(dir, file)).startsWith('"use client"')) return "client";
  }
  return "server";
}

function ThemeKeys(dir: string): string[] {
  const found = new Set<string>();
  for (const file of SourceFiles(dir)) {
    const body = Read(join(dir, file)).replace(IMPORT_LINE, "");
    for (const match of body.matchAll(THEME_PATH)) {
      const path = match[1];
      if (path === undefined) continue;
      const head = path.split(".")[0] ?? "";
      if (NOT_THEME.has(head)) continue;
      found.add(path);
    }
  }
  return [...found].sort();
}

export function BuildMeta(): MetaReport {
  const budgets = Budgets();
  const gaps: MetaReport["gaps"] = { budget: [], themeKeys: [] };

  const components = Dirs(COMPONENTS).map((name) => {
    const dir = join(COMPONENTS, name);
    const budget = budgets.get(name) ?? null;
    const theme_keys = Exists(dir) ? ThemeKeys(dir) : [];

    if (budget === null) gaps.budget.push(name);
    if (theme_keys.length === 0) gaps.themeKeys.push(name);

    return { name, budget, boundary: BoundaryOf(dir), themeKeys: theme_keys };
  });

  return { version: 1, count: components.length, gaps, components };
}
