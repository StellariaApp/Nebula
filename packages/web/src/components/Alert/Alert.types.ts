import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type AlertVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export interface AlertProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  variant?: AlertVariant | undefined;
  icon?: ReactNode | undefined;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeLabel?: string | undefined;
  live?: "status" | "alert" | "off" | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
}
