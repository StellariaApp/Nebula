import type { SemanticScaleName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type PaginationSize = "sm" | "md" | "lg" | "xl";

export interface PaginationLabels {
  root?: string | undefined;
  previous?: string | undefined;
  next?: string | undefined;
  first?: string | undefined;
  last?: string | undefined;
  page?: ((page: number) => string) | undefined;
}

export interface PaginationProps extends Omit<StyleProps, "color"> {
  total: number;
  page?: number | undefined;
  defaultPage?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  siblings?: number | undefined;
  boundaries?: number | undefined;
  withControls?: boolean | undefined;
  withEdges?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: PaginationSize | undefined;
  color?: SemanticScaleName | undefined;
  labels?: PaginationLabels | undefined;
  className?: string | undefined;
}

export type PaginationItem = number | "dots-start" | "dots-end";
