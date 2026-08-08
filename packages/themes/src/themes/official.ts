import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { enumValues } from "../enums.js";
import { nebulaDark } from "./nebula-dark.js";
import { nebulaLight } from "./nebula-light.js";

export const officialThemes = {
  light: nebulaLight,
  dark: nebulaDark,
} satisfies Record<string, NebulaTheme>;

export type OfficialThemeName = keyof typeof officialThemes;

export const officialThemeNames = enumValues<OfficialThemeName>()(["light", "dark"]);
