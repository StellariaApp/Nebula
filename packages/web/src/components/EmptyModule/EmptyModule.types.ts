import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { EmptyStateProps } from "../EmptyState/EmptyState.types.js";

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
  titleProps?: EmptyStateProps["titleProps"] | undefined;
  descriptionProps?: EmptyStateProps["descriptionProps"] | undefined;
  iconProps?: EmptyStateProps["iconProps"] | undefined;
  illustrationProps?: ComponentPropsWithoutRef<"div"> | undefined;
  actionsProps?: ComponentPropsWithoutRef<"span"> | undefined;
  footerProps?: ComponentPropsWithoutRef<"div"> | undefined;
}
