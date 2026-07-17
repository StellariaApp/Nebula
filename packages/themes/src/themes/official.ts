/**
 * Registro de temas oficiales (docs/02 §3). Un solo artefacto por tema alimenta
 * web (CSS vars) y native (Unistyles) — ADR-006. `sober-dark` llegará como
 * parte de la familia sober sin renombrar nada.
 */
import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { enumValues } from "../enums.js";
import { nebulaDark } from "./nebula-dark.js";
import { nebulaLight } from "./nebula-light.js";
import { playful } from "./playful.js";
import { soberLight } from "./sober-light.js";

export const officialThemes = {
  "nebula-light": nebulaLight,
  "nebula-dark": nebulaDark,
  "sober-light": soberLight,
  playful,
} satisfies Record<string, NebulaTheme>;

export type OfficialThemeName = keyof typeof officialThemes;

/** Tupla exhaustiva (error de compilación si se añade un tema y no se lista aquí). */
export const officialThemeNames = enumValues<OfficialThemeName>()([
  "nebula-light",
  "nebula-dark",
  "sober-light",
  "playful",
]);
