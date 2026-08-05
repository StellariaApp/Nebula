import { fallbackVar } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";

import * as variables from "./focus.vars.css.js";

const HALO = fallbackVar(variables.halo, vars.color.border.focus);

const OFFSET = 4;
const THICKNESS = 2;

export const ring = {
  outline: `${String(THICKNESS)}px solid ${HALO}`,
  outlineOffset: `${String(OFFSET)}px`,
} as const;
