import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { StyleProps } from "../../utils/style-props.js";

export interface EmptyStateProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  titleProps?: ComponentPropsWithoutRef<"p"> | undefined;
  descriptionProps?: ComponentPropsWithoutRef<"p"> | undefined;
  iconProps?: ComponentPropsWithoutRef<"span"> | undefined;
  actionsProps?: ComponentPropsWithoutRef<"div"> | undefined;
}
