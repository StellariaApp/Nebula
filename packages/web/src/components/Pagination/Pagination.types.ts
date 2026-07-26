import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface PaginationProps {
  total: number;
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  siblings?: number | undefined;
  boundaries?: number | undefined;
  size?: Size | undefined;
  disabled?: boolean | undefined;
  withControls?: boolean | undefined;
  color?: SemanticScaleName | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
