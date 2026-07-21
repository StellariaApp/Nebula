import type { ReactNode } from "react";

export interface ValidProps {
  valid?: boolean | undefined;
  invalid?: ReactNode | undefined;
  children?: ReactNode | undefined;
}
