import type { ReactNode } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type AlertVariant = "light" | "filled" | "outline";

export interface AlertProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  color?: SemanticScaleName | undefined;
  variant?: AlertVariant | undefined;
  icon?: ReactNode | undefined;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeLabel?: string | undefined;
  live?: "status" | "alert" | "off" | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
}
