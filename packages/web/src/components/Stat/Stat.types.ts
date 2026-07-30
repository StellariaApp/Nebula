import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type StatTrend = "up" | "down" | "flat";

export interface StatProps extends Omit<StyleProps, "color" | "align"> {
  label: ReactNode;
  value: ReactNode;
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
