import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type IndicatorPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";

export interface IndicatorProps extends StyleProps {
  /**
   * The badge. Not rendered with `disabled`, nor with a `count` that does not qualify — zero without
   * `showZero` — and no `label`. With neither `label` nor `count` it is a bare dot.
   */
  dotProps?: BoxSlotProps | undefined;
  children: ReactNode;
  label?: ReactNode | undefined;
  count?: number | undefined;
  max?: number | undefined;
  showZero?: boolean | undefined;
  disabled?: boolean | undefined;
  processing?: boolean | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  placement?: IndicatorPlacement | undefined;
  offset?: number | undefined;
  withBorder?: boolean | undefined;
  announce?: string | undefined;
  className?: string | undefined;
}
