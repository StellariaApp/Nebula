/**
 * CLI del gate de contraste (docs/03 §4.2 · gate F0 en docs/05).
 *
 *   pnpm check:contrast                     valida el tema de humo de F0
 *   pnpm check:contrast -- --theme x.json   valida un NebulaTheme serializado
 *
 * Exit code 1 si algún par falla — apto para CI.
 */
import { readFileSync } from "node:fs";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { checkTheme, type PairResult } from "./check.ts";
import { buildPairs } from "./pairs.ts";
import { smokeTheme } from "./smoke-theme.ts";

function loadTheme(): { theme: NebulaTheme; source: string } {
  const args = process.argv.slice(2);
  const themeIndex = args.indexOf("--theme");
  if (themeIndex >= 0) {
    const path = args[themeIndex + 1];
    if (path === undefined) {
      console.error("Uso: check:contrast [--theme <ruta.json>]");
      process.exit(1);
    }
    // La validación estructural completa (Zod) llega con nebula-themes en F1.
    const theme = JSON.parse(readFileSync(path, "utf8")) as NebulaTheme;
    return { theme, source: path };
  }
  return { theme: smokeTheme, source: "tema de humo F0 (paletas generadas + roles default)" };
}

function printTable(results: readonly PairResult[]): void {
  const labelWidth = Math.max(...results.map((r) => r.label.length));
  console.log(
    `${"PAR".padEnd(labelWidth)}  ${"FG".padEnd(9)} ${"BG".padEnd(9)} ${"RATIO".padStart(6)}  ${"MIN".padStart(4)}  RESULTADO`,
  );
  console.log("-".repeat(labelWidth + 45));
  for (const r of results) {
    const verdict = r.pass ? "PASS" : `FAIL${r.suggestion === undefined ? "" : ` → sugerido ${r.suggestion}`}`;
    console.log(
      `${r.label.padEnd(labelWidth)}  ${r.fg.padEnd(9)} ${r.bg.padEnd(9)} ${r.ratio.toFixed(2).padStart(6)}  ${r.min.toFixed(1).padStart(4)}  ${verdict}`,
    );
  }
}

function main(): void {
  const { theme, source } = loadTheme();
  console.log(`Contrast-check WCAG 2.2 AA — ${theme.meta.name} (${source})\n`);

  const results = checkTheme(theme, buildPairs());
  printTable(results);

  const failures = results.filter((r) => !r.pass);
  console.log(
    `\n${results.length} pares · ${results.length - failures.length} PASS · ${failures.length} FAIL`,
  );
  if (failures.length > 0) {
    console.error("✖ Gate de contraste en rojo (disabled está exento por WCAG 1.4.3).");
    process.exit(1);
  }
  console.log("✔ Gate de contraste en verde.");
}

main();
