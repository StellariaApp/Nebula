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

export const officialThemeNames = enumValues<OfficialThemeName>()([
  "nebula-light",
  "nebula-dark",
  "sober-light",
  "playful",
]);
