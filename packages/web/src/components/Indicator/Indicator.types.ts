import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type IndicatorPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";

export interface IndicatorProps extends StyleProps {
  /**
   * La chapa. No se pinta con `disabled`, ni con un `count` que no llegue a cuenta —cero sin
   * `showZero`— y sin `label`. Sin `label` ni `count` es un punto pelado.
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
