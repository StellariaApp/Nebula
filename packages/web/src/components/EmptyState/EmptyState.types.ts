import type { ReactNode } from "react";
import type { StyleProps } from "../../utils/style-props.js";

export interface EmptyStateProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
}
