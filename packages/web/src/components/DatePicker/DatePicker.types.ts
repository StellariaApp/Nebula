import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, DateRange, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { CalendarLabels, CalendarVariant } from "../Calendar/Calendar.types.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type DateGranularity = "day" | "hour" | "minute" | "second";

export interface DatePickerBaseProps extends StyleProps {
  /**
   * El botón que abre el calendario. En `DatePicker` y `DateRangePicker` es el icono del extremo;
   * en `DatePickerInput` es el campo entero, que ahí es un botón y no un campo segmentado.
   */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * La superficie flotante del calendario, que es el envoltorio de motion y no pasa por `Box`: no
   * acepta style props. Su posición la calcula React Aria y se escribe después de la ranura; el
   * `style` que pases se compone con ella.
   */
  popoverProps?: OverlayMotionSlotProps | undefined;
  /**
   * Receta con la que se tinta el dia elegido del calendario. Es la misma que acepta `Calendar`:
   * sin ella el calendario del desplegable se quedaba clavado en `primary`, aunque el producto
   * tuviera otro acento.
   */
  variant?: CalendarVariant | undefined;
  /** Acento del dia elegido y del rango. Va con `variant`. */
  color?: ColorExtended | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  locale?: string | undefined;
  minValue?: string | undefined;
  maxValue?: string | undefined;
  placement?: PopoverPlacement | undefined;
  visibleMonths?: number | undefined;
  labels?: CalendarLabels | undefined;
  openLabel?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

export interface DatePickerProps extends DatePickerBaseProps, FormFieldSlotProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  granularity?: DateGranularity | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface DatePickerInputProps extends DatePickerBaseProps, FormFieldSlotProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  placeholder?: string | undefined;
  format?: Intl.DateTimeFormatOptions | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface DateRangePickerProps extends DatePickerBaseProps, FormFieldSlotProps {
  /** El guion que separa las dos fechas. Es decorativo: va con `aria-hidden`. */
  separatorProps?: BoxSlotProps | undefined;
  field?: NebulaField<DateRange> | undefined;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}
