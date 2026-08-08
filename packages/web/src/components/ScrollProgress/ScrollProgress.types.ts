import type { RefObject } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface ScrollProgressProps extends Omit<StyleProps, "position"> {
  /** La barra que avanza. Su ancho sale de una variable que se escribe en la raiz, no aqui. */
  barProps?: BoxSlotProps | undefined;
  /** Elemento cuyo scroll se sigue. Sin él, el documento. */
  target?: RefObject<HTMLElement | null> | undefined;
  position?: "top" | "bottom" | "static" | undefined;
  height?: number | undefined;
  color?: ColorExtended | undefined;
  radius?: "none" | "sm" | "full" | undefined;
  withTrack?: boolean | undefined;
  onProgress?: ((value: number) => void) | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
