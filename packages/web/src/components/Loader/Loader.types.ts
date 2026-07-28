import type { SemanticScaleName, Size, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type LoaderVariant = "spinner" | "dots" | "bars";

export interface LoaderProps extends Omit<StyleProps, "color"> {
  variant?: LoaderVariant | undefined;
  size?: Size | Unit | undefined;
  color?: SemanticScaleName | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
