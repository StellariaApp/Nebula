import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export type StatTrend = "up" | "down" | "flat";

export interface StatProps extends Omit<StyleProps, "align"> {
  label: ReactNode;
  labelProps?: TextSlotProps | undefined;
  value: ReactNode;
  valueProps?: TextSlotProps | undefined;
  descriptionProps?: TextSlotProps | undefined;
  iconProps?: BoxSlotProps | undefined;
  diffProps?: TextSlotProps | undefined;
  headProps?: BoxSlotProps | undefined;
  footProps?: BoxSlotProps | undefined;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  trend?: StatTrend | undefined;
  diff?: ReactNode | undefined;
  diffLabel?: string | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  align?: "start" | "center" | "end" | undefined;
  className?: string | undefined;
}
