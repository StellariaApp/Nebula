import type { ReactNode } from "react";

import type { Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type SectionSize = "sm" | "md" | "lg" | "xl";

export interface SectionProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  aside?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  loading?: boolean | undefined;
  error?: ReactNode | undefined;
  empty?: ReactNode | undefined;
  isEmpty?: boolean | undefined;
  order?: 2 | 3 | 4 | 5 | 6 | undefined;
  divided?: boolean | undefined;
  glass?: boolean | undefined;
  reveal?: boolean | undefined;
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  size?: SectionSize | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
