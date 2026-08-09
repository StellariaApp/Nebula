import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type PanelOrientation = "horizontal" | "vertical";

export interface PanelLabels {
  separator: string;
}

export interface PanelProps extends StyleProps {
  /** The `master` panel. Its size comes from `size`; the two panels share a class but not a slot. */
  masterProps?: BoxSlotProps | undefined;
  /** The `detail` panel, which takes whatever is left. */
  detailProps?: BoxSlotProps | undefined;
  /**
   * The handle that splits the space. It carries the keyboard and pointer handling of the resize, so
   * an `onKeyDown` or an `onPointerDown` here replaces them instead of adding to them.
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
