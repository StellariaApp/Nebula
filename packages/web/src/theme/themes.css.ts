import { createTheme } from "@vanilla-extract/css";

import { nebulaDark, nebulaLight, playful, soberLight } from "@stellaria/nebula-themes";

import { vars } from "./contract.css.js";
import { themeToVars } from "./theme-vars.js";

/**
 * Materialización en build de los 4 temas oficiales (ADR-016): una clase CSS por
 * tema. Aplicar la clase a un ancestro resuelve TODAS las vars del contrato para
 * ese subárbol — cambiar de tema = cambiar de clase, sin recomputación JS.
 */
const nebulaLightClass = createTheme(vars, themeToVars(nebulaLight));
const nebulaDarkClass = createTheme(vars, themeToVars(nebulaDark));
const soberLightClass = createTheme(vars, themeToVars(soberLight));
const playfulClass = createTheme(vars, themeToVars(playful));

export const themeClass = {
  "nebula-light": nebulaLightClass,
  "nebula-dark": nebulaDarkClass,
  "sober-light": soberLightClass,
  playful: playfulClass,
} as const;

export type OfficialThemeName = keyof typeof themeClass;
