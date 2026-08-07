import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { UnstyledButtonProps } from "../UnstyledButton/UnstyledButton.types.js";

export interface MultiSelectProps extends StyleProps, FormFieldSlotProps {
  /** La caja que agrupa las fichas y el buscador. */
  controlProps?: BoxSlotProps | undefined;
  /** Cada ficha de valor elegido. Se esparce sobre TODAS. */
  chipProps?: BoxSlotProps | undefined;
  /** El rotulo de cada ficha. */
  chipLabelProps?: TextSlotProps | undefined;
  /** La aspa que quita cada ficha. Su rotulo accesible sale de `removeLabel`. */
  chipRemoveProps?: UnstyledButtonProps | undefined;
  /**
   * El campo de busqueda. Se esparce DESPUES de las props de combobox de aria y del manejador de
   * teclado propio, asi que un `onKeyDown` aqui se lleva por delante el borrado con retroceso.
   */
  searchProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** El boton que abre la lista. */
  triggerProps?: UnstyledButtonProps | undefined;
  /** El chevron de ese boton. Lleva `data-open`, que es de donde sale su giro. */
  chevronProps?: BoxSlotProps | undefined;
  /** El desplegable. Su ancho se calcula del control; la ranura se compone, no lo pisa. */
  dropdownProps?: BoxSlotProps | undefined;
  data: readonly SelectOption[];
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  placeholder?: string | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  field?: NebulaField<string[]> | undefined;
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  searchable?: boolean | undefined;
  maxValues?: number | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  emptyLabel?: string | undefined;
  removeLabel?: ((option: SelectOption) => string) | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
