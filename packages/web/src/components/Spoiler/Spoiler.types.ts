import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface SpoilerProps extends StyleProps {
  children: ReactNode;
  maxHeight?: number | undefined;
  showLabel?: ReactNode | undefined;
  hideLabel?: ReactNode | undefined;
  expanded?: boolean | undefined;
  defaultExpanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  className?: string | undefined;
}
