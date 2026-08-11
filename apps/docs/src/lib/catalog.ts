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

/** El ancla de la familia dentro del índice: `Data display` → `data-display`. */
export function FamilySlug(family: string): string {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** La URL de la ficha: `CodeHighlight` → `code-highlight`. */
export function ComponentSlug(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** La vuelta: el registro manda, así que la URL se resuelve contra él y no al revés. */
export function FromSlug(slug: string): CatalogEntry | undefined {
  return CATALOG.components.find((entry) => ComponentSlug(entry.name) === slug);
}
