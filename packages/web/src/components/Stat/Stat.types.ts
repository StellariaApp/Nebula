import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export type StatTrend = "up" | "down" | "flat";

export interface StatProps extends Omit<StyleProps, "align"> {
  label: ReactNode;
  /** The label, on the header row next to the glyph. */
  labelProps?: TextSlotProps | undefined;
  value: ReactNode;
  /** The figure. Its size comes from `size`. */
  valueProps?: TextSlotProps | undefined;
  /** The footer description. Only rendered with `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** The header glyph. Only rendered with `icon`, and it is `aria-hidden`. */
  iconProps?: BoxSlotProps | undefined;
  /** The change. Only rendered with `diff`, and it carries `data-trend`, which is where its colour comes from. The arrow and the screen-reader text live inside it and have no slot of their own. */
  diffProps?: TextSlotProps | undefined;
  /** The header row: label and glyph. */
  headProps?: BoxSlotProps | undefined;
  /** The footer: change and description. Not rendered if both are missing. */
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
