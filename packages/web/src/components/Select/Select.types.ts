import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";

export interface SelectProps extends StyleProps, FormFieldSlotProps {
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
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  emptyLabel?: string | undefined;
  className?: string | undefined;
  /** El boton que abre la lista. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El valor mostrado en el boton. Lleva el estilo de marcador cuando no hay seleccion. */
  valueProps?: BoxSlotProps | undefined;
  /** El chevron. Lleva `data-open`, que es de donde sale su giro. */
  chevronProps?: BoxSlotProps | undefined;
  /**
   * El desplegable, que es el envoltorio de motion de la superficie flotante y no pasa por `Box`:
   * no acepta style props. Su ancho y su posición se escriben después de la ranura y no se pisan;
   * el `style` que pases se compone con ellos.
   */
  dropdownProps?: OverlayMotionSlotProps | undefined;
  rootClassName?: string | undefined;
  name?: string | undefined;
}
