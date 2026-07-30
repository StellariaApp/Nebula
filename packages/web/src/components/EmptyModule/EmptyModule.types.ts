import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type EmptyModuleSurface = "none" | "paper" | "outline" | "dashed";

export interface EmptyModuleProps extends Omit<StyleProps, "color"> {
  title: ReactNode;
  description?: ReactNode | undefined;
  illustration?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  secondaryAction?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  surface?: EmptyModuleSurface | undefined;
  className?: string | undefined;
}
