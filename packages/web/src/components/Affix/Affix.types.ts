import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface AffixPosition {
  top?: number | string | undefined;
  right?: number | string | undefined;
  bottom?: number | string | undefined;
  left?: number | string | undefined;
}

export interface AffixProps extends Omit<
  StyleProps,
  "color" | "top" | "right" | "bottom" | "left" | "position" | "zIndex"
> {
  children: ReactNode;
  /** @default { bottom: 24, right: 24 } */
  position?: AffixPosition | undefined;
  zIndex?: number | undefined;
  withinPortal?: boolean | undefined;
  visible?: boolean | undefined;
  className?: string | undefined;
}
