import type { ReactNode } from "react";

import type { Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type SectionSize = "sm" | "md" | "lg" | "xl";

export type SectionOrder = 2 | 3 | 4 | 5 | 6;

/** Props de cualquier parte de `Section`: hijos, `className` y las style props del sistema. */
export interface SectionSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export type SectionHeadingProps = SectionSlotProps;

export interface SectionProps extends StyleProps {
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
  order?: SectionOrder | undefined;
  divided?: boolean | undefined;
  glass?: boolean | undefined;
  reveal?: boolean | undefined;
  /** @default 1180 */
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  size?: SectionSize | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
