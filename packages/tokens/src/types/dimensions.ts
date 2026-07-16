import type { SpacingValue } from "./spacing.js";

export type UnitsKeys =
  | "px"
  | "vw"
  | "vh"
  | "fr"
  | "%"
  | "em"
  | "rem"
  | "ch"
  | "ex"
  | "cm"
  | "mm"
  | "in"
  | "pt"
  | "pc";
export type Units = `${number}${UnitsKeys}`;
/** `string & Record<never, never>` preserva el autocomplete de los literales. */
export type Unit = number | (string & Record<never, never>) | Units;

export type DimensionValue = SpacingValue | Unit | "auto";

export type WidthProps = {
  w?: DimensionValue;
  miw?: DimensionValue;
  maw?: DimensionValue;
};

export type HeightProps = {
  h?: DimensionValue;
  mih?: DimensionValue;
  mah?: DimensionValue;
};

export type SizeProps = {
  size?: DimensionValue;
};

export type DimensionsProps = WidthProps & HeightProps & SizeProps;

export const KeysUnit = [
  "px",
  "vw",
  "vh",
  "fr",
  "%",
  "em",
  "rem",
  "ch",
  "ex",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
] as const;
export const KeysDimensions = ["w", "miw", "maw", "h", "mih", "mah", "size"] as const;
