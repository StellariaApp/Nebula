import type { BreakpointName, ZIndexName } from "../theme/primitives";
import type { Unit } from "./dimensions";

export type BreakpointToken = BreakpointName;
export type BreakpointValue = BreakpointToken | Unit;
export type ZIndexToken = ZIndexName;
export type ZIndexValue = ZIndexToken | number;

export type PositionProps = {
  position?: "relative" | "absolute" | "fixed" | "sticky" | "static";
  top?: Unit;
  right?: Unit;
  bottom?: Unit;
  left?: Unit;
};

export type IndexProps = {
  z?: ZIndexValue;
};

export type OverflowProps = {
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  overflowX?: "visible" | "hidden" | "scroll" | "auto";
  overflowY?: "visible" | "hidden" | "scroll" | "auto";
};

export type DisplayProps = OverflowProps & {
  display?: "flex" | "grid" | "block" | "inline" | "inline-flex" | "inline-block" | "none";
};

export type FlexProps = {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse" | boolean;
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  grow?: number | boolean;
  shrink?: number | boolean;
  basis?: number | "auto" | (string & Record<never, never>);
  flex?: number | string | boolean;
  self?: "auto" | "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
};

export type LayoutsProps = PositionProps & IndexProps & DisplayProps & OverflowProps & FlexProps;

export const KeysLayouts = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "z",
  "display",
  "overflow",
  "overflowX",
  "overflowY",
  "direction",
  "wrap",
  "align",
  "justify",
  "grow",
  "shrink",
  "basis",
  "flex",
  "self",
] as const;
