import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type DateDisplayMode = "absolute" | "relative" | "auto";

export type DateDisplayPreset = "date" | "datetime" | "time" | "long" | "short";

export interface DateDisplayProps extends StyleProps {
  value?: string | number | Date | null | undefined;
  mode?: DateDisplayMode | undefined;
  preset?: DateDisplayPreset | undefined;
  locale?: string | undefined;
  timeZone?: string | undefined;
  options?: Intl.DateTimeFormatOptions | undefined;
  relativeThreshold?: number | undefined;
  withTitle?: boolean | undefined;
  now?: Date | number | undefined;
  fallback?: ReactNode | undefined;
  className?: string | undefined;
}
