import type { SpacingName } from "../theme/primitives.js";
import type { Unit } from "./dimensions.js";

export type SpacingValue = SpacingName | Unit;

export type PaddingProps = {
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  pt?: SpacingValue;
  pb?: SpacingValue;
  pl?: SpacingValue;
  pr?: SpacingValue;
};

export type MarginProps = {
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  mt?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mr?: SpacingValue;
};

export type GapProps = {
  gap?: SpacingValue;
  gapx?: SpacingValue;
  gapy?: SpacingValue;
};

export type SpacingProps = PaddingProps & MarginProps & GapProps;

export const KeysSpacing = [
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "gap",
  "gapx",
  "gapy",
] as const;
