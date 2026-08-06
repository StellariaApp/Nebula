import type { ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { EmptyStateProps } from "../EmptyState/EmptyState.types.js";

export type EmptyModuleSurface = "none" | "paper" | "outline" | "dashed";

export interface EmptyModuleProps extends StyleProps {
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
  illustrationProps?: BoxSlotProps | undefined;
  actionsProps?: BoxSlotProps | undefined;
  footerProps?: BoxSlotProps | undefined;
}
