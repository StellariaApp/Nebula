import { readFileSync } from "node:fs";

import type { RouteMeasure } from "./measure.ts";

export type Metric = "jsRaw" | "jsBr" | "cssFiles" | "cssBr" | "htmlBr";

export const METRICS: readonly Metric[] = ["jsRaw", "jsBr", "cssFiles", "cssBr", "htmlBr"];

/** `cssFiles` cuenta ficheros; el resto son kB. La unidad decide cómo se lee y cómo se holga. */
export const IN_FILES: Metric = "cssFiles";

export interface Group {
  label: string;
  match: readonly string[];
  jsRaw: number;
  jsBr: number;
  cssFiles: number;
  cssBr: number;
  htmlBr: number;
}

export interface Budgets {
  groups: readonly Group[];
}

export function LoadBudgets(path: string): Budgets {
  return JSON.parse(readFileSync(path, "utf8")) as Budgets;
}

function Matches(route: string, pattern: string): boolean {
  if (!pattern.endsWith("/*")) return route === pattern;
  const prefix = pattern.slice(0, -1);
  return route.startsWith(prefix) && !route.slice(prefix.length).includes("/");
}

export interface Grouped {
  group: Group;
  routes: RouteMeasure[];
  /** El peor de cada métrica, con la ruta que lo produce: un grupo se rompe por su miembro más gordo. */
  worst: Record<Metric, { value: number; route: string }>;
}

export function GroupRoutes(
  rows: readonly RouteMeasure[],
  budgets: Budgets,
): { grouped: Grouped[]; orphans: RouteMeasure[] } {
  const taken = new Set<string>();
  const grouped: Grouped[] = [];

  for (const group of budgets.groups) {
    const routes = rows.filter(
      (row) => !taken.has(row.route) && group.match.some((p) => Matches(row.route, p)),
    );
    routes.forEach((row) => taken.add(row.route));

    const worst = {} as Record<Metric, { value: number; route: string }>;
    for (const metric of METRICS) {
      const top = routes.reduce<RouteMeasure | undefined>(
        (best, row) => (best === undefined || row[metric] > best[metric] ? row : best),
        undefined,
      );
      worst[metric] = { value: top === undefined ? 0 : top[metric], route: top?.route ?? "—" };
    }

    grouped.push({ group, routes, worst });
  }

  return { grouped, orphans: rows.filter((row) => !taken.has(row.route)) };
}
