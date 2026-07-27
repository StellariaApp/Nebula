import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface PaginationLabels {
  root?: string | undefined;
  previous?: string | undefined;
  next?: string | undefined;
  first?: string | undefined;
  last?: string | undefined;
  page?: ((page: number) => string) | undefined;
}

export interface PaginationProps {
  total: number;
  page?: number | undefined;
  defaultPage?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  siblings?: number | undefined;
  boundaries?: number | undefined;
  withControls?: boolean | undefined;
  withEdges?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  labels?: PaginationLabels | undefined;
  className?: string | undefined;
}

export type PaginationItem = number | "dots-start" | "dots-end";
