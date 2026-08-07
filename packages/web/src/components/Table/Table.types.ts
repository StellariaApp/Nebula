import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { TextSlotProps } from "../Text/Text.types.js";

export type TableAlign = "start" | "center" | "end";

export interface TableProps extends StyleProps {
  /**
   * El `caption` de la tabla. Con `captionVisible={false}` el texto queda dentro de un
   * `VisuallyHidden`, asi que lo que se pase aqui no se ve; sigue valiendo para `id` o `lang`.
   */
  captionProps?: TextSlotProps | undefined;
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

export interface TableSectionProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}

export interface TableRowProps extends StyleProps {
  children: ReactNode;
  selected?: boolean | undefined;
  onPress?: (() => void) | undefined;
  className?: string | undefined;
}

export interface TableCellProps extends Omit<StyleProps, "align"> {
  children?: ReactNode | undefined;
  numeric?: boolean | undefined;
  align?: TableAlign | undefined;
  colSpan?: number | undefined;
  scope?: "row" | "col" | undefined;
  className?: string | undefined;
}

export interface TableScrollProps extends StyleProps {
  children: ReactNode;
  minWidth?: number | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
