import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type GridListMode = "list" | "grid" | "carousel";

export interface GridListProps<T> extends Omit<StyleProps, "color"> {
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, mode: GridListMode, index: number) => ReactNode;
  mode?: GridListMode | undefined;
  defaultMode?: GridListMode | undefined;
  onModeChange?: ((mode: GridListMode) => void) | undefined;
  modes?: readonly GridListMode[] | undefined;
  cols?: number | undefined;
  minColWidth?: number | undefined;
  gap?: "xs" | "sm" | "md" | "lg" | undefined;
  empty?: ReactNode | undefined;
  label?: string | undefined;
  modeLabels?: Partial<Record<GridListMode, string>> | undefined;
  withSwitcher?: boolean | undefined;
  className?: string | undefined;
}
