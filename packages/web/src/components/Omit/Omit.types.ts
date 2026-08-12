import type { ReactNode } from "react";

export interface OmitProps {
  /**
   * Removes the children when true. It is the inverse of a guard — the flag names what to drop, not
   * what to keep — so leaving it out renders them.
   * @default false
   */
  omit?: boolean | undefined;
  /**
   * What renders while it is kept. Nothing takes its place when omitted: this is a removal, not a
   * swap, and there is no fallback branch by design.
   */
  children?: ReactNode | undefined;
}
