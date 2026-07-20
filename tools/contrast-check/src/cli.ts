import { readFileSync } from "node:fs";

import { LoadTheme, officialThemes } from "@stellaria/nebula-themes";
import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { CheckTheme, type PairResult } from "./check.ts";
import { BuildPairs } from "./pairs.ts";
import { smokeTheme } from "./smoke-theme.ts";

interface ThemeUnderTest {
  theme: NebulaTheme;
  source: string;
}

function LoadThemes(): ThemeUnderTest[] {
  const args = process.argv.slice(2);
  const theme_index = args.indexOf("--theme");
  if (theme_index >= 0) {
    const path = args[theme_index + 1];
    if (path === undefined) {
      console.error("Uso: check:contrast [--theme <ruta.json>]");
      process.exit(1);
    }
    const theme = LoadTheme(JSON.parse(readFileSync(path, "utf8")));
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

function PrintTable(results: readonly PairResult[]): void {
  const label_width = Math.max(...results.map((r) => r.label.length));
  console.log(
    `${"PAR".padEnd(label_width)}  ${"FG".padEnd(9)} ${"BG".padEnd(9)} ${"RATIO".padStart(6)}  ${"MIN".padStart(4)}  RESULTADO`,
  );
  console.log("-".repeat(label_width + 45));
  for (const r of results) {
    const verdict = r.pass
      ? "PASS"
      : `FAIL${r.suggestion === undefined ? "" : ` → sugerido ${r.suggestion}`}`;
    console.log(
      `${r.label.padEnd(label_width)}  ${r.fg.padEnd(9)} ${r.bg.padEnd(9)} ${r.ratio.toFixed(2).padStart(6)}  ${r.min.toFixed(1).padStart(4)}  ${verdict}`,
    );
  }
}

function Main(): void {
  const themes = LoadThemes();
  let total_failures = 0;

  for (const { theme, source } of themes) {
    console.log(`Contrast-check WCAG 2.2 AA — ${theme.meta.name} (${source})\n`);

    const results = CheckTheme(theme, BuildPairs());
    PrintTable(results);

    const failures = results.filter((r) => !r.pass);
    total_failures += failures.length;
    console.log(
      `\n${results.length} pares · ${results.length - failures.length} PASS · ${failures.length} FAIL\n`,
    );
  }

  if (total_failures > 0) {
    console.error("✖ Gate de contraste en rojo (disabled está exento por WCAG 1.4.3).");
    process.exit(1);
  }
  console.log(`✔ Gate de contraste en verde para ${String(themes.length)} temas.`);
}

Main();
