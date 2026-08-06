import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface NProgressProps extends StyleProps {
  loading?: boolean | undefined;
  value?: number | undefined;
  color?: ColorExtended | undefined;
  height?: number | undefined;
  zIndex?: number | undefined;
  label?: string | undefined;
  withinPortal?: boolean | undefined;
  className?: string | undefined;
}
