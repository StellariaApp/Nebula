import type { ColorExtended, Size, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type LoaderType = "spinner" | "dots" | "bars";

export interface LoaderProps extends Omit<StyleProps, "color"> {
  type?: LoaderType | undefined;
  size?: Size | Unit | undefined;
  color?: ColorExtended | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
