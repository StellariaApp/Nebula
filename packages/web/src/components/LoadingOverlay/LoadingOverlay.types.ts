import type { ReactNode } from "react";

import type { ColorExtended, RadiusName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { OverlayBlur } from "../Overlay/Overlay.types.js";

export interface LoadingOverlayProps extends Omit<StyleProps, "opacity"> {
  visible: boolean;
  label?: string | undefined;
  loader?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  blur?: OverlayBlur | undefined;
  radius?: RadiusName | "none" | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
}
