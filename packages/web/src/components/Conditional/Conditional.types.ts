import type { ReactNode } from "react";

export interface ConditionalProps {
  /**
   * Which branch renders. It defaults to false rather than true, so leaving it out renders the
   * `fallback` and never the children.
   * @default false
   */
  when?: boolean | undefined;
  /**
   * The other branch. Left out, a false `when` renders nothing at all, which is the usual case.
   * @default null
   */
  fallback?: ReactNode | undefined;
  /**
   * The `when` branch. It is a plain ternary, not a mount gate: both branches are evaluated by the
   * parent before they get here, so an expression that must not run needs its own guard.
   */
  children?: ReactNode | undefined;
}
