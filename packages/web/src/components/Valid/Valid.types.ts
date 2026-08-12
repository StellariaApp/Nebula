import type { ReactNode } from "react";

export interface ValidProps {
  /**
   * Which branch renders. It defaults to false rather than true, so leaving it out renders the
   * `invalid` branch and never the children.
   * @default false
   */
  valid?: boolean | undefined;
  /**
   * What stands in when the value is not valid — an error message, a placeholder, an empty state.
   * Left out, an invalid value renders nothing.
   * @default null
   */
  invalid?: ReactNode | undefined;
  /** What renders once the value is valid. */
  children?: ReactNode | undefined;
}
