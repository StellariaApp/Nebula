import type {
  BodyLevel,
  FontFamilyName,
  FontWeightName,
  FontWeightValue,
  HeadingLevel,
  LetterSpacingName,
  LineHeightName,
} from "../theme/primitives.js";
import type { Unit } from "./dimensions.js";

export type FontFamily = FontFamilyName;
export type FontWeight = FontWeightName | FontWeightValue;
export type LineHeight = LineHeightName | Unit;
export type LetterSpacing = LetterSpacingName | Unit;

export type HeadingSize = HeadingLevel;
export type BodySize = BodyLevel;
export type TextSize = HeadingSize | BodySize | "button" | "caption";
export type TextValue = TextSize | Unit;

export type TypographyProps = {
  ff?: FontFamily;
  fz?: TextValue;
  fw?: FontWeight;
  lh?: LineHeight;
  ls?: LetterSpacing;
  ta?: "left" | "center" | "right" | "justify";
  td?: "none" | "underline" | "line-through";
  tt?: "none" | "uppercase" | "lowercase" | "capitalize";
  ws?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
  truncate?: boolean | number | string;
  lines?: number;
  inherit?: boolean;
};

export const KeysTypography = [
  "ff",
  "fz",
  "fw",
  "lh",
  "ls",
  "ta",
  "td",
  "tt",
  "truncate",
  "ws",
  "lines",
  "inherit",
] as const;
