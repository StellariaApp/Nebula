import type { RadiusName } from "../theme/primitives.js";
import type { ColorExtended } from "./colors.js";
import type { Unit } from "./dimensions.js";

export type RadiusToken = RadiusName;
export type RadiusValue = RadiusToken | Unit;

type BorderStyle = "solid" | "dashed" | "dotted" | "none";
type Border = `${Unit} ${BorderStyle} ${ColorExtended}` | `${Unit} ${BorderStyle}` | `${Unit}`;

export type BorderProps = {
  r?: RadiusValue;
  rl?: RadiusValue;
  rr?: RadiusValue;
  rt?: RadiusValue;
  rb?: RadiusValue;
  bd?: Border;
  bdw?: Unit;
  bds?: BorderStyle;
  bdc?: ColorExtended;
  bdb?: Border;
  bdt?: Border;
  bdl?: Border;
  bdr?: Border;
};

export const KeysBorder = [
  "r",
  "rl",
  "rr",
  "rt",
  "rb",
  "bd",
  "bdw",
  "bds",
  "bdc",
  "bdb",
  "bdt",
  "bdl",
  "bdr",
] as const;
