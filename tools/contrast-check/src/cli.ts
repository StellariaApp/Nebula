/**
 * CLI del gate de contraste (docs/03 §4.2 · gates F0/W1 en docs/05).
 *
 *   pnpm check:contrast                     valida el tema de humo F0 + los 4 temas oficiales
 *   pnpm check:contrast -- --theme x.json   valida un NebulaTheme serializado (Zod vía loadTheme)
 *
 * Exit code 1 si algún par de algún tema falla — apto para CI.
 */
import { readFileSync } from "node:fs";

import { loadTheme, officialThemes } from "@stellaria/nebula-themes";
import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { checkTheme, type PairResult } from "./check.ts";
import { buildPairs } from "./pairs.ts";
import { smokeTheme } from "./smoke-theme.ts";

interface ThemeUnderTest {
  theme: NebulaTheme;
  source: string;
}

function loadThemes(): ThemeUnderTest[] {
  const args = process.argv.slice(2);
  const themeIndex = args.indexOf("--theme");
  if (themeIndex >= 0) {
    const path = args[themeIndex + 1];
    if (path === undefined) {
      console.error("Uso: check:contrast [--theme <ruta.json>]");
      process.exit(1);
    }
    const theme = loadTheme(JSON.parse(readFileSync(path, "utf8")));
    return [{ theme, source: path }];
  }
  return [
    { theme: smokeTheme, source: "tema de humo F0 (paletas generadas + roles default)" },
    ...Object.values(officialThemes).map((theme) => ({
      theme,
      source: "tema oficial de @stellaria/nebula-themes",
    })),
  ];
}

function printTable(results: readonly PairResult[]): void {
  const labelWidth = Math.max(...results.map((r) => r.label.length));
  console.log(
    `${"PAR".padEnd(labelWidth)}  ${"FG".padEnd(9)} ${"BG".padEnd(9)} ${"RATIO".padStart(6)}  ${"MIN".padStart(4)}  RESULTADO`,
  );
  console.log("-".repeat(labelWidth + 45));
  for (const r of results) {
    const verdict = r.pass
      ? "PASS"
      : `FAIL${r.suggestion === undefined ? "" : ` → sugerido ${r.suggestion}`}`;
    console.log(
      `${r.label.padEnd(labelWidth)}  ${r.fg.padEnd(9)} ${r.bg.padEnd(9)} ${r.ratio.toFixed(2).padStart(6)}  ${r.min.toFixed(1).padStart(4)}  ${verdict}`,
    );
  }
}

function main(): void {
  const themes = loadThemes();
  let totalFailures = 0;

  for (const { theme, source } of themes) {
    console.log(`Contrast-check WCAG 2.2 AA — ${theme.meta.name} (${source})\n`);

    const results = checkTheme(theme, buildPairs());
    printTable(results);

    const failures = results.filter((r) => !r.pass);
    totalFailures += failures.length;
    console.log(
      `\n${results.length} pares · ${results.length - failures.length} PASS · ${failures.length} FAIL\n`,
    );
  }

  if (totalFailures > 0) {
    console.error("✖ Gate de contraste en rojo (disabled está exento por WCAG 1.4.3).");
    process.exit(1);
  }
  console.log(`✔ Gate de contraste en verde para ${String(themes.length)} temas.`);
}

main();
