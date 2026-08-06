import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type StatTrend = "up" | "down" | "flat";

export interface StatProps extends Omit<StyleProps, "align"> {
  label: ReactNode;
  labelProps?: ComponentPropsWithoutRef<"span"> | undefined;
  value: ReactNode;
  valueProps?: ComponentPropsWithoutRef<"span"> | undefined;
  descriptionProps?: ComponentPropsWithoutRef<"span"> | undefined;
  iconProps?: ComponentPropsWithoutRef<"span"> | undefined;
  diffProps?: ComponentPropsWithoutRef<"span"> | undefined;
  headProps?: ComponentPropsWithoutRef<"div"> | undefined;
  footProps?: ComponentPropsWithoutRef<"div"> | undefined;
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
