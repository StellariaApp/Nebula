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
  /** Every entry on the line. It spreads over all of them. */
  itemProps?: BoxSlotProps | undefined;
  /** The bullet. It carries `data-reached`, which is what tints it once the active one has passed. */
  bulletProps?: BoxSlotProps | undefined;
  /** The vertical run between bullets. */
  lineProps?: BoxSlotProps | undefined;
  /** Title, meta and description column. */
  bodyProps?: BoxSlotProps | undefined;
  /** The entry title. */
  titleProps?: TextSlotProps | undefined;
  /** The meta line, when the entry has one. */
  metaProps?: TextSlotProps | undefined;
  /** The entry description, when it has one. */
  descriptionProps?: TextSlotProps | undefined;
}
