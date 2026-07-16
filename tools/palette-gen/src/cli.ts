/**
 * CLI del generador de paletas (ADR-009).
 *
 *   pnpm gen:palette regen            regenera las 16 paletas + gray y las
 *                                     integra en packages/tokens (+ JSON)
 *   pnpm gen:palette from <hex>       genera una escala desde un hex arbitrario
 *        [--name <n>] [--json]        (modo que reutilizará el Theme Creator)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { SHADES } from "./curves.ts";
import { emitJson, emitTokensModule } from "./emit.ts";
import { generateNamedScales, generateScale, type GeneratedScale } from "./generate.ts";
import { GRAY_SEED, PALETTE_SEEDS } from "./seeds.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const TOKENS_PALETTES = resolve(repoRoot, "packages/tokens/src/tokens/palettes.ts");
const JSON_OUT = resolve(here, "../generated/palettes.json");

function printScale(name: string, scale: GeneratedScale): void {
  console.log(`\n${name}:`);
  for (const shade of SHADES) {
    console.log(`  ${shade.padStart(3)}: ${scale[shade]}`);
  }
}

function regen(): void {
  const palettes = generateNamedScales(PALETTE_SEEDS);
  const gray = generateScale(GRAY_SEED.seed, GRAY_SEED.profile);

  writeFileSync(TOKENS_PALETTES, emitTokensModule(palettes, gray), "utf8");
  mkdirSync(dirname(JSON_OUT), { recursive: true });
  writeFileSync(JSON_OUT, emitJson(palettes, gray), "utf8");

  console.log(`✔ ${Object.keys(palettes).length} paletas + gray regeneradas (50–950, OKLCH)`);
  console.log(`  TS  → ${TOKENS_PALETTES}`);
  console.log(`  JSON→ ${JSON_OUT}`);
}

function fromHex(hex: string, name: string, asJson: boolean): void {
  const scale = generateScale(hex, "chromatic");
  if (asJson) {
    console.log(JSON.stringify({ [name]: scale }, null, 2));
    return;
  }
  console.log(`Escala 50–950 generada desde ${hex} (perfil chromatic):`);
  printScale(name, scale);
}

function main(): void {
  const [, , command, ...rest] = process.argv;

  switch (command) {
    case "regen": {
      regen();
      return;
    }
    case "from": {
      const hex = rest[0];
      if (hex === undefined || hex.startsWith("--")) {
        console.error("Uso: gen:palette from <hex> [--name <nombre>] [--json]");
        process.exitCode = 1;
        return;
      }
      const nameIndex = rest.indexOf("--name");
      const name = nameIndex >= 0 ? (rest[nameIndex + 1] ?? "custom") : "custom";
      fromHex(hex, name, rest.includes("--json"));
      return;
    }
    default: {
      console.error('Comando desconocido. Usa "regen" o "from <hex> [--name n] [--json]".');
      process.exitCode = 1;
    }
  }
}

main();
