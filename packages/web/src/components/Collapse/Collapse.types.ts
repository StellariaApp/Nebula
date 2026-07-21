import type { CSSProperties, ReactNode } from "react";

export interface CollapseProps {
  in?: boolean | undefined;
  duration?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: ReactNode | undefined;
}
