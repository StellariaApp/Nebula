import { createVar, fallbackVar } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";

export const halo = createVar();
export const separator = createVar();

const HALO = fallbackVar(halo, vars.color.border.focus);
const SEPARATOR = fallbackVar(separator, vars.color.surface.base);

const OFFSET = 3;
const THICKNESS = 2;

export const forcedColors = "(forced-colors: active)";

export const ringForcedColors = {
  outline: `${String(THICKNESS)}px solid transparent`,
  outlineOffset: `${String(OFFSET)}px`,
} as const;

export const ring = {
  outline: "none",
  boxShadow: `0 0 0 ${String(OFFSET)}px ${SEPARATOR}, 0 0 0 ${String(OFFSET + THICKNESS)}px ${HALO}`,
  "@media": { [forcedColors]: ringForcedColors },
} as const;
