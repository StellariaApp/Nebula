import { createTheme } from "@vanilla-extract/css";

import { nebulaDark, nebulaLight } from "@stellaria/nebula-themes";

import { vars } from "./contract.css.js";
import { ThemeToVars } from "./theme-vars.js";

export const themeClass = {
  light: createTheme(vars, ThemeToVars(nebulaLight)),
  dark: createTheme(vars, ThemeToVars(nebulaDark)),
} as const;

export type OfficialThemeName = keyof typeof themeClass;
