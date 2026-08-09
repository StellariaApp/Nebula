import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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

export interface CountdownProps extends StyleProps {
  /** Target instant in ISO (ADR-050: the value that crosses the public API is a string, not a Date). */
  to: string;
  onComplete?: (() => void) | undefined;
  withDays?: boolean | undefined;
  withSeconds?: boolean | undefined;
  finished?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  labels?: Partial<CountdownLabels> | undefined;
  className?: string | undefined;
  /** Every unit — days, hours, minutes. It spreads over ALL of them, not over one. */
  unitProps?: BoxSlotProps | undefined;
  /** The figure of each unit, already padded to two digits. */
  valueProps?: TextSlotProps | undefined;
  /** The label below the figure. */
  captionProps?: TextSlotProps | undefined;
}
