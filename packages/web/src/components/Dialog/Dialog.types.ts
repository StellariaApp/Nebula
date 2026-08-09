import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type DialogCorner = "bottom-end" | "bottom-start" | "top-end" | "top-start";

export interface DialogProps extends Omit<
  StyleProps,
  "color" | "top" | "right" | "bottom" | "left" | "position" | "zIndex"
> {
  opened: boolean;
  onClose?: (() => void) | undefined;
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  corner?: DialogCorner | undefined;
  offset?: number | undefined;
  width?: number | string | undefined;
  zIndex?: number | undefined;
  withCloseButton?: boolean | undefined;
  closeLabel?: string | undefined;
  withinPortal?: boolean | undefined;
  live?: "polite" | "assertive" | undefined;
  className?: string | undefined;
  /**
   * The header row. Only rendered with `title` or with `withCloseButton`; the button also needs
   * `onClose`, so without it the row renders empty.
   */
  headProps?: BoxSlotProps | undefined;
  /** The title. Without `title` the header leaves an empty gap so the close button does not shift. */
  titleProps?: TextSlotProps | undefined;
  "aria-label"?: string | undefined;
}
