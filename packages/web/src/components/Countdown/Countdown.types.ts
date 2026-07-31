import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  finished: string;
  remaining: (parts: CountdownParts) => string;
}

export interface CountdownProps extends Omit<StyleProps, "color"> {
  /** Instante objetivo en ISO (ADR-050: el valor que cruza la API pública es string, no Date). */
  to: string;
  onComplete?: (() => void) | undefined;
  withDays?: boolean | undefined;
  withSeconds?: boolean | undefined;
  finished?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  labels?: Partial<CountdownLabels> | undefined;
  className?: string | undefined;
}
