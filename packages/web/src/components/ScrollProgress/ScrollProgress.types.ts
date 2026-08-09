import type { RefObject } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface ScrollProgressProps extends Omit<StyleProps, "position"> {
  /** The advancing bar. Its width comes from a variable written on the root, not here. */
  barProps?: BoxSlotProps | undefined;
  /** The element whose scroll is tracked. Without it, the document. */
  target?: RefObject<HTMLElement | null> | undefined;
  position?: "top" | "bottom" | "static" | undefined;
  /** @default 3 */
  height?: number | undefined;
  color?: ColorExtended | undefined;
  radius?: "none" | "sm" | "full" | undefined;
  withTrack?: boolean | undefined;
  onProgress?: ((value: number) => void) | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
