import { createTheme } from "@vanilla-extract/css";

import { nebulaDark } from "../themes/nebula/dark.js";
import { nebulaLight } from "../themes/nebula/light.js";

import { vars } from "./contract.css.js";
import { ThemeToVars } from "./theme-vars.js";

export const THEME_CLASSES = {
  light: createTheme(vars, ThemeToVars(nebulaLight)),
  dark: createTheme(vars, ThemeToVars(nebulaDark)),
} as const;

