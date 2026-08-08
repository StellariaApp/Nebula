import registry from "../../generated/catalog.json";

export interface CatalogEntry {
  name: string;
  family: string | null;
  subpath: string | null;
  compound: boolean;
  parts: string[];
  boundary: "client" | "server";
  budget: string | null;
  notes: boolean;
  contract: boolean;
}

export interface Catalog {
  version: number;
  count: number;
  gaps: Record<string, string[]>;
  components: CatalogEntry[];
}

export const CATALOG = registry as Catalog;

export function ByFamily(): { family: string; components: CatalogEntry[] }[] {
  const groups = new Map<string, CatalogEntry[]>();
  for (const entry of CATALOG.components) {
    const family = entry.family ?? "Sin familia";
    const list = groups.get(family);
    if (list === undefined) groups.set(family, [entry]);
    else list.push(entry);
  }
  return [...groups.entries()]
    .map(([family, components]) => ({ family, components }))
    .sort((a, b) => a.family.localeCompare(b.family));
}

export function Find(name: string): CatalogEntry | undefined {
  return CATALOG.components.find((entry) => entry.name === name);
}
