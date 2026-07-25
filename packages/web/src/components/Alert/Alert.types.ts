import type { ReactNode } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

export type AlertVariant = "light" | "filled" | "outline";

export interface AlertProps {
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
