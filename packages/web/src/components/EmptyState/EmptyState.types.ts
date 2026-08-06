import type { ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface EmptyStateProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  titleProps?: TextSlotProps | undefined;
  descriptionProps?: TextSlotProps | undefined;
  iconProps?: BoxSlotProps | undefined;
  actionsProps?: BoxSlotProps | undefined;
}
