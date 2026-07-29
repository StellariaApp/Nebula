import { createVar, fallbackVar } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";

export const halo = createVar();

const HALO = fallbackVar(halo, vars.color.border.focus);

const OFFSET = 4;
const THICKNESS = 2;

export const ring = {
  outline: `${String(THICKNESS)}px solid ${HALO}`,
  outlineOffset: `${String(OFFSET)}px`,
} as const;
