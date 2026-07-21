import type { ReactNode } from "react";

export interface ConditionalProps {
  when?: boolean | undefined;
  fallback?: ReactNode | undefined;
  children?: ReactNode | undefined;
}
