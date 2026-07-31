import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface SectionProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  aside?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  loading?: boolean | undefined;
  error?: ReactNode | undefined;
  empty?: ReactNode | undefined;
  isEmpty?: boolean | undefined;
  order?: 2 | 3 | 4 | 5 | 6 | undefined;
  divided?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
