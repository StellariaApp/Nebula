import type { ReactNode } from "react";

export interface PortalProps {
  children?: ReactNode | undefined;
  target?: Element | string | null | undefined;
  disabled?: boolean | undefined;
}
