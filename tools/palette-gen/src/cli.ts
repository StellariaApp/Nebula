import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { SHADES } from "./curves.ts";
import { EmitJson, EmitTokensModule } from "./emit.ts";
import { GenerateNamedScales, GenerateScale, type GeneratedScale } from "./generate.ts";
import { GRAY_SEED, PALETTE_SEEDS } from "./seeds.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../../..");
const TOKENS_PALETTES = resolve(REPO_ROOT, "packages/tokens/src/tokens/palettes.ts");
const JSON_OUT = resolve(HERE, "../generated/palettes.json");

function PrintScale(name: string, scale: GeneratedScale): void {
  console.log(`\n${name}:`);
  for (const shade of SHADES) {
    console.log(`  ${shade.padStart(3)}: ${scale[shade]}`);
  }
}

function Regen(): void {
  const palettes = GenerateNamedScales(PALETTE_SEEDS);
  const gray = GenerateScale(GRAY_SEED.seed, GRAY_SEED.profile);

  writeFileSync(TOKENS_PALETTES, EmitTokensModule(palettes, gray), "utf8");
  mkdirSync(dirname(JSON_OUT), { recursive: true });
  writeFileSync(JSON_OUT, EmitJson(palettes, gray), "utf8");

  console.log(`✔ ${Object.keys(palettes).length} paletas + gray regeneradas (50–950, OKLCH)`);
  console.log(`  TS  → ${TOKENS_PALETTES}`);
  console.log(`  JSON→ ${JSON_OUT}`);
}

function FromHex(hex: string, name: string, asJson: boolean): void {
  const scale = GenerateScale(hex, "chromatic");
  if (asJson) {
    console.log(JSON.stringify({ [name]: scale }, null, 2));
    return;
  }
  console.log(`Escala 50–950 generada desde ${hex} (perfil chromatic):`);
  PrintScale(name, scale);
}

function Main(): void {
  const [, , command, ...rest] = process.argv;

  switch (command) {
    case "regen": {
      Regen();
      return;
    }
    case "from": {
      const hex = rest[0];
      if (hex === undefined || hex.startsWith("--")) {
        console.error("Uso: gen:palette from <hex> [--name <nombre>] [--json]");
        process.exitCode = 1;
        return;
      }
      const name_index = rest.indexOf("--name");
      const name = name_index >= 0 ? (rest[name_index + 1] ?? "custom") : "custom";
      FromHex(hex, name, rest.includes("--json"));
      return;
    }
    default: {
      console.error('Comando desconocido. Usa "regen" o "from <hex> [--name n] [--json]".');
      process.exitCode = 1;
    }
  }
}

Main();
