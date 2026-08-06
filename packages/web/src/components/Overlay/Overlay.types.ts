import type { ReactNode } from "react";

import type { ColorExtended, RadiusName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type OverlayBlur = "none" | "sm" | "md" | "lg";

export interface OverlayProps extends Omit<StyleProps, "opacity"> {
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  blur?: OverlayBlur | undefined;
  radius?: RadiusName | "none" | undefined;
  fixed?: boolean | undefined;
  center?: boolean | undefined;
  zIndex?: number | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
