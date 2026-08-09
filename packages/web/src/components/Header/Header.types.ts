import type { ElementType, ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface HeaderLabels {
  back: string;
}

export type HeaderOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeaderProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  order?: HeaderOrder | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  withBack?: boolean | undefined;
  onBack?: (() => void) | undefined;
  backIcon?: ReactNode | undefined;
  labels?: Partial<HeaderLabels> | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  /** The row that splits the width between the left group, the heading and the right one. `children` hangs below it, not inside. */
  rowProps?: BoxSlotProps | undefined;
  /** The left group. Not rendered without `withBack` or `leftSection`. */
  leadProps?: BoxSlotProps | undefined;
  /** The title and subtitle column. Not rendered without `title` or `subtitle`. */
  headingProps?: BoxSlotProps | undefined;
  /** The right group. Only rendered with `rightSection`. */
  trailProps?: BoxSlotProps | undefined;
  /** The band below the row, which is where `children` lands. It does not exist without them. */
  bodyProps?: BoxSlotProps | undefined;
  /** The title. Its tag comes from `order` (`h1`-`h6`), so `component` here changes the tag without changing the level that is announced. With `component` on the `Header` itself, its `id` names the region and is written AFTER the slot so it cannot be overridden. */
  titleProps?: TextSlotProps | undefined;
  /** The subtitle. Only rendered with `subtitle`. */
  subtitleProps?: TextSlotProps | undefined;
  /** The back button. It only exists with `withBack`, and it spreads AFTER the handler and the label, so it can replace both; the label also has its own route through `labels.back`. */
  backProps?: ActionIconProps | undefined;
}
