import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { OverlayBlur } from "../Overlay/Overlay.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface LoadingOverlayProps extends Omit<StyleProps, "opacity"> {
  visible: boolean;
  label?: string | undefined;
  loader?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  blur?: OverlayBlur | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
  /** The status box. It carries `role="status"`, so its content is announced. */
  bodyProps?: BoxSlotProps | undefined;
  /** Wrapper for the spinner. The spinner itself is replaced with `loader`. */
  loaderProps?: BoxSlotProps | undefined;
  /** The label below the spinner. */
  labelProps?: TextSlotProps | undefined;
}
