import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface GlobalSearchResult {
  id: string;
  title: string;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  group?: string | undefined;
  href?: string | undefined;
  onSelect?: (() => void) | undefined;
}

export interface GlobalSearchLabels {
  trigger: string;
  input: string;
  placeholder: string;
  empty: string;
  loading: string;
  recent: string;
  results: (count: number) => string;
  shortcut: string;
}

export interface GlobalSearchProps extends StyleProps {
  results: readonly GlobalSearchResult[];
  onQueryChange: (query: string) => void;
  onSelect?: ((result: GlobalSearchResult) => void) | undefined;
  opened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  query?: string | undefined;
  loading?: boolean | undefined;
  debounce?: number | undefined;
  recent?: readonly GlobalSearchResult[] | undefined;
  withTrigger?: boolean | undefined;
  withShortcut?: boolean | undefined;
  empty?: ReactNode | undefined;
  labels?: Partial<GlobalSearchLabels> | undefined;
  className?: string | undefined;
  /** El boton que abre el buscador. No existe si se controla desde fuera con `opened`. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El atajo de teclado del disparador. Solo con `withShortcut`. */
  shortcutProps?: BoxSlotProps | undefined;
  /** La fila del campo de busqueda, dentro del panel. */
  searchRowProps?: BoxSlotProps | undefined;
  /** Envoltorio de icono. Cae sobre la lupa Y sobre el icono de cada resultado. */
  iconProps?: BoxSlotProps | undefined;
  /** El campo de busqueda, que es el `combobox`. */
  inputProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** La lista de resultados, que es el `listbox`. */
  listProps?: BoxSlotProps | undefined;
  /** El rotulo de cada grupo. Se esparce sobre todos. */
  groupLabelProps?: TextSlotProps | undefined;
  /** Cada resultado. Se esparce sobre todos; el activo lleva `aria-selected`. */
  optionProps?: BoxSlotProps | undefined;
  /** Columna de titulo y descripcion de cada resultado. */
  optionBodyProps?: BoxSlotProps | undefined;
  /** El titulo de cada resultado. */
  optionTitleProps?: TextSlotProps | undefined;
  /** La descripcion de cada resultado, si la trae. */
  optionDescriptionProps?: TextSlotProps | undefined;
  /** El aviso de sin resultados. Solo se pinta si no hay ninguno y no esta cargando. */
  statusProps?: TextSlotProps | undefined;
}
