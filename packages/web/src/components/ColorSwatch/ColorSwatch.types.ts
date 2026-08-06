import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface ColorSwatchProps extends StyleProps {
  color: ColorExtended | (string & {});
  size?: number | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  withShadow?: boolean | undefined;
  children?: ReactNode | undefined;
  label?: string | undefined;
  onPress?: (() => void) | undefined;
  className?: string | undefined;
}
