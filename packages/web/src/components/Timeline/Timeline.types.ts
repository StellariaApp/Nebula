import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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
  itemProps?: BoxSlotProps | undefined;
  bulletProps?: BoxSlotProps | undefined;
  lineProps?: BoxSlotProps | undefined;
  bodyProps?: BoxSlotProps | undefined;
  titleProps?: TextSlotProps | undefined;
  metaProps?: TextSlotProps | undefined;
  descriptionProps?: TextSlotProps | undefined;
}
