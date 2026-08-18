import { readFileSync } from "node:fs";

import { LoadTheme, Themes } from "@stellaria/nebula-themes";
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
    /**
     * Solo el par por defecto. Los nueve temas de producto que `Themes` trae desde ADR-168 son
     * variantes —la prueba de que el catalogo se retine— y NO se certifican aqui: quien lleve uno a
     * produccion lo valida con `--theme <suyo>.json`, que es este mismo motor.
     */
    { theme: Themes.nebula.dark, source: "tema por defecto de @stellaria/nebula-themes (dark)" },
    { theme: Themes.nebula.light, source: "tema por defecto de @stellaria/nebula-themes (light)" },
  ];
}

function PrintTable(results: readonly PairResult[]): void {
  const label_width = Math.max(...results.map((r) => r.label.length));
  console.log(
    `${"PAR".padEnd(label_width)}  ${"FG".padEnd(9)} ${"BG".padEnd(9)} ${"RATIO".padStart(6)}  ${"MIN".padStart(5)}  RESULTADO`,
  );
  console.log("-".repeat(label_width + 45));
  for (const r of results) {
    const verdict = r.pass
      ? r.deuda === undefined
        ? "PASS"
        : `PASS · deuda pagada, retirar el marcador (${r.deuda})`
      : r.deuda === undefined
        ? `FAIL${r.suggestion === undefined ? "" : ` → sugerido ${r.suggestion}`}`
        : `DEUDA · ${r.deuda}`;
    console.log(
      `${r.label.padEnd(label_width)}  ${r.fg.padEnd(9)} ${r.bg.padEnd(9)} ${r.ratio.toFixed(2).padStart(6)}  ${r.min.toFixed(2).padStart(5)}  ${verdict}`,
    );
  }
}

function Main(): void {
  const themes = LoadThemes();
  let total_failures = 0;
  let total_debt = 0;
  /**
   * Una deuda solo esta pagada si el par pasa en **todos** los temas. Contarla por tema diria
   * «retira el marcador» de un par que sigue haciendo falta en otro esquema.
   */
  const debt_fails_somewhere = new Set<string>();
  const debt_labels = new Set<string>();

  for (const { theme, source } of themes) {
    console.log(`Contrast-check WCAG 2.2 AA — ${theme.meta.name} (${source})\n`);

    const results = CheckTheme(theme, BuildPairs());
    PrintTable(results);

    const failures = results.filter((r) => !r.pass && r.deuda === undefined);
    const deuda = results.filter((r) => !r.pass && r.deuda !== undefined);
    for (const r of results) {
      if (r.deuda === undefined) continue;
      debt_labels.add(r.label);
      if (!r.pass) debt_fails_somewhere.add(r.label);
    }
    total_failures += failures.length;
    total_debt += deuda.length;
    console.log(
      `\n${results.length} pares · ${results.length - failures.length - deuda.length} PASS · ` +
        `${failures.length} FAIL · ${deuda.length} DEUDA\n`,
    );
  }

  const pagadas = [...debt_labels].filter((l) => !debt_fails_somewhere.has(l));

  if (total_debt > 0) {
    console.log(
      `⚠ ${String(total_debt)} pares en deuda aceptada por ADR-161. Se miden y no bloquean:\n` +
        "  el defecto sigue ahí y a la vista. Se cierran el día que el color vuelva a estar en alcance.",
    );
  }
  if (pagadas.length > 0) {
    console.log(
      `✔ ${String(pagadas.length)} pares marcados como deuda pasan en TODOS los temas — retira su \`deuda\`:`,
    );
    for (const l of pagadas) console.log(`    ${l}`);
  }
  if (total_failures > 0) {
    console.error("✖ Gate de contraste en rojo (disabled está exento por WCAG 1.4.3).");
    process.exit(1);
  }
  console.log(`✔ Gate de contraste en verde para ${String(themes.length)} temas.`);
}

Main();
