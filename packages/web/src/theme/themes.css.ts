import { createTheme } from "@vanilla-extract/css";

import { nebulaDark, nebulaLight, playful, soberLight } from "@stellaria/nebula-themes";

import { vars } from "./contract.css.js";
import { ThemeToVars } from "./theme-vars.js";

export const themeClass = {
  "nebula-light": createTheme(vars, ThemeToVars(nebulaLight)),
  "nebula-dark": createTheme(vars, ThemeToVars(nebulaDark)),
  "sober-light": createTheme(vars, ThemeToVars(soberLight)),
  playful: createTheme(vars, ThemeToVars(playful)),
} as const;

export type OfficialThemeName = keyof typeof themeClass;
