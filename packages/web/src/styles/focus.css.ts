import { createVar, fallbackVar } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";

export const halo = createVar();
export const separator = createVar();

const HALO = fallbackVar(halo, vars.color.border.focus);
const SEPARATOR = fallbackVar(separator, vars.color.surface.base);

export const forcedColors = "(forced-colors: active)";

export const ringForcedColors = {
  outline: "2px solid transparent",
  outlineOffset: "2px",
} as const;

export const ring = {
  outline: "none",
  boxShadow: `0 0 0 2px ${SEPARATOR}, 0 0 0 4px ${HALO}`,
  "@media": { [forcedColors]: ringForcedColors },
} as const;
