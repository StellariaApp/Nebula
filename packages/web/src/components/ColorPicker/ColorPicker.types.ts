import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type ColorFormat = "hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla";

export interface ColorPickerProps extends StyleProps {
  /** La fila de muestras. Solo se pinta si hay `swatches`. */
  swatchesProps?: BoxSlotProps | undefined;
  /**
   * Cada muestra. Se esparce sobre TODAS. Su `background` se escribe DESPUES de la ranura, porque es
   * el color que representa; lo demas —tamano, radio, borde— si se ajusta desde aqui.
   */
  swatchProps?: BoxSlotProps | undefined;
  label?: ReactNode | undefined;
  size?: Size | undefined;
  format?: ColorFormat | undefined;
  withAlpha?: boolean | undefined;
  swatches?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  labels?: ColorPickerLabels | undefined;
  className?: string | undefined;
}

export interface ColorPickerLabels {
  area?: string | undefined;
  hue?: string | undefined;
  alpha?: string | undefined;
  swatches?: string | undefined;
  swatch?: ((value: string) => string) | undefined;
}

export interface ColorInputProps extends StyleProps, FormFieldSlotProps {
  /**
   * La pastilla que ensena el color. Se esparce sobre las DOS: la del inicio del campo y la de
   * dentro del boton. Su `background` se escribe despues de la ranura.
   */
  previewProps?: BoxSlotProps | undefined;
  /** El boton que abre el selector. Solo existe con `withPicker`. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * El desplegable con el selector, que es el envoltorio de motion de la superficie flotante y no
   * pasa por `Box`: no acepta style props. Su posicion la calcula React Aria y se escribe despues
   * de la ranura; el `style` que pases se compone con ella.
   */
  dropdownProps?: OverlayMotionSlotProps | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  format?: ColorFormat | undefined;
  withAlpha?: boolean | undefined;
  withPicker?: boolean | undefined;
  swatches?: readonly string[] | undefined;
  placement?: PopoverPlacement | undefined;
  placeholder?: string | undefined;
  openLabel?: string | undefined;
  labels?: ColorPickerLabels | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
