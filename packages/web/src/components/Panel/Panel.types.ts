import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type PanelOrientation = "horizontal" | "vertical";

export interface PanelLabels {
  separator: string;
}

export interface PanelProps extends StyleProps {
  /** El panel de `master`. Su tamaño lo fija `size`; los dos paneles comparten clase pero no ranura. */
  masterProps?: BoxSlotProps | undefined;
  /** El panel de `detail`, que ocupa lo que sobra. */
  detailProps?: BoxSlotProps | undefined;
  /**
   * El asa que reparte el espacio. Lleva el teclado y el puntero del redimensionado, así que un
   * `onKeyDown` o un `onPointerDown` aquí los sustituye en vez de sumarse.
   */
  separatorProps?: BoxSlotProps | undefined;
  master: ReactNode;
  detail: ReactNode;
  size?: number | undefined;
  defaultSize?: number | undefined;
  onSizeChange?: ((size: number) => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  orientation?: PanelOrientation | undefined;
  resizable?: boolean | undefined;
  labels?: Partial<PanelLabels> | undefined;
  className?: string | undefined;
}
