import type { ReactNode } from "react";

import type { Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type FilterKind =
  "select" | "multiselect" | "radio" | "range" | "date" | "daterange" | "text";

export interface FilterOption {
  value: string;
  label: string;
  description?: ReactNode | undefined;
  disabled?: boolean | undefined;
}

export interface FilterDescriptor {
  key: string;
  label: ReactNode;
  type: FilterKind;
  options?: readonly FilterOption[] | undefined;
  placeholder?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  clearable?: boolean | undefined;
  disabled?: boolean | undefined;
}

export type FilterValue = string | readonly string[];

export type FilterState = Readonly<Record<string, FilterValue>>;

export interface FilterAccessors {
  value: (key: string) => string | undefined;
  values: (key: string) => readonly string[] | undefined;
  onSet: (key: string, value: FilterValue) => void;
  onDelete: (key: string) => void;
}

export interface FilterLabels {
  apply: string;
  clear: string;
  clearAll: string;
  trigger: string;
  empty: string;
  from: string;
  to: string;
}

export interface FilterProps {
  /** La fila de los dos campos. Solo existe cuando el filtro es de tipo `range`. */
  rangeProps?: BoxSlotProps | undefined;
  filter: FilterDescriptor;
  accessors: FilterAccessors;
  size?: Size | undefined;
  labels?: Partial<FilterLabels> | undefined;
  className?: string | undefined;
}

export interface FiltersProps extends StyleProps {
  /** El panel del popover. */
  panelProps?: BoxSlotProps | undefined;
  /** El aviso de que no hay filtros. Solo se pinta si la lista viene vacia. */
  emptyProps?: TextSlotProps | undefined;
  /** La lista de filtros. No se pinta mientras `loading`. */
  listProps?: BoxSlotProps | undefined;
  /** El pie con el boton de limpiar. Solo aparece si hay filtros activos. */
  footProps?: BoxSlotProps | undefined;
  filters: readonly FilterDescriptor[];
  state?: FilterState | undefined;
  /** @default {} */
  defaultState?: FilterState | undefined;
  onChange?: ((state: FilterState) => void) | undefined;
  accessors?: FilterAccessors | undefined;
  size?: Size | undefined;
  loading?: boolean | undefined;
  placement?: PopoverPlacement | undefined;
  labels?: Partial<FilterLabels> | undefined;
  className?: string | undefined;
}
