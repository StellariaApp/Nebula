import type { SemanticScaleName, Size, Unit } from "@stellaria/nebula-tokens";

export type LoaderVariant = "spinner" | "dots" | "bars";

export interface LoaderProps {
  variant?: LoaderVariant | undefined;
  size?: Size | Unit | undefined;
  color?: SemanticScaleName | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
