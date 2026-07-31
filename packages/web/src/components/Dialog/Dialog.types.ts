import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type DialogCorner = "bottom-end" | "bottom-start" | "top-end" | "top-start";

export interface DialogProps extends Omit<StyleProps, "color" | "top" | "right" | "bottom" | "left" | "position" | "zIndex"> {
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
  "aria-label"?: string | undefined;
}
