import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface MainProps extends Omit<StyleProps, "color" | "background"> {
  children?: ReactNode | undefined;
  header?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  background?: ReactNode | undefined;
  stickyHeader?: boolean | undefined;
  stickyFooter?: boolean | undefined;
  centered?: boolean | undefined;
  padded?: boolean | undefined;
  skipLabel?: string | undefined;
  withSkipLink?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
}
