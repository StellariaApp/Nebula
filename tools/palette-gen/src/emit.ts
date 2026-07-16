/**
 * Emisores: TS listo para packages/tokens (palettes.ts) y JSON plano.
 */
import { SHADES } from "./curves.ts";
import type { GeneratedScale } from "./generate.ts";

function emitScaleLiteral(scale: GeneratedScale, indent: string): string {
  const lines = SHADES.map((shade) => `${indent}  ${shade}: "${scale[shade]}",`);
  return `{\n${lines.join("\n")}\n${indent}}`;
}

/** Contenido completo de packages/tokens/src/tokens/palettes.ts. */
export function emitTokensModule(
  palettes: Record<string, GeneratedScale>,
  gray: GeneratedScale,
): string {
  const names = Object.keys(palettes);
  const consts = names
    .map((name) => `export const ${name} = ${emitScaleLiteral(palettes[name] as GeneratedScale, "")} as const satisfies Scale11;`)
    .join("\n\n");
  const record = names.map((name) => `  ${name},`).join("\n");
  const nameList = names.map((name) => `  "${name}",`).join("\n");

  return `/**
 * Las 16 paletas base 50–950 (11 pasos, OKLCH — ADR-009).
 *
 * ARCHIVO GENERADO por tools/palette-gen — NO editar a mano:
 *   pnpm gen:palette regen
 * Semillas: paso 500 legacy de Stellaria (solo orientan hue/carácter).
 */
import type { PaletteName, Scale11 } from "../theme/primitives.js";

${consts}

/**
 * Gray canónico (neutro frío, curva estándar): con extremos 50/950 una sola
 * escala sirve a ambos schemes — los temas eligen extremos opuestos.
 */
export const gray = ${emitScaleLiteral(gray, "")} as const satisfies Scale11;

export const palettes = {
${record}
} as const satisfies Record<PaletteName, Scale11>;

export const paletteNames = [
${nameList}
] as const satisfies readonly PaletteName[];
`;
}

export function emitJson(
  palettes: Record<string, GeneratedScale>,
  gray: GeneratedScale,
): string {
  return `${JSON.stringify({ palettes, gray }, null, 2)}\n`;
}
