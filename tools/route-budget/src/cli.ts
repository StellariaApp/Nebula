import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { GroupRoutes, IN_FILES, LoadBudgets, METRICS, type Metric } from "./budgets.ts";
import { MeasureRoutes, type RouteMeasure } from "./measure.ts";

const ROOT = resolve(import.meta.dirname, "..", "..", "..");
const NEXT = resolve(ROOT, "apps", "web", ".next");
const CONFIG = resolve(ROOT, "apps", "web", "route-budget.json");

const KB = 1024;

const LABEL: Record<Metric, string> = {
  jsRaw: "JS sin comprimir",
  jsBr: "JS brotli",
  cssFiles: "hojas CSS",
  cssBr: "CSS brotli",
  htmlBr: "HTML brotli",
};

function Show(metric: Metric, value: number): string {
  return metric === IN_FILES
    ? String(Math.round(value))
    : `${(value / KB).toFixed(1).padStart(6)} kB`;
}

const Kb = (value: number): string => `${(value / KB).toFixed(1)} kB`;

const Peak = (routes: readonly RouteMeasure[], key: keyof RouteMeasure): number =>
  routes.reduce((top, row) => Math.max(top, row[key] as number), 0);

function Main(): void {
  if (!existsSync(NEXT)) {
    console.error(`✖ No hay build en ${NEXT}. Corre \`pnpm --filter web build\` antes del gate.`);
    process.exit(1);
  }

  const rows = MeasureRoutes(NEXT);
  const { grouped, orphans } = GroupRoutes(rows, LoadBudgets(CONFIG));

  console.log(`Presupuesto por ruta — ${String(rows.length)} rutas prerenderizadas\n`);

  let failures = 0;

  for (const { group, routes, worst } of grouped) {
    console.log(`${group.label}  (${String(routes.length)} rutas)`);
    if (routes.length === 0) {
      console.log("  sin rutas: el patrón no casa con nada, revisa route-budget.json\n");
      failures += 1;
      continue;
    }

    for (const metric of METRICS) {
      const cap = metric === IN_FILES ? group[metric] : group[metric] * KB;
      const { value, route } = worst[metric];
      const pass = value <= cap;
      if (!pass) failures += 1;
      const slack = cap === 0 ? 0 : ((cap - value) / cap) * 100;
      console.log(
        `  ${LABEL[metric].padEnd(17)} ${Show(metric, value)} / ${Show(metric, cap)}  ` +
          `${pass ? `holgura ${slack.toFixed(1)}%` : "EXCEDE"}  ${routes.length > 1 ? route : ""}`,
      );
    }

    console.log(
      `  ${"servido hoy (gzip)".padEnd(17)} JS ${Kb(Peak(routes, "jsGz"))} · HTML ${Kb(Peak(routes, "htmlGz"))}`,
    );

    const files = Peak(routes, "skipFiles");
    if (files > 0) {
      console.log(
        `  ${"fuera (noModule)".padEnd(17)} ${String(Math.round(files))} ficheros · ` +
          `${Kb(Peak(routes, "skipRaw"))} que un navegador con módulos no pide`,
      );
    }

    console.log("");
  }

  if (orphans.length > 0) {
    console.error(`✖ ${String(orphans.length)} rutas sin presupuesto:`);
    for (const row of orphans.slice(0, 10)) console.error(`    ${row.route}`);
    if (orphans.length > 10) console.error(`    …y ${String(orphans.length - 10)} más`);
    console.error("  Añádelas a un grupo de route-budget.json: una ruta sin tope no es una ruta");
    console.error("  barata, es una ruta que nadie mira.");
    failures += orphans.length;
  }

  if (failures > 0) {
    console.error(
      `\n✖ Gate de presupuesto por ruta en rojo (${String(failures)} incumplimientos).`,
    );
    process.exit(1);
  }

  console.log(`✔ Gate de presupuesto por ruta en verde para ${String(grouped.length)} grupos.`);
}

Main();
