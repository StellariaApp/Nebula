import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type TimelineVariant = Extract<Variant, "filled" | "light" | "outline">;

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode | undefined;
  meta?: ReactNode | undefined;
  bullet?: ReactNode | undefined;
  color?: ColorExtended | undefined;
}

export interface TimelineProps extends Omit<StyleProps, "align"> {
  items: readonly TimelineItem[];
  active?: number | undefined;
  variant?: TimelineVariant | undefined;
  color?: ColorExtended | undefined;
  align?: "start" | "end" | undefined;
  bulletSize?: number | undefined;
  lineWidth?: number | undefined;
  reachedLabel?: string | undefined;
  className?: string | undefined;
}
