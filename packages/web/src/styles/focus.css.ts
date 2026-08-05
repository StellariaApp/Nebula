import { fallbackVar } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";

import { halo } from "./focus.vars.css.js";

const HALO = fallbackVar(halo, vars.color.border.focus);

const OFFSET = 4;
const THICKNESS = 2;

export const ring = {
  outline: `${String(THICKNESS)}px solid ${HALO}`,
  outlineOffset: `${String(OFFSET)}px`,
} as const;
