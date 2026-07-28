import type { CSSProperties, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface CollapseProps extends StyleProps {
  in?: boolean | undefined;
  duration?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: ReactNode | undefined;
}
