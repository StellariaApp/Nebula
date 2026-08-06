import type { ReactNode } from "react";

import type { Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface KbdProps extends StyleProps {
  children?: ReactNode | undefined;
  size?: Size | undefined;
  className?: string | undefined;
}
