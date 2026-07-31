import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type PanelOrientation = "horizontal" | "vertical";

export interface PanelLabels {
  separator: string;
}

export interface PanelProps extends Omit<StyleProps, "color"> {
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
