import { SHADES } from "./curves.ts";
import type { GeneratedScale } from "./generate.ts";

function EmitScaleLiteral(scale: GeneratedScale, indent: string): string {
  const lines = SHADES.map((shade) => `${indent}  ${shade}: "${scale[shade]}",`);
  return `{\n${lines.join("\n")}\n${indent}}`;
}

export function EmitTokensModule(
  palettes: Record<string, GeneratedScale>,
  gray: GeneratedScale,
): string {
  const names = Object.keys(palettes);
  const consts = names
    .map(
      (name) =>
        `export const ${name} = ${EmitScaleLiteral(palettes[name] as GeneratedScale, "")} as const satisfies Scale11;`,
    )
    .join("\n\n");
  const record = names.map((name) => `  ${name},`).join("\n");
  const name_list = names.map((name) => `  "${name}",`).join("\n");

  return `import type { PaletteName, Scale11 } from "../theme/primitives.js";

${consts}

export const gray = ${EmitScaleLiteral(gray, "")} as const satisfies Scale11;

export const palettes = {
${record}
} as const satisfies Record<PaletteName, Scale11>;

export const paletteNames = [
${name_list}
] as const satisfies readonly PaletteName[];
`;
}

export function EmitJson(palettes: Record<string, GeneratedScale>, gray: GeneratedScale): string {
  return `${JSON.stringify({ palettes, gray }, null, 2)}\n`;
}
