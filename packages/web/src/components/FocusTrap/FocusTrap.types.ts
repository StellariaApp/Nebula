import type { ReactNode } from "react";

export interface FocusTrapProps {
  active?: boolean | undefined;
  restoreFocus?: boolean | undefined;
  autoFocus?: boolean | undefined;
  children: ReactNode;
}
