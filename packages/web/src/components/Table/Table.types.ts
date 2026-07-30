import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type TableAlign = "start" | "center" | "end";

export interface TableProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  caption?: ReactNode | undefined;
  captionVisible?: boolean | undefined;
  striped?: boolean | undefined;
  withBorder?: boolean | undefined;
  highlightOnHover?: boolean | undefined;
  density?: "compact" | "normal" | "comfortable" | undefined;
  stickyHeader?: boolean | undefined;
  className?: string | undefined;
}

export interface TableSectionProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  className?: string | undefined;
}

export interface TableRowProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  selected?: boolean | undefined;
  onPress?: (() => void) | undefined;
  className?: string | undefined;
}

export interface TableCellProps extends Omit<StyleProps, "color" | "align"> {
  children?: ReactNode | undefined;
  numeric?: boolean | undefined;
  align?: TableAlign | undefined;
  colSpan?: number | undefined;
  scope?: "row" | "col" | undefined;
  className?: string | undefined;
}

export interface TableScrollProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  minWidth?: number | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
